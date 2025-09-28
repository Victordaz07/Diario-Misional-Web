import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-api-key-for-development",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-project-id",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abcdef123456",
};

// Initialize Firebase only if we have valid config
let app: any = null;
let auth: any = null;
let db: any = null;
let storage: any = null;

// Mock updateProfile function
const mockUpdateProfile = (user: any, profile: any) => {
    return Promise.resolve();
};

// Mock GoogleAuthProvider
const mockGoogleAuthProvider = () => ({
    addScope: () => { },
});

// Mock OAuthProvider
const mockOAuthProvider = (providerId: string) => ({
    addScope: () => { },
});

// Mock signInWithPopup
const mockSignInWithPopup = (auth: any, provider: any) => {
    return Promise.resolve({
        user: {
            uid: "demo-user",
            email: "demo@example.com",
            displayName: "Demo User"
        }
    });
};

try {
    // Check if we have real Firebase config
    const hasRealConfig = process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
        process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "demo-api-key-for-development" &&
        process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "your-api-key-here";

    if (hasRealConfig) {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
        storage = getStorage(app);
        console.log("🔥 Firebase initialized successfully with real config");
    } else {
        // Create mock objects for development
        console.log("🔧 Running in development mode with mock Firebase services");
        auth = {
            currentUser: null,
            signInWithEmailAndPassword: () => Promise.resolve({ user: { uid: "demo-user", email: "demo@example.com" } }),
            createUserWithEmailAndPassword: () => Promise.resolve({ user: { uid: "demo-user", email: "demo@example.com" } }),
            signOut: () => Promise.resolve(),
            onAuthStateChanged: (callback: any) => {
                // Simulate user logged in
                setTimeout(() => callback({ uid: "demo-user", displayName: "Elder Smith", email: "demo@example.com" }), 100);
                return () => { };
            }
        };
        db = {
            collection: () => ({
                doc: () => ({
                    get: () => Promise.resolve({ exists: false }),
                    set: () => Promise.resolve(),
                    update: () => Promise.resolve(),
                    delete: () => Promise.resolve()
                }),
                add: () => Promise.resolve({ id: "demo-id" }),
                where: () => ({
                    get: () => Promise.resolve({ docs: [] })
                })
            })
        };
        storage = {
            ref: () => ({
                put: () => Promise.resolve({ ref: { getDownloadURL: () => Promise.resolve("demo-url") } })
            })
        };
    }
} catch (error) {
    console.error("Firebase initialization error:", error);
    // Fallback to mock services
    auth = {
        currentUser: null,
        signInWithEmailAndPassword: () => Promise.resolve({ user: { uid: "demo-user", email: "demo@example.com" } }),
        createUserWithEmailAndPassword: () => Promise.resolve({ user: { uid: "demo-user", email: "demo@example.com" } }),
        signOut: () => Promise.resolve(),
        onAuthStateChanged: (callback: any) => {
            setTimeout(() => callback({ uid: "demo-user", displayName: "Elder Smith", email: "demo@example.com" }), 100);
            return () => { };
        }
    };
    db = {
        collection: () => ({
            doc: () => ({
                get: () => Promise.resolve({ exists: false }),
                set: () => Promise.resolve(),
                update: () => Promise.resolve(),
                delete: () => Promise.resolve()
            }),
            add: () => Promise.resolve({ id: "demo-id" }),
            where: () => ({
                get: () => Promise.resolve({ docs: [] })
            })
        })
    };
    storage = {
        ref: () => ({
            put: () => Promise.resolve({ ref: { getDownloadURL: () => Promise.resolve("demo-url") } })
        })
    };
}

// Export mock functions for development
export { mockUpdateProfile as updateProfile };
export { mockGoogleAuthProvider as GoogleAuthProvider };
export { mockOAuthProvider as OAuthProvider };
export { mockSignInWithPopup as signInWithPopup };

export { auth, db, storage };

export default app;