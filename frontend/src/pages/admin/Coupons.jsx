import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { couponService } from '../../services/api';
import { ArrowLeft, Plus, Trash2, Power, Tag } from 'lucide-react';
import toast from 'react-hot-toast';

const Coupons = () => {
    const navigate = useNavigate();
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        discount: '',
        active: true
    });
    const [creating, setCreating] = useState(false);

    const loadCoupons = async () => {
        try {
            setLoading(true);
            const data = await couponService.getAll();
            setCoupons(data);
        } catch (error) {
            console.error(error);
            toast.error('Error al cargar cupones');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCoupons();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('¿Seguro que deseas eliminar este cupón?')) {
            try {
                await couponService.delete(id);
                toast.success('Cupón eliminado');
                loadCoupons();
            } catch (error) {
                toast.error('Error al eliminar');
            }
        }
    };

    const handleToggle = async (id) => {
        try {
            await couponService.toggleActive(id);
            loadCoupons(); // Recargar para ver cambios
            toast.success('Estado actualizado');
        } catch (error) {
            toast.error('Error al cambiar estado');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.code || !formData.discount) return;

        try {
            setCreating(true);
            await couponService.create({
                ...formData,
                code: formData.code.toUpperCase(), // Códigos siempre en mayúsculas
                discount: parseFloat(formData.discount)
            });
            toast.success('Cupón creado');
            setShowModal(false);
            setFormData({ code: '', discount: '', active: true });
            loadCoupons();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error al crear cupón');
        } finally {
            setCreating(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <header className="bg-white shadow mb-8">
                <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/admin/dashboard')} className="p-2 hover:bg-gray-100 rounded-full">
                            <ArrowLeft className="w-6 h-6 text-gray-600" />
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900">Gestión de Cupones</h1>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm font-medium"
                    >
                        <Plus className="w-5 h-5" />
                        Nuevo Cupón
                    </button>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4">
                {loading ? (
                    <div className="flex justify-center p-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                    </div>
                ) : coupons.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
                        <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No hay cupones creados</h3>
                        <p className="text-gray-500 mb-6">Crea códigos de descuento para tus promociones.</p>
                        <button
                            onClick={() => setShowModal(true)}
                            className="text-green-600 font-medium hover:text-green-700"
                        >
                            Crear mi primer cupón
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {coupons.map((coupon) => (
                            <div key={coupon.id} className={`bg-white rounded-xl shadow-sm border p-6 transition-all ${!coupon.active ? 'opacity-75 bg-gray-50' : 'border-gray-100 hover:shadow-md'}`}>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-green-50 rounded-lg">
                                        <Tag className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleToggle(coupon.id)}
                                            className={`p-2 rounded-lg transition-colors ${coupon.active ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-200'}`}
                                            title={coupon.active ? 'Desactivar' : 'Activar'}
                                        >
                                            <Power className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(coupon.id)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Eliminar"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold text-gray-800 tracking-wide font-mono mb-1">
                                    {coupon.code}
                                </h3>
                                <p className="text-gray-500 text-sm mb-4">
                                    Descuento: <span className="font-semibold text-gray-900">{coupon.discount}%</span>
                                </p>

                                <div className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${coupon.active
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-200 text-gray-600'
                                    }`}>
                                    {coupon.active ? 'ACTIVO' : 'INACTIVO'}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Modal Crear */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900">Nuevo Cupón</h3>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Código Promocional</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ej: VERANO2025"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none font-mono uppercase"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Porcentaje de Descuento (%)</label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    max="100"
                                    placeholder="Ej: 15"
                                    value={formData.discount}
                                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                />
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <input
                                    type="checkbox"
                                    id="modalActive"
                                    checked={formData.active}
                                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                    className="w-5 h-5 text-green-600 rounded focus:ring-green-500 cursor-pointer"
                                />
                                <label htmlFor="modalActive" className="text-sm text-gray-700 cursor-pointer">Activar inmediatamente</label>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={creating}
                                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium shadow-sm"
                                >
                                    {creating ? 'Creando...' : 'Crear Cupón'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Coupons;
