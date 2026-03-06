const { MercadoPagoConfig, Preference } = require('mercadopago');
const { Product } = require('../models');

// Inicializar cliente de Mercado Pago
const getClient = () => {
    return new MercadoPagoConfig({
        accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
    });
};

// POST /api/payments/create-preference
const createPreference = async (req, res, next) => {
    try {
        const { productId, quantity = 1 } = req.body;

        if (!productId) {
            return res.status(400).json({ error: 'productId es requerido' });
        }

        // Buscar producto en la DB
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        if (product.stock < quantity) {
            return res.status(400).json({ error: 'Stock insuficiente' });
        }

        // Precio final (con descuento si aplica)
        const unitPrice = product.precio_descuento && product.precio_descuento < product.precio
            ? parseFloat(product.precio_descuento)
            : parseFloat(product.precio);

        const client = getClient();
        const preference = new Preference(client);


        const preferenceData = {
            items: [
                {
                    id: String(product.id),
                    title: product.nombre,
                    description: (product.descripcion || product.nombre).substring(0, 256),
                    picture_url: product.imagen_url || '',
                    quantity: parseInt(quantity),
                    unit_price: unitPrice,
                    currency_id: 'ARS',
                }
            ],
        };

        // Solo agregar back_urls si hay una URL pública configurada
        const frontendUrl = process.env.FRONTEND_URL;
        if (frontendUrl) {
            preferenceData.back_urls = {
                success: `${frontendUrl}/pago/exito`,
                failure: `${frontendUrl}/pago/error`,
                pending: `${frontendUrl}/pago/pendiente`,
            };
            preferenceData.auto_return = 'approved';
        }

        const result = await preference.create({ body: preferenceData });

        res.json({
            id: result.id,
            init_point: result.init_point,
            sandbox_init_point: result.sandbox_init_point,
        });
    } catch (error) {
        console.error('Error creando preferencia de MP:', error.message || error);
        res.status(500).json({ error: error.message || 'Error al crear preferencia de pago' });
    }
};

module.exports = { createPreference };
