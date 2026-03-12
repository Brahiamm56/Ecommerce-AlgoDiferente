import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productService, categoryService } from '../../services/api';
import { Package, FolderOpen, Plus, Edit, Trash2, Search, ExternalLink, AlertTriangle, Eye, EyeOff, Copy, Check, FileText, Megaphone, Ticket } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatPrice } from '../../utils/formatters';
import AdminNavbar from '../../components/admin/AdminNavbar';

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('products');
    const navigate = useNavigate();
    const [copiedId, setCopiedId] = useState(null);
    const [copiedFichaId, setCopiedFichaId] = useState(null);

    // Copiar imagen del producto al portapapeles
    const handleCopyImage = async (product) => {
        if (!product.imagen_url) {
            toast.error('Este producto no tiene imagen');
            return;
        }
        try {
            const response = await fetch(product.imagen_url);
            const blob = await response.blob();

            const img = new Image();
            img.crossOrigin = 'anonymous';
            const imgLoaded = new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
            });
            img.src = URL.createObjectURL(blob);
            await imgLoaded;

            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            URL.revokeObjectURL(img.src);

            const pngBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));

            await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': pngBlob })
            ]);

            setCopiedId(product.id);
            toast.success('Foto copiada. Pegala en WhatsApp con Ctrl+V');
            setTimeout(() => setCopiedId(null), 2000);
        } catch (err) {
            console.error('Error al copiar imagen:', err);
            toast.error('No se pudo copiar la imagen. Intentá de nuevo.');
        }
    };

    // Copiar ficha técnica con talles disponibles
    const handleCopyFicha = async (product) => {
        const talles = product.talles || [];
        const disponibles = talles
            .filter(t => t.stock > 0)
            .map(t => t.size)
            .join(', ');

        const precio = product.precio_descuento || product.precio;
        const texto = `*${product.nombre}*\nPrecio: $${precio}\nTalles disponibles: ${disponibles || 'Sin stock'}`;

        try {
            await navigator.clipboard.writeText(texto);
            setCopiedFichaId(product.id);
            toast.success('Ficha técnica copiada con talles!');
            setTimeout(() => setCopiedFichaId(null), 2000);
        } catch (err) {
            toast.error('No se pudo copiar la ficha');
        }
    };

    const loadData = async () => {
        try {
            setLoading(true);
            const [productsData, categoriesData] = await Promise.all([
                productService.getAll({ limit: 100 }),
                categoryService.getAll()
            ]);
            setProducts(productsData.products || []);
            setCategories(categoriesData.categories || []);
        } catch (error) {
            toast.error('Error al cargar datos');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleDeleteProduct = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este producto?')) {
            try {
                await productService.delete(id);
                toast.success('Producto eliminado');
                loadData();
            } catch (error) {
                toast.error('Error al eliminar');
            }
        }
    };

    const handleDeleteCategory = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar esta categoría?')) {
            try {
                await categoryService.delete(id);
                toast.success('Categoría eliminada');
                loadData();
            } catch (error) {
                toast.error('Error al eliminar');
            }
        }
    };

    const handleToggleActive = async (product) => {
        try {
            await productService.update(product.id, { activo: !product.activo });
            toast.success(`Producto ${!product.activo ? 'activado' : 'desactivado'}`);
            loadData();
        } catch (error) {
            toast.error('Error al actualizar estado');
        }
    };

    const filteredProducts = products.filter(product =>
        (product?.nombre?.toString()?.toLowerCase() || '').includes((searchTerm || '').toLowerCase())
    );

    const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= 5);
    const outOfStockProducts = products.filter(p => p.stock === 0);

    return (
        <div style={{ minHeight: '100vh', background: '#F3F4F6' }}>
            <AdminNavbar />

            <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
                {/* Stats Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                    <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <p style={{ fontSize: '12px', color: '#6B7280', textTransform: 'uppercase', fontWeight: 600 }}>Productos</p>
                                <p style={{ fontSize: '28px', fontWeight: 700, color: '#1F2937' }}>{products.length}</p>
                            </div>
                            <div style={{ width: '48px', height: '48px', background: '#DBEAFE', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Package style={{ width: '24px', height: '24px', color: '#2563EB' }} />
                            </div>
                        </div>
                    </div>

                    <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <p style={{ fontSize: '12px', color: '#6B7280', textTransform: 'uppercase', fontWeight: 600 }}>Categorías</p>
                                <p style={{ fontSize: '28px', fontWeight: 700, color: '#1F2937' }}>{categories.length}</p>
                            </div>
                            <div style={{ width: '48px', height: '48px', background: '#D1FAE5', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <FolderOpen style={{ width: '24px', height: '24px', color: '#059669' }} />
                            </div>
                        </div>
                    </div>

                    {lowStockProducts.length > 0 && (
                        <div style={{ background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <p style={{ fontSize: '12px', color: '#92400E', textTransform: 'uppercase', fontWeight: 600 }}>Stock Bajo</p>
                                    <p style={{ fontSize: '28px', fontWeight: 700, color: '#92400E' }}>{lowStockProducts.length}</p>
                                </div>
                                <AlertTriangle style={{ width: '32px', height: '32px', color: '#D97706' }} />
                            </div>
                        </div>
                    )}

                    {outOfStockProducts.length > 0 && (
                        <div style={{ background: 'linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <p style={{ fontSize: '12px', color: '#991B1B', textTransform: 'uppercase', fontWeight: 600 }}>Sin Stock</p>
                                    <p style={{ fontSize: '28px', fontWeight: 700, color: '#991B1B' }}>{outOfStockProducts.length}</p>
                                </div>
                                <AlertTriangle style={{ width: '32px', height: '32px', color: '#DC2626' }} />
                            </div>
                        </div>
                    )}
                </div>

                {/* Quick Access */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                    <Link to="/admin/banners" style={{ textDecoration: 'none' }}>
                        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '16px', transition: 'transform 0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                            <div style={{ width: '48px', height: '48px', background: '#F0F9FF', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Megaphone style={{ width: '24px', height: '24px', color: '#0284C7' }} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1F2937', margin: 0 }}>Gestión de Banner</h3>
                                <p style={{ fontSize: '13px', color: '#6B7280', margin: '4px 0 0' }}>Editar anuncio principal</p>
                            </div>
                        </div>
                    </Link>

                    <Link to="/admin/coupons" style={{ textDecoration: 'none' }}>
                        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '16px', transition: 'transform 0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                            <div style={{ width: '48px', height: '48px', background: '#F0FDF4', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Ticket style={{ width: '24px', height: '24px', color: '#16A34A' }} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1F2937', margin: 0 }}>Cupones</h3>
                                <p style={{ fontSize: '13px', color: '#6B7280', margin: '4px 0 0' }}>Crear códigos de descuento</p>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                    <button
                        onClick={() => setActiveTab('products')}
                        style={{
                            padding: '12px 24px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                            fontWeight: 600, fontSize: '14px', transition: 'all 0.2s',
                            background: activeTab === 'products' ? '#2563EB' : 'white',
                            color: activeTab === 'products' ? 'white' : '#6B7280',
                            boxShadow: activeTab === 'products' ? '0 4px 12px rgba(37,99,235,0.3)' : '0 2px 8px rgba(0,0,0,0.06)',
                        }}
                    >
                        <Package style={{ width: '16px', height: '16px', display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
                        Productos
                    </button>
                    <button
                        onClick={() => setActiveTab('categories')}
                        style={{
                            padding: '12px 24px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                            fontWeight: 600, fontSize: '14px', transition: 'all 0.2s',
                            background: activeTab === 'categories' ? '#2563EB' : 'white',
                            color: activeTab === 'categories' ? 'white' : '#6B7280',
                            boxShadow: activeTab === 'categories' ? '0 4px 12px rgba(37,99,235,0.3)' : '0 2px 8px rgba(0,0,0,0.06)',
                        }}
                    >
                        <FolderOpen style={{ width: '16px', height: '16px', display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
                        Categorías
                    </button>
                </div>

                {/* Products Tab */}
                {activeTab === 'products' && (
                    <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                        {/* Actions */}
                        <div style={{ padding: '20px', borderBottom: '1px solid #E5E7EB', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ position: 'relative', flex: '1', minWidth: '200px', maxWidth: '400px' }}>
                                <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: '#9CA3AF' }} />
                                <input
                                    type="text"
                                    placeholder="Buscar productos..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{
                                        width: '100%', padding: '10px 12px 10px 40px', borderRadius: '10px',
                                        border: '1px solid #E5E7EB', fontSize: '14px', outline: 'none',
                                    }}
                                />
                            </div>
                            <Link
                                to="/admin/products/create"
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px',
                                    background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)', borderRadius: '10px',
                                    color: 'white', fontSize: '14px', fontWeight: 600, textDecoration: 'none',
                                    boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
                                }}
                            >
                                <Plus style={{ width: '18px', height: '18px' }} />
                                Nuevo Producto
                            </Link>
                        </div>

                        {/* Products List */}
                        {loading ? (
                            <div style={{ padding: '60px', textAlign: 'center' }}>
                                <div style={{ width: '40px', height: '40px', border: '3px solid #E5E7EB', borderTopColor: '#2563EB', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div style={{ padding: '60px', textAlign: 'center', color: '#6B7280' }}>
                                No se encontraron productos
                            </div>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ background: '#F9FAFB' }}>
                                            <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>Producto</th>
                                            <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>Precio</th>
                                            <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>Talles / Stock</th>
                                            <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>Estado</th>
                                            <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredProducts.map((product) => {
                                            const talles = product.talles || [];
                                            return (
                                                <tr key={product.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                                                    <td style={{ padding: '16px' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                            <img
                                                                src={product.imagen_url}
                                                                alt=""
                                                                style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover', background: '#F3F4F6' }}
                                                            />
                                                            <div>
                                                                <p style={{ fontSize: '14px', fontWeight: 600, color: '#1F2937', margin: 0 }}>{product.nombre}</p>
                                                                <p style={{ fontSize: '12px', color: '#6B7280', margin: '2px 0 0' }}>{product.category?.nombre || 'Sin categoría'}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '16px' }}>
                                                        <p style={{ fontSize: '14px', fontWeight: 600, color: '#1F2937', margin: 0 }}>{formatPrice(product.precio)}</p>
                                                        {product.precio_descuento && (
                                                            <p style={{ fontSize: '12px', color: '#059669', margin: '2px 0 0' }}>Oferta: {formatPrice(product.precio_descuento)}</p>
                                                        )}
                                                    </td>
                                                    <td style={{ padding: '16px' }}>
                                                        {talles.length > 0 ? (
                                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxWidth: '220px' }}>
                                                                {talles.map((t) => (
                                                                    <span
                                                                        key={t.id}
                                                                        style={{
                                                                            display: 'inline-block',
                                                                            padding: '3px 8px',
                                                                            borderRadius: '6px',
                                                                            fontSize: '11px',
                                                                            fontWeight: 600,
                                                                            background: t.stock > 0 ? '#DCFCE7' : '#FEE2E2',
                                                                            color: t.stock > 0 ? '#166534' : '#991B1B',
                                                                            opacity: t.stock === 0 ? 0.6 : 1,
                                                                            textDecoration: t.stock === 0 ? 'line-through' : 'none',
                                                                        }}
                                                                    >
                                                                        {t.size}: {t.stock}u
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <span style={{
                                                                display: 'inline-block', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                                                                background: product.stock === 0 ? '#FEE2E2' : product.stock <= 5 ? '#FEF3C7' : '#D1FAE5',
                                                                color: product.stock === 0 ? '#991B1B' : product.stock <= 5 ? '#92400E' : '#065F46',
                                                            }}>
                                                                {product.stock} unid.
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td style={{ padding: '16px' }}>
                                                        <button
                                                            onClick={() => handleToggleActive(product)}
                                                            style={{
                                                                display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '20px',
                                                                border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600,
                                                                background: product.activo ? '#DBEAFE' : '#F3F4F6',
                                                                color: product.activo ? '#1D4ED8' : '#6B7280',
                                                            }}
                                                        >
                                                            {product.activo ? <Eye style={{ width: '14px', height: '14px' }} /> : <EyeOff style={{ width: '14px', height: '14px' }} />}
                                                            {product.activo ? 'Activo' : 'Oculto'}
                                                        </button>
                                                    </td>
                                                    <td style={{ padding: '16px' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px', flexWrap: 'wrap' }}>
                                                            {/* Copiar Ficha Técnica */}
                                                            <button
                                                                onClick={() => handleCopyFicha(product)}
                                                                title="Copiar ficha técnica para WhatsApp"
                                                                style={{
                                                                    width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                    borderRadius: '8px', border: 'none', cursor: 'pointer',
                                                                    background: copiedFichaId === product.id ? '#D1FAE5' : '#F0FDF4',
                                                                    color: copiedFichaId === product.id ? '#059669' : '#16A34A',
                                                                    transition: 'all 0.2s',
                                                                }}
                                                            >
                                                                {copiedFichaId === product.id
                                                                    ? <Check style={{ width: '16px', height: '16px' }} />
                                                                    : <FileText style={{ width: '16px', height: '16px' }} />
                                                                }
                                                            </button>
                                                            {/* Copiar Imagen */}
                                                            <button
                                                                onClick={() => handleCopyImage(product)}
                                                                title="Copiar imagen al portapapeles"
                                                                style={{
                                                                    width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                    borderRadius: '8px', border: 'none', cursor: 'pointer',
                                                                    background: copiedId === product.id ? '#D1FAE5' : '#F0F9FF',
                                                                    color: copiedId === product.id ? '#059669' : '#0284C7',
                                                                    transition: 'all 0.2s',
                                                                }}
                                                            >
                                                                {copiedId === product.id
                                                                    ? <Check style={{ width: '16px', height: '16px' }} />
                                                                    : <Copy style={{ width: '16px', height: '16px' }} />
                                                                }
                                                            </button>
                                                            <a href={`/producto/${product.id}`} target="_blank" rel="noopener noreferrer" style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', background: '#F3F4F6', color: '#6B7280' }}>
                                                                <ExternalLink style={{ width: '16px', height: '16px' }} />
                                                            </a>
                                                            <Link to={`/admin/products/edit/${product.id}`} style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', background: '#EEF2FF', color: '#4F46E5' }}>
                                                                <Edit style={{ width: '16px', height: '16px' }} />
                                                            </Link>
                                                            <button onClick={() => handleDeleteProduct(product.id)} style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', background: '#FEE2E2', color: '#DC2626', border: 'none', cursor: 'pointer' }}>
                                                                <Trash2 style={{ width: '16px', height: '16px' }} />
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
                )}

                {/* Categories Tab */}
                {activeTab === 'categories' && (
                    <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                        {/* Actions */}
                        <div style={{ padding: '20px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1F2937', margin: 0 }}>
                                {categories.length} Categorías
                            </h3>
                            <Link
                                to="/admin/categories/create"
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px',
                                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', borderRadius: '10px',
                                    color: 'white', fontSize: '14px', fontWeight: 600, textDecoration: 'none',
                                    boxShadow: '0 4px 12px rgba(5,150,105,0.3)',
                                }}
                            >
                                <Plus style={{ width: '18px', height: '18px' }} />
                                Nueva Categoría
                            </Link>
                        </div>

                        {/* Categories Grid */}
                        <div style={{ padding: '20px' }}>
                            {categories.length === 0 ? (
                                <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>
                                    No hay categorías creadas
                                </div>
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                                    {categories.map((category) => {
                                        const productCount = products.filter(p => p.id_categoria === category.id).length;
                                        return (
                                            <div
                                                key={category.id}
                                                style={{
                                                    background: '#F9FAFB', borderRadius: '12px', padding: '20px',
                                                    border: '1px solid #E5E7EB', transition: 'all 0.2s',
                                                }}
                                            >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                    <div>
                                                        <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#1F2937', margin: '0 0 4px' }}>{category.nombre}</h4>
                                                        <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>/{category.slug}</p>
                                                        <p style={{ fontSize: '14px', color: '#2563EB', fontWeight: 500, marginTop: '8px' }}>{productCount} productos</p>
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <Link to={`/admin/categories/edit/${category.id}`} style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', background: 'white', color: '#4F46E5', border: '1px solid #E5E7EB' }}>
                                                            <Edit style={{ width: '14px', height: '14px' }} />
                                                        </Link>
                                                        <button onClick={() => handleDeleteCategory(category.id)} style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', background: 'white', color: '#DC2626', border: '1px solid #E5E7EB', cursor: 'pointer' }}>
                                                            <Trash2 style={{ width: '14px', height: '14px' }} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default Dashboard;
