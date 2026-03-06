const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { User } = require('../models');

// Generar token JWT
const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email, rol: user.rol },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

// POST /api/auth/login
const login = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        // Buscar usuario
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({
                error: 'Credenciales inválidas'
            });
        }

        // Verificar password
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                error: 'Credenciales inválidas'
            });
        }

        // Generar token
        const token = generateToken(user);

        res.json({
            message: 'Login exitoso',
            token,
            user: user.toJSON()
        });
    } catch (error) {
        next(error);
    }
};

// POST /api/auth/register (solo admins pueden crear otros admins)
const register = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password, nombre } = req.body;

        // Verificar si ya existe
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({
                error: 'El email ya está registrado'
            });
        }

        // Crear usuario
        const user = await User.create({
            email,
            password,
            nombre,
            rol: 'admin'
        });

        // Generar token
        const token = generateToken(user);

        res.status(201).json({
            message: 'Usuario creado exitosamente',
            token,
            user: user.toJSON()
        });
    } catch (error) {
        next(error);
    }
};

// GET /api/auth/me
const getProfile = async (req, res) => {
    res.json({
        user: req.user.toJSON()
    });
};

// PUT /api/auth/me
const updateProfile = async (req, res, next) => {
    try {
        const { nombre, email } = req.body;

        const user = req.user;

        if (nombre) user.nombre = nombre;
        if (email) user.email = email;

        await user.save();

        res.json({
            message: 'Perfil actualizado',
            user: user.toJSON()
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    login,
    register,
    getProfile,
    updateProfile
};
