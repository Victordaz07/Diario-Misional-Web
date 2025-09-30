'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DemoModeContextType {
  isDemoMode: boolean;
  enableDemoMode: () => void;
  disableDemoMode: () => void;
  demoUser: any;
}

const DemoModeContext = createContext<DemoModeContextType | undefined>(undefined);

export const useDemoMode = () => {
  const context = useContext(DemoModeContext);
  if (!context) {
    throw new Error('useDemoMode must be used within a DemoModeProvider');
  }
  return context;
};

interface DemoModeProviderProps {
  children: React.ReactNode;
}

export const DemoModeProvider: React.FC<DemoModeProviderProps> = ({ children }) => {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoUser, setDemoUser] = useState(null);

  useEffect(() => {
    // Check if demo mode is enabled in localStorage
    const demoModeEnabled = localStorage.getItem('demo-mode') === 'true';
    if (demoModeEnabled) {
      enableDemoMode();
    }
  }, []);

  const enableDemoMode = () => {
    setIsDemoMode(true);
    localStorage.setItem('demo-mode', 'true');
    
    // Set demo user data
    setDemoUser({
      uid: 'demo-user-123',
      email: 'demo@diariomisional.com',
      displayName: 'Elder Demo',
      photoURL: null,
      emailVerified: true,
      isAnonymous: false,
    });
  };

  const disableDemoMode = () => {
    setIsDemoMode(false);
    localStorage.removeItem('demo-mode');
    setDemoUser(null);
  };

  return (
    <DemoModeContext.Provider value={{ isDemoMode, enableDemoMode, disableDemoMode, demoUser }}>
      {children}
    </DemoModeContext.Provider>
  );
};

export const DemoModeBanner: React.FC = () => {
  const { isDemoMode, disableDemoMode } = useDemoMode();

  if (!isDemoMode) return null;

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold">Modo Demo Activo</h3>
            <p className="text-sm text-blue-100">
              Estás viendo una versión de demostración con datos de ejemplo
            </p>
          </div>
        </div>
        <Button
          onClick={disableDemoMode}
          variant="outline"
          size="sm"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          Salir del Demo
        </Button>
      </div>
    </div>
  );
};

export const DemoModeToggle: React.FC = () => {
  const { isDemoMode, enableDemoMode, disableDemoMode } = useDemoMode();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center space-x-2">
            <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>Modo Demo</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            {isDemoMode 
              ? 'El modo demo está activo. Puedes explorar todas las funcionalidades con datos de ejemplo.'
              : 'Activa el modo demo para explorar la aplicación sin necesidad de crear una cuenta.'
            }
          </p>
          
          <div className="flex space-x-2">
            {isDemoMode ? (
              <Button onClick={disableDemoMode} variant="outline" className="flex-1">
                Desactivar Demo
              </Button>
            ) : (
              <Button onClick={enableDemoMode} className="flex-1">
                Activar Demo
              </Button>
            )}
          </div>
          
          {isDemoMode && (
            <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
              <strong>Datos de ejemplo incluyen:</strong>
              <ul className="mt-1 space-y-1">
                <li>• Entradas del diario</li>
                <li>• Historial de traslados</li>
                <li>• Galería de fotos</li>
                <li>• Recursos misionales</li>
                <li>• Portal familiar</li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export const DemoModeButton: React.FC = () => {
  const { isDemoMode, enableDemoMode, disableDemoMode } = useDemoMode();

  return (
    <Button
      onClick={isDemoMode ? disableDemoMode : enableDemoMode}
      variant={isDemoMode ? "outline" : "secondary"}
      size="sm"
      className="flex items-center space-x-2"
    >
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
      <span>{isDemoMode ? 'Salir del Demo' : 'Modo Demo'}</span>
    </Button>
  );
};
