import { track } from '@vercel/analytics';

/**
 * Event names for tracking user actions
 */
export const TRACK_EVENTS = {
  // Calculator events
  CALCULATION_PERFORMED: 'calculation_performed',
  CALCULATION_AUTO_TRIGGERED: 'calculation_auto_triggered',
  INPUT_MODE_CHANGED: 'input_mode_changed',
  SYMBOL_CHANGED: 'symbol_changed',

  // Form events
  FORM_SUBMITTED: 'form_submitted',
  FORM_VALIDATION_ERROR: 'form_validation_error',

  // User interaction events
  PAGE_LOADED: 'page_loaded',
  RESULTS_VIEWED: 'results_viewed',
} as const;

export type TrackEvent = (typeof TRACK_EVENTS)[keyof typeof TRACK_EVENTS];

/**
 * Properties that can be sent with tracking events
 */
export interface TrackEventProperties {
  // Calculator-specific properties
  symbol?: string;
  inputMode?: 'pips' | 'price';
  accountBalance?: number;
  riskPercentage?: number;
  lotSize?: number;
  riskAmount?: number;
  positionSize?: number;
  isValidCalculation?: boolean;
  calculationErrors?: string;

  // General properties
  value?: number;
  category?: string;
  label?: string;
  page?: string;
  errorMessage?: string;
  errorType?: string;
  action?: string;
  duration?: number;
}

/**
 * Helper function to clean properties object
 */
const cleanProperties = (
  properties: TrackEventProperties
): Record<string, string | number | boolean> => {
  const cleaned: Record<string, string | number | boolean> = {};

  for (const key in properties) {
    const value = properties[key as keyof TrackEventProperties];
    if (value !== undefined) {
      cleaned[key] = value;
    }
  }

  return cleaned;
};

/**
 * Wrapper function for tracking events across different analytics platforms
 * Currently uses Vercel Analytics, but can be extended to include other providers
 *
 * @param eventName - The name of the event to track
 * @param properties - Optional properties to send with the event
 */
export const trackEvent = (
  eventName: TrackEvent | string,
  properties?: TrackEventProperties
): void => {
  try {
    // Clean properties to remove undefined values
    const processedProperties = properties
      ? cleanProperties(properties)
      : undefined;

    // Track with Vercel Analytics
    track(eventName, processedProperties);

    // Future: Add other analytics providers here
    // Example:
    // if (window.gtag) {
    //   window.gtag('event', eventName, processedProperties);
    // }
    //
    // if (window.mixpanel) {
    //   window.mixpanel.track(eventName, processedProperties);
    // }

    // Development logging
    if (import.meta.env.DEV) {
      console.log('[Analytics] Event tracked:', eventName, processedProperties);
    }
  } catch (error) {
    // Silently fail in production to avoid breaking the app
    if (import.meta.env.DEV) {
      console.error('[Analytics] Failed to track event:', error);
    }
  }
};

/**
 * Track page views
 */
export const trackPageView = (
  pageName: string,
  properties?: TrackEventProperties
): void => {
  trackEvent('page_view', {
    page: pageName,
    ...properties,
  });
};

/**
 * Track errors
 */
export const trackError = (
  errorMessage: string,
  errorType: string = 'generic',
  properties?: TrackEventProperties
): void => {
  trackEvent('error_occurred', {
    errorMessage,
    errorType,
    ...properties,
  });
};

/**
 * Track user engagement metrics
 */
export const trackEngagement = (
  action: string,
  duration?: number,
  properties?: TrackEventProperties
): void => {
  trackEvent('user_engagement', {
    action,
    duration,
    ...properties,
  });
};
