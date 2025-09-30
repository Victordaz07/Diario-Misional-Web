'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';

interface ViewerInvite {
    id: string;
    email: string;
    name: string;
    relationship: 'family' | 'friend' | 'ward' | 'organization';
    status: 'pending' | 'accepted' | 'expired';
    invitedAt: string;
    expiresAt: string;
    accessCode?: string;
}

interface SharedContent {
    id: string;
    type: 'photo' | 'testimony' | 'achievement' | 'weekly_digest';
    title: string;
    content: string;
    imageUrl?: string;
    blurFaces: boolean;
    scheduledAt?: string;
    publishedAt?: string;
    status: 'draft' | 'scheduled' | 'published';
    createdAt: string;
}

interface SharingSettings {
    sharePhotos: boolean;
    shareTestimonies: boolean;
    shareAchievements: boolean;
    shareWeeklyDigest: boolean;
    blurFaces: boolean;
    publicationDelay: number; // hours
    autoApprove: boolean;
}

export default function SponsorsPage() {
    const { user } = useAuth();
    const [invites, setInvites] = useState<ViewerInvite[]>([]);
    const [sharedContent, setSharedContent] = useState<SharedContent[]>([]);
    const [sharingSettings, setSharingSettings] = useState<SharingSettings>({
        sharePhotos: true,
        shareTestimonies: true,
        shareAchievements: true,
        shareWeeklyDigest: true,
        blurFaces: false,
        publicationDelay: 24,
        autoApprove: false
    });
    const [loading, setLoading] = useState(true);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [showContentModal, setShowContentModal] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'invites' | 'content' | 'settings'>('overview');

    const [inviteFormData, setInviteFormData] = useState({
        email: '',
        name: '',
        relationship: 'family' as const
    });

    const [contentFormData, setContentFormData] = useState({
        type: 'testimony' as const,
        title: '',
        content: '',
        blurFaces: false,
        scheduledAt: '',
        imageFile: null as File | null
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            // Load sample data
            const sampleInvites: ViewerInvite[] = [
                {
                    id: 'invite-1',
                    email: 'smith.family@email.com',
                    name: 'Familia Smith',
                    relationship: 'family',
                    status: 'accepted',
                    invitedAt: '2024-01-15T10:00:00Z',
                    expiresAt: '2024-02-15T10:00:00Z',
                    accessCode: 'FAM-2024-001'
                },
                {
                    id: 'invite-2',
                    email: 'ward.saltlake@gmail.com',
                    name: 'Barrio Salt Lake City',
                    relationship: 'ward',
                    status: 'pending',
                    invitedAt: '2024-09-20T14:30:00Z',
                    expiresAt: '2024-10-20T14:30:00Z',
                    accessCode: 'WRD-2024-002'
                },
                {
                    id: 'invite-3',
                    email: 'johnson.brother@email.com',
                    name: 'Hermano Johnson',
                    relationship: 'friend',
                    status: 'expired',
                    invitedAt: '2024-08-01T09:15:00Z',
                    expiresAt: '2024-09-01T09:15:00Z'
                }
            ];

            const sampleContent: SharedContent[] = [
                {
                    id: 'content-1',
                    type: 'testimony',
                    title: 'Mi testimonio de esta semana',
                    content: 'Esta semana he visto milagros increíbles en el servicio. El Espíritu ha guiado cada enseñanza y he sentido el amor de Dios por Sus hijos.',
                    publishedAt: '2024-09-25T16:00:00Z',
                    status: 'published',
                    blurFaces: false,
                    createdAt: '2024-09-25T15:30:00Z'
                },
                {
                    id: 'content-2',
                    type: 'achievement',
                    title: 'Primer bautismo en el área',
                    content: 'Hoy fue un día histórico. Carlos González tomó la decisión de seguir a Cristo y fue bautizado. Su familia también está progresando.',
                    publishedAt: '2024-09-20T18:00:00Z',
                    status: 'published',
                    blurFaces: true,
                    createdAt: '2024-09-20T17:45:00Z'
                },
                {
                    id: 'content-3',
                    type: 'weekly_digest',
                    title: 'Resumen Semanal - Semana 38',
                    content: 'Esta semana completamos 12 enseñanzas, tuvimos 2 bautismos y realizamos 8 horas de servicio comunitario. El área está progresando mucho.',
                    scheduledAt: '2024-10-01T10:00:00Z',
                    status: 'scheduled',
                    blurFaces: false,
                    createdAt: '2024-09-28T20:00:00Z'
                }
            ];

            setInvites(sampleInvites);
            setSharedContent(sampleContent);

            // Try to load from Firebase
            try {
                const [invitesSnapshot, contentSnapshot, settingsSnapshot] = await Promise.all([
                    db.collection('viewer_invites').get(),
                    db.collection('shared_feed').get(),
                    db.collection('sharing_settings').doc('current').get()
                ]);

                if (invitesSnapshot.docs.length > 0) {
                    const invitesData = invitesSnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    })) as ViewerInvite[];
                    setInvites(invitesData);
                }

                if (contentSnapshot.docs.length > 0) {
                    const contentData = contentSnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    })) as SharedContent[];
                    setSharedContent(contentData);
                }

                if (settingsSnapshot.exists()) {
                    const settingsData = settingsSnapshot.data() as SharingSettings;
                    setSharingSettings(settingsData);
                }
            } catch (firebaseError) {
                console.log('Firebase not available, using sample data');
            }
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const accessCode = `INV-${Date.now().toString().slice(-6)}`;
            const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

            const newInvite: ViewerInvite = {
                id: `invite-${Date.now()}`,
                ...inviteFormData,
                status: 'pending',
                invitedAt: new Date().toISOString(),
                expiresAt: expiresAt.toISOString(),
                accessCode
            };

            await db.collection('viewer_invites').add(newInvite);
            setInvites([...invites, newInvite]);
            setShowInviteModal(false);
            setInviteFormData({
                email: '',
                name: '',
                relationship: 'family'
            });
            showNotification('Invitación enviada exitosamente', 'success');
        } catch (error) {
            console.error('Error sending invite:', error);
            showNotification('Error al enviar invitación', 'error');
        }
    };

    const handleShareContent = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const newContent: SharedContent = {
                id: `content-${Date.now()}`,
                ...contentFormData,
                status: contentFormData.scheduledAt ? 'scheduled' : 'published',
                publishedAt: contentFormData.scheduledAt ? undefined : new Date().toISOString(),
                createdAt: new Date().toISOString()
            };

            await db.collection('shared_feed').add(newContent);
            setSharedContent([newContent, ...sharedContent]);
            setShowContentModal(false);
            setContentFormData({
                type: 'testimony',
                title: '',
                content: '',
                blurFaces: false,
                scheduledAt: '',
                imageFile: null
            });
            showNotification('Contenido compartido exitosamente', 'success');
        } catch (error) {
            console.error('Error sharing content:', error);
            showNotification('Error al compartir contenido', 'error');
        }
    };

    const handleUpdateSettings = async () => {
        try {
            await db.collection('sharing_settings').doc('current').set(sharingSettings);
            showNotification('Configuración guardada exitosamente', 'success');
        } catch (error) {
            console.error('Error updating settings:', error);
            showNotification('Error al guardar configuración', 'error');
        }
    };

    const showNotification = (message: string, type: 'success' | 'error') => {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 ${type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white p-4 rounded-lg shadow-lg z-50`;
        notification.innerHTML = `<i class="fa-solid fa-${type === 'success' ? 'check' : 'exclamation-triangle'} mr-2"></i>${message}`;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'accepted': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'expired': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getContentStatusColor = (status: string) => {
        switch (status) {
            case 'published': return 'bg-green-100 text-green-800';
            case 'scheduled': return 'bg-blue-100 text-blue-800';
            case 'draft': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'photo': return 'fa-solid fa-camera';
            case 'testimony': return 'fa-solid fa-heart';
            case 'achievement': return 'fa-solid fa-trophy';
            case 'weekly_digest': return 'fa-solid fa-calendar-week';
            default: return 'fa-solid fa-question';
        }
    };

    const getRelationshipIcon = (relationship: string) => {
        switch (relationship) {
            case 'family': return 'fa-solid fa-heart';
            case 'friend': return 'fa-solid fa-user-friends';
            case 'ward': return 'fa-solid fa-church';
            case 'organization': return 'fa-solid fa-building';
            default: return 'fa-solid fa-user';
        }
    };

    const activeInvites = invites.filter(i => i.status === 'accepted');
    const pendingInvites = invites.filter(i => i.status === 'pending');
    const publishedContent = sharedContent.filter(c => c.status === 'published');
    const scheduledContent = sharedContent.filter(c => c.status === 'scheduled');

    if (loading) {
        return (
            <div className="p-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
                        ))}
                    </div>
                    <div className="h-96 bg-gray-200 rounded-lg"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Compartir con Sponsors</h1>
                        <p className="text-gray-600 mt-2">Gestiona invitaciones y comparte tu progreso misional de forma segura</p>
                    </div>
                    <div className="flex space-x-3">
                        <button
                            onClick={() => setShowInviteModal(true)}
                            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2"
                        >
                            <i className="fa-solid fa-plus"></i>
                            <span>Invitar Sponsor</span>
                        </button>
                        <button
                            onClick={() => setShowContentModal(true)}
                            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
                        >
                            <i className="fa-solid fa-share"></i>
                            <span>Compartir Contenido</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Sponsors Activos</p>
                            <p className="text-2xl font-bold text-gray-800">{activeInvites.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <i className="fa-solid fa-users text-green-600 text-xl"></i>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Invitaciones Pendientes</p>
                            <p className="text-2xl font-bold text-gray-800">{pendingInvites.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <i className="fa-solid fa-clock text-yellow-600 text-xl"></i>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Contenido Publicado</p>
                            <p className="text-2xl font-bold text-gray-800">{publishedContent.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <i className="fa-solid fa-share text-blue-600 text-xl"></i>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Programados</p>
                            <p className="text-2xl font-bold text-gray-800">{scheduledContent.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <i className="fa-solid fa-calendar text-purple-600 text-xl"></i>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-8 px-6">
                        {[
                            { id: 'overview', label: 'Resumen', icon: 'fa-chart-pie' },
                            { id: 'invites', label: 'Invitaciones', icon: 'fa-envelope' },
                            { id: 'content', label: 'Contenido', icon: 'fa-share' },
                            { id: 'settings', label: 'Configuración', icon: 'fa-cog' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${activeTab === tab.id
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <i className={`fa-solid ${tab.icon}`}></i>
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="p-6">
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-800">Resumen de Sponsors</h3>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Active Sponsors */}
                                <div className="space-y-4">
                                    <h4 className="font-semibold text-gray-700">Sponsors Activos</h4>
                                    {activeInvites.map(invite => (
                                        <div key={invite.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                                        <i className={`${getRelationshipIcon(invite.relationship)} text-primary`}></i>
                                                    </div>
                                                    <div>
                                                        <h5 className="font-semibold text-gray-800">{invite.name}</h5>
                                                        <p className="text-sm text-gray-600">{invite.email}</p>
                                                    </div>
                                                </div>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invite.status)}`}>
                                                    {invite.status}
                                                </span>
                                            </div>

                                            <div className="text-sm text-gray-600">
                                                <p>Código de acceso: <span className="font-mono font-medium">{invite.accessCode}</span></p>
                                                <p>Acceso desde: {new Date(invite.invitedAt).toLocaleDateString('es-ES')}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Recent Content */}
                                <div className="space-y-4">
                                    <h4 className="font-semibold text-gray-700">Contenido Reciente</h4>
                                    {sharedContent.slice(0, 3).map(content => (
                                        <div key={content.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                                        <i className={`${getTypeIcon(content.type)} text-gray-600 text-sm`}></i>
                                                    </div>
                                                    <div>
                                                        <h6 className="font-medium text-gray-800">{content.title}</h6>
                                                        <p className="text-xs text-gray-600">{content.type}</p>
                                                    </div>
                                                </div>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getContentStatusColor(content.status)}`}>
                                                    {content.status === 'published' ? 'Publicado' :
                                                        content.status === 'scheduled' ? 'Programado' : 'Borrador'}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 line-clamp-2">{content.content}</p>
                                            {content.blurFaces && (
                                                <div className="mt-2">
                                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                                                        <i className="fa-solid fa-eye-slash mr-1"></i>
                                                        Caras difuminadas
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Invites Tab */}
                    {activeTab === 'invites' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-800">Gestión de Invitaciones</h3>
                                <button
                                    onClick={() => setShowInviteModal(true)}
                                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                                >
                                    <i className="fa-solid fa-plus mr-2"></i>
                                    Nueva Invitación
                                </button>
                            </div>

                            <div className="space-y-4">
                                {invites.map(invite => (
                                    <div key={invite.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                                    <i className={`${getRelationshipIcon(invite.relationship)} text-gray-600`}></i>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-800">{invite.name}</h4>
                                                    <p className="text-sm text-gray-600">{invite.email}</p>
                                                    <p className="text-xs text-gray-500 capitalize">{invite.relationship}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(invite.status)}`}>
                                                    {invite.status === 'accepted' ? 'Aceptado' :
                                                        invite.status === 'pending' ? 'Pendiente' : 'Expirado'}
                                                </span>
                                                {invite.accessCode && (
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        Código: <span className="font-mono">{invite.accessCode}</span>
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                                            <div>
                                                <span className="font-medium">Invitado:</span> {new Date(invite.invitedAt).toLocaleDateString('es-ES')}
                                            </div>
                                            <div>
                                                <span className="font-medium">Expira:</span> {new Date(invite.expiresAt).toLocaleDateString('es-ES')}
                                            </div>
                                        </div>

                                        <div className="flex space-x-2">
                                            {invite.status === 'pending' && (
                                                <button className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                                                    <i className="fa-solid fa-paper-plane mr-2"></i>
                                                    Reenviar
                                                </button>
                                            )}
                                            <button className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">
                                                <i className="fa-solid fa-eye mr-2"></i>
                                                Ver Detalles
                                            </button>
                                            <button className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors">
                                                <i className="fa-solid fa-trash mr-2"></i>
                                                Revocar
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Content Tab */}
                    {activeTab === 'content' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-800">Contenido Compartido</h3>
                                <button
                                    onClick={() => setShowContentModal(true)}
                                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                                >
                                    <i className="fa-solid fa-plus mr-2"></i>
                                    Nuevo Contenido
                                </button>
                            </div>

                            <div className="space-y-4">
                                {sharedContent.map(content => (
                                    <div key={content.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                                    <i className={`${getTypeIcon(content.type)} text-gray-600`}></i>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-800">{content.title}</h4>
                                                    <p className="text-sm text-gray-600 capitalize">{content.type.replace('_', ' ')}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getContentStatusColor(content.status)}`}>
                                                    {content.status === 'published' ? 'Publicado' :
                                                        content.status === 'scheduled' ? 'Programado' : 'Borrador'}
                                                </span>
                                                {content.blurFaces && (
                                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                                                        <i className="fa-solid fa-eye-slash mr-1"></i>
                                                        Blur
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <p className="text-sm text-gray-700">{content.content}</p>
                                        </div>

                                        <div className="flex items-center justify-between text-sm text-gray-500">
                                            <div className="flex items-center space-x-4">
                                                <span>Creado: {new Date(content.createdAt).toLocaleDateString('es-ES')}</span>
                                                {content.publishedAt && (
                                                    <span>Publicado: {new Date(content.publishedAt).toLocaleDateString('es-ES')}</span>
                                                )}
                                                {content.scheduledAt && (
                                                    <span>Programado: {new Date(content.scheduledAt).toLocaleDateString('es-ES')}</span>
                                                )}
                                            </div>
                                            <div className="flex space-x-2">
                                                <button className="text-blue-600 hover:text-blue-800">
                                                    <i className="fa-solid fa-eye"></i>
                                                </button>
                                                <button className="text-gray-600 hover:text-gray-800">
                                                    <i className="fa-solid fa-edit"></i>
                                                </button>
                                                <button className="text-red-600 hover:text-red-800">
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Settings Tab */}
                    {activeTab === 'settings' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-800">Configuración de Privacidad</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                    <h4 className="font-semibold text-gray-800 mb-4">Qué Compartir</h4>
                                    <div className="space-y-4">
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={sharingSettings.sharePhotos}
                                                onChange={(e) => setSharingSettings({ ...sharingSettings, sharePhotos: e.target.checked })}
                                                className="mr-3"
                                            />
                                            <span className="text-sm text-gray-700">Fotos</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={sharingSettings.shareTestimonies}
                                                onChange={(e) => setSharingSettings({ ...sharingSettings, shareTestimonies: e.target.checked })}
                                                className="mr-3"
                                            />
                                            <span className="text-sm text-gray-700">Testimonios</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={sharingSettings.shareAchievements}
                                                onChange={(e) => setSharingSettings({ ...sharingSettings, shareAchievements: e.target.checked })}
                                                className="mr-3"
                                            />
                                            <span className="text-sm text-gray-700">Logros</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={sharingSettings.shareWeeklyDigest}
                                                onChange={(e) => setSharingSettings({ ...sharingSettings, shareWeeklyDigest: e.target.checked })}
                                                className="mr-3"
                                            />
                                            <span className="text-sm text-gray-700">Resúmenes Semanales</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                    <h4 className="font-semibold text-gray-800 mb-4">Configuración de Privacidad</h4>
                                    <div className="space-y-4">
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={sharingSettings.blurFaces}
                                                onChange={(e) => setSharingSettings({ ...sharingSettings, blurFaces: e.target.checked })}
                                                className="mr-3"
                                            />
                                            <span className="text-sm text-gray-700">Difuminar caras automáticamente</span>
                                        </label>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Retraso de publicación</label>
                                            <select
                                                value={sharingSettings.publicationDelay}
                                                onChange={(e) => setSharingSettings({ ...sharingSettings, publicationDelay: parseInt(e.target.value) })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                            >
                                                <option value={24}>24 horas</option>
                                                <option value={48}>48 horas</option>
                                                <option value={72}>72 horas</option>
                                            </select>
                                        </div>

                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={sharingSettings.autoApprove}
                                                onChange={(e) => setSharingSettings({ ...sharingSettings, autoApprove: e.target.checked })}
                                                className="mr-3"
                                            />
                                            <span className="text-sm text-gray-700">Aprobación automática</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                <div className="flex items-center space-x-2 mb-2">
                                    <i className="fa-solid fa-shield-alt text-blue-600"></i>
                                    <span className="font-medium text-blue-800">Privacidad Garantizada</span>
                                </div>
                                <ul className="text-sm text-blue-700 space-y-1">
                                    <li>• Sin geolocalización exacta, solo área general</li>
                                    <li>• Todos los EXIF de imágenes eliminados</li>
                                    <li>• Delay automático en publicaciones</li>
                                    <li>• Opción de blur en fotos con personas</li>
                                    <li>• Tú decides siempre qué compartir</li>
                                </ul>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    onClick={handleUpdateSettings}
                                    className="bg-primary text-white py-2 px-6 rounded-lg hover:bg-primary/90 transition-colors"
                                >
                                    Guardar Configuración
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Invite Modal */}
            {showInviteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-800">Invitar Nuevo Sponsor</h3>
                                <button
                                    onClick={() => setShowInviteModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <i className="fa-solid fa-times text-xl"></i>
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSendInvite} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                                <input
                                    type="text"
                                    required
                                    value={inviteFormData.name}
                                    onChange={(e) => setInviteFormData({ ...inviteFormData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={inviteFormData.email}
                                    onChange={(e) => setInviteFormData({ ...inviteFormData, email: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Relación</label>
                                <select
                                    value={inviteFormData.relationship}
                                    onChange={(e) => setInviteFormData({ ...inviteFormData, relationship: e.target.value as any })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="family">Familia</option>
                                    <option value="friend">Amigo</option>
                                    <option value="ward">Barrio/Estaca</option>
                                    <option value="organization">Organización</option>
                                </select>
                            </div>

                            <div className="bg-blue-50 rounded-lg p-4">
                                <div className="flex items-center space-x-2 mb-2">
                                    <i className="fa-solid fa-info-circle text-blue-600"></i>
                                    <span className="font-medium text-blue-800">Información</span>
                                </div>
                                <p className="text-sm text-blue-700">
                                    Se enviará un enlace de invitación que expira en 30 días. El sponsor podrá acceder al Portal Familiar de forma segura.
                                </p>
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowInviteModal(false)}
                                    className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors"
                                >
                                    Enviar Invitación
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Content Modal */}
            {showContentModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-800">Compartir Contenido</h3>
                                <button
                                    onClick={() => setShowContentModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <i className="fa-solid fa-times text-xl"></i>
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleShareContent} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Contenido</label>
                                    <select
                                        value={contentFormData.type}
                                        onChange={(e) => setContentFormData({ ...contentFormData, type: e.target.value as any })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value="testimony">Testimonio</option>
                                        <option value="achievement">Logro</option>
                                        <option value="photo">Foto</option>
                                        <option value="weekly_digest">Resumen Semanal</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Programar Publicación (opcional)</label>
                                    <input
                                        type="datetime-local"
                                        value={contentFormData.scheduledAt}
                                        onChange={(e) => setContentFormData({ ...contentFormData, scheduledAt: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                                <input
                                    type="text"
                                    required
                                    value={contentFormData.title}
                                    onChange={(e) => setContentFormData({ ...contentFormData, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contenido</label>
                                <textarea
                                    required
                                    value={contentFormData.content}
                                    onChange={(e) => setContentFormData({ ...contentFormData, content: e.target.value })}
                                    rows={6}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            {contentFormData.type === 'photo' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Imagen</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setContentFormData({ ...contentFormData, imageFile: e.target.files?.[0] || null })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={contentFormData.blurFaces}
                                        onChange={(e) => setContentFormData({ ...contentFormData, blurFaces: e.target.checked })}
                                        className="mr-3"
                                    />
                                    <span className="text-sm text-gray-700">Difuminar caras en la imagen</span>
                                </label>
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowContentModal(false)}
                                    className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
                                >
                                    Compartir Contenido
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}