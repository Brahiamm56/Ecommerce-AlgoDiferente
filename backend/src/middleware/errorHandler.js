// Middleware centralizado para manejo de errores
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Errores de Sequelize
    if (err.name === 'SequelizeValidationError') {
        const errors = err.errors.map(e => ({
            field: e.path,
            message: e.message
        }));
        return res.status(400).json({
            error: 'Error de validación',
            details: errors
        });
    }

    if (err.name === 'SequelizeUniqueConstraintError') {
        const field = err.errors[0]?.path || 'campo';
        return res.status(400).json({
            error: `El ${field} ya existe`
        });
    }

    if (err.name === 'SequelizeForeignKeyConstraintError') {
        return res.status(400).json({
            error: 'Error de referencia. El registro relacionado no existe.'
        });
    }

    // Error genérico
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Error interno del servidor';

    res.status(statusCode).json({
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = errorHandler;
