require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const app = require('./src/app');
const { sequelize } = require('./src/models');

const PORT = process.env.PORT || 3001;

// Función para iniciar el servidor
const startServer = async () => {
    try {
        // Probar conexión a la base de datos
        await sequelize.authenticate();
        console.log('✅ Conexión a MySQL establecida correctamente');

        // Migración manual de sale_items para soportar ítems manuales
        try {
            const [cols] = await sequelize.query("PRAGMA table_info('sale_items');");
            const hasDescription = cols.some(c => c.name === 'description');
            const productIdCol = cols.find(c => c.name === 'product_id');
            const needsMigration = !hasDescription || (productIdCol && productIdCol.notnull === 1);

            if (needsMigration) {
                console.log('🔄 Migrando tabla sale_items...');
                await sequelize.query('DROP TABLE IF EXISTS sale_items_new;');
                await sequelize.query(`
                    CREATE TABLE sale_items_new (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        sale_id INTEGER NOT NULL REFERENCES sales(id),
                        product_id INTEGER REFERENCES products(id),
                        description VARCHAR(255),
                        size VARCHAR(20),
                        quantity INTEGER NOT NULL,
                        price_at_sale DECIMAL(10,2) NOT NULL,
                        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
                    );
                `);
                // Copiar datos existentes (solo columnas que existen en ambas)
                const existingCols = cols.map(c => c.name).filter(n =>
                    ['id', 'sale_id', 'product_id', 'size', 'quantity', 'price_at_sale', 'created_at', 'updated_at', 'description'].includes(n)
                );
                await sequelize.query(`
                    INSERT INTO sale_items_new (${existingCols.join(',')})
                    SELECT ${existingCols.join(',')} FROM sale_items;
                `);
                await sequelize.query('DROP TABLE sale_items;');
                await sequelize.query('ALTER TABLE sale_items_new RENAME TO sale_items;');
                console.log('✅ Tabla sale_items migrada correctamente');
            }
        } catch (e) { console.error('⚠️ Error en migración sale_items:', e.message); }

        // Limpiar tablas backup que puede haber dejado un alter:true fallido
        try { await sequelize.query('DROP TABLE IF EXISTS categories_backup;'); } catch (e) { }
        try { await sequelize.query('DROP TABLE IF EXISTS users_backup;'); } catch (e) { }

        // Sincronizar modelos con la base de datos
        await sequelize.sync();
        console.log('✅ Modelos sincronizados con la base de datos');

        // Iniciar servidor
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
            console.log(`📦 API disponible en http://localhost:${PORT}/api`);
            console.log(`🔧 Entorno: ${process.env.NODE_ENV || 'development'}`);
        });
    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error.message);
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            console.error('Detalles de validación:', error.errors.map(e => e.message));
        }
        console.error(error);
        process.exit(1);
    }
};

startServer();
