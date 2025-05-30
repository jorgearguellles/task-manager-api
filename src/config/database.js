const mongoose = require('mongoose');
const logger = require('./logger');

const connectDB = async () => {
  try {
    const mongoURI =
      process.env.NODE_ENV === 'test'
        ? process.env.MONGODB_TEST_URI
        : process.env.MONGODB_URI;

    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000, // Timeout después de 5 segundos
      socketTimeoutMS: 45000, // Timeout para operaciones de socket
      family: 4, // Forzar IPv4
      maxPoolSize: 10, // Número máximo de conexiones en el pool
      minPoolSize: 5, // Número mínimo de conexiones en el pool
      retryWrites: true, // Reintentar operaciones de escritura fallidas
      retryReads: true, // Reintentar operaciones de lectura fallidas
    });

    logger.info(`MongoDB Connected: ${conn.connection.host}`);

    // Event listeners para debugging y manejo de errores
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
    });

    // Manejo de señales de terminación
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        logger.info('MongoDB connection closed through app termination');
        process.exit(0);
      } catch (err) {
        logger.error('Error during MongoDB disconnection:', err);
        process.exit(1);
      }
    });
  } catch (error) {
    logger.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
