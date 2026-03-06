const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProductSize = sequelize.define('ProductSize', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'products',
            key: 'id'
        }
    },
    size: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0
        }
    }
}, {
    tableName: 'product_sizes'
});

module.exports = ProductSize;
