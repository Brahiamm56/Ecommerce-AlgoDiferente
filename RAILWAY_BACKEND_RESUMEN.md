# 🎯 RAILWAY BACKEND - RESUMEN VISUAL

## 3️⃣ PASOS RÁPIDOS

```
┌──────────────────────────────────────────────────┐
│ PASO 1: PLANETSCALE (Base de Datos)             │
│ https://planetscale.com                          │
│                                                  │
│ ✅ Crear cuenta                                 │
│ ✅ New Database → ecommerce-algodif            │
│ ✅ Connect → Node.js → Copiar DATABASE_URL    │
│    (Guardarlo en .txt)                          │
└──────────────────────────────────────────────────┘
                           ↓
┌──────────────────────────────────────────────────┐
│ PASO 2: RAILWAY (Backend)                       │
│ https://railway.app                              │
│                                                  │
│ ✅ Crear cuenta con GitHub                     │
│ ✅ New Project → Deploy from GitHub            │
│ ✅ Seleccionar: Ecommerce-AlgoDiferente        │
│ ✅ Settings → Environment Variables:            │
│    - PORT = 3001                               │
│    - NODE_ENV = production                     │
│    - DATABASE_URL = URL de PlanetScale (😀)   │
│    - JWT_SECRET = valor aleatorio (generar)   │
│    - WHATSAPP_NUMBER = 5491123456789           │
│    - MERCADOPAGO_ACCESS_TOKEN = tu token       │
│    - FRONTEND_URL = URL de Vercel              │
│ ✅ Deploy Settings:                             │
│    - Build: npm install                        │
│    - Start: npm run start                       │
│ ✅ Deploy                                       │
│ ✅ Obtener URL pública (ej: *.railway.app)     │
└──────────────────────────────────────────────────┘
                           ↓
┌──────────────────────────────────────────────────┐
│ PASO 3: VERCEL (Actualizar Frontend)            │
│ https://vercel.com                               │
│                                                  │
│ ✅ Tu proyecto ecommerce-algo-diferente         │
│ ✅ Settings → Environment Variables             │
│ ✅ Editar: VITE_API_URL                         │
│    De: http://localhost:3001/api               │
│    A: https://tu-railway-url.railway.app/api   │
│ ✅ Save & Redeploy                             │
└──────────────────────────────────────────────────┘
                           ↓
┌──────────────────────────────────────────────────┐
│ 🎉 TODO LISTO                                    │
│                                                  │
│ Frontend:  https://...vercel.app               │
│ Backend:   https://...railway.app              │
│ Base de Datos: PlanetScale                      │
└──────────────────────────────────────────────────┘
```

---

## 📝 VALORES A RECOLECTAR

| Valor | Dónde obtenerlo |
|-------|------------------|
| `DATABASE_URL` | PlanetScale → Tu BD → Connect → Node.js |
| `JWT_SECRET` | Terminal: `openssl rand -base64 32` |
| `MERCADOPAGO_ACCESS_TOKEN` | Tu cuenta Mercado Pago → Developers |
| `WHATSAPP_NUMBER` | Tu número (ejemplo: 5491123456789) |
| `RAILWAY_URL` | Railway → Tu proyecto → URL pública |
| `VERCEL_URL` | Vercel → Tu proyecto (ya tienes) |

---

## ⏱️ TIEMPO TOTAL
- PlanetScale: 5 min
- Railway: 10 min
- Vercel update: 2 min
- **Total: ~17 minutos**

---

## ✅ VERIFICACIÓN FINAL

### En tu navegador:

**Backend está OK si:**
```
GET https://tu-railway-url.railway.app/api/auth/me
Respuesta: {"message":"Token requerido"}
✅ Significa que el backend responde
```

**Frontend está OK si:**
```
Ir a https://tu-vercel-url.vercel.app
✅ Carga sin errores
✅ NO hay errores en consola (F12)
✅ Puedes navigar la tienda
```

---

¿Listo para empezar? 🚀
