import { db } from '../firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp 
} from 'firebase/firestore';

export interface DiaryEntry {
  id?: string;
  userId: string;
  title: string;
  content: string;
  category: 'spiritual' | 'teaching' | 'service' | 'personal' | 'other';
  mood: 'excellent' | 'good' | 'neutral' | 'difficult' | 'challenging';
  tags: string[];
  isPrivate: boolean;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

export interface DiaryFilters {
  category?: string;
  mood?: string;
  tags?: string[];
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
}

export class DiaryService {
  private static readonly COLLECTION = 'diaryEntries';

  static async createEntry(userId: string, entry: Omit<DiaryEntry, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const entryData = {
        ...entry,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await addDoc(collection(db, this.COLLECTION), entryData);
      return docRef.id;
    } catch (error) {
      throw new Error(`Error al crear entrada: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  static async updateEntry(entryId: string, updates: Partial<DiaryEntry>): Promise<void> {
    try {
      const entryRef = doc(db, this.COLLECTION, entryId);
      await updateDoc(entryRef, {
        ...updates,
        updatedAt: new Date(),
      });
    } catch (error) {
      throw new Error(`Error al actualizar entrada: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  static async deleteEntry(entryId: string): Promise<void> {
    try {
      const entryRef = doc(db, this.COLLECTION, entryId);
      await deleteDoc(entryRef);
    } catch (error) {
      throw new Error(`Error al eliminar entrada: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  static async getEntries(userId: string, filters: DiaryFilters = {}, limitCount: number = 50): Promise<DiaryEntry[]> {
    try {
      let q = query(
        collection(db, this.COLLECTION),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      // Apply filters
      if (filters.category) {
        q = query(q, where('category', '==', filters.category));
      }

      if (filters.mood) {
        q = query(q, where('mood', '==', filters.mood));
      }

      if (filters.dateFrom) {
        q = query(q, where('createdAt', '>=', filters.dateFrom));
      }

      if (filters.dateTo) {
        q = query(q, where('createdAt', '<=', filters.dateTo));
      }

      const snapshot = await getDocs(q);
      let entries = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as DiaryEntry[];

      // Apply text search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        entries = entries.filter(entry => 
          entry.title.toLowerCase().includes(searchTerm) ||
          entry.content.toLowerCase().includes(searchTerm) ||
          entry.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
      }

      // Apply tags filter
      if (filters.tags && filters.tags.length > 0) {
        entries = entries.filter(entry => 
          filters.tags!.some(tag => entry.tags.includes(tag))
        );
      }

      return entries;
    } catch (error) {
      throw new Error(`Error al obtener entradas: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  static async getEntry(entryId: string): Promise<DiaryEntry | null> {
    try {
      const entryRef = doc(db, this.COLLECTION, entryId);
      const snapshot = await getDoc(entryRef);
      
      if (snapshot.exists()) {
        return {
          id: snapshot.id,
          ...snapshot.data()
        } as DiaryEntry;
      }
      
      return null;
    } catch (error) {
      throw new Error(`Error al obtener entrada: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  static async getEntriesByDateRange(userId: string, startDate: Date, endDate: Date): Promise<DiaryEntry[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION),
        where('userId', '==', userId),
        where('createdAt', '>=', startDate),
        where('createdAt', '<=', endDate),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as DiaryEntry[];
    } catch (error) {
      throw new Error(`Error al obtener entradas por rango de fecha: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  static async getStats(userId: string): Promise<{
    totalEntries: number;
    entriesByCategory: Record<string, number>;
    entriesByMood: Record<string, number>;
    averageEntriesPerWeek: number;
  }> {
    try {
      const entries = await this.getEntries(userId, {}, 1000);
      
      const stats = {
        totalEntries: entries.length,
        entriesByCategory: {} as Record<string, number>,
        entriesByMood: {} as Record<string, number>,
        averageEntriesPerWeek: 0,
      };

      // Calculate category stats
      entries.forEach(entry => {
        stats.entriesByCategory[entry.category] = (stats.entriesByCategory[entry.category] || 0) + 1;
        stats.entriesByMood[entry.mood] = (stats.entriesByMood[entry.mood] || 0) + 1;
      });

      // Calculate average entries per week
      if (entries.length > 0) {
        const firstEntry = entries[entries.length - 1];
        const lastEntry = entries[0];
        const daysDiff = Math.ceil((lastEntry.createdAt.getTime() - firstEntry.createdAt.getTime()) / (1000 * 60 * 60 * 24));
        const weeksDiff = Math.max(1, daysDiff / 7);
        stats.averageEntriesPerWeek = Math.round((entries.length / weeksDiff) * 10) / 10;
      }

      return stats;
    } catch (error) {
      throw new Error(`Error al obtener estadísticas: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  static async exportEntries(userId: string, format: 'json' | 'csv' = 'json'): Promise<string> {
    try {
      const entries = await this.getEntries(userId, {}, 1000);
      
      if (format === 'json') {
        return JSON.stringify(entries, null, 2);
      } else {
        const headers = ['Fecha', 'Título', 'Categoría', 'Estado de Ánimo', 'Contenido', 'Etiquetas'];
        const csvContent = [
          headers.join(','),
          ...entries.map(entry => [
            entry.createdAt.toLocaleDateString(),
            `"${entry.title.replace(/"/g, '""')}"`,
            entry.category,
            entry.mood,
            `"${entry.content.replace(/"/g, '""')}"`,
            `"${entry.tags.join('; ')}"`
          ].join(','))
        ].join('\n');
        
        return csvContent;
      }
    } catch (error) {
      throw new Error(`Error al exportar entradas: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }
}
