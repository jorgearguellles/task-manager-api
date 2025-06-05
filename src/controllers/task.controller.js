const taskService = require('../services/task.service');
const logger = require('../config/logger');

// Crear nueva tarea
const createTask = async (req, res, next) => {
  try {
    const task = await taskService.createTask(req.body, req.user.id);
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

// Obtener todas las tareas (con filtros)
const getTasks = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, priority, category } = req.query;
    const result = await taskService.getTasks(
      { status, priority, category },
      parseInt(page),
      parseInt(limit)
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// Obtener una tarea específica
const getTask = async (req, res, next) => {
  try {
    const task = await taskService.getTaskById(req.params.id);
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

// Actualizar tarea
const updateTask = async (req, res, next) => {
  try {
    const task = await taskService.updateTask(
      req.params.id,
      req.body,
      req.user.id
    );
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

// Eliminar tarea
const deleteTask = async (req, res, next) => {
  try {
    const result = await taskService.deleteTask(req.params.id, req.user.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// Actualizar estado de la tarea
const updateTaskStatus = async (req, res, next) => {
  try {
    const task = await taskService.updateTaskStatus(
      req.params.id,
      req.body.status,
      req.user.id
    );
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

// Añadir etiqueta a la tarea
const addTaskTag = async (req, res, next) => {
  try {
    const task = await taskService.addTaskTag(
      req.params.id,
      req.body.tag,
      req.user.id
    );
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

// Remover etiqueta de la tarea
const removeTaskTag = async (req, res, next) => {
  try {
    const task = await taskService.removeTaskTag(
      req.params.id,
      req.body.tag,
      req.user.id
    );
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  addTaskTag,
  removeTaskTag,
};
