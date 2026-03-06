const { Proveedor } = require('../models');
const { Op } = require('sequelize');

// GET /api/proveedores — listar todos
const getAll = async (req, res) => {
    try {
        const { search } = req.query;
        const where = {};

        if (search) {
            where[Op.or] = [
                { nombre: { [Op.like]: `%${search}%` } },
                { rubro: { [Op.like]: `%${search}%` } }
            ];
        }

        const proveedores = await Proveedor.findAll({
            where,
            order: [['nombre', 'ASC']]
        });

        res.json({ proveedores });
    } catch (error) {
        console.error('Error al obtener proveedores:', error);
        res.status(500).json({ error: 'Error al obtener proveedores' });
    }
};

// POST /api/proveedores — crear
const create = async (req, res) => {
    try {
        const { nombre, telefono, email, rubro, notas } = req.body;
        const proveedor = await Proveedor.create({ nombre, telefono, email, rubro, notas });
        res.status(201).json({ proveedor });
    } catch (error) {
        console.error('Error al crear proveedor:', error);
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ error: error.errors[0].message });
        }
        res.status(500).json({ error: 'Error al crear proveedor' });
    }
};

// PUT /api/proveedores/:id — editar
const update = async (req, res) => {
    try {
        const proveedor = await Proveedor.findByPk(req.params.id);
        if (!proveedor) {
            return res.status(404).json({ error: 'Proveedor no encontrado' });
        }

        const { nombre, telefono, email, rubro, notas } = req.body;
        await proveedor.update({ nombre, telefono, email, rubro, notas });

        res.json({ proveedor });
    } catch (error) {
        console.error('Error al actualizar proveedor:', error);
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ error: error.errors[0].message });
        }
        res.status(500).json({ error: 'Error al actualizar proveedor' });
    }
};

// DELETE /api/proveedores/:id — eliminar
const remove = async (req, res) => {
    try {
        const proveedor = await Proveedor.findByPk(req.params.id);
        if (!proveedor) {
            return res.status(404).json({ error: 'Proveedor no encontrado' });
        }

        await proveedor.destroy();
        res.json({ message: 'Proveedor eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar proveedor:', error);
        res.status(500).json({ error: 'Error al eliminar proveedor' });
    }
};

module.exports = { getAll, create, update, remove };
