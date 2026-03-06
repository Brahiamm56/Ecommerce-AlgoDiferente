import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Verificar si hay sesión activa al cargar
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('admin_token');
            if (token) {
                try {
                    // Validar token con el backend
                    const data = await authService.getProfile();
                    setUser(data.user);
                    setIsAuthenticated(true);
                    // Actualizar usuario guardado por si cambió algo
                    localStorage.setItem('admin_user', JSON.stringify(data.user));
                } catch (error) {
                    console.error('Error de autenticación:', error);
                    // Si falla (token expirado/inválido), cerrar sesión
                    logout();
                }
            } else {
                setLoading(false);
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const data = await authService.login(email, password);
            // authService ya guarda admin_token, guardamos usuario
            localStorage.setItem('admin_user', JSON.stringify(data.user));
            setUser(data.user);
            setIsAuthenticated(true);
            toast.success('¡Bienvenido de nuevo!');
            return true;
        } catch (error) {
            console.error('Error en login:', error);
            const message = error.response?.data?.error || 'Error al iniciar sesión';
            toast.error(message);
            return false;
        }
    };

    const logout = () => {
        authService.logout(); // Limpia admin_token
        localStorage.removeItem('admin_user');
        setUser(null);
        setIsAuthenticated(false);
        toast.success('Sesión cerrada');
    };

    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
