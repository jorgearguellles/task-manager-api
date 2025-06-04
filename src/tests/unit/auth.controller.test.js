const {
  register,
  login,
  logout,
} = require('../../controllers/auth.controller');
const User = require('../../models/user.model');
const jwt = require('jsonwebtoken');

jest.mock('../../models/user.model');
jest.mock('jsonwebtoken');

describe('Auth Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('register', () => {
    it('should register a new user', async () => {
      User.findOne.mockResolvedValue(null);
      User.prototype.save = jest.fn().mockResolvedValue({
        _id: '123',
        name: 'Test User',
        email: 'test@example.com',
      });
      User.prototype.generateAuthToken = jest
        .fn()
        .mockReturnValue('fake-token');
      await register(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Usuario registrado exitosamente',
          token: 'fake-token',
        })
      );
    });

    it('should handle registration errors', async () => {
      User.findOne.mockResolvedValue({ email: 'test@example.com' });
      await register(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'Email already exists' })
      );
    });
  });

  describe('login', () => {
    it('should login a user and return a token', async () => {
      const mockUser = {
        _id: '123',
        name: 'Test User',
        email: 'test@example.com',
        isActive: true,
        comparePassword: jest.fn().mockResolvedValue(true),
        generateAuthToken: jest.fn().mockReturnValue('fake-token'),
        save: jest.fn().mockResolvedValue(true),
        toPublicJSON: jest.fn().mockReturnValue({
          _id: '123',
          name: 'Test User',
          email: 'test@example.com',
        }),
      };
      User.findOne = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });
      await login(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ token: 'fake-token' })
      );
    });

    it('should handle login errors', async () => {
      User.findOne = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });
      await login(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'Invalid credentials' })
      );
    });
  });

  describe('logout', () => {
    it('should logout a user', async () => {
      await logout(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Logged out successfully' })
      );
    });
  });
});
