import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';

// Test Firebase integration
async function testFirebaseIntegration() {
    console.log('🧪 Testing Firebase Integration...');

    // Check if we have real Firebase config
    const hasRealConfig = process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
        process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "demo-api-key-for-development" &&
        process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "your-api-key-here";

    if (!hasRealConfig) {
        console.log('⚠️  Running with mock Firebase services (no real config found)');
        console.log('📝 To test with real Firebase:');
        console.log('   1. Copy env.local.example to env.local');
        console.log('   2. Add your Firebase project credentials');
        console.log('   3. Restart the development server');
        return;
    }

    try {
        // Initialize Firebase
        const firebaseConfig = {
            apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
            authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
            appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        };

        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        const db = getFirestore(app);

        console.log('✅ Firebase initialized successfully');

        // Test authentication
        console.log('🔐 Testing authentication...');
        const userCredential = await signInAnonymously(auth);
        console.log('✅ Anonymous authentication successful');
        console.log('👤 User ID:', userCredential.user.uid);

        // Test Firestore
        console.log('📊 Testing Firestore...');
        const testCollection = collection(db, 'test');
        const testDoc = await addDoc(testCollection, {
            message: 'Firebase integration test',
            timestamp: new Date(),
            userId: userCredential.user.uid
        });
        console.log('✅ Test document created:', testDoc.id);

        // Test reading from Firestore
        const snapshot = await getDocs(testCollection);
        console.log('✅ Test documents read:', snapshot.size);

        console.log('🎉 Firebase integration test completed successfully!');
        console.log('🚀 Your Diario Misional app is ready to use Firebase!');

    } catch (error) {
        console.error('❌ Firebase integration test failed:', error);
        console.log('🔧 Please check your Firebase configuration and try again');
    }
}

// Run the test if this file is executed directly
if (typeof window === 'undefined') {
    // Node.js environment
    testFirebaseIntegration();
}

export { testFirebaseIntegration };
