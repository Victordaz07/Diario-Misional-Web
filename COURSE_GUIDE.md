# 📚 **GUÍA DE CURSO - DIARIO MISIONAL WEB**

## 🎯 **OBJETIVO DEL CURSO**

Este proyecto es un caso de estudio completo para aprender **Next.js 15**, **Firebase**, **TypeScript** y **Tailwind CSS** construyendo una aplicación web real para misioneros de La Iglesia de Jesucristo de los Santos de los Últimos Días.

## 📋 **CONCEPTOS CLAVE IMPLEMENTADOS**

### **1. Next.js 15 - App Router**

#### **Estructura de Archivos**
```
app/
├── (auth)/              # Grupo de rutas de autenticación
│   ├── layout.tsx        # Layout específico para auth
│   ├── login/page.tsx    # Página de login
│   └── register/page.tsx # Página de registro
├── (dashboard)/          # Grupo de rutas del dashboard
│   ├── layout.tsx        # Layout del dashboard
│   ├── dashboard/page.tsx
│   ├── diario/page.tsx
│   └── ...
└── layout.tsx            # Layout raíz
```

#### **Conceptos Clave:**
- **Route Groups**: `(auth)` y `(dashboard)` para organizar rutas sin afectar la URL
- **Layouts Anidados**: Cada grupo tiene su propio layout
- **Server Components**: Componentes que se renderizan en el servidor
- **Client Components**: Componentes interactivos con `'use client'`

#### **Ejemplo Práctico:**
```tsx
// app/(dashboard)/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-64 p-6">
        {children}
      </main>
    </div>
  )
}
```

### **2. Firebase - Backend as a Service**

#### **Servicios Implementados:**
- **Authentication**: Login/registro con email, Google, Apple
- **Firestore**: Base de datos NoSQL para datos del usuario
- **Storage**: Almacenamiento de imágenes y archivos
- **Analytics**: Métricas de uso de la aplicación

#### **Estructura de Datos:**
```typescript
// Colecciones principales
diaryEntries/     // Entradas del diario
transfers/        // Historial de traslados
photos/          // Galería de fotos
people/          // Lista de investigadores
resources/       // Recursos misionales
viewerInvites/   // Invitaciones para familiares
```

#### **Reglas de Seguridad:**
```javascript
// firestore.rules
match /diaryEntries/{entryId} {
  allow read, write: if isValidUser() && 
                        isOwner(resource.data.userId);
}
```

### **3. TypeScript - Tipado Estático**

#### **Interfaces Principales:**
```typescript
interface DiaryEntry {
  id?: string;
  userId: string;
  title: string;
  content: string;
  category: 'spiritual' | 'teaching' | 'service' | 'personal';
  mood: 'excellent' | 'good' | 'neutral' | 'difficult';
  tags: string[];
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

#### **Hooks Personalizados:**
```typescript
// lib/hooks/use-firestore.ts
export const useFirestore = <T>(
  collectionName: string,
  options: FirestoreHookOptions = {}
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // ... lógica del hook
};
```

### **4. Tailwind CSS - Utility-First CSS**

#### **Sistema de Diseño:**
```css
/* tailwind.config.js */
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        secondary: '#7c3aed',
        accent: '#f59e0b',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
}
```

#### **Componentes Reutilizables:**
```tsx
// components/ui/button.tsx
const Button = ({ variant = 'primary', size = 'md', ...props }) => {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium',
        variants[variant],
        sizes[size]
      )}
      {...props}
    />
  );
};
```

## 🛠️ **ARQUITECTURA DEL PROYECTO**

### **Separación de Responsabilidades:**

```
lib/
├── services/           # Lógica de negocio
│   ├── diary-service.ts
│   ├── transfer-service.ts
│   └── photo-service.ts
├── hooks/             # Hooks personalizados
│   ├── use-auth.ts
│   ├── use-firestore.ts
│   └── use-storage.ts
└── utils/             # Utilidades
    └── utils.ts

components/
├── ui/                # Componentes base
│   ├── button.tsx
│   ├── input.tsx
│   └── card.tsx
└── forms/             # Formularios específicos
    ├── diary-form.tsx
    └── transfer-form.tsx
```

### **Patrones de Diseño Implementados:**

1. **Repository Pattern**: Servicios para acceso a datos
2. **Custom Hooks**: Lógica reutilizable
3. **Compound Components**: Componentes complejos
4. **Provider Pattern**: Context para estado global

## 🚀 **CÓMO EXTENDER EL PROYECTO**

### **Agregar un Nuevo Módulo (Ejemplo: Notas)**

#### **1. Crear el Servicio:**
```typescript
// lib/services/notes-service.ts
export class NotesService {
  static async createNote(userId: string, note: NoteData): Promise<string> {
    // Implementar lógica
  }
  
  static async getNotes(userId: string): Promise<Note[]> {
    // Implementar lógica
  }
}
```

#### **2. Crear el Hook:**
```typescript
// lib/hooks/use-notes.ts
export const useNotes = (userId: string) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Implementar lógica
  return { notes, loading, createNote, updateNote, deleteNote };
};
```

#### **3. Crear la Página:**
```tsx
// app/(dashboard)/notas/page.tsx
export default function NotasPage() {
  const { user } = useAuth();
  const { notes, loading, createNote } = useNotes(user?.uid);
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Mis Notas</h1>
      {/* Implementar UI */}
    </div>
  );
}
```

#### **4. Agregar a la Navegación:**
```tsx
// components/sidebar.tsx
const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: 'fa-home' },
  { href: '/diario', label: 'Diario', icon: 'fa-book' },
  { href: '/notas', label: 'Notas', icon: 'fa-sticky-note' }, // Nuevo
  // ...
];
```

### **Agregar una Nueva Funcionalidad (Ejemplo: Búsqueda Avanzada)**

#### **1. Crear el Componente:**
```tsx
// components/search/advanced-search.tsx
export const AdvancedSearch = ({ onSearch }: SearchProps) => {
  const [filters, setFilters] = useState<SearchFilters>({});
  
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      {/* Implementar filtros */}
    </div>
  );
};
```

#### **2. Integrar en la Página:**
```tsx
// app/(dashboard)/diario/page.tsx
export default function DiarioPage() {
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  
  return (
    <div>
      <button onClick={() => setShowAdvancedSearch(true)}>
        Búsqueda Avanzada
      </button>
      
      {showAdvancedSearch && (
        <AdvancedSearch onSearch={handleSearch} />
      )}
    </div>
  );
}
```

## 🧪 **TESTING Y CALIDAD**

### **Testing Unitario con Jest:**
```typescript
// tests/unit/components.test.tsx
describe('Button Component', () => {
  test('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
```

### **Testing E2E con Playwright:**
```typescript
// tests/e2e/app.spec.ts
test('should create diary entry', async ({ page }) => {
  await page.goto('/diario');
  await page.fill('[name="title"]', 'Mi primera entrada');
  await page.click('button[type="submit"]');
  await expect(page.locator('.success-message')).toBeVisible();
});
```

### **Análisis de Performance:**
```bash
npm run lighthouse  # Análisis de Lighthouse
npm run analyze     # Build + Lighthouse
```

## 📊 **MÉTRICAS Y ANALYTICS**

### **Firebase Analytics:**
```typescript
// lib/analytics-service.ts
export const trackEvent = (eventName: string, parameters?: any) => {
  if (typeof window !== 'undefined') {
    gtag('event', eventName, parameters);
  }
};
```

### **Métricas Personalizadas:**
```typescript
// Ejemplo de uso
trackEvent('diary_entry_created', {
  category: 'spiritual',
  mood: 'excellent'
});
```

## 🔒 **SEGURIDAD IMPLEMENTADA**

### **Autenticación:**
- Verificación de email requerida
- Tokens JWT seguros
- Sesiones persistentes

### **Autorización:**
- Reglas de Firestore por usuario
- Validación en frontend y backend
- Acceso limitado por roles

### **Validación de Datos:**
```typescript
// lib/hooks/use-form.ts
const validationRules = {
  email: { required: true, email: true },
  password: { required: true, minLength: 6 },
};
```

## 🌍 **INTERNACIONALIZACIÓN**

### **Sistema de Traducciones:**
```typescript
// lib/translations.ts
export const translations = {
  es: {
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
  },
  en: {
    'common.save': 'Save',
    'common.cancel': 'Cancel',
  },
};
```

### **Uso en Componentes:**
```tsx
const { t } = useTranslations();
return <Button>{t('common.save')}</Button>;
```

## 📱 **PWA (Progressive Web App)**

### **Service Worker:**
```javascript
// public/sw.js
self.addEventListener('fetch', (event) => {
  // Estrategia de caché
});
```

### **Manifest:**
```json
// public/manifest.json
{
  "name": "Diario Misional",
  "short_name": "Diario",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#2563eb"
}
```

## 🚀 **DEPLOY Y CI/CD**

### **GitHub Actions:**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Firebase
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: npm install
      - name: Run tests
        run: npm run test:all
      - name: Build
        run: npm run build
      - name: Deploy to Firebase
        run: npm run firebase:deploy
```

## 📚 **PREGUNTAS DE REPASO**

### **Nivel Básico:**

1. **¿Qué es Next.js App Router y cómo difiere del Pages Router?**
   - App Router usa archivos y carpetas para definir rutas
   - Soporte nativo para Server Components
   - Layouts anidados y grupos de rutas

2. **¿Cómo funciona la autenticación en Firebase?**
   - Firebase Auth maneja usuarios y sesiones
   - Tokens JWT para verificación
   - Múltiples proveedores (email, Google, Apple)

3. **¿Qué son las reglas de seguridad de Firestore?**
   - Reglas que controlan acceso a datos
   - Se ejecutan en el servidor
   - Basadas en autenticación y autorización

### **Nivel Intermedio:**

4. **¿Cómo implementarías un sistema de notificaciones en tiempo real?**
   - Usar Firebase Cloud Messaging
   - WebSockets para actualizaciones instantáneas
   - Service Workers para notificaciones push

5. **¿Cómo optimizarías el rendimiento de la aplicación?**
   - Lazy loading de componentes
   - Optimización de imágenes con Next.js Image
   - Caché inteligente con Service Workers

6. **¿Cómo manejarías el estado global en la aplicación?**
   - Context API para estado compartido
   - Custom hooks para lógica reutilizable
   - Zustand o Redux para estado complejo

### **Nivel Avanzado:**

7. **¿Cómo implementarías un sistema de roles y permisos?**
   - Custom claims en Firebase Auth
   - Middleware para verificación de roles
   - Reglas de Firestore basadas en roles

8. **¿Cómo escalarías la aplicación para miles de usuarios?**
   - Implementar paginación en Firestore
   - Usar Cloud Functions para lógica pesada
   - CDN para assets estáticos

9. **¿Cómo implementarías testing en una aplicación tan compleja?**
   - Testing unitario para componentes
   - Testing de integración para servicios
   - Testing E2E para flujos completos

## 🎯 **EJERCICIOS PRÁCTICOS**

### **Ejercicio 1: Agregar un Módulo de Recordatorios**
- Crear servicio para recordatorios
- Implementar hook personalizado
- Crear página con CRUD completo
- Agregar tests unitarios

### **Ejercicio 2: Implementar Búsqueda Global**
- Crear componente de búsqueda
- Implementar búsqueda en múltiples colecciones
- Agregar filtros avanzados
- Optimizar con debounce

### **Ejercicio 3: Crear Dashboard de Analytics**
- Implementar métricas personalizadas
- Crear gráficos con Chart.js
- Agregar exportación de datos
- Implementar filtros por fecha

## 📖 **RECURSOS ADICIONALES**

### **Documentación Oficial:**
- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

### **Cursos Recomendados:**
- Next.js 15 Complete Course
- Firebase Masterclass
- TypeScript for React Developers
- Tailwind CSS Deep Dive

### **Herramientas Útiles:**
- [Firebase Emulator Suite](https://firebase.google.com/docs/emulator-suite)
- [Next.js DevTools](https://nextjs.org/docs/app/building-your-application/configuring/devtools)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

---

**¡Felicitaciones por completar este proyecto! Has construido una aplicación web profesional completa con las tecnologías más modernas del desarrollo web.** 🎉
