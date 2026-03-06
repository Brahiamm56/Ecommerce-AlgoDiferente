# 🎯 VERCEL - CONFIGURACIÓN EXACTA PARA TU PROYECTO

## 1️⃣ ROOT DIRECTORY
```
Cambiar de: ./
A: frontend
```

---

## 2️⃣ BUILD AND OUTPUT SETTINGS

**Framework Preset:** Other

**Build Command:**
```bash
npm run build
```

**Output Directory:**
```
dist
```

**Install Command:**
```bash
npm install
```

---

## 3️⃣ ENVIRONMENT VARIABLES

Agregar exactamente estos 3:

| # | Key | Value |
|---|-----|-------|
| 1 | `VITE_API_URL` | `http://localhost:3001/api` |
| 2 | `VITE_WHATSAPP_NUMBER` | `543624012322` |
| 3 | `VITE_STORE_NAME` | `Algo Diferente Shoes` |

**Nota:** `VITE_API_URL` está en modo desarrollo. Cuando tengas Railway funcionando, cambiar a su URL pública.

---

## ✅ RESULTADO FINAL

En la pantalla debe quedar:

```
┌─────────────────────────────────────────────────┐
│ Project Name: ecommerce-algo-diferente         │
│ Framework: Other                               │
│ Root Directory: frontend                       │ ← CAMBIO 1
│ Build Command: npm run build                   │ ← CAMBIO 2
│ Output Directory: dist                         │ ← CAMBIO 3
│ Install Command: npm install                   │
│                                                │
│ Environment Variables:                         │ ← CAMBIO 4
│ ✓ VITE_API_URL = http://localhost:3001/api   │
│ ✓ VITE_WHATSAPP_NUMBER = 543624012322        │
│ ✓ VITE_STORE_NAME = Algo Diferente Shoes     │
│                                                │
│ [Deploy] button                                │
└─────────────────────────────────────────────────┘
```

---

## 🚀 DEPLOY

Presionar el botón **[Deploy]** y esperar 2-3 minutos.

Te dará URL como:
```
https://ecommerce-algo-diferente.vercel.app
```

✅ **¡LISTO!**
