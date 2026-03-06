const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./src/config/database');

const migrate = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        const columns = ['client_name', 'client_location', 'client_phone'];
        const [tableInfo] = await sequelize.query("PRAGMA table_info(sales);");

        for (const colName of columns) {
            const exists = tableInfo.some(col => col.name === colName);
            if (!exists) {
                console.log(`Adding ${colName} column to sales table...`);
                await sequelize.query(`ALTER TABLE sales ADD COLUMN ${colName} TEXT;`);
                console.log(`${colName} added.`);
            } else {
                console.log(`${colName} already exists.`);
            }
        }

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await sequelize.close();
    }
};

migrate();
