/**
 * Google tag (GTM-MTT8BNFQ → Google Analytics 4) without the inline <script>
 * snippet (the site's CSP forbids inline scripts): the same dataLayer/gtag
 * setup, then gtm.js loaded from googletagmanager.com, which the CSP allows.
 *
 * The tag ID is public. It can be overridden with VITE_GOOGLE_TAG_ID. Only
 * production builds report, so local development doesn't pollute analytics.
 */

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const DEFAULT_TAG_ID = "GTM-MTT8BNFQ";
const TAG_ID = (import.meta.env.VITE_GOOGLE_TAG_ID ?? DEFAULT_TAG_ID).trim();

/** Container IDs look like GTM-XXXXXXX; anything else leaves tracking off. */
export const googleTagEnabled = import.meta.env.PROD && /^GTM-[A-Z0-9]{4,12}$/.test(TAG_ID);

export function initGoogleTag(): void {
  if (!googleTagEnabled || typeof window === "undefined" || window.gtag) return;

  const dataLayer = (window.dataLayer = window.dataLayer || []);
  // gtag must push the `arguments` object itself, not an array.
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${TAG_ID}`;
  document.head.appendChild(script);
}

/**
 * GA4 recommended event `generate_lead`: a visitor pressed a booking button
 * and is sent to WhatsApp. Mark it as a key event in GA4 to use it in Ads.
 */
export function trackGoogleLead(location: string): void {
  if (!googleTagEnabled || !window.gtag) return;
  window.gtag("event", "generate_lead", {
    value: 10000,
    currency: "KZT",
    button_location: location,
  });
}

/** Generic GA4 engagement event (e.g. start_chats, click_benefits). */
export function trackGoogleEvent(name: string, params?: Record<string, unknown>): void {
  if (!googleTagEnabled || !window.gtag) return;
  window.gtag("event", name, params ?? {});
}
