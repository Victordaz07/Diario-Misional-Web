'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';

interface Sponsor {
    id: string;
    name: string;
    email: string;
    phone?: string;
    relationship: 'family' | 'friend' | 'organization' | 'other';
    status: 'active' | 'inactive' | 'pending';
    monthlyContribution: number;
    totalContributed: number;
    startDate: string;
    lastPayment?: string;
    nextPayment?: string;
    communicationPreferences: {
        email: boolean;
        sms: boolean;
        reports: boolean;
    };
    notes?: string;
}

interface Payment {
    id: string;
    sponsorId: string;
    amount: number;
    date: string;
    method: 'bank_transfer' | 'credit_card' | 'check' | 'cash';
    status: 'completed' | 'pending' | 'failed';
    reference?: string;
}

export default function SponsorsManagementPage() {
    const { user } = useAuth();
    const [sponsors, setSponsors] = useState<Sponsor[]>([]);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
    const [showEditSponsorModal, setShowEditSponsorModal] = useState(false);
    const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'payments' | 'settings'>('overview');

    const [paymentFormData, setPaymentFormData] = useState({
        sponsorId: '',
        amount: 0,
        method: 'bank_transfer' as const,
        reference: '',
        date: new Date().toISOString().split('T')[0]
    });

    const [sponsorFormData, setSponsorFormData] = useState({
        name: '',
        email: '',
        phone: '',
        relationship: 'family' as const,
        monthlyContribution: 0,
        status: 'active' as const,
        communicationPreferences: {
            email: true,
            sms: false,
            reports: true
        },
        notes: ''
    });

    useEffect(() => {
        loadSponsors();
        loadPayments();
    }, []);

    const loadSponsors = async () => {
        try {
            const sampleSponsors: Sponsor[] = [
                {
                    id: 'sponsor-1',
                    name: 'Familia Smith',
                    email: 'smith.family@email.com',
                    phone: '+1 (555) 123-4567',
                    relationship: 'family',
                    status: 'active',
                    monthlyContribution: 450,
                    totalContributed: 3600,
                    startDate: '2024-01-15',
                    lastPayment: '2024-09-15',
                    nextPayment: '2024-10-15',
                    communicationPreferences: {
                        email: true,
                        sms: false,
                        reports: true
                    },
                    notes: 'Padres del misionero. Muy comprometidos con el progreso.'
                },
                {
                    id: 'sponsor-2',
                    name: 'Iglesia de Salt Lake City',
                    email: 'contact@saltlakechurch.org',
                    relationship: 'organization',
                    status: 'active',
                    monthlyContribution: 200,
                    totalContributed: 1600,
                    startDate: '2024-03-01',
                    lastPayment: '2024-09-01',
                    nextPayment: '2024-10-01',
                    communicationPreferences: {
                        email: true,
                        sms: false,
                        reports: true
                    },
                    notes: 'Programa de apoyo misional de la iglesia local.'
                },
                {
                    id: 'sponsor-3',
                    name: 'Hermano Johnson',
                    email: 'johnson.brother@email.com',
                    phone: '+1 (555) 987-6543',
                    relationship: 'friend',
                    status: 'inactive',
                    monthlyContribution: 100,
                    totalContributed: 600,
                    startDate: '2024-02-01',
                    lastPayment: '2024-07-01',
                    communicationPreferences: {
                        email: true,
                        sms: true,
                        reports: false
                    },
                    notes: 'Amigo de la familia. Contribución temporal.'
                }
            ];

            setSponsors(sampleSponsors);
        } catch (error) {
            console.error('Error loading sponsors:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadPayments = async () => {
        try {
            const samplePayments: Payment[] = [
                {
                    id: 'payment-1',
                    sponsorId: 'sponsor-1',
                    amount: 450,
                    date: '2024-09-15',
                    method: 'bank_transfer',
                    status: 'completed',
                    reference: 'TXN-2024-0915-001'
                },
                {
                    id: 'payment-2',
                    sponsorId: 'sponsor-2',
                    amount: 200,
                    date: '2024-09-01',
                    method: 'credit_card',
                    status: 'completed',
                    reference: 'CC-2024-0901-002'
                },
                {
                    id: 'payment-3',
                    sponsorId: 'sponsor-1',
                    amount: 450,
                    date: '2024-10-15',
                    method: 'bank_transfer',
                    status: 'pending',
                    reference: 'TXN-2024-1015-001'
                },
                {
                    id: 'payment-4',
                    sponsorId: 'sponsor-2',
                    amount: 200,
                    date: '2024-10-01',
                    method: 'credit_card',
                    status: 'pending',
                    reference: 'CC-2024-1001-002'
                }
            ];

            setPayments(samplePayments);
        } catch (error) {
            console.error('Error loading payments:', error);
        }
    };

    const handleAddPayment = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const newPayment: Payment = {
                id: `payment-${Date.now()}`,
                ...paymentFormData,
                status: 'completed'
            };

            await db.collection('payments').add(newPayment);
            setPayments([...payments, newPayment]);
            
            // Update sponsor's total contributed
            const sponsor = sponsors.find(s => s.id === paymentFormData.sponsorId);
            if (sponsor) {
                const updatedSponsor = {
                    ...sponsor,
                    totalContributed: sponsor.totalContributed + paymentFormData.amount,
                    lastPayment: paymentFormData.date
                };
                setSponsors(sponsors.map(s => s.id === sponsor.id ? updatedSponsor : s));
            }

            setShowAddPaymentModal(false);
            setPaymentFormData({
                sponsorId: '',
                amount: 0,
                method: 'bank_transfer',
                reference: '',
                date: new Date().toISOString().split('T')[0]
            });
            showNotification('Pago registrado exitosamente', 'success');
        } catch (error) {
            console.error('Error adding payment:', error);
            showNotification('Error al registrar pago', 'error');
        }
    };

    const handleEditSponsor = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSponsor) return;

        try {
            const updatedSponsor = {
                ...selectedSponsor,
                ...sponsorFormData
            };

            await db.collection('sponsors').doc(selectedSponsor.id).update(sponsorFormData);
            setSponsors(sponsors.map(s => s.id === selectedSponsor.id ? updatedSponsor : s));
            setShowEditSponsorModal(false);
            setSelectedSponsor(null);
            showNotification('Sponsor actualizado exitosamente', 'success');
        } catch (error) {
            console.error('Error updating sponsor:', error);
            showNotification('Error al actualizar sponsor', 'error');
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

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'inactive': return 'bg-gray-100 text-gray-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPaymentStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'failed': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getMethodIcon = (method: string) => {
        switch (method) {
            case 'bank_transfer': return 'fa-solid fa-university';
            case 'credit_card': return 'fa-solid fa-credit-card';
            case 'check': return 'fa-solid fa-file-invoice';
            case 'cash': return 'fa-solid fa-money-bill';
            default: return 'fa-solid fa-question';
        }
    };

    const activeSponsors = sponsors.filter(s => s.status === 'active');
    const totalMonthlyContributions = activeSponsors.reduce((sum, s) => sum + s.monthlyContribution, 0);
    const totalContributed = sponsors.reduce((sum, s) => sum + s.totalContributed, 0);
    const completedPayments = payments.filter(p => p.status === 'completed');
    const pendingPayments = payments.filter(p => p.status === 'pending');
    const totalPaymentsThisMonth = completedPayments
        .filter(p => new Date(p.date).getMonth() === new Date().getMonth())
        .reduce((sum, p) => sum + p.amount, 0);

    if (loading) {
        return (
            <div className="p-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
                        ))}
                    </div>
                    <div className="h-96 bg-gray-200 rounded-lg"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Gestión de Sponsors</h1>
                        <p className="text-gray-600 mt-2">Administra pagos, configuraciones y estados de sponsors</p>
                    </div>
                    <div className="flex space-x-3">
                        <button
                            onClick={() => setShowAddPaymentModal(true)}
                            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
                        >
                            <i className="fa-solid fa-plus"></i>
                            <span>Registrar Pago</span>
                        </button>
                        <button className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2">
                            <i className="fa-solid fa-download"></i>
                            <span>Exportar</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Sponsors Activos</p>
                            <p className="text-2xl font-bold text-gray-800">{activeSponsors.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <i className="fa-solid fa-users text-green-600 text-xl"></i>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Ingresos Este Mes</p>
                            <p className="text-2xl font-bold text-gray-800">${totalPaymentsThisMonth}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <i className="fa-solid fa-dollar-sign text-blue-600 text-xl"></i>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Contribuido</p>
                            <p className="text-2xl font-bold text-gray-800">${totalContributed}</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <i className="fa-solid fa-chart-line text-purple-600 text-xl"></i>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Pagos Pendientes</p>
                            <p className="text-2xl font-bold text-gray-800">{pendingPayments.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <i className="fa-solid fa-clock text-orange-600 text-xl"></i>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-8 px-6">
                        {[
                            { id: 'overview', label: 'Resumen', icon: 'fa-chart-pie' },
                            { id: 'payments', label: 'Pagos', icon: 'fa-credit-card' },
                            { id: 'settings', label: 'Configuración', icon: 'fa-cog' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                                    activeTab === tab.id
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                <i className={`fa-solid ${tab.icon}`}></i>
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="p-6">
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-800">Resumen de Sponsors</h3>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Sponsors List */}
                                <div className="space-y-4">
                                    <h4 className="font-semibold text-gray-700">Sponsors Activos</h4>
                                    {activeSponsors.map(sponsor => (
                                        <div key={sponsor.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                                        <i className="fa-solid fa-user text-primary"></i>
                                                    </div>
                                                    <div>
                                                        <h5 className="font-semibold text-gray-800">{sponsor.name}</h5>
                                                        <p className="text-sm text-gray-600">{sponsor.email}</p>
                                                    </div>
                                                </div>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(sponsor.status)}`}>
                                                    {sponsor.status}
                                                </span>
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <span className="text-gray-600">Mensual:</span>
                                                    <span className="font-medium ml-1">${sponsor.monthlyContribution}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-600">Total:</span>
                                                    <span className="font-medium ml-1">${sponsor.totalContributed}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-600">Último pago:</span>
                                                    <span className="font-medium ml-1">{sponsor.lastPayment}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-600">Próximo:</span>
                                                    <span className="font-medium ml-1">{sponsor.nextPayment}</span>
                                                </div>
                                            </div>
                                            
                                            <div className="flex space-x-2 mt-3">
                                                <button
                                                    onClick={() => {
                                                        setSelectedSponsor(sponsor);
                                                        setSponsorFormData({
                                                            name: sponsor.name,
                                                            email: sponsor.email,
                                                            phone: sponsor.phone || '',
                                                            relationship: sponsor.relationship,
                                                            monthlyContribution: sponsor.monthlyContribution,
                                                            status: sponsor.status,
                                                            communicationPreferences: sponsor.communicationPreferences,
                                                            notes: sponsor.notes || ''
                                                        });
                                                        setShowEditSponsorModal(true);
                                                    }}
                                                    className="flex-1 bg-gray-200 text-gray-700 py-2 px-3 rounded-lg text-sm hover:bg-gray-300 transition-colors"
                                                >
                                                    <i className="fa-solid fa-edit mr-1"></i>
                                                    Editar
                                                </button>
                                                <button className="flex-1 bg-blue-500 text-white py-2 px-3 rounded-lg text-sm hover:bg-blue-600 transition-colors">
                                                    <i className="fa-solid fa-envelope mr-1"></i>
                                                    Contactar
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Recent Payments */}
                                <div className="space-y-4">
                                    <h4 className="font-semibold text-gray-700">Pagos Recientes</h4>
                                    {payments.slice(0, 5).map(payment => {
                                        const sponsor = sponsors.find(s => s.id === payment.sponsorId);
                                        return (
                                            <div key={payment.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                                            <i className={`${getMethodIcon(payment.method)} text-gray-600 text-sm`}></i>
                                                        </div>
                                                        <div>
                                                            <h6 className="font-medium text-gray-800">{sponsor?.name}</h6>
                                                            <p className="text-xs text-gray-600">{payment.date}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-semibold text-gray-800">${payment.amount}</div>
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(payment.status)}`}>
                                                            {payment.status === 'completed' ? 'Completado' :
                                                             payment.status === 'pending' ? 'Pendiente' : 'Fallido'}
                                                        </span>
                                                    </div>
                                                </div>
                                                {payment.reference && (
                                                    <p className="text-xs text-gray-500">Ref: {payment.reference}</p>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Payments Tab */}
                    {activeTab === 'payments' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-800">Historial de Pagos</h3>
                                <div className="flex items-center space-x-2">
                                    <select className="text-sm border border-gray-300 rounded-lg px-3 py-1">
                                        <option>Todos los pagos</option>
                                        <option>Completados</option>
                                        <option>Pendientes</option>
                                        <option>Fallidos</option>
                                    </select>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-3 px-4 font-medium text-gray-700">Sponsor</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-700">Monto</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-700">Método</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-700">Fecha</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-700">Estado</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-700">Referencia</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-700">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {payments.map(payment => {
                                            const sponsor = sponsors.find(s => s.id === payment.sponsorId);
                                            return (
                                                <tr key={payment.id} className="border-b border-gray-100">
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                                                <i className="fa-solid fa-user text-gray-600 text-sm"></i>
                                                            </div>
                                                            <div>
                                                                <div className="font-medium text-gray-800">{sponsor?.name}</div>
                                                                <div className="text-sm text-gray-600">{sponsor?.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4 font-semibold text-gray-800">${payment.amount}</td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center space-x-2">
                                                            <i className={`${getMethodIcon(payment.method)} text-gray-600`}></i>
                                                            <span className="text-sm text-gray-700">
                                                                {payment.method === 'bank_transfer' ? 'Transferencia' :
                                                                 payment.method === 'credit_card' ? 'Tarjeta' :
                                                                 payment.method === 'check' ? 'Cheque' : 'Efectivo'}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4 text-sm text-gray-700">{payment.date}</td>
                                                    <td className="py-3 px-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(payment.status)}`}>
                                                            {payment.status === 'completed' ? 'Completado' :
                                                             payment.status === 'pending' ? 'Pendiente' : 'Fallido'}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 text-sm text-gray-600">{payment.reference || '-'}</td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex space-x-2">
                                                            <button className="text-blue-600 hover:text-blue-800 text-sm">
                                                                <i className="fa-solid fa-eye"></i>
                                                            </button>
                                                            <button className="text-gray-600 hover:text-gray-800 text-sm">
                                                                <i className="fa-solid fa-edit"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Settings Tab */}
                    {activeTab === 'settings' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-800">Configuración de Sponsors</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                    <h4 className="font-semibold text-gray-800 mb-4">Configuración de Pagos</h4>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Recordatorio de pagos</label>
                                            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                                                <option>5 días antes</option>
                                                <option>3 días antes</option>
                                                <option>1 día antes</option>
                                                <option>El mismo día</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Método de notificación</label>
                                            <div className="space-y-2">
                                                <label className="flex items-center">
                                                    <input type="checkbox" className="mr-2" defaultChecked />
                                                    <span className="text-sm text-gray-700">Email</span>
                                                </label>
                                                <label className="flex items-center">
                                                    <input type="checkbox" className="mr-2" />
                                                    <span className="text-sm text-gray-700">SMS</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                    <h4 className="font-semibold text-gray-800 mb-4">Configuración de Reportes</h4>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Frecuencia de reportes</label>
                                            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                                                <option>Mensual</option>
                                                <option>Bimensual</option>
                                                <option>Trimestral</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Día de envío</label>
                                            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                                                <option>1 de cada mes</option>
                                                <option>15 de cada mes</option>
                                                <option>Último día del mes</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                    <h4 className="font-semibold text-gray-800 mb-4">Configuración de Comunicación</h4>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Idioma por defecto</label>
                                            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                                                <option>Español</option>
                                                <option>English</option>
                                                <option>Português</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Plantilla de email</label>
                                            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                                                <option>Formal</option>
                                                <option>Informal</option>
                                                <option>Personalizada</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                    <h4 className="font-semibold text-gray-800 mb-4">Configuración de Privacidad</h4>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="flex items-center">
                                                <input type="checkbox" className="mr-2" defaultChecked />
                                                <span className="text-sm text-gray-700">Compartir fotos con sponsors</span>
                                            </label>
                                        </div>
                                        <div>
                                            <label className="flex items-center">
                                                <input type="checkbox" className="mr-2" defaultChecked />
                                                <span className="text-sm text-gray-700">Compartir entradas del diario</span>
                                            </label>
                                        </div>
                                        <div>
                                            <label className="flex items-center">
                                                <input type="checkbox" className="mr-2" />
                                                <span className="text-sm text-gray-700">Compartir ubicación</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button className="bg-gray-200 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-300 transition-colors">
                                    Cancelar
                                </button>
                                <button className="bg-primary text-white py-2 px-6 rounded-lg hover:bg-primary/90 transition-colors">
                                    Guardar Configuración
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Payment Modal */}
            {showAddPaymentModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-800">Registrar Nuevo Pago</h3>
                                <button
                                    onClick={() => setShowAddPaymentModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <i className="fa-solid fa-times text-xl"></i>
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleAddPayment} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Sponsor</label>
                                <select
                                    required
                                    value={paymentFormData.sponsorId}
                                    onChange={(e) => setPaymentFormData({ ...paymentFormData, sponsorId: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="">Seleccionar sponsor</option>
                                    {sponsors.map(sponsor => (
                                        <option key={sponsor.id} value={sponsor.id}>{sponsor.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Monto ($)</label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    required
                                    value={paymentFormData.amount}
                                    onChange={(e) => setPaymentFormData({ ...paymentFormData, amount: parseFloat(e.target.value) || 0 })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Método de Pago</label>
                                <select
                                    value={paymentFormData.method}
                                    onChange={(e) => setPaymentFormData({ ...paymentFormData, method: e.target.value as any })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="bank_transfer">Transferencia Bancaria</option>
                                    <option value="credit_card">Tarjeta de Crédito</option>
                                    <option value="check">Cheque</option>
                                    <option value="cash">Efectivo</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                                <input
                                    type="date"
                                    required
                                    value={paymentFormData.date}
                                    onChange={(e) => setPaymentFormData({ ...paymentFormData, date: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Referencia (opcional)</label>
                                <input
                                    type="text"
                                    value={paymentFormData.reference}
                                    onChange={(e) => setPaymentFormData({ ...paymentFormData, reference: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddPaymentModal(false)}
                                    className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
                                >
                                    Registrar Pago
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Sponsor Modal */}
            {showEditSponsorModal && selectedSponsor && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-800">Editar Sponsor</h3>
                                <button
                                    onClick={() => setShowEditSponsorModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <i className="fa-solid fa-times text-xl"></i>
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleEditSponsor} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                                <input
                                    type="text"
                                    required
                                    value={sponsorFormData.name}
                                    onChange={(e) => setSponsorFormData({ ...sponsorFormData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={sponsorFormData.email}
                                    onChange={(e) => setSponsorFormData({ ...sponsorFormData, email: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                                <input
                                    type="tel"
                                    value={sponsorFormData.phone}
                                    onChange={(e) => setSponsorFormData({ ...sponsorFormData, phone: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contribución Mensual ($)</label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={sponsorFormData.monthlyContribution}
                                    onChange={(e) => setSponsorFormData({ ...sponsorFormData, monthlyContribution: parseFloat(e.target.value) || 0 })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                                <select
                                    value={sponsorFormData.status}
                                    onChange={(e) => setSponsorFormData({ ...sponsorFormData, status: e.target.value as any })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="active">Activo</option>
                                    <option value="inactive">Inactivo</option>
                                    <option value="pending">Pendiente</option>
                                </select>
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowEditSponsorModal(false)}
                                    className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors"
                                >
                                    Actualizar Sponsor
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
