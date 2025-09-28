'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download } from 'lucide-react';

export default function RecursosPage() {
    const recursos = [
        {
            titulo: 'Manual del Misionero',
            descripcion: 'Guía completa para nuevos misioneros',
            tipo: 'PDF',
            categoria: 'Manuales',
        },
        {
            titulo: 'Frases Útiles en Inglés',
            descripcion: 'Frases comunes para conversaciones',
            tipo: 'PDF',
            categoria: 'Idiomas',
        },
        {
            titulo: 'Cómo Enseñar el Evangelio',
            descripcion: 'Técnicas y métodos de enseñanza',
            tipo: 'Video',
            categoria: 'Enseñanza',
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Recursos</h1>
                <p className="mt-2 text-lg text-gray-600">
                    Accede a materiales de estudio y herramientas útiles
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {recursos.map((recurso, index) => (
                    <Card key={index}>
                        <CardHeader>
                            <div className="flex items-center space-x-2">
                                <FileText className="h-5 w-5 text-gray-600" />
                                <CardTitle className="text-lg">{recurso.titulo}</CardTitle>
                            </div>
                            <CardDescription>{recurso.descripcion}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between items-center">
                                <div>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {recurso.tipo}
                                    </span>
                                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                        {recurso.categoria}
                                    </span>
                                </div>
                                <Button size="sm" variant="outline">
                                    <Download className="h-4 w-4 mr-1" />
                                    Descargar
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
