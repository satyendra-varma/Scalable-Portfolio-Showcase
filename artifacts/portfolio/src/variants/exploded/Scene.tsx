import type { ComponentType } from 'react';
import { hero, skillGroups } from '@/content/room';
import { VariantStage, type HotspotPositions, type SceneProps } from '../Stage';
import './exploded.css';

/**
 * Exploded axonometric, a teardown under one overhead light. One 2:1 projection for every layer:
 * u runs right-down, v runs left-down, z lifts straight up. Layers float apart on z and are tied back
 * to their footprints on the floor plate by dashed guides; each part casts a soft contact shadow.
 * Shaded faces: top lightest, left (v) mid, right (u) darkest. Texture comes from patterns, not elements.
 */
const W = 1200;
const H = 800;
const OX = 560;
const OY = 350;
const FU = 480; // floor plate edges
const FV = 340;

type V3 = [number, number, number];
const P = (u: number, v: number, z = 0): [number, number] => [OX + u - v, OY + (u + v) / 2 - z];
const pt = (p: V3) => P(...p).join(',');
const pts = (list: V3[]) => list.map(pt).join(' ');
const d = (list: V3[], close = false) => 'M' + list.map(pt).join('L') + (close ? 'Z' : '');
const seg = (a: V3, b: V3) => `M${pt(a)}L${pt(b)}`;
/** Local 2D frame on the plane v = const (x along u, y down). */
const planeV = (u: number, v: number, zTop: number) => `matrix(1 .5 0 1 ${P(u, v, zTop).join(' ')})`;
/** Local 2D frame on the plane u = const (x along -v, y down). */
const planeU = (u: number, v: number, zTop: number) => `matrix(1 -.5 0 1 ${P(u, v, zTop).join(' ')})`;

function Box({ u0, u1, v0, v1, z0, z1, k = '', hl = true }: { u0: number; u1: number; v0: number; v1: number; z0: number; z1: number; k?: string; hl?: boolean }) {
  return (
    <g className={`xd-box ${k}`}>
      <polygon className="xd-fu" points={pts([[u1, v0, z0], [u1, v1, z0], [u1, v1, z1], [u1, v0, z1]])} />
      <polygon className="xd-fv" points={pts([[u0, v1, z0], [u1, v1, z0], [u1, v1, z1], [u0, v1, z1]])} />
      <polygon className="xd-top" points={pts([[u0, v0, z1], [u1, v0, z1], [u1, v1, z1], [u0, v1, z1]])} />
      {hl && <path className="xd-hl" d={d([[u0, v1, z1], [u1, v1, z1], [u1, v0, z1]])} />}
    </g>
  );
}

const rect3 = (u0: number, u1: number, v0: number, v1: number, z = 0): V3[] => [[u0, v0, z], [u1, v0, z], [u1, v1, z], [u0, v1, z]];

/** Dashed guides from the three visible corners of a lifted rectangle down to its footprint. */
const guides = (u0: number, u1: number, v0: number, v1: number, zFrom: number) =>
  ([[u1, v0], [u1, v1], [u0, v1]] as [number, number][]).map(([u, v]) => seg([u, v, zFrom], [u, v, 0])).join('');

// Footprints on the floor plate.
const FP = {
  desk: [120, 330, 120, 260],
  cab: [20, 70, 270, 320],
  mail: [420, 470, 20, 70],
} as const;

// Wall corner (lifted layer): two slabs meeting at the back.
const WZ0 = 170;
const WZ1 = 330;
const WU = 400; // length of the slab along u
const WV = 320; // length of the slab along v
const T = 10; // slab thickness

// Shelf on the slab face u = T.
const SH = { v1: 292, z1: 316, w: 256, h: 130 };

// Books: the shortest skill names, read from the content (two rows of nine).
const bookSkills = skillGroups.flatMap((g) => g.skills).sort((a, b) => a.length - b.length).slice(0, 18);
const BOOK_H = [50, 44, 48, 40, 50, 46, 42, 48, 44];
const ROW_BASE = [60, 120];
const bookLayout = [bookSkills.slice(0, 9), bookSkills.slice(9, 18)].map((names, r) => {
  let x = 14;
  return names.map((name, i) => {
    const w = 19 + ((i * 5 + r * 2) % 3) * 3;
    const out = { name, x, w, h: BOOK_H[(i + r * 3) % BOOK_H.length], i };
    x += w + 3.5;
    return out;
  });
});

// Packet routes: down from the desk onto the plate, then along the traces (kept in step with exploded.css).
export const HUB: V3 = [330, 240, 0];
export const routes: Record<'a' | 'b' | 'c', V3[]> = {
  a: [[330, 240, 128], HUB, [445, 240, 0], [445, 70, 0]],
  b: [[330, 240, 128], HUB, [330, 295, 0], [70, 295, 0]],
  c: [[330, 240, 128], HUB, [330, 336, 0]],
};

const pct = (p: [number, number]) => ({ x: +((p[0] / W) * 100).toFixed(1), y: +((p[1] / H) * 100).toFixed(1) });

// Phone: the svg is cropped in (130% wide, centred), so mobile positions map through that crop.
const mob = (p: [number, number], to?: { x?: number; y?: number }) => ({
  x: to?.x ?? +((p[0] / W) * 130 - 15).toFixed(1),
  y: to?.y ?? +((p[1] / H) * 104 - 2).toFixed(1),
});
const at = (p: [number, number], to?: { x?: number; y?: number }) => ({ ...pct(p), mobile: mob(p, to) });

const positions: HotspotPositions = {
  explorer: at(P(236, 200, 146), { x: 53 }),
  skills: at(P(T, 164, 326)),
  projects: at(P(200, T, 326)),
  experience: at(P(45, 322, 112), { x: 19, y: 68 }),
  contact: at(P(445, 72, 118), { x: 79, y: 73 }),
};

export default function ExplodedScene({ onOpen }: SceneProps) {
  const pl = P(0, FV);
  const pr = P(FU, 0);
  const pf = P(FU, FV);
  const pb = P(0, 0);
  const grid: string[] = [];
  for (let u = 40; u < FU; u += 40) grid.push(seg([u, 0, 0], [u, FV, 0]));
  for (let v = 40; v < FV; v += 40) grid.push(seg([0, v, 0], [FU, v, 0]));
  const [dsx, dsy] = P(225, 190);
  const [csx, csy] = P(45, 295);
  const [msx, msy] = P(445, 45);
  const [wsx, wsy] = P(130, 110);
  const [gx, gy] = P(190, 290);
  const [fx, fy] = P(110, T + 1, 316);
  const topZ = 130;

  return (
    <VariantStage onOpen={onOpen} positions={positions}>
      <svg viewBox={`0 0 ${W} ${H}`} className="xd-svg" aria-hidden="true" focusable="false">
        <defs>
          {/* soft shadows and light */}
          <radialGradient id="xd-sh-tight"><stop offset="0" stopColor="#000" stopOpacity=".7" /><stop offset=".5" stopColor="#000" stopOpacity=".34" /><stop offset="1" stopColor="#000" stopOpacity="0" /></radialGradient>
          <radialGradient id="xd-sh-soft"><stop offset="0" stopColor="#000" stopOpacity=".42" /><stop offset=".55" stopColor="#000" stopOpacity=".18" /><stop offset="1" stopColor="#000" stopOpacity="0" /></radialGradient>
          <radialGradient id="xd-spot" cx=".5" cy=".42" r=".5"><stop offset="0" stopColor="#9A9387" stopOpacity=".42" /><stop offset=".55" stopColor="#6A645B" stopOpacity=".12" /><stop offset="1" stopColor="#6A645B" stopOpacity="0" /></radialGradient>
          <radialGradient id="xd-floor-lit" cx=".52" cy=".5" r=".62"><stop offset="0" stopColor="#C2BBAE" stopOpacity=".42" /><stop offset=".6" stopColor="#B5AEA2" stopOpacity=".09" /><stop offset="1" stopColor="#B5AEA2" stopOpacity="0" /></radialGradient>
          <radialGradient id="xd-glow"><stop offset="0" style={{ stopColor: 'var(--accent)' }} stopOpacity=".28" /><stop offset=".6" style={{ stopColor: 'var(--accent)' }} stopOpacity=".08" /><stop offset="1" style={{ stopColor: 'var(--accent)' }} stopOpacity="0" /></radialGradient>
          {/* shaded faces: top lightest, left mid, right darkest */}
          <linearGradient id="xd-g-top" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#7C766D" /><stop offset="1" stopColor="#625D56" /></linearGradient>
          <linearGradient id="xd-g-left" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#4D4944" /><stop offset="1" stopColor="#403C38" /></linearGradient>
          <linearGradient id="xd-g-right" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#2F2C29" /><stop offset="1" stopColor="#232120" /></linearGradient>
          <linearGradient id="xd-g-desk-top" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#A29C92" /><stop offset=".5" stopColor="#8B857B" /><stop offset="1" stopColor="#6F6A62" /></linearGradient>
          <linearGradient id="xd-g-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4B4742" /><stop offset="1" stopColor="#383532" /></linearGradient>
          <linearGradient id="xd-g-glass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1E1D1B" /><stop offset="1" stopColor="#0E0D0C" /></linearGradient>
          <linearGradient id="xd-g-band" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#fff" stopOpacity="0" /><stop offset=".5" stopColor="#fff" stopOpacity=".2" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient>
          <linearGradient id="xd-g-band2" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#fff" stopOpacity="0" /><stop offset=".5" stopColor="#fff" stopOpacity=".12" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient>
          {/* brushed metal (drawn in u, v units), wood grain (drawn in the shelf's own plane) */}
          <pattern id="xd-brushed" width="37" height="5" patternUnits="userSpaceOnUse">
            <path d="M0 .6H37" stroke="#fff" strokeOpacity=".1" strokeWidth=".6" />
            <path d="M0 1.9H23M27 1.9H37" stroke="#000" strokeOpacity=".12" strokeWidth=".6" />
            <path d="M6 3.1H31" stroke="#fff" strokeOpacity=".07" strokeWidth=".5" />
            <path d="M0 4.4H15M19 4.4H37" stroke="#000" strokeOpacity=".08" strokeWidth=".5" />
          </pattern>
          <pattern id="xd-wood" width="64" height="16" patternUnits="userSpaceOnUse">
            <path d="M0 3Q16 1 32 3T64 3" fill="none" stroke="#000" strokeOpacity=".2" strokeWidth=".8" />
            <path d="M0 8Q20 10 40 8T64 8" fill="none" stroke="#fff" strokeOpacity=".07" strokeWidth=".8" />
            <path d="M0 13Q12 11 26 13T64 13" fill="none" stroke="#000" strokeOpacity=".16" strokeWidth=".7" />
          </pattern>
        </defs>

        {/* Overhead light on the studio sweep */}
        <ellipse className="xd-spot" cx="600" cy="360" rx="600" ry="380" fill="url(#xd-spot)" />

        {/* Floor plate, lit at the centre */}
        <g className="xd-layer xd-l-floor">
          <polygon className="xd-plate-side" points={`${pl} ${pf} ${pf[0]},${pf[1] + 14} ${pl[0]},${pl[1] + 14}`} />
          <polygon className="xd-plate-side xd-plate-side-r" points={`${pf} ${pr} ${pr[0]},${pr[1] + 14} ${pf[0]},${pf[1] + 14}`} />
          <polygon className="xd-plate" points={`${pb} ${pr} ${pf} ${pl}`} />
          <path className="xd-grid" d={grid.join('')} />
          <polygon className="xd-lit" points={`${pb} ${pr} ${pf} ${pl}`} fill="url(#xd-floor-lit)" />
          <polyline className="xd-plate-edge" points={`${pl} ${pf} ${pr}`} />
          <polygon className="xd-fp" points={pts(rect3(...FP.desk))} />
          <polygon className="xd-fp" points={pts(rect3(...FP.cab))} />
          <polygon className="xd-fp" points={pts(rect3(...FP.mail))} />
          <path className="xd-dim" d={seg([0, FV + 26, 0], [FU, FV + 26, 0]) + seg([0, FV + 18, 0], [0, FV + 34, 0]) + seg([FU, FV + 18, 0], [FU, FV + 34, 0])} />
          <text className="xd-label" transform={`matrix(1 .5 0 1 ${P(40, FV + 44)[0]} ${P(40, FV + 44)[1]})`}>ROOM_01 / 4.20 m</text>
          <text className="xd-label" transform={`matrix(1 -.5 0 1 ${P(FU + 30, 210)[0]} ${P(FU + 30, 210)[1] + 6})`}>{'// scale 1:40'}</text>
        </g>

        {/* Traces on the floor plate, then contact shadows over them */}
        <g className="xd-layer xd-l-traces">
          <path className="xd-trace" d={d(routes.a.slice(1))} />
          <path className="xd-trace" d={d(routes.b.slice(1))} />
          <path className="xd-trace" d={d(routes.c.slice(1))} />
          <path className="xd-trace xd-trace-dim" d={seg([60, 200, 0], [60, 120, 0]) + seg([60, 120, 0], [400, 120, 0]) + seg([400, 120, 0], [400, 20, 0]) + seg([100, 330, 0], [260, 330, 0])} />
          {[routes.a[3], routes.b[3], routes.c[2], HUB].map((p, i) => (
            <circle key={i} className="xd-pad" cx={P(...p)[0]} cy={P(...p)[1]} r="4.5" />
          ))}
        </g>
        <g className="xd-shadows">
          <ellipse className="xd-sh xd-sh-wall" cx={wsx} cy={wsy + 20} rx="330" ry="96" fill="url(#xd-sh-soft)" />
          <ellipse className="xd-sh xd-sh-desk" cx={dsx} cy={dsy} rx="230" ry="100" fill="url(#xd-sh-tight)" />
          <ellipse className="xd-sh xd-sh-cab" cx={csx} cy={csy + 4} rx="84" ry="36" fill="url(#xd-sh-tight)" />
          <ellipse className="xd-sh xd-sh-mail" cx={msx} cy={msy + 4} rx="92" ry="40" fill="url(#xd-sh-soft)" />
          <ellipse className="xd-glow" cx={gx - 10} cy={gy + 6} rx="190" ry="66" fill="url(#xd-glow)" />
        </g>

        {/* Alignment guides */}
        <g className="xd-guides">
          <path d={guides(...FP.desk, 116)} />
          <path d={guides(...FP.cab, 100)} />
          <path d={guides(...FP.mail, 130)} />
          <path d={seg([0, 0, WZ0], [0, 0, 0]) + seg([0, WV, WZ0], [0, WV, 0]) + seg([WU, 0, WZ0], [WU, 0, 0])} />
        </g>

        {/* Back wall: two lifted slabs meeting at the corner */}
        <g className="xd-layer xd-l-wall">
          <ellipse className="xd-aura" cx="560" cy="210" rx="360" ry="170" fill="url(#xd-glow)" />
          <Box u0={0} u1={T} v0={0} v1={WV} z0={WZ0} z1={WZ1} k="xd-slab" hl={false} />
          <Box u0={0} u1={WU} v0={0} v1={T} z0={WZ0} z1={WZ1} k="xd-slab xd-slab-b" />
          <g data-object="skills" className="xd-obj">
            <g transform={planeU(T, SH.v1, SH.z1)}>
              <rect className="xd-wood-base" x="0" y="0" width={SH.w} height={SH.h} rx="2" />
              <rect className="xd-wood-grain" x="0" y="0" width={SH.w} height={SH.h} rx="2" fill="url(#xd-wood)" />
              <rect className="xd-shelf-in" x="6" y="4" width={SH.w - 12} height={SH.h - 8} />
              {bookLayout.map((row, r) =>
                row.map((b) => (
                  <g key={`${r}-${b.i}`} className={`xd-bk${b.i % 4 === 2 ? ' xd-bk-a' : b.i % 3 === 0 ? ' xd-bk-l' : ''}`}>
                    <rect x={b.x} y={ROW_BASE[r] - b.h} width={b.w} height={b.h} rx="1.5" />
                    <text transform={`translate(${b.x + b.w / 2 + 3} ${ROW_BASE[r] - b.h / 2}) rotate(-90)`} textAnchor="middle">{b.name}</text>
                  </g>
                )),
              )}
              <path className="xd-board" d={`M6 ${ROW_BASE[0]}H${SH.w - 6}M6 ${ROW_BASE[1]}H${SH.w - 6}`} />
            </g>
          </g>
          {/* project frame (plane v = T): a small architecture sketch */}
          <g data-object="projects" className="xd-obj">
            <g transform={`matrix(1 .5 0 1 ${fx} ${fy})`}>
              <rect className="xd-frame" x="0" y="0" width="190" height="132" rx="3" />
              <rect className="xd-frame-in" x="9" y="9" width="172" height="114" rx="2" />
              <rect className="xd-node" x="24" y="24" width="50" height="28" rx="3" />
              <rect className="xd-node xd-node-a" x="116" y="24" width="50" height="28" rx="3" />
              <rect className="xd-node" x="70" y="80" width="50" height="28" rx="3" />
              <path className="xd-link" d="M74 38H116M49 52V66H95V80M141 52V66H95" />
            </g>
          </g>
        </g>

        {/* Filing cabinet: matte, with highlight edges */}
        <g className="xd-layer xd-l-cab">
          <g data-object="experience" className="xd-obj">
            <Box u0={FP.cab[0]} u1={FP.cab[1]} v0={FP.cab[2]} v1={FP.cab[3]} z0={100} z1={200} k="xd-cabinet" />
            <g transform={planeV(FP.cab[0], FP.cab[3], 200)}>
              {[0, 1, 2].map((i) => (
                <g key={i}>
                  <rect className="xd-drawer" x="4" y={5 + i * 31} width="42" height="27" rx="1.5" />
                  <rect className="xd-handle" x="16" y={15 + i * 31} width="18" height="3.4" rx="1.7" />
                </g>
              ))}
            </g>
          </g>
        </g>

        {/* Mailbox */}
        <g className="xd-layer xd-l-mail">
          <g data-object="contact" className="xd-obj">
            <Box u0={FP.mail[0]} u1={FP.mail[1]} v0={FP.mail[2]} v1={FP.mail[3]} z0={130} z1={190} k="xd-mailbox" />
            <g transform={planeV(FP.mail[0], FP.mail[3], 190)}>
              <rect className="xd-drawer" x="5" y="9" width="40" height="40" rx="2" />
              <rect className="xd-slot" x="11" y="22" width="28" height="4" rx="2" />
            </g>
            <path className="xd-flag" d={d([[FP.mail[1], 30, 190], [FP.mail[1], 30, 226], [FP.mail[1], 52, 226], [FP.mail[1], 52, 210], [FP.mail[1], 36, 210], [FP.mail[1], 36, 190]], true)} />
          </g>
        </g>

        {/* Desk and monitor */}
        <g className="xd-layer xd-l-desk">
          <g data-object="explorer" className="xd-obj">
            <path className="xd-leg" d={seg([128, 128, 70], [128, 128, 116]) + seg([322, 128, 70], [322, 128, 116]) + seg([128, 252, 70], [128, 252, 116]) + seg([322, 252, 70], [322, 252, 116])} />
            <Box u0={120} u1={330} v0={120} v1={260} z0={116} z1={topZ} k="xd-desk" />
            <g transform={`matrix(1 .5 -1 .5 ${OX} ${OY - topZ})`}>
              <rect className="xd-brushed" x="120" y="120" width="210" height="140" fill="url(#xd-brushed)" />
            </g>
            <Box u0={172} u1={272} v0={212} v1={238} z0={topZ} z1={134} k="xd-key" hl={false} />
            <Box u0={226} u1={246} v0={156} v1={166} z0={topZ} z1={152} k="xd-neck" hl={false} />
            <Box u0={190} u1={282} v0={140} v1={196} z0={topZ} z1={135} k="xd-foot" hl={false} />
            <Box u0={140} u1={330} v0={170} v1={182} z0={150} z1={280} k="xd-monitor" />
            <g transform={planeV(140, 182, 280)}>
              <rect className="xd-screen" x="7" y="7" width="176" height="116" rx="2" />
              <path className="xd-screen-bar" d="M7 25H183" />
              <circle className="xd-dot" cx="17" cy="16" r="2.4" />
              <circle className="xd-dot" cx="26" cy="16" r="2.4" />
              <circle className="xd-dot xd-dot-t" cx="35" cy="16" r="2.4" />
              <text className="xd-prompt" x="18" y="52">{'> dotnet run'}</text>
              <rect className="xd-cursor" x="130" y="40" width="8" height="14" />
              <path className="xd-code xd-code-a" d="M18 72H76M18 86H124M18 100H52" />
              <path className="xd-code xd-code-b" d="M88 72H136M136 100H174" />
              <path className="xd-code xd-code-t" d="M18 114H46M58 114H112" />
              <path d="M120 7H150L94 123H64Z" fill="url(#xd-g-band)" />
              <path d="M156 7H163L107 123H100Z" fill="url(#xd-g-band2)" />
            </g>
            <path className="xd-edge-active" d={d([[140, 182, 150], [330, 182, 150], [330, 182, 280], [140, 182, 280]], true)} />
          </g>
        </g>

        {/* Packets: translate and opacity only (see exploded.css) */}
        <g className="xd-layer-static">
          <g className="xd-pk xd-pk-a1"><circle className="xd-halo" r="9" /><circle className="xd-core" r="4" /></g>
          <g className="xd-pk xd-pk-b1"><circle className="xd-halo" r="9" /><circle className="xd-core" r="4" /></g>
          <g className="xd-pk xd-pk-c1"><circle className="xd-halo" r="9" /><circle className="xd-core" r="4" /></g>
          <g className="xd-pk xd-pk-a2"><circle className="xd-halo" r="9" /><circle className="xd-core" r="4" /></g>
        </g>
      </svg>
    </VariantStage>
  );
}

/**
 * The name, exploded: an outline copy lifted up and to the left behind the solid name, joined to it by short
 * dashed guides. Sizes mirror .rv-name in exploded.css (custom properties on .xd-hd).
 */
function ExplodedHeroDecor() {
  return (
    <svg className="xd-hd" aria-hidden="true" focusable="false">
      <text className="xd-hd-text" x="0" y="0">{hero.name}</text>
      <rect className="xd-hd-g xd-hd-g1" width="0.01" />
      <rect className="xd-hd-g xd-hd-g2" width="0.01" />
      <rect className="xd-hd-g xd-hd-g3" width="0.01" />
    </svg>
  );
}

/** Optional aria-hidden decoration rendered inside the hero, behind the heading (see ../scenes.ts). */
export const HeroDecor: ComponentType | null = ExplodedHeroDecor;
