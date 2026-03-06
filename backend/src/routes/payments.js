const express = require('express');
const { createPreference } = require('../controllers/paymentController');

const router = express.Router();

// Crear preferencia de pago (público - no requiere auth)
router.post('/create-preference', createPreference);

module.exports = router;
