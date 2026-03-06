const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');
const { auth } = require('../middleware/auth');

// Rutas protegidas (solo admin debería ver/crear cupones por ahora)
router.get('/', auth, couponController.getAll);
router.post('/', auth, couponController.create);
router.delete('/:id', auth, couponController.delete);
router.patch('/:id/toggle', auth, couponController.toggleActive);

module.exports = router;
