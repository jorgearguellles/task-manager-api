const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getProfile,
} = require('../controllers/auth.controller');
const { auth } = require('../middleware/auth.middleware');

// Rutas públicas
router.post('/register', register);
router.post('/login', login);

// Rutas protegidas
router.get('/profile', auth, getProfile);

module.exports = router;
