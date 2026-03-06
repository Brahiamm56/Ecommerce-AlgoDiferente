# Documento de Contexto: E-commerce Catálogo Lite (WhatsApp Edition)

## 1. Visión General del Proyecto
Desarrollo de una plataforma de comercio electrónico minimalista, diseñada específicamente para dispositivos móviles ("Mobile-First"), orientada al sector de indumentaria y calzado. El sistema funciona como un catálogo digital donde los usuarios pueden explorar productos, gestionar un carrito de compras y finalizar el pedido mediante la redirección a un chat de WhatsApp con el vendedor. No incluye pasarela de pago (Stripe/PayPal), priorizando la simplicidad y el trato directo.

---

## 2. Stack Tecnológico Definido
* **Frontend**: React.js (usando Vite para el build)
* **Estilos**: Tailwind CSS (implementando un diseño "Light Mode" limpio y corporativo)
* **Backend**: Node.js con Express
* **Base de Datos**: MySQL
* **Gestión de Imágenes**: Cloudinary (para subida rápida mediante el panel de admin)

---

## 3. Diseño UI/UX - Basado en Referencia Visual

### 3.1 Paleta de Colores Exacta
```
- Primary Blue: #0D6EFD (azul vibrante de los botones y acentos)
- Secondary Blue: #4A90E2 (azul más claro para degradados)
- Background: #F8F9FA (gris muy claro, casi blanco)
- Card Background: #FFFFFF (blanco puro)
- Text Primary: #212529 (negro suave)
- Text Secondary: #6C757D (gris medio)
- Border: #DEE2E6 (gris claro para bordes sutiles)
- Success/Green: #28A745 (botón flotante de WhatsApp)
- Price Highlight: #FF6B6B o #E63946 (rojo/coral para precios en oferta)
- Overlay Agotado: rgba(0, 0, 0, 0.7) con texto blanco
```

### 3.2 Componentes Clave del Diseño

#### Header/Navigation Bar
- Fondo: Gradiente azul (`bg-gradient-to-r from-blue-500 to-blue-600`)
- Altura: `h-14` (56px)
- Elementos:
  - Logo/nombre de la tienda (izquierda, texto blanco)
  - Iconos: Carrito, Usuario, Menú hamburguesa (derecha)
  - Barra de búsqueda central con ícono de lupa
  - Todo el header con `shadow-md`

#### Banner Hero Principal
- Diseño: Card con imagen grande del producto destacado
- Gradiente de fondo azul (#0D6EFD a #4A90E2)
- Imagen del producto: Posicionada a la derecha con efecto de profundidad
- Texto destacado: Blanco, bold, tamaño grande
- Botón CTA: Blanco con texto azul, rounded-full, shadow-lg
- Altura aproximada: `h-64` en mobile

#### Categorías (Pills/Tabs Horizontales)
```jsx
// Ejemplo de estilo:
className="flex gap-2 overflow-x-auto pb-2 px-4 scrollbar-hide"

// Cada pill:
className="px-4 py-2 rounded-full whitespace-nowrap 
           bg-white border-2 border-blue-500 text-blue-500
           hover:bg-blue-500 hover:text-white
           active:bg-blue-600 active:scale-95
           transition-all duration-200"

// Pill activa:
className="px-4 py-2 rounded-full whitespace-nowrap
           bg-blue-500 text-white border-2 border-blue-500
           shadow-md"
```

#### Product Cards (Grid de Productos)
```jsx
// Container del grid:
className="grid grid-cols-2 gap-3 px-4 py-4"

// Card individual:
className="bg-white rounded-2xl shadow-md overflow-hidden 
           hover:shadow-xl transition-shadow duration-300
           border border-gray-100"

// Estructura interna:
- Contenedor de imagen: aspect-square, bg-gray-50
- Imagen producto: object-cover, rounded-t-2xl
- Badge de descuento (si aplica): absolute top-2 right-2, 
  bg-red-500, text-white, rounded-full, px-2 py-1, text-xs
- Overlay "AGOTADO": absolute inset-0, bg-black/70, 
  flex items-center justify-center, text-white font-bold text-lg

// Sección de info (padding: p-3):
- Nombre producto: font-semibold, text-sm, text-gray-800, 
  truncate max 2 lines
- Precio: text-lg font-bold text-blue-600
- Precio tachado (si hay descuento): text-sm text-gray-400 line-through
- Rating: Estrellas amarillas + número de reviews
- Botón añadir: 
  className="w-full mt-2 bg-blue-500 text-white rounded-full 
             py-2 font-semibold hover:bg-blue-600 
             active:scale-95 transition-all"
```

#### Vista de Detalle del Producto (Modal/Página)
- Fondo: Blanco puro
- Header: Sticky, con botón volver (←) y título centrado
- Imagen principal: 
  - Tamaño: w-full, aspect-square
  - Border radius: rounded-3xl
  - Shadow: shadow-xl
  - Fondo: bg-gray-50
- Galería de thumbnails (si múltiples imágenes):
  - Horizontal scroll
  - Thumbnails: rounded-lg, border-2, border-transparent
  - Thumbnail activo: border-blue-500

- Card de información (bg-white, rounded-t-3xl, shadow-2xl, -mt-6 relativo a imagen):
  - Nombre: text-2xl font-bold text-gray-900
  - Precio: text-3xl font-bold text-blue-600
  - Rating y reviews: flex items-center gap-2
  - Stock disponible: 
    - Si hay stock > 10: text-green-600 "En stock"
    - Si hay stock < 10: text-orange-500 "Últimas {stock} unidades"
    - Si stock = 0: text-red-600 "Agotado"
  
  - Selector de cantidad:
    ```jsx
    <div className="flex items-center gap-4 border-2 border-gray-200 
                    rounded-full px-4 py-2 w-fit">
      <button className="w-8 h-8 rounded-full bg-gray-100 
                         hover:bg-gray-200 flex items-center 
                         justify-center">−</button>
      <span className="text-lg font-semibold w-8 text-center">{qty}</span>
      <button className="w-8 h-8 rounded-full bg-blue-500 
                         text-white hover:bg-blue-600 
                         flex items-center justify-center">+</button>
    </div>
    ```

  - Descripción del producto:
    - Título: "Descripción" (text-lg font-semibold)
    - Texto: text-gray-600 leading-relaxed
    - Características en bullets con checkmarks azules

  - Botón principal "Agregar al carrito":
    ```jsx
    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 
               text-white font-bold py-4 rounded-full shadow-lg 
               hover:shadow-xl active:scale-95 transition-all
               disabled:opacity-50 disabled:cursor-not-allowed"
    ```

#### Carrito de Compras (Drawer/Modal)
- Animación: Slide desde la derecha
- Backdrop: bg-black/50
- Container:
  ```jsx
  className="fixed top-0 right-0 h-full w-full max-w-md 
             bg-white shadow-2xl z-50
             transform transition-transform duration-300"
  ```

- Header del carrito:
  - bg-gradient-to-r from-blue-500 to-blue-600
  - Texto blanco: "Mi Carrito ({items.length})"
  - Botón cerrar (X) en la esquina

- Lista de productos:
  - Cada item:
    ```jsx
    className="flex gap-3 p-4 border-b border-gray-100"
    
    // Imagen: w-20 h-20 rounded-lg object-cover
    // Info: flex-1
    // - Nombre: font-semibold text-sm
    // - Precio unitario: text-blue-600 font-bold
    // - Selector cantidad: igual que en detalle pero más pequeño
    // Botón eliminar: text-red-500 hover:text-red-700
    ```

- Footer del carrito (fixed bottom-0, bg-white, shadow-2xl, p-4):
  - Subtotal: flex justify-between, text-xl font-bold
  - Selector de modalidad de entrega:
    ```jsx
    // Radio buttons con estilo custom
    className="flex gap-2 mb-4"
    
    // Cada opción:
    <label className="flex-1 border-2 border-gray-200 rounded-xl p-3
                      hover:border-blue-500 cursor-pointer
                      has-[:checked]:border-blue-500 
                      has-[:checked]:bg-blue-50">
      <input type="radio" className="sr-only" />
      <div className="flex items-center gap-2">
        <Icon />
        <span className="font-semibold">Envío a domicilio</span>
      </div>
    </label>
    ```
  
  - Botón "Enviar pedido por WhatsApp":
    ```jsx
    className="w-full bg-green-500 text-white font-bold py-4 
               rounded-full shadow-lg hover:bg-green-600
               flex items-center justify-center gap-2
               active:scale-95 transition-all"
    // Incluir ícono de WhatsApp
    ```

#### Botón Flotante de WhatsApp
```jsx
className="fixed bottom-6 right-6 w-14 h-14 bg-green-500 
           rounded-full shadow-2xl flex items-center justify-center
           hover:bg-green-600 hover:scale-110 
           active:scale-95 transition-all z-40
           animate-bounce" // Solo en primera visita
```

#### Panel de Administración
- Layout: Sidebar izquierdo + contenido principal
- Sidebar:
  - bg-gray-900 text-white
  - Menú vertical con íconos
  - Items: Dashboard, Productos, Categorías, Configuración
  - Item activo: bg-blue-600 rounded-lg

- Tabla de productos:
  - bg-white rounded-xl shadow-md
  - Header: bg-gray-50 font-semibold
  - Filas: hover:bg-gray-50 transition
  - Columnas: Imagen (thumbnail pequeño), Nombre, Categoría, Precio, Stock, Acciones
  - Botones de acción: Íconos de editar (azul) y eliminar (rojo)

- Formulario de producto:
  - Card: bg-white rounded-xl shadow-lg p-6
  - Inputs: 
    ```jsx
    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3
               focus:border-blue-500 focus:ring-2 focus:ring-blue-200
               outline-none transition"
    ```
  - Upload de imagen: Drag & drop zone con preview
  - Botones: Igual estilo que el frontend

### 3.3 Tipografía
```css
/* Importar en index.css */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

/* Aplicar en tailwind.config.js */
fontFamily: {
  sans: ['Inter', 'system-ui', 'sans-serif'],
}
```

- Títulos principales: font-bold text-2xl lg:text-3xl
- Subtítulos: font-semibold text-lg
- Cuerpo: font-normal text-base
- Pequeño: text-sm
- Precios: font-bold text-xl text-blue-600

### 3.4 Espaciado y Layout
- Padding de secciones: px-4 py-6
- Gap entre productos: gap-3
- Máximo ancho del container: max-w-7xl mx-auto
- Border radius estándar: rounded-xl (12px)
- Border radius botones: rounded-full
- Shadow cards: shadow-md hover:shadow-xl

### 3.5 Animaciones y Transiciones
```jsx
// Todas las transiciones:
transition-all duration-300 ease-in-out

// Hover en cards:
hover:shadow-xl hover:-translate-y-1

// Active en botones:
active:scale-95

// Loading skeleton:
animate-pulse bg-gray-200
```

---

## 4. Requerimientos Funcionales del Frontend

### A. Catálogo y Navegación
* **Interfaz de Usuario (UI)**: Exactamente como las imágenes de referencia
* **Buscador en Vivo**: 
  - Input en el header con ícono de lupa
  - Filtrado en tiempo real mientras el usuario escribe
  - Highlight del texto coincidente
  - Mensaje "No se encontraron productos" si no hay resultados
  
* **Menú de Categorías**: 
  - Barra horizontal con scroll horizontal
  - Botones tipo pill (redondeados)
  - Categoría activa con bg azul
  - Smooth scroll al hacer clic
  
* **Vista de Detalle**: 
  - Se abre en nueva ruta `/producto/:id`
  - Imagen grande con zoom al hacer click
  - Selector de cantidad con validación de stock
  - Indicador visual de stock
  - Descripción completa con bullets
  - Botón CTA prominente

### B. Gestión de Inventario y Carrito
* **Lógica de "Agotado"**: 
  - Productos con stock 0 permanecen visibles
  - Overlay semitransparente negro con texto "AGOTADO"
  - Botón "Agregar al carrito" deshabilitado y con opacidad reducida
  - Tooltip al hover: "Producto sin stock disponible"

* **Carrito de Compras**: 
  - Persistente con `localStorage` (key: `ecommerce_cart`)
  - Drawer que se desliza desde la derecha
  - Sincronización automática al añadir/eliminar
  - Validación de stock en tiempo real
  - Actualización del badge del ícono del carrito

* **Funcionalidades del carrito**:
  - Añadir producto (validando stock)
  - Incrementar cantidad (máximo = stock disponible)
  - Decrementar cantidad (mínimo = 1)
  - Eliminar producto
  - Vaciar carrito completo
  - Calcular subtotal automáticamente

### C. Conversión a WhatsApp
* **Botón Flotante**: 
  - Visible en todas las páginas excepto admin
  - Posición: bottom-6 right-6
  - Animación de bounce en primera visita
  - Contador de items en badge si hay productos en carrito

* **Generador de Pedido**: 
  - Modal de confirmación antes de enviar
  - Selector obligatorio de modalidad de entrega
  - Generación de mensaje estructurado
  - Validación: No permitir envío con carrito vacío

* **Formato del Mensaje**:
```
🛒 *Nuevo Pedido - [Nombre de la Tienda]*

📦 *Productos:*
- 2x Zapatilla Nike Air Max - $45.000
- 1x Remera Adidas Original - $12.000
- 1x Medias Puma Pack x3 - $8.500

💰 *Subtotal: $102.500*

🚚 *Modalidad de Entrega:* Envío a domicilio

_Mensaje enviado desde el catálogo web_
```

* **URL de WhatsApp**:
```javascript
const whatsappNumber = '5491234567890'; // Sin + ni espacios
const message = encodeURIComponent(mensajeFormateado);
const url = `https://wa.me/${whatsappNumber}?text=${message}`;
window.open(url, '_blank');
```

---

## 5. Requerimientos Funcionales del Backend

### A. Panel de Administración (Ruta `/admin`)

#### Autenticación
```javascript
// Credenciales guardadas en .env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=hashed_bcrypt_password

// Login simple con JWT
// Token guardado en localStorage
// Middleware de verificación en cada ruta protegida
```

#### Gestión de Productos
- **CRUD completo**: Crear, Leer, Actualizar, Eliminar
- **Formulario de producto**:
  - Nombre (requerido, max 100 caracteres)
  - Descripción (textarea, max 500 caracteres)
  - Precio (number, min 0)
  - Stock (number, min 0)
  - Categoría (select con opciones de BD)
  - Imagen (upload a Cloudinary)

#### Integración con Cloudinary
```javascript
// En el panel admin:
import { Cloudinary } from '@cloudinary/react';

// Configuración:
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Widget de upload:
// - Drag & drop
// - Preview de imagen antes de subir
// - Compresión automática
// - Transformaciones: f_auto, q_auto, w_800
// - Guardar URL en base de datos
```

#### Control de Stock
- Toggle rápido "En stock / Agotado"
- Input numérico para actualizar cantidad exacta
- Historial de cambios de stock (opcional)
- Alerta cuando stock < 5 unidades

### B. Base de Datos MySQL

#### Esquema de Tablas

**Tabla: categorias**
```sql
CREATE TABLE categorias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE,
  slug VARCHAR(50) NOT NULL UNIQUE,
  icono VARCHAR(100), -- URL del ícono (opcional)
  orden INT DEFAULT 0, -- Para ordenar en el frontend
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Tabla: productos**
```sql
CREATE TABLE productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL,
  precio_descuento DECIMAL(10,2), -- NULL si no hay descuento
  imagen_url VARCHAR(500) NOT NULL,
  stock INT DEFAULT 0,
  id_categoria INT NOT NULL,
  destacado BOOLEAN DEFAULT FALSE, -- Para banner hero
  activo BOOLEAN DEFAULT TRUE, -- Para ocultar sin eliminar
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (id_categoria) REFERENCES categorias(id) ON DELETE RESTRICT,
  INDEX idx_categoria (id_categoria),
  INDEX idx_stock (stock),
  INDEX idx_destacado (destacado)
);
```

**Tabla: admin_users (opcional pero recomendado)**
```sql
CREATE TABLE admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(100),
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Datos de Ejemplo
```sql
-- Categorías iniciales
INSERT INTO categorias (nombre, slug, orden) VALUES
('Zapatillas', 'zapatillas', 1),
('Remeras', 'remeras', 2),
('Pantalones', 'pantalones', 3),
('Accesorios', 'accesorios', 4);

-- Producto de ejemplo
INSERT INTO productos (nombre, descripcion, precio, imagen_url, stock, id_categoria, destacado) VALUES
('Nike Air Max 270', 'Zapatillas deportivas con tecnología Air visible. Comodidad y estilo en cada paso.', 89999.99, 'https://res.cloudinary.com/tu-cloud/image/upload/v1/productos/nike-air-max.jpg', 15, 1, TRUE);
```

---

## 6. Estructura de Carpetas Obligatoria

```
/ecommerce-catalogo
│
├── /frontend (React + Vite)
│   ├── /public
│   │   ├── favicon.ico
│   │   └── logo.png
│   │
│   ├── /src
│   │   ├── /assets
│   │   │   └── /icons
│   │   │
│   │   ├── /components
│   │   │   ├── /common
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── Badge.jsx
│   │   │   │   └── Spinner.jsx
│   │   │   │
│   │   │   ├── /layout
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   └── MobileNav.jsx
│   │   │   │
│   │   │   ├── /product
│   │   │   │   ├── ProductCard.jsx
│   │   │   │   ├── ProductGrid.jsx
│   │   │   │   ├── ProductDetail.jsx
│   │   │   │   ├── ProductSkeleton.jsx
│   │   │   │   └── CategoryPills.jsx
│   │   │   │
│   │   │   ├── /cart
│   │   │   │   ├── CartDrawer.jsx
│   │   │   │   ├── CartItem.jsx
│   │   │   │   ├── CartSummary.jsx
│   │   │   │   └── DeliverySelector.jsx
│   │   │   │
│   │   │   ├── /admin
│   │   │   │   ├── AdminLayout.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── ProductTable.jsx
│   │   │   │   ├── ProductForm.jsx
│   │   │   │   ├── ImageUploader.jsx
│   │   │   │   └── StockManager.jsx
│   │   │   │
│   │   │   └── /ui
│   │   │       ├── Modal.jsx
│   │   │       ├── Toast.jsx
│   │   │       └── Drawer.jsx
│   │   │
│   │   ├── /hooks
│   │   │   ├── useCart.js
│   │   │   ├── useProducts.js
│   │   │   ├── useSearch.js
│   │   │   ├── useAuth.js
│   │   │   └── useLocalStorage.js
│   │   │
│   │   ├── /context
│   │   │   ├── CartContext.jsx
│   │   │   ├── AuthContext.jsx
│   │   │   └── ProductContext.jsx
│   │   │
│   │   ├── /services
│   │   │   ├── api.js           # Axios instance configurada
│   │   │   ├── productService.js
│   │   │   ├── categoryService.js
│   │   │   ├── authService.js
│   │   │   ├── cloudinaryService.js
│   │   │   └── whatsappService.js
│   │   │
│   │   ├── /utils
│   │   │   ├── formatters.js    # formatPrice, formatDate
│   │   │   ├── validators.js    # validaciones de forms
│   │   │   ├── constants.js     # WHATSAPP_NUMBER, API_URL
│   │   │   └── helpers.js       # funciones auxiliares
│   │   │
│   │   ├── /pages
│   │   │   ├── Home.jsx
│   │   │   ├── ProductDetailPage.jsx
│   │   │   ├── CategoryPage.jsx
│   │   │   ├── AdminLogin.jsx
│   │   │   └── AdminDashboard.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── .env
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── README.md
│
├── /backend (Node.js + Express)
│   ├── /config
│   │   ├── database.js          # Conexión MySQL
│   │   └── cloudinary.js        # Config Cloudinary
│   │
│   ├── /controllers
│   │   ├── productController.js
│   │   ├── categoryController.js
│   │   ├── authController.js
│   │   └── uploadController.js
│   │
│   ├── /models
│   │   ├── Product.js
│   │   ├── Category.js
│   │   └── AdminUser.js
│   │
│   ├── /routes
│   │   ├── productRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── authRoutes.js
│   │   └── uploadRoutes.js
│   │
│   ├── /middleware
│   │   ├── authMiddleware.js    # Verificar JWT
│   │   ├── errorHandler.js      # Manejo global de errores
│   │   └── validateRequest.js   # Validación de inputs
│   │
│   ├── /utils
│   │   ├── logger.js
│   │   └── responseFormatter.js
│   │
│   ├── .env
│   ├── .gitignore
│   ├── server.js
│   ├── package.json
│   └── README.md
│
└── /database
    ├── schema.sql               # Script de creación de tablas
    ├── seed.sql                 # Datos de ejemplo
    └── README.md
```

---

## 7. Convenciones de Código ESTRICTAS

### Nomenclatura
- **Componentes React**: PascalCase (ej. `ProductCard.jsx`, `CartDrawer.jsx`)
- **Funciones y variables**: camelCase (ej. `handleAddToCart`, `totalPrice`)
- **Constantes**: UPPER_SNAKE_CASE (ej. `WHATSAPP_NUMBER`, `API_BASE_URL`)
- **Archivos de utilidad**: camelCase (ej. `formatters.js`, `validators.js`)
- **Rutas API**: snake_case (ej. `/api/productos`, `/api/categorias`)
- **Estilos Tailwind**: NUNCA usar inline styles, SIEMPRE className

### Reglas de Código React
```javascript
// ✅ CORRECTO
const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  
  const handleClick = () => {
    if (product.stock > 0) {
      addToCart(product);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md">
      {/* contenido */}
    </div>
  );
};

// ❌ INCORRECTO
const productCard = (props) => {  // Nombre incorrecto
  return (
    <div style={{background: 'white'}}>  {/* No usar inline styles */}
      {/* contenido */}
    </div>
  );
};
```

### Gestión de Estado
```javascript
// SIEMPRE usar Context API para estado global
// CartContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    // Cargar desde localStorage al iniciar
    const savedCart = localStorage.getItem('ecommerce_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Sincronizar con localStorage en cada cambio
  useEffect(() => {
    localStorage.setItem('ecommerce_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      
      if (existingItem) {
        // Validar stock antes de incrementar
        if (existingItem.quantity + quantity > product.stock) {
          alert('No hay suficiente stock disponible');
          return prevCart;
        }
        
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [...prevCart, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const price = item.precio_descuento || item.precio;
      return total + (price * item.quantity);
    }, 0);
  };

  const getItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalPrice,
      getItemCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider');
  }
  return context;
};
```

### Validaciones Obligatorias
```javascript
// SIEMPRE validar antes de añadir al carrito
const handleAddToCart = (product) => {
  // 1. Verificar stock disponible
  if (product.stock === 0) {
    toast.error('Producto sin stock disponible');
    return;
  }

  // 2. Verificar cantidad vs stock
  const currentInCart = cart.find(item => item.id === product.id);
  const currentQty = currentInCart ? currentInCart.quantity : 0;
  
  if (currentQty + quantity > product.stock) {
    toast.error(`Solo quedan ${product.stock - currentQty} unidades disponibles`);
    return;
  }

  // 3. Añadir al carrito
  addToCart(product, quantity);
  toast.success('Producto añadido al carrito');
};

// SIEMPRE validar inputs de formularios
const validateProductForm = (formData) => {
  const errors = {};

  if (!formData.nombre || formData.nombre.trim().length < 3) {
    errors.nombre = 'El nombre debe tener al menos 3 caracteres';
  }

  if (!formData.precio || formData.precio <= 0) {
    errors.precio = 'El precio debe ser mayor a 0';
  }

  if (!formData.stock || formData.stock < 0) {
    errors.stock = 'El stock no puede ser negativo';
  }

  if (!formData.id_categoria) {
    errors.categoria = 'Debe seleccionar una categoría';
  }

  if (!formData.imagen_url) {
    errors.imagen = 'Debe subir una imagen del producto';
  }

  return errors;
};
```

### Manejo de Errores OBLIGATORIO
```javascript
// Frontend - Servicios API
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para añadir token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      // Error del servidor
      const message = error.response.data.message || 'Error en el servidor';
      toast.error(message);
    } else if (error.request) {
      // No hubo respuesta
      toast.error('No se pudo conectar con el servidor');
    } else {
      // Error de configuración
      toast.error('Error al procesar la solicitud');
    }
    return Promise.reject(error);
  }
);

export default api;

// Backend - Middleware de errores
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Error de validación de Joi/Express-validator
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Datos de entrada inválidos',
      errors: err.details
    });
  }

  // Error de MySQL
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      success: false,
      message: 'El registro ya existe'
    });
  }

  // Error de JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }

  // Error genérico
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor'
  });
};

module.exports = errorHandler;
```

---

## 8. Formato Exacto del Mensaje de WhatsApp

```javascript
// whatsappService.js
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER;
const STORE_NAME = import.meta.env.VITE_STORE_NAME || 'Nuestra Tienda';

export const generateWhatsAppMessage = (cart, deliveryOption) => {
  // Header
  let message = `🛒 *Nuevo Pedido - ${STORE_NAME}*\n\n`;
  
  // Lista de productos
  message += `📦 *Productos:*\n`;
  cart.forEach(item => {
    const price = item.precio_descuento || item.precio;
    message += `- ${item.quantity}x ${item.nombre} - $${formatPrice(price * item.quantity)}\n`;
  });
  
  // Total
  const total = cart.reduce((sum, item) => {
    const price = item.precio_descuento || item.precio;
    return sum + (price * item.quantity);
  }, 0);
  message += `\n💰 *Total: $${formatPrice(total)}*\n\n`;
  
  // Modalidad de entrega
  const deliveryText = deliveryOption === 'envio' 
    ? '🚚 *Modalidad de Entrega:* Envío a domicilio' 
    : '🏪 *Modalidad de Entrega:* Retiro en tienda';
  message += deliveryText + '\n\n';
  
  // Footer
  message += '_Mensaje enviado desde el catálogo web_';
  
  return message;
};

export const sendToWhatsApp = (cart, deliveryOption) => {
  if (cart.length === 0) {
    alert('El carrito está vacío');
    return;
  }

  if (!deliveryOption) {
    alert('Por favor selecciona una modalidad de entrega');
    return;
  }

  const message = generateWhatsAppMessage(cart, deliveryOption);
  const encodedMessage = encodeURIComponent(message);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
  
  window.open(url, '_blank');
};

// Función auxiliar
const formatPrice = (price) => {
  return new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
};
```

---

## 9. Configuración de Variables de Entorno

### Frontend (.env)
```bash
VITE_API_URL=http://localhost:5000/api
VITE_WHATSAPP_NUMBER=5491234567890
VITE_STORE_NAME=Mi Tienda
VITE_CLOUDINARY_CLOUD_NAME=tu_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=tu_upload_preset
```

### Backend (.env)
```bash
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=ecommerce_db

# JWT
JWT_SECRET=tu_super_secreto_aqui
JWT_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Admin (credenciales iniciales)
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=$2b$10$hashedPasswordAqui

# CORS
CORS_ORIGIN=http://localhost:5173
```

---

## 10. Checklist de Testing Obligatorio

### Antes de Cada Commit
- [ ] ✅ No hay errores en la consola del navegador
- [ ] ✅ No hay warnings de React en desarrollo
- [ ] ✅ El carrito persiste correctamente al recargar la página
- [ ] ✅ La búsqueda filtra en tiempo real sin errores
- [ ] ✅ Los productos sin stock muestran el overlay "AGOTADO"
- [ ] ✅ No se puede añadir al carrito un producto agotado
- [ ] ✅ No se puede añadir más cantidad que el stock disponible
- [ ] ✅ El mensaje de WhatsApp se genera correctamente
- [ ] ✅ Las imágenes cargan desde Cloudinary
- [ ] ✅ El panel admin requiere autenticación
- [ ] ✅ El diseño es responsive (mobile-first)

### Casos de Uso Críticos
1. **Usuario busca un producto**:
   - Escribe "zapatilla" en el buscador
   - Debe filtrar instantáneamente
   - Debe mostrar "No se encontraron productos" si no hay coincidencias

2. **Usuario añade productos al carrito**:
   - Añade 2 unidades de un producto con stock de 5
   - Intenta añadir 4 unidades más → Debe mostrar error de stock insuficiente
   - Cambia cantidad a 3, elimina una
   - Recarga la página → Carrito debe persistir

3. **Usuario envía pedido por WhatsApp**:
   - Tiene 3 productos diferentes en el carrito
   - Selecciona "Envío a domicilio"
   - Click en botón de WhatsApp
   - Debe abrir WhatsApp con mensaje formateado correctamente

4. **Admin gestiona productos**:
   - Login con credenciales
   - Crea un nuevo producto con imagen
   - Imagen debe subirse a Cloudinary
   - Producto debe aparecer en catálogo inmediatamente
   - Cambia stock a 0 → Producto debe mostrar "AGOTADO" en frontend

5. **Manejo de errores**:
   - Desconectar internet → Debe mostrar mensaje de error
   - Intentar acceso a /admin sin token → Redireccionar a login
   - Subir imagen > 10MB → Debe mostrar error

---

## 11. Próximos Hitos de Desarrollo (Orden Estricto)

### Hito 1: Setup Inicial (Día 1)
- [ ] Crear estructura de carpetas completa
- [ ] Inicializar proyecto Vite + React
- [ ] Configurar Tailwind CSS con tema personalizado
- [ ] Crear layout base (Header, Footer, Container)
- [ ] Configurar variables de entorno
- [ ] Setup de Git y .gitignore

### Hito 2: Componentes UI Base (Día 1-2)
- [ ] Crear componentes common (Button, Input, Card, Badge)
- [ ] Implementar Header con buscador
- [ ] Implementar CategoryPills
- [ ] Crear ProductCard con diseño exacto de referencia
- [ ] Crear ProductGrid responsive
- [ ] Testing visual en mobile

### Hito 3: Catálogo con Datos Mock (Día 2-3)
- [ ] Crear array de productos mock
- [ ] Implementar buscador en vivo funcional
- [ ] Implementar filtrado por categoría
- [ ] Crear página de detalle del producto
- [ ] Implementar modal/página de detalle
- [ ] Testing de navegación

### Hito 4: Carrito de Compras (Día 3-4)
- [ ] Crear CartContext con todas las funciones
- [ ] Implementar CartDrawer con animación
- [ ] Crear CartItem component
- [ ] Implementar persistencia con localStorage
- [ ] Añadir validaciones de stock
- [ ] Testing exhaustivo del flujo de carrito

### Hito 5: Integración WhatsApp (Día 4)
- [ ] Crear whatsappService.js
- [ ] Implementar generador de mensaje
- [ ] Crear DeliverySelector component
- [ ] Añadir botón flotante de WhatsApp
- [ ] Testing de envío de mensajes

### Hito 6: Backend - Setup (Día 5)
- [ ] Inicializar proyecto Node + Express
- [ ] Configurar conexión a MySQL
- [ ] Crear esquema de base de datos
- [ ] Crear modelos (Product, Category)
- [ ] Configurar CORS y middleware
- [ ] Testing de conexión

### Hito 7: Backend - API REST (Día 5-6)
- [ ] Crear rutas de productos (GET, POST, PUT, DELETE)
- [ ] Crear rutas de categorías
- [ ] Implementar validaciones con express-validator
- [ ] Crear middleware de manejo de errores
- [ ] Testing de endpoints con Postman/Thunder Client

### Hito 8: Integración Frontend-Backend (Día 6-7)
- [ ] Conectar servicios del frontend con API
- [ ] Reemplazar datos mock por llamadas a API
- [ ] Implementar estados de carga (skeletons)
- [ ] Implementar manejo de errores con toast
- [ ] Testing de integración completa

### Hito 9: Panel de Administración (Día 7-8)
- [ ] Crear sistema de autenticación (JWT)
- [ ] Crear página de login
- [ ] Implementar AdminLayout con sidebar
- [ ] Crear tabla de productos
- [ ] Crear formulario de productos
- [ ] Testing de CRUD completo

### Hito 10: Integración Cloudinary (Día 8-9)
- [ ] Configurar cuenta de Cloudinary
- [ ] Crear upload preset
- [ ] Implementar ImageUploader component
- [ ] Integrar en formulario de productos
- [ ] Testing de subida de imágenes

### Hito 11: Pulido y Optimización (Día 9-10)
- [ ] Optimizar imágenes (lazy loading)
- [ ] Añadir animaciones y transiciones
- [ ] Implementar skeleton loaders
- [ ] Optimizar rendimiento (React.memo, useMemo)
- [ ] Testing de performance
- [ ] Corregir bugs encontrados

### Hito 12: Deploy (Día 10)
- [ ] Preparar build de producción del frontend
- [ ] Deploy del frontend (Vercel/Netlify)
- [ ] Deploy del backend (Railway/Render)
- [ ] Deploy de base de datos (PlanetScale/Railway)
- [ ] Configurar variables de entorno en producción
- [ ] Testing end-to-end en producción

---

## 12. Notas Importantes para el Agente de IA

### NUNCA hacer:
❌ Usar CSS inline (style={{}}), SIEMPRE usar Tailwind
❌ Crear componentes sin validación de props
❌ Hacer fetch sin try-catch
❌ Guardar datos sensibles en localStorage (solo carrito)
❌ Olvidar validar stock antes de añadir al carrito
❌ Usar `var`, SIEMPRE `const` o `let`
❌ Dejar console.log en código de producción
❌ Hardcodear URLs o números de teléfono

### SIEMPRE hacer:
✅ Usar Tailwind CSS para todos los estilos
✅ Validar todos los inputs de usuario
✅ Manejar estados de carga con skeletons
✅ Mostrar mensajes de error claros al usuario
✅ Usar PropTypes o TypeScript para validar props
✅ Comentar lógica compleja
✅ Seguir la estructura de carpetas definida
✅ Usar Context API para estado global
✅ Hacer código reutilizable y modular

### Prioridades:
1. **Mobile-First**: Diseñar primero para mobile, luego adaptar a desktop
2. **Performance**: Optimizar imágenes, lazy loading, code splitting
3. **UX**: Feedback inmediato al usuario (toasts, loaders, animaciones)
4. **Seguridad**: Validar en frontend Y backend, proteger rutas admin
5. **Mantenibilidad**: Código limpio, componentes pequeños, bien documentado

---

## 13. Recursos y Referencias

### Documentación Oficial
- React: https://react.dev
- Tailwind CSS: https://tailwindcss.com/docs
- Vite: https://vitejs.dev
- Express: https://expressjs.com
- MySQL: https://dev.mysql.com/doc/
- Cloudinary: https://cloudinary.com/documentation

### Librerías Recomendadas
```json
// Frontend package.json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "axios": "^1.6.0",
    "react-hot-toast": "^2.4.1",
    "lucide-react": "^0.294.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.3.6",
    "vite": "^5.0.0"
  }
}

// Backend package.json
{
  "dependencies": {
    "express": "^4.18.2",
    "mysql2": "^3.6.5",
    "dotenv": "^16.3.1",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "cors": "^2.8.5",
    "express-validator": "^7.0.1",
    "cloudinary": "^1.41.0",
    "multer": "^1.4.5-lts.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
```

---

## 14. Reglas Técnicas del Frontend (React + Vite + Tailwind)

### 14.1 Configuración de Vite

**vite.config.js**
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@services': path.resolve(__dirname, './src/services'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@context': path.resolve(__dirname, './src/context'),
      '@assets': path.resolve(__dirname, './src/assets'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          utils: ['axios'],
        },
      },
    },
  },
})
```

### 14.2 Configuración de Tailwind CSS

**tailwind.config.js**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E3F2FD',
          100: '#BBDEFB',
          200: '#90CAF9',
          300: '#64B5F6',
          400: '#42A5F5',
          500: '#0D6EFD', // Color principal
          600: '#0B5ED7',
          700: '#0A58CA',
          800: '#084298',
          900: '#052C65',
        },
        secondary: {
          500: '#4A90E2',
        },
        success: {
          500: '#28A745',
          600: '#218838',
        },
        danger: {
          500: '#DC3545',
          600: '#C82333',
        },
        warning: {
          500: '#FFC107',
          600: '#E0A800',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 4px 16px rgba(0, 0, 0, 0.15)',
        'drawer': '-4px 0 24px rgba(0, 0, 0, 0.2)',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      transitionDuration: {
        '400': '400ms',
      },
      animation: {
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-out-right': 'slideOutRight 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
        'bounce-soft': 'bounceSoft 2s infinite',
      },
      keyframes: {
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideOutRight: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
```

**index.css**
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    @apply box-border;
  }
  
  body {
    @apply font-sans bg-gray-50 text-gray-900 antialiased;
  }

  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type="number"] {
    -moz-appearance: textfield;
  }
}

@layer components {
  .btn-primary {
    @apply bg-primary-500 text-white font-semibold py-3 px-6 rounded-full 
           hover:bg-primary-600 active:scale-95 transition-all duration-200
           disabled:opacity-50 disabled:cursor-not-allowed;
  }

  .btn-secondary {
    @apply bg-white text-primary-500 font-semibold py-3 px-6 rounded-full 
           border-2 border-primary-500 hover:bg-primary-50 
           active:scale-95 transition-all duration-200;
  }

  .input-field {
    @apply w-full border-2 border-gray-200 rounded-lg px-4 py-3
           focus:border-primary-500 focus:ring-2 focus:ring-primary-200
           outline-none transition-all duration-200
           placeholder:text-gray-400;
  }

  .card {
    @apply bg-white rounded-2xl shadow-card hover:shadow-card-hover
           transition-shadow duration-300;
  }

  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
```

### 14.3 Reglas de Componentes React

#### REGLA 1: Estructura de Componentes
```javascript
// ✅ CORRECTO - Componente bien estructurado
import React from 'react';
import PropTypes from 'prop-types';

const ProductCard = ({ product, onAddToCart }) => {
  // 1. Hooks primero
  const [isLoading, setIsLoading] = React.useState(false);
  
  // 2. Funciones de manejo
  const handleAddToCart = async () => {
    if (product.stock === 0) return;
    
    setIsLoading(true);
    try {
      await onAddToCart(product);
    } catch (error) {
      console.error('Error al añadir al carrito:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Renderizado condicional
  if (!product) return null;

  const isOutOfStock = product.stock === 0;
  const hasDiscount = product.precio_descuento && product.precio_descuento < product.precio;

  // 4. JSX
  return (
    <div className="card relative">
      {/* Contenido */}
    </div>
  );
};

// 5. PropTypes OBLIGATORIO
ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    nombre: PropTypes.string.isRequired,
    precio: PropTypes.number.isRequired,
    precio_descuento: PropTypes.number,
    imagen_url: PropTypes.string.isRequired,
    stock: PropTypes.number.isRequired,
  }).isRequired,
  onAddToCart: PropTypes.func.isRequired,
};

export default ProductCard;
```

#### REGLA 2: Hooks Personalizados
```javascript
// useProducts.js - Custom Hook CORRECTO
import { useState, useEffect } from 'react';
import { getProducts } from '@services/productService';

export const useProducts = (categoryId = null) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true; // Prevenir memory leaks

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await getProducts(categoryId);
        
        if (isMounted) {
          setProducts(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false; // Cleanup
    };
  }, [categoryId]);

  return { products, loading, error };
};
```

#### REGLA 3: Manejo de Imágenes
```javascript
// ImageWithFallback.jsx - Componente de imagen con fallback
import React, { useState } from 'react';
import PropTypes from 'prop-types';

const ImageWithFallback = ({ 
  src, 
  alt, 
  fallbackSrc = '/placeholder.png',
  className = '',
  ...props 
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setImgSrc(fallbackSrc);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />
      )}
      <img
        src={imgSrc}
        alt={alt}
        onError={handleError}
        onLoad={handleLoad}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity`}
        loading="lazy"
        {...props}
      />
    </div>
  );
};

ImageWithFallback.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  fallbackSrc: PropTypes.string,
  className: PropTypes.string,
};

export default ImageWithFallback;
```

#### REGLA 4: Optimización de Re-renders
```javascript
// ProductList.jsx - Uso de React.memo y useMemo
import React, { useMemo } from 'react';
import ProductCard from './ProductCard';

const ProductList = ({ products, searchTerm, categoryId }) => {
  // useMemo para cálculos costosos
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.nombre
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      
      const matchesCategory = categoryId 
        ? product.id_categoria === categoryId 
        : true;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, categoryId]);

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No se encontraron productos</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 px-4 py-4">
      {filteredProducts.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

// React.memo para evitar re-renders innecesarios
export default React.memo(ProductList);
```

### 14.4 Servicios API (Axios)

**api.js - Configuración Base**
```javascript
import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    // Añadir token si existe
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log en desarrollo
    if (import.meta.env.DEV) {
      console.log(`🚀 [${config.method.toUpperCase()}] ${config.url}`, config.data);
    }

    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    // Log en desarrollo
    if (import.meta.env.DEV) {
      console.log(`✅ Response:`, response.data);
    }
    return response.data;
  },
  (error) => {
    // Manejo de errores centralizado
    let message = 'Error al procesar la solicitud';

    if (error.response) {
      // Error del servidor (4xx, 5xx)
      const { status, data } = error.response;

      switch (status) {
        case 400:
          message = data.message || 'Datos inválidos';
          break;
        case 401:
          message = 'No autorizado. Por favor inicia sesión';
          localStorage.removeItem('admin_token');
          window.location.href = '/admin/login';
          break;
        case 403:
          message = 'No tienes permisos para realizar esta acción';
          break;
        case 404:
          message = data.message || 'Recurso no encontrado';
          break;
        case 409:
          message = data.message || 'El recurso ya existe';
          break;
        case 500:
          message = 'Error interno del servidor';
          break;
        default:
          message = data.message || 'Error desconocido';
      }
    } else if (error.request) {
      // No hubo respuesta del servidor
      message = 'No se pudo conectar con el servidor. Verifica tu conexión';
    } else {
      // Error de configuración
      message = error.message;
    }

    toast.error(message);
    console.error('❌ API Error:', error);

    return Promise.reject(error);
  }
);

export default api;
```

**productService.js - Servicio de Productos**
```javascript
import api from './api';

export const productService = {
  // Obtener todos los productos
  getAll: async (params = {}) => {
    try {
      const { data } = await api.get('/productos', { params });
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener un producto por ID
  getById: async (id) => {
    try {
      const { data } = await api.get(`/productos/${id}`);
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Crear producto (admin)
  create: async (productData) => {
    try {
      const { data } = await api.post('/productos', productData);
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar producto (admin)
  update: async (id, productData) => {
    try {
      const { data } = await api.put(`/productos/${id}`, productData);
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Eliminar producto (admin)
  delete: async (id) => {
    try {
      const { data } = await api.delete(`/productos/${id}`);
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar solo el stock
  updateStock: async (id, stock) => {
    try {
      const { data } = await api.patch(`/productos/${id}/stock`, { stock });
      return data;
    } catch (error) {
      throw error;
    }
  },
};
```

---

## 15. Reglas Técnicas del Backend (Node.js + Express + MySQL)

### 15.1 Estructura del Servidor

**server.js - Configuración Principal**
```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Importar rutas
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const authRoutes = require('./routes/authRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// Middleware de errores
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// MIDDLEWARES GLOBALES
// ============================================

// Seguridad
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logger (solo en desarrollo)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting (protección contra ataques)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de 100 requests por IP
  message: 'Demasiadas solicitudes desde esta IP, intenta de nuevo más tarde',
});
app.use('/api/', limiter);

// ============================================
// RUTAS
// ============================================

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use('/api/productos', productRoutes);
app.use('/api/categorias', categoryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);

// ============================================
// MANEJO DE ERRORES
// ============================================

// Ruta no encontrada (debe ir antes del errorHandler)
app.use(notFound);

// Error handler global (debe ir al final)
app.use(errorHandler);

// ============================================
// INICIAR SERVIDOR
// ============================================

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
});

// Manejo de errores no capturados
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

module.exports = app;
```

### 15.2 Configuración de Base de Datos

**config/database.js**
```javascript
const mysql = require('mysql2');

// Crear pool de conexiones (mejor que conexiones individuales)
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ecommerce_db',
  waitForConnections: true,
  connectionLimit: 10, // máximo 10 conexiones simultáneas
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

// Convertir a Promises para usar async/await
const promisePool = pool.promise();

// Test de conexión
promisePool.query('SELECT 1')
  .then(() => {
    console.log('✅ Conectado a MySQL exitosamente');
  })
  .catch((err) => {
    console.error('❌ Error al conectar a MySQL:', err.message);
    process.exit(1);
  });

// Manejo de eventos del pool
pool.on('connection', (connection) => {
  console.log('🔌 Nueva conexión establecida:', connection.threadId);
});

pool.on('error', (err) => {
  console.error('❌ Error del pool MySQL:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.error('Conexión a la base de datos perdida');
  }
});

module.exports = promisePool;
```

### 15.3 Modelos de Base de Datos

**models/Product.js**
```javascript
const db = require('../config/database');

class Product {
  // Obtener todos los productos
  static async findAll(filters = {}) {
    try {
      let query = `
        SELECT 
          p.*,
          c.nombre as categoria_nombre,
          c.slug as categoria_slug
        FROM productos p
        LEFT JOIN categorias c ON p.id_categoria = c.id
        WHERE p.activo = 1
      `;
      const params = [];

      // Filtro por categoría
      if (filters.categoryId) {
        query += ' AND p.id_categoria = ?';
        params.push(filters.categoryId);
      }

      // Filtro por búsqueda
      if (filters.search) {
        query += ' AND p.nombre LIKE ?';
        params.push(`%${filters.search}%`);
      }

      // Ordenamiento
      query += ' ORDER BY p.destacado DESC, p.created_at DESC';

      const [rows] = await db.query(query, params);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Obtener producto por ID
  static async findById(id) {
    try {
      const query = `
        SELECT 
          p.*,
          c.nombre as categoria_nombre,
          c.slug as categoria_slug
        FROM productos p
        LEFT JOIN categorias c ON p.id_categoria = c.id
        WHERE p.id = ? AND p.activo = 1
      `;
      
      const [rows] = await db.query(query, [id]);
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Crear producto
  static async create(productData) {
    try {
      const query = `
        INSERT INTO productos (
          nombre, descripcion, precio, precio_descuento,
          imagen_url, stock, id_categoria, destacado
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        productData.nombre,
        productData.descripcion,
        productData.precio,
        productData.precio_descuento || null,
        productData.imagen_url,
        productData.stock || 0,
        productData.id_categoria,
        productData.destacado || false,
      ];

      const [result] = await db.query(query, values);
      return await this.findById(result.insertId);
    } catch (error) {
      throw error;
    }
  }

  // Actualizar producto
  static async update(id, productData) {
    try {
      const query = `
        UPDATE productos SET
          nombre = ?,
          descripcion = ?,
          precio = ?,
          precio_descuento = ?,
          imagen_url = ?,
          stock = ?,
          id_categoria = ?,
          destacado = ?
        WHERE id = ?
      `;

      const values = [
        productData.nombre,
        productData.descripcion,
        productData.precio,
        productData.precio_descuento || null,
        productData.imagen_url,
        productData.stock,
        productData.id_categoria,
        productData.destacado || false,
        id,
      ];

      await db.query(query, values);
      return await this.findById(id);
    } catch (error) {
      throw error;
    }
  }

  // Actualizar solo stock
  static async updateStock(id, stock) {
    try {
      const query = 'UPDATE productos SET stock = ? WHERE id = ?';
      await db.query(query, [stock, id]);
      return await this.findById(id);
    } catch (error) {
      throw error;
    }
  }

  // Soft delete (marcar como inactivo)
  static async delete(id) {
    try {
      const query = 'UPDATE productos SET activo = 0 WHERE id = ?';
      const [result] = await db.query(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Hard delete (eliminar físicamente) - SOLO PARA ADMIN
  static async hardDelete(id) {
    try {
      const query = 'DELETE FROM productos WHERE id = ?';
      const [result] = await db.query(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Verificar stock disponible
  static async checkStock(id, quantity) {
    try {
      const product = await this.findById(id);
      if (!product) return false;
      return product.stock >= quantity;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Product;
```

### 15.4 Controladores

**controllers/productController.js**
```javascript
const Product = require('../models/Product');
const { validationResult } = require('express-validator');

// @desc    Obtener todos los productos
// @route   GET /api/productos
// @access  Public
exports.getAllProducts = async (req, res, next) => {
  try {
    const { categoryId, search } = req.query;

    const products = await Product.findAll({
      categoryId,
      search,
    });

    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener producto por ID
// @route   GET /api/productos/:id
// @access  Public
exports.getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado',
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Crear producto
// @route   POST /api/productos
// @access  Private (Admin)
exports.createProduct = async (req, res, next) => {
  try {
    // Validar datos de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Errores de validación',
        errors: errors.array(),
      });
    }

    const productData = req.body;

    const newProduct = await Product.create(productData);

    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente',
      data: newProduct,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Actualizar producto
// @route   PUT /api/productos/:id
// @access  Private (Admin)
exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Validar datos de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Errores de validación',
        errors: errors.array(),
      });
    }

    // Verificar que el producto existe
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado',
      });
    }

    const updatedProduct = await Product.update(id, req.body);

    res.json({
      success: true,
      message: 'Producto actualizado exitosamente',
      data: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Actualizar stock de producto
// @route   PATCH /api/productos/:id/stock
// @access  Private (Admin)
exports.updateStock = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    if (typeof stock !== 'number' || stock < 0) {
      return res.status(400).json({
        success: false,
        message: 'El stock debe ser un número positivo',
      });
    }

    const updatedProduct = await Product.updateStock(id, stock);

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado',
      });
    }

    res.json({
      success: true,
      message: 'Stock actualizado exitosamente',
      data: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Eliminar producto
// @route   DELETE /api/productos/:id
// @access  Private (Admin)
exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleted = await Product.delete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado',
      });
    }

    res.json({
      success: true,
      message: 'Producto eliminado exitosamente',
    });
  } catch (error) {
    next(error);
  }
};
```

### 15.5 Validaciones

**middleware/validators/productValidator.js**
```javascript
const { body } = require('express-validator');

exports.productValidation = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 3, max: 100 }).withMessage('El nombre debe tener entre 3 y 100 caracteres'),

  body('descripcion')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('La descripción no puede superar los 500 caracteres'),

  body('precio')
    .notEmpty().withMessage('El precio es obligatorio')
    .isFloat({ min: 0.01 }).withMessage('El precio debe ser mayor a 0'),

  body('precio_descuento')
    .optional()
    .isFloat({ min: 0 }).withMessage('El precio de descuento debe ser positivo')
    .custom((value, { req }) => {
      if (value && value >= req.body.precio) {
        throw new Error('El precio de descuento debe ser menor al precio original');
      }
      return true;
    }),

  body('imagen_url')
    .notEmpty().withMessage('La imagen es obligatoria')
    .isURL().withMessage('Debe ser una URL válida'),

  body('stock')
    .notEmpty().withMessage('El stock es obligatorio')
    .isInt({ min: 0 }).withMessage('El stock debe ser un número entero positivo'),

  body('id_categoria')
    .notEmpty().withMessage('La categoría es obligatoria')
    .isInt({ min: 1 }).withMessage('Debe seleccionar una categoría válida'),

  body('destacado')
    .optional()
    .isBoolean().withMessage('Destacado debe ser verdadero o falso'),
];
```

### 15.6 Middleware de Autenticación

**middleware/authMiddleware.js**
```javascript
const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
  let token;

  // Verificar si el token viene en el header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Verificar que el token existe
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No autorizado. Token no proporcionado',
    });
  }

  try {
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Añadir usuario al request
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'No autorizado. Token inválido',
    });
  }
};

// Middleware para verificar rol de admin
exports.adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Solo administradores',
    });
  }
  next();
};
```

### 15.7 Manejo Global de Errores

**middleware/errorHandler.js**
```javascript
const errorHandler = (err, req, res, next) => {
  // Log del error (en producción usar Winston o similar)
  console.error('❌ Error:', err);

  // Error de MySQL - Llave duplicada
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      success: false,
      message: 'El registro ya existe en la base de datos',
    });
  }

  // Error de MySQL - Restricción de llave foránea
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({
      success: false,
      message: 'Referencia inválida. Verifica los datos relacionados',
    });
  }

  // Error de validación de Joi/Express-validator
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errors: err.details,
    });
  }

  // Error de JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Token inválido',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expirado. Por favor inicia sesión nuevamente',
    });
  }

  // Error de Multer (subida de archivos)
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'El archivo es demasiado grande. Máximo 5MB',
      });
    }
    return res.status(400).json({
      success: false,
      message: 'Error al subir el archivo',
    });
  }

  // Error genérico
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
```

---

## 16. Reglas de Base de Datos MySQL

### 16.1 Script de Creación de Base de Datos

**database/schema.sql**
```sql
-- ============================================
-- ELIMINAR BASE DE DATOS SI EXISTE
-- ============================================
DROP DATABASE IF EXISTS ecommerce_db;

-- ============================================
-- CREAR BASE DE DATOS
-- ============================================
CREATE DATABASE ecommerce_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE ecommerce_db;

-- ============================================
-- TABLA: categorias
-- ============================================
CREATE TABLE categorias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE,
  slug VARCHAR(50) NOT NULL UNIQUE,
  descripcion TEXT,
  icono VARCHAR(200), -- URL del ícono (opcional)
  orden INT DEFAULT 0, -- Para ordenar en el frontend
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_activo (activo),
  INDEX idx_orden (orden)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: productos
-- ============================================
CREATE TABLE productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL,
  precio_descuento DECIMAL(10,2) DEFAULT NULL,
  imagen_url VARCHAR(500) NOT NULL,
  stock INT DEFAULT 0,
  id_categoria INT NOT NULL,
  destacado BOOLEAN DEFAULT FALSE,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_producto_categoria 
    FOREIGN KEY (id_categoria) 
    REFERENCES categorias(id) 
    ON DELETE RESTRICT 
    ON UPDATE CASCADE,
  
  INDEX idx_categoria (id_categoria),
  INDEX idx_stock (stock),
  INDEX idx_destacado (destacado),
  INDEX idx_activo (activo),
  INDEX idx_created_at (created_at),
  
  CONSTRAINT chk_precio CHECK (precio > 0),
  CONSTRAINT chk_precio_descuento CHECK (precio_descuento IS NULL OR precio_descuento >= 0),
  CONSTRAINT chk_stock CHECK (stock >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: admin_users
-- ============================================
CREATE TABLE admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(100),
  nombre_completo VARCHAR(100),
  role ENUM('admin', 'editor') DEFAULT 'admin',
  activo BOOLEAN DEFAULT TRUE,
  ultimo_login TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_username (username),
  INDEX idx_activo (activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: configuracion (opcional)
-- ============================================
CREATE TABLE configuracion (
  id INT AUTO_INCREMENT PRIMARY KEY,
  clave VARCHAR(50) NOT NULL UNIQUE,
  valor TEXT NOT NULL,
  tipo ENUM('text', 'number', 'boolean', 'json') DEFAULT 'text',
  descripcion TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_clave (clave)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 16.2 Datos de Ejemplo (Seeds)

**database/seed.sql**
```sql
USE ecommerce_db;

-- ============================================
-- INSERTAR CATEGORÍAS
-- ============================================
INSERT INTO categorias (nombre, slug, descripcion, orden) VALUES
('Zapatillas', 'zapatillas', 'Calzado deportivo y urbano', 1),
('Remeras', 'remeras', 'Indumentaria superior', 2),
('Pantalones', 'pantalones', 'Indumentaria inferior', 3),
('Accesorios', 'accesorios', 'Complementos y extras', 4),
('Buzos', 'buzos', 'Abrigos y sudaderas', 5);

-- ============================================
-- INSERTAR PRODUCTOS DE EJEMPLO
-- ============================================
INSERT INTO productos (
  nombre, 
  descripcion, 
  precio, 
  precio_descuento, 
  imagen_url, 
  stock, 
  id_categoria, 
  destacado
) VALUES
-- Zapatillas
(
  'Nike Air Max 270',
  'Zapatillas deportivas con tecnología Air visible. Máxima comodidad y estilo urbano. Ideal para uso diario.',
  89999.99,
  74999.99,
  'https://res.cloudinary.com/demo/image/upload/v1/shoes/nike-air-max-270.jpg',
  15,
  1,
  TRUE
),
(
  'Adidas Ultraboost 22',
  'Running de alto rendimiento con tecnología Boost. Amortiguación superior y retorno de energía.',
  129999.99,
  NULL,
  'https://res.cloudinary.com/demo/image/upload/v1/shoes/adidas-ultraboost.jpg',
  8,
  1,
  FALSE
),
(
  'Puma RS-X',
  'Zapatillas urbanas con diseño retro. Suela gruesa y colores vibrantes.',
  64999.99,
  54999.99,
  'https://res.cloudinary.com/demo/image/upload/v1/shoes/puma-rsx.jpg',
  0,
  1,
  FALSE
),

-- Remeras
(
  'Remera Adidas Originals Trefoil',
  'Remera clásica de algodón 100%. Logo Trefoil estampado. Corte regular.',
  12999.99,
  NULL,
  'https://res.cloudinary.com/demo/image/upload/v1/clothing/adidas-trefoil-tee.jpg',
  25,
  2,
  FALSE
),
(
  'Remera Nike Dri-FIT',
  'Remera deportiva con tecnología de absorción de humedad. Ideal para entrenar.',
  15999.99,
  12999.99,
  'https://res.cloudinary.com/demo/image/upload/v1/clothing/nike-drifit-tee.jpg',
  18,
  2,
  TRUE
),

-- Pantalones
(
  'Jogger Adidas Tiro',
  'Pantalón deportivo con puños ajustados. Tejido transpirable y bolsillos con cierre.',
  34999.99,
  NULL,
  'https://res.cloudinary.com/demo/image/upload/v1/clothing/adidas-tiro-jogger.jpg',
  12,
  3,
  FALSE
),

-- Accesorios
(
  'Gorra Nike Sportswear',
  'Gorra ajustable con logo bordado. Protección solar y estilo casual.',
  8999.99,
  6999.99,
  'https://res.cloudinary.com/demo/image/upload/v1/accessories/nike-cap.jpg',
  30,
  4,
  FALSE
),
(
  'Medias Puma Pack x3',
  'Pack de 3 pares de medias deportivas. Algodón reforzado en puntera y talón.',
  5999.99,
  NULL,
  'https://res.cloudinary.com/demo/image/upload/v1/accessories/puma-socks.jpg',
  50,
  4,
  FALSE
);

-- ============================================
-- INSERTAR USUARIO ADMIN
-- ============================================
-- Password: admin123 (en producción usar un hash real con bcrypt)
INSERT INTO admin_users (username, password_hash, email, nombre_completo) VALUES
('admin', '$2b$10$rJ8ZqLq9vqVY6v7qQ8xOJOL.jNvLqYZ3z9qQZ6xQZ6xQZ6xQZ6xQZ', 'admin@tienda.com', 'Administrador Principal');

-- ============================================
-- INSERTAR CONFIGURACIONES
-- ============================================
INSERT INTO configuracion (clave, valor, tipo, descripcion) VALUES
('whatsapp_number', '5491234567890', 'text', 'Número de WhatsApp para pedidos'),
('store_name', 'Mi Tienda', 'text', 'Nombre de la tienda'),
('min_stock_alert', '5', 'number', 'Stock mínimo para alerta');
```

### 16.3 Triggers Útiles (Opcional)

**database/triggers.sql**
```sql
USE ecommerce_db;

-- ============================================
-- TRIGGER: Validar stock antes de actualizar
-- ============================================
DELIMITER $$

CREATE TRIGGER before_product_update
BEFORE UPDATE ON productos
FOR EACH ROW
BEGIN
  IF NEW.stock < 0 THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'El stock no puede ser negativo';
  END IF;
  
  -- Auto-marcar como no destacado si stock es 0
  IF NEW.stock = 0 THEN
    SET NEW.destacado = FALSE;
  END IF;
END$$

DELIMITER ;

-- ============================================
-- TRIGGER: Prevenir eliminación de categorías con productos
-- ============================================
DELIMITER $$

CREATE TRIGGER before_category_delete
BEFORE DELETE ON categorias
FOR EACH ROW
BEGIN
  DECLARE product_count INT;
  
  SELECT COUNT(*) INTO product_count
  FROM productos
  WHERE id_categoria = OLD.id AND activo = 1;
  
  IF product_count > 0 THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'No se puede eliminar una categoría con productos activos';
  END IF;
END$$

DELIMITER ;
```

### 16.4 Vistas Útiles

**database/views.sql**
```sql
USE ecommerce_db;

-- ============================================
-- VISTA: Productos con información de categoría
-- ============================================
CREATE OR REPLACE VIEW v_productos_completos AS
SELECT 
  p.id,
  p.nombre,
  p.descripcion,
  p.precio,
  p.precio_descuento,
  CASE 
    WHEN p.precio_descuento IS NOT NULL 
    THEN ROUND(((p.precio - p.precio_descuento) / p.precio) * 100, 0)
    ELSE 0
  END AS porcentaje_descuento,
  p.imagen_url,
  p.stock,
  CASE 
    WHEN p.stock = 0 THEN 'agotado'
    WHEN p.stock < 5 THEN 'bajo'
    ELSE 'disponible'
  END AS estado_stock,
  p.destacado,
  p.activo,
  c.id AS categoria_id,
  c.nombre AS categoria_nombre,
  c.slug AS categoria_slug,
  p.created_at,
  p.updated_at
FROM productos p
LEFT JOIN categorias c ON p.id_categoria = c.id;

-- ============================================
-- VISTA: Estadísticas de inventario
-- ============================================
CREATE OR REPLACE VIEW v_estadisticas_inventario AS
SELECT 
  c.nombre AS categoria,
  COUNT(p.id) AS total_productos,
  SUM(CASE WHEN p.stock > 0 THEN 1 ELSE 0 END) AS productos_disponibles,
  SUM(CASE WHEN p.stock = 0 THEN 1 ELSE 0 END) AS productos_agotados,
  SUM(p.stock) AS stock_total,
  ROUND(AVG(p.precio), 2) AS precio_promedio
FROM categorias c
LEFT JOIN productos p ON c.id = p.id_categoria AND p.activo = 1
WHERE c.activo = 1
GROUP BY c.id, c.nombre;
```

### 16.5 Índices de Optimización

**database/indexes.sql**
```sql
USE ecommerce_db;

-- Índice compuesto para búsqueda y filtrado
CREATE INDEX idx_nombre_categoria ON productos(nombre, id_categoria);

-- Índice para ordenar por fecha de creación
CREATE INDEX idx_created_destacado ON productos(created_at DESC, destacado DESC);

-- Índice para búsquedas de texto (requiere MySQL 5.7+)
-- ALTER TABLE productos ADD FULLTEXT INDEX idx_fulltext_nombre_desc (nombre, descripcion);
```

---

## 17. Reglas de Seguridad CRÍTICAS

### 17.1 Variables de Entorno

**NUNCA COMMITEAR .env AL REPOSITORIO**

**.env.example**
```bash
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=ecommerce_db

# JWT
JWT_SECRET=cambiar_por_secreto_muy_largo_y_aleatorio_en_produccion
JWT_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Admin
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=

# CORS
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 17.2 Sanitización de Inputs

```javascript
const sanitize = require('sanitize-html');

// Limpiar HTML de inputs
const cleanInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return sanitize(input, {
    allowedTags: [], // No permitir tags HTML
    allowedAttributes: {},
  }).trim();
};

// Usar en controladores
exports.createProduct = async (req, res, next) => {
  try {
    const productData = {
      nombre: cleanInput(req.body.nombre),
      descripcion: cleanInput(req.body.descripcion),
      // ...resto de campos
    };
    
    // ...continuar con la lógica
  } catch (error) {
    next(error);
  }
};
```

### 17.3 Prepared Statements (SIEMPRE)

```javascript
// ✅ CORRECTO - Usando prepared statements
const query = 'SELECT * FROM productos WHERE nombre LIKE ?';
const [rows] = await db.query(query, [`%${searchTerm}%`]);

// ❌ INCORRECTO - Vulnerable a SQL Injection
const query = `SELECT * FROM productos WHERE nombre LIKE '%${searchTerm}%'`;
const [rows] = await db.query(query);
```

### 17.4 Rate Limiting por Ruta

```javascript
const rateLimit = require('express-rate-limit');

// Limiter estricto para login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 intentos
  message: 'Demasiados intentos de login. Intenta en 15 minutos',
  standardHeaders: true,
  legacyHeaders: false,
});

// Limiter para creación de productos
const createLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 20, // 20 productos por hora
  message: 'Límite de creación de productos alcanzado',
});

// Aplicar en rutas
router.post('/login', loginLimiter, authController.login);
router.post('/productos', protect, adminOnly, createLimiter, productController.create);
```

---

## FIN DEL DOCUMENTO DE CONTEXTO - VERSIÓN TÉCNICA COMPLETA