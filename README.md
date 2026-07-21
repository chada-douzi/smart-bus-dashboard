#  Smart Bus Dashboard

Tableau de bord intelligent en temps réel pour le suivi et la gestion des bus de transport public.

## Fonctionnalités

- **Suivi en temps réel** : Visualisation des données en direct (passagers, température, humidité, qualité de l'air)
- **Géolocalisation** : Carte interactive montrant la position des bus
- **Prédiction du trafic** : Système de prédiction du nombre de passagers basé sur l'analyse de données historiques
- **Historique** : Consultation et export des données historiques
- **Multi-langue** : Support FR, EN, AR, ES
- **Accessibilité** : Mode spécial pour personnes malvoyantes avec synthèse vocale
- **Mode touriste** : Guide pratique pour les visiteurs

##  Technologies

### Backend
- **Node.js** avec Express
- **MongoDB** pour le stockage des données
- **MQTT** pour la communication en temps réel
- **Socket.IO** pour les mises à jour en direct
- **Python Flask** pour le service de prédiction
- **scikit-learn** pour l'analyse prédictive

### Frontend
- **HTML5 / CSS3**
- **Vanilla JavaScript**
- **Chart.js** pour les graphiques
- **Leaflet.js** pour la cartographie

##  Installation

### Prérequis
- Node.js (v14+)
- MongoDB (v4.4+)
- Python (v3.8+)

### Étapes

1. **Cloner le dépôt**
bash
git clone https://github.com/votre-username/dashboard-bus.git
cd dashboard-bus


2. **Installer les dépendances Node.js**
bash
npm install
```

3. **Installer les dépendances Python**
bash
pip install flask flask-cors numpy scikit-learn pymongo


4. **Démarrer MongoDB**
bash
mongod


5. **Démarrer le service de prédiction**
bash
python prediction_service.py


6. **Démarrer le serveur principal**
bash
node server.js


7. **Accéder à l'application**

http://localhost:3000


##  Authentification

**Identifiants par défaut :**
- Username : `admin`
- Password : `admin123`

##  Architecture


dashboard-bus/
├── server.js              # Serveur Express principal
├── prediction_service.py  # Service de prédiction Python
├── Public/
│   ├── index.html        # Dashboard principal
│   └── login.html        # Page de connexion
├── generateHash.js       # Utilitaire pour générer des mots de passe
└── package.json
```

##  Utilisation

### Connexion MQTT
Le système se connecte à un broker MQTT public pour recevoir les données des bus :
```javascript
mqtt://broker.hivemq.com
Topic: bus/+/data


### Format des données
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


## 🔧 Configuration

### Changer le mot de passe admin
bash
node generateHash.js


### Modifier la base de données
Éditez la connexion MongoDB dans `server.js` :
javascript
mongoose.connect("mongodb://127.0.0.1:27017/busDB")


## 🌐 API Endpoints

### `GET /api/history`
Récupère l'historique des données
- Query params : `bus_id`, `from`, `to`, `limit`

### `POST /predict`
Service de prédiction (port 5000)
json
{
  "temperature": 25,
  "humidity": 60,
  "air": 300
}
```

##  Prédictions

Le système utilise un modèle Random Forest pour prédire le nombre de passagers basé sur :
- Heure et minute
- Température
- Humidité
- Qualité de l'air
- Données historiques

##  Modes d'affichage

- **Mode Normal** : Interface standard
- **Mode Malvoyant** : Texte agrandi, contraste élevé, synthèse vocale
- **Mode Touriste** : Guide pratique inclus

##  Responsive

Le dashboard est entièrement responsive et fonctionne sur tous les appareils.

##  Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou soumettre une pull request.

##  Licence

MIT

##  Auteur

Développé  pour améliorer l'expérience des transports publics.
