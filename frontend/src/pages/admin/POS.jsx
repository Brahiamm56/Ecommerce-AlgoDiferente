import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Plus, Minus, Trash2, ShoppingBag, CreditCard, Banknote, ArrowRightLeft, Check, Calendar, TrendingUp, Printer, Download, ShoppingCart } from 'lucide-react';
import { productService, salesService } from '@services/api';
import { formatPrice } from '@utils/formatters';
import AdminNavbar from '../../components/admin/AdminNavbar';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import logoImg from '@assets/algodif.jpg';

const brandColors = {
    blue: '#3B82F6',
    blueDark: '#1E40AF',
    white: '#FFFFFF',
    bg: '#F3F4F6',
    card: '#FFFFFF',
    border: '#E5E7EB',
    textDark: '#1F2937',
    textMuted: '#6B7280',
};

const paymentMethods = [
    { id: 'efectivo', label: 'Efectivo', icon: Banknote, color: '#22C55E' },
    { id: 'transferencia', label: 'Transferencia', icon: ArrowRightLeft, color: '#3B82F6' },
    { id: 'tarjeta', label: 'Tarjeta', icon: CreditCard, color: '#A855F7' },
];

const periodOptions = [
    { id: 'day', label: 'Hoy' },
    { id: 'week', label: 'Semana' },
    { id: 'month', label: 'Mes' },
    { id: 'year', label: 'Año' },
];

const getDateRange = (period) => {
    const now = new Date();
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);

    switch (period) {
        case 'week':
            start.setDate(now.getDate() - now.getDay()); // Domingo
            break;
        case 'month':
            start.setDate(1);
            break;
        case 'year':
            start.setMonth(0, 1);
            break;
        default: // 'day'
            break;
    }

    const from = start.toISOString().split('T')[0];
    const to = now.toISOString().split('T')[0];
    return { from, to };
};

const POS = () => {
    const navigate = useNavigate();
    const searchRef = useRef(null);
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [showSearch, setShowSearch] = useState(false);
    const [sizeModalProduct, setSizeModalProduct] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('efectivo');
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [sales, setSales] = useState([]);
    const [period, setPeriod] = useState('day');
    const [salesTotal, setSalesTotal] = useState(0);
    const [receiptData, setReceiptData] = useState(null);
    // Manual item form
    const [showManualForm, setShowManualForm] = useState(false);
    const [showNewSaleModal, setShowNewSaleModal] = useState(false);
    const [manualDesc, setManualDesc] = useState('');
    const [manualPrice, setManualPrice] = useState('');
    const [notes, setNotes] = useState('');
    // Client info for Leonesa
    const [clientName, setClientName] = useState('');
    const [clientLocation, setClientLocation] = useState('');
    const [clientPhone, setClientPhone] = useState('');
    const [isLeonesaFilter, setIsLeonesaFilter] = useState(false);

    // Cargar productos al montar
    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            try {
                const data = await productService.getAll({ limit: 500, activo: true });
                setProducts(data.products || []);
            } catch (err) {
                console.error('Error cargando productos:', err);
                toast.error('Error al cargar los productos');
            } finally {
                setLoading(false);
            }
        };
        loadProducts();
    }, []);

    // Cargar ventas según período
    const loadSales = async (p, searchOverride, filterOverride) => {
        try {
            const { from, to } = getDateRange(p || period);
            const search = searchOverride !== undefined ? searchOverride : '';
            const isLeonesa = filterOverride !== undefined ? filterOverride : isLeonesaFilter;

            const params = {
                from,
                to,
                limit: 100,
                is_leonesa: isLeonesa // Pass filter to backend to separate lists
            };
            if (search) params.search = search;

            const data = await salesService.getAll(params);
            const salesList = data.sales || [];
            setSales(salesList);
            const totalVendido = salesList.reduce((sum, s) => sum + parseFloat(s.total || 0), 0);
            setSalesTotal(totalVendido);
        } catch (err) {
            console.error('Error cargando ventas:', err);
        }
    };

    useEffect(() => {
        loadSales();
    }, [period, isLeonesaFilter]);

    // Filtrar productos por búsqueda
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredProducts([]);
            setShowSearch(false);
            return;
        }
        const q = searchQuery.toLowerCase();
        const results = products.filter(p =>
            (p?.nombre?.toString()?.toLowerCase() || '').includes(q) ||
            (p?.codigo?.toString()?.toLowerCase() || '').includes(q)
        ).slice(0, 8);
        setFilteredProducts(results);
        setShowSearch(results.length > 0);
    }, [searchQuery, products]);

    // Seleccionar producto → abrir modal de talles
    const handleSelectProduct = (product) => {
        const talles = product.talles || [];
        const available = talles.filter(t => t.stock > 0);
        if (available.length === 0) {
            toast.error('Este producto no tiene talles con stock');
            return;
        }
        setSizeModalProduct(product);
        setSearchQuery('');
        setShowSearch(false);
    };

    // Agregar al carrito con talle seleccionado
    const handleAddToCart = (product, talle) => {
        const existingIndex = cartItems.findIndex(
            item => item.product_id === product.id && item.size === talle.size
        );

        if (existingIndex >= 0) {
            // Ya existe, incrementar cantidad si hay stock
            const current = cartItems[existingIndex];
            if (current.quantity >= talle.stock) {
                toast.error(`Stock máximo para talle ${talle.size}: ${talle.stock}`);
                return;
            }
            const updated = [...cartItems];
            updated[existingIndex] = { ...current, quantity: current.quantity + 1 };
            setCartItems(updated);
        } else {
            setCartItems([...cartItems, {
                product_id: product.id,
                product_name: product.nombre,
                product_image: product.imagen_url,
                size: talle.size,
                size_stock: talle.stock,
                quantity: 1,
                price: product.precio_descuento || product.precio,
            }]);
        }

        setSizeModalProduct(null);
        toast.success(`${product.nombre} (${talle.size}) agregado`);
    };

    // Agregar item manual al carrito
    const handleAddManualItem = () => {
        const desc = manualDesc.trim();
        const price = parseFloat(manualPrice);
        if (!desc) { toast.error('Ingresá una descripción'); return; }
        if (!price || price <= 0) { toast.error('Ingresá un precio válido'); return; }
        setCartItems([...cartItems, {
            product_id: null,
            isManual: true,
            product_name: desc,
            product_image: null,
            description: desc,
            size: null,
            size_stock: Infinity,
            quantity: 1,
            price,
        }]);
        setManualDesc('');
        setManualPrice('');
        setShowManualForm(false);
        toast.success(`"${desc}" agregado`);
    };

    // Cambiar cantidad
    const handleChangeQty = (index, delta) => {
        const updated = [...cartItems];
        const item = updated[index];
        const newQty = item.quantity + delta;
        if (newQty < 1) return;
        // Skip stock check for manual items
        if (!item.isManual && newQty > item.size_stock) {
            toast.error(`Stock máximo: ${item.size_stock}`);
            return;
        }
        updated[index] = { ...item, quantity: newQty };
        setCartItems(updated);
    };

    // Eliminar item
    const handleRemoveItem = (index) => {
        setCartItems(cartItems.filter((_, i) => i !== index));
    };

    // Calcular total
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Finalizar venta
    const handleFinalizeSale = async () => {
        if (cartItems.length === 0) {
            toast.error('El carrito está vacío');
            return;
        }

        // Validación para pedidos La Leonesa
        if (isLeonesaFilter) {
            if (!clientName.trim()) { toast.error('Ingresá el Nombre del Cliente'); return; }
            if (!clientLocation.trim()) { toast.error('Ingresá la Ubicación del Cliente'); return; }
            if (!clientPhone.trim()) { toast.error('Ingresá el Teléfono del Cliente'); return; }
        }

        setSubmitting(true);
        try {
            const saleData = {
                payment_method: paymentMethod,
                notes,
                // Client info (only sent if filter is active, or we could always send if filled)
                client_name: isLeonesaFilter ? clientName : null,
                client_location: isLeonesaFilter ? clientLocation : null,
                client_phone: isLeonesaFilter ? clientPhone : null,
                items: cartItems.map(item => ({
                    product_id: item.product_id || null,
                    description: item.description || null,
                    size: item.size || null,
                    quantity: item.quantity,
                    price: item.price,
                })),
            };
            const response = await salesService.create(saleData);

            // Guardar datos para el recibo antes de limpiar
            setReceiptData({
                id: response.sale.id,
                items: [...cartItems],
                total: total,
                payment_method: paymentMethod,
                date: new Date(),
                notes,
                client_name: isLeonesaFilter ? clientName : null,
                client_location: isLeonesaFilter ? clientLocation : null
            });

            toast.success('🎉 Venta registrada exitosamente');
            setShowNewSaleModal(false);
            // NO limpiamos el carrito aquí, lo hacemos al cerrar el recibo

            // Recargar productos para actualizar stock
            const data = await productService.getAll({ limit: 500, activo: true });
            setProducts(data.products || []);
            // Recargar historial de ventas
            await loadSales(); // This will respect current filter
        } catch (err) {
            const errorMsg = err.error || err.message || 'Error al registrar la venta';
            toast.error(errorMsg);
        } finally {
            setSubmitting(false);
        }
    };

    const handleCloseReceipt = () => {
        setReceiptData(null);
        setCartItems([]);
        setNotes('');
        setClientName('');
        setClientLocation('');
        setClientPhone('');
        setPaymentMethod('efectivo');
        searchRef.current?.focus();
    };

    // === Generar PDF de comprobante ===
    const generateReceiptPDF = async (sale) => {
        try {
            const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

            // Colores
            const colorBlue = [20, 30, 70]; // Navy blue
            const colorRed = [220, 50, 50]; // Accent red
            const colorGray = [100, 100, 100];
            const colorBlack = [0, 0, 0];

            let y = 20;

            // --- HEADER ---
            // Título RECIBO
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(40);
            doc.setTextColor(...colorBlue);
            doc.text('RECIBO', 15, y + 10);

            // Logo (Círculo gris si no hay logo, o imagen)
            try {
                if (logoImg) {
                    const img = new Image();
                    img.src = logoImg;
                    await new Promise((resolve, reject) => {
                        if (img.complete) return resolve();
                        img.onload = resolve;
                        img.onerror = reject;
                        setTimeout(() => reject(new Error('Timeout')), 3000);
                    });
                    // Clip circular para el logo
                    const logoSize = 30;
                    const logoX = 165;
                    const logoY = 15;

                    // Crear máscara circular (workaround simple: dibujar imagen y poner borde circular si se quiere)
                    // jsPDF no tiene clip circular nativo simple sin advanced API, 
                    // así que lo mostramos normal pero alineado a la derecha.
                    doc.addImage(img, 'JPEG', logoX, logoY, logoSize, logoSize);
                }
            } catch (e) {
                // Placeholder circular con texto LOGO
                doc.setFillColor(150, 150, 150);
                doc.circle(180, 30, 15, 'F');
                doc.setTextColor(255, 255, 255);
                doc.setFontSize(10);
                doc.text('LOGO', 180, 32, { align: 'center' });
            }

            y += 25;

            // Info Empresa
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10);
            doc.setTextColor(...colorBlack);
            doc.text('Algo Diferente Indumentaria', 15, y);
            y += 5;
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(...colorGray);
            doc.text('Av. Siempre Viva 123', 15, y);
            y += 5;
            doc.text('Buenos Aires, Argentina', 15, y);
            y += 15;

            // --- CLIENTE / ENVIAR A / DETALLES ---
            const col1 = 15;
            const col2 = 75;
            const col3 = 135;

            // Col 1: A (Cliente)
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...colorBlue);
            doc.text('A', col1, y);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(...colorBlack);
            doc.text('Consumidor Final', col1, y + 6);
            if (sale.client_name) doc.text(sale.client_name, col1, y + 6);

            // Col 2: ENVIAR A
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...colorBlue);
            doc.text('ENVIAR A', col2, y);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(...colorBlack);
            doc.text('Retiro en Local', col2, y + 6);

            // Col 3: Detalles Recibo
            const saleDate = new Date(sale.date || sale.dateObj);
            const dateStr = saleDate.toLocaleDateString('es-AR');

            const printDetailRow = (label, value, currentY) => {
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(...colorBlue);
                doc.text(label, col3, currentY);
                doc.setFont('helvetica', 'bold'); // Value also bold/dark per reference
                doc.setTextColor(...colorBlack);
                doc.text(value, 195, currentY, { align: 'right' });
            };

            printDetailRow('Nº DE RECIBO', String(sale.id).padStart(4, '0'), y);
            printDetailRow('FECHA', dateStr, y + 6);
            printDetailRow('Nº DE PEDIDO', String(sale.id), y + 12);
            printDetailRow('FECHA VENCIMIENTO', dateStr, y + 18);

            y += 35;

            // --- TABLA DE ITEMS ---
            // Encabezados
            // Línea roja superior
            doc.setDrawColor(...colorRed);
            doc.setLineWidth(0.5);
            doc.line(15, y, 195, y);

            y += 5;
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...colorBlue);
            doc.setFontSize(9);

            doc.text('CANT.', 15, y);
            doc.text('DESCRIPCIÓN', 40, y);
            doc.text('PRECIO UNITARIO', 140, y, { align: 'right' });
            doc.text('IMPORTE', 195, y, { align: 'right' });

            y += 3;
            // Línea roja inferior encabezado
            doc.line(15, y, 195, y);
            y += 8;

            // Filas
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(...colorBlack);

            const items = sale.items || [];
            let total = 0;

            items.forEach((item) => {
                const qty = item.quantity;
                const name = item.product_name || item.product?.nombre || item.description || 'Producto';
                const size = item.isManual ? 'Manual' : (item.size || '');
                const desc = `${name}${size ? ` - ${size}` : ''}`;

                const unitPrice = item.price || item.price_at_sale;
                const rowTotal = qty * unitPrice;
                total += rowTotal;

                // Cant
                doc.text(String(qty), 20, y, { align: 'center' });

                // Nombre
                doc.text(desc, 40, y);

                // Precio Unit
                doc.text(formatPrice(unitPrice), 140, y, { align: 'right' });

                // Importe
                doc.text(formatPrice(rowTotal), 195, y, { align: 'right' });

                y += 8;
            });

            y += 5;

            // --- TOTALES ---
            const colTotalsLabel = 140;
            const colTotalsValue = 195;

            doc.setFontSize(10);
            doc.setTextColor(...colorBlack);
            doc.text('Subtotal', colTotalsLabel, y, { align: 'right' });
            doc.text(formatPrice(total), colTotalsValue, y, { align: 'right' });
            y += 6;

            // IVA (ejemplo 0% o incluido)
            doc.text('IVA 0%', colTotalsLabel, y, { align: 'right' });
            doc.text('$ 0,00', colTotalsValue, y, { align: 'right' });
            y += 8;

            // TOTAL GRANDE
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...colorBlue);
            doc.text('TOTAL', colTotalsLabel, y, { align: 'right' });
            doc.text(formatPrice(total), colTotalsValue, y, { align: 'right' });

            // --- FOOTER / PAGOS ---
            y = 240; // Fixed position at bottom

            // Línea roja vertical pequeña
            doc.setDrawColor(...colorRed);
            doc.setLineWidth(1);
            doc.line(105, y, 105, y + 10);

            // Texto Condiciones
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...colorRed);
            doc.text('CONDICIONES Y FORMA DE PAGO', 108, y + 4);

            doc.setFont('helvetica', 'normal');
            doc.setTextColor(...colorBlack);
            doc.setFontSize(9);
            y += 12;
            doc.text('El pago se realizará al momento de la entrega.', 108, y);
            const methodLabel = paymentMethods.find(m => m.id === (sale.payment_method))?.label || sale.payment_method;
            doc.text(`Método: ${methodLabel}`, 108, y + 5);

            // Firma Gracias ("Gracias" en cursiva grande como firma)
            const signatureY = y + 10;
            doc.setFont('times', 'italic');
            doc.setFontSize(40);
            doc.setTextColor(...colorBlue);
            doc.text('Gracias', 40, signatureY);

            doc.save(`recibo-${sale.id}.pdf`);
            toast.success('📄 Recibo descargado');
        } catch (err) {
            console.error('Error generando PDF:', err);
            toast.error('Error al generar el comprobante');
        }
    };
    return (
        <div className="pos-container" style={{ minHeight: '100vh', background: brandColors.bg, color: brandColors.textDark }}>
            {/* Ocultar todo esto al imprimir */}
            <div className="print:hidden">
                <AdminNavbar />

                <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
                    {/* Header y Botón Nueva Venta */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                        <div>
                            <h1 style={{ fontSize: '24px', fontWeight: 800, color: brandColors.textDark, margin: 0 }}>Punto de Venta</h1>
                            <p style={{ fontSize: '14px', color: brandColors.textMuted, margin: '4px 0 0' }}>Registrar ventas presenciales rápidamente</p>
                        </div>
                        <button
                            onClick={() => setShowNewSaleModal(true)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px',
                                background: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)', borderRadius: '12px', border: 'none',
                                color: 'white', fontSize: '15px', fontWeight: 700, cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(59,130,246,0.3)', transition: 'transform 0.2s',
                            }}
                            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <Plus style={{ width: '20px', height: '20px' }} />
                            Generar Venta
                        </button>
                    </div>

                    {/* Historial de Ventas */}
                    <div style={{ background: brandColors.card, borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                        {/* Funciones de Stats (Total Vendido) y Lista (Las mismas de antes) */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <TrendingUp style={{ width: '20px', height: '20px', color: brandColors.blue }} />
                                <h3 style={{ fontSize: '16px', fontWeight: 700, color: brandColors.textDark, margin: 0 }}>Historial de ventas</h3>
                            </div>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', background: brandColors.bg, padding: '4px', borderRadius: '12px' }}>
                                {periodOptions.map(opt => (
                                    <button
                                        key={opt.id}
                                        onClick={() => setPeriod(opt.id)}
                                        style={{
                                            padding: '8px 16px', borderRadius: '8px', cursor: 'pointer',
                                            fontSize: '13px', fontWeight: 600, transition: 'all 0.2s',
                                            border: 'none',
                                            background: period === opt.id ? brandColors.card : 'transparent',
                                            color: period === opt.id ? brandColors.blueDark : brandColors.textMuted,
                                            boxShadow: period === opt.id ? '0 2px 4px rgba(0,0,0,0.04)' : 'none',
                                        }}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Card de total vendido */}
                        <div style={{
                            background: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)',
                            borderRadius: '16px', padding: '24px', marginBottom: '24px',
                            boxShadow: '0 8px 20px rgba(59,130,246,0.15)', position: 'relative', overflow: 'hidden'
                        }}>
                            <div style={{ position: 'absolute', right: '-20px', top: '-20px', width: '150px', height: '150px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
                                <div>
                                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', fontWeight: 600, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                        Total cobrado – {periodOptions.find(p => p.id === period)?.label}
                                    </p>
                                    <p style={{ fontSize: '36px', fontWeight: 800, color: 'white', margin: 0, lineHeight: 1 }}>
                                        {formatPrice(salesTotal)}
                                    </p>
                                    <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', margin: '8px 0 0' }}>
                                        {sales.length} venta{sales.length !== 1 ? 's' : ''} realizada{sales.length !== 1 ? 's' : ''}
                                    </p>
                                </div>
                                <div style={{
                                    width: '64px', height: '64px', borderRadius: '16px',
                                    background: 'rgba(255,255,255,0.2)', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)'
                                }}>
                                    <Banknote style={{ width: '32px', height: '32px', color: 'white' }} />
                                </div>
                            </div>
                        </div>

                        {/* Lista de ventas */}
                        {sales.length === 0 ? (
                            <div style={{
                                textAlign: 'center', padding: '40px 20px',
                                background: brandColors.bg, borderRadius: '12px', border: `2px dashed ${brandColors.border}`,
                            }}>
                                <ShoppingBag style={{ width: '32px', height: '32px', color: brandColors.textMuted, margin: '0 auto 12px', opacity: 0.5 }} />
                                <p style={{ color: brandColors.textMuted, fontSize: '15px', fontWeight: 500, margin: 0 }}>No se registraron ventas en este período</p>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
                                {sales.map(sale => {
                                    const saleDate = new Date(sale.date);
                                    const methodInfo = paymentMethods.find(m => m.id === sale.payment_method);
                                    const MethodIcon = methodInfo?.icon;
                                    return (
                                        <div key={sale.id} style={{
                                            background: brandColors.card, borderRadius: '12px', padding: '16px',
                                            border: `1px solid ${brandColors.border}`, boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <span style={{ fontSize: '13px', color: brandColors.textMuted, fontWeight: 700 }}>#{sale.id}</span>
                                                    <span style={{ fontSize: '13px', color: brandColors.textMuted }}>
                                                        {saleDate.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })} hs
                                                    </span>
                                                </div>
                                                <span style={{ fontSize: '18px', fontWeight: 800, color: brandColors.blueDark }}>
                                                    {formatPrice(sale.total)}
                                                </span>
                                            </div>

                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                                                {(sale.items || []).map((item, idx) => (
                                                    <span key={idx} style={{
                                                        fontSize: '11px', color: brandColors.textDark, fontWeight: 500,
                                                        background: brandColors.bg, padding: '4px 8px', borderRadius: '6px',
                                                    }}>
                                                        {item.quantity}x {item.product?.nombre || item.description}{item.size ? ` (${item.size})` : ''}
                                                    </span>
                                                ))}
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: `1px solid ${brandColors.border}`, paddingTop: '12px' }}>
                                                {MethodIcon && (
                                                    <span style={{
                                                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                                                        fontSize: '12px', color: methodInfo.color,
                                                        background: `${methodInfo.color}15`, padding: '4px 10px',
                                                        borderRadius: '999px', fontWeight: 600,
                                                    }}>
                                                        <MethodIcon style={{ width: '14px', height: '14px' }} />
                                                        {methodInfo.label}
                                                    </span>
                                                )}
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); generateReceiptPDF(sale); }}
                                                    style={{
                                                        display: 'flex', alignItems: 'center', gap: '6px',
                                                        padding: '6px 12px', borderRadius: '8px', cursor: 'pointer',
                                                        border: `1px solid ${brandColors.blue}`, background: 'transparent',
                                                        color: brandColors.blue, fontSize: '12px', fontWeight: 600, transition: 'all 0.2s',
                                                    }}
                                                    onMouseOver={e => { e.currentTarget.style.background = brandColors.blue; e.currentTarget.style.color = 'white'; }}
                                                    onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = brandColors.blue; }}
                                                >
                                                    <Download style={{ width: '14px', height: '14px' }} /> Comp.
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Modal Nueva Venta Principal */}
            {showNewSaleModal && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 150, padding: '20px',
                }}>
                    <div style={{
                        background: brandColors.card, width: '100%', maxWidth: '1000px', height: '85vh',
                        borderRadius: '20px', display: 'flex', flexDirection: 'column', overflow: 'hidden',
                        boxShadow: '0 24px 48px rgba(0,0,0,0.2)'
                    }}>
                        {/* Modal Header */}
                        <div style={{ padding: '20px 24px', borderBottom: `1px solid ${brandColors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '40px', height: '40px', background: brandColors.blue, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <ShoppingCart style={{ color: 'white', width: '20px', height: '20px' }} />
                                </div>
                                <div>
                                    <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: brandColors.textDark }}>Nueva Venta</h2>
                                    <p style={{ fontSize: '13px', color: brandColors.textMuted, margin: 0 }}>Buscá productos y finalizá el cobro</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowNewSaleModal(false)}
                                style={{
                                    background: brandColors.bg, border: `1px solid ${brandColors.border}`, cursor: 'pointer',
                                    width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}
                            >
                                <X style={{ width: '20px', height: '20px', color: brandColors.textDark }} />
                            </button>
                        </div>

                        {/* Modal Body: Split view (Busqueda / Carrito) */}
                        <div style={{ display: 'flex', flex: 1, overflow: 'hidden', flexDirection: 'row' }}>

                            {/* Izquierda: Buscador */}
                            <div style={{ flex: '1 1 60%', borderRight: `1px solid ${brandColors.border}`, display: 'flex', flexDirection: 'column', background: 'white' }}>
                                <div style={{ padding: '20px', borderBottom: `1px solid ${brandColors.border}` }}>
                                    {/* Togglers superiores */}
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                                        <button
                                            onClick={() => {
                                                const newVal = !isLeonesaFilter;
                                                setIsLeonesaFilter(newVal);
                                                loadSales(period, newVal ? 'La Leonesa' : '');
                                            }}
                                            style={{
                                                padding: '8px 16px', borderRadius: '8px', cursor: 'pointer',
                                                fontSize: '11px', fontWeight: 700, transition: 'all 0.2s',
                                                border: isLeonesaFilter ? `1px solid ${brandColors.blueDark}` : `1px dashed ${brandColors.border}`,
                                                background: isLeonesaFilter ? brandColors.blueDark : brandColors.bg,
                                                color: isLeonesaFilter ? 'white' : brandColors.textMuted,
                                            }}
                                        >
                                            {isLeonesaFilter ? '✓ PEDIDOS LA LEONESA ACTIVO' : 'PEDIDOS LA LEONESA'}
                                        </button>
                                    </div>

                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '12px',
                                        background: brandColors.bg, borderRadius: '12px', padding: '14px 16px',
                                        border: `1px solid ${brandColors.border}`,
                                    }}>
                                        <Search style={{ width: '20px', height: '20px', color: '#9CA3AF', flexShrink: 0 }} />
                                        <input
                                            ref={searchRef}
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Buscar producto por nombre o código..."
                                            style={{
                                                flex: 1, background: 'none', border: 'none', outline: 'none',
                                                color: brandColors.textDark, fontSize: '15px', fontWeight: 500
                                            }}
                                            autoFocus
                                        />
                                        {searchQuery && (
                                            <button
                                                onClick={() => { setSearchQuery(''); setShowSearch(false); }}
                                                style={{ background: 'white', borderRadius: '6px', border: `1px solid ${brandColors.border}`, cursor: 'pointer', padding: '4px' }}
                                            >
                                                <X style={{ width: '16px', height: '16px', color: '#666' }} />
                                            </button>
                                        )}
                                    </div>

                                    {/* Item Manual */}
                                    <div style={{ marginTop: '16px' }}>
                                        {!showManualForm ? (
                                            <button
                                                onClick={() => setShowManualForm(true)}
                                                style={{
                                                    display: 'flex', alignItems: 'center', gap: '8px',
                                                    padding: '12px 16px', borderRadius: '12px', cursor: 'pointer',
                                                    border: `2px dashed ${brandColors.border}`, background: 'transparent',
                                                    color: brandColors.blue, fontSize: '14px', fontWeight: 600,
                                                    width: '100%', justifyContent: 'center', transition: 'all 0.2s',
                                                }}
                                            >
                                                <Plus style={{ width: '18px', height: '18px' }} /> Agregar Ítem Manual
                                            </button>
                                        ) : (
                                            <div style={{
                                                background: `${brandColors.blue}05`, borderRadius: '12px', padding: '16px',
                                                border: `1px solid ${brandColors.blue}30`,
                                            }}>
                                                <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                                                    <input
                                                        type="text" placeholder="Descripción..." value={manualDesc}
                                                        onChange={e => setManualDesc(e.target.value)}
                                                        onKeyDown={e => e.key === 'Enter' && handleAddManualItem()}
                                                        style={{ flex: 2, padding: '10px 14px', borderRadius: '8px', border: `1px solid ${brandColors.border}`, fontSize: '14px', outline: 'none' }}
                                                        autoFocus
                                                    />
                                                    <input
                                                        type="number" placeholder="$ Precio" value={manualPrice}
                                                        onChange={e => setManualPrice(e.target.value)}
                                                        onKeyDown={e => e.key === 'Enter' && handleAddManualItem()}
                                                        style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: `1px solid ${brandColors.border}`, fontSize: '14px', outline: 'none' }}
                                                    />
                                                </div>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <button
                                                        onClick={handleAddManualItem}
                                                        style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: brandColors.blue, color: 'white', fontWeight: 600, cursor: 'pointer' }}
                                                    >
                                                        Confirmar Ítem
                                                    </button>
                                                    <button
                                                        onClick={() => { setShowManualForm(false); setManualDesc(''); setManualPrice(''); }}
                                                        style={{ padding: '10px 16px', borderRadius: '8px', border: `1px solid ${brandColors.border}`, background: 'white', color: brandColors.textMuted, fontWeight: 600, cursor: 'pointer' }}
                                                    >
                                                        Cancelar
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Resultados búsqueda */}
                                <div style={{ flex: 1, overflowY: 'auto', padding: '0' }}>
                                    {searchQuery ? (
                                        filteredProducts.length > 0 ? (
                                            <div style={{ padding: '12px' }}>
                                                {filteredProducts.map(product => {
                                                    const talles = product.talles || [];
                                                    const available = talles.filter(t => t.stock > 0);
                                                    return (
                                                        <div
                                                            key={product.id}
                                                            onClick={() => handleSelectProduct(product)}
                                                            style={{
                                                                display: 'flex', alignItems: 'center', gap: '16px',
                                                                padding: '16px', marginBottom: '8px', background: 'white',
                                                                border: `1px solid ${brandColors.border}`, borderRadius: '12px', cursor: 'pointer',
                                                                transition: 'transform 0.1s, box-shadow 0.1s',
                                                            }}
                                                            onMouseOver={e => { e.currentTarget.style.borderColor = brandColors.blue; e.currentTarget.style.boxShadow = '0 4px 12px rgba(59,130,246,0.1)'; }}
                                                            onMouseOut={e => { e.currentTarget.style.borderColor = brandColors.border; e.currentTarget.style.boxShadow = 'none'; }}
                                                        >
                                                            <img
                                                                src={product.imagen_url} alt={product.nombre}
                                                                style={{ width: '56px', height: '56px', borderRadius: '10px', objectFit: 'cover', background: brandColors.bg }}
                                                            />
                                                            <div style={{ flex: 1 }}>
                                                                <h3 style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: 600, color: brandColors.textDark }}>{product.nombre}</h3>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                                    <span style={{ color: brandColors.blue, fontWeight: 700, fontSize: '15px' }}>
                                                                        {formatPrice(product.precio_descuento || product.precio)}
                                                                    </span>
                                                                    <span style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '100px', background: available.length > 0 ? '#DCFCE7' : '#FEE2E2', color: available.length > 0 ? '#16A34A' : '#DC2626', fontWeight: 600 }}>
                                                                        {available.length} talles
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div style={{ color: brandColors.textMuted }}>
                                                                <Plus style={{ width: '20px', height: '20px' }} />
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                                                <Search style={{ width: '32px', height: '32px', color: brandColors.textMuted, margin: '0 auto 12px', opacity: 0.5 }} />
                                                <p style={{ color: brandColors.textMuted, margin: 0 }}>No se encontraron productos para "{searchQuery}"</p>
                                            </div>
                                        )
                                    ) : (
                                        <div style={{ padding: '60px 20px', textAlign: 'center', opacity: 0.6 }}>
                                            <ShoppingBag style={{ width: '48px', height: '48px', color: brandColors.textMuted, margin: '0 auto 16px' }} />
                                            <p style={{ color: brandColors.textMuted, fontSize: '15px', margin: 0 }}>Buscá productos para empezar a armar la venta</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Derecha: Carrito */}
                            <div style={{ flex: '1 1 40%', background: brandColors.bg, display: 'flex', flexDirection: 'column' }}>
                                <div style={{ padding: '16px 20px', background: 'white', borderBottom: `1px solid ${brandColors.border}` }}>
                                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: brandColors.textDark }}>Listado de Ítems</h3>
                                </div>
                                <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
                                    {cartItems.length === 0 ? (
                                        <div style={{ textAlign: 'center', padding: '40px 0', opacity: 0.6 }}>
                                            <p style={{ color: brandColors.textMuted, fontSize: '14px', margin: 0 }}>El carrito está vacío</p>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            {cartItems.map((item, index) => (
                                                <div key={index} style={{
                                                    background: 'white', borderRadius: '12px', padding: '12px',
                                                    border: `1px solid ${brandColors.border}`, display: 'flex', gap: '12px',
                                                }}>
                                                    {item.product_image ? (
                                                        <img src={item.product_image} alt="" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                                                    ) : (
                                                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>📝</div>
                                                    )}
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <p style={{ fontSize: '13px', fontWeight: 600, color: brandColors.textDark, margin: '0 0 2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                            {item.product_name}
                                                        </p>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                            <span style={{ fontSize: '11px', fontWeight: 600, color: brandColors.blue, background: `${brandColors.blue}15`, padding: '2px 6px', borderRadius: '4px' }}>
                                                                {item.isManual ? 'Manual' : item.size}
                                                            </span>
                                                            <span style={{ fontSize: '11px', color: brandColors.textMuted }}>{formatPrice(item.price)}</span>
                                                        </div>
                                                    </div>
                                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: brandColors.bg, borderRadius: '6px', padding: '2px' }}>
                                                            <button onClick={() => handleChangeQty(index, -1)} style={{ width: '20px', height: '20px', border: 'none', background: 'white', borderRadius: '4px', cursor: 'pointer' }}>-</button>
                                                            <span style={{ fontSize: '12px', fontWeight: 700, width: '16px', textAlign: 'center' }}>{item.quantity}</span>
                                                            <button onClick={() => handleChangeQty(index, 1)} disabled={!item.isManual && item.quantity >= item.size_stock} style={{ width: '20px', height: '20px', border: 'none', background: 'white', borderRadius: '4px', cursor: (!item.isManual && item.quantity >= item.size_stock) ? 'not-allowed' : 'pointer' }}>+</button>
                                                        </div>
                                                        <button onClick={() => handleRemoveItem(index)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}>
                                                            <Trash2 style={{ width: '14px', height: '14px', color: '#EF4444' }} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Footer Compra */}
                                <div style={{ background: 'white', borderTop: `1px solid ${brandColors.border}`, padding: '20px' }}>

                                    {isLeonesaFilter && (
                                        <div style={{ marginBottom: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                            <input type="text" value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Nombre Cliente" style={{ padding: '10px', borderRadius: '8px', border: `1px solid ${brandColors.border}`, fontSize: '12px' }} />
                                            <input type="text" value={clientPhone} onChange={e => setClientPhone(e.target.value)} placeholder="Teléfono" style={{ padding: '10px', borderRadius: '8px', border: `1px solid ${brandColors.border}`, fontSize: '12px' }} />
                                            <input type="text" value={clientLocation} onChange={e => setClientLocation(e.target.value)} placeholder="Ubicación" style={{ gridColumn: 'span 2', padding: '10px', borderRadius: '8px', border: `1px solid ${brandColors.border}`, fontSize: '12px' }} />
                                        </div>
                                    )}

                                    {!isLeonesaFilter && (
                                        <div style={{ marginBottom: '16px' }}>
                                            <input type="text" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notas (opcional)..." style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${brandColors.border}`, fontSize: '12px', boxSizing: 'border-box' }} />
                                        </div>
                                    )}

                                    <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                                        {paymentMethods.map(method => (
                                            <button
                                                key={method.id} onClick={() => setPaymentMethod(method.id)}
                                                style={{
                                                    flex: 1, padding: '10px 0', borderRadius: '8px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                                                    border: paymentMethod === method.id ? `2px solid ${method.color}` : `1px solid ${brandColors.border}`,
                                                    background: paymentMethod === method.id ? `${method.color}15` : 'white',
                                                }}
                                            >
                                                <method.icon style={{ width: '16px', height: '16px', color: paymentMethod === method.id ? method.color : brandColors.textMuted }} />
                                                <span style={{ fontSize: '10px', fontWeight: 700, color: paymentMethod === method.id ? method.color : brandColors.textMuted }}>{method.label}</span>
                                            </button>
                                        ))}
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
                                        <span style={{ fontSize: '14px', color: brandColors.textMuted, fontWeight: 600 }}>Total a cobrar</span>
                                        <span style={{ fontSize: '28px', fontWeight: 800, color: brandColors.blueDark, lineHeight: 1 }}>{formatPrice(total)}</span>
                                    </div>

                                    <button
                                        onClick={handleFinalizeSale} disabled={submitting || cartItems.length === 0}
                                        style={{
                                            width: '100%', padding: '16px', borderRadius: '12px', border: 'none', cursor: submitting || cartItems.length === 0 ? 'not-allowed' : 'pointer',
                                            background: cartItems.length === 0 ? brandColors.border : 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)',
                                            color: cartItems.length === 0 ? brandColors.textMuted : 'white', fontWeight: 700, fontSize: '15px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                            boxShadow: cartItems.length > 0 ? '0 4px 16px rgba(59,130,246,0.3)' : 'none',
                                        }}
                                    >
                                        {submitting ? <div style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s infinite linear' }} /> : <Check style={{ width: '18px', height: '18px' }} />}
                                        {submitting ? 'Procesando...' : 'Finalizar Venta'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de selección de talle */}
            {sizeModalProduct && (
                <div
                    onClick={() => setSizeModalProduct(null)}
                    style={{
                        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 250, padding: '20px',
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            width: '100%', maxWidth: '400px',
                            background: brandColors.card, borderRadius: '20px',
                            padding: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                            <img src={sizeModalProduct.imagen_url} alt="" style={{ width: '56px', height: '56px', borderRadius: '12px', objectFit: 'cover', background: '#F3F4F6' }} />
                            <div>
                                <p style={{ color: brandColors.textDark, fontSize: '16px', fontWeight: 700, margin: 0 }}>{sizeModalProduct.nombre}</p>
                                <p style={{ color: brandColors.blue, fontSize: '15px', fontWeight: 600, margin: '4px 0 0' }}>{formatPrice(sizeModalProduct.precio_descuento || sizeModalProduct.precio)}</p>
                            </div>
                        </div>

                        <p style={{ fontSize: '12px', color: brandColors.textMuted, fontWeight: 700, textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.5px' }}>
                            Seleccioná un talle para agregar
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                            {(sizeModalProduct.talles || []).map(talle => {
                                const hasStock = talle.stock > 0;
                                return (
                                    <button
                                        key={talle.id} onClick={() => hasStock && handleAddToCart(sizeModalProduct, talle)} disabled={!hasStock}
                                        style={{
                                            padding: '16px 8px', borderRadius: '12px', cursor: hasStock ? 'pointer' : 'not-allowed',
                                            border: hasStock ? `2px solid ${brandColors.blue}` : `2px solid ${brandColors.border}`,
                                            background: hasStock ? `${brandColors.blue}08` : brandColors.bg,
                                            opacity: hasStock ? 1 : 0.4, textAlign: 'center', transition: 'all 0.2s',
                                        }}
                                    >
                                        <p style={{ color: hasStock ? brandColors.textDark : brandColors.textMuted, fontSize: '16px', fontWeight: 800, margin: 0 }}>{talle.size}</p>
                                        <p style={{ color: hasStock ? '#22C55E' : '#EF4444', fontSize: '11px', fontWeight: 600, margin: '4px 0 0' }}>{hasStock ? `${talle.stock}u disp.` : 'Agotado'}</p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            <style>{`
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            `}</style>

            {/* Modal de Recibo (Visible siempre que esté activo, pero estilizado para print) */}
            {receiptData && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 200, padding: '20px',
                }} className="print:bg-white print:p-0 print:absolute print:inset-0">
                    <div style={{
                        background: 'white', width: '100%', maxWidth: '380px',
                        padding: '32px 24px', borderRadius: '2px',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                        fontFamily: "'Courier Prime', monospace", // Estilo ticket
                    }} className="print:shadow-none print:w-full print:max-w-none">

                        {/* Cabecera Ticket */}
                        <div style={{ textAlign: 'center', marginBottom: '24px', borderBottom: '1px dashed #ccc', paddingBottom: '16px' }}>
                            <h2 style={{ fontSize: '24px', fontWeight: 900, margin: '0 0 8px', letterSpacing: '-0.5px' }}>ALGO DIFERENTE</h2>
                            <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>Comprobante de Venta</p>
                            <p style={{ fontSize: '12px', color: '#666', margin: '4px 0 0' }}>
                                {receiptData.date.toLocaleDateString()} - {receiptData.date.toLocaleTimeString()}
                            </p>
                            <p style={{ fontSize: '14px', fontWeight: 700, margin: '8px 0 0' }}>Ticket #{receiptData.id}</p>
                        </div>

                        {/* Items */}
                        <div style={{ marginBottom: '24px' }}>
                            {receiptData.items.map((item, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 600 }}>{item.product_name}</div>
                                        <div style={{ color: '#666' }}>{item.isManual ? 'Manual' : item.size} x {item.quantity}</div>
                                    </div>
                                    <div style={{ fontWeight: 600 }}>{formatPrice(item.price * item.quantity)}</div>
                                </div>
                            ))}
                        </div>

                        {/* Totales */}
                        <div style={{ borderTop: '1px dashed #ccc', paddingTop: '16px', marginBottom: '32px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                                <span>Subtotal</span>
                                <span>{formatPrice(receiptData.total)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: 800 }}>
                                <span>TOTAL</span>
                                <span>{formatPrice(receiptData.total)}</span>
                            </div>
                            <div style={{ marginTop: '12px', fontSize: '12px', color: '#666', textAlign: 'center' }}>
                                Pago con {paymentMethods.find(p => p.id === receiptData.payment_method)?.label}
                            </div>
                        </div>

                        {/* Botones (Ocultos al imprimir) */}
                        <div className="print:hidden" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <button
                                onClick={() => generateReceiptPDF({
                                    id: receiptData.id,
                                    items: receiptData.items,
                                    total: receiptData.total,
                                    payment_method: receiptData.payment_method,
                                    date: receiptData.date,
                                    dateObj: receiptData.date,
                                })}
                                style={{
                                    width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
                                    background: '#1F2937', color: 'white', fontWeight: 600, cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                                }}
                            >
                                <Download style={{ width: '18px', height: '18px' }} /> Descargar Comprobante PDF
                            </button>
                            <button
                                onClick={handleCloseReceipt}
                                style={{
                                    width: '100%', padding: '14px', borderRadius: '12px', border: '2px solid #E5E7EB',
                                    background: 'white', color: '#1F2937', fontWeight: 600, cursor: 'pointer',
                                }}
                            >
                                Nueva Venta
                            </button>
                        </div>

                        {/* Footer Ticket (Solo visible al imprimir o en el modal) */}
                        <div style={{ textAlign: 'center', fontSize: '11px', color: '#999', marginTop: '32px' }}>
                            <p>¡Gracias por tu compra!</p>
                            <p>www.algodiferente.com</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

};

export default POS;
