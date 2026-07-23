# Smart Bus Dashboard

Real-time intelligent dashboard for public transportation bus tracking and management.

## Features

- **Real-time Tracking** : Live data visualization (passengers, temperature, humidity, air quality)
- **Geolocation** : Interactive map showing bus positions
- **Traffic Prediction** : Passenger count prediction system based on historical data analysis
- **History** : Historical data consultation and CSV export
- **Multi-language** : FR, EN, AR, ES support
- **Accessibility** : Special mode for visually impaired users with voice synthesis
- **Tourist Mode** : Practical guide for visitors

## Technologies

### Backend
- **Node.js** with Express
- **MongoDB** for data storage
- **MQTT** for real-time communication
- **Socket.IO** for live updates
- **Python Flask** for prediction service
- **scikit-learn** for predictive analysis

### Frontend
- **HTML5 / CSS3**
- **Vanilla JavaScript**
- **Chart.js** for charts
- **Leaflet.js** for mapping

## Installation

### Prerequisites
- Node.js (v14+)
- MongoDB (v4.4+)
- Python (v3.8+)

### Steps

1. **Clone the repository**
```bash
git clone github.com/chada-douzi/smart-bus-dashboard
cd dashboard-bus
```

2. **Install Node.js dependencies**
```bash
npm install
```

3. **Install Python dependencies**
```bash
pip install flask flask-cors numpy scikit-learn pymongo
```

4. **Start MongoDB**
```bash
mongod
```

5. **Start the prediction service**
```bash
python prediction_service.py
```

6. **Start the main server**
```bash
node server.js
```

7. **Access the application**
```
http://localhost:3000
```

## Authentication

**Default credentials:**
- Username: `admin`
- Password: `admin123`

## Architecture

```
dashboard-bus/
├── server.js              # Main Express server
├── prediction_service.py  # Python prediction service
├── Public/
│   ├── index.html        # Main dashboard
│   └── login.html        # Login page
├── generateHash.js       # Password generation utility
└── package.json
```

## Usage

### MQTT Connection
The system connects to a public MQTT broker to receive bus data:
```javascript
mqtt://broker.hivemq.com
Topic: bus/+/data
```

### Data Format
```json
{
  "bus_id": "B12",
  "passengers": 15,
  "temperature": 22.5,
  "humidity": 65,
  "air": 350,
  "lat": 36.8,
  "lng": 10.1
}
```

## Configuration

### Change admin password
```bash
node generateHash.js
```

### Modify database connection
Edit the MongoDB connection in `server.js`:
```javascript
mongoose.connect("mongodb://127.0.0.1:27017/busDB")
```

## API Endpoints

### `GET /api/history`
Retrieve historical data
- Query params: `bus_id`, `from`, `to`, `limit`

### `POST /predict`
Prediction service (port 5000)
```json
{
  "temperature": 25,
  "humidity": 60,
  "air": 300
}
```

## Predictions

The system uses a Random Forest model to predict passenger count based on:
- Hour and minute
- Temperature
- Humidity
- Air quality
- Historical data

## Display Modes

- **Normal Mode** : Standard interface
- **Visually Impaired Mode** : Enlarged text, high contrast, voice synthesis
- **Tourist Mode** : Practical guide included

## Responsive

The dashboard is fully responsive and works on all devices.

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

## License

MIT

## Author

Built with to improve public transportation experience.
