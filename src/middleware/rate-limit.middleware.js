const rateLimit = require('express-rate-limit');

/**
 * Middleware para limitar el número de peticiones por IP
 * @param {Object} options - Opciones de configuración
 * @param {number} options.windowMs - Ventana de tiempo en milisegundos
 * @param {number} options.max - Número máximo de peticiones por ventana
 * @returns {Function} Middleware de rate limiting
 */
const rateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // máximo 100 requests por ventana
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = rateLimiter;
