'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useTranslations } from '@/lib/use-translations';
import Link from 'next/link';
import LanguageSelector from '@/components/language-selector';

export default function DashboardPage() {
    const { user } = useAuth();
    const { t } = useTranslations();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [diaryEntry, setDiaryEntry] = useState('');
    const [spiritualMoment, setSpiritualMoment] = useState('');
    const [testimony, setTestimony] = useState('');

    // Mock data for the dashboard
    const missionStats = {
        monthsInService: 8,
        teachings: 127,
        baptisms: 15,
        transfers: 3,
        teachingHours: 240,
        commitmentsFulfilled: 89
    };

    const dailySchedule = [
        {
            time: '6:30 AM',
            activity: 'Estudio Personal',
            description: 'Libro de Mormón',
            status: 'completed',
            color: 'green'
        },
        {
            time: '10:00 AM',
            activity: 'Visita - Familia García',
            description: 'Lección 2: Plan de Salvación',
            status: 'pending',
            color: 'blue'
        },
        {
            time: '3:00 PM',
            activity: 'Prospección',
            description: 'Barrio San José',
            status: 'pending',
            color: 'yellow'
        }
    ];

    const currentArea = {
        name: 'Centro',
        companion: 'Elder Johnson',
        startDate: '15 Oct 2024',
        baptisms: 3,
        goals: [
            { text: '5 nuevos investigadores', completed: true },
            { text: '2 bautismos programados', completed: false },
            { text: 'Reactivar 3 miembros', completed: false }
        ]
    };

    const investigators = [
        {
            name: 'Familia García',
            type: 'Lecciones',
            progress: 'Lección 2 completada',
            nextAppointment: '17 Nov, 10:00 AM',
            progressPercent: 40,
            color: 'blue'
        },
        {
            name: 'María López',
            type: 'Fecha de bautismo',
            progress: 'Bautismo: 25 Nov 2024',
            nextAppointment: 'Preparación: 90% completada',
            progressPercent: 90,
            color: 'green'
        }
    ];

    const achievements = [
        { name: 'Primer Bautismo', icon: 'fa-water', color: 'blue', completed: true },
        { name: 'Primer Traslado', icon: 'fa-route', color: 'green', completed: true },
        { name: '50 Enseñanzas', icon: 'fa-chalkboard-teacher', color: 'purple', completed: true },
        { name: '100 Contactos', icon: 'fa-handshake', color: 'gray', completed: false, progress: '85/100' }
    ];

    const resources = [
        { name: 'Escrituras', description: 'Versículos clave', icon: 'fa-book-bible', color: 'blue' },
        { name: 'Predicad Mi Evangelio', description: 'Digital', icon: 'fa-graduation-cap', color: 'green' },
        { name: 'Recetas', description: 'Rápidas y económicas', icon: 'fa-utensils', color: 'yellow' },
        { name: 'Tips Prácticos', description: 'Vida diaria', icon: 'fa-lightbulb', color: 'purple' }
    ];

    const handleDiarySave = () => {
        console.log('Diary entry saved:', diaryEntry);
        // Here you would save to Firebase
    };

    const handleSpiritualMomentAdd = () => {
        console.log('Spiritual moment added:', spiritualMoment);
        // Here you would save to Firebase
    };

    const handleTestimonySave = () => {
        console.log('Testimony saved:', testimony);
        // Here you would save to Firebase
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

    const getStatusBg = (color: string) => {
        switch (color) {
            case 'green':
                return 'bg-green-50 border-l-4 border-green-500';
            case 'blue':
                return 'bg-blue-50 border-l-4 border-blue-500';
            case 'yellow':
                return 'bg-yellow-50 border-l-4 border-yellow-500';
            default:
                return 'bg-gray-50 border-l-4 border-gray-500';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <div className={`fixed left-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
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
                            <Link href="/fotos" className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                                <i className="fa-solid fa-camera"></i>
                                <span>Fotos</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/recursos" className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                                <i className="fa-solid fa-folder"></i>
                                <span>Recursos</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/etapas" className="flex items-center space-x-3 p-3 rounded-lg bg-primary text-white">
                                <i className="fa-solid fa-seedling"></i>
                                <span className="font-medium">Etapas</span>
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

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setSidebarOpen(false)}></div>
            )}

            {/* Main Content */}
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
                                        <i className="fa-solid fa-church text-primary text-xl"></i>
                                        <i className="fa-solid fa-globe text-secondary text-lg"></i>
                                    </div>
                                    <div>
                                        <h1 className="text-xl font-semibold text-gray-800">Etapa Misional</h1>
                                        <p className="text-sm text-gray-500">Vive tu misión con propósito y organización</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <button className="p-2 text-gray-500 hover:text-primary transition-colors">
                                    <i className="fa-solid fa-user-group"></i>
                                </button>

                                <LanguageSelector />

                                <div className="flex items-center space-x-2">
                                    <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg" alt="User" className="w-8 h-8 rounded-full" />
                                    <span className="text-sm font-medium text-gray-700 hidden sm:block">Elder Smith</span>
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
                    {/* Mission Progress */}
                    <section className="bg-gradient-to-r from-green-600 to-blue-600 p-6 rounded-xl text-white">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold">Progreso Misional</h2>
                            <div className="text-right">
                                <div className="text-2xl font-bold">{missionStats.monthsInService} meses</div>
                                <div className="text-sm text-green-100">En servicio activo</div>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="bg-white/20 p-3 rounded-lg">
                                <div className="text-lg font-bold">{missionStats.teachings}</div>
                                <div className="text-xs">Enseñanzas</div>
                            </div>
                            <div className="bg-white/20 p-3 rounded-lg">
                                <div className="text-lg font-bold">{missionStats.baptisms}</div>
                                <div className="text-xs">Bautismos</div>
                            </div>
                            <div className="bg-white/20 p-3 rounded-lg">
                                <div className="text-lg font-bold">{missionStats.transfers}</div>
                                <div className="text-xs">Traslados</div>
                            </div>
                        </div>
                    </section>

                    {/* Daily Schedule */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <i className="fa-solid fa-calendar-check text-blue-600"></i>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800">Agenda Diaria</h3>
                            </div>
                            <button className="text-primary text-sm font-medium">Ver semana</button>
                        </div>

                        <div className="space-y-3">
                            {dailySchedule.map((item, index) => (
                                <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${getStatusBg(item.color)}`}>
                                    <div className="flex items-center space-x-3">
                                        <div className="text-center">
                                            <div className="text-xs text-gray-500">{item.time.split(' ')[0]}</div>
                                            <div className="text-xs text-gray-500">{item.time.split(' ')[1]}</div>
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-800">{item.activity}</div>
                                            <div className="text-sm text-gray-600">{item.description}</div>
                                        </div>
                                    </div>
                                    {getStatusIcon(item.status)}
                                </div>
                            ))}
                        </div>

                        <button className="w-full mt-4 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                            <i className="fa-solid fa-plus"></i>
                            <span>Añadir cita</span>
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
                                    value={diaryEntry}
                                    onChange={(e) => setDiaryEntry(e.target.value)}
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
                                onClick={handleDiarySave}
                                className="w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
                            >
                                <i className="fa-solid fa-star"></i>
                                <span>Destacar experiencia espiritual</span>
                            </button>
                        </div>
                    </section>

                    {/* Transfers and Areas */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <i className="fa-solid fa-exchange-alt text-green-600"></i>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800">Traslados y Áreas</h3>
                            </div>
                            <button className="text-green-600 text-sm font-medium">Ver historial</button>
                        </div>

                        <div className="space-y-3">
                            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-medium text-gray-800">Área Actual: {currentArea.name}</h4>
                                    <span className="text-sm bg-green-600 text-white px-2 py-1 rounded-full">Activa</span>
                                </div>
                                <div className="text-sm text-gray-600 space-y-1">
                                    <div className="flex justify-between">
                                        <span>Compañero:</span>
                                        <span className="font-medium">{currentArea.companion}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Inicio:</span>
                                        <span>{currentArea.startDate}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Bautismos:</span>
                                        <span className="font-bold text-green-600">{currentArea.baptisms}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <h4 className="font-medium text-gray-800 mb-2">Metas del Traslado</h4>
                                <div className="space-y-2">
                                    {currentArea.goals.map((goal, index) => (
                                        <div key={index} className="flex items-center space-x-3">
                                            <input
                                                type="checkbox"
                                                checked={goal.completed}
                                                className="rounded border-gray-300 text-green-600 focus:ring-green-600"
                                                readOnly
                                            />
                                            <span className={`text-sm ${goal.completed ? 'text-gray-700 line-through' : 'text-gray-700'}`}>
                                                {goal.text}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Investigators */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                    <i className="fa-solid fa-users text-indigo-600"></i>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800">Investigadores / Amigos</h3>
                            </div>
                            <button className="text-indigo-600 text-sm font-medium">Ver todos</button>
                        </div>

                        <div className="space-y-3">
                            {investigators.map((investigator, index) => (
                                <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-indigo-500 transition-colors">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-medium text-gray-800">{investigator.name}</h4>
                                        <span className={`text-xs px-2 py-1 rounded-full ${investigator.color === 'blue' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                                            }`}>
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
                                                className={`h-2 rounded-full ${investigator.color === 'blue' ? 'bg-blue-600' : 'bg-green-600'
                                                    }`}
                                                style={{ width: `${investigator.progressPercent}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-xs text-gray-500">{investigator.progressPercent}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button className="w-full mt-4 bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2">
                            <i className="fa-solid fa-plus"></i>
                            <span>Añadir nuevo investigador</span>
                        </button>
                    </section>

                    {/* Mission Resources */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                                <i className="fa-solid fa-book text-amber-600"></i>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800">Recursos Misionales</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {resources.map((resource, index) => (
                                <div key={index} className={`p-4 rounded-lg border cursor-pointer hover:bg-opacity-80 transition-colors ${resource.color === 'blue' ? 'bg-blue-50 border-blue-200 hover:bg-blue-100' :
                                        resource.color === 'green' ? 'bg-green-50 border-green-200 hover:bg-green-100' :
                                            resource.color === 'yellow' ? 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100' :
                                                'bg-purple-50 border-purple-200 hover:bg-purple-100'
                                    }`}>
                                    <i className={`fa-solid ${resource.icon} text-xl mb-2 ${resource.color === 'blue' ? 'text-blue-600' :
                                            resource.color === 'green' ? 'text-green-600' :
                                                resource.color === 'yellow' ? 'text-yellow-600' :
                                                    'text-purple-600'
                                        }`}></i>
                                    <div className="text-sm font-medium text-gray-800">{resource.name}</div>
                                    <div className="text-xs text-gray-600">{resource.description}</div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Reflection and Testimony */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
                                <i className="fa-solid fa-heart text-rose-600"></i>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800">Reflexión y Testimonio</h3>
                        </div>

                        <div className="space-y-4">
                            <button
                                onClick={handleTestimonySave}
                                className="w-full bg-rose-600 text-white p-4 rounded-lg hover:bg-rose-700 transition-colors flex items-center justify-center space-x-2"
                            >
                                <i className="fa-solid fa-pen-fancy"></i>
                                <span className="font-medium">Mi testimonio de esta semana</span>
                            </button>

                            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                                <div className="flex items-center space-x-2 mb-3">
                                    <i className="fa-solid fa-hands-praying text-orange-600"></i>
                                    <h4 className="font-medium text-gray-800">Momentos Espirituales</h4>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">Registra oraciones respondidas o milagros</p>
                                <button
                                    onClick={handleSpiritualMomentAdd}
                                    className="text-orange-600 text-sm font-medium"
                                >
                                    Añadir momento
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Mission Achievements */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <i className="fa-solid fa-trophy text-yellow-600"></i>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800">Medallas Misionales</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {achievements.map((achievement, index) => (
                                <div key={index} className={`text-center p-4 rounded-lg border ${achievement.completed
                                        ? `bg-${achievement.color}-50 border-${achievement.color}-200`
                                        : 'bg-gray-50 border-gray-200 opacity-50'
                                    }`}>
                                    <i className={`fa-solid ${achievement.icon} text-2xl mb-2 ${achievement.completed
                                            ? `text-${achievement.color}-600`
                                            : 'text-gray-400'
                                        }`}></i>
                                    <div className={`text-sm font-medium ${achievement.completed ? 'text-gray-800' : 'text-gray-600'
                                        }`}>
                                        {achievement.name}
                                    </div>
                                    <div className={`text-xs ${achievement.completed ? 'text-gray-600' : 'text-gray-500'
                                        }`}>
                                        {achievement.completed ? 'Completado' : achievement.progress || 'Pendiente'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Mission Stats */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                                <i className="fa-solid fa-chart-bar text-cyan-600"></i>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800">Estadísticas de Progreso</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600">{missionStats.teachingHours}</div>
                                <div className="text-sm text-gray-600">Horas de enseñanza</div>
                            </div>

                            <div className="text-center p-3 bg-green-50 rounded-lg">
                                <div className="text-2xl font-bold text-green-600">{missionStats.commitmentsFulfilled}%</div>
                                <div className="text-sm text-gray-600">Compromisos cumplidos</div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}