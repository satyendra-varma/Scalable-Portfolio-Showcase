import { findVariant, type AccentOption } from '../registry';

/**
 * What the owner can switch at /room-motion (docs/BRIEF-room-motion.md): the motion concept. The choice lives in
 * the query string, so a reload or a shared link shows the same room.
 */
export type MotionId = 'a' | 'b' | 'c' | 'off';

export const MOTIONS: { id: MotionId; code: string; name: string; summary: string }[] = [
  { id: 'a', code: 'A', name: 'Assembly', summary: 'Layers travel in and seat' },
  { id: 'b', code: 'B', name: 'Power-on', summary: 'Linework, then power along the traces' },
  { id: 'c', code: 'C', name: 'Depth focus', summary: 'Layers follow the pointer in depth' },
  { id: 'off', code: 'Off', name: 'Still', summary: 'No motion, as with reduced motion' },
];

/** The room's one accent: Kapton amber, the same amber as the LED header. */
export const ACCENT: AccentOption = findVariant('exploded')!.accents.find((a) => a.id === 'amber')!;

export const DEFAULT_MOTION: MotionId = 'off';

export const ROOM_MOTION_PATH = '/room-motion';

/** Reads the motion from a query string ("?motion=b"). Anything unknown falls back to the default. */
export const parseMotion = (search: string): MotionId =>
  MOTIONS.find((m) => m.id === new URLSearchParams(search).get('motion'))?.id ?? DEFAULT_MOTION;

/** The link to a motion. The default is left out of the address. */
export const motionHref = (motion: MotionId): string =>
  motion === DEFAULT_MOTION ? ROOM_MOTION_PATH : `${ROOM_MOTION_PATH}?motion=${motion}`;
