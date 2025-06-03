const mongoose = require('mongoose');
const Task = require('../../models/task.model');
const User = require('../../models/user.model');

describe('Task Model', () => {
  let testUser;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_TEST_URI);
  });

  beforeEach(async () => {
    await Task.deleteMany({});
    await User.deleteMany({});

    testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('Task Creation', () => {
    it('should create a task with required fields', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        priority: 'medium',
        status: 'pending',
        dueDate: new Date(),
        createdBy: testUser._id,
        assignedTo: testUser._id,
      };

      const task = await Task.create(taskData);
      expect(task.title).toBe(taskData.title);
      expect(task.description).toBe(taskData.description);
      expect(task.priority).toBe(taskData.priority);
      expect(task.status).toBe(taskData.status);
      expect(task.dueDate).toEqual(taskData.dueDate);
      expect(task.createdBy).toEqual(taskData.createdBy);
      expect(task.assignedTo).toEqual(taskData.assignedTo);
    });

    it('should not create a task without required fields', async () => {
      const taskData = {
        // Falta title, description, createdBy, assignedTo y dueDate
        priority: 'medium',
        status: 'pending',
      };

      await expect(Task.create(taskData)).rejects.toThrow();
    });
  });

  describe('Task Priority', () => {
    it('should only allow valid priority values', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        priority: 'invalid-priority',
        status: 'pending',
        dueDate: new Date(),
        createdBy: testUser._id,
        assignedTo: testUser._id,
      };

      await expect(Task.create(taskData)).rejects.toThrow();
    });
  });

  describe('Task Status and Completion', () => {
    it('should update task status correctly', async () => {
      const task = await Task.create({
        title: 'Test Task',
        description: 'Test Description',
        priority: 'medium',
        status: 'pending',
        dueDate: new Date(),
        createdBy: testUser._id,
        assignedTo: testUser._id,
      });

      task.status = 'completed';
      await task.save();

      expect(task.status).toBe('completed');
      expect(task.completedAt).toBeUndefined();
    });
  });

  describe('Task Tags', () => {
    it('should handle task tags correctly', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        priority: 'medium',
        status: 'pending',
        dueDate: new Date(),
        createdBy: testUser._id,
        assignedTo: testUser._id,
        tags: ['work', 'urgent'],
      };

      const task = await Task.create(taskData);
      expect(task.tags).toHaveLength(2);
      expect(task.tags).toContain('work');
      expect(task.tags).toContain('urgent');
    });
  });
});
