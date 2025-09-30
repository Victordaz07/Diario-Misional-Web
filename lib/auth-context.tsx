'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { UserProfile } from '@/lib/types';

interface AuthContextType {
    user: User | null;
    userProfile: UserProfile | null;
    loading: boolean;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    userProfile: null,
    loading: true,
    logout: async () => { },
});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if we're in development mode or if Firebase is not properly configured
        const isDevelopmentMode = process.env.NODE_ENV === 'development' &&
            process.env.NEXT_PUBLIC_DEV_MODE === 'true';

        // Also check if we're in production but Firebase is not configured
        const isProductionWithoutFirebase = process.env.NODE_ENV === 'production' &&
            (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
                process.env.NEXT_PUBLIC_FIREBASE_API_KEY === 'demo-api-key-for-development');

        if (isDevelopmentMode || isProductionWithoutFirebase) {
            console.log('AuthProvider: Mock mode detected, using mock user');
            // Simulate a logged-in user immediately
            const mockUser = {
                uid: "demo-user",
                displayName: "Elder Smith",
                email: "demo@example.com"
            } as User;

            setUser(mockUser);
            setUserProfile(null);
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            console.log('AuthProvider: Auth state changed:', user ? 'User logged in' : 'No user');
            try {
                setUser(user);

                if (user) {
                    // Aquí podrías cargar el perfil del usuario desde Firestore
                    // Por ahora lo dejamos como null
                    setUserProfile(null);
                } else {
                    setUserProfile(null);
                }
            } catch (error) {
                console.error('Error in auth state change:', error);
            } finally {
                console.log('AuthProvider: Setting loading to false');
                setLoading(false);
            }
        });

        return () => {
            console.log('AuthProvider: Cleaning up auth listener');
            unsubscribe();
        };
    }, []);

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    const value = {
        user,
        userProfile,
        loading,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
