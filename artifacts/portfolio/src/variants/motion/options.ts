import { findVariant, type AccentOption } from '../registry';

/**
 * What the owner can switch at /room-motion (docs/BRIEF-room-motion.md): Power-on, the chosen motion, or Off, the
 * still room. The choice lives in the query string, so a reload or a shared link shows the same room.
 */
export type MotionId = 'b' | 'off';

export const MOTIONS: { id: MotionId; code: string; name: string; summary: string }[] = [
  { id: 'b', code: 'On', name: 'Power-on', summary: 'The room powers on from dark' },
  { id: 'off', code: 'Off', name: 'Still', summary: 'No motion, as with reduced motion' },
];

/** The room's one accent: Kapton amber, the same amber as the LED header. */
export const ACCENT: AccentOption = findVariant('exploded')!.accents.find((a) => a.id === 'amber')!;

export const DEFAULT_MOTION: MotionId = 'b';

export const ROOM_MOTION_PATH = '/room-motion';

/** Reads the motion from a query string ("?motion=off"). Anything unknown falls back to the default. */
export const parseMotion = (search: string): MotionId =>
  MOTIONS.find((m) => m.id === new URLSearchParams(search).get('motion'))?.id ?? DEFAULT_MOTION;

/** The link to a motion. The default is left out of the address. */
export const motionHref = (motion: MotionId): string =>
  motion === DEFAULT_MOTION ? ROOM_MOTION_PATH : `${ROOM_MOTION_PATH}?motion=${motion}`;
