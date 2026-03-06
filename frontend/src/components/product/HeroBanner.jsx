import PropTypes from 'prop-types';
import { ChevronRight } from 'lucide-react';
import { formatPrice } from '@utils/formatters';

const HeroBanner = ({ product, onViewProduct }) => {
    if (!product) return null;

    return (
        <section className="mx-4 my-4">
            <div className="relative h-64 bg-gradient-to-br from-blue-400 via-blue-500 to-cyan-400 rounded-3xl p-6 overflow-hidden shadow-xl">
                {/* Badge destacado */}
                <div className="absolute top-4 left-6">
                    <span className="bg-yellow-400 text-gray-900 font-bold text-xs px-3 py-1 rounded-full shadow-md">
                        DESTACADO
                    </span>
                </div>

                {/* Contenido */}
                <div className="relative h-full flex items-center justify-between pt-6">
                    {/* Texto */}
                    <div className="flex-1 pr-4">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2 leading-tight">
                            {product.nombre}
                        </h2>
                        <p className="text-sm text-white/90 mb-4 leading-relaxed max-w-xs line-clamp-2">
                            {product.descripcion}
                        </p>
                        <div className="flex items-baseline gap-2 mb-4">
                            <span className="text-4xl font-black text-white">
                                {formatPrice(product.precio_descuento || product.precio)}
                            </span>
                            {product.precio_descuento && (
                                <span className="text-xl text-white/60 line-through">
                                    {formatPrice(product.precio)}
                                </span>
                            )}
                        </div>
                        <button
                            onClick={() => onViewProduct && onViewProduct(product)}
                            className="bg-white text-blue-600 font-bold py-2 px-6 rounded-full shadow-lg 
                                hover:shadow-xl hover:scale-105 active:scale-95 
                                transition-all duration-200 flex items-center gap-2 w-fit"
                        >
                            Ver producto
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Imagen producto */}
                    <div className="w-40 h-40 sm:w-48 sm:h-48 bg-red-500 rounded-2xl shadow-2xl overflow-hidden 
                        transform hover:scale-105 transition-transform duration-300 flex-shrink-0">
                        <img
                            src={product.imagen_url}
                            alt={product.nombre}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Decoración de burbujas */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full" />
            </div>
        </section>
    );
};

HeroBanner.propTypes = {
    product: PropTypes.shape({
        id: PropTypes.number.isRequired,
        nombre: PropTypes.string.isRequired,
        descripcion: PropTypes.string,
        precio: PropTypes.number.isRequired,
        precio_descuento: PropTypes.number,
        imagen_url: PropTypes.string.isRequired,
    }),
    onViewProduct: PropTypes.func,
};

export default HeroBanner;
