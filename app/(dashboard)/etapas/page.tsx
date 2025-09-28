'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useTranslations } from '@/lib/use-translations';
import Link from 'next/link';
import LanguageSelector from '@/components/language-selector';
import {
    MissionStage,
    MissionCall,
    MissionProgress,
    mockMissionCall,
    getStageStatus,
    calculateOverallProgress,
    generatePreMissionTasks,
    generateAchievements
} from '@/lib/mission-stages';
import { calculateStageDates } from '@/lib/mtc-data';

export default function EtapasPage() {
    const { user } = useAuth();
    const { t } = useTranslations();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [missionCall] = useState<MissionCall>(mockMissionCall);
    const [stages, setStages] = useState<MissionStage[]>([]);
    const [progress, setProgress] = useState<MissionProgress>({
        currentStage: 'pre-mission',
        overallProgress: 0,
        daysInMission: 0,
        completedTasks: 0,
        totalTasks: 0,
        achievements: []
    });

    useEffect(() => {
        // Calculate stage dates based on mission call
        const stageDates = calculateStageDates(missionCall.callDate, missionCall.needsLanguageLearning);
        const today = new Date();

        // Calculate days in mission
        const missionStart = stageDates.missionFieldStart;
        const daysInMission = Math.max(0, Math.floor((today.getTime() - missionStart.getTime()) / (1000 * 60 * 60 * 24)));

        // Generate stages with dynamic status
        const generatedStages: MissionStage[] = [
            {
                id: 'pre-mission',
                title: 'Pre-Misional',
                description: 'Preparación espiritual, física y mental para el servicio misional.',
                status: getStageStatus({
                    id: 'pre-mission',
                    title: '',
                    description: '',
                    status: 'locked',
                    icon: '',
                    iconColor: '',
                    notes: '',
                    isEditable: false,
                    unlockCondition: '',
                    progress: 0,
                    tasks: []
                }, today, missionCall),
                icon: 'fa-solid fa-graduation-cap',
                iconColor: 'bg-green-500',
                startDate: missionCall.callDate,
                endDate: stageDates.mtcStart,
                notes: 'Tiempo de mucha preparación y estudio. Aprendí la importancia de la oración personal y el estudio de las escrituras. Mi testimonio se fortaleció.',
                isEditable: true,
                unlockCondition: 'Recibir llamamiento misional',
                progress: 68,
                tasks: generatePreMissionTasks()
            },
            {
                id: 'mtc',
                title: 'Centro de Capacitación Misional',
                description: `Entrenamiento intensivo en métodos de enseñanza y doctrina en ${missionCall.mtc.nombre}.`,
                status: getStageStatus({
                    id: 'mtc',
                    title: '',
                    description: '',
                    status: 'locked',
                    icon: '',
                    iconColor: '',
                    notes: '',
                    isEditable: false,
                    unlockCondition: '',
                    progress: 0,
                    tasks: []
                }, today, missionCall),
                icon: 'fa-solid fa-school',
                iconColor: 'bg-blue-500',
                startDate: stageDates.mtcStart,
                endDate: stageDates.mtcEnd,
                notes: 'El CCM fue transformador. Aprendí a enseñar con el Espíritu y desarrollé amor por las personas. Los compañeros de distrito se volvieron como hermanos.',
                isEditable: true,
                unlockCondition: 'Una semana antes de entrar al CCM',
                progress: 0,
                tasks: []
            },
            {
                id: 'mission-field',
                title: 'Campo Misional',
                description: 'Servicio activo enseñando el evangelio y bendiciendo vidas.',
                status: getStageStatus({
                    id: 'mission-field',
                    title: '',
                    description: '',
                    status: 'locked',
                    icon: '',
                    iconColor: '',
                    notes: '',
                    isEditable: false,
                    unlockCondition: '',
                    progress: 0,
                    tasks: []
                }, today, missionCall),
                icon: 'fa-solid fa-heart',
                iconColor: 'bg-primary',
                startDate: stageDates.missionFieldStart,
                endDate: stageDates.missionEnd,
                notes: 'Cada día es una aventura nueva. He visto milagros increíbles y he sentido el amor de Dios por Sus hijos. Los traslados han sido oportunidades de crecimiento.',
                isEditable: true,
                unlockCondition: 'Después de completar el CCM',
                progress: 0,
                tasks: []
            },
            {
                id: 'finishing-mission',
                title: 'Terminando la Misión',
                description: 'Últimos meses de servicio y preparación para el retorno.',
                status: getStageStatus({
                    id: 'finishing-mission',
                    title: '',
                    description: '',
                    status: 'locked',
                    icon: '',
                    iconColor: '',
                    notes: '',
                    isEditable: false,
                    unlockCondition: '',
                    progress: 0,
                    tasks: []
                }, today, missionCall),
                icon: 'fa-solid fa-flag-checkered',
                iconColor: 'bg-gray-300',
                startDate: new Date(stageDates.missionEnd.getTime() - (3 * 30 * 24 * 60 * 60 * 1000)),
                endDate: stageDates.missionEnd,
                notes: '',
                isEditable: false,
                unlockCondition: 'Últimos 3 meses de misión',
                progress: 0,
                tasks: []
            },
            {
                id: 'after-mission',
                title: 'Después de la Misión',
                description: 'Aplicando las lecciones aprendidas en la vida cotidiana.',
                status: getStageStatus({
                    id: 'after-mission',
                    title: '',
                    description: '',
                    status: 'locked',
                    icon: '',
                    iconColor: '',
                    notes: '',
                    isEditable: false,
                    unlockCondition: '',
                    progress: 0,
                    tasks: []
                }, today, missionCall),
                icon: 'fa-solid fa-home',
                iconColor: 'bg-gray-300',
                startDate: stageDates.missionEnd,
                notes: '',
                isEditable: false,
                unlockCondition: 'Después de completar la misión',
                progress: 0,
                tasks: []
            }
        ];

        setStages(generatedStages);

        // Calculate progress
        const overallProgress = calculateOverallProgress(generatedStages);
        const currentStage = generatedStages.find(s => s.status === 'current');
        const achievements = generateAchievements();

        setProgress({
            currentStage: currentStage?.id || 'pre-mission',
            overallProgress,
            daysInMission,
            completedTasks: generatedStages.reduce((acc, stage) => acc + stage.tasks.filter(t => t.completed).length, 0),
            totalTasks: generatedStages.reduce((acc, stage) => acc + stage.tasks.length, 0),
            achievements
        });
    }, [missionCall]);

    const handleNotesChange = (stageId: string, notes: string) => {
        setStages(prev => prev.map(stage =>
            stage.id === stageId ? { ...stage, notes } : stage
        ));
    };

    const handleSaveNotes = (stageId: string) => {
        // Simulate saving notes
        console.log(`Saving notes for stage ${stageId}:`, stages.find(s => s.id === stageId)?.notes);
    };

    const getStageStatusInfo = (status: MissionStage['status']) => {
        switch (status) {
            case 'completed':
                return { text: 'Completado', bgColor: 'bg-green-100', textColor: 'text-green-700' };
            case 'current':
                return { text: 'Actual', bgColor: 'bg-primary', textColor: 'text-white' };
            case 'unlocked':
                return { text: 'Disponible', bgColor: 'bg-blue-100', textColor: 'text-blue-700' };
            case 'locked':
                return { text: 'Bloqueado', bgColor: 'bg-gray-100', textColor: 'text-gray-600' };
            default:
                return { text: 'Desconocido', bgColor: 'bg-gray-100', textColor: 'text-gray-600' };
        }
    };

    const completedStages = stages.filter(s => s.status === 'completed').length;
    const currentStages = stages.filter(s => s.status === 'current').length;
    const lockedStages = stages.filter(s => s.status === 'locked').length;

    const currentStage = stages.find(s => s.status === 'current');

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
                            <span className="flex items-center space-x-3 p-3 rounded-lg bg-primary text-white cursor-pointer">
                                <i className="fa-solid fa-seedling"></i>
                                <span className="font-medium">{t('navigation.stages')}</span>
                            </span>
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
                                <div>
                                    <h1 className="text-xl font-semibold text-gray-800">Etapas Misionales</h1>
                                    <p className="text-sm text-gray-500">Tu progreso espiritual y de servicio</p>
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
                    {/* Journey Header */}
                    <section className="bg-gradient-to-r from-primary to-accent p-6 rounded-xl text-white">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold mb-2">Tu Viaje Misional</h2>
                            <p className="text-blue-100 mb-4">Reflexiona sobre cada etapa de tu crecimiento espiritual</p>
                            <div className="flex items-center justify-center space-x-4 text-sm">
                                <div className="flex items-center space-x-2">
                                    <i className="fa-solid fa-calendar"></i>
                                    <span>Día {progress.daysInMission} de servicio</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <i className="fa-solid fa-map-marker-alt"></i>
                                    <span>{missionCall.missionName}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <i className="fa-solid fa-school"></i>
                                    <span>{missionCall.mtc.nombre}</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Current Stage Indicator */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">Etapa Actual</h3>
                            <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                                {currentStage?.title || 'Campo Misional'}
                            </span>
                        </div>
                        <p className="text-gray-600 text-sm">
                            Estás en la etapa más importante de tu misión. ¡Sigue adelante con fe!
                        </p>
                    </section>

                    {/* Timeline */}
                    <section className="relative">
                        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                        {stages.map((stage, index) => {
                            const statusInfo = getStageStatusInfo(stage.status);
                            const isCurrent = stage.status === 'current';
                            const isDisabled = stage.status === 'pending' || stage.status === 'future';

                            return (
                                <div key={stage.id} className="relative mb-8">
                                    <div className="flex items-start space-x-6">
                                        <div className={`relative z-10 w-16 h-16 ${stage.iconColor} rounded-full flex items-center justify-center shadow-lg ${isCurrent ? 'ring-4 ring-primary/20' : ''}`}>
                                            <i className={`${stage.icon} text-white text-xl`}></i>
                                        </div>
                                        <div className={`flex-1 bg-white rounded-xl shadow-sm border ${isCurrent ? 'border-2 border-primary/20' : 'border-gray-200'} p-6 ${isDisabled ? 'opacity-75' : ''}`}>
                                            <div className="flex items-center justify-between mb-3">
                                                <h3 className="text-lg font-semibold text-gray-800">{stage.title}</h3>
                                                <span className={`${statusInfo.bgColor} ${statusInfo.textColor} px-2 py-1 rounded-full text-xs font-medium`}>
                                                    {statusInfo.text}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 text-sm mb-4">{stage.description}</p>

                                            <div className="space-y-3">
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <i className="fa-solid fa-calendar-check mr-2"></i>
                                                    <span>{stage.startDate}{stage.endDate ? ` - ${stage.endDate}` : ''}</span>
                                                </div>

                                                <div className={`rounded-lg p-4 ${isCurrent ? 'bg-primary/5 border border-primary/10' : 'bg-gray-50'}`}>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        {stage.status === 'future' ? 'Metas y Reflexiones' : 'Reflexiones y Notas'}
                                                    </label>
                                                    <textarea
                                                        className={`w-full p-3 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary ${isDisabled ? 'bg-gray-100' : ''}`}
                                                        rows={stage.status === 'current' ? 4 : 3}
                                                        placeholder={isDisabled ? `${stage.status === 'future' ? 'Metas para después de la misión...' : 'Reflexiones futuras sobre esta etapa...'}` : 'Escribe tus reflexiones sobre esta etapa...'}
                                                        value={stage.notes}
                                                        onChange={(e) => handleNotesChange(stage.id, e.target.value)}
                                                        disabled={isDisabled}
                                                    />
                                                </div>

                                                {stage.isEditable && (
                                                    <button
                                                        onClick={() => handleSaveNotes(stage.id)}
                                                        className="text-primary text-sm font-medium hover:text-primary/80 flex items-center"
                                                    >
                                                        <i className="fa-solid fa-save mr-2"></i>
                                                        Guardar notas
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </section>

                    {/* Progress Summary */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Resumen de Progreso</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="text-center p-4 bg-green-50 rounded-lg">
                                <div className="text-2xl font-bold text-green-600 mb-1">{completedStages}</div>
                                <div className="text-sm text-gray-600">Etapas Completadas</div>
                            </div>
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                                <div className="text-2xl font-bold text-primary mb-1">{currentStages}</div>
                                <div className="text-sm text-gray-600">Etapa Actual</div>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <div className="text-2xl font-bold text-gray-600 mb-1">{lockedStages}</div>
                                <div className="text-sm text-gray-600">Etapas Bloqueadas</div>
                            </div>
                            <div className="text-center p-4 bg-purple-50 rounded-lg">
                                <div className="text-2xl font-bold text-purple-600 mb-1">{progress.completedTasks}/{progress.totalTasks}</div>
                                <div className="text-sm text-gray-600">Tareas Completadas</div>
                            </div>
                        </div>

                        {/* Overall Progress Bar */}
                        <div className="mt-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">Progreso General</span>
                                <span className="text-sm text-gray-600">{Math.round(progress.overallProgress)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                    className="bg-gradient-to-r from-primary to-accent h-3 rounded-full transition-all duration-500"
                                    style={{ width: `${progress.overallProgress}%` }}
                                ></div>
                            </div>
                        </div>
                    </section>

                    {/* Action Buttons */}
                    <section className="flex flex-col space-y-3">
                        <button className="bg-primary text-white p-4 rounded-xl shadow-sm hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2">
                            <i className="fa-solid fa-download"></i>
                            <span className="font-medium">Exportar Reflexiones</span>
                        </button>

                        <button className="bg-secondary text-white p-4 rounded-xl shadow-sm hover:bg-secondary/90 transition-colors flex items-center justify-center space-x-2">
                            <i className="fa-solid fa-share"></i>
                            <span className="font-medium">Compartir Progreso</span>
                        </button>
                    </section>
                </main>
            </div>
        </div>
    );
}
