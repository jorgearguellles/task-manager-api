const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  addTaskTag,
  removeTaskTag,
} = require('../controllers/task.controller');
const { auth, authorize } = require('../middleware/auth.middleware');

// Todas las rutas requieren autenticación
router.use(auth);

// Rutas básicas CRUD
router.post('/', createTask);
router.get('/', getTasks);
router.get('/:id', getTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

// Rutas adicionales
router.patch('/:id/status', updateTaskStatus);
router.post('/:id/tags', addTaskTag);
router.delete('/:id/tags', removeTaskTag);

module.exports = router;
