'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { convertFirebaseDate, exportDiaryToPDF, exportToJSON } from '@/lib/utils';

interface DiaryEntry {
    id: string;
    title: string;
    content: string;
    date: string;
    time: string;
    location?: string;
    companion?: string;
    category: string;
    photos?: string[];
    privacySettings?: {
        blurFaces: boolean;
        sensitiveContent: boolean;
        shareWithParents: boolean;
    };
    createdAt: Date;
}

export default function DiaryPage() {
    const { user } = useAuth();
    const [entries, setEntries] = useState<DiaryEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingEntry, setEditingEntry] = useState<DiaryEntry | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().slice(0, 5),
        location: '',
        companion: 'Elder Johnson',
        category: 'Enseñanza',
        photos: [] as string[],
        privacySettings: {
            blurFaces: false,
            sensitiveContent: false,
            shareWithParents: false
        }
    });
    const [uploadingPhotos, setUploadingPhotos] = useState(false);
    const [exportingPDF, setExportingPDF] = useState(false);
    const [showExportMenu, setShowExportMenu] = useState(false);

    // Función para exportar PDF
    const handleExportPDF = async () => {
        try {
            setExportingPDF(true);
            await exportDiaryToPDF(entries, {
                filename: `diario-misional-${new Date().toISOString().split('T')[0]}.pdf`,
                title: 'Mi Diario Misional',
                subtitle: `${entries.length} entradas registradas`
            });
        } catch (error) {
            console.error('Error al exportar PDF:', error);
            alert('Error al exportar PDF. Inténtalo de nuevo.');
        } finally {
            setExportingPDF(false);
        }
    };

    // Función para exportar JSON
    const handleExportJSON = () => {
        try {
            const exportData = {
                exportedAt: new Date().toISOString(),
                totalEntries: entries.length,
                entries: entries.map(entry => ({
                    ...entry,
                    createdAt: entry.createdAt.toISOString()
                }))
            };
            exportToJSON(exportData, `diario-misional-${new Date().toISOString().split('T')[0]}.json`);
        } catch (error) {
            console.error('Error al exportar JSON:', error);
            alert('Error al exportar datos. Inténtalo de nuevo.');
        }
    };

    // Cargar entradas del diario
    useEffect(() => {
        loadDiaryEntries();
    }, []);

    // Cerrar menú de exportación al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (showExportMenu && !(event.target as Element).closest('.relative')) {
                setShowExportMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showExportMenu]);

    const loadDiaryEntries = async () => {
        try {
            setLoading(true);
            const snapshot = await db.collection('diary').orderBy('createdAt', 'desc').get();
            const entriesData = snapshot.docs.map((doc: any) => ({
                id: doc.id,
                ...doc.data(),
                createdAt: convertFirebaseDate(doc.data().createdAt)
            })) as DiaryEntry[];

            setEntries(entriesData);
        } catch (error) {
            console.error('Error loading diary entries:', error);
            // Cargar datos de ejemplo si hay error
            loadSampleData();
        } finally {
            setLoading(false);
        }
    };

    const loadSampleData = () => {
        const sampleEntries: DiaryEntry[] = [
            {
                id: '1',
                title: 'Experiencia enseñando a la familia González',
                content: 'Hoy tuvimos una experiencia increíble enseñando a la familia González. El Espíritu estuvo presente de manera especial cuando compartimos el mensaje sobre la importancia de la familia eterna. La hermana González se emocionó mucho y expresó su deseo de conocer más sobre el evangelio...',
                date: '2024-11-15',
                time: '19:30',
                location: 'Área Centro',
                companion: 'Elder Johnson',
                category: 'Enseñanza',
                photos: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=300&fit=crop'],
                privacySettings: {
                    blurFaces: true,
                    sensitiveContent: false,
                    shareWithParents: true
                },
                createdAt: new Date('2024-11-15T19:30:00')
            },
            {
                id: '2',
                title: 'Actividad de servicio en el hogar de ancianos',
                content: 'Participamos en una actividad de servicio en el hogar de ancianos "Luz del Atardecer". Fue conmovedor ver la alegría en los rostros de los residentes cuando cantamos himnos y compartimos tiempo con ellos. Una señora de 85 años nos contó historias de su juventud y nos agradeció por alegrar su día...',
                date: '2024-11-14',
                time: '14:15',
                location: 'Hogar Luz del Atardecer',
                companion: 'Elder Johnson',
                category: 'Servicio',
                photos: ['https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop'],
                privacySettings: {
                    blurFaces: true,
                    sensitiveContent: true,
                    shareWithParents: false
                },
                createdAt: new Date('2024-11-14T14:15:00')
            },
            {
                id: '3',
                title: 'Estudio personal y preparación',
                content: 'Durante mi estudio personal de hoy, me enfoqué en Alma 32 y la analogía de la semilla. Me impresionó cómo Alma describe el proceso de desarrollar fe. Esto me ayudará mucho en mis futuras enseñanzas, especialmente con investigadores que están comenzando a desarrollar su testimonio...',
                date: '2024-11-13',
                time: '06:00',
                location: 'Alma 32',
                companion: '',
                category: 'Estudio Personal',
                photos: [],
                privacySettings: {
                    blurFaces: false,
                    sensitiveContent: false,
                    shareWithParents: true
                },
                createdAt: new Date('2024-11-13T06:00:00')
            },
            {
                id: '4',
                title: 'Reunión de distrito y intercambios',
                content: 'Tuvimos una excelente reunión de distrito donde el líder de distrito nos enseñó sobre la importancia de la unidad en el trabajo misional. Después hice intercambios con Elder Martinez y aprendí nuevas técnicas para abordar a las personas en la calle. Su enfoque natural y amigable me inspiró mucho...',
                date: '2024-11-12',
                time: '10:00',
                location: 'Reunión de Distrito',
                companion: 'Elder Martinez',
                category: 'Capacitación',
                photos: ['https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop'],
                privacySettings: {
                    blurFaces: false,
                    sensitiveContent: false,
                    shareWithParents: true
                },
                createdAt: new Date('2024-11-12T10:00:00')
            }
        ];
        setEntries(sampleEntries);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);

            const entryData = {
                ...formData,
                createdAt: new Date()
            };

            if (editingEntry) {
                // Actualizar entrada existente
                await db.collection('diary').doc(editingEntry.id).update(entryData);
                setEntries(entries.map(entry =>
                    entry.id === editingEntry.id
                        ? { ...entry, ...entryData }
                        : entry
                ));
            } else {
                // Crear nueva entrada
                const docRef = await db.collection('diary').add(entryData);
                const newEntry = { id: docRef.id, ...entryData };
                setEntries([newEntry, ...entries]);
            }

            setShowModal(false);
            setEditingEntry(null);
            resetForm();
        } catch (error) {
            console.error('Error saving diary entry:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (entry: DiaryEntry) => {
        setEditingEntry(entry);
        setFormData({
            title: entry.title,
            content: entry.content,
            date: entry.date,
            time: entry.time,
            location: entry.location,
            companion: entry.companion,
            category: entry.category,
            photos: entry.photos || [],
            privacySettings: entry.privacySettings || {
                blurFaces: false,
                sensitiveContent: false,
                shareWithParents: false
            }
        });
        setShowModal(true);
    };

    const handleDelete = async (entryId: string) => {
        if (confirm('¿Estás seguro de que quieres eliminar esta entrada?')) {
            try {
                await db.collection('diary').doc(entryId).delete();
                setEntries(entries.filter(entry => entry.id !== entryId));
            } catch (error) {
                console.error('Error deleting diary entry:', error);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            content: '',
            date: new Date().toISOString().split('T')[0],
            time: new Date().toTimeString().slice(0, 5),
            location: '',
            companion: 'Elder Johnson',
            category: 'Enseñanza',
            photos: [],
            privacySettings: {
                blurFaces: false,
                sensitiveContent: false,
                shareWithParents: false
            }
        });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'Enseñanza': return 'bg-primary';
            case 'Servicio': return 'bg-secondary';
            case 'Estudio Personal': return 'bg-green-500';
            case 'Capacitación': return 'bg-purple-500';
            default: return 'bg-gray-500';
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'Enseñanza': return 'fa-chalkboard-teacher';
            case 'Servicio': return 'fa-hands-helping';
            case 'Estudio Personal': return 'fa-book';
            case 'Capacitación': return 'fa-users';
            default: return 'fa-tag';
        }
    };

    const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        setUploadingPhotos(true);
        try {
            const uploadPromises = Array.from(files).map(async (file) => {
                // Simular subida de foto (en producción usarías Firebase Storage)
                const reader = new FileReader();
                return new Promise<string>((resolve) => {
                    reader.onload = (e) => {
                        resolve(e.target?.result as string);
                    };
                    reader.readAsDataURL(file);
                });
            });

            const uploadedPhotos = await Promise.all(uploadPromises);
            setFormData(prev => ({
                ...prev,
                photos: [...prev.photos, ...uploadedPhotos]
            }));
        } catch (error) {
            console.error('Error uploading photos:', error);
        } finally {
            setUploadingPhotos(false);
        }
    };

    const removePhoto = (index: number) => {
        setFormData(prev => ({
            ...prev,
            photos: prev.photos.filter((_, i) => i !== index)
        }));
    };

    const handlePrivacyChange = (setting: keyof typeof formData.privacySettings, value: boolean) => {
        setFormData(prev => ({
            ...prev,
            privacySettings: {
                ...prev.privacySettings,
                [setting]: value
            }
        }));
    };

    return (
        <div className="p-4">
            {/* Header */}
            <section className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Mis Entradas</h2>
                        <p className="text-gray-600">{entries.length} entradas registradas</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="relative">
                            <button 
                                onClick={() => setShowExportMenu(!showExportMenu)}
                                disabled={entries.length === 0}
                                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <i className="fa-solid fa-download text-gray-600"></i>
                                <span className="text-sm font-medium text-gray-700">Exportar</span>
                                <i className="fa-solid fa-chevron-down text-gray-400 text-xs"></i>
                            </button>
                            
                            {showExportMenu && (
                                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                                    <div className="py-1">
                                        <button
                                            onClick={() => {
                                                handleExportPDF();
                                                setShowExportMenu(false);
                                            }}
                                            disabled={exportingPDF}
                                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2 disabled:opacity-50"
                                        >
                                            <i className={`fa-solid fa-file-pdf text-red-600 ${exportingPDF ? 'fa-spin' : ''}`}></i>
                                            <span>{exportingPDF ? 'Exportando PDF...' : 'Exportar PDF'}</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleExportJSON();
                                                setShowExportMenu(false);
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                                        >
                                            <i className="fa-solid fa-file-code text-blue-600"></i>
                                            <span>Exportar JSON</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => setShowModal(true)}
                            className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
                        >
                            <i className="fa-solid fa-plus"></i>
                            <span className="font-medium">Nueva Entrada</span>
                        </button>
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className="space-y-6">
                {loading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                        <p className="text-sm text-gray-500 mt-2">Cargando entradas...</p>
                    </div>
                ) : entries.length > 0 ? (
                    <div className="relative">
                        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                        {entries.map((entry, index) => (
                            <div key={entry.id} className="relative flex items-start space-x-6 pb-8">
                                <div className={`w-16 h-16 ${getCategoryColor(entry.category)} rounded-full flex items-center justify-center flex-shrink-0 border-4 border-white shadow-sm`}>
                                    <span className="text-white font-bold text-sm">{entries.length - index}</span>
                                </div>
                                <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800">{entry.title}</h3>
                                            <p className="text-sm text-gray-500">
                                                {formatDate(entry.date)} • {entry.time}
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => handleEdit(entry)}
                                                className="p-2 text-gray-400 hover:text-primary transition-colors cursor-pointer"
                                            >
                                                <i className="fa-solid fa-edit"></i>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(entry.id)}
                                                className="p-2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                                            >
                                                <i className="fa-solid fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed mb-4">{entry.content}</p>

                                    {/* Fotos */}
                                    {entry.photos && entry.photos.length > 0 && (
                                        <div className="mb-4">
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                                {entry.photos.map((photo, photoIndex) => (
                                                    <div key={photoIndex} className="relative group">
                                                        <img
                                                            src={photo}
                                                            alt={`Foto ${photoIndex + 1}`}
                                                            className="w-full h-24 object-cover rounded-lg"
                                                        />
                                                        {entry.privacySettings?.blurFaces && (
                                                            <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg flex items-center justify-center">
                                                                <i className="fa-solid fa-eye-slash text-white text-lg"></i>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Configuraciones de privacidad */}
                                    <div className="flex items-center space-x-4 text-xs text-gray-500 mb-4">
                                        {entry.privacySettings?.blurFaces && (
                                            <span className="flex items-center space-x-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                                <i className="fa-solid fa-eye-slash"></i>
                                                <span>Rostros difuminados</span>
                                            </span>
                                        )}
                                        {entry.privacySettings?.sensitiveContent && (
                                            <span className="flex items-center space-x-1 bg-red-100 text-red-700 px-2 py-1 rounded-full">
                                                <i className="fa-solid fa-shield-alt"></i>
                                                <span>Contenido sensible</span>
                                            </span>
                                        )}
                                        {entry.privacySettings?.shareWithParents && (
                                            <span className="flex items-center space-x-1 bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                                <i className="fa-solid fa-share"></i>
                                                <span>Compartir con padres</span>
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                                        {entry.location && (
                                            <span className="flex items-center space-x-1">
                                                <i className="fa-solid fa-map-marker-alt"></i>
                                                <span>{entry.location}</span>
                                            </span>
                                        )}
                                        {entry.companion && (
                                            <span className="flex items-center space-x-1">
                                                <i className="fa-solid fa-user"></i>
                                                <span>{entry.companion}</span>
                                            </span>
                                        )}
                                        <span className="flex items-center space-x-1">
                                            <i className={`fa-solid ${getCategoryIcon(entry.category)}`}></i>
                                            <span>{entry.category}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <i className="fa-solid fa-book-open text-4xl text-gray-400 mb-4"></i>
                        <h3 className="text-lg font-medium text-gray-600 mb-2">No hay entradas aún</h3>
                        <p className="text-gray-500 mb-4">Comienza a registrar tus experiencias misioneras</p>
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
                        >
                            Crear primera entrada
                        </button>
                    </div>
                )}
            </section>

            {/* Modal para nueva/editar entrada */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-semibold text-gray-800">
                                    {editingEntry ? 'Editar Entrada' : 'Nueva Entrada del Diario'}
                                </h3>
                                <button
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditingEntry(null);
                                        resetForm();
                                    }}
                                    className="p-2 text-gray-400 hover:text-gray-600 cursor-pointer"
                                >
                                    <i className="fa-solid fa-times text-lg"></i>
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Título de la entrada</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="Describe tu experiencia..."
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
                                    <input
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Hora</label>
                                    <input
                                        type="time"
                                        value={formData.time}
                                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Ubicación</label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="¿Dónde ocurrió?"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Compañero</label>
                                <select
                                    value={formData.companion}
                                    onChange={(e) => setFormData({ ...formData, companion: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="">Sin compañero</option>
                                    <option value="Elder Johnson">Elder Johnson</option>
                                    <option value="Elder Martinez">Elder Martinez</option>
                                    <option value="Elder Brown">Elder Brown</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="Enseñanza">Enseñanza</option>
                                    <option value="Servicio">Servicio</option>
                                    <option value="Estudio Personal">Estudio Personal</option>
                                    <option value="Capacitación">Capacitación</option>
                                    <option value="Experiencia Personal">Experiencia Personal</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                                <textarea
                                    rows={6}
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="Cuenta tu experiencia en detalle..."
                                    required
                                />
                            </div>

                            {/* Subida de fotos */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Fotos</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
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
                                        <i className="fa-solid fa-camera text-2xl text-gray-400"></i>
                                        <span className="text-sm text-gray-600">
                                            {uploadingPhotos ? 'Subiendo fotos...' : 'Haz clic para subir fotos'}
                                        </span>
                                    </label>
                                </div>

                                {/* Vista previa de fotos */}
                                {formData.photos.length > 0 && (
                                    <div className="mt-4">
                                        <div className="grid grid-cols-3 gap-2">
                                            {formData.photos.map((photo, index) => (
                                                <div key={index} className="relative group">
                                                    <img
                                                        src={photo}
                                                        alt={`Preview ${index + 1}`}
                                                        className="w-full h-20 object-cover rounded-lg"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removePhoto(index)}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                                                    >
                                                        <i className="fa-solid fa-times"></i>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Configuraciones de privacidad */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-medium text-gray-700">Configuraciones de Privacidad</h4>

                                <div className="space-y-3">
                                    <label className="flex items-center space-x-3">
                                        <input
                                            type="checkbox"
                                            checked={formData.privacySettings.blurFaces}
                                            onChange={(e) => handlePrivacyChange('blurFaces', e.target.checked)}
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
                                            onChange={(e) => handlePrivacyChange('sensitiveContent', e.target.checked)}
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
                                            onChange={(e) => handlePrivacyChange('shareWithParents', e.target.checked)}
                                            className="rounded border-gray-300 text-primary focus:ring-primary"
                                        />
                                        <div className="flex items-center space-x-2">
                                            <i className="fa-solid fa-share text-green-600"></i>
                                            <span className="text-sm text-gray-700">Compartir con padres</span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditingEntry(null);
                                        resetForm();
                                    }}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 cursor-pointer"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 cursor-pointer"
                                >
                                    {loading ? 'Guardando...' : editingEntry ? 'Actualizar Entrada' : 'Guardar Entrada'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}