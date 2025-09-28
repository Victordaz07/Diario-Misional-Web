'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useTranslations } from '@/lib/use-translations';
import Link from 'next/link';
import LanguageSelector from '@/components/language-selector';
import {
    MissionCall,
    StageTask,
    mockMissionCall,
    generatePreMissionTasks,
    generateAchievements
} from '@/lib/mission-stages';

export default function PreMissionPage() {
    const { user } = useAuth();
    const { t } = useTranslations();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [missionCall] = useState<MissionCall>(mockMissionCall);
    const [tasks, setTasks] = useState<StageTask[]>(generatePreMissionTasks());
    const [achievements] = useState(generateAchievements());
    const [progress, setProgress] = useState(0);
    const [reflectionModal, setReflectionModal] = useState(false);
    const [testimonyModal, setTestimonyModal] = useState(false);
    const [currentReflection, setCurrentReflection] = useState('');
    const [currentTestimony, setCurrentTestimony] = useState('');

    useEffect(() => {
        // Calculate progress based on completed tasks
        const completedTasks = tasks.filter(task => task.completed).length;
        const totalTasks = tasks.length;
        setProgress(Math.round((completedTasks / totalTasks) * 100));
    }, [tasks]);

    const handleTaskToggle = (taskId: string) => {
        setTasks(prev => prev.map(task =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
        ));
    };

    const handleSaveReflection = () => {
        console.log('Saving reflection:', currentReflection);
        setReflectionModal(false);
        setCurrentReflection('');
    };

    const handleSaveTestimony = () => {
        console.log('Saving testimony:', currentTestimony);
        setTestimonyModal(false);
        setCurrentTestimony('');
    };

    const getTaskIcon = (category: StageTask['category']) => {
        switch (category) {
            case 'spiritual':
                return 'fa-solid fa-praying-hands text-purple-600';
            case 'practical':
                return 'fa-solid fa-list-check text-green-600';
            case 'ecclesiastical':
                return 'fa-solid fa-church text-blue-600';
            case 'communication':
                return 'fa-solid fa-microphone text-yellow-600';
            default:
                return 'fa-solid fa-circle text-gray-600';
        }
    };

    const getTaskBgColor = (category: StageTask['category']) => {
        switch (category) {
            case 'spiritual':
                return 'bg-purple-50 border-purple-200';
            case 'practical':
                return 'bg-green-50 border-green-200';
            case 'ecclesiastical':
                return 'bg-blue-50 border-blue-200';
            case 'communication':
                return 'bg-yellow-50 border-yellow-200';
            default:
                return 'bg-gray-50 border-gray-200';
        }
    };

    const spiritualTasks = tasks.filter(task => task.category === 'spiritual');
    const practicalTasks = tasks.filter(task => task.category === 'practical');
    const ecclesiasticalTasks = tasks.filter(task => task.category === 'ecclesiastical');
    const communicationTasks = tasks.filter(task => task.category === 'communication');

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
                                        <i className="fa-solid fa-book text-primary text-xl"></i>
                                        <i className="fa-solid fa-backpack text-secondary text-lg"></i>
                                    </div>
                                    <div>
                                        <h1 className="text-xl font-semibold text-gray-800">Etapa Premisional</h1>
                                        <p className="text-sm text-gray-500">Prepárate espiritual, práctica y emocionalmente para servir al Señor</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
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
                    {/* Progress Overview */}
                    <section className="bg-gradient-to-r from-primary to-accent p-6 rounded-xl text-white">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold">Tu Preparación Misional</h2>
                            <div className="text-right">
                                <div className="text-2xl font-bold">{progress}%</div>
                                <div className="text-sm text-blue-100">Completado</div>
                            </div>
                        </div>
                        <div className="w-full bg-blue-200 rounded-full h-3">
                            <div className="bg-white h-3 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                        </div>
                        <div className="flex items-center justify-between mt-3 text-sm text-blue-100">
                            <span>Preparación Iniciada</span>
                            <span>Listo para el CCM</span>
                        </div>
                    </section>

                    {/* Spiritual Preparation */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <i className="fa-solid fa-praying-hands text-purple-600"></i>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800">Preparación Espiritual</h3>
                        </div>

                        <div className="space-y-3">
                            {spiritualTasks.map((task) => (
                                <div key={task.id} className={`flex items-center justify-between p-3 rounded-lg border ${getTaskBgColor(task.category)}`}>
                                    <div className="flex items-center space-x-3">
                                        <i className={`${getTaskIcon(task.category)} ${task.completed ? 'text-green-600' : ''}`}></i>
                                        <span className={`text-sm font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                                            {task.title}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {task.completed ? (
                                            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">Completado</span>
                                        ) : task.dueDate ? (
                                            <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                                                {task.dueDate.toLocaleDateString()}
                                            </span>
                                        ) : (
                                            <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">Pendiente</span>
                                        )}
                                        <input
                                            type="checkbox"
                                            checked={task.completed}
                                            onChange={() => handleTaskToggle(task.id)}
                                            className="rounded border-gray-300 text-primary focus:ring-primary"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => setReflectionModal(true)}
                            className="w-full mt-4 bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
                        >
                            <i className="fa-solid fa-pen"></i>
                            <span>Reflexiona sobre hoy</span>
                        </button>
                    </section>

                    {/* Ecclesiastical Preparation */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <i className="fa-solid fa-church text-blue-600"></i>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800">Preparación Eclesiástica</h3>
                        </div>

                        <div className="grid gap-4">
                            {ecclesiasticalTasks.map((task) => (
                                <div key={task.id} className={`p-4 border rounded-lg hover:border-primary transition-colors cursor-pointer ${getTaskBgColor(task.category)}`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-medium text-gray-800">{task.title}</h4>
                                        <div className="flex items-center space-x-2">
                                            {task.completed ? (
                                                <i className="fa-solid fa-check-circle text-green-600"></i>
                                            ) : task.dueDate ? (
                                                <i className="fa-solid fa-calendar text-blue-600"></i>
                                            ) : (
                                                <i className="fa-solid fa-clock text-yellow-600"></i>
                                            )}
                                            <input
                                                type="checkbox"
                                                checked={task.completed}
                                                onChange={() => handleTaskToggle(task.id)}
                                                className="rounded border-gray-300 text-primary focus:ring-primary"
                                            />
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600">{task.description}</p>
                                    {task.dueDate && !task.completed && (
                                        <button className="mt-2 text-primary text-sm font-medium">Configurar recordatorio</button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Practical Preparation */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <i className="fa-solid fa-list-check text-green-600"></i>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800">Preparación Práctica</h3>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h4 className="font-medium text-gray-800 mb-3">Lista de cosas para la misión</h4>
                                <div className="space-y-2">
                                    {practicalTasks.map((task) => (
                                        <div key={task.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                                            <input
                                                type="checkbox"
                                                checked={task.completed}
                                                onChange={() => handleTaskToggle(task.id)}
                                                className="rounded border-gray-300 text-primary focus:ring-primary"
                                            />
                                            <span className={`text-sm text-gray-700 ${task.completed ? 'line-through' : ''}`}>
                                                {task.title}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="font-medium text-gray-800 mb-3">Recetas básicas</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 bg-orange-50 rounded-lg border border-orange-200 cursor-pointer hover:bg-orange-100">
                                        <i className="fa-solid fa-egg text-orange-600 mb-2"></i>
                                        <div className="text-sm font-medium text-gray-800">Omelette</div>
                                    </div>
                                    <div className="p-3 bg-green-50 rounded-lg border border-green-200 cursor-pointer hover:bg-green-100">
                                        <i className="fa-solid fa-leaf text-green-600 mb-2"></i>
                                        <div className="text-sm font-medium text-gray-800">Ensalada</div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-medium text-gray-800 mb-3">Rutina física</h4>
                                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <i className="fa-solid fa-dumbbell text-blue-600"></i>
                                        <span className="text-sm font-medium text-gray-800">Ejercicios diarios</span>
                                    </div>
                                    <ul className="text-sm text-gray-600 space-y-1">
                                        <li>• 20 flexiones</li>
                                        <li>• 30 minutos de caminata</li>
                                        <li>• Estiramientos básicos</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Communication Preparation */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <i className="fa-solid fa-microphone text-yellow-600"></i>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800">Preparación en Comunicación</h3>
                        </div>

                        <div className="space-y-4">
                            {communicationTasks.map((task) => (
                                <div key={task.id} className="p-4 border border-gray-200 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-medium text-gray-800">{task.title}</h4>
                                        <input
                                            type="checkbox"
                                            checked={task.completed}
                                            onChange={() => handleTaskToggle(task.id)}
                                            className="rounded border-gray-300 text-primary focus:ring-primary"
                                        />
                                    </div>
                                    <p className="text-sm text-gray-600 mb-3">{task.description}</p>

                                    {task.id === 'testimony-sharing' && (
                                        <div className="flex space-x-3">
                                            <button className="flex-1 bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2">
                                                <i className="fa-solid fa-microphone"></i>
                                                <span>Grabar audio</span>
                                            </button>
                                            <button className="flex-1 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                                                <i className="fa-solid fa-pen"></i>
                                                <span>Escribir</span>
                                            </button>
                                        </div>
                                    )}

                                    {task.id === 'language-practice' && (
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-sm text-gray-600">Idioma de práctica</span>
                                            <select className="text-sm border border-gray-300 rounded px-2 py-1">
                                                <option>Español</option>
                                                <option>English</option>
                                                <option>Português</option>
                                            </select>
                                        </div>
                                    )}

                                    {task.id === 'teaching-simulation' && (
                                        <div className="text-sm text-gray-600 mb-3">¿Cómo explicarías la Primera Visión?</div>
                                    )}

                                    <button className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
                                        <i className="fa-solid fa-play"></i>
                                        <span>Comenzar práctica</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Testimony Reflection */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                                <i className="fa-solid fa-heart text-amber-600"></i>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800">Reflexión y Testimonio</h3>
                        </div>

                        <div className="space-y-4">
                            <button
                                onClick={() => setTestimonyModal(true)}
                                className="w-full bg-amber-600 text-white p-4 rounded-lg hover:bg-amber-700 transition-colors flex items-center justify-center space-x-2"
                            >
                                <i className="fa-solid fa-pen-fancy"></i>
                                <span className="font-medium">Escribir mi Testimonio</span>
                            </button>

                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="flex items-center space-x-2 mb-2">
                                    <i className="fa-solid fa-book-open text-blue-600"></i>
                                    <span className="font-medium text-gray-800">Historia Inspiradora</span>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">La Primera Visión de José Smith</p>
                                <button className="text-blue-600 text-sm font-medium hover:text-blue-700">Leer historia completa</button>
                            </div>

                            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                                <div className="flex items-center space-x-2 mb-2">
                                    <i className="fa-solid fa-scroll text-purple-600"></i>
                                    <span className="font-medium text-gray-800">Aprende más</span>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">Escrituras adicionales sobre el servicio misional</p>
                                <button className="text-purple-600 text-sm font-medium hover:text-purple-700">Ver escrituras</button>
                            </div>
                        </div>
                    </section>

                    {/* Achievements */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <i className="fa-solid fa-trophy text-yellow-600"></i>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800">Logros y Medallas</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {achievements.map((achievement) => (
                                <div key={achievement.id} className={`text-center p-4 rounded-lg border ${achievement.unlocked ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200 opacity-50'}`}>
                                    <i className={`${achievement.icon} ${achievement.unlocked ? 'text-green-600' : 'text-gray-400'} text-2xl mb-2`}></i>
                                    <div className={`text-sm font-medium ${achievement.unlocked ? 'text-gray-800' : 'text-gray-600'}`}>
                                        {achievement.title}
                                    </div>
                                    <div className={`text-xs ${achievement.unlocked ? 'text-gray-600' : 'text-gray-500'}`}>
                                        {achievement.unlocked ? achievement.description : 'Próximo logro'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Action Buttons */}
                    <section className="flex flex-col space-y-3">
                        <button className="bg-primary text-white p-4 rounded-xl shadow-sm hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2">
                            <i className="fa-solid fa-download"></i>
                            <span className="font-medium">Exportar preparación en PDF</span>
                        </button>

                        <button className="bg-secondary text-white p-4 rounded-xl shadow-sm hover:bg-secondary/90 transition-colors flex items-center justify-center space-x-2">
                            <i className="fa-solid fa-share"></i>
                            <span className="font-medium">Compartir con familia</span>
                        </button>
                    </section>
                </main>
            </div>

            {/* Reflection Modal */}
            {reflectionModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Reflexión de Hoy</h3>
                        <textarea
                            value={currentReflection}
                            onChange={(e) => setCurrentReflection(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                            rows={4}
                            placeholder="Escribe tus reflexiones sobre tu preparación misional de hoy..."
                        />
                        <div className="flex space-x-3 mt-4">
                            <button
                                onClick={() => setReflectionModal(false)}
                                className="flex-1 bg-gray-300 text-gray-700 p-3 rounded-lg hover:bg-gray-400 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSaveReflection}
                                className="flex-1 bg-primary text-white p-3 rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Testimony Modal */}
            {testimonyModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Mi Testimonio</h3>
                        <textarea
                            value={currentTestimony}
                            onChange={(e) => setCurrentTestimony(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                            rows={6}
                            placeholder="Escribe tu testimonio personal del evangelio..."
                        />
                        <div className="flex space-x-3 mt-4">
                            <button
                                onClick={() => setTestimonyModal(false)}
                                className="flex-1 bg-gray-300 text-gray-700 p-3 rounded-lg hover:bg-gray-400 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSaveTestimony}
                                className="flex-1 bg-primary text-white p-3 rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                Guardar Testimonio
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
