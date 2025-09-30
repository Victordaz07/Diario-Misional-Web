'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useTranslations } from '@/lib/use-translations';
import { db } from '@/lib/firebase';
import { convertFirebaseDate } from '@/lib/utils';
import Link from 'next/link';

interface MissionStats {
    monthsInService: number;
    teachings: number;
    baptisms: number;
    transfers: number;
    teachingHours: number;
    commitmentsFulfilled: number;
    investigators: number;
    companions: number;
}

interface RecentActivity {
    id: string;
    type: 'diary' | 'photo' | 'transfer' | 'teaching';
    title: string;
    description: string;
    date: Date;
    icon: string;
    color: string;
}

interface QuickAction {
    title: string;
    description: string;
    icon: string;
    color: string;
    href: string;
}

interface ScheduleItem {
    id: string;
    time: string;
    activity: string;
    description: string;
    status: 'completed' | 'pending' | 'upcoming';
}

interface Investigator {
    id: string;
    name: string;
    type: string;
    progress: string;
    nextAppointment: string;
    progressPercent: number;
}

export default function DashboardPage() {
    const { user } = useAuth();
    const { t, language } = useTranslations();
    const [missionStats, setMissionStats] = useState<MissionStats>({
        monthsInService: 8,
        teachings: 127,
        baptisms: 3,
        transfers: 2,
        teachingHours: 45,
        commitmentsFulfilled: 92,
        investigators: 8,
        companions: 3
    });
    const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
    const [todaySchedule, setTodaySchedule] = useState<ScheduleItem[]>([]);
    const [investigators, setInvestigators] = useState<Investigator[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());

    // Estados para formularios
    const [showAppointmentModal, setShowAppointmentModal] = useState(false);
    const [showInvestigatorModal, setShowInvestigatorModal] = useState(false);
    const [showDiaryModal, setShowDiaryModal] = useState(false);
    const [showSpiritualModal, setShowSpiritualModal] = useState(false);

    // Datos de formularios
    const [appointmentData, setAppointmentData] = useState({
        time: '',
        activity: '',
        description: ''
    });
    const [investigatorData, setInvestigatorData] = useState({
        name: '',
        type: 'Lecciones',
        progress: '',
        nextAppointment: ''
    });
    const [diaryData, setDiaryData] = useState({
        content: ''
    });
    const [spiritualData, setSpiritualData] = useState({
        content: ''
    });

    const quickActions: QuickAction[] = [
        {
            title: t('newEntry'),
            description: t('recordDailyExperience'),
            icon: 'fa-solid fa-book-open',
            color: 'bg-blue-500',
            href: '/diario'
        },
        {
            title: t('uploadPhotos'),
            description: t('shareMemories'),
            icon: 'fa-solid fa-camera',
            color: 'bg-green-500',
            href: '/fotos'
        },
        {
            title: t('viewResources'),
            description: t('accessMaterials'),
            icon: 'fa-solid fa-folder',
            color: 'bg-purple-500',
            href: '/recursos'
        },
        {
            title: t('myProfile'),
            description: t('updateInformation'),
            icon: 'fa-solid fa-user',
            color: 'bg-orange-500',
            href: '/perfil'
        }
    ];

    // Actualizar hora cada minuto
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);
        return () => clearInterval(timer);
    }, []);

    // Cargar datos del dashboard
    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);

            // Cargar estadísticas de misión
            const statsSnapshot = await db.collection('missionStats').doc('current').get();
            if (statsSnapshot.exists()) {
                setMissionStats(statsSnapshot.data() as MissionStats);
            } else {
                // Si no hay datos en Firebase, mantener los datos por defecto
                console.log('No mission stats found in Firebase, using default values');
            }

            // Cargar actividades recientes
            const activitiesSnapshot = await db.collection('recentActivities').orderBy('date', 'desc').limit(5).get();
            const activitiesData = activitiesSnapshot.docs.map((doc: any) => ({
                id: doc.id,
                ...doc.data(),
                date: convertFirebaseDate(doc.data().date)
            })) as RecentActivity[];

            setRecentActivities(activitiesData);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            // Cargar datos de ejemplo si hay error
            loadSampleData();
        } finally {
            setLoading(false);
        }
    };

    const loadSampleData = () => {
        const sampleActivities: RecentActivity[] = [
            {
                id: '1',
                type: 'diary',
                title: 'Experiencia con la familia González',
                description: 'Enseñanza sobre la familia eterna',
                date: new Date(Date.now() - 2 * 60 * 60 * 1000),
                icon: 'fa-solid fa-book-open',
                color: 'text-blue-600'
            },
            {
                id: '2',
                type: 'photo',
                title: 'Fotos del servicio comunitario',
                description: '3 fotos subidas',
                date: new Date(Date.now() - 4 * 60 * 60 * 1000),
                icon: 'fa-solid fa-camera',
                color: 'text-green-600'
            },
            {
                id: '3',
                type: 'teaching',
                title: 'Lección con Carlos',
                description: 'Primera lección sobre el Plan de Salvación',
                date: new Date(Date.now() - 6 * 60 * 60 * 1000),
                icon: 'fa-solid fa-chalkboard-teacher',
                color: 'text-purple-600'
            }
        ];
        setRecentActivities(sampleActivities);

        const sampleSchedule: ScheduleItem[] = [
            {
                id: '1',
                time: '09:00',
                activity: 'Estudio Personal',
                description: 'Lectura de las escrituras',
                status: 'completed'
            },
            {
                id: '2',
                time: '10:30',
                activity: 'Cita con Familia López',
                description: 'Segunda lección',
                status: 'pending'
            },
            {
                id: '3',
                time: '15:00',
                activity: 'Servicio Comunitario',
                description: 'Ayuda en el hogar de ancianos',
                status: 'upcoming'
            }
        ];
        setTodaySchedule(sampleSchedule);

        const sampleInvestigators: Investigator[] = [
            {
                id: '1',
                name: 'Carlos Martínez',
                type: 'Lecciones',
                progress: 'Lección 3 de 5',
                nextAppointment: 'Mañana 10:30',
                progressPercent: 60
            },
            {
                id: '2',
                name: 'Familia López',
                type: 'Fecha de bautismo',
                progress: 'Preparación',
                nextAppointment: 'Hoy 10:30',
                progressPercent: 80
            }
        ];
        setInvestigators(sampleInvestigators);
    };

    const getGreeting = () => {
        const hour = currentTime.getHours();
        if (hour < 12) return 'Buenos días';
        if (hour < 18) return 'Buenas tardes';
        return 'Buenas noches';
    };

    const formatTime = (date: Date) => {
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

        if (diffInHours < 1) return 'Hace unos minutos';
        if (diffInHours < 24) return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;

        const diffInDays = Math.floor(diffInHours / 24);
        return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
    };

    const getProgressPercentage = (current: number, target: number) => {
        return Math.min((current / target) * 100, 100);
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return <i className="fa-solid fa-check-circle text-green-600"></i>;
            case 'pending':
                return <div className="w-3 h-3 bg-blue-500 rounded-full"></div>;
            default:
                return <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>;
        }
    };

    const getStatusBg = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-50 border-l-4 border-green-500';
            case 'pending':
                return 'bg-blue-50 border-l-4 border-blue-500';
            default:
                return 'bg-yellow-50 border-l-4 border-yellow-500';
        }
    };

    // Funciones para manejar formularios
    const handleAddAppointment = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const newAppointment: ScheduleItem = {
                id: `appointment-${Date.now()}`,
                time: appointmentData.time,
                activity: appointmentData.activity,
                description: appointmentData.description,
                status: 'pending'
            };

            await db.collection('schedule').add(newAppointment);
            setTodaySchedule([...todaySchedule, newAppointment]);
            setShowAppointmentModal(false);
            setAppointmentData({ time: '', activity: '', description: '' });

            // Agregar a actividades recientes
            const newActivity: RecentActivity = {
                id: `activity-${Date.now()}`,
                type: 'teaching',
                title: `Nueva cita: ${appointmentData.activity}`,
                description: appointmentData.description,
                date: new Date(),
                icon: 'fa-solid fa-calendar-plus',
                color: 'text-blue-600'
            };
            setRecentActivities([newActivity, ...recentActivities.slice(0, 4)]);
        } catch (error) {
            console.error('Error adding appointment:', error);
        }
    };

    const handleAddInvestigator = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const newInvestigator: Investigator = {
                id: `investigator-${Date.now()}`,
                name: investigatorData.name,
                type: investigatorData.type,
                progress: investigatorData.progress,
                nextAppointment: investigatorData.nextAppointment,
                progressPercent: investigatorData.type === 'Lecciones' ? 20 : 50
            };

            await db.collection('investigators').add(newInvestigator);
            setInvestigators([...investigators, newInvestigator]);
            setShowInvestigatorModal(false);
            setInvestigatorData({ name: '', type: 'Lecciones', progress: '', nextAppointment: '' });

            // Actualizar estadísticas
            setMissionStats(prev => ({ ...prev, investigators: prev.investigators + 1 }));
        } catch (error) {
            console.error('Error adding investigator:', error);
        }
    };

    const handleSaveDiaryEntry = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const diaryEntry = {
                content: diaryData.content,
                date: new Date(),
                type: 'diary'
            };

            await db.collection('diary').add(diaryEntry);
            setShowDiaryModal(false);
            setDiaryData({ content: '' });

            // Agregar a actividades recientes
            const newActivity: RecentActivity = {
                id: `activity-${Date.now()}`,
                type: 'diary',
                title: 'Nueva entrada del diario',
                description: diaryData.content.substring(0, 50) + '...',
                date: new Date(),
                icon: 'fa-solid fa-book-open',
                color: 'text-blue-600'
            };
            setRecentActivities([newActivity, ...recentActivities.slice(0, 4)]);
        } catch (error) {
            console.error('Error saving diary entry:', error);
        }
    };

    const handleSaveSpiritualMoment = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const spiritualMoment = {
                content: spiritualData.content,
                date: new Date(),
                type: 'spiritual'
            };

            await db.collection('spiritualMoments').add(spiritualMoment);
            setShowSpiritualModal(false);
            setSpiritualData({ content: '' });

            // Agregar a actividades recientes
            const newActivity: RecentActivity = {
                id: `activity-${Date.now()}`,
                type: 'diary',
                title: 'Momento espiritual registrado',
                description: spiritualData.content.substring(0, 50) + '...',
                date: new Date(),
                icon: 'fa-solid fa-heart',
                color: 'text-purple-600'
            };
            setRecentActivities([newActivity, ...recentActivities.slice(0, 4)]);
        } catch (error) {
            console.error('Error saving spiritual moment:', error);
        }
    };

    const updateAppointmentStatus = (id: string, newStatus: string) => {
        setTodaySchedule(schedule =>
            schedule.map(item =>
                item.id === id ? { ...item, status: newStatus as any } : item
            )
        );
    };

    return (
        <div className="p-4 space-y-6">
            {/* Welcome Section */}
            <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold mb-2">
                            {t('welcomeBack')}, {user?.displayName || 'Elder Smith'}!
                        </h1>
                        <p className="text-blue-100">
                            {currentTime.toLocaleDateString(language === 'es' ? 'es-ES' : language === 'en' ? 'en-US' : language === 'fr' ? 'fr-FR' : 'pt-BR', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                        <p className="text-blue-200 text-sm">
                            {currentTime.toLocaleTimeString(language === 'es' ? 'es-ES' : language === 'en' ? 'en-US' : language === 'fr' ? 'fr-FR' : 'pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-bold">{missionStats.monthsInService}</div>
                        <div className="text-blue-200 text-sm">{t('monthsInService')}</div>
                    </div>
                </div>
            </section>

            {/* Mission Stats */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <i className="fa-solid fa-chalkboard-teacher text-blue-600"></i>
                        </div>
                        <span className="text-xs text-gray-500">Esta semana</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-800 mb-1">{missionStats.teachings}</div>
                    <div className="text-sm text-gray-600">{t('teachings')}</div>
                    <div className="mt-2 bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${getProgressPercentage(missionStats.teachings, 20)}%` }}
                        ></div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <i className="fa-solid fa-water text-green-600"></i>
                        </div>
                        <span className="text-xs text-gray-500">Total</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-800 mb-1">{missionStats.baptisms}</div>
                    <div className="text-sm text-gray-600">Bautismos</div>
                    <div className="mt-2 bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${getProgressPercentage(missionStats.baptisms, 5)}%` }}
                        ></div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <i className="fa-solid fa-users text-purple-600"></i>
                        </div>
                        <span className="text-xs text-gray-500">{t('active')}</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-800 mb-1">{missionStats.investigators}</div>
                    <div className="text-sm text-gray-600">{t('investigators')}</div>
                    <div className="mt-2 bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${getProgressPercentage(missionStats.investigators, 10)}%` }}
                        ></div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                            <i className="fa-solid fa-route text-orange-600"></i>
                        </div>
                        <span className="text-xs text-gray-500">Total</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-800 mb-1">{missionStats.transfers}</div>
                    <div className="text-sm text-gray-600">Traslados</div>
                    <div className="mt-2 bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${getProgressPercentage(missionStats.transfers, 4)}%` }}
                        ></div>
                    </div>
                </div>
            </section>

            {/* Quick Actions */}
            <section>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">{t('quickActions')}</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickActions.map((action, index) => (
                        <Link
                            key={index}
                            href={action.href}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer group"
                        >
                            <div className="flex items-center space-x-3">
                                <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                    <i className={`${action.icon} text-white`}></i>
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-800">{action.title}</h3>
                                    <p className="text-xs text-gray-500">{action.description}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Daily Schedule */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <i className="fa-solid fa-calendar-check text-blue-600"></i>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">{t('dailyAgenda')}</h3>
                    </div>
                    <button
                        onClick={() => setShowAppointmentModal(true)}
                        className="text-primary text-sm font-medium cursor-pointer"
                    >
                        {t('viewWeek')}
                    </button>
                </div>

                <div className="space-y-3">
                    {todaySchedule.length > 0 ? (
                        todaySchedule.map((item) => (
                            <div key={item.id} className={`flex items-center justify-between p-3 rounded-lg ${getStatusBg(item.status)}`}>
                                <div className="flex items-center space-x-3">
                                    <div className="text-center">
                                        <div className="text-xs text-gray-500">{item.time}</div>
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-800">{item.activity}</div>
                                        <div className="text-sm text-gray-600">{item.description}</div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => updateAppointmentStatus(item.id, item.status === 'completed' ? 'pending' : 'completed')}
                                    className="hover:bg-white/20 p-1 rounded cursor-pointer"
                                >
                                    {getStatusIcon(item.status)}
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <i className="fa-solid fa-calendar-plus text-4xl mb-2"></i>
                            <p>{t('noAppointmentsToday')}</p>
                        </div>
                    )}
                </div>

                <button
                    onClick={() => setShowAppointmentModal(true)}
                    className="w-full mt-4 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                >
                    <i className="fa-solid fa-plus"></i>
                    <span>{t('addAppointment')}</span>
                </button>
            </section>

            {/* Mission Diary */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <i className="fa-solid fa-book-open text-purple-600"></i>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">Mi Diario Misional</h3>
                </div>

                <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-gray-800">Entrada de Hoy</h4>
                            <span className="text-sm text-gray-500">{new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                        <textarea
                            value={diaryData.content}
                            onChange={(e) => setDiaryData({ ...diaryData, content: e.target.value })}
                            placeholder="¿Qué experiencias espirituales tuviste hoy?"
                            className="w-full p-3 border border-gray-300 rounded-lg text-sm resize-none h-24"
                        />
                        <div className="flex items-center justify-between mt-3">
                            <button className="flex items-center space-x-2 text-purple-600 text-sm">
                                <i className="fa-solid fa-microphone"></i>
                                <span>Grabar audio</span>
                            </button>
                            <button className="flex items-center space-x-2 text-purple-600 text-sm">
                                <i className="fa-solid fa-camera"></i>
                                <span>Añadir foto</span>
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowDiaryModal(true)}
                        className="w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                    >
                        <i className="fa-solid fa-star"></i>
                        <span>Destacar experiencia espiritual</span>
                    </button>
                </div>
            </section>

            {/* Investigators */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <i className="fa-solid fa-users text-indigo-600"></i>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">{t('investigators')} / {t('friends')}</h3>
                    </div>
                    <button className="text-indigo-600 text-sm font-medium cursor-pointer">{t('viewAll')}</button>
                </div>

                <div className="space-y-3">
                    {investigators.length > 0 ? (
                        investigators.map((investigator) => (
                            <div key={investigator.id} className="p-4 border border-gray-200 rounded-lg hover:border-indigo-500 transition-colors">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-medium text-gray-800">{investigator.name}</h4>
                                    <span className={`text-xs px-2 py-1 rounded-full ${investigator.type === 'Lecciones' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                                        {investigator.type}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-600 mb-3">
                                    <div className="flex justify-between">
                                        <span>Progreso:</span>
                                        <span>{investigator.progress}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Próxima cita:</span>
                                        <span className="font-medium">{investigator.nextAppointment}</span>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full ${investigator.type === 'Lecciones' ? 'bg-blue-600' : 'bg-green-600'}`}
                                            style={{ width: `${investigator.progressPercent}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-xs text-gray-500">{investigator.progressPercent}%</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <i className="fa-solid fa-users text-4xl mb-2"></i>
                            <p>No hay investigadores registrados</p>
                        </div>
                    )}
                </div>

                <button
                    onClick={() => setShowInvestigatorModal(true)}
                    className="w-full mt-4 bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                >
                    <i className="fa-solid fa-plus"></i>
                    <span>Añadir nuevo investigador</span>
                </button>
            </section>

            {/* Recent Activities */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">Actividad Reciente</h2>
                    <Link href="/diario" className="text-primary hover:text-primary/80 text-sm font-medium">
                        Ver todo
                    </Link>
                </div>

                {loading ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                            <p className="text-sm text-gray-500 mt-2">Cargando actividades...</p>
                        </div>
                    </div>
                ) : recentActivities.length > 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="p-4 space-y-3">
                            {recentActivities.map((activity) => (
                                <div key={activity.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className={`w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center`}>
                                        <i className={`${activity.icon} ${activity.color} text-sm`}></i>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-medium text-gray-800">{activity.title}</h4>
                                        <p className="text-xs text-gray-500">{activity.description}</p>
                                    </div>
                                    <span className="text-xs text-gray-400">{formatTime(activity.date)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="text-center">
                            <i className="fa-solid fa-clock text-4xl text-gray-400 mb-4"></i>
                            <h3 className="text-lg font-medium text-gray-600 mb-2">No hay actividad reciente</h3>
                            <p className="text-gray-500 mb-4">Comienza a usar la aplicación para ver tu actividad aquí</p>
                            <Link
                                href="/diario"
                                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
                            >
                                Crear primera entrada
                            </Link>
                        </div>
                    </div>
                )}
            </section>

            {/* Mission Progress */}
            <section>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Progreso Misional</h2>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <i className="fa-solid fa-chart-line text-blue-600"></i>
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-800">Compromisos Cumplidos</h3>
                                    <p className="text-sm text-gray-500">Objetivo: 100%</p>
                                </div>
                            </div>
                            <span className="text-lg font-bold text-gray-800">{missionStats.commitmentsFulfilled}%</span>
                        </div>
                        <div className="bg-gray-200 rounded-full h-3">
                            <div
                                className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
                                style={{ width: `${missionStats.commitmentsFulfilled}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">{missionStats.teachingHours}</div>
                            <div className="text-sm text-gray-600">Horas de enseñanza</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">{missionStats.companions}</div>
                            <div className="text-sm text-gray-600">Compañeros</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Motivational Quote */}
            <section className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white text-center">
                <div className="max-w-2xl mx-auto">
                    <i className="fa-solid fa-quote-left text-2xl mb-4 opacity-50"></i>
                    <blockquote className="text-lg font-medium mb-4">
                        "La obra misional es una obra de amor, y no puede ser realizada sin amor."
                    </blockquote>
                    <cite className="text-purple-200 text-sm">- Presidente Thomas S. Monson</cite>
                </div>
            </section>

            {/* Modals */}
            {/* Appointment Modal */}
            {showAppointmentModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl w-full max-w-md">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800">Nueva Cita</h3>
                        </div>
                        <form onSubmit={handleAddAppointment} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Hora</label>
                                <input
                                    type="time"
                                    value={appointmentData.time}
                                    onChange={(e) => setAppointmentData({ ...appointmentData, time: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Actividad</label>
                                <input
                                    type="text"
                                    value={appointmentData.activity}
                                    onChange={(e) => setAppointmentData({ ...appointmentData, activity: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="Ej: Cita con familia López"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                                <textarea
                                    value={appointmentData.description}
                                    onChange={(e) => setAppointmentData({ ...appointmentData, description: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="Detalles de la cita..."
                                    rows={3}
                                />
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowAppointmentModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
                                >
                                    Guardar Cita
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Investigator Modal */}
            {showInvestigatorModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl w-full max-w-md">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800">Nuevo Investigador</h3>
                        </div>
                        <form onSubmit={handleAddInvestigator} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                                <input
                                    type="text"
                                    value={investigatorData.name}
                                    onChange={(e) => setInvestigatorData({ ...investigatorData, name: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="Ej: Carlos Martínez"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                                <select
                                    value={investigatorData.type}
                                    onChange={(e) => setInvestigatorData({ ...investigatorData, type: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="Lecciones">Lecciones</option>
                                    <option value="Fecha de bautismo">Fecha de bautismo</option>
                                    <option value="Miembro">Miembro</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Progreso</label>
                                <input
                                    type="text"
                                    value={investigatorData.progress}
                                    onChange={(e) => setInvestigatorData({ ...investigatorData, progress: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="Ej: Lección 2 de 5"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Próxima Cita</label>
                                <input
                                    type="text"
                                    value={investigatorData.nextAppointment}
                                    onChange={(e) => setInvestigatorData({ ...investigatorData, nextAppointment: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="Ej: Mañana 10:30"
                                />
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowInvestigatorModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
                                >
                                    Guardar Investigador
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Diary Modal */}
            {showDiaryModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl w-full max-w-md">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800">Experiencia Espiritual</h3>
                        </div>
                        <form onSubmit={handleSaveDiaryEntry} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                                <textarea
                                    value={diaryData.content}
                                    onChange={(e) => setDiaryData({ ...diaryData, content: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="Comparte tu experiencia espiritual..."
                                    rows={4}
                                    required
                                />
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowDiaryModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
                                >
                                    Guardar Experiencia
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Spiritual Moment Modal */}
            {showSpiritualModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl w-full max-w-md">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800">Momento Espiritual</h3>
                        </div>
                        <form onSubmit={handleSaveSpiritualMoment} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                                <textarea
                                    value={spiritualData.content}
                                    onChange={(e) => setSpiritualData({ ...spiritualData, content: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="Registra tu momento espiritual..."
                                    rows={4}
                                    required
                                />
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowSpiritualModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
                                >
                                    Guardar Momento
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}