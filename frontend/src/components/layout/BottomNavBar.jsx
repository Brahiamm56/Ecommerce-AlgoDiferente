import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Home, ShoppingCart, Heart, Search } from 'lucide-react';
import WhatsAppIcon from '../common/WhatsAppIcon';
import { useFavorites } from '@context/FavoritesContext';
import { useCart } from '@context/CartContext';

// Colores de la marca "Algo Diferente"
const brandColors = {
    cyan: '#00D4D4',
    magenta: '#FF00FF',
    yellow: '#FFCC00',
    black: '#0A0A0A',
    white: '#FFFFFF',
};

const BottomNavBar = ({ onTabChange, onSearchClick }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { favoritesCount } = useFavorites();
    const { cartCount, openCart } = useCart();

    const getActiveTab = () => {
        if (location.pathname === '/favoritos') return 'favorites';
        if (location.pathname === '/') return 'home';
        return 'home';
    };

    const activeTab = getActiveTab();

    const tabs = [
        { id: 'home', label: 'Inicio', icon: Home, path: '/' },
        { id: 'whatsapp', label: 'WhatsApp', icon: WhatsAppIcon, action: 'whatsapp' },
        { id: 'cart', label: '', icon: ShoppingCart, isCenter: true, badge: cartCount },
        { id: 'favorites', label: 'Favoritos', icon: Heart, path: '/favoritos', badge: favoritesCount },
        { id: 'search', label: 'Buscar', icon: Search, action: 'search' },
    ];

    const handleTabClick = (tab) => {
        if (tab.id === 'cart') {
            openCart();
        } else if (tab.id === 'search' && onSearchClick) {
            onSearchClick();
        } else if (tab.path) {
            navigate(tab.path);
        } else if (tab.action === 'whatsapp') {
            const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '541112345678';
            window.open(`https://wa.me/${whatsappNumber}`, '_blank');
        } else if (onTabChange) {
            onTabChange(tab.id);
        }
    };

    return (
        <nav
            className="bottom-nav-bar"
            style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 50,
                background: brandColors.black,
                borderTop: `1px solid rgba(255,255,255,0.1)`,
                alignItems: 'center',
                justifyContent: 'space-around',
                padding: '8px 16px',
                paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
            }}
        >
            {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                // Botón central grande - Carrito
                if (tab.isCenter) {
                    return (
                        <button
                            key={tab.id}
                            onClick={() => handleTabClick(tab)}
                            style={{
                                position: 'relative',
                                width: '52px',
                                height: '52px',
                                borderRadius: '50%',
                                background: brandColors.cyan,
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: brandColors.black,
                                boxShadow: `0 4px 16px rgba(0,212,212,0.4)`,
                                transform: 'translateY(-12px)',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-14px)';
                                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,212,212,0.5)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(-12px)';
                                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,212,212,0.4)';
                            }}
                            aria-label="Carrito"
                        >
                            <Icon style={{ width: '24px', height: '24px' }} />
                            {/* Badge carrito */}
                            {tab.badge > 0 && (
                                <span
                                    style={{
                                        position: 'absolute',
                                        top: '-2px',
                                        right: '-2px',
                                        background: brandColors.magenta,
                                        color: brandColors.white,
                                        fontSize: '10px',
                                        fontWeight: 'bold',
                                        width: '20px',
                                        height: '20px',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 2px 8px rgba(255,0,255,0.4)',
                                    }}
                                >
                                    {tab.badge > 9 ? '9+' : tab.badge}
                                </span>
                            )}
                        </button>
                    );
                }

                return (
                    <button
                        key={tab.id}
                        onClick={() => handleTabClick(tab)}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '2px',
                            padding: '4px 12px',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: isActive ? brandColors.cyan : 'rgba(255,255,255,0.6)',
                            transition: 'color 0.2s',
                            position: 'relative',
                        }}
                    >
                        <div style={{ position: 'relative' }}>
                            <Icon
                                style={{
                                    width: '22px',
                                    height: '22px',
                                    fill: isActive && tab.id === 'favorites' ? brandColors.magenta : 'none',
                                    color: isActive && tab.id === 'favorites' ? brandColors.magenta : undefined,
                                }}
                            />
                            {/* Badge para favoritos */}
                            {tab.badge > 0 && tab.id === 'favorites' && (
                                <span
                                    style={{
                                        position: 'absolute',
                                        top: '-6px',
                                        right: '-8px',
                                        background: brandColors.magenta,
                                        color: brandColors.white,
                                        fontSize: '10px',
                                        fontWeight: 'bold',
                                        width: '16px',
                                        height: '16px',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {tab.badge > 9 ? '9+' : tab.badge}
                                </span>
                            )}
                        </div>
                        <span
                            style={{
                                fontSize: '11px',
                                fontWeight: isActive ? '600' : '500',
                            }}
                        >
                            {tab.label}
                        </span>
                    </button>
                );
            })}
        </nav>
    );
};

BottomNavBar.propTypes = {
    onTabChange: PropTypes.func,
    onSearchClick: PropTypes.func,
};

BottomNavBar.defaultProps = {
    onTabChange: () => { },
    onSearchClick: () => { },
};

export default BottomNavBar;
