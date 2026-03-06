const { validationResult } = require('express-validator');
const { Category, Product } = require('../models');

// GET /api/categories - Listar categorías
const getCategories = async (req, res, next) => {
    try {
        const { activo = 'true', includeProducts = 'false' } = req.query;

        const where = {};
        if (activo === 'true') {
            where.activo = true;
        }

        let include = [];
        if (includeProducts === 'true') {
            include.push({
                model: Product,
                as: 'products',
                where: { activo: true },
                required: false,
                attributes: ['id', 'nombre', 'precio', 'imagen_url']
            });
        }

        const categories = await Category.findAll({
            where,
            include,
            order: [['id', 'ASC']]
        });

        // Agregar categoría "Todos" al inicio para el frontend
        const allCategory = {
            id: 0,
            nombre: 'Todos',
            slug: 'todos',
            activo: true
        };

        res.json({
            categories: [allCategory, ...categories]
        });
    } catch (error) {
        next(error);
    }
};

// GET /api/categories/:id - Detalle de categoría
const getCategory = async (req, res, next) => {
    try {
        const category = await Category.findByPk(req.params.id, {
            include: [{
                model: Product,
                as: 'products',
                where: { activo: true },
                required: false
            }]
        });

        if (!category) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }

        res.json({ category });
    } catch (error) {
        next(error);
    }
};

// POST /api/categories - Crear categoría (admin)
const createCategory = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { nombre, slug, imagen_url, activo } = req.body;

        // Resolver imagen: archivo subido o URL directa
        let resolvedImageUrl = null;
        if (req.file) {
            resolvedImageUrl = `/uploads/${req.file.filename}`;
        } else if (imagen_url) {
            resolvedImageUrl = imagen_url;
        }

        const category = await Category.create({
            nombre,
            slug,
            imagen_url: resolvedImageUrl,
            activo: activo !== false
        });

        res.status(201).json({
            message: 'Categoría creada exitosamente',
            category
        });
    } catch (error) {
        next(error);
    }
};

// PUT /api/categories/:id - Actualizar categoría (admin)
const updateCategory = async (req, res, next) => {
    try {
        const category = await Category.findByPk(req.params.id);

        if (!category) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }

        const { nombre, slug, imagen_url, activo } = req.body;

        if (nombre !== undefined) category.nombre = nombre;
        if (slug !== undefined) category.slug = slug;

        if (req.file) {
            category.imagen_url = `/uploads/${req.file.filename}`;
        } else if (imagen_url !== undefined) {
            category.imagen_url = imagen_url;
        }

        if (activo !== undefined) category.activo = activo;

        await category.save();

        res.json({
            message: 'Categoría actualizada',
            category
        });
    } catch (error) {
        next(error);
    }
};

// DELETE /api/categories/:id - Eliminar categoría (admin)
const deleteCategory = async (req, res, next) => {
    try {
        const category = await Category.findByPk(req.params.id);

        if (!category) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }

        // Verificar si tiene productos
        const productCount = await Product.count({
            where: { category_id: category.id }
        });

        if (productCount > 0) {
            return res.status(400).json({
                error: `No se puede eliminar. La categoría tiene ${productCount} productos asociados.`
            });
        }

        await category.destroy();

        res.json({ message: 'Categoría eliminada' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
};
