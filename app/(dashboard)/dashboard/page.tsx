'use client';

import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    BookOpen,
    MapPin,
    Camera,
    FileText,
    Calendar,
    TrendingUp
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
    const { user, userProfile } = useAuth();

    const stats = [
        {
            name: 'Entradas del Diario',
            value: '0',
            icon: BookOpen,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
        },
        {
            name: 'Traslados Registrados',
            value: '0',
            icon: MapPin,
            color: 'text-green-600',
            bgColor: 'bg-green-100',
        },
        {
            name: 'Fotos Guardadas',
            value: '0',
            icon: Camera,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100',
        },
        {
            name: 'Días en Misión',
            value: '0',
            icon: Calendar,
            color: 'text-orange-600',
            bgColor: 'bg-orange-100',
        },
    ];

    const quickActions = [
        {
            title: 'Nueva Entrada',
            description: 'Escribe sobre tu día en la misión',
            href: '/diario',
            icon: BookOpen,
        },
        {
            title: 'Registrar Traslado',
            description: 'Documenta tu cambio de área',
            href: '/traslados',
            icon: MapPin,
        },
        {
            title: 'Subir Fotos',
            description: 'Guarda momentos especiales',
            href: '/fotos',
            icon: Camera,
        },
        {
            title: 'Ver Recursos',
            description: 'Accede a materiales de estudio',
            href: '/recursos',
            icon: FileText,
        },
    ];

    return (
        <div className="space-y-6">
            {/* Bienvenida */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">
                    ¡Bienvenido de vuelta!
                </h1>
                <p className="mt-2 text-lg text-gray-600">
                    {userProfile?.nombre || user?.displayName || 'Misionero'},
                    continúa documentando tu experiencia en {userProfile?.mision || 'tu misión'}.
                </p>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.name}>
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <div className={`flex-shrink-0 rounded-md p-3 ${stat.bgColor}`}>
                                        <Icon className={`h-6 w-6 ${stat.color}`} />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500">
                                            {stat.name}
                                        </p>
                                        <p className="text-2xl font-semibold text-gray-900">
                                            {stat.value}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Acciones rápidas */}
            <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Acciones Rápidas
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {quickActions.map((action) => {
                        const Icon = action.icon;
                        return (
                            <Card key={action.title} className="hover:shadow-md transition-shadow">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center space-x-2">
                                        <Icon className="h-5 w-5 text-gray-600" />
                                        <CardTitle className="text-lg">{action.title}</CardTitle>
                                    </div>
                                    <CardDescription>{action.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <Button asChild className="w-full">
                                        <Link href={action.href}>
                                            Ir a {action.title}
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>

            {/* Actividad reciente */}
            <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Actividad Reciente
                </h2>
                <Card>
                    <CardContent className="p-6">
                        <div className="text-center py-8">
                            <TrendingUp className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">
                                No hay actividad reciente
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Comienza escribiendo tu primera entrada en el diario.
                            </p>
                            <div className="mt-6">
                                <Button asChild>
                                    <Link href="/diario">
                                        Crear Primera Entrada
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
