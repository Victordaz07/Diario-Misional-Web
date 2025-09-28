'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Save } from 'lucide-react';

export default function PerfilPage() {
    const { user, userProfile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nombre: userProfile?.nombre || user?.displayName || '',
        mision: userProfile?.mision || '',
        idioma: userProfile?.idioma || 'español',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Aquí implementarías la actualización del perfil en Firestore
        console.log('Actualizando perfil:', formData);

        setTimeout(() => {
            setLoading(false);
            // Mostrar mensaje de éxito
        }, 1000);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
                <p className="mt-2 text-lg text-gray-600">
                    Administra tu información personal
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Información del perfil */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <User className="h-5 w-5 mr-2" />
                            Información Personal
                        </CardTitle>
                        <CardDescription>
                            Actualiza tu información básica
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="nombre">Nombre Completo</Label>
                                <Input
                                    id="nombre"
                                    value={formData.nombre}
                                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                    placeholder="Tu nombre completo"
                                />
                            </div>

                            <div>
                                <Label htmlFor="email">Correo Electrónico</Label>
                                <Input
                                    id="email"
                                    value={user?.email || ''}
                                    disabled
                                    className="bg-gray-50"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    El correo no se puede cambiar
                                </p>
                            </div>

                            <div>
                                <Label htmlFor="mision">Misión</Label>
                                <Input
                                    id="mision"
                                    value={formData.mision}
                                    onChange={(e) => setFormData({ ...formData, mision: e.target.value })}
                                    placeholder="Ej: Misión México Ciudad de México"
                                />
                            </div>

                            <div>
                                <Label htmlFor="idioma">Idioma Principal</Label>
                                <select
                                    id="idioma"
                                    value={formData.idioma}
                                    onChange={(e) => setFormData({ ...formData, idioma: e.target.value })}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                >
                                    <option value="español">Español</option>
                                    <option value="inglés">Inglés</option>
                                    <option value="portugués">Portugués</option>
                                    <option value="francés">Francés</option>
                                    <option value="alemán">Alemán</option>
                                </select>
                            </div>

                            <Button type="submit" disabled={loading} className="w-full">
                                <Save className="h-4 w-4 mr-2" />
                                {loading ? 'Guardando...' : 'Guardar Cambios'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Estadísticas */}
                <Card>
                    <CardHeader>
                        <CardTitle>Estadísticas de la Cuenta</CardTitle>
                        <CardDescription>
                            Información sobre tu actividad
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Miembro desde:</span>
                            <span className="text-sm font-medium">
                                {userProfile?.fechaCreacion
                                    ? new Date(userProfile.fechaCreacion).toLocaleDateString('es-ES')
                                    : 'Reciente'
                                }
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Última actualización:</span>
                            <span className="text-sm font-medium">
                                {userProfile?.ultimaActualizacion
                                    ? new Date(userProfile.ultimaActualizacion).toLocaleDateString('es-ES')
                                    : 'Nunca'
                                }
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Entradas del diario:</span>
                            <span className="text-sm font-medium">0</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Fotos subidas:</span>
                            <span className="text-sm font-medium">0</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
