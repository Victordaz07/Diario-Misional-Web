// lib/hooks/use-realtime.ts
import { useState, useEffect } from 'react';
import { realtimeService, RealtimeEvent } from '@/lib/realtime-service';

export function useRealtime(userId?: string) {
    const [events, setEvents] = useState<RealtimeEvent[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [connectionId, setConnectionId] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) return;

        // Conectar usuario
        const connId = realtimeService.connectUser(userId);
        setConnectionId(connId);
        setIsConnected(true);

        // Suscribirse a eventos
        const unsubscribe = realtimeService.subscribeToEvents(userId, (event) => {
            setEvents(prev => [event, ...prev.slice(0, 49)]); // Mantener solo los últimos 50 eventos
        });

        // Cargar eventos recientes
        const loadRecentEvents = async () => {
            try {
                const recentEvents = await realtimeService.getRecentEvents(userId, 20);
                setEvents(recentEvents);
            } catch (error) {
                console.error('Error loading recent events:', error);
            }
        };

        loadRecentEvents();

        // Cleanup
        return () => {
            unsubscribe();
            if (connId) {
                realtimeService.disconnectUser(connId);
            }
            setIsConnected(false);
        };
    }, [userId]);

    const sendEvent = (eventType: string, eventData: any, broadcastTo?: string[]) => {
        if (userId) {
            realtimeService.broadcastEvent({
                type: eventType as any,
                userId,
                data: eventData,
                broadcastTo,
            });
        }
    };

    return {
        events,
        isConnected,
        connectionId,
        sendEvent,
    };
}
