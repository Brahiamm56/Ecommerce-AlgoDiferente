const { Sequelize } = require('sequelize');
const path = require('path');

// Configuración de SQLite (no requiere instalación)
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../../database.sqlite'),
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    define: {
        timestamps: true,
        underscored: true,
        freezeTableName: true
    }
});

module.exports = sequelize;
