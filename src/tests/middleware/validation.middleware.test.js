const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const User = require('../../models/user.model');

describe('Validation Middleware', () => {
  let authToken;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_TEST_URI);
  });

  beforeEach(async () => {
    // Crear usuario de prueba y obtener token
    await User.create({
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

  describe('Task Validation', () => {
    it('should validate required fields for task creation', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Task',
          // Falta description, priority, etc.
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Validation Error');
    });

    it('should validate priority enum values', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Task',
          description: 'Test Description',
          priority: 'invalid-priority',
          dueDate: '2024-12-31',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Validation Error');
    });

    it('should validate date format', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Task',
          description: 'Test Description',
          priority: 'high',
          dueDate: 'invalid-date',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Validation Error');
    });
  });

  describe('User Validation', () => {
    it('should validate email format', async () => {
      const response = await request(app).post('/api/auth/register').send({
        name: 'Test User',
        email: 'invalid-email',
        password: 'password123',
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Validation Error');
    });

    it('should validate password length', async () => {
      const response = await request(app).post('/api/auth/register').send({
        name: 'Test User',
        email: 'test@example.com',
        password: '123', // Too short
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Validation Error');
    });
  });
});
