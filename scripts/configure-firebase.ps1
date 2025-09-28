# Script para configurar Firebase fácilmente
# Ejecuta este script después de crear tu proyecto en Firebase Console

Write-Host "🔥 Configuración de Firebase para Diario Misional" -ForegroundColor Red
Write-Host "=================================================" -ForegroundColor Red

Write-Host ""
Write-Host "📋 Pasos para configurar Firebase:" -ForegroundColor Yellow
Write-Host "1. Ve a Firebase Console: https://console.firebase.google.com" -ForegroundColor Cyan
Write-Host "2. Crea un nuevo proyecto" -ForegroundColor Cyan
Write-Host "3. Habilita Authentication, Firestore y Storage" -ForegroundColor Cyan
Write-Host "4. Ve a Configuración del proyecto > Tu aplicación > Web" -ForegroundColor Cyan
Write-Host "5. Copia la configuración" -ForegroundColor Cyan
Write-Host ""

# Solicitar información del proyecto
$PROJECT_ID = Read-Host "Ingresa tu Project ID de Firebase"
$API_KEY = Read-Host "Ingresa tu API Key de Firebase"
$AUTH_DOMAIN = Read-Host "Ingresa tu Auth Domain (ej: proyecto.firebaseapp.com)"
$STORAGE_BUCKET = Read-Host "Ingresa tu Storage Bucket (ej: proyecto.appspot.com)"
$MESSAGING_SENDER_ID = Read-Host "Ingresa tu Messaging Sender ID"
$APP_ID = Read-Host "Ingresa tu App ID"

Write-Host ""
Write-Host "📝 Creando archivo .env.local..." -ForegroundColor Yellow

# Crear archivo .env.local
$envContent = @"
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=$API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID=$PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=$APP_ID

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Diario Misional
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_DEV_MODE=false
"@

$envContent | Out-File -FilePath ".env.local" -Encoding UTF8

Write-Host ""
Write-Host "✅ Archivo .env.local creado exitosamente!" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Próximos pasos:" -ForegroundColor Yellow
Write-Host "1. Reinicia el servidor de desarrollo: npm run dev" -ForegroundColor Cyan
Write-Host "2. Ve a Firebase Console y configura Authentication" -ForegroundColor Cyan
Write-Host "3. Configura Firestore security rules" -ForegroundColor Cyan
Write-Host "4. Configura Storage rules" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔗 Firebase Console: https://console.firebase.google.com/project/$PROJECT_ID" -ForegroundColor Cyan

# Abrir Firebase Console
Start-Process "https://console.firebase.google.com/project/$PROJECT_ID"
