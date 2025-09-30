'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { convertFirebaseDate } from '@/lib/utils';

interface Resource {
    id: string;
    title: string;
    description: string;
    content?: string;
    type: 'pdf' | 'tip' | 'video' | 'scripture';
    category: 'teaching' | 'leadership' | 'study' | 'wellbeing' | 'scriptures';
    downloads?: number;
    views?: number;
    icon: string;
    iconColor: string;
    tagColor: string;
    fileSize?: string;
    language: string;
    createdAt: Date;
    isFavorite?: boolean;
}

interface RecentDownload {
    id: string;
    title: string;
    type: 'pdf' | 'tip' | 'video' | 'scripture';
    downloadedAt: Date;
    icon: string;
    iconColor: string;
}

export default function RecursosPage() {
    const { user } = useAuth();
    const [resources, setResources] = useState<Resource[]>([]);
    const [recentDownloads, setRecentDownloads] = useState<RecentDownload[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
    const [tipModalOpen, setTipModalOpen] = useState(false);
    const [selectedTip, setSelectedTip] = useState<Resource | null>(null);
    const [favorites, setFavorites] = useState<string[]>([]);

    const categories = [
        { key: 'teaching', label: 'Enseñanza', icon: 'fa-solid fa-chalkboard-teacher', color: 'bg-blue-100 text-blue-600', count: 8 },
        { key: 'leadership', label: 'Liderazgo', icon: 'fa-solid fa-users', color: 'bg-purple-100 text-purple-600', count: 5 },
        { key: 'study', label: 'Estudio', icon: 'fa-solid fa-book', color: 'bg-green-100 text-green-600', count: 6 },
        { key: 'wellbeing', label: 'Bienestar', icon: 'fa-solid fa-heart', color: 'bg-orange-100 text-orange-600', count: 4 },
        { key: 'scriptures', label: 'Escrituras', icon: 'fa-solid fa-book-bible', color: 'bg-yellow-100 text-yellow-600', count: 12 },
    ];

    // Cargar recursos
    useEffect(() => {
        console.log('Recursos page mounted, loading resources...');
        loadResources();
        loadRecentDownloads();
    }, []);

    const loadResources = async () => {
        try {
            setLoading(true);

            // Cargar recursos de ejemplo inmediatamente
            console.log('Loading sample resources...');
            loadSampleResources();

            // Intentar cargar desde Firebase también (opcional)
            try {
                const snapshot = await db.collection('resources').orderBy('createdAt', 'desc').get();
                if (snapshot.docs.length > 0) {
                    const resourcesData = snapshot.docs.map((doc: any) => ({
                        id: doc.id,
                        ...doc.data(),
                        createdAt: convertFirebaseDate(doc.data().createdAt)
                    })) as Resource[];

                    console.log('Found', resourcesData.length, 'resources in Firebase');
                    // Combinar recursos de Firebase con los de ejemplo
                    setResources(prevResources => [...resourcesData, ...prevResources]);
                }
            } catch (firebaseError) {
                console.log('Firebase not available, using sample resources only');
            }
        } catch (error) {
            console.error('Error loading resources:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadSampleResources = () => {
        console.log('Loading sample resources...');
        const sampleResources: Resource[] = [
            // CATEGORÍA: ENSEÑANZA (8 recursos)
            {
                id: 'teaching-1',
                title: 'Guía de Enseñanza Efectiva',
                description: 'Técnicas y principios para enseñar con el Espíritu y crear conexiones significativas.',
                content: 'Esta guía te ayudará a desarrollar habilidades de enseñanza efectiva, incluyendo cómo preparar lecciones, hacer preguntas inspiradas y crear un ambiente espiritual.',
                type: 'pdf',
                category: 'teaching',
                downloads: 245,
                icon: 'fa-solid fa-file-pdf',
                iconColor: 'text-red-600',
                tagColor: 'bg-blue-100 text-blue-700',
                fileSize: '2.3 MB',
                language: 'Español',
                createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
                isFavorite: false
            },
            {
                id: 'teaching-2',
                title: 'Tip: Manejo del Tiempo',
                description: 'Consejos prácticos para organizar tu día y maximizar el tiempo de enseñanza.',
                content: 'El manejo efectivo del tiempo es fundamental para maximizar tu impacto como misionero. Incluye técnicas de planificación y priorización.',
                type: 'tip',
                category: 'teaching',
                views: 156,
                icon: 'fa-solid fa-lightbulb',
                iconColor: 'text-yellow-600',
                tagColor: 'bg-green-100 text-green-700',
                language: 'Español',
                createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                isFavorite: true
            },
            {
                id: 'teaching-3',
                title: 'Video: Técnicas de Contacto',
                description: 'Video tutorial sobre cómo abordar a las personas de manera efectiva.',
                content: 'Este video te enseñará técnicas efectivas para hacer contacto inicial con personas en la calle, en sus hogares y en lugares públicos.',
                type: 'video',
                category: 'teaching',
                views: 89,
                icon: 'fa-solid fa-play-circle',
                iconColor: 'text-red-600',
                tagColor: 'bg-red-100 text-red-700',
                fileSize: '45 MB',
                language: 'Español',
                createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
                isFavorite: false
            },
            {
                id: 'teaching-4',
                title: 'Manual de Lecciones Principales',
                description: 'Guía completa para enseñar las lecciones principales del Evangelio.',
                content: 'Manual detallado que incluye objetivos, materiales necesarios y técnicas para enseñar cada lección principal de manera efectiva.',
                type: 'pdf',
                category: 'teaching',
                downloads: 198,
                icon: 'fa-solid fa-file-pdf',
                iconColor: 'text-red-600',
                tagColor: 'bg-blue-100 text-blue-700',
                fileSize: '3.1 MB',
                language: 'Español',
                createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
                isFavorite: false
            },
            {
                id: 'teaching-5',
                title: 'Tip: Hacer Preguntas Inspiradas',
                description: 'Cómo formular preguntas que inviten al Espíritu y fomenten la reflexión.',
                content: 'Las preguntas correctas pueden abrir corazones y mentes. Aprende a hacer preguntas que inviten al Espíritu Santo.',
                type: 'tip',
                category: 'teaching',
                views: 134,
                icon: 'fa-solid fa-lightbulb',
                iconColor: 'text-yellow-600',
                tagColor: 'bg-green-100 text-green-700',
                language: 'Español',
                createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
                isFavorite: true
            },
            {
                id: 'teaching-6',
                title: 'Video: Testificando con Poder',
                description: 'Cómo compartir tu testimonio de manera poderosa y auténtica.',
                content: 'Aprende a compartir tu testimonio personal de manera que toque los corazones y invite al Espíritu Santo.',
                type: 'video',
                category: 'teaching',
                views: 167,
                icon: 'fa-solid fa-play-circle',
                iconColor: 'text-red-600',
                tagColor: 'bg-red-100 text-red-700',
                fileSize: '38 MB',
                language: 'Español',
                createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
                isFavorite: false
            },
            {
                id: 'teaching-7',
                title: 'Guía de Seguimiento',
                description: 'Técnicas para mantener el contacto y seguir el progreso de los investigadores.',
                content: 'El seguimiento efectivo es clave para el progreso. Aprende técnicas para mantener el contacto y ayudar en el progreso.',
                type: 'pdf',
                category: 'teaching',
                downloads: 156,
                icon: 'fa-solid fa-file-pdf',
                iconColor: 'text-red-600',
                tagColor: 'bg-blue-100 text-blue-700',
                fileSize: '1.9 MB',
                language: 'Español',
                createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
                isFavorite: false
            },
            {
                id: 'teaching-8',
                title: 'Tip: Trabajar con Compañeros',
                description: 'Cómo enseñar efectivamente como equipo con tu compañero.',
                content: 'El trabajo en equipo es fundamental. Aprende a complementarte con tu compañero para enseñar más efectivamente.',
                type: 'tip',
                category: 'teaching',
                views: 98,
                icon: 'fa-solid fa-lightbulb',
                iconColor: 'text-yellow-600',
                tagColor: 'bg-green-100 text-green-700',
                language: 'Español',
                createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
                isFavorite: false
            },

            // CATEGORÍA: LIDERAZGO (5 recursos)
            {
                id: 'leadership-1',
                title: 'Manual de Liderazgo',
                description: 'Principios de liderazgo cristiano y desarrollo de habilidades de comunicación.',
                content: 'Este manual cubre los principios fundamentales del liderazgo cristiano, incluyendo servicio, humildad y comunicación efectiva.',
                type: 'pdf',
                category: 'leadership',
                downloads: 189,
                icon: 'fa-solid fa-file-pdf',
                iconColor: 'text-purple-600',
                tagColor: 'bg-purple-100 text-purple-700',
                fileSize: '1.8 MB',
                language: 'Español',
                createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                isFavorite: false
            },
            {
                id: 'leadership-2',
                title: 'Tip: Delegación Efectiva',
                description: 'Cómo delegar responsabilidades y desarrollar a otros misioneros.',
                content: 'La delegación es una habilidad clave del liderazgo. Aprende a delegar de manera que desarrolle a otros y multiplique tu impacto.',
                type: 'tip',
                category: 'leadership',
                views: 112,
                icon: 'fa-solid fa-lightbulb',
                iconColor: 'text-yellow-600',
                tagColor: 'bg-green-100 text-green-700',
                language: 'Español',
                createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
                isFavorite: true
            },
            {
                id: 'leadership-3',
                title: 'Video: Liderazgo por Ejemplo',
                description: 'Cómo liderar a través del ejemplo personal y la integridad.',
                content: 'El mejor liderazgo se da por ejemplo. Aprende a ser un líder que inspira a través de acciones consistentes con principios.',
                type: 'video',
                category: 'leadership',
                views: 145,
                icon: 'fa-solid fa-play-circle',
                iconColor: 'text-red-600',
                tagColor: 'bg-red-100 text-red-700',
                fileSize: '42 MB',
                language: 'Español',
                createdAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000),
                isFavorite: false
            },
            {
                id: 'leadership-4',
                title: 'Guía de Resolución de Conflictos',
                description: 'Técnicas para resolver conflictos y mantener la unidad.',
                content: 'Los conflictos son inevitables, pero se pueden resolver de manera cristiana. Aprende técnicas de resolución de conflictos.',
                type: 'pdf',
                category: 'leadership',
                downloads: 123,
                icon: 'fa-solid fa-file-pdf',
                iconColor: 'text-purple-600',
                tagColor: 'bg-purple-100 text-purple-700',
                fileSize: '2.1 MB',
                language: 'Español',
                createdAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000),
                isFavorite: false
            },
            {
                id: 'leadership-5',
                title: 'Tip: Motivación y Estímulo',
                description: 'Cómo motivar y animar a otros misioneros en momentos difíciles.',
                content: 'El estímulo oportuno puede cambiar el día de alguien. Aprende técnicas para motivar y elevar a otros.',
                type: 'tip',
                category: 'leadership',
                views: 89,
                icon: 'fa-solid fa-lightbulb',
                iconColor: 'text-yellow-600',
                tagColor: 'bg-green-100 text-green-700',
                language: 'Español',
                createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
                isFavorite: false
            },

            // CATEGORÍA: ESTUDIO (6 recursos)
            {
                id: 'study-1',
                title: 'Tip: Estudio Personal',
                description: 'Métodos efectivos para el estudio de las escrituras y la preparación diaria.',
                content: 'El estudio personal es la base de una misión exitosa. Incluye técnicas de estudio, meditación y aplicación.',
                type: 'tip',
                category: 'study',
                views: 203,
                icon: 'fa-solid fa-lightbulb',
                iconColor: 'text-green-600',
                tagColor: 'bg-green-100 text-green-700',
                language: 'Español',
                createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                isFavorite: true
            },
            {
                id: 'study-2',
                title: 'Guía de Estudio de Escrituras',
                description: 'Métodos sistemáticos para estudiar y comprender las escrituras.',
                content: 'Aprende métodos probados para estudiar las escrituras de manera más profunda y obtener mayor comprensión.',
                type: 'pdf',
                category: 'study',
                downloads: 278,
                icon: 'fa-solid fa-file-pdf',
                iconColor: 'text-green-600',
                tagColor: 'bg-green-100 text-green-700',
                fileSize: '2.7 MB',
                language: 'Español',
                createdAt: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000),
                isFavorite: false
            },
            {
                id: 'study-3',
                title: 'Video: Cómo Memorizar Escrituras',
                description: 'Técnicas efectivas para memorizar versículos clave.',
                content: 'La memorización de escrituras te permite tenerlas disponibles cuando las necesites. Aprende técnicas efectivas.',
                type: 'video',
                category: 'study',
                views: 156,
                icon: 'fa-solid fa-play-circle',
                iconColor: 'text-red-600',
                tagColor: 'bg-red-100 text-red-700',
                fileSize: '33 MB',
                language: 'Español',
                createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
                isFavorite: true
            },
            {
                id: 'study-4',
                title: 'Tip: Preparación de Lecciones',
                description: 'Cómo preparar lecciones efectivas usando las escrituras.',
                content: 'La preparación adecuada es clave para enseñar con poder. Aprende a preparar lecciones que inviten al Espíritu.',
                type: 'tip',
                category: 'study',
                views: 167,
                icon: 'fa-solid fa-lightbulb',
                iconColor: 'text-yellow-600',
                tagColor: 'bg-green-100 text-green-700',
                language: 'Español',
                createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
                isFavorite: false
            },
            {
                id: 'study-5',
                title: 'Manual de Doctrina y Convenios',
                description: 'Guía de estudio para entender mejor Doctrina y Convenios.',
                content: 'Doctrina y Convenios contiene revelaciones importantes. Esta guía te ayudará a entender mejor su contexto y aplicación.',
                type: 'pdf',
                category: 'study',
                downloads: 145,
                icon: 'fa-solid fa-file-pdf',
                iconColor: 'text-green-600',
                tagColor: 'bg-green-100 text-green-700',
                fileSize: '1.6 MB',
                language: 'Español',
                createdAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000),
                isFavorite: false
            },
            {
                id: 'study-6',
                title: 'Tip: Estudio en Compañía',
                description: 'Cómo hacer el estudio personal más efectivo con tu compañero.',
                content: 'El estudio en compañía puede ser muy enriquecedor. Aprende técnicas para estudiar juntos de manera efectiva.',
                type: 'tip',
                category: 'study',
                views: 134,
                icon: 'fa-solid fa-lightbulb',
                iconColor: 'text-yellow-600',
                tagColor: 'bg-green-100 text-green-700',
                language: 'Español',
                createdAt: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000),
                isFavorite: false
            },

            // CATEGORÍA: BIENESTAR (4 recursos)
            {
                id: 'wellbeing-1',
                title: 'Guía de Bienestar Emocional',
                description: 'Cómo mantener tu bienestar emocional durante la misión.',
                content: 'La misión puede ser emocionalmente desafiante. Aprende técnicas para mantener tu bienestar emocional y mental.',
                type: 'pdf',
                category: 'wellbeing',
                downloads: 189,
                icon: 'fa-solid fa-file-pdf',
                iconColor: 'text-orange-600',
                tagColor: 'bg-orange-100 text-orange-700',
                fileSize: '2.4 MB',
                language: 'Español',
                createdAt: new Date(Date.now() - 26 * 24 * 60 * 60 * 1000),
                isFavorite: true
            },
            {
                id: 'wellbeing-2',
                title: 'Tip: Manejo del Estrés',
                description: 'Técnicas para manejar el estrés y la presión de la misión.',
                content: 'El estrés es normal en la misión, pero se puede manejar. Aprende técnicas efectivas para reducir el estrés.',
                type: 'tip',
                category: 'wellbeing',
                views: 178,
                icon: 'fa-solid fa-lightbulb',
                iconColor: 'text-yellow-600',
                tagColor: 'bg-green-100 text-green-700',
                language: 'Español',
                createdAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
                isFavorite: false
            },
            {
                id: 'wellbeing-3',
                title: 'Video: Ejercicios para Misioneros',
                description: 'Rutinas de ejercicio que puedes hacer en tu apartamento.',
                content: 'Mantenerte físicamente activo es importante para tu bienestar. Aprende rutinas de ejercicio que puedes hacer en casa.',
                type: 'video',
                category: 'wellbeing',
                views: 145,
                icon: 'fa-solid fa-play-circle',
                iconColor: 'text-red-600',
                tagColor: 'bg-red-100 text-red-700',
                fileSize: '52 MB',
                language: 'Español',
                createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                isFavorite: false
            },
            {
                id: 'wellbeing-4',
                title: 'Tip: Comunicación con la Familia',
                description: 'Cómo mantener relaciones saludables con tu familia durante la misión.',
                content: 'Mantener una buena relación con tu familia es importante. Aprende a comunicarte de manera efectiva y saludable.',
                type: 'tip',
                category: 'wellbeing',
                views: 156,
                icon: 'fa-solid fa-lightbulb',
                iconColor: 'text-yellow-600',
                tagColor: 'bg-green-100 text-green-700',
                language: 'Español',
                createdAt: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000),
                isFavorite: false
            },

            // CATEGORÍA: ESCRITURAS (12 recursos)
            {
                id: 'scriptures-1',
                title: 'Versículos Clave para la Enseñanza',
                description: 'Colección de versículos organizados por temas para usar en las enseñanzas.',
                content: 'Esta colección incluye versículos organizados por temas comunes que surgen en las enseñanzas, con explicaciones y contexto.',
                type: 'scripture',
                category: 'scriptures',
                downloads: 312,
                icon: 'fa-solid fa-book-bible',
                iconColor: 'text-yellow-600',
                tagColor: 'bg-yellow-100 text-yellow-700',
                fileSize: '1.2 MB',
                language: 'Español',
                createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                isFavorite: false
            },
            {
                id: 'scriptures-2',
                title: 'El Libro de Mormón - Guía de Estudio',
                description: 'Guía completa para estudiar El Libro de Mormón capítulo por capítulo.',
                content: 'Esta guía te ayudará a entender mejor El Libro de Mormón con explicaciones, contexto histórico y aplicaciones modernas.',
                type: 'pdf',
                category: 'scriptures',
                downloads: 456,
                icon: 'fa-solid fa-file-pdf',
                iconColor: 'text-yellow-600',
                tagColor: 'bg-yellow-100 text-yellow-700',
                fileSize: '3.8 MB',
                language: 'Español',
                createdAt: new Date(Date.now() - 34 * 24 * 60 * 60 * 1000),
                isFavorite: true
            },
            {
                id: 'scriptures-3',
                title: 'Tip: Aplicar Escrituras a la Vida',
                description: 'Cómo ayudar a otros a aplicar las escrituras a su vida diaria.',
                content: 'Las escrituras deben aplicarse a la vida diaria. Aprende técnicas para ayudar a otros a hacer esta conexión.',
                type: 'tip',
                category: 'scriptures',
                views: 234,
                icon: 'fa-solid fa-lightbulb',
                iconColor: 'text-yellow-600',
                tagColor: 'bg-green-100 text-green-700',
                language: 'Español',
                createdAt: new Date(Date.now() - 36 * 24 * 60 * 60 * 1000),
                isFavorite: false
            },
            {
                id: 'scriptures-4',
                title: 'Video: Historia del Libro de Mormón',
                description: 'Video educativo sobre la historia y origen del Libro de Mormón.',
                content: 'Entender la historia del Libro de Mormón te ayudará a enseñarlo mejor. Este video cubre su origen y preservación.',
                type: 'video',
                category: 'scriptures',
                views: 189,
                icon: 'fa-solid fa-play-circle',
                iconColor: 'text-red-600',
                tagColor: 'bg-red-100 text-red-700',
                fileSize: '48 MB',
                language: 'Español',
                createdAt: new Date(Date.now() - 38 * 24 * 60 * 60 * 1000),
                isFavorite: false
            },
            {
                id: 'scriptures-5',
                title: 'Versículos sobre la Fe',
                description: 'Colección de versículos sobre la fe organizados por temas.',
                content: 'La fe es un principio fundamental. Esta colección incluye versículos sobre diferentes aspectos de la fe.',
                type: 'scripture',
                category: 'scriptures',
                downloads: 267,
                icon: 'fa-solid fa-book-bible',
                iconColor: 'text-yellow-600',
                tagColor: 'bg-yellow-100 text-yellow-700',
                fileSize: '0.8 MB',
                language: 'Español',
                createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
                isFavorite: false
            },
            {
                id: 'scriptures-6',
                title: 'Tip: Enseñar con Escrituras',
                description: 'Cómo usar las escrituras efectivamente en tus enseñanzas.',
                content: 'Las escrituras son la base de toda enseñanza. Aprende técnicas para usarlas de manera más efectiva.',
                type: 'tip',
                category: 'scriptures',
                views: 198,
                icon: 'fa-solid fa-lightbulb',
                iconColor: 'text-yellow-600',
                tagColor: 'bg-green-100 text-green-700',
                language: 'Español',
                createdAt: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000),
                isFavorite: true
            },
            {
                id: 'scriptures-7',
                title: 'Versículos sobre la Oración',
                description: 'Colección de versículos sobre la oración y su importancia.',
                content: 'La oración es fundamental en la vida cristiana. Esta colección incluye versículos sobre diferentes aspectos de la oración.',
                type: 'scripture',
                category: 'scriptures',
                downloads: 189,
                icon: 'fa-solid fa-book-bible',
                iconColor: 'text-yellow-600',
                tagColor: 'bg-yellow-100 text-yellow-700',
                fileSize: '0.6 MB',
                language: 'Español',
                createdAt: new Date(Date.now() - 44 * 24 * 60 * 60 * 1000),
                isFavorite: false
            },
            {
                id: 'scriptures-8',
                title: 'Video: El Plan de Salvación',
                description: 'Video explicativo sobre el Plan de Salvación usando las escrituras.',
                content: 'El Plan de Salvación es fundamental. Este video lo explica usando las escrituras de manera clara y comprensible.',
                type: 'video',
                category: 'scriptures',
                views: 267,
                icon: 'fa-solid fa-play-circle',
                iconColor: 'text-red-600',
                tagColor: 'bg-red-100 text-red-700',
                fileSize: '55 MB',
                language: 'Español',
                createdAt: new Date(Date.now() - 46 * 24 * 60 * 60 * 1000),
                isFavorite: false
            },
            {
                id: 'scriptures-9',
                title: 'Versículos sobre la Familia',
                description: 'Colección de versículos sobre la familia eterna y el matrimonio.',
                content: 'La familia es central en el plan de Dios. Esta colección incluye versículos sobre la familia eterna y el matrimonio.',
                type: 'scripture',
                category: 'scriptures',
                downloads: 234,
                icon: 'fa-solid fa-book-bible',
                iconColor: 'text-yellow-600',
                tagColor: 'bg-yellow-100 text-yellow-700',
                fileSize: '0.7 MB',
                language: 'Español',
                createdAt: new Date(Date.now() - 48 * 24 * 60 * 60 * 1000),
                isFavorite: false
            },
            {
                id: 'scriptures-10',
                title: 'Tip: Contexto Histórico',
                description: 'Cómo usar el contexto histórico para enseñar las escrituras.',
                content: 'Entender el contexto histórico enriquece el estudio de las escrituras. Aprende a usar esta información en tus enseñanzas.',
                type: 'tip',
                category: 'scriptures',
                views: 145,
                icon: 'fa-solid fa-lightbulb',
                iconColor: 'text-yellow-600',
                tagColor: 'bg-green-100 text-green-700',
                language: 'Español',
                createdAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000),
                isFavorite: false
            },
            {
                id: 'scriptures-11',
                title: 'Versículos sobre el Arrepentimiento',
                description: 'Colección de versículos sobre el arrepentimiento y la conversión.',
                content: 'El arrepentimiento es un principio fundamental. Esta colección incluye versículos sobre el arrepentimiento y la conversión.',
                type: 'scripture',
                category: 'scriptures',
                downloads: 198,
                icon: 'fa-solid fa-book-bible',
                iconColor: 'text-yellow-600',
                tagColor: 'bg-yellow-100 text-yellow-700',
                fileSize: '0.5 MB',
                language: 'Español',
                createdAt: new Date(Date.now() - 52 * 24 * 60 * 60 * 1000),
                isFavorite: false
            },
            {
                id: 'scriptures-12',
                title: 'Video: La Expiación',
                description: 'Video explicativo sobre la Expiación de Jesucristo.',
                content: 'La Expiación es el evento más importante en la historia. Este video la explica de manera clara y conmovedora.',
                type: 'video',
                category: 'scriptures',
                views: 312,
                icon: 'fa-solid fa-play-circle',
                iconColor: 'text-red-600',
                tagColor: 'bg-red-100 text-red-700',
                fileSize: '62 MB',
                language: 'Español',
                createdAt: new Date(Date.now() - 54 * 24 * 60 * 60 * 1000),
                isFavorite: true
            },
            {
                id: 'scriptures-13',
                title: 'Versículos sobre el Bautismo',
                description: 'Colección de versículos sobre el bautismo y los convenios.',
                content: 'El bautismo es el primer convenio. Esta colección incluye versículos sobre el bautismo y los convenios bautismales.',
                type: 'scripture',
                category: 'scriptures',
                downloads: 167,
                icon: 'fa-solid fa-book-bible',
                iconColor: 'text-yellow-600',
                tagColor: 'bg-yellow-100 text-yellow-700',
                fileSize: '0.4 MB',
                language: 'Español',
                createdAt: new Date(Date.now() - 56 * 24 * 60 * 60 * 1000),
                isFavorite: false
            }
        ];
        console.log('Setting resources:', sampleResources.length, 'resources loaded');
        setResources(sampleResources);
    };

    const loadRecentDownloads = () => {
        const sampleDownloads: RecentDownload[] = [
            {
                id: 'download-1',
                title: 'Guía de Enseñanza Efectiva',
                type: 'pdf',
                downloadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                icon: 'fa-solid fa-file-pdf',
                iconColor: 'text-red-600',
            },
            {
                id: 'download-2',
                title: 'Manual de Liderazgo',
                type: 'pdf',
                downloadedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                icon: 'fa-solid fa-file-pdf',
                iconColor: 'text-purple-600',
            },
            {
                id: 'download-3',
                title: 'Versículos Clave para la Enseñanza',
                type: 'scripture',
                downloadedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                icon: 'fa-solid fa-book-bible',
                iconColor: 'text-yellow-600',
            }
        ];
        setRecentDownloads(sampleDownloads);
    };

    const getTimeAgo = (date: Date): string => {
        const now = new Date();
        const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) return 'Hoy';
        if (diffInDays === 1) return 'Ayer';
        if (diffInDays < 7) return `Hace ${diffInDays} días`;
        if (diffInDays < 30) {
            const weeks = Math.floor(diffInDays / 7);
            return `Hace ${weeks} semana${weeks > 1 ? 's' : ''}`;
        }
        const months = Math.floor(diffInDays / 30);
        return `Hace ${months} mes${months > 1 ? 'es' : ''}`;
    };

    const filteredResources = resources.filter(resource => {
        const matchesSearch = searchTerm === '' ||
            resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            resource.content.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = selectedType === 'all' || resource.type === selectedType;
        const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
        const matchesFavorites = !showFavoritesOnly || resource.isFavorite;

        return matchesSearch && matchesType && matchesCategory && matchesFavorites;
    });

    // Debug log para verificar recursos
    useEffect(() => {
        console.log('Resources state updated:', resources.length, 'total resources');
        console.log('Filtered resources:', filteredResources.length, 'filtered resources');
        console.log('Selected category:', selectedCategory);
        console.log('Selected type:', selectedType);
        console.log('Search term:', searchTerm);
    }, [resources, filteredResources, selectedCategory, selectedType, searchTerm]);

    const handleTipClick = (resource: Resource) => {
        if (resource.type === 'tip') {
            setSelectedTip(resource);
            setTipModalOpen(true);
        }
    };

    const handleDownload = async (resource: Resource) => {
        try {
            // Simular descarga
            console.log(`Downloading ${resource.title}`);

            // Actualizar contador de descargas
            if (resource.downloads !== undefined) {
                const updatedResource = { ...resource, downloads: resource.downloads + 1 };
                await db.collection('resources').doc(resource.id).update({ downloads: updatedResource.downloads });
                setResources(resources.map(r => r.id === resource.id ? updatedResource : r));
            }

            // Agregar a descargas recientes
            const newDownload: RecentDownload = {
                id: `download-${resource.id}-${Date.now()}`,
                title: resource.title,
                type: resource.type,
                downloadedAt: new Date(),
                icon: resource.icon,
                iconColor: resource.iconColor
            };
            setRecentDownloads([newDownload, ...recentDownloads.slice(0, 4)]);
        } catch (error) {
            console.error('Error downloading resource:', error);
        }
    };

    const handleView = (resource: Resource) => {
        if (resource.views !== undefined) {
            const updatedResource = { ...resource, views: resource.views + 1 };
            setResources(resources.map(r => r.id === resource.id ? updatedResource : r));
        }
    };

    const toggleFavorite = async (resourceId: string) => {
        try {
            const resource = resources.find(r => r.id === resourceId);
            if (resource) {
                const updatedResource = { ...resource, isFavorite: !resource.isFavorite };
                await db.collection('resources').doc(resourceId).update({ isFavorite: updatedResource.isFavorite });
                setResources(resources.map(r => r.id === resourceId ? updatedResource : r));
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'pdf': return 'fa-solid fa-file-pdf';
            case 'tip': return 'fa-solid fa-lightbulb';
            case 'video': return 'fa-solid fa-play-circle';
            case 'scripture': return 'fa-solid fa-book-bible';
            default: return 'fa-solid fa-file';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'pdf': return 'text-red-600';
            case 'tip': return 'text-yellow-600';
            case 'video': return 'text-red-600';
            case 'scripture': return 'text-yellow-600';
            default: return 'text-gray-600';
        }
    };

    const getTypeBgColor = (type: string) => {
        switch (type) {
            case 'pdf': return 'bg-red-100';
            case 'tip': return 'bg-yellow-100';
            case 'video': return 'bg-red-100';
            case 'scripture': return 'bg-yellow-100';
            default: return 'bg-gray-100';
        }
    };

    return (
        <div className="p-4">
            {/* Header Section */}
            <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                        <i className="fa-solid fa-folder text-white text-lg"></i>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Recursos Misionales</h2>
                        <p className="text-gray-600">{resources.length} recursos disponibles</p>
                    </div>
                </div>
            </section>

            {/* Search and Filters */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <i className="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                            <input
                                type="text"
                                placeholder="Buscar recursos..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                            className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm transition-colors ${showFavoritesOnly
                                    ? 'bg-yellow-100 border-yellow-300 text-yellow-700'
                                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <i className={`fa-solid fa-star mr-1 ${showFavoritesOnly ? 'text-yellow-500' : 'text-gray-400'}`}></i>
                            Favoritos
                        </button>
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                        >
                            <option value="all">Todos los tipos</option>
                            <option value="pdf">PDFs</option>
                            <option value="tip">Tips</option>
                            <option value="video">Videos</option>
                            <option value="scripture">Escrituras</option>
                        </select>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                        >
                            <option value="all">Todas las categorías</option>
                            <option value="teaching">Enseñanza</option>
                            <option value="leadership">Liderazgo</option>
                            <option value="study">Estudio</option>
                            <option value="wellbeing">Bienestar</option>
                            <option value="scriptures">Escrituras</option>
                        </select>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Por Categorías</h3>
                    {selectedCategory !== 'all' && (
                        <button
                            onClick={() => setSelectedCategory('all')}
                            className="text-sm text-primary hover:text-primary/80 flex items-center space-x-1"
                        >
                            <i className="fa-solid fa-times"></i>
                            <span>Limpiar filtro</span>
                        </button>
                    )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {categories.map((category) => {
                        const isSelected = selectedCategory === category.key;
                        const actualCount = resources.filter(r => r.category === category.key).length;

                        return (
                            <div
                                key={category.key}
                                className={`p-4 rounded-lg border text-center hover:shadow-md transition-all cursor-pointer ${isSelected
                                    ? 'bg-primary/5 border-primary shadow-md'
                                    : 'bg-white border-gray-200'
                                    }`}
                                onClick={() => setSelectedCategory(category.key)}
                            >
                                <div className={`w-10 h-10 ${category.color} rounded-lg mx-auto mb-2 flex items-center justify-center ${isSelected ? 'ring-2 ring-primary/20' : ''
                                    }`}>
                                    <i className={category.icon}></i>
                                </div>
                                <h4 className={`text-sm font-medium ${isSelected ? 'text-primary' : 'text-gray-800'
                                    }`}>
                                    {category.label}
                                </h4>
                                <p className={`text-xs mt-1 ${isSelected ? 'text-primary/70' : 'text-gray-500'
                                    }`}>
                                    {actualCount} recursos
                                </p>
                                {isSelected && (
                                    <div className="mt-2">
                                        <div className="w-2 h-2 bg-primary rounded-full mx-auto"></div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Active Filters */}
            {(searchTerm || selectedType !== 'all' || selectedCategory !== 'all' || showFavoritesOnly) && (
                <section className="mb-4">
                    <div className="flex items-center flex-wrap gap-2">
                        <span className="text-sm text-gray-600">Filtros activos:</span>
                        {searchTerm && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                <i className="fa-solid fa-search mr-1"></i>
                                "{searchTerm}"
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="ml-2 text-blue-600 hover:text-blue-800"
                                >
                                    <i className="fa-solid fa-times"></i>
                                </button>
                            </span>
                        )}
                        {selectedType !== 'all' && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <i className="fa-solid fa-tag mr-1"></i>
                                Tipo: {selectedType === 'pdf' ? 'PDF' : selectedType === 'tip' ? 'Tip' : selectedType === 'video' ? 'Video' : 'Escritura'}
                                <button
                                    onClick={() => setSelectedType('all')}
                                    className="ml-2 text-green-600 hover:text-green-800"
                                >
                                    <i className="fa-solid fa-times"></i>
                                </button>
                            </span>
                        )}
                        {selectedCategory !== 'all' && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                <i className="fa-solid fa-folder mr-1"></i>
                                Categoría: {categories.find(c => c.key === selectedCategory)?.label}
                                <button
                                    onClick={() => setSelectedCategory('all')}
                                    className="ml-2 text-purple-600 hover:text-purple-800"
                                >
                                    <i className="fa-solid fa-times"></i>
                                </button>
                            </span>
                        )}
                        {showFavoritesOnly && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                <i className="fa-solid fa-star mr-1"></i>
                                Solo favoritos
                                <button
                                    onClick={() => setShowFavoritesOnly(false)}
                                    className="ml-2 text-yellow-600 hover:text-yellow-800"
                                >
                                    <i className="fa-solid fa-times"></i>
                                </button>
                            </span>
                        )}
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedType('all');
                                setSelectedCategory('all');
                                setShowFavoritesOnly(false);
                            }}
                            className="text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1"
                        >
                            <i className="fa-solid fa-trash"></i>
                            <span>Limpiar todo</span>
                        </button>
                    </div>
                </section>
            )}

            {/* Resources Grid */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-sm text-gray-500 mt-2">Cargando recursos...</p>
                </div>
            ) : filteredResources.length > 0 ? (
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-800">
                            {selectedCategory !== 'all' ?
                                `Recursos de ${categories.find(c => c.key === selectedCategory)?.label}` :
                                'Recursos Disponibles'
                            }
                        </h3>
                        <span className="text-sm text-gray-500">{filteredResources.length} recursos encontrados</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredResources.map((resource) => (
                            <div key={resource.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                                <div className="p-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className={`w-12 h-12 ${getTypeBgColor(resource.type)} rounded-lg flex items-center justify-center`}>
                                            <i className={`${getTypeIcon(resource.type)} ${getTypeColor(resource.type)} text-xl`}></i>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => toggleFavorite(resource.id)}
                                                className={`p-1 rounded-full transition-colors ${resource.isFavorite
                                                    ? 'text-yellow-500 hover:text-yellow-600'
                                                    : 'text-gray-400 hover:text-yellow-500'
                                                    }`}
                                            >
                                                <i className={`fa-solid ${resource.isFavorite ? 'fa-star' : 'fa-star-o'}`}></i>
                                            </button>
                                            <span className={`text-xs px-2 py-1 rounded-full ${resource.tagColor}`}>
                                                {resource.type === 'pdf' ? 'PDF' :
                                                    resource.type === 'tip' ? 'Tip' :
                                                        resource.type === 'video' ? 'Video' : 'Escritura'}
                                            </span>
                                        </div>
                                    </div>

                                    <h4 className="font-semibold text-gray-800 mb-2 line-clamp-2">{resource.title}</h4>
                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{resource.description}</p>

                                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                                        <div className="flex items-center space-x-3">
                                            {resource.downloads !== undefined ? (
                                                <span className="flex items-center space-x-1">
                                                    <i className="fa-solid fa-download"></i>
                                                    <span>{resource.downloads}</span>
                                                </span>
                                            ) : (
                                                <span className="flex items-center space-x-1">
                                                    <i className="fa-solid fa-eye"></i>
                                                    <span>{resource.views}</span>
                                                </span>
                                            )}
                                            {resource.fileSize && (
                                                <span>{resource.fileSize}</span>
                                            )}
                                        </div>
                                        <span className="text-xs text-gray-400">{getTimeAgo(resource.createdAt)}</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-500">{resource.language}</span>
                                        <button
                                            onClick={() => resource.type === 'tip' ? handleTipClick(resource) : handleDownload(resource)}
                                            className="text-primary hover:text-primary/80 text-sm font-medium cursor-pointer"
                                        >
                                            <i className={`fa-solid ${resource.type === 'tip' ? 'fa-eye' : 'fa-download'} mr-1`}></i>
                                            {resource.type === 'tip' ? 'Ver tip' : 'Descargar'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            ) : (
                <div className="text-center py-12">
                    <i className="fa-solid fa-folder-open text-4xl text-gray-400 mb-4"></i>
                    <h3 className="text-lg font-medium text-gray-600 mb-2">No se encontraron recursos</h3>
                    <p className="text-gray-500">Intenta ajustar los filtros de búsqueda</p>
                </div>
            )}

            {/* Recent Downloads */}
            {recentDownloads.length > 0 && (
                <section className="mt-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="p-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800">Descargas Recientes</h3>
                        </div>
                        <div className="p-4 space-y-3">
                            {recentDownloads.map((download) => (
                                <div key={download.id} className="flex items-center space-x-3">
                                    <div className={`w-8 h-8 ${getTypeBgColor(download.type)} rounded-lg flex items-center justify-center`}>
                                        <i className={`${download.icon} ${getTypeColor(download.type)} text-sm`}></i>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-800">{download.title}</p>
                                        <p className="text-xs text-gray-500">{getTimeAgo(download.downloadedAt)}</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            const resource = resources.find(r => r.id === download.id);
                                            if (resource) handleDownload(resource);
                                        }}
                                        className="text-gray-400 hover:text-gray-600 cursor-pointer"
                                    >
                                        <i className="fa-solid fa-download"></i>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Tip Modal */}
            {tipModalOpen && selectedTip && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                                        <i className="fa-solid fa-lightbulb text-yellow-600"></i>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800">{selectedTip.title}</h3>
                                </div>
                                <button
                                    onClick={() => setTipModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-600 cursor-pointer"
                                >
                                    <i className="fa-solid fa-times"></i>
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="space-y-4">
                                <p className="text-gray-700 leading-relaxed">
                                    {selectedTip.content || selectedTip.description}
                                </p>

                                {selectedTip.title.includes('Manejo del Tiempo') && (
                                    <>
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <h4 className="font-medium text-blue-900 mb-2">🌅 Rutina Matutina</h4>
                                            <p className="text-sm text-blue-800">Levántate temprano y dedica tiempo al estudio personal antes de comenzar las actividades del día.</p>
                                        </div>

                                        <div className="bg-green-50 p-4 rounded-lg">
                                            <h4 className="font-medium text-green-900 mb-2">📋 Planificación Semanal</h4>
                                            <p className="text-sm text-green-800">Dedica tiempo cada domingo para planificar la semana, establecer metas y revisar el progreso.</p>
                                        </div>

                                        <div className="bg-purple-50 p-4 rounded-lg">
                                            <h4 className="font-medium text-purple-900 mb-2">⏰ Bloques de Tiempo</h4>
                                            <p className="text-sm text-purple-800">Organiza tu día en bloques dedicados a actividades específicas: estudio, enseñanza, servicio.</p>
                                        </div>
                                    </>
                                )}

                                {selectedTip.title.includes('Estudio Personal') && (
                                    <>
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <h4 className="font-medium text-blue-900 mb-2">📖 Lectura Diaria</h4>
                                            <p className="text-sm text-blue-800">Dedica al menos 30 minutos diarios al estudio de las escrituras.</p>
                                        </div>

                                        <div className="bg-green-50 p-4 rounded-lg">
                                            <h4 className="font-medium text-green-900 mb-2">✍️ Tomar Notas</h4>
                                            <p className="text-sm text-green-800">Escribe tus impresiones y pensamientos mientras estudias.</p>
                                        </div>

                                        <div className="bg-purple-50 p-4 rounded-lg">
                                            <h4 className="font-medium text-purple-900 mb-2">🙏 Oración</h4>
                                            <p className="text-sm text-purple-800">Comienza y termina tu estudio con oración para recibir guía.</p>
                                        </div>
                                    </>
                                )}

                                <p className="text-sm text-gray-600 italic">
                                    "El estudio personal es la base de una misión exitosa." - Recuerda dedicar tiempo diario al estudio.
                                </p>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-200">
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setTipModalOpen(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                    Cerrar
                                </button>
                                <button
                                    onClick={() => {
                                        handleView(selectedTip);
                                        setTipModalOpen(false);
                                    }}
                                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
                                >
                                    <i className="fa-solid fa-bookmark mr-2"></i>
                                    Guardar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}