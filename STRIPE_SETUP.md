# Configuración de Stripe para Diario Misional

## 🚀 Pasos para Configurar Stripe

### 1. Crear Cuenta en Stripe
1. Ve a [stripe.com](https://stripe.com) y crea una cuenta
2. Completa la verificación de tu cuenta
3. Activa el modo de prueba (Test Mode) para desarrollo

### 2. Obtener Claves de API
1. Ve a [Dashboard de Stripe](https://dashboard.stripe.com/test/apikeys)
2. Copia las siguientes claves:
   - **Publishable key** (pk_test_...)
   - **Secret key** (sk_test_...)

### 3. Configurar Webhooks
1. Ve a [Webhooks](https://dashboard.stripe.com/test/webhooks)
2. Crea un nuevo endpoint: `https://tu-dominio.com/api/stripe/webhook`
3. Selecciona estos eventos:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copia el **Webhook signing secret** (whsec_...)

### 4. Crear Productos y Precios
Ejecuta estos comandos en la terminal de Stripe o usa el Dashboard:

```bash
# Plan Familiar - $5/mes
stripe products create --name "Plan Familiar" --description "Acceso básico al feed de progreso"
stripe prices create --product prod_xxx --unit-amount 500 --currency usd --recurring interval=month

# Plan Bronce - $25/mes
stripe products create --name "Plan Bronce" --description "Acceso completo con mención en reportes"
stripe prices create --product prod_xxx --unit-amount 2500 --currency usd --recurring interval=month

# Plan Plata - $50/mes
stripe products create --name "Plan Plata" --description "Acceso premium con contenido exclusivo"
stripe prices create --product prod_xxx --unit-amount 5000 --currency usd --recurring interval=month

# Plan Oro - $99/mes
stripe products create --name "Plan Oro" --description "Acceso VIP con llamadas trimestrales"
stripe prices create --product prod_xxx --unit-amount 9900 --currency usd --recurring interval=month
```

### 5. Actualizar Variables de Entorno
Actualiza tu archivo `.env.local` con las claves reales:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_tu_clave_secreta_aqui
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_tu_clave_publica_aqui
STRIPE_WEBHOOK_SECRET=whsec_tu_webhook_secret_aqui

# Stripe Plan Price IDs
STRIPE_FAMILY_PLAN_PRICE_ID=price_tu_price_id_familiar
STRIPE_BRONZE_PLAN_PRICE_ID=price_tu_price_id_bronce
STRIPE_SILVER_PLAN_PRICE_ID=price_tu_price_id_plata
STRIPE_GOLD_PLAN_PRICE_ID=price_tu_price_id_oro
```

### 6. Configurar Customer Portal
1. Ve a [Customer Portal](https://dashboard.stripe.com/test/settings/billing/portal)
2. Activa el Customer Portal
3. Configura las funcionalidades permitidas:
   - ✅ Cancelar suscripciones
   - ✅ Actualizar método de pago
   - ✅ Ver historial de facturas
   - ✅ Descargar facturas

### 7. Configurar Dominio para Producción
1. Ve a [Settings > Branding](https://dashboard.stripe.com/test/settings/branding)
2. Sube tu logo y configura los colores
3. Ve a [Settings > Payment methods](https://dashboard.stripe.com/test/settings/payment_methods)
4. Activa los métodos de pago que necesites

## 🧪 Modo de Prueba

### Tarjetas de Prueba
```
# Pago exitoso
4242 4242 4242 4242

# Pago fallido
4000 0000 0000 0002

# Requiere autenticación 3D Secure
4000 0025 0000 3155
```

### Datos de Prueba
- **CVC**: Cualquier código de 3 dígitos
- **Fecha de expiración**: Cualquier fecha futura
- **Código postal**: Cualquier código postal válido

## 🔒 Seguridad

### Reglas de Firestore para Stripe
```javascript
// Reglas para colecciones relacionadas con Stripe
match /donations/{donationId} {
  allow read, write: if request.auth != null && 
    (resource.data.userId == request.auth.uid || 
     request.auth.token.admin == true);
}

match /subscriptions/{subscriptionId} {
  allow read, write: if request.auth != null && 
    (resource.data.userId == request.auth.uid || 
     request.auth.token.admin == true);
}
```

### Validación de Webhooks
Los webhooks están protegidos con verificación de firma para asegurar que provienen de Stripe.

## 📊 Monitoreo

### Dashboard de Stripe
- [Payments](https://dashboard.stripe.com/test/payments)
- [Customers](https://dashboard.stripe.com/test/customers)
- [Subscriptions](https://dashboard.stripe.com/test/subscriptions)
- [Webhooks](https://dashboard.stripe.com/test/webhooks)

### Logs de la Aplicación
Los eventos de Stripe se registran en:
- `analytics_events` - Eventos de analytics
- `notifications` - Notificaciones de pago
- `realtime_events` - Eventos en tiempo real

## 🚀 Despliegue a Producción

### 1. Cambiar a Modo Live
1. Ve a [Dashboard de Stripe](https://dashboard.stripe.com)
2. Cambia de "Test mode" a "Live mode"
3. Obtén las claves de producción
4. Actualiza las variables de entorno

### 2. Configurar Webhooks de Producción
1. Crea nuevos webhooks para el dominio de producción
2. Actualiza las URLs de webhook
3. Configura el Customer Portal para producción

### 3. Verificar Configuración
1. Prueba pagos con tarjetas reales (pequeñas cantidades)
2. Verifica que los webhooks funcionen
3. Confirma que el Customer Portal esté activo

## 📞 Soporte

- [Documentación de Stripe](https://stripe.com/docs)
- [Soporte de Stripe](https://support.stripe.com)
- [Comunidad de Stripe](https://github.com/stripe/stripe-node)

---

**¡Listo!** Tu integración de Stripe está configurada y lista para procesar pagos reales.
