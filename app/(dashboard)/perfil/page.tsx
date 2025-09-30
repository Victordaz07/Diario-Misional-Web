'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';

export default function PerfilPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({
        diaryEntries: 0,
        photosUploaded: 0,
        transfers: 0,
        investigators: 0
    });

    // Estados para modales
    const [showNotificationsModal, setShowNotificationsModal] = useState(false);
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);

    // Estados para configuraciones
    const [notificationSettings, setNotificationSettings] = useState({
        emailNotifications: true,
        pushNotifications: true,
        weeklyReports: true,
        familyUpdates: true,
        missionReminders: true
    });

    const [privacySettings, setPrivacySettings] = useState({
        profileVisibility: 'private',
        dataSharing: false,
        analyticsTracking: false,
        twoFactorAuth: false
    });
    const [formData, setFormData] = useState({
        nombreCompleto: 'John David Smith',
        tituloMisional: 'Elder Smith',
        mision: 'Argentina Buenos Aires Norte',
        companeroActual: 'Elder García',
        presidenteMision: 'Presidente Rodriguez',
        idiomaPreferido: 'español',
        fechaInicioMision: '2024-01-15',
        areaActual: 'Centro - Zona 3'
    });

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const diarySnapshot = await db.collection('diary').get();
            const photosSnapshot = await db.collection('photos').get();
            const transfersSnapshot = await db.collection('transfers').get();
            const investigatorsSnapshot = await db.collection('investigators').get();

            setStats({
                diaryEntries: diarySnapshot.docs.length,
                photosUploaded: photosSnapshot.docs.length,
                transfers: transfersSnapshot.docs.length,
                investigators: investigatorsSnapshot.docs.length
            });
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await db.collection('userProfile').doc('current').set({
                ...formData,
                updatedAt: new Date().toISOString()
            });

            console.log('Perfil actualizado:', formData);
            showNotification('Perfil actualizado correctamente', 'success');
        } catch (error) {
            console.error('Error updating profile:', error);
            showNotification('Error al actualizar el perfil', 'error');
        } finally {
            setLoading(false);
        }
    };

    const showNotification = (message: string, type: 'success' | 'error') => {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 ${type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white p-4 rounded-lg shadow-lg z-50`;
        notification.innerHTML = `<i class="fa-solid fa-${type === 'success' ? 'check' : 'exclamation-triangle'} mr-2"></i>${message}`;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    };

    const handleEdit = () => {
        const inputs = document.querySelectorAll('#profileForm input, #profileForm select');
        inputs.forEach((input: any) => {
            if (input.type !== 'date') {
                input.disabled = false;
                input.classList.remove('disabled:bg-gray-50', 'disabled:text-gray-500');
                input.classList.add('bg-white');
            }
        });
        document.getElementById('editBtn')?.classList.add('hidden');
        document.getElementById('formActions')?.classList.remove('hidden');
    };

    const handleCancel = () => {
        const inputs = document.querySelectorAll('#profileForm input, #profileForm select');
        inputs.forEach((input: any) => {
            input.disabled = true;
            input.classList.add('disabled:bg-gray-50', 'disabled:text-gray-500');
            input.classList.remove('bg-white');
        });
        document.getElementById('editBtn')?.classList.remove('hidden');
        document.getElementById('formActions')?.classList.add('hidden');
    };

    const handleNotifications = () => {
        setShowNotificationsModal(true);
    };

    const handlePrivacy = () => {
        setShowPrivacyModal(true);
    };

    const handleExportData = async () => {
        try {
            showNotification('Iniciando exportación de datos...', 'success');

            // Recopilar todos los datos del usuario
            const userData = {
                profile: formData,
                stats: stats,
                exportDate: new Date().toISOString(),
                missionProgress: {
                    daysServed,
                    daysRemaining,
                    progressPercentage: progressPercentage.toFixed(1),
                    monthsRemaining
                }
            };

            // Crear y descargar el archivo JSON
            const dataStr = JSON.stringify(userData, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

            const exportFileDefaultName = `diario-misional-${formData.tituloMisional.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`;

            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();

            setTimeout(() => {
                showNotification('Datos exportados correctamente', 'success');
            }, 1000);
        } catch (error) {
            console.error('Error exporting data:', error);
            showNotification('Error al exportar los datos', 'error');
        }
    };

    const handleDeleteAccount = () => {
        const confirmed = window.confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.');
        if (confirmed) {
            showNotification('Función de eliminación de cuenta en desarrollo', 'error');
            // Aquí puedes implementar la lógica de eliminación de cuenta
        }
    };

    const handleChangePhoto = () => {
        // Crear un input de archivo oculto
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.style.display = 'none';

        input.onchange = (e: any) => {
            const file = e.target.files[0];
            if (file) {
                // Verificar el tamaño del archivo (máximo 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    showNotification('El archivo es demasiado grande. Máximo 5MB', 'error');
                    return;
                }

                // Verificar el tipo de archivo
                if (!file.type.startsWith('image/')) {
                    showNotification('Solo se permiten archivos de imagen', 'error');
                    return;
                }

                // Crear un objeto URL para previsualizar la imagen
                const reader = new FileReader();
                reader.onload = (event) => {
                    const img = document.querySelector('img[alt="Profile"]') as HTMLImageElement;
                    if (img) {
                        img.src = event.target?.result as string;
                    }
                    showNotification('Foto de perfil actualizada', 'success');
                };
                reader.readAsDataURL(file);
            }
        };

        // Agregar el input al DOM y hacer clic en él
        document.body.appendChild(input);
        input.click();
        document.body.removeChild(input);
    };

    const handleSaveNotifications = async () => {
        try {
            await db.collection('userSettings').doc('notifications').set({
                ...notificationSettings,
                updatedAt: new Date().toISOString()
            });
            setShowNotificationsModal(false);
            showNotification('Configuración de notificaciones guardada', 'success');
        } catch (error) {
            console.error('Error saving notifications:', error);
            showNotification('Error al guardar configuración', 'error');
        }
    };

    const handleSavePrivacy = async () => {
        try {
            await db.collection('userSettings').doc('privacy').set({
                ...privacySettings,
                updatedAt: new Date().toISOString()
            });
            setShowPrivacyModal(false);
            showNotification('Configuración de privacidad guardada', 'success');
        } catch (error) {
            console.error('Error saving privacy:', error);
            showNotification('Error al guardar configuración', 'error');
        }
    };

    // Calculate mission progress
    const missionStartDate = new Date(formData.fechaInicioMision);
    const today = new Date();
    const daysServed = Math.floor((today.getTime() - missionStartDate.getTime()) / (1000 * 60 * 60 * 24));
    const totalDays = 730; // 2 years
    const daysRemaining = Math.max(0, totalDays - daysServed);
    const progressPercentage = Math.min(100, (daysServed / totalDays) * 100);
    const monthsRemaining = Math.ceil(daysRemaining / 30);

    return (
        <div className="p-4 space-y-6 max-w-4xl mx-auto">
            {/* Profile Header */}
            <section className="bg-gradient-to-r from-primary to-accent p-6 rounded-xl text-white">
                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                    <div className="relative">
                        <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg" alt="Profile" className="w-24 h-24 rounded-full border-4 border-white shadow-lg" />
                        <button
                            onClick={handleChangePhoto}
                            className="absolute bottom-0 right-0 w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-white shadow-lg hover:bg-secondary/90 transition-colors cursor-pointer"
                        >
                            <i className="fa-solid fa-camera text-sm"></i>
                        </button>
                    </div>
                    <div className="text-center sm:text-left">
                        <h2 className="text-2xl font-bold mb-1">Elder John Smith</h2>
                        <p className="text-blue-100 mb-2">{formData.mision}</p>
                        <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-4 text-sm">
                            <span className="bg-white/20 px-3 py-1 rounded-full">Día {daysServed} de misión</span>
                            <span className="bg-white/20 px-3 py-1 rounded-full">Compañero: {formData.companeroActual}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Profile Form */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-800">Información Personal</h3>
                        <button id="editBtn" onClick={handleEdit} className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center space-x-1 cursor-pointer">
                            <i className="fa-solid fa-edit"></i>
                            <span>Editar</span>
                        </button>
                    </div>
                </div>

                <form id="profileForm" onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo</label>
                            <input
                                type="text"
                                value={formData.nombreCompleto}
                                onChange={(e) => setFormData({ ...formData, nombreCompleto: e.target.value })}
                                disabled
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50 disabled:text-gray-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Título Misional</label>
                            <input
                                type="text"
                                value={formData.tituloMisional}
                                onChange={(e) => setFormData({ ...formData, tituloMisional: e.target.value })}
                                disabled
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50 disabled:text-gray-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Misión</label>
                            <select
                                value={formData.mision}
                                onChange={(e) => setFormData({ ...formData, mision: e.target.value })}
                                disabled
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50 disabled:text-gray-500"
                            >
                                <option>Argentina Buenos Aires Norte</option>
                                <option>Argentina Buenos Aires Sur</option>
                                <option>Argentina Córdoba</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Compañero Actual</label>
                            <input
                                type="text"
                                value={formData.companeroActual}
                                onChange={(e) => setFormData({ ...formData, companeroActual: e.target.value })}
                                disabled
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50 disabled:text-gray-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Presidente de Misión</label>
                            <input
                                type="text"
                                value={formData.presidenteMision}
                                onChange={(e) => setFormData({ ...formData, presidenteMision: e.target.value })}
                                disabled
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50 disabled:text-gray-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Idioma Preferido</label>
                            <select
                                value={formData.idiomaPreferido}
                                onChange={(e) => setFormData({ ...formData, idiomaPreferido: e.target.value })}
                                disabled
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50 disabled:text-gray-500"
                            >
                                <option>Español</option>
                                <option>English</option>
                                <option>Português</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Inicio de Misión</label>
                        <input
                            type="date"
                            value={formData.fechaInicioMision}
                            onChange={(e) => setFormData({ ...formData, fechaInicioMision: e.target.value })}
                            disabled
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50 disabled:text-gray-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Área Actual</label>
                        <input
                            type="text"
                            value={formData.areaActual}
                            onChange={(e) => setFormData({ ...formData, areaActual: e.target.value })}
                            disabled
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50 disabled:text-gray-500"
                        />
                    </div>

                    <div className="hidden" id="formActions">
                        <div className="flex space-x-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50 cursor-pointer"
                            >
                                <i className="fa-solid fa-save"></i>
                                <span>{loading ? 'Guardando...' : 'Guardar Cambios'}</span>
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="bg-gray-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-600 transition-colors cursor-pointer"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </form>
            </section>

            {/* Sponsorship Status */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">Estado de Patrocinio</h3>
                </div>

                <div className="p-6">
                    <div className="flex items-center space-x-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <i className="fa-solid fa-check-circle text-green-600 text-xl"></i>
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-green-800">Patrocinio Activo</h4>
                            <p className="text-sm text-green-600">Conectado con la familia Smith</p>
                            <p className="text-xs text-green-500 mt-1">Código: FAM-2024-789</p>
                        </div>
                        <button
                            onClick={() => showNotification('Abriendo portal familiar...', 'success')}
                            className="text-green-600 hover:text-green-700 cursor-pointer"
                        >
                            <i className="fa-solid fa-external-link-alt"></i>
                        </button>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-2xl font-bold text-gray-800">156</div>
                            <div className="text-sm text-gray-600">Actualizaciones enviadas</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-2xl font-bold text-gray-800">23</div>
                            <div className="text-sm text-gray-600">Mensajes recibidos</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission Progress */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">Progreso de la Misión</h3>
                </div>

                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-primary/5 rounded-lg">
                            <div className="text-3xl font-bold text-primary mb-2">{daysServed}</div>
                            <div className="text-sm text-gray-600">Días servidos</div>
                            <div className="text-xs text-gray-500 mt-1">de {totalDays} días totales</div>
                        </div>

                        <div className="text-center p-4 bg-secondary/5 rounded-lg">
                            <div className="text-3xl font-bold text-secondary mb-2">{daysRemaining}</div>
                            <div className="text-sm text-gray-600">Días restantes</div>
                            <div className="text-xs text-gray-500 mt-1">{progressPercentage.toFixed(1)}% completado</div>
                        </div>

                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-3xl font-bold text-green-600 mb-2">{monthsRemaining}</div>
                            <div className="text-sm text-gray-600">Meses restantes</div>
                            <div className="text-xs text-gray-500 mt-1">aprox.</div>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">Progreso de la misión</span>
                            <span className="font-medium text-gray-800">{progressPercentage.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                                className="bg-gradient-to-r from-primary to-accent h-3 rounded-full transition-all duration-500"
                                style={{ width: `${progressPercentage}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Account Settings */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">Configuración de Cuenta</h3>
                </div>

                <div className="p-6 space-y-4">
                    <button
                        onClick={handleNotifications}
                        className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                        <div className="flex items-center space-x-3">
                            <i className="fa-solid fa-bell text-gray-600"></i>
                            <span className="font-medium text-gray-800">Notificaciones</span>
                        </div>
                        <i className="fa-solid fa-chevron-right text-gray-400"></i>
                    </button>

                    <button
                        onClick={handlePrivacy}
                        className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                        <div className="flex items-center space-x-3">
                            <i className="fa-solid fa-shield-alt text-gray-600"></i>
                            <span className="font-medium text-gray-800">Privacidad y Seguridad</span>
                        </div>
                        <i className="fa-solid fa-chevron-right text-gray-400"></i>
                    </button>

                    <button
                        onClick={handleExportData}
                        className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                        <div className="flex items-center space-x-3">
                            <i className="fa-solid fa-download text-gray-600"></i>
                            <span className="font-medium text-gray-800">Exportar Datos</span>
                        </div>
                        <i className="fa-solid fa-chevron-right text-gray-400"></i>
                    </button>

                    <button
                        onClick={handleDeleteAccount}
                        className="w-full flex items-center justify-between p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-red-600 cursor-pointer"
                    >
                        <div className="flex items-center space-x-3">
                            <i className="fa-solid fa-trash text-red-600"></i>
                            <span className="font-medium">Eliminar Cuenta</span>
                        </div>
                        <i className="fa-solid fa-chevron-right text-red-400"></i>
                    </button>
                </div>
            </section>

            {/* Modal de Notificaciones */}
            {showNotificationsModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl w-full max-w-md">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800">Configuración de Notificaciones</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-medium text-gray-800">Notificaciones por Email</h4>
                                    <p className="text-sm text-gray-500">Recibir actualizaciones por correo electrónico</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={notificationSettings.emailNotifications}
                                        onChange={(e) => setNotificationSettings({ ...notificationSettings, emailNotifications: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-medium text-gray-800">Notificaciones Push</h4>
                                    <p className="text-sm text-gray-500">Recibir notificaciones en tiempo real</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={notificationSettings.pushNotifications}
                                        onChange={(e) => setNotificationSettings({ ...notificationSettings, pushNotifications: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-medium text-gray-800">Reportes Semanales</h4>
                                    <p className="text-sm text-gray-500">Resumen semanal de actividades</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={notificationSettings.weeklyReports}
                                        onChange={(e) => setNotificationSettings({ ...notificationSettings, weeklyReports: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-medium text-gray-800">Actualizaciones Familiares</h4>
                                    <p className="text-sm text-gray-500">Notificaciones del portal familiar</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={notificationSettings.familyUpdates}
                                        onChange={(e) => setNotificationSettings({ ...notificationSettings, familyUpdates: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-medium text-gray-800">Recordatorios de Misión</h4>
                                    <p className="text-sm text-gray-500">Recordatorios de actividades misionales</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={notificationSettings.missionReminders}
                                        onChange={(e) => setNotificationSettings({ ...notificationSettings, missionReminders: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-200 flex space-x-3">
                            <button
                                onClick={() => setShowNotificationsModal(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSaveNotifications}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                            >
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Privacidad */}
            {showPrivacyModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl w-full max-w-md">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800">Privacidad y Seguridad</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <h4 className="font-medium text-gray-800 mb-2">Visibilidad del Perfil</h4>
                                <select
                                    value={privacySettings.profileVisibility}
                                    onChange={(e) => setPrivacySettings({ ...privacySettings, profileVisibility: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="private">Privado</option>
                                    <option value="mission">Solo Misión</option>
                                    <option value="public">Público</option>
                                </select>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-medium text-gray-800">Compartir Datos</h4>
                                    <p className="text-sm text-gray-500">Permitir uso de datos para mejoras</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={privacySettings.dataSharing}
                                        onChange={(e) => setPrivacySettings({ ...privacySettings, dataSharing: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-medium text-gray-800">Seguimiento de Análisis</h4>
                                    <p className="text-sm text-gray-500">Permitir análisis de uso</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={privacySettings.analyticsTracking}
                                        onChange={(e) => setPrivacySettings({ ...privacySettings, analyticsTracking: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-medium text-gray-800">Autenticación de Dos Factores</h4>
                                    <p className="text-sm text-gray-500">Seguridad adicional para la cuenta</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={privacySettings.twoFactorAuth}
                                        onChange={(e) => setPrivacySettings({ ...privacySettings, twoFactorAuth: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-200 flex space-x-3">
                            <button
                                onClick={() => setShowPrivacyModal(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSavePrivacy}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                            >
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
