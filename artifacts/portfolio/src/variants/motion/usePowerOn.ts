import { useEffect, useLayoutEffect, useState, type RefObject } from 'react';
import type { HotspotId } from '@/components/room/RoomScene';
import { routes } from './wiring';

/** 'opening': the first visit's full opening. 'quick': a return, power only. 'on': running. */
export type PowerPhase = 'opening' | 'quick' | 'on';

const SEEN = 'rm-b-seen';
const seen = () => { try { return sessionStorage.getItem(SEEN) === '1'; } catch { return false; } };
const remember = () => { try { sessionStorage.setItem(SEEN, '1'); } catch { /* private mode: the opening simply plays again */ } };

/** Idle packets: drawing units a second, the pause between two packets to the same object, and how they are staggered. */
const PACKET = { speed: 330, rest: 7.5, stagger: 1.9, fade: 0.14 };
/** A hover or focus pulse covers at most this much trace, at this speed (drawing units a second), and never takes less than `least` seconds. */
const PULSE = { reach: 520, speed: 2100, least: 0.22 };

const ORDER: HotspotId[] = ['projects', 'skills', 'experience', 'explorer', 'contact'];
const finite = (a: Animation) => a.effect?.getComputedTiming().iterations !== Infinity;

/**
 * Runs Motion B, "Power-on", on the room at `root` (docs/BRIEF-room-motion.md). The opening itself is CSS
 * (power.css); this hook decides which opening plays, prepares the linework, lets any click, tap or key skip it,
 * and then runs the idle packets and the hover and focus pulses.
 *
 *  - The first visit of a browser session gets the full opening; after that, a short one (sessionStorage).
 *  - Skipping finishes every animation where it would have ended, so nothing jumps to a different picture.
 *  - Packets and pulses are a short dash moved along a path (stroke-dashoffset), from script, so each can be
 *    started and cancelled on its own.
 */
export function usePowerOn(root: RefObject<HTMLElement | null>, active: boolean): PowerPhase | undefined {
  const [phase, setPhase] = useState<PowerPhase>(() => (seen() ? 'quick' : 'opening'));

  // Before the first paint: give every line of the wire copy its own length and its place in the drawing order.
  useLayoutEffect(() => {
    if (!active || phase !== 'opening') return;
    root.current?.querySelectorAll('.rm-wire [data-wire]').forEach((group) => {
      let place = 0;
      group.querySelectorAll<SVGGeometryElement>('path, polygon, polyline, rect, circle').forEach((shape) => {
        if (typeof shape.getTotalLength !== 'function') return;
        shape.style.setProperty('--len', String(Math.ceil(shape.getTotalLength())));
        shape.style.setProperty('--wj', String(Math.min(place++, 28)));
      });
    });
  }, [active, phase, root]);

  // The opening ends by itself, or at once on any click, tap or key.
  useEffect(() => {
    const el = root.current;
    if (!active || phase === 'on' || !el) return;
    let over = false;
    const end = () => { if (over) return; over = true; remember(); setPhase('on'); };
    if (typeof el.getAnimations !== 'function') { end(); return; }
    const running = () => el.getAnimations({ subtree: true }).filter(finite);
    const skip = () => { for (const a of running()) a.finish(); end(); };
    const frame = requestAnimationFrame(() => {
      const all = running();
      if (!all.length) end();
      else void Promise.all(all.map((a) => a.finished)).then(end, () => {});
    });
    window.addEventListener('pointerdown', skip, true);
    window.addEventListener('keydown', skip, true);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointerdown', skip, true);
      window.removeEventListener('keydown', skip, true);
    };
  }, [active, phase, root]);

  // Running: packets travel from the loading bar to each object in turn, and a pulse answers hover and focus.
  useEffect(() => {
    const el = root.current;
    if (!active || phase !== 'on' || !el || typeof el.animate !== 'function') return;
    let packets: Animation[] = [];
    const pulses = new Map<HotspotId, Animation>();
    const flow = (id: HotspotId, kind: 'packet' | 'pulse') => el.querySelector<SVGPathElement>(`[data-flow='${id}'] .rm-${kind}`);

    const startPackets = () => {
      for (const a of packets) a.cancel();
      packets = [];
      const feed = el.querySelector<SVGElement>('.rm-feed');
      const feedPx = Number(feed?.dataset.px ?? 0), feedUnits = Number(feed?.dataset.units ?? 0);
      const feedPaths = feed?.querySelectorAll<SVGPathElement>('.rm-packet');
      ORDER.forEach((id, i) => {
        const path = flow(id, 'packet');
        if (!path) return;
        const len = routes[id].len;
        const down = feedUnits / PACKET.speed, along = len / PACKET.speed; // seconds on the feed, then in the room
        const cycle = down + along + PACKET.rest + i * 0.6;
        const at = (seconds: number) => Math.min(1, seconds / cycle);
        const timing: KeyframeAnimationOptions = { duration: cycle * 1000, delay: (1.1 + i * PACKET.stagger) * 1000, iterations: Infinity };
        const feedPath = feedPaths?.[i];
        if (feedPath && feedPx) {
          packets.push(feedPath.animate([
            { strokeDashoffset: 0, opacity: 0, offset: 0 },
            { strokeDashoffset: 0, opacity: 1, offset: at(PACKET.fade) },
            { strokeDashoffset: -feedPx, opacity: 1, offset: at(down) },
            { strokeDashoffset: -feedPx, opacity: 0, offset: at(down + 0.02) },
            { strokeDashoffset: -feedPx, opacity: 0, offset: 1 },
          ], timing));
        }
        packets.push(path.animate([
          { strokeDashoffset: 0, opacity: 0, offset: 0 },
          { strokeDashoffset: 0, opacity: 0, offset: at(down) },
          { strokeDashoffset: 0, opacity: 1, offset: at(down + 0.02) },
          { strokeDashoffset: -len, opacity: 1, offset: at(down + along) },
          { strokeDashoffset: -len, opacity: 0, offset: at(down + along + PACKET.fade) },
          { strokeDashoffset: -len, opacity: 0, offset: 1 },
        ], timing));
      });
    };
    startPackets();
    let resized = 0;
    const onResize = () => { clearTimeout(resized); resized = window.setTimeout(startPackets, 250); };
    window.addEventListener('resize', onResize);

    // The pulse runs the last stretch of the object's own route and arrives as the object rises (power.css).
    const pulse = (id: HotspotId) => {
      const path = flow(id, 'pulse');
      if (!path) return;
      pulses.get(id)?.cancel();
      const len = routes[id].len, from = Math.max(0, len - PULSE.reach);
      const duration = Math.max(PULSE.least, (len - from) / PULSE.speed) * 1000;
      el.style.setProperty('--rm-pulse', `${Math.round(duration * 0.8)}ms`);
      pulses.set(id, path.animate([
        { strokeDashoffset: -from + 54, opacity: 0 },
        { strokeDashoffset: -from - (len - from) * 0.12, opacity: 1, offset: 0.12 },
        { strokeDashoffset: -len + 20, opacity: 1, offset: 0.9 },
        { strokeDashoffset: -len, opacity: 0 },
      ], { duration, easing: 'cubic-bezier(.3, .1, .3, 1)' }));
    };
    // Entering or leaving a hotspot, not moving about inside it.
    const hotspot = (e: Event) => {
      const button = (e.target as Element | null)?.closest?.<HTMLElement>('[data-hotspot]');
      const other = (e as PointerEvent | FocusEvent).relatedTarget as Node | null;
      return button && !(other && button.contains(other)) ? (button.dataset.hotspot as HotspotId) : undefined;
    };
    const onEnter = (e: Event) => { const id = hotspot(e); if (id) pulse(id); };
    const onLeave = (e: Event) => { const id = hotspot(e); if (id) pulses.get(id)?.cancel(); };
    const list = el.querySelector('.rv-hotspots');
    list?.addEventListener('pointerover', onEnter);
    list?.addEventListener('focusin', onEnter);
    list?.addEventListener('pointerout', onLeave);
    list?.addEventListener('focusout', onLeave);

    return () => {
      clearTimeout(resized);
      window.removeEventListener('resize', onResize);
      list?.removeEventListener('pointerover', onEnter);
      list?.removeEventListener('focusin', onEnter);
      list?.removeEventListener('pointerout', onLeave);
      list?.removeEventListener('focusout', onLeave);
      for (const a of packets) a.cancel();
      for (const a of pulses.values()) a.cancel();
    };
  }, [active, phase, root]);

  return active ? phase : undefined;
}
