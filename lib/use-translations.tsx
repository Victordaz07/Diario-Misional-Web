'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'es' | 'en' | 'fr' | 'pt-BR';

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

// Traducciones básicas para las 4 secciones principales
const translations = {
  es: {
    // Navegación
    home: "Inicio",
    diary: "Diario", 
    transfers: "Traslados",
    photos: "Fotos",
    resources: "Recursos",
    stages: "Etapas",
    sponsors: "Sponsors",
    profile: "Perfil",
    admin: "Admin",
    
    // Común
    loading: "Cargando...",
    save: "Guardar",
    cancel: "Cancelar",
    delete: "Eliminar",
    edit: "Editar",
    add: "Agregar",
    search: "Buscar",
    filter: "Filtrar",
    all: "Todos",
    close: "Cerrar",
    manage: "Gestiona tu",
    
    // Dashboard
    dashboard: "Dashboard",
    welcomeBack: "Bienvenido de vuelta",
    mission: "Misión",
    daysServed: "días servidos",
    diaryEntries: "Entradas del diario",
    transfers: "Traslados",
    photosUploaded: "Fotos subidas",
    recentActivity: "Actividad Reciente",
    
    // Diario
    diary: "Diario",
    newEntry: "Nueva Entrada",
    title: "Título",
    content: "Contenido",
    date: "Fecha",
    time: "Hora",
    location: "Ubicación",
    companion: "Compañero",
    category: "Categoría",
    exportPDF: "Exportar PDF",
    exportJSON: "Exportar JSON",
    
    // Fotos
    photoGallery: "Galería de Fotos",
    uploadPhoto: "Subir Foto",
    totalPhotos: "Total de fotos",
    thisWeek: "Esta semana",
    all: "Todas",
    recent: "Recientes",
    service: "Servicio",
    teaching: "Enseñanza",
    companions: "Compañeros",
    places: "Lugares",
    
    // Recursos
    missionaryResources: "Recursos Misionales",
    searchResources: "Buscar recursos...",
    allTypes: "Todos los tipos",
    allCategories: "Todas las categorías",
    pdfs: "PDFs",
    tips: "Consejos",
    videos: "Videos",
    featuredResources: "Recursos destacados",
    recentDownloads: "Descargas recientes",
    download: "Descargar",
    view: "Ver",
    
    // Etapas
    missionaryStages: "Etapas Misionales",
    currentStage: "Etapa Actual",
    completedStages: "Etapas Completadas",
    upcomingStages: "Próximas Etapas",
    progress: "Progreso",
    preMission: "Pre-Misión",
    mtc: "Centro de Capacitación Misional",
    field: "Campo Misional",
    postMission: "Post-Misión",
    
    // Sponsors
    shareWithSponsors: "Compartir con Sponsors",
    manageInvitations: "Gestionar Invitaciones",
    shareContent: "Compartir Contenido",
    overview: "Resumen",
    invites: "Invitaciones",
    content: "Contenido",
    settings: "Configuración",
    activeSponsors: "Sponsors Activos",
    pendingInvites: "Invitaciones Pendientes",
    
    // Portal Familiar
    familyPortal: "Portal Familiar",
    feed: "Feed",
    sponsorship: "Patrocinio",
    reports: "Reportes",
    totalDonated: "Total donado",
    activeSponsor: "Sponsor Activo",
    supportMission: "Apoya la Misión",
    familyPlan: "Plan Familiar",
    bronze: "Bronce",
    silver: "Plata",
    gold: "Oro",
    
    // Perfil
    profile: "Perfil",
    personalInfo: "Información Personal",
    missionProgress: "Progreso de la Misión",
    accountSettings: "Configuración de Cuenta",
    notifications: "Notificaciones",
    privacy: "Privacidad",
    changePhoto: "Cambiar Foto",
    exportData: "Exportar Datos",
    
    // Admin
    adminPanel: "Panel de Administración",
    metrics: "Métricas",
    users: "Usuarios",
    analytics: "Analytics",
    notifications: "Notificaciones",
    realtime: "Tiempo Real",
    totalRevenue: "Ingresos Totales",
    activeSubscriptions: "Suscripciones Activas",
    mrr: "MRR",
    activeConnections: "Conexiones Activas",
  },
  
  en: {
    // Navigation
    home: "Home",
    diary: "Diary",
    transfers: "Transfers", 
    photos: "Photos",
    resources: "Resources",
    stages: "Stages",
    sponsors: "Sponsors",
    profile: "Profile",
    admin: "Admin",
    
    // Common
    loading: "Loading...",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    add: "Add",
    search: "Search",
    filter: "Filter",
    all: "All",
    close: "Close",
    manage: "Manage your",
    
    // Dashboard
    dashboard: "Dashboard",
    welcomeBack: "Welcome back",
    mission: "Mission",
    daysServed: "days served",
    diaryEntries: "Diary entries",
    transfers: "Transfers",
    photosUploaded: "Photos uploaded",
    recentActivity: "Recent Activity",
    
    // Diary
    diary: "Diary",
    newEntry: "New Entry",
    title: "Title",
    content: "Content",
    date: "Date",
    time: "Time",
    location: "Location",
    companion: "Companion",
    category: "Category",
    exportPDF: "Export PDF",
    exportJSON: "Export JSON",
    
    // Photos
    photoGallery: "Photo Gallery",
    uploadPhoto: "Upload Photo",
    totalPhotos: "Total photos",
    thisWeek: "This week",
    all: "All",
    recent: "Recent",
    service: "Service",
    teaching: "Teaching",
    companions: "Companions",
    places: "Places",
    
    // Resources
    missionaryResources: "Missionary Resources",
    searchResources: "Search resources...",
    allTypes: "All types",
    allCategories: "All categories",
    pdfs: "PDFs",
    tips: "Tips",
    videos: "Videos",
    featuredResources: "Featured resources",
    recentDownloads: "Recent downloads",
    download: "Download",
    view: "View",
    
    // Stages
    missionaryStages: "Missionary Stages",
    currentStage: "Current Stage",
    completedStages: "Completed Stages",
    upcomingStages: "Upcoming Stages",
    progress: "Progress",
    preMission: "Pre-Mission",
    mtc: "Missionary Training Center",
    field: "Mission Field",
    postMission: "Post-Mission",
    
    // Sponsors
    shareWithSponsors: "Share with Sponsors",
    manageInvitations: "Manage Invitations",
    shareContent: "Share Content",
    overview: "Overview",
    invites: "Invites",
    content: "Content",
    settings: "Settings",
    activeSponsors: "Active Sponsors",
    pendingInvites: "Pending Invites",
    
    // Family Portal
    familyPortal: "Family Portal",
    feed: "Feed",
    sponsorship: "Sponsorship",
    reports: "Reports",
    totalDonated: "Total donated",
    activeSponsor: "Active Sponsor",
    supportMission: "Support the Mission",
    familyPlan: "Family Plan",
    bronze: "Bronze",
    silver: "Silver",
    gold: "Gold",
    
    // Profile
    profile: "Profile",
    personalInfo: "Personal Information",
    missionProgress: "Mission Progress",
    accountSettings: "Account Settings",
    notifications: "Notifications",
    privacy: "Privacy",
    changePhoto: "Change Photo",
    exportData: "Export Data",
    
    // Admin
    adminPanel: "Admin Panel",
    metrics: "Metrics",
    users: "Users",
    analytics: "Analytics",
    notifications: "Notifications",
    realtime: "Real-time",
    totalRevenue: "Total Revenue",
    activeSubscriptions: "Active Subscriptions",
    mrr: "MRR",
    activeConnections: "Active Connections",
  },
  
  fr: {
    // Navigation
    home: "Accueil",
    diary: "Journal",
    transfers: "Transferts",
    photos: "Photos", 
    resources: "Ressources",
    stages: "Étapes",
    sponsors: "Sponsors",
    profile: "Profil",
    admin: "Admin",
    
    // Common
    loading: "Chargement...",
    save: "Enregistrer",
    cancel: "Annuler",
    delete: "Supprimer",
    edit: "Modifier",
    add: "Ajouter",
    search: "Rechercher",
    filter: "Filtrer",
    all: "Tous",
    close: "Fermer",
    manage: "Gérez votre",
    
    // Dashboard
    dashboard: "Tableau de bord",
    welcomeBack: "Bon retour",
    mission: "Mission",
    daysServed: "jours de service",
    diaryEntries: "Entrées du journal",
    transfers: "Transferts",
    photosUploaded: "Photos téléchargées",
    recentActivity: "Activité récente",
    
    // Diary
    diary: "Journal",
    newEntry: "Nouvelle entrée",
    title: "Titre",
    content: "Contenu",
    date: "Date",
    time: "Heure",
    location: "Emplacement",
    companion: "Compagnon",
    category: "Catégorie",
    exportPDF: "Exporter PDF",
    exportJSON: "Exporter JSON",
    
    // Photos
    photoGallery: "Galerie Photos",
    uploadPhoto: "Télécharger Photo",
    totalPhotos: "Total photos",
    thisWeek: "Cette semaine",
    all: "Tout",
    recent: "Récent",
    service: "Service",
    teaching: "Enseignement",
    companions: "Compagnons",
    places: "Lieux",
    
    // Resources
    missionaryResources: "Ressources Missionnaires",
    searchResources: "Rechercher ressources...",
    allTypes: "Tous types",
    allCategories: "Toutes catégories",
    pdfs: "PDFs",
    tips: "Conseils",
    videos: "Vidéos",
    featuredResources: "Ressources en vedette",
    recentDownloads: "Téléchargements récents",
    download: "Télécharger",
    view: "Voir",
    
    // Stages
    missionaryStages: "Étapes Missionnaires",
    currentStage: "Étape Actuelle",
    completedStages: "Étapes Terminées",
    upcomingStages: "Étapes à Venir",
    progress: "Progrès",
    preMission: "Pré-Mission",
    mtc: "Centre de Formation Missionnaire",
    field: "Terrain Missionnaire",
    postMission: "Post-Mission",
    
    // Sponsors
    shareWithSponsors: "Partager avec Sponsors",
    manageInvitations: "Gérer Invitations",
    shareContent: "Partager Contenu",
    overview: "Aperçu",
    invites: "Invitations",
    content: "Contenu",
    settings: "Paramètres",
    activeSponsors: "Sponsors Actifs",
    pendingInvites: "Invitations en Attente",
    
    // Family Portal
    familyPortal: "Portail Familial",
    feed: "Flux",
    sponsorship: "Parrainage",
    reports: "Rapports",
    totalDonated: "Total donné",
    activeSponsor: "Sponsor Actif",
    supportMission: "Soutenir la Mission",
    familyPlan: "Plan Familial",
    bronze: "Bronze",
    silver: "Argent",
    gold: "Or",
    
    // Profile
    profile: "Profil",
    personalInfo: "Informations Personnelles",
    missionProgress: "Progrès de la Mission",
    accountSettings: "Paramètres du Compte",
    notifications: "Notifications",
    privacy: "Confidentialité",
    changePhoto: "Changer Photo",
    exportData: "Exporter Données",
    
    // Admin
    adminPanel: "Panneau d'Administration",
    metrics: "Métriques",
    users: "Utilisateurs",
    analytics: "Analytiques",
    notifications: "Notifications",
    realtime: "Temps Réel",
    totalRevenue: "Revenus Totaux",
    activeSubscriptions: "Abonnements Actifs",
    mrr: "MRR",
    activeConnections: "Connexions Actives",
  },
  
  "pt-BR": {
    // Navigation
    home: "Início",
    diary: "Diário",
    transfers: "Transferências",
    photos: "Fotos",
    resources: "Recursos", 
    stages: "Etapas",
    sponsors: "Patrocinadores",
    profile: "Perfil",
    admin: "Admin",
    
    // Common
    loading: "Carregando...",
    save: "Salvar",
    cancel: "Cancelar",
    delete: "Excluir",
    edit: "Editar",
    add: "Adicionar",
    search: "Buscar",
    filter: "Filtrar",
    all: "Todos",
    close: "Fechar",
    manage: "Gerencie seu",
    
    // Dashboard
    dashboard: "Painel",
    welcomeBack: "Bem-vindo de volta",
    mission: "Missão",
    daysServed: "dias servidos",
    diaryEntries: "Entradas do diário",
    transfers: "Transferências",
    photosUploaded: "Fotos enviadas",
    recentActivity: "Atividade Recente",
    
    // Diary
    diary: "Diário",
    newEntry: "Nova Entrada",
    title: "Título",
    content: "Conteúdo",
    date: "Data",
    time: "Hora",
    location: "Localização",
    companion: "Companheiro",
    category: "Categoria",
    exportPDF: "Exportar PDF",
    exportJSON: "Exportar JSON",
    
    // Photos
    photoGallery: "Galeria de Fotos",
    uploadPhoto: "Enviar Foto",
    totalPhotos: "Total de fotos",
    thisWeek: "Esta semana",
    all: "Todas",
    recent: "Recentes",
    service: "Serviço",
    teaching: "Ensino",
    companions: "Companheiros",
    places: "Lugares",
    
    // Resources
    missionaryResources: "Recursos Missionários",
    searchResources: "Buscar recursos...",
    allTypes: "Todos os tipos",
    allCategories: "Todas as categorias",
    pdfs: "PDFs",
    tips: "Dicas",
    videos: "Vídeos",
    featuredResources: "Recursos em destaque",
    recentDownloads: "Downloads recentes",
    download: "Download",
    view: "Ver",
    
    // Stages
    missionaryStages: "Etapas Missionárias",
    currentStage: "Etapa Atual",
    completedStages: "Etapas Completadas",
    upcomingStages: "Próximas Etapas",
    progress: "Progresso",
    preMission: "Pré-Missão",
    mtc: "Centro de Treinamento Missionário",
    field: "Campo Missionário",
    postMission: "Pós-Missão",
    
    // Sponsors
    shareWithSponsors: "Compartilhar com Patrocinadores",
    manageInvitations: "Gerenciar Convites",
    shareContent: "Compartilhar Conteúdo",
    overview: "Visão Geral",
    invites: "Convites",
    content: "Conteúdo",
    settings: "Configurações",
    activeSponsors: "Patrocinadores Ativos",
    pendingInvites: "Convites Pendentes",
    
    // Family Portal
    familyPortal: "Portal da Família",
    feed: "Feed",
    sponsorship: "Patrocínio",
    reports: "Relatórios",
    totalDonated: "Total doado",
    activeSponsor: "Patrocinador Ativo",
    supportMission: "Apoiar a Missão",
    familyPlan: "Plano Familiar",
    bronze: "Bronze",
    silver: "Prata",
    gold: "Ouro",
    
    // Profile
    profile: "Perfil",
    personalInfo: "Informações Pessoais",
    missionProgress: "Progresso da Missão",
    accountSettings: "Configurações da Conta",
    notifications: "Notificações",
    privacy: "Privacidade",
    changePhoto: "Alterar Foto",
    exportData: "Exportar Dados",
    
    // Admin
    adminPanel: "Painel de Administração",
    metrics: "Métricas",
    users: "Usuários",
    analytics: "Analíticas",
    notifications: "Notificações",
    realtime: "Tempo Real",
    totalRevenue: "Receita Total",
    activeSubscriptions: "Assinaturas Ativas",
    mrr: "MRR",
    activeConnections: "Conexões Ativas",
  }
};

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('es');

  useEffect(() => {
    // Cargar idioma guardado del localStorage
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['es', 'en', 'fr', 'pt-BR'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    // Guardar idioma en localStorage
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];

    for (const k of keys) {
      value = value?.[k];
    }

    return value || key;
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslations() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslations must be used within a TranslationProvider');
  }
  return context;
}