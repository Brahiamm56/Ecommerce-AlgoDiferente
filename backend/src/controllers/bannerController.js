const { Banner } = require('../models');

const bannerController = {
    // Obtener el banner activo (o el último configurado)
    getBanner: async (req, res) => {
        try {
            // Buscamos el último banner creado o actualizado
            let banner = await Banner.findOne({
                order: [['updatedAt', 'DESC']]
            });

            // Si no existe, creamos uno por defecto
            if (!banner) {
                banner = await Banner.create({
                    text: '¡Envío gratis en compras superiores a $50.000!',
                    active: true,
                    color: '#000000'
                });
            }

            res.json(banner);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al obtener el banner' });
        }
    },

    // Actualizar el banner (creamos uno nuevo o actualizamos el existente, tratémoslo como singleton visualmente)
    updateBanner: async (req, res) => {
        try {
            const { text, active, color, link } = req.body;

            // Buscamos el último para actualizarlo
            let banner = await Banner.findOne({
                order: [['updatedAt', 'DESC']]
            });

            if (banner) {
                await banner.update({ text, active, color, link });
            } else {
                banner = await Banner.create({ text, active, color, link });
            }

            res.json(banner);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al actualizar el banner' });
        }
    }
};

module.exports = bannerController;
