const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const docRoutes = express.Router();

// Swagger definition
// Swagger definition
const swaggerSpec = swaggerJSDoc({
  swaggerDefinition: {
    info: {
      title: 'RomManagerAPI',
      description: 'Backend API for RetroEmulator TFG',
      version: '1.0.0',
      basePath: '/'
    },
  },
  apis: [
    './routes/sessionRoutes.js',
    './routes/userRoutes.js',
    './routes/romRoutes.js',
    './routes/scrapperRoutes.js',
  ]
});

docRoutes.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


module.exports = docRoutes;
