#!/bin/bash

# Firebase Setup Script for Diario Misional
# This script helps you set up Firebase for the project

echo "🔥 Firebase Setup for Diario Misional"
echo "======================================"

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI is not installed."
    echo "Please install it first:"
    echo "npm install -g firebase-tools"
    echo ""
    read -p "Press Enter to continue after installing Firebase CLI..."
fi

# Check if user is logged in to Firebase
if ! firebase projects:list &> /dev/null; then
    echo "🔐 Please log in to Firebase:"
    firebase login
fi

echo ""
echo "📋 Available Firebase projects:"
firebase projects:list

echo ""
echo "🚀 Let's create a new Firebase project for Diario Misional"
echo ""

# Get project details
read -p "Enter your Firebase project ID (e.g., diario-misional-2024): " PROJECT_ID
read -p "Enter your project display name (e.g., Diario Misional): " PROJECT_NAME

echo ""
echo "🔧 Creating Firebase project..."

# Create Firebase project
firebase projects:create $PROJECT_ID --display-name "$PROJECT_NAME"

echo ""
echo "📱 Setting up Firebase services..."

# Enable required services
echo "Enabling Authentication..."
firebase auth:enable

echo "Enabling Firestore Database..."
firebase firestore:enable

echo "Enabling Storage..."
firebase storage:enable

echo ""
echo "🔑 Getting Firebase configuration..."

# Get Firebase config
firebase apps:create web "Diario Misional Web" --project $PROJECT_ID

echo ""
echo "📝 Creating .env.local file..."

# Create .env.local file
cat > .env.local << EOF
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
EOF

echo ""
echo "✅ Firebase project created successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Go to Firebase Console: https://console.firebase.google.com/project/$PROJECT_ID"
echo "2. Get your actual Firebase config from Project Settings > General > Your apps"
echo "3. Update the .env.local file with the real values"
echo "4. Configure Authentication providers (Email/Password, Google, Apple)"
echo "5. Set up Firestore security rules"
echo "6. Configure Storage rules"
echo ""
echo "🔗 Firebase Console: https://console.firebase.google.com/project/$PROJECT_ID"
echo ""

# Open Firebase Console
if command -v open &> /dev/null; then
    open "https://console.firebase.google.com/project/$PROJECT_ID"
elif command -v xdg-open &> /dev/null; then
    xdg-open "https://console.firebase.google.com/project/$PROJECT_ID"
fi

echo "🎉 Setup complete! You can now run 'npm run dev' to start the development server."
