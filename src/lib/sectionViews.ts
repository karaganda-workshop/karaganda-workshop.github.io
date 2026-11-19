/**
 * Single-page analytics: fire a `view_section` event the first time each block
 * (marked with `data-section="<name>"`) is scrolled into view, so reports show
 * which parts of the page people actually reach. Create a matching
 * "Целевое событие" `view_section` goal in Metrika; in GA4 it appears
 * automatically. The block name arrives as the `section` parameter.
 */
import { trackEvent } from "./analytics";

export function initSectionTracking(): void {
  if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;
  const seen = new Set<string>();
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const name = (entry.target as HTMLElement).dataset.section;
        if (!name || seen.has(name)) continue;
        seen.add(name);
        trackEvent("view_section", { section: name });
        observer.unobserve(entry.target);
      }
    },
    // Fire once the block is a quarter of the way up the screen — a real view.
    { threshold: 0, rootMargin: "0px 0px -25% 0px" },
  );
  document.querySelectorAll<HTMLElement>("[data-section]").forEach((el) => observer.observe(el));
}
