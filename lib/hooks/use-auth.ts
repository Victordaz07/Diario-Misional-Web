import { useState, useEffect, useContext } from 'react';
import { User } from 'firebase/auth';
import { AuthContext } from '../auth-context';

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export const useAuthState = () => {
  const { user, loading } = useAuth();
  
  return {
    user,
    loading,
    isAuthenticated: !!user,
    isAnonymous: user?.isAnonymous || false,
  };
};
