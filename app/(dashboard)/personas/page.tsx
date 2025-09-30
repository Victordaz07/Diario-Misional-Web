'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Contact {
    id: string;
    name: string;
    email: string;
    phone: string;
    type: 'leaders' | 'companions' | 'friends' | 'investigators' | 'members';
    role: string;
    protected: boolean;
    avatar: string;
}

export default function PersonasPage() {
    const { user, userProfile, logout } = useAuth();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
    const [contacts, setContacts] = useState<Contact[]>([
        {
            id: '1',
            name: 'Presidente García',
            email: 'presidente.garcia@mision.org',
            phone: '+54 11 1234-5678',
            type: 'leaders',
            role: 'Líder',
            protected: true,
            avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg'
        },
        {
            id: '2',
            name: 'Elder Johnson',
            email: 'elder.johnson@missionary.org',
            phone: '+54 11 2345-6789',
            type: 'leaders',
            role: 'Líder de Zona',
            protected: true,
            avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg'
        },
        {
            id: '3',
            name: 'Elder Martinez',
            email: 'elder.martinez@missionary.org',
            phone: '+54 11 3456-7890',
            type: 'companions',
            role: 'Compañero Actual',
            protected: false,
            avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-8.jpg'
        },
        {
            id: '4',
            name: 'Hermana López',
            email: 'maria.lopez@gmail.com',
            phone: '+54 11 4567-8901',
            type: 'friends',
            role: 'Miembro',
            protected: false,
            avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg'
        },
        {
            id: '5',
            name: 'Carlos González',
            email: 'carlos.gonzalez@hotmail.com',
            phone: '+54 11 5678-9012',
            type: 'investigators',
            role: 'Investigador',
            protected: false,
            avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-9.jpg'
        },
        {
            id: '6',
            name: 'Ana Rodríguez',
            email: 'ana.rodriguez@yahoo.com',
            phone: '+54 11 6789-0123',
            type: 'friends',
            role: 'Amiga',
            protected: false,
            avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-6.jpg'
        }
    ]);

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    const handleContactSelect = (contactId: string) => {
        setSelectedContacts(prev =>
            prev.includes(contactId)
                ? prev.filter(id => id !== contactId)
                : [...prev, contactId]
        );
    };

    const handleSelectAll = () => {
        const selectableContacts = contacts.filter(contact => !contact.protected);
        const allSelected = selectableContacts.every(contact => selectedContacts.includes(contact.id));

        if (allSelected) {
            setSelectedContacts([]);
        } else {
            setSelectedContacts(selectableContacts.map(contact => contact.id));
        }
    };

    const handleDeleteContact = (contactId: string) => {
        if (confirm('¿Estás seguro de que quieres eliminar este contacto?')) {
            setContacts(prev => prev.filter(contact => contact.id !== contactId));
            setSelectedContacts(prev => prev.filter(id => id !== contactId));
        }
    };

    const handleCallContact = (phone: string) => {
        window.open(`tel:${phone}`, '_self');
    };

    const handleEmailContact = (email: string) => {
        window.open(`mailto:${email}`, '_self');
    };

    const handleExportContacts = () => {
        const selectedContactsData = contacts.filter(contact => selectedContacts.includes(contact.id));
        const csvContent = [
            ['Nombre', 'Email', 'Teléfono', 'Tipo', 'Rol'],
            ...selectedContactsData.map(contact => [
                contact.name,
                contact.email,
                contact.phone,
                contact.type,
                contact.role
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'contactos-seleccionados.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const getRoleBadgeColor = (type: string) => {
        switch (type) {
            case 'leaders':
                return 'bg-primary/10 text-primary';
            case 'companions':
                return 'bg-green-100 text-green-700';
            case 'friends':
                return 'bg-purple-100 text-purple-700';
            case 'investigators':
                return 'bg-yellow-100 text-yellow-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const filteredContacts = contacts.filter(contact => {
        const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterType === 'all' || contact.type === filterType;
        return matchesSearch && matchesFilter;
    });

    const contactStats = {
        total: contacts.length,
        leaders: contacts.filter(c => c.type === 'leaders').length,
        companions: contacts.filter(c => c.type === 'companions').length,
        investigators: contacts.filter(c => c.type === 'investigators').length,
    };

    const allSelectableSelected = contacts.filter(c => !c.protected).every(c => selectedContacts.includes(c.id));

    return (
        <>
            {/* Font Awesome CDN */}
            <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js" crossOrigin="anonymous" referrerPolicy="no-referrer"></script>

            <div className="min-h-screen bg-gray-50 overflow-x-hidden">
                {/* Sidebar */}
                <div className={`fixed left-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}>
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
                                <Link href="/perfil" className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                                    <i className="fa-solid fa-seedling"></i>
                                    <span>Etapas</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/personas" className="flex items-center space-x-3 p-3 rounded-lg bg-primary text-white">
                                    <i className="fa-solid fa-address-book"></i>
                                    <span className="font-medium">Personas</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/perfil" className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                                    <i className="fa-solid fa-user"></i>
                                    <span>Perfil</span>
                                </Link>
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

                {/* Overlay para móvil */}
                <div className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden ${sidebarOpen ? 'block' : 'hidden'
                    }`} onClick={() => setSidebarOpen(false)}></div>

                {/* Contenido principal */}
                <div className="md:ml-64">
                    {/* Header */}
                    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
                        <div className="px-4 py-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={() => setSidebarOpen(true)}
                                        className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                                    >
                                        <i className="fa-solid fa-bars text-gray-600"></i>
                                    </button>
                                    <div>
                                        <h1 className="text-xl font-semibold text-gray-800">Personas</h1>
                                        <p className="text-sm text-gray-500">Gestiona tus contactos misionales</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <select className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary">
                                        <option>Español</option>
                                        <option>English</option>
                                        <option>Português</option>
                                    </select>

                                    <div className="flex items-center space-x-2">
                                        <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                                            <i className="fa-solid fa-user text-white text-sm"></i>
                                        </div>
                                        <span className="text-sm font-medium text-gray-700 hidden sm:block">
                                            {userProfile?.nombre || user?.displayName || 'Elder Smith'}
                                        </span>
                                    </div>

                                    <button onClick={handleLogout} className="p-2 text-gray-500 hover:text-gray-700">
                                        <i className="fa-solid fa-sign-out-alt"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Main Content */}
                    <main className="p-4">
                        {/* Toolbar */}
                        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                                <div className="flex items-center space-x-4">
                                    <div className="relative flex-1 md:w-80">
                                        <i className="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                                        <input
                                            type="text"
                                            placeholder="Buscar contactos..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        />
                                    </div>
                                    <select
                                        value={filterType}
                                        onChange={(e) => setFilterType(e.target.value)}
                                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value="all">Todos</option>
                                        <option value="leaders">Líderes</option>
                                        <option value="companions">Compañeros</option>
                                        <option value="friends">Amigos</option>
                                        <option value="investigators">Investigadores</option>
                                    </select>
                                </div>

                                <div className="flex items-center space-x-3">
                                    {selectedContacts.length > 0 && (
                                        <>
                                            <div className="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-lg">
                                                {selectedContacts.length} seleccionado{selectedContacts.length > 1 ? 's' : ''}
                                            </div>
                                            <button
                                                onClick={handleExportContacts}
                                                className="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-secondary/90 transition-colors"
                                            >
                                                <i className="fa-solid fa-download mr-2"></i>
                                                Exportar
                                            </button>
                                        </>
                                    )}
                                    <button
                                        onClick={handleSelectAll}
                                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                        <i className={`fa-solid ${allSelectableSelected ? 'fa-square' : 'fa-check-square'} mr-2`}></i>
                                        {allSelectableSelected ? 'Deseleccionar todo' : 'Seleccionar todo'}
                                    </button>
                                    <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                                        <i className="fa-solid fa-plus mr-2"></i>
                                        Agregar
                                    </button>
                                </div>
                            </div>
                        </section>

                        {/* Contacts List */}
                        <section className="space-y-3">
                            {filteredContacts.map((contact) => (
                                <div key={contact.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedContacts.includes(contact.id)}
                                                onChange={() => handleContactSelect(contact.id)}
                                                disabled={contact.protected}
                                                className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
                                            />
                                        </div>
                                        <img
                                            src={contact.avatar}
                                            alt={contact.name}
                                            className="w-12 h-12 rounded-full"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2">
                                                <h3 className="font-semibold text-gray-800">{contact.name}</h3>
                                                <span className={`px-2 py-1 ${getRoleBadgeColor(contact.type)} text-xs rounded-full`}>
                                                    {contact.role}
                                                </span>
                                                {contact.protected && (
                                                    <i className="fa-solid fa-lock text-gray-400 text-sm" title="No eliminable"></i>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600">{contact.email}</p>
                                            <p className="text-xs text-gray-500">{contact.phone}</p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => handleCallContact(contact.phone)}
                                                className="p-2 text-gray-400 hover:text-primary transition-colors"
                                                title="Llamar"
                                            >
                                                <i className="fa-solid fa-phone"></i>
                                            </button>
                                            <button
                                                onClick={() => handleEmailContact(contact.email)}
                                                className="p-2 text-gray-400 hover:text-primary transition-colors"
                                                title="Enviar email"
                                            >
                                                <i className="fa-solid fa-envelope"></i>
                                            </button>
                                            {contact.protected ? (
                                                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                                                    <i className="fa-solid fa-ellipsis-v"></i>
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleDeleteContact(contact.id)}
                                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                                    title="Eliminar"
                                                >
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </section>

                        {/* Summary */}
                        <section className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                <div>
                                    <div className="text-2xl font-bold text-gray-800">{contactStats.total}</div>
                                    <div className="text-sm text-gray-600">Total contactos</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-primary">{contactStats.leaders}</div>
                                    <div className="text-sm text-gray-600">Líderes</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-green-600">{contactStats.companions}</div>
                                    <div className="text-sm text-gray-600">Compañeros</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-yellow-600">{contactStats.investigators}</div>
                                    <div className="text-sm text-gray-600">Investigadores</div>
                                </div>
                            </div>
                        </section>
                    </main>
                </div>
            </div>
        </>
    );
}
