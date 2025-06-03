const mongoose = require('mongoose');
const User = require('../../models/user.model');

describe('User Model', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_TEST_URI);
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('User Creation', () => {
    it('should create a user with required fields', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      const user = await User.create(userData);

      expect(user.name).toBe(userData.name);
      expect(user.email).toBe(userData.email);
      expect(user.password).not.toBe(userData.password); // Password should be hashed
      expect(user.role).toBe('user'); // Default role
      expect(user.isActive).toBe(true); // Default isActive
    });

    it('should not create a user without required fields', async () => {
      const userData = {
        name: 'Test User',
        // Falta email y password
      };

      try {
        await User.create(userData);
        fail('Should not create user without required fields');
      } catch (error) {
        expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
      }
    });

    it('should not create a user with invalid email format', async () => {
      const userData = {
        name: 'Test User',
        email: 'invalid-email',
        password: 'password123',
      };

      try {
        await User.create(userData);
        fail('Should not create user with invalid email');
      } catch (error) {
        expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
      }
    });
  });

  it('should hash password before saving', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    };

    const user = await User.create(userData);
    expect(user.password).not.toBe(userData.password);
    expect(user.password).toMatch(/^\$2[aby]\$\d+\$/); // bcrypt hash format
  });

  it('should validate password correctly', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    };

    const user = await User.create(userData);
    const isMatch = await user.comparePassword('password123');
    expect(isMatch).toBe(true);

    const isNotMatch = await user.comparePassword('wrongpassword');
    expect(isNotMatch).toBe(false);
  });

  it('should update lastLogin on login', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    };

    const user = await User.create(userData);
    await user.updateLastLogin();
    expect(user.lastLogin).toBeDefined();
  });

  it('should not allow duplicate emails', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    };

    await User.create(userData);
    await expect(User.create(userData)).rejects.toThrow();
  });
});
