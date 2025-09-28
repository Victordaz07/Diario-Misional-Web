import { User } from 'firebase/auth';

export interface UserProfile {
    uid: string;
    email: string;
    nombre: string;
    mision: string;
    idioma: string;
    fechaCreacion: Date;
    ultimaActualizacion: Date;
}

export interface DiarioEntry {
    id: string;
    uid: string;
    fecha: Date;
    titulo: string;
    contenido: string;
    sentimientos: string[];
    tags: string[];
    fechaCreacion: Date;
    fechaActualizacion: Date;
}

export interface TrasladoEntry {
    id: string;
    uid: string;
    fechaTraslado: Date;
    desde: string;
    hacia: string;
    motivo: string;
    observaciones: string;
    fechaCreacion: Date;
}

export interface FotoEntry {
    id: string;
    uid: string;
    url: string;
    titulo: string;
    descripcion: string;
    fecha: Date;
    tags: string[];
    fechaCreacion: Date;
}

export interface RecursoEntry {
    id: string;
    titulo: string;
    descripcion: string;
    tipo: 'pdf' | 'video' | 'articulo' | 'audio';
    url: string;
    categoria: string;
    fechaCreacion: Date;
    activo: boolean;
}
