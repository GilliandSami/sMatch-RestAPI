const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('../bin/db.js');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

connectDB();

// Route de base pour tester la connexion
app.get('/', (req, res) => {
    res.send('API is running and connected to MongoDB');
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});