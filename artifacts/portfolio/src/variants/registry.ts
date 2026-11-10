/**
 * The four night-blueprint room variations compared at /room-variants.
 * Values match docs/DESIGN-BRIEF.md; each variant's palette lives in variants/<id>/<id>.css.
 */
export type VariantId = 'isometric' | 'elevation' | 'plan' | 'exploded';

export type VariantMeta = {
  id: VariantId;
  number: number;
  name: string;
  drawing: string;
  accentHex: string;
  idleStyle: string;
};

export const variants: VariantMeta[] = [
  { id: 'isometric', number: 1, name: 'Isometric', drawing: 'Isometric blueprint', accentHex: '#5CE1F2', idleStyle: 'Scanline sweep' },
  { id: 'elevation', number: 2, name: 'Elevation', drawing: 'Front elevation', accentHex: '#FFB547', idleStyle: 'Terminal typing' },
  { id: 'plan', number: 3, name: 'Plan', drawing: 'Floor plan with monitor detail', accentHex: '#B6F25A', idleStyle: 'Radar sweep' },
  { id: 'exploded', number: 4, name: 'Exploded', drawing: 'Exploded axonometric', accentHex: '#C69CFF', idleStyle: 'Packet stream' },
];

export const findVariant = (id: string | undefined) => variants.find((v) => v.id === id);
