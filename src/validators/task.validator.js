const { body, param } = require('express-validator');

const createTaskValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('El título es requerido')
    .isLength({ min: 3, max: 100 })
    .withMessage('El título debe tener entre 3 y 100 caracteres'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('La descripción es requerida')
    .isLength({ min: 10, max: 1000 })
    .withMessage('La descripción debe tener entre 10 y 1000 caracteres'),

  body('priority')
    .trim()
    .notEmpty()
    .withMessage('La prioridad es requerida')
    .isIn(['low', 'medium', 'high'])
    .withMessage('La prioridad debe ser low, medium o high'),

  body('dueDate')
    .trim()
    .notEmpty()
    .withMessage('La fecha de vencimiento es requerida')
    .isISO8601()
    .withMessage('La fecha debe tener un formato válido (YYYY-MM-DD)')
    .custom((value) => {
      const date = new Date(value);
      const today = new Date();
      if (date < today) {
        throw new Error('La fecha de vencimiento no puede ser en el pasado');
      }
      return true;
    }),

  body('category')
    .trim()
    .notEmpty()
    .withMessage('La categoría es requerida')
    .isIn(['work', 'personal', 'shopping', 'health', 'other'])
    .withMessage(
      'La categoría debe ser work, personal, shopping, health u other'
    ),

  body('tags')
    .optional()
    .isArray()
    .withMessage('Las etiquetas deben ser un array')
    .custom((tags) => {
      if (tags && tags.length > 5) {
        throw new Error('No se pueden agregar más de 5 etiquetas');
      }
      return true;
    }),
];

const updateTaskValidator = [
  param('id').isMongoId().withMessage('ID de tarea inválido'),

  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('El título debe tener entre 3 y 100 caracteres'),

  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('La descripción debe tener entre 10 y 1000 caracteres'),

  body('priority')
    .optional()
    .trim()
    .isIn(['low', 'medium', 'high'])
    .withMessage('La prioridad debe ser low, medium o high'),

  body('dueDate')
    .optional()
    .trim()
    .isISO8601()
    .withMessage('La fecha debe tener un formato válido (YYYY-MM-DD)')
    .custom((value) => {
      const date = new Date(value);
      const today = new Date();
      if (date < today) {
        throw new Error('La fecha de vencimiento no puede ser en el pasado');
      }
      return true;
    }),

  body('category')
    .optional()
    .trim()
    .isIn(['work', 'personal', 'shopping', 'health', 'other'])
    .withMessage(
      'La categoría debe ser work, personal, shopping, health u other'
    ),
];

const updateStatusValidator = [
  param('id').isMongoId().withMessage('ID de tarea inválido'),

  body('status')
    .trim()
    .notEmpty()
    .withMessage('El estado es requerido')
    .isIn(['pending', 'in-progress', 'completed'])
    .withMessage('El estado debe ser pending, in-progress o completed'),
];

const addTagValidator = [
  param('id').isMongoId().withMessage('ID de tarea inválido'),

  body('tag')
    .trim()
    .notEmpty()
    .withMessage('La etiqueta es requerida')
    .isLength({ min: 2, max: 20 })
    .withMessage('La etiqueta debe tener entre 2 y 20 caracteres'),
];

const removeTagValidator = [
  param('id').isMongoId().withMessage('ID de tarea inválido'),

  body('tag').trim().notEmpty().withMessage('La etiqueta es requerida'),
];

module.exports = {
  createTaskValidator,
  updateTaskValidator,
  updateStatusValidator,
  addTagValidator,
  removeTagValidator,
};
