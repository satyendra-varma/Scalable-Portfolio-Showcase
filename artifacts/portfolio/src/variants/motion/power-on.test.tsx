import { act, fireEvent, render, screen } from '@testing-library/react';
import { Router } from 'wouter';
import { memoryLocation } from 'wouter/memory-location';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import RoomMotionPage from '@/pages/room-motion';
import { MotionRoom } from './MotionRoom';
import { MOBILE_QUERY, markOpeningSeen, openingSeen } from './opening';

const KEY = 'rm-power-on-seen';
const proto = Element.prototype as unknown as Record<string, unknown>;

type FakeAnimation = { effect: { getComputedTiming: () => { iterations: number } }; finish: ReturnType<typeof vi.fn>; finished: Promise<void> };
/** A finite animation that never ends by itself: only a skip finishes it. */
const fakeAnimation = (): FakeAnimation => ({
  effect: { getComputedTiming: () => ({ iterations: 1 }) },
  finish: vi.fn(),
  finished: new Promise<void>(() => {}),
});

/** jsdom has neither getAnimations nor animate; without them the hook goes straight to 'on'. */
function stubAnimations(running: FakeAnimation[] = []) {
  proto.getAnimations = () => running;
  const started: { target: Element; cancel: ReturnType<typeof vi.fn> }[] = [];
  proto.animate = function (this: Element) {
    const animation = { target: this, cancel: vi.fn() };
    started.push(animation);
    return animation;
  };
  return started;
}

const stubMedia = (matches: (query: string) => boolean) =>
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: vi.fn((media: string) => ({ matches: matches(media), media, addEventListener: () => {}, removeEventListener: () => {} })),
  });

const room = () => screen.getByTestId('room-motion');
const linework = () => screen.queryByTestId('room-linework');
const tick = (ms: number) => act(() => { vi.advanceTimersByTime(ms); });

beforeEach(() => {
  window.sessionStorage.clear();
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'requestAnimationFrame', 'cancelAnimationFrame'] });
});
afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  delete proto.getAnimations;
  delete proto.animate;
  Reflect.deleteProperty(window, 'matchMedia');
  window.sessionStorage.clear();
});

describe('the first visit, on a desktop', () => {
  it('waits dark with the linework, then passes through opening to on, and marks the session seen', () => {
    stubAnimations();
    render(<MotionRoom motion="b" />);
    expect(room()).toHaveAttribute('data-opening', 'full');
    expect(room()).toHaveAttribute('data-b', 'dark');
    expect(room()).not.toHaveAttribute('data-lite');
    expect(linework()).toBeInTheDocument();
    expect(openingSeen()).toBe(false);

    tick(1349);
    expect(room()).toHaveAttribute('data-b', 'dark');
    tick(1);
    expect(room()).toHaveAttribute('data-b', 'opening');
    expect(linework()).toBeInTheDocument();
    expect(openingSeen()).toBe(false);

    tick(20);
    expect(room()).toHaveAttribute('data-b', 'on');
    expect(room()).not.toHaveAttribute('data-lite');
    expect(linework()).toBeNull();
    expect(window.sessionStorage.getItem(KEY)).toBe('1');
  });

  it('gives up on an animation that never ends after 14 seconds', () => {
    stubAnimations([fakeAnimation()]);
    render(<MotionRoom motion="b" />);
    tick(1350);
    expect(room()).toHaveAttribute('data-b', 'opening');
    tick(13999);
    expect(room()).toHaveAttribute('data-b', 'opening');
    tick(1);
    expect(room()).toHaveAttribute('data-b', 'on');
  });

  it('goes straight to on, and marks the session, where the browser cannot run animations', () => {
    render(<MotionRoom motion="b" />);
    expect(room()).toHaveAttribute('data-b', 'on');
    expect(openingSeen()).toBe(true);
  });
});

describe('a return visit in the same session', () => {
  it('is the full opening at a quicker pace: data-b and the linework, power leaving after 250 ms, then on', () => {
    stubAnimations();
    markOpeningSeen();
    render(<MotionRoom motion="b" />);
    expect(room()).toHaveAttribute('data-opening', 'return');
    expect(room()).toHaveAttribute('data-b', 'dark');
    expect(room()).not.toHaveAttribute('data-lite');
    expect(linework()).toBeInTheDocument();

    tick(249);
    expect(room()).toHaveAttribute('data-b', 'dark');
    tick(1);
    expect(room()).toHaveAttribute('data-b', 'opening');
    expect(room()).not.toHaveAttribute('data-lite');
    expect(linework()).toBeInTheDocument();

    tick(20);
    expect(room()).toHaveAttribute('data-b', 'on');
    expect(room()).not.toHaveAttribute('data-lite');
    expect(linework()).toBeNull();
  });

  it('gives up on an animation that never ends after 9 seconds', () => {
    stubAnimations([fakeAnimation()]);
    markOpeningSeen();
    render(<MotionRoom motion="b" />);
    tick(250);
    expect(room()).toHaveAttribute('data-b', 'opening');
    tick(8999);
    expect(room()).toHaveAttribute('data-b', 'opening');
    tick(1);
    expect(room()).toHaveAttribute('data-b', 'on');
  });
});

describe('a first visit on a phone or touch screen', () => {
  it('plays the mobile opening: data-lite, no linework, power may leave after 600 ms', () => {
    stubAnimations();
    stubMedia((query) => query === MOBILE_QUERY);
    render(<MotionRoom motion="b" />);
    expect(room()).toHaveAttribute('data-opening', 'mobile');
    expect(room()).toHaveAttribute('data-lite', 'dark');
    expect(room()).not.toHaveAttribute('data-b');
    expect(linework()).toBeNull();

    tick(599);
    expect(room()).toHaveAttribute('data-lite', 'dark');
    tick(1);
    expect(room()).toHaveAttribute('data-lite', 'opening');
    tick(20);
    expect(room()).toHaveAttribute('data-b', 'on');
    expect(room()).not.toHaveAttribute('data-lite');
  });

  it('plays the mobile opening on a later visit too, never the return one', () => {
    stubAnimations();
    stubMedia((query) => query === MOBILE_QUERY);
    markOpeningSeen();
    render(<MotionRoom motion="b" />);
    expect(room()).toHaveAttribute('data-opening', 'mobile');
    expect(room()).toHaveAttribute('data-lite', 'dark');
    expect(room()).not.toHaveAttribute('data-b');
    expect(linework()).toBeNull();
  });
});

describe('with motion off', () => {
  it('carries no opening attributes and draws no linework', () => {
    stubAnimations();
    render(<MotionRoom motion="off" />);
    expect(room()).toHaveAttribute('data-motion', 'off');
    for (const name of ['data-opening', 'data-b', 'data-lite']) expect(room()).not.toHaveAttribute(name);
    expect(linework()).toBeNull();
    tick(20000);
    expect(openingSeen()).toBe(false);
  });
});

describe('skipping the opening', () => {
  it('finishes every running animation on any key, and the room is on', () => {
    const running = [fakeAnimation(), fakeAnimation()];
    stubAnimations(running);
    render(<MotionRoom motion="b" />);
    tick(1350);
    expect(room()).toHaveAttribute('data-b', 'opening');
    fireEvent.keyDown(document.body, { key: 'a' });
    for (const animation of running) expect(animation.finish).toHaveBeenCalled();
    expect(room()).toHaveAttribute('data-b', 'on');
    expect(openingSeen()).toBe(true);
  });

  it('does not skip on a bare modifier key', () => {
    const running = [fakeAnimation()];
    stubAnimations(running);
    render(<MotionRoom motion="b" />);
    tick(1350);
    for (const key of ['Shift', 'Control', 'Alt', 'Meta']) fireEvent.keyDown(document.body, { key });
    expect(running[0].finish).not.toHaveBeenCalled();
    expect(room()).toHaveAttribute('data-b', 'opening');
  });

  it('finishes every running animation on a pointerdown, and the room is on', () => {
    const running = [fakeAnimation()];
    stubAnimations(running);
    render(<MotionRoom motion="b" />);
    tick(1350);
    fireEvent.pointerDown(document.body);
    expect(running[0].finish).toHaveBeenCalled();
    expect(room()).toHaveAttribute('data-b', 'on');
  });

  it('while dark, ignores a key and a pointerdown outside the room, and a pointerdown on the stage powers it at once', () => {
    stubAnimations();
    render(<MotionRoom motion="b" />);
    fireEvent.keyDown(document.body, { key: 'a' });
    fireEvent.pointerDown(document.body);
    fireEvent.pointerDown(screen.getByTestId('text-name'));
    expect(room()).toHaveAttribute('data-b', 'dark');

    fireEvent.pointerDown(screen.getByTestId('motion-stage'));
    expect(room()).toHaveAttribute('data-b', 'on');
    expect(openingSeen()).toBe(true);
  });
});

describe('a tap in place of hover', () => {
  it('puts the open panel on the root as data-open and takes it off on close', () => {
    render(<MotionRoom motion="off" />);
    expect(room()).not.toHaveAttribute('data-open');
    fireEvent.click(screen.getByTestId('hotspot-skills'));
    expect(room()).toHaveAttribute('data-open', 'skills');
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(room()).not.toHaveAttribute('data-open');
    fireEvent.click(screen.getByTestId('hotspot-contact'));
    expect(room()).toHaveAttribute('data-open', 'contact');
  });

  it('lets a tap pulse finish by itself, and cancels it when a mouse leaves', () => {
    const started = stubAnimations();
    render(<MotionRoom motion="b" />);
    tick(1350);
    tick(20);
    expect(room()).toHaveAttribute('data-b', 'on');
    const button = screen.getByTestId('hotspot-skills');
    const pulse = () => started.filter((a) => a.target.classList.contains('rm-pulse') && a.target.closest('[data-flow="skills"]')).at(-1)!;
    const pointer = (type: string, pointerType: string) => {
      const event = new Event(type, { bubbles: true });
      Object.defineProperty(event, 'pointerType', { value: pointerType });
      act(() => { button.dispatchEvent(event); });
    };

    pointer('pointerover', 'touch');
    const tapped = pulse();
    expect(tapped.cancel).not.toHaveBeenCalled();
    pointer('pointerout', 'touch');
    expect(tapped.cancel).not.toHaveBeenCalled();

    pointer('pointerover', 'mouse');
    const hovered = pulse();
    expect(hovered).not.toBe(tapped);
    pointer('pointerout', 'mouse');
    expect(hovered.cancel).toHaveBeenCalledTimes(1);
  });
});

describe('the page', () => {
  const renderPage = (path: string) => {
    const { hook, searchHook } = memoryLocation({ path });
    return render(<Router hook={hook} searchHook={searchHook}><RoomMotionPage /></Router>);
  };

  it('shows Power-on at /room-motion and Off at ?motion=off', () => {
    stubAnimations();
    renderPage('/room-motion');
    expect(room()).toHaveAttribute('data-motion', 'b');
    expect(screen.getByTestId('button-replay')).toBeInTheDocument();
  });

  it('shows Off, with no Replay, at ?motion=off', () => {
    stubAnimations();
    renderPage('/room-motion?motion=off');
    expect(room()).toHaveAttribute('data-motion', 'off');
    expect(screen.queryByTestId('button-replay')).toBeNull();
  });

  it('says the room is "powering on" in its description', () => {
    stubAnimations();
    renderPage('/room-motion');
    expect(document.head.querySelector('meta[name="description"]')).toHaveAttribute('content', expect.stringContaining('powering on'));
  });

  it('plays the quicker full opening on a return, and Replay brings the first-visit opening back', () => {
    stubAnimations([fakeAnimation()]);
    markOpeningSeen();
    renderPage('/room-motion');
    expect(room()).toHaveAttribute('data-opening', 'return');

    fireEvent.click(screen.getByTestId('button-replay'));
    expect(room()).toHaveAttribute('data-opening', 'full');
    expect(room()).toHaveAttribute('data-b', 'dark');
    expect(linework()).toBeInTheDocument();
    expect(window.sessionStorage.getItem(KEY)).toBeNull();
  });

  it('with reduced motion shows Off with its note, and every hotspot still opens its panel and Escape hands focus back', () => {
    stubAnimations();
    stubMedia((query) => query.includes('prefers-reduced-motion'));
    renderPage('/room-motion');
    expect(room()).toHaveAttribute('data-motion', 'off');
    for (const name of ['data-opening', 'data-b', 'data-lite']) expect(room()).not.toHaveAttribute(name);
    expect(screen.getByTestId('note-reduced-motion')).toBeInTheDocument();
    for (const id of ['explorer', 'skills', 'projects', 'experience', 'contact']) {
      const button = screen.getByTestId(`hotspot-${id}`);
      fireEvent.click(button);
      expect(screen.getByTestId(`panel-${id}`)).toBeInTheDocument();
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(screen.queryByTestId(`panel-${id}`)).toBeNull();
      expect(button).toHaveFocus();
    }
  });
});
