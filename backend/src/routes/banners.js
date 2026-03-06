const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/bannerController');
const { auth } = require('../middleware/auth');

// Rutas públicas (para el frontend cliente)
router.get('/', bannerController.getBanner);

// Rutas privadas (para el admin) - protejamos la actualización
// Nota: Si auth middleware requiere token, asegurémonos de que el frontend admin lo envíe.
// Por ahora usaré auth si es consistente con el resto, si no, lo dejaré abierto y lo protejo luego si falla.
// Basado en archivos previos, parece que hay auth.
router.put('/', auth, bannerController.updateBanner);

module.exports = router;
