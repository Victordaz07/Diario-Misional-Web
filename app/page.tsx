'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import OnboardingScreen from '@/components/onboarding';

export default function HomePage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    console.log('HomePage: loading =', loading, 'user =', user);

    useEffect(() => {
        console.log('HomePage: useEffect triggered, loading =', loading, 'user =', user);
        if (!loading && user) {
            console.log('HomePage: Redirecting to dashboard');
            router.push('/dashboard');
        }
    }, [user, loading, router]);

    if (loading) {
        console.log('HomePage: Showing loading screen');
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-accent to-primary">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto"></div>
                    <p className="mt-4 text-white/80">Cargando...</p>
                </div>
            </div>
        );
    }

    console.log('HomePage: Showing onboarding screen');
    // Si el usuario no está autenticado, mostrar onboarding
    return <OnboardingScreen />;
}
