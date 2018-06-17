const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const docRoutes = express.Router();

// Swagger definition
const swaggerSpec = swaggerJSDoc({
  swaggerDefinition: {
    info: {
      title: 'RomManagerAPI',
      version: '1.0.0',
      basePath: '/'
    },
  },
  apis: [
    './docRoutes.js',
    './userRoutes.js'
  ]
});

/**
 * @swagger
 * tags:
 *  name: Docs
 *  description: Several general operations
 * /api-docs:
 *   get:
 *     tags: [Docs]
 *     description: Returns the swagger doc of the API
 *     responses:
 *       200:
 *         description: swagger doc
 */
docRoutes.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


module.exports = docRoutes;
