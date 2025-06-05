const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('../config/swagger');

/**
 * Middleware para la documentación Swagger
 * @returns {Array} Array de middlewares de Swagger
 */
const swaggerMiddleware = [swaggerUi.serve, swaggerUi.setup(swaggerSpecs)];

module.exports = swaggerMiddleware;
