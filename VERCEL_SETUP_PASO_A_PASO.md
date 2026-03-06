# ✅ CONFIGURACIÓN VERCEL - PASO A PASO

## 📋 EN LA PANTALLA QUE VES (Configure Project)

### 1️⃣ Root Directory
**Cambiar de:** `./`
**A:** `frontend`
**Click:** Edit

```
./frontend
```

---

### 2️⃣ Build and Output Settings
**Click en:** "Build and Output Settings"

**Configurar:**
```
Framework: Other (está bien, aunque sea Vite)
Build Command: cd frontend && npm run build
Output Directory: frontend/dist
Install Command: npm install
```

**Alternativa si detecta Vite:**
```
Build Command: npm run build
Output Directory: dist
```

---

### 3️⃣ Environment Variables
**Click en:** "Environment Variables"

**Agregar estas variables:**

| Key | Value | Nota |
|-----|-------|------|
| `VITE_API_URL` | `https://tu-railway-backend.railway.app/api` | Cambiar cuando tengas URL de Railway |
| `VITE_WHATSAPP_NUMBER` | `543624012322` | Tu número actual |
| `VITE_STORE_NAME` | `Algo Diferente Shoes` | Tu nombre de tienda |

**Forma de agregar:**
```
1. Click "Add New"
2. Key: VITE_API_URL
3. Value: http://localhost:3001/api (desarrollo) o tu URL de Railway (producción)
4. Click "Save"
5. Repetir para cada variable
```

---

## 🚀 DESPUÉS DE CONFIGURAR

**Click:** "Deploy"

Esperar ~2-3 minutos y listo ✅

Te dará URL como:
```
https://ecommerce-algo-diferente.vercel.app
```

---

## ⚠️ PROBLEMAS COMUNES

### Error: "Build failed"
**Solución:**
```
1. En Build Command cambiar a:
   npm run build (ejecutar desde raíz)

2. O especificar ruta:
   cd frontend && npm run build
```

### Error: "Cannot find module 'vite'"
**Solución:**
```
Install Command: npm install --legacy-peer-deps
```

### Frontend conecta pero muestra error de API
**Solución:**
```
VITE_API_URL debe ser URL PÚBLICA de Railway, no localhost
```

---

## 📸 SCREENSHOT DE CONFIGURACIÓN CORRECTA

```
┌─────────────────────────────────────────┐
│ Root Directory: frontend                │ ← CAMBIAR ESTO
│ Framework: Other                        │
│ Build Command: npm run build            │
│ Output Directory: dist                  │
│ Install Command: npm install            │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Environment Variables:                  │
│ VITE_API_URL = http://localhost:3001... │
│ VITE_WHATSAPP_NUMBER = 543624012322    │
│ VITE_STORE_NAME = Algo Diferente Shoes │
└─────────────────────────────────────────┘
```

---

## ✅ CHECKLIST FINAL

- [ ] Root Directory = `frontend`
- [ ] Build Command = `npm run build`
- [ ] Output Directory = `dist`
- [ ] Variables de entorno agregadas (3 totales)
- [ ] Conexión a GitHub OK
- [ ] Botón "Deploy" listo

¿Ya configuraste todo? Presiona "Deploy" y me avisas 🚀
