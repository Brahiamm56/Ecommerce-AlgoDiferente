const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, 'database.sqlite'),
    logging: false
});

async function inspect() {
    try {
        await sequelize.authenticate();
        console.log('🔍 Inspeccionando tabla Categories...');

        const categories = await sequelize.query('SELECT * FROM categories', { type: sequelize.QueryTypes.SELECT });
        console.log(`Found ${categories.length} categories.`);

        // Check for ID duplicates
        const ids = categories.map(c => c.id);
        const uniqueIds = new Set(ids);
        if (ids.length !== uniqueIds.size) {
            console.error('❌ SE ENCONTRARON DUPLICADOS DE ID!');
        } else {
            console.log('✅ IDs son únicos.');
        }

        // Check for Slug duplicates
        const slugs = categories.map(c => c.slug);
        const uniqueSlugs = new Set(slugs);
        if (slugs.length !== uniqueSlugs.size) {
            console.error('❌ SE ENCONTRARON DUPLICADOS DE SLUG!');
            // Find duplicate slugs
            const counts = {};
            slugs.forEach(x => { counts[x] = (counts[x] || 0) + 1; });
            const duplicates = Object.keys(counts).filter(x => counts[x] > 1);
            console.log('Duplicated Slugs:', duplicates);
        } else {
            console.log('✅ Slugs son únicos.');
        }

        console.log('Data:', JSON.stringify(categories, null, 2));

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

inspect();
