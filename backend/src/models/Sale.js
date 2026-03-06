const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Sale = sequelize.define('Sale', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0
        }
    },
    payment_method: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            isIn: [['efectivo', 'transferencia', 'tarjeta']]
        }
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    client_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    client_location: {
        type: DataTypes.STRING,
        allowNull: true
    },
    client_phone: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'sales'
});

module.exports = Sale;
