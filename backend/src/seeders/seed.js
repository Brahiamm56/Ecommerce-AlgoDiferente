/**
 * Seeder para poblar la base de datos con datos iniciales
 * Ejecutar con: npm run seed
 */

require('dotenv').config();
const { sequelize, User, Category, Product } = require('../models');

const seedDatabase = async () => {
    try {
        console.log('🌱 Iniciando seed de la base de datos...\n');

        // Conectar y sincronizar
        await sequelize.authenticate();
        console.log('✅ Conexión a MySQL establecida');

        await sequelize.sync({ force: true }); // ⚠️ Esto borra todos los datos
        console.log('✅ Tablas recreadas\n');

        // 1. Crear usuario admin
        console.log('👤 Creando usuario admin...');
        const admin = await User.create({
            email: 'admin@tienda.com',
            password: 'admin123',
            nombre: 'Administrador',
            rol: 'admin'
        });
        console.log(`   ✅ Admin creado: ${admin.email}\n`);

        // 2. Crear categorías
        console.log('📁 Creando categorías...');
        const categorias = await Category.bulkCreate([
            { nombre: 'Zapatillas', slug: 'zapatillas' },
            { nombre: 'Remeras', slug: 'remeras' },
            { nombre: 'Pantalones', slug: 'pantalones' },
            { nombre: 'Accesorios', slug: 'accesorios' }
        ]);
        console.log(`   ✅ ${categorias.length} categorías creadas\n`);

        // 3. Crear productos
        console.log('📦 Creando productos...');
        const productos = await Product.bulkCreate([
            // Zapatillas (category_id: 1)
            {
                nombre: 'Nike Air Max 270',
                descripcion: 'Zapatillas deportivas con tecnología Air visible. Máxima comodidad y estilo urbano.',
                precio: 90000,
                precio_descuento: 75000,
                stock: 15,
                imagen_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
                category_id: 1,
                destacado: true,
                activo: true
            },
            {
                nombre: 'Adidas Ultraboost',
                descripcion: 'Zapatillas de running con amortiguación Boost. Perfectas para correr y uso diario.',
                precio: 85000,
                precio_descuento: null,
                stock: 10,
                imagen_url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500',
                category_id: 1,
                destacado: false,
                activo: true
            },
            {
                nombre: 'Puma RS-X',
                descripcion: 'Zapatillas retro con diseño chunky. Estilo urbano y comodidad.',
                precio: 65000,
                precio_descuento: 55000,
                stock: 8,
                imagen_url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500',
                category_id: 1,
                destacado: false,
                activo: true
            },
            // Remeras (category_id: 2)
            {
                nombre: 'Remera Nike Dri-FIT',
                descripcion: 'Remera deportiva con tecnología de secado rápido. Ideal para entrenar.',
                precio: 25000,
                precio_descuento: null,
                stock: 30,
                imagen_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
                category_id: 2,
                destacado: false,
                activo: true
            },
            {
                nombre: 'Remera Oversize Premium',
                descripcion: 'Remera de algodón premium con corte oversize. Muy cómoda y moderna.',
                precio: 18000,
                precio_descuento: 15000,
                stock: 25,
                imagen_url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500',
                category_id: 2,
                destacado: true,
                activo: true
            },
            // Pantalones (category_id: 3)
            {
                nombre: 'Jogger Nike Tech Fleece',
                descripcion: 'Pantalón jogger de felpa técnica. Cómodo y con estilo streetwear.',
                precio: 55000,
                precio_descuento: 48000,
                stock: 12,
                imagen_url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500',
                category_id: 3,
                destacado: false,
                activo: true
            },
            {
                nombre: 'Jean Slim Fit Negro',
                descripcion: 'Jean de corte slim en color negro. Versátil y elegante.',
                precio: 35000,
                precio_descuento: null,
                stock: 20,
                imagen_url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500',
                category_id: 3,
                destacado: false,
                activo: true
            },
            // Accesorios (category_id: 4)
            {
                nombre: 'Gorra Nike Heritage',
                descripcion: 'Gorra clásica con logo bordado. Ajuste con hebilla trasera.',
                precio: 12000,
                precio_descuento: 10000,
                stock: 40,
                imagen_url: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500',
                category_id: 4,
                destacado: false,
                activo: true
            },
            {
                nombre: 'Mochila Adidas Original',
                descripcion: 'Mochila espaciosa con compartimento para notebook. Diseño clásico.',
                precio: 42000,
                precio_descuento: null,
                stock: 8,
                imagen_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
                category_id: 4,
                destacado: false,
                activo: true
            }
        ]);
        console.log(`   ✅ ${productos.length} productos creados\n`);

        console.log('═'.repeat(50));
        console.log('🎉 Seed completado exitosamente!\n');
        console.log('📋 Resumen:');
        console.log(`   • 1 usuario admin (admin@tienda.com / admin123)`);
        console.log(`   • ${categorias.length} categorías`);
        console.log(`   • ${productos.length} productos\n`);
        console.log('🚀 Ahora puedes iniciar el servidor con: npm run dev');
        console.log('═'.repeat(50));

        process.exit(0);
    } catch (error) {
        console.error('❌ Error en el seed:', error);
        process.exit(1);
    }
};

seedDatabase();
