import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Home, Heart, User, LogIn, Grid, Phone } from 'lucide-react';
import PropTypes from 'prop-types';

// Colores de la marca (reutilizados para consistencia)
const brandColors = {
    cyan: '#00D4D4',
    magenta: '#FF00FF',
    yellow: '#FFCC00',
    black: '#0A0A0A',
    white: '#FFFFFF',
    grayLight: '#F5F5F5',
};

const MobileMenu = ({ isOpen, onClose, categories = [], onCategorySelect }) => {
    const drawerRef = useRef(null);
    const navigate = useNavigate();

    // Cerrar al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (drawerRef.current && !drawerRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    const handleNavigate = (path) => {
        navigate(path);
        onClose();
    };

    if (!isOpen) return null;

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
                    maxWidth: '300px',
                    background: brandColors.black,
                    color: brandColors.white,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    animation: 'slideInRight 0.3s ease',
                    boxShadow: '-4px 0 20px rgba(0,0,0,0.5)'
                }}
            >
                {/* Header del Menú */}
                <div style={{
                    padding: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid rgba(255,255,255,0.1)'
                }}>
                    <span style={{ fontSize: '18px', fontWeight: 700, color: brandColors.cyan }}>Menú</span>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'rgba(255,255,255,0.1)',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            color: brandColors.white
                        }}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Lista de Navegación */}
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>

                    <MenuItem
                        icon={Home}
                        label="Inicio"
                        onClick={() => handleNavigate('/')}
                        active={location.pathname === '/'}
                    />

                    <MenuItem
                        icon={Heart}
                        label="Mis Favoritos"
                        onClick={() => handleNavigate('/favoritos')}
                    />

                    <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '8px 0' }} />

                    {/* Categorías dinámicas */}
                    {categories.length > 0 && (
                        <>
                            <span style={{ fontSize: '11px', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', padding: '4px 16px' }}>
                                Categorías
                            </span>
                            <MenuItem
                                icon={Grid}
                                label="Todos los productos"
                                onClick={() => {
                                    if (onCategorySelect) {
                                        onCategorySelect('todos');
                                    } else {
                                        if (location.pathname !== '/') navigate('/');
                                        setTimeout(() => {
                                            document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
                                        }, 100);
                                        onClose();
                                    }
                                }}
                            />
                            {categories
                                .filter(cat => cat.slug !== 'todos' && cat.nombre.toLowerCase() !== 'todos')
                                .map(cat => (
                                    <MenuItem
                                        key={cat.id}
                                        icon={Grid}
                                        label={cat.nombre}
                                        onClick={() => {
                                            if (onCategorySelect) {
                                                onCategorySelect(cat.slug);
                                            } else {
                                                if (location.pathname !== '/') navigate('/');
                                                setTimeout(() => {
                                                    document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
                                                }, 100);
                                                onClose();
                                            }
                                        }}
                                    />
                                ))}
                        </>
                    )}

                    {/* Mi Perfil - REMOVIDO */}

                    <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '8px 0' }} />

                    <MenuItem
                        icon={LogIn}
                        label="Admin Panel"
                        onClick={() => handleNavigate('/admin/login')}
                        color={brandColors.magenta}
                    />

                </div>

                {/* Footer del Menú */}
                <div style={{
                    marginTop: 'auto',
                    padding: '20px',
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    textAlign: 'center'
                }}>
                    <p style={{ fontSize: '12px', color: '#6B7280' }}>
                        © 2026 Algo Diferente
                    </p>
                </div>

            </div>

            <style>{`
                @keyframes slideInRight {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
            `}</style>
        </div>
    );
};

// Componente helper para items de menú
const MenuItem = ({ icon: Icon, label, onClick, color, active }) => (
    <button
        onClick={onClick}
        style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            width: '100%',
            background: active ? 'rgba(0, 212, 212, 0.1)' : 'transparent',
            border: active ? `1px solid ${brandColors.cyan}` : 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            textAlign: 'left',
            color: color || '#FFFFFF',
            fontWeight: active ? 600 : 500,
            transition: 'background 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
        onMouseLeave={(e) => !active && (e.currentTarget.style.background = 'transparent')}
    >
        <Icon size={20} style={{ color: color || (active ? brandColors.cyan : '#9CA3AF') }} />
        <span style={{ fontSize: '15px' }}>{label}</span>
    </button>
);

MobileMenu.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    categories: PropTypes.array,
    onCategorySelect: PropTypes.func,
};

export default MobileMenu;
