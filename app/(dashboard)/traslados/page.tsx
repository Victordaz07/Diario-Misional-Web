'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, MapPin } from 'lucide-react';

export default function TrasladosPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Traslados</h1>
                    <p className="mt-2 text-lg text-gray-600">
                        Registra tus cambios de área cada 6 semanas
                    </p>
                </div>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Traslado
                </Button>
            </div>

            <Card>
                <CardContent className="p-6">
                    <div className="text-center py-8">
                        <MapPin className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                            No hay traslados registrados
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Registra tu primer traslado cuando cambies de área.
                        </p>
                        <div className="mt-6">
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Registrar Primer Traslado
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
