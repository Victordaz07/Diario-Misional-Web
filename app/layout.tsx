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
        <html lang="en">
            <head>
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
                    crossOrigin="anonymous"
                />
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            // Prevent FontAwesome from causing hydration issues
                            if (typeof window !== 'undefined') {
                                window.FontAwesomeConfig = {
                                    autoReplaceSvg: false
                                };
                            }
                        `
                    }}
                />
            </head>
            <body className={inter.className} suppressHydrationWarning={true}>
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
