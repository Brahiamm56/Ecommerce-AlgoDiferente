import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CategoryForm from '../../components/admin/CategoryForm';
import { categoryService } from '../../services/api';
import toast from 'react-hot-toast';

const CategoryEdit = () => {
    const { id } = useParams();
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCategory = async () => {
            try {
                setLoading(true);
                const data = await categoryService.getById(id);
                setCategory(data);
            } catch (error) {
                console.error(error);
                toast.error('Error al cargar categoría');
            } finally {
                setLoading(false);
            }
        };
        loadCategory();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!category) return <div>Categoría no encontrada</div>;

    return <CategoryForm category={category} isEdit={true} />;
};

export default CategoryEdit;
