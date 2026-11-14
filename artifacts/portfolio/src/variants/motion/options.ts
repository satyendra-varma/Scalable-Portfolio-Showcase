import { findVariant, type AccentOption } from '../registry';

/**
 * The room has two states (docs/BRIEF-room-motion.md): 'b' is Power-on, the room powering on from dark, and 'off' is the
 * still room that a visitor who prefers reduced motion gets. The home page chooses between them; there is no switcher.
 */
export type MotionId = 'b' | 'off';

/** The room's one accent: Kapton amber, the same amber as the LED header. */
export const ACCENT: AccentOption = findVariant('exploded')!.accents.find((a) => a.id === 'amber')!;
