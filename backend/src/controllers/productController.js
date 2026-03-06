const { validationResult } = require('express-validator');
const { Product, Category, ProductSize } = require('../models');
const { Op } = require('sequelize');

// Include estándar para talles
const tallesInclude = {
    model: ProductSize,
    as: 'talles',
    attributes: ['id', 'size', 'stock']
};

// GET /api/products - Listar productos (público)
const getProducts = async (req, res, next) => {
    try {
        const {
            categoria,
            search,
            destacado,
            activo = 'true',
            page = 1,
            limit = 20
        } = req.query;

        // Construir filtros
        const where = {};

        if (activo === 'true') {
            where.activo = true;
        }

        if (destacado === 'true') {
            where.destacado = true;
        }

        if (search) {
            where.nombre = { [Op.like]: `%${search}%` };
        }

        // Filtro por categoría (slug)
        let include = [
            {
                model: Category,
                as: 'category',
                attributes: ['id', 'nombre', 'slug']
            },
            tallesInclude
        ];

        if (categoria && categoria !== 'todos') {
            include[0].where = { slug: categoria };
        }

        // Paginación
        const offset = (parseInt(page) - 1) * parseInt(limit);

        const { count, rows: products } = await Product.findAndCountAll({
            where,
            include,
            limit: parseInt(limit),
            offset,
            order: [['destacado', 'DESC'], ['created_at', 'DESC']],
            distinct: true
        });

        res.json({
            products,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(count / parseInt(limit))
            }
        });
    } catch (error) {
        next(error);
    }
};

// GET /api/products/:id - Detalle de producto
const getProduct = async (req, res, next) => {
    try {
        const product = await Product.findByPk(req.params.id, {
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'nombre', 'slug']
                },
                tallesInclude
            ]
        });

        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.json({ product });
    } catch (error) {
        next(error);
    }
};

// POST /api/products - Crear producto (admin)
const createProduct = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            nombre,
            descripcion,
            precio,
            precio_descuento,
            stock,
            imagen_url, // URL manual principal
            imagen_url_2, // URL manual secundaria
            category_id,
            destacado,
            mas_vendido,
            en_oferta,
            activo,
            talles // JSON string: [{ size: '35', stock: 10 }, ...]
        } = req.body;

        // Manejo de imágenes
        let finalImageUrl1 = imagen_url || '';
        let finalImageUrl2 = imagen_url_2 || '';

        const files = req.files || {};

        if (files['image1'] && files['image1'].length > 0) {
            finalImageUrl1 = `/uploads/${files['image1'][0].filename}`;
        }

        if (files['image2'] && files['image2'].length > 0) {
            finalImageUrl2 = `/uploads/${files['image2'][0].filename}`;
        }

        // Parsear talles
        let tallesData = [];
        try {
            tallesData = talles ? JSON.parse(talles) : [];
        } catch (e) {
            tallesData = [];
        }

        // Calcular stock total desde talles (si hay talles, se usa la suma; si no, el valor directo)
        const totalStock = tallesData.length > 0
            ? tallesData.reduce((sum, t) => sum + (parseInt(t.stock) || 0), 0)
            : (stock || 0);

        const product = await Product.create({
            nombre,
            descripcion,
            precio,
            precio_descuento,
            stock: totalStock,
            imagen_url: finalImageUrl1,
            imagen_url_2: finalImageUrl2,
            category_id,
            destacado: destacado === 'true' || destacado === true,
            mas_vendido: mas_vendido === 'true' || mas_vendido === true,
            en_oferta: en_oferta === 'true' || en_oferta === true,
            activo: activo !== 'false' && activo !== false
        });

        // Crear talles asociados
        if (tallesData.length > 0) {
            await ProductSize.bulkCreate(
                tallesData.map(t => ({
                    product_id: product.id,
                    size: t.size,
                    stock: parseInt(t.stock) || 0
                }))
            );
        }

        // Recargar con categoría y talles
        await product.reload({
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'nombre', 'slug']
                },
                tallesInclude
            ]
        });

        res.status(201).json({
            message: 'Producto creado exitosamente',
            product
        });
    } catch (error) {
        next(error);
    }
};

// PUT /api/products/:id - Actualizar producto (admin)
const updateProduct = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        const {
            nombre,
            descripcion,
            precio,
            precio_descuento,
            stock,
            imagen_url,
            imagen_url_2,
            category_id,
            destacado,
            mas_vendido,
            en_oferta,
            activo,
            talles // JSON string: [{ size: '35', stock: 10 }, ...]
        } = req.body;

        // Actualizar campos
        if (nombre !== undefined) product.nombre = nombre;
        if (descripcion !== undefined) product.descripcion = descripcion;
        if (precio !== undefined) product.precio = precio;
        if (precio_descuento !== undefined) product.precio_descuento = precio_descuento;
        if (category_id !== undefined) product.category_id = category_id;
        if (destacado !== undefined) product.destacado = destacado === 'true' || destacado === true;
        if (mas_vendido !== undefined) product.mas_vendido = mas_vendido === 'true' || mas_vendido === true;
        if (en_oferta !== undefined) product.en_oferta = en_oferta === 'true' || en_oferta === true;
        if (activo !== undefined) product.activo = activo === 'true' || activo === true;

        // Manejo de imágenes en edición
        const files = req.files || {};

        // Imagen 1
        if (files['image1'] && files['image1'].length > 0) {
            product.imagen_url = `/uploads/${files['image1'][0].filename}`;
        } else if (imagen_url !== undefined) {
            product.imagen_url = imagen_url;
        }

        // Imagen 2
        if (files['image2'] && files['image2'].length > 0) {
            product.imagen_url_2 = `/uploads/${files['image2'][0].filename}`;
        } else if (imagen_url_2 !== undefined) {
            product.imagen_url_2 = imagen_url_2;
        }

        // Sincronizar talles si vienen en el body
        if (talles !== undefined) {
            let tallesData = [];
            try {
                tallesData = JSON.parse(talles);
            } catch (e) {
                tallesData = [];
            }

            // Eliminar talles existentes y recrear
            await ProductSize.destroy({ where: { product_id: product.id } });

            if (tallesData.length > 0) {
                await ProductSize.bulkCreate(
                    tallesData.map(t => ({
                        product_id: product.id,
                        size: t.size,
                        stock: parseInt(t.stock) || 0
                    }))
                );
            }

            // Recalcular stock total
            product.stock = tallesData.reduce((sum, t) => sum + (parseInt(t.stock) || 0), 0);
        } else if (stock !== undefined) {
            product.stock = stock;
        }

        await product.save();

        // Recargar con categoría y talles
        await product.reload({
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'nombre', 'slug']
                },
                tallesInclude
            ]
        });

        res.json({
            message: 'Producto actualizado',
            product
        });
    } catch (error) {
        next(error);
    }
};

// PATCH /api/products/:id/stock - Actualizar solo stock (admin)
const updateStock = async (req, res, next) => {
    try {
        const { stock } = req.body;

        if (stock === undefined || stock < 0) {
            return res.status(400).json({ error: 'Stock inválido' });
        }

        const product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        product.stock = stock;
        await product.save();

        res.json({
            message: 'Stock actualizado',
            product: {
                id: product.id,
                nombre: product.nombre,
                stock: product.stock
            }
        });
    } catch (error) {
        next(error);
    }
};

// PUT /api/products/:id/sizes/stock - Actualizar stock de un talle específico
const updateSizeStock = async (req, res, next) => {
    try {
        const { size_id, stock } = req.body;

        if (!size_id || stock === undefined || stock < 0) {
            return res.status(400).json({ error: 'size_id y stock son requeridos. Stock debe ser >= 0' });
        }

        const productSize = await ProductSize.findOne({
            where: {
                id: size_id,
                product_id: req.params.id
            }
        });

        if (!productSize) {
            return res.status(404).json({ error: 'Talle no encontrado para este producto' });
        }

        productSize.stock = stock;
        await productSize.save();

        // Recalcular stock total del producto
        const allSizes = await ProductSize.findAll({
            where: { product_id: req.params.id }
        });
        const totalStock = allSizes.reduce((sum, s) => sum + s.stock, 0);

        await Product.update(
            { stock: totalStock },
            { where: { id: req.params.id } }
        );

        res.json({
            message: 'Stock del talle actualizado',
            size: {
                id: productSize.id,
                size: productSize.size,
                stock: productSize.stock
            },
            totalStock
        });
    } catch (error) {
        next(error);
    }
};

// DELETE /api/products/:id - Eliminar producto (admin)
const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        // Eliminar talles asociados
        await ProductSize.destroy({ where: { product_id: product.id } });

        await product.destroy();

        res.json({ message: 'Producto eliminado' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    updateStock,
    updateSizeStock,
    deleteProduct
};
