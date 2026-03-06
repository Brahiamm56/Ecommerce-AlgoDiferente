const express = require('express');
const router = express.Router();
const { getAll, create, update, remove } = require('../controllers/proveedoresController');
const { auth, isAdmin } = require('../middleware/auth');

// Todas las rutas protegidas
router.get('/', auth, isAdmin, getAll);
router.post('/', auth, isAdmin, create);
router.put('/:id', auth, isAdmin, update);
router.delete('/:id', auth, isAdmin, remove);

module.exports = router;
