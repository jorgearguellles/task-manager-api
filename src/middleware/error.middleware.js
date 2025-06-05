const logger = require('../config/logger');

const errorHandler = (err, req, res, next) => {
  logger.error('Error:', err);

  // Error de validación de Mongoose
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((error) => error.message);
    return res.status(400).json({
      error: 'Validation Error',
      messages: errors,
    });
  }

  // Error de duplicado de Mongoose
  if (err.code === 11000) {
    return res.status(400).json({
      error: 'Duplicate Error',
      message: 'Ya existe un registro con este valor',
    });
  }

  // Error de Cast de Mongoose
  if (err.name === 'CastError') {
    return res.status(400).json({
      error: 'Invalid ID',
      message: 'El ID proporcionado no es válido',
    });
  }

  // Error personalizado de la aplicación
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      error: err.status,
      message: err.message,
    });
  }

  // Error no manejado
  res.status(500).json({
    error: 'Internal Server Error',
    message:
      process.env.NODE_ENV === 'development'
        ? err.message
        : 'Error interno del servidor',
  });
};

module.exports = { errorHandler };
