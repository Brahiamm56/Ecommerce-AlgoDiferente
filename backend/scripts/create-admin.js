/**
 * Script para crear el primer usuario admin en Supabase (produccion).
 * Ejecutar UNA sola vez despues del primer deploy:
 *
 *   DATABASE_URL="postgresql://..." JWT_SECRET="..." node scripts/create-admin.js
 *
 * O si tenes el .env configurado:
 *   node scripts/create-admin.js
 */

require('dotenv').config();

const EMAIL    = process.env.ADMIN_EMAIL    || 'admin@tienda.com';
const PASSWORD = process.env.ADMIN_PASSWORD || 'CambiarEstaPassword123!';
const NOMBRE   = process.env.ADMIN_NOMBRE   || 'Administrador';

const run = async () => {
    if (!process.env.DATABASE_URL) {
        console.error('[ERROR] DATABASE_URL no esta configurada.');
        console.error('        Exportala antes de ejecutar este script:');
        console.error('        DATABASE_URL="postgresql://..." node scripts/create-admin.js');
        process.exit(1);
    }

    const { sequelize, User } = require('../src/models');

    try {
        await sequelize.authenticate();
        console.log('[DB] Conexion exitosa');

        // Crear tablas si no existen (sin borrar nada)
        await sequelize.sync({ force: false });
        console.log('[DB] Tablas sincronizadas');

        // Verificar si ya existe el admin
        const existing = await User.findOne({ where: { email: EMAIL } });
        if (existing) {
            console.log(`[WARN] Ya existe un usuario con email: ${EMAIL}`);
            console.log('       No se creara un duplicado. Script finalizado.');
            process.exit(0);
        }

        const user = await User.create({
            email: EMAIL,
            password: PASSWORD,
            nombre: NOMBRE,
            rol: 'admin'
        });

        console.log('\n=== ADMIN CREADO EXITOSAMENTE ===');
        console.log(`Email   : ${user.email}`);
        console.log(`Nombre  : ${user.nombre}`);
        console.log(`Password: ${PASSWORD}`);
        console.log('=================================');
        console.log('IMPORTANTE: Cambia la password desde el panel admin.\n');

        process.exit(0);
    } catch (err) {
        console.error('[ERROR]', err.message);
        process.exit(1);
    }
};

run();
