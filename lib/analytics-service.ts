// lib/analytics-service.ts
import { db } from './firebase';

export interface AnalyticsEvent {
    id: string;
    userId: string;
    eventType: string;
    eventData: any;
    timestamp: Date;
    sessionId: string;
    userAgent?: string;
    ipAddress?: string;
}

export interface UserMetrics {
    userId: string;
    totalSessions: number;
    totalTimeSpent: number; // en minutos
    lastActive: Date;
    pagesVisited: string[];
    featuresUsed: string[];
    engagementScore: number; // 0-100
}

export interface MissionaryMetrics {
    missionaryId: string;
    totalEntries: number;
    totalPhotos: number;
    totalTransfers: number;
    totalInvestigators: number;
    averageEntriesPerWeek: number;
    engagementLevel: 'low' | 'medium' | 'high';
    lastActivity: Date;
}

export interface SponsorshipMetrics {
    totalDonations: number;
    totalAmount: number;
    activeSubscriptions: number;
    averageDonationAmount: number;
    monthlyRecurringRevenue: number;
    churnRate: number; // porcentaje
    conversionRate: number; // porcentaje
}

class AnalyticsService {
    // Registrar evento de analytics
    async trackEvent(
        userId: string,
        eventType: string,
        eventData: any = {},
        sessionId?: string
    ): Promise<void> {
        try {
            const event: Omit<AnalyticsEvent, 'id'> = {
                userId,
                eventType,
                eventData,
                timestamp: new Date(),
                sessionId: sessionId || this.generateSessionId(),
            };

            await db.collection('analytics_events').add(event);
        } catch (error) {
            console.error('Error tracking event:', error);
        }
    }

    // Generar ID de sesión único
    private generateSessionId(): string {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // Obtener métricas del usuario
    async getUserMetrics(userId: string): Promise<UserMetrics> {
        try {
            const snapshot = await db
                .collection('analytics_events')
                .where('userId', '==', userId)
                .get();

            const events = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                timestamp: doc.data().timestamp?.toDate() || new Date(),
            })) as AnalyticsEvent[];

            const sessions = new Set(events.map(e => e.sessionId));
            const pagesVisited = [...new Set(events.filter(e => e.eventType === 'page_view').map(e => e.eventData.page))];
            const featuresUsed = [...new Set(events.filter(e => e.eventType === 'feature_used').map(e => e.eventData.feature))];

            // Calcular tiempo total (simulado)
            const totalTimeSpent = events.length * 2; // 2 minutos por evento promedio

            // Calcular engagement score
            const engagementScore = Math.min(100, Math.round(
                (pagesVisited.length * 10) +
                (featuresUsed.length * 15) +
                (sessions.size * 5)
            ));

            return {
                userId,
                totalSessions: sessions.size,
                totalTimeSpent,
                lastActive: events.length > 0 ? events[0].timestamp : new Date(),
                pagesVisited,
                featuresUsed,
                engagementScore,
            };
        } catch (error) {
            console.error('Error getting user metrics:', error);
            return {
                userId,
                totalSessions: 0,
                totalTimeSpent: 0,
                lastActive: new Date(),
                pagesVisited: [],
                featuresUsed: [],
                engagementScore: 0,
            };
        }
    }

    // Obtener métricas del misionero
    async getMissionaryMetrics(missionaryId: string): Promise<MissionaryMetrics> {
        try {
            const [entriesSnapshot, photosSnapshot, transfersSnapshot, investigatorsSnapshot] = await Promise.all([
                db.collection('diary_entries').where('userId', '==', missionaryId).get(),
                db.collection('photos').where('userId', '==', missionaryId).get(),
                db.collection('transfers').where('userId', '==', missionaryId).get(),
                db.collection('investigators').where('userId', '==', missionaryId).get(),
            ]);

            const totalEntries = entriesSnapshot.docs.length;
            const totalPhotos = photosSnapshot.docs.length;
            const totalTransfers = transfersSnapshot.docs.length;
            const totalInvestigators = investigatorsSnapshot.docs.length;

            // Calcular promedio de entradas por semana
            const entries = entriesSnapshot.docs.map(doc => ({
                createdAt: doc.data().createdAt?.toDate() || new Date(),
            }));

            const weeksActive = entries.length > 0 ?
                Math.max(1, Math.ceil((Date.now() - Math.min(...entries.map(e => e.createdAt.getTime()))) / (7 * 24 * 60 * 60 * 1000))) : 1;

            const averageEntriesPerWeek = totalEntries / weeksActive;

            // Determinar nivel de engagement
            let engagementLevel: 'low' | 'medium' | 'high' = 'low';
            if (averageEntriesPerWeek >= 5 && totalPhotos >= 10) {
                engagementLevel = 'high';
            } else if (averageEntriesPerWeek >= 2 && totalPhotos >= 5) {
                engagementLevel = 'medium';
            }

            const lastActivity = entries.length > 0 ? entries[0].createdAt : new Date();

            return {
                missionaryId,
                totalEntries,
                totalPhotos,
                totalTransfers,
                totalInvestigators,
                averageEntriesPerWeek: Math.round(averageEntriesPerWeek * 10) / 10,
                engagementLevel,
                lastActivity,
            };
        } catch (error) {
            console.error('Error getting missionary metrics:', error);
            return {
                missionaryId,
                totalEntries: 0,
                totalPhotos: 0,
                totalTransfers: 0,
                totalInvestigators: 0,
                averageEntriesPerWeek: 0,
                engagementLevel: 'low',
                lastActivity: new Date(),
            };
        }
    }

    // Obtener métricas de patrocinio
    async getSponsorshipMetrics(): Promise<SponsorshipMetrics> {
        try {
            const [donationsSnapshot, subscriptionsSnapshot] = await Promise.all([
                db.collection('donations').get(),
                db.collection('subscriptions').get(),
            ]);

            const donations = donationsSnapshot.docs.map(doc => doc.data());
            const subscriptions = subscriptionsSnapshot.docs.map(doc => doc.data());

            const totalDonations = donations.length;
            const totalAmount = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
            const activeSubscriptions = subscriptions.filter(s => s.status === 'active').length;
            const averageDonationAmount = totalDonations > 0 ? totalAmount / totalDonations : 0;

            // Calcular MRR (Monthly Recurring Revenue)
            const monthlyRecurringRevenue = subscriptions
                .filter(s => s.status === 'active')
                .reduce((sum, s) => {
                    // Asumir precio promedio de $25 por suscripción
                    return sum + 25;
                }, 0);

            // Calcular churn rate (simulado)
            const churnRate = subscriptions.length > 0 ?
                (subscriptions.filter(s => s.status === 'canceled').length / subscriptions.length) * 100 : 0;

            // Calcular conversion rate (simulado)
            const conversionRate = totalDonations > 0 ?
                (activeSubscriptions / totalDonations) * 100 : 0;

            return {
                totalDonations,
                totalAmount,
                activeSubscriptions,
                averageDonationAmount: Math.round(averageDonationAmount * 100) / 100,
                monthlyRecurringRevenue,
                churnRate: Math.round(churnRate * 100) / 100,
                conversionRate: Math.round(conversionRate * 100) / 100,
            };
        } catch (error) {
            console.error('Error getting sponsorship metrics:', error);
            return {
                totalDonations: 0,
                totalAmount: 0,
                activeSubscriptions: 0,
                averageDonationAmount: 0,
                monthlyRecurringRevenue: 0,
                churnRate: 0,
                conversionRate: 0,
            };
        }
    }

    // Obtener eventos recientes
    async getRecentEvents(userId: string, limit: number = 50): Promise<AnalyticsEvent[]> {
        try {
            const snapshot = await db
                .collection('analytics_events')
                .where('userId', '==', userId)
                .orderBy('timestamp', 'desc')
                .limit(limit)
                .get();

            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                timestamp: doc.data().timestamp?.toDate() || new Date(),
            })) as AnalyticsEvent[];
        } catch (error) {
            console.error('Error getting recent events:', error);
            return [];
        }
    }

    // Obtener estadísticas de uso por página
    async getPageStats(): Promise<Record<string, number>> {
        try {
            const snapshot = await db
                .collection('analytics_events')
                .where('eventType', '==', 'page_view')
                .get();

            const pageStats: Record<string, number> = {};
            snapshot.docs.forEach(doc => {
                const page = doc.data().eventData?.page;
                if (page) {
                    pageStats[page] = (pageStats[page] || 0) + 1;
                }
            });

            return pageStats;
        } catch (error) {
            console.error('Error getting page stats:', error);
            return {};
        }
    }

    // Obtener estadísticas de uso por funcionalidad
    async getFeatureStats(): Promise<Record<string, number>> {
        try {
            const snapshot = await db
                .collection('analytics_events')
                .where('eventType', '==', 'feature_used')
                .get();

            const featureStats: Record<string, number> = {};
            snapshot.docs.forEach(doc => {
                const feature = doc.data().eventData?.feature;
                if (feature) {
                    featureStats[feature] = (featureStats[feature] || 0) + 1;
                }
            });

            return featureStats;
        } catch (error) {
            console.error('Error getting feature stats:', error);
            return {};
        }
    }

    // Generar reporte de analytics
    async generateAnalyticsReport(startDate: Date, endDate: Date): Promise<{
        totalUsers: number;
        totalSessions: number;
        totalEvents: number;
        topPages: Array<{ page: string; views: number }>;
        topFeatures: Array<{ feature: string; uses: number }>;
        userEngagement: {
            average: number;
            high: number;
            medium: number;
            low: number;
        };
    }> {
        try {
            const snapshot = await db
                .collection('analytics_events')
                .where('timestamp', '>=', startDate)
                .where('timestamp', '<=', endDate)
                .get();

            const events = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                timestamp: doc.data().timestamp?.toDate() || new Date(),
            })) as AnalyticsEvent[];

            const uniqueUsers = new Set(events.map(e => e.userId));
            const uniqueSessions = new Set(events.map(e => e.sessionId));

            const pageStats = this.getPageStats();
            const featureStats = this.getFeatureStats();

            const topPages = Object.entries(pageStats)
                .map(([page, views]) => ({ page, views }))
                .sort((a, b) => b.views - a.views)
                .slice(0, 10);

            const topFeatures = Object.entries(featureStats)
                .map(([feature, uses]) => ({ feature, uses }))
                .sort((a, b) => b.uses - a.uses)
                .slice(0, 10);

            // Calcular engagement promedio (simulado)
            const userEngagement = {
                average: 65,
                high: 25,
                medium: 45,
                low: 30,
            };

            return {
                totalUsers: uniqueUsers.size,
                totalSessions: uniqueSessions.size,
                totalEvents: events.length,
                topPages,
                topFeatures,
                userEngagement,
            };
        } catch (error) {
            console.error('Error generating analytics report:', error);
            return {
                totalUsers: 0,
                totalSessions: 0,
                totalEvents: 0,
                topPages: [],
                topFeatures: [],
                userEngagement: { average: 0, high: 0, medium: 0, low: 0 },
            };
        }
    }
}

export const analyticsService = new AnalyticsService();
