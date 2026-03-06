import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { formatPrice } from '@utils/formatters';

const PromoBanners = ({ products, onViewProduct }) => {
    const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
    const [currentNewIndex, setCurrentNewIndex] = useState(0);

    const discountedProducts = products
        .filter(p => p.en_oferta && p.precio_descuento && p.precio_descuento < p.precio && p.imagen_url)
        .slice(0, 6);

    const featuredProducts = products
        .filter(p => p.destacado && p.imagen_url)
        .slice(0, 6);

    useEffect(() => {
        if (discountedProducts.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentOfferIndex(prev => (prev + 1) % discountedProducts.length);
        }, 3500);
        return () => clearInterval(interval);
    }, [discountedProducts.length]);

    useEffect(() => {
        if (featuredProducts.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentNewIndex(prev => (prev + 1) % featuredProducts.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [featuredProducts.length]);

    const cardBase = {
        borderRadius: '16px',
        padding: 'clamp(12px, 2vw, 18px)',
        minHeight: '180px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
    };

    const dotActive = (color) => ({
        width: '14px',
        height: '5px',
        borderRadius: '3px',
        background: color,
        transition: 'all 0.3s',
    });

    const dotInactive = {
        width: '5px',
        height: '5px',
        borderRadius: '3px',
        background: 'rgba(0,0,0,0.15)',
        transition: 'all 0.3s',
    };

    return (
        <div style={{ paddingBottom: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>

                {/* Banner Izquierdo — OFERTAS */}
                <div style={{
                    ...cardBase,
                    background: 'linear-gradient(145deg, #fffbf0 0%, #fff8e8 100%)',
                    border: '1.5px solid #fde8b0',
                    boxShadow: '0 2px 12px rgba(245, 197, 24, 0.1)',
                }}>
                    <span style={{
                        background: '#f5c518',
                        color: '#111',
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '3px 9px',
                        borderRadius: '20px',
                        alignSelf: 'flex-start',
                        marginBottom: '8px',
                        lineHeight: 1.2,
                        letterSpacing: '0.3px',
                    }}>
                        OFERTAS
                    </span>

                    {discountedProducts.length > 0 && (
                        <div
                            onClick={() => onViewProduct(discountedProducts[currentOfferIndex])}
                            style={{ flex: 1, cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
                        >
                            <p style={{
                                fontSize: 'clamp(11px, 1.3vw, 13px)',
                                fontWeight: 600,
                                color: '#222',
                                marginBottom: '6px',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis',
                            }}>
                                {discountedProducts[currentOfferIndex].nombre}
                            </p>

                            <div style={{
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minHeight: '60px',
                            }}>
                                <img
                                    src={discountedProducts[currentOfferIndex].imagen_url}
                                    alt=""
                                    style={{
                                        maxHeight: '80px',
                                        maxWidth: '100%',
                                        objectFit: 'contain',
                                        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
                                    }}
                                />
                            </div>

                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '6px' }}>
                                <span style={{
                                    fontSize: 'clamp(13px, 1.5vw, 15px)',
                                    fontWeight: 700,
                                    color: '#e91e8c',
                                }}>
                                    {formatPrice(discountedProducts[currentOfferIndex].precio_descuento)}
                                </span>
                                <span style={{
                                    fontSize: 'clamp(10px, 1.1vw, 12px)',
                                    color: '#bbb',
                                    textDecoration: 'line-through',
                                }}>
                                    {formatPrice(discountedProducts[currentOfferIndex].precio)}
                                </span>
                            </div>
                        </div>
                    )}

                    {discountedProducts.length > 1 && (
                        <div style={{ display: 'flex', gap: '3px', justifyContent: 'center', marginTop: '6px' }}>
                            {discountedProducts.map((_, idx) => (
                                <div key={idx} style={idx === currentOfferIndex ? dotActive('#f5c518') : dotInactive} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Banner Derecho — DESTACADOS */}
                <div style={{
                    ...cardBase,
                    background: 'linear-gradient(145deg, #f0feff 0%, #e8fafa 100%)',
                    border: '1.5px solid #b8efef',
                    boxShadow: '0 2px 12px rgba(0, 194, 204, 0.1)',
                }}>
                    <span style={{
                        background: '#00c2cc',
                        color: '#fff',
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '3px 9px',
                        borderRadius: '20px',
                        alignSelf: 'flex-start',
                        marginBottom: '8px',
                        lineHeight: 1.2,
                        letterSpacing: '0.3px',
                    }}>
                        DESTACADOS
                    </span>

                    {featuredProducts.length > 0 && (
                        <div
                            onClick={() => onViewProduct(featuredProducts[currentNewIndex])}
                            style={{ flex: 1, cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
                        >
                            <p style={{
                                fontSize: 'clamp(11px, 1.3vw, 13px)',
                                fontWeight: 600,
                                color: '#222',
                                marginBottom: '6px',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis',
                            }}>
                                {featuredProducts[currentNewIndex].nombre}
                            </p>

                            <div style={{
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minHeight: '60px',
                            }}>
                                <img
                                    src={featuredProducts[currentNewIndex].imagen_url}
                                    alt=""
                                    style={{
                                        maxHeight: '80px',
                                        maxWidth: '100%',
                                        objectFit: 'contain',
                                        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
                                    }}
                                />
                            </div>

                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '6px' }}>
                                <span style={{
                                    fontSize: 'clamp(13px, 1.5vw, 15px)',
                                    fontWeight: 700,
                                    color: '#00a8b3',
                                }}>
                                    {formatPrice(featuredProducts[currentNewIndex].precio_descuento || featuredProducts[currentNewIndex].precio)}
                                </span>
                            </div>
                        </div>
                    )}

                    {featuredProducts.length > 1 && (
                        <div style={{ display: 'flex', gap: '3px', justifyContent: 'center', marginTop: '6px' }}>
                            {featuredProducts.map((_, idx) => (
                                <div key={idx} style={idx === currentNewIndex ? dotActive('#00c2cc') : dotInactive} />
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

PromoBanners.propTypes = {
    products: PropTypes.array.isRequired,
    onViewProduct: PropTypes.func.isRequired,
};

export default PromoBanners;
