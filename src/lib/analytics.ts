/**
 * One call to log an engagement event to every analytics tool at once.
 * Use for non-conversion activity (button clicks, section views). Booking
 * clicks keep their dedicated conversion events in BookLink.
 */
import { trackGoogleEvent } from "./googleTag";
import { reachMetrikaGoal } from "./yandexMetrika";

export function trackEvent(name: string, params?: Record<string, unknown>): void {
  trackGoogleEvent(name, params);
  reachMetrikaGoal(name, params);
}
