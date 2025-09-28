# Diario Misional Web

Una aplicación web moderna para misioneros que permite documentar experiencias, registrar traslados, gestionar fotos y acceder a recursos útiles.

## 🚀 Características

- **Diario Personal**: Documenta tus experiencias y reflexiones diarias
- **Registro de Traslados**: Mantén un registro de tus cambios de área cada 6 semanas
- **Galería de Fotos**: Guarda y organiza las fotos de tu experiencia misionera
- **Recursos de Estudio**: Accede a materiales y herramientas útiles
- **Perfil Personal**: Administra tu información y estadísticas
- **PWA**: Funciona como aplicación móvil nativa

## 🛠️ Tecnologías

- **Frontend**: Next.js 15 con App Router
- **Lenguaje**: TypeScript
- **Estilos**: TailwindCSS + shadcn/ui
- **Backend**: Firebase (Auth, Firestore, Storage)
- **PWA**: next-pwa para funcionalidad offline

## 📦 Instalación

1. Clona el repositorio:
```bash
git clone <repository-url>
cd diario-misional-web
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
```bash
cp env.example .env.local
```

Completa las variables de Firebase en `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. Ejecuta el servidor de desarrollo:
```bash
npm run dev
```

5. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🔧 Configuración de Firebase

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilita Authentication con Email/Password
3. Crea una base de datos Firestore
4. Configura Storage para las fotos
5. Copia las credenciales a tu archivo `.env.local`

## 📱 PWA

La aplicación está configurada como PWA (Progressive Web App):
- Instalable en dispositivos móviles
- Funciona offline (con cache)
- Notificaciones push (futuro)
- Experiencia nativa

## 🏗️ Estructura del Proyecto

```
diario-misional-web/
├── app/
│   ├── (auth)/          # Páginas de autenticación
│   ├── (dashboard)/      # Páginas principales
│   ├── globals.css       # Estilos globales
│   ├── layout.tsx        # Layout principal
│   └── page.tsx          # Página de inicio
├── components/
│   └── ui/               # Componentes de shadcn/ui
├── lib/
│   ├── firebase.ts       # Configuración Firebase
│   ├── auth-context.tsx  # Contexto de autenticación
│   ├── types.ts          # Tipos TypeScript
│   └── utils.ts          # Utilidades
├── public/
│   └── manifest.json     # Configuración PWA
└── middleware.ts          # Protección de rutas
```

## 🚀 Despliegue

### Vercel (Recomendado)
1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno
3. Despliega automáticamente

### Otras plataformas
- Netlify
- Firebase Hosting
- Railway
- Render

## 📄 Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Construir para producción
- `npm run start` - Servidor de producción
- `npm run lint` - Linter de código
- `npm run type-check` - Verificación de tipos

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org/) - Framework React
- [TailwindCSS](https://tailwindcss.com/) - Framework CSS
- [shadcn/ui](https://ui.shadcn.com/) - Componentes UI
- [Firebase](https://firebase.google.com/) - Backend como servicio
- [Lucide React](https://lucide.dev/) - Iconos
