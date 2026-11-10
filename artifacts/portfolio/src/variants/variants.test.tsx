import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { variants } from './registry';
import { scenes } from './scenes';
import { VariantRoom } from './VariantRoom';

const channel = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const luminance = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => channel(parseInt(hex.slice(i, i + 2), 16) / 255));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

/** Solid-colour tokens declared on the variant's root rule. */
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
  ['accent-ink', 'accent'], ['evidence', 'bg'], ['evidence', 'surface'], ['bg', 'ink'],
];

// The only words a drawing may contain: strings the original scene already uses.
const ALLOWED_DRAWING_TEXT = ['ROOM_01 / 4.20 m', '> dotnet run', '// scale 1:40'];
const HOTSPOTS = ['explorer', 'skills', 'projects', 'experience', 'contact'];

describe('room variants', () => {
  it('are four genuinely different pairs of accent and idle style', () => {
    expect(variants).toHaveLength(4);
    for (const key of ['id', 'name', 'accentHex', 'idleStyle', 'drawing'] as const) {
      expect(new Set(variants.map((v) => v[key])).size).toBe(4);
    }
    expect(variants.map((v) => v.number)).toEqual([1, 2, 3, 4]);
    for (const v of variants) expect(v.accentHex).toMatch(/^#[0-9A-F]{6}$/);
  });

  for (const v of variants) {
    describe(v.name, () => {
      const t = tokens(v.id);

      it('declares the registry accent as its --accent token', () => {
        expect(t.accent).toBe(v.accentHex);
      });

      it('keeps every text token pair at WCAG AA (4.5:1) or better', () => {
        const failing = TEXT_PAIRS
          .map(([fg, bg]) => ({ pair: `${fg}/${bg}`, ratio: contrast(t[fg], t[bg]) }))
          .filter((p) => !(p.ratio >= 4.5));
        expect(failing).toEqual([]);
      });

      it('adds no words in its drawing', () => {
        const source = readFileSync(resolve(__dirname, v.id, 'Scene.tsx'), 'utf8');
        const words = [...source.matchAll(/<(?:text|tspan|title|desc)\b[^>]*>([\s\S]*?)<\/(?:text|tspan|title|desc)>/g)]
          .map((m) => m[1].replace(/\{\s*['"`]|['"`]\s*\}/g, '').replace(/&gt;/g, '>').replace(/&lt;/g, '<').trim())
          .filter(Boolean);
        for (const w of words) expect(ALLOWED_DRAWING_TEXT).toContain(w);
      });

      it('renders the hero before the scene, with five labelled hotspot buttons and a focal monitor', () => {
        render(<VariantRoom variant={v} Scene={scenes[v.id]} />);
        const hero = screen.getByTestId('variant-hero');
        const scene = screen.getByTestId('variant-scene');
        expect(hero.compareDocumentPosition(scene) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
        for (const id of HOTSPOTS) {
          const button = screen.getByTestId(`hotspot-${id}`);
          expect(button.tagName).toBe('BUTTON');
          expect(button.textContent?.trim()).not.toBe('');
        }
        expect(screen.getByTestId('hotspot-explorer')).toHaveClass('is-focal');
        expect(screen.getByTestId('hotspot-explorer')).toHaveTextContent('System Explorer');
      });
    });
  }
});
