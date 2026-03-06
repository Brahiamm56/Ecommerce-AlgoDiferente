import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import {
    BarChart2, Package, FolderOpen, ShoppingBag, Wallet, Truck, Tag, Image,
    Home, LogOut, Menu, X
} from 'lucide-react';

const NAV_ITEMS = [
    { path: '/admin/sales-dashboard', label: 'Dashboard', icon: BarChart2 },
    { path: '/admin/dashboard', label: 'Productos', icon: Package },
    { path: '/admin/categories', label: 'Categorías', icon: FolderOpen },
    { path: '/admin/pos', label: 'Punto de Venta', icon: ShoppingBag },
    { path: '/admin/gastos', label: 'Gastos', icon: Wallet },
    { path: '/admin/proveedores', label: 'Proveedores', icon: Truck },
    { path: '/admin/coupons', label: 'Cupones', icon: Tag },
    { path: '/admin/banners', label: 'Banners', icon: Image },
];

const AdminNavbar = () => {
    const { logout } = useAuth();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);

    const isActive = (path) => location.pathname === path;

    return (
        <>
            <header style={{
                background: '#1a1a2e',
                padding: '0 24px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                position: 'sticky',
                top: 0,
                zIndex: 50,
            }}>
                <div style={{
                    maxWidth: '1400px',
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: '64px',
                }}>
                    {/* Left — Logo */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                        <div style={{
                            width: '36px', height: '36px',
                            background: 'linear-gradient(135deg, #00c2cc, #00a8b3)',
                            borderRadius: '10px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <Package style={{ width: '20px', height: '20px', color: 'white' }} />
                        </div>
                        <div>
                            <p style={{ fontSize: '15px', fontWeight: 700, color: 'white', margin: 0, lineHeight: 1.2 }}>
                                Panel Admin
                            </p>
                            <p style={{ fontSize: '10px', color: '#888', margin: 0 }}>
                                Gestión de tienda
                            </p>
                        </div>
                    </div>

                    {/* Center — Nav (desktop) */}
                    <nav className="admin-nav-desktop" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px',
                        margin: '0 16px',
                        flex: 1,
                        justifyContent: 'center',
                    }}>
                        {NAV_ITEMS.map(item => {
                            const Icon = item.icon;
                            const active = isActive(item.path);
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: '8px 12px',
                                        borderRadius: '8px',
                                        fontSize: '13px',
                                        fontWeight: active ? 700 : 500,
                                        textDecoration: 'none',
                                        transition: 'all 0.2s',
                                        background: active ? '#00c2cc' : 'transparent',
                                        color: active ? '#fff' : '#aaa',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    <Icon style={{ width: '16px', height: '16px' }} />
                                    <span className="admin-nav-label">{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right — Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                        <Link
                            to="/"
                            className="admin-nav-desktop"
                            style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                padding: '7px 14px', borderRadius: '8px',
                                border: '1px solid rgba(255,255,255,0.2)',
                                color: 'white', fontSize: '13px', fontWeight: 500,
                                textDecoration: 'none', background: 'transparent',
                            }}
                        >
                            <Home style={{ width: '14px', height: '14px' }} />
                            Ver Tienda
                        </Link>
                        <button
                            onClick={logout}
                            className="admin-nav-desktop"
                            style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                padding: '7px 14px', borderRadius: '8px',
                                border: '1px solid rgba(239,68,68,0.3)',
                                color: '#f87171', fontSize: '13px', fontWeight: 500,
                                cursor: 'pointer', background: 'transparent',
                            }}
                        >
                            <LogOut style={{ width: '14px', height: '14px' }} />
                            Salir
                        </button>

                        {/* Mobile hamburger */}
                        <button
                            className="admin-nav-mobile-btn"
                            onClick={() => setMobileOpen(true)}
                            style={{
                                display: 'none', background: 'transparent', border: 'none',
                                color: 'white', cursor: 'pointer', padding: '8px',
                            }}
                        >
                            <Menu style={{ width: '24px', height: '24px' }} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Drawer */}
            {mobileOpen && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex' }}>
                    <div
                        onClick={() => setMobileOpen(false)}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)' }}
                    />
                    <div style={{
                        position: 'relative',
                        width: '280px',
                        background: '#1a1a2e',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        animation: 'slideInLeft 0.25s ease',
                        overflowY: 'auto',
                    }}>
                        {/* Drawer header */}
                        <div style={{
                            padding: '16px', display: 'flex', justifyContent: 'space-between',
                            alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)',
                        }}>
                            <p style={{ fontSize: '16px', fontWeight: 700, color: 'white', margin: 0 }}>
                                Panel Admin
                            </p>
                            <button
                                onClick={() => setMobileOpen(false)}
                                style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', padding: '4px' }}
                            >
                                <X style={{ width: '20px', height: '20px' }} />
                            </button>
                        </div>

                        {/* Nav items */}
                        <nav style={{ padding: '12px', flex: 1 }}>
                            {NAV_ITEMS.map(item => {
                                const Icon = item.icon;
                                const active = isActive(item.path);
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setMobileOpen(false)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            padding: '12px 14px',
                                            borderRadius: '10px',
                                            fontSize: '14px',
                                            fontWeight: active ? 700 : 500,
                                            textDecoration: 'none',
                                            marginBottom: '4px',
                                            background: active ? '#00c2cc' : 'transparent',
                                            color: active ? '#fff' : '#aaa',
                                        }}
                                    >
                                        <Icon style={{ width: '18px', height: '18px' }} />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Drawer footer */}
                        <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                            <Link
                                to="/"
                                onClick={() => setMobileOpen(false)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '10px',
                                    padding: '12px 14px', borderRadius: '10px',
                                    color: 'white', fontSize: '14px', textDecoration: 'none',
                                    marginBottom: '4px',
                                }}
                            >
                                <Home style={{ width: '18px', height: '18px' }} />
                                Ver Tienda
                            </Link>
                            <button
                                onClick={() => { logout(); setMobileOpen(false); }}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '10px',
                                    padding: '12px 14px', borderRadius: '10px', width: '100%',
                                    color: '#f87171', fontSize: '14px', background: 'transparent',
                                    border: 'none', cursor: 'pointer', textAlign: 'left',
                                }}
                            >
                                <LogOut style={{ width: '18px', height: '18px' }} />
                                Salir
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes slideInLeft {
                    from { transform: translateX(-100%); }
                    to { transform: translateX(0); }
                }
                @media (max-width: 1024px) {
                    .admin-nav-desktop { display: none !important; }
                    .admin-nav-mobile-btn { display: flex !important; }
                }
                @media (min-width: 1025px) {
                    .admin-nav-mobile-btn { display: none !important; }
                }
                .admin-nav-desktop a:hover,
                .admin-nav-desktop button:hover {
                    color: white !important;
                }
            `}</style>
        </>
    );
};

export default AdminNavbar;
