'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { convertFirebaseDate } from '@/lib/utils';

interface Photo {
    id: string;
    url: string;
    title: string;
    description?: string;
    category: string;
    date: Date;
    shared: boolean;
    fromDiary: boolean;
    privacySettings: {
        blurFaces: boolean;
        sensitiveContent: boolean;
        shareWithParents: boolean;
    };
    tags: string[];
}

export default function FotosPage() {
    const { user } = useAuth();
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [photoModalOpen, setPhotoModalOpen] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
    const [uploadingPhotos, setUploadingPhotos] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'teaching',
        tags: [] as string[],
        privacySettings: {
            blurFaces: false,
            sensitiveContent: false,
            shareWithParents: false
        }
    });

    const filters = [
        { key: 'all', label: 'Todas', icon: 'fa-images' },
        { key: 'recent', label: 'Recientes', icon: 'fa-clock' },
        { key: 'service', label: 'Servicio', icon: 'fa-hands-helping' },
        { key: 'teaching', label: 'Enseñanza', icon: 'fa-chalkboard-teacher' },
        { key: 'companions', label: 'Compañeros', icon: 'fa-users' },
        { key: 'places', label: 'Lugares', icon: 'fa-map-marker-alt' },
        { key: 'shared', label: 'Compartidas', icon: 'fa-share' },
    ];

    // Cargar fotos
    useEffect(() => {
        loadPhotos();
    }, []);

    const loadPhotos = async () => {
        try {
            setLoading(true);
            const snapshot = await db.collection('photos').orderBy('date', 'desc').get();
            const photosData = snapshot.docs.map((doc: any) => ({
                id: doc.id,
                ...doc.data(),
                date: convertFirebaseDate(doc.data().date)
            })) as Photo[];

            setPhotos(photosData);
        } catch (error) {
            console.error('Error loading photos:', error);
            // Cargar datos de ejemplo si hay error
            loadSamplePhotos();
        } finally {
            setLoading(false);
        }
    };

    const loadSamplePhotos = () => {
        const samplePhotos: Photo[] = [
            {
                id: '1',
                url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
                title: 'Enseñanza familia González',
                description: 'Momento especial enseñando a la familia González sobre la familia eterna',
                category: 'teaching',
                date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                shared: true,
                fromDiary: true,
                privacySettings: {
                    blurFaces: true,
                    sensitiveContent: false,
                    shareWithParents: true
                },
                tags: ['familia', 'enseñanza', 'espíritu']
            },
            {
                id: '2',
                url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
                title: 'Servicio comunitario',
                description: 'Ayudando en el hogar de ancianos',
                category: 'service',
                date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
                shared: false,
                fromDiary: false,
                privacySettings: {
                    blurFaces: true,
                    sensitiveContent: true,
                    shareWithParents: false
                },
                tags: ['servicio', 'ancianos', 'comunidad']
            },
            {
                id: '3',
                url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=300&fit=crop',
                title: 'Estudio con compañero',
                description: 'Estudiando las escrituras con Elder Johnson',
                category: 'companions',
                date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                shared: true,
                fromDiary: false,
                privacySettings: {
                    blurFaces: false,
                    sensitiveContent: false,
                    shareWithParents: true
                },
                tags: ['estudio', 'compañero', 'escrituras']
            },
            {
                id: '4',
                url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop',
                title: 'Capilla local',
                description: 'La hermosa capilla de nuestro barrio',
                category: 'places',
                date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                shared: false,
                fromDiary: false,
                privacySettings: {
                    blurFaces: false,
                    sensitiveContent: false,
                    shareWithParents: true
                },
                tags: ['capilla', 'barrio', 'lugar']
            },
            {
                id: '5',
                url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=300&fit=crop',
                title: 'Familia Martínez',
                description: 'Bautismo de la familia Martínez',
                category: 'teaching',
                date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
                shared: true,
                fromDiary: true,
                privacySettings: {
                    blurFaces: true,
                    sensitiveContent: false,
                    shareWithParents: true
                },
                tags: ['bautismo', 'familia', 'conversión']
            },
            {
                id: '6',
                url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop',
                title: 'Conferencia de zona',
                description: 'Con todos los misioneros de la zona',
                category: 'service',
                date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
                shared: false,
                fromDiary: false,
                privacySettings: {
                    blurFaces: false,
                    sensitiveContent: false,
                    shareWithParents: true
                },
                tags: ['conferencia', 'zona', 'misioneros']
            }
        ];
        setPhotos(samplePhotos);
    };

    const filteredPhotos = photos.filter(photo => {
        if (selectedFilter === 'all') return true;
        if (selectedFilter === 'recent') {
            const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            return photo.date > weekAgo;
        }
        if (selectedFilter === 'shared') {
            return photo.shared;
        }
        return photo.category === selectedFilter;
    });

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

    const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        setUploadingPhotos(true);
        try {
            const uploadPromises = Array.from(files).map(async (file) => {
                const reader = new FileReader();
                return new Promise<string>((resolve) => {
                    reader.onload = (e) => {
                        resolve(e.target?.result as string);
                    };
                    reader.readAsDataURL(file);
                });
            });

            const uploadedPhotos = await Promise.all(uploadPromises);

            // Crear entradas de fotos
            const newPhotos = uploadedPhotos.map((url, index) => ({
                id: `photo-${Date.now()}-${index}`,
                url,
                title: formData.title || `Foto ${index + 1}`,
                description: formData.description,
                category: formData.category,
                date: new Date(),
                shared: formData.privacySettings.shareWithParents,
                fromDiary: false,
                privacySettings: formData.privacySettings,
                tags: formData.tags
            }));

            // Guardar en Firebase
            for (const photo of newPhotos) {
                await db.collection('photos').add(photo);
            }

            setPhotos([...newPhotos, ...photos]);
            setUploadModalOpen(false);
            resetForm();
        } catch (error) {
            console.error('Error uploading photos:', error);
        } finally {
            setUploadingPhotos(false);
        }
    };

    const handlePhotoClick = (photo: Photo) => {
        setSelectedPhoto(photo);
        setPhotoModalOpen(true);
    };

    const handleDeletePhoto = async (photoId: string) => {
        if (confirm('¿Estás seguro de que quieres eliminar esta foto?')) {
            try {
                await db.collection('photos').doc(photoId).delete();
                setPhotos(photos.filter(photo => photo.id !== photoId));
                setPhotoModalOpen(false);
                setSelectedPhoto(null);
            } catch (error) {
                console.error('Error deleting photo:', error);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            category: 'teaching',
            tags: [],
            privacySettings: {
                blurFaces: false,
                sensitiveContent: false,
                shareWithParents: false
            }
        });
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'teaching': return 'fa-chalkboard-teacher';
            case 'service': return 'fa-hands-helping';
            case 'companions': return 'fa-users';
            case 'places': return 'fa-map-marker-alt';
            default: return 'fa-image';
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'teaching': return 'bg-blue-100 text-blue-700';
            case 'service': return 'bg-green-100 text-green-700';
            case 'companions': return 'bg-purple-100 text-purple-700';
            case 'places': return 'bg-orange-100 text-orange-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="p-4">
            {/* Header Section */}
            <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
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
                    className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center space-x-2 cursor-pointer"
                >
                    <i className="fa-solid fa-plus"></i>
                    <span>Subir Fotos</span>
                </button>
            </section>

            {/* Stats */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
                            <i className="fa-solid fa-share text-green-600"></i>
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-800 mb-1">
                        {photos.filter(photo => photo.shared).length}
                    </div>
                    <div className="text-sm text-gray-600">Compartidas</div>
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
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                <div className="flex flex-wrap items-center gap-3">
                    {filters.map((filter) => (
                        <button
                            key={filter.key}
                            onClick={() => setSelectedFilter(filter.key)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${selectedFilter === filter.key
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            <i className={`fa-solid ${filter.icon}`}></i>
                            <span>{filter.label}</span>
                        </button>
                    ))}
                </div>
            </section>

            {/* Photos Grid */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-sm text-gray-500 mt-2">Cargando fotos...</p>
                </div>
            ) : filteredPhotos.length > 0 ? (
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

                                {/* Badges */}
                                <div className="absolute top-2 left-2 flex flex-col space-y-1">
                                    {photo.fromDiary && (
                                        <div className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                                            <i className="fa-solid fa-book-open mr-1"></i>
                                            Diario
                                        </div>
                                    )}
                                    {photo.privacySettings.blurFaces && (
                                        <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                            <i className="fa-solid fa-eye-slash mr-1"></i>
                                            Blur
                                        </div>
                                    )}
                                </div>

                                <div className="absolute top-2 right-2">
                                    {photo.shared && (
                                        <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                                            <i className="fa-solid fa-share mr-1"></i>
                                            Compartida
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="p-3">
                                <p className="text-sm font-medium text-gray-800 truncate">{photo.title}</p>
                                <p className="text-xs text-gray-500 mb-2">{getTimeAgo(photo.date)}</p>
                                <div className="flex items-center justify-between">
                                    <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(photo.category)}`}>
                                        <i className={`fa-solid ${getCategoryIcon(photo.category)} mr-1`}></i>
                                        {photo.category}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </section>
            ) : (
                <div className="text-center py-12">
                    <i className="fa-solid fa-camera text-4xl text-gray-400 mb-4"></i>
                    <h3 className="text-lg font-medium text-gray-600 mb-2">No hay fotos</h3>
                    <p className="text-gray-500 mb-4">Comienza a subir tus recuerdos misioneros</p>
                    <button
                        onClick={() => setUploadModalOpen(true)}
                        className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
                    >
                        Subir primera foto
                    </button>
                </div>
            )}

            {/* Upload Modal */}
            {uploadModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-semibold text-gray-800">Subir Fotos</h3>
                                <button
                                    onClick={() => {
                                        setUploadModalOpen(false);
                                        resetForm();
                                    }}
                                    className="text-gray-400 hover:text-gray-600 cursor-pointer"
                                >
                                    <i className="fa-solid fa-times text-lg"></i>
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Subida de fotos */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Fotos</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handlePhotoUpload}
                                        className="hidden"
                                        id="photo-upload"
                                    />
                                    <label
                                        htmlFor="photo-upload"
                                        className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                                    >
                                        <i className="fa-solid fa-cloud-upload-alt text-4xl text-gray-400"></i>
                                        <p className="text-gray-600 mb-2">
                                            {uploadingPhotos ? 'Subiendo fotos...' : 'Arrastra tus fotos aquí o haz clic para seleccionar'}
                                        </p>
                                        <span className="bg-primary text-white px-4 py-2 rounded-lg text-sm">
                                            Seleccionar archivos
                                        </span>
                                    </label>
                                </div>
                            </div>

                            {/* Información de la foto */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="Describe tu foto"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value="teaching">Enseñanza</option>
                                        <option value="service">Servicio</option>
                                        <option value="companions">Compañeros</option>
                                        <option value="places">Lugares</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="Cuenta la historia detrás de esta foto..."
                                />
                            </div>

                            {/* Configuraciones de privacidad */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-medium text-gray-700">Configuraciones de Privacidad</h4>

                                <div className="space-y-3">
                                    <label className="flex items-center space-x-3">
                                        <input
                                            type="checkbox"
                                            checked={formData.privacySettings.blurFaces}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                privacySettings: {
                                                    ...formData.privacySettings,
                                                    blurFaces: e.target.checked
                                                }
                                            })}
                                            className="rounded border-gray-300 text-primary focus:ring-primary"
                                        />
                                        <div className="flex items-center space-x-2">
                                            <i className="fa-solid fa-eye-slash text-blue-600"></i>
                                            <span className="text-sm text-gray-700">Difuminar rostros de terceros</span>
                                        </div>
                                    </label>

                                    <label className="flex items-center space-x-3">
                                        <input
                                            type="checkbox"
                                            checked={formData.privacySettings.sensitiveContent}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                privacySettings: {
                                                    ...formData.privacySettings,
                                                    sensitiveContent: e.target.checked
                                                }
                                            })}
                                            className="rounded border-gray-300 text-primary focus:ring-primary"
                                        />
                                        <div className="flex items-center space-x-2">
                                            <i className="fa-solid fa-shield-alt text-red-600"></i>
                                            <span className="text-sm text-gray-700">Marcar como contenido sensible</span>
                                        </div>
                                    </label>

                                    <label className="flex items-center space-x-3">
                                        <input
                                            type="checkbox"
                                            checked={formData.privacySettings.shareWithParents}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                privacySettings: {
                                                    ...formData.privacySettings,
                                                    shareWithParents: e.target.checked
                                                }
                                            })}
                                            className="rounded border-gray-300 text-primary focus:ring-primary"
                                        />
                                        <div className="flex items-center space-x-2">
                                            <i className="fa-solid fa-share text-green-600"></i>
                                            <span className="text-sm text-gray-700">Compartir con padres</span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-200 flex space-x-3">
                            <button
                                onClick={() => {
                                    setUploadModalOpen(false);
                                    resetForm();
                                }}
                                className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors cursor-pointer"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => {
                                    const input = document.getElementById('photo-upload') as HTMLInputElement;
                                    input?.click();
                                }}
                                disabled={uploadingPhotos}
                                className="flex-1 bg-primary text-white py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 cursor-pointer"
                            >
                                {uploadingPhotos ? 'Subiendo...' : 'Seleccionar Archivos'}
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
                            className="absolute top-4 right-4 text-white text-2xl z-10 cursor-pointer"
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
                                        <p className="text-sm text-gray-500 mb-2">{getTimeAgo(selectedPhoto.date)}</p>
                                        {selectedPhoto.description && (
                                            <p className="text-sm text-gray-600">{selectedPhoto.description}</p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => handleDeletePhoto(selectedPhoto.id)}
                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer"
                                    >
                                        <i className="fa-solid fa-trash mr-2"></i>
                                        Eliminar
                                    </button>
                                </div>

                                {/* Tags y configuraciones */}
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(selectedPhoto.category)}`}>
                                        <i className={`fa-solid ${getCategoryIcon(selectedPhoto.category)} mr-1`}></i>
                                        {selectedPhoto.category}
                                    </span>

                                    {selectedPhoto.privacySettings.blurFaces && (
                                        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                                            <i className="fa-solid fa-eye-slash mr-1"></i>
                                            Rostros difuminados
                                        </span>
                                    )}

                                    {selectedPhoto.privacySettings.sensitiveContent && (
                                        <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700">
                                            <i className="fa-solid fa-shield-alt mr-1"></i>
                                            Contenido sensible
                                        </span>
                                    )}

                                    {selectedPhoto.privacySettings.shareWithParents && (
                                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                                            <i className="fa-solid fa-share mr-1"></i>
                                            Compartida con padres
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}