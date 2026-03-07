const { sequelize, Sale, SaleItem, Product, ProductSize } = require('../models');

// POST /api/sales - Crear venta con transacción
const createSale = async (req, res, next) => {
    const t = await sequelize.transaction();

    try {
        const { items, payment_method, notes, client_name, client_location, client_phone } = req.body;

        // Validaciones básicas
        if (!items || !Array.isArray(items) || items.length === 0) {
            await t.rollback();
            return res.status(400).json({ error: 'La venta debe tener al menos un producto' });
        }

        if (!payment_method || !['efectivo', 'transferencia', 'tarjeta'].includes(payment_method)) {
            await t.rollback();
            return res.status(400).json({ error: 'Método de pago inválido. Use: efectivo, transferencia o tarjeta' });
        }

        let total = 0;
        const saleItems = [];

        // Procesar cada item
        for (const item of items) {
            const { product_id, description, size, quantity, price } = item;

            // Validar campos mínimos
            if (!quantity || quantity < 1 || !price) {
                await t.rollback();
                return res.status(400).json({
                    error: `Item inválido: se requiere quantity (>=1) y price`
                });
            }

            // === ITEM MANUAL (sin product_id) ===
            if (!product_id) {
                if (!description || !description.trim()) {
                    await t.rollback();
                    return res.status(400).json({
                        error: 'Los ítems manuales requieren una descripción'
                    });
                }
                total += price * quantity;
                saleItems.push({
                    product_id: null,
                    description: description.trim(),
                    size: null,
                    quantity,
                    price_at_sale: price
                });
                continue;
            }

            // === ITEM CON PRODUCTO (flujo normal con stock) ===
            if (!size) {
                await t.rollback();
                return res.status(400).json({
                    error: `Item inválido: se requiere size para productos del inventario`
                });
            }

            //  r el talle del producto
            const productSize = await ProductSize.findOne({
                where: {
                    product_id: product_id,
                    size: size
                },
                transaction: t
            });

            if (!productSize) {
                await t.rollback();
                return res.status(404).json({
                    error: `Talle "${size}" no encontrado para el producto ID ${product_id}`
                });
            }

            // Verificar stock suficiente
            if (productSize.stock < quantity) {
                await t.rollback();
                return res.status(400).json({
                    error: `Stock insuficiente para talle "${size}" del producto ID ${product_id}. Disponible: ${productSize.stock}, solicitado: ${quantity}`
                });
            }

            // Descontar stock del talle
            productSize.stock -= quantity;
            await productSize.save({ transaction: t });

            // Recalcular stock total del producto
            const allSizes = await ProductSize.findAll({
                where: { product_id: product_id },
                transaction: t
            });
            const totalProductStock = allSizes.reduce((sum, s) => sum + s.stock, 0);
            await Product.update(
                { stock: totalProductStock },
                { where: { id: product_id }, transaction: t }
            );

            total += price * quantity;
            saleItems.push({
                product_id,
                description: null,
                size,
                quantity,
                price_at_sale: price
            });
        }

        // Crear la venta
        const sale = await Sale.create({
            total: Math.round(total * 100) / 100,
            payment_method,
            notes,
            client_name,
            client_location,
            client_phone,
            date: new Date()
        }, { transaction: t });

        // Crear los items de la venta
        await SaleItem.bulkCreate(
            saleItems.map(item => ({
                ...item,
                sale_id: sale.id
            })),
            { transaction: t }
        );

        // Commit de la transacción
        await t.commit();

        // Recargar con items y productos
        const fullSale = await Sale.findByPk(sale.id, {
            include: [{
                model: SaleItem,
                as: 'items',
                include: [{
                    model: Product,
                    as: 'product',
                    attributes: ['id', 'nombre', 'imagen_url']
                }]
            }]
        });

        res.status(201).json({
            message: 'Venta registrada exitosamente',
            sale: fullSale
        });

    } catch (error) {
        await t.rollback();
        next(error);
    }
};

// GET /api/sales - Listar ventas
const getSales = async (req, res, next) => {
    try {
        const { page = 1, limit = 20, from, to, search, is_leonesa } = req.query;
        const where = {};
        const { Op } = require('sequelize');

        // Filtro La Leonesa (ventas aparte)
        if (is_leonesa === 'true') {
            // Si es Leonesa, buscar ventas que tengan nombre de cliente (o flag específico si tuvieramos)
            where.client_name = { [Op.ne]: null };
        } else {
            // Si es venta normal, buscar ventas SIN nombre de cliente (para separarlas)
            where.client_name = { [Op.is]: null };
        }

        // Filtro por búsqueda (id, notas, cliente, ubicación)
        if (search) {
            where[Op.or] = [
                ...(!isNaN(search) ? [{ id: search }] : []),
                { notes: { [Op.iLike]: `%${search}%` } },
                { client_name: { [Op.iLike]: `%${search}%` } },
                { client_location: { [Op.iLike]: `%${search}%` } }
            ];
        }

        // Filtro por rango de fechas
        if (from || to) {
            where.date = {};
            if (from) where.date[Op.gte] = new Date(from);
            if (to) where.date[Op.lte] = new Date(to + 'T23:59:59');
        }

        const offset = (parseInt(page) - 1) * parseInt(limit);

        const { count, rows: sales } = await Sale.findAndCountAll({
            where,
            include: [{
                model: SaleItem,
                as: 'items',
                include: [{
                    model: Product,
                    as: 'product',
                    attributes: ['id', 'nombre', 'imagen_url']
                }]
            }],
            order: [['date', 'DESC']],
            limit: parseInt(limit),
            offset,
            distinct: true
        });

        res.json({
            sales,
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

// GET /api/sales/:id - Detalle de venta
const getSale = async (req, res, next) => {
    try {
        const sale = await Sale.findByPk(req.params.id, {
            include: [{
                model: SaleItem,
                as: 'items',
                include: [{
                    model: Product,
                    as: 'product',
                    attributes: ['id', 'nombre', 'imagen_url', 'precio']
                }]
            }]
        });

        if (!sale) {
            return res.status(404).json({ error: 'Venta no encontrada' });
        }

        res.json({ sale });
    } catch (error) {
        next(error);
    }
};

// GET /api/sales/stats - Dashboard statistics
const getSalesStats = async (req, res, next) => {
    try {
        const { Op } = require('sequelize');

        // Date ranges
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const sevenDaysAgo = new Date(todayStart);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

        // === KPIs ===
        // Today
        const todaySales = await Sale.findAll({
            where: { date: { [Op.gte]: todayStart } },
            attributes: [
                [sequelize.fn('COALESCE', sequelize.fn('SUM', sequelize.col('total')), 0), 'total'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            raw: true
        });

        // This month
        const monthSales = await Sale.findAll({
            where: { date: { [Op.gte]: monthStart } },
            attributes: [
                [sequelize.fn('COALESCE', sequelize.fn('SUM', sequelize.col('total')), 0), 'total'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            raw: true
        });

        // Average ticket (all time)
        const avgTicket = await Sale.findAll({
            attributes: [
                [sequelize.fn('COALESCE', sequelize.fn('AVG', sequelize.col('total')), 0), 'avg']
            ],
            raw: true
        });

        // === Last 7 days (for bar chart) ===
        const last7Sales = await Sale.findAll({
            where: { date: { [Op.gte]: sevenDaysAgo } },
            attributes: [
                [sequelize.fn('DATE', sequelize.col('date')), 'day'],
                [sequelize.fn('SUM', sequelize.col('total')), 'total'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            group: [sequelize.fn('DATE', sequelize.col('date'))],
            order: [[sequelize.fn('DATE', sequelize.col('date')), 'ASC']],
            raw: true
        });

        // Fill missing days with 0
        const dailyData = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date(todayStart);
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const found = last7Sales.find(s => s.day === dateStr);
            dailyData.push({
                date: dateStr,
                label: d.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric' }),
                total: found ? parseFloat(found.total) : 0,
                count: found ? parseInt(found.count) : 0
            });
        }

        // === Payment method breakdown (this month) ===
        const paymentBreakdown = await Sale.findAll({
            where: { date: { [Op.gte]: monthStart } },
            attributes: [
                'payment_method',
                [sequelize.fn('SUM', sequelize.col('total')), 'total'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            group: ['payment_method'],
            raw: true
        });

        // === Top 5 products (this month) ===
        const topProducts = await SaleItem.findAll({
            attributes: [
                'product_id',
                [sequelize.fn('SUM', sequelize.col('quantity')), 'total_quantity'],
                [sequelize.fn('SUM', sequelize.literal('quantity * price_at_sale')), 'total_revenue']
            ],
            include: [{
                model: Product,
                as: 'product',
                attributes: ['id', 'nombre', 'imagen_url'],
            }],
            where: {
                sale_id: {
                    [Op.in]: sequelize.literal(
                        `(SELECT id FROM sales WHERE date >= '${monthStart.toISOString()}')`
                    )
                }
            },
            group: ['product_id', 'product.id', 'product.nombre', 'product.imagen_url'],
            order: [[sequelize.fn('SUM', sequelize.col('quantity')), 'DESC']],
            limit: 5,
            raw: false
        });

        // === Recent sales (last 10) ===
        const recentSales = await Sale.findAll({
            include: [{
                model: SaleItem,
                as: 'items',
                include: [{
                    model: Product,
                    as: 'product',
                    attributes: ['id', 'nombre']
                }]
            }],
            order: [['date', 'DESC']],
            limit: 10
        });

        res.json({
            kpis: {
                today_total: parseFloat(todaySales[0]?.total || 0),
                today_count: parseInt(todaySales[0]?.count || 0),
                month_total: parseFloat(monthSales[0]?.total || 0),
                month_count: parseInt(monthSales[0]?.count || 0),
                avg_ticket: parseFloat(parseFloat(avgTicket[0]?.avg || 0).toFixed(0)),
            },
            daily: dailyData,
            payment_methods: paymentBreakdown.map(p => ({
                method: p.payment_method,
                total: parseFloat(p.total),
                count: parseInt(p.count)
            })),
            top_products: topProducts.map(tp => ({
                id: tp.product?.id,
                name: tp.product?.nombre || 'Producto eliminado',
                image: tp.product?.imagen_url,
                quantity: parseInt(tp.getDataValue('total_quantity')),
                revenue: parseFloat(tp.getDataValue('total_revenue'))
            })),
            recent_sales: recentSales
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    createSale,
    getSales,
    getSale,
    getSalesStats
};
