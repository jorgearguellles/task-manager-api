const winston = require('winston');
const path = require('path');

// Configuración de niveles de log
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

// Formato personalizado
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Transportes (dónde se guardan los logs)
const transports = [
  // Console para desarrollo
  new winston.transports.Console({ format }),

  // Archivo para todos los logs
  new winston.transports.File({
    filename: path.join(__dirname, '../../logs/app.log'),
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
  }),

  // Archivo separado para errores
  new winston.transports.File({
    filename: path.join(__dirname, '../../logs/error.log'),
    level: 'error',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
  }),
];

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
  levels,
  format,
  transports,
});

module.exports = logger;
