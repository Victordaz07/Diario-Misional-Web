import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    deleteDoc,
    addDoc,
    query,
    where,
    orderBy,
    limit,
    Timestamp,
    serverTimestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';

// Types
export interface DiaryEntry {
    id?: string;
    userId: string;
    content: string;
    date: Date;
    spiritualMoment?: string;
    audioUrl?: string;
    imageUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface DailySchedule {
    id?: string;
    userId: string;
    time: string;
    activity: string;
    description: string;
    status: 'completed' | 'pending' | 'cancelled';
    date: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface Investigator {
    id?: string;
    userId: string;
    name: string;
    type: 'Lecciones' | 'Fecha de bautismo' | 'Reactivación';
    progress: string;
    nextAppointment: string;
    progressPercent: number;
    phone?: string;
    address?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Transfer {
    id?: string;
    userId: string;
    areaName: string;
    companion: string;
    startDate: Date;
    endDate?: Date;
    baptisms: number;
    goals: Array<{
        text: string;
        completed: boolean;
    }>;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface MissionStats {
    id?: string;
    userId: string;
    monthsInService: number;
    teachings: number;
    baptisms: number;
    transfers: number;
    teachingHours: number;
    commitmentsFulfilled: number;
    lastUpdated: Date;
}

export interface SpiritualMoment {
    id?: string;
    userId: string;
    content: string;
    date: Date;
    type: 'prayer' | 'miracle' | 'testimony' | 'other';
    createdAt: Date;
}

export interface Testimony {
    id?: string;
    userId: string;
    content: string;
    weekStart: Date;
    weekEnd: Date;
    createdAt: Date;
    updatedAt: Date;
}

// Diary Service
export class DiaryService {
    static async saveEntry(userId: string, entry: Omit<DiaryEntry, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> {
        try {
            const diaryRef = collection(db, 'diaryEntries');
            const docRef = await addDoc(diaryRef, {
                ...entry,
                userId,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                date: Timestamp.fromDate(entry.date)
            });
            return docRef.id;
        } catch (error) {
            console.error('Error saving diary entry:', error);
            throw error;
        }
    }

    static async getEntries(userId: string, limitCount: number = 10): Promise<DiaryEntry[]> {
        try {
            const diaryRef = collection(db, 'diaryEntries');
            const q = query(
                diaryRef,
                where('userId', '==', userId),
                orderBy('date', 'desc'),
                limit(limitCount)
            );
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                date: doc.data().date.toDate(),
                createdAt: doc.data().createdAt.toDate(),
                updatedAt: doc.data().updatedAt.toDate()
            })) as DiaryEntry[];
        } catch (error) {
            console.error('Error getting diary entries:', error);
            throw error;
        }
    }

    static async updateEntry(entryId: string, updates: Partial<DiaryEntry>): Promise<void> {
        try {
            const entryRef = doc(db, 'diaryEntries', entryId);
            await updateDoc(entryRef, {
                ...updates,
                updatedAt: serverTimestamp()
            });
        } catch (error) {
            console.error('Error updating diary entry:', error);
            throw error;
        }
    }
}

// Schedule Service
export class ScheduleService {
    static async saveAppointment(userId: string, appointment: Omit<DailySchedule, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> {
        try {
            const scheduleRef = collection(db, 'dailySchedule');
            const docRef = await addDoc(scheduleRef, {
                ...appointment,
                userId,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                date: Timestamp.fromDate(appointment.date)
            });
            return docRef.id;
        } catch (error) {
            console.error('Error saving appointment:', error);
            throw error;
        }
    }

    static async getTodaySchedule(userId: string, date: Date): Promise<DailySchedule[]> {
        try {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            const scheduleRef = collection(db, 'dailySchedule');
            const q = query(
                scheduleRef,
                where('userId', '==', userId),
                where('date', '>=', Timestamp.fromDate(startOfDay)),
                where('date', '<=', Timestamp.fromDate(endOfDay)),
                orderBy('time', 'asc')
            );
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                date: doc.data().date.toDate(),
                createdAt: doc.data().createdAt.toDate(),
                updatedAt: doc.data().updatedAt.toDate()
            })) as DailySchedule[];
        } catch (error) {
            console.error('Error getting today schedule:', error);
            throw error;
        }
    }

    static async updateAppointmentStatus(appointmentId: string, status: 'completed' | 'pending' | 'cancelled'): Promise<void> {
        try {
            const appointmentRef = doc(db, 'dailySchedule', appointmentId);
            await updateDoc(appointmentRef, {
                status,
                updatedAt: serverTimestamp()
            });
        } catch (error) {
            console.error('Error updating appointment status:', error);
            throw error;
        }
    }
}

// Investigators Service
export class InvestigatorsService {
    static async saveInvestigator(userId: string, investigator: Omit<Investigator, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> {
        try {
            const investigatorsRef = collection(db, 'investigators');
            const docRef = await addDoc(investigatorsRef, {
                ...investigator,
                userId,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
            return docRef.id;
        } catch (error) {
            console.error('Error saving investigator:', error);
            throw error;
        }
    }

    static async getInvestigators(userId: string): Promise<Investigator[]> {
        try {
            const investigatorsRef = collection(db, 'investigators');
            const q = query(
                investigatorsRef,
                where('userId', '==', userId),
                orderBy('createdAt', 'desc')
            );
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt.toDate(),
                updatedAt: doc.data().updatedAt.toDate()
            })) as Investigator[];
        } catch (error) {
            console.error('Error getting investigators:', error);
            throw error;
        }
    }

    static async updateInvestigator(investigatorId: string, updates: Partial<Investigator>): Promise<void> {
        try {
            const investigatorRef = doc(db, 'investigators', investigatorId);
            await updateDoc(investigatorRef, {
                ...updates,
                updatedAt: serverTimestamp()
            });
        } catch (error) {
            console.error('Error updating investigator:', error);
            throw error;
        }
    }

    static async deleteInvestigator(investigatorId: string): Promise<void> {
        try {
            const investigatorRef = doc(db, 'investigators', investigatorId);
            await deleteDoc(investigatorRef);
        } catch (error) {
            console.error('Error deleting investigator:', error);
            throw error;
        }
    }
}

// Transfers Service
export class TransfersService {
    static async saveTransfer(userId: string, transfer: Omit<Transfer, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> {
        try {
            const transfersRef = collection(db, 'transfers');
            const docRef = await addDoc(transfersRef, {
                ...transfer,
                userId,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                startDate: Timestamp.fromDate(transfer.startDate),
                endDate: transfer.endDate ? Timestamp.fromDate(transfer.endDate) : null
            });
            return docRef.id;
        } catch (error) {
            console.error('Error saving transfer:', error);
            throw error;
        }
    }

    static async getCurrentTransfer(userId: string): Promise<Transfer | null> {
        try {
            const transfersRef = collection(db, 'transfers');
            const q = query(
                transfersRef,
                where('userId', '==', userId),
                where('isActive', '==', true),
                limit(1)
            );
            const snapshot = await getDocs(q);
            if (snapshot.empty) return null;

            const doc = snapshot.docs[0];
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                startDate: data.startDate.toDate(),
                endDate: data.endDate ? data.endDate.toDate() : undefined,
                createdAt: data.createdAt.toDate(),
                updatedAt: data.updatedAt.toDate()
            } as Transfer;
        } catch (error) {
            console.error('Error getting current transfer:', error);
            throw error;
        }
    }

    static async getTransferHistory(userId: string): Promise<Transfer[]> {
        try {
            const transfersRef = collection(db, 'transfers');
            const q = query(
                transfersRef,
                where('userId', '==', userId),
                orderBy('startDate', 'desc')
            );
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    startDate: data.startDate.toDate(),
                    endDate: data.endDate ? data.endDate.toDate() : undefined,
                    createdAt: data.createdAt.toDate(),
                    updatedAt: data.updatedAt.toDate()
                } as Transfer;
            });
        } catch (error) {
            console.error('Error getting transfer history:', error);
            throw error;
        }
    }
}

// Mission Stats Service
export class MissionStatsService {
    static async getOrCreateStats(userId: string): Promise<MissionStats> {
        try {
            const statsRef = doc(db, 'missionStats', userId);
            const statsSnap = await getDoc(statsRef);

            if (statsSnap.exists()) {
                const data = statsSnap.data();
                return {
                    id: statsSnap.id,
                    ...data,
                    lastUpdated: data.lastUpdated.toDate()
                } as MissionStats;
            } else {
                // Create default stats
                const defaultStats: Omit<MissionStats, 'id'> = {
                    userId,
                    monthsInService: 0,
                    teachings: 0,
                    baptisms: 0,
                    transfers: 0,
                    teachingHours: 0,
                    commitmentsFulfilled: 0,
                    lastUpdated: new Date()
                };
                await setDoc(statsRef, {
                    ...defaultStats,
                    lastUpdated: serverTimestamp()
                });
                return defaultStats as MissionStats;
            }
        } catch (error) {
            console.error('Error getting mission stats:', error);
            throw error;
        }
    }

    static async updateStats(userId: string, updates: Partial<MissionStats>): Promise<void> {
        try {
            const statsRef = doc(db, 'missionStats', userId);
            await updateDoc(statsRef, {
                ...updates,
                lastUpdated: serverTimestamp()
            });
        } catch (error) {
            console.error('Error updating mission stats:', error);
            throw error;
        }
    }
}

// Spiritual Moments Service
export class SpiritualMomentsService {
    static async saveSpiritualMoment(userId: string, moment: Omit<SpiritualMoment, 'id' | 'userId' | 'createdAt'>): Promise<string> {
        try {
            const momentsRef = collection(db, 'spiritualMoments');
            const docRef = await addDoc(momentsRef, {
                ...moment,
                userId,
                createdAt: serverTimestamp(),
                date: Timestamp.fromDate(moment.date)
            });
            return docRef.id;
        } catch (error) {
            console.error('Error saving spiritual moment:', error);
            throw error;
        }
    }

    static async getSpiritualMoments(userId: string, limitCount: number = 5): Promise<SpiritualMoment[]> {
        try {
            const momentsRef = collection(db, 'spiritualMoments');
            const q = query(
                momentsRef,
                where('userId', '==', userId),
                orderBy('date', 'desc'),
                limit(limitCount)
            );
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                date: doc.data().date.toDate(),
                createdAt: doc.data().createdAt.toDate()
            })) as SpiritualMoment[];
        } catch (error) {
            console.error('Error getting spiritual moments:', error);
            throw error;
        }
    }
}

// Testimony Service
export class TestimonyService {
    static async saveTestimony(userId: string, testimony: Omit<Testimony, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> {
        try {
            const testimonyRef = collection(db, 'testimonies');
            const docRef = await addDoc(testimonyRef, {
                ...testimony,
                userId,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                weekStart: Timestamp.fromDate(testimony.weekStart),
                weekEnd: Timestamp.fromDate(testimony.weekEnd)
            });
            return docRef.id;
        } catch (error) {
            console.error('Error saving testimony:', error);
            throw error;
        }
    }

    static async getTestimonies(userId: string, limitCount: number = 10): Promise<Testimony[]> {
        try {
            const testimonyRef = collection(db, 'testimonies');
            const q = query(
                testimonyRef,
                where('userId', '==', userId),
                orderBy('weekStart', 'desc'),
                limit(limitCount)
            );
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    weekStart: data.weekStart.toDate(),
                    weekEnd: data.weekEnd.toDate(),
                    createdAt: data.createdAt.toDate(),
                    updatedAt: data.updatedAt.toDate()
                } as Testimony;
            });
        } catch (error) {
            console.error('Error getting testimonies:', error);
            throw error;
        }
    }
}

// File Upload Service
export class FileUploadService {
    static async uploadFile(userId: string, file: File, path: string): Promise<string> {
        try {
            const storageRef = ref(storage, `users/${userId}/${path}/${Date.now()}_${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);
            return downloadURL;
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
    }
}
