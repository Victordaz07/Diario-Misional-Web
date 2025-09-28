# 🚀 Guía de Instalación - Diario Misional Web

## 📋 Prerrequisitos

- Node.js 18+ 
- npm o yarn
- Cuenta de Firebase

## ⚡ Instalación Rápida

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto llamado "diario-misional-web"
3. Habilita Authentication:
   - Ve a Authentication > Sign-in method
   - Habilita "Email/Password"
4. Crea una base de datos Firestore:
   - Ve a Firestore Database
   - Crea base de datos en modo de prueba
5. Configura Storage:
   - Ve a Storage
   - Crea bucket de almacenamiento

### 3. Configurar variables de entorno

1. Copia el archivo de ejemplo:
```bash
cp env.example .env.local
```

2. Obtén las credenciales de Firebase:
   - Ve a Project Settings > General
   - En "Your apps" haz clic en "Add app" > Web
   - Copia las credenciales

3. Completa `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key_aqui
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
```

### 4. Ejecutar la aplicación

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## 🔧 Configuración Adicional

### Reglas de Firestore (Opcional)

Para mayor seguridad, configura estas reglas en Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuarios solo pueden leer/escribir sus propios datos
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Entradas del diario
    match /diario/{entryId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.uid;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.uid;
    }
    
    // Traslados
    match /traslados/{transferId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.uid;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.uid;
    }
    
    // Fotos
    match /fotos/{photoId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.uid;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.uid;
    }
    
    // Recursos (públicos para lectura)
    match /recursos/{resourceId} {
      allow read: if true;
      allow write: if false; // Solo admins pueden escribir
    }
  }
}
```

### Reglas de Storage (Opcional)

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /fotos/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 🚀 Despliegue

### Vercel (Recomendado)

1. Conecta tu repositorio a [Vercel](https://vercel.com)
2. Configura las variables de entorno en el dashboard de Vercel
3. Despliega automáticamente

### Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

## 🐛 Solución de Problemas

### Error: "Firebase not initialized"
- Verifica que las variables de entorno estén configuradas correctamente
- Asegúrate de que el archivo `.env.local` existe

### Error: "Permission denied"
- Verifica las reglas de Firestore
- Asegúrate de que el usuario esté autenticado

### Error: "Module not found"
- Ejecuta `npm install` para instalar todas las dependencias
- Verifica que estés en el directorio correcto

## 📱 PWA

La aplicación funciona como PWA:
- Instalable en dispositivos móviles
- Funciona offline (con cache)
- Notificaciones push (futuro)

Para instalar:
1. Abre la aplicación en Chrome/Safari móvil
2. Toca el botón "Instalar" en la barra de direcciones
3. O ve a Configuración > Agregar a pantalla de inicio

## 🎯 Próximos Pasos

1. **Personalizar**: Modifica colores, textos y funcionalidades
2. **Agregar funciones**: Implementa CRUD completo para cada sección
3. **Mejorar UX**: Añade animaciones y transiciones
4. **Testing**: Implementa tests unitarios y de integración
5. **Analytics**: Agrega Google Analytics o Firebase Analytics

## 📞 Soporte

Si tienes problemas:
1. Revisa la documentación de [Next.js](https://nextjs.org/docs)
2. Consulta la documentación de [Firebase](https://firebase.google.com/docs)
3. Revisa los logs en la consola del navegador
4. Verifica que todas las dependencias estén instaladas

¡Disfruta construyendo tu Diario Misional! 🎉
