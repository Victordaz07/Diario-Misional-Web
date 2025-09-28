'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useTranslations } from '@/lib/use-translations';
import Link from 'next/link';

export default function ConfiguracionPage() {
    const { user } = useAuth();
    const { t } = useTranslations();
    const [notificationMode, setNotificationMode] = useState('minimal');
    const [backupFrequency, setBackupFrequency] = useState('daily');
    const [darkMode, setDarkMode] = useState(false);
    const [autoSync, setAutoSync] = useState(true);
    const [biometricAuth, setBiometricAuth] = useState(true);

    const storageData = {
        used: '2.3 GB',
        total: '5 GB',
        percentage: 46,
        available: '2.7 GB',
        breakdown: {
            photos: '1.2 GB',
            diary: '0.8 GB',
            others: '0.3 GB'
        }
    };

    const handleNotificationModeChange = (mode: string) => {
        setNotificationMode(mode);
    };

    const handleBackupFrequencyChange = (frequency: string) => {
        setBackupFrequency(frequency);
    };

    const handleBackupNow = () => {
        console.log('Iniciando respaldo...');
        // Simulate backup process
    };

    const handleDownload = () => {
        console.log('Descargando datos...');
        // Simulate download process
    };

    const handleSupport = () => {
        console.log('Contactando soporte...');
        // Navigate to support or open contact modal
    };

    const handleTerms = () => {
        console.log('Abriendo términos y condiciones...');
        // Navigate to terms page
    };

    const handlePrivacy = () => {
        console.log('Abriendo política de privacidad...');
        // Navigate to privacy page
    };

    return (
        <div className="min-h-screen bg-gray-50 overflow-x-hidden">
            {/* Sidebar */}
            <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg transform -translate-x-full transition-transform duration-300 ease-in-out z-50 md:translate-x-0">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                            <i className="fa-solid fa-book text-white text-lg"></i>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">Diario Misional</h2>
                            <p className="text-xs text-gray-500">Web App</p>
                        </div>
                    </div>
                </div>
                
                <nav className="p-4">
                    <ul className="space-y-2">
                        <li>
                            <Link href="/dashboard" className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                                <i className="fa-solid fa-home"></i>
                                <span>Inicio</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/diario" className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                                <i className="fa-solid fa-book-open"></i>
                                <span>Diario</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/traslados" className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                                <i className="fa-solid fa-route"></i>
                                <span>Traslados</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/fotos" className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                                <i className="fa-solid fa-camera"></i>
                                <span>Fotos</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/recursos" className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                                <i className="fa-solid fa-folder"></i>
                                <span>Recursos</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/etapas" className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                                <i className="fa-solid fa-seedling"></i>
                                <span>Etapas</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/perfil" className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                                <i className="fa-solid fa-user"></i>
                                <span>Perfil</span>
                            </Link>
                        </li>
                        <li>
                            <span className="flex items-center space-x-3 p-3 rounded-lg bg-primary text-white cursor-pointer">
                                <i className="fa-solid fa-cog"></i>
                                <span className="font-medium">Configuración</span>
                            </span>
                        </li>
                    </ul>
                </nav>
                
                <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-gradient-to-r from-secondary/10 to-primary/10 p-4 rounded-lg border border-secondary/20">
                        <div className="flex items-center space-x-2 mb-2">
                            <i className="fa-solid fa-crown text-secondary"></i>
                            <span className="text-sm font-medium text-gray-700">Patrocinio Activo</span>
                        </div>
                        <p className="text-xs text-gray-600">Conectado con familia</p>
                    </div>
                </div>
            </div>

            {/* Overlay for mobile */}
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40 hidden md:hidden"></div>

            <div className="md:ml-64">
                {/* Header */}
                <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
                    <div className="px-4 py-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <button className="md:hidden p-2 rounded-lg hover:bg-gray-100">
                                    <i className="fa-solid fa-bars text-gray-600"></i>
                                </button>
                                <div className="flex items-center space-x-3">
                                    <Link href="/dashboard" className="p-2 rounded-lg hover:bg-gray-100 text-gray-600">
                                        <i className="fa-solid fa-arrow-left"></i>
                                    </Link>
                                    <div>
                                        <h1 className="text-xl font-semibold text-gray-800">Configuración</h1>
                                        <p className="text-sm text-gray-500">Ajustar preferencias de la app</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                                <select className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary">
                                    <option>Español</option>
                                    <option>English</option>
                                    <option>Português</option>
                                </select>
                                
                                <div className="flex items-center space-x-2">
                                    <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg" alt="User" className="w-8 h-8 rounded-full" />
                                    <span className="text-sm font-medium text-gray-700 hidden sm:block">Elder Smith</span>
                                </div>
                                
                                <button className="p-2 text-gray-500 hover:text-gray-700">
                                    <i className="fa-solid fa-sign-out-alt"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="p-4 space-y-6 max-w-4xl mx-auto">
                    {/* Notifications Section */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                    <i className="fa-solid fa-bell text-primary"></i>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">Notificaciones</h3>
                                    <p className="text-sm text-gray-600">Controla cómo y cuándo recibir notificaciones</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-6 space-y-6">
                            <div className="space-y-4">
                                <h4 className="text-sm font-medium text-gray-700 uppercase tracking-wide">Modo de Notificación</h4>
                                
                                <div className="space-y-3">
                                    <label className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                                        notificationMode === 'silent' 
                                            ? 'border-primary bg-primary/5' 
                                            : 'border-gray-200 hover:bg-gray-50'
                                    }`}>
                                        <input 
                                            type="radio" 
                                            name="notification-mode" 
                                            value="silent" 
                                            checked={notificationMode === 'silent'}
                                            onChange={(e) => handleNotificationModeChange(e.target.value)}
                                            className="text-primary focus:ring-primary"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2">
                                                <i className={`fa-solid fa-volume-mute ${
                                                    notificationMode === 'silent' ? 'text-primary' : 'text-gray-400'
                                                }`}></i>
                                                <span className="font-medium text-gray-800">Silencioso</span>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">Solo notificaciones visuales, sin sonidos</p>
                                        </div>
                                    </label>
                                    
                                    <label className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                                        notificationMode === 'minimal' 
                                            ? 'border-primary bg-primary/5' 
                                            : 'border-gray-200 hover:bg-gray-50'
                                    }`}>
                                        <input 
                                            type="radio" 
                                            name="notification-mode" 
                                            value="minimal" 
                                            checked={notificationMode === 'minimal'}
                                            onChange={(e) => handleNotificationModeChange(e.target.value)}
                                            className="text-primary focus:ring-primary"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2">
                                                <i className={`fa-solid fa-volume-low ${
                                                    notificationMode === 'minimal' ? 'text-primary' : 'text-gray-400'
                                                }`}></i>
                                                <span className="font-medium text-gray-800">Mínimal</span>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">Notificaciones importantes únicamente</p>
                                        </div>
                                    </label>
                                    
                                    <label className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                                        notificationMode === 'custom' 
                                            ? 'border-primary bg-primary/5' 
                                            : 'border-gray-200 hover:bg-gray-50'
                                    }`}>
                                        <input 
                                            type="radio" 
                                            name="notification-mode" 
                                            value="custom" 
                                            checked={notificationMode === 'custom'}
                                            onChange={(e) => handleNotificationModeChange(e.target.value)}
                                            className="text-primary focus:ring-primary"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2">
                                                <i className={`fa-solid fa-sliders ${
                                                    notificationMode === 'custom' ? 'text-primary' : 'text-gray-400'
                                                }`}></i>
                                                <span className="font-medium text-gray-800">Personalizado</span>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">Configurar cada tipo por separado</p>
                                        </div>
                                    </label>
                                </div>
                            </div>
                            
                            {notificationMode === 'custom' && (
                                <div className="space-y-4">
                                    <h4 className="text-sm font-medium text-gray-700 uppercase tracking-wide">Configuración Detallada</h4>
                                    
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <i className="fa-solid fa-calendar text-gray-400"></i>
                                                <span className="text-sm font-medium text-gray-700">Recordatorios de diario</span>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                            </label>
                                        </div>
                                        
                                        <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <i className="fa-solid fa-heart text-gray-400"></i>
                                                <span className="text-sm font-medium text-gray-700">Actualizaciones familiares</span>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                            </label>
                                        </div>
                                        
                                        <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <i className="fa-solid fa-cloud text-gray-400"></i>
                                                <span className="text-sm font-medium text-gray-700">Respaldos completados</span>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Backup Section */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                                    <i className="fa-solid fa-cloud-arrow-up text-secondary"></i>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">Respaldos</h3>
                                    <p className="text-sm text-gray-600">Configurar frecuencia y tipo de respaldos</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-6 space-y-6">
                            <div className="space-y-4">
                                <h4 className="text-sm font-medium text-gray-700 uppercase tracking-wide">Frecuencia de Respaldo</h4>
                                
                                <div className="grid grid-cols-2 gap-3">
                                    <label className={`flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-colors ${
                                        backupFrequency === 'manual' 
                                            ? 'border-primary bg-primary/5' 
                                            : 'border-gray-200 hover:bg-gray-50'
                                    }`}>
                                        <input 
                                            type="radio" 
                                            name="backup-frequency" 
                                            value="manual" 
                                            checked={backupFrequency === 'manual'}
                                            onChange={(e) => handleBackupFrequencyChange(e.target.value)}
                                            className="sr-only peer"
                                        />
                                        <div className={`text-center ${backupFrequency === 'manual' ? 'text-primary' : ''}`}>
                                            <i className="fa-solid fa-hand text-xl mb-2"></i>
                                            <div className="text-sm font-medium">Manual</div>
                                            <div className="text-xs text-gray-500">Solo cuando lo solicites</div>
                                        </div>
                                    </label>
                                    
                                    <label className={`flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-colors ${
                                        backupFrequency === 'daily' 
                                            ? 'border-primary bg-primary/5' 
                                            : 'border-gray-200 hover:bg-gray-50'
                                    }`}>
                                        <input 
                                            type="radio" 
                                            name="backup-frequency" 
                                            value="daily" 
                                            checked={backupFrequency === 'daily'}
                                            onChange={(e) => handleBackupFrequencyChange(e.target.value)}
                                            className="sr-only peer"
                                        />
                                        <div className={`text-center ${backupFrequency === 'daily' ? 'text-primary' : ''}`}>
                                            <i className="fa-solid fa-calendar-day text-xl mb-2"></i>
                                            <div className="text-sm font-medium">Diario</div>
                                            <div className="text-xs text-gray-500">Cada 24 horas</div>
                                        </div>
                                    </label>
                                    
                                    <label className={`flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-colors ${
                                        backupFrequency === 'weekly' 
                                            ? 'border-primary bg-primary/5' 
                                            : 'border-gray-200 hover:bg-gray-50'
                                    }`}>
                                        <input 
                                            type="radio" 
                                            name="backup-frequency" 
                                            value="weekly" 
                                            checked={backupFrequency === 'weekly'}
                                            onChange={(e) => handleBackupFrequencyChange(e.target.value)}
                                            className="sr-only peer"
                                        />
                                        <div className={`text-center ${backupFrequency === 'weekly' ? 'text-primary' : ''}`}>
                                            <i className="fa-solid fa-calendar-week text-xl mb-2"></i>
                                            <div className="text-sm font-medium">Semanal</div>
                                            <div className="text-xs text-gray-500">Cada domingo</div>
                                        </div>
                                    </label>
                                    
                                    <label className={`flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-colors ${
                                        backupFrequency === 'monthly' 
                                            ? 'border-primary bg-primary/5' 
                                            : 'border-gray-200 hover:bg-gray-50'
                                    }`}>
                                        <input 
                                            type="radio" 
                                            name="backup-frequency" 
                                            value="monthly" 
                                            checked={backupFrequency === 'monthly'}
                                            onChange={(e) => handleBackupFrequencyChange(e.target.value)}
                                            className="sr-only peer"
                                        />
                                        <div className={`text-center ${backupFrequency === 'monthly' ? 'text-primary' : ''}`}>
                                            <i className="fa-solid fa-calendar text-xl mb-2"></i>
                                            <div className="text-sm font-medium">Mensual</div>
                                            <div className="text-xs text-gray-500">Primer día del mes</div>
                                        </div>
                                    </label>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <h4 className="text-sm font-medium text-gray-700 uppercase tracking-wide">Estado del Almacenamiento</h4>
                                
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-medium text-gray-700">Espacio utilizado</span>
                                        <span className="text-sm font-bold text-gray-800">{storageData.used} de {storageData.total}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div 
                                            className="bg-gradient-to-r from-primary to-accent h-3 rounded-full transition-all duration-300" 
                                            style={{width: `${storageData.percentage}%`}}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                                        <span>{storageData.percentage}% utilizado</span>
                                        <span>{storageData.available} disponibles</span>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-3 gap-3 text-center">
                                    <div className="bg-blue-50 p-3 rounded-lg">
                                        <div className="text-lg font-bold text-blue-600">{storageData.breakdown.photos}</div>
                                        <div className="text-xs text-blue-600">Fotos</div>
                                    </div>
                                    <div className="bg-green-50 p-3 rounded-lg">
                                        <div className="text-lg font-bold text-green-600">{storageData.breakdown.diary}</div>
                                        <div className="text-xs text-green-600">Diario</div>
                                    </div>
                                    <div className="bg-yellow-50 p-3 rounded-lg">
                                        <div className="text-lg font-bold text-yellow-600">{storageData.breakdown.others}</div>
                                        <div className="text-xs text-yellow-600">Otros</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex space-x-3">
                                <button 
                                    onClick={handleBackupNow}
                                    className="flex-1 bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                                >
                                    <i className="fa-solid fa-cloud-arrow-up mr-2"></i>
                                    Respaldar Ahora
                                </button>
                                <button 
                                    onClick={handleDownload}
                                    className="px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <i className="fa-solid fa-download"></i>
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Other Settings Section */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <i className="fa-solid fa-sliders text-green-600"></i>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">Otros Parámetros</h3>
                                    <p className="text-sm text-gray-600">Configuraciones adicionales de la aplicación</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <i className="fa-solid fa-moon text-gray-400"></i>
                                    <div>
                                        <span className="text-sm font-medium text-gray-700">Modo oscuro</span>
                                        <p className="text-xs text-gray-500">Activar tema oscuro</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={darkMode}
                                        onChange={(e) => setDarkMode(e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>
                            
                            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <i className="fa-solid fa-wifi text-gray-400"></i>
                                    <div>
                                        <span className="text-sm font-medium text-gray-700">Sincronización automática</span>
                                        <p className="text-xs text-gray-500">Solo con WiFi</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={autoSync}
                                        onChange={(e) => setAutoSync(e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>
                            
                            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <i className="fa-solid fa-fingerprint text-gray-400"></i>
                                    <div>
                                        <span className="text-sm font-medium text-gray-700">Autenticación biométrica</span>
                                        <p className="text-xs text-gray-500">Usar huella o Face ID</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={biometricAuth}
                                        onChange={(e) => setBiometricAuth(e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>
                        </div>
                    </section>

                    {/* About Section */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <i className="fa-solid fa-info-circle text-purple-600"></i>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">Acerca de la App</h3>
                                    <p className="text-sm text-gray-600">Información y soporte</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <i className="fa-solid fa-code text-gray-400"></i>
                                    <span className="text-sm font-medium text-gray-700">Versión</span>
                                </div>
                                <span className="text-sm text-gray-600">2.1.4</span>
                            </div>
                            
                            <button 
                                onClick={handleTerms}
                                className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center space-x-3">
                                    <i className="fa-solid fa-file-text text-gray-400"></i>
                                    <span className="text-sm font-medium text-gray-700">Términos y condiciones</span>
                                </div>
                                <i className="fa-solid fa-chevron-right text-gray-400"></i>
                            </button>
                            
                            <button 
                                onClick={handlePrivacy}
                                className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center space-x-3">
                                    <i className="fa-solid fa-shield-alt text-gray-400"></i>
                                    <span className="text-sm font-medium text-gray-700">Política de privacidad</span>
                                </div>
                                <i className="fa-solid fa-chevron-right text-gray-400"></i>
                            </button>
                            
                            <button 
                                onClick={handleSupport}
                                className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center space-x-3">
                                    <i className="fa-solid fa-headset text-gray-400"></i>
                                    <span className="text-sm font-medium text-gray-700">Soporte técnico</span>
                                </div>
                                <i className="fa-solid fa-chevron-right text-gray-400"></i>
                            </button>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}
