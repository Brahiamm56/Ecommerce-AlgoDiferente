const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0
        }
    },
    precio_descuento: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        validate: {
            min: 0
        }
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0
        }
    },
    imagen_url: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    imagen_url_2: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'categories',
            key: 'id'
        }
    },
    destacado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    mas_vendido: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    en_oferta: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'products'
});

// Método virtual para calcular porcentaje de descuento
Product.prototype.getDiscountPercentage = function () {
    if (this.precio_descuento && this.precio > 0) {
        return Math.round((1 - this.precio_descuento / this.precio) * 100);
    }
    return 0;
};

module.exports = Product;
