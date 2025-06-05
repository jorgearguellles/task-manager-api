const authService = require('../services/auth.service');
const logger = require('../config/logger');

// Registrar nuevo usuario
const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

// Login de usuario
const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// Obtener perfil del usuario actual
const getProfile = async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.user.id);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// Logout de usuario
const logout = async (req, res) => {
  res.status(200).json({ message: 'Sesión cerrada exitosamente' });
};

module.exports = {
  register,
  login,
  getProfile,
  logout,
};
