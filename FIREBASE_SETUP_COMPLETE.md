# 🔥 Configuración de Firebase - Diario Misional

## Configuración Inicial

### 1. Crear Proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Crear un proyecto"
3. Nombra tu proyecto (ej: "diario-misional")
4. Habilita Google Analytics (opcional)
5. Crea el proyecto

### 2. Configurar Authentication

1. En el panel lateral, ve a "Authentication"
2. Haz clic en "Comenzar"
3. Ve a la pestaña "Sign-in method"
4. Habilita "Correo electrónico/contraseña"
5. Opcionalmente habilita "Google" para login social

### 3. Configurar Firestore Database

1. En el panel lateral, ve a "Firestore Database"
2. Haz clic en "Crear base de datos"
3. Selecciona "Iniciar en modo de prueba" (para desarrollo)
4. Elige una ubicación para tu base de datos

### 4. Configurar Storage

1. En el panel lateral, ve a "Storage"
2. Haz clic en "Comenzar"
3. Acepta las reglas de seguridad por defecto
4. Elige la misma ubicación que Firestore

### 5. Obtener Configuración del Proyecto

1. Ve a "Configuración del proyecto" (ícono de engranaje)
2. Desplázate hacia abajo hasta "Tus aplicaciones"
3. Haz clic en "Agregar aplicación" y selecciona "Web" (ícono `</>`)
4. Registra tu aplicación con un nombre (ej: "diario-misional-web")
5. Copia la configuración de Firebase

### 6. Configurar Variables de Entorno

1. Copia `env.local.example` a `env.local`
2. Reemplaza los valores con tu configuración de Firebase:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=tu-api-key-aqui
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-proyecto-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

## Estructura de Datos en Firestore

### Colecciones Principales

#### `diaryEntries`
```javascript
{
  userId: string,
  content: string,
  date: Timestamp,
  spiritualMoment?: string,
  audioUrl?: string,
  imageUrl?: string,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

#### `dailySchedule`
```javascript
{
  userId: string,
  time: string,
  activity: string,
  description: string,
  status: 'completed' | 'pending' | 'cancelled',
  date: Timestamp,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

#### `investigators`
```javascript
{
  userId: string,
  name: string,
  type: 'Lecciones' | 'Fecha de bautismo' | 'Reactivación',
  progress: string,
  nextAppointment: string,
  progressPercent: number,
  phone?: string,
  address?: string,
  notes?: string,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

#### `transfers`
```javascript
{
  userId: string,
  areaName: string,
  companion: string,
  startDate: Timestamp,
  endDate?: Timestamp,
  baptisms: number,
  goals: Array<{
    text: string,
    completed: boolean
  }>,
  isActive: boolean,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

#### `missionStats`
```javascript
{
  userId: string,
  monthsInService: number,
  teachings: number,
  baptisms: number,
  transfers: number,
  teachingHours: number,
  commitmentsFulfilled: number,
  lastUpdated: Timestamp
}
```

#### `spiritualMoments`
```javascript
{
  userId: string,
  content: string,
  date: Timestamp,
  type: 'prayer' | 'miracle' | 'testimony' | 'other',
  createdAt: Timestamp
}
```

#### `testimonies`
```javascript
{
  userId: string,
  content: string,
  weekStart: Timestamp,
  weekEnd: Timestamp,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

## Reglas de Seguridad

### Firestore Rules (`firestore.rules`)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /{collection}/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Mission stats are stored with userId as document ID
    match /missionStats/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Storage Rules (`storage.rules`)
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Comandos de Desarrollo

### Instalar dependencias
```bash
npm install
```

### Ejecutar en modo desarrollo
```bash
npm run dev
```

### Ejecutar emuladores de Firebase (opcional)
```bash
firebase emulators:start
```

### Desplegar a Firebase Hosting
```bash
npm run build
firebase deploy
```

## Funcionalidades Implementadas

### ✅ Dashboard Principal
- Progreso misional con estadísticas en tiempo real
- Agenda diaria con citas interactivas
- Diario misional con entradas
- Gestión de investigadores/amigos
- Información de traslados y áreas
- Recursos misionales
- Reflexión y testimonios
- Medallas y logros

### ✅ Servicios de Firebase
- `DiaryService`: Gestión de entradas del diario
- `ScheduleService`: Agenda diaria y citas
- `InvestigatorsService`: CRUD de investigadores
- `TransfersService`: Gestión de traslados
- `MissionStatsService`: Estadísticas misionales
- `SpiritualMomentsService`: Momentos espirituales
- `TestimonyService`: Testimonios semanales
- `FileUploadService`: Subida de archivos

### ✅ Hooks Personalizados
- `useDiary`: Hook para el diario
- `useSchedule`: Hook para la agenda
- `useInvestigators`: Hook para investigadores
- `useTransfers`: Hook para traslados
- `useMissionStats`: Hook para estadísticas
- `useSpiritualMoments`: Hook para momentos espirituales
- `useTestimonies`: Hook para testimonios
- `useFileUpload`: Hook para subida de archivos

## Próximos Pasos

1. **Configurar Firebase** con tus credenciales reales
2. **Probar la aplicación** en modo desarrollo
3. **Personalizar** las reglas de seguridad según tus necesidades
4. **Desplegar** a Firebase Hosting para producción
5. **Añadir más funcionalidades** como notificaciones push, sincronización offline, etc.

## Soporte

Si tienes problemas con la configuración:
1. Verifica que todas las variables de entorno estén configuradas correctamente
2. Asegúrate de que las reglas de Firestore y Storage permitan acceso a usuarios autenticados
3. Revisa la consola del navegador para errores de Firebase
4. Verifica que el proyecto de Firebase esté configurado correctamente

¡Tu aplicación Diario Misional está lista para usar con Firebase! 🚀
