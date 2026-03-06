const express = require('express');
const { body } = require('express-validator');
const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    updateStock,
    updateSizeStock,
    deleteProduct
} = require('../controllers/productController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Validaciones para crear/actualizar producto
const productValidation = [
    body('nombre').notEmpty().withMessage('Nombre requerido'),
    body('precio')
        .isFloat({ min: 0 })
        .withMessage('Precio debe ser un número positivo'),
    body('stock')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Stock debe ser un número entero positivo')
];

const upload = require('../middleware/upload');

// Rutas públicas
router.get('/', getProducts);
router.get('/:id', getProduct);

// Rutas protegidas (admin)
// Nota: upload.array debe ir ANTES de las validaciones de express-validator si estas dependen del body parseado por multer
router.post('/', auth, upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }]), productValidation, createProduct);
router.put('/:id', auth, upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }]), productValidation, updateProduct);
router.patch('/:id/stock', auth, updateStock);
router.put('/:id/sizes/stock', auth, updateSizeStock);
router.delete('/:id', auth, deleteProduct);

module.exports = router;
