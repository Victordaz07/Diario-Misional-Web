import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Diario Misional - Tu experiencia misionera',
    description: 'Aplicación web para misioneros - Diario personal, traslados, fotos y recursos',
    manifest: '/manifest.json',
    themeColor: '#3B82F6',
    viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'Diario Misional',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="es">
            <body className={inter.className}>
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
