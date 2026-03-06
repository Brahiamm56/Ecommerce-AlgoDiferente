const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Gasto = sequelize.define('Gasto', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'La descripción es requerida' }
        }
    },
    monto: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: { args: [0.01], msg: 'El monto debe ser mayor a 0' }
        }
    },
    categoria: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: {
                args: [['alquiler', 'sueldos', 'servicios', 'mercaderia', 'varios']],
                msg: 'Categoría inválida'
            }
        }
    },
    fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    notas: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'gastos'
});

module.exports = Gasto;
