const express = require('express');
const router = express.Router();
const { createSale, getSales, getSale, getSalesStats } = require('../controllers/salesController');
const { auth } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.get('/stats', auth, getSalesStats);
router.post('/', auth, createSale);
router.get('/', auth, getSales);
router.get('/:id', auth, getSale);

module.exports = router;
