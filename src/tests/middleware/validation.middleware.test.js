/*
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');

describe('Validation Middleware', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
  });

  describe('Task Validation', () => {
    it('should validate required fields for task creation', async () => {
      const response = await request(app).post('/api/tasks').send({
        title: 'Test Task',
        // Falta description, priority, etc.
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors).toContainEqual(
        expect.objectContaining({
          msg: 'Description is required',
        })
      );
    });

    it('should validate priority enum values', async () => {
      const response = await request(app).post('/api/tasks').send({
        title: 'Test Task',
        description: 'Test Description',
        priority: 'invalid-priority',
        dueDate: '2024-12-31',
      });

      expect(response.status).toBe(400);
      expect(response.body.errors).toContainEqual(
        expect.objectContaining({
          msg: 'Priority must be one of: low, medium, high',
        })
      );
    });

    it('should validate date format', async () => {
      const response = await request(app).post('/api/tasks').send({
        title: 'Test Task',
        description: 'Test Description',
        priority: 'high',
        dueDate: 'invalid-date',
      });

      expect(response.status).toBe(400);
      expect(response.body.errors).toContainEqual(
        expect.objectContaining({
          msg: 'Invalid date format',
        })
      );
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
      expect(response.body.errors).toContainEqual(
        expect.objectContaining({
          msg: 'Invalid email format',
        })
      );
    });

    it('should validate password length', async () => {
      const response = await request(app).post('/api/auth/register').send({
        name: 'Test User',
        email: 'test@example.com',
        password: '123', // Too short
      });

      expect(response.status).toBe(400);
      expect(response.body.errors).toContainEqual(
        expect.objectContaining({
          msg: 'Password must be at least 6 characters long',
        })
      );
    });
  });
});
*/
