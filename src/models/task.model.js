const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'El título es requerido'],
      trim: true,
      minlength: [3, 'El título debe tener al menos 3 caracteres'],
      maxlength: [100, 'El título no puede tener más de 100 caracteres'],
    },
    description: {
      type: String,
      required: [true, 'La descripción es requerida'],
      trim: true,
      minlength: [10, 'La descripción debe tener al menos 10 caracteres'],
      maxlength: [1000, 'La descripción no puede tener más de 1000 caracteres'],
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    dueDate: {
      type: Date,
      required: [true, 'La fecha límite es requerida'],
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'La tarea debe estar asignada a un usuario'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      enum: ['work', 'personal', 'shopping', 'health', 'other'],
      default: 'other',
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    attachments: [
      {
        filename: String,
        path: String,
        mimetype: String,
        size: Number,
      },
    ],
    isCompleted: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Índices para búsquedas eficientes
taskSchema.index({ assignedTo: 1, status: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ category: 1 });
taskSchema.index({ tags: 1 });

// Método para marcar tarea como completada
taskSchema.methods.complete = function () {
  this.status = 'completed';
  this.isCompleted = true;
  this.completedAt = new Date();
  return this.save();
};

// Método para actualizar el estado
taskSchema.methods.updateStatus = function (newStatus) {
  if (
    !['pending', 'in-progress', 'completed', 'cancelled'].includes(newStatus)
  ) {
    throw new Error('Estado no válido');
  }
  this.status = newStatus;
  if (newStatus === 'completed') {
    this.isCompleted = true;
    this.completedAt = new Date();
  } else {
    this.isCompleted = false;
    this.completedAt = undefined;
  }
  return this.save();
};

// Método para añadir etiqueta
taskSchema.methods.addTag = function (tag) {
  if (!this.tags.includes(tag)) {
    this.tags.push(tag);
  }
  return this.save();
};

// Método para remover etiqueta
taskSchema.methods.removeTag = function (tag) {
  this.tags = this.tags.filter((t) => t !== tag);
  return this.save();
};

// Método para añadir archivo adjunto
taskSchema.methods.addAttachment = function (attachment) {
  this.attachments.push(attachment);
  return this.save();
};

// Método para remover archivo adjunto
taskSchema.methods.removeAttachment = function (attachmentId) {
  this.attachments = this.attachments.filter(
    (attachment) => attachment._id.toString() !== attachmentId
  );
  return this.save();
};

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
