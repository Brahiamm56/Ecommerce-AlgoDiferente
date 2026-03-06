import { useState, useEffect } from 'react';
import { proveedoresService } from '@services/api';
import AdminNavbar from '@components/admin/AdminNavbar';
import {
    Plus, Edit, Trash2, Phone, Mail, Search, X, Truck
} from 'lucide-react';
import toast from 'react-hot-toast';

const Proveedores = () => {
    const [proveedores, setProveedores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({
        nombre: '', telefono: '', email: '', rubro: '', notas: ''
    });

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await proveedoresService.getAll(
                searchTerm ? { search: searchTerm } : {}
            );
            setProveedores(data.proveedores || []);
        } catch (err) {
            toast.error('Error al cargar proveedores');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, [searchTerm]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editing) {
                await proveedoresService.update(editing.id, form);
                toast.success('Proveedor actualizado');
            } else {
                await proveedoresService.create(form);
                toast.success('Proveedor creado');
            }
            setShowModal(false);
            setEditing(null);
            resetForm();
            loadData();
        } catch (err) {
            toast.error(err.message || 'Error al guardar');
        }
    };

    const handleEdit = (prov) => {
        setEditing(prov);
        setForm({
            nombre: prov.nombre,
            telefono: prov.telefono || '',
            email: prov.email || '',
            rubro: prov.rubro || '',
            notas: prov.notas || ''
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Eliminar este proveedor?')) return;
        try {
            await proveedoresService.delete(id);
            toast.success('Proveedor eliminado');
            loadData();
        } catch (err) {
            toast.error('Error al eliminar');
        }
    };

    const resetForm = () => {
        setForm({ nombre: '', telefono: '', email: '', rubro: '', notas: '' });
    };

    const openNew = () => {
        setEditing(null);
        resetForm();
        setShowModal(true);
    };

    const openWhatsApp = (tel) => {
        const cleaned = tel.replace(/\D/g, '');
        window.open(`https://wa.me/${cleaned}`, '_blank');
    };

    return (
        <div style={{ minHeight: '100vh', background: '#F3F4F6' }}>
            <AdminNavbar />

            <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1F2937', margin: 0 }}>Proveedores</h1>
                        <p style={{ fontSize: '14px', color: '#6B7280', margin: '4px 0 0' }}>
                            {proveedores.length} proveedor{proveedores.length !== 1 ? 'es' : ''} registrado{proveedores.length !== 1 ? 's' : ''}
                        </p>
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
                        Nuevo Proveedor
                    </button>
                </div>

                {/* Search */}
                <div style={{
                    position: 'relative', marginBottom: '20px', maxWidth: '400px',
                }}>
                    <Search style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: '#9CA3AF' }} />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o rubro..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%', padding: '12px 14px 12px 42px', borderRadius: '12px',
                            border: '1px solid #E5E7EB', fontSize: '14px', outline: 'none',
                            background: 'white', boxSizing: 'border-box',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                        }}
                    />
                </div>

                {/* Grid */}
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
                        <div style={{
                            width: '40px', height: '40px', border: '3px solid #E5E7EB',
                            borderTopColor: '#00c2cc', borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                        }} />
                    </div>
                ) : proveedores.length === 0 ? (
                    <div style={{
                        background: 'white', borderRadius: '16px', padding: '60px',
                        textAlign: 'center', color: '#6B7280',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    }}>
                        <Truck style={{ width: '48px', height: '48px', color: '#D1D5DB', margin: '0 auto 12px' }} />
                        <p style={{ fontWeight: 600, margin: '0 0 4px' }}>Sin proveedores</p>
                        <p style={{ fontSize: '14px' }}>Agregá tu primer proveedor</p>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                        gap: '16px',
                    }}>
                        {proveedores.map(prov => (
                            <div key={prov.id} style={{
                                background: 'white', borderRadius: '14px', padding: '20px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                            }}
                                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.1)'; }}
                                onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'; }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                                    <div>
                                        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1F2937', margin: '0 0 6px' }}>
                                            {prov.nombre}
                                        </h3>
                                        {prov.rubro && (
                                            <span style={{
                                                padding: '3px 10px', borderRadius: '20px', fontSize: '11px',
                                                fontWeight: 600, background: '#F3F4F6', color: '#6B7280',
                                            }}>
                                                {prov.rubro}
                                            </span>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', gap: '6px' }}>
                                        <button onClick={() => handleEdit(prov)} style={cardBtnStyle('#EEF2FF', '#4F46E5')}>
                                            <Edit style={{ width: '14px', height: '14px' }} />
                                        </button>
                                        <button onClick={() => handleDelete(prov.id)} style={cardBtnStyle('#FEE2E2', '#DC2626')}>
                                            <Trash2 style={{ width: '14px', height: '14px' }} />
                                        </button>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {prov.telefono && (
                                        <button
                                            onClick={() => openWhatsApp(prov.telefono)}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '8px',
                                                background: '#F0FDF4', padding: '8px 12px', borderRadius: '8px',
                                                border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left',
                                                color: '#16A34A', fontSize: '13px', fontWeight: 500,
                                            }}
                                        >
                                            <Phone style={{ width: '14px', height: '14px' }} />
                                            {prov.telefono}
                                        </button>
                                    )}
                                    {prov.email && (
                                        <a
                                            href={`mailto:${prov.email}`}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '8px',
                                                background: '#EFF6FF', padding: '8px 12px', borderRadius: '8px',
                                                textDecoration: 'none',
                                                color: '#2563EB', fontSize: '13px', fontWeight: 500,
                                            }}
                                        >
                                            <Mail style={{ width: '14px', height: '14px' }} />
                                            {prov.email}
                                        </a>
                                    )}
                                </div>

                                {prov.notas && (
                                    <p style={{ fontSize: '12px', color: '#9CA3AF', margin: '12px 0 0', lineHeight: 1.4 }}>
                                        {prov.notas}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
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
                                {editing ? 'Editar Proveedor' : 'Nuevo Proveedor'}
                            </h2>
                            <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}>
                                <X style={{ width: '20px', height: '20px', color: '#6B7280' }} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <label style={labelStyle}>Nombre *</label>
                                    <input
                                        required
                                        value={form.nombre}
                                        onChange={e => setForm({ ...form, nombre: e.target.value })}
                                        style={inputStyle}
                                        placeholder="Nombre del proveedor"
                                    />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <div>
                                        <label style={labelStyle}>Teléfono</label>
                                        <input
                                            value={form.telefono}
                                            onChange={e => setForm({ ...form, telefono: e.target.value })}
                                            style={inputStyle}
                                            placeholder="+54 11 1234-5678"
                                        />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Email</label>
                                        <input
                                            type="email"
                                            value={form.email}
                                            onChange={e => setForm({ ...form, email: e.target.value })}
                                            style={inputStyle}
                                            placeholder="email@ejemplo.com"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label style={labelStyle}>Rubro</label>
                                    <input
                                        value={form.rubro}
                                        onChange={e => setForm({ ...form, rubro: e.target.value })}
                                        style={inputStyle}
                                        placeholder="Ej: Calzado, Indumentaria"
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
                                    {editing ? 'Guardar' : 'Crear Proveedor'}
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
                @media (max-width: 768px) {
                    main > div:last-of-type {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </div>
    );
};

const labelStyle = { display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' };
const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #E5E7EB',
    fontSize: '14px', outline: 'none', boxSizing: 'border-box',
};
const cardBtnStyle = (bg, color) => ({
    width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center',
    borderRadius: '8px', border: 'none', cursor: 'pointer', background: bg, color,
});

export default Proveedores;
