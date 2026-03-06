const { sequelize } = require('./src/models');
const { Product } = require('./src/models');

async function checkData() {
    try {
        const products = await Product.findAll({
            limit: 5,
            order: [['created_at', 'DESC']],
            attributes: ['id', 'nombre', 'imagen_url', 'imagen_url_2']
        });

        console.log('--- Recent Products ---');
        products.forEach(p => {
            console.log(`ID: ${p.id}, Name: ${p.nombre}`);
            console.log(`  Img 1: ${p.imagen_url}`);
            console.log(`  Img 2: ${p.imagen_url_2}`); // This will be undefined if column doesn't exist in model definition, or null if empty
            console.log('-----------------------');
        });
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkData();
