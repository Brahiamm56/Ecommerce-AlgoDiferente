const { Sequelize } = require('sequelize');
const path = require('path');

// Configuración directa para conectar a la DB SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, 'database.sqlite'),
    logging: console.log
});

async function cleanup() {
    try {
        console.log('🧹 Iniciando limpieza de tablas temporales...');
        await sequelize.authenticate();

        // Lista de posibles tablas de backup generadas por Sequelize/SQLite que podrían haber quedado "huerfanas"
        const backupTables = [
            'users_backup',
            'categories_backup',
            'products_backup',
            'banners_backup',
            'coupons_backup'
        ];

        for (const table of backupTables) {
            try {
                await sequelize.query(`DROP TABLE IF EXISTS ${table};`);
                console.log(`✅ Tabla ${table} eliminada (si existía).`);
            } catch (e) {
                console.error(`⚠️ Error al intentar eliminar ${table}:`, e.message);
            }
        }

        console.log('✨ Limpieza completada. Ahora puedes intentar iniciar el servidor nuevamente.');
    } catch (error) {
        console.error('❌ Error general durante la limpieza:', error);
    }
}

cleanup();
