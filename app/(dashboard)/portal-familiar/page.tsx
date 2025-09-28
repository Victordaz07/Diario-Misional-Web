'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useTranslations } from '@/lib/use-translations';

export default function PortalFamiliarPage() {
    const { user } = useAuth();
    const { t } = useTranslations();
    const [activeTab, setActiveTab] = useState('diary');

    const missionaryData = {
        name: 'Elder Smith',
        mission: 'Argentina Buenos Aires Norte',
        daysServed: 245,
        photosShared: 156,
        status: 'Conectado'
    };

    const diaryEntries = [
        {
            id: 1,
            title: 'Enseñando a la Familia González',
            content: 'Hoy tuvimos una experiencia increíble enseñando a la familia González. El Espíritu estuvo muy presente durante toda la lección. La hermana González hizo preguntas muy profundas sobre el Plan de Salvación...',
            date: '15 de Enero, 2024',
            category: 'Experiencia Espiritual',
            categoryColor: 'bg-blue-100 text-blue-700',
            location: 'Área Centro, Buenos Aires',
            timeAgo: 'Hace 2 horas',
            author: 'Elder Smith',
            avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg'
        },
        {
            id: 2,
            title: 'Día de Servicio en el Comedor',
            content: 'Pasamos el día sirviendo en el comedor comunitario. Fue hermoso ver cómo las personas se acercaban con gratitud. Pudimos compartir nuestro testimonio con varios visitantes...',
            date: '14 de Enero, 2024',
            category: 'Servicio',
            categoryColor: 'bg-green-100 text-green-700',
            location: 'Comedor San José',
            timeAgo: 'Ayer',
            author: 'Elder Smith',
            avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg',
            images: [
                'https://storage.googleapis.com/uxpilot-auth.appspot.com/acd9145f3e-2443eeab6f6a8c0670ff.png',
                'https://storage.googleapis.com/uxpilot-auth.appspot.com/9ec9429f10-2934ba4f7dde6b625494.png',
                'https://storage.googleapis.com/uxpilot-auth.appspot.com/5e8c359aaf-7e6fd59d96960ad42feb.png'
            ]
        },
        {
            id: 3,
            title: 'Reflexiones sobre el Compañerismo',
            content: 'He estado reflexionando sobre la importancia del compañerismo en la misión. Elder Johnson y yo hemos desarrollado una gran amistad y trabajamos muy bien juntos. Cada día aprendemos algo nuevo...',
            date: '12 de Enero, 2024',
            category: 'Reflexión',
            categoryColor: 'bg-purple-100 text-purple-700',
            location: 'Apartamento Misional',
            timeAgo: 'Hace 3 días',
            author: 'Elder Smith',
            avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg'
        }
    ];

    const photos = [
        {
            id: 1,
            title: 'Enseñando a la Familia González',
            date: '15 Ene 2024',
            image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/8dc8c2ece5-ffbb0c621fc6291863e4.png'
        },
        {
            id: 2,
            title: 'Servicio en el Comedor',
            date: '14 Ene 2024',
            image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/38bd6283ab-b7625cfb595df4051b61.png'
        },
        {
            id: 3,
            title: 'Con Elder Johnson',
            date: '12 Ene 2024',
            image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/41579ec575-690e4c17d08595310b1c.png'
        },
        {
            id: 4,
            title: 'Atardecer en Buenos Aires',
            date: '10 Ene 2024',
            image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/201ecaec1f-64fcadc4b8370341b237.png'
        }
    ];

    const transfers = [
        {
            id: 1,
            from: 'Área Centro',
            to: 'Área Norte',
            companion: 'Elder Johnson',
            date: '10 de Enero, 2024',
            status: 'Actual',
            statusColor: 'bg-blue-100 text-blue-700'
        },
        {
            id: 2,
            from: 'Área Sur',
            to: 'Área Centro',
            companion: 'Elder Martinez',
            date: '15 de Noviembre, 2023',
            status: 'Anterior',
            statusColor: 'bg-gray-100 text-gray-600'
        },
        {
            id: 3,
            from: 'CCM',
            to: 'Área Sur',
            companion: 'Elder Rodriguez',
            date: '20 de Agosto, 2023',
            status: 'Primer traslado',
            statusColor: 'bg-gray-100 text-gray-600'
        }
    ];

    const sponsorshipData = {
        monthlyContribution: '$450',
        activeMonths: 8,
        nextReport: '1 de Febrero'
    };

    const impactReport = {
        month: 'Enero 2024',
        peopleTaught: 12,
        baptisms: 3,
        serviceHours: 45,
        lessonsTaught: 28
    };

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };

    const renderDiaryFeed = () => (
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Entradas Recientes del Diario</h3>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Solo lectura</span>
            </div>

            {diaryEntries.map((entry) => (
                <article key={entry.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                            <img src={entry.avatar} alt={entry.author} className="w-10 h-10 rounded-full" />
                            <div>
                                <p className="font-medium text-gray-800">{entry.author}</p>
                                <p className="text-xs text-gray-500">{entry.date}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${entry.categoryColor}`}>
                                {entry.category}
                            </span>
                        </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-2">{entry.title}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                        {entry.content}
                    </p>
                    
                    {entry.images && (
                        <div className="grid grid-cols-3 gap-2 mb-4">
                            {entry.images.map((image, index) => (
                                <img 
                                    key={index}
                                    className="w-full h-20 object-cover rounded-lg" 
                                    src={image} 
                                    alt={`Imagen ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>📍 {entry.location}</span>
                        <span>⏱️ {entry.timeAgo}</span>
                    </div>
                </article>
            ))}
        </section>
    );

    const renderPhotosFeed = () => (
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Galería de Fotos</h3>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Solo lectura</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {photos.map((photo) => (
                    <div key={photo.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <img className="w-full h-32 object-cover" src={photo.image} alt={photo.title} />
                        <div className="p-3">
                            <p className="text-xs text-gray-600">{photo.title}</p>
                            <p className="text-xs text-gray-400">{photo.date}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );

    const renderTransfersFeed = () => (
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Historial de Traslados</h3>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Solo lectura</span>
            </div>

            <div className="space-y-3">
                {transfers.map((transfer) => (
                    <div key={transfer.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-800">
                                {transfer.from} → {transfer.to}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full ${transfer.statusColor}`}>
                                {transfer.status}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600">Con {transfer.companion}</p>
                        <p className="text-xs text-gray-500">{transfer.date}</p>
                    </div>
                ))}
            </div>
        </section>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
                <div className="px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                                <i className="fa-solid fa-book text-white text-lg"></i>
                            </div>
                            <div>
                                <h1 className="text-lg font-semibold text-gray-800">Portal Familiar</h1>
                                <p className="text-xs text-gray-500">{missionaryData.name} - {missionaryData.mission}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-xs font-medium text-green-700">{missionaryData.status}</span>
                            </div>
                            
                            <button className="p-2 text-gray-500 hover:text-gray-700">
                                <i className="fa-solid fa-sign-out-alt"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="p-4 space-y-6">
                {/* Welcome Banner */}
                <section className="bg-gradient-to-r from-primary to-accent p-6 rounded-xl text-white">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i className="fa-solid fa-heart text-2xl"></i>
                        </div>
                        <h2 className="text-xl font-bold mb-2">¡Bienvenidos Familia Smith!</h2>
                        <p className="text-blue-100 text-sm">Sigan el progreso de {missionaryData.name} en su misión</p>
                        <div className="mt-4 flex justify-center space-x-6 text-sm">
                            <div className="text-center">
                                <div className="font-bold text-lg">{missionaryData.daysServed}</div>
                                <div className="text-blue-100">días servidos</div>
                            </div>
                            <div className="text-center">
                                <div className="font-bold text-lg">{missionaryData.photosShared}</div>
                                <div className="text-blue-100">fotos compartidas</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Navigation */}
                <section className="grid grid-cols-3 gap-3">
                    <button 
                        onClick={() => handleTabChange('diary')}
                        className={`p-4 rounded-xl shadow-sm text-center transition-colors ${
                            activeTab === 'diary' 
                                ? 'bg-white border-2 border-primary' 
                                : 'bg-white border border-gray-200 hover:border-primary'
                        }`}
                    >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2 ${
                            activeTab === 'diary' ? 'bg-primary/10' : 'bg-gray-100'
                        }`}>
                            <i className={`fa-solid fa-book-open ${
                                activeTab === 'diary' ? 'text-primary' : 'text-gray-600'
                            }`}></i>
                        </div>
                        <span className={`text-sm font-medium ${
                            activeTab === 'diary' ? 'text-primary' : 'text-gray-600'
                        }`}>Diario</span>
                    </button>

                    <button 
                        onClick={() => handleTabChange('photos')}
                        className={`p-4 rounded-xl shadow-sm text-center transition-colors ${
                            activeTab === 'photos' 
                                ? 'bg-white border-2 border-primary' 
                                : 'bg-white border border-gray-200 hover:border-primary'
                        }`}
                    >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2 ${
                            activeTab === 'photos' ? 'bg-primary/10' : 'bg-gray-100'
                        }`}>
                            <i className={`fa-solid fa-camera ${
                                activeTab === 'photos' ? 'text-primary' : 'text-gray-600'
                            }`}></i>
                        </div>
                        <span className={`text-sm font-medium ${
                            activeTab === 'photos' ? 'text-primary' : 'text-gray-600'
                        }`}>Fotos</span>
                    </button>

                    <button 
                        onClick={() => handleTabChange('transfers')}
                        className={`p-4 rounded-xl shadow-sm text-center transition-colors ${
                            activeTab === 'transfers' 
                                ? 'bg-white border-2 border-primary' 
                                : 'bg-white border border-gray-200 hover:border-primary'
                        }`}
                    >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2 ${
                            activeTab === 'transfers' ? 'bg-primary/10' : 'bg-gray-100'
                        }`}>
                            <i className={`fa-solid fa-route ${
                                activeTab === 'transfers' ? 'text-primary' : 'text-gray-600'
                            }`}></i>
                        </div>
                        <span className={`text-sm font-medium ${
                            activeTab === 'transfers' ? 'text-primary' : 'text-gray-600'
                        }`}>Traslados</span>
                    </button>
                </section>

                {/* Content Feed */}
                {activeTab === 'diary' && renderDiaryFeed()}
                {activeTab === 'photos' && renderPhotosFeed()}
                {activeTab === 'transfers' && renderTransfersFeed()}

                {/* Sponsorship Status */}
                <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">Estado del Patrocinio</h3>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-sm font-medium text-green-700">Activo</span>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-primary">{sponsorshipData.monthlyContribution}</div>
                            <div className="text-xs text-gray-500">Contribución mensual</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-secondary">{sponsorshipData.activeMonths}</div>
                            <div className="text-xs text-gray-500">meses activos</div>
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                            <i className="fa-solid fa-heart text-red-500"></i>
                            <span className="text-sm font-medium text-gray-700">Próximo reporte</span>
                        </div>
                        <p className="text-xs text-gray-600">Recibirán el reporte mensual el {sponsorshipData.nextReport}</p>
                    </div>
                </section>

                {/* Impact Report */}
                <section className="bg-gradient-to-br from-secondary/10 to-primary/10 rounded-xl p-5 border border-secondary/20">
                    <div className="text-center mb-4">
                        <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                            <i className="fa-solid fa-chart-line text-secondary text-xl"></i>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">Reporte de Impacto</h3>
                        <p className="text-sm text-gray-600">{impactReport.month}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                            <div className="text-2xl font-bold text-gray-800">{impactReport.peopleTaught}</div>
                            <div className="text-xs text-gray-600">Personas enseñadas</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-800">{impactReport.baptisms}</div>
                            <div className="text-xs text-gray-600">Bautismos</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-800">{impactReport.serviceHours}</div>
                            <div className="text-xs text-gray-600">Horas de servicio</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-800">{impactReport.lessonsTaught}</div>
                            <div className="text-xs text-gray-600">Lecciones impartidas</div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
