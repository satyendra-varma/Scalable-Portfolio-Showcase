import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import App from './App';

const proto = Element.prototype as unknown as Record<string, unknown>;
const robots = () => document.head.querySelector('meta[name="robots"]')?.getAttribute('content') ?? '';

// jsdom has neither getAnimations nor animate; without them the room goes straight to 'on'.
beforeEach(() => {
  proto.getAnimations = () => [];
  proto.animate = () => ({ cancel: () => {} });
  window.sessionStorage.clear();
  document.head.innerHTML = '<meta name="robots" content="index, follow">';
});
afterEach(() => {
  delete proto.getAnimations;
  delete proto.animate;
  window.sessionStorage.clear();
  document.head.innerHTML = '';
  window.history.pushState({}, '', '/');
});

const visit = (path: string) => {
  window.history.pushState({}, '', path);
  return render(<App />);
};

describe('the routes', () => {
  it('/ is the Power-on room: no earlier room, no switcher, indexable', async () => {
    visit('/');
    expect(await screen.findByTestId('room-motion')).toBeInTheDocument();
    expect(screen.queryByTestId('page-room')).toBeNull();
    expect(screen.queryByTestId('motion-switcher')).toBeNull();
    expect(robots()).not.toContain('noindex');
  });

  it('/room-original is the earlier room, noindex', async () => {
    visit('/room-original');
    expect(await screen.findByTestId('page-room')).toBeInTheDocument();
    expect(robots()).toContain('noindex');
  });

  it('/room-concepts is the comparison page, noindex', async () => {
    visit('/room-concepts');
    expect(await screen.findByTestId('variant-dock')).toBeInTheDocument();
    expect(robots()).toContain('noindex');
  });

  it.each(['/room-motion', '/room-motion?motion=off'])('%s lands on / with no query, showing Power-on', async (path) => {
    visit(path);
    const room = await screen.findByTestId('room-motion');
    expect(room).toHaveAttribute('data-motion', 'b');
    await waitFor(() => expect(window.location.pathname).toBe('/'));
    expect(window.location.search).toBe('');
  });

  it('an unknown path is the 404 page, noindex, and its link goes home, indexable again', async () => {
    visit('/no-such-page');
    expect(await screen.findByTestId('page-not-found')).toBeInTheDocument();
    expect(robots()).toContain('noindex');
    fireEvent.click(screen.getByTestId('link-404-home'));
    expect(await screen.findByTestId('room-motion')).toBeInTheDocument();
    expect(window.location.pathname).toBe('/');
    await act(async () => {});
    expect(robots()).not.toContain('noindex');
    expect(robots()).toBe('index, follow');
  });
});
