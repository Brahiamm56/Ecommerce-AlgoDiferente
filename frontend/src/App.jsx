import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from '@context/CartContext';
import { AuthProvider } from '@context/AuthContext';
import { FavoritesProvider } from '@context/FavoritesContext';
import Home from '@pages/Home';
import ProductDetail from '@pages/ProductDetail';
import Favorites from '@pages/Favorites';
import CartDrawer from '@components/cart/CartDrawer';
// Admin Imports
import Login from '@pages/admin/Login';
import ProtectedRoute from '@components/admin/ProtectedRoute';
import Dashboard from '@pages/admin/Dashboard';
import ProductCreate from '@pages/admin/ProductCreate';
import ProductEdit from '@pages/admin/ProductEdit';
import Categories from '@pages/admin/Categories';
import CategoryCreate from '@pages/admin/CategoryCreate';
import CategoryEdit from '@pages/admin/CategoryEdit';
import Banners from '@pages/admin/Banners';
import Coupons from '@pages/admin/Coupons';
import POS from '@pages/admin/POS';
import SalesDashboard from '@pages/admin/SalesDashboard';
import Gastos from '@pages/admin/Gastos';
import Proveedores from '@pages/admin/Proveedores';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          <Router>
            {/* Toast Notifications */}
            <Toaster
              position="bottom-center"
              containerStyle={{ bottom: 100 }}
              toastOptions={{
                duration: 2500,
                style: {
                  background: '#0A0A0A',
                  color: '#fff',
                  borderRadius: '14px',
                  padding: '14px 20px',
                  fontSize: '14px',
                  fontWeight: 500,
                  boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
                  maxWidth: '380px',
                },
                success: {
                  iconTheme: {
                    primary: '#00D4D4',
                    secondary: '#0A0A0A',
                  },
                  style: {
                    borderLeft: '4px solid #00D4D4',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#FF00FF',
                    secondary: '#0A0A0A',
                  },
                  style: {
                    borderLeft: '4px solid #FF00FF',
                  },
                },
              }}
            />

            {/* Global Components */}
            <CartDrawer />

            {/* Routes */}
            <Routes>
              {/* Rutas Públicas */}
              <Route path="/" element={<Home />} />
              <Route path="/producto/:id" element={<ProductDetail />} />
              <Route path="/favoritos" element={<Favorites />} />

              {/* Rutas Admin */}
              <Route path="/admin/login" element={<Login />} />
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute>
                    <Routes>
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="products/create" element={<ProductCreate />} />
                      <Route path="products/edit/:id" element={<ProductEdit />} />

                      {/* Categorías */}
                      <Route path="categories" element={<Categories />} />
                      <Route path="categories/create" element={<CategoryCreate />} />
                      <Route path="categories/edit/:id" element={<CategoryEdit />} />

                      {/* Marketing */}
                      <Route path="banners" element={<Banners />} />
                      <Route path="coupons" element={<Coupons />} />

                      {/* Punto de Venta */}
                      <Route path="pos" element={<POS />} />

                      {/* Dashboard de Ventas */}
                      <Route path="sales-dashboard" element={<SalesDashboard />} />

                      {/* Gastos y Proveedores */}
                      <Route path="gastos" element={<Gastos />} />
                      <Route path="proveedores" element={<Proveedores />} />

                      {/* Redirección por defecto */}
                      <Route path="*" element={<Navigate to="dashboard" replace />} />
                    </Routes>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;

