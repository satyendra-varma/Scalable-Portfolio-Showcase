import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { hero } from '@/content/room';
import ExplodedScene from '../exploded/Scene';
import { layers } from './layers';
import { MotionRoom } from './MotionRoom';
import { MotionStage } from './MotionStage';
import { MotionSwitcher } from './MotionSwitcher';
import { ACCENT, DEFAULT_MOTION, MOTIONS, motionHref, parseMotion, parseSpeed } from './options';

const SHAPES = 'polygon, polyline, path, rect, circle, ellipse, text, stop';
/** The hybrid renames Exploded's xd- classes and ids to rm-; undo that so the two drawings can be compared. */
const normal = (value: string) => value.replace(/\brm-/g, 'xd-');

/** Every drawn element in document (paint) order: its tag, attributes, text, and the transforms of its groups. */
function drawn(root: Element) {
  return [...root.querySelectorAll(SHAPES)].map((el) => {
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

describe('the hybrid room', () => {
  it('draws exactly what Exploded draws, element for element and in the same paint order', () => {
    const exploded = render(<ExplodedScene onOpen={() => {}} />);
    const original = drawn(exploded.container.querySelector('.xd-svg')!);
    exploded.unmount();

    const hybrid = render(<MotionStage onOpen={() => {}} />);
    const stage = hybrid.container.querySelector('.rm-stage')!;
    // Exploded keeps its gradients and patterns at the top of its one svg; the hybrid renders them once, first.
    const split = [...drawn(stage.querySelector('.rm-defs')!), ...drawn(stage.querySelector('.rm-canvas')!)];

    expect(original.length).toBeGreaterThan(150);
    expect(split).toEqual(original);
  });

  it('is cut into thirteen layers, back to front, each object on a layer of its own', () => {
    const { container } = render(<MotionStage onOpen={() => {}} />);
    const svgs = [...container.querySelectorAll<SVGElement>('.rm-canvas > svg.rm-layer')];
    expect(svgs.map((s) => s.dataset.layer)).toEqual(
      ['light', 'floor', 'traces', 'shadows', 'guides', 'wall', 'shelf', 'frame', 'cabinet', 'mailbox', 'desk', 'monitor', 'packets'],
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
    for (const { id } of MOTIONS) {
      rerender(<MotionRoom motion={id} />);
      expect(screen.getByTestId('room-motion')).toHaveAttribute('data-motion', id);
    }
  });
});

describe('the options', () => {
  it('offers A, B, C and Off, in Kapton amber only', () => {
    expect(MOTIONS.map((m) => m.code)).toEqual(['A', 'B', 'C', 'Off']);
    expect([ACCENT.name, ACCENT.hex]).toEqual(['Kapton amber', '#FFB547']);
  });

  it('reads the motion from the address and falls back to the default', () => {
    expect(parseMotion('')).toBe(DEFAULT_MOTION);
    expect(parseMotion('?motion=b')).toBe('b');
    expect(parseMotion('motion=c&header=own&accent=copper')).toBe('c'); // options that no longer exist are ignored
    expect(parseMotion('?motion=spin')).toBe(DEFAULT_MOTION);
  });

  it('builds a link to each motion and leaves the default out', () => {
    expect(motionHref(DEFAULT_MOTION)).toBe('/room-motion');
    expect(motionHref('b')).toBe('/room-motion?motion=b');
    for (const { id } of MOTIONS) expect(parseMotion(motionHref(id).split('?')[1] ?? '')).toBe(id);
  });

  it('reads the opening speed and adds it to the link only for Motion B and only when not the default', () => {
    expect(parseSpeed('')).toBe('6');
    expect(parseSpeed('?motion=b&speed=4')).toBe('4');
    expect(parseSpeed('?speed=9')).toBe('6');
    expect(motionHref('b', '8')).toBe('/room-motion?motion=b&speed=8');
    expect(motionHref('b', '6')).toBe('/room-motion?motion=b');
    expect(motionHref('a', '8')).toBe('/room-motion?motion=a');
  });
});

describe('the switcher', () => {
  const show = (reducedMotion: boolean, collapsed = false) =>
    render(<MotionSwitcher shownMotion={reducedMotion ? 'off' : 'b'} reducedMotion={reducedMotion} collapsed={collapsed} onToggle={() => {}} />);

  it('marks the current motion and links to every other one, and offers nothing else', () => {
    show(false);
    expect(screen.getByTestId('link-motion-b')).toHaveAttribute('aria-current', 'true');
    expect(screen.getByTestId('link-motion-off')).toHaveAttribute('href', '/room-motion');
    expect(screen.getByTestId('link-motion-a')).toHaveAttribute('href', '/room-motion?motion=a');
    expect(screen.getByTestId('button-switcher-toggle')).toHaveTextContent('B · Power-on');
    expect(screen.queryByTestId('note-reduced-motion')).toBeNull();
    const switcher = screen.getByTestId('motion-switcher');
    expect(switcher.querySelectorAll('[data-testid^="link-motion-"]')).toHaveLength(4);
    // Motion B also offers its opening speeds and Replay, and nothing else
    expect(switcher.querySelectorAll('[data-testid^="link-speed-"]')).toHaveLength(3);
    expect(screen.getByTestId('link-speed-6')).toHaveAttribute('aria-current', 'true');
    expect(screen.getByTestId('link-speed-4')).toHaveAttribute('href', '/room-motion?motion=b&speed=4');
    expect(screen.getByTestId('link-speed-8')).toHaveAttribute('href', '/room-motion?motion=b&speed=8');
    expect(screen.getByTestId('button-replay')).toBeInTheDocument();
    expect(switcher.querySelectorAll('[data-testid^="link-"]')).toHaveLength(7);
    expect(switcher).not.toHaveTextContent(/Copper|header/i);
  });

  it('shows the speed row and Replay only when Motion B is shown', () => {
    for (const motion of ['a', 'c', 'off'] as const) {
      const { unmount } = render(<MotionSwitcher shownMotion={motion} reducedMotion={false} collapsed={false} onToggle={() => {}} />);
      expect(screen.queryByTestId('speed-row')).toBeNull();
      expect(screen.queryByTestId('link-speed-4')).toBeNull();
      expect(screen.queryByTestId('button-replay')).toBeNull();
      expect(screen.getByTestId('motion-switcher').querySelectorAll('[data-testid^="link-"]')).toHaveLength(4);
      unmount();
    }
  });

  it('with reduced motion shows Off, says why, and offers no motion to switch to', () => {
    show(true);
    expect(screen.getByTestId('link-motion-off')).toHaveAttribute('aria-current', 'true');
    for (const id of ['a', 'b', 'c']) {
      const item = screen.getByTestId(`link-motion-${id}`);
      expect(item).toHaveAttribute('aria-disabled', 'true');
      expect(item).not.toHaveAttribute('href');
    }
    expect(screen.getByTestId('note-reduced-motion')).toHaveTextContent('reduced motion');
    expect(screen.getByTestId('button-switcher-toggle')).toHaveTextContent('Off · Still');
  });

  it('collapses to one bar', () => {
    show(false, true);
    expect(screen.getByTestId('button-switcher-toggle')).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByTestId('link-motion-a')).not.toBeVisible();
  });
});

describe('the still state', () => {
  const css = (name: string) => readFileSync(resolve(__dirname, name), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');

  it('has no animation anywhere yet, and Off switches every animation and transition off', () => {
    for (const file of ['room.css', 'header.css', 'switcher.css']) {
      expect(css(file), file).not.toMatch(/@keyframes/);
      expect(css(file).replace(/(animation|transition): none !important/g, ''), file).not.toMatch(/\b(animation|transition)[\w-]*\s*:/);
    }
    expect(css('room.css')).toMatch(/\.rv\.rm\[data-motion='off'\] \*[^{]*\{ animation: none !important; transition: none !important; \}/);
  });

  it('keeps every rule inside the hybrid, so no other room can change', () => {
    for (const [file, prefix] of [['room.css', /^(\.rm |\.rv\.rm)/], ['header.css', /^\.rm \.rmh\b/], ['switcher.css', /^\.rms-/]] as const) {
      const body = css(file).replace(/@media[^{]*\{/g, '').replace(/\{[^{}]*\}/g, '\n');
      // Split on new lines and on the commas between selectors, not the commas inside :is(...).
      const selectors = body.split(/\n|,(?![^()]*\))/).map((s) => s.trim()).filter((s) => s && s !== '}');
      expect(selectors.length, file).toBeGreaterThan(5);
      expect(selectors.filter((s) => !prefix.test(s)), file).toEqual([]);
    }
  });
});
