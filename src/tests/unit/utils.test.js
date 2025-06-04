const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
  hashPassword,
  comparePassword,
  generateToken,
} = require('../../utils/auth');

describe('Utility Functions', () => {
  describe('hashPassword', () => {
    it('should hash a password correctly', async () => {
      const password = 'password123';
      const hashedPassword = await hashPassword(password);
      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword).toMatch(/^\$2[aby]\$\d+\$/); // bcrypt hash format
    });
  });

  describe('comparePassword', () => {
    it('should compare a password with its hash correctly', async () => {
      const password = 'password123';
      const hashedPassword = await bcrypt.hash(password, 10);
      const isMatch = await comparePassword(password, hashedPassword);
      expect(isMatch).toBe(true);
    });

    it('should return false for incorrect password', async () => {
      const password = 'password123';
      const hashedPassword = await bcrypt.hash(password, 10);
      const isMatch = await comparePassword('wrongpassword', hashedPassword);
      expect(isMatch).toBe(false);
    });
  });

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const payload = { userId: '123' };
      const token = generateToken(payload);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      expect(decoded.userId).toBe(payload.userId);
    });
  });
});
