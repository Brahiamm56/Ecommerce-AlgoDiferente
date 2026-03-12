import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryService } from '../../services/api';
import { Plus, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminNavbar from '../../components/admin/AdminNavbar';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadCategories = async () => {
        try {
            setLoading(true);
            const data = await categoryService.getAll();
            setCategories(data.categories || []);
        } catch (error) {
            toast.error('Error al cargar categorías');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar esta categoría?')) {
            try {
                await categoryService.delete(id);
                toast.success('Categoría eliminada');
                loadCategories();
            } catch (error) {
                toast.error('Error al eliminar');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <AdminNavbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Gestión de Categorías</h1>
                    <Link
                        to="/admin/categories/create"
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <Plus className="-ml-1 mr-2 h-5 w-5" />
                        Nueva Categoría
                    </Link>
                </div>

                {/* Grid de Categorías */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map((category) => (
                            <div key={category.id} className="bg-white overflow-hidden shadow rounded-lg border border-gray-100 group hover:shadow-md transition-shadow">
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            {category.imagen_url ? (
                                                <img className="h-12 w-12 rounded-lg object-cover bg-gray-100" src={category.imagen_url} alt="" />
                                            ) : (
                                                <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                                                    No Img
                                                </div>
                                            )}
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">
                                                    ID: {category.id} - {category.slug}
                                                </dt>
                                                <dd>
                                                    <div className="text-lg font-medium text-gray-900">
                                                        {category.nombre}
                                                    </div>
                                                </dd>
                                                <dd className="mt-1">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${category.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                        {category.activo ? 'Activa' : 'Inactiva'}
                                                    </span>
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-5 py-3">
                                    <div className="text-sm flex justify-end gap-4">
                                        <Link to={`/admin/categories/edit/${category.id}`} className="font-medium text-indigo-600 hover:text-indigo-900 flex items-center gap-1">
                                            <Edit className="w-4 h-4" /> Editar
                                        </Link>
                                        <button onClick={() => handleDelete(category.id)} className="font-medium text-red-600 hover:text-red-900 flex items-center gap-1">
                                            <Trash2 className="w-4 h-4" /> Eliminar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Categories;
