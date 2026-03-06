import { useState } from 'react';
import PropTypes from 'prop-types';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';

const sortOptions = [
    { id: 'newest', label: 'Más Nuevos' },
    { id: 'price_asc', label: 'Menor Precio' },
    { id: 'price_desc', label: 'Mayor Precio' },
];

const FilterBar = ({ sortBy, onSortChange }) => {
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const activeSortLabel = sortOptions.find(o => o.id === sortBy)?.label || 'Ordenar';

    return (
        <div style={{ paddingTop: '12px' }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
                <button
                    onClick={() => setShowSortDropdown(!showSortDropdown)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 16px',
                        borderRadius: '12px',
                        border: '1.5px solid #E5E7EB',
                        background: '#FAFAFA',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#374151',
                        transition: 'all 0.2s',
                        boxShadow: showSortDropdown ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                    }}
                >
                    <SlidersHorizontal size={15} style={{ color: '#6B7280' }} />
                    {activeSortLabel}
                    <ChevronDown
                        size={14}
                        style={{
                            color: '#9CA3AF',
                            transition: 'transform 0.2s',
                            transform: showSortDropdown ? 'rotate(180deg)' : 'rotate(0)',
                        }}
                    />
                </button>

                {showSortDropdown && (
                    <>
                        <div
                            onClick={() => setShowSortDropdown(false)}
                            style={{ position: 'fixed', inset: 0, zIndex: 40 }}
                        />
                        <div style={{
                            position: 'absolute',
                            top: 'calc(100% + 6px)',
                            left: 0,
                            minWidth: '180px',
                            background: 'white',
                            borderRadius: '14px',
                            border: '1px solid #E5E7EB',
                            boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                            zIndex: 50,
                            overflow: 'hidden',
                            animation: 'fadeInSlide 0.15s ease-out',
                        }}>
                            {sortOptions.map(opt => (
                                <button
                                    key={opt.id}
                                    onClick={() => {
                                        onSortChange(opt.id);
                                        setShowSortDropdown(false);
                                    }}
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '12px 16px',
                                        border: 'none',
                                        background: sortBy === opt.id ? '#F3F4F6' : 'white',
                                        cursor: 'pointer',
                                        fontSize: '13px',
                                        fontWeight: sortBy === opt.id ? 700 : 500,
                                        color: sortBy === opt.id ? '#111827' : '#4B5563',
                                        transition: 'background 0.15s',
                                        borderBottom: '1px solid #F3F4F6',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'}
                                    onMouseLeave={e => e.currentTarget.style.background = sortBy === opt.id ? '#F3F4F6' : 'white'}
                                >
                                    {opt.label}
                                    {sortBy === opt.id && (
                                        <span style={{ fontSize: '14px' }}>✓</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>

            <style>{`
                @keyframes fadeInSlide {
                    from { opacity: 0; transform: translateY(-4px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

FilterBar.propTypes = {
    sortBy: PropTypes.string.isRequired,
    onSortChange: PropTypes.func.isRequired,
};

export default FilterBar;
