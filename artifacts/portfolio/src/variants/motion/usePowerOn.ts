import { useEffect, useLayoutEffect, useState, type RefObject } from 'react';
import type { HotspotId } from '@/components/room/RoomScene';
import { markOpeningSeen, type OpeningKind } from './opening';
import { routes } from './wiring';

/** 'dark': unpowered, waiting to be seen. 'opening': power is travelling in. 'on': running. */
export type PowerPhase = 'dark' | 'opening' | 'on';

/** The loading bar charges in this long (power.css, lite.css), by kind of opening: power never leaves earlier. */
const CHARGE_MS: Record<OpeningKind, number> = { full: 1350, mobile: 600, return: 150 };
/** "Most of the room is on screen": this share of the stage, or of the window where the stage is the taller. */
const IN_VIEW = 0.6;
/** If an animation never reports its end, the opening is over after this long anyway, by kind of opening. */
const GIVE_UP_MS: Record<OpeningKind, number> = { full: 14000, mobile: 6000, return: 3000 };
const STEPS = Array.from({ length: 21 }, (_, i) => i / 20);
const MODIFIERS = ['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'OS'];

/** Idle packets: drawing units a second, the pause between two packets to the same object, and how they are staggered. */
const PACKET = { speed: 330, rest: 7.5, stagger: 1.9, fade: 0.14 };
/** A hover or focus pulse covers at most this much trace, at this speed (drawing units a second), and never takes less than `least` seconds. */
const PULSE = { reach: 520, speed: 2100, least: 0.22 };

const ORDER: HotspotId[] = ['projects', 'skills', 'experience', 'explorer', 'contact'];
const finite = (a: Animation) => a.effect?.getComputedTiming().iterations !== Infinity;

/**
 * Runs Motion B, "Power-on", on the room at `root` (docs/BRIEF-room-motion.md). The opening itself is CSS
 * (power.css); this hook decides when it starts, lets a click, tap or key skip it, and then runs the idle packets
 * and the hover and focus pulses.
 *
 *  - The room waits dark, with every animation of the opening paused on its first frame, until the loading bar
 *    has charged, most of the room is on screen and the tab is in front. Then the opening runs once, on time.
 *    It is a one-time start: nothing follows the scroll position.
 *  - Skipping finishes every animation where it would have ended, so nothing jumps to a different picture.
 *  - `opening` is the kind of opening ('full', 'mobile' or 'return'): it sets only how long the room waits before
 *    power may leave and when a stuck opening is given up on. The animations themselves are CSS (power.css, lite.css).
 *    Whenever the room reaches 'on' (finished, skipped, or without animation support) the session is marked as
 *    having seen the opening (opening.ts).
 *  - Packets and pulses are a short dash moved along a path (stroke-dashoffset), from script, so each can be
 *    started and cancelled on its own. They start only once the opening has powered the traces.
 */
export function usePowerOn(root: RefObject<HTMLElement | null>, active: boolean, opening: OpeningKind = 'full'): PowerPhase | undefined {
  const [phase, setPhase] = useState<PowerPhase>('dark');

  // The session has seen the opening once the room is on, however it got there.
  useEffect(() => {
    if (active && phase === 'on') markOpeningSeen();
  }, [active, phase]);

  // Before the first paint: give every line of the wire copy its own length and its place in the drawing order.
  useLayoutEffect(() => {
    if (!active || phase !== 'dark') return;
    root.current?.querySelectorAll('.rm-wire [data-wire]').forEach((group) => {
      let place = 0;
      group.querySelectorAll<SVGGeometryElement>('path, polygon, polyline, rect, circle').forEach((shape) => {
        if (typeof shape.getTotalLength !== 'function') return;
        shape.style.setProperty('--len', String(Math.ceil(shape.getTotalLength())));
        shape.style.setProperty('--wj', String(Math.min(place++, 28)));
      });
    });
  }, [active, phase, root]);

  // Dark: wait for the charge, for the room to be seen, and for the tab to be in front. Then start, once.
  useEffect(() => {
    const el = root.current;
    if (!active || phase !== 'dark' || !el) return;
    if (typeof el.getAnimations !== 'function') { setPhase('on'); return; }
    const stage = el.querySelector('.rm-stage');
    let charged = false;
    let inView = !stage || typeof IntersectionObserver === 'undefined';
    const go = () => { if (charged && inView && document.visibilityState !== 'hidden') setPhase('opening'); };
    const timer = window.setTimeout(() => { charged = true; go(); }, CHARGE_MS[opening]);
    const observer = inView || !stage ? null : new IntersectionObserver(([entry]) => {
      const all = entry.boundingClientRect.height, win = entry.rootBounds?.height ?? window.innerHeight;
      inView = all > 0 && entry.intersectionRect.height >= Math.min(all, win) * IN_VIEW;
      go();
    }, { threshold: STEPS });
    if (observer && stage) observer.observe(stage);
    document.addEventListener('visibilitychange', go);
    return () => { clearTimeout(timer); observer?.disconnect(); document.removeEventListener('visibilitychange', go); };
  }, [active, phase, root, opening]);

  // The opening ends by itself, or at once on any click, tap or key. While the room is still dark only a click on
  // the room itself, or keyboard focus reaching one of its labels, powers it at once: scrolling to it must not.
  useEffect(() => {
    const el = root.current;
    if (!active || phase === 'on' || !el || typeof el.getAnimations !== 'function') return;
    let over = false;
    const end = () => { if (over) return; over = true; setPhase('on'); };
    const running = () => el.getAnimations({ subtree: true }).filter(finite);
    const skip = () => { for (const a of running()) a.finish(); end(); };
    const inRoom = (e: Event) => !!(e.target as Element | null)?.closest?.('.rm-stage');
    const onPointer = (e: Event) => { if (phase === 'opening' || inRoom(e)) skip(); };
    const onKey = (e: KeyboardEvent) => { if (phase === 'opening' && !MODIFIERS.includes(e.key)) skip(); };
    const onFocus = (e: Event) => { if (inRoom(e)) skip(); };
    let frame = 0, giveUp = 0;
    if (phase === 'opening') {
      frame = requestAnimationFrame(() => {
        const all = running();
        if (!all.length) end();
        else void Promise.all(all.map((a) => a.finished)).then(end, () => {});
      });
      giveUp = window.setTimeout(skip, GIVE_UP_MS[opening]);
    }
    window.addEventListener('pointerdown', onPointer, true);
    window.addEventListener('keydown', onKey, true);
    el.addEventListener('focusin', onFocus);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(giveUp);
      window.removeEventListener('pointerdown', onPointer, true);
      window.removeEventListener('keydown', onKey, true);
      el.removeEventListener('focusin', onFocus);
    };
  }, [active, phase, root, opening]);

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
    // A tap leaves its pulse to finish by itself; only a mouse or the keyboard cancels it on leaving.
    const onLeave = (e: Event) => { if ((e as PointerEvent).pointerType === 'touch') return; const id = hotspot(e); if (id) pulses.get(id)?.cancel(); };
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
