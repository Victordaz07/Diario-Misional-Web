'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useTranslations } from '@/lib/use-translations';
import Link from 'next/link';
import LanguageSelector from '@/components/language-selector';

interface Photo {
    id: string;
    url: string;
    title: string;
    category: string;
    date: Date;
    shared: boolean;
    fromDiary: boolean;
}

const mockPhotos: Photo[] = [
    {
        id: '1',
        url: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/7ebbed7f46-53c3983a1fcff57dd87e.png',
        title: 'Enseñanza familia González',
        category: 'teaching',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        shared: true,
        fromDiary: true,
    },
    {
        id: '2',
        url: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/3bd52e0eaa-a726414d331abf7a3099.png',
        title: 'Servicio comunitario',
        category: 'service',
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        shared: false,
        fromDiary: false,
    },
    {
        id: '3',
        url: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/791ad00cb8-5906889bdbb2dae258a4.png',
        title: 'Estudio con compañero',
        category: 'companions',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        shared: true,
        fromDiary: false,
    },
    {
        id: '4',
        url: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/d13a145be3-5b5c6baf62c918a86aed.png',
        title: 'Capilla local',
        category: 'places',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        shared: false,
        fromDiary: false,
    },
    {
        id: '5',
        url: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/2dcbded6b1-007d370ba867c31f6830.png',
        title: 'Familia Martínez',
        category: 'teaching',
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        shared: true,
        fromDiary: true,
    },
    {
        id: '6',
        url: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/15ae9115a9-109e67272bba62493e52.png',
        title: 'Conferencia de zona',
        category: 'service',
        date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
        shared: false,
        fromDiary: false,
    },
    {
        id: '7',
        url: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/8f9263c10f-3be9abdf707d08b02578.png',
        title: 'Vista de mi área',
        category: 'places',
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        shared: true,
        fromDiary: false,
    },
    {
        id: '8',
        url: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/5c8b1d14e0-7a0d86ac5c3d52d30e00.png',
        title: 'Bautismo de Carlos',
        category: 'teaching',
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        shared: true,
        fromDiary: true,
    },
];

export default function FotosPage() {
    const { user } = useAuth();
    const { t } = useTranslations();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [photoModalOpen, setPhotoModalOpen] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
    const [photos, setPhotos] = useState<Photo[]>(mockPhotos);

    const filters = [
        { key: 'all', label: 'Todas' },
        { key: 'recent', label: 'Recientes' },
        { key: 'service', label: 'Servicio' },
        { key: 'teaching', label: 'Enseñanza' },
        { key: 'companions', label: 'Compañeros' },
        { key: 'places', label: 'Lugares' },
    ];

    const filteredPhotos = photos.filter(photo => {
        if (selectedFilter === 'all') return true;
        if (selectedFilter === 'recent') {
            const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            return photo.date > weekAgo;
        }
        return photo.category === selectedFilter;
    });

    const getTimeAgo = (date: Date): string => {
        const now = new Date();
        const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

        if (diffInDays < 7) {
            return `Hace ${diffInDays} días`;
        } else if (diffInDays < 30) {
            const weeks = Math.floor(diffInDays / 7);
            return `Hace ${weeks} semanas`;
        } else {
            const months = Math.floor(diffInDays / 30);
            return `Hace ${months} meses`;
        }
    };

    const handlePhotoClick = (photo: Photo) => {
        setSelectedPhoto(photo);
        setPhotoModalOpen(true);
    };

    const handleDeletePhoto = (photoId: string) => {
        setPhotos(prev => prev.filter(photo => photo.id !== photoId));
        setPhotoModalOpen(false);
        setSelectedPhoto(null);
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
                            <span className="flex items-center space-x-3 p-3 rounded-lg bg-primary text-white cursor-pointer">
                                <i className="fa-solid fa-camera"></i>
                                <span className="font-medium">Fotos</span>
                            </span>
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
                                    <h1 className="text-xl font-semibold text-gray-800">Galería de Fotos</h1>
                                    <p className="text-sm text-gray-500">Administra tus recuerdos misionales</p>
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
                    {/* Header Section */}
                    <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                                <i className="fa-solid fa-camera text-white text-lg"></i>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">Mis Fotos</h2>
                                <p className="text-gray-600">{photos.length} fotos subidas</p>
                            </div>
                        </div>

                        <button
                            onClick={() => setUploadModalOpen(true)}
                            className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center space-x-2"
                        >
                            <i className="fa-solid fa-plus"></i>
                            <span>Subir Foto</span>
                        </button>
                    </section>

                    {/* Stats */}
                    <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                    <i className="fa-solid fa-images text-primary"></i>
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-gray-800 mb-1">{photos.length}</div>
                            <div className="text-sm text-gray-600">Total de fotos</div>
                        </div>

                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                                    <i className="fa-solid fa-calendar text-secondary"></i>
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-gray-800 mb-1">
                                {photos.filter(photo => {
                                    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                                    return photo.date > weekAgo;
                                }).length}
                            </div>
                            <div className="text-sm text-gray-600">Esta semana</div>
                        </div>

                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <i className="fa-solid fa-cloud text-green-600"></i>
                                </div>
                            </div>
                            <div className="text-lg font-bold text-gray-800 mb-1">Respaldado</div>
                            <div className="text-sm text-gray-600">En la nube</div>
                        </div>

                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <i className="fa-solid fa-hdd text-purple-600"></i>
                                </div>
                            </div>
                            <div className="text-lg font-bold text-gray-800 mb-1">2.1 GB</div>
                            <div className="text-sm text-gray-600">Almacenado</div>
                        </div>
                    </section>

                    {/* Filters */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <div className="flex flex-wrap items-center gap-3">
                            {filters.map((filter) => (
                                <button
                                    key={filter.key}
                                    onClick={() => setSelectedFilter(filter.key)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedFilter === filter.key
                                            ? 'bg-primary text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {filter.label}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Photos Grid */}
                    <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredPhotos.map((photo) => (
                            <div
                                key={photo.id}
                                onClick={() => handlePhotoClick(photo)}
                                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group cursor-pointer"
                            >
                                <div className="relative aspect-square">
                                    <img
                                        className="w-full h-full object-cover"
                                        src={photo.url}
                                        alt={photo.title}
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handlePhotoClick(photo);
                                                }}
                                                className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-primary"
                                            >
                                                <i className="fa-solid fa-eye text-sm"></i>
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeletePhoto(photo.id);
                                                }}
                                                className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-red-500"
                                            >
                                                <i className="fa-solid fa-trash text-sm"></i>
                                            </button>
                                        </div>
                                    </div>
                                    {photo.fromDiary && (
                                        <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                                            <i className="fa-solid fa-book-open mr-1"></i>
                                            Diario
                                        </div>
                                    )}
                                </div>
                                <div className="p-3">
                                    <p className="text-sm font-medium text-gray-800 truncate">{photo.title}</p>
                                    <p className="text-xs text-gray-500">{getTimeAgo(photo.date)}</p>
                                </div>
                            </div>
                        ))}
                    </section>

                    {/* Load More */}
                    <section className="text-center py-8">
                        <button className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-6 py-3 rounded-xl font-medium transition-colors">
                            Cargar más fotos
                        </button>
                    </section>
                </main>
            </div>

            {/* Upload Modal */}
            {uploadModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl w-full max-w-md">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-800">Subir Nueva Foto</h3>
                                <button
                                    onClick={() => setUploadModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <i className="fa-solid fa-times"></i>
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
                                <i className="fa-solid fa-cloud-upload-alt text-4xl text-gray-400 mb-4"></i>
                                <p className="text-gray-600 mb-2">Arrastra tu foto aquí o</p>
                                <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm">
                                    Seleccionar archivo
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Título
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="Describe tu foto"
                                    />
                                </div>

                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Categoría
                                    </label>
                                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary">
                                        <option>Seleccionar categoría</option>
                                        <option>Servicio</option>
                                        <option>Enseñanza</option>
                                        <option>Compañeros</option>
                                        <option>Lugares</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-200 flex space-x-3">
                            <button
                                onClick={() => setUploadModalOpen(false)}
                                className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button className="flex-1 bg-primary text-white py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                                Subir Foto
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Photo Modal */}
            {photoModalOpen && selectedPhoto && (
                <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
                    <div className="relative max-w-4xl w-full">
                        <button
                            onClick={() => setPhotoModalOpen(false)}
                            className="absolute top-4 right-4 text-white text-2xl z-10"
                        >
                            <i className="fa-solid fa-times"></i>
                        </button>

                        <div className="bg-white rounded-xl overflow-hidden">
                            <div className="aspect-video bg-gray-100">
                                <img
                                    className="w-full h-full object-contain"
                                    src={selectedPhoto.url}
                                    alt={selectedPhoto.title}
                                />
            </div>

                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800">{selectedPhoto.title}</h3>
                                        <p className="text-sm text-gray-500">{getTimeAgo(selectedPhoto.date)}</p>
                                    </div>
                                    <button
                                        onClick={() => handleDeletePhoto(selectedPhoto.id)}
                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                                    >
                                        <i className="fa-solid fa-trash mr-2"></i>
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>
            )}
        </div>
    );
}
