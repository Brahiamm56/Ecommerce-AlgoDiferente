const { Sequelize } = require('sequelize');

const define = {
    timestamps: true,
    underscored: true,
    freezeTableName: true
};

let sequelize;

if (process.env.DATABASE_URL) {
    // Produccion: PostgreSQL (Supabase u otro proveedor)
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        logging: false,
        define
    });
} else if (process.env.NODE_ENV === 'production') {
    throw new Error('DATABASE_URL es requerida en produccion. Configura la variable de entorno en Vercel.');
} else {
    // Local: SQLite
    const path = require('path');
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: path.join(__dirname, '../../database.sqlite'),
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        define
    });
}

module.exports = sequelize;
