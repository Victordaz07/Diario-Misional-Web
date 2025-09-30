export interface Translations {
    // Common
    common: {
        appName: string;
        webApp: string;
        loading: string;
        cancel: string;
        save: string;
        delete: string;
        edit: string;
        add: string;
        search: string;
        filter: string;
        all: string;
        current: string;
        active: string;
        connected: string;
        familySponsorship: string;
        connectedWithFamily: string;
        logout: string;
        close: string;
        next: string;
        previous: string;
        skip: string;
    };

    // Navigation
    navigation: {
        home: string;
        diary: string;
        transfers: string;
        photos: string;
        resources: string;
        stages: string;
        people: string;
        profile: string;
    };

    // Onboarding
    onboarding: {
        welcome: string;
        welcomeMessage: string;
        writeHistory: string;
        writeHistoryMessage: string;
        connectFamily: string;
        connectFamilyMessage: string;
        finalAlbum: string;
        finalAlbumMessage: string;
        startDiary: string;
    };

    // Auth
    auth: {
        login: string;
        register: string;
        email: string;
        password: string;
        confirmPassword: string;
        fullName: string;
        mission: string;
        preferredLanguage: string;
        rememberMe: string;
        forgotPassword: string;
        noAccount: string;
        haveAccount: string;
        registerHere: string;
        loginHere: string;
        linkCode: string;
        haveLinkCode: string;
        linkCodeDescription: string;
        continueWithoutLink: string;
        welcome: string;
        accountCreated: string;
        goToDashboard: string;
    };

    // Dashboard
    dashboard: {
        title: string;
        welcomeBack: string;
        mission: string;
        daysServed: string;
        diaryEntries: string;
        transfers: string;
        photosUploaded: string;
        status: string;
        recentActivity: string;
        seeAll: string;
        newEntry: string;
        uploadPhoto: string;
        missionProgress: string;
        timeServed: string;
        diaryProgress: string;
    };

    // People/Contacts
    people: {
        title: string;
        subtitle: string;
        searchPlaceholder: string;
        leaders: string;
        companions: string;
        friends: string;
        investigators: string;
        members: string;
        selectAll: string;
        deselectAll: string;
        selected: string;
        export: string;
        totalContacts: string;
        call: string;
        email: string;
        notDeletable: string;
    };

    // Transfers
    transfers: {
        title: string;
        subtitle: string;
        myTransfers: string;
        transferHistory: string;
        newTransfer: string;
        totalTransfers: string;
        areasServed: string;
        averageMonths: string;
        transferDate: string;
        previousArea: string;
        newArea: string;
        previousCompanion: string;
        newCompanion: string;
        additionalNotes: string;
        saveTransfer: string;
        areaNorth: string;
        areaCenter: string;
        areaSouth: string;
        areaEast: string;
        areaWest: string;
    };

    // Photos
    photos: {
        title: string;
        subtitle: string;
        gallery: string;
        manageMemories: string;
        uploadPhoto: string;
        totalPhotos: string;
        thisWeek: string;
        backedUp: string;
        inCloud: string;
        stored: string;
        all: string;
        recent: string;
        service: string;
        teaching: string;
        companions: string;
        places: string;
        loadMore: string;
        uploadNewPhoto: string;
        dragPhotoHere: string;
        selectFile: string;
        photoTitle: string;
        describePhoto: string;
        category: string;
        selectCategory: string;
        cancel: string;
        upload: string;
        delete: string;
        view: string;
        daysAgo: string;
        weeksAgo: string;
        monthsAgo: string;
        teachingFamily: string;
        communityService: string;
        studyWithCompanion: string;
        localChapel: string;
        familyPhoto: string;
        zoneConference: string;
        areaView: string;
        baptism: string;
    };

    // Resources
    resources: {
        title: string;
        subtitle: string;
        searchPlaceholder: string;
        allTypes: string;
        allCategories: string;
        pdfs: string;
        tips: string;
        videos: string;
        featuredResources: string;
        resources: string;
        byCategories: string;
        recentDownloads: string;
        download: string;
        view: string;
        downloads: string;
        views: string;
        downloaded: string;
        daysAgo: string;
        weeksAgo: string;
        close: string;
        save: string;
        teaching: string;
        leadership: string;
        study: string;
        wellbeing: string;
        effectiveTeachingGuide: string;
        teachingGuideDescription: string;
        timeManagementTip: string;
        timeManagementDescription: string;
        leadershipManual: string;
        leadershipManualDescription: string;
        personalStudyTip: string;
        personalStudyDescription: string;
        morningRoutine: string;
        weeklyPlanning: string;
        timeBlocks: string;
        morningRoutineTip: string;
        weeklyPlanningTip: string;
        timeBlocksTip: string;
        timeQuote: string;
    };

    // Stages
    stages: {
        title: string;
        subtitle: string;
        journeyTitle: string;
        journeySubtitle: string;
        currentStage: string;
        dayOfService: string;
        stageCompleted: string;
        stageCurrent: string;
        stagePending: string;
        stageFuture: string;
        preMission: string;
        preMissionDescription: string;
        mtc: string;
        mtcDescription: string;
        missionField: string;
        missionFieldDescription: string;
        finishingMission: string;
        finishingMissionDescription: string;
        afterMission: string;
        afterMissionDescription: string;
        reflections: string;
        saveNotes: string;
        exportReflections: string;
        shareProgress: string;
        progressSummary: string;
        completedStages: string;
        currentStageCount: string;
        futureStages: string;
        currentStageMessage: string;
    };
}

export const translations: Record<string, Translations> = {
    es: {
        common: {
            appName: "Diario Misional",
            webApp: "Web App",
            loading: "Cargando...",
            cancel: "Cancelar",
            save: "Guardar",
            delete: "Eliminar",
            edit: "Editar",
            add: "Agregar",
            search: "Buscar",
            filter: "Filtrar",
            all: "Todos",
            current: "Actual",
            active: "Activo",
            connected: "Conectado",
            familySponsorship: "Patrocinio familiar",
            connectedWithFamily: "Conectado con familia",
            logout: "Cerrar sesión",
            close: "Cerrar",
            next: "Siguiente",
            previous: "Anterior",
            skip: "Saltar",
        },
        navigation: {
            home: "Inicio",
            diary: "Diario",
            transfers: "Traslados",
            photos: "Fotos",
            resources: "Recursos",
            stages: "Etapas",
            people: "Personas",
            profile: "Perfil",
        },
        onboarding: {
            welcome: "Bienvenido a tu Diario Misional",
            welcomeMessage: "Una aplicación especial para documentar cada momento sagrado de tu misión y compartirlo con quienes más amas.",
            writeHistory: "Escribe tu Historia",
            writeHistoryMessage: "Registra tus experiencias diarias, traslados, fotos y momentos especiales de manera fácil y organizada.",
            connectFamily: "Conecta con tu Familia",
            connectFamilyMessage: "Tus padres y sponsors podrán seguir tu progreso misional y sentirse parte de tu experiencia.",
            finalAlbum: "Álbum Final",
            finalAlbumMessage: "Al finalizar tu misión, recibirás un hermoso álbum físico con todos tus recuerdos más preciados.",
            startDiary: "Comenzar mi Diario",
        },
        auth: {
            login: "Iniciar Sesión",
            register: "Crear Cuenta",
            email: "Correo electrónico",
            password: "Contraseña",
            confirmPassword: "Confirmar contraseña",
            fullName: "Nombre completo",
            mission: "Misión",
            preferredLanguage: "Idioma preferido",
            rememberMe: "Recordarme",
            forgotPassword: "¿Olvidaste tu contraseña?",
            noAccount: "¿No tienes cuenta?",
            haveAccount: "¿Ya tienes cuenta?",
            registerHere: "Regístrate aquí",
            loginHere: "Inicia sesión aquí",
            linkCode: "Vincular Código",
            haveLinkCode: "¿Tienes un código de vinculación?",
            linkCodeDescription: "Este código te fue proporcionado por tu familia o sponsors",
            continueWithoutLink: "Continuar sin vincular",
            welcome: "¡Bienvenido!",
            accountCreated: "Tu cuenta ha sido creada exitosamente. Estás listo para comenzar tu experiencia con el Diario Misional.",
            goToDashboard: "Ir al Dashboard",
        },
        dashboard: {
            title: "Dashboard",
            welcomeBack: "Bienvenido de vuelta",
            mission: "Misión",
            daysServed: "días servidos",
            diaryEntries: "Entradas del diario",
            transfers: "Traslados",
            photosUploaded: "Fotos subidas",
            status: "Estado",
            recentActivity: "Actividad Reciente",
            seeAll: "Ver todo",
            newEntry: "Nueva Entrada",
            uploadPhoto: "Subir Foto",
            missionProgress: "Progreso de la Misión",
            timeServed: "Tiempo servido",
            diaryProgress: "Entradas del diario",
        },
        people: {
            title: "Personas",
            subtitle: "Gestiona tus contactos misionales",
            searchPlaceholder: "Buscar contactos...",
            leaders: "Líderes",
            companions: "Compañeros",
            friends: "Amigos",
            investigators: "Investigadores",
            members: "Miembros",
            selectAll: "Seleccionar todo",
            deselectAll: "Deseleccionar todo",
            selected: "seleccionado",
            export: "Exportar",
            totalContacts: "Total contactos",
            call: "Llamar",
            email: "Enviar email",
            notDeletable: "No eliminable",
        },
        transfers: {
            title: "Traslados",
            subtitle: "Gestiona tus traslados misionales",
            myTransfers: "Mis Traslados",
            transferHistory: "Historial de Traslados",
            newTransfer: "Nuevo Traslado",
            totalTransfers: "Total traslados",
            areasServed: "Áreas servidas",
            averageMonths: "Meses promedio",
            transferDate: "Fecha de traslado",
            previousArea: "Área anterior",
            newArea: "Nueva área",
            previousCompanion: "Compañero anterior",
            newCompanion: "Nuevo compañero",
            additionalNotes: "Notas adicionales",
            saveTransfer: "Guardar Traslado",
            areaNorth: "Área Norte",
            areaCenter: "Área Centro",
            areaSouth: "Área Sur",
            areaEast: "Área Este",
            areaWest: "Área Oeste",
        },
        photos: {
            title: "Galería de Fotos",
            subtitle: "Administra tus recuerdos misionales",
            gallery: "Galería de Fotos",
            manageMemories: "Administra tus recuerdos misionales",
            uploadPhoto: "Subir Foto",
            totalPhotos: "Total de fotos",
            thisWeek: "Esta semana",
            backedUp: "Respaldado",
            inCloud: "En la nube",
            stored: "Almacenado",
            all: "Todas",
            recent: "Recientes",
            service: "Servicio",
            teaching: "Enseñanza",
            companions: "Compañeros",
            places: "Lugares",
            loadMore: "Cargar más fotos",
            uploadNewPhoto: "Subir Nueva Foto",
            dragPhotoHere: "Arrastra tu foto aquí o",
            selectFile: "Seleccionar archivo",
            photoTitle: "Título",
            describePhoto: "Describe tu foto",
            category: "Categoría",
            selectCategory: "Seleccionar categoría",
            cancel: "Cancelar",
            upload: "Subir Foto",
            delete: "Eliminar",
            view: "Ver",
            daysAgo: "Hace {count} días",
            weeksAgo: "Hace {count} semanas",
            monthsAgo: "Hace {count} meses",
            teachingFamily: "Enseñanza familia González",
            communityService: "Servicio comunitario",
            studyWithCompanion: "Estudio con compañero",
            localChapel: "Capilla local",
            familyPhoto: "Familia Martínez",
            zoneConference: "Conferencia de zona",
            areaView: "Vista de mi área",
            baptism: "Bautismo de Carlos",
        },
    },

    en: {
        common: {
            appName: "Missionary Diary",
            webApp: "Web App",
            loading: "Loading...",
            cancel: "Cancel",
            save: "Save",
            delete: "Delete",
            edit: "Edit",
            add: "Add",
            search: "Search",
            filter: "Filter",
            all: "All",
            current: "Current",
            active: "Active",
            connected: "Connected",
            familySponsorship: "Family sponsorship",
            connectedWithFamily: "Connected with family",
            logout: "Logout",
            close: "Close",
            next: "Next",
            previous: "Previous",
            skip: "Skip",
        },
        navigation: {
            home: "Home",
            diary: "Diary",
            transfers: "Transfers",
            photos: "Photos",
            resources: "Resources",
            stages: "Stages",
            people: "People",
            profile: "Profile",
        },
        onboarding: {
            welcome: "Welcome to your Missionary Diary",
            welcomeMessage: "A special application to document every sacred moment of your mission and share it with those you love most.",
            writeHistory: "Write your History",
            writeHistoryMessage: "Record your daily experiences, transfers, photos and special moments in an easy and organized way.",
            connectFamily: "Connect with your Family",
            connectFamilyMessage: "Your parents and sponsors will be able to follow your missionary progress and feel part of your experience.",
            finalAlbum: "Final Album",
            finalAlbumMessage: "At the end of your mission, you will receive a beautiful physical album with all your most precious memories.",
            startDiary: "Start my Diary",
        },
        auth: {
            login: "Sign In",
            register: "Create Account",
            email: "Email",
            password: "Password",
            confirmPassword: "Confirm password",
            fullName: "Full name",
            mission: "Mission",
            preferredLanguage: "Preferred language",
            rememberMe: "Remember me",
            forgotPassword: "Forgot your password?",
            noAccount: "Don't have an account?",
            haveAccount: "Already have an account?",
            registerHere: "Register here",
            loginHere: "Sign in here",
            linkCode: "Link Code",
            haveLinkCode: "Do you have a linking code?",
            linkCodeDescription: "This code was provided to you by your family or sponsors",
            continueWithoutLink: "Continue without linking",
            welcome: "Welcome!",
            accountCreated: "Your account has been created successfully. You are ready to start your experience with the Missionary Diary.",
            goToDashboard: "Go to Dashboard",
        },
        dashboard: {
            title: "Dashboard",
            welcomeBack: "Welcome back",
            mission: "Mission",
            daysServed: "days served",
            diaryEntries: "Diary entries",
            transfers: "Transfers",
            photosUploaded: "Photos uploaded",
            status: "Status",
            recentActivity: "Recent Activity",
            seeAll: "See all",
            newEntry: "New Entry",
            uploadPhoto: "Upload Photo",
            missionProgress: "Mission Progress",
            timeServed: "Time served",
            diaryProgress: "Diary entries",
        },
        people: {
            title: "People",
            subtitle: "Manage your missionary contacts",
            searchPlaceholder: "Search contacts...",
            leaders: "Leaders",
            companions: "Companions",
            friends: "Friends",
            investigators: "Investigators",
            members: "Members",
            selectAll: "Select all",
            deselectAll: "Deselect all",
            selected: "selected",
            export: "Export",
            totalContacts: "Total contacts",
            call: "Call",
            email: "Send email",
            notDeletable: "Not deletable",
        },
        transfers: {
            title: "Transfers",
            subtitle: "Manage your missionary transfers",
            myTransfers: "My Transfers",
            transferHistory: "Transfer History",
            newTransfer: "New Transfer",
            totalTransfers: "Total transfers",
            areasServed: "Areas served",
            averageMonths: "Average months",
            transferDate: "Transfer date",
            previousArea: "Previous area",
            newArea: "New area",
            previousCompanion: "Previous companion",
            newCompanion: "New companion",
            additionalNotes: "Additional notes",
            saveTransfer: "Save Transfer",
            areaNorth: "North Area",
            areaCenter: "Center Area",
            areaSouth: "South Area",
            areaEast: "East Area",
            areaWest: "West Area",
        },
    },

    fr: {
        common: {
            appName: "Journal Missionnaire",
            webApp: "Application Web",
            loading: "Chargement...",
            cancel: "Annuler",
            save: "Enregistrer",
            delete: "Supprimer",
            edit: "Modifier",
            add: "Ajouter",
            search: "Rechercher",
            filter: "Filtrer",
            all: "Tous",
            current: "Actuel",
            active: "Actif",
            connected: "Connecté",
            familySponsorship: "Parrainage familial",
            connectedWithFamily: "Connecté avec la famille",
            logout: "Se déconnecter",
            close: "Fermer",
            next: "Suivant",
            previous: "Précédent",
            skip: "Passer",
        },
        navigation: {
            home: "Accueil",
            diary: "Journal",
            transfers: "Transferts",
            photos: "Photos",
            resources: "Ressources",
            stages: "Étapes",
            people: "Personnes",
            profile: "Profil",
        },
        onboarding: {
            welcome: "Bienvenue dans votre Journal Missionnaire",
            welcomeMessage: "Une application spéciale pour documenter chaque moment sacré de votre mission et le partager avec ceux que vous aimez le plus.",
            writeHistory: "Écrivez votre Histoire",
            writeHistoryMessage: "Enregistrez vos expériences quotidiennes, transferts, photos et moments spéciaux de manière facile et organisée.",
            connectFamily: "Connectez-vous avec votre Famille",
            connectFamilyMessage: "Vos parents et parrains pourront suivre vos progrès missionnaires et se sentir partie intégrante de votre expérience.",
            finalAlbum: "Album Final",
            finalAlbumMessage: "À la fin de votre mission, vous recevrez un bel album physique avec tous vos souvenirs les plus précieux.",
            startDiary: "Commencer mon Journal",
        },
        auth: {
            login: "Se connecter",
            register: "Créer un compte",
            email: "Email",
            password: "Mot de passe",
            confirmPassword: "Confirmer le mot de passe",
            fullName: "Nom complet",
            mission: "Mission",
            preferredLanguage: "Langue préférée",
            rememberMe: "Se souvenir de moi",
            forgotPassword: "Mot de passe oublié?",
            noAccount: "Vous n'avez pas de compte?",
            haveAccount: "Vous avez déjà un compte?",
            registerHere: "Inscrivez-vous ici",
            loginHere: "Connectez-vous ici",
            linkCode: "Code de liaison",
            haveLinkCode: "Avez-vous un code de liaison?",
            linkCodeDescription: "Ce code vous a été fourni par votre famille ou vos parrains",
            continueWithoutLink: "Continuer sans lier",
            welcome: "Bienvenue!",
            accountCreated: "Votre compte a été créé avec succès. Vous êtes prêt à commencer votre expérience avec le Journal Missionnaire.",
            goToDashboard: "Aller au Tableau de bord",
        },
        dashboard: {
            title: "Tableau de bord",
            welcomeBack: "Bon retour",
            mission: "Mission",
            daysServed: "jours de service",
            diaryEntries: "Entrées du journal",
            transfers: "Transferts",
            photosUploaded: "Photos téléchargées",
            status: "Statut",
            recentActivity: "Activité récente",
            seeAll: "Voir tout",
            newEntry: "Nouvelle entrée",
            uploadPhoto: "Télécharger photo",
            missionProgress: "Progrès de la mission",
            timeServed: "Temps de service",
            diaryProgress: "Entrées du journal",
        },
        people: {
            title: "Personnes",
            subtitle: "Gérez vos contacts missionnaires",
            searchPlaceholder: "Rechercher des contacts...",
            leaders: "Dirigeants",
            companions: "Compagnons",
            friends: "Amis",
            investigators: "Investigateurs",
            members: "Membres",
            selectAll: "Tout sélectionner",
            deselectAll: "Tout désélectionner",
            selected: "sélectionné",
            export: "Exporter",
            totalContacts: "Total contacts",
            call: "Appeler",
            email: "Envoyer email",
            notDeletable: "Non supprimable",
        },
        transfers: {
            title: "Transferts",
            subtitle: "Gérez vos transferts missionnaires",
            myTransfers: "Mes Transferts",
            transferHistory: "Historique des Transferts",
            newTransfer: "Nouveau Transfert",
            totalTransfers: "Total transferts",
            areasServed: "Zones servies",
            averageMonths: "Mois moyens",
            transferDate: "Date de transfert",
            previousArea: "Zone précédente",
            newArea: "Nouvelle zone",
            previousCompanion: "Compagnon précédent",
            newCompanion: "Nouveau compagnon",
            additionalNotes: "Notes supplémentaires",
            saveTransfer: "Enregistrer Transfert",
            areaNorth: "Zone Nord",
            areaCenter: "Zone Centre",
            areaSouth: "Zone Sud",
            areaEast: "Zone Est",
            areaWest: "Zone Ouest",
        },
    },

    "pt-BR": {
        common: {
            appName: "Diário Missionário",
            webApp: "App Web",
            loading: "Carregando...",
            cancel: "Cancelar",
            save: "Salvar",
            delete: "Excluir",
            edit: "Editar",
            add: "Adicionar",
            search: "Buscar",
            filter: "Filtrar",
            all: "Todos",
            current: "Atual",
            active: "Ativo",
            connected: "Conectado",
            familySponsorship: "Patrocínio familiar",
            connectedWithFamily: "Conectado com a família",
            logout: "Sair",
            close: "Fechar",
            next: "Próximo",
            previous: "Anterior",
            skip: "Pular",
        },
        navigation: {
            home: "Início",
            diary: "Diário",
            transfers: "Transferências",
            photos: "Fotos",
            resources: "Recursos",
            stages: "Etapas",
            people: "Pessoas",
            profile: "Perfil",
        },
        onboarding: {
            welcome: "Bem-vindo ao seu Diário Missionário",
            welcomeMessage: "Um aplicativo especial para documentar cada momento sagrado da sua missão e compartilhá-lo com quem você mais ama.",
            writeHistory: "Escreva sua História",
            writeHistoryMessage: "Registre suas experiências diárias, transferências, fotos e momentos especiais de forma fácil e organizada.",
            connectFamily: "Conecte-se com sua Família",
            connectFamilyMessage: "Seus pais e patrocinadores poderão acompanhar seu progresso missionário e se sentir parte da sua experiência.",
            finalAlbum: "Álbum Final",
            finalAlbumMessage: "Ao final da sua missão, você receberá um belo álbum físico com todas as suas memórias mais preciosas.",
            startDiary: "Começar meu Diário",
        },
        auth: {
            login: "Entrar",
            register: "Criar Conta",
            email: "Email",
            password: "Senha",
            confirmPassword: "Confirmar senha",
            fullName: "Nome completo",
            mission: "Missão",
            preferredLanguage: "Idioma preferido",
            rememberMe: "Lembrar de mim",
            forgotPassword: "Esqueceu sua senha?",
            noAccount: "Não tem uma conta?",
            haveAccount: "Já tem uma conta?",
            registerHere: "Cadastre-se aqui",
            loginHere: "Entre aqui",
            linkCode: "Código de Vinculação",
            haveLinkCode: "Você tem um código de vinculação?",
            linkCodeDescription: "Este código foi fornecido a você pela sua família ou patrocinadores",
            continueWithoutLink: "Continuar sem vincular",
            welcome: "Bem-vindo!",
            accountCreated: "Sua conta foi criada com sucesso. Você está pronto para começar sua experiência com o Diário Missionário.",
            goToDashboard: "Ir para o Painel",
        },
        dashboard: {
            title: "Painel",
            welcomeBack: "Bem-vindo de volta",
            mission: "Missão",
            daysServed: "dias servidos",
            diaryEntries: "Entradas do diário",
            transfers: "Transferências",
            photosUploaded: "Fotos enviadas",
            status: "Status",
            recentActivity: "Atividade Recente",
            seeAll: "Ver tudo",
            newEntry: "Nova Entrada",
            uploadPhoto: "Enviar Foto",
            missionProgress: "Progresso da Missão",
            timeServed: "Tempo servido",
            diaryProgress: "Entradas do diário",
        },
        people: {
            title: "Pessoas",
            subtitle: "Gerencie seus contatos missionários",
            searchPlaceholder: "Buscar contatos...",
            leaders: "Líderes",
            companions: "Companheiros",
            friends: "Amigos",
            investigators: "Investigadores",
            members: "Membros",
            selectAll: "Selecionar tudo",
            deselectAll: "Desmarcar tudo",
            selected: "selecionado",
            export: "Exportar",
            totalContacts: "Total de contatos",
            call: "Ligar",
            email: "Enviar email",
            notDeletable: "Não excluível",
        },
        transfers: {
            title: "Transferências",
            subtitle: "Gerencie suas transferências missionárias",
            myTransfers: "Minhas Transferências",
            transferHistory: "Histórico de Transferências",
            newTransfer: "Nova Transferência",
            totalTransfers: "Total de transferências",
            areasServed: "Áreas servidas",
            averageMonths: "Meses médios",
            transferDate: "Data da transferência",
            previousArea: "Área anterior",
            newArea: "Nova área",
            previousCompanion: "Companheiro anterior",
            newCompanion: "Novo companheiro",
            additionalNotes: "Notas adicionais",
            saveTransfer: "Salvar Transferência",
            areaNorth: "Área Norte",
            areaCenter: "Área Centro",
            areaSouth: "Área Sul",
            areaEast: "Área Leste",
            areaWest: "Área Oeste",
        },
        photos: {
            title: "Galería de Fotos",
            subtitle: "Administra tus recuerdos misionales",
            gallery: "Galería de Fotos",
            manageMemories: "Administra tus recuerdos misionales",
            uploadPhoto: "Subir Foto",
            totalPhotos: "Total de fotos",
            thisWeek: "Esta semana",
            backedUp: "Respaldado",
            inCloud: "En la nube",
            stored: "Almacenado",
            all: "Todas",
            recent: "Recientes",
            service: "Servicio",
            teaching: "Enseñanza",
            companions: "Compañeros",
            places: "Lugares",
            loadMore: "Cargar más fotos",
            uploadNewPhoto: "Subir Nueva Foto",
            dragPhotoHere: "Arrastra tu foto aquí o",
            selectFile: "Seleccionar archivo",
            photoTitle: "Título",
            describePhoto: "Describe tu foto",
            category: "Categoría",
            selectCategory: "Seleccionar categoría",
            cancel: "Cancelar",
            upload: "Subir Foto",
            delete: "Eliminar",
            view: "Ver",
            daysAgo: "Hace {count} días",
            weeksAgo: "Hace {count} semanas",
            monthsAgo: "Hace {count} meses",
            teachingFamily: "Enseñanza familia González",
            communityService: "Servicio comunitario",
            studyWithCompanion: "Estudio con compañero",
            localChapel: "Capilla local",
            familyPhoto: "Familia Martínez",
            zoneConference: "Conferencia de zona",
            areaView: "Vista de mi área",
            baptism: "Bautismo de Carlos",
        },
        resources: {
            title: "Recursos Misionales",
            subtitle: "Herramientas y materiales para tu misión",
            searchPlaceholder: "Buscar recursos...",
            allTypes: "Todos los tipos",
            allCategories: "Todas las categorías",
            pdfs: "PDFs",
            tips: "Consejos",
            videos: "Videos",
            featuredResources: "Recursos destacados",
            resources: "Recursos",
            byCategories: "Por categorías",
            recentDownloads: "Descargas recientes",
            download: "Descargar",
            view: "Ver",
            downloads: "Descargas",
            size: "Tamaño",
            type: "Tipo",
            category: "Categoría",
            date: "Fecha",
            scriptures: "Escrituras",
            preachMyGospel: "Predicad Mi Evangelio",
            recipes: "Recetas",
            practicalTips: "Consejos Prácticos",
        },
        stages: {
            title: "Etapas Misionales",
            subtitle: "Vive tu misión con propósito y organización",
            currentStage: "Etapa Actual",
            completedStages: "Etapas Completadas",
            upcomingStages: "Próximas Etapas",
            progress: "Progreso",
            monthsInService: "Meses en servicio",
            stageProgress: "Progreso de Etapa",
            goals: "Metas",
            reflections: "Reflexiones",
            notes: "Notas",
            unlockCondition: "Condición de desbloqueo",
            completed: "Completado",
            current: "Actual",
            locked: "Bloqueado",
            unlocked: "Desbloqueado",
            preMission: "Pre-Misión",
            mtc: "MTC",
            ccm: "CCM",
            field: "Campo",
            postMission: "Post-Misión",
        },
    },
};

export type Language = keyof typeof translations;

export const getTranslation = (language: Language, key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];

    for (const k of keys) {
        value = value?.[k];
    }

    return value || key;
};
