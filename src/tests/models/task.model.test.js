/*
const mongoose = require('mongoose');
const Task = require('../../models/task.model');
const User = require('../../models/user.model');

describe('Task Model', () => {
  let testUser;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
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

  it('should create a task with required fields', async () => {
    const taskData = {
      title: 'Test Task',
      description: 'Test Description',
      priority: 'high',
      dueDate: new Date('2024-12-31'),
      assignedTo: testUser._id,
      createdBy: testUser._id,
      category: 'work',
    };

    const task = await Task.create(taskData);

    expect(task.title).toBe(taskData.title);
    expect(task.description).toBe(taskData.description);
    expect(task.priority).toBe(taskData.priority);
    expect(task.status).toBe('pending'); // Valor por defecto
    expect(task.isCompleted).toBe(false); // Valor por defecto
  });

  it('should not create a task without required fields', async () => {
    const taskData = {
      title: 'Test Task',
      // Falta description, priority, etc.
    };

    try {
      await Task.create(taskData);
      fail('Should not create task without required fields');
    } catch (error) {
      expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
    }
  });

  it('should validate priority enum values', async () => {
    const taskData = {
      title: 'Test Task',
      description: 'Test Description',
      priority: 'invalid-priority',
      dueDate: new Date('2024-12-31'),
      assignedTo: testUser._id,
      createdBy: testUser._id,
    };

    try {
      await Task.create(taskData);
      fail('Should not create task with invalid priority');
    } catch (error) {
      expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
    }
  });

  it('should update task status and completion date', async () => {
    const task = await Task.create({
      title: 'Test Task',
      description: 'Test Description',
      priority: 'high',
      dueDate: new Date('2024-12-31'),
      assignedTo: testUser._id,
      createdBy: testUser._id,
    });

    task.status = 'completed';
    await task.save();

    expect(task.status).toBe('completed');
    expect(task.isCompleted).toBe(true);
    expect(task.completedAt).toBeDefined();
  });

  it('should add and remove tags', async () => {
    const task = await Task.create({
      title: 'Test Task',
      description: 'Test Description',
      priority: 'high',
      dueDate: new Date('2024-12-31'),
      assignedTo: testUser._id,
      createdBy: testUser._id,
      tags: ['tag1', 'tag2'],
    });

    task.tags.push('tag3');
    await task.save();

    expect(task.tags).toContain('tag3');
    expect(task.tags.length).toBe(3);

    task.tags = task.tags.filter((tag) => tag !== 'tag2');
    await task.save();

    expect(task.tags).not.toContain('tag2');
    expect(task.tags.length).toBe(2);
  });
});
*/
