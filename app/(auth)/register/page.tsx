'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/lib/auth-service';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [nombre, setNombre] = useState('');
    const [mision, setMision] = useState('');
    const [idioma, setIdioma] = useState('Español');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [socialLoading, setSocialLoading] = useState<'google' | 'apple' | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            setLoading(false);
            return;
        }

        try {
            // Crear usuario con email y contraseña
            const user = await AuthService.signUpWithEmail(email, password, nombre);

            // Crear perfil en Firestore
            const userProfile = {
                uid: user.uid,
                email: user.email!,
                nombre,
                mision,
                idioma,
                fechaCreacion: new Date(),
                ultimaActualizacion: new Date(),
            };

            await setDoc(doc(db, 'users', user.uid), userProfile);

            // Redirigir al dashboard
            router.push('/dashboard');
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleRegister = async () => {
        setSocialLoading('google');
        setError('');

        try {
            const user = await AuthService.signInWithGoogle();

            // Crear perfil en Firestore si no existe
            const userProfile = {
                uid: user.uid,
                email: user.email!,
                nombre: user.displayName || '',
                mision: '',
                idioma: 'Español',
                fechaCreacion: new Date(),
                ultimaActualizacion: new Date(),
            };

            await setDoc(doc(db, 'users', user.uid), userProfile, { merge: true });
            router.push('/dashboard');
        } catch (error: any) {
            setError(error.message);
        } finally {
            setSocialLoading(null);
        }
    };

    const handleAppleRegister = async () => {
        setSocialLoading('apple');
        setError('');

        try {
            const user = await AuthService.signInWithApple();

            // Crear perfil en Firestore si no existe
            const userProfile = {
                uid: user.uid,
                email: user.email || '',
                nombre: user.displayName || '',
                mision: '',
                idioma: 'Español',
                fechaCreacion: new Date(),
                ultimaActualizacion: new Date(),
            };

            await setDoc(doc(db, 'users', user.uid), userProfile, { merge: true });
            router.push('/dashboard');
        } catch (error: any) {
            setError(error.message);
        } finally {
            setSocialLoading(null);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
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
                    <select className="text-xs sm:text-sm border border-gray-300 rounded-lg px-2 sm:px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary">
                        <option>Español</option>
                        <option>English</option>
                        <option>Português</option>
                    </select>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-200">
                        {/* Header Section */}
                        <div className="text-center mb-6 sm:mb-8">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                <i className="fa-solid fa-user-plus text-white text-lg sm:text-xl"></i>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Crear Cuenta</h2>
                            <p className="text-sm sm:text-base text-gray-600">Únete a la experiencia misional</p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                            {/* Full Name Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre completo</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={nombre}
                                        onChange={(e) => setNombre(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pl-12 text-sm sm:text-base"
                                        placeholder="Elder John Smith"
                                        required
                                    />
                                    <i className="fa-solid fa-user absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                                </div>
                            </div>

                            {/* Email Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Correo electrónico</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pl-12 text-sm sm:text-base"
                                        placeholder="tu@email.com"
                                        required
                                    />
                                    <i className="fa-solid fa-envelope absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                                </div>
                            </div>

                            {/* Mission Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Misión</label>
                                <div className="relative">
                                    <select
                                        value={mision}
                                        onChange={(e) => setMision(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pl-12 appearance-none text-sm sm:text-base"
                                        required
                                    >
                                        <option value="">Selecciona tu misión</option>
                                        <option value="Argentina Buenos Aires Norte">Argentina Buenos Aires Norte</option>
                                        <option value="México Ciudad de México Norte">México Ciudad de México Norte</option>
                                        <option value="Brasil São Paulo Sul">Brasil São Paulo Sul</option>
                                        <option value="Chile Santiago Norte">Chile Santiago Norte</option>
                                        <option value="Colombia Bogotá Norte">Colombia Bogotá Norte</option>
                                        <option value="Ecuador Guayaquil Norte">Ecuador Guayaquil Norte</option>
                                        <option value="Perú Lima Norte">Perú Lima Norte</option>
                                        <option value="Venezuela Caracas">Venezuela Caracas</option>
                                        <option value="Estados Unidos Salt Lake City">Estados Unidos Salt Lake City</option>
                                    </select>
                                    <i className="fa-solid fa-globe absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                                    <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                                </div>
                            </div>

                            {/* Language Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Idioma preferido</label>
                                <div className="relative">
                                    <select
                                        value={idioma}
                                        onChange={(e) => setIdioma(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pl-12 appearance-none text-sm sm:text-base"
                                        required
                                    >
                                        <option value="Español">Español</option>
                                        <option value="English">English</option>
                                        <option value="Português">Português</option>
                                    </select>
                                    <i className="fa-solid fa-language absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                                    <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                                </div>
                            </div>

                            {/* Password Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pl-12 pr-12 text-sm sm:text-base"
                                        placeholder="••••••••"
                                        minLength={6}
                                        required
                                    />
                                    <i className="fa-solid fa-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar contraseña</label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pl-12 pr-12 text-sm sm:text-base"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <i className="fa-solid fa-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                                    <button
                                        type="button"
                                        onClick={toggleConfirmPasswordVisibility}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <i className={`fa-solid ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                    </button>
                                </div>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="text-red-600 text-sm text-center bg-red-50 border border-red-200 rounded-lg p-3">
                                    {error}
                                </div>
                            )}

                            {/* Register Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                            >
                                {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
                            </button>

                            {/* Divider */}
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">O continúa con</span>
                                </div>
                            </div>

                            {/* Social Register Buttons */}
                            <div className="space-y-3">
                                {/* Google Button */}
                                <button
                                    type="button"
                                    onClick={handleGoogleRegister}
                                    disabled={socialLoading !== null}
                                    className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                                >
                                    {socialLoading === 'google' ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                                    ) : (
                                        <i className="fa-brands fa-google text-red-500"></i>
                                    )}
                                    <span>{socialLoading === 'google' ? 'Creando...' : 'Google'}</span>
                                </button>

                                {/* Apple Button */}
                                <button
                                    type="button"
                                    onClick={handleAppleRegister}
                                    disabled={socialLoading !== null}
                                    className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                                >
                                    {socialLoading === 'apple' ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    ) : (
                                        <i className="fa-brands fa-apple text-white"></i>
                                    )}
                                    <span>{socialLoading === 'apple' ? 'Creando...' : 'Apple ID'}</span>
                                </button>
                            </div>
                        </form>

                        {/* Login Link */}
                        <div className="mt-6 sm:mt-8 text-center">
                            <p className="text-sm text-gray-600">¿Ya tienes cuenta?
                                <Link href="/login" className="text-primary font-medium hover:text-primary/80 ml-1">
                                    Inicia sesión aquí
                                </Link>
                            </p>
                            <Link href="/link-code" className="mt-3 text-secondary font-medium hover:text-secondary/80 block">
                                ¿Tienes un código de vinculación?
                            </Link>
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
    );
}
