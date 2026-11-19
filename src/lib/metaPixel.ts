/**
 * Meta Pixel without the inline <script> snippet (the site's CSP forbids
 * inline scripts): the same queueing stub, then fbevents.js loaded from
 * connect.facebook.net, which the CSP allows.
 *
 * The pixel ID is public (it ships in every pixel snippet), so it lives in
 * VITE_META_PIXEL_ID. A Conversions API access token is secret and must never
 * go into a VITE_ variable — CAPI needs a server; see README.
 *
 * Every event gets an eventID so a future Conversions API sender can pass the
 * same ID and Meta will deduplicate browser + server events.
 */

type FbqArgs = unknown[];
interface Fbq {
  (...args: FbqArgs): void;
  callMethod?: (...args: FbqArgs) => void;
  queue: FbqArgs[];
  push: Fbq;
  loaded: boolean;
  version: string;
}

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

const PIXEL_ID = (import.meta.env.VITE_META_PIXEL_ID ?? "").trim();

/** Pixel IDs are numeric; anything else (typo, empty) leaves tracking off. */
export const pixelEnabled = /^\d{10,20}$/.test(PIXEL_ID);

const WORKSHOP = {
  content_name: "Практический бизнес-семинар для предпринимателей — Караганда, 26 ноября",
  content_category: "workshop",
  value: 10000,
  currency: "KZT",
};

export function initMetaPixel(): void {
  if (!pixelEnabled || typeof window === "undefined" || window.fbq) return;

  const fbq = function (...args: FbqArgs) {
    if (fbq.callMethod) fbq.callMethod(...args);
    else fbq.queue.push(args);
  } as Fbq;
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.queue = [];
  window.fbq = fbq;
  window._fbq = fbq;

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);

  fbq("init", PIXEL_ID);
  fbq("track", "PageView");
}

function eventId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/**
 * Registration intent: a visitor pressed a booking button and is sent to
 * WhatsApp to sign up. `location` says which button (header, hero, …).
 */
export function trackRegistration(location: string): void {
  if (!pixelEnabled || !window.fbq) return;
  window.fbq(
    "track",
    "CompleteRegistration",
    { ...WORKSHOP, status: "whatsapp_opened", button_location: location },
    { eventID: eventId() },
  );
}
