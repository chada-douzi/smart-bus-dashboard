from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from pymongo import MongoClient
import datetime

app = Flask(__name__)
CORS(app)

# ===== CONNEXION MONGODB =====
client = MongoClient("mongodb://127.0.0.1:27017/")
db = client["busDB"]
collection = db["buses"]

model = None
is_trained = False

# ===== ENTRAINEMENT DU MODELE =====
def train_model():
    global model, is_trained

    records = list(collection.find({}, {"passengers": 1, "temperature": 1, "humidity": 1, "air": 1, "date": 1}))

    if len(records) < 10:
        print(f" Pas assez de données ({len(records)} entrées). Minimum 10 requis.")
        is_trained = False
        return

    X, y = [], []
    for r in records:
        try:
            hour       = r["date"].hour
            minute     = r["date"].minute
            temp       = float(r["temperature"])
            hum        = float(r["humidity"])
            air        = float(r["air"])
            passengers = float(r["passengers"])
            X.append([hour, minute, temp, hum, air])
            y.append(passengers)
        except Exception:
            continue

    if len(X) < 10:
        is_trained = False
        return

    model = RandomForestRegressor(n_estimators=50, random_state=42)
    model.fit(np.array(X), np.array(y))
    is_trained = True
    print(f"Modèle entraîné sur {len(X)} entrées.")

# ===== ROUTE : PREDICTION =====
@app.route("/predict", methods=["POST"])
def predict():
    train_model()

    if not is_trained:
        return jsonify({"error": "Pas assez de données", "prediction": None}), 200

    data = request.json
    try:
        future = datetime.datetime.now() + datetime.timedelta(minutes=5)
        features = np.array([[
            future.hour,
            future.minute,
            float(data.get("temperature", 25)),
            float(data.get("humidity", 60)),
            float(data.get("air", 300))
        ]])

        prediction = max(0, round(float(model.predict(features)[0]), 1))

        if prediction < 10:
            level, color = "Vide", "green"
        elif prediction < 20:
            level, color = "Normal", "orange"
        else:
            level, color = "Plein", "red"

        return jsonify({"prediction": prediction, "level": level, "color": color, "in_minutes": 5})

    except Exception as e:
        return jsonify({"error": str(e), "prediction": None}), 500

# ===== ROUTE : STATUS =====
@app.route("/status", methods=["GET"])
def status():
    count = collection.count_documents({})
    return jsonify({"trained": is_trained, "records": count})

# ===== INIT =====
print(" Service de prédiction démarrage...")
train_model()

if __name__ == "__main__":
    app.run(port=5000, debug=False)
