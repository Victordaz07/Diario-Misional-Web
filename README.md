# Diario Misional Web

Una aplicación web completa para misioneros de La Iglesia de Jesucristo de los Santos de los Últimos Días, que incluye diario personal, gestión de traslados, galería de fotos, recursos misionales, seguimiento de etapas y portal familiar.

## 🚀 Características Principales

- **Diario Personal**: Entradas diarias con categorización y búsqueda
- **Gestión de Traslados**: Historial completo de áreas y compañeros
- **Galería de Fotos**: Subida y organización de fotografías misioneras
- **Recursos Misionales**: PDFs, consejos y materiales de estudio
- **Etapas Misionales**: Seguimiento desde pre-misión hasta regreso
- **Portal Familiar**: Acceso para familiares con actualizaciones en tiempo real
- **Álbum Final**: Generación de álbum físico al final de la misión
- **Multiidioma**: Soporte para español, inglés, francés y portugués brasileño

## 🛠️ Tecnologías Utilizadas

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Font Awesome
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Deployment**: Firebase Hosting
- **PWA**: Service Workers para funcionamiento offline

## 📋 Prerrequisitos

- Node.js 18+ 
- npm o yarn
- Cuenta de Google (para Firebase)
- Firebase CLI (`npm install -g firebase-tools`)

## 🔧 Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone <repository-url>
cd diario-misional-web
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Firebase

#### Opción A: Script Automático (Recomendado)

```bash
npm run setup-firebase
```

#### Opción B: Configuración Manual

1. Crear proyecto en [Firebase Console](https://console.firebase.google.com)
2. Habilitar Authentication, Firestore y Storage
3. Copiar `env.local.example` a `.env.local`
4. Actualizar las variables de entorno con tus credenciales de Firebase

### 4. Configurar Variables de Entorno

Crear archivo `.env.local` con:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=tu-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-proyecto-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Diario Misional
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_DEV_MODE=false
```

### 5. Configurar Firebase Authentication

En Firebase Console > Authentication > Sign-in method:

- ✅ Email/Password
- ✅ Google
- ✅ Apple (opcional)

### 6. Configurar Firestore Security Rules

Las reglas ya están configuradas en `firestore.rules`. Desplegar con:

```bash
firebase deploy --only firestore
```

### 7. Configurar Storage Rules

Las reglas ya están configuradas en `storage.rules`. Desplegar con:

```bash
firebase deploy --only storage
```

## 🚀 Ejecutar en Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📱 Emuladores de Firebase (Opcional)

Para desarrollo local con emuladores:

```bash
npm run firebase:emulators
```

## 🌐 Despliegue a Producción

### Despliegue Automático

```bash
npm run deploy
```

### Despliegue Manual

```bash
npm run build
firebase deploy --only hosting
```

## 📁 Estructura del Proyecto

```
├── app/                    # App Router de Next.js
│   ├── (auth)/            # Páginas de autenticación
│   ├── (dashboard)/       # Páginas del dashboard
│   └── globals.css        # Estilos globales
├── components/            # Componentes reutilizables
│   └── ui/               # Componentes de UI
├── lib/                  # Utilidades y configuración
│   ├── firebase.ts       # Configuración de Firebase
│   ├── auth-context.tsx  # Contexto de autenticación
│   └── translations.ts   # Sistema de traducciones
├── scripts/              # Scripts de automatización
├── firebase.json         # Configuración de Firebase
├── firestore.rules       # Reglas de seguridad Firestore
└── storage.rules         # Reglas de seguridad Storage
```

## 🔐 Seguridad

- Autenticación requerida para todas las operaciones
- Usuarios solo pueden acceder a sus propios datos
- Portal familiar con acceso limitado a datos compartidos
- Reglas de seguridad configuradas para Firestore y Storage

## 🌍 Internacionalización

La aplicación soporta 4 idiomas:
- 🇪🇸 Español (por defecto)
- 🇺🇸 Inglés
- 🇫🇷 Francés
- 🇧🇷 Portugués Brasileño

## 📱 PWA (Progressive Web App)

- Funcionamiento offline
- Instalable en dispositivos móviles
- Notificaciones push (próximamente)
- Service Workers para caché inteligente

## 🧪 Testing

```bash
npm run lint          # Verificar código
npm run type-check    # Verificar tipos TypeScript
```

## 📞 Soporte

Para soporte técnico o preguntas:
- Crear issue en el repositorio
- Contactar al equipo de desarrollo

## 📄 Licencia

Este proyecto es para uso interno de La Iglesia de Jesucristo de los Santos de los Últimos Días.

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama para feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

---

**Desarrollado con ❤️ para los misioneros de La Iglesia de Jesucristo de los Santos de los Últimos Días**