'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useTranslations } from '@/lib/use-translations';
import Link from 'next/link';
import LanguageSelector from '@/components/language-selector';

export default function AlbumFinalPage() {
    const { user } = useAuth();
    const { t } = useTranslations();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [albumType, setAlbumType] = useState('complete');
    const [isGenerating, setIsGenerating] = useState(false);
    const [showShippingForm, setShowShippingForm] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [generationStep, setGenerationStep] = useState(0);

    // Mock data for the album
    const missionStats = {
        daysServed: 730,
        diaryEntries: 342,
        photosCaptured: 1247
    };

    const albumPreview = [
        {
            title: 'Portada',
            icon: 'fa-book',
            color: 'primary',
            pages: 'Página 1',
            bgColor: 'from-gray-100 to-gray-200'
        },
        {
            title: 'Perfil Misional',
            icon: 'fa-user',
            color: 'blue',
            pages: 'Páginas 2-5',
            bgColor: 'from-blue-50 to-blue-100'
        },
        {
            title: 'Diario',
            icon: 'fa-book-open',
            color: 'green',
            pages: 'Páginas 6-120',
            bgColor: 'from-green-50 to-green-100'
        },
        {
            title: 'Galería',
            icon: 'fa-images',
            color: 'yellow',
            pages: 'Páginas 121-150',
            bgColor: 'from-yellow-50 to-yellow-100'
        }
    ];

    const generationSteps = [
        { text: 'Recopilando entradas del diario', completed: true },
        { text: 'Organizando fotografías', completed: false, current: true },
        { text: 'Generando diseño final', completed: false },
        { text: 'Creando archivo PDF', completed: false }
    ];

    const handleGenerateAlbum = () => {
        setIsGenerating(true);
        setGenerationStep(0);
        
        // Simulate generation process
        const steps = [
            { step: 0, delay: 1000 },
            { step: 1, delay: 2000 },
            { step: 2, delay: 2000 },
            { step: 3, delay: 1000 }
        ];

        let currentStep = 0;
        const interval = setInterval(() => {
            if (currentStep < steps.length) {
                setGenerationStep(steps[currentStep].step);
                currentStep++;
            } else {
                clearInterval(interval);
                setIsGenerating(false);
                setShowShippingForm(true);
            }
        }, 1000);
    };

    const handleShippingSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowShippingForm(false);
        setShowConfirmation(true);
    };

    const handleDownloadPDF = () => {
        // Simulate PDF download
        console.log('Downloading PDF...');
    };

    const handlePhysicalShipping = () => {
        console.log('Requesting physical shipping...');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <div className={`fixed left-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                            <i className="fa-solid fa-book text-white text-lg"></i>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">Diario Misional</h2>
                            <p className="text-xs text-gray-500">Web App</p>
                        </div>
                    </div>
                </div>
                
                <nav className="p-4">
                    <ul className="space-y-2">
                        <li>
                            <Link href="/dashboard" className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                                <i className="fa-solid fa-home"></i>
                                <span>Inicio</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/diario" className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                                <i className="fa-solid fa-book-open"></i>
                                <span>Diario</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/traslados" className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                                <i className="fa-solid fa-route"></i>
                                <span>Traslados</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/fotos" className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                                <i className="fa-solid fa-camera"></i>
                                <span>Fotos</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/recursos" className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                                <i className="fa-solid fa-folder"></i>
                                <span>Recursos</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/etapas" className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                                <i className="fa-solid fa-seedling"></i>
                                <span>Etapas</span>
                            </Link>
                        </li>
                        <li>
                            <span className="flex items-center space-x-3 p-3 rounded-lg bg-primary text-white">
                                <i className="fa-solid fa-book-atlas"></i>
                                <span className="font-medium">Álbum Final</span>
                            </span>
                        </li>
                        <li>
                            <Link href="/perfil" className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                                <i className="fa-solid fa-user"></i>
                                <span>Perfil</span>
                            </Link>
                        </li>
                    </ul>
                </nav>
                
                <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-gradient-to-r from-secondary/10 to-primary/10 p-4 rounded-lg border border-secondary/20">
                        <div className="flex items-center space-x-2 mb-2">
                            <i className="fa-solid fa-crown text-secondary"></i>
                            <span className="text-sm font-medium text-gray-700">Patrocinio Activo</span>
                        </div>
                        <p className="text-xs text-gray-600">Conectado con familia</p>
                    </div>
                </div>
            </div>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setSidebarOpen(false)}></div>
            )}

            {/* Main Content */}
            <div className="md:ml-64">
                {/* Header */}
                <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
                    <div className="px-4 py-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <button 
                                    onClick={() => setSidebarOpen(!sidebarOpen)}
                                    className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                                >
                                    <i className="fa-solid fa-bars text-gray-600"></i>
                                </button>
                                <div>
                                    <h1 className="text-xl font-semibold text-gray-800">Álbum Final</h1>
                                    <p className="text-sm text-gray-500">Genera tu álbum misional completo</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                                <LanguageSelector />
                                
                                <div className="flex items-center space-x-2">
                                    <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg" alt="User" className="w-8 h-8 rounded-full" />
                                    <span className="text-sm font-medium text-gray-700 hidden sm:block">Elder Smith</span>
                                </div>
                                
                                <button className="p-2 text-gray-500 hover:text-gray-700">
                                    <i className="fa-solid fa-sign-out-alt"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="p-4 space-y-6">
                    {/* Congratulations Section */}
                    <section className="relative bg-gradient-to-br from-primary via-accent to-secondary p-8 rounded-2xl text-white overflow-hidden">
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="relative z-10 text-center space-y-4">
                            <div className="w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4">
                                <i className="fa-solid fa-trophy text-4xl text-white"></i>
                            </div>
                            <h2 className="text-3xl font-bold">¡Felicitaciones Elder Smith!</h2>
                            <p className="text-lg text-blue-100">Has completado una misión extraordinaria</p>
                            <div className="flex items-center justify-center space-x-6 mt-6">
                                <div className="text-center">
                                    <div className="text-2xl font-bold">{missionStats.daysServed}</div>
                                    <div className="text-sm text-blue-100">Días servidos</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold">{missionStats.diaryEntries}</div>
                                    <div className="text-sm text-blue-100">Entradas del diario</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold">{missionStats.photosCaptured.toLocaleString()}</div>
                                    <div className="text-sm text-blue-100">Fotos capturadas</div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Album Preview */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-semibold text-gray-800">Vista Previa del Álbum</h3>
                            <span className="text-sm text-gray-500">PDF • ~150 páginas</span>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            {albumPreview.map((item, index) => (
                                <div key={index} className={`aspect-[3/4] bg-gradient-to-br ${item.bgColor} rounded-lg p-4 flex flex-col justify-between`}>
                                    <div className="text-center">
                                        <i className={`fa-solid ${item.icon} text-2xl mb-2 ${
                                            item.color === 'primary' ? 'text-primary' :
                                            item.color === 'blue' ? 'text-blue-600' :
                                            item.color === 'green' ? 'text-green-600' :
                                            'text-yellow-600'
                                        }`}></i>
                                        <p className="text-xs font-medium text-gray-700">{item.title}</p>
                                    </div>
                                    <div className="text-xs text-gray-500 text-center">{item.pages}</div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-4 rounded-lg border border-primary/10">
                            <div className="flex items-start space-x-3">
                                <i className="fa-solid fa-info-circle text-primary mt-1"></i>
                                <div>
                                    <p className="text-sm font-medium text-gray-800">Tu álbum incluirá:</p>
                                    <ul className="text-sm text-gray-600 mt-2 space-y-1">
                                        <li>• Todas tus entradas del diario organizadas cronológicamente</li>
                                        <li>• Galería de fotos con descripciones y ubicaciones</li>
                                        <li>• Línea de tiempo de traslados y compañeros</li>
                                        <li>• Reflexiones de etapas misionales</li>
                                        <li>• Estadísticas y logros de tu misión</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Generation Options */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Opciones de Generación</h3>
                        
                        <div className="space-y-4">
                            <div className={`border rounded-lg p-4 ${albumType === 'complete' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center space-x-3">
                                        <input 
                                            type="radio" 
                                            name="albumType" 
                                            id="complete" 
                                            checked={albumType === 'complete'}
                                            onChange={() => setAlbumType('complete')}
                                            className="text-primary focus:ring-primary"
                                        />
                                        <label htmlFor="complete" className="font-medium text-gray-800">Álbum Completo</label>
                                    </div>
                                    <span className="text-sm text-green-600 font-medium">Recomendado</span>
                                </div>
                                <p className="text-sm text-gray-600 ml-6">Incluye todo el contenido de tu misión (diario, fotos, traslados, reflexiones)</p>
                            </div>
                            
                            <div className={`border rounded-lg p-4 ${albumType === 'highlights' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}>
                                <div className="flex items-center space-x-3 mb-3">
                                    <input 
                                        type="radio" 
                                        name="albumType" 
                                        id="highlights"
                                        checked={albumType === 'highlights'}
                                        onChange={() => setAlbumType('highlights')}
                                        className="text-primary focus:ring-primary"
                                    />
                                    <label htmlFor="highlights" className="font-medium text-gray-800">Solo Destacados</label>
                                </div>
                                <p className="text-sm text-gray-600 ml-6">Versión resumida con las mejores entradas y fotos seleccionadas</p>
                            </div>
                            
                            <div className={`border rounded-lg p-4 ${albumType === 'custom' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}>
                                <div className="flex items-center space-x-3 mb-3">
                                    <input 
                                        type="radio" 
                                        name="albumType" 
                                        id="custom"
                                        checked={albumType === 'custom'}
                                        onChange={() => setAlbumType('custom')}
                                        className="text-primary focus:ring-primary"
                                    />
                                    <label htmlFor="custom" className="font-medium text-gray-800">Personalizado</label>
                                </div>
                                <p className="text-sm text-gray-600 ml-6">Selecciona manualmente qué contenido incluir</p>
                            </div>
                        </div>
                    </section>

                    {/* Generate Section */}
                    {!isGenerating && !showShippingForm && !showConfirmation && (
                        <section className="space-y-4">
                            <button 
                                onClick={handleGenerateAlbum}
                                className="w-full bg-gradient-to-r from-primary to-accent text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-primary/90 hover:to-accent/90 transition-all duration-300 shadow-lg"
                            >
                                <i className="fa-solid fa-magic mr-2"></i>
                                Generar Álbum PDF
                            </button>
                        </section>
                    )}

                    {/* Generation Progress */}
                    {isGenerating && (
                        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="font-semibold text-gray-800">Generando tu álbum...</h4>
                                <span className="text-sm text-gray-500">Paso {generationStep + 1} de 4</span>
                            </div>
                            
                            <div className="space-y-3">
                                {generationSteps.map((step, index) => (
                                    <div key={index} className="flex items-center space-x-3">
                                        {step.completed ? (
                                            <i className="fa-solid fa-check text-green-500"></i>
                                        ) : step.current && index === generationStep ? (
                                            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <i className="fa-solid fa-clock text-gray-300"></i>
                                        )}
                                        <span className={`text-sm ${
                                            step.completed ? 'text-gray-600' : 
                                            step.current && index === generationStep ? 'text-gray-600' : 
                                            'text-gray-400'
                                        }`}>
                                            {step.text}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="mt-4">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                        className="bg-primary h-2 rounded-full transition-all duration-300" 
                                        style={{ width: `${((generationStep + 1) / 4) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Shipping Form */}
                    {showShippingForm && (
                        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                    <i className="fa-solid fa-check text-green-600"></i>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">¡Álbum generado exitosamente!</h3>
                                    <p className="text-sm text-gray-600">Completa los datos para el envío físico</p>
                                </div>
                            </div>
                            
                            <form onSubmit={handleShippingSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Nombre completo</label>
                                        <input type="text" defaultValue="Elder John Smith" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                                        <input type="tel" placeholder="+1 (555) 123-4567" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Dirección de envío</label>
                                    <input type="text" placeholder="Calle y número" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                                </div>
                                
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Ciudad</label>
                                        <input type="text" placeholder="Ciudad" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Estado/Provincia</label>
                                        <input type="text" placeholder="Estado" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Código postal</label>
                                        <input type="text" placeholder="12345" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">País</label>
                                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                                        <option>Estados Unidos</option>
                                        <option>Argentina</option>
                                        <option>Brasil</option>
                                        <option>México</option>
                                        <option>España</option>
                                    </select>
                                </div>
                                
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div className="flex items-start space-x-3">
                                        <i className="fa-solid fa-info-circle text-blue-600 mt-1"></i>
                                        <div>
                                            <p className="text-sm font-medium text-blue-800">Información de envío</p>
                                            <p className="text-sm text-blue-700 mt-1">El álbum físico será enviado sin costo adicional. Tiempo estimado de entrega: 2-3 semanas.</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex space-x-4">
                                    <button 
                                        type="button" 
                                        onClick={handleDownloadPDF}
                                        className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                                    >
                                        <i className="fa-solid fa-download mr-2"></i>
                                        Solo descargar PDF
                                    </button>
                                    <button 
                                        type="submit" 
                                        onClick={handlePhysicalShipping}
                                        className="flex-1 bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                                    >
                                        <i className="fa-solid fa-shipping-fast mr-2"></i>
                                        Solicitar envío físico
                                    </button>
                                </div>
                            </form>
                        </section>
                    )}

                    {/* Confirmation */}
                    {showConfirmation && (
                        <section className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6">
                            <div className="text-center space-y-4">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                    <i className="fa-solid fa-check text-2xl text-green-600"></i>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800">¡Pedido confirmado!</h3>
                                <p className="text-gray-600">Tu álbum misional ha sido procesado exitosamente</p>
                                
                                <div className="bg-white rounded-lg p-4 text-left">
                                    <h4 className="font-medium text-gray-800 mb-2">Resumen del pedido:</h4>
                                    <div className="space-y-1 text-sm text-gray-600">
                                        <p>• Álbum PDF: <span className="text-green-600 font-medium">Descargado</span></p>
                                        <p>• Envío físico: <span className="text-blue-600 font-medium">En proceso</span></p>
                                        <p>• Número de seguimiento: <span className="font-mono">#AM2024-001234</span></p>
                                    </div>
                                </div>
                                
                                <div className="flex space-x-4">
                                    <button 
                                        onClick={handleDownloadPDF}
                                        className="flex-1 bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                                    >
                                        <i className="fa-solid fa-download mr-2"></i>
                                        Descargar PDF
                                    </button>
                                    <Link 
                                        href="/dashboard"
                                        className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors text-center"
                                    >
                                        <i className="fa-solid fa-home mr-2"></i>
                                        Ir al inicio
                                    </Link>
                                </div>
                            </div>
                        </section>
                    )}
                </main>
            </div>
        </div>
    );
}
