import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Heart, Share2, Minus, Plus, Check, Truck, Shield, RotateCcw, AlertTriangle, PackageOpen } from 'lucide-react';
import ProductCard from '../components/product/ProductCard';
import WhatsAppIcon from '../components/common/WhatsAppIcon';
import { productService } from '@services/api';
import { formatPrice, calculateDiscount } from '@utils/formatters';
import { useCart } from '@context/CartContext';
import { useFavorites } from '@context/FavoritesContext';
import brandColors from '@utils/brandColors';
import toast from 'react-hot-toast';

// brandColors imported from @utils/brandColors

const ProductDetail = () => {
    const { addToCart } = useCart();
    const { toggleFavorite, isFavorite } = useFavorites();
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [mpLoading, setMpLoading] = useState(false);
    const [selectedSize, setSelectedSize] = useState(null);

    useEffect(() => {
        setCurrentImageIndex(0);
    }, [id]);

    useEffect(() => {
        const loadProduct = async () => {
            try {
                setLoading(true);
                setImageLoaded(false);
                const data = await productService.getById(id);
                setProduct(data.product);

                if (data.product?.id_categoria) {
                    const relatedData = await productService.getAll({ categoria: data.product.category?.slug });
                    setRelatedProducts(
                        (relatedData.products || [])
                            .filter(p => p.id !== data.product.id)
                            .slice(0, 4)
                    );
                }
            } catch (err) {
                console.error('Error:', err);
                setError('No se pudo cargar el producto');
                toast.error('Error al cargar el producto');
            } finally {
                setLoading(false);
            }
        };
        loadProduct();
        window.scrollTo(0, 0);
    }, [id]);

    const talles = product?.talles || [];
    const hasTalles = talles.length > 0;

    const handleSelectSize = (talle) => {
        if (talle.stock === 0) return;
        setSelectedSize(talle);
        setQuantity(1);
    };

    const currentStock = hasTalles
        ? (selectedSize ? selectedSize.stock : 0)
        : product?.stock || 0;

    const canPurchase = hasTalles ? (selectedSize && selectedSize.stock > 0) : (product?.stock > 0);

    const handleAddToCart = () => {
        if (hasTalles && !selectedSize) {
            toast.error('Seleccioná un talle');
            return;
        }
        const cartItem = { ...product, selectedSize: selectedSize?.size || null };
        addToCart(cartItem, quantity);
        toast.success(`${quantity}x ${product.nombre}${selectedSize ? ` (${selectedSize.size})` : ''} agregado al carrito`);
    };

    const handleBuyNow = () => {
        if (hasTalles && !selectedSize) {
            toast.error('Seleccioná un talle');
            return;
        }
        const sizeText = selectedSize ? `\nTalle: ${selectedSize.size}` : '';
        const message = `Hola! Me interesa el producto:\n\n*${product.nombre}*${sizeText}\nCantidad: ${quantity}\nPrecio: ${formatPrice((product.precio_descuento || product.precio) * quantity)}`;
        const whatsappUrl = `https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: product.nombre,
                    text: `Mira este producto: ${product.nombre}`,
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success('Enlace copiado al portapapeles');
        }
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', background: brandColors.white, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '48px', height: '48px', border: '3px solid #E5E7EB', borderTopColor: brandColors.cyan, borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
                    <p style={{ color: '#6B7280', fontSize: '14px' }}>Cargando producto...</p>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div style={{ minHeight: '100vh', background: brandColors.grayLight, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
                <div style={{ width: '80px', height: '80px', background: '#FEE2E2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', color: '#DC2626' }}>
                    <PackageOpen size={32} />
                </div>
                <p style={{ color: '#6B7280', marginBottom: '16px' }}>{error || 'Producto no encontrado'}</p>
                <button
                    onClick={() => navigate('/')}
                    style={{ color: brandColors.cyan, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
                >
                    Volver al inicio
                </button>
            </div>
        );
    }

    const hasDiscount = product.precio_descuento && product.precio_descuento < product.precio;
    const discountPercent = hasDiscount ? calculateDiscount(product.precio, product.precio_descuento) : 0;
    const isOutOfStock = hasTalles
        ? talles.every(t => t.stock === 0)
        : product.stock === 0;
    const finalPrice = hasDiscount ? product.precio_descuento : product.precio;
    const isProductFavorite = isFavorite(product.id);
    const images = product ? [product.imagen_url, product.imagen_url_2].filter(Boolean) : [];

    const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);
    const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

    const ActionBar = () => (
        <div className="product-action-bar" style={{
            background: brandColors.black,
            padding: '12px 16px',
            paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            zIndex: 50,
        }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ flex: '0 0 auto' }}>
                    <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>Total</p>
                    <p style={{ fontSize: '18px', fontWeight: 700, color: brandColors.white }}>
                        {formatPrice(finalPrice * quantity)}
                    </p>
                </div>

                <button
                    onClick={handleAddToCart}
                    disabled={!canPurchase}
                    style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '14px',
                        borderRadius: '12px',
                        border: 'none',
                        cursor: !canPurchase ? 'not-allowed' : 'pointer',
                        fontWeight: 600,
                        fontSize: '14px',
                        background: !canPurchase ? '#333' : brandColors.cyan,
                        color: !canPurchase ? '#666' : brandColors.black,
                        boxShadow: !canPurchase ? 'none' : `0 4px 12px rgba(0,212,212,0.3)`,
                    }}
                >
                    <ShoppingCart style={{ width: '18px', height: '18px' }} />
                    Agregar
                </button>

                <button
                    onClick={handleBuyNow}
                    disabled={!canPurchase}
                    style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '14px',
                        borderRadius: '12px',
                        border: 'none',
                        cursor: !canPurchase ? 'not-allowed' : 'pointer',
                        fontWeight: 600,
                        fontSize: '14px',
                        background: !canPurchase ? '#333' : '#22C55E',
                        color: !canPurchase ? '#666' : brandColors.white,
                        boxShadow: !canPurchase ? 'none' : '0 4px 12px rgba(34,197,94,0.3)',
                    }}
                >
                    <WhatsAppIcon size={18} />
                    Comprar
                </button>
            </div>

            <button
                onClick={async () => {
                    if (!canPurchase || mpLoading) return;
                    setMpLoading(true);
                    try {
                        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
                        const response = await fetch(`${API_URL}/payments/create-preference`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ productId: product.id, quantity }),
                        });
                        const data = await response.json();
                        if (data.init_point) {
                            window.location.href = data.init_point;
                        } else {
                            toast.error('Error al crear el pago');
                        }
                    } catch (err) {
                        console.error('Error MP:', err);
                        toast.error('Error al conectar con Mercado Pago');
                    } finally {
                        setMpLoading(false);
                    }
                }}
                disabled={!canPurchase || mpLoading}
                style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    padding: '14px',
                    borderRadius: '12px',
                    border: 'none',
                    cursor: !canPurchase || mpLoading ? 'not-allowed' : 'pointer',
                    fontWeight: 700,
                    fontSize: '14px',
                    background: !canPurchase ? '#333' : '#009EE3',
                    color: !canPurchase ? '#666' : '#FFFFFF',
                    boxShadow: !canPurchase ? 'none' : '0 4px 12px rgba(0,158,227,0.3)',
                    opacity: mpLoading ? 0.7 : 1,
                    transition: 'opacity 0.2s',
                }}
            >
                {mpLoading ? (
                    <div style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="currentColor" />
                        <path d="M8 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                )}
                {mpLoading ? 'Procesando...' : 'Pagar con Mercado Pago'}
            </button>
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', background: brandColors.white, paddingBottom: '100px' }}>
            {/* Header Fixed */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 50,
                background: brandColors.black,
            }}>
                <div className="header-inner" style={{ padding: '12px 16px' }}>
                    <button
                        onClick={() => navigate(-1)}
                        style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px', background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer' }}
                    >
                        <ArrowLeft style={{ width: '20px', height: '20px', color: brandColors.white }} />
                    </button>

                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            onClick={() => toggleFavorite(product)}
                            style={{
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '10px',
                                border: 'none',
                                cursor: 'pointer',
                                background: isProductFavorite ? brandColors.magenta : 'rgba(255,255,255,0.1)',
                                color: brandColors.white,
                            }}
                        >
                            <Heart style={{ width: '20px', height: '20px', fill: isProductFavorite ? 'currentColor' : 'none' }} />
                        </button>
                        <button
                            onClick={handleShare}
                            style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px', background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer' }}
                        >
                            <Share2 style={{ width: '20px', height: '20px', color: brandColors.white }} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content - 2 column on desktop */}
            <div className="product-detail-layout" style={{ paddingTop: '64px' }}>

                {/* Image Section */}
                <div className="product-detail-image">
                    <div style={{
                        position: 'relative',
                        aspectRatio: '1/1',
                        background: `linear-gradient(180deg, ${brandColors.grayLight} 0%, #E8E8E8 100%)`,
                        overflow: 'hidden',
                        borderRadius: '0',
                    }}>
                        <style>{`
                            @media (min-width: 1024px) {
                                .pd-image-container { border-radius: 20px !important; }
                            }
                        `}</style>

                        {hasDiscount && !isOutOfStock && (
                            <div style={{
                                position: 'absolute',
                                top: '16px',
                                left: '16px',
                                zIndex: 10,
                                background: brandColors.magenta,
                                color: brandColors.white,
                                fontSize: '14px',
                                fontWeight: 700,
                                padding: '8px 14px',
                                borderRadius: '20px',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
                            }}>
                                -{discountPercent}% OFF
                            </div>
                        )}

                        {isOutOfStock && (
                            <div style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'rgba(0,0,0,0.6)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 10,
                            }}>
                                <span style={{ background: brandColors.white, color: brandColors.black, fontWeight: 700, padding: '12px 24px', borderRadius: '999px', fontSize: '16px' }}>
                                    AGOTADO
                                </span>
                            </div>
                        )}

                        <img
                            key={currentImageIndex}
                            src={images[currentImageIndex]}
                            alt={`${product.nombre} - Vista ${currentImageIndex + 1}`}
                            onLoad={() => setImageLoaded(true)}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                padding: '24px',
                                opacity: imageLoaded ? 1 : 0,
                                transition: 'opacity 0.3s ease',
                                filter: isOutOfStock ? 'grayscale(1)' : 'drop-shadow(0 8px 16px rgba(0,0,0,0.15))',
                            }}
                        />

                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    style={{
                                        position: 'absolute',
                                        left: '12px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'rgba(255,255,255,0.9)',
                                        borderRadius: '50%',
                                        width: '40px',
                                        height: '40px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: 'none',
                                        cursor: 'pointer',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                        zIndex: 20
                                    }}
                                >
                                    <ArrowLeft style={{ width: '20px', height: '20px', color: brandColors.black }} />
                                </button>

                                <button
                                    onClick={nextImage}
                                    style={{
                                        position: 'absolute',
                                        right: '12px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'rgba(255,255,255,0.9)',
                                        borderRadius: '50%',
                                        width: '40px',
                                        height: '40px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: 'none',
                                        cursor: 'pointer',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                        zIndex: 20
                                    }}
                                >
                                    <ArrowLeft style={{ width: '20px', height: '20px', color: brandColors.black, transform: 'rotate(180deg)' }} />
                                </button>

                                <div style={{
                                    position: 'absolute',
                                    bottom: '16px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    display: 'flex',
                                    gap: '8px',
                                    zIndex: 20
                                }}>
                                    {images.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentImageIndex(idx)}
                                            style={{
                                                width: idx === currentImageIndex ? '24px' : '8px',
                                                height: '8px',
                                                borderRadius: '4px',
                                                background: idx === currentImageIndex ? brandColors.cyan : 'rgba(0,0,0,0.2)',
                                                border: 'none',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease'
                                            }}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Info Section */}
                <div className="product-detail-info" style={{ padding: '20px 16px' }}>
                    {product.category?.nombre && (
                        <span style={{
                            display: 'inline-block',
                            background: `${brandColors.cyan}20`,
                            color: brandColors.cyan,
                            fontSize: '12px',
                            fontWeight: 600,
                            padding: '4px 12px',
                            borderRadius: '999px',
                            marginBottom: '12px',
                            textTransform: 'uppercase',
                        }}>
                            {product.category.nombre}
                        </span>
                    )}

                    <h1 style={{ fontSize: '24px', fontWeight: 700, color: brandColors.black, lineHeight: 1.3, marginBottom: '12px' }}>
                        {product.nombre}
                    </h1>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                        {!isOutOfStock ? (
                            <>
                                <Check style={{ width: '16px', height: '16px', color: brandColors.success }} />
                                <span style={{ fontSize: '14px', color: brandColors.success, fontWeight: 500 }}>
                                    {hasTalles
                                        ? (selectedSize ? `${selectedSize.stock} disponibles en talle ${selectedSize.size}` : 'Seleccioná un talle')
                                        : `En stock (${product.stock} disponibles)`
                                    }
                                </span>
                            </>
                        ) : (
                            <span style={{ fontSize: '14px', color: brandColors.magenta, fontWeight: 500 }}>Sin stock</span>
                        )}
                    </div>

                    {/* Urgencia — stock bajo */}
                    {!isOutOfStock && currentStock > 0 && currentStock <= 5 && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 14px',
                            background: '#FEF3C7',
                            border: '1px solid #FDE68A',
                            borderRadius: '12px',
                            marginBottom: '16px',
                        }}>
                            <AlertTriangle style={{ width: '18px', height: '18px', color: '#D97706', flexShrink: 0 }} />
                            <span style={{ fontSize: '13px', fontWeight: 600, color: '#92400E' }}>
                                ¡Solo {currentStock === 1 ? 'queda 1 unidad' : `quedan ${currentStock} unidades`}! Comprá ahora.
                            </span>
                        </div>
                    )}

                    {/* Selector de Talles */}
                    {hasTalles && (
                        <div style={{ marginBottom: '20px' }}>
                            <p style={{ fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '10px' }}>Talle</p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {talles.map((talle) => {
                                    const isSelected = selectedSize?.id === talle.id;
                                    const hasStock = talle.stock > 0;
                                    return (
                                        <button
                                            key={talle.id}
                                            onClick={() => handleSelectSize(talle)}
                                            disabled={!hasStock}
                                            style={{
                                                minWidth: '52px',
                                                padding: '10px 16px',
                                                borderRadius: '12px',
                                                fontSize: '14px',
                                                fontWeight: 600,
                                                cursor: hasStock ? 'pointer' : 'not-allowed',
                                                border: isSelected
                                                    ? `2px solid ${brandColors.cyan}`
                                                    : hasStock
                                                        ? '2px solid #E5E7EB'
                                                        : '2px solid #FCA5A5',
                                                background: isSelected
                                                    ? `${brandColors.cyan}15`
                                                    : hasStock
                                                        ? '#FFFFFF'
                                                        : '#FEF2F2',
                                                color: isSelected
                                                    ? brandColors.cyan
                                                    : hasStock
                                                        ? brandColors.black
                                                        : '#DC2626',
                                                opacity: hasStock ? 1 : 0.5,
                                                textDecoration: hasStock ? 'none' : 'line-through',
                                                transition: 'all 0.2s',
                                                boxShadow: isSelected ? `0 2px 8px rgba(0,212,212,0.2)` : 'none',
                                            }}
                                        >
                                            {talle.size}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Precio */}
                    <div style={{ marginBottom: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                            <span style={{ fontSize: '32px', fontWeight: 700, color: brandColors.black }}>
                                {formatPrice(finalPrice)}
                            </span>
                            {hasDiscount && (
                                <span style={{ fontSize: '18px', color: '#948080ff', textDecoration: 'line-through' }}>
                                    {formatPrice(product.precio)}
                                </span>
                            )}
                        </div>
                        {hasDiscount && (
                            <p style={{ fontSize: '14px', color: brandColors.cyan, fontWeight: 600, marginTop: '4px' }}>
                                ¡Ahorras {formatPrice(product.precio - product.precio_descuento)}!
                            </p>
                        )}
                        {/* Cuotas */}
                        {!isOutOfStock && (
                            <p style={{
                                fontSize: '13px',
                                color: brandColors.success,
                                fontWeight: 600,
                                marginTop: '6px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                            }}>
                                <span style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '18px',
                                    height: '18px',
                                    borderRadius: '50%',
                                    background: '#DCFCE7',
                                    fontSize: '10px',
                                    fontWeight: 700,
                                    color: brandColors.success
                                }}>3x</span>
                                3 cuotas sin interés de {formatPrice(finalPrice / 3)}
                            </p>
                        )}
                    </div>

                    {/* Selector de Cantidad */}
                    <div style={{ marginBottom: '20px' }}>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>Cantidad</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <button
                                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                disabled={quantity <= 1 || !canPurchase}
                                style={{
                                    width: '44px',
                                    height: '44px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '12px',
                                    border: `2px solid ${brandColors.cyan}`,
                                    background: 'white',
                                    cursor: quantity <= 1 || !canPurchase ? 'not-allowed' : 'pointer',
                                    opacity: quantity <= 1 || !canPurchase ? 0.5 : 1,
                                    color: brandColors.cyan,
                                }}
                            >
                                <Minus style={{ width: '18px', height: '18px' }} />
                            </button>
                            <span style={{ fontSize: '20px', fontWeight: 700, color: brandColors.black, minWidth: '40px', textAlign: 'center' }}>
                                {quantity}
                            </span>
                            <button
                                onClick={() => setQuantity(q => Math.min(currentStock, q + 1))}
                                disabled={quantity >= currentStock || !canPurchase}
                                style={{
                                    width: '44px',
                                    height: '44px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '12px',
                                    border: `2px solid ${brandColors.cyan}`,
                                    background: 'white',
                                    cursor: quantity >= currentStock || !canPurchase ? 'not-allowed' : 'pointer',
                                    opacity: quantity >= currentStock || !canPurchase ? 0.5 : 1,
                                    color: brandColors.cyan,
                                }}
                            >
                                <Plus style={{ width: '18px', height: '18px' }} />
                            </button>
                        </div>
                    </div>

                    {/* Action bar inline on desktop */}
                    <ActionBar />

                    {/* Descripción */}
                    <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #F3F4F6' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 600, color: brandColors.black, marginBottom: '12px' }}>
                            Descripción
                        </h3>
                        <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: 1.6 }}>
                            {product.descripcion || 'Sin descripción disponible.'}
                        </p>
                    </div>

                    {/* Beneficios */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '24px' }}>
                        <div style={{ textAlign: 'center', padding: '16px 8px', background: `${brandColors.cyan}10`, borderRadius: '14px', border: `1px solid ${brandColors.cyan}25` }}>
                            <Truck style={{ width: '24px', height: '24px', color: brandColors.cyan, margin: '0 auto 6px' }} />
                            <p style={{ fontSize: '11px', color: '#374151', fontWeight: 600, margin: 0 }}>Envío rápido</p>
                            <p style={{ fontSize: '10px', color: '#9CA3AF', margin: '2px 0 0' }}>A todo el país</p>
                        </div>
                        <div style={{ textAlign: 'center', padding: '16px 8px', background: `${brandColors.cyan}10`, borderRadius: '14px', border: `1px solid ${brandColors.cyan}25` }}>
                            <Shield style={{ width: '24px', height: '24px', color: brandColors.cyan, margin: '0 auto 6px' }} />
                            <p style={{ fontSize: '11px', color: '#374151', fontWeight: 600, margin: 0 }}>Compra segura</p>
                            <p style={{ fontSize: '10px', color: '#9CA3AF', margin: '2px 0 0' }}>100% protegido</p>
                        </div>
                        <div style={{ textAlign: 'center', padding: '16px 8px', background: `${brandColors.cyan}10`, borderRadius: '14px', border: `1px solid ${brandColors.cyan}25` }}>
                            <RotateCcw style={{ width: '24px', height: '24px', color: brandColors.cyan, margin: '0 auto 6px' }} />
                            <p style={{ fontSize: '11px', color: '#374151', fontWeight: 600, margin: 0 }}>Devolución</p>
                            <p style={{ fontSize: '10px', color: '#9CA3AF', margin: '2px 0 0' }}>30 días gratis</p>
                        </div>
                    </div>

                    {/* Productos Relacionados */}
                    {relatedProducts.length > 0 && (
                        <div style={{ paddingTop: '24px', marginTop: '24px', borderTop: '1px solid #F3F4F6' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 700, color: brandColors.black, marginBottom: '16px' }}>
                                También te puede interesar
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                                {relatedProducts.map(related => (
                                    <ProductCard
                                        key={related.id}
                                        product={related}
                                        onAddToCart={() => addToCart(related, 1)}
                                        onViewDetail={(p) => {
                                            navigate(`/producto/${p.id}`);
                                            window.scrollTo(0, 0);
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @media (min-width: 1024px) {
                    .product-detail-info { padding: 0 !important; }
                    .product-action-bar {
                        position: static !important;
                        border-radius: 16px !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default ProductDetail;
