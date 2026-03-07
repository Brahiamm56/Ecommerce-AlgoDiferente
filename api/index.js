require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

let app;
try {
    app = require('../backend/src/app');
} catch (err) {
    console.error('[FATAL] Error cargando app:', err);
    app = (req, res) => res.status(500).json({ error: 'App load failed', detail: err.message });
}

let dbInitialized = false;

const initDB = async () => {
    if (dbInitialized) return;
    try {
        const { sequelize } = require('../backend/src/models');
        await sequelize.authenticate();
        await sequelize.sync({ force: false });
        dbInitialized = true;
        console.log('[DB] Conectado y tablas sincronizadas');
    } catch (err) {
        console.error('[DB] Error de conexion:', err.message);
    }
};

initDB();

module.exports = app;
