const Task = require('../models/task.model');
const logger = require('../config/logger');

// Crear nueva tarea
const createTask = async (req, res) => {
  try {
    const taskData = {
      ...req.body,
      createdBy: req.user._id,
    };

    const task = new Task(taskData);
    await task.save();

    res.status(201).json({
      message: 'Tarea creada exitosamente',
      task,
    });
  } catch (error) {
    logger.error('Error creating task:', error);
    res.status(500).json({
      error: 'Error creating task',
      message: error.message,
    });
  }
};

// Obtener todas las tareas (con filtros)
const getTasks = async (req, res) => {
  try {
    const {
      status,
      priority,
      category,
      assignedTo,
      dueDate,
      search,
      page = 1,
      limit = 10,
    } = req.query;

    // Construir filtro
    const filter = {};

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (dueDate) {
      const date = new Date(dueDate);
      filter.dueDate = {
        $gte: new Date(date.setHours(0, 0, 0)),
        $lt: new Date(date.setHours(23, 59, 59)),
      };
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Paginación
    const skip = (page - 1) * limit;

    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Task.countDocuments(filter);

    res.json({
      tasks,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error('Error getting tasks:', error);
    res.status(500).json({
      error: 'Error getting tasks',
      message: error.message,
    });
  }
};

// Obtener una tarea específica
const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    if (!task) {
      return res.status(404).json({
        error: 'Task not found',
        message: 'La tarea no existe',
      });
    }

    res.json(task);
  } catch (error) {
    logger.error('Error getting task:', error);
    res.status(500).json({
      error: 'Error getting task',
      message: error.message,
    });
  }
};

// Actualizar tarea
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        error: 'Task not found',
        message: 'La tarea no existe',
      });
    }

    // Verificar permisos
    if (
      task.createdBy.toString() !== req.user._id.toString() &&
      task.assignedTo.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'No tienes permiso para actualizar esta tarea',
      });
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('assignedTo', 'name email');

    res.json({
      message: 'Tarea actualizada exitosamente',
      task: updatedTask,
    });
  } catch (error) {
    logger.error('Error updating task:', error);
    res.status(500).json({
      error: 'Error updating task',
      message: error.message,
    });
  }
};

// Eliminar tarea
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        error: 'Task not found',
        message: 'La tarea no existe',
      });
    }

    // Verificar permisos
    if (
      task.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'No tienes permiso para eliminar esta tarea',
      });
    }

    await task.deleteOne();

    res.json({
      message: 'Tarea eliminada exitosamente',
    });
  } catch (error) {
    logger.error('Error deleting task:', error);
    res.status(500).json({
      error: 'Error deleting task',
      message: error.message,
    });
  }
};

// Actualizar estado de la tarea
const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        error: 'Task not found',
        message: 'La tarea no existe',
      });
    }

    // Verificar permisos
    if (
      task.assignedTo.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'No tienes permiso para actualizar el estado de esta tarea',
      });
    }

    await task.updateStatus(status);

    res.json({
      message: 'Estado de la tarea actualizado exitosamente',
      task,
    });
  } catch (error) {
    logger.error('Error updating task status:', error);
    res.status(500).json({
      error: 'Error updating task status',
      message: error.message,
    });
  }
};

// Añadir etiqueta a la tarea
const addTaskTag = async (req, res) => {
  try {
    const { tag } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        error: 'Task not found',
        message: 'La tarea no existe',
      });
    }

    await task.addTag(tag);

    res.json({
      message: 'Etiqueta añadida exitosamente',
      task,
    });
  } catch (error) {
    logger.error('Error adding task tag:', error);
    res.status(500).json({
      error: 'Error adding task tag',
      message: error.message,
    });
  }
};

// Remover etiqueta de la tarea
const removeTaskTag = async (req, res) => {
  try {
    const { tag } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        error: 'Task not found',
        message: 'La tarea no existe',
      });
    }

    await task.removeTag(tag);

    res.json({
      message: 'Etiqueta removida exitosamente',
      task,
    });
  } catch (error) {
    logger.error('Error removing task tag:', error);
    res.status(500).json({
      error: 'Error removing task tag',
      message: error.message,
    });
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
