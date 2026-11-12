import { findVariant, type AccentOption } from '../registry';

/**
 * What the owner can switch at /room-motion (docs/BRIEF-room-motion.md): the motion concept, the header, and
 * the room's accent. The choices live in the query string, so a reload or a shared link shows the same room.
 */
export type MotionId = 'a' | 'b' | 'c' | 'off';
export type HeaderId = 'led' | 'own';

export const MOTIONS: { id: MotionId; code: string; name: string; summary: string }[] = [
  { id: 'a', code: 'A', name: 'Assembly', summary: 'Layers travel in and seat' },
  { id: 'b', code: 'B', name: 'Power-on', summary: 'Linework, then power along the traces' },
  { id: 'c', code: 'C', name: 'Depth focus', summary: 'Layers follow the pointer in depth' },
  { id: 'off', code: 'Off', name: 'Still', summary: 'No motion, as with reduced motion' },
];

export const HEADERS: { id: HeaderId; name: string; summary: string }[] = [
  { id: 'led', name: 'Amber LED header', summary: 'Framed name with the loading bar' },
  { id: 'own', name: 'Exploded’s own header', summary: 'The name, exploded' },
];

const accentsOf = (variant: 'elevation' | 'exploded') => findVariant(variant)!.accents;

/** The room's accents: Exploded's Kapton amber and Copper. The first is the default. */
export const ACCENTS: AccentOption[] = accentsOf('exploded').filter((a) => a.id === 'amber' || a.id === 'copper');

/** The LED header keeps Elevation's Amber LED, whichever accent the room wears. */
export const LED_ACCENT: AccentOption = accentsOf('elevation').find((a) => a.id === 'amber')!;

export type RoomMotionOptions = { motion: MotionId; header: HeaderId; accent: AccentOption };

export const DEFAULTS: RoomMotionOptions = { motion: 'off', header: 'led', accent: ACCENTS[0] };

export const ROOM_MOTION_PATH = '/room-motion';

/** Reads the choices from a query string ("?motion=b&header=own&accent=copper"). Anything unknown falls back to the default. */
export function parseOptions(search: string): RoomMotionOptions {
  const q = new URLSearchParams(search);
  return {
    motion: MOTIONS.find((m) => m.id === q.get('motion'))?.id ?? DEFAULTS.motion,
    header: HEADERS.find((h) => h.id === q.get('header'))?.id ?? DEFAULTS.header,
    accent: ACCENTS.find((a) => a.id === q.get('accent')) ?? DEFAULTS.accent,
  };
}

/** The link that keeps the current choices and changes some of them. Defaults are left out of the address. */
export function optionsHref(current: RoomMotionOptions, change: Partial<RoomMotionOptions> = {}): string {
  const next = { ...current, ...change };
  const q = new URLSearchParams();
  if (next.motion !== DEFAULTS.motion) q.set('motion', next.motion);
  if (next.header !== DEFAULTS.header) q.set('header', next.header);
  if (next.accent.id !== DEFAULTS.accent.id) q.set('accent', next.accent.id);
  const query = q.toString();
  return query ? `${ROOM_MOTION_PATH}?${query}` : ROOM_MOTION_PATH;
}
