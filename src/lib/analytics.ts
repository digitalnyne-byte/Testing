'use client';

export function trackEvent(eventName: string, eventParams: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return;
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!measurementId || measurementId === 'your-google-analytics-id-here') return;
  if (typeof (window as any).gtag === 'function') {
    (window as any).gtag('event', eventName, eventParams);
  }
}
