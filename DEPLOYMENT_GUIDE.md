# 🚀 GUÍA DE DEPLOYMENT - E-commerce Algo Diferente

## 📊 CONFIGURACIÓN ACTUAL

### Backend (.env)
```env
PORT=3001
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_NAME=ecommerce_db
DB_USER=root
DB_PASSWORD=
JWT_SECRET=ecommerce_jwt_secret_dev_2024
WHATSAPP_NUMBER=5491123456789
MERCADOPAGO_ACCESS_TOKEN=TEST-1651702613512759-021023-4a7ef88c05f98ba5c6a9bd220c155929-780405490
```

### Frontend (.env)
```env
VITE_API_URL=/api
VITE_WHATSAPP_NUMBER=543624012322
VITE_STORE_NAME=Algo Diferente Shoes
```

---

## 🎯 OPCIÓN 1: DEPLOYMENT FÁCIL (RECOMENDADO)

### **Frontend: Vercel** + **Backend: Railway** + **BD: PlanetScale**

#### PASO 1: Setup Base de Datos (PlanetScale)

1. **Ir a:** https://planetscale.com
2. **Crear cuenta** y loguear
3. **Crear base de datos:**
   - Click "Create a new database"
   - Nombre: `ecommerce-algodif`
   - Region: `us-east` (más cercana a Sur América: `us-west`)
4. **Obtener credenciales:**
   - Tab "Connect"
   - Seleccionar "Node.js"
   - Copiar URL de conexión (DATABASE_URL)

**URL format:**
```
mysql://[user]:[password]@[host]/[database]?ssl={"rejectUnauthorized":true}
```

---

#### PASO 2: Deploy Backend (Railway)

1. **Ir a:** https://railway.app
2. **Conectar GitHub** (autorizar)
3. **Click "New Project" → "Deploy from GitHub"**
4. **Seleccionar repositorio:** `Ecommerce-AlgoDiferente`
5. **Configurar variables de entorno:**

```env
# Production Backend .env
PORT=3001
NODE_ENV=production
DATABASE_URL=mysql://[user]:[pass]@[host]/[db]?ssl={"rejectUnauthorized":true}
JWT_SECRET=tu_jwt_secreto_super_seguro_cambiar_aqui_PRODUCCION
WHATSAPP_NUMBER=5491123456789
MERCADOPAGO_ACCESS_TOKEN=APP_USR-123456789-codigo-real-de-mercadopago
FRONTEND_URL=https://tu-frontend-en-vercel.vercel.app
```

6. **Deployment automático**: Railway hará deploy en cada push

**Nota:** Railway te dará una URL pública como:
```
https://railway-project-xyz.up.railway.app
```

---

#### PASO 3: Deploy Frontend (Vercel)

1. **Ir a:** https://vercel.com
2. **Login con GitHub**
3. **Import Project → GitHub**
4. **Seleccionar:** `Ecommerce-AlgoDiferente`
5. **Configurar Build:**
   ```
   Framework: Vite
   Build Command: npm run build (en frontend/)
   Output Directory: frontend/dist
   Root Directory: frontend
   ```

6. **Environment Variables (en Vercel):**
   ```env
   VITE_API_URL=https://railway-backend-url.up.railway.app/api
   VITE_WHATSAPP_NUMBER=543624012322
   VITE_STORE_NAME=Algo Diferente Shoes
   ```

7. **Deploy** y listo ✅

---

## 🎯 OPCIÓN 2: DEPLOYMENT TODO EN UNO (Railway Monolithic)

### Sin separar Frontend y Backend

1. **Railway:**
   - Mismo proceso anterior
   - Todo en mismo proyecto
   - Más simple

2. **Vercel:**
   - Solo para frontend

---

## 🎯 OPCIÓN 3: DEPLOYMENT ALTERNATIVO (Render + Netlify)

### **Frontend: Netlify** + **Backend: Render** + **BD: Supabase**

#### Paso 1: Base de Datos (Supabase)

```
1. Ir a: https://supabase.io
2. Crear cuenta
3. New Project → Seleccionar región
4. Copiar DATABASE_URL (PostgreSQL)
5. Obtener API keys
```

#### Paso 2: Backend (Render)

```
1. Ir a: https://render.com
2. New → Web Service
3. Conectar GitHub
4. Framework: Node
5. Build: npm install
6. Start: npm run start
7. Agregar environment variables
8. Deploy
```

#### Paso 3: Frontend (Netlify)

```
1. Ir a: https://netlify.com
2. Import from Git
3. Build command: npm run build (carpeta frontend)
4. Publish directory: frontend/dist
5. Set env vars
6. Deploy
```

---

## 🛠️ CAMBIOS RECOMENDADOS PARA PRODUCCIÓN

### 1️⃣ Backend `.env` producción

```bash
# backend/.env.production
PORT=3001
NODE_ENV=production

# Database Producción (PlanetScale/Supabase)
DATABASE_URL=mysql://user:pass@host.planetscale.com/db?ssl={"rejectUnauthorized":true}

# JWT - CAMBIAR ESTE VALOR
JWT_SECRET=$(openssl rand -base64 32)  # Generar valor aleatorio

# Mercado Pago - Poner credenciales REALES de producción
MERCADOPAGO_ACCESS_TOKEN=APP_USR-xxxxxxx-xxxxxxx-xxxxxxxxxxxxx-xxxxxxxxxx

# WhatsApp
WHATSAPP_NUMBER=5491123456789

# Frontend URL (para CORS)
FRONTEND_URL=https://tu-dominio.vercel.app
```

### 2️⃣ Frontend `.env.production`

```bash
# frontend/.env.production
VITE_API_URL=https://tu-backend-produccion.railway.app/api
VITE_WHATSAPP_NUMBER=543624012322
VITE_STORE_NAME=Algo Diferente Shoes
```

### 3️⃣ Generar JWT Secret seguro

```bash
# En terminal (Linux/Mac)
openssl rand -base64 32

# Salida ejemplo:
# E+d3f/rKdpN9mL2qX9vJ3kL8nO1pQ4rS5tU6vW7yZ8a=
```

**Copiar ese valor a `JWT_SECRET` en producción**

---

## 📋 PRE-REQUISITOS PARA CADA OPCIÓN

### **Opción 1 (RECOMENDADA): Vercel + Railway + PlanetScale**

| Requisito | Costo | Setup |
|-----------|-------|-------|
| **Vercel** | Gratis (hasta 100GB) | 5 min |
| **Railway** | Gratis ($5 crédito, después $5/mes) | 5 min |
| **PlanetScale** | Gratis (hasta 5GB) | 5 min |
| **Total** | ~$5-10/mes | 15 min |

### **Opción 2: Render + Netlify + Supabase**

| Requisito | Costo | Variante |
|-----------|-------|---------|
| **Render** | Gratis pero lento | $7/mes Pro |
| **Netlify** | Gratis | Limitado |
| **Supabase** | Gratis ($100 crédito) | $25/mes Pro |
| **Total** | ~$25-40/mes | ⏱️ Más lento |

---

## ✅ CHECKLIST ANTES DE DESPLEGAR

```
□ JWT_SECRET generado y guardado (NO compartir)
□ Credenciales Mercado Pago reales (no TEST)
□ Base de datos configuada en hosting
□ CORS habilitado en backend
□ Frontend URL en LISTA BLANCA del backend
□ Variables de entorno correctas en cada plataforma
□ Primera migración de BD ejecutada
□ Tests pasados localmente
□ Build producción testeado:
  - Backend: npm run build (si aplica)
  - Frontend: npm run build
□ Git commits finales pushed
□ Dominio personalizado configurado (opcional)
□ SSL/HTTPS habilitado (automático en Vercel/Railway)
```

---

## 🚀 PASOS RÁPIDOS (15 MINUTOS)

### **Vercel (Frontend)**

```bash
# 1. Instalar CLI de Vercel
npm i -g vercel

# 2. Desde carpeta del proyecto
cd frontend
vercel

# 3. Seguir pasos interactivos
# - Conectar GitHub
# - Seleccionar settings
# - Deploy
```

### **Railway (Backend)**

```bash
# 1. Sin CLI, todo web en:
# https://railway.app

# 2. Crear proyecto nuevo
# 3. Conectar GitHub
# 4. Seleccionar carpeta /backend
# 5. Agregar environment variables
# 6. Deploy automático
```

---

## 🌍 CONFIGURACIÓN DE DOMINIO

### Con Vercel (Frontend)

```
Settings → Domains → Add Domain
Usar DNS vercel.com o tu propio hosting
```

### Backend URL

```
Vercel Frontend: https://tudominio.com
Railway Backend: https://algo-diferente-api.railway.app
```

---

## 🔒 SEGURIDAD EN PRODUCCIÓN

```bash
# Checklist seguridad
□ JWT_SECRET es único y fuerte (32+ caracteres)
□ NODE_ENV=production
□ CORS está configurado solo para dominio
□ Headers de seguridad activos (helmet)
□ Rate limiting en API
□ Logs de errores enviados a servicio externo
□ No logs sensibles en console
□ SSL/HTTPS forzado (automático en Vercel/Railway)
□ Variables sensibles NO en código
□ Database backups automáticos
```

---

## 📞 CONTACTO DE SOPORTE

| Servicio | Link |
|----------|------|
| **Vercel Docs** | https://vercel.com/docs |
| **Railway Docs** | https://railway.app/docs |
| **PlanetScale Docs** | https://planetscale.com/docs |
| **Mercado Pago API** | https://developers.mercadopago.com |

---

## 💡 TIPS FINALES

✅ **Mejor configuración para tu caso:**
- Frontend: **Vercel** (gratis, rápido, automático)
- Backend: **Railway** (fácil, confiable, $5/mes)
- BD: **PlanetScale** (gratis hasta 5GB, MySQL compatible)
- Total: **~$5-10/mes**

✅ **Alternativa más económica:**
- Todo: **Railway** (todo en un servicio)
- Costo: **~$5-10/mes**
- Setup: **Más simple**

✅ **Posible problema:**
Si usas SQLite local (actual), NO funcionará en producción.
⚠️ **NECESITAS migrar a MySQL/PostgreSQL**

---

**¿Necesitas ayuda con algún paso específico?** 🚀
