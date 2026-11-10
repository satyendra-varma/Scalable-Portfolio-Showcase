import { VariantStage, type HotspotPositions, type SceneProps } from '../Stage';
import './exploded.css';

/**
 * Exploded axonometric. One 2:1 projection for every layer: u runs right-down, v runs left-down,
 * z lifts straight up. Layers float apart on z and are tied back to their footprints on the floor
 * plate by dashed guides.
 */
const W = 1000;
const H = 960;
const OX = 500;
const OY = 560;
const F = 360; // floor plate edge

type V3 = [number, number, number];
const P = (u: number, v: number, z = 0): [number, number] => [OX + u - v, OY + (u + v) / 2 - z];
const pt = (p: V3) => P(...p).join(',');
const pts = (list: V3[]) => list.map(pt).join(' ');
const d = (list: V3[], close = false) => 'M' + list.map(pt).join('L') + (close ? 'Z' : '');
const seg = (a: V3, b: V3) => `M${pt(a)}L${pt(b)}`;

function Box({ u0, u1, v0, v1, z0, z1, k = '' }: { u0: number; u1: number; v0: number; v1: number; z0: number; z1: number; k?: string }) {
  return (
    <g className={`xd-box ${k}`}>
      <polygon className="xd-fu" points={pts([[u1, v0, z0], [u1, v1, z0], [u1, v1, z1], [u1, v0, z1]])} />
      <polygon className="xd-fv" points={pts([[u0, v1, z0], [u1, v1, z0], [u1, v1, z1], [u0, v1, z1]])} />
      <polygon className="xd-top" points={pts([[u0, v0, z1], [u1, v0, z1], [u1, v1, z1], [u0, v1, z1]])} />
    </g>
  );
}

const rect3 = (u0: number, u1: number, v0: number, v1: number, z = 0): V3[] => [[u0, v0, z], [u1, v0, z], [u1, v1, z], [u0, v1, z]];

/** Dashed guides from the three visible corners of a lifted rectangle down to its footprint. */
const guides = (u0: number, u1: number, v0: number, v1: number, zFrom: number) =>
  ([[u1, v0], [u1, v1], [u0, v1]] as [number, number][]).map(([u, v]) => seg([u, v, zFrom], [u, v, 0])).join('');

// Footprints on the floor plate.
const FP = {
  desk: [70, 270, 100, 240],
  cab: [10, 58, 270, 318],
  mail: [270, 318, 10, 58],
} as const;

// Wall corner (lifted layer).
const WZ0 = 290;
const WZ1 = 510;
const WL = 330;

// Books on the shelf wall (u = 0 plane): deterministic heights.
const bookRows = [315, 369, 423];
const bookPaths = (() => {
  const out = ['', '', ''];
  bookRows.forEach((z, r) => {
    for (let i = 0; i < 13; i++) {
      const v = 66 + i * 16.5;
      const h = 26 + ((i * 7 + r * 5) % 5) * 5;
      out[(i + r) % 3] += seg([0, v, z + 2], [0, v, z + 2 + h]);
    }
  });
  return out;
})();

// Packet routes (kept in step with the keyframes in exploded.css).
const trunk: V3[] = [[240, 176, 130], [240, 228, 130], [240, 228, 0]];
const routeA: V3[] = [...trunk, [294, 228, 0], [294, 34, 0]];
const routeB: V3[] = [...trunk, [34, 228, 0], [34, 294, 0]];
const routeC: V3[] = [...trunk, [240, 322, 0]];

const [sx, sy] = P(80, 170, 280);
const [fx, fy] = P(90, 0, 470);

const pct = (p: [number, number]) => ({ x: +((p[0] / W) * 100).toFixed(1), y: +((p[1] / H) * 100).toFixed(1) });

const positions: HotspotPositions = {
  explorer: { ...pct(P(170, 170, 182)), mobile: { x: 50, y: 57 } },
  skills: { ...pct(P(0, 165, 395)), mobile: { x: 31, y: 24 } },
  projects: { ...pct(P(180, 0, 400)), mobile: { x: 70, y: 24 } },
  experience: { ...pct(P(34, 294, 138)), mobile: { x: 16, y: 68 } },
  contact: { ...pct(P(294, 34, 150)), mobile: { x: 84, y: 68 } },
};

export default function ExplodedScene({ onOpen }: SceneProps) {
  const [fl, fr, ff, fb] = [P(0, F), P(F, 0), P(F, F), P(0, 0)];
  const grid: string[] = [];
  for (let i = 1; i < 9; i++) {
    const t = (F / 9) * i;
    grid.push(seg([t, 0, 0], [t, F, 0]), seg([0, t, 0], [F, t, 0]));
  }

  return (
    <VariantStage onOpen={onOpen} positions={positions}>
      <svg viewBox={`0 0 ${W} ${H}`} className="xd-svg" aria-hidden="true" focusable="false">
        <defs>
          <radialGradient id="xd-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#C69CFF" stopOpacity=".34" />
            <stop offset="1" stopColor="#C69CFF" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Floor plate */}
        <g className="xd-layer xd-l-floor">
          <polygon className="xd-plate-side" points={`${fl} ${ff} ${ff[0]},${ff[1] + 16} ${fl[0]},${fl[1] + 16}`} />
          <polygon className="xd-plate-side" points={`${ff} ${fr} ${fr[0]},${fr[1] + 16} ${ff[0]},${ff[1] + 16}`} />
          <polygon className="xd-plate" points={`${fb} ${fr} ${ff} ${fl}`} />
          <path className="xd-grid" d={grid.join('')} />
          <polyline className="xd-plate-edge" points={`${fl} ${ff} ${fr}`} />
          {/* footprints */}
          <polygon className="xd-fp" points={pts(rect3(...FP.desk))} />
          <polygon className="xd-fp" points={pts(rect3(...FP.cab))} />
          <polygon className="xd-fp" points={pts(rect3(...FP.mail))} />
          <path className="xd-fp" d={d([[0, 0, 0], [F, 0, 0], [F, 14, 0], [14, 14, 0], [14, F, 0], [0, F, 0]], true)} />
          {/* dimension ticks */}
          <path className="xd-dim" d={seg([0, F + 26, 0], [F, F + 26, 0]) + seg([0, F + 18, 0], [0, F + 34, 0]) + seg([F, F + 18, 0], [F, F + 34, 0])} />
          <text className="xd-label" transform={`matrix(1 .5 0 1 ${P(40, F + 40)[0] - 30} ${P(40, F + 40)[1] - 2})`}>ROOM_01 / 4.20 m</text>
          <text className="xd-label xd-label-r" transform={`matrix(1 -.5 0 1 ${P(F + 38, 190)[0] - 4} ${P(F + 38, 190)[1] + 22})`}>{'// scale 1:40'}</text>
        </g>

        {/* Traces on the floor plate */}
        <g className="xd-layer xd-l-traces">
          <path className="xd-trace xd-trace-t" d={d(routeA)} />
          <path className="xd-trace xd-trace-v" d={d(routeB.slice(2))} />
          <path className="xd-trace xd-trace-v" d={d(routeC.slice(2))} />
          {[routeA[4], routeB[4], routeC[3], trunk[2]].map((p, i) => (
            <circle key={i} className="xd-pad" cx={P(...p)[0]} cy={P(...p)[1]} r="4" />
          ))}
        </g>

        {/* Alignment guides */}
        <g className="xd-guides">
          <path d={guides(...FP.desk, 70)} />
          <path d={guides(...FP.cab, 90)} />
          <path d={guides(...FP.mail, 120)} />
          <path d={seg([0, 0, WZ0], [0, 0, 0]) + seg([0, WL, WZ0], [0, WL, 0]) + seg([WL, 0, WZ0], [WL, 0, 0])} />
        </g>

        {/* Back wall: two lifted panels meeting at the corner */}
        <g className="xd-layer xd-l-wall">
          <ellipse className="xd-aura" cx="500" cy="330" rx="260" ry="150" fill="url(#xd-glow)" opacity=".5" />
          <polygon className="xd-panel" points={pts([[0, 0, WZ0], [0, WL, WZ0], [0, WL, WZ1], [0, 0, WZ1]])} />
          <polygon className="xd-panel" points={pts([[0, 0, WZ0], [WL, 0, WZ0], [WL, 0, WZ1], [0, 0, WZ1]])} />
          <path className="xd-edge-active" d={d([[0, WL, WZ0], [0, 0, WZ0], [WL, 0, WZ0]])} />
          <path className="xd-edge" d={d([[0, WL, WZ1], [0, 0, WZ1], [WL, 0, WZ1]]) + seg([0, 0, WZ0], [0, 0, WZ1])} />
          {/* bookshelf (u = 0 plane) */}
          <polygon className="xd-frame" points={pts([[0, 50, 311], [0, 282, 311], [0, 282, 477], [0, 50, 477]])} />
          <path className="xd-shelf" d={seg([0, 50, 365], [0, 282, 365]) + seg([0, 50, 419], [0, 282, 419]) + seg([0, 50, 311], [0, 282, 311])} />
          <path className="xd-book xd-book-a" d={bookPaths[0]} />
          <path className="xd-book xd-book-b" d={bookPaths[1]} />
          <path className="xd-book xd-book-c" d={bookPaths[2]} />
          {/* project frame (v = 0 plane): a small architecture sketch */}
          <g transform={`matrix(1 .5 0 1 ${fx} ${fy})`}>
            <rect className="xd-frame" x="0" y="0" width="180" height="140" rx="3" />
            <rect className="xd-frame xd-frame-in" x="9" y="9" width="162" height="122" rx="2" />
            <rect className="xd-node" x="22" y="24" width="48" height="28" rx="3" />
            <rect className="xd-node xd-node-a" x="110" y="24" width="48" height="28" rx="3" />
            <rect className="xd-node" x="66" y="88" width="48" height="28" rx="3" />
            <path className="xd-link" d="M70 38H110M46 52V70H90V88M134 52V70H90" />
          </g>
        </g>

        {/* Desk and monitor */}
        <g className="xd-layer xd-l-desk">
          <ellipse cx="500" cy="500" rx="210" ry="120" fill="url(#xd-glow)" opacity=".7" />
          {/* back legs, then slab */}
          <path className="xd-leg" d={seg([78, 108, 70], [78, 108, 116]) + seg([262, 108, 70], [262, 108, 116]) + seg([78, 232, 70], [78, 232, 116]) + seg([262, 232, 70], [262, 232, 116])} />
          <Box u0={70} u1={270} v0={100} v1={240} z0={116} z1={130} k="xd-desk" />
          {/* keyboard */}
          <Box u0={110} u1={200} v0={200} v1={222} z0={130} z1={134} k="xd-key" />
          {/* monitor: neck, foot, body, screen */}
          <Box u0={160} u1={180} v0={150} v1={160} z0={130} z1={152} k="xd-neck" />
          <Box u0={130} u1={210} v0={140} v1={178} z0={130} z1={135} k="xd-foot" />
          <polygon className="xd-fu xd-bezel" points={pts([[268, 158, 147], [268, 170, 147], [268, 170, 288], [268, 158, 288]])} />
          <polygon className="xd-top xd-bezel" points={pts([[72, 158, 288], [268, 158, 288], [268, 170, 288], [72, 170, 288]])} />
          <g transform={`matrix(1 .5 0 1 ${sx} ${sy})`}>
            <rect className="xd-bezel-face" x="-8" y="-8" width="196" height="141" rx="5" />
            <rect className="xd-screen" x="0" y="0" width="180" height="125" rx="2" />
            <path className="xd-screen-bar" d="M0 17H180" />
            <circle className="xd-dot" cx="10" cy="9" r="2.4" />
            <circle className="xd-dot" cx="19" cy="9" r="2.4" />
            <circle className="xd-dot xd-dot-t" cx="28" cy="9" r="2.4" />
            <text className="xd-prompt" x="12" y="46">{'> dotnet run'}</text>
            <rect className="xd-cursor" x="128" y="35" width="8" height="14" />
            <path className="xd-code xd-code-a" d="M12 66H70M12 80H118M12 94H46" />
            <path className="xd-code xd-code-b" d="M82 66H130M130 94H168" />
            <path className="xd-code xd-code-t" d="M12 110H40M52 110H108" />
          </g>
          <path className="xd-edge-active" d={d([[72, 170, 147], [268, 170, 147], [268, 170, 288], [72, 170, 288]], true)} />
        </g>

        {/* Filing cabinet */}
        <g className="xd-layer xd-l-cab">
          <Box u0={10} u1={58} v0={270} v1={318} z0={90} z1={185} k="xd-cabinet" />
          <path className="xd-edge" d={seg([10, 318, 122], [58, 318, 122]) + seg([10, 318, 154], [58, 318, 154])} />
          <path className="xd-handle" d={seg([28, 318, 106], [40, 318, 106]) + seg([28, 318, 138], [40, 318, 138]) + seg([28, 318, 170], [40, 318, 170])} />
        </g>

        {/* Mailbox */}
        <g className="xd-layer xd-l-mail">
          <Box u0={270} u1={318} v0={10} v1={58} z0={120} z1={178} k="xd-mailbox" />
          <path className="xd-edge" d={seg([270, 58, 160], [318, 58, 160])} />
          <path className="xd-handle" d={seg([282, 58, 144], [306, 58, 144])} />
          <path className="xd-handle" d={seg([318, 22, 178], [318, 22, 212]) + seg([318, 22, 212], [318, 40, 212])} />
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
