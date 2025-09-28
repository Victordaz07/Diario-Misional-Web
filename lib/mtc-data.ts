export interface MTC {
    mtc_id: number;
    nombre: string;
    ciudad: string;
    pais: string;
    latitud: number;
    longitud: number;
    idiomas_enseñanza: string[];
    areas_servicio: string;
    duracion_estancia_nativo: number; // semanas
    duracion_estancia_idioma: number; // semanas
    capacidad_aprox: number;
    url_info: string;
    observaciones: string;
}

export interface MTCData {
    last_update: string;
    total_centros: number;
    mtcs: MTC[];
}

export const mtcData: MTCData = {
    "last_update": "2025-01-27",
    "total_centros": 9,
    "mtcs": [
        {
            "mtc_id": 1,
            "nombre": "Provo Missionary Training Center",
            "ciudad": "Provo",
            "pais": "Estados Unidos",
            "latitud": 40.2444,
            "longitud": -111.6608,
            "idiomas_enseñanza": ["Inglés", "Español", "Francés", "Portugués", "Alemán", "Ruso", "Japonés", "Coreano", "Chino Mandarín", "Otros"],
            "areas_servicio": "Misioneros de todo el mundo",
            "duracion_estancia_nativo": 3,
            "duracion_estancia_idioma": 6,
            "capacidad_aprox": 3000,
            "url_info": "https://www.churchofjesuschrist.org/callings/missionary/provo-missionary-training-center?lang=spa",
            "observaciones": "El centro más grande del mundo, sirve a miles de misioneros al año."
        },
        {
            "mtc_id": 2,
            "nombre": "Centro de Capacitación Misional de México",
            "ciudad": "Ciudad de México",
            "pais": "México",
            "latitud": 19.4326,
            "longitud": -99.1332,
            "idiomas_enseñanza": ["Español", "Inglés"],
            "areas_servicio": "Misioneros asignados a Latinoamérica principalmente",
            "duracion_estancia_nativo": 3,
            "duracion_estancia_idioma": 6,
            "capacidad_aprox": 1500,
            "url_info": "https://newsroom.churchofjesuschrist.org/article/mexico-mtc-opens-train-hundreds-missionaries",
            "observaciones": "Ubicado en los terrenos del antiguo Centro Escolar Benemérito."
        },
        {
            "mtc_id": 3,
            "nombre": "Centro de Capacitación Misional de Ghana",
            "ciudad": "Accra",
            "pais": "Ghana",
            "latitud": 5.6037,
            "longitud": -0.187,
            "idiomas_enseñanza": ["Inglés", "Francés"],
            "areas_servicio": "África Occidental principalmente",
            "duracion_estancia_nativo": 3,
            "duracion_estancia_idioma": 6,
            "capacidad_aprox": 400,
            "url_info": "https://newsroom.churchofjesuschrist.org/topic/missionary-training-centers",
            "observaciones": "Atiende misioneros de África y otras regiones de habla inglesa y francesa."
        },
        {
            "mtc_id": 4,
            "nombre": "Centro de Capacitación Misional de Inglaterra",
            "ciudad": "Preston",
            "pais": "Reino Unido",
            "latitud": 53.7632,
            "longitud": -2.7031,
            "idiomas_enseñanza": ["Inglés", "Otros europeos"],
            "areas_servicio": "Europa",
            "duracion_estancia_nativo": 3,
            "duracion_estancia_idioma": 6,
            "capacidad_aprox": 300,
            "url_info": "https://www.churchofjesuschrist.org/callings/missionary/missionary-training-centers?lang=spa",
            "observaciones": "Ubicado cerca del Templo de Preston Inglaterra."
        },
        {
            "mtc_id": 5,
            "nombre": "Centro de Capacitación Misional de Perú",
            "ciudad": "Lima",
            "pais": "Perú",
            "latitud": -12.0464,
            "longitud": -77.0428,
            "idiomas_enseñanza": ["Español", "Inglés"],
            "areas_servicio": "Sudamérica",
            "duracion_estancia_nativo": 3,
            "duracion_estancia_idioma": 6,
            "capacidad_aprox": 500,
            "url_info": "https://newsroom.churchofjesuschrist.org/topic/missionary-training-centers",
            "observaciones": "Recibe misioneros de Sudamérica y otros países de habla hispana."
        },
        {
            "mtc_id": 6,
            "nombre": "Centro de Capacitación Misional de Nueva Zelanda",
            "ciudad": "Auckland",
            "pais": "Nueva Zelanda",
            "latitud": -36.8485,
            "longitud": 174.7633,
            "idiomas_enseñanza": ["Inglés", "Maorí", "Otros del Pacífico"],
            "areas_servicio": "Pacífico Sur",
            "duracion_estancia_nativo": 3,
            "duracion_estancia_idioma": 6,
            "capacidad_aprox": 200,
            "url_info": "https://newsroom.churchofjesuschrist.org/article/new-leaders-called-for-10-mtcs-around-the-world",
            "observaciones": "Entrena misioneros que sirven en Oceanía."
        },
        {
            "mtc_id": 7,
            "nombre": "Centro de Capacitación Misional de Filipinas",
            "ciudad": "Manila",
            "pais": "Filipinas",
            "latitud": 14.5995,
            "longitud": 120.9842,
            "idiomas_enseñanza": ["Inglés", "Tagalo"],
            "areas_servicio": "Filipinas y Asia",
            "duracion_estancia_nativo": 3,
            "duracion_estancia_idioma": 6,
            "capacidad_aprox": 300,
            "url_info": "https://newsroom.churchofjesuschrist.org/article/new-leaders-called-for-10-mtcs-around-the-world",
            "observaciones": "Ubicado cerca del Templo de Manila Filipinas."
        },
        {
            "mtc_id": 8,
            "nombre": "Centro de Capacitación Misional de Sudáfrica",
            "ciudad": "Johannesburgo",
            "pais": "Sudáfrica",
            "latitud": -26.2041,
            "longitud": 28.0473,
            "idiomas_enseñanza": ["Inglés"],
            "areas_servicio": "África Austral",
            "duracion_estancia_nativo": 3,
            "duracion_estancia_idioma": 6,
            "capacidad_aprox": 100,
            "url_info": "https://newsroom.churchofjesuschrist.org/article/new-leaders-called-for-10-mtcs-around-the-world",
            "observaciones": "Entrena a misioneros que sirven en África del Sur y países cercanos."
        },
        {
            "mtc_id": 9,
            "nombre": "Centro de Capacitación Misional de Tailandia",
            "ciudad": "Bangkok",
            "pais": "Tailandia",
            "latitud": 13.7563,
            "longitud": 100.5018,
            "idiomas_enseñanza": ["Tailandés", "Inglés"],
            "areas_servicio": "Asia Sudeste",
            "duracion_estancia_nativo": 3,
            "duracion_estancia_idioma": 6,
            "capacidad_aprox": 150,
            "url_info": "https://newsroom.churchofjesuschrist.org/article/new-leaders-called-for-10-mtcs-around-the-world",
            "observaciones": "El más nuevo, inaugurado para atender a misioneros de Asia sudoriental."
        }
    ]
};

// Función para encontrar MTC por nombre o país
export const findMTC = (searchTerm: string): MTC | undefined => {
    return mtcData.mtcs.find(mtc =>
        mtc.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mtc.pais.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mtc.ciudad.toLowerCase().includes(searchTerm.toLowerCase())
    );
};

// Función para calcular duración de CCM basada en idioma
export const calculateMTCDuration = (needsLanguageLearning: boolean): number => {
    return needsLanguageLearning ? 12 : 6; // semanas
};

// Función para calcular fechas de etapas
export const calculateStageDates = (missionCallDate: Date, needsLanguageLearning: boolean) => {
    const mtcDuration = calculateMTCDuration(needsLanguageLearning);

    return {
        preMissionStart: missionCallDate,
        mtcStart: new Date(missionCallDate.getTime() + (7 * 24 * 60 * 60 * 1000)), // 1 semana antes
        mtcEnd: new Date(missionCallDate.getTime() + ((7 + mtcDuration) * 24 * 60 * 60 * 1000)),
        missionFieldStart: new Date(missionCallDate.getTime() + ((7 + mtcDuration) * 24 * 60 * 60 * 1000)),
        missionEnd: new Date(missionCallDate.getTime() + ((7 + mtcDuration + 24 * 4) * 24 * 60 * 60 * 1000)), // 24 meses después
    };
};
