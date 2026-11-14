/**
 * Which opening Power-on plays (docs/BRIEF-room-motion.md): the full 4-second one on the first visit in a browser
 * session, the same opening at a quicker pace on later visits ('return', about 3 seconds, return.css) and, on a phone, a simpler one ('mobile', about 2.5 seconds, lite.css).
 * "Session" is sessionStorage: it survives a reload and in-app navigation in the tab, and a new tab starts afresh.
 */
export type OpeningKind = 'full' | 'mobile' | 'return';

const KEY = 'rm-power-on-seen';

/** A phone or a touch screen: a narrow window, or no hover. Decides which first-visit opening plays. */
export const MOBILE_QUERY = '(max-width: 600px), (hover: none)';

export const isMobile = (): boolean => typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia(MOBILE_QUERY).matches;

/** Has this session already seen the opening? Storage can throw (private modes, blocked cookies): then, not seen. */
export const openingSeen = (): boolean => {
  try {
    return window.sessionStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
};

export const markOpeningSeen = (): void => {
  try {
    window.sessionStorage.setItem(KEY, '1');
  } catch {
    /* storage unavailable: the next visit plays the full opening again */
  }
};

export const forgetOpeningSeen = (): void => {
  try {
    window.sessionStorage.removeItem(KEY);
  } catch {
    /* storage unavailable: nothing to forget */
  }
};

export const pickOpening = ({ seen, mobile }: { seen: boolean; mobile: boolean }): OpeningKind =>
  seen ? 'return' : mobile ? 'mobile' : 'full';
