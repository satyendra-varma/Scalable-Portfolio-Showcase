import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MOBILE_QUERY, forgetOpeningSeen, isMobile, markOpeningSeen, openingSeen, pickOpening } from './opening';

const KEY = 'rm-power-on-seen';

beforeEach(() => window.sessionStorage.clear());
afterEach(() => {
  vi.restoreAllMocks();
  Reflect.deleteProperty(window, 'matchMedia');
});

describe('which opening plays', () => {
  it('is the full one on a first visit on a desktop, the quicker one on a desktop return, and the mobile one on a phone whether or not it has been seen', () => {
    expect(pickOpening({ seen: false, mobile: false })).toBe('full');
    expect(pickOpening({ seen: false, mobile: true })).toBe('mobile');
    expect(pickOpening({ seen: true, mobile: false })).toBe('return');
    expect(pickOpening({ seen: true, mobile: true })).toBe('mobile');
  });
});

describe('remembering that the opening was seen, for the session', () => {
  it('starts as not seen, is seen once marked, and is not seen again once forgotten', () => {
    expect(openingSeen()).toBe(false);
    markOpeningSeen();
    expect(openingSeen()).toBe(true);
    expect(window.sessionStorage.getItem(KEY)).toBe('1');
    forgetOpeningSeen();
    expect(openingSeen()).toBe(false);
    expect(window.sessionStorage.getItem(KEY)).toBeNull();
  });

  it('keeps the flag in sessionStorage only, so a new tab starts afresh', () => {
    markOpeningSeen();
    expect(window.localStorage.getItem(KEY)).toBeNull();
  });

  it('counts storage that throws as not seen, and never throws itself', () => {
    markOpeningSeen();
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked'); });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked'); });
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => { throw new Error('blocked'); });
    expect(openingSeen()).toBe(false);
    expect(() => markOpeningSeen()).not.toThrow();
    expect(() => forgetOpeningSeen()).not.toThrow();
  });
});

describe('telling a phone or touch screen from a desktop', () => {
  const stubMedia = (matches: (query: string) => boolean) =>
    Object.defineProperty(window, 'matchMedia', { configurable: true, writable: true, value: vi.fn((query: string) => ({ matches: matches(query), media: query })) });

  it('asks for a narrow window or no hover', () => {
    expect(MOBILE_QUERY).toBe('(max-width: 600px), (hover: none)');
  });

  it('is true when the query matches and false when it does not', () => {
    stubMedia((q) => q === MOBILE_QUERY);
    expect(isMobile()).toBe(true);
    stubMedia(() => false);
    expect(isMobile()).toBe(false);
  });

  it('is false when matchMedia is not available', () => {
    expect(window.matchMedia).toBeUndefined();
    expect(isMobile()).toBe(false);
  });
});
