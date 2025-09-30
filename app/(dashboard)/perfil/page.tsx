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
                        <button className="absolute bottom-0 right-0 w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-white shadow-lg hover:bg-secondary/90 transition-colors">
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
                        <button className="text-green-600 hover:text-green-700">
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
                    <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-3">
                            <i className="fa-solid fa-bell text-gray-600"></i>
                            <span className="font-medium text-gray-800">Notificaciones</span>
                        </div>
                        <i className="fa-solid fa-chevron-right text-gray-400"></i>
                    </button>

                    <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-3">
                            <i className="fa-solid fa-shield-alt text-gray-600"></i>
                            <span className="font-medium text-gray-800">Privacidad y Seguridad</span>
                        </div>
                        <i className="fa-solid fa-chevron-right text-gray-400"></i>
                    </button>

                    <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-3">
                            <i className="fa-solid fa-download text-gray-600"></i>
                            <span className="font-medium text-gray-800">Exportar Datos</span>
                        </div>
                        <i className="fa-solid fa-chevron-right text-gray-400"></i>
                    </button>

                    <button className="w-full flex items-center justify-between p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-red-600">
                        <div className="flex items-center space-x-3">
                            <i className="fa-solid fa-trash text-red-600"></i>
                            <span className="font-medium">Eliminar Cuenta</span>
                        </div>
                        <i className="fa-solid fa-chevron-right text-red-400"></i>
                    </button>
                </div>
            </section>
        </div>
    );
}
