'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';

interface Sponsor {
    id: string;
    name: string;
    email: string;
    phone?: string;
    relationship: 'family' | 'friend' | 'organization' | 'other';
    status: 'active' | 'inactive' | 'pending';
    communicationPreferences: {
        email: boolean;
        sms: boolean;
        reports: boolean;
    };
}

interface Communication {
    id: string;
    sponsorId: string;
    type: 'email' | 'sms' | 'report' | 'notification';
    subject: string;
    content: string;
    status: 'sent' | 'pending' | 'failed' | 'draft';
    sentDate?: string;
    scheduledDate?: string;
    attachments?: string[];
    priority: 'low' | 'medium' | 'high';
}

interface MessageTemplate {
    id: string;
    name: string;
    type: 'email' | 'sms' | 'report';
    subject: string;
    content: string;
    variables: string[];
    isDefault: boolean;
}

export default function SponsorsCommunicationPage() {
    const { user } = useAuth();
    const [sponsors, setSponsors] = useState<Sponsor[]>([]);
    const [communications, setCommunications] = useState<Communication[]>([]);
    const [templates, setTemplates] = useState<MessageTemplate[]>([]);
    const [loading, setLoading] = useState(true);
    const [showComposeModal, setShowComposeModal] = useState(false);
    const [showTemplateModal, setShowTemplateModal] = useState(false);
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [selectedSponsors, setSelectedSponsors] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState<'compose' | 'history' | 'templates' | 'schedule'>('compose');

    const [messageFormData, setMessageFormData] = useState({
        type: 'email' as const,
        subject: '',
        content: '',
        priority: 'medium' as const,
        scheduledDate: '',
        attachments: [] as string[]
    });

    const [templateFormData, setTemplateFormData] = useState({
        name: '',
        type: 'email' as const,
        subject: '',
        content: '',
        variables: [] as string[]
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            // Load sample data
            const sampleSponsors: Sponsor[] = [
                {
                    id: 'sponsor-1',
                    name: 'Familia Smith',
                    email: 'smith.family@email.com',
                    phone: '+1 (555) 123-4567',
                    relationship: 'family',
                    status: 'active',
                    communicationPreferences: {
                        email: true,
                        sms: false,
                        reports: true
                    }
                },
                {
                    id: 'sponsor-2',
                    name: 'Iglesia de Salt Lake City',
                    email: 'contact@saltlakechurch.org',
                    relationship: 'organization',
                    status: 'active',
                    communicationPreferences: {
                        email: true,
                        sms: false,
                        reports: true
                    }
                },
                {
                    id: 'sponsor-3',
                    name: 'Hermano Johnson',
                    email: 'johnson.brother@email.com',
                    phone: '+1 (555) 987-6543',
                    relationship: 'friend',
                    status: 'inactive',
                    communicationPreferences: {
                        email: true,
                        sms: true,
                        reports: false
                    }
                }
            ];

            const sampleCommunications: Communication[] = [
                {
                    id: 'comm-1',
                    sponsorId: 'sponsor-1',
                    type: 'email',
                    subject: 'Reporte Mensual - Septiembre 2024',
                    content: 'Estimada Familia Smith, adjunto encontrarán el reporte mensual de septiembre con todas las actividades y progreso de Elder Smith...',
                    status: 'sent',
                    sentDate: '2024-10-01T10:30:00Z',
                    priority: 'medium'
                },
                {
                    id: 'comm-2',
                    sponsorId: 'sponsor-2',
                    type: 'email',
                    subject: 'Actualización de Progreso',
                    content: 'Estimados hermanos de la Iglesia de Salt Lake City, les comparto las últimas noticias del progreso misional...',
                    status: 'sent',
                    sentDate: '2024-10-01T11:15:00Z',
                    priority: 'low'
                },
                {
                    id: 'comm-3',
                    sponsorId: 'sponsor-1',
                    type: 'sms',
                    subject: 'Recordatorio de Pago',
                    content: 'Recordatorio: El pago mensual vence el 15 de octubre. Gracias por su apoyo continuo.',
                    status: 'pending',
                    scheduledDate: '2024-10-10T09:00:00Z',
                    priority: 'high'
                }
            ];

            const sampleTemplates: MessageTemplate[] = [
                {
                    id: 'template-1',
                    name: 'Reporte Mensual',
                    type: 'email',
                    subject: 'Reporte Mensual - {month} {year}',
                    content: 'Estimada {sponsor_name}, adjunto encontrarán el reporte mensual de {month} con todas las actividades y progreso de {missionary_name}...',
                    variables: ['sponsor_name', 'month', 'year', 'missionary_name'],
                    isDefault: true
                },
                {
                    id: 'template-2',
                    name: 'Recordatorio de Pago',
                    type: 'sms',
                    subject: 'Recordatorio de Pago',
                    content: 'Recordatorio: El pago mensual vence el {due_date}. Gracias por su apoyo continuo.',
                    variables: ['due_date'],
                    isDefault: false
                },
                {
                    id: 'template-3',
                    name: 'Actualización de Progreso',
                    type: 'email',
                    subject: 'Actualización de Progreso - {missionary_name}',
                    content: 'Estimados {sponsor_name}, les comparto las últimas noticias del progreso misional de {missionary_name}...',
                    variables: ['sponsor_name', 'missionary_name'],
                    isDefault: false
                }
            ];

            setSponsors(sampleSponsors);
            setCommunications(sampleCommunications);
            setTemplates(sampleTemplates);

            // Try to load from Firebase
            try {
                const [sponsorsSnapshot, communicationsSnapshot, templatesSnapshot] = await Promise.all([
                    db.collection('sponsors').get(),
                    db.collection('communications').get(),
                    db.collection('messageTemplates').get()
                ]);

                if (sponsorsSnapshot.docs.length > 0) {
                    const sponsorsData = sponsorsSnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    })) as Sponsor[];
                    setSponsors(sponsorsData);
                }

                if (communicationsSnapshot.docs.length > 0) {
                    const communicationsData = communicationsSnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    })) as Communication[];
                    setCommunications(communicationsData);
                }

                if (templatesSnapshot.docs.length > 0) {
                    const templatesData = templatesSnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    })) as MessageTemplate[];
                    setTemplates(templatesData);
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

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedSponsors.length === 0) {
            showNotification('Selecciona al menos un sponsor', 'error');
            return;
        }

        try {
            const newCommunications: Communication[] = selectedSponsors.map(sponsorId => ({
                id: `comm-${Date.now()}-${sponsorId}`,
                sponsorId,
                ...messageFormData,
                status: messageFormData.scheduledDate ? 'pending' : 'sent',
                sentDate: messageFormData.scheduledDate ? undefined : new Date().toISOString(),
                scheduledDate: messageFormData.scheduledDate || undefined
            }));

            for (const comm of newCommunications) {
                await db.collection('communications').add(comm);
            }

            setCommunications([...communications, ...newCommunications]);
            setShowComposeModal(false);
            setSelectedSponsors([]);
            setMessageFormData({
                type: 'email',
                subject: '',
                content: '',
                priority: 'medium',
                scheduledDate: '',
                attachments: []
            });
            showNotification('Mensaje enviado exitosamente', 'success');
        } catch (error) {
            console.error('Error sending message:', error);
            showNotification('Error al enviar mensaje', 'error');
        }
    };

    const handleCreateTemplate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const newTemplate: MessageTemplate = {
                id: `template-${Date.now()}`,
                ...templateFormData,
                isDefault: false
            };

            await db.collection('messageTemplates').add(newTemplate);
            setTemplates([...templates, newTemplate]);
            setShowTemplateModal(false);
            setTemplateFormData({
                name: '',
                type: 'email',
                subject: '',
                content: '',
                variables: []
            });
            showNotification('Plantilla creada exitosamente', 'success');
        } catch (error) {
            console.error('Error creating template:', error);
            showNotification('Error al crear plantilla', 'error');
        }
    };

    const handleUseTemplate = (template: MessageTemplate) => {
        setMessageFormData({
            ...messageFormData,
            type: template.type,
            subject: template.subject,
            content: template.content
        });
        setShowComposeModal(true);
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
            case 'sent': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'failed': return 'bg-red-100 text-red-800';
            case 'draft': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'low': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'email': return 'fa-solid fa-envelope';
            case 'sms': return 'fa-solid fa-sms';
            case 'report': return 'fa-solid fa-file-alt';
            case 'notification': return 'fa-solid fa-bell';
            default: return 'fa-solid fa-question';
        }
    };

    const activeSponsors = sponsors.filter(s => s.status === 'active');
    const sentMessages = communications.filter(c => c.status === 'sent');
    const pendingMessages = communications.filter(c => c.status === 'pending');
    const failedMessages = communications.filter(c => c.status === 'failed');

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
                        <h1 className="text-3xl font-bold text-gray-800">Comunicación con Sponsors</h1>
                        <p className="text-gray-600 mt-2">Gestiona mensajes, plantillas y comunicaciones con tus patrocinadores</p>
                    </div>
                    <div className="flex space-x-3">
                        <button
                            onClick={() => setShowComposeModal(true)}
                            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2"
                        >
                            <i className="fa-solid fa-plus"></i>
                            <span>Nuevo Mensaje</span>
                        </button>
                        <button
                            onClick={() => setShowScheduleModal(true)}
                            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
                        >
                            <i className="fa-solid fa-calendar"></i>
                            <span>Programar</span>
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
                            <p className="text-2xl font-bold text-gray-800">{activeSponsors.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <i className="fa-solid fa-users text-blue-600 text-xl"></i>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Mensajes Enviados</p>
                            <p className="text-2xl font-bold text-gray-800">{sentMessages.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <i className="fa-solid fa-paper-plane text-green-600 text-xl"></i>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Pendientes</p>
                            <p className="text-2xl font-bold text-gray-800">{pendingMessages.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <i className="fa-solid fa-clock text-yellow-600 text-xl"></i>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Fallidos</p>
                            <p className="text-2xl font-bold text-gray-800">{failedMessages.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                            <i className="fa-solid fa-exclamation-triangle text-red-600 text-xl"></i>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-8 px-6">
                        {[
                            { id: 'compose', label: 'Redactar', icon: 'fa-edit' },
                            { id: 'history', label: 'Historial', icon: 'fa-history' },
                            { id: 'templates', label: 'Plantillas', icon: 'fa-layer-group' },
                            { id: 'schedule', label: 'Programados', icon: 'fa-calendar' }
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
                    {/* Compose Tab */}
                    {activeTab === 'compose' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-800">Redactar Mensaje</h3>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Message Form */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Mensaje</label>
                                        <select
                                            value={messageFormData.type}
                                            onChange={(e) => setMessageFormData({ ...messageFormData, type: e.target.value as any })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        >
                                            <option value="email">Email</option>
                                            <option value="sms">SMS</option>
                                            <option value="report">Reporte</option>
                                            <option value="notification">Notificación</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Asunto</label>
                                        <input
                                            type="text"
                                            value={messageFormData.subject}
                                            onChange={(e) => setMessageFormData({ ...messageFormData, subject: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Contenido</label>
                                        <textarea
                                            value={messageFormData.content}
                                            onChange={(e) => setMessageFormData({ ...messageFormData, content: e.target.value })}
                                            rows={8}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Prioridad</label>
                                        <select
                                            value={messageFormData.priority}
                                            onChange={(e) => setMessageFormData({ ...messageFormData, priority: e.target.value as any })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        >
                                            <option value="low">Baja</option>
                                            <option value="medium">Media</option>
                                            <option value="high">Alta</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Programar Envío (opcional)</label>
                                        <input
                                            type="datetime-local"
                                            value={messageFormData.scheduledDate}
                                            onChange={(e) => setMessageFormData({ ...messageFormData, scheduledDate: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>
                                </div>

                                {/* Recipients */}
                                <div className="space-y-4">
                                    <h4 className="font-semibold text-gray-800">Destinatarios</h4>
                                    <div className="space-y-2">
                                        {activeSponsors.map(sponsor => (
                                            <label key={sponsor.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedSponsors.includes(sponsor.id)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedSponsors([...selectedSponsors, sponsor.id]);
                                                        } else {
                                                            setSelectedSponsors(selectedSponsors.filter(id => id !== sponsor.id));
                                                        }
                                                    }}
                                                    className="rounded"
                                                />
                                                <div className="flex-1">
                                                    <div className="font-medium text-gray-800">{sponsor.name}</div>
                                                    <div className="text-sm text-gray-600">{sponsor.email}</div>
                                                    <div className="text-xs text-gray-500">
                                                        {sponsor.communicationPreferences.email && 'Email '}
                                                        {sponsor.communicationPreferences.sms && 'SMS '}
                                                        {sponsor.communicationPreferences.reports && 'Reportes'}
                                                    </div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>

                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => setSelectedSponsors(activeSponsors.map(s => s.id))}
                                            className="flex-1 bg-gray-200 text-gray-700 py-2 px-3 rounded-lg text-sm hover:bg-gray-300 transition-colors"
                                        >
                                            Seleccionar Todos
                                        </button>
                                        <button
                                            onClick={() => setSelectedSponsors([])}
                                            className="flex-1 bg-gray-200 text-gray-700 py-2 px-3 rounded-lg text-sm hover:bg-gray-300 transition-colors"
                                        >
                                            Limpiar
                                        </button>
                                    </div>

                                    <div className="bg-blue-50 rounded-lg p-4">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <i className="fa-solid fa-info-circle text-blue-600"></i>
                                            <span className="font-medium text-blue-800">Información</span>
                                        </div>
                                        <p className="text-sm text-blue-700">
                                            Seleccionados: {selectedSponsors.length} sponsors
                                        </p>
                                        {messageFormData.scheduledDate && (
                                            <p className="text-sm text-blue-700 mt-1">
                                                Programado para: {new Date(messageFormData.scheduledDate).toLocaleString('es-ES')}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button className="bg-gray-200 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-300 transition-colors">
                                    Guardar Borrador
                                </button>
                                <button
                                    onClick={() => setShowComposeModal(true)}
                                    className="bg-primary text-white py-2 px-6 rounded-lg hover:bg-primary/90 transition-colors"
                                >
                                    Enviar Mensaje
                                </button>
                            </div>
                        </div>
                    )}

                    {/* History Tab */}
                    {activeTab === 'history' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-800">Historial de Comunicaciones</h3>
                                <div className="flex items-center space-x-2">
                                    <select className="text-sm border border-gray-300 rounded-lg px-3 py-1">
                                        <option>Todos los mensajes</option>
                                        <option>Enviados</option>
                                        <option>Pendientes</option>
                                        <option>Fallidos</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {communications.map(communication => {
                                    const sponsor = sponsors.find(s => s.id === communication.sponsorId);
                                    return (
                                        <div key={communication.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                                        <i className={`${getTypeIcon(communication.type)} text-gray-600`}></i>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-gray-800">{communication.subject}</h4>
                                                        <p className="text-sm text-gray-600">Para: {sponsor?.name}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(communication.status)}`}>
                                                        {communication.status === 'sent' ? 'Enviado' :
                                                            communication.status === 'pending' ? 'Pendiente' :
                                                                communication.status === 'failed' ? 'Fallido' : 'Borrador'}
                                                    </span>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(communication.priority)}`}>
                                                        {communication.priority === 'high' ? 'Alta' :
                                                            communication.priority === 'medium' ? 'Media' : 'Baja'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <p className="text-sm text-gray-700 line-clamp-3">{communication.content}</p>
                                            </div>

                                            <div className="flex items-center justify-between text-sm text-gray-500">
                                                <div className="flex items-center space-x-4">
                                                    <span>Tipo: {communication.type}</span>
                                                    {communication.sentDate && (
                                                        <span>Enviado: {new Date(communication.sentDate).toLocaleString('es-ES')}</span>
                                                    )}
                                                    {communication.scheduledDate && (
                                                        <span>Programado: {new Date(communication.scheduledDate).toLocaleString('es-ES')}</span>
                                                    )}
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button className="text-blue-600 hover:text-blue-800">
                                                        <i className="fa-solid fa-eye"></i>
                                                    </button>
                                                    <button className="text-gray-600 hover:text-gray-800">
                                                        <i className="fa-solid fa-edit"></i>
                                                    </button>
                                                    <button className="text-gray-600 hover:text-gray-800">
                                                        <i className="fa-solid fa-trash"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Templates Tab */}
                    {activeTab === 'templates' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-800">Plantillas de Mensaje</h3>
                                <button
                                    onClick={() => setShowTemplateModal(true)}
                                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                                >
                                    <i className="fa-solid fa-plus mr-2"></i>
                                    Nueva Plantilla
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {templates.map(template => (
                                    <div key={template.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h4 className="font-semibold text-gray-800">{template.name}</h4>
                                                <p className="text-sm text-gray-600 mt-1">{template.description || 'Sin descripción'}</p>
                                            </div>
                                            {template.isDefault && (
                                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                                    Por defecto
                                                </span>
                                            )}
                                        </div>

                                        <div className="mb-4">
                                            <h5 className="text-sm font-medium text-gray-700 mb-2">Asunto:</h5>
                                            <p className="text-sm text-gray-600 italic">"{template.subject}"</p>
                                        </div>

                                        <div className="mb-4">
                                            <h5 className="text-sm font-medium text-gray-700 mb-2">Variables disponibles:</h5>
                                            <div className="flex flex-wrap gap-1">
                                                {template.variables.map((variable, index) => (
                                                    <span key={index} className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs">
                                                        {`{${variable}}`}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleUseTemplate(template)}
                                                className="flex-1 bg-primary text-white py-2 px-3 rounded-lg text-sm hover:bg-primary/90 transition-colors"
                                            >
                                                <i className="fa-solid fa-play mr-1"></i>
                                                Usar
                                            </button>
                                            <button className="flex-1 bg-gray-200 text-gray-700 py-2 px-3 rounded-lg text-sm hover:bg-gray-300 transition-colors">
                                                <i className="fa-solid fa-edit mr-1"></i>
                                                Editar
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Schedule Tab */}
                    {activeTab === 'schedule' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-800">Mensajes Programados</h3>

                            <div className="space-y-4">
                                {communications.filter(c => c.status === 'pending' && c.scheduledDate).map(communication => {
                                    const sponsor = sponsors.find(s => s.id === communication.sponsorId);
                                    return (
                                        <div key={communication.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                                                        <i className="fa-solid fa-clock text-yellow-600"></i>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-gray-800">{communication.subject}</h4>
                                                        <p className="text-sm text-gray-600">Para: {sponsor?.name}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm font-medium text-gray-800">
                                                        {communication.scheduledDate && new Date(communication.scheduledDate).toLocaleString('es-ES')}
                                                    </div>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(communication.priority)}`}>
                                                        {communication.priority === 'high' ? 'Alta' :
                                                            communication.priority === 'medium' ? 'Media' : 'Baja'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <p className="text-sm text-gray-700 line-clamp-2">{communication.content}</p>
                                            </div>

                                            <div className="flex space-x-2">
                                                <button className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors">
                                                    <i className="fa-solid fa-play mr-2"></i>
                                                    Enviar Ahora
                                                </button>
                                                <button className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">
                                                    <i className="fa-solid fa-edit mr-2"></i>
                                                    Editar
                                                </button>
                                                <button className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors">
                                                    <i className="fa-solid fa-trash mr-2"></i>
                                                    Cancelar
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Compose Modal */}
            {showComposeModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-800">Enviar Mensaje</h3>
                                <button
                                    onClick={() => setShowComposeModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <i className="fa-solid fa-times text-xl"></i>
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSendMessage} className="p-6 space-y-4">
                            <div className="bg-blue-50 rounded-lg p-4">
                                <div className="flex items-center space-x-2 mb-2">
                                    <i className="fa-solid fa-info-circle text-blue-600"></i>
                                    <span className="font-medium text-blue-800">Confirmación de Envío</span>
                                </div>
                                <p className="text-sm text-blue-700">
                                    Se enviará el mensaje a {selectedSponsors.length} sponsor(s) seleccionado(s).
                                </p>
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowComposeModal(false)}
                                    className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors"
                                >
                                    Enviar Mensaje
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Template Modal */}
            {showTemplateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-800">Crear Nueva Plantilla</h3>
                                <button
                                    onClick={() => setShowTemplateModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <i className="fa-solid fa-times text-xl"></i>
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleCreateTemplate} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                                <input
                                    type="text"
                                    required
                                    value={templateFormData.name}
                                    onChange={(e) => setTemplateFormData({ ...templateFormData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                                <select
                                    value={templateFormData.type}
                                    onChange={(e) => setTemplateFormData({ ...templateFormData, type: e.target.value as any })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="email">Email</option>
                                    <option value="sms">SMS</option>
                                    <option value="report">Reporte</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Asunto</label>
                                <input
                                    type="text"
                                    required
                                    value={templateFormData.subject}
                                    onChange={(e) => setTemplateFormData({ ...templateFormData, subject: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contenido</label>
                                <textarea
                                    required
                                    value={templateFormData.content}
                                    onChange={(e) => setTemplateFormData({ ...templateFormData, content: e.target.value })}
                                    rows={6}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowTemplateModal(false)}
                                    className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors"
                                >
                                    Crear Plantilla
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
