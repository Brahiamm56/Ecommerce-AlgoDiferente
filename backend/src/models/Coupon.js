const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Coupon = sequelize.define('Coupon', {
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    discount: {
        type: DataTypes.FLOAT, // Porcentaje o monto
        allowNull: false
    },
    expiration_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
});

module.exports = Coupon;
