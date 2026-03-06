const { Coupon } = require('../models');

const couponController = {
    getAll: async (req, res) => {
        try {
            const coupons = await Coupon.findAll({
                order: [['createdAt', 'DESC']]
            });
            res.json(coupons);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener cupones' });
        }
    },

    create: async (req, res) => {
        try {
            const { code, discount, expiration_date, active } = req.body;
            const newCoupon = await Coupon.create({ code, discount, expiration_date, active });
            res.status(201).json(newCoupon);
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({ message: 'El código ya existe' });
            }
            res.status(500).json({ message: 'Error al crear cupón' });
        }
    },

    delete: async (req, res) => {
        try {
            const { id } = req.params;
            await Coupon.destroy({ where: { id } });
            res.json({ message: 'Cupón eliminado' });
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar cupón' });
        }
    },

    toggleActive: async (req, res) => {
        try {
            const { id } = req.params;
            const coupon = await Coupon.findByPk(id);
            if (!coupon) return res.status(404).json({ message: 'Cupón no encontrado' });

            await coupon.update({ active: !coupon.active });
            res.json(coupon);
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar cupón' });
        }
    }
};

module.exports = couponController;
