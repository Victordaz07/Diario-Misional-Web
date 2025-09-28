'use client';

import { AuthProvider } from '@/lib/auth-context';
import { TranslationProvider } from '@/lib/use-translations';

export default function Providers({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <TranslationProvider>
            <AuthProvider>
                {children}
            </AuthProvider>
        </TranslationProvider>
    );
}
