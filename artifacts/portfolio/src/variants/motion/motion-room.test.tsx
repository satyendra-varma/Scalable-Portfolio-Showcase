import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { hero } from '@/content/room';
import ExplodedScene from '../exploded/Scene';
import { layers } from './layers';
import { MotionRoom } from './MotionRoom';
import { MotionStage } from './MotionStage';
import { ACCENT } from './options';

const SHAPES = 'polygon, polyline, path, rect, circle, ellipse, text, stop';
/** The hybrid renames Exploded's xd- classes and ids to rm-; undo that so the two drawings can be compared. */
const normal = (value: string) => value.replace(/\brm-/g, 'xd-');

/**
 * Every drawn element in document (paint) order: its tag, attributes, text, and the transforms of its groups.
 * Elements matching `leaveOut` (or inside one that does) are not listed.
 */
function drawn(root: Element, leaveOut: string) {
  return [...root.querySelectorAll(SHAPES)].filter((el) => !el.closest(leaveOut)).map((el) => {
    const attrs = [...el.attributes].map((a) => `${a.name}=${normal(a.value)}`).sort().join(' ');
    const transforms: string[] = [];
    for (let p = el.parentElement; p && p !== root; p = p.parentElement) {
      const t = p.getAttribute('transform');
      if (t) transforms.push(t);
    }
    const text = el.tagName === 'text' ? ` "${el.textContent}"` : '';
    return `<${el.tagName} ${attrs}>${text} in [${transforms.join(' | ')}]`;
  });
}

/**
 * What the hybrid adds to Exploded's drawing, by layer and by precise class: the wiring on the wall and its heads, the
 * glows behind the objects, the flows and the typing cover, and, on the floor, the lit traces, pads, rings and heads.
 */
const HYBRID_ONLY = [
  'svg[data-layer="wallwire"]', 'svg[data-layer="bloom"]', 'svg[data-layer="flows"]',
  '.rm-w', '.rm-heads', '.rm-pad', '.rm-pad-ring',
].join(', ');
/**
 * What Exploded draws that the hybrid replaces with that wiring: its three live traces (the dim decorative run
 * stays and is compared), its four pads, and its four travelling packets (now the flows, which are not drawn at rest).
 */
const EXPLODED_REPLACED = 'path.xd-trace:not(.xd-trace-dim), .xd-pad, .xd-pk';

describe('the hybrid room', () => {
  it('draws exactly what Exploded draws, element for element and in the same paint order', () => {
    const exploded = render(<ExplodedScene onOpen={() => {}} />);
    const original = drawn(exploded.container.querySelector('.xd-svg')!, EXPLODED_REPLACED);
    exploded.unmount();

    const hybrid = render(<MotionStage onOpen={() => {}} />);
    const stage = hybrid.container.querySelector('.rm-stage')!;
    // Exploded keeps its gradients and patterns at the top of its one svg; the hybrid renders them once, first.
    const split = [...drawn(stage.querySelector('.rm-defs')!, HYBRID_ONLY), ...drawn(stage.querySelector('.rm-canvas')!, HYBRID_ONLY)];

    expect(original.length).toBeGreaterThan(150);
    expect(split).toEqual(original);
    // the hybrid's own additions are really there, so the leave-out list is not hiding an empty set
    expect(stage.querySelectorAll('.rm-w-lit, .rm-pad, .rm-head-core, .rm-bloom, .rm-flow').length).toBeGreaterThan(20);
  });

  it('is cut into fifteen layers, back to front, each object on a layer of its own', () => {
    const { container } = render(<MotionStage onOpen={() => {}} />);
    const svgs = [...container.querySelectorAll<SVGElement>('.rm-canvas > svg.rm-layer')];
    expect(svgs.map((s) => s.dataset.layer)).toEqual(
      ['light', 'floor', 'traces', 'shadows', 'guides', 'wall', 'wallwire', 'bloom', 'shelf', 'frame', 'cabinet', 'mailbox', 'desk', 'monitor', 'flows'],
    );
    expect(layers.map((l) => l.id)).toEqual(svgs.map((s) => s.dataset.layer));
    expect(Object.fromEntries(svgs.filter((s) => s.dataset.object).map((s) => [s.dataset.layer, s.dataset.object]))).toEqual({
      shelf: 'skills', frame: 'projects', cabinet: 'experience', mailbox: 'contact', desk: 'explorer', monitor: 'explorer',
    });
    for (const svg of svgs) expect(svg.getAttribute('viewBox')).toBe('0 0 1200 800');
    expect(container.querySelector('.rm-canvas')).toHaveAttribute('aria-hidden', 'true');
  });

  it('keeps the five hotspots as labelled buttons that open their panels and hand focus back', () => {
    render(<MotionRoom motion="off" />);
    const buttons = within(screen.getByRole('list', { name: 'Room objects' })).getAllByRole('button');
    expect(buttons.map((b) => b.dataset.hotspot)).toEqual(['explorer', 'skills', 'projects', 'experience', 'contact']);
    for (const id of ['skills', 'projects', 'experience', 'contact', 'explorer']) {
      const button = screen.getByTestId(`hotspot-${id}`);
      fireEvent.click(button);
      expect(screen.getByTestId(`panel-${id}`)).toBeInTheDocument();
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(screen.queryByTestId(`panel-${id}`)).toBeNull();
      expect(button).toHaveFocus();
    }
  });

  it('shows the Amber LED header with its loading bar, in Kapton amber', () => {
    render(<MotionRoom motion="off" />);
    const root = screen.getByTestId('room-motion');
    expect(root.style.getPropertyValue('--accent')).toBe('#FFB547');
    expect(root.style.getPropertyValue('--rm-progress')).toBe('1'); // at rest the bar is full
    expect(root).not.toHaveAttribute('data-header');
    expect(root).not.toHaveAttribute('data-accent');
    expect(screen.getByTestId('header-bar')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByTestId('hero-decor')).toHaveTextContent('ROOM_01 / 4.20 m');
    for (const text of [hero.name, hero.role, hero.positioning]) expect(screen.getByTestId('variant-hero')).toHaveTextContent(text);
  });

  it('keeps the list view, with every section and no room', () => {
    render(<MotionRoom motion="off" />);
    fireEvent.click(screen.getByTestId('button-list-view'));
    expect(screen.queryByTestId('variant-scene')).toBeNull();
    expect(within(screen.getByTestId('list-sections')).getAllByRole('heading', { level: 2 }).map((h) => h.textContent))
      .toEqual(['System Explorer', 'Skills', 'Projects', 'Experience', 'Contact']);
  });

  it('carries the chosen motion on the root, for the concepts to style', () => {
    const { rerender } = render(<MotionRoom motion="off" />);
    for (const id of ['b', 'off'] as const) {
      rerender(<MotionRoom motion={id} />);
      expect(screen.getByTestId('room-motion')).toHaveAttribute('data-motion', id);
    }
  });
});

describe('the options', () => {
  it('has the one accent, Kapton amber', () => {
    expect([ACCENT.name, ACCENT.hex]).toEqual(['Kapton amber', '#FFB547']);
  });

  it('has no switcher left: its files are gone and nothing in src refers to it', () => {
    for (const name of ['MotionSwitcher.tsx', 'switcher.css']) expect(existsSync(resolve(__dirname, name)), name).toBe(false);
    const walk = (dir: string): string[] => readdirSync(dir).flatMap((name) => {
      const path = resolve(dir, name);
      return statSync(path).isDirectory() ? walk(path) : [path];
    });
    const files = walk(resolve(__dirname, '../..')).filter((f) => /\.(css|ts|tsx)$/.test(f) && !/\.test\.tsx?$/.test(f));
    expect(files.length).toBeGreaterThan(50);
    expect(files.filter((f) => /rms-|MotionSwitcher/.test(readFileSync(f, 'utf8')))).toEqual([]);
  });
});

describe('the still state', () => {
  const css = (name: string) => readFileSync(resolve(__dirname, name), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');

  it('has no animation anywhere yet, and Off switches every animation and transition off', () => {
    for (const file of ['room.css', 'header.css']) {
      expect(css(file), file).not.toMatch(/@keyframes/);
      expect(css(file).replace(/(animation|transition): none !important/g, ''), file).not.toMatch(/\b(animation|transition)[\w-]*\s*:/);
    }
    expect(css('room.css')).toMatch(/\.rv\.rm\[data-motion='off'\] \*[^{]*\{ animation: none !important; transition: none !important; \}/);
  });

  it('keeps every rule inside the hybrid, so no other room can change', () => {
    for (const [file, prefix] of [['room.css', /^(\.rm |\.rv\.rm)/], ['header.css', /^\.rm \.rmh\b/]] as const) {
      const body = css(file).replace(/@media[^{]*\{/g, '').replace(/\{[^{}]*\}/g, '\n');
      // Split on new lines and on the commas between selectors, not the commas inside :is(...).
      const selectors = body.split(/\n|,(?![^()]*\))/).map((s) => s.trim()).filter((s) => s && s !== '}');
      expect(selectors.length, file).toBeGreaterThan(5);
      expect(selectors.filter((s) => !prefix.test(s)), file).toEqual([]);
    }
  });
});
