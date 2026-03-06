const express = require('express');
const { body } = require('express-validator');
const { login, register, getProfile, updateProfile } = require('../controllers/authController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Validaciones
const loginValidation = [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').notEmpty().withMessage('Password requerido')
];

const registerValidation = [
    body('email').isEmail().withMessage('Email inválido'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password debe tener al menos 6 caracteres'),
    body('nombre').notEmpty().withMessage('Nombre requerido')
];

// Rutas públicas
router.post('/login', loginValidation, login);

// Rutas protegidas
router.post('/register', auth, registerValidation, register);
router.get('/me', auth, getProfile);
router.put('/me', auth, updateProfile);

module.exports = router;
