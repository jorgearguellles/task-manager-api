/**
 * @fileoverview Exporta todos los middlewares de la aplicación
 */

const { errorHandler } = require('./error.middleware');
const { auth, checkRole } = require('./auth.middleware');
const validateRequest = require('./validation.middleware');
const rateLimiter = require('./rate-limit.middleware');
const loggingMiddleware = require('./logging.middleware');
const notFoundMiddleware = require('./not-found.middleware');
const swaggerMiddleware = require('./swagger.middleware');

module.exports = {
  errorHandler,
  auth,
  checkRole,
  validateRequest,
  rateLimiter,
  loggingMiddleware,
  notFoundMiddleware,
  swaggerMiddleware,
};
