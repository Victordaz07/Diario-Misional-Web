'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useTranslations } from '@/lib/use-translations';
import Link from 'next/link';
import LanguageSelector from '@/components/language-selector';

export default function AlbumSelectionPage() {
    const { user } = useAuth();
    const { t } = useTranslations();
    const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const albumData = {
        complete: {
            title: 'Álbum Completo',
            description: 'Diario completo + Fotos + Estadísticas detalladas de tu misión',
            price: '$89.99',
            pages: '150 páginas',
            image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/db3efec13f-6f451128da698300a903.png',
            badge: 'Más Popular',
            badgeColor: 'bg-accent',
            features: [
                'Todas tus entradas del diario',
                'Galería completa de fotos',
                'Estadísticas y mapas de actividad',
                'Tapa dura premium'
            ]
        },
        photobook: {
            title: 'Fotolibro',
            description: 'Solo fotos destacadas + datos básicos de tu experiencia misionera',
            price: '$59.99',
            pages: '100 páginas',
            image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/c000edc77d-8a32e6695ef4cc3cf44b.png',
            badge: null,
            badgeColor: '',
            features: [
                'Fotos seleccionadas',
                'Datos básicos de misión',
                'Diseño fotográfico premium',
                'Tapa blanda de calidad'
            ]
        },
        family: {
            title: 'Familiar',
            description: 'Fotos especiales + mensaje final para compartir con la familia',
            price: '$39.99',
            pages: '50 páginas',
            image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/18657311b8-ba2ad1f5f3c15699716b.png',
            badge: 'Compacto',
            badgeColor: 'bg-green-500',
            features: [
                'Fotos más especiales',
                'Mensaje personal final',
                'Formato ideal para compartir',
                'Precio accesible'
            ]
        }
    };

    const handleAlbumSelect = (albumType: string) => {
        setSelectedAlbum(albumType);
    };

    const handleContinue = () => {
        if (selectedAlbum) {
            setIsLoading(true);
            // Simulate navigation
            setTimeout(() => {
                // Navigate to customization page
                console.log(`Navigating to customization with: ${albumData[selectedAlbum as keyof typeof albumData].title}`);
            }, 1000);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-white shadow-sm px-4 py-4 flex items-center">
                <Link href="/album-final" className="mr-4">
                    <i className="fa-solid fa-arrow-left text-gray-600 text-lg"></i>
                </Link>
                <div className="flex-1">
                    <h1 className="text-lg font-semibold text-gray-900">Elige tu Álbum Final</h1>
                    <p className="text-sm text-gray-500">Selecciona el formato perfecto para ti</p>
                </div>
                <button>
                    <i className="fa-solid fa-question-circle text-gray-600"></i>
                </button>
            </div>

            {/* Progress Indicator */}
            <div className="px-4 py-3 bg-white border-b border-gray-100">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                    <span>Paso 1 de 6</span>
                    <span>Selección de Tipo</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-primary h-1.5 rounded-full w-1/6 transition-all duration-300"></div>
                </div>
            </div>

            {/* Album Options */}
            <div className="px-4 py-6 space-y-4">
                {Object.entries(albumData).map(([key, album]) => (
                    <div
                        key={key}
                        className={`bg-white rounded-2xl shadow-sm border overflow-hidden cursor-pointer transition-all duration-200 ${
                            selectedAlbum === key 
                                ? 'ring-2 ring-primary ring-offset-2 border-primary' 
                                : 'border-gray-100 hover:border-gray-200'
                        }`}
                        onClick={() => handleAlbumSelect(key)}
                    >
                        <div className="relative">
                            <img 
                                className="w-full h-48 object-cover" 
                                src={album.image} 
                                alt={album.title}
                            />
                            {album.badge && (
                                <div className={`absolute top-3 right-3 ${album.badgeColor} text-white px-2 py-1 rounded-full text-xs font-medium`}>
                                    {album.badge}
                                </div>
                            )}
                        </div>
                        <div className="p-4">
                            <div className="flex items-start justify-between mb-2">
                                <h3 className="text-lg font-semibold text-gray-900">{album.title}</h3>
                                <div className="text-right">
                                    <p className="text-lg font-bold text-primary">{album.price}</p>
                                    <p className="text-xs text-gray-500">{album.pages}</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{album.description}</p>
                            
                            {/* Features List */}
                            <div className="space-y-2 mb-4">
                                {album.features.map((feature, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                        <i className="fa-solid fa-check text-green-500 text-xs"></i>
                                        <span className="text-xs text-gray-600">{feature}</span>
                                    </div>
                                ))}
                            </div>
                            
                            <div className={`w-full h-px ${selectedAlbum === key ? 'bg-primary' : 'bg-gray-100'}`}></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Comparison Section */}
            <div className="mx-4 mt-2 mb-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <i className="fa-solid fa-info text-primary text-sm"></i>
                        </div>
                        <h3 className="font-semibold text-gray-900">¿Necesitas ayuda para decidir?</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Todos los álbumes incluyen impresión de alta calidad y envío gratuito a toda Colombia.</p>
                    <button className="text-primary text-sm font-medium flex items-center space-x-1">
                        <span>Ver comparación detallada</span>
                        <i className="fa-solid fa-chevron-right text-xs"></i>
                    </button>
                </div>
            </div>

            {/* Selected Album Summary */}
            {selectedAlbum && (
                <div className="mx-4 mb-6 bg-white rounded-xl shadow-sm p-4 border-l-4 border-accent">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-gray-900">{albumData[selectedAlbum as keyof typeof albumData].title}</h3>
                            <p className="text-sm text-gray-600">{albumData[selectedAlbum as keyof typeof albumData].description}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-lg font-bold text-primary">{albumData[selectedAlbum as keyof typeof albumData].price}</p>
                            <p className="text-xs text-gray-500">{albumData[selectedAlbum as keyof typeof albumData].pages}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Continue Button */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4">
                <button 
                    onClick={handleContinue}
                    disabled={!selectedAlbum || isLoading}
                    className={`w-full rounded-xl py-4 px-6 font-semibold text-center transition-all duration-200 ${
                        selectedAlbum && !isLoading
                            ? 'bg-primary text-white hover:bg-primary/90'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Cargando...</span>
                        </div>
                    ) : selectedAlbum ? (
                        <div className="flex items-center justify-center space-x-2">
                            <span>Continuar con {albumData[selectedAlbum as keyof typeof albumData].title}</span>
                            <i className="fa-solid fa-arrow-right text-sm"></i>
                        </div>
                    ) : (
                        'Selecciona un álbum para continuar'
                    )}
                </button>
            </div>

            {/* Bottom Safe Area */}
            <div className="h-20"></div>
        </div>
    );
}
