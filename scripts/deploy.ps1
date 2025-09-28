# Deploy Script for Diario Misional (PowerShell)
# This script builds and deploys the project to Firebase Hosting

Write-Host "🚀 Deploying Diario Misional to Firebase" -ForegroundColor Red
Write-Host "========================================" -ForegroundColor Red

# Check if Firebase CLI is installed
try {
    firebase --version | Out-Null
} catch {
    Write-Host "❌ Firebase CLI is not installed." -ForegroundColor Red
    Write-Host "Please install it first:" -ForegroundColor Yellow
    Write-Host "npm install -g firebase-tools" -ForegroundColor Cyan
    exit 1
}

# Check if user is logged in to Firebase
try {
    firebase projects:list | Out-Null
} catch {
    Write-Host "🔐 Please log in to Firebase:" -ForegroundColor Yellow
    firebase login
}

Write-Host ""
Write-Host "📦 Building the project..." -ForegroundColor Yellow

# Build the project
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed. Please fix the errors and try again." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Build completed successfully!" -ForegroundColor Green

Write-Host ""
Write-Host "🔥 Deploying to Firebase Hosting..." -ForegroundColor Yellow

# Deploy to Firebase
firebase deploy --only hosting

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "🎉 Deployment successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Your app is now live at:" -ForegroundColor Cyan
    
    # Get current project
    $currentProject = firebase use --current
    Write-Host "📊 Firebase Console: https://console.firebase.google.com/project/$currentProject" -ForegroundColor Cyan
} else {
    Write-Host "❌ Deployment failed. Please check the errors above." -ForegroundColor Red
    exit 1
}
