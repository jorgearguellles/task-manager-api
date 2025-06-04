const {
  createTask,
  updateTask,
  deleteTask,
  getTasks,
} = require('../../controllers/task.controller');
const Task = require('../../models/task.model');
const User = require('../../models/user.model');

jest.mock('../../models/task.model');
jest.mock('../../models/user.model');

describe('Task Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        title: 'Test Task',
        description: 'Test Description',
        priority: 'medium',
        status: 'pending',
        dueDate: new Date(),
        category: 'work',
        tags: ['test'],
      },
      params: { id: '123' },
      user: { _id: '123', role: 'user' },
      query: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('createTask', () => {
    it('should create a task', async () => {
      const mockTask = {
        _id: '123',
        ...req.body,
        createdBy: req.user._id,
      };
      const mockTaskInstance = {
        ...mockTask,
        save: jest.fn().mockResolvedValue(mockTask),
      };
      Task.mockImplementation(() => mockTaskInstance);

      await createTask(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Tarea creada exitosamente',
        task: expect.objectContaining({
          _id: '123',
          title: req.body.title,
          description: req.body.description,
          priority: req.body.priority,
          status: req.body.status,
          dueDate: req.body.dueDate,
          category: req.body.category,
          tags: req.body.tags,
          createdBy: req.user._id,
        }),
      });
    });

    it('should handle task creation errors', async () => {
      const error = new Error('Task creation failed');
      const mockTaskInstance = {
        save: jest.fn().mockRejectedValue(error),
      };
      Task.mockImplementation(() => mockTaskInstance);

      await createTask(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Error creating task',
        message: error.message,
      });
    });
  });

  describe('updateTask', () => {
    it('should handle task not found', async () => {
      Task.findById = jest.fn().mockResolvedValue(null);

      await updateTask(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Task not found',
        message: 'La tarea no existe',
      });
    });

    it('should handle task update errors', async () => {
      const mockTask = {
        _id: '123',
        ...req.body,
        createdBy: req.user._id,
        toString: () => req.user._id,
      };
      Task.findById = jest.fn().mockResolvedValue(mockTask);
      Task.findByIdAndUpdate = jest.fn().mockReturnValue({
        populate: jest.fn().mockImplementation(async () => {
          throw new Error('Update failed');
        }),
      });

      await updateTask(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Error updating task',
        message: 'Update failed',
      });
    });
  });

  describe('deleteTask', () => {
    it('should handle task not found', async () => {
      Task.findById = jest.fn().mockResolvedValue(null);

      await deleteTask(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Task not found',
        message: 'La tarea no existe',
      });
    });

    it('should handle task deletion errors', async () => {
      const mockTask = {
        _id: '123',
        ...req.body,
        createdBy: req.user._id,
        toString: () => req.user._id,
        deleteOne: jest.fn().mockImplementation(async () => {
          throw new Error('Delete failed');
        }),
      };
      Task.findById = jest.fn().mockResolvedValue(mockTask);

      await deleteTask(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Error deleting task',
        message: 'Delete failed',
      });
    });
  });

  describe('getTasks', () => {
    it('should handle task retrieval errors', async () => {
      Task.find = jest.fn().mockImplementation(() => {
        throw new Error('Retrieval failed');
      });

      await getTasks(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Error getting tasks',
        message: 'Retrieval failed',
      });
    });
  });
});
