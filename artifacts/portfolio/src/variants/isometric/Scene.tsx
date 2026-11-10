import { VariantStage, type HotspotPositions, type SceneProps } from '../Stage';
import './isometric.css';

/*
 * Isometric blueprint. One projection: u runs down-left along the left wall's base, v down-right
 * along the right wall's base, z is height in px. Back corner of the floor sits at (400, 190).
 */
const OX = 400, OY = 190, SX = 48, SY = 24, N = 7, H = 160;
type P2 = [number, number];
const px = (u: number, v: number, z = 0): P2 => [OX + SX * (v - u), OY + SY * (u + v) - z];
const pt = (u: number, v: number, z = 0) => px(u, v, z).join(',');
const poly = (...pts: [number, number, number][]) => pts.map(([u, v, z]) => pt(u, v, z)).join(' ');
const r1 = (n: number) => Math.round(n * 10) / 10;

/** Hotspot centres in % of the 800x600 stage. */
const at = (u: number, v: number, z: number) => {
  const [x, y] = px(u, v, z);
  return { x: r1((x / 800) * 100), y: r1((y / 600) * 100) };
};
const positions: HotspotPositions = {
  explorer: { ...at(1.25, 3.0, 65), mobile: { x: 60, y: 38 } },
  skills: { ...at(2.4, 0.7, 118), mobile: { x: 34, y: 17 } },
  projects: { ...at(0, 6.05, 122), mobile: { x: 80, y: 14 } },
  experience: { ...at(1.5, 6.15, 35), mobile: { x: 77, y: 60 } },
  contact: { ...at(4.6, 0.5, 60), mobile: { x: 22, y: 52 } },
};

/** Dimension line between two screen points with oblique ticks and extension lines from the room. */
function Dim({ a, b, from }: { a: P2; b: P2; from: [P2, P2] }) {
  const tick = (p: P2) => <line x1={p[0] - 4} y1={p[1] + 4} x2={p[0] + 4} y2={p[1] - 4} />;
  const over = (p: P2, q: P2): P2 => [p[0] + (p[0] - q[0]) * 0.12, p[1] + (p[1] - q[1]) * 0.12];
  return (
    <g className="iso-dim">
      <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} />
      {tick(a)}{tick(b)}
      <line className="iso-ext" x1={from[0][0]} y1={from[0][1]} x2={over(a, from[0])[0]} y2={over(a, from[0])[1]} />
      <line className="iso-ext" x1={from[1][0]} y1={from[1][1]} x2={over(b, from[1])[0]} y2={over(b, from[1])[1]} />
    </g>
  );
}

const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const BOOKS = [
  [0.2, 20], [0.14, 24], [0.18, 17], [0.16, 22], [0.22, 19], [0.13, 25], [0.19, 21], [0.15, 18],
];

export default function IsometricScene({ onOpen }: SceneProps) {
  const gridU = range(N - 1).map((i) => `M${pt(i + 1, 0)}L${pt(i + 1, N)}`).join('');
  const gridV = range(N - 1).map((i) => `M${pt(0, i + 1)}L${pt(N, i + 1)}`).join('');
  // Door swing arc on the floor (hinge at u=6.8, v=0, leaf 1.3 long)
  const swing = range(10).map((i) => { const t = (i / 9) * (Math.PI / 2); return pt(6.8 - 1.3 * Math.cos(t), 1.3 * Math.sin(t)); }).join(' ');
  const [mx, my] = px(0.55, 1.0, 80); // monitor screen plane
  const [fx, fy] = px(0, 5.45, 100); // frame plane
  const [sx, sy] = px(3.5, 0.7, 0); // shelf plane
  const [cx, cy] = px(1.5, 5.4, 0); // cabinet face
  const [bx, by] = px(5.0, 0.5, 76); // mailbox face
  const corner = px(0, 0, 0), cornerTop = px(0, 0, H), centre = px(3.5, 3.5);
  const dl = [px(8, 0), px(8, N)], dr = [px(N, 8), px(0, 8)], base = px(N, 0)[1];
  const mid = (p: P2, q: P2) => `${(p[0] + q[0]) / 2} ${(p[1] + q[1]) / 2}`;

  return (
    <VariantStage onOpen={onOpen} positions={positions}>
      <svg viewBox="0 0 800 600" aria-hidden="true" focusable="false">
        <defs>
          <pattern id="iso-hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="5" className="iso-hatch-line" />
          </pattern>
          <radialGradient id="iso-glow" cx=".5" cy=".5" r=".5">
            <stop offset="0" stopColor="#5CE1F2" stopOpacity=".34" />
            <stop offset="1" stopColor="#5CE1F2" stopOpacity="0" />
          </radialGradient>
          <clipPath id="iso-screen-clip">
            <polygon points={poly([0.55, 1.0, 80], [0.55, 4.4, 80], [0.55, 4.4, 142], [0.55, 1.0, 142])} />
          </clipPath>
        </defs>

        {/* Room shell: walls and floor */}
        <polygon className="iso-wall" points={poly([0, 0, 0], [N, 0, 0], [N, 0, H], [0, 0, H])} />
        <polygon className="iso-wall iso-wall-r" points={poly([0, 0, 0], [0, N, 0], [0, N, H], [0, 0, H])} />
        <polygon className="iso-floor" points={poly([0, 0, 0], [N, 0, 0], [N, N, 0], [0, N, 0])} />
        <path className="iso-grid" d={gridU + gridV} />
        <path className="iso-datum" d={`M${pt(0, 0, 64)}L${pt(N, 0, 64)}M${pt(0, 0, 64)}L${pt(0, N, 64)}`} />

        {/* Edges */}
        <g className="iso-l iso-edge">
          <polyline points={poly([N, 0, 0], [0, 0, 0], [0, N, 0])} />
          <polyline points={poly([N, 0, H], [0, 0, H], [0, N, H])} />
          <polyline points={poly([N, 0, 0], [N, N, 0], [0, N, 0])} />
        </g>
        <line className="iso-a" x1={corner[0]} y1={corner[1]} x2={cornerTop[0]} y2={cornerTop[1]} />

        {/* Hatched section cuts: wall ends and floor slab */}
        <g className="iso-cut">
          <polygon points={poly([N, 0, 0], [N, -0.35, 0], [N, -0.35, H], [N, 0, H])} />
          <polygon points={poly([0, N, 0], [-0.35, N, 0], [-0.35, N, H], [0, N, H])} />
          <polygon points={poly([N, 0, 0], [N, N, 0], [N, N, -14], [N, 0, -14])} />
          <polygon points={poly([N, N, 0], [0, N, 0], [0, N, -14], [N, N, -14])} />
        </g>

        {/* Centre mark */}
        <g className="iso-centre">
          <line x1={centre[0] - 9} y1={centre[1]} x2={centre[0] + 9} y2={centre[1]} />
          <line x1={centre[0]} y1={centre[1] - 9} x2={centre[0]} y2={centre[1] + 9} />
          <circle cx={centre[0]} cy={centre[1]} r="4" />
        </g>

        {/* Entry door on the left wall, swing arc on the floor */}
        <g className="iso-l">
          <polygon points={poly([5.5, 0, 0], [6.8, 0, 0], [6.8, 0, 118], [5.5, 0, 118])} className="iso-door" />
          <polygon points={poly([5.62, 0, 0], [6.68, 0, 0], [6.68, 0, 106], [5.62, 0, 106])} className="iso-thin" />
          <polyline points={swing} className="iso-dash" />
          <polyline points={poly([6.8, 0, 0], [6.8, 1.3, 0])} className="iso-dash" />
        </g>
        <circle className="iso-fill-a" cx={px(5.72, 0, 56)[0]} cy={px(5.72, 0, 56)[1]} r="2.6" />

        {/* Mailbox on the left wall beside the entry */}
        <g className="iso-l">
          <polygon points={poly([4.2, 0.5, 76], [5.0, 0.5, 76], [5.0, 0.5, 104], [4.2, 0.5, 104])} className="iso-body" />
          <polygon points={poly([4.2, 0, 104], [4.2, 0.5, 104], [5.0, 0.5, 104], [5.0, 0, 104])} className="iso-body" />
          <polygon points={poly([4.2, 0, 76], [4.2, 0.5, 76], [4.2, 0.5, 104], [4.2, 0, 104])} className="iso-body" />
          <g transform={`matrix(-48 24 0 -1 ${bx} ${by})`}>
            <rect x="0.1" y="12" width="0.6" height="3" className="iso-thin" />
          </g>
          <polyline points={poly([4.85, 0.5, 104], [4.85, 0.5, 120], [4.5, 0.5, 120])} className="iso-a" />
        </g>
        <polygon className="iso-fill-a" points={poly([4.5, 0.5, 120], [4.2, 0.5, 120], [4.2, 0.5, 112], [4.5, 0.5, 112])} />

        {/* Bookshelf on the left wall */}
        <g className="iso-l">
          <polygon points={poly([1.3, 0.7, 0], [3.5, 0.7, 0], [3.5, 0.7, 140], [1.3, 0.7, 140])} className="iso-body" />
          <polygon points={poly([1.3, 0, 140], [1.3, 0.7, 140], [3.5, 0.7, 140], [3.5, 0, 140])} className="iso-body" />
          <polygon points={poly([3.5, 0, 0], [3.5, 0.7, 0], [3.5, 0.7, 140], [3.5, 0, 140])} className="iso-body" />
          <g transform={`matrix(-48 24 0 -1 ${sx} ${sy})`}>
            {range(5).map((r) => (
              <g key={r}>
                <line x1="0" y1={r * 28} x2="2.2" y2={r * 28} />
                {BOOKS.map(([w, h], b) => {
                  const x = 0.1 + BOOKS.slice(0, b).reduce((s, [bw]) => s + bw + 0.045, 0);
                  const bh = Math.min(h + ((r * 3 + b) % 3) * 2 - 2, 25);
                  return <rect key={b} x={x} y={r * 28} width={w} height={bh} className={(r + b) % 4 === 1 ? 'iso-book-a' : 'iso-book'} />;
                })}
              </g>
            ))}
            <line x1="0" y1="140" x2="2.2" y2="140" />
          </g>
        </g>

        {/* Framed project drawing on the right wall */}
        <g className="iso-l">
          <polygon points={poly([0, 5.3, 92], [0, 6.85, 92], [0, 6.85, 152], [0, 5.3, 152])} className="iso-body" />
          <g transform={`matrix(48 24 0 -1 ${fx} ${fy})`}>
            <rect x="0" y="-8" width="1.4" height="52" className="iso-mat" />
            <rect x="0.15" y="0" width="1.1" height="36" className="iso-thin" />
            <rect x="0.28" y="22" width="0.34" height="9" />
            <rect x="0.78" y="22" width="0.34" height="9" />
            <rect x="0.53" y="6" width="0.34" height="9" className="iso-book-a" />
            <polyline points="0.45,22 0.45,18.5 0.7,18.5 0.7,15" className="iso-thin" />
            <polyline points="0.95,22 0.95,18.5 0.7,18.5" className="iso-thin" />
            <line x1="0.28" y1="3" x2="1.12" y2="3" className="iso-thin" />
          </g>
        </g>

        {/* Filing cabinet */}
        <g className="iso-l">
          <polygon points={poly([0.1, 5.4, 70], [1.5, 5.4, 70], [1.5, 6.9, 70], [0.1, 6.9, 70])} className="iso-body" />
          <polygon points={poly([1.5, 5.4, 0], [1.5, 6.9, 0], [1.5, 6.9, 70], [1.5, 5.4, 70])} className="iso-body" />
          <polygon points={poly([0.1, 6.9, 0], [1.5, 6.9, 0], [1.5, 6.9, 70], [0.1, 6.9, 70])} className="iso-body iso-body-dim" />
          <g transform={`matrix(48 24 0 -1 ${cx} ${cy})`}>
            {range(3).map((d) => (
              <g key={d}>
                <rect x="0.08" y={d * 23 + 2} width="1.34" height="19" className="iso-thin" />
                <line x1="0.5" y1={d * 23 + 14} x2="1.0" y2={d * 23 + 14} className="iso-a" />
                <rect x="0.5" y={d * 23 + 5} width="0.5" height="4" className="iso-thin" />
              </g>
            ))}
          </g>
        </g>

        {/* Desk */}
        <g className="iso-l">
          <polyline points={poly([2.6, 0.4, 0], [2.6, 0.4, 60])} />
          <polyline points={poly([2.6, 5.0, 0], [2.6, 5.0, 60])} />
          <polyline points={poly([0.3, 5.0, 0], [0.3, 5.0, 60])} />
          <polyline points={poly([2.2, 0.4, 20], [2.2, 5.0, 20])} className="iso-thin" />
          <polygon points={poly([0.3, 0.4, 65], [2.6, 0.4, 65], [2.6, 5.0, 65], [0.3, 5.0, 65])} className="iso-top" />
          <polyline points={poly([2.6, 0.4, 60], [2.6, 5.0, 60], [0.3, 5.0, 60])} />
          <polyline points={poly([2.6, 0.4, 65], [2.6, 0.4, 60])} />
          <polygon points={poly([1.4, 1.5, 65], [2.0, 1.5, 65], [2.0, 3.3, 65], [1.4, 3.3, 65])} className="iso-thin iso-body" />
          <path className="iso-thin" d={`M${pt(1.55, 1.5, 65)}L${pt(1.55, 3.3, 65)}M${pt(1.7, 1.5, 65)}L${pt(1.7, 3.3, 65)}M${pt(1.85, 1.5, 65)}L${pt(1.85, 3.3, 65)}`} />
          <polygon points={poly([1.55, 3.7, 65], [1.8, 3.7, 65], [1.8, 3.95, 65], [1.55, 3.95, 65])} className="iso-thin" />
        </g>

        {/* Monitor: glow, stand, bezel, screen with scanline sweep */}
        <ellipse cx="500" cy="150" rx="190" ry="96" fill="url(#iso-glow)" />
        <g className="iso-a-edge">
          <polygon points={poly([0.35, 2.1, 65], [1.2, 2.1, 65], [1.2, 3.3, 65], [0.35, 3.3, 65])} />
          <polygon points={poly([0.45, 2.55, 65], [0.65, 2.55, 65], [0.65, 2.85, 65], [0.45, 2.85, 65])} />
          <polygon points={poly([0.45, 2.55, 65], [0.45, 2.85, 65], [0.45, 2.85, 74], [0.45, 2.55, 74])} />
          <polygon points={poly([0.65, 2.55, 65], [0.65, 2.85, 65], [0.65, 2.85, 74], [0.65, 2.55, 74])} />
          <polygon points={poly([0.55, 4.55, 72], [0.4, 4.55, 72], [0.4, 4.55, 150], [0.55, 4.55, 150])} />
          <polygon points={poly([0.55, 0.85, 150], [0.55, 4.55, 150], [0.4, 4.55, 150], [0.4, 0.85, 150])} />
          <polygon points={poly([0.55, 0.85, 72], [0.55, 4.55, 72], [0.55, 4.55, 150], [0.55, 0.85, 150])} className="iso-bezel" />
        </g>
        <polygon className="iso-screen" points={poly([0.55, 1.0, 80], [0.55, 4.4, 80], [0.55, 4.4, 142], [0.55, 1.0, 142])} />
        <g clipPath="url(#iso-screen-clip)">
          <g transform={`matrix(48 24 0 -1 ${mx} ${my})`}>
            <rect x="0.18" y="46" width="0.35" height="3.2" className="iso-bar" opacity=".8" />
            <rect x="0.62" y="46" width="1.1" height="3.2" className="iso-bar" opacity=".45" />
            <rect x="0.4" y="38" width="1.9" height="3.2" className="iso-bar" opacity=".3" />
            <rect x="0.4" y="30" width="0.9" height="3.2" className="iso-bar" opacity=".42" />
            <rect x="1.45" y="30" width="1.1" height="3.2" className="iso-bar" opacity=".25" />
            <rect x="0.18" y="22" width="1.5" height="3.2" className="iso-bar" opacity=".34" />
            <rect x="0.18" y="14" width="0.7" height="3.2" className="iso-bar" opacity=".5" />
            <g className="iso-sweep">
              <rect x="0" y="62" width="3.4" height="6" className="iso-band" opacity=".05" />
              <rect x="0" y="66" width="3.4" height="6" className="iso-band" opacity=".12" />
              <rect x="0" y="70" width="3.4" height="3" className="iso-band" opacity=".42" />
              <rect x="0" y="73" width="3.4" height="6" className="iso-band" opacity=".12" />
              <rect x="0" y="77" width="3.4" height="6" className="iso-band" opacity=".05" />
            </g>
          </g>
        </g>
        <polygon className="iso-screen-edge" points={poly([0.55, 1.0, 80], [0.55, 4.4, 80], [0.55, 4.4, 142], [0.55, 1.0, 142])} />

        {/* Dimension lines along the floor edges and the wall height */}
        <Dim a={dl[0]} b={dl[1]} from={[px(N, 0), px(N, N)]} />
        <Dim a={dr[0]} b={dr[1]} from={[px(N, N), px(0, N)]} />
        <g className="iso-dim">
          <line x1="38" y1={base} x2="38" y2={base - H} />
          <line x1="34" y1={base + 4} x2="42" y2={base - 4} />
          <line x1="34" y1={base - H + 4} x2="42" y2={base - H - 4} />
          <line className="iso-ext" x1={px(N, 0)[0] - 8} y1={base} x2="30" y2={base} />
          <line className="iso-ext" x1={px(N, 0, H)[0] - 8} y1={base - H} x2="30" y2={base - H} />
        </g>
        <text className="iso-text" transform={`translate(${mid(dl[0], dl[1])}) rotate(26.57)`} y="-7" textAnchor="middle">ROOM_01 / 4.20 m</text>
        <text className="iso-text" transform={`translate(${mid(dr[0], dr[1])}) rotate(-26.57)`} y="-7" textAnchor="middle">// scale 1:40</text>
      </svg>
    </VariantStage>
  );
}

/** Optional aria-hidden decoration rendered inside the hero, behind the heading (see ../scenes.ts). */
export const HeroDecor: import('react').ComponentType | null = null;
