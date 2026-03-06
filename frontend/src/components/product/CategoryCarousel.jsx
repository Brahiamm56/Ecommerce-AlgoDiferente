import PropTypes from 'prop-types';

const CategoryCarousel = ({ categories, onCategorySelect }) => {
    // Filtrar la categoría "Todos"
    const visualCategories = categories.filter(cat => cat.id !== 0);

    if (!visualCategories.length) return null;

    // Colores de fondo para cada categoría
    const bgColors = [
        'from-amber-500 to-orange-600',
        'from-blue-500 to-indigo-600',
        'from-emerald-500 to-teal-600',
        'from-pink-500 to-rose-600',
        'from-purple-500 to-violet-600',
        'from-cyan-500 to-blue-600',
    ];

    return (
        <section className="py-4">
            {/* Contenedor con scroll horizontal */}
            <div className="flex gap-3 overflow-x-auto px-4 pb-3 scrollbar-hide">
                {visualCategories.map((category, index) => (
                    <button
                        key={category.id}
                        onClick={() => onCategorySelect(category.slug)}
                        className={`flex-shrink-0 w-36 h-24 sm:w-44 sm:h-28 relative rounded-xl overflow-hidden shadow-lg 
                            bg-gradient-to-br ${bgColors[index % bgColors.length]} 
                            group hover:shadow-xl transition-all duration-300`}
                    >
                        {/* Imagen de fondo si existe */}
                        {category.imagen_url && (
                            <div
                                className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-50 transition-opacity"
                                style={{ backgroundImage: `url(${category.imagen_url})` }}
                            />
                        )}

                        {/* Overlay degradado */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                        {/* Contenido */}
                        <div className="absolute inset-0 p-3 flex flex-col justify-between">
                            <span className="text-white font-bold text-sm drop-shadow-lg">
                                {category.nombre}
                            </span>

                            {/* Badge de descuento opcional */}
                            <div className="flex items-center gap-1">
                                <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full">
                                    Ver más
                                </span>
                            </div>
                        </div>

                        {/* Imagen flotante pequeña si existe */}
                        {category.imagen_url && (
                            <div className="absolute bottom-1 right-1 w-12 h-12 sm:w-16 sm:h-16 opacity-80">
                                <img
                                    src={category.imagen_url}
                                    alt={category.nombre}
                                    className="w-full h-full object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
                                />
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </section>
    );
};

CategoryCarousel.propTypes = {
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

export default CategoryCarousel;
