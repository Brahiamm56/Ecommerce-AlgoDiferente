const express = require('express');
const { body } = require('express-validator');
const {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/categoryController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Validaciones
const categoryValidation = [
    body('nombre').notEmpty().withMessage('Nombre requerido')
];

const upload = require('../middleware/upload');

// Rutas públicas
router.get('/', getCategories);
router.get('/:id', getCategory);

// Rutas protegidas (admin)
router.post('/', auth, upload.single('imagen'), categoryValidation, createCategory);
router.put('/:id', auth, upload.single('imagen'), updateCategory);
router.delete('/:id', auth, deleteCategory);

module.exports = router;
