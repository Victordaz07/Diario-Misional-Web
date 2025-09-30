import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';
import {
    DiaryService,
    ScheduleService,
    InvestigatorsService,
    TransfersService,
    MissionStatsService,
    SpiritualMomentsService,
    TestimonyService,
    FileUploadService,
    DiaryEntry,
    DailySchedule,
    Investigator,
    Transfer,
    MissionStats,
    SpiritualMoment,
    Testimony
} from '@/lib/firebase-services';

// Hook para el diario
export const useDiary = () => {
    const { user } = useAuth();
    const [entries, setEntries] = useState<DiaryEntry[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadEntries = useCallback(async () => {
        if (!user) return;

        setLoading(true);
        setError(null);
        try {
            const data = await DiaryService.getEntries(user.uid);
            setEntries(data);
        } catch (err) {
            setError('Error al cargar las entradas del diario');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    const saveEntry = useCallback(async (entry: Omit<DiaryEntry, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
        if (!user) throw new Error('Usuario no autenticado');

        try {
            const entryId = await DiaryService.saveEntry(user.uid, entry);
            await loadEntries(); // Recargar entradas
            return entryId;
        } catch (err) {
            setError('Error al guardar la entrada');
            throw err;
        }
    }, [user, loadEntries]);

    const updateEntry = useCallback(async (entryId: string, updates: Partial<DiaryEntry>) => {
        try {
            await DiaryService.updateEntry(entryId, updates);
            await loadEntries(); // Recargar entradas
        } catch (err) {
            setError('Error al actualizar la entrada');
            throw err;
        }
    }, [loadEntries]);

    useEffect(() => {
        loadEntries();
    }, [loadEntries]);

    return {
        entries,
        loading,
        error,
        saveEntry,
        updateEntry,
        refresh: loadEntries
    };
};

// Hook para la agenda diaria
export const useSchedule = () => {
    const { user } = useAuth();
    const [todaySchedule, setTodaySchedule] = useState<DailySchedule[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadTodaySchedule = useCallback(async (date: Date = new Date()) => {
        if (!user) return;

        setLoading(true);
        setError(null);
        try {
            const data = await ScheduleService.getTodaySchedule(user.uid, date);
            setTodaySchedule(data);
        } catch (err) {
            setError('Error al cargar la agenda');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    const saveAppointment = useCallback(async (appointment: Omit<DailySchedule, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
        if (!user) throw new Error('Usuario no autenticado');

        try {
            const appointmentId = await ScheduleService.saveAppointment(user.uid, appointment);
            await loadTodaySchedule(); // Recargar agenda
            return appointmentId;
        } catch (err) {
            setError('Error al guardar la cita');
            throw err;
        }
    }, [user, loadTodaySchedule]);

    const updateAppointmentStatus = useCallback(async (appointmentId: string, status: 'completed' | 'pending' | 'cancelled') => {
        try {
            await ScheduleService.updateAppointmentStatus(appointmentId, status);
            await loadTodaySchedule(); // Recargar agenda
        } catch (err) {
            setError('Error al actualizar el estado de la cita');
            throw err;
        }
    }, [loadTodaySchedule]);

    useEffect(() => {
        loadTodaySchedule();
    }, [loadTodaySchedule]);

    return {
        todaySchedule,
        loading,
        error,
        saveAppointment,
        updateAppointmentStatus,
        refresh: loadTodaySchedule
    };
};

// Hook para investigadores
export const useInvestigators = () => {
    const { user } = useAuth();
    const [investigators, setInvestigators] = useState<Investigator[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadInvestigators = useCallback(async () => {
        if (!user) return;

        setLoading(true);
        setError(null);
        try {
            const data = await InvestigatorsService.getInvestigators(user.uid);
            setInvestigators(data);
        } catch (err) {
            setError('Error al cargar los investigadores');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    const saveInvestigator = useCallback(async (investigator: Omit<Investigator, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
        if (!user) throw new Error('Usuario no autenticado');

        try {
            const investigatorId = await InvestigatorsService.saveInvestigator(user.uid, investigator);
            await loadInvestigators(); // Recargar investigadores
            return investigatorId;
        } catch (err) {
            setError('Error al guardar el investigador');
            throw err;
        }
    }, [user, loadInvestigators]);

    const updateInvestigator = useCallback(async (investigatorId: string, updates: Partial<Investigator>) => {
        try {
            await InvestigatorsService.updateInvestigator(investigatorId, updates);
            await loadInvestigators(); // Recargar investigadores
        } catch (err) {
            setError('Error al actualizar el investigador');
            throw err;
        }
    }, [loadInvestigators]);

    const deleteInvestigator = useCallback(async (investigatorId: string) => {
        try {
            await InvestigatorsService.deleteInvestigator(investigatorId);
            await loadInvestigators(); // Recargar investigadores
        } catch (err) {
            setError('Error al eliminar el investigador');
            throw err;
        }
    }, [loadInvestigators]);

    useEffect(() => {
        loadInvestigators();
    }, [loadInvestigators]);

    return {
        investigators,
        loading,
        error,
        saveInvestigator,
        updateInvestigator,
        deleteInvestigator,
        refresh: loadInvestigators
    };
};

// Hook para traslados
export const useTransfers = () => {
    const { user } = useAuth();
    const [currentTransfer, setCurrentTransfer] = useState<Transfer | null>(null);
    const [transferHistory, setTransferHistory] = useState<Transfer[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadTransfers = useCallback(async () => {
        if (!user) return;

        setLoading(true);
        setError(null);
        try {
            const [current, history] = await Promise.all([
                TransfersService.getCurrentTransfer(user.uid),
                TransfersService.getTransferHistory(user.uid)
            ]);
            setCurrentTransfer(current);
            setTransferHistory(history);
        } catch (err) {
            setError('Error al cargar los traslados');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    const saveTransfer = useCallback(async (transfer: Omit<Transfer, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
        if (!user) throw new Error('Usuario no autenticado');

        try {
            const transferId = await TransfersService.saveTransfer(user.uid, transfer);
            await loadTransfers(); // Recargar traslados
            return transferId;
        } catch (err) {
            setError('Error al guardar el traslado');
            throw err;
        }
    }, [user, loadTransfers]);

    useEffect(() => {
        loadTransfers();
    }, [loadTransfers]);

    return {
        currentTransfer,
        transferHistory,
        loading,
        error,
        saveTransfer,
        refresh: loadTransfers
    };
};

// Hook para estadísticas misionales
export const useMissionStats = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState<MissionStats | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadStats = useCallback(async () => {
        if (!user) return;

        setLoading(true);
        setError(null);
        try {
            const data = await MissionStatsService.getOrCreateStats(user.uid);
            setStats(data);
        } catch (err) {
            setError('Error al cargar las estadísticas');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    const updateStats = useCallback(async (updates: Partial<MissionStats>) => {
        if (!user) throw new Error('Usuario no autenticado');

        try {
            await MissionStatsService.updateStats(user.uid, updates);
            await loadStats(); // Recargar estadísticas
        } catch (err) {
            setError('Error al actualizar las estadísticas');
            throw err;
        }
    }, [user, loadStats]);

    useEffect(() => {
        loadStats();
    }, [loadStats]);

    return {
        stats,
        loading,
        error,
        updateStats,
        refresh: loadStats
    };
};

// Hook para momentos espirituales
export const useSpiritualMoments = () => {
    const { user } = useAuth();
    const [moments, setMoments] = useState<SpiritualMoment[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadMoments = useCallback(async () => {
        if (!user) return;

        setLoading(true);
        setError(null);
        try {
            const data = await SpiritualMomentsService.getSpiritualMoments(user.uid);
            setMoments(data);
        } catch (err) {
            setError('Error al cargar los momentos espirituales');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    const saveMoment = useCallback(async (moment: Omit<SpiritualMoment, 'id' | 'userId' | 'createdAt'>) => {
        if (!user) throw new Error('Usuario no autenticado');

        try {
            const momentId = await SpiritualMomentsService.saveSpiritualMoment(user.uid, moment);
            await loadMoments(); // Recargar momentos
            return momentId;
        } catch (err) {
            setError('Error al guardar el momento espiritual');
            throw err;
        }
    }, [user, loadMoments]);

    useEffect(() => {
        loadMoments();
    }, [loadMoments]);

    return {
        moments,
        loading,
        error,
        saveMoment,
        refresh: loadMoments
    };
};

// Hook para testimonios
export const useTestimonies = () => {
    const { user } = useAuth();
    const [testimonies, setTestimonies] = useState<Testimony[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadTestimonies = useCallback(async () => {
        if (!user) return;

        setLoading(true);
        setError(null);
        try {
            const data = await TestimonyService.getTestimonies(user.uid);
            setTestimonies(data);
        } catch (err) {
            setError('Error al cargar los testimonios');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    const saveTestimony = useCallback(async (testimony: Omit<Testimony, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
        if (!user) throw new Error('Usuario no autenticado');

        try {
            const testimonyId = await TestimonyService.saveTestimony(user.uid, testimony);
            await loadTestimonies(); // Recargar testimonios
            return testimonyId;
        } catch (err) {
            setError('Error al guardar el testimonio');
            throw err;
        }
    }, [user, loadTestimonies]);

    useEffect(() => {
        loadTestimonies();
    }, [loadTestimonies]);

    return {
        testimonies,
        loading,
        error,
        saveTestimony,
        refresh: loadTestimonies
    };
};

// Hook para subida de archivos
export const useFileUpload = () => {
    const { user } = useAuth();
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const uploadFile = useCallback(async (file: File, path: string) => {
        if (!user) throw new Error('Usuario no autenticado');

        setUploading(true);
        setError(null);
        try {
            const url = await FileUploadService.uploadFile(user.uid, file, path);
            return url;
        } catch (err) {
            setError('Error al subir el archivo');
            throw err;
        } finally {
            setUploading(false);
        }
    }, [user]);

    return {
        uploadFile,
        uploading,
        error
    };
};
