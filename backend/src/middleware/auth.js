const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Middleware para verificar token JWT
const auth = async (req, res, next) => {
    try {
        // Obtener token del header
        const authHeader = req.header('Authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: 'Acceso denegado. Token no proporcionado.'
            });
        }

        const token = authHeader.replace('Bearer ', '');

        // Verificar token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Buscar usuario
        const user = await User.findByPk(decoded.id);

        if (!user) {
            return res.status(401).json({
                error: 'Token inválido. Usuario no encontrado.'
            });
        }

        // Agregar usuario a la request
        req.user = user;
        req.token = token;

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Token inválido.' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expirado.' });
        }
        res.status(500).json({ error: 'Error de autenticación.' });
    }
};

// Middleware para verificar rol de admin
const isAdmin = (req, res, next) => {
    if (req.user && req.user.rol === 'admin') {
        next();
    } else {
        res.status(403).json({
            error: 'Acceso denegado. Se requiere rol de administrador.'
        });
    }
};

module.exports = { auth, isAdmin };
