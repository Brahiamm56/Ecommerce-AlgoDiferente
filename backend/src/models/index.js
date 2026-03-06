const sequelize = require('../config/database');
const User = require('./User');
const Product = require('./Product');
const Category = require('./Category');
const Banner = require('./Banner');
const Coupon = require('./Coupon');
const ProductSize = require('./ProductSize');
const Sale = require('./Sale');
const SaleItem = require('./SaleItem');
const Gasto = require('./Gasto');
const Proveedor = require('./Proveedor');

// Definir relaciones
Category.hasMany(Product, {
    foreignKey: 'category_id',
    as: 'products'
});

Product.belongsTo(Category, {
    foreignKey: 'category_id',
    as: 'category'
});

Product.hasMany(ProductSize, {
    foreignKey: 'product_id',
    as: 'talles',
    onDelete: 'CASCADE'
});

ProductSize.belongsTo(Product, {
    foreignKey: 'product_id',
    as: 'product'
});

// Relaciones de Ventas
Sale.hasMany(SaleItem, {
    foreignKey: 'sale_id',
    as: 'items',
    onDelete: 'CASCADE'
});

SaleItem.belongsTo(Sale, {
    foreignKey: 'sale_id',
    as: 'sale'
});

SaleItem.belongsTo(Product, {
    foreignKey: 'product_id',
    as: 'product'
});

module.exports = {
    sequelize,
    User,
    Category,
    Product,
    Banner,
    Coupon,
    ProductSize,
    Sale,
    SaleItem,
    Gasto,
    Proveedor
};
