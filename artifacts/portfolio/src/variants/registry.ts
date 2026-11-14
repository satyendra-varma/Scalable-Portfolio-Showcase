/**
 * The room concepts the owner compares (round 1 numbering; Plan, 3, was removed).
 * Values match docs/DESIGN-BRIEF.md. Ground tokens live in variants/<id>/<id>.css; accents live here,
 * so the comparison page can switch them and the tests can check every text pair.
 * Keep this file free of imports: scripts load it directly with Node's type stripping.
 */
export type VariantId = 'isometric' | 'elevation' | 'exploded';

/**
 * One accent option, used with restraint: a main accent, the ink for text on accent fills,
 * and one supporting tone (a pale tint of the same hue, for resume-evidence markers).
 */
export type AccentOption = {
  id: string;
  name: string;
  /** --accent */
  hex: string;
  /** --accent-ink */
  ink: string;
  /** --evidence: the one supporting tone */
  support: string;
};

export type VariantMeta = {
  id: VariantId;
  number: number;
  name: string;
  drawing: string;
  idleStyle: string;
  /** The first option is the default. Every concept offers amber #FFB547. */
  accents: AccentOption[];
};

export const AMBER = '#FFB547';

export const variants: VariantMeta[] = [
  {
    id: 'isometric', number: 1, name: 'Isometric', drawing: 'Isometric blueprint', idleStyle: 'Scanline sweep',
    accents: [
      { id: 'amber', name: 'Lamp amber', hex: '#FFB547', ink: '#1F1404', support: '#FFDDA8' },
      { id: 'redline', name: 'Redline', hex: '#FF7A68', ink: '#2A0B06', support: '#FFC9C0' },
      { id: 'greenline', name: 'Greenline', hex: '#8EE3B8', ink: '#062214', support: '#C8F2DC' },
    ],
  },
  {
    id: 'elevation', number: 2, name: 'Elevation', drawing: 'Front elevation', idleStyle: 'Terminal typing',
    accents: [
      { id: 'amber', name: 'Amber LED', hex: '#FFB547', ink: '#1F1404', support: '#FFDDA8' },
      { id: 'green', name: 'Green LED', hex: '#5CF29E', ink: '#03200F', support: '#BDF8D6' },
      { id: 'blue', name: 'Blue LED', hex: '#7DA8FF', ink: '#06142E', support: '#C9DAFF' },
    ],
  },
  {
    id: 'exploded', number: 4, name: 'Exploded', drawing: 'Exploded axonometric', idleStyle: 'Packet stream',
    accents: [
      { id: 'amber', name: 'Kapton amber', hex: '#FFB547', ink: '#1F1404', support: '#FFDDA8' },
      { id: 'copper', name: 'Copper', hex: '#E8957A', ink: '#2A120A', support: '#F6CDBF' },
      { id: 'steel', name: 'Steel', hex: '#93B7DD', ink: '#0A1726', support: '#CFE0F2' },
    ],
  },
];

export const findVariant = (id: string | undefined) => variants.find((v) => v.id === id);

/** The requested accent of a concept, or its default when none is requested. */
export const findAccent = (variant: VariantMeta, id: string | undefined) =>
  id === undefined ? variant.accents[0] : variant.accents.find((a) => a.id === id);
