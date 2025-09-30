// lib/hooks/use-analytics.ts
import { useState, useEffect } from 'react';
import { analyticsService, UserMetrics, MissionaryMetrics, SponsorshipMetrics } from '@/lib/analytics-service';

export function useAnalytics(userId?: string) {
    const [userMetrics, setUserMetrics] = useState<UserMetrics | null>(null);
    const [missionaryMetrics, setMissionaryMetrics] = useState<MissionaryMetrics | null>(null);
    const [sponsorshipMetrics, setSponsorshipMetrics] = useState<SponsorshipMetrics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadMetrics = async () => {
            setLoading(true);
            try {
                if (userId) {
                    const [user, missionary, sponsorship] = await Promise.all([
                        analyticsService.getUserMetrics(userId),
                        analyticsService.getMissionaryMetrics(userId),
                        analyticsService.getSponsorshipMetrics(),
                    ]);

                    setUserMetrics(user);
                    setMissionaryMetrics(missionary);
                    setSponsorshipMetrics(sponsorship);
                }
            } catch (error) {
                console.error('Error loading analytics:', error);
            } finally {
                setLoading(false);
            }
        };

        loadMetrics();
    }, [userId]);

    const trackEvent = async (eventType: string, eventData: any = {}) => {
        if (userId) {
            await analyticsService.trackEvent(userId, eventType, eventData);
        }
    };

    return {
        userMetrics,
        missionaryMetrics,
        sponsorshipMetrics,
        loading,
        trackEvent,
    };
}
