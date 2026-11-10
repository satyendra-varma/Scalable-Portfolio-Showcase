import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DRAWING_TEXT } from './drawingText';
import { AMBER, variants } from './registry';
import { scenes } from './scenes';
import { VariantRoom } from './VariantRoom';

const channel = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const rgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
const luminance = (hex: string) => {
  const [r, g, b] = rgb(hex).map(channel);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
/** Hue in degrees and HSL saturation. */
const hueSat = (hex: string) => {
  const [r, g, b] = rgb(hex);
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min, l = (max + min) / 2;
  if (d === 0) return { h: 0, s: 0 };
  const h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return { h: (h * 60 + 360) % 360, s: d / (1 - Math.abs(2 * l - 1)) };
};
/** Purple, violet and magenta: hues 245-335 degrees, when the colour has visible saturation. */
const isPurple = (hex: string, minSat = 0.15) => { const { h, s } = hueSat(hex); return s > minSat && h >= 245 && h <= 335; };
const hueGap = (a: string, b: string) => { const d = Math.abs(hueSat(a).h - hueSat(b).h) % 360; return Math.min(d, 360 - d); };

/** Solid-colour tokens declared on the concept's root rule (its ground; accents come from the registry). */
const tokens = (id: string) => {
  const css = readFileSync(resolve(__dirname, id, `${id}.css`), 'utf8');
  const root = css.match(new RegExp(`\\.rv\\[data-variant='${id}'\\]\\s*\\{([^}]*)\\}`))?.[1] ?? '';
  return Object.fromEntries([...root.matchAll(/--([\w-]+)\s*:\s*(#[0-9a-fA-F]{6})\b(?![0-9a-fA-F])/g)].map((m) => [m[1], m[2].toUpperCase()]));
};

// Text colour on background colour, as the room uses them.
const TEXT_PAIRS: [string, string][] = [
  ['ink', 'bg'], ['ink', 'surface'], ['ink', 'chip'], ['ink', 'hot'],
  ['muted', 'bg'], ['muted', 'surface'], ['muted', 'chip'], ['muted', 'hot'],
  ['accent', 'bg'], ['accent', 'surface'], ['accent', 'chip'], ['accent', 'hot'],
  ['accent-ink', 'accent'], ['evidence', 'bg'], ['evidence', 'surface'], ['evidence', 'chip'], ['bg', 'ink'],
];
const HOTSPOTS = ['explorer', 'skills', 'projects', 'experience', 'contact'];
const HEX = /^#[0-9A-F]{6}$/;

/** Leaf text in the drawing and hero decoration: each must be a whole allowed string. */
const drawingWords = (container: HTMLElement) => {
  const leaves = [
    ...container.querySelectorAll('[data-testid="variant-scene"] svg text, [data-testid="variant-scene"] svg tspan'),
    ...container.querySelectorAll('[data-testid="hero-decor"] *'),
  ].filter((el) => el.children.length === 0);
  return leaves.map((el) => el.textContent?.trim() ?? '').filter(Boolean);
};

describe('room concepts', () => {
  it('are three genuinely different concepts, with Plan removed', () => {
    expect(variants).toHaveLength(3);
    for (const key of ['id', 'name', 'idleStyle', 'drawing'] as const) {
      expect(new Set(variants.map((v) => v[key])).size).toBe(3);
    }
    expect(variants.map((v) => v.number)).toEqual([1, 2, 4]);
    expect(variants.map((v) => v.id)).not.toContain('plan');
  });

  for (const v of variants) {
    describe(v.name, () => {
      const ground = tokens(v.id);

      it('offers at least three distinct accent options, amber #FFB547 among them', () => {
        expect(v.accents.length).toBeGreaterThanOrEqual(3);
        expect(v.accents.some((a) => a.hex === AMBER)).toBe(true);
        expect(new Set(v.accents.map((a) => a.id)).size).toBe(v.accents.length);
        expect(new Set(v.accents.map((a) => a.hex)).size).toBe(v.accents.length);
        for (const a of v.accents) for (const c of [a.hex, a.ink, a.support]) expect(c).toMatch(HEX);
      });

      it('uses each accent with restraint: one main accent plus one supporting tone of the same hue', () => {
        for (const a of v.accents) expect(hueGap(a.hex, a.support), `${a.name} support`).toBeLessThanOrEqual(20);
        // Accents come only from the registry, never from the concept's stylesheet.
        for (const k of ['accent', 'accent-ink', 'evidence']) expect(Object.keys(ground)).not.toContain(k);
      });

      it('has no purple or violet in its accents or its ground', () => {
        for (const a of v.accents) for (const c of [a.hex, a.support]) expect(isPurple(c), `${a.name} ${c}`).toBe(false);
        for (const k of ['bg', 'surface', 'chip', 'hot', 'line', 'ink', 'muted']) expect(isPurple(ground[k], 0.12), `--${k} ${ground[k]}`).toBe(false);
      });

      for (const a of v.accents) {
        it(`keeps every text pair at WCAG AA (4.5:1) or better with ${a.name}`, () => {
          const t: Record<string, string> = { ...ground, accent: a.hex, 'accent-ink': a.ink, evidence: a.support };
          const failing = TEXT_PAIRS
            .map(([fg, bg]) => ({ pair: `${fg}/${bg}`, ratio: contrast(t[fg], t[bg]) }))
            .filter((p) => !(p.ratio >= 4.5));
          expect(failing).toEqual([]);
        });
      }

      it('applies the chosen accent to the room, and switching it recolours the room', () => {
        const { container, rerender } = render(<VariantRoom variant={v} accent={v.accents[0]} {...scenes[v.id]} />);
        const root = container.querySelector<HTMLElement>(`[data-variant="${v.id}"]`)!;
        for (const a of v.accents) {
          rerender(<VariantRoom variant={v} accent={a} {...scenes[v.id]} />);
          expect(root.dataset.accent).toBe(a.id);
          expect(root.style.getPropertyValue('--accent')).toBe(a.hex);
          expect(root.style.getPropertyValue('--accent-ink')).toBe(a.ink);
          expect(root.style.getPropertyValue('--evidence')).toBe(a.support);
        }
      });

      it('shows only allowed words in its drawing: decorative strings and content from room.ts', () => {
        const { container } = render(<VariantRoom variant={v} accent={v.accents[0]} {...scenes[v.id]} />);
        for (const w of drawingWords(container)) expect(DRAWING_TEXT.has(w), `"${w}"`).toBe(true);
        expect(container.querySelectorAll('[data-testid="variant-scene"] svg title, [data-testid="variant-scene"] svg desc')).toHaveLength(0);
      });

      it('renders the hero before the scene, with five labelled hotspot buttons and a focal monitor', () => {
        render(<VariantRoom variant={v} accent={v.accents[0]} {...scenes[v.id]} />);
        const hero = screen.getByTestId('variant-hero');
        const scene = screen.getByTestId('variant-scene');
        expect(hero.compareDocumentPosition(scene) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
        for (const id of HOTSPOTS) {
          const button = screen.getByTestId(`hotspot-${id}`);
          expect(button.tagName).toBe('BUTTON');
          expect(button.dataset.hotspot).toBe(id);
          expect(button.textContent?.trim()).not.toBe('');
        }
        expect(screen.getByTestId('hotspot-explorer')).toHaveClass('is-focal');
        expect(screen.getByTestId('hotspot-explorer')).toHaveTextContent('System Explorer');
        const decor = screen.queryByTestId('hero-decor');
        if (decor) {
          expect(decor).toHaveAttribute('aria-hidden', 'true');
          expect(decor.querySelector('a, button, input, [tabindex]')).toBeNull();
        }
      });

      it('returns focus to the desk monitor as soon as the System Explorer closes', () => {
        const { container } = render(<VariantRoom variant={v} accent={v.accents[0]} {...scenes[v.id]} />);
        const monitor = screen.getByTestId('hotspot-explorer');
        fireEvent.click(monitor);
        expect(screen.getByTestId('panel-explorer')).toBeInTheDocument();
        // The explorer entrance can grow from the monitor: its centre is recorded on the root.
        const root = container.querySelector<HTMLElement>(`[data-variant="${v.id}"]`)!;
        expect(root.style.getPropertyValue('--open-x')).toMatch(/^-?\d+px$/);
        expect(root.style.getPropertyValue('--open-y')).toMatch(/^-?\d+px$/);
        fireEvent.keyDown(document, { key: 'Escape' });
        expect(screen.queryByTestId('panel-explorer')).toBeNull();
        expect(monitor).toHaveFocus();
      });
    });
  }
});
