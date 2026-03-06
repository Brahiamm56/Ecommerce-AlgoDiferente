import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { SlidersHorizontal, ChevronDown, X, ArrowUpDown } from 'lucide-react';

const SearchFilters = ({
    onFiltersChange,
    minPriceRange = 0,
    maxPriceRange = 100000,
    totalProducts = 0
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [priceMin, setPriceMin] = useState('');
    const [priceMax, setPriceMax] = useState('');
    const [sortBy, setSortBy] = useState('default');
    const [hasActiveFilters, setHasActiveFilters] = useState(false);

    const sortOptions = [
        { value: 'default', label: 'Relevancia' },
        { value: 'price_asc', label: 'Menor precio' },
        { value: 'price_desc', label: 'Mayor precio' },
        { value: 'name_asc', label: 'A - Z' },
        { value: 'name_desc', label: 'Z - A' },
        { value: 'newest', label: 'Más recientes' },
    ];

    // Detectar filtros activos
    useEffect(() => {
        const active = priceMin !== '' || priceMax !== '' || sortBy !== 'default';
        setHasActiveFilters(active);
    }, [priceMin, priceMax, sortBy]);

    // Notificar cambios
    useEffect(() => {
        if (onFiltersChange) {
            onFiltersChange({
                priceMin: priceMin ? Number(priceMin) : null,
                priceMax: priceMax ? Number(priceMax) : null,
                sortBy: sortBy !== 'default' ? sortBy : null,
            });
        }
    }, [priceMin, priceMax, sortBy, onFiltersChange]);

    const clearFilters = () => {
        setPriceMin('');
        setPriceMax('');
        setSortBy('default');
    };

    const handlePriceSubmit = (e) => {
        e.preventDefault();
        setIsOpen(false);
    };

    return (
        <div className="relative">
            {/* Barra de Filtros */}
            <div className="flex items-center gap-2 px-4 py-3 bg-white border-b border-gray-100 overflow-x-auto">
                {/* Botón principal de filtros */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all flex-shrink-0 ${hasActiveFilters
                            ? 'bg-blue-50 border-blue-300 text-blue-700'
                            : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                        }`}
                >
                    <SlidersHorizontal className="w-4 h-4" />
                    Filtros
                    {hasActiveFilters && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full" />
                    )}
                </button>

                {/* Selector de Ordenamiento Rápido */}
                <div className="relative flex-shrink-0">
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="appearance-none pl-3 pr-8 py-2 rounded-full border border-gray-200 text-sm font-medium bg-white text-gray-700 hover:border-gray-300 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {sortOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                {/* Contador de productos */}
                <span className="text-sm text-gray-500 ml-auto flex-shrink-0">
                    {totalProducts} {totalProducts === 1 ? 'producto' : 'productos'}
                </span>

                {/* Botón limpiar filtros */}
                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium text-red-600 hover:bg-red-50 transition-colors flex-shrink-0"
                    >
                        <X className="w-4 h-4" />
                        Limpiar
                    </button>
                )}
            </div>

            {/* Panel de Filtros Expandible */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-40 animate-fade-in">
                    <form onSubmit={handlePriceSubmit} className="p-4">
                        {/* Filtro de Precio */}
                        <div className="mb-4">
                            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <ArrowUpDown className="w-4 h-4" />
                                Rango de Precio
                            </h4>
                            <div className="flex items-center gap-3">
                                <div className="flex-1">
                                    <label className="text-xs text-gray-500 mb-1 block">Mínimo</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                                        <input
                                            type="number"
                                            placeholder={String(minPriceRange)}
                                            value={priceMin}
                                            onChange={(e) => setPriceMin(e.target.value)}
                                            className="w-full pl-7 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            min={0}
                                        />
                                    </div>
                                </div>
                                <span className="text-gray-300 mt-5">—</span>
                                <div className="flex-1">
                                    <label className="text-xs text-gray-500 mb-1 block">Máximo</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                                        <input
                                            type="number"
                                            placeholder={String(maxPriceRange)}
                                            value={priceMax}
                                            onChange={(e) => setPriceMax(e.target.value)}
                                            className="w-full pl-7 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            min={0}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Botones de acción */}
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="flex-1 py-2 px-4 border border-gray-200 rounded-full text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-full font-medium text-sm hover:bg-blue-700 transition-colors"
                            >
                                Aplicar
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

SearchFilters.propTypes = {
    onFiltersChange: PropTypes.func,
    minPriceRange: PropTypes.number,
    maxPriceRange: PropTypes.number,
    totalProducts: PropTypes.number,
};

export default SearchFilters;
