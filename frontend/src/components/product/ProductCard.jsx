import PropTypes from 'prop-types';
import { ShoppingCart, Heart, Flame, Sparkles, Clock } from 'lucide-react';
import { formatPrice, calculateDiscount } from '@utils/formatters';
import { useFavorites } from '@context/FavoritesContext';
import brandColors from '@utils/brandColors';

const ProductCard = ({ product, onAddToCart, onViewDetail }) => {
    const { toggleFavorite, isFavorite } = useFavorites();
    const isOutOfStock = product.stock === 0;
    const hasDiscount = product.precio_descuento && product.precio_descuento < product.precio;
    const isProductFavorite = isFavorite(product.id);
    const isLowStock = product.stock > 0 && product.stock <= 3;
    const isNew = product.createdAt && (Date.now() - new Date(product.createdAt).getTime()) < 7 * 24 * 60 * 60 * 1000;

    return (
        <div
            onClick={() => onViewDetail(product)}
            className="product-card-animated group cursor-pointer flex flex-col gap-3"
        >
            {/* Contenedor Imagen */}
            <div className="relative aspect-square bg-gray-100 rounded-[2rem] overflow-hidden">

                {/* Badge Descuento */}
                {hasDiscount && !isOutOfStock && (
                    <div style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        zIndex: 10,
                        background: brandColors.magenta,
                        color: brandColors.white,
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '4px 10px',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        boxShadow: '0 2px 8px rgba(255,0,255,0.35)',
                        animation: 'badgePulse 2s ease-in-out infinite',
                    }}>
                        <Flame style={{ width: '12px', height: '12px' }} />
                        -{calculateDiscount(product.precio, product.precio_descuento)}%
                    </div>
                )}

                {/* Badge Últimas Unidades */}
                {isLowStock && !hasDiscount && (
                    <div style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        zIndex: 10,
                        background: '#FEF3C7',
                        color: '#92400E',
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '4px 10px',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        border: '1px solid #FDE68A',
                    }}>
                        <Clock style={{ width: '11px', height: '11px' }} />
                        ¡Últimas {product.stock}!
                    </div>
                )}

                {/* Badge Nuevo */}
                {isNew && !hasDiscount && !isLowStock && (
                    <div style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        zIndex: 10,
                        background: brandColors.cyan,
                        color: brandColors.black,
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '4px 10px',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                    }}>
                        <Sparkles style={{ width: '11px', height: '11px' }} />
                        NUEVO
                    </div>
                )}

                {/* Botón Favorito */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(product);
                    }}
                    className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm hover:scale-110 transition-transform active:scale-95"
                >
                    <Heart
                        size={16}
                        className={isProductFavorite ? "fill-red-500 text-red-500" : "text-red-500"}
                    />
                </button>

                {/* Imagen */}
                <img
                    src={product.imagen_url}
                    alt={product.nombre}
                    className="w-full h-full object-contain p-4 mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                />

                {/* Botón Añadir */}
                {!isOutOfStock && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart(product);
                        }}
                        className="absolute bottom-2 right-4 bg-black text-white p-3 rounded-lg shadow-lg hover:bg-gray-800 transition-all active:scale-90"
                        title="Añadir al carrito"
                        style={{
                            transition: 'transform 0.15s, background 0.2s',
                        }}
                    >
                        <ShoppingCart size={14} />
                    </button>
                )}

                {/* Badge Agotado */}
                {isOutOfStock && (
                    <div className="absolute bottom-3 left-4 z-10">
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-[11px] font-bold shadow-sm">AGOTADO</span>
                    </div>
                )}
            </div>

            {/* Información */}
            <div className="flex flex-col gap-1 px-1">
                {product.category?.nombre && (
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">
                        {product.category.nombre}
                    </span>
                )}

                <h3 className="text-sm font-bold text-gray-900 leading-tight">
                    {product.nombre}
                </h3>

                <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-sm font-bold text-gray-900">
                        {formatPrice(hasDiscount ? product.precio_descuento : product.precio)}
                    </span>
                    {hasDiscount && (
                        <span className="text-xs text-red-500 line-through font-medium decoration-red-500 decoration-1">
                            {formatPrice(product.precio)}
                        </span>
                    )}
                </div>

                {/* Cuotas */}
                {!isOutOfStock && (
                    <p style={{ fontSize: '11px', color: brandColors.success, fontWeight: 500, marginTop: '2px' }}>
                        3 cuotas sin interés de {formatPrice(((hasDiscount ? product.precio_descuento : product.precio) / 3))}
                    </p>
                )}
            </div>

            <style>{`
                @keyframes badgePulse {
                    0%, 100% { box-shadow: 0 2px 8px rgba(255,0,255,0.35); }
                    50% { box-shadow: 0 2px 16px rgba(255,0,255,0.55); }
                }
                .product-card-animated {
                    transition: transform 0.25s ease, box-shadow 0.25s ease;
                }
                .product-card-animated:hover {
                    transform: translateY(-4px);
                }
            `}</style>
        </div>
    );
};

ProductCard.propTypes = {
    product: PropTypes.object.isRequired,
    onAddToCart: PropTypes.func.isRequired,
    onViewDetail: PropTypes.func.isRequired,
};

export default ProductCard;
