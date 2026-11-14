import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { warmDisplayFont } from '@/lib/fonts';
import { MotionRoom } from './MotionRoom';

vi.mock('@/lib/fonts', () => ({ warmDisplayFont: vi.fn() }));

const proto = Element.prototype as unknown as Record<string, unknown>;
const fakeAnimation = () => ({
  effect: { getComputedTiming: () => ({ iterations: 1 }) },
  finish: vi.fn(),
  finished: new Promise<void>(() => {}),
});
const room = () => screen.getByTestId('room-motion');
const tick = (ms: number) => act(() => { vi.advanceTimersByTime(ms); });

beforeEach(() => {
  window.sessionStorage.clear();
  vi.mocked(warmDisplayFont).mockClear();
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'requestAnimationFrame', 'cancelAnimationFrame'] });
});
afterEach(() => {
  vi.useRealTimers();
  delete proto.getAnimations;
  delete proto.animate;
  window.sessionStorage.clear();
});

describe('the heading font', () => {
  it('is not fetched while the opening runs, and is once the opening is skipped', () => {
    proto.getAnimations = () => [fakeAnimation()];
    proto.animate = () => ({ cancel: vi.fn() });
    render(<MotionRoom motion="b" />);
    expect(room()).toHaveAttribute('data-b', 'dark');
    expect(warmDisplayFont).not.toHaveBeenCalled();
    tick(1350);
    expect(room()).toHaveAttribute('data-b', 'opening');
    expect(warmDisplayFont).not.toHaveBeenCalled();
    fireEvent.pointerDown(document.body);
    expect(room()).toHaveAttribute('data-b', 'on');
    expect(warmDisplayFont).toHaveBeenCalledTimes(1);
  });

  it('is fetched on mount in the still room', () => {
    render(<MotionRoom motion="off" />);
    expect(warmDisplayFont).toHaveBeenCalledTimes(1);
  });
});
