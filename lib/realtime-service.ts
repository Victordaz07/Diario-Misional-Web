// lib/realtime-service.ts
import { db } from './firebase';

export interface RealtimeEvent {
    id: string;
    type: 'diary_entry' | 'photo_upload' | 'transfer_update' | 'sponsorship_update' | 'notification';
    userId: string;
    data: any;
    timestamp: Date;
    broadcastTo?: string[]; // IDs de usuarios que deben recibir el evento
}

export interface RealtimeConnection {
    userId: string;
    connectionId: string;
    lastSeen: Date;
    isActive: boolean;
}

class RealtimeService {
    private connections: Map<string, RealtimeConnection> = new Map();
    private eventListeners: Map<string, Set<(event: RealtimeEvent) => void>> = new Map();

    // Conectar usuario
    connectUser(userId: string): string {
        const connectionId = `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        const connection: RealtimeConnection = {
            userId,
            connectionId,
            lastSeen: new Date(),
            isActive: true,
        };

        this.connections.set(connectionId, connection);

        // Limpiar conexiones inactivas
        this.cleanupInactiveConnections();

        return connectionId;
    }

    // Desconectar usuario
    disconnectUser(connectionId: string): void {
        this.connections.delete(connectionId);
    }

    // Registrar listener de eventos
    subscribeToEvents(userId: string, callback: (event: RealtimeEvent) => void): () => void {
        if (!this.eventListeners.has(userId)) {
            this.eventListeners.set(userId, new Set());
        }

        this.eventListeners.get(userId)!.add(callback);

        // Retornar función para desuscribirse
        return () => {
            const listeners = this.eventListeners.get(userId);
            if (listeners) {
                listeners.delete(callback);
                if (listeners.size === 0) {
                    this.eventListeners.delete(userId);
                }
            }
        };
    }

    // Enviar evento en tiempo real
    async broadcastEvent(event: Omit<RealtimeEvent, 'id' | 'timestamp'>): Promise<void> {
        try {
            const realtimeEvent: RealtimeEvent = {
                ...event,
                id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                timestamp: new Date(),
            };

            // Guardar evento en Firebase
            await db.collection('realtime_events').add(realtimeEvent);

            // Enviar a listeners locales
            this.sendToListeners(realtimeEvent);

            // Limpiar eventos antiguos
            this.cleanupOldEvents();
        } catch (error) {
            console.error('Error broadcasting event:', error);
        }
    }

    // Enviar evento a listeners específicos
    private sendToListeners(event: RealtimeEvent): void {
        const targetUsers = event.broadcastTo || [event.userId];

        targetUsers.forEach(userId => {
            const listeners = this.eventListeners.get(userId);
            if (listeners) {
                listeners.forEach(callback => {
                    try {
                        callback(event);
                    } catch (error) {
                        console.error('Error in event listener:', error);
                    }
                });
            }
        });
    }

    // Obtener eventos recientes para un usuario
    async getRecentEvents(userId: string, limit: number = 50): Promise<RealtimeEvent[]> {
        try {
            const snapshot = await db
                .collection('realtime_events')
                .where('userId', '==', userId)
                .orderBy('timestamp', 'desc')
                .limit(limit)
                .get();

            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                timestamp: doc.data().timestamp?.toDate() || new Date(),
            })) as RealtimeEvent[];
        } catch (error) {
            console.error('Error getting recent events:', error);
            return [];
        }
    }

    // Obtener eventos para múltiples usuarios (familias/sponsors)
    async getEventsForUsers(userIds: string[], limit: number = 50): Promise<RealtimeEvent[]> {
        try {
            const promises = userIds.map(userId =>
                db.collection('realtime_events')
                    .where('userId', '==', userId)
                    .orderBy('timestamp', 'desc')
                    .limit(limit)
                    .get()
            );

            const snapshots = await Promise.all(promises);
            const allEvents: RealtimeEvent[] = [];

            snapshots.forEach(snapshot => {
                const events = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    timestamp: doc.data().timestamp?.toDate() || new Date(),
                })) as RealtimeEvent[];
                allEvents.push(...events);
            });

            // Ordenar por timestamp y limitar
            return allEvents
                .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                .slice(0, limit);
        } catch (error) {
            console.error('Error getting events for users:', error);
            return [];
        }
    }

    // Limpiar conexiones inactivas
    private cleanupInactiveConnections(): void {
        const now = new Date();
        const inactiveThreshold = 5 * 60 * 1000; // 5 minutos

        for (const [connectionId, connection] of this.connections) {
            if (now.getTime() - connection.lastSeen.getTime() > inactiveThreshold) {
                this.connections.delete(connectionId);
            }
        }
    }

    // Limpiar eventos antiguos
    private async cleanupOldEvents(): Promise<void> {
        try {
            const cutoffDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 días

            const snapshot = await db
                .collection('realtime_events')
                .where('timestamp', '<', cutoffDate)
                .limit(100)
                .get();

            const batch = db.batch();
            snapshot.docs.forEach(doc => {
                batch.delete(doc.ref);
            });

            await batch.commit();
        } catch (error) {
            console.error('Error cleaning up old events:', error);
        }
    }

    // Obtener estadísticas de conexiones
    getConnectionStats(): {
        totalConnections: number;
        activeConnections: number;
        uniqueUsers: number;
    } {
        const uniqueUsers = new Set();
        let activeConnections = 0;

        for (const connection of this.connections.values()) {
            uniqueUsers.add(connection.userId);
            if (connection.isActive) {
                activeConnections++;
            }
        }

        return {
            totalConnections: this.connections.size,
            activeConnections,
            uniqueUsers: uniqueUsers.size,
        };
    }

    // Eventos específicos del sistema
    async notifyDiaryEntry(userId: string, entryData: any): Promise<void> {
        await this.broadcastEvent({
            type: 'diary_entry',
            userId,
            data: entryData,
            broadcastTo: [userId], // También enviar a familia/sponsors si están conectados
        });
    }

    async notifyPhotoUpload(userId: string, photoData: any): Promise<void> {
        await this.broadcastEvent({
            type: 'photo_upload',
            userId,
            data: photoData,
            broadcastTo: [userId],
        });
    }

    async notifyTransferUpdate(userId: string, transferData: any): Promise<void> {
        await this.broadcastEvent({
            type: 'transfer_update',
            userId,
            data: transferData,
            broadcastTo: [userId],
        });
    }

    async notifySponsorshipUpdate(userId: string, sponsorshipData: any): Promise<void> {
        await this.broadcastEvent({
            type: 'sponsorship_update',
            userId,
            data: sponsorshipData,
            broadcastTo: [userId],
        });
    }

    async notifyNewNotification(userId: string, notificationData: any): Promise<void> {
        await this.broadcastEvent({
            type: 'notification',
            userId,
            data: notificationData,
            broadcastTo: [userId],
        });
    }

    // Simular conexión WebSocket (para desarrollo)
    simulateWebSocketConnection(userId: string): {
        connectionId: string;
        unsubscribe: () => void;
        send: (event: any) => void;
    } {
        const connectionId = this.connectUser(userId);

        const unsubscribe = this.subscribeToEvents(userId, (event) => {
            // Simular recepción de evento
            console.log('Received realtime event:', event);
        });

        const send = (event: any) => {
            this.broadcastEvent({
                type: event.type,
                userId,
                data: event.data,
                broadcastTo: event.broadcastTo,
            });
        };

        return {
            connectionId,
            unsubscribe,
            send,
        };
    }
}

export const realtimeService = new RealtimeService();
