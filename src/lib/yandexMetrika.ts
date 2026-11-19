/**
 * Yandex Metrika counter without the inline <script> snippet (the site's CSP
 * forbids inline scripts): the same queueing stub as the official code, then
 * tag.js loaded from mc.yandex.ru, which the CSP allows.
 *
 * The counter ID is public (it ships in every Metrika snippet). It can be
 * overridden with VITE_YANDEX_METRIKA_ID. Only production builds report, so
 * local development doesn't pollute statistics and Webvisor recordings.
 */

type YmArgs = unknown[];
interface Ym {
  (...args: YmArgs): void;
  a?: YmArgs[];
  l?: number;
}

declare global {
  interface Window {
    ym?: Ym;
    dataLayer?: unknown[];
  }
}

const DEFAULT_COUNTER_ID = "114333673";
const COUNTER_ID = (import.meta.env.VITE_YANDEX_METRIKA_ID ?? DEFAULT_COUNTER_ID).trim();

/** Counter IDs are numeric; anything else (typo, empty) leaves tracking off. */
export const metrikaEnabled = import.meta.env.PROD && /^\d{5,12}$/.test(COUNTER_ID);

export function initYandexMetrika(): void {
  if (!metrikaEnabled || typeof window === "undefined" || window.ym) return;

  const src = `https://mc.yandex.ru/metrika/tag.js?id=${COUNTER_ID}`;
  const ym = function (...args: YmArgs) {
    (ym.a = ym.a || []).push(args);
  } as Ym;
  ym.l = Date.now();
  window.ym = ym;
  window.dataLayer = window.dataLayer || [];

  const script = document.createElement("script");
  script.async = true;
  script.src = src;
  document.head.appendChild(script);

  ym(Number(COUNTER_ID), "init", {
    ssr: true,
    webvisor: true,
    clickmap: true,
    ecommerce: "dataLayer",
    referrer: document.referrer,
    url: location.href,
    accurateTrackBounce: true,
    trackLinks: true,
  });
}

/**
 * Goal "registration": a visitor pressed a booking button and is sent to
 * WhatsApp. Create a JavaScript-event goal with ID `registration` in Metrika
 * to see it in reports and pass it to Yandex Direct.
 */
export function reachRegistrationGoal(location: string): void {
  if (!metrikaEnabled || !window.ym) return;
  window.ym(Number(COUNTER_ID), "reachGoal", "registration", { button_location: location });
}

/**
 * Generic engagement goal (e.g. start_chats, click_benefits). Create a
 * matching "JavaScript-событие" goal in Metrika with the same id to count it.
 */
export function reachMetrikaGoal(goal: string, params?: Record<string, unknown>): void {
  if (!metrikaEnabled || !window.ym) return;
  window.ym(Number(COUNTER_ID), "reachGoal", goal, params);
}
