const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

// Importar rutas
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const bannerRoutes = require('./routes/banners');
const couponRoutes = require('./routes/coupons');
const paymentRoutes = require('./routes/payments');
const salesRoutes = require('./routes/sales');
const gastosRoutes = require('./routes/gastos');
const proveedoresRoutes = require('./routes/proveedores');

const app = express();

// Middlewares globales
const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
    : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de archivos estáticos (Imágenes)
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Ruta de health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'API funcionando correctamente',
        timestamp: new Date().toISOString()
    });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/gastos', gastosRoutes);
app.use('/api/proveedores', proveedoresRoutes);

// Ruta 404
app.use((req, res) => {
    res.status(404).json({
        error: 'Ruta no encontrada',
        path: req.originalUrl
    });
});

// Middleware de manejo de errores
app.use(errorHandler);

module.exports = app;
