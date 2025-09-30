'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();

    const navigation = [
        { name: 'Inicio', href: '/dashboard', icon: 'fa-home' },
        { name: 'Diario', href: '/diario', icon: 'fa-book-open' },
        { name: 'Traslados', href: '/traslados', icon: 'fa-route' },
        { name: 'Fotos', href: '/fotos', icon: 'fa-camera' },
        { name: 'Recursos', href: '/recursos', icon: 'fa-folder' },
        { name: 'Etapas', href: '/etapas', icon: 'fa-seedling' },
        { name: 'Perfil', href: '/perfil', icon: 'fa-user' },
    ];

    const isActive = (href: string) => {
        if (href === '/dashboard') {
            return pathname === '/dashboard';
        }
        return pathname.startsWith(href);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <div className={`fixed left-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                            <i className="fa-solid fa-book text-white text-lg"></i>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">Diario Misional</h2>
                            <p className="text-xs text-gray-500">Web App</p>
                        </div>
                    </div>
                </div>

                <nav className="p-4">
                    <ul className="space-y-2">
                        {navigation.map((item) => (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors cursor-pointer ${isActive(item.href)
                                            ? 'bg-primary text-white'
                                            : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    <i className={`fa-solid ${item.icon}`}></i>
                                    <span className={isActive(item.href) ? 'font-medium' : ''}>{item.name}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-gradient-to-r from-secondary/10 to-primary/10 p-4 rounded-lg border border-secondary/20">
                        <div className="flex items-center space-x-2 mb-2">
                            <i className="fa-solid fa-crown text-secondary"></i>
                            <span className="text-sm font-medium text-gray-700">Patrocinio Activo</span>
                        </div>
                        <p className="text-xs text-gray-600">Conectado con familia</p>
                    </div>
                </div>
            </div>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Main content */}
            <div className="md:ml-64">
                {/* Header */}
                <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
                    <div className="px-4 py-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => setSidebarOpen(!sidebarOpen)}
                                    className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                                >
                                    <i className="fa-solid fa-bars text-gray-600"></i>
                                </button>
                                <div>
                                    <h1 className="text-xl font-semibold text-gray-800">
                                        {navigation.find(item => isActive(item.href))?.name || 'Dashboard'}
                                    </h1>
                                    <p className="text-sm text-gray-500">
                                        {navigation.find(item => isActive(item.href))?.name === 'Inicio'
                                            ? 'Resumen de tu misión'
                                            : `Gestiona tu ${navigation.find(item => isActive(item.href))?.name.toLowerCase()}`
                                        }
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <select className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary">
                                    <option>Español</option>
                                    <option>English</option>
                                    <option>Português</option>
                                </select>

                                <div className="flex items-center space-x-2">
                                    <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg" alt="User" className="w-8 h-8 rounded-full" />
                                    <span className="text-sm font-medium text-gray-700 hidden sm:block">Elder Smith</span>
                                </div>

                                <button className="p-2 text-gray-500 hover:text-gray-700">
                                    <i className="fa-solid fa-sign-out-alt"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main>
                    {children}
                </main>
            </div>
        </div>
    );
}
