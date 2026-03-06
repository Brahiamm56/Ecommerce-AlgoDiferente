import { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import bannerImg from '../../assets/banner.jpg';

const HeroCarousel = ({ products, onViewProduct, banner }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    const hasBanner = true;

    const featuredProducts = useMemo(() =>
        products.filter(p => p.destacado && p.imagen_url).slice(0, 4),
        [products]
    );

    const nextSlide = useCallback(() => {
        const totalSlides = featuredProducts.length + (hasBanner ? 1 : 0);
        if (totalSlides <= 1) return;
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, [featuredProducts.length, hasBanner]);

    useEffect(() => {
        const totalSlides = featuredProducts.length + (hasBanner ? 1 : 0);
        if (!isAutoPlaying || totalSlides <= 1) return;
        const interval = setInterval(nextSlide, 4000);
        return () => clearInterval(interval);
    }, [isAutoPlaying, nextSlide, featuredProducts.length, hasBanner]);

    const handleSlideClick = (product) => {
        setIsAutoPlaying(false);
        onViewProduct(product);
    };

    const handleBannerClick = () => {
        if (banner?.link) window.location.href = banner.link;
    };

    const totalSlides = featuredProducts.length + (hasBanner ? 1 : 0);

    return (
        <div style={{ paddingTop: '16px', paddingBottom: '16px' }}>
            <div
                className="hero-aspect"
                style={{
                    position: 'relative',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, #edfcfc 0%, #f5fffe 60%, #f9fafb 100%)',
                    border: '1px solid #d4f4f4',
                    boxShadow: '0 4px 20px rgba(0, 194, 204, 0.08)',
                }}
            >
                {/* Banner slide — imagen completa */}
                {hasBanner && (
                    <div
                        key="banner"
                        onClick={handleBannerClick}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            opacity: currentSlide === 0 ? 1 : 0,
                            transition: 'opacity 0.5s ease',
                            zIndex: currentSlide === 0 ? 1 : 0,
                            pointerEvents: currentSlide === 0 ? 'auto' : 'none',
                            cursor: banner?.link ? 'pointer' : 'default',
                        }}
                    >
                        <img
                            src={bannerImg}
                            alt="Banner Promocional"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />
                        {banner?.text && (
                            <div style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'linear-gradient(to right, rgba(0,0,0,0.55) 0%, transparent 70%)',
                                display: 'flex',
                                alignItems: 'center',
                                padding: '0 clamp(20px, 4vw, 40px)',
                            }}>
                                <h2 style={{
                                    color: '#fff',
                                    fontSize: 'clamp(1.1rem, 3vw, 2.2rem)',
                                    fontWeight: 700,
                                    maxWidth: '60%',
                                    lineHeight: 1.25,
                                    textShadow: '0 2px 8px rgba(0,0,0,0.4)',
                                }}>
                                    {banner.text}
                                </h2>
                            </div>
                        )}
                    </div>
                )}

                {/* Productos destacados */}
                {featuredProducts.map((product, index) => {
                    const slideIndex = index + (hasBanner ? 1 : 0);
                    const isActive = slideIndex === currentSlide;
                    const hasDiscount = product.precio_descuento && product.precio_descuento < product.precio;

                    return (
                        <div
                            key={product.id}
                            onClick={() => handleSlideClick(product)}
                            style={{
                                position: 'absolute',
                                inset: 0,
                                cursor: 'pointer',
                                opacity: isActive ? 1 : 0,
                                transition: 'opacity 0.5s ease',
                                display: 'flex',
                                alignItems: 'center',
                                padding: 'clamp(16px, 3vw, 36px)',
                                zIndex: isActive ? 1 : 0,
                                pointerEvents: isActive ? 'auto' : 'none',
                            }}
                        >
                            {/* Contenido izquierda */}
                            <div style={{ flex: 1, zIndex: 10, paddingRight: '10px' }}>
                                <span style={{
                                    display: 'inline-block',
                                    background: '#00c2cc',
                                    color: '#fff',
                                    fontSize: 'clamp(9px, 1.1vw, 11px)',
                                    fontWeight: 700,
                                    padding: '4px 10px',
                                    borderRadius: '20px',
                                    marginBottom: '10px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                }}>
                                    DESTACADO
                                </span>

                                <h2 style={{
                                    fontSize: 'clamp(15px, 2.3vw, 26px)',
                                    fontWeight: 700,
                                    color: '#111',
                                    lineHeight: 1.2,
                                    marginBottom: '8px',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                }}>
                                    {product.nombre}
                                </h2>

                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                                    <span style={{
                                        fontSize: 'clamp(17px, 2.3vw, 26px)',
                                        fontWeight: 700,
                                        color: '#00c2cc',
                                    }}>
                                        ${hasDiscount ? product.precio_descuento : product.precio}
                                    </span>
                                    {hasDiscount && (
                                        <span style={{
                                            fontSize: 'clamp(11px, 1.3vw, 14px)',
                                            color: '#aaa',
                                            textDecoration: 'line-through',
                                        }}>
                                            ${product.precio}
                                        </span>
                                    )}
                                </div>

                                <button style={{
                                    marginTop: '14px',
                                    padding: 'clamp(8px, 1vw, 11px) clamp(16px, 2vw, 22px)',
                                    background: '#00c2cc',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '10px',
                                    fontWeight: 600,
                                    fontSize: 'clamp(12px, 1.2vw, 14px)',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 14px rgba(0, 194, 204, 0.3)',
                                }}>
                                    Ver Producto
                                </button>
                            </div>

                            {/* Imagen derecha */}
                            <div style={{
                                width: '44%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <img
                                    src={product.imagen_url}
                                    alt={product.nombre}
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '100%',
                                        objectFit: 'contain',
                                        filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.12))',
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}

                {/* Dots indicadores */}
                {totalSlides > 1 && (
                    <div style={{
                        position: 'absolute',
                        bottom: '12px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        gap: '6px',
                        zIndex: 20,
                    }}>
                        {Array.from({ length: totalSlides }).map((_, i) => (
                            <button
                                key={i}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrentSlide(i);
                                    setIsAutoPlaying(false);
                                }}
                                style={{
                                    width: i === currentSlide ? '22px' : '7px',
                                    height: '7px',
                                    borderRadius: '4px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    background: i === currentSlide ? '#00c2cc' : 'rgba(0,0,0,0.18)',
                                    padding: 0,
                                }}
                                aria-label={`Slide ${i + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

HeroCarousel.propTypes = {
    products: PropTypes.array.isRequired,
    onViewProduct: PropTypes.func.isRequired,
    banner: PropTypes.shape({
        active: PropTypes.bool,
        text: PropTypes.string,
        link: PropTypes.string,
        color: PropTypes.string,
    }),
};

export default HeroCarousel;
