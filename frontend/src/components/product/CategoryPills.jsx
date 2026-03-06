import PropTypes from 'prop-types';
import { LayoutGrid, Footprints, Shirt, Watch, Gem, Star, Zap, Package } from 'lucide-react';
import brandColors from '@utils/brandColors';

// Map common category slugs to icons
const categoryIconMap = {
    todos: LayoutGrid,
    zapatillas: Footprints,
    zapatos: Footprints,
    ropa: Shirt,
    remeras: Shirt,
    camisetas: Shirt,
    buzos: Shirt,
    accesorios: Watch,
    relojes: Watch,
    joyas: Gem,
    joyeria: Gem,
    ofertas: Zap,
    destacados: Star,
};

const getIconForCategory = (slug) => {
    if (!slug) return Package;
    const normalized = slug.toLowerCase();
    return categoryIconMap[normalized] || Package;
};

const CategoryPills = ({ categories, activeSlug, onChange }) => {
    const filteredCategories = categories.filter(
        c => c.slug !== 'todos' && c.nombre?.toLowerCase() !== 'todos'
    );

    return (
        <div style={{ position: 'relative' }}>
            <style>{`
                .cp-wrapper {
                    display: flex;
                    gap: 8px;
                    overflow-x: auto;
                    scroll-snap-type: x mandatory;
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                    padding-bottom: 4px;
                }
                .cp-wrapper::-webkit-scrollbar { display: none; }
                .cp-btn {
                    flex-shrink: 0;
                    height: 38px;
                    padding: 0 16px;
                    border-radius: 12px;
                    border: none;
                    font-weight: 600;
                    font-size: 0.82rem;
                    cursor: pointer;
                    scroll-snap-align: start;
                    white-space: nowrap;
                    transition: all 0.22s ease;
                    line-height: 1;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                }
                .cp-btn-inactive {
                    background: #f1f3f4;
                    color: #555;
                }
                .cp-btn-inactive:hover {
                    background: #e4e6e8;
                    color: #111;
                    transform: translateY(-1px);
                }
                .cp-btn-active {
                    background: ${brandColors.cyan};
                    color: ${brandColors.black};
                    box-shadow: 0 3px 12px rgba(0, 212, 212, 0.35);
                    font-weight: 700;
                }
                .cp-btn-active:hover {
                    box-shadow: 0 4px 16px rgba(0, 212, 212, 0.45);
                }
                .cp-fade {
                    position: absolute;
                    top: 0;
                    right: 0;
                    width: 48px;
                    height: calc(100% - 4px);
                    background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.95));
                    pointer-events: none;
                }
                @media (min-width: 768px) {
                    .cp-wrapper { flex-wrap: wrap; overflow-x: visible; }
                    .cp-fade { display: none; }
                }
            `}</style>

            <div className="cp-wrapper">
                <button
                    className={`cp-btn ${activeSlug === 'todos' ? 'cp-btn-active' : 'cp-btn-inactive'}`}
                    onClick={() => onChange('todos')}
                >
                    <LayoutGrid size={14} />
                    Todos
                </button>

                {filteredCategories.map((category) => {
                    const Icon = getIconForCategory(category.slug);
                    return (
                        <button
                            key={category.id}
                            className={`cp-btn ${activeSlug === category.slug ? 'cp-btn-active' : 'cp-btn-inactive'}`}
                            onClick={() => onChange(category.slug)}
                        >
                            <Icon size={14} />
                            {category.nombre}
                        </button>
                    );
                })}
            </div>

            <div className="cp-fade" aria-hidden="true" />
        </div>
    );
};

CategoryPills.propTypes = {
    categories: PropTypes.array.isRequired,
    activeSlug: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default CategoryPills;
