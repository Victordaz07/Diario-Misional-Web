'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';

interface SharedContent {
    id: string;
    type: 'photo' | 'testimony' | 'achievement' | 'weekly_digest';
    title: string;
    content: string;
    imageUrl?: string;
    blurFaces: boolean;
    publishedAt: string;
    createdAt: string;
}

interface ViewerAccess {
    id: string;
    accessCode: string;
    missionaryName: string;
    missionaryEmail: string;
    relationship: string;
    status: 'active' | 'expired';
    lastAccess: string;
    totalViews: number;
}

interface SponsorshipPlan {
    id: string;
    name: string;
    price: number;
    currency: string;
    interval: 'month' | 'year';
    features: string[];
    stripePriceId: string;
}

interface Donation {
    id: string;
    amount: number;
    currency: string;
    status: 'completed' | 'pending' | 'failed';
    createdAt: string;
    type: 'one_time' | 'subscription';
    planId?: string;
}

export default function PortalFamiliarPage() {
    const { user } = useAuth();
    const [sharedContent, setSharedContent] = useState<SharedContent[]>([]);
    const [viewerAccess, setViewerAccess] = useState<ViewerAccess | null>(null);
    const [sponsorshipPlans, setSponsorshipPlans] = useState<SponsorshipPlan[]>([]);
    const [donations, setDonations] = useState<Donation[]>([]);
    const [loading, setLoading] = useState(true);
    const [showDonationModal, setShowDonationModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<SponsorshipPlan | null>(null);
    const [activeTab, setActiveTab] = useState<'feed' | 'sponsorship' | 'reports'>('feed');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            // Load sample data
            const sampleContent: SharedContent[] = [
                {
                    id: 'content-1',
                    type: 'testimony',
                    title: 'Mi testimonio de esta semana',
                    content: 'Esta semana he visto milagros increíbles en el servicio. El Espíritu ha guiado cada enseñanza y he sentido el amor de Dios por Sus hijos. Cada día es una oportunidad de servir y crecer espiritualmente.',
                    publishedAt: '2024-09-25T16:00:00Z',
                    status: 'published',
                    blurFaces: false,
                    createdAt: '2024-09-25T15:30:00Z'
                },
                {
                    id: 'content-2',
                    type: 'achievement',
                    title: 'Primer bautismo en el área',
                    content: 'Hoy fue un día histórico. Carlos González tomó la decisión de seguir a Cristo y fue bautizado. Su familia también está progresando y esperamos más bautismos pronto.',
                    publishedAt: '2024-09-20T18:00:00Z',
                    status: 'published',
                    blurFaces: true,
                    createdAt: '2024-09-20T17:45:00Z'
                },
                {
                    id: 'content-3',
                    type: 'weekly_digest',
                    title: 'Resumen Semanal - Semana 38',
                    content: 'Esta semana completamos 12 enseñanzas, tuvimos 2 bautismos y realizamos 8 horas de servicio comunitario. El área está progresando mucho y vemos el Espíritu trabajando en las vidas de las personas.',
                    publishedAt: '2024-09-15T10:00:00Z',
                    status: 'published',
                    blurFaces: false,
                    createdAt: '2024-09-15T09:30:00Z'
                },
                {
                    id: 'content-4',
                    type: 'photo',
                    title: 'Servicio en el barrio',
                    content: 'Participamos en un proyecto de servicio comunitario organizado por el barrio. Fue una experiencia maravillosa ver cómo la comunidad se une para ayudar a los necesitados.',
                    imageUrl: '/api/placeholder/400/300',
                    publishedAt: '2024-09-10T14:00:00Z',
                    status: 'published',
                    blurFaces: true,
                    createdAt: '2024-09-10T13:30:00Z'
                }
            ];

            const sampleViewerAccess: ViewerAccess = {
                id: 'viewer-1',
                accessCode: 'FAM-2024-001',
                missionaryName: 'Elder Smith',
                missionaryEmail: 'elder.smith@mission.org',
                relationship: 'family',
                status: 'active',
                lastAccess: '2024-09-25T16:00:00Z',
                totalViews: 45
            };

            const samplePlans: SponsorshipPlan[] = [
                {
                    id: 'plan-family',
                    name: 'Plan Familiar',
                    price: 5,
                    currency: 'USD',
                    interval: 'month',
                    features: [
                        'Acceso completo al feed',
                        'Notificaciones de actualizaciones',
                        'Reportes mensuales',
                        'Soporte prioritario'
                    ],
                    stripePriceId: 'price_family_monthly'
                },
                {
                    id: 'plan-bronze',
                    name: 'Bronce',
                    price: 25,
                    currency: 'USD',
                    interval: 'month',
                    features: [
                        'Todo del Plan Familiar',
                        'Acceso a fotos exclusivas',
                        'Reportes semanales',
                        'Mensajes personalizados'
                    ],
                    stripePriceId: 'price_bronze_monthly'
                },
                {
                    id: 'plan-silver',
                    name: 'Plata',
                    price: 50,
                    currency: 'USD',
                    interval: 'month',
                    features: [
                        'Todo del Plan Bronce',
                        'Videos exclusivos',
                        'Reportes diarios',
                        'Llamadas mensuales'
                    ],
                    stripePriceId: 'price_silver_monthly'
                },
                {
                    id: 'plan-gold',
                    name: 'Oro',
                    price: 99,
                    currency: 'USD',
                    interval: 'month',
                    features: [
                        'Todo del Plan Plata',
                        'Contenido premium',
                        'Reportes en tiempo real',
                        'Acceso VIP'
                    ],
                    stripePriceId: 'price_gold_monthly'
                }
            ];

            const sampleDonations: Donation[] = [
                {
                    id: 'donation-1',
                    amount: 25,
                    currency: 'USD',
                    status: 'completed',
                    createdAt: '2024-09-01T10:00:00Z',
                    type: 'subscription',
                    planId: 'plan-bronze'
                },
                {
                    id: 'donation-2',
                    amount: 50,
                    currency: 'USD',
                    status: 'completed',
                    createdAt: '2024-08-01T10:00:00Z',
                    type: 'subscription',
                    planId: 'plan-bronze'
                },
                {
                    id: 'donation-3',
                    amount: 100,
                    currency: 'USD',
                    status: 'completed',
                    createdAt: '2024-07-15T14:30:00Z',
                    type: 'one_time'
                }
            ];

            setSharedContent(sampleContent);
            setViewerAccess(sampleViewerAccess);
            setSponsorshipPlans(samplePlans);
            setDonations(sampleDonations);

            // Try to load from Firebase
            try {
                const [contentSnapshot, viewerSnapshot, plansSnapshot, donationsSnapshot] = await Promise.all([
                    db.collection('shared_feed').where('status', '==', 'published').orderBy('publishedAt', 'desc').get(),
                    db.collection('viewers').doc('current').get(),
                    db.collection('sponsorship_plans').get(),
                    db.collection('donations').orderBy('createdAt', 'desc').get()
                ]);

                if (contentSnapshot.docs.length > 0) {
                    const contentData = contentSnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    })) as SharedContent[];
                    setSharedContent(contentData);
                }

                if (viewerSnapshot.exists()) {
                    const viewerData = viewerSnapshot.data() as ViewerAccess;
                    setViewerAccess(viewerData);
                }

                if (plansSnapshot.docs.length > 0) {
                    const plansData = plansSnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    })) as SponsorshipPlan[];
                    setSponsorshipPlans(plansData);
                }

                if (donationsSnapshot.docs.length > 0) {
                    const donationsData = donationsSnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    })) as Donation[];
                    setDonations(donationsData);
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

    const handleDonation = async (plan: SponsorshipPlan) => {
        try {
            // Simulate Stripe checkout
            console.log('Redirecting to Stripe checkout for plan:', plan.name);

            // In a real implementation, this would redirect to Stripe Checkout
            // For now, we'll simulate a successful donation
            const newDonation: Donation = {
                id: `donation-${Date.now()}`,
                amount: plan.price,
                currency: plan.currency,
                status: 'completed',
                createdAt: new Date().toISOString(),
                type: plan.interval === 'month' ? 'subscription' : 'one_time',
                planId: plan.id
            };

            setDonations([newDonation, ...donations]);
            setShowDonationModal(false);
            showNotification(`¡Gracias por tu apoyo con el plan ${plan.name}!`, 'success');
        } catch (error) {
            console.error('Error processing donation:', error);
            showNotification('Error al procesar la donación', 'error');
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

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'photo': return 'fa-solid fa-camera';
            case 'testimony': return 'fa-solid fa-heart';
            case 'achievement': return 'fa-solid fa-trophy';
            case 'weekly_digest': return 'fa-solid fa-calendar-week';
            default: return 'fa-solid fa-question';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'photo': return 'text-blue-600';
            case 'testimony': return 'text-red-600';
            case 'achievement': return 'text-yellow-600';
            case 'weekly_digest': return 'text-green-600';
            default: return 'text-gray-600';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'failed': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const totalDonated = donations.filter(d => d.status === 'completed').reduce((sum, d) => sum + d.amount, 0);
    const activeSubscription = donations.find(d => d.status === 'completed' && d.type === 'subscription');

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
                        ))}
                    </div>
                    <div className="h-96 bg-gray-200 rounded-lg"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                                <i className="fa-solid fa-heart text-white"></i>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-800">Portal Familiar</h1>
                                <p className="text-sm text-gray-600">{viewerAccess?.missionaryName}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <p className="text-sm text-gray-600">Total donado</p>
                                <p className="text-lg font-bold text-primary">${totalDonated}</p>
                            </div>
                            {activeSubscription && (
                                <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                    Patrocinador Activo
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex space-x-8">
                        {[
                            { id: 'feed', label: 'Feed', icon: 'fa-rss' },
                            { id: 'sponsorship', label: 'Patrocinio', icon: 'fa-handshake' },
                            { id: 'reports', label: 'Reportes', icon: 'fa-chart-line' }
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
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Feed Tab */}
                {activeTab === 'feed' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-800">Feed de Progreso</h2>
                            <div className="text-sm text-gray-600">
                                Última actualización: {new Date().toLocaleDateString('es-ES')}
                            </div>
                        </div>

                        <div className="space-y-6">
                            {sharedContent.map(content => (
                                <div key={content.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getTypeColor(content.type)}`}>
                                            <i className={`${getTypeIcon(content.type)} text-lg`}></i>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-800">{content.title}</h3>
                                            <p className="text-sm text-gray-600">
                                                {new Date(content.publishedAt).toLocaleDateString('es-ES', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                        {content.blurFaces && (
                                            <div className="ml-auto">
                                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                                                    <i className="fa-solid fa-eye-slash mr-1"></i>
                                                    Privacidad protegida
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-4">
                                        <p className="text-gray-700 leading-relaxed">{content.content}</p>
                                    </div>

                                    {content.imageUrl && (
                                        <div className="mb-4">
                                            <img
                                                src={content.imageUrl}
                                                alt={content.title}
                                                className="w-full h-64 object-cover rounded-lg"
                                                style={{ filter: content.blurFaces ? 'blur(8px)' : 'none' }}
                                            />
                                            {content.blurFaces && (
                                                <p className="text-xs text-gray-500 mt-2 text-center">
                                                    <i className="fa-solid fa-shield-alt mr-1"></i>
                                                    Caras difuminadas para proteger la privacidad
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <div className="flex items-center space-x-4">
                                            <span className="capitalize">{content.type.replace('_', ' ')}</span>
                                            <span>•</span>
                                            <span>Publicado hace {Math.floor((Date.now() - new Date(content.publishedAt).getTime()) / (1000 * 60 * 60 * 24))} días</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button className="text-gray-400 hover:text-gray-600">
                                                <i className="fa-solid fa-heart"></i>
                                            </button>
                                            <button className="text-gray-400 hover:text-gray-600">
                                                <i className="fa-solid fa-share"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Sponsorship Tab */}
                {activeTab === 'sponsorship' && (
                    <div className="space-y-6">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Apoya la Misión</h2>
                            <p className="text-gray-600">Tu apoyo hace posible que {viewerAccess?.missionaryName} continúe sirviendo</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {sponsorshipPlans.map(plan => (
                                <div key={plan.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative">
                                    {plan.name === 'Oro' && (
                                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                            <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                                                Más Popular
                                            </span>
                                        </div>
                                    )}

                                    <div className="text-center mb-6">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{plan.name}</h3>
                                        <div className="text-3xl font-bold text-primary mb-1">
                                            ${plan.price}
                                            <span className="text-sm font-normal text-gray-600">/{plan.interval === 'month' ? 'mes' : 'año'}</span>
                                        </div>
                                        <p className="text-sm text-gray-600">Patrocinio continuo</p>
                                    </div>

                                    <ul className="space-y-3 mb-6">
                                        {plan.features.map((feature, index) => (
                                            <li key={index} className="flex items-center text-sm text-gray-700">
                                                <i className="fa-solid fa-check text-green-500 mr-3"></i>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    <button
                                        onClick={() => {
                                            setSelectedPlan(plan);
                                            setShowDonationModal(true);
                                        }}
                                        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${plan.name === 'Oro'
                                                ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                                                : 'bg-primary text-white hover:bg-primary/90'
                                            }`}
                                    >
                                        Seleccionar Plan
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Donación Única</h3>
                            <p className="text-gray-600 mb-4">¿Prefieres hacer una donación única en lugar de un patrocinio mensual?</p>
                            <div className="flex space-x-4">
                                {[25, 50, 100, 200].map(amount => (
                                    <button
                                        key={amount}
                                        onClick={() => {
                                            const oneTimeDonation: Donation = {
                                                id: `donation-${Date.now()}`,
                                                amount,
                                                currency: 'USD',
                                                status: 'completed',
                                                createdAt: new Date().toISOString(),
                                                type: 'one_time'
                                            };
                                            setDonations([oneTimeDonation, ...donations]);
                                            showNotification(`¡Gracias por tu donación de $${amount}!`, 'success');
                                        }}
                                        className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        ${amount}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Historial de Donaciones</h3>
                            <div className="space-y-3">
                                {donations.map(donation => (
                                    <div key={donation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-800">${donation.amount} {donation.currency}</p>
                                            <p className="text-sm text-gray-600">
                                                {donation.type === 'subscription' ? 'Patrocinio' : 'Donación única'}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(donation.status)}`}>
                                                {donation.status === 'completed' ? 'Completado' :
                                                    donation.status === 'pending' ? 'Pendiente' : 'Fallido'}
                                            </span>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {new Date(donation.createdAt).toLocaleDateString('es-ES')}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Reports Tab */}
                {activeTab === 'reports' && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-800">Reportes de Impacto</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Total Donado</p>
                                        <p className="text-2xl font-bold text-gray-800">${totalDonated}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                        <i className="fa-solid fa-dollar-sign text-green-600 text-xl"></i>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Donaciones</p>
                                        <p className="text-2xl font-bold text-gray-800">{donations.length}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <i className="fa-solid fa-chart-bar text-blue-600 text-xl"></i>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Meses Activo</p>
                                        <p className="text-2xl font-bold text-gray-800">3</p>
                                    </div>
                                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <i className="fa-solid fa-calendar text-purple-600 text-xl"></i>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Impacto de tu Apoyo</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-medium text-gray-800 mb-3">Actividades Apoyadas</h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">Enseñanzas</span>
                                            <span className="font-medium">127</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">Bautismos</span>
                                            <span className="font-medium">3</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">Horas de Servicio</span>
                                            <span className="font-medium">45</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">Personas Contactadas</span>
                                            <span className="font-medium">89</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-800 mb-3">Recursos Proporcionados</h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">Materiales de Enseñanza</span>
                                            <span className="font-medium">$150</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">Transporte</span>
                                            <span className="font-medium">$200</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">Comunicación</span>
                                            <span className="font-medium">$50</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">Otros Gastos</span>
                                            <span className="font-medium">$100</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Reporte Mensual</h3>
                            <p className="text-gray-600 mb-4">
                                Descarga el reporte mensual completo con estadísticas detalladas del progreso misional.
                            </p>
                            <button className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">
                                <i className="fa-solid fa-download mr-2"></i>
                                Descargar Reporte PDF
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Donation Modal */}
            {showDonationModal && selectedPlan && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-800">Confirmar Patrocinio</h3>
                                <button
                                    onClick={() => setShowDonationModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <i className="fa-solid fa-times text-xl"></i>
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="text-center">
                                <h4 className="text-xl font-semibold text-gray-800 mb-2">{selectedPlan.name}</h4>
                                <div className="text-3xl font-bold text-primary mb-2">
                                    ${selectedPlan.price}
                                    <span className="text-sm font-normal text-gray-600">/{selectedPlan.interval === 'month' ? 'mes' : 'año'}</span>
                                </div>
                                <p className="text-gray-600">Patrocinio continuo</p>
                            </div>

                            <div className="bg-blue-50 rounded-lg p-4">
                                <div className="flex items-center space-x-2 mb-2">
                                    <i className="fa-solid fa-info-circle text-blue-600"></i>
                                    <span className="font-medium text-blue-800">Información</span>
                                </div>
                                <p className="text-sm text-blue-700">
                                    Serás redirigido a Stripe para completar el pago de forma segura.
                                    Puedes cancelar tu patrocinio en cualquier momento.
                                </p>
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setShowDonationModal(false)}
                                    className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={() => handleDonation(selectedPlan)}
                                    className="flex-1 bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors"
                                >
                                    Proceder al Pago
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
