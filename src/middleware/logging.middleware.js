const morgan = require('morgan');
const logger = require('../config/logger');

/**
 * Middleware para logging de peticiones HTTP
 * @returns {Function} Middleware de logging
 */
const loggingMiddleware = morgan('combined', {
  stream: { write: (message) => logger.info(message.trim()) },
});

module.exports = loggingMiddleware;
