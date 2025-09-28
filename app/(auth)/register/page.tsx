'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nombre, setNombre] = useState('');
    const [mision, setMision] = useState('');
    const [idioma, setIdioma] = useState('español');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Crear usuario con email y contraseña
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Actualizar el perfil con el nombre
            await updateProfile(user, {
                displayName: nombre,
            });

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

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">Crear Cuenta</CardTitle>
                    <CardDescription>
                        Únete a Diario Misional y comienza tu experiencia
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="nombre">Nombre Completo</Label>
                            <Input
                                id="nombre"
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                required
                                placeholder="Tu nombre completo"
                            />
                        </div>

                        <div>
                            <Label htmlFor="email">Correo Electrónico</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="tu@email.com"
                            />
                        </div>

                        <div>
                            <Label htmlFor="password">Contraseña</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Mínimo 6 caracteres"
                                minLength={6}
                            />
                        </div>

                        <div>
                            <Label htmlFor="mision">Misión</Label>
                            <Input
                                id="mision"
                                type="text"
                                value={mision}
                                onChange={(e) => setMision(e.target.value)}
                                required
                                placeholder="Ej: Misión México Ciudad de México"
                            />
                        </div>

                        <div>
                            <Label htmlFor="idioma">Idioma Principal</Label>
                            <select
                                id="idioma"
                                value={idioma}
                                onChange={(e) => setIdioma(e.target.value)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                                <option value="español">Español</option>
                                <option value="inglés">Inglés</option>
                                <option value="portugués">Portugués</option>
                                <option value="francés">Francés</option>
                                <option value="alemán">Alemán</option>
                            </select>
                        </div>

                        {error && (
                            <div className="text-red-600 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
                        </Button>
                    </form>

                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-600">
                            ¿Ya tienes cuenta?{' '}
                            <Link href="/login" className="text-blue-600 hover:underline">
                                Inicia sesión
                            </Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
