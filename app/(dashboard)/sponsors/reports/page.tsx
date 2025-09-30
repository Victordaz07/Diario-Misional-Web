'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';

interface SponsorReport {
    id: string;
    sponsorId: string;
    month: string;
    year: number;
    activities: number;
    baptisms: number;
    teachings: number;
    serviceHours: number;
    photos: number;
    diaryEntries: number;
    status: 'sent' | 'pending' | 'draft';
    sentDate?: string;
    createdAt: string;
    notes?: string;
}

interface Sponsor {
    id: string;
    name: string;
    email: string;
    relationship: 'family' | 'friend' | 'organization' | 'other';
}

interface ReportTemplate {
    id: string;
    name: string;
    description: string;
    sections: string[];
    isDefault: boolean;
}

export default function SponsorsReportsPage() {
    const { user } = useAuth();
    const [reports, setReports] = useState<SponsorReport[]>([]);
    const [sponsors, setSponsors] = useState<Sponsor[]>([]);
    const [templates, setTemplates] = useState<ReportTemplate[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showTemplateModal, setShowTemplateModal] = useState(false);
    const [selectedReport, setSelectedReport] = useState<SponsorReport | null>(null);
    const [activeTab, setActiveTab] = useState<'reports' | 'templates' | 'analytics'>('reports');

    const [reportFormData, setReportFormData] = useState({
        sponsorId: '',
        month: new Date().toLocaleDateString('es-ES', { month: 'long' }),
        year: new Date().getFullYear(),
        activities: 0,
        baptisms: 0,
        teachings: 0,
        serviceHours: 0,
        photos: 0,
        diaryEntries: 0,
        notes: ''
    });

    const [templateFormData, setTemplateFormData] = useState({
        name: '',
        description: '',
        sections: [] as string[]
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            // Load sample data
            const sampleSponsors: Sponsor[] = [
                { id: 'sponsor-1', name: 'Familia Smith', email: 'smith.family@email.com', relationship: 'family' },
                { id: 'sponsor-2', name: 'Iglesia de Salt Lake City', email: 'contact@saltlakechurch.org', relationship: 'organization' },
                { id: 'sponsor-3', name: 'Hermano Johnson', email: 'johnson.brother@email.com', relationship: 'friend' }
            ];

            const sampleReports: SponsorReport[] = [
                {
                    id: 'report-1',
                    sponsorId: 'sponsor-1',
                    month: 'Septiembre',
                    year: 2024,
                    activities: 12,
                    baptisms: 2,
                    teachings: 28,
                    serviceHours: 45,
                    photos: 15,
                    diaryEntries: 23,
                    status: 'sent',
                    sentDate: '2024-10-01',
                    createdAt: '2024-09-30',
                    notes: 'Mes muy productivo con muchas actividades de servicio.'
                },
                {
                    id: 'report-2',
                    sponsorId: 'sponsor-2',
                    month: 'Septiembre',
                    year: 2024,
                    activities: 12,
                    baptisms: 2,
                    teachings: 28,
                    serviceHours: 45,
                    photos: 15,
                    diaryEntries: 23,
                    status: 'sent',
                    sentDate: '2024-10-01',
                    createdAt: '2024-09-30'
                },
                {
                    id: 'report-3',
                    sponsorId: 'sponsor-1',
                    month: 'Octubre',
                    year: 2024,
                    activities: 0,
                    baptisms: 0,
                    teachings: 0,
                    serviceHours: 0,
                    photos: 0,
                    diaryEntries: 0,
                    status: 'draft',
                    createdAt: '2024-10-01'
                }
            ];

            const sampleTemplates: ReportTemplate[] = [
                {
                    id: 'template-1',
                    name: 'Reporte Estándar',
                    description: 'Reporte mensual con estadísticas básicas',
                    sections: ['Actividades', 'Bautismos', 'Enseñanzas', 'Horas de Servicio', 'Fotos', 'Entradas del Diario'],
                    isDefault: true
                },
                {
                    id: 'template-2',
                    name: 'Reporte Detallado',
                    description: 'Reporte completo con análisis y reflexiones',
                    sections: ['Actividades', 'Bautismos', 'Enseñanzas', 'Horas de Servicio', 'Fotos', 'Entradas del Diario', 'Reflexiones Espirituales', 'Metas Cumplidas'],
                    isDefault: false
                },
                {
                    id: 'template-3',
                    name: 'Reporte Familiar',
                    description: 'Reporte personalizado para familia',
                    sections: ['Actividades', 'Fotos', 'Entradas del Diario', 'Mensaje Personal'],
                    isDefault: false
                }
            ];

            setSponsors(sampleSponsors);
            setReports(sampleReports);
            setTemplates(sampleTemplates);

            // Try to load from Firebase
            try {
                const [sponsorsSnapshot, reportsSnapshot, templatesSnapshot] = await Promise.all([
                    db.collection('sponsors').get(),
                    db.collection('sponsorReports').get(),
                    db.collection('reportTemplates').get()
                ]);

                if (sponsorsSnapshot.docs.length > 0) {
                    const sponsorsData = sponsorsSnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    })) as Sponsor[];
                    setSponsors(sponsorsData);
                }

                if (reportsSnapshot.docs.length > 0) {
                    const reportsData = reportsSnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    })) as SponsorReport[];
                    setReports(reportsData);
                }

                if (templatesSnapshot.docs.length > 0) {
                    const templatesData = templatesSnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    })) as ReportTemplate[];
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

    const handleCreateReport = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const newReport: SponsorReport = {
                id: `report-${Date.now()}`,
                ...reportFormData,
                status: 'draft',
                createdAt: new Date().toISOString()
            };

            await db.collection('sponsorReports').add(newReport);
            setReports([...reports, newReport]);
            setShowCreateModal(false);
            setReportFormData({
                sponsorId: '',
                month: new Date().toLocaleDateString('es-ES', { month: 'long' }),
                year: new Date().getFullYear(),
                activities: 0,
                baptisms: 0,
                teachings: 0,
                serviceHours: 0,
                photos: 0,
                diaryEntries: 0,
                notes: ''
            });
            showNotification('Reporte creado exitosamente', 'success');
        } catch (error) {
            console.error('Error creating report:', error);
            showNotification('Error al crear reporte', 'error');
        }
    };

    const handleSendReport = async (reportId: string) => {
        try {
            await db.collection('sponsorReports').doc(reportId).update({
                status: 'sent',
                sentDate: new Date().toISOString()
            });

            setReports(reports.map(r =>
                r.id === reportId
                    ? { ...r, status: 'sent', sentDate: new Date().toISOString() }
                    : r
            ));

            showNotification('Reporte enviado exitosamente', 'success');
        } catch (error) {
            console.error('Error sending report:', error);
            showNotification('Error al enviar reporte', 'error');
        }
    };

    const handleCreateTemplate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const newTemplate: ReportTemplate = {
                id: `template-${Date.now()}`,
                ...templateFormData,
                isDefault: false
            };

            await db.collection('reportTemplates').add(newTemplate);
            setTemplates([...templates, newTemplate]);
            setShowTemplateModal(false);
            setTemplateFormData({
                name: '',
                description: '',
                sections: []
            });
            showNotification('Plantilla creada exitosamente', 'success');
        } catch (error) {
            console.error('Error creating template:', error);
            showNotification('Error al crear plantilla', 'error');
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
            case 'sent': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'draft': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'sent': return 'Enviado';
            case 'pending': return 'Pendiente';
            case 'draft': return 'Borrador';
            default: return 'Desconocido';
        }
    };

    const sentReports = reports.filter(r => r.status === 'sent');
    const draftReports = reports.filter(r => r.status === 'draft');
    const totalReports = reports.length;
    const averageActivities = reports.length > 0 ? Math.round(reports.reduce((sum, r) => sum + r.activities, 0) / reports.length) : 0;

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
                        <h1 className="text-3xl font-bold text-gray-800">Reportes para Sponsors</h1>
                        <p className="text-gray-600 mt-2">Crea, gestiona y envía reportes a tus patrocinadores</p>
                    </div>
                    <div className="flex space-x-3">
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2"
                        >
                            <i className="fa-solid fa-plus"></i>
                            <span>Nuevo Reporte</span>
                        </button>
                        <button
                            onClick={() => setShowTemplateModal(true)}
                            className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2"
                        >
                            <i className="fa-solid fa-file-alt"></i>
                            <span>Nueva Plantilla</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Reportes</p>
                            <p className="text-2xl font-bold text-gray-800">{totalReports}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <i className="fa-solid fa-file-alt text-blue-600 text-xl"></i>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Enviados</p>
                            <p className="text-2xl font-bold text-gray-800">{sentReports.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <i className="fa-solid fa-paper-plane text-green-600 text-xl"></i>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Borradores</p>
                            <p className="text-2xl font-bold text-gray-800">{draftReports.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <i className="fa-solid fa-edit text-yellow-600 text-xl"></i>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Promedio Actividades</p>
                            <p className="text-2xl font-bold text-gray-800">{averageActivities}</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <i className="fa-solid fa-chart-bar text-purple-600 text-xl"></i>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-8 px-6">
                        {[
                            { id: 'reports', label: 'Reportes', icon: 'fa-file-alt' },
                            { id: 'templates', label: 'Plantillas', icon: 'fa-layer-group' },
                            { id: 'analytics', label: 'Analíticas', icon: 'fa-chart-line' }
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
                    {/* Reports Tab */}
                    {activeTab === 'reports' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-800">Lista de Reportes</h3>
                                <div className="flex items-center space-x-2">
                                    <select className="text-sm border border-gray-300 rounded-lg px-3 py-1">
                                        <option>Todos los reportes</option>
                                        <option>Enviados</option>
                                        <option>Borradores</option>
                                        <option>Pendientes</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {reports.map(report => {
                                    const sponsor = sponsors.find(s => s.id === report.sponsorId);
                                    return (
                                        <div key={report.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    <h4 className="font-semibold text-gray-800">
                                                        Reporte {report.month} {report.year}
                                                    </h4>
                                                    <p className="text-sm text-gray-600">Para: {sponsor?.name}</p>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(report.status)}`}>
                                                        {getStatusText(report.status)}
                                                    </span>
                                                    {report.sentDate && (
                                                        <span className="text-sm text-gray-500">
                                                            Enviado: {new Date(report.sentDate).toLocaleDateString('es-ES')}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-blue-600">{report.activities}</div>
                                                    <div className="text-xs text-gray-600">Actividades</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-green-600">{report.baptisms}</div>
                                                    <div className="text-xs text-gray-600">Bautismos</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-purple-600">{report.teachings}</div>
                                                    <div className="text-xs text-gray-600">Enseñanzas</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-orange-600">{report.serviceHours}</div>
                                                    <div className="text-xs text-gray-600">Horas Servicio</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-pink-600">{report.photos}</div>
                                                    <div className="text-xs text-gray-600">Fotos</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-indigo-600">{report.diaryEntries}</div>
                                                    <div className="text-xs text-gray-600">Entradas Diario</div>
                                                </div>
                                            </div>

                                            {report.notes && (
                                                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                                                    <p className="text-sm text-blue-800 italic">"{report.notes}"</p>
                                                </div>
                                            )}

                                            <div className="flex space-x-2">
                                                {report.status === 'draft' && (
                                                    <button
                                                        onClick={() => handleSendReport(report.id)}
                                                        className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
                                                    >
                                                        <i className="fa-solid fa-paper-plane mr-2"></i>
                                                        Enviar Reporte
                                                    </button>
                                                )}
                                                <button className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                                                    <i className="fa-solid fa-eye mr-2"></i>
                                                    Ver Detalles
                                                </button>
                                                <button className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">
                                                    <i className="fa-solid fa-edit mr-2"></i>
                                                    Editar
                                                </button>
                                                <button className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">
                                                    <i className="fa-solid fa-download mr-2"></i>
                                                    Descargar PDF
                                                </button>
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
                                <h3 className="text-lg font-semibold text-gray-800">Plantillas de Reporte</h3>
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
                                                <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                                            </div>
                                            {template.isDefault && (
                                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                                    Por defecto
                                                </span>
                                            )}
                                        </div>

                                        <div className="mb-4">
                                            <h5 className="text-sm font-medium text-gray-700 mb-2">Secciones incluidas:</h5>
                                            <div className="flex flex-wrap gap-1">
                                                {template.sections.map((section, index) => (
                                                    <span key={index} className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs">
                                                        {section}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex space-x-2">
                                            <button className="flex-1 bg-primary text-white py-2 px-3 rounded-lg text-sm hover:bg-primary/90 transition-colors">
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

                    {/* Analytics Tab */}
                    {activeTab === 'analytics' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-800">Analíticas de Reportes</h3>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                    <h4 className="font-semibold text-gray-800 mb-4">Reportes por Mes</h4>
                                    <div className="space-y-3">
                                        {['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'].map(month => (
                                            <div key={month} className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600">{month}</span>
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-24 bg-gray-200 rounded-full h-2">
                                                        <div className="bg-primary h-2 rounded-full" style={{ width: `${Math.random() * 100}%` }}></div>
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-800">{Math.floor(Math.random() * 10) + 1}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                    <h4 className="font-semibold text-gray-800 mb-4">Actividades Promedio</h4>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Actividades</span>
                                            <div className="flex items-center space-x-2">
                                                <div className="w-24 bg-gray-200 rounded-full h-2">
                                                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                                                </div>
                                                <span className="text-sm font-medium text-gray-800">12</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Bautismos</span>
                                            <div className="flex items-center space-x-2">
                                                <div className="w-24 bg-gray-200 rounded-full h-2">
                                                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                                                </div>
                                                <span className="text-sm font-medium text-gray-800">2</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Enseñanzas</span>
                                            <div className="flex items-center space-x-2">
                                                <div className="w-24 bg-gray-200 rounded-full h-2">
                                                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                                                </div>
                                                <span className="text-sm font-medium text-gray-800">28</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Horas de Servicio</span>
                                            <div className="flex items-center space-x-2">
                                                <div className="w-24 bg-gray-200 rounded-full h-2">
                                                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                                                </div>
                                                <span className="text-sm font-medium text-gray-800">45</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                <h4 className="font-semibold text-gray-800 mb-4">Tendencias de Envío</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-green-600">95%</div>
                                        <div className="text-sm text-gray-600">Reportes enviados a tiempo</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-blue-600">2.3</div>
                                        <div className="text-sm text-gray-600">Días promedio de respuesta</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-purple-600">4.8</div>
                                        <div className="text-sm text-gray-600">Calificación promedio</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Create Report Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-800">Crear Nuevo Reporte</h3>
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <i className="fa-solid fa-times text-xl"></i>
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleCreateReport} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Sponsor</label>
                                    <select
                                        required
                                        value={reportFormData.sponsorId}
                                        onChange={(e) => setReportFormData({ ...reportFormData, sponsorId: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value="">Seleccionar sponsor</option>
                                        {sponsors.map(sponsor => (
                                            <option key={sponsor.id} value={sponsor.id}>{sponsor.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mes</label>
                                    <select
                                        value={reportFormData.month}
                                        onChange={(e) => setReportFormData({ ...reportFormData, month: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value="Enero">Enero</option>
                                        <option value="Febrero">Febrero</option>
                                        <option value="Marzo">Marzo</option>
                                        <option value="Abril">Abril</option>
                                        <option value="Mayo">Mayo</option>
                                        <option value="Junio">Junio</option>
                                        <option value="Julio">Julio</option>
                                        <option value="Agosto">Agosto</option>
                                        <option value="Septiembre">Septiembre</option>
                                        <option value="Octubre">Octubre</option>
                                        <option value="Noviembre">Noviembre</option>
                                        <option value="Diciembre">Diciembre</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Año</label>
                                    <input
                                        type="number"
                                        min="2020"
                                        max="2030"
                                        value={reportFormData.year}
                                        onChange={(e) => setReportFormData({ ...reportFormData, year: parseInt(e.target.value) })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Actividades</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={reportFormData.activities}
                                        onChange={(e) => setReportFormData({ ...reportFormData, activities: parseInt(e.target.value) || 0 })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Bautismos</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={reportFormData.baptisms}
                                        onChange={(e) => setReportFormData({ ...reportFormData, baptisms: parseInt(e.target.value) || 0 })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Enseñanzas</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={reportFormData.teachings}
                                        onChange={(e) => setReportFormData({ ...reportFormData, teachings: parseInt(e.target.value) || 0 })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Horas de Servicio</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={reportFormData.serviceHours}
                                        onChange={(e) => setReportFormData({ ...reportFormData, serviceHours: parseInt(e.target.value) || 0 })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Fotos</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={reportFormData.photos}
                                        onChange={(e) => setReportFormData({ ...reportFormData, photos: parseInt(e.target.value) || 0 })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Entradas del Diario</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={reportFormData.diaryEntries}
                                        onChange={(e) => setReportFormData({ ...reportFormData, diaryEntries: parseInt(e.target.value) || 0 })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Notas (opcional)</label>
                                <textarea
                                    value={reportFormData.notes}
                                    onChange={(e) => setReportFormData({ ...reportFormData, notes: e.target.value })}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors"
                                >
                                    Crear Reporte
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Create Template Modal */}
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                                <textarea
                                    value={templateFormData.description}
                                    onChange={(e) => setTemplateFormData({ ...templateFormData, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Secciones</label>
                                <div className="space-y-2">
                                    {['Actividades', 'Bautismos', 'Enseñanzas', 'Horas de Servicio', 'Fotos', 'Entradas del Diario', 'Reflexiones Espirituales', 'Metas Cumplidas'].map(section => (
                                        <label key={section} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={templateFormData.sections.includes(section)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setTemplateFormData({
                                                            ...templateFormData,
                                                            sections: [...templateFormData.sections, section]
                                                        });
                                                    } else {
                                                        setTemplateFormData({
                                                            ...templateFormData,
                                                            sections: templateFormData.sections.filter(s => s !== section)
                                                        });
                                                    }
                                                }}
                                                className="mr-2"
                                            />
                                            <span className="text-sm text-gray-700">{section}</span>
                                        </label>
                                    ))}
                                </div>
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
