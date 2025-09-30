import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { mockStorage } from './mock-storage';

// Función para limpiar variables de entorno (remover saltos de línea)
const cleanEnvVar = (value: string | undefined): string => {
    if (!value) return '';
    return value.trim().replace(/[\r\n]+/g, '');
};

const firebaseConfig = {
    apiKey: cleanEnvVar(process.env.NEXT_PUBLIC_FIREBASE_API_KEY) || "demo-api-key-for-development",
    authDomain: cleanEnvVar(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN) || "demo-project.firebaseapp.com",
    projectId: cleanEnvVar(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) || "demo-project-id",
    storageBucket: cleanEnvVar(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET) || "demo-project.appspot.com",
    messagingSenderId: cleanEnvVar(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID) || "123456789",
    appId: cleanEnvVar(process.env.NEXT_PUBLIC_FIREBASE_APP_ID) || "1:123456789:web:abcdef123456",
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

// Mock onAuthStateChanged
const mockOnAuthStateChanged = (auth: any, callback: any) => {
    console.log('Mock onAuthStateChanged called with callback:', typeof callback);

    // Simulate user logged in after a short delay
    if (typeof callback === 'function') {
        console.log('Mock: Simulating user login...');
        setTimeout(() => {
            const mockUser = {
                uid: "demo-user",
                displayName: "Elder Smith",
                email: "demo@example.com"
            };
            console.log('Mock: Calling callback with user:', mockUser);
            callback(mockUser);
        }, 100);
    } else {
        console.log('Mock: Callback is not a function, skipping');
    }

    return () => {
        console.log('Mock: Unsubscribe called');
    };
};

// Mock signOut
const mockSignOut = () => {
    return Promise.resolve();
};

// Check if we have real Firebase config
const hasRealConfig = cleanEnvVar(process.env.NEXT_PUBLIC_FIREBASE_API_KEY) &&
    cleanEnvVar(process.env.NEXT_PUBLIC_FIREBASE_API_KEY) !== "demo-api-key-for-development" &&
    cleanEnvVar(process.env.NEXT_PUBLIC_FIREBASE_API_KEY) !== "your-api-key-here";

try {

    if (hasRealConfig) {
        console.log("🔥 Firebase config detected:", {
            apiKey: firebaseConfig.apiKey.substring(0, 20) + "...",
            authDomain: firebaseConfig.authDomain,
            projectId: firebaseConfig.projectId
        });
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
        storage = getStorage(app);
        console.log("🔥 Firebase initialized successfully with real config");
    } else {
        // Initialize mock storage with sample data
        mockStorage.initializeSampleData();
        // Create mock objects for development
        console.log("🔧 Running in development mode with mock Firebase services");
        auth = {
            currentUser: null,
            signInWithEmailAndPassword: () => Promise.resolve({ user: { uid: "demo-user", email: "demo@example.com" } }),
            createUserWithEmailAndPassword: () => Promise.resolve({ user: { uid: "demo-user", email: "demo@example.com" } }),
            signOut: mockSignOut,
            onAuthStateChanged: mockOnAuthStateChanged
        };
        db = {
            collection: (collectionName: string) => ({
                doc: (docId?: string) => ({
                    get: async () => {
                        if (docId) {
                            const data = await mockStorage.read(collectionName, docId);
                            return { exists: () => !!data, data: () => data };
                        }
                        return { exists: () => false };
                    },
                    set: async (data: any) => {
                        if (docId) {
                            await mockStorage.update(collectionName, docId, data);
                        } else {
                            await mockStorage.create(collectionName, data);
                        }
                        return Promise.resolve();
                    },
                    update: async (data: any) => {
                        if (docId) {
                            await mockStorage.update(collectionName, docId, data);
                        }
                        return Promise.resolve();
                    },
                    delete: async () => {
                        if (docId) {
                            await mockStorage.delete(collectionName, docId);
                        }
                        return Promise.resolve();
                    }
                }),
                add: async (data: any) => {
                    const result = await mockStorage.create(collectionName, data);
                    return Promise.resolve({ id: result.id });
                },
                where: (field: string, operator: string, value: any) => ({
                    orderBy: (field: string, direction: string = 'asc') => ({
                        limit: (count: number) => ({
                            get: async () => {
                                const docs = await mockStorage.query(collectionName, field, operator, value);
                                const sorted = docs.sort((a, b) => {
                                    const aVal = a[field];
                                    const bVal = b[field];
                                    if (direction === 'desc') {
                                        return bVal > aVal ? 1 : -1;
                                    }
                                    return aVal > bVal ? 1 : -1;
                                });
                                return { docs: sorted.slice(0, count).map(doc => ({ data: () => doc, id: doc.id })) };
                            }
                        }),
                        get: async () => {
                            const docs = await mockStorage.query(collectionName, field, operator, value);
                            const sorted = docs.sort((a, b) => {
                                const aVal = a[field];
                                const bVal = b[field];
                                if (direction === 'desc') {
                                    return bVal > aVal ? 1 : -1;
                                }
                                return aVal > bVal ? 1 : -1;
                            });
                            return { docs: sorted.map(doc => ({ data: () => doc, id: doc.id })) };
                        }
                    }),
                    get: async () => {
                        const docs = await mockStorage.query(collectionName, field, operator, value);
                        return { docs: docs.map(doc => ({ data: () => doc, id: doc.id })) };
                    }
                }),
                orderBy: (field: string, direction: string = 'asc') => ({
                    limit: (count: number) => ({
                        get: async () => {
                            const docs = await mockStorage.read(collectionName);
                            const sorted = docs.sort((a, b) => {
                                const aVal = a[field];
                                const bVal = b[field];
                                if (direction === 'desc') {
                                    return bVal > aVal ? 1 : -1;
                                }
                                return aVal > bVal ? 1 : -1;
                            });
                            return { docs: sorted.slice(0, count).map(doc => ({ data: () => doc, id: doc.id })) };
                        }
                    }),
                    get: async () => {
                        const docs = await mockStorage.read(collectionName);
                        const sorted = docs.sort((a, b) => {
                            const aVal = a[field];
                            const bVal = b[field];
                            if (direction === 'desc') {
                                return bVal > aVal ? 1 : -1;
                            }
                            return aVal > bVal ? 1 : -1;
                        });
                        return { docs: sorted.map(doc => ({ data: () => doc, id: doc.id })) };
                    }
                }),
                get: async () => {
                    const docs = await mockStorage.read(collectionName);
                    return { docs: docs.map((doc: any) => ({ data: () => doc, id: doc.id })) };
                }
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
        signOut: mockSignOut,
        onAuthStateChanged: mockOnAuthStateChanged
    };
    db = {
        collection: (collectionName: string) => ({
            doc: (docId?: string) => ({
                get: async () => {
                    if (docId) {
                        const data = await mockStorage.read(collectionName, docId);
                        return { exists: () => !!data, data: () => data };
                    }
                    return { exists: () => false };
                },
                set: async (data: any) => {
                    if (docId) {
                        await mockStorage.update(collectionName, docId, data);
                    } else {
                        await mockStorage.create(collectionName, data);
                    }
                    return Promise.resolve();
                },
                update: async (data: any) => {
                    if (docId) {
                        await mockStorage.update(collectionName, docId, data);
                    }
                    return Promise.resolve();
                },
                delete: async () => {
                    if (docId) {
                        await mockStorage.delete(collectionName, docId);
                    }
                    return Promise.resolve();
                }
            }),
            add: async (data: any) => {
                const result = await mockStorage.create(collectionName, data);
                return Promise.resolve({ id: result.id });
            },
            where: (field: string, operator: string, value: any) => ({
                orderBy: (field: string, direction: string = 'asc') => ({
                    limit: (count: number) => ({
                        get: async () => {
                            const docs = await mockStorage.query(collectionName, field, operator, value);
                            const sorted = docs.sort((a, b) => {
                                const aVal = a[field];
                                const bVal = b[field];
                                if (direction === 'desc') {
                                    return bVal > aVal ? 1 : -1;
                                }
                                return aVal > bVal ? 1 : -1;
                            });
                            return { docs: sorted.slice(0, count).map(doc => ({ data: () => doc, id: doc.id })) };
                        }
                    }),
                    get: async () => {
                        const docs = await mockStorage.query(collectionName, field, operator, value);
                        const sorted = docs.sort((a, b) => {
                            const aVal = a[field];
                            const bVal = b[field];
                            if (direction === 'desc') {
                                return bVal > aVal ? 1 : -1;
                            }
                            return aVal > bVal ? 1 : -1;
                        });
                        return { docs: sorted.map(doc => ({ data: () => doc, id: doc.id })) };
                    }
                }),
                get: async () => {
                    const docs = await mockStorage.query(collectionName, field, operator, value);
                    return { docs: docs.map((doc: any) => ({ data: () => doc, id: doc.id })) };
                }
            }),
            orderBy: (field: string, direction: string = 'asc') => ({
                limit: (count: number) => ({
                    get: async () => {
                        const docs = await mockStorage.read(collectionName);
                        const sorted = docs.sort((a, b) => {
                            const aVal = a[field];
                            const bVal = b[field];
                            if (direction === 'desc') {
                                return bVal > aVal ? 1 : -1;
                            }
                            return aVal > bVal ? 1 : -1;
                        });
                        return { docs: sorted.slice(0, count).map(doc => ({ data: () => doc, id: doc.id })) };
                    }
                }),
                get: async () => {
                    const docs = await mockStorage.read(collectionName);
                    const sorted = docs.sort((a, b) => {
                        const aVal = a[field];
                        const bVal = b[field];
                        if (direction === 'desc') {
                            return bVal > aVal ? 1 : -1;
                        }
                        return aVal > bVal ? 1 : -1;
                    });
                    return { docs: sorted.map(doc => ({ data: () => doc, id: doc.id })) };
                }
            }),
            get: async () => {
                const docs = await mockStorage.read(collectionName);
                return { docs: docs.map((doc: any) => ({ data: () => doc, id: doc.id })) };
            }
        })
    };
    storage = {
        ref: () => ({
            put: () => Promise.resolve({ ref: { getDownloadURL: () => Promise.resolve("demo-url") } })
        })
    };
}

// Export providers and functions
let updateProfile: any;
let GoogleAuthProvider: any;
let OAuthProvider: any;
let signInWithPopup: any;
let onAuthStateChanged: any;
let signOut: any;
let doc: any;
let setDoc: any;
let collection: any;
let getDoc: any;
let updateDoc: any;
let deleteDoc: any;

if (hasRealConfig) {
    // Import from Firebase when we have real config
    const firebaseAuth = require('firebase/auth');
    const firebaseFirestore = require('firebase/firestore');
    updateProfile = firebaseAuth.updateProfile;
    GoogleAuthProvider = firebaseAuth.GoogleAuthProvider;
    OAuthProvider = firebaseAuth.OAuthProvider;
    signInWithPopup = firebaseAuth.signInWithPopup;
    onAuthStateChanged = firebaseAuth.onAuthStateChanged;
    signOut = firebaseAuth.signOut;
    doc = firebaseFirestore.doc;
    setDoc = firebaseFirestore.setDoc;
    collection = firebaseFirestore.collection;
    getDoc = firebaseFirestore.getDoc;
    updateDoc = firebaseFirestore.updateDoc;
    deleteDoc = firebaseFirestore.deleteDoc;
} else {
    // Mock functions for development
    updateProfile = mockUpdateProfile;
    GoogleAuthProvider = mockGoogleAuthProvider;
    OAuthProvider = mockOAuthProvider;
    signInWithPopup = mockSignInWithPopup;
    onAuthStateChanged = mockOnAuthStateChanged;
    signOut = mockSignOut;
    doc = (db: any, collection: string, id?: string) => ({
        id: id || 'mock-doc-id',
        collection,
        data: () => ({}),
        exists: () => true
    });
    setDoc = () => Promise.resolve();
    collection = (db: any, collectionName: string) => ({
        doc: (id: string) => doc(db, collectionName, id)
    });
    getDoc = () => Promise.resolve({
        exists: () => false,
        data: () => ({})
    });
    updateDoc = () => Promise.resolve();
    deleteDoc = () => Promise.resolve();
}

export { updateProfile, GoogleAuthProvider, OAuthProvider, signInWithPopup, onAuthStateChanged, signOut };
export { doc, setDoc, collection, getDoc, updateDoc, deleteDoc };
export { auth, db, storage };

export default app;