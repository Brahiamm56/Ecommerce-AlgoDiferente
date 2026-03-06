import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@components/layout/Header';
import MobileMenu from '@components/layout/MobileMenu';
import BottomNavBar from '@components/layout/BottomNavBar';
import Footer from '@components/layout/Footer';
import WhatsAppButton from '@components/common/WhatsAppButton';
import AnnouncementBar from '@components/common/AnnouncementBar';
import CategoryPills from '@components/product/CategoryPills';
import HeroCarousel from '@components/product/HeroCarousel';
import PromoBanners from '@components/product/PromoBanners';
import BestSellersCarousel from '@components/product/BestSellersCarousel';
import ProductGrid from '@components/product/ProductGrid';
import FilterBar from '@components/product/FilterBar';
import { productService, categoryService } from '@services/api';
import { useCart } from '@context/CartContext';

const Home = () => {
    const navigate = useNavigate();
    const { addToCart, openCart, cartCount } = useCart();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('todos');
    const [sortBy, setSortBy] = useState('newest');

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await categoryService.getAll();
                setCategories(data.categories || []);
            } catch (err) {
                console.error('Error cargando categorías:', err);
            }
        };
        loadCategories();
    }, []);

    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const params = {};
                if (activeCategory !== 'todos') params.categoria = activeCategory;
                if (searchTerm) params.search = searchTerm;
                const data = await productService.getAll(params);
                setProducts(data.products || []);
            } catch (err) {
                console.error('Error cargando productos:', err);
                setError('Error al cargar productos.');
            } finally {
                setLoading(false);
            }
        };
        const timeoutId = setTimeout(loadProducts, 300);
        return () => clearTimeout(timeoutId);
    }, [activeCategory, searchTerm]);

    const handleViewDetail = (product) => navigate(`/producto/${product.id}`);
    const handleCategorySelect = (slug) => {
        setActiveCategory(slug);
        document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    const activeCategoryName = useMemo(() => {
        if (activeCategory === 'todos') return 'Todos los productos';
        const cat = categories.find(c => c.slug === activeCategory);
        return cat?.nombre || activeCategory;
    }, [activeCategory, categories]);

    const displayProducts = useMemo(() => {
        let filtered = [...products];
        filtered.sort((a, b) => {
            const priceA = a.precio_descuento || a.precio;
            const priceB = b.precio_descuento || b.precio;
            switch (sortBy) {
                case 'price_asc':
                    return priceA - priceB;
                case 'price_desc':
                    return priceB - priceA;
                case 'newest':
                default:
                    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
            }
        });
        return filtered;
    }, [products, sortBy]);

    const isInitialView = !searchTerm && activeCategory === 'todos' && sortBy === 'newest';

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

    return (
        <div className="min-h-screen bg-white" style={{ paddingTop: '72px' }}>
            <Header
                cartItemCount={cartCount}
                onCartClick={openCart}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onMenuClick={toggleMenu}
                isSearchOpen={isSearchOpen}
                onSearchToggle={toggleSearch}
            />

            <AnnouncementBar />

            <MobileMenu
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
                categories={categories}
                onCategorySelect={(slug) => {
                    handleCategorySelect(slug);
                    setIsMenuOpen(false);
                }}
            />

            {/* Vista Inicial - Hero + Promos — fondo blanco */}
            {isInitialView && (
                <div className="layout-container">
                    <HeroCarousel products={products} onViewProduct={handleViewDetail} />
                    <PromoBanners products={products} onViewProduct={handleViewDetail} />
                </div>
            )}

            {/* Category Pills + Filter — fondo blanco */}
            <div className="layout-container" style={{ paddingTop: '20px', paddingBottom: '12px' }}>
                <CategoryPills
                    categories={categories}
                    activeSlug={activeCategory}
                    onChange={setActiveCategory}
                />
                <FilterBar sortBy={sortBy} onSortChange={setSortBy} />
            </div>

            {/* Best Sellers — fondo gris suave para separar visualmente */}
            {isInitialView && (
                <div style={{ background: '#F8F9FA' }}>
                    <BestSellersCarousel
                        products={products}
                        onViewProduct={handleViewDetail}
                    />
                </div>
            )}

            {/* Products Section — fondo blanco, contrasta con el gris de arriba */}
            <div id="products-section" style={{ background: '#FFFFFF' }}>
                <div className="layout-container" style={{ paddingTop: '24px' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '16px',
                    }}>
                        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1F2937', margin: 0 }}>
                            {activeCategoryName}
                        </h2>
                        <span style={{ fontSize: '14px', color: '#6B7280' }}>
                            {displayProducts.length} {displayProducts.length === 1 ? 'producto' : 'productos'}
                        </span>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-100 rounded-lg text-red-700 text-sm mb-4">
                            {error}
                        </div>
                    )}

                    {loading && (
                        <div className="product-grid-responsive" style={{ paddingBottom: '16px' }}>
                            {[0, 1, 2, 3].map(i => (
                                <div key={i} style={{
                                    opacity: 0,
                                    animation: `fadeSlideUp 0.4s ease-out ${i * 0.08}s forwards`,
                                }}>
                                    <div style={{
                                        aspectRatio: '1/1',
                                        borderRadius: '2rem',
                                        background: 'linear-gradient(110deg, #F3F4F6 30%, #EAECEE 50%, #F3F4F6 70%)',
                                        backgroundSize: '200% 100%',
                                        animation: 'shimmer 1.5s infinite',
                                        marginBottom: '12px',
                                    }} />
                                    <div style={{ padding: '0 4px' }}>
                                        <div style={{ height: '8px', background: '#E5E7EB', borderRadius: '4px', width: '35%', marginBottom: '8px' }} />
                                        <div style={{ height: '14px', background: '#E5E7EB', borderRadius: '6px', width: '80%', marginBottom: '8px' }} />
                                        <div style={{ height: '14px', background: '#E5E7EB', borderRadius: '4px', width: '45%' }} />
                                    </div>
                                </div>
                            ))}
                            <style>{`
                                @keyframes fadeSlideUp {
                                    from { opacity: 0; transform: translateY(16px); }
                                    to { opacity: 1; transform: translateY(0); }
                                }
                                @keyframes shimmer {
                                    0% { background-position: 200% 0; }
                                    100% { background-position: -200% 0; }
                                }
                            `}</style>
                        </div>
                    )}

                    {!loading && !error && (
                        <ProductGrid
                            products={displayProducts}
                            onAddToCart={addToCart}
                            onViewDetail={handleViewDetail}
                        />
                    )}
                </div>
            </div>

            <Footer />
            <WhatsAppButton />
            <BottomNavBar />
        </div>
    );
};

export default Home;
