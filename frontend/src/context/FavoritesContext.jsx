import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';

const FavoritesContext = createContext();

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavorites debe usarse dentro de FavoritesProvider');
    }
    return context;
};

export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);

    // Cargar favoritos de localStorage al iniciar
    useEffect(() => {
        const storedFavorites = localStorage.getItem('favorites');
        if (storedFavorites) {
            try {
                setFavorites(JSON.parse(storedFavorites));
            } catch (e) {
                console.error('Error parsing favorites:', e);
                localStorage.removeItem('favorites');
            }
        }
    }, []);

    // Guardar en localStorage cuando cambian
    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }, [favorites]);

    // Agregar a favoritos
    const addToFavorites = (product) => {
        setFavorites(prev => {
            if (prev.find(p => p.id === product.id)) {
                return prev; // Ya existe
            }
            toast.success(`${product.nombre} agregado a favoritos`, {
                icon: '❤️',
            });
            return [...prev, product];
        });
    };

    // Quitar de favoritos
    const removeFromFavorites = (productId) => {
        setFavorites(prev => {
            const product = prev.find(p => p.id === productId);
            if (product) {
                toast.success(`${product.nombre} eliminado de favoritos`, {
                    icon: '💔',
                });
            }
            return prev.filter(p => p.id !== productId);
        });
    };

    // Toggle favorito
    const toggleFavorite = (product) => {
        if (isFavorite(product.id)) {
            removeFromFavorites(product.id);
        } else {
            addToFavorites(product);
        }
    };

    // Verificar si es favorito
    const isFavorite = (productId) => {
        return favorites.some(p => p.id === productId);
    };

    // Limpiar favoritos
    const clearFavorites = () => {
        setFavorites([]);
        toast.success('Favoritos eliminados');
    };

    const value = {
        favorites,
        favoritesCount: favorites.length,
        addToFavorites,
        removeFromFavorites,
        toggleFavorite,
        isFavorite,
        clearFavorites,
    };

    return (
        <FavoritesContext.Provider value={value}>
            {children}
        </FavoritesContext.Provider>
    );
};

FavoritesProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default FavoritesContext;
