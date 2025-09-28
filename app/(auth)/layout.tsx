import { BookOpen } from 'lucide-react';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header simple para auth */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center py-4">
                        <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
                        <h1 className="text-xl font-bold text-gray-900">Diario Misional</h1>
                    </div>
                </div>
            </header>

            {/* Contenido */}
            <main>
                {children}
            </main>
        </div>
    );
}
