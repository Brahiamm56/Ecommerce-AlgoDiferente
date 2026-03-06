import PropTypes from 'prop-types';

const CategoryGrid = ({ categories, onCategorySelect }) => {
    // Filtrar la categoría "Todos" (id: 0) para el grid visual
    const visualCategories = categories.filter(cat => cat.id !== 0);

    if (!visualCategories.length) return null;

    return (
        <section className="px-4 py-6">
            {/* Título */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Categorías</h2>
                <button
                    onClick={() => onCategorySelect('todos')}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                    Ver Todo
                </button>
            </div>

            {/* Grid de categorías */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {visualCategories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => onCategorySelect(category.slug)}
                        className="group relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                    >
                        {/* Imagen de fondo */}
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                            style={{
                                backgroundImage: category.imagen_url
                                    ? `url(${category.imagen_url})`
                                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                            }}
                        />

                        {/* Overlay oscuro */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent group-hover:from-black/80 transition-all duration-300" />

                        {/* Contenido */}
                        <div className="absolute inset-0 flex flex-col items-center justify-end p-4">
                            <h3 className="text-white font-bold text-lg text-center drop-shadow-lg group-hover:scale-105 transition-transform duration-300">
                                {category.nombre}
                            </h3>
                        </div>

                        {/* Borde decorativo al hover */}
                        <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/30 rounded-2xl transition-all duration-300" />
                    </button>
                ))}
            </div>
        </section>
    );
};

CategoryGrid.propTypes = {
    categories: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            nombre: PropTypes.string.isRequired,
            slug: PropTypes.string.isRequired,
            imagen_url: PropTypes.string,
        })
    ).isRequired,
    onCategorySelect: PropTypes.func.isRequired,
};

export default CategoryGrid;
