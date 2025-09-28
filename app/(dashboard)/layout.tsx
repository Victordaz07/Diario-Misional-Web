'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import {
    BookOpen,
    MapPin,
    Camera,
    FileText,
    User,
    Menu,
    X,
    LogOut,
    Home
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Diario', href: '/diario', icon: BookOpen },
    { name: 'Traslados', href: '/traslados', icon: MapPin },
    { name: 'Fotos', href: '/fotos', icon: Camera },
    { name: 'Recursos', href: '/recursos', icon: FileText },
    { name: 'Perfil', href: '/perfil', icon: User },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar móvil */}
            <div className={cn(
                "fixed inset-0 z-50 lg:hidden",
                sidebarOpen ? "block" : "hidden"
            )}>
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
                <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white shadow-xl">
                    <div className="flex h-16 items-center justify-between px-4">
                        <h1 className="text-xl font-bold text-gray-900">Diario Misional</h1>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <X className="h-6 w-6" />
                        </Button>
                    </div>
                    <nav className="flex-1 space-y-1 px-2 py-4">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                                        pathname === item.href
                                            ? "bg-blue-100 text-blue-700"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    )}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <Icon className="mr-3 h-5 w-5" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* Sidebar desktop */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
                <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
                    <div className="flex items-center flex-shrink-0 px-4">
                        <h1 className="text-xl font-bold text-gray-900">Diario Misional</h1>
                    </div>
                    <nav className="mt-5 flex-1 px-2 space-y-1">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                                        pathname === item.href
                                            ? "bg-blue-100 text-blue-700"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    )}
                                >
                                    <Icon className="mr-3 h-5 w-5" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* Contenido principal */}
            <div className="lg:pl-64 flex flex-col flex-1">
                {/* Header */}
                <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white border-b border-gray-200 lg:hidden">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="px-4"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="h-6 w-6" />
                    </Button>
                    <div className="flex flex-1 justify-between px-4">
                        <div className="flex flex-1">
                            <h1 className="text-lg font-semibold text-gray-900 self-center">
                                Diario Misional
                            </h1>
                        </div>
                        <div className="ml-4 flex items-center">
                            <Button variant="ghost" size="icon" onClick={logout}>
                                <LogOut className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Header desktop */}
                <div className="hidden lg:flex lg:flex-shrink-0">
                    <div className="flex h-16 w-full items-center justify-between bg-white px-4 border-b border-gray-200">
                        <div className="flex items-center">
                            <h2 className="text-lg font-semibold text-gray-900">
                                {navigation.find(item => item.href === pathname)?.name || 'Dashboard'}
                            </h2>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-700">
                                Hola, {user?.displayName || user?.email}
                            </span>
                            <Button variant="outline" size="sm" onClick={logout}>
                                <LogOut className="h-4 w-4 mr-2" />
                                Cerrar Sesión
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Contenido de la página */}
                <main className="flex-1">
                    <div className="py-6">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
