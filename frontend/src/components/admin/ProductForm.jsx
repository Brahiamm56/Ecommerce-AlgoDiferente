import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { productService, categoryService } from '../../services/api';
import toast from 'react-hot-toast';
import { ArrowLeft, Save, Upload, Image as ImageIcon, Check, Plus, Trash2 } from 'lucide-react';

// Colores de la marca (Consistent with other premium components)
const brandColors = {
    cyan: '#00D4D4',
    magenta: '#FF00FF',
    black: '#0A0A0A',
    white: '#FFFFFF',
    grayLight: '#F3F4F6',
};

const ProductForm = ({ product = null, isEdit = false }) => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [previewUrl1, setPreviewUrl1] = useState(product?.imagen_url || '');
    const [previewUrl2, setPreviewUrl2] = useState(product?.imagen_url_2 || '');
    const [file1, setFile1] = useState(null);
    const [file2, setFile2] = useState(null);

    // Estado para talles
    const [talles, setTalles] = useState(
        product?.talles?.map(t => ({ size: t.size, stock: t.stock })) || []
    );
    const [newSize, setNewSize] = useState('');
    const [newStock, setNewStock] = useState(0);

    // Configuración de React Hook Form
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            nombre: product?.nombre || '',
            descripcion: product?.descripcion || '',
            precio: product?.precio || '',
            precio_descuento: product?.precio_descuento || '',
            category_id: product?.category?.id || product?.category_id || '',
            destacado: product?.destacado || false,
            mas_vendido: product?.mas_vendido || false,
            en_oferta: product?.en_oferta || false,
            activo: product?.activo !== false,
        }
    });

    const handleFile1Change = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setFile1(file);
            setPreviewUrl1(URL.createObjectURL(file));
        }
    };

    const handleFile2Change = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setFile2(file);
            setPreviewUrl2(URL.createObjectURL(file));
        }
    };

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await categoryService.getAll();
                setCategories(data.categories || data);
            } catch (error) {
                console.error('Error cargando categorías');
            }
        };
        loadCategories();
    }, []);

    // Funciones para gestión de talles
    const handleAddSize = () => {
        const trimmed = newSize.trim();
        if (!trimmed) {
            toast.error('Ingresá un talle');
            return;
        }
        if (talles.some(t => t.size.toLowerCase() === trimmed.toLowerCase())) {
            toast.error('Ese talle ya existe');
            return;
        }
        setTalles([...talles, { size: trimmed, stock: parseInt(newStock) || 0 }]);
        setNewSize('');
        setNewStock(0);
    };

    const handleRemoveSize = (index) => {
        setTalles(talles.filter((_, i) => i !== index));
    };

    const handleSizeStockChange = (index, value) => {
        const updated = [...talles];
        updated[index].stock = Math.max(0, parseInt(value) || 0);
        setTalles(updated);
    };

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('nombre', data.nombre);
            formData.append('descripcion', data.descripcion);
            formData.append('precio', data.precio);
            formData.append('stock', talles.reduce((sum, t) => sum + t.stock, 0));
            formData.append('category_id', data.category_id);
            formData.append('destacado', data.destacado);
            formData.append('mas_vendido', data.mas_vendido);
            formData.append('en_oferta', data.en_oferta);
            formData.append('activo', data.activo);

            // Enviar talles como JSON
            formData.append('talles', JSON.stringify(talles));

            if (data.precio_descuento) formData.append('precio_descuento', data.precio_descuento);

            // Imagen 1: archivo nuevo o URL existente
            if (file1) {
                formData.append('image1', file1);
            } else if (previewUrl1) {
                formData.append('imagen_url', previewUrl1);
            }

            // Imagen 2: archivo nuevo o URL existente
            if (file2) {
                formData.append('image2', file2);
            } else if (previewUrl2) {
                formData.append('imagen_url_2', previewUrl2);
            }

            if (isEdit) {
                await productService.update(product.id, formData);
                toast.success('Producto actualizado correctamente');
            } else {
                await productService.create(formData);
                toast.success('Producto creado exitosamente');
            }
            navigate('/admin/dashboard');
        } catch (error) {
            console.error(error);
            toast.error(error.message || 'Error al guardar el producto');
        } finally {
            setLoading(false);
        }
    };

    const totalStock = talles.reduce((sum, t) => sum + t.stock, 0);

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header Sticky */}
            <div style={{
                position: 'sticky',
                top: 0,
                zIndex: 30,
                background: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid #E5E7EB',
                padding: '16px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button
                        type="button"
                        onClick={() => navigate('/admin/dashboard')}
                        style={{
                            background: 'white',
                            border: '1px solid #E5E7EB',
                            borderRadius: '12px',
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: brandColors.black,
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = brandColors.cyan}
                        onMouseLeave={e => e.currentTarget.style.borderColor = '#E5E7EB'}
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h1 style={{ fontSize: '20px', fontWeight: 700, color: brandColors.black, margin: 0 }}>
                        {isEdit ? 'Editar Producto' : 'Crear Nuevo Producto'}
                    </h1>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-8">
                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Product Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Información Básica */}
                        <div style={{ background: 'white', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                            <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px', color: '#374151' }}>Información Básica</h2>

                            <div className="space-y-5">
                                {/* Nombre */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Producto</label>
                                    <input
                                        type="text"
                                        {...register('nombre', { required: 'El nombre es obligatorio' })}
                                        className="w-full rounded-xl border-gray-200 focus:border-cyan-400 focus:ring-cyan-400 p-3 bg-gray-50 border"
                                        placeholder="Ej: Zapatillas Nike Air"
                                        style={{ outline: 'none', transition: 'all 0.2s' }}
                                    />
                                    {errors.nombre && <p className="mt-1 text-sm text-red-500">{errors.nombre.message}</p>}
                                </div>

                                {/* Descripción */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                                    <textarea
                                        rows={4}
                                        {...register('descripcion')}
                                        className="w-full rounded-xl border-gray-200 focus:border-cyan-400 focus:ring-cyan-400 p-3 bg-gray-50 border"
                                        placeholder="Detalles del producto..."
                                        style={{ outline: 'none', transition: 'all 0.2s' }}
                                    />
                                </div>

                                {/* Grid de Precio y Categoría */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Precio Regular ($)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            {...register('precio', { required: 'Requerido', min: 0 })}
                                            className="w-full rounded-xl border-gray-200 focus:border-cyan-400 focus:ring-cyan-400 p-3 bg-gray-50 border"
                                        />
                                        {errors.precio && <p className="mt-1 text-sm text-red-500">{errors.precio.message}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Precio Oferta ($)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            {...register('precio_descuento', { min: 0 })}
                                            className="w-full rounded-xl border-gray-200 focus:border-cyan-400 focus:ring-cyan-400 p-3 bg-gray-50 border"
                                            placeholder="Opcional"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                                        <select
                                            {...register('category_id', { required: 'Selecciona una categoría' })}
                                            className="w-full rounded-xl border-gray-200 focus:border-cyan-400 focus:ring-cyan-400 p-3 bg-gray-50 border"
                                        >
                                            <option value="">Seleccionar...</option>
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                                            ))}
                                        </select>
                                        {errors.category_id && <p className="mt-1 text-sm text-red-500">{errors.category_id.message}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Stock Total</label>
                                        <div className="w-full rounded-xl border-gray-200 p-3 bg-gray-100 border text-gray-500 text-sm">
                                            {totalStock} unidades <span className="text-xs">(se calcula desde los talles)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ========== SECCIÓN DE TALLES ========== */}
                        <div style={{ background: 'white', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                            <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: '#374151', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                👟 Gestión de Talles
                                <span style={{ fontSize: '12px', fontWeight: 400, color: '#9CA3AF' }}>({talles.length} talles)</span>
                            </h2>

                            {/* Agregar nuevo talle */}
                            <div style={{
                                display: 'flex',
                                gap: '8px',
                                marginBottom: '20px',
                                padding: '16px',
                                background: '#F9FAFB',
                                borderRadius: '12px',
                                border: '1px dashed #D1D5DB',
                                alignItems: 'flex-end'
                            }}>
                                <div style={{ flex: '1' }}>
                                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#6B7280', display: 'block', marginBottom: '4px' }}>Talle</label>
                                    <input
                                        type="text"
                                        value={newSize}
                                        onChange={(e) => setNewSize(e.target.value)}
                                        placeholder="Ej: 37, XL, M"
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSize())}
                                        style={{
                                            width: '100%',
                                            padding: '10px 12px',
                                            borderRadius: '10px',
                                            border: '1px solid #E5E7EB',
                                            fontSize: '14px',
                                            outline: 'none',
                                            background: 'white'
                                        }}
                                    />
                                </div>
                                <div style={{ width: '100px' }}>
                                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#6B7280', display: 'block', marginBottom: '4px' }}>Stock</label>
                                    <input
                                        type="number"
                                        value={newStock}
                                        onChange={(e) => setNewStock(e.target.value)}
                                        min="0"
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSize())}
                                        style={{
                                            width: '100%',
                                            padding: '10px 12px',
                                            borderRadius: '10px',
                                            border: '1px solid #E5E7EB',
                                            fontSize: '14px',
                                            outline: 'none',
                                            background: 'white'
                                        }}
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={handleAddSize}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: '10px 16px',
                                        borderRadius: '10px',
                                        border: 'none',
                                        background: `linear-gradient(135deg, ${brandColors.cyan} 0%, #2563EB 100%)`,
                                        color: 'white',
                                        fontSize: '13px',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        whiteSpace: 'nowrap',
                                        boxShadow: '0 2px 8px rgba(37,99,235,0.25)',
                                        transition: 'transform 0.15s',
                                    }}
                                    onMouseDown={e => e.currentTarget.style.transform = 'scale(0.96)'}
                                    onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                                >
                                    <Plus size={16} />
                                    Agregar
                                </button>
                            </div>

                            {/* Lista de talles como pills */}
                            {talles.length === 0 ? (
                                <div style={{
                                    textAlign: 'center',
                                    padding: '24px',
                                    color: '#9CA3AF',
                                    fontSize: '14px',
                                    border: '1px dashed #E5E7EB',
                                    borderRadius: '12px',
                                }}>
                                    No hay talles cargados. Agregá talles arriba para gestionar el stock.
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {talles.map((talle, index) => (
                                        <div
                                            key={index}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '12px',
                                                padding: '12px 16px',
                                                borderRadius: '12px',
                                                background: talle.stock > 0 ? '#F0FDF4' : '#FEF2F2',
                                                border: `1px solid ${talle.stock > 0 ? '#BBF7D0' : '#FECACA'}`,
                                                transition: 'all 0.2s',
                                                opacity: talle.stock === 0 ? 0.7 : 1,
                                            }}
                                        >
                                            {/* Badge del talle */}
                                            <span style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                minWidth: '48px',
                                                padding: '6px 12px',
                                                borderRadius: '8px',
                                                fontSize: '14px',
                                                fontWeight: 700,
                                                background: talle.stock > 0 ? '#DCFCE7' : '#FEE2E2',
                                                color: talle.stock > 0 ? '#166534' : '#991B1B',
                                            }}>
                                                {talle.size}
                                            </span>

                                            {/* Label */}
                                            <span style={{ fontSize: '13px', color: '#6B7280', fontWeight: 500 }}>Stock:</span>

                                            {/* Input de stock inline */}
                                            <input
                                                type="number"
                                                value={talle.stock}
                                                onChange={(e) => handleSizeStockChange(index, e.target.value)}
                                                min="0"
                                                style={{
                                                    width: '70px',
                                                    padding: '6px 10px',
                                                    borderRadius: '8px',
                                                    border: '1px solid #D1D5DB',
                                                    fontSize: '14px',
                                                    fontWeight: 600,
                                                    textAlign: 'center',
                                                    outline: 'none',
                                                    background: 'white'
                                                }}
                                            />

                                            {/* Badge de estado */}
                                            <span style={{
                                                padding: '4px 10px',
                                                borderRadius: '20px',
                                                fontSize: '11px',
                                                fontWeight: 600,
                                                background: talle.stock > 0 ? '#DCFCE7' : '#FEE2E2',
                                                color: talle.stock > 0 ? '#166534' : '#991B1B',
                                            }}>
                                                {talle.stock > 0 ? `${talle.stock} u.` : 'Sin stock'}
                                            </span>

                                            {/* Spacer */}
                                            <div style={{ flex: 1 }} />

                                            {/* Botón eliminar */}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveSize(index)}
                                                style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderRadius: '8px',
                                                    border: 'none',
                                                    background: '#FEE2E2',
                                                    color: '#DC2626',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.15s'
                                                }}
                                                onMouseEnter={e => e.currentTarget.style.background = '#FECACA'}
                                                onMouseLeave={e => e.currentTarget.style.background = '#FEE2E2'}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Configuración */}
                        <div style={{ background: 'white', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                            <h2 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px', color: '#374151' }}>Opciones de Visualización</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                <label className="flex items-center cursor-pointer gap-3">
                                    <input
                                        type="checkbox"
                                        {...register('destacado')}
                                        className="w-5 h-5 text-cyan-500 rounded border-gray-300 focus:ring-cyan-400"
                                    />
                                    <div>
                                        <span className="text-sm font-medium text-gray-700">⭐ Producto Destacado</span>
                                        <p style={{ fontSize: '11px', color: '#9CA3AF', margin: 0 }}>Se muestra en la sección de destacados</p>
                                    </div>
                                </label>
                                <label className="flex items-center cursor-pointer gap-3">
                                    <input
                                        type="checkbox"
                                        {...register('mas_vendido')}
                                        className="w-5 h-5 text-cyan-500 rounded border-gray-300 focus:ring-cyan-400"
                                    />
                                    <div>
                                        <span className="text-sm font-medium text-gray-700">🔥 Más Vendido</span>
                                        <p style={{ fontSize: '11px', color: '#9CA3AF', margin: 0 }}>Se muestra en el carrusel de más vendidos</p>
                                    </div>
                                </label>
                                <label className="flex items-center cursor-pointer gap-3">
                                    <input
                                        type="checkbox"
                                        {...register('en_oferta')}
                                        className="w-5 h-5 text-cyan-500 rounded border-gray-300 focus:ring-cyan-400"
                                    />
                                    <div>
                                        <span className="text-sm font-medium text-gray-700">🏷️ En Oferta</span>
                                        <p style={{ fontSize: '11px', color: '#9CA3AF', margin: 0 }}>Se muestra en el banner de ofertas</p>
                                    </div>
                                </label>
                                <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '14px' }}>
                                    <label className="flex items-center cursor-pointer gap-3">
                                        <input
                                            type="checkbox"
                                            {...register('activo')}
                                            className="w-5 h-5 text-cyan-500 rounded border-gray-300 focus:ring-cyan-400"
                                        />
                                        <div>
                                            <span className="text-sm font-medium text-gray-700">👁️ Visible en Tienda</span>
                                            <p style={{ fontSize: '11px', color: '#9CA3AF', margin: 0 }}>El producto se muestra a los clientes</p>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Image and Actions */}
                    <div className="space-y-6">
                        <div style={{ background: 'white', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                            <label className="block text-sm font-medium text-gray-700 mb-4">Imágenes del Producto</label>

                            {/* IMAGEN 1 */}
                            <div style={{ marginBottom: '16px' }}>
                                <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '8px', fontWeight: 600 }}>📷 Imagen Principal</p>
                                <div style={{
                                    border: `2px dashed ${previewUrl1 ? brandColors.cyan : '#E5E7EB'}`,
                                    borderRadius: '12px',
                                    padding: '12px',
                                    textAlign: 'center',
                                    background: previewUrl1 ? 'rgba(0,212,212,0.02)' : '#FAFAFA',
                                    position: 'relative'
                                }}>
                                    {previewUrl1 ? (
                                        <div style={{ position: 'relative' }}>
                                            <img src={previewUrl1} alt="Preview 1" style={{ width: '100%', height: '120px', objectFit: 'contain', borderRadius: '8px' }} />
                                            <button
                                                type="button"
                                                onClick={() => { setFile1(null); setPreviewUrl1(''); }}
                                                style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#EF4444', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                            >✕</button>
                                        </div>
                                    ) : (
                                        <label style={{ cursor: 'pointer', display: 'block', padding: '12px' }}>
                                            <Upload size={20} style={{ margin: '0 auto 8px', color: '#3B82F6' }} />
                                            <span style={{ fontSize: '13px', color: '#3B82F6', fontWeight: 500 }}>Subir imagen 1</span>
                                            <input type="file" accept="image/*" onChange={handleFile1Change} style={{ display: 'none' }} />
                                        </label>
                                    )}
                                </div>
                            </div>

                            {/* IMAGEN 2 */}
                            <div>
                                <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '8px', fontWeight: 600 }}>📷 Imagen Secundaria (opcional)</p>
                                <div style={{
                                    border: `2px dashed ${previewUrl2 ? brandColors.cyan : '#E5E7EB'}`,
                                    borderRadius: '12px',
                                    padding: '12px',
                                    textAlign: 'center',
                                    background: previewUrl2 ? 'rgba(0,212,212,0.02)' : '#FAFAFA',
                                    position: 'relative'
                                }}>
                                    {previewUrl2 ? (
                                        <div style={{ position: 'relative' }}>
                                            <img src={previewUrl2} alt="Preview 2" style={{ width: '100%', height: '120px', objectFit: 'contain', borderRadius: '8px' }} />
                                            <button
                                                type="button"
                                                onClick={() => { setFile2(null); setPreviewUrl2(''); }}
                                                style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#EF4444', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                            >✕</button>
                                        </div>
                                    ) : (
                                        <label style={{ cursor: 'pointer', display: 'block', padding: '12px' }}>
                                            <Upload size={20} style={{ margin: '0 auto 8px', color: '#3B82F6' }} />
                                            <span style={{ fontSize: '13px', color: '#3B82F6', fontWeight: 500 }}>Subir imagen 2</span>
                                            <input type="file" accept="image/*" onChange={handleFile2Change} style={{ display: 'none' }} />
                                        </label>
                                    )}
                                </div>
                            </div>

                            <p style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '12px', textAlign: 'center' }}>PNG, JPG hasta 5MB cada una</p>
                        </div>

                        {/* Sticky Save Button for Desktop */}
                        <div className="sticky top-24">
                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    width: '100%',
                                    background: `linear-gradient(135deg, ${brandColors.cyan} 0%, #2563EB 100%)`,
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '16px',
                                    padding: '16px',
                                    fontSize: '16px',
                                    fontWeight: 700,
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    boxShadow: '0 8px 20px rgba(37,99,235,0.25)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px',
                                    opacity: loading ? 0.7 : 1,
                                    transition: 'transform 0.2s',
                                }}
                                onMouseDown={e => !loading && (e.currentTarget.style.transform = 'scale(0.98)')}
                                onMouseUp={e => !loading && (e.currentTarget.style.transform = 'scale(1)')}
                            >
                                {loading ? 'Guardando...' : (
                                    <>
                                        <Save size={20} />
                                        Guardar Producto
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductForm;
