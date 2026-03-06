import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Trash2, ShoppingCart } from 'lucide-react';
import { useFavorites } from '@context/FavoritesContext';
import { useCart } from '@context/CartContext';
import { formatPrice } from '@utils/formatters';
import brandColors from '@utils/brandColors';
import BottomNavBar from '@components/layout/BottomNavBar';
import WhatsAppButton from '@components/common/WhatsAppButton';
import { useState } from 'react';

const Favorites = () => {
    const navigate = useNavigate();
    const { favorites, removeFromFavorites, clearFavorites } = useFavorites();
    const { addToCart } = useCart();
    const [removingId, setRemovingId] = useState(null);

    const handleViewProduct = (product) => {
        navigate(`/producto/${product.id}`);
    };

    const handleAddToCart = (e, product) => {
        e.stopPropagation();
        addToCart(product);
    };

    const handleRemove = (e, productId) => {
        e.stopPropagation();
        setRemovingId(productId);
        setTimeout(() => {
            removeFromFavorites(productId);
            setRemovingId(null);
        }, 300);
    };

    return (
        <div className="min-h-screen bg-white" style={{ paddingBottom: '100px' }}>
            {/* Ambient Background Gradient */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                height: '30vh',
                background: `linear-gradient(180deg, rgba(0,212,212,0.1) 0%, rgba(255,255,255,0) 100%)`,
                zIndex: 0,
                pointerEvents: 'none'
            }} />

            {/* Header Sticky */}
            <div style={{
                position: 'sticky',
                top: 0,
                zIndex: 40,
                backdropFilter: 'blur(12px)',
                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                borderBottom: '1px solid rgba(0,0,0,0.05)',
            }}>
                <div className="layout-container" style={{
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
                    <button
                        onClick={() => navigate(-1)}
                        style={{
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '12px',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: brandColors.black
                        }}
                    >
                        <ArrowLeft size={24} />
                    </button>

                    <h1 style={{
                        fontSize: '20px',
                        fontWeight: 800,
                        color: brandColors.black,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        margin: 0
                    }}>
                        <Heart fill={brandColors.magenta} color={brandColors.magenta} size={24} />
                        Mis Favoritos
                    </h1>

                    {favorites.length > 0 ? (
                        <button
                            onClick={clearFavorites}
                            style={{
                                fontSize: '14px',
                                fontWeight: 600,
                                color: brandColors.magenta,
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            Limpiar
                        </button>
                    ) : (
                        <div style={{ width: '40px' }} />
                    )}
                </div>
            </div>

            {/* Contenido */}
            <div className="layout-container" style={{ paddingTop: '16px', paddingBottom: '16px', position: 'relative', zIndex: 1 }}>
                {favorites.length === 0 ? (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingTop: '60px',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            width: '120px',
                            height: '120px',
                            background: `linear-gradient(135deg, rgba(0,212,212,0.1), rgba(255,0,255,0.1))`,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '24px',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
                        }}>
                            <Heart size={48} color={brandColors.magenta} />
                        </div>
                        <h2 style={{
                            fontSize: '24px',
                            fontWeight: 800,
                            color: brandColors.black,
                            marginBottom: '12px'
                        }}>
                            Tu lista está vacía
                        </h2>
                        <p style={{
                            color: '#666',
                            marginBottom: '32px',
                            maxWidth: '260px',
                            lineHeight: 1.5
                        }}>
                            Guarda aquí los productos que te encantan para comprarlos después.
                        </p>
                        <button
                            onClick={() => navigate('/')}
                            style={{
                                background: brandColors.black,
                                color: brandColors.white,
                                border: 'none',
                                padding: '16px 32px',
                                borderRadius: '16px',
                                fontSize: '16px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                                transition: 'transform 0.2s'
                            }}
                            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
                            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <ShoppingCart size={20} />
                            Explorar tienda
                        </button>
                    </div>
                ) : (
                    <>
                        <p style={{
                            fontSize: '14px',
                            color: '#888',
                            marginBottom: '16px',
                            fontWeight: 500
                        }}>
                            {favorites.length} {favorites.length === 1 ? 'producto guardado' : 'productos guardados'}
                        </p>

                        <div className="favorites-grid">
                            {favorites.map((product) => (
                                <div
                                    key={product.id}
                                    onClick={() => handleViewProduct(product)}
                                    style={{
                                        background: brandColors.white,
                                        borderRadius: '20px',
                                        padding: '12px',
                                        display: 'flex',
                                        gap: '16px',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                                        border: '1px solid rgba(0,0,0,0.03)',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        transform: removingId === product.id ? 'translateX(-100%)' : 'scale(1)',
                                        opacity: removingId === product.id ? 0 : 1,
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}
                                >
                                    {/* Imagen */}
                                    <div style={{
                                        width: '100px',
                                        height: '100px',
                                        borderRadius: '16px',
                                        overflow: 'hidden',
                                        flexShrink: 0,
                                        backgroundColor: '#f8f8f8'
                                    }}>
                                        <img
                                            src={product.imagen_url}
                                            alt={product.nombre}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover'
                                            }}
                                        />
                                    </div>

                                    {/* Info */}
                                    <div style={{
                                        flex: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between'
                                    }}>
                                        <div>
                                            <h3 style={{
                                                fontSize: '16px',
                                                fontWeight: 700,
                                                color: brandColors.black,
                                                marginBottom: '4px',
                                                lineHeight: 1.3
                                            }}>
                                                {product.nombre}
                                            </h3>
                                            <p style={{
                                                color: brandColors.cyan,
                                                fontSize: '16px',
                                                fontWeight: 800
                                            }}>
                                                {formatPrice(product.precio_descuento || product.precio)}
                                            </p>
                                        </div>

                                        {/* Acciones */}
                                        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                                            <button
                                                onClick={(e) => handleAddToCart(e, product)}
                                                style={{
                                                    flex: 1,
                                                    background: brandColors.cyan,
                                                    color: brandColors.black,
                                                    border: 'none',
                                                    borderRadius: '12px',
                                                    height: '36px',
                                                    fontSize: '13px',
                                                    fontWeight: 600,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '6px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <ShoppingCart size={16} />
                                                Agregar
                                            </button>
                                            <button
                                                onClick={(e) => handleRemove(e, product.id)}
                                                style={{
                                                    width: '36px',
                                                    height: '36px',
                                                    borderRadius: '12px',
                                                    background: '#FEF2F2',
                                                    border: 'none',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: '#EF4444',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            <WhatsAppButton />
            <BottomNavBar />
        </div>
    );
};

export default Favorites;
