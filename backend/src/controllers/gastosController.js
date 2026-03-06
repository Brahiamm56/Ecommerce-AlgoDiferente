const { Gasto } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

// GET /api/gastos — listar todos (filtro ?mes=&año=)
const getAll = async (req, res) => {
    try {
        const { mes, año } = req.query;
        const where = {};

        if (mes && año) {
            const startDate = new Date(año, mes - 1, 1);
            const endDate = new Date(año, mes, 0);
            where.fecha = {
                [Op.between]: [
                    startDate.toISOString().split('T')[0],
                    endDate.toISOString().split('T')[0]
                ]
            };
        } else if (año) {
            where.fecha = {
                [Op.between]: [`${año}-01-01`, `${año}-12-31`]
            };
        }

        const gastos = await Gasto.findAll({
            where,
            order: [['fecha', 'DESC'], ['createdAt', 'DESC']]
        });

        res.json({ gastos });
    } catch (error) {
        console.error('Error al obtener gastos:', error);
        res.status(500).json({ error: 'Error al obtener gastos' });
    }
};

// POST /api/gastos — crear gasto
const create = async (req, res) => {
    try {
        const { descripcion, monto, categoria, fecha, notas } = req.body;
        const gasto = await Gasto.create({
            descripcion,
            monto,
            categoria,
            fecha: fecha || new Date().toISOString().split('T')[0],
            notas
        });
        res.status(201).json({ gasto });
    } catch (error) {
        console.error('Error al crear gasto:', error);
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ error: error.errors[0].message });
        }
        res.status(500).json({ error: 'Error al crear gasto' });
    }
};

// PUT /api/gastos/:id — editar gasto
const update = async (req, res) => {
    try {
        const gasto = await Gasto.findByPk(req.params.id);
        if (!gasto) {
            return res.status(404).json({ error: 'Gasto no encontrado' });
        }

        const { descripcion, monto, categoria, fecha, notas } = req.body;
        await gasto.update({ descripcion, monto, categoria, fecha, notas });

        res.json({ gasto });
    } catch (error) {
        console.error('Error al actualizar gasto:', error);
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ error: error.errors[0].message });
        }
        res.status(500).json({ error: 'Error al actualizar gasto' });
    }
};

// DELETE /api/gastos/:id — eliminar gasto
const remove = async (req, res) => {
    try {
        const gasto = await Gasto.findByPk(req.params.id);
        if (!gasto) {
            return res.status(404).json({ error: 'Gasto no encontrado' });
        }

        await gasto.destroy();
        res.json({ message: 'Gasto eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar gasto:', error);
        res.status(500).json({ error: 'Error al eliminar gasto' });
    }
};

// GET /api/gastos/stats — total por categoría en período
const getStats = async (req, res) => {
    try {
        const { desde, hasta } = req.query;
        const where = {};

        if (desde && hasta) {
            where.fecha = { [Op.between]: [desde, hasta] };
        } else {
            // Default: mes actual
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            where.fecha = {
                [Op.between]: [
                    startOfMonth.toISOString().split('T')[0],
                    endOfMonth.toISOString().split('T')[0]
                ]
            };
        }

        const gastos = await Gasto.findAll({ where });

        const total = gastos.reduce((sum, g) => sum + parseFloat(g.monto), 0);

        const porCategoria = {};
        gastos.forEach(g => {
            const cat = g.categoria;
            if (!porCategoria[cat]) porCategoria[cat] = 0;
            porCategoria[cat] += parseFloat(g.monto);
        });

        res.json({ total, porCategoria, count: gastos.length });
    } catch (error) {
        console.error('Error al obtener stats de gastos:', error);
        res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
};

module.exports = { getAll, create, update, remove, getStats };
