import { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { ChevronLeft, ChevronRight, TrendingUp, ShoppingCart } from 'lucide-react';
import { formatPrice } from '@utils/formatters';
import { useCart } from '@context/CartContext';

const BestSellersCarousel = ({ products, onViewProduct }) => {
    const scrollRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const { addToCart } = useCart();

    const bestSellers = products
        .filter(p => p.mas_vendido)
        .slice(0, 8);

    if (bestSellers.length === 0) return null;

    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    const scroll = (direction) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -250 : 250,
                behavior: 'smooth',
            });
        }
    };

    return (
        <div style={{ padding: '24px 0', background: '#f8f9fa' }}>
            <style>{`
                .bsc-nav-btn {
                    width: 34px;
                    height: 34px;
                    border-radius: 50%;
                    border: 1.5px solid #e0e0e0;
                    background: #fff;
                    color: #555;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background 0.2s, border-color 0.2s, color 0.2s;
                    padding: 0;
                    flex-shrink: 0;
                }
                .bsc-nav-btn:hover:not(:disabled) {
                    background: #00c2cc;
                    border-color: #00c2cc;
                    color: #fff;
                }
                .bsc-nav-btn:disabled {
                    opacity: 0.3;
                    cursor: not-allowed;
                }
                .bsc-scroll::-webkit-scrollbar { display: none; }
                .bsc-card {
                    flex-shrink: 0;
                    width: 170px;
                    background: #fff;
                    border: 1.5px solid #f0f0f0;
                    border-radius: 16px;
                    overflow: hidden;
                    cursor: pointer;
                    scroll-snap-align: start;
                    position: relative;
                    transition: box-shadow 0.22s, transform 0.22s;
                }
                .bsc-card:hover {
                    box-shadow: 0 8px 28px rgba(0, 194, 204, 0.18);
                    transform: translateY(-3px);
                }
                .bsc-card:hover .bsc-img {
                    transform: scale(1.06);
                }
                .bsc-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.3s ease;
                }
                .bsc-add-btn {
                    width: 100%;
                    padding: 8px;
                    border-radius: 10px;
                    border: none;
                    background: #00c2cc;
                    color: #fff;
                    font-weight: 700;
                    font-size: 12px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 5px;
                    transition: background 0.2s;
                }
                .bsc-add-btn:hover:not(:disabled) {
                    background: #00a8b3;
                }
                .bsc-add-btn:disabled {
                    background: #e5e7eb;
                    color: #9ca3af;
                    cursor: not-allowed;
                }
                @media (min-width: 768px) {
                    .bsc-card { width: 210px; }
                }
                @media (min-width: 1024px) {
                    .bsc-card { width: 230px; }
                }
            `}</style>

            {/* Header */}
            <div className="layout-container" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                        width: '36px',
                        height: '36px',
                        background: '#00c2cc',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                    }}>
                        <TrendingUp style={{ width: '20px', height: '20px', color: '#fff' }} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#111', margin: 0 }}>
                            Más Vendidos
                        </h2>
                        <p style={{ fontSize: '11px', color: '#888', margin: 0 }}>
                            Los favoritos de nuestros clientes
                        </p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                        className="bsc-nav-btn"
                        onClick={() => scroll('left')}
                        disabled={!canScrollLeft}
                        aria-label="Anterior"
                    >
                        <ChevronLeft style={{ width: '18px', height: '18px' }} />
                    </button>
                    <button
                        className="bsc-nav-btn"
                        onClick={() => scroll('right')}
                        disabled={!canScrollRight}
                        aria-label="Siguiente"
                    >
                        <ChevronRight style={{ width: '18px', height: '18px' }} />
                    </button>
                </div>
            </div>

            {/* Carousel */}
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="layout-container bsc-scroll"
                style={{
                    display: 'flex',
                    gap: '12px',
                    overflowX: 'auto',
                    scrollSnapType: 'x mandatory',
                    paddingBottom: '6px',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                }}
            >
                {bestSellers.map((product) => {
                    const hasDiscount = product.precio_descuento && product.precio_descuento < product.precio;
                    const discountPct = hasDiscount
                        ? Math.round((1 - product.precio_descuento / product.precio) * 100)
                        : 0;
                    const outOfStock = !product.stock || product.stock <= 0;

                    return (
                        <div
                            key={product.id}
                            className="bsc-card"
                            onClick={() => onViewProduct(product)}
                        >
                            {/* Badge descuento */}
                            {hasDiscount && (
                                <div style={{
                                    position: 'absolute',
                                    top: '8px',
                                    left: '8px',
                                    zIndex: 10,
                                    background: '#e91e8c',
                                    color: '#fff',
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    padding: '3px 7px',
                                    borderRadius: '6px',
                                    lineHeight: 1.2,
                                }}>
                                    -{discountPct}%
                                </div>
                            )}

                            {/* Imagen cuadrada */}
                            <div style={{
                                width: '100%',
                                aspectRatio: '1 / 1',
                                background: '#f5f5f5',
                                overflow: 'hidden',
                            }}>
                                <img
                                    className="bsc-img"
                                    src={product.imagen_url}
                                    alt={product.nombre}
                                    loading="lazy"
                                />
                            </div>

                            {/* Info */}
                            <div style={{ padding: '10px 12px 12px' }}>
                                <p style={{
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    color: '#111',
                                    margin: '0 0 5px 0',
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap',
                                    textOverflow: 'ellipsis',
                                }}>
                                    {product.nombre}
                                </p>

                                <div style={{
                                    display: 'flex',
                                    alignItems: 'baseline',
                                    gap: '5px',
                                    marginBottom: '10px',
                                }}>
                                    <span style={{ fontSize: '15px', fontWeight: 700, color: '#111' }}>
                                        {formatPrice(hasDiscount ? product.precio_descuento : product.precio)}
                                    </span>
                                    {hasDiscount && (
                                        <span style={{
                                            fontSize: '11px',
                                            color: '#bbb',
                                            textDecoration: 'line-through',
                                        }}>
                                            {formatPrice(product.precio)}
                                        </span>
                                    )}
                                </div>

                                <button
                                    className="bsc-add-btn"
                                    disabled={outOfStock}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (!outOfStock) addToCart(product);
                                    }}
                                >
                                    <ShoppingCart style={{ width: '13px', height: '13px' }} />
                                    {outOfStock ? 'Sin stock' : 'Agregar'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

BestSellersCarousel.propTypes = {
    products: PropTypes.array.isRequired,
    onViewProduct: PropTypes.func.isRequired,
};

export default BestSellersCarousel;
