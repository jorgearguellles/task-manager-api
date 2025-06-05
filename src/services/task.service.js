const Task = require('../models/task.model');
const { AppError } = require('../utils/error');

const createTask = async (taskData, userId) => {
  try {
    const task = new Task({
      ...taskData,
      createdBy: userId,
    });

    await task.save();
    return task;
  } catch (error) {
    throw new AppError('Error al crear la tarea', 500);
  }
};

const getTasks = async (filters = {}, page = 1, limit = 10) => {
  try {
    const query = {};

    // Aplicar filtros
    if (filters.status) query.status = filters.status;
    if (filters.priority) query.priority = filters.priority;
    if (filters.category) query.category = filters.category;

    const skip = (page - 1) * limit;

    const [tasks, total] = await Promise.all([
      Task.find(query)
        .populate('createdBy', 'name email')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Task.countDocuments(query),
    ]);

    return {
      tasks,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    throw new AppError('Error al obtener las tareas', 500);
  }
};

const getTaskById = async (taskId) => {
  try {
    const task = await Task.findById(taskId).populate(
      'createdBy',
      'name email'
    );
    if (!task) {
      throw new AppError('Tarea no encontrada', 404);
    }
    return task;
  } catch (error) {
    throw error;
  }
};

const updateTask = async (taskId, updateData, userId) => {
  try {
    const task = await Task.findById(taskId);
    if (!task) {
      throw new AppError('Tarea no encontrada', 404);
    }

    // Verificar permisos
    if (task.createdBy.toString() !== userId) {
      throw new AppError('No tienes permiso para actualizar esta tarea', 403);
    }

    Object.assign(task, updateData);
    await task.save();

    return task;
  } catch (error) {
    throw error;
  }
};

const updateTaskStatus = async (taskId, status, userId) => {
  try {
    const task = await Task.findById(taskId);
    if (!task) {
      throw new AppError('Tarea no encontrada', 404);
    }

    // Verificar permisos
    if (task.createdBy.toString() !== userId) {
      throw new AppError('No tienes permiso para actualizar esta tarea', 403);
    }

    task.status = status;
    await task.save();

    return task;
  } catch (error) {
    throw error;
  }
};

const deleteTask = async (taskId, userId) => {
  try {
    const task = await Task.findById(taskId);
    if (!task) {
      throw new AppError('Tarea no encontrada', 404);
    }

    // Verificar permisos
    if (task.createdBy.toString() !== userId) {
      throw new AppError('No tienes permiso para eliminar esta tarea', 403);
    }

    await task.deleteOne();
    return { message: 'Tarea eliminada exitosamente' };
  } catch (error) {
    throw error;
  }
};

const addTaskTag = async (taskId, tag, userId) => {
  try {
    const task = await Task.findById(taskId);
    if (!task) {
      throw new AppError('Tarea no encontrada', 404);
    }

    // Verificar permisos
    if (task.createdBy.toString() !== userId) {
      throw new AppError('No tienes permiso para modificar esta tarea', 403);
    }

    if (!task.tags.includes(tag)) {
      task.tags.push(tag);
      await task.save();
    }

    return task;
  } catch (error) {
    throw error;
  }
};

const removeTaskTag = async (taskId, tag, userId) => {
  try {
    const task = await Task.findById(taskId);
    if (!task) {
      throw new AppError('Tarea no encontrada', 404);
    }

    // Verificar permisos
    if (task.createdBy.toString() !== userId) {
      throw new AppError('No tienes permiso para modificar esta tarea', 403);
    }

    task.tags = task.tags.filter((t) => t !== tag);
    await task.save();

    return task;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
  addTaskTag,
  removeTaskTag,
};
