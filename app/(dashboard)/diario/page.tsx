'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, BookOpen } from 'lucide-react';

export default function DiarioPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Mi Diario</h1>
                    <p className="mt-2 text-lg text-gray-600">
                        Documenta tus experiencias y reflexiones diarias
                    </p>
                </div>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Entrada
                </Button>
            </div>

            <Card>
                <CardContent className="p-6">
                    <div className="text-center py-8">
                        <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                            No hay entradas aún
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Comienza escribiendo tu primera entrada en el diario.
                        </p>
                        <div className="mt-6">
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Crear Primera Entrada
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
