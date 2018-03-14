var express = require('express');
var swaggerUi = require('swagger-ui-express');
var swaggerJSDoc = require('swagger-jsdoc')

var docRoutes = express.Router()

//Swagger definition
var swaggerSpec = swaggerJSDoc({
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
    ], 
})

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