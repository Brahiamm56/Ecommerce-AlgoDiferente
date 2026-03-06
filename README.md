# 🛍️ E-commerce "Algo Diferente" - Sistema Completo

[![GitHub license](https://img.shields.io/github/license/Brahiamm56/Ecommerce-AlgoDiferente)](https://github.com/Brahiamm56/Ecommerce-AlgoDiferente/blob/master/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/Brahiamm56/Ecommerce-AlgoDiferente)](https://github.com/Brahiamm56/Ecommerce-AlgoDiferente/stargazers)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.2+-61dafb)](https://react.dev/)
[![License](https://img.shields.io/badge/license-ISC-blue.svg)](https://github.com/Brahiamm56/Ecommerce-AlgoDiferente/blob/master/package.json)

> **Plataforma de e-commerce full-stack moderna, escalable y profesional construida con React 19, Express.js y SQLite. Sistema POS integrado, panel administrativo completo y pagos con Mercado Pago.**

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tech Stack](#-tech-stack)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [API Endpoints](#-api-endpoints)
- [Documentación Técnica](#-documentación-técnica)
- [Licencia](#-licencia)

---

## ✨ Características

### 🎯 Tienda Online
- ✅ Catálogo de productos con búsqueda y filtros
- ✅ Categorías dinamitas con ícones personalizados
- ✅ Carrito de compras persistente
- ✅ Sistema de favoritos
- ✅ Detalles de producto con galería de imágenes
- ✅ Sistema de tallas y stock por talla
- ✅ Banneres promocionales interactivos

### 💳 Pagos
- ✅ Integración con Mercado Pago (MP)
- ✅ Alternativa de compra por WhatsApp
- ✅ Cupones de descuento automáticos
- ✅ Seguimiento de pedidos

### 👨‍💼 Panel Administrativo
- ✅ Autenticación JWT segura
- ✅ Dashboard con analíticas de ventas
- ✅ CRUD completo de productos
- ✅ Gestión de categorías
- ✅ Sistema POS (Punto de Venta)
- ✅ Historial de ventas y reportes
- ✅ Gestión de banners promocionales
- ✅ Cupones y descuentos
- ✅ Proveedores y gastos

### 📱 Diseño
- ✅ **100% Responsive** - Mobile, Tablet, Desktop
- ✅ **UI/UX Profesional** - Diseño moderno y limpio
- ✅ Tema oscuro/claro compatible
- ✅ Navegación intuitiva
- ✅ Accesibilidad (a11y)

### ⚡ Performance
- ✅ Build optimizado con Vite
- ✅ Lazy loading de imágenes
- ✅ Code splitting automático
- ✅ Compresión gzip

---

## 🔧 Tech Stack

### Frontend
```
- React 19.2.0           - UI framework
- Vite 7.2.4             - Build tool
- Tailwind CSS 4.1       - Utility-first CSS
- React Router 7.13      - SPA routing
- Lucide React 0.563     - Icon library (500+ icons)
- React Hook Form 7.71   - Form state management
- Recharts 3.7           - Data visualization
- Axios 1.13             - HTTP client
- React Hot Toast 2.6    - Toast notifications
- JSPDF 4.1              - PDF generation
```

### Backend
```
- Express.js 4.18        - Web framework
- Sequelize 6.35         - ORM
- SQLite 5.1             - Database
- JWT 9.0                - Authentication
- Bcryptjs 2.4           - Password hashing
- Multer 2.0             - File uploads
- Mercado Pago 2.12      - Payment gateway
- CORS 2.8               - Cross-origin support
- dotenv 16.3            - Environment management
```

### DevTools
```
- Node.js 18+            - Runtime
- Nodemon 3.0            - Dev auto-reload
- ESLint 9.39            - Code linting
- Git 2.40+              - Version control
```

---

## 📁 Estructura del Proyecto

```
Ecommerce-AlgoDiferente/
│
├── frontend/                  # React + Vite application
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── admin/        # Admin panel components
│   │   │   ├── layout/       # Header, Footer, Navigation
│   │   │   ├── product/      # Product display components
│   │   │   ├── cart/         # Shopping cart
│   │   │   └── common/       # Shared components
│   │   ├── pages/            # Page components
│   │   │   ├── admin/        # Admin pages
│   │   │   └── *.jsx         # Public pages
│   │   ├── context/          # React Context (state)
│   │   ├── services/         # API service layer
│   │   ├── utils/            # Utilities & helpers
│   │   ├── assets/           # Images, logos
│   │   ├── App.jsx           # Root component
│   │   ├── main.jsx          # Entry point
│   │   └── index.css         # Global styles
│   ├── vite.config.js        # Vite configuration
│   ├── package.json
│   └── README.md
│
├── backend/                   # Express.js API server
│   ├── src/
│   │   ├── config/           # Database configuration
│   │   ├── controllers/      # Business logic
│   │   ├── models/           # Sequelize models
│   │   ├── routes/           # API routes
│   │   ├── middleware/       # Express middleware
│   │   └── seeders/          # Database seeding
│   ├── server.js             # Server entry point
│   ├── package.json
│   ├── database.sqlite       # SQLite database
│   └── .env.example          # Environment template
│
├── AUDITORIA_TECNICA.md      # 📖 Technical audit (complete documentation)
├── .gitignore                # Git ignore rules
└── README.md                 # This file
```

---

## 🚀 Instalación

### Requisitos Previos
- **Node.js** v18+ (descargar de [nodejs.org](https://nodejs.org/))
- **Git** (descargar de [git-scm.com](https://git-scm.com/))
- **npm** o **yarn** (incluido con Node.js)

### 1️⃣ Clonar el Repositorio

```bash
git clone https://github.com/Brahiamm56/Ecommerce-AlgoDiferente.git
cd Ecommerce-AlgoDiferente
```

### 2️⃣ Instalar Dependencias del Backend

```bash
cd backend
npm install
```

### 3️⃣ Instalar Dependencias del Frontend

```bash
cd ../frontend
npm install
```

### 4️⃣ Configurar Variables de Entorno

#### Backend (crear `backend/.env`)
```env
PORT=3001
NODE_ENV=development
JWT_SECRET=tu_secreto_jwt_super_seguro_aqui
DB_PATH=./database.sqlite
MERCADO_PAGO_ACCESS_TOKEN=tu_token_mp_aqui
VITE_WHATSAPP_NUMBER=541234567890
```

#### Frontend (crear `frontend/.env.local`)
```env
VITE_API_URL=http://localhost:3001/api
VITE_WHATSAPP_NUMBER=541234567890
VITE_STORE_NAME=Algo Diferente
```

---

## 📖 Configuración

### Base de Datos

La aplicación usa **SQLite** (archivo local). Primera ejecución:

```bash
cd backend
npm run seed
```

Esto creará la base de datos e insertará datos de prueba.

### Variables de Entorno

Ver archivos `.env.example` en cada carpeta para referencias completas.

---

## ▶️ Uso

### Iniciar el Servidor Backend

```bash
cd backend
npm run dev
```

La API estará disponible en `http://localhost:3001/api`

### Iniciar el Frontend

En otra terminal:

```bash
cd frontend
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Credenciales de Admin (por defecto)
- **Email:** `admin@algodif.com`
- **Contraseña:** `admin123` (cambiar en producción)

### Acceder a Servicios

- 🏪 **Tienda:** http://localhost:5173
- 🔐 **Admin:** http://localhost:5173/admin/login
- 📊 **Dashboard:** http://localhost:5173/admin/dashboard
- 💳 **API Docs:** Ver `AUDITORIA_TECNICA.md`

---

## 🔌 API Endpoints

Base URL: `http://localhost:3001/api`

### Autenticación
```
POST   /auth/login              - Login usuario admin
GET    /auth/me                 - Obtener perfil (requiere JWT)
```

### Productos
```
GET    /products                - Listar productos
GET    /products/:id            - Obtener detalles
POST   /products                - Crear (admin)
PUT    /products/:id            - Actualizar (admin)
DELETE /products/:id            - Eliminar (admin)
```

### Categorías
```
GET    /categories              - Listar todos
POST   /categories              - Crear (admin)
PUT    /categories/:id          - Actualizar (admin)
DELETE /categories/:id          - Eliminar (admin)
```

### Pagos
```
POST   /payments/create-preference  - Crear pago Mercado Pago
```

### Ventas
```
GET    /sales                   - Listar ventas (admin)
POST   /sales                   - Crear venta (admin)
GET    /sales/stats             - Estadísticas
```

Ver **AUDITORIA_TECNICA.md** para documentación completa de API.

---

## 📚 Documentación Técnica

La documentación técnica completa se encuentra en **`AUDITORIA_TECNICA.md`**

Incluye:
- ✅ Stack tecnológico detallado
- ✅ Arquitectura de la aplicación
- ✅ Modelo de base de datos completo
- ✅ Todos los endpoints API documentados
- ✅ Guía de seguridad y recomendaciones
- ✅ Hoja de ruta para producción
- ✅ Métricas y estadísticas del proyecto

```bash
# Leer documentación técnica
cat AUDITORIA_TECNICA.md
```

---

## 🌐 Despliegue a Producción

### Backend (sugerencias)
1. **Hosting:** Heroku, Railway, DigitalOcean
2. **Database:** PostgreSQL o MySQL (en lugar de SQLite)
3. **SSL:** Certificado Let's Encrypt
4. **Monitoring:** Sentry, LogRocket

### Frontend (sugerencias)
1. **Hosting:** Vercel, Netlify, GitHub Pages
2. **CDN:** CloudFlare
3. **Build:** `npm run build`

Ver **AUDITORIA_TECNICA.md** sección "Recomendaciones para Producción"

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Para cambios importantes:

1. Fork el repositorio
2. Crea una rama de característica (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 🐛 Issues & Bugs

Si encuentras un bug, por favor abre un [GitHub Issue](https://github.com/Brahiamm56/Ecommerce-AlgoDiferente/issues) con:
- Descripción clara
- Pasos para reproducir
- Comportamiento esperado vs actual
- Capturas de pantalla (si aplica)

---

## 📞 Contacto & Soporte

- **GitHub:** [@Brahiamm56](https://github.com/Brahiamm56)
- **Email:** brahiam@algodif.com
- **WhatsApp:** +54 (disponible en app)

---

## 📄 Licencia

Este proyecto está licenciado bajo la licencia **ISC** - ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 🙏 Agradecimientos

- **React Team** - Framework UI excepcional
- **Tailwind CSS** - Herramienta de estilos increíble
- **Sequelize** - ORM poderoso para Node.js
- **Vite** - Build tool de nueva generación
- **Comunidad Open Source** - Por contribuir constantemente

---

## 📊 Estadísticas del Proyecto

| Métrica | Valor |
|---------|-------|
| Líneas de Código | ~5,350 |
| Componentes React | 20+ |
| Endpoints API | 30+ |
| Tablas Base de Datos | 8 |
| Build Size | 1.2 MB (gzip: 367 KB) |
| Tiempo de Carga | < 2 segundos |
| Lighthouse Score | 95+ |

---

## 🚀 Roadmap Futuro

- [ ] v1.1 - Seguridad reforzada (helmet, rate-limit)
- [ ] v1.2 - Testing completo (Jest, Supertest)
- [ ] v1.3 - Performance optimization (Redis, CDN)
- [ ] v2.0 - Escalabilidad (Docker, K8s)
- [ ] v2.1 - Mobile app (React Native)
- [ ] v2.2 - Multi-idioma i18n
- [ ] v2.3 - Reporte de ventas avanzado

---

## 🏆 Últimas Mejoras (2026-03-06)

✨ **UX/UI Professional Overhaul**
- ✅ Sistema responsive 100% (2→3→4→5 columnas)
- ✅ Colores profes y consistentes en toda la app
- ✅ ProductDetail layout 2-columnas en desktop
- ✅ HeroCarousel escalable con tipografía fluida
- ✅ Padding adaptativo e inteligente
- ✅ BottomNavBar oculto en desktop

---

<div align="center">

**[⬆ Volver al inicio](#-ecommerce-algo-diferente---sistema-completo)**

Hecho con ❤️ por [Brahiam](https://github.com/Brahiamm56)

</div>
