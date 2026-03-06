import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { categoryService } from '../../services/api';
import toast from 'react-hot-toast';
import { ArrowLeft, Save } from 'lucide-react';

const CategoryForm = ({ category = null, isEdit = false }) => {
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            nombre: category?.nombre || '',
            activo: category?.activo !== false
        }
    });

    const onSubmit = async (data) => {
        try {
            const payload = {
                nombre: data.nombre,
                activo: data.activo,
            };

            if (isEdit) {
                await categoryService.update(category.id, payload);
                toast.success('Categoría actualizada correctamente');
            } else {
                await categoryService.create(payload);
                toast.success('Categoría creada exitosamente');
            }
            navigate('/admin/categories');
        } catch (error) {
            console.error(error);
            toast.error(error.message || 'Error al guardar la categoría');
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/admin/categories')}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6 text-gray-600" />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {isEdit ? 'Editar Categoría' : 'Nueva Categoría'}
                    </h1>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow rounded-lg p-6 sm:p-8 space-y-6">

                {/* Nombre */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre de la Categoría</label>
                    <input
                        type="text"
                        {...register('nombre', { required: 'El nombre es obligatorio' })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-10 border px-3"
                    />
                    {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>}
                </div>

                {/* Checks */}
                <div className="flex items-center">
                    <input
                        id="activo"
                        type="checkbox"
                        {...register('activo')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="activo" className="ml-2 block text-sm text-gray-900">
                        Visible en tienda
                    </label>
                </div>

                <div className="pt-5 border-t border-gray-200 flex justify-end">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/categories')}
                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <div className="flex items-center gap-2">
                            <Save className="w-4 h-4" />
                            Guardar Categoría
                        </div>
                    </button>
                </div>

            </form>
        </div>
    );
};

export default CategoryForm;
