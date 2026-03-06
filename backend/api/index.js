require('dotenv').config();
const app = require('../src/app');
const { sequelize } = require('../src/models');

// Inicializar DB una vez (se cachea entre invocaciones en el mismo contenedor)
let initialized = false;

const initDB = async () => {
    if (initialized) return;
    await sequelize.authenticate();
    await sequelize.sync();
    initialized = true;
    console.log('DB inicializada');
};

// Iniciar conexion al arrancar el contenedor (no bloquea la respuesta)
initDB().catch(err => console.error('Error al inicializar DB:', err.message));

module.exports = app;
