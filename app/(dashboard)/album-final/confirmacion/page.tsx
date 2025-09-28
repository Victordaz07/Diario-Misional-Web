'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useTranslations } from '@/lib/use-translations';
import Link from 'next/link';

export default function ConfirmationPage() {
    const { user } = useAuth();
    const { t } = useTranslations();
    const [orderStatus, setOrderStatus] = useState('processing');
    const [trackingNumber, setTrackingNumber] = useState('');

    const orderDetails = {
        orderNumber: 'ORD-2024-001234',
        album: 'Álbum Completo',
        total: 107.09,
        estimatedDelivery: '18-21 días hábiles',
        shippingAddress: {
            name: 'María González',
            address: 'Calle 123 #45-67, Apto 301',
            city: 'Bogotá, Cundinamarca',
            phone: '+57 300 123 4567',
            email: 'maria@email.com'
        }
    };

    useEffect(() => {
        // Simulate order processing
        const timer = setTimeout(() => {
            setOrderStatus('confirmed');
            setTrackingNumber('TRK-789456123');
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    const getStatusIcon = () => {
        switch (orderStatus) {
            case 'processing':
                return <i className="fa-solid fa-spinner fa-spin text-primary text-2xl"></i>;
            case 'confirmed':
                return <i className="fa-solid fa-check-circle text-green-500 text-2xl"></i>;
            default:
                return <i className="fa-solid fa-clock text-gray-400 text-2xl"></i>;
        }
    };

    const getStatusMessage = () => {
        switch (orderStatus) {
            case 'processing':
                return 'Procesando tu pedido...';
            case 'confirmed':
                return '¡Pedido confirmado!';
            default:
                return 'Esperando confirmación...';
        }
    };

    const getStatusDescription = () => {
        switch (orderStatus) {
            case 'processing':
                return 'Estamos preparando tu álbum personalizado';
            case 'confirmed':
                return 'Tu álbum está en producción y será enviado pronto';
            default:
                return 'Procesando información del pedido';
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-white shadow-sm px-4 py-4 flex items-center">
                <Link href="/album-final" className="mr-4">
                    <i className="fa-solid fa-arrow-left text-gray-600 text-lg"></i>
                </Link>
                <div className="flex-1">
                    <h1 className="text-lg font-semibold text-gray-900">Confirmación</h1>
                    <p className="text-sm text-gray-500">Tu pedido está siendo procesado</p>
                </div>
                <button>
                    <i className="fa-solid fa-share text-gray-600"></i>
                </button>
            </div>

            {/* Progress Bar */}
            <div className="px-4 py-4 bg-white border-b border-gray-100">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Paso 6 de 6</span>
                    <span className="text-sm text-primary font-medium">100%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full transition-all duration-500" style={{width: '100%'}}></div>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-4 py-6 space-y-6">
                
                {/* Order Status Card */}
                <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                    <div className="mb-4">
                        {getStatusIcon()}
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        {getStatusMessage()}
                    </h2>
                    <p className="text-gray-600 mb-4">
                        {getStatusDescription()}
                    </p>
                    
                    {orderStatus === 'confirmed' && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-center justify-center space-x-2 mb-2">
                                <i className="fa-solid fa-truck text-green-600"></i>
                                <span className="font-medium text-green-800">Número de seguimiento</span>
                            </div>
                            <p className="text-lg font-bold text-green-900">{trackingNumber}</p>
                        </div>
                    )}
                </div>

                {/* Order Details */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <i className="fa-solid fa-receipt text-primary text-sm"></i>
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">Detalles del Pedido</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Número de pedido</span>
                            <span className="font-medium text-gray-900">{orderDetails.orderNumber}</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Producto</span>
                            <span className="font-medium text-gray-900">{orderDetails.album}</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Total pagado</span>
                            <span className="font-bold text-primary">${orderDetails.total.toFixed(2)}</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Tiempo estimado</span>
                            <span className="font-medium text-gray-900">{orderDetails.estimatedDelivery}</span>
                        </div>
                    </div>
                </div>

                {/* Shipping Information */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                            <i className="fa-solid fa-truck text-accent text-sm"></i>
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">Dirección de Envío</h2>
                    </div>

                    <div className="space-y-2">
                        <p className="font-medium text-gray-900">{orderDetails.shippingAddress.name}</p>
                        <p className="text-gray-600">{orderDetails.shippingAddress.address}</p>
                        <p className="text-gray-600">{orderDetails.shippingAddress.city}</p>
                        <p className="text-gray-600">{orderDetails.shippingAddress.phone}</p>
                        <p className="text-gray-600">{orderDetails.shippingAddress.email}</p>
                    </div>
                </div>

                {/* Next Steps */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <i className="fa-solid fa-info text-primary text-sm"></i>
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">Próximos Pasos</h2>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                                1
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Recibirás un email de confirmación</p>
                                <p className="text-sm text-gray-600">Con todos los detalles de tu pedido</p>
                            </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                                2
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Producción de tu álbum</p>
                                <p className="text-sm text-gray-600">Tiempo estimado: 5-7 días hábiles</p>
                            </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                                3
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Envío y seguimiento</p>
                                <p className="text-sm text-gray-600">Recibirás actualizaciones por email</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Support Card */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <i className="fa-solid fa-headset text-green-600 text-sm"></i>
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">¿Necesitas Ayuda?</h2>
                    </div>

                    <p className="text-gray-600 mb-4">
                        Si tienes alguna pregunta sobre tu pedido, no dudes en contactarnos.
                    </p>

                    <div className="space-y-3">
                        <button className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 px-4 flex items-center justify-center space-x-2 hover:bg-gray-100 transition-colors">
                            <i className="fa-solid fa-envelope text-gray-600"></i>
                            <span className="text-gray-700">Enviar email</span>
                        </button>
                        
                        <button className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 px-4 flex items-center justify-center space-x-2 hover:bg-gray-100 transition-colors">
                            <i className="fa-solid fa-phone text-gray-600"></i>
                            <span className="text-gray-700">Llamar soporte</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="px-4 pb-8 space-y-3">
                <Link 
                    href="/dashboard"
                    className="w-full bg-primary text-white font-semibold py-4 rounded-xl shadow-lg flex items-center justify-center space-x-3 hover:bg-blue-700 transition-colors"
                >
                    <i className="fa-solid fa-home"></i>
                    <span>Volver al Dashboard</span>
                </Link>
                
                <button className="w-full bg-white border border-gray-200 rounded-xl py-4 px-6 flex items-center justify-center space-x-3 shadow-sm hover:bg-gray-50 transition-colors">
                    <i className="fa-solid fa-download text-primary"></i>
                    <span className="font-medium text-gray-900">Descargar Comprobante</span>
                </button>
            </div>

            {/* Bottom Safe Area */}
            <div className="h-8"></div>
        </div>
    );
}
