import PropTypes from 'prop-types';
import ProductCard from './ProductCard';
import { Search } from 'lucide-react';
import brandColors from '@utils/brandColors';

const ProductGrid = ({ products, onAddToCart, onViewDetail, loading, title, subtitle }) => {
    if (loading) {
        return (
            <div>
                <div className="product-grid-responsive">
                    {[...Array(6)].map((_, index) => (
                        <div
                            key={index}
                            style={{
                                borderRadius: '2rem',
                                overflow: 'hidden',
                                opacity: 0,
                                animation: `fadeSlideUp 0.4s ease-out ${index * 0.08}s forwards`,
                            }}
                        >
                            {/* Image skeleton */}
                            <div style={{
                                aspectRatio: '1/1',
                                borderRadius: '2rem',
                                background: 'linear-gradient(110deg, #F3F4F6 30%, #EAECEE 50%, #F3F4F6 70%)',
                                backgroundSize: '200% 100%',
                                animation: 'shimmer 1.5s infinite',
                            }} />
                            {/* Info skeleton */}
                            <div style={{ padding: '12px 4px 0' }}>
                                <div style={{
                                    height: '8px',
                                    background: '#E5E7EB',
                                    borderRadius: '4px',
                                    width: '35%',
                                    marginBottom: '8px',
                                }} />
                                <div style={{
                                    height: '14px',
                                    background: '#E5E7EB',
                                    borderRadius: '6px',
                                    width: '80%',
                                    marginBottom: '8px',
                                }} />
                                <div style={{
                                    height: '14px',
                                    background: '#E5E7EB',
                                    borderRadius: '4px',
                                    width: '45%',
                                    marginBottom: '6px',
                                }} />
                                <div style={{
                                    height: '10px',
                                    background: '#F3F4F6',
                                    borderRadius: '4px',
                                    width: '60%',
                                }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!products || products.length === 0) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '60px 16px',
            }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    background: `linear-gradient(135deg, ${brandColors.cyanLight} 0%, ${brandColors.cyan}30 100%)`,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                    color: brandColors.cyan,
                }}>
                    <Search size={32} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1F2937', marginBottom: '8px' }}>
                    No encontramos productos
                </h3>
                <p style={{ fontSize: '14px', color: '#6B7280', textAlign: 'center', maxWidth: '280px' }}>
                    Intenta con otra categoría o término de búsqueda
                </p>
            </div>
        );
    }

    return (
        <div style={{ paddingBottom: '24px' }}>
            {title && (
                <div style={{ marginBottom: '16px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1F2937', marginBottom: '4px' }}>
                        {title}
                    </h2>
                    {subtitle && (
                        <p style={{ fontSize: '13px', color: '#6B7280' }}>
                            {subtitle}
                        </p>
                    )}
                </div>
            )}

            <div className="product-grid-responsive">
                {products.map((product, index) => (
                    <div
                        key={product.id}
                        style={{
                            opacity: 0,
                            animation: `fadeSlideUp 0.4s ease-out ${index * 0.06}s forwards`,
                        }}
                    >
                        <ProductCard
                            product={product}
                            onAddToCart={onAddToCart}
                            onViewDetail={onViewDetail}
                        />
                    </div>
                ))}
            </div>

            <style>{`
                @keyframes fadeSlideUp {
                    from {
                        opacity: 0;
                        transform: translateY(16px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `}</style>
        </div>
    );
};

ProductGrid.propTypes = {
    products: PropTypes.array,
    onAddToCart: PropTypes.func,
    onViewDetail: PropTypes.func,
    loading: PropTypes.bool,
    title: PropTypes.string,
    subtitle: PropTypes.string,
};

ProductGrid.defaultProps = {
    products: [],
    loading: false,
    title: '',
    subtitle: '',
};

export default ProductGrid;
