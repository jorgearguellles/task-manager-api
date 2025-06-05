const logger = require('../config/logger');

/**
 * Middleware para manejar rutas no encontradas
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
const notFoundMiddleware = (req, res) => {
  logger.warn(`Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    error: 'Route not found',
    message: `The route ${req.method} ${req.originalUrl} does not exist.`,
  });
};

module.exports = notFoundMiddleware;
