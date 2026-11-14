let scheduled = false;

/**
 * Ask the browser to fetch the Space Grotesk face that room.css already declares, without using it on screen.
 * The home page's first screen does not use this face; the panels and the list view do. Fetching it once the
 * room is on means the first one opens without a font change. Scheduled when idle so it never competes with
 * the frame in which the room goes live; harmless to call again (only the first call loads).
 */
export function warmDisplayFont(): void {
  if (scheduled || typeof document === 'undefined' || typeof document.fonts?.load !== 'function') return;
  scheduled = true;
  const load = () => {
    try {
      document.fonts.load('700 1em "Space Grotesk"').catch(() => {});
    } catch {
      /* a font that cannot load falls back to the fallback face; nothing to do */
    }
  };
  if (typeof requestIdleCallback === 'function') requestIdleCallback(load, { timeout: 2000 });
  else setTimeout(load, 0);
}

/** For tests only. */
export function resetWarmDisplayFont(): void {
  scheduled = false;
}
