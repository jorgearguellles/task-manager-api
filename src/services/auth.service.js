const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { AppError } = require('../utils/error');

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    }
  );
};

const register = async (userData) => {
  try {
    const { email, password, name } = userData;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('El email ya está registrado', 409);
    }

    // Crear nuevo usuario
    const user = new User({
      name,
      email,
      password,
    });

    await user.save();

    // Generar token
    const token = generateToken(user);

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  } catch (error) {
    throw error;
  }
};

const login = async (credentials) => {
  try {
    const { email, password } = credentials;

    // Buscar usuario y seleccionar el campo password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new AppError('Credenciales inválidas', 401);
    }

    // Verificar contraseña usando el método del modelo
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AppError('Credenciales inválidas', 401);
    }

    // Actualizar último acceso
    await user.updateLastLogin();

    // Generar token
    const token = generateToken(user);

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  } catch (error) {
    throw error;
  }
};

const getProfile = async (userId) => {
  try {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new AppError('Usuario no encontrado', 404);
    }
    return user;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  register,
  login,
  getProfile,
};
