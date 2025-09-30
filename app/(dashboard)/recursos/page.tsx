'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';

interface Resource {
    id: string;
    title: string;
    description: string;
    content?: string;
    type: 'pdf' | 'tip' | 'video' | 'scripture';
    category: 'teaching' | 'leadership' | 'study' | 'wellbeing' | 'scriptures';
    downloads?: number;
    views?: number;
    icon: string;
    iconColor: string;
    tagColor: string;
    fileSize?: string;
    language: string;
    createdAt: Date;
    isFavorite?: boolean;
}

interface RecentDownload {
    id: string;
    title: string;
    type: 'pdf' | 'tip' | 'video' | 'scripture';
    downloadedAt: Date;
    icon: string;
    iconColor: string;
}

export default function RecursosPage() {
    const { user } = useAuth();
    const [resources, setResources] = useState<Resource[]>([]);
    const [recentDownloads, setRecentDownloads] = useState<RecentDownload[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [tipModalOpen, setTipModalOpen] = useState(false);
    const [selectedTip, setSelectedTip] = useState<Resource | null>(null);
    const [favorites, setFavorites] = useState<string[]>([]);

    const categories = [
        { key: 'teaching', label: 'Enseñanza', icon: 'fa-solid fa-chalkboard-teacher', color: 'bg-blue-100 text-blue-600', count: 8 },
        { key: 'leadership', label: 'Liderazgo', icon: 'fa-solid fa-users', color: 'bg-purple-100 text-purple-600', count: 5 },
        { key: 'study', label: 'Estudio', icon: 'fa-solid fa-book', color: 'bg-green-100 text-green-600', count: 6 },
        { key: 'wellbeing', label: 'Bienestar', icon: 'fa-solid fa-heart', color: 'bg-orange-100 text-orange-600', count: 4 },
        { key: 'scriptures', label: 'Escrituras', icon: 'fa-solid fa-book-bible', color: 'bg-yellow-100 text-yellow-600', count: 12 },
    ];

    // Cargar recursos
    useEffect(() => {
        loadResources();
        loadRecentDownloads();
    }, []);

    const loadResources = async () => {
        try {
            setLoading(true);
            const snapshot = await db.collection('resources').orderBy('createdAt', 'desc').get();
            const resourcesData = snapshot.docs.map((doc: any) => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date()
            })) as Resource[];

            setResources(resourcesData);
        } catch (error) {
            console.error('Error loading resources:', error);
            // Cargar datos de ejemplo si hay error
            loadSampleResources();
        } finally {
            setLoading(false);
        }
    };

    const loadSampleResources = () => {
        const sampleResources: Resource[] = [
            {
                id: '1',
                title: 'Guía de Enseñanza Efectiva',
                description: 'Técnicas y principios para enseñar con el Espíritu y crear conexiones significativas.',
                content: 'Esta guía te ayudará a desarrollar habilidades de enseñanza efectiva...',
                type: 'pdf',
                category: 'teaching',
                downloads: 245,
                icon: 'fa-solid fa-file-pdf',
                iconColor: 'text-red-600',
                tagColor: 'bg-blue-100 text-blue-700',
                fileSize: '2.3 MB',
                language: 'Español',
                createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
                isFavorite: false
            },
            {
                id: '2',
                title: 'Tip: Manejo del Tiempo',
                description: 'Consejos prácticos para organizar tu día y maximizar el tiempo de enseñanza.',
                content: 'El manejo efectivo del tiempo es fundamental para maximizar tu impacto como misionero...',
                type: 'tip',
                category: 'teaching',
                views: 156,
                icon: 'fa-solid fa-lightbulb',
                iconColor: 'text-yellow-600',
                tagColor: 'bg-green-100 text-green-700',
                language: 'Español',
                createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                isFavorite: true
            },
            {
                id: '3',
                title: 'Manual de Liderazgo',
                description: 'Principios de liderazgo cristiano y desarrollo de habilidades de comunicación.',
                content: 'Este manual cubre los principios fundamentales del liderazgo cristiano...',
                type: 'pdf',
                category: 'leadership',
                downloads: 189,
                icon: 'fa-solid fa-file-pdf',
                iconColor: 'text-purple-600',
                tagColor: 'bg-blue-100 text-blue-700',
                fileSize: '1.8 MB',
                language: 'Español',
                createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                isFavorite: false
            },
            {
                id: '4',
                title: 'Tip: Estudio Personal',
                description: 'Métodos efectivos para el estudio de las escrituras y la preparación diaria.',
                content: 'El estudio personal es la base de una misión exitosa...',
                type: 'tip',
                category: 'study',
                views: 203,
                icon: 'fa-solid fa-lightbulb',
                iconColor: 'text-green-600',
                tagColor: 'bg-green-100 text-green-700',
                language: 'Español',
                createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                isFavorite: true
            },
            {
                id: '5',
                title: 'Versículos Clave para la Enseñanza',
                description: 'Colección de versículos organizados por temas para usar en las enseñanzas.',
                content: 'Esta colección incluye versículos organizados por temas comunes...',
                type: 'scripture',
                category: 'scriptures',
                downloads: 312,
                icon: 'fa-solid fa-book-bible',
                iconColor: 'text-yellow-600',
                tagColor: 'bg-yellow-100 text-yellow-700',
                fileSize: '1.2 MB',
                language: 'Español',
                createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                isFavorite: false
            },
            {
                id: '6',
                title: 'Video: Técnicas de Contacto',
                description: 'Video tutorial sobre cómo abordar a las personas de manera efectiva.',
                content: 'Este video te enseñará técnicas efectivas para hacer contacto inicial...',
                type: 'video',
                category: 'teaching',
                views: 89,
                icon: 'fa-solid fa-play-circle',
                iconColor: 'text-red-600',
                tagColor: 'bg-red-100 text-red-700',
                fileSize: '45 MB',
                language: 'Español',
                createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
                isFavorite: false
            }
        ];
        setResources(sampleResources);
    };

    const loadRecentDownloads = () => {
        const sampleDownloads: RecentDownload[] = [
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
            {
                id: '5',
                title: 'Versículos Clave para la Enseñanza',
                type: 'scripture',
                downloadedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                icon: 'fa-solid fa-book-bible',
                iconColor: 'text-yellow-600',
            }
        ];
        setRecentDownloads(sampleDownloads);
    };

    const getTimeAgo = (date: Date): string => {
        const now = new Date();
        const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) return 'Hoy';
        if (diffInDays === 1) return 'Ayer';
        if (diffInDays < 7) return `Hace ${diffInDays} días`;
        if (diffInDays < 30) {
            const weeks = Math.floor(diffInDays / 7);
            return `Hace ${weeks} semana${weeks > 1 ? 's' : ''}`;
        }
        const months = Math.floor(diffInDays / 30);
        return `Hace ${months} mes${months > 1 ? 'es' : ''}`;
    };

    const filteredResources = resources.filter(resource => {
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

    const handleDownload = async (resource: Resource) => {
        try {
            // Simular descarga
            console.log(`Downloading ${resource.title}`);

            // Actualizar contador de descargas
            if (resource.downloads !== undefined) {
                const updatedResource = { ...resource, downloads: resource.downloads + 1 };
                await db.collection('resources').doc(resource.id).update({ downloads: updatedResource.downloads });
                setResources(resources.map(r => r.id === resource.id ? updatedResource : r));
            }

            // Agregar a descargas recientes
            const newDownload: RecentDownload = {
                id: resource.id,
                title: resource.title,
                type: resource.type,
                downloadedAt: new Date(),
                icon: resource.icon,
                iconColor: resource.iconColor
            };
            setRecentDownloads([newDownload, ...recentDownloads.slice(0, 4)]);
        } catch (error) {
            console.error('Error downloading resource:', error);
        }
    };

    const handleView = (resource: Resource) => {
        if (resource.views !== undefined) {
            const updatedResource = { ...resource, views: resource.views + 1 };
            setResources(resources.map(r => r.id === resource.id ? updatedResource : r));
        }
    };

    const toggleFavorite = async (resourceId: string) => {
        try {
            const resource = resources.find(r => r.id === resourceId);
            if (resource) {
                const updatedResource = { ...resource, isFavorite: !resource.isFavorite };
                await db.collection('resources').doc(resourceId).update({ isFavorite: updatedResource.isFavorite });
                setResources(resources.map(r => r.id === resourceId ? updatedResource : r));
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'pdf': return 'fa-solid fa-file-pdf';
            case 'tip': return 'fa-solid fa-lightbulb';
            case 'video': return 'fa-solid fa-play-circle';
            case 'scripture': return 'fa-solid fa-book-bible';
            default: return 'fa-solid fa-file';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'pdf': return 'text-red-600';
            case 'tip': return 'text-yellow-600';
            case 'video': return 'text-red-600';
            case 'scripture': return 'text-yellow-600';
            default: return 'text-gray-600';
        }
    };

    const getTypeBgColor = (type: string) => {
        switch (type) {
            case 'pdf': return 'bg-red-100';
            case 'tip': return 'bg-yellow-100';
            case 'video': return 'bg-red-100';
            case 'scripture': return 'bg-yellow-100';
            default: return 'bg-gray-100';
        }
    };

    return (
        <div className="p-4">
            {/* Header Section */}
            <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                        <i className="fa-solid fa-folder text-white text-lg"></i>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Recursos Misionales</h2>
                        <p className="text-gray-600">{resources.length} recursos disponibles</p>
                    </div>
                </div>
            </section>

            {/* Search and Filters */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
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
                            <option value="scripture">Escrituras</option>
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
                            <option value="scriptures">Escrituras</option>
                        </select>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Por Categorías</h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {categories.map((category) => (
                        <div
                            key={category.key}
                            className="bg-white p-4 rounded-lg border border-gray-200 text-center hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => setSelectedCategory(category.key)}
                        >
                            <div className={`w-10 h-10 ${category.color} rounded-lg mx-auto mb-2 flex items-center justify-center`}>
                                <i className={category.icon}></i>
                            </div>
                            <h4 className="text-sm font-medium text-gray-800">{category.label}</h4>
                            <p className="text-xs text-gray-500 mt-1">{category.count} recursos</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Resources Grid */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-sm text-gray-500 mt-2">Cargando recursos...</p>
                </div>
            ) : filteredResources.length > 0 ? (
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-800">Recursos Disponibles</h3>
                        <span className="text-sm text-gray-500">{filteredResources.length} recursos encontrados</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredResources.map((resource) => (
                            <div key={resource.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                                <div className="p-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className={`w-12 h-12 ${getTypeBgColor(resource.type)} rounded-lg flex items-center justify-center`}>
                                            <i className={`${getTypeIcon(resource.type)} ${getTypeColor(resource.type)} text-xl`}></i>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => toggleFavorite(resource.id)}
                                                className={`p-1 rounded-full transition-colors ${resource.isFavorite
                                                        ? 'text-yellow-500 hover:text-yellow-600'
                                                        : 'text-gray-400 hover:text-yellow-500'
                                                    }`}
                                            >
                                                <i className={`fa-solid ${resource.isFavorite ? 'fa-star' : 'fa-star-o'}`}></i>
                                            </button>
                                            <span className={`text-xs px-2 py-1 rounded-full ${resource.tagColor}`}>
                                                {resource.type === 'pdf' ? 'PDF' :
                                                    resource.type === 'tip' ? 'Tip' :
                                                        resource.type === 'video' ? 'Video' : 'Escritura'}
                                            </span>
                                        </div>
                                    </div>

                                    <h4 className="font-semibold text-gray-800 mb-2 line-clamp-2">{resource.title}</h4>
                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{resource.description}</p>

                                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                                        <div className="flex items-center space-x-3">
                                            {resource.downloads !== undefined ? (
                                                <span className="flex items-center space-x-1">
                                                    <i className="fa-solid fa-download"></i>
                                                    <span>{resource.downloads}</span>
                                                </span>
                                            ) : (
                                                <span className="flex items-center space-x-1">
                                                    <i className="fa-solid fa-eye"></i>
                                                    <span>{resource.views}</span>
                                                </span>
                                            )}
                                            {resource.fileSize && (
                                                <span>{resource.fileSize}</span>
                                            )}
                                        </div>
                                        <span className="text-xs text-gray-400">{getTimeAgo(resource.createdAt)}</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-500">{resource.language}</span>
                                        <button
                                            onClick={() => resource.type === 'tip' ? handleTipClick(resource) : handleDownload(resource)}
                                            className="text-primary hover:text-primary/80 text-sm font-medium cursor-pointer"
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
            ) : (
                <div className="text-center py-12">
                    <i className="fa-solid fa-folder-open text-4xl text-gray-400 mb-4"></i>
                    <h3 className="text-lg font-medium text-gray-600 mb-2">No se encontraron recursos</h3>
                    <p className="text-gray-500">Intenta ajustar los filtros de búsqueda</p>
                </div>
            )}

            {/* Recent Downloads */}
            {recentDownloads.length > 0 && (
                <section className="mt-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="p-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800">Descargas Recientes</h3>
                        </div>
                        <div className="p-4 space-y-3">
                            {recentDownloads.map((download) => (
                                <div key={download.id} className="flex items-center space-x-3">
                                    <div className={`w-8 h-8 ${getTypeBgColor(download.type)} rounded-lg flex items-center justify-center`}>
                                        <i className={`${download.icon} ${getTypeColor(download.type)} text-sm`}></i>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-800">{download.title}</p>
                                        <p className="text-xs text-gray-500">{getTimeAgo(download.downloadedAt)}</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            const resource = resources.find(r => r.id === download.id);
                                            if (resource) handleDownload(resource);
                                        }}
                                        className="text-gray-400 hover:text-gray-600 cursor-pointer"
                                    >
                                        <i className="fa-solid fa-download"></i>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

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
                                    className="text-gray-400 hover:text-gray-600 cursor-pointer"
                                >
                                    <i className="fa-solid fa-times"></i>
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="space-y-4">
                                <p className="text-gray-700 leading-relaxed">
                                    {selectedTip.content || selectedTip.description}
                                </p>

                                {selectedTip.title.includes('Manejo del Tiempo') && (
                                    <>
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
                                    </>
                                )}

                                {selectedTip.title.includes('Estudio Personal') && (
                                    <>
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <h4 className="font-medium text-blue-900 mb-2">📖 Lectura Diaria</h4>
                                            <p className="text-sm text-blue-800">Dedica al menos 30 minutos diarios al estudio de las escrituras.</p>
                                        </div>

                                        <div className="bg-green-50 p-4 rounded-lg">
                                            <h4 className="font-medium text-green-900 mb-2">✍️ Tomar Notas</h4>
                                            <p className="text-sm text-green-800">Escribe tus impresiones y pensamientos mientras estudias.</p>
                                        </div>

                                        <div className="bg-purple-50 p-4 rounded-lg">
                                            <h4 className="font-medium text-purple-900 mb-2">🙏 Oración</h4>
                                            <p className="text-sm text-purple-800">Comienza y termina tu estudio con oración para recibir guía.</p>
                                        </div>
                                    </>
                                )}

                                <p className="text-sm text-gray-600 italic">
                                    "El estudio personal es la base de una misión exitosa." - Recuerda dedicar tiempo diario al estudio.
                                </p>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-200">
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setTipModalOpen(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                    Cerrar
                                </button>
                                <button
                                    onClick={() => {
                                        handleView(selectedTip);
                                        setTipModalOpen(false);
                                    }}
                                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
                                >
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