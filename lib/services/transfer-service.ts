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
  limit 
} from 'firebase/firestore';

export interface Transfer {
  id?: string;
  userId: string;
  transferDate: Date;
  previousArea: string;
  newArea: string;
  previousCompanion: string;
  newCompanion: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TransferStats {
  totalTransfers: number;
  areasServed: string[];
  companionsCount: number;
  averageTimePerArea: number; // in days
}

export class TransferService {
  private static readonly COLLECTION = 'transfers';

  static async createTransfer(userId: string, transfer: Omit<Transfer, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const transferData = {
        ...transfer,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await addDoc(collection(db, this.COLLECTION), transferData);
      return docRef.id;
    } catch (error) {
      throw new Error(`Error al crear traslado: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  static async updateTransfer(transferId: string, updates: Partial<Transfer>): Promise<void> {
    try {
      const transferRef = doc(db, this.COLLECTION, transferId);
      await updateDoc(transferRef, {
        ...updates,
        updatedAt: new Date(),
      });
    } catch (error) {
      throw new Error(`Error al actualizar traslado: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  static async deleteTransfer(transferId: string): Promise<void> {
    try {
      const transferRef = doc(db, this.COLLECTION, transferId);
      await deleteDoc(transferRef);
    } catch (error) {
      throw new Error(`Error al eliminar traslado: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  static async getTransfers(userId: string, limitCount: number = 50): Promise<Transfer[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION),
        where('userId', '==', userId),
        orderBy('transferDate', 'desc'),
        limit(limitCount)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Transfer[];
    } catch (error) {
      throw new Error(`Error al obtener traslados: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  static async getTransfer(transferId: string): Promise<Transfer | null> {
    try {
      const transferRef = doc(db, this.COLLECTION, transferId);
      const snapshot = await getDoc(transferRef);
      
      if (snapshot.exists()) {
        return {
          id: snapshot.id,
          ...snapshot.data()
        } as Transfer;
      }
      
      return null;
    } catch (error) {
      throw new Error(`Error al obtener traslado: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  static async getCurrentArea(userId: string): Promise<string | null> {
    try {
      const transfers = await this.getTransfers(userId, 1);
      return transfers.length > 0 ? transfers[0].newArea : null;
    } catch (error) {
      throw new Error(`Error al obtener área actual: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  static async getCurrentCompanion(userId: string): Promise<string | null> {
    try {
      const transfers = await this.getTransfers(userId, 1);
      return transfers.length > 0 ? transfers[0].newCompanion : null;
    } catch (error) {
      throw new Error(`Error al obtener compañero actual: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  static async getStats(userId: string): Promise<TransferStats> {
    try {
      const transfers = await this.getTransfers(userId, 100);
      
      const stats: TransferStats = {
        totalTransfers: transfers.length,
        areasServed: [],
        companionsCount: 0,
        averageTimePerArea: 0,
      };

      if (transfers.length === 0) {
        return stats;
      }

      // Get unique areas
      const areas = new Set<string>();
      transfers.forEach(transfer => {
        areas.add(transfer.previousArea);
        areas.add(transfer.newArea);
      });
      stats.areasServed = Array.from(areas);

      // Get unique companions
      const companions = new Set<string>();
      transfers.forEach(transfer => {
        companions.add(transfer.previousCompanion);
        companions.add(transfer.newCompanion);
      });
      stats.companionsCount = companions.size;

      // Calculate average time per area
      if (transfers.length > 1) {
        const totalDays = transfers.reduce((total, transfer, index) => {
          if (index < transfers.length - 1) {
            const nextTransfer = transfers[index + 1];
            const daysDiff = Math.ceil(
              (transfer.transferDate.getTime() - nextTransfer.transferDate.getTime()) / (1000 * 60 * 60 * 24)
            );
            return total + daysDiff;
          }
          return total;
        }, 0);
        
        stats.averageTimePerArea = Math.round(totalDays / (transfers.length - 1));
      }

      return stats;
    } catch (error) {
      throw new Error(`Error al obtener estadísticas: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  static async searchTransfers(userId: string, searchTerm: string): Promise<Transfer[]> {
    try {
      const transfers = await this.getTransfers(userId, 100);
      const term = searchTerm.toLowerCase();
      
      return transfers.filter(transfer => 
        transfer.previousArea.toLowerCase().includes(term) ||
        transfer.newArea.toLowerCase().includes(term) ||
        transfer.previousCompanion.toLowerCase().includes(term) ||
        transfer.newCompanion.toLowerCase().includes(term) ||
        (transfer.notes && transfer.notes.toLowerCase().includes(term))
      );
    } catch (error) {
      throw new Error(`Error al buscar traslados: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }
}
