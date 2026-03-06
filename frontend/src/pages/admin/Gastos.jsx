import { useState, useEffect } from 'react';
import { gastosService } from '@services/api';
import { formatPrice } from '@utils/formatters';
import AdminNavbar from '@components/admin/AdminNavbar';
import {
    Plus, Edit, Trash2, Wallet, Building, Users, Wrench, ShoppingBag, MoreHorizontal,
    X, Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIAS = [
    { value: 'alquiler', label: 'Alquiler', color: '#3B82F6', bg: '#EFF6FF', icon: Building },
    { value: 'sueldos', label: 'Sueldos', color: '#10B981', bg: '#ECFDF5', icon: Users },
    { value: 'servicios', label: 'Servicios', color: '#F59E0B', bg: '#FFFBEB', icon: Wrench },
    { value: 'mercaderia', label: 'Mercadería', color: '#e91e8c', bg: '#FDF2F8', icon: ShoppingBag },
    { value: 'varios', label: 'Varios', color: '#6B7280', bg: '#F3F4F6', icon: MoreHorizontal },
];

const getCatInfo = (cat) => CATEGORIAS.find(c => c.value === cat) || CATEGORIAS[4];

const Gastos = () => {
    const [gastos, setGastos] = useState([]);
    const [stats, setStats] = useState({ total: 0, porCategoria: {} });
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({
        descripcion: '', monto: '', categoria: 'varios',
        fecha: new Date().toISOString().split('T')[0], notas: ''
    });

    const now = new Date();
    const [filterMes, setFilterMes] = useState(now.getMonth() + 1);
    const [filterAño, setFilterAño] = useState(now.getFullYear());

    const loadData = async () => {
        try {
            setLoading(true);
            const [gastosData, statsData] = await Promise.all([
                gastosService.getAll({ mes: filterMes, año: filterAño }),
                gastosService.getStats()
            ]);
            setGastos(gastosData.gastos || []);
            setStats(statsData);
        } catch (err) {
            toast.error('Error al cargar gastos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, [filterMes, filterAño]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editing) {
                await gastosService.update(editing.id, form);
                toast.success('Gasto actualizado');
            } else {
                await gastosService.create(form);
                toast.success('Gasto creado');
            }
            setShowModal(false);
            setEditing(null);
            resetForm();
            loadData();
        } catch (err) {
            toast.error(err.message || 'Error al guardar');
        }
    };

    const handleEdit = (gasto) => {
        setEditing(gasto);
        setForm({
            descripcion: gasto.descripcion,
            monto: gasto.monto,
            categoria: gasto.categoria,
            fecha: gasto.fecha,
            notas: gasto.notas || ''
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Eliminar este gasto?')) return;
        try {
            await gastosService.delete(id);
            toast.success('Gasto eliminado');
            loadData();
        } catch (err) {
            toast.error('Error al eliminar');
        }
    };

    const resetForm = () => {
        setForm({
            descripcion: '', monto: '', categoria: 'varios',
            fecha: new Date().toISOString().split('T')[0], notas: ''
        });
    };

    const openNew = () => {
        setEditing(null);
        resetForm();
        setShowModal(true);
    };

    const metricCards = [
        {
            label: 'Total del Mes',
            value: formatPrice(stats.total),
            icon: Wallet,
            gradient: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
        },
        ...CATEGORIAS.slice(0, 3).map(cat => ({
            label: cat.label,
            value: formatPrice(stats.porCategoria?.[cat.value] || 0),
            icon: cat.icon,
            gradient: `linear-gradient(135deg, ${cat.color}20, ${cat.color}10)`,
            textColor: cat.color,
        }))
    ];

    return (
        <div style={{ minHeight: '100vh', background: '#F3F4F6' }}>
            <AdminNavbar />

            <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div>
                        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1F2937', margin: 0 }}>Gastos</h1>
                        <p style={{ fontSize: '14px', color: '#6B7280', margin: '4px 0 0' }}>Gestión de gastos del negocio</p>
                    </div>
                    <button
                        onClick={openNew}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px',
                            background: '#00c2cc', borderRadius: '10px', border: 'none',
                            color: 'white', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(0,194,204,0.3)',
                        }}
                    >
                        <Plus style={{ width: '18px', height: '18px' }} />
                        Nuevo Gasto
                    </button>
                </div>

                {/* Metric Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                    {metricCards.map((card, i) => (
                        <div key={i} style={{
                            background: i === 0 ? card.gradient : 'white',
                            borderRadius: '14px', padding: '20px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                            color: i === 0 ? 'white' : '#1F2937',
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <p style={{ fontSize: '12px', textTransform: 'uppercase', fontWeight: 600, opacity: 0.8, margin: '0 0 6px' }}>
                                        {card.label}
                                    </p>
                                    <p style={{ fontSize: '22px', fontWeight: 800, margin: 0, color: i === 0 ? 'white' : (card.textColor || '#1F2937') }}>
                                        {card.value}
                                    </p>
                                </div>
                                <div style={{
                                    width: '40px', height: '40px', borderRadius: '12px',
                                    background: i === 0 ? 'rgba(255,255,255,0.2)' : card.gradient,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <card.icon style={{ width: '20px', height: '20px', color: i === 0 ? 'white' : card.textColor }} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div style={{
                    display: 'flex', gap: '12px', marginBottom: '16px', alignItems: 'center',
                    background: 'white', padding: '14px 20px', borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                }}>
                    <Calendar style={{ width: '18px', height: '18px', color: '#9CA3AF' }} />
                    <select
                        value={filterMes}
                        onChange={e => setFilterMes(Number(e.target.value))}
                        style={{
                            padding: '8px 12px', borderRadius: '8px', border: '1px solid #E5E7EB',
                            fontSize: '14px', background: 'white', cursor: 'pointer',
                        }}
                    >
                        {Array.from({ length: 12 }, (_, i) => (
                            <option key={i} value={i + 1}>
                                {new Date(2000, i).toLocaleString('es-AR', { month: 'long' })}
                            </option>
                        ))}
                    </select>
                    <select
                        value={filterAño}
                        onChange={e => setFilterAño(Number(e.target.value))}
                        style={{
                            padding: '8px 12px', borderRadius: '8px', border: '1px solid #E5E7EB',
                            fontSize: '14px', background: 'white', cursor: 'pointer',
                        }}
                    >
                        {[2024, 2025, 2026, 2027].map(y => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </div>

                {/* Table */}
                <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                    {loading ? (
                        <div style={{ padding: '60px', textAlign: 'center' }}>
                            <div style={{
                                width: '40px', height: '40px', border: '3px solid #E5E7EB',
                                borderTopColor: '#00c2cc', borderRadius: '50%',
                                animation: 'spin 1s linear infinite', margin: '0 auto',
                            }} />
                        </div>
                    ) : gastos.length === 0 ? (
                        <div style={{ padding: '60px', textAlign: 'center', color: '#6B7280' }}>
                            No hay gastos registrados en este período
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: '#F9FAFB' }}>
                                        <th style={thStyle}>Fecha</th>
                                        <th style={thStyle}>Descripción</th>
                                        <th style={thStyle}>Categoría</th>
                                        <th style={{ ...thStyle, textAlign: 'right' }}>Monto</th>
                                        <th style={thStyle}>Notas</th>
                                        <th style={{ ...thStyle, textAlign: 'right' }}>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {gastos.map(g => {
                                        const cat = getCatInfo(g.categoria);
                                        return (
                                            <tr key={g.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                                                <td style={tdStyle}>
                                                    {new Date(g.fecha + 'T00:00:00').toLocaleDateString('es-AR')}
                                                </td>
                                                <td style={{ ...tdStyle, fontWeight: 600, color: '#1F2937' }}>{g.descripcion}</td>
                                                <td style={tdStyle}>
                                                    <span style={{
                                                        padding: '4px 10px', borderRadius: '20px', fontSize: '12px',
                                                        fontWeight: 600, background: cat.bg, color: cat.color,
                                                    }}>
                                                        {cat.label}
                                                    </span>
                                                </td>
                                                <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 700, color: '#EF4444' }}>
                                                    -{formatPrice(g.monto)}
                                                </td>
                                                <td style={{ ...tdStyle, color: '#9CA3AF', fontSize: '12px', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {g.notas || '—'}
                                                </td>
                                                <td style={{ ...tdStyle, textAlign: 'right' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                                                        <button onClick={() => handleEdit(g)} style={actionBtnStyle('#EEF2FF', '#4F46E5')}>
                                                            <Edit style={{ width: '14px', height: '14px' }} />
                                                        </button>
                                                        <button onClick={() => handleDelete(g.id)} style={actionBtnStyle('#FEE2E2', '#DC2626')}>
                                                            <Trash2 style={{ width: '14px', height: '14px' }} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>

            {/* Modal */}
            {showModal && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div onClick={() => setShowModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)' }} />
                    <div style={{
                        position: 'relative', background: 'white', borderRadius: '16px',
                        padding: '28px', width: '100%', maxWidth: '480px', margin: '16px',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>
                                {editing ? 'Editar Gasto' : 'Nuevo Gasto'}
                            </h2>
                            <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}>
                                <X style={{ width: '20px', height: '20px', color: '#6B7280' }} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <label style={labelStyle}>Descripción *</label>
                                    <input
                                        required
                                        value={form.descripcion}
                                        onChange={e => setForm({ ...form, descripcion: e.target.value })}
                                        style={inputStyle}
                                        placeholder="Ej: Alquiler local"
                                    />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <div>
                                        <label style={labelStyle}>Monto ($) *</label>
                                        <input
                                            required type="number" step="0.01" min="0.01"
                                            value={form.monto}
                                            onChange={e => setForm({ ...form, monto: e.target.value })}
                                            style={inputStyle}
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Categoría *</label>
                                        <select
                                            value={form.categoria}
                                            onChange={e => setForm({ ...form, categoria: e.target.value })}
                                            style={inputStyle}
                                        >
                                            {CATEGORIAS.map(c => (
                                                <option key={c.value} value={c.value}>{c.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label style={labelStyle}>Fecha *</label>
                                    <input
                                        required type="date"
                                        value={form.fecha}
                                        onChange={e => setForm({ ...form, fecha: e.target.value })}
                                        style={inputStyle}
                                    />
                                </div>
                                <div>
                                    <label style={labelStyle}>Notas</label>
                                    <textarea
                                        value={form.notas}
                                        onChange={e => setForm({ ...form, notas: e.target.value })}
                                        style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                                        placeholder="Notas opcionales..."
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
                                <button
                                    type="button" onClick={() => setShowModal(false)}
                                    style={{
                                        padding: '10px 20px', borderRadius: '10px', border: '1px solid #E5E7EB',
                                        background: 'white', color: '#6B7280', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                                    }}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    style={{
                                        padding: '10px 24px', borderRadius: '10px', border: 'none',
                                        background: '#00c2cc', color: 'white', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                                        boxShadow: '0 4px 12px rgba(0,194,204,0.3)',
                                    }}
                                >
                                    {editing ? 'Guardar' : 'Crear Gasto'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

const thStyle = { padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' };
const tdStyle = { padding: '14px 16px', fontSize: '14px', color: '#374151' };
const labelStyle = { display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' };
const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #E5E7EB',
    fontSize: '14px', outline: 'none', boxSizing: 'border-box',
};
const actionBtnStyle = (bg, color) => ({
    width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
    borderRadius: '8px', border: 'none', cursor: 'pointer', background: bg, color,
});

export default Gastos;
