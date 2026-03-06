import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Search, ShoppingCart, Heart, Menu, X } from 'lucide-react';
import logoImage from '@assets/algodif.jpg';

const brandColors = {
    cyan: '#00D4D4',
    magenta: '#FF00FF',
    yellow: '#FFCC00',
    black: '#0A0A0A',
    white: '#FFFFFF',
};

const Header = ({ cartItemCount = 0, onCartClick, onMenuClick, searchTerm, onSearchChange, isSearchOpen, onSearchToggle }) => {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY < 10) {
                setIsVisible(true);
            } else if (currentScrollY > lastScrollY) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    return (
        <header
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 50,
                transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
                transition: 'transform 0.3s ease-in-out',
            }}
        >
            <div style={{ background: brandColors.black, padding: '0 16px' }}>
                <div className="header-inner" style={{ height: '72px' }}>
                    {/* Logo */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                        <div style={{ height: '40px', display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/')}>
                            <img
                                src={logoImage}
                                alt="Algo Diferente"
                                style={{ height: '100%', width: 'auto', objectFit: 'contain' }}
                            />
                        </div>
                        {/* Brand name visible on desktop */}
                        <div
                            className="brand-name-desktop"
                            style={{ alignItems: 'center', cursor: 'pointer' }}
                            onClick={() => navigate('/')}
                        >
                            <span style={{
                                color: brandColors.white,
                                fontWeight: 700,
                                fontSize: '16px',
                            }}>
                                #ALGO<span style={{ color: brandColors.cyan }}>DIFERENTE</span>!
                            </span>
                        </div>
                    </div>

                    {/* Desktop Search Bar - visible solo en desktop */}
                    <div className="header-search-desktop" style={{ position: 'relative', alignItems: 'center' }}>
                        <Search
                            style={{
                                position: 'absolute',
                                left: '14px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: brandColors.cyan,
                                width: '18px',
                                height: '18px',
                                pointerEvents: 'none',
                            }}
                        />
                        <input
                            type="text"
                            placeholder="¿Qué estás buscando?"
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            style={{
                                width: '100%',
                                paddingLeft: '42px',
                                paddingRight: '16px',
                                paddingTop: '10px',
                                paddingBottom: '10px',
                                borderRadius: '10px',
                                background: '#1A1A1A',
                                color: brandColors.white,
                                border: `1px solid rgba(255,255,255,0.15)`,
                                outline: 'none',
                                fontSize: '14px',
                                fontWeight: '500',
                                transition: 'border-color 0.2s',
                            }}
                            onFocus={(e) => e.target.style.borderColor = brandColors.cyan}
                            onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
                        />
                    </div>

                    {/* Action Icons */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                        {/* Mobile Search Toggle */}
                        <button
                            onClick={onSearchToggle}
                            className="header-search-mobile-btn"
                            style={{
                                color: isSearchOpen ? brandColors.cyan : brandColors.white,
                                padding: '10px',
                                borderRadius: '10px',
                                background: isSearchOpen ? 'rgba(0,212,212,0.1)' : 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                            }}
                            aria-label="Buscar"
                        >
                            {isSearchOpen ? <X style={{ width: '22px', height: '22px' }} /> : <Search style={{ width: '22px', height: '22px' }} />}
                        </button>

                        {/* Favoritos */}
                        <button
                            onClick={() => navigate('/favoritos')}
                            style={{
                                color: brandColors.white,
                                padding: '10px',
                                borderRadius: '10px',
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                            }}
                            aria-label="Favoritos"
                        >
                            <Heart style={{ width: '22px', height: '22px' }} />
                        </button>

                        {/* Carrito */}
                        <button
                            onClick={onCartClick}
                            style={{
                                position: 'relative',
                                color: brandColors.white,
                                padding: '10px',
                                borderRadius: '10px',
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                            }}
                            aria-label="Carrito"
                        >
                            <ShoppingCart style={{ width: '22px', height: '22px' }} />
                            {cartItemCount > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: '4px',
                                    right: '4px',
                                    width: '18px',
                                    height: '18px',
                                    background: brandColors.magenta,
                                    borderRadius: '50%',
                                    fontSize: '10px',
                                    fontWeight: 700,
                                    color: brandColors.white,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    {cartItemCount > 9 ? '9+' : cartItemCount}
                                </span>
                            )}
                        </button>

                        {/* Menu */}
                        <button
                            onClick={onMenuClick}
                            style={{
                                color: brandColors.black,
                                padding: '8px 12px',
                                borderRadius: '8px',
                                background: brandColors.cyan,
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                fontWeight: 600,
                                fontSize: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                marginLeft: '4px',
                            }}
                            aria-label="Menú"
                        >
                            <Menu style={{ width: '18px', height: '18px' }} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Search Bar - Expandible */}
            {isSearchOpen && (
                <div
                    className="header-search-mobile-bar"
                    style={{
                        padding: '12px 16px',
                        background: brandColors.black,
                        borderTop: '1px solid rgba(255,255,255,0.1)',
                    }}
                >
                    <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
                        <Search
                            style={{
                                position: 'absolute',
                                left: '14px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: brandColors.cyan,
                                width: '20px',
                                height: '20px',
                            }}
                        />
                        <input
                            type="text"
                            placeholder="¿Qué estás buscando?"
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            autoFocus
                            style={{
                                width: '100%',
                                paddingLeft: '44px',
                                paddingRight: '16px',
                                paddingTop: '12px',
                                paddingBottom: '12px',
                                borderRadius: '12px',
                                background: '#1A1A1A',
                                color: brandColors.white,
                                border: `1px solid ${brandColors.cyan}`,
                                outline: 'none',
                                fontSize: '14px',
                                fontWeight: '500',
                            }}
                        />
                    </div>
                </div>
            )}

            <style>{`
                @media (min-width: 1024px) {
                    .header-search-mobile-btn { display: none !important; }
                    .header-search-mobile-bar { display: none !important; }
                }
            `}</style>
        </header>
    );
};

Header.propTypes = {
    cartItemCount: PropTypes.number,
    onCartClick: PropTypes.func,
    onMenuClick: PropTypes.func,
    searchTerm: PropTypes.string,
    onSearchChange: PropTypes.func,
    isSearchOpen: PropTypes.bool,
    onSearchToggle: PropTypes.func,
};

Header.defaultProps = {
    cartItemCount: 0,
    onCartClick: () => { },
    onMenuClick: () => { },
    searchTerm: '',
    onSearchChange: () => { },
    isSearchOpen: false,
    onSearchToggle: () => { },
};

export default Header;
