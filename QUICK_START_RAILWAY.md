# ⚡ QUICK START - BACKEND RAILWAY

## 🚀 EN 3 PASOS

### 1️⃣ PlanetScale (5 min)
```
👉 https://planetscale.com
   └─ Sign up con GitHub
   └─ Create Database: "ecommerce-algodif"
   └─ Connect → Node.js
   └─ Copiar: DATABASE_URL
```

### 2️⃣ Railway (10 min)
```
👉 https://railway.app
   └─ Sign up con GitHub
   └─ New Project → Deploy from GitHub
   └─ Seleccionar: Ecommerce-AlgoDiferente
   └─ Settings → Environment Variables
```

**Agregar estas 7 variables:**
```
PORT=3001
NODE_ENV=production
DATABASE_URL=[COPIAR DE PLANETSCALE]
JWT_SECRET=[GENERAR: openssl rand -base64 32]
WHATSAPP_NUMBER=5491123456789
MERCADOPAGO_ACCESS_TOKEN=[TU TOKEN]
FRONTEND_URL=https://ecommerce-algo-diferente.vercel.app
```

**Build Settings:**
```
- Build Command: npm install
- Start Command: npm run start
```

👉 **Click Deploy** (esperar 3-5 min)

### 3️⃣ Vercel Update (2 min)
```
👉 https://vercel.com
   └─ Tu proyecto
   └─ Settings → Environment Variables
   └─ Editar: VITE_API_URL

   DE:  http://localhost:3001/api
   A:   https://[TU-RAILWAY-URL].railway.app/api

   └─ Save (hace redeploy auto)
```

---

## 📋 VALORES NECESARIOS

| ✅ Obtener | De | Ejemplo |
|-----------|----|---------|
| DATABASE_URL | PlanetScale | mysql://user:pass@host/db... |
| JWT_SECRET | Terminal | `openssl rand -base64 32` |
| MP Token | Tu cuenta MP | APP_USR-xxxxx |
| WP Number | Tuyo | 5491123456789 |
| Railway URL | Railway: Deployments | https://xxx.railway.app |

---

## 🧪 TEST

```
✅ Backend OK:
   GET https://[railway-url].railway.app/api/auth/me
   → {"message":"Token requerido"}

✅ Frontend OK:
   Ir a https://ecommerce-algo-diferente.vercel.app
   → Sin errores, carga todo
```

---

## 🆘 Si falla

| Error | Solución |
|-------|----------|
| Build failed | DATABASE_URL mal |
| CORS error | VITE_API_URL sin `/api` al final |
| 404 API | Railway URL incompleta |
| Auth error | JWT_SECRET valido |

---

**¡Eso es todo!** 🎉

Cuando termines, **dime la URL de Railway** y actualizo el frontend.
