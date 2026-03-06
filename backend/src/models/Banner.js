const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Banner = sequelize.define('Banner', {
    text: {
        type: DataTypes.STRING,
        allowNull: false
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    color: {
        type: DataTypes.STRING,
        defaultValue: '#000000'
    },
    link: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

module.exports = Banner;
