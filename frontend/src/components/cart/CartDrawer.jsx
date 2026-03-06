import { useRef, useEffect } from 'react';
import { X, Trash2, Plus, Minus, ShoppingCart, Truck, Check } from 'lucide-react';
import WhatsAppIcon from '../common/WhatsAppIcon';
import { useCart } from '@context/CartContext';
import { formatPrice } from '@utils/formatters';
import brandColors from '@utils/brandColors';

const FREE_SHIPPING_THRESHOLD = 50000;

const CartDrawer = () => {
    const {
        cartItems,
        isCartOpen,
        closeCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount
    } = useCart();

    const drawerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (drawerRef.current && !drawerRef.current.contains(event.target)) {
                closeCart();
            }
        };

        if (isCartOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'unset';
        };
    }, [isCartOpen, closeCart]);

    const handleFinalizarPedido = () => {
        if (cartItems.length === 0) return;

        let message = `Hola! Quiero realizar este pedido:\n\n`;

        cartItems.forEach(item => {
            const price = item.precio_descuento || item.precio;
            message += `• ${item.quantity}x ${item.nombre} - ${formatPrice(price * item.quantity)}\n`;
        });

        message += `\nTotal: ${formatPrice(cartTotal)}`;

        const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '5491123456789';
        const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

        window.open(url, '_blank');
    };

    if (!isCartOpen) return null;

    const shippingProgress = Math.min((cartTotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
    const hasFreeShipping = cartTotal >= FREE_SHIPPING_THRESHOLD;
    const remaining = FREE_SHIPPING_THRESHOLD - cartTotal;

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', justifyContent: 'flex-end' }}>
            {/* Overlay */}
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} />

            {/* Drawer */}
            <div
                ref={drawerRef}
                style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '420px',
                    background: brandColors.white,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    animation: 'slideIn 0.3s ease',
                }}
            >
                {/* Header */}
                <header style={{
                    background: brandColors.black,
                    color: brandColors.white,
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexShrink: 0,
                }}>
                    <div>
                        <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Tu Carrito</h2>
                        {cartCount > 0 && (
                            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', margin: 0 }}>
                                {cartCount} {cartCount === 1 ? 'producto' : 'productos'}
                            </p>
                        )}
                    </div>

                    <button
                        onClick={closeCart}
                        style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer', display: 'flex' }}
                    >
                        <X style={{ width: '20px', height: '20px', color: brandColors.white }} />
                    </button>
                </header>

                {/* Free Shipping Progress Bar */}
                {cartItems.length > 0 && (
                    <div style={{
                        padding: '12px 16px',
                        background: hasFreeShipping ? '#DCFCE7' : '#F0F9FF',
                        borderBottom: `1px solid ${hasFreeShipping ? '#BBF7D0' : '#E0F2FE'}`,
                        flexShrink: 0,
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            {hasFreeShipping ? (
                                <Check style={{ width: '16px', height: '16px', color: brandColors.success }} />
                            ) : (
                                <Truck style={{ width: '16px', height: '16px', color: '#0284C7' }} />
                            )}
                            <p style={{
                                fontSize: '12px',
                                fontWeight: 600,
                                margin: 0,
                                color: hasFreeShipping ? '#166534' : '#0C4A6E',
                            }}>
                                {hasFreeShipping
                                    ? '¡Envío GRATIS aplicado!'
                                    : `¡Te faltan ${formatPrice(remaining)} para envío GRATIS!`
                                }
                            </p>
                        </div>
                        <div style={{
                            width: '100%',
                            height: '6px',
                            borderRadius: '3px',
                            background: hasFreeShipping ? '#BBF7D0' : '#E0E7FF',
                            overflow: 'hidden',
                        }}>
                            <div style={{
                                width: `${shippingProgress}%`,
                                height: '100%',
                                borderRadius: '3px',
                                background: hasFreeShipping
                                    ? `linear-gradient(90deg, ${brandColors.success}, #4ADE80)`
                                    : `linear-gradient(90deg, ${brandColors.cyan}, ${brandColors.cyanDark})`,
                                transition: 'width 0.5s ease-out',
                            }} />
                        </div>
                    </div>
                )}

                {/* Contenido */}
                <div style={{ flex: 1, overflowY: 'auto', background: brandColors.grayLight }}>
                    {cartItems.length === 0 ? (
                        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px' }}>
                            <ShoppingCart style={{ width: '64px', height: '64px', color: '#D1D5DB', marginBottom: '16px' }} />
                            <p style={{ fontSize: '16px', fontWeight: 600, color: '#6B7280', marginBottom: '8px' }}>Tu carrito está vacío</p>
                            <p style={{ fontSize: '14px', color: '#9CA3AF', textAlign: 'center', marginBottom: '24px' }}>
                                Agrega productos para comenzar tu pedido
                            </p>
                            <button
                                onClick={closeCart}
                                style={{
                                    padding: '12px 24px',
                                    background: brandColors.cyan,
                                    color: brandColors.black,
                                    border: 'none',
                                    borderRadius: '10px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                }}
                            >
                                Explorar Productos
                            </button>
                        </div>
                    ) : (
                        <div style={{ padding: '16px' }}>
                            {cartItems.map((item) => {
                                const unitPrice = item.precio_descuento || item.precio;
                                const subtotal = unitPrice * item.quantity;

                                return (
                                    <div key={item.id} style={{
                                        background: brandColors.white,
                                        borderRadius: '12px',
                                        padding: '12px',
                                        marginBottom: '12px',
                                        display: 'flex',
                                        gap: '12px',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                    }}>
                                        {/* Imagen */}
                                        <div style={{
                                            width: '70px',
                                            height: '70px',
                                            background: brandColors.grayLight,
                                            borderRadius: '10px',
                                            overflow: 'hidden',
                                            flexShrink: 0,
                                        }}>
                                            <img
                                                src={item.imagen_url}
                                                alt={item.nombre}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        </div>

                                        {/* Info */}
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                            <div>
                                                <h3 style={{ fontSize: '13px', fontWeight: 600, color: brandColors.black, margin: '0 0 4px', lineHeight: 1.3 }}>
                                                    {item.nombre}
                                                </h3>
                                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                                                    <p style={{ fontSize: '15px', fontWeight: 700, color: brandColors.cyan, margin: 0 }}>
                                                        {formatPrice(subtotal)}
                                                    </p>
                                                    {item.quantity > 1 && (
                                                        <span style={{ fontSize: '11px', color: '#9CA3AF' }}>
                                                            ({formatPrice(unitPrice)} c/u)
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Controles */}
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: brandColors.grayLight, borderRadius: '8px', padding: '4px' }}>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        disabled={item.quantity <= 1}
                                                        style={{
                                                            width: '26px',
                                                            height: '26px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            border: 'none',
                                                            borderRadius: '6px',
                                                            background: brandColors.white,
                                                            cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer',
                                                            opacity: item.quantity <= 1 ? 0.5 : 1,
                                                        }}
                                                    >
                                                        <Minus style={{ width: '12px', height: '12px', color: brandColors.black }} />
                                                    </button>
                                                    <span style={{ fontSize: '13px', fontWeight: 700, minWidth: '20px', textAlign: 'center' }}>
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        disabled={item.quantity >= item.stock}
                                                        style={{
                                                            width: '26px',
                                                            height: '26px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            border: 'none',
                                                            borderRadius: '6px',
                                                            background: brandColors.white,
                                                            cursor: item.quantity >= item.stock ? 'not-allowed' : 'pointer',
                                                            opacity: item.quantity >= item.stock ? 0.5 : 1,
                                                        }}
                                                    >
                                                        <Plus style={{ width: '12px', height: '12px', color: brandColors.black }} />
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    style={{
                                                        width: '30px',
                                                        height: '30px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        border: 'none',
                                                        borderRadius: '8px',
                                                        background: '#FEE2E2',
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    <Trash2 style={{ width: '14px', height: '14px', color: '#DC2626' }} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Vaciar carrito */}
                            <button
                                onClick={() => {
                                    if (window.confirm('¿Vaciar todo el carrito?')) clearCart();
                                }}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    background: 'transparent',
                                    border: '1px dashed #D1D5DB',
                                    borderRadius: '8px',
                                    color: '#9CA3AF',
                                    fontSize: '13px',
                                    cursor: 'pointer',
                                    marginTop: '8px',
                                }}
                            >
                                Vaciar carrito
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {cartItems.length > 0 && (
                    <div style={{
                        background: brandColors.white,
                        borderTop: '1px solid #E5E7EB',
                        padding: '16px',
                        flexShrink: 0,
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                            <span style={{ fontSize: '14px', color: '#6B7280' }}>Subtotal</span>
                            <span style={{ fontSize: '14px', color: '#6B7280' }}>{formatPrice(cartTotal)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <span style={{ fontSize: '14px', color: '#6B7280' }}>Envío</span>
                            <span style={{ fontSize: '14px', fontWeight: 600, color: hasFreeShipping ? brandColors.success : '#6B7280' }}>
                                {hasFreeShipping ? 'GRATIS' : 'A calcular'}
                            </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', paddingTop: '10px', borderTop: '1px solid #F3F4F6' }}>
                            <span style={{ fontSize: '16px', fontWeight: 700, color: brandColors.black }}>Total</span>
                            <span style={{ fontSize: '22px', fontWeight: 700, color: brandColors.black }}>{formatPrice(cartTotal)}</span>
                        </div>
                        <button
                            onClick={handleFinalizarPedido}
                            style={{
                                width: '100%',
                                padding: '16px',
                                background: brandColors.success,
                                color: brandColors.white,
                                border: 'none',
                                borderRadius: '12px',
                                fontWeight: 700,
                                fontSize: '15px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                boxShadow: '0 4px 12px rgba(34,197,94,0.3)',
                                transition: 'transform 0.15s, box-shadow 0.15s',
                            }}
                            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
                            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <WhatsAppIcon size={20} />
                            Finalizar Pedido por WhatsApp
                        </button>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes slideIn {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
            `}</style>
        </div>
    );
};

export default CartDrawer;
