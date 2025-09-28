'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useTranslations } from '@/lib/use-translations';
import Link from 'next/link';

export default function OrderTrackingPage() {
    const { user } = useAuth();
    const { t } = useTranslations();
    const [currentStep, setCurrentStep] = useState(3);
    const [progress, setProgress] = useState(75);

    const orderDetails = {
        orderNumber: 'ALB-2024-001',
        album: 'Álbum Completo',
        pages: '150 páginas',
        description: 'Diario + Fotos + Estadísticas',
        price: '$89.99',
        estimatedDelivery: '18-21 días hábiles',
        estimatedDate: '15-18 Oct 2024',
        shippingAddress: {
            name: 'María González',
            address: 'Calle 123 #45-67, Apto 301',
            city: 'Bogotá, Cundinamarca',
            country: 'Colombia, 110111'
        }
    };

    const timelineSteps = [
        {
            id: 1,
            title: 'Pago Confirmado',
            description: 'Tu pago ha sido procesado exitosamente',
            status: 'completed',
            date: '25 Sep 2024, 14:30',
            icon: 'fa-check',
            color: 'bg-primary'
        },
        {
            id: 2,
            title: 'Archivo Enviado a Imprenta',
            description: 'Tu álbum está siendo preparado para impresión',
            status: 'completed',
            date: '25 Sep 2024, 16:45',
            icon: 'fa-file-arrow-up',
            color: 'bg-primary'
        },
        {
            id: 3,
            title: 'En Producción',
            description: 'Tu álbum está siendo impreso y encuadernado',
            status: 'current',
            date: 'Iniciado 26 Sep 2024',
            icon: 'fa-print',
            color: 'bg-accent',
            progress: progress
        },
        {
            id: 4,
            title: 'Enviado',
            description: 'Tu álbum será enviado a tu dirección',
            status: 'pending',
            date: 'Pendiente',
            icon: 'fa-truck',
            color: 'bg-gray-200'
        },
        {
            id: 5,
            title: 'Entregado',
            description: 'Tu álbum ha llegado a destino',
            status: 'pending',
            date: 'Pendiente',
            icon: 'fa-home',
            color: 'bg-gray-200'
        }
    ];

    useEffect(() => {
        // Simulate progress animation
        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    // Move to next step
                    setCurrentStep(4);
                    clearInterval(timer);
                    return 100;
                }
                return prev + 1;
            });
        }, 100);

        return () => clearInterval(timer);
    }, []);

    const handleContactSupport = () => {
        console.log('Contacting support...');
        // Navigate to support or open contact modal
    };

    const handleShareTracking = () => {
        console.log('Sharing tracking information...');
        // Share tracking link
    };

    const handleEditAddress = () => {
        console.log('Editing shipping address...');
        // Navigate to address edit page
    };

    const getStepStatus = (step: any) => {
        if (step.status === 'completed') {
            return {
                bgColor: 'bg-primary',
                textColor: 'text-gray-900',
                descColor: 'text-gray-500',
                dateColor: 'text-accent',
                shadow: 'shadow-lg'
            };
        } else if (step.status === 'current') {
            return {
                bgColor: 'bg-accent',
                textColor: 'text-gray-900',
                descColor: 'text-gray-500',
                dateColor: 'text-accent',
                shadow: 'shadow-lg animate-pulse'
            };
        } else {
            return {
                bgColor: 'bg-gray-200',
                textColor: 'text-gray-400',
                descColor: 'text-gray-400',
                dateColor: 'text-gray-400',
                shadow: ''
            };
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-white shadow-sm px-4 py-4 flex items-center">
                <Link href="/album-final/confirmacion" className="mr-4">
                    <i className="fa-solid fa-arrow-left text-gray-600 text-lg"></i>
                </Link>
                <div className="flex-1">
                    <h1 className="text-lg font-semibold text-gray-900">Estado del Pedido</h1>
                    <p className="text-sm text-gray-500">Pedido #{orderDetails.orderNumber}</p>
                </div>
                <button>
                    <i className="fa-solid fa-ellipsis-vertical text-gray-600"></i>
                </button>
            </div>

            {/* Order Summary Card */}
            <div className="mx-4 mt-4 bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-center space-x-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                        <i className="fa-solid fa-book text-white text-xl"></i>
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{orderDetails.album}</h3>
                        <p className="text-sm text-gray-500">{orderDetails.pages} • {orderDetails.description}</p>
                        <p className="text-sm font-medium text-primary">{orderDetails.price}</p>
                    </div>
                </div>
            </div>

            {/* Timeline Section */}
            <div className="mx-4 mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Progreso del Pedido</h2>
                
                {/* Timeline Container */}
                <div className="relative">
                    {/* Timeline Line */}
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                    <div 
                        className="absolute left-6 top-0 w-0.5 bg-primary transition-all duration-500" 
                        style={{height: `${(currentStep / timelineSteps.length) * 100}%`}}
                    ></div>
                    
                    {/* Timeline Steps */}
                    <div className="space-y-6">
                        {timelineSteps.map((step, index) => {
                            const status = getStepStatus(step);
                            return (
                                <div key={step.id} className="flex items-start space-x-4">
                                    <div className={`w-12 h-12 ${status.bgColor} rounded-full flex items-center justify-center ${status.shadow}`}>
                                        <i className={`fa-solid ${step.icon} text-white text-sm`}></i>
                                    </div>
                                    <div className="flex-1 pt-2">
                                        <h3 className={`font-semibold ${status.textColor}`}>{step.title}</h3>
                                        <p className={`text-sm ${status.descColor}`}>{step.description}</p>
                                        <p className={`text-xs font-medium mt-1 ${status.dateColor}`}>
                                            {step.status === 'current' ? 'En progreso • ' : step.status === 'completed' ? 'Completado • ' : ''}
                                            {step.date}
                                        </p>
                                        {step.status === 'current' && step.progress && (
                                            <div className="mt-2 bg-gray-100 rounded-full h-2">
                                                <div 
                                                    className="bg-accent h-2 rounded-full transition-all duration-300" 
                                                    style={{width: `${step.progress}%`}}
                                                ></div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Estimated Delivery Card */}
            <div className="mx-4 mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <i className="fa-solid fa-calendar-days text-primary text-sm"></i>
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">Tiempo Estimado de Entrega</h3>
                        <p className="text-sm text-gray-600">{orderDetails.estimatedDelivery} desde la confirmación</p>
                        <p className="text-xs text-primary font-medium mt-1">Fecha estimada: {orderDetails.estimatedDate}</p>
                    </div>
                </div>
            </div>

            {/* Shipping Address Card */}
            <div className="mx-4 mt-4 bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <i className="fa-solid fa-location-dot text-gray-600 text-sm"></i>
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">Dirección de Envío</h3>
                        <p className="text-sm text-gray-600 mt-1">
                            {orderDetails.shippingAddress.name}<br />
                            {orderDetails.shippingAddress.address}<br />
                            {orderDetails.shippingAddress.city}<br />
                            {orderDetails.shippingAddress.country}
                        </p>
                    </div>
                    <button 
                        onClick={handleEditAddress}
                        className="text-primary hover:text-primary/80 transition-colors"
                    >
                        <i className="fa-solid fa-edit text-sm"></i>
                    </button>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="mx-4 mt-6 space-y-3 pb-8">
                {/* Contact Support Button */}
                <button 
                    onClick={handleContactSupport}
                    className="w-full bg-white border border-gray-200 rounded-xl py-4 px-6 flex items-center justify-center space-x-3 shadow-sm hover:bg-gray-50 transition-colors"
                >
                    <i className="fa-solid fa-headset text-primary"></i>
                    <span className="font-medium text-gray-900">Contactar Soporte</span>
                </button>

                {/* Share Tracking Button */}
                <button 
                    onClick={handleShareTracking}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl py-4 px-6 flex items-center justify-center space-x-3 hover:bg-gray-100 transition-colors"
                >
                    <i className="fa-solid fa-share text-gray-600"></i>
                    <span className="font-medium text-gray-600">Compartir Seguimiento</span>
                </button>
            </div>

            {/* Bottom Safe Area */}
            <div className="h-8"></div>
        </div>
    );
}
