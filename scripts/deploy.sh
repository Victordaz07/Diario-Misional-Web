#!/bin/bash

# Deploy Script for Diario Misional
# This script builds and deploys the project to Firebase Hosting

echo "🚀 Deploying Diario Misional to Firebase"
echo "========================================"

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI is not installed."
    echo "Please install it first:"
    echo "npm install -g firebase-tools"
    exit 1
fi

# Check if user is logged in to Firebase
if ! firebase projects:list &> /dev/null; then
    echo "🔐 Please log in to Firebase:"
    firebase login
fi

echo ""
echo "📦 Building the project..."

# Build the project
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi

echo ""
echo "✅ Build completed successfully!"

echo ""
echo "🔥 Deploying to Firebase Hosting..."

# Deploy to Firebase
firebase deploy --only hosting

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Deployment successful!"
    echo ""
    echo "🌐 Your app is now live at:"
    firebase hosting:channel:list --project $(firebase use --current) | grep "live" | awk '{print $2}' || echo "Check Firebase Console for your hosting URL"
    echo ""
    echo "📊 Firebase Console: https://console.firebase.google.com/project/$(firebase use --current)"
else
    echo "❌ Deployment failed. Please check the errors above."
    exit 1
fi
