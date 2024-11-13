const express = require('express');
const fs = require('fs');
const yaml = require('js-yaml');
const swaggerUi = require('swagger-ui-express');
const dotenv = require('dotenv');
const connectDB = require('./bin/db');
const routes = require('./routes');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use('/api', routes);

// Analyse le document OpenAPI.
const openApiDocument = yaml.load(fs.readFileSync('./openapi.yml'));
// Sert la documentation Swagger UI.
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));

// Pour du test :
// app.get('/', (req, res) => {
//     res.send('Bienvenue sur l\'API sMatch !');
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
