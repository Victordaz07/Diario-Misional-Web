'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useTranslations } from '@/lib/use-translations';
import Link from 'next/link';

export default function PaymentPage() {
    const { user } = useAuth();
    const { t } = useTranslations();
    const [isProcessing, setIsProcessing] = useState(false);
    const [formData, setFormData] = useState({
        fullName: 'María González',
        address: 'Calle 123 #45-67, Apto 301',
        city: 'Bogotá',
        state: 'Cundinamarca',
        email: 'maria@email.com',
        phone: '+57 300 123 4567'
    });

    const orderSummary = {
        album: 'Álbum Completo',
        pages: '150 páginas',
        description: 'Diario + Fotos + Estadísticas',
        cover: 'Diseño Clásico',
        albumPrice: 79.99,
        shipping: 10.00,
        tax: 17.10,
        total: 107.09,
        deliveryTime: '18-21 días hábiles'
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePayment = async () => {
        setIsProcessing(true);
        
        // Simulate payment processing
        setTimeout(() => {
            console.log('Payment processed successfully');
            // Navigate to confirmation page
            window.location.href = '/album-final/confirmacion';
        }, 3000);
    };

    const isFormValid = () => {
        return Object.values(formData).every(value => value.trim() !== '');
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-white shadow-sm px-4 py-4 flex items-center">
                <Link href="/album-final/personalizar" className="mr-4">
                    <i className="fa-solid fa-arrow-left text-gray-600 text-lg"></i>
                </Link>
                <div className="flex-1">
                    <h1 className="text-lg font-semibold text-gray-900">Pago y Envío</h1>
                    <p className="text-sm text-gray-500">Completa tu pedido</p>
                </div>
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <i className="fa-solid fa-lock text-primary text-sm"></i>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="px-4 py-4 bg-white border-b border-gray-100">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Paso 4 de 6</span>
                    <span className="text-sm text-primary font-medium">75%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full transition-all duration-500" style={{width: '75%'}}></div>
                </div>
            </div>

            {/* Form Container */}
            <div className="px-4 py-6 space-y-6">
                
                {/* Shipping Information Card */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <i className="fa-solid fa-truck text-primary text-sm"></i>
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">Datos de Envío</h2>
                    </div>
                    
                    <form className="space-y-4">
                        {/* Full Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Nombre Completo</label>
                            <input 
                                type="text" 
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" 
                                placeholder="María González"
                            />
                        </div>

                        {/* Address */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Dirección Completa</label>
                            <input 
                                type="text" 
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" 
                                placeholder="Calle 123 #45-67, Apto 301"
                            />
                        </div>

                        {/* City and State */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Ciudad</label>
                                <input 
                                    type="text" 
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" 
                                    placeholder="Bogotá"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Departamento</label>
                                <input 
                                    type="text" 
                                    name="state"
                                    value={formData.state}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" 
                                    placeholder="Cundinamarca"
                                />
                            </div>
                        </div>

                        {/* Email and Phone */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Correo Electrónico</label>
                                <input 
                                    type="email" 
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" 
                                    placeholder="maria@email.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Teléfono</label>
                                <input 
                                    type="tel" 
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" 
                                    placeholder="+57 300 123 4567"
                                />
                            </div>
                        </div>
                    </form>
                </div>

                {/* Order Summary Card */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                            <i className="fa-solid fa-receipt text-accent text-sm"></i>
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">Resumen del Pedido</h2>
                    </div>

                    {/* Album Preview */}
                    <div className="flex items-center space-x-4 mb-4 p-3 bg-gray-50 rounded-lg">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                            <i className="fa-solid fa-book text-white text-xl"></i>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{orderSummary.album}</h3>
                            <p className="text-sm text-gray-500">{orderSummary.pages} • {orderSummary.description}</p>
                            <p className="text-sm text-primary font-medium">Portada: {orderSummary.cover}</p>
                        </div>
                    </div>

                    {/* Price Breakdown */}
                    <div className="space-y-3 border-t border-gray-100 pt-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">{orderSummary.album}</span>
                            <span className="font-medium">${orderSummary.albumPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Envío Nacional</span>
                            <span className="font-medium">${orderSummary.shipping.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">IVA (19%)</span>
                            <span className="text-gray-500">${orderSummary.tax.toFixed(2)}</span>
                        </div>
                        <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                            <span className="text-lg font-semibold text-gray-900">Total</span>
                            <span className="text-lg font-bold text-primary">${orderSummary.total.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Delivery Time */}
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="flex items-center space-x-2">
                            <i className="fa-solid fa-calendar-days text-primary text-sm"></i>
                            <span className="text-sm font-medium text-primary">Tiempo estimado: {orderSummary.deliveryTime}</span>
                        </div>
                    </div>
                </div>

                {/* Payment Method Card */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <i className="fa-solid fa-credit-card text-green-600 text-sm"></i>
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">Método de Pago</h2>
                    </div>

                    {/* Stripe Payment Element */}
                    <div className="mb-4">
                        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                            <div className="flex items-center justify-center space-x-3 text-gray-500">
                                <i className="fa-brands fa-cc-visa text-2xl"></i>
                                <i className="fa-brands fa-cc-mastercard text-2xl"></i>
                                <i className="fa-brands fa-cc-amex text-2xl"></i>
                                <i className="fa-solid fa-mobile-alt text-xl"></i>
                            </div>
                            <p className="text-center text-sm text-gray-600 mt-2">Pago seguro con Stripe</p>
                        </div>
                    </div>

                    {/* Security Badge */}
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                        <i className="fa-solid fa-shield-halved text-green-500"></i>
                        <span>Pago 100% seguro y encriptado</span>
                    </div>
                </div>
            </div>

            {/* Fixed Bottom Button */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
                <button 
                    onClick={handlePayment}
                    disabled={!isFormValid() || isProcessing}
                    className={`w-full font-semibold py-4 rounded-xl shadow-lg flex items-center justify-center space-x-3 transition-colors ${
                        isFormValid() && !isProcessing
                            ? 'bg-primary text-white hover:bg-blue-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                    {isProcessing ? (
                        <>
                            <i className="fa-solid fa-spinner fa-spin"></i>
                            <span>Procesando...</span>
                        </>
                    ) : (
                        <>
                            <i className="fa-solid fa-lock"></i>
                            <span>Pagar y Ordenar • ${orderSummary.total.toFixed(2)}</span>
                        </>
                    )}
                </button>
                
                <div className="flex items-center justify-center space-x-2 mt-3 text-xs text-gray-500">
                    <i className="fa-solid fa-info-circle"></i>
                    <span>Al continuar aceptas nuestros términos y condiciones</span>
                </div>
            </div>

            {/* Bottom Safe Area */}
            <div className="h-24"></div>
        </div>
    );
}
