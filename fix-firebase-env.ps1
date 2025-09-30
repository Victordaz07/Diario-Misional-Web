# Script para corregir variables de entorno de Firebase
Write-Host "🔧 Corrigiendo variables de entorno de Firebase..." -ForegroundColor Green

# Primero, eliminar todas las variables existentes
Write-Host "🗑️ Eliminando variables existentes..." -ForegroundColor Yellow

$envVars = @(
    "NEXT_PUBLIC_FIREBASE_API_KEY",
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN", 
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
    "NEXT_PUBLIC_FIREBASE_APP_ID",
    "NEXT_PUBLIC_DEV_MODE"
)

foreach ($var in $envVars) {
    Write-Host "Eliminando $var..." -ForegroundColor Cyan
    echo "y" | vercel env rm $var production
}

Write-Host "`n🚀 Configurando variables corregidas..." -ForegroundColor Green

# Configurar variables sin saltos de línea
$cleanEnvVars = @{
    "NEXT_PUBLIC_FIREBASE_API_KEY" = "AIzaSyBXuuuUdkoTOwx2zCvYC3y4ALfZfyPJOVk"
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN" = "diario-misional.firebaseapp.com"
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID" = "diario-misional"
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET" = "diario-misional.firebasestorage.app"
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID" = "111069405449"
    "NEXT_PUBLIC_FIREBASE_APP_ID" = "1:111069405449:web:981098a7ba92373ebd33d8"
    "NEXT_PUBLIC_DEV_MODE" = "false"
}

foreach ($envVar in $cleanEnvVars.GetEnumerator()) {
    Write-Host "Configurando $($envVar.Key)..." -ForegroundColor Yellow
    # Usar Write-Output para evitar saltos de línea
    $envVar.Value | vercel env add $envVar.Key production
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ $($envVar.Key) configurado correctamente" -ForegroundColor Green
    } else {
        Write-Host "❌ Error configurando $($envVar.Key)" -ForegroundColor Red
    }
}

Write-Host "`n🎉 ¡Variables de entorno corregidas!" -ForegroundColor Green
Write-Host "💡 Ahora haz un nuevo deployment para aplicar los cambios." -ForegroundColor Cyan
