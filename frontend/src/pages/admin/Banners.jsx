import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { bannerService } from '../../services/api';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Banners = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        text: '',
        active: true,
        color: '#000000',
        link: ''
    });

    useEffect(() => {
        const loadBanner = async () => {
            try {
                const data = await bannerService.get();
                if (data) {
                    setFormData({
                        text: data.text || '',
                        active: data.active ?? true,
                        color: data.color || '#000000',
                        link: data.link || ''
                    });
                }
            } catch (error) {
                console.error('Error al cargar banner', error);
                toast.error('Error al cargar configuración del banner');
            } finally {
                setLoading(false);
            }
        };
        loadBanner();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            await bannerService.update(formData);
            toast.success('Banner actualizado correctamente');
            // navigate('/admin/dashboard'); // Opcional: volver al dashboard o quedarse aquí
        } catch (error) {
            console.error('Error al guardar', error);
            toast.error('Error al guardar cambios');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <header className="bg-white shadow mb-8">
                <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
                    <button onClick={() => navigate('/admin/dashboard')} className="p-2 hover:bg-gray-100 rounded-full">
                        <ArrowLeft className="w-6 h-6 text-gray-600" />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">Gestión de Banner</h1>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
                    <div className="mb-8 p-4 bg-blue-50 rounded-lg flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-blue-800">
                            Este banner aparecerá en la parte superior del Carrusel en la página de inicio.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Texto */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Texto del Banner
                            </label>
                            <input
                                type="text"
                                name="text"
                                required
                                value={formData.text}
                                onChange={handleChange}
                                placeholder="Ej: ¡Envío gratis en compras superiores a $50.000!"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>

                        {/* Link Opcional */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Enlace (Opcional)
                            </label>
                            <input
                                type="text"
                                name="link"
                                value={formData.link}
                                onChange={handleChange}
                                placeholder="Ej: /categoria/ofertas"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                            <p className="text-xs text-gray-500 mt-1">Si dejas esto vacío, el banner no será clickeable.</p>
                        </div>

                        {/* Color */}
                        {/* Por ahora no lo usamos en el frontend (usamos imagen estática), pero lo guardamos por si acaso */}
                        {/*
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Color de fondo (Hex)
                            </label>
                            <div className="flex gap-3 items-center">
                                <input
                                    type="color"
                                    name="color"
                                    value={formData.color}
                                    onChange={handleChange}
                                    className="h-10 w-20 rounded cursor-pointer"
                                />
                                <input
                                    type="text"
                                    name="color"
                                    value={formData.color}
                                    onChange={handleChange}
                                    className="w-32 px-3 py-2 border border-gray-300 rounded-lg uppercase"
                                />
                            </div>
                        </div>
                        */}

                        {/* Activo / Inactivo */}
                        {/* Activo / Inactivo */}
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div>
                                <span className="block text-sm font-medium text-gray-900">Estado del Banner</span>
                                <span className="block text-xs text-gray-500 mt-1">
                                    {formData.active ? 'El banner es visible en la página de inicio' : 'El banner está oculto'}
                                </span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="active"
                                    checked={formData.active}
                                    onChange={handleChange}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                        {/* Botón Guardar */}
                        <div className="pt-6 border-t border-gray-100 flex justify-end">
                            <button
                                type="submit"
                                disabled={saving}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold shadow-lg transition-all ${saving
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-200'
                                    }`}
                            >
                                <Save className="w-5 h-5" />
                                {saving ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default Banners;
