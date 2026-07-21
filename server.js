const express = require("express");
const mqtt = require("mqtt");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const session = require("express-session");
const bcrypt = require("bcrypt");
const axios = require("axios");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== SESSION =====
app.use(session({
  secret: "secret123",
  resave: false,
  saveUninitialized: false
}));

// ===== MONGODB =====
mongoose.connect("mongodb://127.0.0.1:27017/busDB")
  .then(() => console.log("✅ MongoDB connecté"))
  .catch(err => console.log("❌ MongoDB erreur:", err));

// ===== SCHEMA =====
const BusSchema = new mongoose.Schema({
  bus_id: String,
  passengers: Number,
  temperature: Number,
  humidity: Number,
  air: Number,
  lat: Number,
  lng: Number,
  date: { type: Date, default: Date.now }
});

const Bus = mongoose.model("Bus", BusSchema);

// ===== USER =====
const users = [
  {
    username: "admin",
    password: "$2b$10$S/NROvULGW/n7w3SWrk4HuMorIRlXDX6F0YXNUkC.AsomXKxjPW6G"
  }
];

// ===== AUTH =====
function isAuth(req, res, next) {
  if (req.session.user) return next();
  res.redirect("/login");
}

// ===== ROUTES =====
app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/public/login.html");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username);
  if (!user) return res.status(401).send("Invalid credentials");

  const match = await bcrypt.compare(password, user.password);

  if (match) {
    req.session.user = username;
    return res.redirect("/dashboard");
  } else {
    return res.status(401).send("Wrong password");
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

app.get("/dashboard", isAuth, (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/", (req, res) => {
  res.redirect("/dashboard");
});

// ===== API HISTORY =====
app.get("/api/history", isAuth, async (req, res) => {
  try {
    const { bus_id, from, to, limit = 100 } = req.query;
    const filter = {};
    if (bus_id) filter.bus_id = bus_id;
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to)   filter.date.$lte = new Date(to);
    }
    const data = await Bus.find(filter).sort({ date: -1 }).limit(parseInt(limit));
    res.json(data);
  } catch(err) {
    console.error("❌ /api/history error:", err);
    res.status(500).json([]);
  }
});

app.use(express.static("public"));

// ===== MQTT =====
const client = mqtt.connect("mqtt://broker.hivemq.com");

client.on("connect", () => {
  console.log("✅ MQTT connecté");
  client.subscribe("bus/+/data"); // tous les bus
});

client.on("message", async (_topic, message) => {
  try {
    const data = JSON.parse(message.toString());
    console.log("📡 MQTT:", data);
    const newData = new Bus(data);
    await newData.save();
    io.emit("busData", data);
    const prediction = await predictTraffic(data);
    if (prediction) io.emit("trafficPrediction", buildPredictionPayload(data.bus_id, prediction));
  } catch (err) {
    console.error("❌ MQTT error:", err);
  }
});

// ===== TRAFFIC PREDICTION =====
async function predictTraffic(data) {
  try {
    const res = await axios.post("http://localhost:5000/predict", {
      temperature: data.temperature,
      humidity:    data.humidity,
      air:         data.air
    });
    return res.data;
  } catch (err) {
    return null;
  }
}

// ===== TRAFFIC CLASSIFICATION =====
function classifyTraffic(passengers) {
  if (passengers <= 10) return { level: "Faible",  color: "green"  };
  if (passengers <= 20) return { level: "Moyen",   color: "orange" };
  return                       { level: "Élevé",   color: "red"    };
}

function getRecommendation(level) {
  if (level === "Faible") return "✅ Bus recommandé — montez sans hésiter";
  if (level === "Moyen")  return "⚠️ Bus modérément chargé — places disponibles";
  return                         "❌ Bus non recommandé — attendez le prochain";
}

function buildPredictionPayload(bus_id, predictionResult) {
  const passengers = predictionResult.prediction ?? 0;
  const traffic    = classifyTraffic(passengers);
  return {
    bus_id,
    prediction:     passengers,
    level:          traffic.level,
    color:          traffic.color,
    recommendation: getRecommendation(traffic.level),
    in_minutes:     5
  };
}

// ===== SIMULATION MULTI-BUS =====
const busList = ["B12", "B13", "B14"];
const busPositions = {
  B12: { lat: 36.80, lng: 10.10 },
  B13: { lat: 36.82, lng: 10.13 },
  B14: { lat: 36.79, lng: 10.11 }
};

setInterval(async () => {
  const bus_id = busList[Math.floor(Math.random() * busList.length)];
  const base   = busPositions[bus_id];

  const fakeData = {
    bus_id,
    passengers:  Math.floor(Math.random() * 30),
    temperature: 20 + Math.random() * 10,
    humidity:    50 + Math.random() * 20,
    air:         200 + Math.random() * 400,
    lat:         base.lat + (Math.random() * 0.02),
    lng:         base.lng + (Math.random() * 0.02)
  };

  console.log("🧪 Fake:", fakeData);

  const newData = new Bus(fakeData);
  await newData.save();

  io.emit("busData", fakeData);

  const prediction = await predictTraffic(fakeData);
  console.log("📊 Prediction:", prediction);
  if (prediction) io.emit("trafficPrediction", buildPredictionPayload(bus_id, prediction));

}, 3000);

// ===== SOCKET =====
io.on("connection", () => {
  console.log("🟢 Client connecté");
});

// ===== SERVER =====
server.listen(3000, () => {
  console.log("🚀 http://localhost:3000");
});