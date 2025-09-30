# 🔧 Configuración de Firebase para Dominios Autorizados

## Problema Actual
Error: `Firebase: Error (auth/unauthorized-domain)`

## Solución

### 1. Acceder a Firebase Console
- Ve a: https://console.firebase.google.com/
- Proyecto: `diario-misional`

### 2. Configurar Dominios Autorizados
- Ve a: **Authentication** → **Settings** → **Authorized domains**
- Agregar los siguientes dominios:

```
diario-misional.vercel.app
diario-misional-victor-ruizs-projects-2df6e656.vercel.app
diario-misional-git-main-victor-ruizs-projects-2df6e656.vercel.app
```

### 3. Dominios Actuales en Vercel
Basado en el deployment más reciente:
- **Principal**: `diario-misional.vercel.app`
- **Específico**: `diario-misional-8i8n3qm32-victor-ruizs-projects-2df6e656.vercel.app`

### 4. Verificación
Después de agregar los dominios:
1. Espera 5-10 minutos para que se propague
2. Prueba el login nuevamente
3. Debería funcionar tanto email/password como Google/Apple

## Nota Importante
Los dominios de Vercel cambian con cada deployment. Para producción, es mejor usar el dominio personalizado principal: `diario-misional.vercel.app`
