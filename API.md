#  Documentation API

## Endpoints Backend (Port 3000)

### Authentification

#### POST `/login`
Connexion utilisateur

**Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Réponse:** Redirection vers `/dashboard`

---

#### GET `/logout`
Déconnexion utilisateur

**Réponse:** Redirection vers `/login`

---

### Données

#### GET `/api/history`
Récupère l'historique des données des bus

**Query Parameters:**
- `bus_id` (optionnel) : ID du bus (ex: "B12")
- `from` (optionnel) : Date de début (ISO 8601)
- `to` (optionnel) : Date de fin (ISO 8601)
- `limit` (optionnel) : Nombre max de résultats (défaut: 100)

**Exemple:**
```
GET /api/history?bus_id=B12&limit=50
```

**Réponse:**
```json
[
  {
    "_id": "...",
    "bus_id": "B12",
    "passengers": 15,
    "temperature": 22.5,
    "humidity": 65,
    "air": 350,
    "lat": 36.8,
    "lng": 10.1,
    "date": "2024-01-15T10:30:00.000Z"
  }
]
```

---

## Service de Prédiction (Port 5000)

### POST `/predict`
Génère une prédiction du nombre de passagers

**Body:**
```json
{
  "temperature": 25,
  "humidity": 60,
  "air": 300
}
```

**Réponse:**
```json
{
  "prediction": 15.5,
  "level": "Moyen",
  "color": "orange",
  "in_minutes": 5
}
```

**Champs de réponse:**
- `prediction` : Nombre estimé de passagers
- `level` : "Vide" | "Normal" | "Plein"
- `color` : "green" | "orange" | "red"
- `in_minutes` : Horizon de prédiction (toujours 5)

---

### GET `/status`
Vérifie le statut du service de prédiction

**Réponse:**
```json
{
  "trained": true,
  "records": 150
}
```

**Champs:**
- `trained` : Modèle entraîné (true/false)
- `records` : Nombre d'enregistrements dans la base

---

## WebSocket Events (Socket.IO)

### Événements reçus du serveur

#### `busData`
Données en temps réel d'un bus

**Payload:**
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

---

#### `trafficPrediction`
Prédiction du trafic pour un bus

**Payload:**
```json
{
  "bus_id": "B12",
  "prediction": 15.5,
  "level": "Moyen",
  "color": "orange",
  "recommendation": "Bus modérément chargé — places disponibles",
  "in_minutes": 5
}
```

---

## MQTT Topics

### Publication des bus
**Topic:** `bus/{bus_id}/data`

**Exemple:** `bus/B12/data`

**Payload:**
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

---

## Codes d'erreur

| Code | Description |
|------|-------------|
| 401 | Non authentifié |
| 500 | Erreur serveur |

---

## Rate Limiting

Aucune limite actuellement implémentée.

## CORS

CORS activé pour le service de prédiction Python.
