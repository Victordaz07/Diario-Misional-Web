'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useTranslations } from '@/lib/use-translations';
import Link from 'next/link';

export default function AlbumPreviewPage() {
    const { user } = useAuth();
    const { t } = useTranslations();
    const [isGenerating, setIsGenerating] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages] = useState(150);
    const [progress, setProgress] = useState(0);

    const albumStats = {
        photos: 47,
        entries: 23,
        graphics: 12,
        totalPages: 150
    };

    useEffect(() => {
        // Simulate PDF generation
        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 75) {
                    setIsGenerating(false);
                    clearInterval(timer);
                    return 75;
                }
                return prev + 1;
            });
        }, 50);

        return () => clearInterval(timer);
    }, []);

    const handlePageChange = (direction: 'prev' | 'next') => {
        if (direction === 'prev' && currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        } else if (direction === 'next' && currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const handleZoom = (type: 'in' | 'out') => {
        console.log(`Zoom ${type}`);
    };

    const handleRotate = () => {
        console.log('Rotate page');
    };

    const handleFullscreen = () => {
        console.log('Toggle fullscreen');
    };

    const goBackToEdit = () => {
        // Navigate back to customization page
        window.location.href = '/album-final/personalizar';
    };

    const confirmPrint = () => {
        // Navigate to payment page
        window.location.href = '/album-final/pago';
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-white shadow-sm px-4 py-4 flex items-center">
                <Link href="/album-final/personalizar" className="mr-4">
                    <i className="fa-solid fa-arrow-left text-gray-600 text-lg"></i>
                </Link>
                <div className="flex-1">
                    <h1 className="text-lg font-semibold text-gray-900">Previsualización</h1>
                    <p className="text-sm text-gray-500">Álbum Completo • {albumStats.totalPages} páginas</p>
                </div>
                <button>
                    <i className="fa-solid fa-ellipsis-vertical text-gray-600"></i>
                </button>
            </div>

            {/* Progress Bar */}
            <div className="bg-white px-4 py-3 border-b border-gray-100">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Progreso del álbum</span>
                    <span className="text-sm font-semibold text-primary">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300" 
                        style={{width: `${progress}%`}}
                    ></div>
                </div>
            </div>

            {/* Album Info Card */}
            <div className="mx-4 mt-4 bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                        <i className="fa-solid fa-book text-white"></i>
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">Álbum Completo</h3>
                        <p className="text-sm text-gray-500">Diario + Fotos + Estadísticas</p>
                        <div className="flex items-center space-x-4 mt-1">
                            <span className="text-xs bg-blue-50 text-primary px-2 py-1 rounded-full">{albumStats.totalPages} páginas</span>
                            <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full">{albumStats.photos} fotos</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* PDF Viewer Container */}
            <div className="mx-4 mt-6">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    {/* PDF Viewer Header */}
                    <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-b border-gray-200">
                        <div className="flex items-center space-x-2">
                            <i className="fa-solid fa-file-pdf text-red-500"></i>
                            <span className="text-sm font-medium text-gray-700">mi-album-final.pdf</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button 
                                onClick={() => handleZoom('out')}
                                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                <i className="fa-solid fa-search-minus text-gray-600 text-sm"></i>
                            </button>
                            <span className="text-sm text-gray-500">{currentPage} / {totalPages}</span>
                            <button 
                                onClick={() => handleZoom('in')}
                                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                <i className="fa-solid fa-search-plus text-gray-600 text-sm"></i>
                            </button>
                        </div>
                    </div>

                    {/* PDF Preview Area */}
                    <div className="h-96 bg-gray-100 relative overflow-hidden">
                        {/* Mock PDF Page */}
                        <div className="absolute inset-4 bg-white shadow-lg rounded-lg overflow-hidden">
                            {/* Page Header */}
                            <div className="bg-gradient-to-r from-primary to-blue-600 h-16 flex items-center justify-center">
                                <h2 className="text-white font-bold text-lg">Mi Diario Misional</h2>
                            </div>
                            
                            {/* Page Content Mock */}
                            <div className="p-4 space-y-3">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                                    <div className="flex-1 space-y-1">
                                        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                                        <div className="h-2 bg-gray-100 rounded w-1/2"></div>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-2 mt-4">
                                    <div className="h-20 bg-gray-200 rounded"></div>
                                    <div className="h-20 bg-gray-200 rounded"></div>
                                </div>
                                
                                <div className="space-y-2">
                                    <div className="h-2 bg-gray-200 rounded"></div>
                                    <div className="h-2 bg-gray-200 rounded w-5/6"></div>
                                    <div className="h-2 bg-gray-200 rounded w-4/6"></div>
                                </div>
                            </div>
                        </div>

                        {/* Loading Overlay */}
                        {isGenerating && (
                            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                                <div className="bg-white rounded-lg p-4 flex items-center space-x-3">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                                    <span className="text-sm text-gray-700">Generando vista previa...</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* PDF Navigation Controls */}
                    <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200">
                        <button 
                            onClick={() => handlePageChange('prev')}
                            disabled={currentPage === 1}
                            className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <i className="fa-solid fa-chevron-left text-gray-600 text-sm"></i>
                            <span className="text-sm text-gray-700">Anterior</span>
                        </button>
                        
                        <div className="flex items-center space-x-2">
                            <button 
                                onClick={handleRotate}
                                className="w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                            >
                                <i className="fa-solid fa-rotate-left text-gray-600 text-xs"></i>
                            </button>
                            <button 
                                onClick={handleFullscreen}
                                className="w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                            >
                                <i className="fa-solid fa-expand text-gray-600 text-xs"></i>
                            </button>
                        </div>
                        
                        <button 
                            onClick={() => handlePageChange('next')}
                            disabled={currentPage === totalPages}
                            className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="text-sm text-gray-700">Siguiente</span>
                            <i className="fa-solid fa-chevron-right text-gray-600 text-sm"></i>
                        </button>
                    </div>
                </div>
            </div>

            {/* Preview Stats */}
            <div className="mx-4 mt-4 bg-white rounded-xl shadow-sm p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Resumen del Contenido</h3>
                <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                        <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-2">
                            <i className="fa-solid fa-images text-primary text-sm"></i>
                        </div>
                        <p className="text-lg font-bold text-gray-900">{albumStats.photos}</p>
                        <p className="text-xs text-gray-500">Fotos</p>
                    </div>
                    <div className="text-center">
                        <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-2">
                            <i className="fa-solid fa-file-text text-green-600 text-sm"></i>
                        </div>
                        <p className="text-lg font-bold text-gray-900">{albumStats.entries}</p>
                        <p className="text-xs text-gray-500">Entradas</p>
                    </div>
                    <div className="text-center">
                        <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-2">
                            <i className="fa-solid fa-chart-bar text-purple-600 text-sm"></i>
                        </div>
                        <p className="text-lg font-bold text-gray-900">{albumStats.graphics}</p>
                        <p className="text-xs text-gray-500">Gráficos</p>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="mx-4 mt-6 space-y-3 pb-8">
                {/* Edit Button */}
                <button 
                    onClick={goBackToEdit}
                    className="w-full bg-white border border-gray-200 rounded-xl py-4 px-6 flex items-center justify-center space-x-3 shadow-sm hover:bg-gray-50 transition-colors"
                >
                    <i className="fa-solid fa-edit text-primary"></i>
                    <span className="font-medium text-gray-900">Volver a Editar</span>
                </button>

                {/* Confirm Print Button */}
                <button 
                    onClick={confirmPrint}
                    className="w-full bg-gradient-to-r from-primary to-blue-600 rounded-xl py-4 px-6 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transition-all"
                >
                    <i className="fa-solid fa-print text-white"></i>
                    <span className="font-semibold text-white">Confirmar para Imprimir</span>
                </button>

                {/* Download Preview Button */}
                <button className="w-full bg-gray-50 border border-gray-100 rounded-xl py-4 px-6 flex items-center justify-center space-x-3">
                    <i className="fa-solid fa-download text-gray-600"></i>
                    <span className="font-medium text-gray-600">Descargar Vista Previa</span>
                </button>
            </div>

            {/* Bottom Safe Area */}
            <div className="h-8"></div>
        </div>
    );
}
