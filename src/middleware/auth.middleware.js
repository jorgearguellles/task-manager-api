const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const logger = require('../config/logger');

const auth = async (req, res, next) => {
  try {
    // Obtener el token del header
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'No token provided',
        message: 'Por favor inicie sesión para acceder a este recurso',
      });
    }

    const token = authHeader.replace('Bearer ', '');

    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar el usuario
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        error: 'User not found',
        message: 'El usuario asociado a este token no existe',
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        error: 'User inactive',
        message: 'Esta cuenta ha sido desactivada',
      });
    }

    // Añadir el usuario a la request
    req.user = user;
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expired',
        message: 'El token ha expirado',
      });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'Token inválido o expirado',
      });
    }
    res.status(500).json({
      error: 'Authentication failed',
      message: 'Error al autenticar la solicitud',
    });
  }
};

// Middleware para verificar roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'No tiene permiso para acceder a este recurso',
      });
    }
    next();
  };
};

module.exports = {
  auth,
  authorize,
};
