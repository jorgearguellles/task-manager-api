const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const User = require('../../models/user.model');
const jwt = require('jsonwebtoken');

describe('Auth Middleware', () => {
  let authToken;
  let testUser;

  beforeEach(async () => {
    await User.deleteMany({});

    // Crear usuario de prueba y obtener token
    testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });

    const loginResponse = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'password123',
    });

    authToken = loginResponse.body.token;
  });

  describe('Protected Routes', () => {
    it('should allow access with valid token', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).not.toBe(401);
    });

    it('should deny access without token', async () => {
      const response = await request(app).get('/api/tasks');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'No token provided');
    });

    it('should deny access with invalid token', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Invalid token');
    });

    it('should deny access with expired token', async () => {
      // Generar un token expirado con la clave secreta de pruebas
      const expiredToken = jwt.sign(
        { id: testUser._id, role: 'user' },
        process.env.JWT_SECRET,
        { expiresIn: -10 } // Expirado hace 10 segundos
      );

      const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${expiredToken}`);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Token expired');
    });
  });
});
