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

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - priority
 *         - dueDate
 *         - assignedTo
 *       properties:
 *         title:
 *           type: string
 *           description: Título de la tarea
 *         description:
 *           type: string
 *           description: Descripción detallada de la tarea
 *         status:
 *           type: string
 *           enum: [pending, in-progress, completed]
 *           default: pending
 *           description: Estado de la tarea
 *         priority:
 *           type: string
 *           enum: [low, medium, high]
 *           description: Prioridad de la tarea
 *         dueDate:
 *           type: string
 *           format: date
 *           description: Fecha de vencimiento
 *         assignedTo:
 *           type: string
 *           description: ID del usuario asignado
 *         category:
 *           type: string
 *           description: Categoría de la tarea
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Etiquetas de la tarea
 *         attachments:
 *           type: array
 *           items:
 *             type: string
 *           description: Archivos adjuntos
 */

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Crear una nueva tarea
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       201:
 *         description: Tarea creada exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: No autorizado
 */
router.post(
  '/',
  auth,
  createTaskValidator,
  validateRequest,
  taskController.createTask
);

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Obtener todas las tareas
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filtrar por estado
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *         description: Filtrar por prioridad
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filtrar por categoría
 *     responses:
 *       200:
 *         description: Lista de tareas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       401:
 *         description: No autorizado
 */
router.get('/', auth, taskController.getTasks);

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Obtener una tarea específica
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tarea
 *     responses:
 *       200:
 *         description: Detalles de la tarea
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Tarea no encontrada
 */
router.get('/:id', auth, taskController.getTask);

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Actualizar una tarea
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tarea
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       200:
 *         description: Tarea actualizada exitosamente
 *       404:
 *         description: Tarea no encontrada
 */
router.put(
  '/:id',
  auth,
  updateTaskValidator,
  validateRequest,
  taskController.updateTask
);

/**
 * @swagger
 * /api/tasks/{id}/status:
 *   patch:
 *     summary: Actualizar el estado de una tarea
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tarea
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, in-progress, completed]
 *     responses:
 *       200:
 *         description: Estado actualizado exitosamente
 *       404:
 *         description: Tarea no encontrada
 */
router.patch(
  '/:id/status',
  auth,
  updateStatusValidator,
  validateRequest,
  taskController.updateTaskStatus
);

/**
 * @swagger
 * /api/tasks/{id}/tags:
 *   post:
 *     summary: Añadir una etiqueta a una tarea
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tarea
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tag
 *             properties:
 *               tag:
 *                 type: string
 *     responses:
 *       200:
 *         description: Etiqueta añadida exitosamente
 *       404:
 *         description: Tarea no encontrada
 */
router.post(
  '/:id/tags',
  auth,
  addTagValidator,
  validateRequest,
  taskController.addTaskTag
);

/**
 * @swagger
 * /api/tasks/{id}/tags:
 *   delete:
 *     summary: Eliminar una etiqueta de una tarea
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tarea
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tag
 *             properties:
 *               tag:
 *                 type: string
 *     responses:
 *       200:
 *         description: Etiqueta eliminada exitosamente
 *       404:
 *         description: Tarea no encontrada
 */
router.delete(
  '/:id/tags',
  auth,
  removeTagValidator,
  validateRequest,
  taskController.removeTaskTag
);

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Eliminar una tarea
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tarea
 *     responses:
 *       200:
 *         description: Tarea eliminada exitosamente
 *       404:
 *         description: Tarea no encontrada
 */
router.delete('/:id', auth, taskController.deleteTask);

module.exports = router;
