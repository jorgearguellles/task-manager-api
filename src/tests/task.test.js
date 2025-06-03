const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/user.model');
const Task = require('../models/task.model');

describe('Task Controller', () => {
  let authToken;
  let testUser;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
  });

  beforeEach(async () => {
    await Task.deleteMany({});
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

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        priority: 'high',
        dueDate: '2024-12-31',
        assignedTo: testUser._id,
        category: 'work',
        tags: ['test', 'api'],
      };

      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(taskData);

      expect(response.status).toBe(201);
      expect(response.body.task).toHaveProperty('title', taskData.title);
      expect(response.body.task).toHaveProperty('status', 'pending');
    });

    it('should not create a task without required fields', async () => {
      const taskData = {
        title: 'Test Task',
        // Falta description, priority, etc.
      };

      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(taskData);

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/tasks', () => {
    beforeEach(async () => {
      await Task.create([
        {
          title: 'Task 1',
          description: 'Description 1',
          priority: 'high',
          dueDate: '2024-12-31',
          assignedTo: testUser._id,
          createdBy: testUser._id,
          category: 'work',
        },
        {
          title: 'Task 2',
          description: 'Description 2',
          priority: 'medium',
          dueDate: '2024-12-31',
          assignedTo: testUser._id,
          createdBy: testUser._id,
          category: 'personal',
        },
      ]);
    });

    it('should get all tasks', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.tasks)).toBe(true);
      expect(response.body.tasks.length).toBe(2);
    });

    it('should filter tasks by priority', async () => {
      const response = await request(app)
        .get('/api/tasks?priority=high')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.tasks.length).toBe(1);
      expect(response.body.tasks[0].priority).toBe('high');
    });
  });

  describe('PATCH /api/tasks/:id/status', () => {
    let testTask;

    beforeEach(async () => {
      testTask = await Task.create({
        title: 'Test Task',
        description: 'Test Description',
        priority: 'high',
        dueDate: '2024-12-31',
        assignedTo: testUser._id,
        createdBy: testUser._id,
        category: 'work',
      });
    });

    it('should update task status', async () => {
      const response = await request(app)
        .patch(`/api/tasks/${testTask._id}/status`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'in-progress' });

      expect(response.status).toBe(200);
      expect(response.body.task.status).toBe('in-progress');
    });

    it('should not update status with invalid value', async () => {
      const response = await request(app)
        .patch(`/api/tasks/${testTask._id}/status`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'invalid-status' });

      expect(response.status).toBe(400);
    });
  });
});
