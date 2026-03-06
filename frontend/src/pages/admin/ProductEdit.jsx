import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductForm from '../../components/admin/ProductForm';
import { productService } from '../../services/api';
import toast from 'react-hot-toast';

const ProductEdit = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProduct = async () => {
            try {
                setLoading(true);
                const data = await productService.getById(id);
                setProduct(data.product);
            } catch (error) {
                console.error(error);
                toast.error('Error al cargar producto');
            } finally {
                setLoading(false);
            }
        };
        loadProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!product) return <div>Producto no encontrado</div>;

    return <ProductForm product={product} isEdit={true} />;
};

export default ProductEdit;
