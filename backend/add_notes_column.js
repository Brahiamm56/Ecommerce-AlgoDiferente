const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./src/config/database');

const migrate = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        // Check if column exists
        const [results] = await sequelize.query("PRAGMA table_info(sales);");
        const hasNotes = results.some(col => col.name === 'notes');

        if (!hasNotes) {
            console.log('Adding notes column to sales table...');
            await sequelize.query("ALTER TABLE sales ADD COLUMN notes TEXT;");
            console.log('Column added successfully.');
        } else {
            console.log('Column notes already exists.');
        }

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await sequelize.close();
    }
};

migrate();
