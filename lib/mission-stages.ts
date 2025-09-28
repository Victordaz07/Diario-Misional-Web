import { MTC, calculateStageDates } from './mtc-data';

export interface MissionCall {
    id: string;
    missionName: string;
    missionCountry: string;
    callDate: Date;
    reportDate: Date;
    duration: number; // meses
    needsLanguageLearning: boolean;
    languageToLearn?: string;
    mtc: MTC;
    gender: 'elder' | 'sister';
}

export interface MissionStage {
    id: string;
    title: string;
    description: string;
    status: 'locked' | 'unlocked' | 'current' | 'completed';
    icon: string;
    iconColor: string;
    startDate?: Date;
    endDate?: Date;
    estimatedDate?: Date;
    notes: string;
    isEditable: boolean;
    unlockCondition: string;
    progress: number; // 0-100
    tasks: StageTask[];
}

export interface StageTask {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    dueDate?: Date;
    category: 'spiritual' | 'practical' | 'ecclesiastical' | 'communication';
}

export interface MissionProgress {
    currentStage: string;
    overallProgress: number;
    daysInMission: number;
    completedTasks: number;
    totalTasks: number;
    achievements: Achievement[];
}

export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlocked: boolean;
    unlockedDate?: Date;
    category: 'spiritual' | 'practical' | 'milestone';
}

// Mock data para el perfil del misionero
export const mockMissionCall: MissionCall = {
    id: '1',
    missionName: 'Argentina Buenos Aires Norte',
    missionCountry: 'Argentina',
    callDate: new Date('2023-01-15'),
    reportDate: new Date('2023-06-01'),
    duration: 24,
    needsLanguageLearning: false,
    mtc: {
        mtc_id: 2,
        nombre: "Centro de Capacitación Misional de México",
        ciudad: "Ciudad de México",
        pais: "México",
        latitud: 19.4326,
        longitud: -99.1332,
        idiomas_enseñanza: ["Español", "Inglés"],
        areas_servicio: "Misioneros asignados a Latinoamérica principalmente",
        duracion_estancia_nativo: 3,
        duracion_estancia_idioma: 6,
        capacidad_aprox: 1500,
        url_info: "https://newsroom.churchofjesuschrist.org/article/mexico-mtc-opens-train-hundreds-missionaries",
        observaciones: "Ubicado en los terrenos del antiguo Centro Escolar Benemérito."
    },
    gender: 'elder'
};

// Función para determinar el estado de una etapa
export const getStageStatus = (stage: MissionStage, currentDate: Date, missionCall: MissionCall): MissionStage['status'] => {
    const stageDates = calculateStageDates(missionCall.callDate, missionCall.needsLanguageLearning);

    switch (stage.id) {
        case 'pre-mission':
            if (currentDate >= missionCall.callDate) {
                return currentDate >= stageDates.mtcStart ? 'completed' : 'current';
            }
            return 'locked';

        case 'mtc':
            if (currentDate >= stageDates.mtcStart) {
                return currentDate >= stageDates.mtcEnd ? 'completed' : 'current';
            }
            return 'locked';

        case 'mission-field':
            if (currentDate >= stageDates.missionFieldStart) {
                return currentDate >= stageDates.missionEnd ? 'completed' : 'current';
            }
            return 'locked';

        case 'finishing-mission':
            const finishingStart = new Date(stageDates.missionEnd.getTime() - (3 * 30 * 24 * 60 * 60 * 1000)); // 3 meses antes
            if (currentDate >= finishingStart) {
                return currentDate >= stageDates.missionEnd ? 'completed' : 'current';
            }
            return 'locked';

        case 'after-mission':
            return currentDate >= stageDates.missionEnd ? 'unlocked' : 'locked';

        default:
            return 'locked';
    }
};

// Función para calcular el progreso general
export const calculateOverallProgress = (stages: MissionStage[]): number => {
    const totalStages = stages.length;
    const completedStages = stages.filter(s => s.status === 'completed').length;
    const currentStage = stages.find(s => s.status === 'current');

    let progress = (completedStages / totalStages) * 100;

    if (currentStage) {
        progress += (currentStage.progress / totalStages);
    }

    return Math.min(progress, 100);
};

// Función para generar tareas de la etapa pre-misional
export const generatePreMissionTasks = (): StageTask[] => [
    {
        id: 'read-dc4',
        title: 'Leer Doctrina y Convenios 4',
        description: 'Estudiar la sección que describe las cualidades de un misionero',
        completed: true,
        category: 'spiritual'
    },
    {
        id: 'daily-scripture-study',
        title: 'Estudiar diario en el Libro de Mormón',
        description: 'Leer y estudiar las escrituras diariamente',
        completed: false,
        category: 'spiritual'
    },
    {
        id: 'personal-prayer',
        title: 'Oración personal 2 veces al día',
        description: 'Mantener comunicación constante con el Padre Celestial',
        completed: false,
        category: 'spiritual'
    },
    {
        id: 'family-prayer',
        title: 'Oración familiar 1 vez al día',
        description: 'Participar en oración familiar diaria',
        completed: false,
        category: 'spiritual'
    },
    {
        id: 'priesthood-service',
        title: 'Ejercer el Sacerdocio Aarónico',
        description: 'Participar activamente en ordenanzas y servicio',
        completed: true,
        category: 'ecclesiastical'
    },
    {
        id: 'ward-meetings',
        title: 'Participar en reuniones del barrio',
        description: 'Asistir regularmente a reuniones sacramentales',
        completed: false,
        category: 'ecclesiastical'
    },
    {
        id: 'bishop-interview',
        title: 'Entrevista con el obispo',
        description: 'Completar entrevista de recomendación misional',
        completed: false,
        dueDate: new Date('2025-02-15'),
        category: 'ecclesiastical'
    },
    {
        id: 'mission-clothes',
        title: 'Conseguir ropa formal',
        description: 'Adquirir trajes, camisas y ropa apropiada para la misión',
        completed: true,
        category: 'practical'
    },
    {
        id: 'scriptures',
        title: 'Obtener escrituras',
        description: 'Conseguir ejemplares de las escrituras',
        completed: true,
        category: 'practical'
    },
    {
        id: 'hygiene-items',
        title: 'Artículos de higiene',
        description: 'Preparar artículos de higiene personal',
        completed: false,
        category: 'practical'
    },
    {
        id: 'medications',
        title: 'Medicamentos personales',
        description: 'Preparar medicamentos necesarios',
        completed: false,
        category: 'practical'
    },
    {
        id: 'testimony-sharing',
        title: 'Compartir testimonio',
        description: 'Practicar compartir testimonio en diferentes formas',
        completed: false,
        category: 'communication'
    },
    {
        id: 'language-practice',
        title: 'Práctica de idioma',
        description: 'Practicar frases básicas del idioma de la misión',
        completed: false,
        category: 'communication'
    },
    {
        id: 'teaching-simulation',
        title: 'Simulación de enseñanza',
        description: 'Practicar explicar principios del evangelio',
        completed: false,
        category: 'communication'
    }
];

// Función para generar logros
export const generateAchievements = (): Achievement[] => [
    {
        id: 'constant-prayer',
        title: 'Oración Constante',
        description: '7 días seguidos de oración personal',
        icon: 'fa-solid fa-medal',
        unlocked: true,
        unlockedDate: new Date('2025-01-20'),
        category: 'spiritual'
    },
    {
        id: 'first-testimony',
        title: 'Primer Testimonio',
        description: 'Testimonio escrito completado',
        icon: 'fa-solid fa-award',
        unlocked: true,
        unlockedDate: new Date('2025-01-15'),
        category: 'spiritual'
    },
    {
        id: 'ready-for-mtc',
        title: 'Listo para CCM',
        description: 'Preparación pre-misional completada',
        icon: 'fa-solid fa-star',
        unlocked: false,
        category: 'milestone'
    },
    {
        id: 'complete-preparation',
        title: 'Preparación Completa',
        description: 'Todas las tareas de preparación completadas',
        icon: 'fa-solid fa-crown',
        unlocked: false,
        category: 'milestone'
    }
];
