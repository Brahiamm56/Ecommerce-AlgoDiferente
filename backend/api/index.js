require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

let app;
try {
    app = require('../src/app');
} catch (err) {
    console.error('[FATAL] Error cargando app:', err);
    app = (req, res) => res.status(500).json({ error: 'App load failed', detail: err.message });
}

let dbInitialized = false;

const initDB = async () => {
    if (dbInitialized) return;
    try {
        const { sequelize } = require('../src/models');
        await sequelize.authenticate();
        // sync({ force: false }) solo crea tablas si no existen, nunca las borra
        await sequelize.sync({ force: false });
        dbInitialized = true;
        console.log('[DB] Conectado y tablas sincronizadas');
    } catch (err) {
        console.error('[DB] Error de conexion:', err.message);
        // No lanzar el error — la app sigue levantada, el error aparece en los logs
    }
};

initDB().catch(err => console.error('[DB] Unhandled init error:', err.message));

module.exports = app;
