// Capture and store TikTok / UTM tracking parameters from the URL
const STORAGE_KEY = 'trackingParams';

const TRACKED_PARAMS = [
  'ttclid', 'adid', 'adname', 'adset', 'cname', 'domain',
  'placement', 'search', 'site', 'type', 'cck', 'tiktok_clid',
  'xgo', 'utm_source', 'utm_campaign', 'utm_medium', 'utm_content',
  'utm_term', 'utm_id', 'src', 'sck',
];

/** Call once on app init – grabs tracking query-params from the URL and persists them. */
export const captureTrackingParams = () => {
  if (typeof window === 'undefined') return;

  const url = new URL(window.location.href);
  const params: Record<string, string> = {};

  TRACKED_PARAMS.forEach((key) => {
    const value = url.searchParams.get(key);
    if (value) params[key] = value;
  });

  // Only overwrite if the current URL actually carries tracking params
  if (Object.keys(params).length > 0) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(params));
  }
};

/** Returns the stored tracking params (or empty object). */
export const getTrackingParams = (): Record<string, string> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};
