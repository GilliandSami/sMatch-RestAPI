const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./bin/db');
const routes = require('./routes');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use('/api', routes);

// Pour du test :
// app.get('/', (req, res) => {
//     res.send('Bienvenue sur l\'API sMatch !');
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));