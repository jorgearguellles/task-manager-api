const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getProfile,
} = require('../controllers/auth.controller');
const { auth } = require('../middleware/auth.middleware');
const {
  registerValidator,
  loginValidator,
} = require('../validators/auth.validator');
const validateRequest = require('../middleware/validation.middleware');

// Rutas públicas
router.post('/register', registerValidator, validateRequest, register);
router.post('/login', loginValidator, validateRequest, login);

// Rutas protegidas
router.get('/profile', auth, getProfile);

module.exports = router;
