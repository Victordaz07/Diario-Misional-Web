'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useTranslations } from '@/lib/use-translations';
import Link from 'next/link';
import LanguageSelector from '@/components/language-selector';

interface Resource {
    id: string;
    title: string;
    description: string;
    type: 'pdf' | 'tip' | 'video';
    category: 'teaching' | 'leadership' | 'study' | 'wellbeing';
    downloads?: number;
    views?: number;
    icon: string;
    iconColor: string;
    tagColor: string;
}

interface RecentDownload {
    id: string;
    title: string;
    type: 'pdf' | 'tip' | 'video';
    downloadedAt: Date;
    icon: string;
    iconColor: string;
}

const mockResources: Resource[] = [
    {
        id: '1',
        title: 'Guía de Enseñanza Efectiva',
        description: 'Técnicas y principios para enseñar con el Espíritu y crear conexiones significativas.',
        type: 'pdf',
        category: 'teaching',
        downloads: 245,
        icon: 'fa-solid fa-file-pdf',
        iconColor: 'text-red-600',
        tagColor: 'bg-blue-100 text-blue-700',
    },
    {
        id: '2',
        title: 'Tip: Manejo del Tiempo',
        description: 'Consejos prácticos para organizar tu día y maximizar el tiempo de enseñanza.',
        type: 'tip',
        category: 'teaching',
        views: 156,
        icon: 'fa-solid fa-lightbulb',
        iconColor: 'text-yellow-600',
        tagColor: 'bg-green-100 text-green-700',
    },
    {
        id: '3',
        title: 'Manual de Liderazgo',
        description: 'Principios de liderazgo cristiano y desarrollo de habilidades de comunicación.',
        type: 'pdf',
        category: 'leadership',
        downloads: 189,
        icon: 'fa-solid fa-file-pdf',
        iconColor: 'text-purple-600',
        tagColor: 'bg-blue-100 text-blue-700',
    },
    {
        id: '4',
        title: 'Tip: Estudio Personal',
        description: 'Métodos efectivos para el estudio de las escrituras y la preparación diaria.',
        type: 'tip',
        category: 'study',
        views: 203,
        icon: 'fa-solid fa-lightbulb',
        iconColor: 'text-green-600',
        tagColor: 'bg-green-100 text-green-700',
    },
];

const mockRecentDownloads: RecentDownload[] = [
    {
        id: '1',
        title: 'Guía de Enseñanza Efectiva',
        type: 'pdf',
        downloadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        icon: 'fa-solid fa-file-pdf',
        iconColor: 'text-red-600',
    },
    {
        id: '3',
        title: 'Manual de Liderazgo',
        type: 'pdf',
        downloadedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        icon: 'fa-solid fa-file-pdf',
        iconColor: 'text-purple-600',
    },
];

const categories = [
    { key: 'teaching', label: 'Enseñanza', icon: 'fa-solid fa-chalkboard-teacher', color: 'bg-blue-100 text-blue-600', count: 8 },
    { key: 'leadership', label: 'Liderazgo', icon: 'fa-solid fa-users', color: 'bg-purple-100 text-purple-600', count: 5 },
    { key: 'study', label: 'Estudio', icon: 'fa-solid fa-book', color: 'bg-green-100 text-green-600', count: 6 },
    { key: 'wellbeing', label: 'Bienestar', icon: 'fa-solid fa-heart', color: 'bg-orange-100 text-orange-600', count: 4 },
];

export default function RecursosPage() {
    const { user } = useAuth();
    const { t } = useTranslations();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [tipModalOpen, setTipModalOpen] = useState(false);
    const [selectedTip, setSelectedTip] = useState<Resource | null>(null);

    const getTimeAgo = (date: Date): string => {
        const now = new Date();
        const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

        if (diffInDays < 7) {
            return `hace ${diffInDays} días`;
        } else if (diffInDays < 30) {
            const weeks = Math.floor(diffInDays / 7);
            return `hace ${weeks} semanas`;
        } else {
            const months = Math.floor(diffInDays / 30);
            return `hace ${months} meses`;
        }
    };

    const filteredResources = mockResources.filter(resource => {
        const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            resource.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = selectedType === 'all' || resource.type === selectedType;
        const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;

        return matchesSearch && matchesType && matchesCategory;
    });

    const handleTipClick = (resource: Resource) => {
        if (resource.type === 'tip') {
            setSelectedTip(resource);
            setTipModalOpen(true);
        }
    };

    const handleDownload = (resource: Resource) => {
        // Simulate download
        console.log(`Downloading ${resource.title}`);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <div id="sidebar" className={`fixed left-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                            <i className="fa-solid fa-book text-white text-lg"></i>
                        </div>
            <div>
                            <h2 className="text-lg font-semibold text-gray-800">{t('common.appName')}</h2>
                            <p className="text-xs text-gray-500">{t('common.webApp')}</p>
                        </div>
                    </div>
            </div>

                <nav className="p-4">
                    <ul className="space-y-2">
                        <li>
                            <Link href="/dashboard" className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                                <i className="fa-solid fa-home"></i>
                                <span>{t('navigation.home')}</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/diario" className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                                <i className="fa-solid fa-book-open"></i>
                                <span>{t('navigation.diary')}</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/traslados" className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                                <i className="fa-solid fa-route"></i>
                                <span>{t('navigation.transfers')}</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/fotos" className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                                <i className="fa-solid fa-camera"></i>
                                <span>{t('navigation.photos')}</span>
                            </Link>
                        </li>
                        <li>
                            <span className="flex items-center space-x-3 p-3 rounded-lg bg-primary text-white cursor-pointer">
                                <i className="fa-solid fa-folder"></i>
                                <span className="font-medium">{t('navigation.resources')}</span>
                            </span>
                        </li>
                        <li>
                            <Link href="/etapas" className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                                <i className="fa-solid fa-seedling"></i>
                                <span>{t('navigation.stages')}</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/perfil" className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                                <i className="fa-solid fa-user"></i>
                                <span>{t('navigation.profile')}</span>
                            </Link>
                        </li>
                    </ul>
                </nav>

                <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-gradient-to-r from-secondary/10 to-primary/10 p-4 rounded-lg border border-secondary/20">
                        <div className="flex items-center space-x-2 mb-2">
                            <i className="fa-solid fa-crown text-secondary"></i>
                            <span className="text-sm font-medium text-gray-700">{t('common.familySponsorship')}</span>
                        </div>
                        <p className="text-xs text-gray-600">{t('common.connectedWithFamily')}</p>
                    </div>
                </div>
                            </div>

            {/* Overlay */}
            <div
                id="overlay"
                className={`fixed inset-0 bg-black bg-opacity-50 z-40 ${sidebarOpen ? 'block' : 'hidden'} md:hidden`}
                onClick={() => setSidebarOpen(false)}
            />

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
                                    <h1 className="text-xl font-semibold text-gray-800">Recursos</h1>
                                    <p className="text-sm text-gray-500">PDFs y tips descargables</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <LanguageSelector />

                                <div className="flex items-center space-x-2">
                                    <img
                                        src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg"
                                        alt="User"
                                        className="w-8 h-8 rounded-full"
                                    />
                                    <span className="text-sm font-medium text-gray-700 hidden sm:block">
                                        {user?.displayName || 'Elder Smith'}
                                    </span>
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
                    {/* Search and Filters */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <i className="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                                    <input
                                        type="text"
                                        placeholder="Buscar recursos..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <select
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                                >
                                    <option value="all">Todos los tipos</option>
                                    <option value="pdf">PDFs</option>
                                    <option value="tip">Tips</option>
                                    <option value="video">Videos</option>
                                </select>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                                >
                                    <option value="all">Todas las categorías</option>
                                    <option value="teaching">Enseñanza</option>
                                    <option value="leadership">Liderazgo</option>
                                    <option value="study">Estudio</option>
                                    <option value="wellbeing">Bienestar</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* Featured Resources */}
                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-800">Recursos Destacados</h2>
                            <span className="text-sm text-gray-500">{mockResources.length} recursos</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {filteredResources.map((resource) => (
                                <div key={resource.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                                    <div className="p-4">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className={`w-12 h-12 ${resource.type === 'pdf' ? 'bg-red-100' : 'bg-yellow-100'} rounded-lg flex items-center justify-center`}>
                                                <i className={`${resource.icon} ${resource.iconColor} text-xl`}></i>
                                            </div>
                                            <span className={`text-xs ${resource.tagColor} px-2 py-1 rounded-full`}>
                                                {resource.type === 'pdf' ? 'PDF' : 'Tip'}
                                    </span>
                                </div>
                                        <h3 className="font-semibold text-gray-800 mb-2">{resource.title}</h3>
                                        <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                                                {resource.downloads ? (
                                                    <>
                                                        <i className="fa-solid fa-download"></i>
                                                        <span>{resource.downloads} descargas</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="fa-solid fa-eye"></i>
                                                        <span>{resource.views} vistas</span>
                                                    </>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => resource.type === 'tip' ? handleTipClick(resource) : handleDownload(resource)}
                                                className="text-primary hover:text-primary/80 text-sm font-medium"
                                            >
                                                <i className={`fa-solid ${resource.type === 'tip' ? 'fa-eye' : 'fa-download'} mr-1`}></i>
                                                {resource.type === 'tip' ? 'Ver tip' : 'Descargar'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Categories */}
                    <section className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-800">Por Categorías</h2>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {categories.map((category) => (
                                <div key={category.key} className="bg-white p-4 rounded-lg border border-gray-200 text-center hover:shadow-md transition-shadow cursor-pointer">
                                    <div className={`w-10 h-10 ${category.color} rounded-lg mx-auto mb-2 flex items-center justify-center`}>
                                        <i className={category.icon}></i>
                                    </div>
                                    <h3 className="text-sm font-medium text-gray-800">{category.label}</h3>
                                    <p className="text-xs text-gray-500 mt-1">{category.count} recursos</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Recent Downloads */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="p-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800">Descargas Recientes</h3>
                        </div>
                        <div className="p-4 space-y-3">
                            {mockRecentDownloads.map((download) => (
                                <div key={download.id} className="flex items-center space-x-3">
                                    <div className={`w-8 h-8 ${download.type === 'pdf' ? 'bg-red-100' : 'bg-yellow-100'} rounded-lg flex items-center justify-center`}>
                                        <i className={`${download.icon} ${download.iconColor} text-sm`}></i>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-800">{download.title}</p>
                                        <p className="text-xs text-gray-500">{getTimeAgo(download.downloadedAt)}</p>
                                    </div>
                                    <button className="text-gray-400 hover:text-gray-600">
                                        <i className="fa-solid fa-download"></i>
                                    </button>
                            </div>
                ))}
            </div>
                    </section>
                </main>
            </div>

            {/* Tip Modal */}
            {tipModalOpen && selectedTip && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                                        <i className="fa-solid fa-lightbulb text-yellow-600"></i>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800">{selectedTip.title}</h3>
                                </div>
                                <button
                                    onClick={() => setTipModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <i className="fa-solid fa-times"></i>
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="space-y-4">
                                <p className="text-gray-700 leading-relaxed">
                                    El manejo efectivo del tiempo es fundamental para maximizar tu impacto como misionero. Aquí tienes algunos consejos prácticos:
                                </p>

                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h4 className="font-medium text-blue-900 mb-2">🌅 Rutina Matutina</h4>
                                    <p className="text-sm text-blue-800">Levántate temprano y dedica tiempo al estudio personal antes de comenzar las actividades del día.</p>
                                </div>

                                <div className="bg-green-50 p-4 rounded-lg">
                                    <h4 className="font-medium text-green-900 mb-2">📋 Planificación Semanal</h4>
                                    <p className="text-sm text-green-800">Dedica tiempo cada domingo para planificar la semana, establecer metas y revisar el progreso.</p>
                                </div>

                                <div className="bg-purple-50 p-4 rounded-lg">
                                    <h4 className="font-medium text-purple-900 mb-2">⏰ Bloques de Tiempo</h4>
                                    <p className="text-sm text-purple-800">Organiza tu día en bloques dedicados a actividades específicas: estudio, enseñanza, servicio.</p>
                                </div>

                                <p className="text-sm text-gray-600 italic">
                                    "El tiempo es el regalo más valioso que podemos dar a otros." - Recuerda usar tu tiempo sabiamente.
                                </p>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-200">
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setTipModalOpen(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Cerrar
                                </button>
                                <button className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                                    <i className="fa-solid fa-bookmark mr-2"></i>
                                    Guardar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
