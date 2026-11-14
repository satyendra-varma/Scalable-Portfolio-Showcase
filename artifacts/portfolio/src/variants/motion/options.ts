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

/** How long Motion B's opening takes, in seconds. Read from "?speed=". */
export type SpeedId = '4' | '6' | '8';

export const SPEEDS: { id: SpeedId; label: string }[] = [
  { id: '4', label: '4 s' },
  { id: '6', label: '6 s' },
  { id: '8', label: '8 s' },
];

export const DEFAULT_SPEED: SpeedId = '6';

/** Reads the opening speed from a query string ("?speed=4"). Anything unknown falls back to the default. */
export const parseSpeed = (search: string): SpeedId =>
  SPEEDS.find((s) => s.id === new URLSearchParams(search).get('speed'))?.id ?? DEFAULT_SPEED;

/** The link to a motion. The default is left out of the address; the speed is added only for Motion B and only when not the default. */
export const motionHref = (motion: MotionId, speed?: SpeedId): string => {
  const params = new URLSearchParams();
  if (motion !== DEFAULT_MOTION) params.set('motion', motion);
  if (motion === 'b' && speed && speed !== DEFAULT_SPEED) params.set('speed', speed);
  const query = params.toString();
  return query ? `${ROOM_MOTION_PATH}?${query}` : ROOM_MOTION_PATH;
};
