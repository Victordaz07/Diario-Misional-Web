# Firebase Setup Script for Diario Misional (PowerShell)
# This script helps you set up Firebase for the project

Write-Host "🔥 Firebase Setup for Diario Misional" -ForegroundColor Red
Write-Host "======================================" -ForegroundColor Red

# Check if Firebase CLI is installed
try {
    firebase --version | Out-Null
} catch {
    Write-Host "❌ Firebase CLI is not installed." -ForegroundColor Red
    Write-Host "Please install it first:" -ForegroundColor Yellow
    Write-Host "npm install -g firebase-tools" -ForegroundColor Cyan
    Read-Host "Press Enter to continue after installing Firebase CLI"
}

# Check if user is logged in to Firebase
try {
    firebase projects:list | Out-Null
} catch {
    Write-Host "🔐 Please log in to Firebase:" -ForegroundColor Yellow
    firebase login
}

Write-Host ""
Write-Host "📋 Available Firebase projects:" -ForegroundColor Green
firebase projects:list

Write-Host ""
Write-Host "🚀 Let's create a new Firebase project for Diario Misional" -ForegroundColor Green
Write-Host ""

# Get project details
$PROJECT_ID = Read-Host "Enter your Firebase project ID (e.g., diario-misional-2024)"
$PROJECT_NAME = Read-Host "Enter your project display name (e.g., Diario Misional)"

Write-Host ""
Write-Host "🔧 Creating Firebase project..." -ForegroundColor Yellow

# Create Firebase project
firebase projects:create $PROJECT_ID --display-name "$PROJECT_NAME"

Write-Host ""
Write-Host "📱 Setting up Firebase services..." -ForegroundColor Yellow

# Enable required services
Write-Host "Enabling Authentication..." -ForegroundColor Cyan
firebase auth:enable

Write-Host "Enabling Firestore Database..." -ForegroundColor Cyan
firebase firestore:enable

Write-Host "Enabling Storage..." -ForegroundColor Cyan
firebase storage:enable

Write-Host ""
Write-Host "🔑 Getting Firebase configuration..." -ForegroundColor Yellow

# Get Firebase config
firebase apps:create web "Diario Misional Web" --project $PROJECT_ID

Write-Host ""
Write-Host "📝 Creating .env.local file..." -ForegroundColor Yellow

# Create .env.local file
$envContent = @"
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$PROJECT_ID.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=$PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$PROJECT_ID.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Diario Misional
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_DEV_MODE=false
"@

$envContent | Out-File -FilePath ".env.local" -Encoding UTF8

Write-Host ""
Write-Host "✅ Firebase project created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Yellow
Write-Host "1. Go to Firebase Console: https://console.firebase.google.com/project/$PROJECT_ID" -ForegroundColor Cyan
Write-Host "2. Get your actual Firebase config from Project Settings > General > Your apps" -ForegroundColor Cyan
Write-Host "3. Update the .env.local file with the real values" -ForegroundColor Cyan
Write-Host "4. Configure Authentication providers (Email/Password, Google, Apple)" -ForegroundColor Cyan
Write-Host "5. Set up Firestore security rules" -ForegroundColor Cyan
Write-Host "6. Configure Storage rules" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔗 Firebase Console: https://console.firebase.google.com/project/$PROJECT_ID" -ForegroundColor Cyan
Write-Host ""

# Open Firebase Console
Start-Process "https://console.firebase.google.com/project/$PROJECT_ID"

Write-Host "🎉 Setup complete! You can now run 'npm run dev' to start the development server." -ForegroundColor Green
