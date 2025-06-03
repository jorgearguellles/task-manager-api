const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const logger = require('./config/logger');
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth.routes');
const taskRoutes = require('./routes/task.routes');

// Crear aplicación Express
const app = express();

// Conectar a base de datos
connectDB();

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // máximo 100 requests por ventana
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middlewares globales
app.use(helmet()); // Security headers
app.use(cors()); // Cross-origin requests
app.use(limiter); // Rate limiting
app.use(
  morgan('combined', {
    stream: { write: (message) => logger.info(message.trim()) },
  })
); // HTTP logging
app.use(express.json({ limit: '10mb' })); // Parse JSON
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Rutas de tareas
app.use('/api/tasks', taskRoutes);

// Rutas de la API
app.use('/api', (req, res) => {
  res.json({
    message: '🚀 Task Manager API is running!',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: {
        register: '/api/auth/register',
        login: '/api/auth/login',
        profile: '/api/auth/profile',
      },
      tasks: {
        list: '/api/tasks',
        create: '/api/tasks',
        get: '/api/tasks/:id',
        update: '/api/tasks/:id',
        delete: '/api/tasks/:id',
        updateStatus: '/api/tasks/:id/status',
        addTag: '/api/tasks/:id/tags',
        removeTag: '/api/tasks/:id/tags',
      },
    },
  });
});

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
  logger.warn(`Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    error: 'Route not found',
    message: `The route ${req.method} ${req.originalUrl} does not exist.`,
  });
});

// Middleware global de manejo de errores
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);

  res.status(err.status || 500).json({
    error:
      process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
});

// Configurar el puerto
const PORT = process.env.PORT || 3000;

// Iniciar el servidor
if (require.main === module) {
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
