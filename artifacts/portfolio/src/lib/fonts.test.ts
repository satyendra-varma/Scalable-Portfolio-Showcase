import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { resetWarmDisplayFont, warmDisplayFont } from './fonts';

const doc = document as unknown as { fonts?: unknown };
const win = window as unknown as { requestIdleCallback?: unknown };

beforeEach(() => {
  vi.useFakeTimers();
  resetWarmDisplayFont();
});
afterEach(() => {
  vi.useRealTimers();
  delete doc.fonts;
  delete win.requestIdleCallback;
  vi.unstubAllGlobals();
});

describe('warmDisplayFont', () => {
  it('does nothing, and does not throw, without document.fonts', () => {
    delete doc.fonts;
    expect(() => { warmDisplayFont(); vi.runAllTimers(); }).not.toThrow();
  });

  it('loads Space Grotesk once, only after the timer runs, when there is no idle callback', () => {
    const load = vi.fn().mockResolvedValue([]);
    doc.fonts = { load };
    warmDisplayFont();
    expect(load).not.toHaveBeenCalled();
    vi.runAllTimers();
    expect(load).toHaveBeenCalledTimes(1);
    expect(load.mock.calls[0][0]).toContain('"Space Grotesk"');
  });

  it('uses requestIdleCallback with a timeout when it exists', () => {
    const load = vi.fn().mockResolvedValue([]);
    doc.fonts = { load };
    let idle: (() => void) | undefined;
    const ric = vi.fn((fn: () => void) => { idle = fn; return 1; });
    vi.stubGlobal('requestIdleCallback', ric);
    warmDisplayFont();
    expect(ric).toHaveBeenCalledWith(expect.any(Function), { timeout: 2000 });
    vi.runAllTimers();
    expect(load).not.toHaveBeenCalled();
    idle?.();
    expect(load).toHaveBeenCalledTimes(1);
  });

  it('swallows a rejected load', async () => {
    doc.fonts = { load: vi.fn().mockRejectedValue(new Error('network')) };
    warmDisplayFont();
    vi.runAllTimers();
    await Promise.resolve();
  });

  it('does not load again on a second call', () => {
    const load = vi.fn().mockResolvedValue([]);
    doc.fonts = { load };
    warmDisplayFont();
    warmDisplayFont();
    vi.runAllTimers();
    warmDisplayFont();
    vi.runAllTimers();
    expect(load).toHaveBeenCalledTimes(1);
  });
});

describe('index.html font preloads', () => {
  it('preloads DM Sans and JetBrains Mono only, not Space Grotesk', () => {
    const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');
    const links = html.match(/<link[^>]*rel="preload"[^>]*as="font"[^>]*>/g) ?? [];
    expect(links).toHaveLength(2);
    expect(links[0]).toContain('dm-sans');
    expect(links[1]).toContain('jetbrains-mono');
    expect(html).not.toMatch(/preload[^>]*space-grotesk/);
  });
});
