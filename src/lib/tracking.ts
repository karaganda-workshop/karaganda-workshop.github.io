/**
 * Per-browser opt-out so the owner's own visits never reach analytics.
 *
 * Open the site once on each of your devices/browsers with `?notrack` in the
 * URL — the flag is stored in localStorage and all analytics stays off there
 * from then on. `?notrack=0` turns counting back on for that browser.
 * IP filters are unreliable on mobile (the IP changes), so this cookie-style
 * flag is the dependable way to exclude yourself.
 */
const KEY = "wk_notrack";

/** Reads `?notrack` from the URL and remembers the choice for this browser. */
export function initTrackingOptOut(): void {
  try {
    const value = new URLSearchParams(location.search).get("notrack");
    if (value === null) return;
    if (value === "0" || value === "off") localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, "1");
  } catch {
    // private mode / storage blocked — nothing to remember
  }
}

/** True when this browser opted out: skip loading and sending analytics. */
export function trackingDisabled(): boolean {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}
