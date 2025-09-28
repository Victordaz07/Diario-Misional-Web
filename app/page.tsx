'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, Camera, FileText } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            router.push('/dashboard');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando...</p>
                </div>
            </div>
        );
    }

    const features = [
        {
            icon: BookOpen,
            title: 'Diario Personal',
            description: 'Documenta tus experiencias y reflexiones diarias en la misión',
        },
        {
            icon: Users,
            title: 'Registro de Traslados',
            description: 'Mantén un registro de tus cambios de área cada 6 semanas',
        },
        {
            icon: Camera,
            title: 'Galería de Fotos',
            description: 'Guarda y organiza las fotos de tu experiencia misionera',
        },
        {
            icon: FileText,
            title: 'Recursos de Estudio',
            description: 'Accede a materiales y herramientas útiles para tu misión',
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center">
                            <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
                            <h1 className="text-2xl font-bold text-gray-900">Diario Misional</h1>
                        </div>
                        <div className="flex space-x-4">
                            <Button variant="outline" asChild>
                                <Link href="/login">Iniciar Sesión</Link>
                            </Button>
                            <Button asChild>
                                <Link href="/register">Crear Cuenta</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Documenta tu Experiencia Misionera
                    </h2>
                    <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                        Una aplicación web diseñada especialmente para misioneros.
                        Guarda tus memorias, registra tus traslados y accede a recursos útiles
                        para tu misión.
                    </p>
                    <div className="flex justify-center space-x-4">
                        <Button size="lg" asChild>
                            <Link href="/register">Comenzar Ahora</Link>
                        </Button>
                        <Button size="lg" variant="outline" asChild>
                            <Link href="/login">Ya tengo cuenta</Link>
                        </Button>
                    </div>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                        <Icon className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription>{feature.description}</CardDescription>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* CTA Section */}
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        ¿Listo para comenzar?
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Únete a otros misioneros que ya están documentando sus experiencias
                    </p>
                    <Button size="lg" asChild>
                        <Link href="/register">Crear mi Diario Misional</Link>
                    </Button>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-gray-400">
                        © 2024 Diario Misional. Hecho con ❤️ para misioneros.
                    </p>
                </div>
            </footer>
        </div>
    );
}
