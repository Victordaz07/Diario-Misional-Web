// app/(dashboard)/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { analyticsService, AnalyticsEvent, UserMetrics, MissionaryMetrics, SponsorshipMetrics } from '@/lib/analytics-service';
import { notificationsService } from '@/lib/notifications-service';
import { realtimeService } from '@/lib/realtime-service';

export default function AdminPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'analytics' | 'notifications' | 'realtime'>('overview');

    // Estados para métricas
    const [userMetrics, setUserMetrics] = useState<UserMetrics[]>([]);
    const [missionaryMetrics, setMissionaryMetrics] = useState<MissionaryMetrics[]>([]);
    const [sponsorshipMetrics, setSponsorshipMetrics] = useState<SponsorshipMetrics | null>(null);
    const [recentEvents, setRecentEvents] = useState<AnalyticsEvent[]>([]);
    const [pageStats, setPageStats] = useState<Record<string, number>>({});
    const [featureStats, setFeatureStats] = useState<Record<string, number>>({});
    const [connectionStats, setConnectionStats] = useState(realtimeService.getConnectionStats());

    useEffect(() => {
        const loadAdminData = async () => {
            setLoading(true);
            try {
                // Cargar métricas de patrocinio
                const sponsorship = await analyticsService.getSponsorshipMetrics();
                setSponsorshipMetrics(sponsorship);

                // Cargar estadísticas de páginas y funcionalidades
                const pages = await analyticsService.getPageStats();
                const features = await analyticsService.getFeatureStats();
                setPageStats(pages);
                setFeatureStats(features);

                // Cargar eventos recientes
                const events = await analyticsService.getRecentEvents(user?.uid || 'demo', 20);
                setRecentEvents(events);

                // Actualizar estadísticas de conexiones en tiempo real
                setConnectionStats(realtimeService.getConnectionStats());

            } catch (error) {
                console.error('Error loading admin data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadAdminData();

        // Actualizar estadísticas cada 30 segundos
        const interval = setInterval(() => {
            setConnectionStats(realtimeService.getConnectionStats());
        }, 30000);

        return () => clearInterval(interval);
    }, [user]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full min-h-screen">
                <i className="fa-solid fa-spinner fa-spin text-4xl text-primary"></i>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Administración</h1>
                <p className="text-gray-600">Métricas y estadísticas del sistema</p>
            </div>

            {/* Navigation Tabs */}
            <div className="mb-6 border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {[
                        { id: 'overview', name: 'Resumen', icon: 'fa-solid fa-chart-pie' },
                        { id: 'users', name: 'Usuarios', icon: 'fa-solid fa-users' },
                        { id: 'analytics', name: 'Analytics', icon: 'fa-solid fa-chart-line' },
                        { id: 'notifications', name: 'Notificaciones', icon: 'fa-solid fa-bell' },
                        { id: 'realtime', name: 'Tiempo Real', icon: 'fa-solid fa-broadcast-tower' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`${activeTab === tab.id
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 flex items-center space-x-2`}
                        >
                            <i className={tab.icon}></i>
                            <span>{tab.name}</span>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div className="space-y-6">
                    {/* Key Metrics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Ingresos Totales</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        ${sponsorshipMetrics?.totalAmount || 0}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                    <i className="fa-solid fa-dollar-sign text-green-600 text-xl"></i>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Suscripciones Activas</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {sponsorshipMetrics?.activeSubscriptions || 0}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <i className="fa-solid fa-users text-blue-600 text-xl"></i>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">MRR</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        ${sponsorshipMetrics?.monthlyRecurringRevenue || 0}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <i className="fa-solid fa-chart-line text-purple-600 text-xl"></i>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Conexiones Activas</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {connectionStats.activeConnections}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                    <i className="fa-solid fa-wifi text-orange-600 text-xl"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Top Pages */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Páginas Más Visitadas</h3>
                            <div className="space-y-3">
                                {Object.entries(pageStats)
                                    .sort(([, a], [, b]) => b - a)
                                    .slice(0, 5)
                                    .map(([page, views]) => (
                                        <div key={page} className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600 capitalize">{page.replace(/_/g, ' ')}</span>
                                            <div className="flex items-center space-x-2">
                                                <div className="w-20 bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-primary h-2 rounded-full"
                                                        style={{ width: `${(views / Math.max(...Object.values(pageStats))) * 100}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-sm font-medium text-gray-900 w-8 text-right">{views}</span>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>

                        {/* Top Features */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Funcionalidades Más Usadas</h3>
                            <div className="space-y-3">
                                {Object.entries(featureStats)
                                    .sort(([, a], [, b]) => b - a)
                                    .slice(0, 5)
                                    .map(([feature, uses]) => (
                                        <div key={feature} className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600 capitalize">{feature.replace(/_/g, ' ')}</span>
                                            <div className="flex items-center space-x-2">
                                                <div className="w-20 bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-secondary h-2 rounded-full"
                                                        style={{ width: `${(uses / Math.max(...Object.values(featureStats))) * 100}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-sm font-medium text-gray-900 w-8 text-right">{uses}</span>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Estadísticas de Usuarios</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-primary mb-2">{connectionStats.totalConnections}</div>
                                <div className="text-sm text-gray-600">Conexiones Totales</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-green-600 mb-2">{connectionStats.activeConnections}</div>
                                <div className="text-sm text-gray-600">Usuarios Activos</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-blue-600 mb-2">{connectionStats.uniqueUsers}</div>
                                <div className="text-sm text-gray-600">Usuarios Únicos</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Eventos Recientes</h3>
                        <div className="space-y-3">
                            {recentEvents.slice(0, 10).map((event) => (
                                <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                                        <span className="text-sm font-medium text-gray-900">{event.eventType}</span>
                                        <span className="text-xs text-gray-500">{event.timestamp.toLocaleString()}</span>
                                    </div>
                                    <span className="text-xs text-gray-500">{event.userId}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Sistema de Notificaciones</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h4 className="font-medium text-gray-700">Tipos de Notificaciones</h4>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                                        <span className="text-sm text-green-800">Pagos Exitosos</span>
                                        <i className="fa-solid fa-check text-green-600"></i>
                                    </div>
                                    <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                                        <span className="text-sm text-red-800">Pagos Fallidos</span>
                                        <i className="fa-solid fa-times text-red-600"></i>
                                    </div>
                                    <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                                        <span className="text-sm text-blue-800">Nuevo Contenido</span>
                                        <i className="fa-solid fa-plus text-blue-600"></i>
                                    </div>
                                    <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                                        <span className="text-sm text-yellow-800">Actualizaciones de Patrocinio</span>
                                        <i className="fa-solid fa-sync text-yellow-600"></i>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h4 className="font-medium text-gray-700">Configuración</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Notificaciones Push</span>
                                        <div className="w-12 h-6 bg-primary rounded-full relative">
                                            <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Notificaciones Email</span>
                                        <div className="w-12 h-6 bg-primary rounded-full relative">
                                            <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Notificaciones In-App</span>
                                        <div className="w-12 h-6 bg-primary rounded-full relative">
                                            <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Realtime Tab */}
            {activeTab === 'realtime' && (
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Conexiones en Tiempo Real</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600 mb-2">{connectionStats.totalConnections}</div>
                                <div className="text-sm text-blue-800">Conexiones Totales</div>
                            </div>
                            <div className="text-center p-4 bg-green-50 rounded-lg">
                                <div className="text-2xl font-bold text-green-600 mb-2">{connectionStats.activeConnections}</div>
                                <div className="text-sm text-green-800">Conexiones Activas</div>
                            </div>
                            <div className="text-center p-4 bg-purple-50 rounded-lg">
                                <div className="text-2xl font-bold text-purple-600 mb-2">{connectionStats.uniqueUsers}</div>
                                <div className="text-sm text-purple-800">Usuarios Únicos</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Eventos en Tiempo Real</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-sm font-medium text-gray-900">diary_entry</span>
                                    <span className="text-xs text-gray-500">Hace 2 minutos</span>
                                </div>
                                <span className="text-xs text-gray-500">user_123</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                    <span className="text-sm font-medium text-gray-900">photo_upload</span>
                                    <span className="text-xs text-gray-500">Hace 5 minutos</span>
                                </div>
                                <span className="text-xs text-gray-500">user_456</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                                    <span className="text-sm font-medium text-gray-900">sponsorship_update</span>
                                    <span className="text-xs text-gray-500">Hace 8 minutos</span>
                                </div>
                                <span className="text-xs text-gray-500">user_789</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
