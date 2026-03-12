require('dotenv').config();
const app = require('./src/app');
const { sequelize } = require('./src/models');

const PORT = process.env.PORT || 3001;

// Función para iniciar el servidor
const startServer = async () => {
    try {
        // Probar conexión a la base de datos
        await sequelize.authenticate();
        console.log('✅ Conexión a PostgreSQL establecida correctamente');

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

