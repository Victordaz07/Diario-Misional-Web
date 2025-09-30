// Traductor de errores de Firebase al español
export const translateFirebaseError = (error: any): string => {
    const errorCode = error?.code || '';

    const errorMessages: { [key: string]: string } = {
        // Errores de autenticación
        'auth/email-already-in-use': 'Este correo electrónico ya está registrado. Intenta iniciar sesión o usa otro email.',
        'auth/invalid-email': 'El formato del correo electrónico no es válido.',
        'auth/operation-not-allowed': 'Esta operación no está permitida. Contacta al administrador.',
        'auth/weak-password': 'La contraseña es muy débil. Debe tener al menos 6 caracteres.',
        'auth/user-disabled': 'Esta cuenta ha sido deshabilitada. Contacta al administrador.',
        'auth/user-not-found': 'No existe una cuenta con este correo electrónico.',
        'auth/wrong-password': 'La contraseña es incorrecta.',
        'auth/invalid-credential': 'Las credenciales son inválidas.',
        'auth/too-many-requests': 'Demasiados intentos fallidos. Intenta de nuevo más tarde.',
        'auth/network-request-failed': 'Error de conexión. Verifica tu internet e intenta de nuevo.',
        'auth/popup-closed-by-user': 'La ventana de autenticación fue cerrada. Intenta de nuevo.',
        'auth/cancelled-popup-request': 'La solicitud de autenticación fue cancelada.',
        'auth/popup-blocked': 'El navegador bloqueó la ventana emergente. Permite ventanas emergentes para este sitio.',
        'auth/unauthorized-domain': 'Este dominio no está autorizado para autenticación. Contacta al administrador para agregar este dominio a la configuración de Firebase.',

        // Errores de Firestore
        'firestore/permission-denied': 'No tienes permisos para realizar esta acción.',
        'firestore/unavailable': 'El servicio no está disponible. Intenta de nuevo más tarde.',
        'firestore/deadline-exceeded': 'La operación tardó demasiado tiempo. Intenta de nuevo.',

        // Errores generales
        'auth/unknown': 'Ocurrió un error inesperado. Intenta de nuevo.',
        'network': 'Error de conexión. Verifica tu internet e intenta de nuevo.',
        'timeout': 'La operación tardó demasiado tiempo. Intenta de nuevo.'
    };

    // Si tenemos un mensaje específico para este error, lo devolvemos
    if (errorMessages[errorCode]) {
        return errorMessages[errorCode];
    }

    // Si el error tiene un mensaje personalizado, lo usamos
    if (error?.message) {
        return error.message;
    }

    // Mensaje por defecto
    return 'Ocurrió un error inesperado. Por favor, intenta de nuevo.';
};

// Función para obtener sugerencias basadas en el tipo de error
export const getErrorSuggestion = (error: any): string | null => {
    const errorCode = error?.code || '';

    const suggestions: { [key: string]: string } = {
        'auth/email-already-in-use': '¿Ya tienes una cuenta? Ve a la página de inicio de sesión.',
        'auth/user-not-found': '¿Necesitas crear una cuenta? Ve a la página de registro.',
        'auth/weak-password': 'Usa una combinación de letras, números y símbolos.',
        'auth/network-request-failed': 'Verifica tu conexión a internet y vuelve a intentar.',
        'auth/too-many-requests': 'Espera unos minutos antes de intentar de nuevo.',
        'auth/unauthorized-domain': 'El dominio de Vercel necesita ser agregado a Firebase Console → Authentication → Settings → Authorized domains.'
    };

    return suggestions[errorCode] || null;
};

// Función para determinar si el error es recuperable
export const isRecoverableError = (error: any): boolean => {
    const errorCode = error?.code || '';

    const nonRecoverableErrors = [
        'auth/user-disabled',
        'auth/operation-not-allowed'
    ];

    return !nonRecoverableErrors.includes(errorCode);
};
