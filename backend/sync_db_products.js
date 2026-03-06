const sequelize = require('./src/config/database');
const Product = require('./src/models/Product');

(async () => {
    try {
        await sequelize.authenticate();
        console.log('DB connected');
        await Product.sync({ alter: true });
        console.log('Product table synced (mas_vendido, en_oferta added)');
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
})();
