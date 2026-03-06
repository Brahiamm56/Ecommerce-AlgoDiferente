/**
 * Cliente API para conectar con el backend
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Función base para hacer peticiones
 */
const fetchAPI = async (endpoint, options = {}) => {
    const url = `${API_URL}${endpoint}`;

    const isFormData = options.body instanceof FormData;

    const headers = {
        ...options.headers,
    };

    // Solo agregar Content-Type JSON si NO es FormData
    if (!isFormData) {
        headers['Content-Type'] = 'application/json';
    }

    const config = {
        headers,
        ...options,
    };

    // Agregar token si existe
    const token = localStorage.getItem('admin_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Error en la petición');
        }

        return data;
    } catch (error) {
        console.error(`API Error [${endpoint}]:`, error);
        throw error;
    }
};

/**
 * Servicios de Productos
 */
export const productService = {
    // Obtener todos los productos
    getAll: async (params = {}) => {
        const queryParams = new URLSearchParams();

        if (params.categoria) queryParams.append('categoria', params.categoria);
        if (params.search) queryParams.append('search', params.search);
        if (params.destacado) queryParams.append('destacado', params.destacado);
        if (params.page) queryParams.append('page', params.page);
        if (params.limit) queryParams.append('limit', params.limit);

        const query = queryParams.toString();
        const endpoint = `/products${query ? `?${query}` : ''}`;

        return fetchAPI(endpoint);
    },

    // Obtener un producto por ID
    getById: async (id) => {
        return fetchAPI(`/products/${id}`);
    },

    // Crear producto (admin)
    create: async (productData) => {
        return fetchAPI('/products', {
            method: 'POST',
            body: productData instanceof FormData ? productData : JSON.stringify(productData),
        });
    },

    // Actualizar producto (admin)
    update: async (id, productData) => {
        return fetchAPI(`/products/${id}`, {
            method: 'PUT',
            body: productData instanceof FormData ? productData : JSON.stringify(productData),
        });
    },

    // Actualizar stock (admin)
    updateStock: async (id, stock) => {
        return fetchAPI(`/products/${id}/stock`, {
            method: 'PATCH',
            body: JSON.stringify({ stock }),
        });
    },

    // Actualizar stock de un talle específico (admin)
    updateSizeStock: async (productId, sizeId, stock) => {
        return fetchAPI(`/products/${productId}/sizes/stock`, {
            method: 'PUT',
            body: JSON.stringify({ size_id: sizeId, stock }),
        });
    },

    // Eliminar producto (admin)
    delete: async (id) => {
        return fetchAPI(`/products/${id}`, {
            method: 'DELETE',
        });
    },
};

/**
 * Servicios de Categorías
 */
export const categoryService = {
    // Obtener todas las categorías
    getAll: async () => {
        return fetchAPI('/categories');
    },

    // Obtener categoría por ID
    getById: async (id) => {
        return fetchAPI(`/categories/${id}`);
    },

    // Crear categoría (admin)
    create: async (categoryData) => {
        return fetchAPI('/categories', {
            method: 'POST',
            body: categoryData instanceof FormData ? categoryData : JSON.stringify(categoryData),
        });
    },

    // Actualizar categoría (admin)
    update: async (id, categoryData) => {
        return fetchAPI(`/categories/${id}`, {
            method: 'PUT',
            body: categoryData instanceof FormData ? categoryData : JSON.stringify(categoryData),
        });
    },

    // Eliminar categoría (admin)
    delete: async (id) => {
        return fetchAPI(`/categories/${id}`, {
            method: 'DELETE',
        });
    },
};

/**
 * Servicios de Banners
 */
export const bannerService = {
    // Obtener banners
    get: async () => {
        return fetchAPI('/banners');
    },
    // Actualizar banners (admin)
    update: async (data) => {
        return fetchAPI('/banners', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }
};

/**
 * Servicios de Cupones
 */
export const couponService = {
    // Obtener todos los cupones
    getAll: async () => {
        return fetchAPI('/coupons');
    },
    // Crear cupón (admin)
    create: async (data) => {
        return fetchAPI('/coupons', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    // Eliminar cupón (admin)
    delete: async (id) => {
        return fetchAPI(`/coupons/${id}`, {
            method: 'DELETE',
        });
    },
    // Alternar estado activo de cupón (admin)
    toggleActive: async (id) => {
        return fetchAPI(`/coupons/${id}/toggle`, {
            method: 'PATCH',
        });
    }
};

/**
 * Servicios de Autenticación
 */
export const authService = {
    // Login
    login: async (email, password) => {
        const data = await fetchAPI('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });

        if (data.token) {
            localStorage.setItem('admin_token', data.token);
        }

        return data;
    },

    // Logout
    logout: () => {
        localStorage.removeItem('admin_token');
    },

    // Obtener perfil actual
    getProfile: async () => {
        return fetchAPI('/auth/me');
    },

    // Verificar si está autenticado
    isAuthenticated: () => {
        return !!localStorage.getItem('admin_token');
    },
};

// ========================================
// Servicio de Ventas (POS)
// ========================================
export const salesService = {
    create: async (data) => {
        return fetchAPI('/sales', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    getAll: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return fetchAPI(`/sales?${query}`);
    },

    getById: async (id) => {
        return fetchAPI(`/sales/${id}`);
    },

    getStats: async () => {
        return fetchAPI('/sales/stats');
    },
};

// ========================================
// Servicio de Gastos
// ========================================
export const gastosService = {
    getAll: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return fetchAPI(`/gastos${query ? `?${query}` : ''}`);
    },
    create: async (data) => {
        return fetchAPI('/gastos', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    update: async (id, data) => {
        return fetchAPI(`/gastos/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },
    delete: async (id) => {
        return fetchAPI(`/gastos/${id}`, {
            method: 'DELETE',
        });
    },
    getStats: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return fetchAPI(`/gastos/stats${query ? `?${query}` : ''}`);
    },
};

// ========================================
// Servicio de Proveedores
// ========================================
export const proveedoresService = {
    getAll: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return fetchAPI(`/proveedores${query ? `?${query}` : ''}`);
    },
    create: async (data) => {
        return fetchAPI('/proveedores', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    update: async (id, data) => {
        return fetchAPI(`/proveedores/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },
    delete: async (id) => {
        return fetchAPI(`/proveedores/${id}`, {
            method: 'DELETE',
        });
    },
};

export default {
    products: productService,
    categories: categoryService,
    auth: authService,
    sales: salesService,
    gastos: gastosService,
    proveedores: proveedoresService,
};
