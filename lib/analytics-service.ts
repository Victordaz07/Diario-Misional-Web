// Google Analytics service
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
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

    window.gtag('event', event.action, {
      event_category: event.category,
      event_label: event.label,
      value: event.value,
    });
  }

  public trackDiaryEntryCreated(category: string, mood: string): void {
    this.trackEvent({
      action: 'diary_entry_created',
      category: 'diary',
      label: `${category}_${mood}`,
      value: 1,
    });
  }

  public trackTransferCreated(area: string): void {
    this.trackEvent({
      action: 'transfer_created',
      category: 'transfers',
      label: area,
      value: 1,
    });
  }

  public trackPhotoUploaded(category: string): void {
    this.trackEvent({
      action: 'photo_uploaded',
      category: 'photos',
      label: category,
      value: 1,
    });
  }

  public trackResourceDownloaded(resourceType: string, resourceTitle: string): void {
    this.trackEvent({
      action: 'resource_downloaded',
      category: 'resources',
      label: `${resourceType}_${resourceTitle}`,
      value: 1,
    });
  }

  public trackDonationCompleted(amount: number, planType: string): void {
    this.trackEvent({
      action: 'donation_completed',
      category: 'payments',
      label: planType,
      value: amount,
    });
  }
}

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