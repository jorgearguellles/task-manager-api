const User = require('../models/user.model');
const logger = require('../config/logger');

// Registrar nuevo usuario
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        error: 'Email already exists',
        message: 'Este email ya está registrado',
      });
    }

    // Crear nuevo usuario
    const user = new User({
      name,
      email,
      password,
    });

    await user.save();

    // Generar token
    const token = user.generateAuthToken();

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: user.toPublicJSON(),
      token,
    });
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({
      error: 'Registration failed',
      message: 'Error al registrar el usuario',
    });
  }
};

// Login de usuario
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario y incluir password para comparación
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email o contraseña incorrectos',
      });
    }

    // Verificar si el usuario está activo
    if (!user.isActive) {
      return res.status(401).json({
        error: 'Account inactive',
        message: 'Esta cuenta ha sido desactivada',
      });
    }

    // Verificar contraseña
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email o contraseña incorrectos',
      });
    }

    // Actualizar último login
    user.lastLogin = new Date();
    await user.save();

    // Generar token
    const token = user.generateAuthToken();

    res.json({
      message: 'Login exitoso',
      user: user.toPublicJSON(),
      token,
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed',
      message: 'Error al iniciar sesión',
    });
  }
};

// Obtener perfil del usuario actual
const getProfile = async (req, res) => {
  try {
    res.json({
      user: req.user.toPublicJSON(),
    });
  } catch (error) {
    logger.error('Get profile error:', error);
    res.status(500).json({
      error: 'Get profile failed',
      message: 'Error al obtener el perfil',
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
};
