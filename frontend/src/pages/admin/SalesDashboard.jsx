import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { salesService, gastosService } from '../../services/api';
import { formatPrice } from '../../utils/formatters';
import AdminNavbar from '../../components/admin/AdminNavbar';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import {
    TrendingUp, DollarSign, ShoppingCart, Receipt,
    RefreshCw, Wallet, TrendingDown
} from 'lucide-react';

const PAYMENT_COLORS = {
    efectivo: '#10B981',
    transferencia: '#3B82F6',
    tarjeta: '#8B5CF6',
};

const PAYMENT_LABELS = {
    efectivo: 'Efectivo',
    transferencia: 'Transferencia',
    tarjeta: 'Tarjeta',
};

const SalesDashboard = () => {
    const [stats, setStats] = useState(null);
    const [gastosStats, setGastosStats] = useState({ total: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadStats = async () => {
        try {
            setLoading(true);
            setError(null);
            const [salesData, gastosData] = await Promise.all([
                salesService.getStats(),
                gastosService.getStats().catch(() => ({ total: 0 }))
            ]);
            setStats(salesData);
            setGastosStats(gastosData);
        } catch (err) {
            console.error('Error loading stats:', err);
            setError('Error al cargar estadísticas');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStats();
    }, []);

    const monthTotal = stats ? parseFloat(stats.kpis.month_total) : 0;
    const gastosTotal = parseFloat(gastosStats.total) || 0;
    const ganancia = monthTotal - gastosTotal;

    const kpiCards = stats ? [
        {
            label: 'Ventas Hoy',
            value: formatPrice(stats.kpis.today_total),
            sub: `${stats.kpis.today_count} ventas`,
            icon: DollarSign,
            gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            iconBg: 'rgba(255,255,255,0.2)',
        },
        {
            label: 'Ventas del Mes',
            value: formatPrice(stats.kpis.month_total),
            sub: `${stats.kpis.month_count} ventas`,
            icon: TrendingUp,
            gradient: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
            iconBg: 'rgba(255,255,255,0.2)',
        },
        {
            label: 'Nº Ventas Hoy',
            value: stats.kpis.today_count,
            sub: 'transacciones',
            icon: ShoppingCart,
            gradient: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
            iconBg: 'rgba(255,255,255,0.2)',
        },
        {
            label: 'Ticket Promedio',
            value: formatPrice(stats.kpis.avg_ticket),
            sub: 'por venta',
            icon: Receipt,
            gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
            iconBg: 'rgba(255,255,255,0.2)',
        },
    ] : [];

    const financialCards = stats ? [
        {
            label: 'Total Gastos',
            value: formatPrice(gastosTotal),
            sub: 'este mes',
            icon: Wallet,
            bg: '#FFF5F5',
            color: '#DC2626',
            iconBg: '#FEE2E2',
        },
        {
            label: 'Ganancia Neta',
            value: formatPrice(ganancia),
            sub: 'ventas − gastos',
            icon: ganancia >= 0 ? TrendingUp : TrendingDown,
            bg: ganancia >= 0 ? '#F0FDF4' : '#FFF5F5',
            color: ganancia >= 0 ? '#16A34A' : '#DC2626',
            iconBg: ganancia >= 0 ? '#DCFCE7' : '#FEE2E2',
        },
    ] : [];

    // Custom tooltip for bar chart
    const BarTooltip = ({ active, payload, label }) => {
        if (!active || !payload?.length) return null;
        return (
            <div style={{
                background: 'white', padding: '12px 16px', borderRadius: '10px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)', border: '1px solid #E5E7EB',
            }}>
                <p style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>{label}</p>
                <p style={{ fontSize: '16px', fontWeight: 700, color: '#1F2937', margin: 0 }}>
                    {formatPrice(payload[0].value)}
                </p>
                <p style={{ fontSize: '11px', color: '#9CA3AF', margin: '2px 0 0' }}>
                    {payload[0].payload.count} ventas
                </p>
            </div>
        );
    };

    // Custom tooltip for pie chart
    const PieTooltip = ({ active, payload }) => {
        if (!active || !payload?.length) return null;
        return (
            <div style={{
                background: 'white', padding: '12px 16px', borderRadius: '10px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)', border: '1px solid #E5E7EB',
            }}>
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#1F2937', margin: '0 0 4px' }}>
                    {PAYMENT_LABELS[payload[0].payload.method] || payload[0].payload.method}
                </p>
                <p style={{ fontSize: '15px', fontWeight: 700, color: '#1F2937', margin: 0 }}>
                    {formatPrice(payload[0].value)}
                </p>
                <p style={{ fontSize: '11px', color: '#9CA3AF', margin: '2px 0 0' }}>
                    {payload[0].payload.count} ventas
                </p>
            </div>
        );
    };

    return (
        <div style={{ minHeight: '100vh', background: '#F3F4F6' }}>
            <AdminNavbar />

            <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
                {/* Page header + refresh */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div>
                        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1F2937', margin: 0 }}>Dashboard de Ventas</h1>
                        <p style={{ fontSize: '14px', color: '#6B7280', margin: '4px 0 0' }}>Resumen y estadísticas</p>
                    </div>
                    <button
                        onClick={loadStats}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px',
                            background: 'white', borderRadius: '10px', border: '1px solid #E5E7EB',
                            color: '#374151', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                        }}
                    >
                        <RefreshCw style={{ width: '16px', height: '16px' }} />
                        Actualizar
                    </button>
                </div>

                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
                        <div style={{
                            width: '48px', height: '48px', border: '4px solid #E5E7EB',
                            borderTopColor: '#00c2cc', borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                        }} />
                    </div>
                ) : error ? (
                    <div style={{
                        background: '#FEE2E2', color: '#991B1B', padding: '20px', borderRadius: '12px',
                        textAlign: 'center', fontSize: '15px', fontWeight: 500,
                    }}>
                        {error}
                        <button onClick={loadStats} style={{
                            display: 'block', margin: '12px auto 0', padding: '8px 20px',
                            background: '#DC2626', color: 'white', border: 'none', borderRadius: '8px',
                            cursor: 'pointer', fontWeight: 600,
                        }}>
                            Reintentar
                        </button>
                    </div>
                ) : stats && (
                    <>
                        {/* KPI Cards */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                            gap: '16px',
                            marginBottom: '16px',
                        }}>
                            {kpiCards.map((kpi, i) => (
                                <div key={i} style={{
                                    background: kpi.gradient,
                                    borderRadius: '16px',
                                    padding: '24px',
                                    color: 'white',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                    position: 'relative',
                                    overflow: 'hidden',
                                }}>
                                    {/* Decorative circle */}
                                    <div style={{
                                        position: 'absolute', top: '-20px', right: '-20px',
                                        width: '100px', height: '100px', borderRadius: '50%',
                                        background: 'rgba(255,255,255,0.08)',
                                    }} />
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
                                        <div>
                                            <p style={{ fontSize: '12px', opacity: 0.8, textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px', margin: '0 0 8px' }}>
                                                {kpi.label}
                                            </p>
                                            <p style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 4px', lineHeight: 1.1 }}>
                                                {kpi.value}
                                            </p>
                                            <p style={{ fontSize: '13px', opacity: 0.75, margin: 0 }}>{kpi.sub}</p>
                                        </div>
                                        <div style={{
                                            width: '48px', height: '48px', background: kpi.iconBg,
                                            borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            <kpi.icon style={{ width: '24px', height: '24px' }} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Financial Cards — Gastos + Ganancia */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: '16px',
                            marginBottom: '24px',
                        }}>
                            {financialCards.map((card, i) => (
                                <div key={i} style={{
                                    background: card.bg,
                                    borderRadius: '16px',
                                    padding: '24px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                                    border: `1px solid ${card.color}20`,
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <p style={{ fontSize: '12px', textTransform: 'uppercase', fontWeight: 600, color: card.color, opacity: 0.8, margin: '0 0 8px' }}>
                                                {card.label}
                                            </p>
                                            <p style={{ fontSize: '28px', fontWeight: 800, color: card.color, margin: '0 0 4px', lineHeight: 1.1 }}>
                                                {card.value}
                                            </p>
                                            <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>{card.sub}</p>
                                        </div>
                                        <div style={{
                                            width: '48px', height: '48px', background: card.iconBg,
                                            borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            <card.icon style={{ width: '24px', height: '24px', color: card.color }} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Charts Row */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '2fr 1fr',
                            gap: '16px',
                            marginBottom: '24px',
                        }}>
                            {/* Bar Chart - Last 7 Days */}
                            <div style={{
                                background: 'white', borderRadius: '16px', padding: '24px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                            }}>
                                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1F2937', margin: '0 0 20px' }}>
                                    📊 Ventas — Últimos 7 Días
                                </h3>
                                <div style={{ height: '280px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={stats.daily} barCategoryGap="20%">
                                            <XAxis
                                                dataKey="label"
                                                tick={{ fontSize: 12, fill: '#6B7280' }}
                                                axisLine={false}
                                                tickLine={false}
                                            />
                                            <YAxis
                                                tick={{ fontSize: 11, fill: '#9CA3AF' }}
                                                axisLine={false}
                                                tickLine={false}
                                                tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
                                            />
                                            <Tooltip content={<BarTooltip />} />
                                            <Bar
                                                dataKey="total"
                                                fill="#3B82F6"
                                                radius={[8, 8, 0, 0]}
                                                maxBarSize={50}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Pie Chart - Payment Methods */}
                            <div style={{
                                background: 'white', borderRadius: '16px', padding: '24px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                            }}>
                                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1F2937', margin: '0 0 20px' }}>
                                    💳 Métodos de Pago
                                </h3>
                                {stats.payment_methods.length > 0 ? (
                                    <div style={{ height: '280px' }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={stats.payment_methods}
                                                    dataKey="total"
                                                    nameKey="method"
                                                    cx="50%"
                                                    cy="45%"
                                                    outerRadius={90}
                                                    innerRadius={55}
                                                    paddingAngle={4}
                                                    strokeWidth={0}
                                                >
                                                    {stats.payment_methods.map((entry, idx) => (
                                                        <Cell
                                                            key={idx}
                                                            fill={PAYMENT_COLORS[entry.method] || '#94A3B8'}
                                                        />
                                                    ))}
                                                </Pie>
                                                <Tooltip content={<PieTooltip />} />
                                                <Legend
                                                    formatter={(value) => PAYMENT_LABELS[value] || value}
                                                    iconType="circle"
                                                    wrapperStyle={{ fontSize: '13px', paddingTop: '8px' }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                ) : (
                                    <div style={{ padding: '60px 20px', textAlign: 'center', color: '#9CA3AF', fontSize: '14px' }}>
                                        Sin datos este mes
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Bottom Row: Top Products + Recent Sales */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '16px',
                        }}>
                            {/* Top Products */}
                            <div style={{
                                background: 'white', borderRadius: '16px', padding: '24px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                            }}>
                                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1F2937', margin: '0 0 16px' }}>
                                    🏆 Top Productos del Mes
                                </h3>
                                {stats.top_products.length > 0 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {stats.top_products.map((prod, idx) => (
                                            <div key={prod.id || idx} style={{
                                                display: 'flex', alignItems: 'center', gap: '12px',
                                                padding: '12px', background: '#F9FAFB', borderRadius: '12px',
                                            }}>
                                                <div style={{
                                                    width: '32px', height: '32px', borderRadius: '10px',
                                                    background: idx === 0 ? '#FEF3C7' : idx === 1 ? '#F3F4F6' : idx === 2 ? '#FED7AA' : '#F9FAFB',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: '14px', fontWeight: 800,
                                                    color: idx === 0 ? '#D97706' : idx === 1 ? '#6B7280' : idx === 2 ? '#EA580C' : '#9CA3AF',
                                                    flexShrink: 0,
                                                }}>
                                                    {idx + 1}
                                                </div>
                                                {prod.image && (
                                                    <img
                                                        src={prod.image}
                                                        alt=""
                                                        style={{
                                                            width: '40px', height: '40px', borderRadius: '8px',
                                                            objectFit: 'cover', flexShrink: 0,
                                                        }}
                                                    />
                                                )}
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <p style={{
                                                        fontSize: '13px', fontWeight: 600, color: '#1F2937',
                                                        margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                                    }}>
                                                        {prod.name}
                                                    </p>
                                                    <p style={{ fontSize: '12px', color: '#6B7280', margin: '2px 0 0' }}>
                                                        {prod.quantity} unidades
                                                    </p>
                                                </div>
                                                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                                    <p style={{ fontSize: '14px', fontWeight: 700, color: '#1F2937', margin: 0 }}>
                                                        {formatPrice(prod.revenue)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div style={{ padding: '40px 20px', textAlign: 'center', color: '#9CA3AF', fontSize: '14px' }}>
                                        Sin ventas este mes
                                    </div>
                                )}
                            </div>

                            {/* Recent Sales */}
                            <div style={{
                                background: 'white', borderRadius: '16px', padding: '24px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                            }}>
                                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1F2937', margin: '0 0 16px' }}>
                                    🕐 Últimas Ventas
                                </h3>
                                {stats.recent_sales.length > 0 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {stats.recent_sales.map((sale) => {
                                            const saleDate = new Date(sale.date);
                                            const methodColor = PAYMENT_COLORS[sale.payment_method] || '#6B7280';
                                            return (
                                                <div key={sale.id} style={{
                                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                    padding: '12px', background: '#F9FAFB', borderRadius: '10px',
                                                    gap: '12px',
                                                }}>
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <p style={{ fontSize: '13px', fontWeight: 600, color: '#1F2937', margin: 0 }}>
                                                            #{sale.id} — {sale.items?.map(i => i.product?.nombre || 'Producto').join(', ')}
                                                        </p>
                                                        <p style={{ fontSize: '11px', color: '#9CA3AF', margin: '2px 0 0' }}>
                                                            {saleDate.toLocaleDateString('es-AR')} {saleDate.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                    <span style={{
                                                        padding: '4px 10px', borderRadius: '20px', fontSize: '11px',
                                                        fontWeight: 600, background: `${methodColor}15`, color: methodColor,
                                                        flexShrink: 0,
                                                    }}>
                                                        {PAYMENT_LABELS[sale.payment_method] || sale.payment_method}
                                                    </span>
                                                    <span style={{
                                                        fontSize: '14px', fontWeight: 700, color: '#1F2937', flexShrink: 0,
                                                    }}>
                                                        {formatPrice(sale.total)}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div style={{ padding: '40px 20px', textAlign: 'center', color: '#9CA3AF', fontSize: '14px' }}>
                                        Sin ventas registradas
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </main>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @media (max-width: 768px) {
                    main > div {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default SalesDashboard;
