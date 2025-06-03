const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const { auth } = require('../middleware/auth.middleware');
const validateRequest = require('../middleware/validation.middleware');
const {
  createTaskValidator,
  updateTaskValidator,
  updateStatusValidator,
  addTagValidator,
  removeTagValidator,
} = require('../validators/task.validator');

// Rutas de tareas
router.post(
  '/',
  auth,
  createTaskValidator,
  validateRequest,
  taskController.createTask
);
router.get('/', auth, taskController.getTasks);
router.get('/:id', auth, taskController.getTask);
router.put(
  '/:id',
  auth,
  updateTaskValidator,
  validateRequest,
  taskController.updateTask
);
router.patch(
  '/:id/status',
  auth,
  updateStatusValidator,
  validateRequest,
  taskController.updateTaskStatus
);
router.post(
  '/:id/tags',
  auth,
  addTagValidator,
  validateRequest,
  taskController.addTaskTag
);
router.delete(
  '/:id/tags',
  auth,
  removeTagValidator,
  validateRequest,
  taskController.removeTaskTag
);
router.delete('/:id', auth, taskController.deleteTask);

module.exports = router;
