# 🚀 DEPLOYMENT BACKEND - RAILWAY + PLANETSCALE

## PASO 1️⃣: Crear Base de Datos (PlanetScale)

### A. Ir a PlanetScale
```
https://planetscale.com
```

### B. Crear cuenta/Login
- Click "Sign up"
- Conectar con GitHub (recomendado)

### C. Crear nueva BD
1. Dashboard → "Create a new database"
2. **Nombre:** `ecommerce-algodif`
3. **Region:** `us-east` o `us-west`
4. **Plan:** Free (está bien para empezar)
5. Click "Create database"

### D. Obtener conexión
1. Esperar a que se cree (1 min)
2. Click en la BD
3. Tab "Connect"
4. Selector dropdown → "Node.js"
5. Copiar la URL (DATABASE_URL):

```
mysql://[username]:[password]@[host]/ecommerce-algodif?sslaccept=strict
```

**Guardar esta URL en un .txt temporal** ⬅️ LA NECESITARÁS

---

## PASO 2️⃣: Crear Proyecto en Railway

### A. Ir a Railway
```
https://railway.app
```

### B. Crear cuenta/Login
- Click "Create account"
- Conectar con GitHub

### C. Crear nuevo proyecto
1. Dashboard → "New Project"
2. Click "Deploy from GitHub repo"
3. Seleccionar repositorio: `Ecommerce-AlgoDiferente`
4. Railway preguntará: "Select environment"
   - Seleccionar: `Main` o crear new
5. Click "Deploy"

---

## PASO 3️⃣: Configurar Variables de Entorno (Railway)

### A. Ir a Project Settings
1. En Railway, tu proyecto
2. Click "Settings"
3. Tab "Environment"

### B. Agregar variables

**Click "Add"** para cada una:

| Variable | Valor | Obtener de |
|----------|-------|-----------|
| `PORT` | `3001` | Fijo |
| `NODE_ENV` | `production` | Fijo |
| `DATABASE_URL` | Tu URL de PlanetScale | Paso 1D ⬆️ |
| `JWT_SECRET` | Valor aleatorio fuerte | Ver abajo 👇 |
| `WHATSAPP_NUMBER` | `5491123456789` | Tu actual |
| `MERCADOPAGO_ACCESS_TOKEN` | Tu token real de MP | Tu cuenta MP |
| `FRONTEND_URL` | `https://ecommerce-algo-diferente.vercel.app` | Tu URL Vercel |

### C. Generar JWT_SECRET fuerte

Ejecutar en terminal:
```bash
openssl rand -base64 32
```

Ejemplo salida:
```
E+d3f/rKdpN9mL2qX9vJ3kL8nO1pQ4rS5tU6vW7yZ8a=
```

**Copiar ese valor a JWT_SECRET en Railway**

---

## PASO 4️⃣: Configurar Build (Railway)

### A. En Railway project
1. Click "Settings"
2. Tab "Deploy"

### B. Build Settings
```
Root Directory: backend
Build Command: npm install
Start Command: npm run start
```

### C. Health Check (opcional pero recomendado)
```
Health Check URL: /api/auth/me
```

---

## PASO 5️⃣: Deploy Automático

Railway hace todo automático:
1. Ve el push a GitHub
2. Descarga código
3. Instala dependencias
4. Inicia el servidor

**Esperar 3-5 minutos**

Cuando esté verde ✅, tu backend estará vivo.

---

## PASO 6️⃣: Obtener URL Pública del Backend

1. En Railway, tu proyecto
2. Tab "Deployments"
3. Ver tu deployment actual
4. En la esquina superior derecha:
   ```
   RAILWAY_STATIC_URL: https://ecommerce-api-xyz.railway.app
   o
   PUBLIC_URL: https://ecommerce-api-xyz.railway.app
   ```

**Copiar esa URL** 📋

---

## PASO 7️⃣: Actualizar Frontend en Vercel

### A. Ir a Vercel
```
https://vercel.com
```

### B. Ir a tu proyecto
1. Dashboard
2. Click en `ecommerce-algo-diferente`

### C. Actualizar variable
1. Settings → Environment Variables
2. Click en `VITE_API_URL`
3. **De:**
   ```
   http://localhost:3001/api
   ```
4. **A:**
   ```
   https://ecommerce-api-xyz.railway.app/api
   ```
   (Reemplazar `xyz` con lo que obtuviste en Paso 6)

5. Click "Save"
6. Vercel hace redeploy automático ✅

---

## ✅ CHECKLIST FINAL

```
□ BD creada en PlanetScale
□ DATABASE_URL copiada
□ Proyecto Railway creado
□ Variables de entorno agregadas en Railway
□ JWT_SECRET generado y guardado
□ Build command correcto (npm install)
□ Start command correcto (npm run start)
□ Deploy de Railway completado y verde ✅
□ URL pública de Railway obtenida
□ VITE_API_URL en Vercel actualizada con URL de Railway
□ Vercel hizo redeploy
```

---

## 🧪 VERIFICAR QUE TODO FUNCIONA

### 1. Backend funcionando
```
Ir a: https://ecommerce-api-xyz.railway.app/api/auth/me
Debe dar: {"message":"Token requerido"} o similar
```

### 2. Frontend conectado
```
Ir a: https://ecommerce-algo-diferente.vercel.app
Abre App sin errores de CORS
Puedes hacer login si quieres
```

### 3. Ver logs de Railway
```
En Railway, tu proyecto
Tab "Deployments"
Click en tu deployment
Ver logs en tiempo real
```

---

## ⚠️ PROBLEMAS COMUNES

### "Build failed in Railway"
**Solución:**
- Railway tab "Plugins" → Agregar "MySQL" plugin
- O asegurar que DATABASE_URL está correcta

### "Cannot connect to database"
**Solución:**
- DATABASE_URL mal copiada
- PlanetScale BD no inicializada
- Volver a copiar URL exacta

### "CORS error en frontend"
**Solución:**
- VITE_API_URL en Vercel no actualizada
- URL de Railway sin `/api` al final
- Debe terminar con `/api`

### "401 Unauthorized"
**Normal**, significa:
- Backend y frontend conectados ✅
- Solo falta loguear

---

## 🎉 YA ESTÁ TODO DESPLEGADO

```
Frontend: https://ecommerce-algo-diferente.vercel.app
Backend:  https://ecommerce-api-xyz.railway.app
Base de Datos: PlanetScale
```

**¿Pruebas y me avisas si funciona?** 🚀
