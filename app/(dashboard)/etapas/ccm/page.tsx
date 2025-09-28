'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useTranslations } from '@/lib/use-translations';
import Link from 'next/link';
import LanguageSelector from '@/components/language-selector';

interface CCMSchedule {
    id: string;
    title: string;
    time: string;
    duration: string;
    status: 'completed' | 'current' | 'upcoming';
    type: 'devotional' | 'language' | 'teaching' | 'study' | 'meal' | 'exercise';
}

interface SpiritualStudy {
    id: string;
    title: string;
    description: string;
    status: 'completed' | 'in-progress' | 'pending';
    progress?: string;
}

interface LanguagePractice {
    id: string;
    title: string;
    description: string;
    progress?: string;
    type: 'flashcards' | 'pronunciation' | 'challenge';
}

interface TeachingSimulation {
    id: string;
    title: string;
    description: string;
    status: 'completed' | 'in-progress' | 'pending';
}

interface CCMAchievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlocked: boolean;
    category: 'speech' | 'testimony' | 'study' | 'graduation';
}

const mockSchedule: CCMSchedule[] = [
    {
        id: '1',
        title: 'Devocional Matutino',
        time: '6:30 AM',
        duration: '6:30 AM - 7:00 AM',
        status: 'completed',
        type: 'devotional'
    },
    {
        id: '2',
        title: 'Clase de Idioma - Inglés',
        time: '9:00 AM',
        duration: '9:00 AM - 10:30 AM',
        status: 'current',
        type: 'language'
    },
    {
        id: '3',
        title: 'Práctica de Enseñanza',
        time: '2:00 PM',
        duration: '2:00 PM - 3:30 PM',
        status: 'upcoming',
        type: 'teaching'
    }
];

const mockSpiritualStudy: SpiritualStudy[] = [
    {
        id: '1',
        title: 'Libro de Mormón',
        description: '1 Nefi 3:7 - Capítulo completado',
        status: 'completed'
    },
    {
        id: '2',
        title: 'Doctrina y Convenios',
        description: 'Sección 4 - En progreso',
        status: 'in-progress',
        progress: '60%'
    },
    {
        id: '3',
        title: 'Predicad Mi Evangelio',
        description: 'Lección 1 - Pendiente',
        status: 'pending'
    }
];

const mockLanguagePractice: LanguagePractice[] = [
    {
        id: '1',
        title: 'Flashcards del Evangelio',
        description: 'Frases básicas para enseñar',
        progress: '15/25',
        type: 'flashcards'
    },
    {
        id: '2',
        title: 'Pronunciación',
        description: 'Repite después de mí',
        type: 'pronunciation'
    },
    {
        id: '3',
        title: 'Reto de Hoy',
        description: 'Explica la Primera Visión en 2 frases en inglés',
        type: 'challenge'
    }
];

const mockTeachingSimulations: TeachingSimulation[] = [
    {
        id: '1',
        title: 'Plan de Salvación',
        description: 'Lección 1',
        status: 'completed'
    },
    {
        id: '2',
        title: 'Fe en Cristo',
        description: 'Lección 2',
        status: 'in-progress'
    }
];

const mockAchievements: CCMAchievement[] = [
    {
        id: '1',
        title: 'Primer Discurso',
        description: 'En público',
        icon: 'fa-solid fa-medal',
        unlocked: true,
        category: 'speech'
    },
    {
        id: '2',
        title: 'Testimonio',
        description: 'En idioma de misión',
        icon: 'fa-solid fa-language',
        unlocked: true,
        category: 'testimony'
    },
    {
        id: '3',
        title: 'Semana Completa',
        description: 'De estudio',
        icon: 'fa-solid fa-book',
        unlocked: true,
        category: 'study'
    },
    {
        id: '4',
        title: 'Graduación CCM',
        description: 'Próximo logro',
        icon: 'fa-solid fa-graduation-cap',
        unlocked: false,
        category: 'graduation'
    }
];

export default function CCMStagePage() {
    const { user } = useAuth();
    const { t } = useTranslations();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [schedule] = useState<CCMSchedule[]>(mockSchedule);
    const [spiritualStudy] = useState<SpiritualStudy[]>(mockSpiritualStudy);
    const [languagePractice] = useState<LanguagePractice[]>(mockLanguagePractice);
    const [teachingSimulations] = useState<TeachingSimulation[]>(mockTeachingSimulations);
    const [achievements] = useState<CCMAchievement[]>(mockAchievements);
    const [gratitudeEntries, setGratitudeEntries] = useState(['', '', '']);
    const [selectedLanguage, setSelectedLanguage] = useState('Inglés');
    const [ccmProgress, setCcmProgress] = useState(45);
    const [currentWeek, setCurrentWeek] = useState(3);
    const [totalWeeks, setTotalWeeks] = useState(6);

    const getScheduleStatusColor = (status: CCMSchedule['status']) => {
        switch (status) {
            case 'completed':
                return 'bg-green-50 border-green-500';
            case 'current':
                return 'bg-blue-50 border-blue-500';
            case 'upcoming':
                return 'bg-purple-50 border-purple-500';
            default:
                return 'bg-gray-50 border-gray-500';
        }
    };

    const getScheduleStatusIcon = (status: CCMSchedule['status']) => {
        switch (status) {
            case 'completed':
                return 'fa-solid fa-check-circle text-green-600';
            case 'current':
                return 'w-3 h-3 bg-blue-500 rounded-full';
            case 'upcoming':
                return 'w-3 h-3 bg-purple-500 rounded-full';
            default:
                return 'w-3 h-3 bg-gray-500 rounded-full';
        }
    };

    const getStudyStatusColor = (status: SpiritualStudy['status']) => {
        switch (status) {
            case 'completed':
                return 'bg-green-50 border-green-200';
            case 'in-progress':
                return 'bg-blue-50 border-blue-200';
            case 'pending':
                return 'bg-yellow-50 border-yellow-200';
            default:
                return 'bg-gray-50 border-gray-200';
        }
    };

    const getStudyStatusIcon = (status: SpiritualStudy['status']) => {
        switch (status) {
            case 'completed':
                return 'fa-solid fa-check-circle text-green-600';
            case 'in-progress':
                return 'fa-solid fa-clock text-blue-600';
            case 'pending':
                return 'fa-solid fa-circle text-yellow-600';
            default:
                return 'fa-solid fa-circle text-gray-600';
        }
    };

    const getLanguagePracticeColor = (type: LanguagePractice['type']) => {
        switch (type) {
            case 'flashcards':
                return 'hover:border-green-500';
            case 'pronunciation':
                return 'hover:border-red-500';
            case 'challenge':
                return 'bg-orange-50 border-orange-200';
            default:
                return 'hover:border-gray-500';
        }
    };

    const getLanguagePracticeButtonColor = (type: LanguagePractice['type']) => {
        switch (type) {
            case 'flashcards':
                return 'bg-green-600 hover:bg-green-700';
            case 'pronunciation':
                return 'bg-red-600 hover:bg-red-700';
            case 'challenge':
                return 'bg-orange-600 hover:bg-orange-700';
            default:
                return 'bg-gray-600 hover:bg-gray-700';
        }
    };

    const handleGratitudeChange = (index: number, value: string) => {
        const newEntries = [...gratitudeEntries];
        newEntries[index] = value;
        setGratitudeEntries(newEntries);
    };

    const handleSaveGratitude = () => {
        console.log('Saving gratitude entries:', gratitudeEntries);
        // Simulate saving
        alert('Gratitud guardada exitosamente');
    };

    const handleAddDailyNote = () => {
        console.log('Adding daily note');
        // Simulate adding note
        alert('Nota del día agregada');
    };

    const handleReflectOnStudy = () => {
        console.log('Reflecting on study');
        // Simulate reflection
        alert('Reflexión sobre estudio iniciada');
    };

    const handleTeachingReflection = () => {
        console.log('Teaching reflection');
        // Simulate teaching reflection
        alert('Reflexión sobre enseñanza iniciada');
    };

    const handleWeeklyTestimony = () => {
        console.log('Weekly testimony');
        // Simulate testimony writing
        alert('Escritura de testimonio semanal iniciada');
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
                            <h2 className="text-lg font-semibold text-gray-800">{t('common.appName')}</h2>
                            <p className="text-xs text-gray-500">{t('common.webApp')}</p>
                        </div>
                    </div>
                </div>

                <nav className="p-4">
                    <ul className="space-y-2">
                        <li>
                            <Link href="/dashboard" className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                                <i className="fa-solid fa-home"></i>
                                <span>{t('navigation.home')}</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/diario" className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                                <i className="fa-solid fa-book-open"></i>
                                <span>{t('navigation.diary')}</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/traslados" className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                                <i className="fa-solid fa-route"></i>
                                <span>{t('navigation.transfers')}</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/fotos" className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                                <i className="fa-solid fa-camera"></i>
                                <span>{t('navigation.photos')}</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/recursos" className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                                <i className="fa-solid fa-folder"></i>
                                <span>{t('navigation.resources')}</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/etapas" className="flex items-center space-x-3 p-3 rounded-lg bg-primary text-white cursor-pointer">
                                <i className="fa-solid fa-seedling"></i>
                                <span className="font-medium">{t('navigation.stages')}</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/perfil" className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                                <i className="fa-solid fa-user"></i>
                                <span>{t('navigation.profile')}</span>
                            </Link>
                        </li>
                    </ul>
                </nav>

                <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-gradient-to-r from-secondary/10 to-primary/10 p-4 rounded-lg border border-secondary/20">
                        <div className="flex items-center space-x-2 mb-2">
                            <i className="fa-solid fa-crown text-secondary"></i>
                            <span className="text-sm font-medium text-gray-700">{t('common.familySponsorship')}</span>
                        </div>
                        <p className="text-xs text-gray-600">{t('common.connectedWithFamily')}</p>
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
                                <div className="flex items-center space-x-3">
                                    <div className="flex items-center space-x-2">
                                        <i className="fa-solid fa-graduation-cap text-primary text-xl"></i>
                                        <i className="fa-solid fa-book text-secondary text-lg"></i>
                                    </div>
                                    <div>
                                        <h1 className="text-xl font-semibold text-gray-800">Etapa CCM</h1>
                                        <p className="text-sm text-gray-500">Organiza tu preparación en el Centro de Capacitación Misional</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <button className="p-2 text-gray-500 hover:text-primary transition-colors">
                                    <i className="fa-solid fa-eye-slash"></i>
                                </button>

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
                <main className="p-4 space-y-6 pb-20">
                    {/* CCM Progress */}
                    <section className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-xl text-white">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold">Progreso CCM</h2>
                            <div className="text-right">
                                <div className="text-2xl font-bold">{ccmProgress}%</div>
                                <div className="text-sm text-blue-100">Semana {currentWeek} de {totalWeeks}</div>
                            </div>
                        </div>
                        <div className="w-full bg-blue-200 rounded-full h-3">
                            <div className="bg-white h-3 rounded-full transition-all duration-500" style={{ width: `${ccmProgress}%` }}></div>
                        </div>
                        <div className="flex items-center justify-between mt-3 text-sm text-blue-100">
                            <span>Inicio CCM</span>
                            <span>Listo para el Campo</span>
                        </div>
                    </section>

                    {/* CCM Schedule */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <i className="fa-solid fa-calendar-days text-blue-600"></i>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800">Mi Agenda del CCM</h3>
                            </div>
                            <button className="text-primary text-sm font-medium">Ver semana completa</button>
                        </div>

                        <div className="space-y-3">
                            {schedule.map((item) => (
                                <div key={item.id} className={`flex items-center justify-between p-3 rounded-lg border-l-4 ${getScheduleStatusColor(item.status)}`}>
                                    <div className="flex items-center space-x-3">
                                        <div className="text-center">
                                            <div className="text-xs text-gray-500">HOY</div>
                                            <div className="text-lg font-bold text-gray-800">15</div>
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-800">{item.title}</div>
                                            <div className="text-sm text-gray-600">{item.duration}</div>
                                        </div>
                                    </div>
                                    {item.status === 'completed' ? (
                                        <i className={getScheduleStatusIcon(item.status)}></i>
                                    ) : (
                                        <div className={getScheduleStatusIcon(item.status)}></div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={handleAddDailyNote}
                            className="w-full mt-4 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                        >
                            <i className="fa-solid fa-plus"></i>
                            <span>Añadir nota del día</span>
                        </button>
                    </section>

                    {/* Spiritual Study */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <i className="fa-solid fa-book-open text-purple-600"></i>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800">Estudio Espiritual</h3>
                        </div>

                        <div className="space-y-3">
                            {spiritualStudy.map((item) => (
                                <div key={item.id} className={`flex items-center justify-between p-3 rounded-lg border ${getStudyStatusColor(item.status)}`}>
                                    <div className="flex items-center space-x-3">
                                        <i className={getStudyStatusIcon(item.status)}></i>
                                        <div>
                                            <div className="text-sm font-medium">{item.title}</div>
                                            <div className="text-xs text-gray-600">{item.description}</div>
                                        </div>
                                    </div>
                                    <button className={`text-sm ${item.status === 'completed' ? 'text-green-600' : item.status === 'in-progress' ? 'text-blue-600' : 'text-yellow-600'}`}>
                                        {item.status === 'completed' ? 'Leer' : item.status === 'in-progress' ? 'Continuar' : 'Comenzar'}
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={handleReflectOnStudy}
                            className="w-full mt-4 bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
                        >
                            <i className="fa-solid fa-pen"></i>
                            <span>Reflexiona sobre tu estudio</span>
                        </button>
                    </section>

                    {/* Language Practice */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <i className="fa-solid fa-globe text-green-600"></i>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800">Práctica de Idiomas</h3>
                            </div>
                            <select
                                value={selectedLanguage}
                                onChange={(e) => setSelectedLanguage(e.target.value)}
                                className="text-sm border border-gray-300 rounded px-2 py-1"
                            >
                                <option>Inglés</option>
                                <option>Español</option>
                                <option>Português</option>
                            </select>
                        </div>

                        <div className="grid gap-4">
                            {languagePractice.map((item) => (
                                <div key={item.id} className={`p-4 border border-gray-200 rounded-lg transition-colors cursor-pointer ${getLanguagePracticeColor(item.type)}`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-medium text-gray-800">{item.title}</h4>
                                        {item.progress && (
                                            <div className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded-full">{item.progress}</div>
                                        )}
                                        {item.type === 'pronunciation' && (
                                            <i className="fa-solid fa-microphone text-red-600"></i>
                                        )}
                                        {item.type === 'challenge' && (
                                            <i className="fa-solid fa-target text-orange-600"></i>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                                    <button className={`${getLanguagePracticeButtonColor(item.type)} text-white px-4 py-2 rounded-lg text-sm`}>
                                        {item.type === 'flashcards' ? 'Practicar' : item.type === 'pronunciation' ? 'Grabar' : 'Intentar'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Teaching Simulations */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                <i className="fa-solid fa-users text-indigo-600"></i>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800">Simulaciones de Enseñanza</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 border border-gray-200 rounded-lg">
                                <h4 className="font-medium text-gray-800 mb-3">Lecciones Guiadas</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    {teachingSimulations.map((lesson) => (
                                        <div key={lesson.id} className={`p-3 rounded-lg border cursor-pointer transition-colors ${lesson.status === 'completed' ? 'bg-blue-50 border-blue-200 hover:bg-blue-100' :
                                                lesson.status === 'in-progress' ? 'bg-green-50 border-green-200 hover:bg-green-100' :
                                                    'bg-gray-50 border-gray-200 hover:bg-gray-100'
                                            }`}>
                                            <div className="text-sm font-medium text-gray-800">{lesson.title}</div>
                                            <div className="text-xs text-gray-600 mt-1">{lesson.description}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-4 border border-gray-200 rounded-lg">
                                <h4 className="font-medium text-gray-800 mb-3">Checklist de Prácticas</h4>
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-3">
                                        <input type="checkbox" checked className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" />
                                        <span className="text-sm text-gray-700 line-through">Presentación personal</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <input type="checkbox" checked className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" />
                                        <span className="text-sm text-gray-700 line-through">Primer contacto</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" />
                                        <span className="text-sm text-gray-700">Enseñanza de lecciones básicas</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleTeachingReflection}
                                className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2"
                            >
                                <i className="fa-solid fa-star"></i>
                                <span>¿Cómo me sentí enseñando hoy?</span>
                            </button>
                        </div>
                    </section>

                    {/* CCM Life */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                                <i className="fa-solid fa-home text-teal-600"></i>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800">Vida en el CCM</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <h4 className="font-medium text-gray-800 mb-2">Consejos Prácticos</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>• Organización de cuarto</li>
                                    <li>• Hábitos de limpieza</li>
                                    <li>• Descanso y ejercicio</li>
                                </ul>
                                <button className="mt-2 text-blue-600 text-sm font-medium">Ver detalles</button>
                            </div>

                            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                <h4 className="font-medium text-gray-800 mb-2">Convivencia con Compañeros</h4>
                                <p className="text-sm text-gray-600 mb-3">Tips para resolver conflictos con amor y paciencia</p>
                                <button className="text-green-600 text-sm font-medium">Leer consejos</button>
                            </div>

                            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-medium text-gray-800">Progreso Social</h4>
                                    <i className="fa-solid fa-users text-yellow-600"></i>
                                </div>
                                <p className="text-sm text-gray-600">Medalla por trabajar bien en equipo</p>
                            </div>
                        </div>
                    </section>

                    {/* Testimony and Growth */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                                <i className="fa-solid fa-heart text-amber-600"></i>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800">Testimonio y Crecimiento</h3>
                        </div>

                        <div className="space-y-4">
                            <button
                                onClick={handleWeeklyTestimony}
                                className="w-full bg-amber-600 text-white p-4 rounded-lg hover:bg-amber-700 transition-colors flex items-center justify-center space-x-2"
                            >
                                <i className="fa-solid fa-pen-fancy"></i>
                                <span className="font-medium">Escribir testimonio semanal</span>
                            </button>

                            <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
                                <div className="flex items-center space-x-2 mb-3">
                                    <i className="fa-solid fa-gratitude text-pink-600"></i>
                                    <h4 className="font-medium text-gray-800">Gratitud Diaria</h4>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">Escribe 3 cosas por las que agradeces hoy</p>
                                <div className="space-y-2">
                                    {gratitudeEntries.map((entry, index) => (
                                        <input
                                            key={index}
                                            type="text"
                                            placeholder={`${index + 1}. Estoy agradecido por...`}
                                            value={entry}
                                            onChange={(e) => handleGratitudeChange(index, e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded text-sm"
                                        />
                                    ))}
                                </div>
                                <button
                                    onClick={handleSaveGratitude}
                                    className="mt-3 bg-pink-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-pink-700"
                                >
                                    Guardar
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* CCM Achievements */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <i className="fa-solid fa-trophy text-yellow-600"></i>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800">Medallas CCM</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {achievements.map((achievement) => (
                                <div key={achievement.id} className={`text-center p-4 rounded-lg border ${achievement.unlocked ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200 opacity-50'}`}>
                                    <i className={`${achievement.icon} ${achievement.unlocked ? 'text-green-600' : 'text-gray-400'} text-2xl mb-2`}></i>
                                    <div className={`text-sm font-medium ${achievement.unlocked ? 'text-gray-800' : 'text-gray-600'}`}>
                                        {achievement.title}
                                    </div>
                                    <div className={`text-xs ${achievement.unlocked ? 'text-gray-600' : 'text-gray-500'}`}>
                                        {achievement.description}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Export/Share */}
                    <section className="flex flex-col space-y-3">
                        <button className="bg-primary text-white p-4 rounded-xl shadow-sm hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2">
                            <i className="fa-solid fa-download"></i>
                            <span className="font-medium">Exportar resumen semanal</span>
                        </button>

                        <button className="bg-secondary text-white p-4 rounded-xl shadow-sm hover:bg-secondary/90 transition-colors flex items-center justify-center space-x-2">
                            <i className="fa-solid fa-share"></i>
                            <span className="font-medium">Compartir progreso con familia</span>
                        </button>
                    </section>
                </main>
            </div>
        </div>
    );
}
