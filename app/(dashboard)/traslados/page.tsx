'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from '@/lib/use-translations';
import { db } from '@/lib/firebase';

interface Transfer {
    id: string;
    areaName: string;
    previousArea?: string;
    companion: string;
    previousCompanion?: string;
    startDate: string;
    endDate?: string;
    notes?: string;
    isCurrent?: boolean;
}

export default function TrasladosPage() {
    const { t } = useTranslations();
    const [transfers, setTransfers] = useState<Transfer[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingTransfer, setEditingTransfer] = useState<Transfer | null>(null);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        transferDate: '',
        previousArea: '',
        newArea: '',
        previousCompanion: '',
        newCompanion: '',
        notes: ''
    });

    useEffect(() => {
        loadTransfers();
    }, []);

    // Cerrar menú cuando se hace clic fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (openMenuId && !(event.target as Element).closest('.relative')) {
                setOpenMenuId(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openMenuId]);

    const loadTransfers = async () => {
        try {
            const snapshot = await db.collection('transfers').get();
            const transfersData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Transfer[];

            // Sort by start date (most recent first)
            transfersData.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
            setTransfers(transfersData);
        } catch (error) {
            console.error('Error loading transfers:', error);
        } finally {
            setLoading(false);
        }
    };

    const createSampleTransfers = async () => {
        console.log('createSampleTransfers called');
        try {
            const sampleTransfers = [
                {
                    areaName: 'Área Norte',
                    companion: 'Elder Johnson',
                    startDate: '2024-03-15',
                    isCurrent: true,
                    notes: 'Traslado al área norte para continuar el trabajo misional'
                },
                {
                    areaName: 'Área Centro',
                    companion: 'Elder Davis',
                    startDate: '2024-01-10',
                    endDate: '2024-03-14',
                    notes: 'Servicio en el área central de la ciudad'
                },
                {
                    areaName: 'Área Sur',
                    companion: 'Elder Wilson',
                    startDate: '2023-10-05',
                    endDate: '2024-01-09',
                    notes: 'Primera área de servicio'
                },
                {
                    areaName: 'Área Este',
                    companion: 'Elder Brown',
                    startDate: '2023-07-20',
                    endDate: '2023-10-04',
                    notes: 'Inicio de la misión'
                }
            ];

            for (const transfer of sampleTransfers) {
                await db.collection('transfers').add(transfer);
            }

            loadTransfers();
        } catch (error) {
            console.error('Error creating sample transfers:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const newTransfer = {
                areaName: formData.newArea,
                previousArea: formData.previousArea,
                companion: formData.newCompanion,
                previousCompanion: formData.previousCompanion,
                startDate: formData.transferDate,
                notes: formData.notes,
                isCurrent: true
            };

            // Mark previous transfer as completed
            if (transfers.length > 0) {
                const currentTransfer = transfers.find(t => t.isCurrent);
                if (currentTransfer) {
                    await db.collection('transfers').doc(currentTransfer.id).update({
                        endDate: formData.transferDate,
                        isCurrent: false
                    });
                }
            }

            await db.collection('transfers').add(newTransfer);

            // Reset form
            setFormData({
                transferDate: '',
                previousArea: '',
                newArea: '',
                previousCompanion: '',
                newCompanion: '',
                notes: ''
            });

            setShowModal(false);
            loadTransfers();
            showNotification('Traslado registrado exitosamente', 'success');
        } catch (error) {
            console.error('Error creating transfer:', error);
            showNotification('Error al registrar el traslado', 'error');
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

    const handleMenuToggle = (transferId: string) => {
        setOpenMenuId(openMenuId === transferId ? null : transferId);
    };

    const handleEditTransfer = (transfer: Transfer) => {
        setEditingTransfer(transfer);
        setFormData({
            transferDate: transfer.startDate,
            previousArea: transfer.previousArea || '',
            newArea: transfer.areaName,
            previousCompanion: transfer.previousCompanion || '',
            newCompanion: transfer.companion,
            notes: transfer.notes || ''
        });
        setShowModal(true);
        setOpenMenuId(null);
    };

    const handleDeleteTransfer = async (transferId: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este traslado?')) {
            try {
                await db.collection('transfers').doc(transferId).delete();
                showNotification('Traslado eliminado exitosamente', 'success');
                loadTransfers();
            } catch (error) {
                console.error('Error deleting transfer:', error);
                showNotification('Error al eliminar el traslado', 'error');
            }
        }
        setOpenMenuId(null);
    };

    const handleViewDetails = (transfer: Transfer) => {
        // Crear un modal para mostrar detalles del traslado
        const detailsModal = document.createElement('div');
        detailsModal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
        detailsModal.innerHTML = `
            <div class="bg-white rounded-xl shadow-xl w-full max-w-md mx-auto">
                <div class="p-6 border-b border-gray-200">
                    <div class="flex items-center justify-between">
                        <h3 class="text-lg font-semibold text-gray-800">Detalles del Traslado</h3>
                        <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-gray-600">
                            <i class="fa-solid fa-times text-xl"></i>
                        </button>
                    </div>
                </div>
                <div class="p-6 space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Área</label>
                        <p class="text-gray-900">${transfer.areaName}</p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Compañero</label>
                        <p class="text-gray-900">${transfer.companion}</p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Fecha de Inicio</label>
                        <p class="text-gray-900">${new Date(transfer.startDate).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })}</p>
                    </div>
                    ${transfer.endDate ? `
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Fecha de Fin</label>
                        <p class="text-gray-900">${new Date(transfer.endDate).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })}</p>
                    </div>
                    ` : ''}
                    ${transfer.notes ? `
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Notas</label>
                        <p class="text-gray-900">${transfer.notes}</p>
                    </div>
                    ` : ''}
                </div>
                <div class="p-6 border-t border-gray-200">
                    <button onclick="this.closest('.fixed').remove()" class="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors">
                        Cerrar
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(detailsModal);
        setOpenMenuId(null);
    };

    // Calculate statistics
    const totalTransfers = transfers.length;
    const areasServed = new Set(transfers.map(t => t.areaName)).size;
    const averageMonths = transfers.length > 0
        ? transfers.reduce((acc, transfer) => {
            const start = new Date(transfer.startDate);
            const end = transfer.endDate ? new Date(transfer.endDate) : new Date();
            const months = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30);
            return acc + months;
        }, 0) / transfers.length
        : 0;

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando traslados...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 space-y-6">
            {/* Header */}
            <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Mis Traslados</h2>
                    <p className="text-gray-600">Historial de traslados y áreas de servicio</p>
                </div>
                <button
                    onClick={() => {
                        console.log('Nuevo Traslado button clicked');
                        setShowModal(true);
                    }}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2 cursor-pointer"
                >
                    <i className="fa-solid fa-plus"></i>
                    <span>Nuevo Traslado</span>
                </button>
            </section>

            {/* Statistics */}
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <i className="fa-solid fa-route text-primary"></i>
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-800 mb-1">{totalTransfers}</div>
                    <div className="text-sm text-gray-600">Total traslados</div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                            <i className="fa-solid fa-map-marker-alt text-secondary"></i>
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-800 mb-1">{areasServed}</div>
                    <div className="text-sm text-gray-600">Áreas servidas</div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <i className="fa-solid fa-clock text-green-600"></i>
                        </div>
                    </div>
                    <div className="text-lg font-bold text-gray-800 mb-1">{averageMonths.toFixed(1)}</div>
                    <div className="text-sm text-gray-600">Meses promedio</div>
                </div>
            </section>

            {/* Transfers List */}
            {transfers.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                    <div className="text-center py-8">
                        <i className="fa-solid fa-map-marker-alt text-6xl text-gray-400 mb-4"></i>
                        <h3 className="text-xl font-medium text-gray-900 mb-2">
                            No hay traslados registrados
                        </h3>
                        <p className="text-gray-500 mb-6">
                            Registra tu primer traslado cuando cambies de área.
                        </p>
                        <button
                            onClick={() => {
                                console.log('Cargar Datos de Ejemplo button clicked');
                                createSampleTransfers();
                            }}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto cursor-pointer"
                        >
                            <i className="fa-solid fa-plus"></i>
                            <span>Cargar Datos de Ejemplo</span>
                        </button>
                    </div>
                </div>
            ) : (
                <section className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800">Historial de Traslados</h3>
                    </div>

                    <div className="divide-y divide-gray-200">
                        {transfers.map((transfer) => (
                            <div key={transfer.id} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <div className={`w-3 h-3 rounded-full ${transfer.isCurrent ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                            <span className="font-medium text-gray-800">{transfer.areaName}</span>
                                            {transfer.isCurrent && (
                                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Actual</span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 mb-1">Compañero: {transfer.companion}</p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(transfer.startDate).toLocaleDateString('es-ES', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                            {transfer.endDate ? ` - ${new Date(transfer.endDate).toLocaleDateString('es-ES', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}` : ' - Presente'}
                                        </p>
                                    </div>
                                    <div className="text-right relative">
                                        <button
                                            onClick={() => handleMenuToggle(transfer.id)}
                                            className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                        >
                                            <i className="fa-solid fa-ellipsis-v"></i>
                                        </button>

                                        {/* Menú desplegable */}
                                        {openMenuId === transfer.id && (
                                            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                                                <div className="py-1">
                                                    <button
                                                        onClick={() => handleViewDetails(transfer)}
                                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                                                    >
                                                        <i className="fa-solid fa-eye text-gray-400"></i>
                                                        <span>Ver detalles</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleEditTransfer(transfer)}
                                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                                                    >
                                                        <i className="fa-solid fa-edit text-gray-400"></i>
                                                        <span>Editar</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteTransfer(transfer.id)}
                                                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                                                    >
                                                        <i className="fa-solid fa-trash text-red-400"></i>
                                                        <span>Eliminar</span>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-800">Nuevo Traslado</h3>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <i className="fa-solid fa-times"></i>
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de traslado</label>
                                <input
                                    type="date"
                                    value={formData.transferDate}
                                    onChange={(e) => setFormData({ ...formData, transferDate: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Área anterior</label>
                                <select
                                    value={formData.previousArea}
                                    onChange={(e) => setFormData({ ...formData, previousArea: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="">Seleccionar área</option>
                                    <option>Área Norte</option>
                                    <option>Área Centro</option>
                                    <option>Área Sur</option>
                                    <option>Área Este</option>
                                    <option>Área Oeste</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Nueva área</label>
                                <select
                                    value={formData.newArea}
                                    onChange={(e) => setFormData({ ...formData, newArea: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    required
                                >
                                    <option value="">Seleccionar área</option>
                                    <option>Área Norte</option>
                                    <option>Área Centro</option>
                                    <option>Área Sur</option>
                                    <option>Área Este</option>
                                    <option>Área Oeste</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Compañero anterior</label>
                                <input
                                    type="text"
                                    value={formData.previousCompanion}
                                    onChange={(e) => setFormData({ ...formData, previousCompanion: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="Nombre del compañero"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Nuevo compañero</label>
                                <input
                                    type="text"
                                    value={formData.newCompanion}
                                    onChange={(e) => setFormData({ ...formData, newCompanion: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="Nombre del compañero"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Notas adicionales</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    rows={3}
                                    placeholder="Observaciones sobre el traslado..."
                                />
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 cursor-pointer"
                                >
                                    {loading ? 'Guardando...' : 'Guardar Traslado'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
