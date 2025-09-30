import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    updateProfile,
    GoogleAuthProvider,
    OAuthProvider,
    signInWithPopup,
    User
} from 'firebase/auth';
import { auth } from './firebase';

// Google Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');

// Apple Provider
const appleProvider = new OAuthProvider('apple.com');
appleProvider.addScope('email');
appleProvider.addScope('name');

export interface AuthUser {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    providerId: string;
}

export class AuthService {
    // Sign in with email and password
    static async signInWithEmail(email: string, password: string): Promise<AuthUser> {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return this.mapUserToAuthUser(userCredential.user);
        } catch (error) {
            console.error('Error signing in with email:', error);
            throw error;
        }
    }

    // Sign up with email and password
    static async signUpWithEmail(email: string, password: string, displayName?: string): Promise<AuthUser> {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            // Update display name if provided
            if (displayName) {
                await updateProfile(userCredential.user, { displayName });
            }

            return this.mapUserToAuthUser(userCredential.user);
        } catch (error) {
            console.error('Error signing up with email:', error);
            throw error;
        }
    }

    // Sign in with Google
    static async signInWithGoogle(): Promise<AuthUser> {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            return this.mapUserToAuthUser(result.user);
        } catch (error) {
            console.error('Error signing in with Google:', error);
            throw error;
        }
    }

    // Sign in with Apple
    static async signInWithApple(): Promise<AuthUser> {
        try {
            const result = await signInWithPopup(auth, appleProvider);
            return this.mapUserToAuthUser(result.user);
        } catch (error) {
            console.error('Error signing in with Apple:', error);
            throw error;
        }
    }

    // Sign out
    static async signOut(): Promise<void> {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Error signing out:', error);
            throw error;
        }
    }

    // Update user profile
    static async updateUserProfile(updates: { displayName?: string; photoURL?: string }): Promise<void> {
        try {
            if (!auth.currentUser) throw new Error('No user logged in');
            await updateProfile(auth.currentUser, updates);
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        }
    }

    // Map Firebase User to our AuthUser interface
    private static mapUserToAuthUser(user: User): AuthUser {
        return {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            providerId: user.providerData[0]?.providerId || 'unknown'
        };
    }

    // Get current user
    static getCurrentUser(): AuthUser | null {
        if (!auth.currentUser) return null;
        return this.mapUserToAuthUser(auth.currentUser);
    }
}

