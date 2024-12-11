const express = require('express');
const fs = require('fs');
const dotenv = require('dotenv');
const connectDB = require('./bin/db');
const routes = require('./routes');

const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use('/api', routes);

const openApiDocument = YAML.load('./swagger.yaml');
app.use('/', swaggerUi.serve, swaggerUi.setup(openApiDocument));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));

module.exports = app;