import { Timestamp } from 'firebase/firestore';

/**
 * Convierte diferentes formatos de fecha a un objeto Date de JavaScript
 * @param dateValue - Valor de fecha que puede ser Timestamp, Date, string o number
 * @returns Objeto Date válido
 */
export const convertFirebaseDate = (dateValue: any): Date => {
    if (!dateValue) {
        return new Date();
    }

    // Firebase Timestamp
    if (typeof dateValue.toDate === 'function') {
        return dateValue.toDate();
    }

    // Already a Date object
    if (dateValue instanceof Date) {
        return dateValue;
    }

    // ISO string
    if (typeof dateValue === 'string') {
        const parsed = new Date(dateValue);
        return isNaN(parsed.getTime()) ? new Date() : parsed;
    }

    // Timestamp number (milliseconds)
    if (typeof dateValue === 'number') {
        return new Date(dateValue);
    }

    // Firestore Timestamp object
    if (dateValue && typeof dateValue.seconds === 'number') {
        return new Date(dateValue.seconds * 1000);
    }

    // Default fallback
    return new Date();
};

/**
 * Convierte un objeto Date a Firebase Timestamp
 * @param date - Objeto Date de JavaScript
 * @returns Firebase Timestamp
 */
export const convertToFirebaseTimestamp = (date: Date): Timestamp => {
    return Timestamp.fromDate(date);
};

/**
 * Formatea una fecha para mostrar en la UI
 * @param date - Objeto Date o valor de fecha
 * @param options - Opciones de formato
 * @returns String formateado
 */
export const formatDate = (
    date: Date | any,
    options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }
): string => {
    const dateObj = convertFirebaseDate(date);
    return dateObj.toLocaleDateString('es-ES', options);
};

/**
 * Formatea una fecha para mostrar solo la fecha (sin hora)
 * @param date - Objeto Date o valor de fecha
 * @returns String formateado
 */
export const formatDateOnly = (date: Date | any): string => {
    return formatDate(date, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

/**
 * Formatea una fecha para mostrar tiempo relativo (ej: "hace 2 horas")
 * @param date - Objeto Date o valor de fecha
 * @returns String formateado
 */
export const formatRelativeTime = (date: Date | any): string => {
    const dateObj = convertFirebaseDate(date);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

    if (diffInSeconds < 60) {
        return 'hace un momento';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `hace ${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''}`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
        return `hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
    }

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
        return `hace ${diffInWeeks} semana${diffInWeeks > 1 ? 's' : ''}`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
        return `hace ${diffInMonths} mes${diffInMonths > 1 ? 'es' : ''}`;
    }

    const diffInYears = Math.floor(diffInDays / 365);
    return `hace ${diffInYears} año${diffInYears > 1 ? 's' : ''}`;
};

/**
 * Valida si una fecha es válida
 * @param date - Valor de fecha a validar
 * @returns true si la fecha es válida
 */
export const isValidDate = (date: any): boolean => {
    if (!date) return false;

    const dateObj = convertFirebaseDate(date);
    return !isNaN(dateObj.getTime());
};

/**
 * Obtiene el inicio del día para una fecha
 * @param date - Objeto Date o valor de fecha
 * @returns Date con hora 00:00:00
 */
export const getStartOfDay = (date: Date | any): Date => {
    const dateObj = convertFirebaseDate(date);
    const startOfDay = new Date(dateObj);
    startOfDay.setHours(0, 0, 0, 0);
    return startOfDay;
};

/**
 * Obtiene el final del día para una fecha
 * @param date - Objeto Date o valor de fecha
 * @returns Date con hora 23:59:59
 */
export const getEndOfDay = (date: Date | any): Date => {
    const dateObj = convertFirebaseDate(date);
    const endOfDay = new Date(dateObj);
    endOfDay.setHours(23, 59, 59, 999);
    return endOfDay;
};
