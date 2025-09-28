'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LinkCodePage() {
    const [codigo, setCodigo] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Aquí iría la lógica para validar y vincular el código
            // Por ahora simulamos el proceso
            await new Promise(resolve => setTimeout(resolve, 2000));

            setSuccess(true);
            setTimeout(() => {
                router.push('/dashboard');
            }, 3000);
        } catch (error: any) {
            setError('Código inválido. Por favor, verifica e intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleContinueWithoutLink = () => {
        router.push('/register');
    };

    if (success) {
        return (
            <>
                {/* Font Awesome CDN */}
                <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js" crossOrigin="anonymous" referrerPolicy="no-referrer"></script>

                <div className="min-h-screen bg-gray-50 flex flex-col">
                    {/* Header */}
                    <header className="bg-white shadow-sm border-b border-gray-200 p-4">
                        <div className="flex items-center justify-between max-w-md mx-auto">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                                    <i className="fa-solid fa-book text-white text-sm sm:text-lg"></i>
                                </div>
                                <div>
                                    <h1 className="text-base sm:text-lg font-semibold text-gray-800">Diario Misional</h1>
                                    <p className="text-xs text-gray-500">Web App</p>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Success Content */}
                    <main className="flex-1 flex items-center justify-center p-4">
                        <div className="w-full max-w-md">
                            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-200 text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <i className="fa-solid fa-check text-green-600 text-xl"></i>
                                </div>
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">¡Bienvenido!</h2>
                                <p className="text-sm sm:text-base text-gray-600 mb-6">Tu código ha sido vinculado exitosamente. Estás listo para comenzar tu experiencia con el Diario Misional.</p>

                                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-4 mb-6">
                                    <div className="flex items-center justify-center space-x-2 mb-2">
                                        <i className="fa-solid fa-crown text-secondary"></i>
                                        <span className="font-medium text-gray-700">Código vinculado exitosamente</span>
                                    </div>
                                    <p className="text-sm text-gray-600">Tu familia podrá seguir tu progreso misional</p>
                                </div>

                                <button
                                    onClick={() => router.push('/dashboard')}
                                    className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm sm:text-base"
                                >
                                    Ir al Dashboard
                                </button>
                            </div>
                        </div>
                    </main>

                    {/* Footer */}
                    <footer className="bg-white border-t border-gray-200 p-4">
                        <div className="max-w-md mx-auto text-center">
                            <p className="text-xs text-gray-500">© 2024 Diario Misional Web. Todos los derechos reservados.</p>
                        </div>
                    </footer>
                </div>
            </>
        );
    }

    return (
        <>
            {/* Font Awesome CDN */}
            <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js" crossOrigin="anonymous" referrerPolicy="no-referrer"></script>

            <div className="min-h-screen bg-gray-50 flex flex-col">
                {/* Header */}
                <header className="bg-white shadow-sm border-b border-gray-200 p-4">
                    <div className="flex items-center justify-between max-w-md mx-auto">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                                <i className="fa-solid fa-book text-white text-sm sm:text-lg"></i>
                            </div>
                            <div>
                                <h1 className="text-base sm:text-lg font-semibold text-gray-800">Diario Misional</h1>
                                <p className="text-xs text-gray-500">Web App</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 flex items-center justify-center p-4">
                    <div className="w-full max-w-md">
                        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-200">
                            {/* Header Section */}
                            <div className="text-center mb-6 sm:mb-8">
                                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                    <i className="fa-solid fa-link text-white text-lg sm:text-xl"></i>
                                </div>
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Vincular Código</h2>
                                <p className="text-sm sm:text-base text-gray-600">Conecta con tu familia o sponsors</p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                                {/* Code Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Código de vinculación</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={codigo}
                                            onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent pl-12 text-center text-lg font-mono tracking-widest text-sm sm:text-base"
                                            placeholder="ABC-123-XYZ"
                                            maxLength={11}
                                            required
                                        />
                                        <i className="fa-solid fa-key absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">Este código te fue proporcionado por tu familia o sponsors</p>
                                </div>

                                {/* Info Box */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div className="flex items-start space-x-3">
                                        <i className="fa-solid fa-info-circle text-blue-500 mt-0.5"></i>
                                        <div>
                                            <h4 className="text-sm font-medium text-blue-800">¿Qué es el código de vinculación?</h4>
                                            <p className="text-xs text-blue-600 mt-1">Permite que tu familia y sponsors vean tu progreso misional de forma segura y privada.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <div className="text-red-600 text-sm text-center bg-red-50 border border-red-200 rounded-lg p-3">
                                        {error}
                                    </div>
                                )}

                                {/* Link Button */}
                                <button
                                    type="submit"
                                    disabled={loading || codigo.length < 8}
                                    className="w-full bg-secondary text-white py-3 rounded-lg font-medium hover:bg-secondary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                                >
                                    {loading ? 'Vinculando...' : 'Vincular Código'}
                                </button>

                                {/* Continue Without Link Button */}
                                <button
                                    type="button"
                                    onClick={handleContinueWithoutLink}
                                    className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm sm:text-base"
                                >
                                    Continuar sin vincular
                                </button>
                            </form>

                            {/* Login Link */}
                            <div className="mt-6 sm:mt-8 text-center">
                                <p className="text-sm text-gray-600">¿Ya tienes cuenta?
                                    <Link href="/login" className="text-primary font-medium hover:text-primary/80 ml-1">
                                        Inicia sesión aquí
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="bg-white border-t border-gray-200 p-4">
                    <div className="max-w-md mx-auto text-center">
                        <p className="text-xs text-gray-500">© 2024 Diario Misional Web. Todos los derechos reservados.</p>
                        <div className="flex justify-center space-x-4 mt-2">
                            <button className="text-xs text-gray-400 hover:text-gray-600">Términos</button>
                            <button className="text-xs text-gray-400 hover:text-gray-600">Privacidad</button>
                            <button className="text-xs text-gray-400 hover:text-gray-600">Soporte</button>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
