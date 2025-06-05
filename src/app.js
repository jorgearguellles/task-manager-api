const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

// Middlewares
const {
  errorHandler,
  rateLimiter,
  loggingMiddleware,
  notFoundMiddleware,
  swaggerMiddleware,
} = require('./middleware');

// Configuración
const logger = require('./config/logger');
const connectDB = require('./config/database');

// Rutas
const authRoutes = require('./routes/auth.routes');
const taskRoutes = require('./routes/task.routes');

// Crear aplicación Express
const app = express();

// Conectar a base de datos
connectDB();

// Middlewares globales
app.use(helmet()); // Security headers
app.use(cors()); // Cross-origin requests
app.use(rateLimiter); // Rate limiting
app.use(loggingMiddleware); // HTTP logging
app.use(express.json({ limit: '10mb' })); // Parse JSON
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded

// Swagger Documentation
app.use('/api-docs', ...swaggerMiddleware);

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
app.use('*', notFoundMiddleware);

// Middleware global de manejo de errores
app.use(errorHandler);

// Configurar el puerto
const PORT = process.env.PORT;

// Iniciar el servidor
if (require.main === module) {
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
