// Google Analytics service
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export interface AnalyticsEvent {
  id: string;
  eventType: string;
  userId: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface UserMetrics {
  userId: string;
  totalSessions: number;
  averageSessionDuration: number;
  lastActive: Date;
  diaryEntries: number;
  photosUploaded: number;
  transfers: number;
}

export interface MissionaryMetrics {
  missionaryId: string;
  daysInService: number;
  teachings: number;
  baptisms: number;
  transfers: number;
  companions: number;
  areasServed: string[];
}

export interface SponsorshipMetrics {
  totalAmount: number;
  activeSubscriptions: number;
  monthlyRecurringRevenue: number;
  totalDonations: number;
  averageDonationAmount: number;
  topDonors: Array<{
    donorId: string;
    totalDonated: number;
    donationCount: number;
  }>;
}

export class AnalyticsService {
  private static instance: AnalyticsService;
  private isInitialized = false;
  private measurementId: string;

  private constructor() {
    this.measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';
  }

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  public initialize(): void {
    if (typeof window === 'undefined' || this.isInitialized) return;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
    document.head.appendChild(script);

    window.gtag = window.gtag || function() {
      (window.gtag as any).q = (window.gtag as any).q || [];
      (window.gtag as any).q.push(arguments);
    };

    window.gtag('js', new Date());
    window.gtag('config', this.measurementId);

    this.isInitialized = true;
  }

  public trackEvent(event: AnalyticsEvent): void {
    if (!this.isInitialized) return;

    window.gtag('event', event.eventType, {
      event_category: 'user_action',
      event_label: event.userId,
      value: 1,
    });
  }

  public trackDiaryEntryCreated(category: string, mood: string): void {
    this.trackEvent({
      id: `diary_${Date.now()}`,
      eventType: 'diary_entry_created',
      userId: 'demo_user',
      timestamp: new Date(),
      metadata: { category, mood }
    });
  }

  public trackTransferCreated(area: string): void {
    this.trackEvent({
      id: `transfer_${Date.now()}`,
      eventType: 'transfer_created',
      userId: 'demo_user',
      timestamp: new Date(),
      metadata: { area }
    });
  }

  public trackPhotoUploaded(category: string): void {
    this.trackEvent({
      id: `photo_${Date.now()}`,
      eventType: 'photo_uploaded',
      userId: 'demo_user',
      timestamp: new Date(),
      metadata: { category }
    });
  }

  public trackResourceDownloaded(resourceType: string, resourceTitle: string): void {
    this.trackEvent({
      id: `resource_${Date.now()}`,
      eventType: 'resource_downloaded',
      userId: 'demo_user',
      timestamp: new Date(),
      metadata: { resourceType, resourceTitle }
    });
  }

  public trackDonationCompleted(amount: number, planType: string): void {
    this.trackEvent({
      id: `donation_${Date.now()}`,
      eventType: 'donation_completed',
      userId: 'demo_user',
      timestamp: new Date(),
      metadata: { amount, planType }
    });
  }

  // Métodos para el panel de administración
  public async getSponsorshipMetrics(): Promise<SponsorshipMetrics> {
    // Simular datos de métricas de patrocinio
    return {
      totalAmount: 15420,
      activeSubscriptions: 23,
      monthlyRecurringRevenue: 1250,
      totalDonations: 45,
      averageDonationAmount: 342.67,
      topDonors: [
        { donorId: 'donor_1', totalDonated: 2500, donationCount: 5 },
        { donorId: 'donor_2', totalDonated: 1800, donationCount: 3 },
        { donorId: 'donor_3', totalDonated: 1200, donationCount: 2 }
      ]
    };
  }

  public async getPageStats(): Promise<Record<string, number>> {
    // Simular estadísticas de páginas
    return {
      dashboard: 1250,
      diario: 890,
      fotos: 650,
      recursos: 420,
      traslados: 380,
      etapas: 320,
      sponsors: 280,
      perfil: 150
    };
  }

  public async getFeatureStats(): Promise<Record<string, number>> {
    // Simular estadísticas de funcionalidades
    return {
      diary_entry_created: 450,
      photo_uploaded: 320,
      resource_downloaded: 280,
      transfer_created: 150,
      donation_completed: 45,
      profile_updated: 120,
      notification_sent: 890,
      export_pdf: 85
    };
  }

  public async getRecentEvents(userId: string, limit: number = 20): Promise<AnalyticsEvent[]> {
    // Simular eventos recientes
    const events: AnalyticsEvent[] = [
      {
        id: 'event_1',
        eventType: 'diary_entry_created',
        userId: userId,
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        metadata: { category: 'Enseñanza', mood: 'Feliz' }
      },
      {
        id: 'event_2',
        eventType: 'photo_uploaded',
        userId: userId,
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        metadata: { category: 'Servicio' }
      },
      {
        id: 'event_3',
        eventType: 'resource_downloaded',
        userId: userId,
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        metadata: { resourceType: 'PDF', resourceTitle: 'Guía de Enseñanza' }
      },
      {
        id: 'event_4',
        eventType: 'donation_completed',
        userId: userId,
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        metadata: { amount: 50, planType: 'Bronze' }
      }
    ];

    return events.slice(0, limit);
  }

  public async getUserMetrics(): Promise<UserMetrics[]> {
    // Simular métricas de usuarios
    return [
      {
        userId: 'user_1',
        totalSessions: 45,
        averageSessionDuration: 25.5,
        lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
        diaryEntries: 12,
        photosUploaded: 8,
        transfers: 2
      },
      {
        userId: 'user_2',
        totalSessions: 38,
        averageSessionDuration: 18.2,
        lastActive: new Date(Date.now() - 5 * 60 * 60 * 1000),
        diaryEntries: 9,
        photosUploaded: 15,
        transfers: 1
      }
    ];
  }

  public async getMissionaryMetrics(): Promise<MissionaryMetrics[]> {
    // Simular métricas de misioneros
    return [
      {
        missionaryId: 'missionary_1',
        daysInService: 245,
        teachings: 89,
        baptisms: 3,
        transfers: 2,
        companions: 4,
        areasServed: ['Centro', 'Norte', 'Sur']
      },
      {
        missionaryId: 'missionary_2',
        daysInService: 180,
        teachings: 67,
        baptisms: 2,
        transfers: 1,
        companions: 3,
        areasServed: ['Este', 'Oeste']
      }
    ];
  }
}

// Exportar instancia singleton
export const analyticsService = AnalyticsService.getInstance();

export const useAnalytics = () => {
  const analytics = AnalyticsService.getInstance();
  return {
    trackDiaryEntryCreated: (category: string, mood: string) => 
      analytics.trackDiaryEntryCreated(category, mood),
    trackTransferCreated: (area: string) => analytics.trackTransferCreated(area),
    trackPhotoUploaded: (category: string) => analytics.trackPhotoUploaded(category),
    trackResourceDownloaded: (resourceType: string, resourceTitle: string) => 
      analytics.trackResourceDownloaded(resourceType, resourceTitle),
    trackDonationCompleted: (amount: number, planType: string) => 
      analytics.trackDonationCompleted(amount, planType),
  };
};