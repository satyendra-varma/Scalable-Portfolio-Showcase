import { useSyncExternalStore } from 'react';
import { experience, projects, skillGroups } from '@/content/room';
import { VariantStage, type HotspotPositions, type SceneProps } from '../Stage';
import './isometric.css';

/*
 * Isometric blueprint, under the lamp. One projection: u runs down-left along the left wall's base,
 * v down-right along the right wall's base, z is height in px. Back corner of the floor sits at (400, 190).
 * The room is drawn once; the phone gets a tighter crop (second viewBox, taller stage) and fewer tiny details.
 */
const OX = 400, OY = 190, SX = 48, SY = 24, N = 7, H = 160;
type P2 = [number, number];
const px = (u: number, v: number, z = 0): P2 => [OX + SX * (v - u), OY + SY * (u + v) - z];
const pt = (u: number, v: number, z = 0) => px(u, v, z).join(',');
const poly = (...pts: [number, number, number][]) => pts.map(([u, v, z]) => pt(u, v, z)).join(' ');
const r1 = (n: number) => Math.round(n * 10) / 10;
const range = (n: number) => Array.from({ length: n }, (_, i) => i);

const DESKTOP_VB = [0, 0, 800, 600] as const;
const PHONE_VB = [150, 18, 596, 490] as const;
type VB = readonly [number, number, number, number];

/** Hotspot centre in % of a viewBox. */
const at = (vb: VB, u: number, v: number, z: number, dx = 0, dy = 0) => {
  const [x, y] = px(u, v, z);
  return { x: r1(((x + dx - vb[0]) / vb[2]) * 100), y: r1(((y + dy - vb[1]) / vb[3]) * 100) };
};
const positions: HotspotPositions = {
  explorer: { ...at(DESKTOP_VB, 0.55, 2.7, 160, 0, -46), mobile: at(PHONE_VB, 0.55, 2.7, 160, 0, -40) },
  skills: { ...at(DESKTOP_VB, 2.4, 0.7, 118, -100, 4), mobile: at(PHONE_VB, 2.4, 0.7, 150, -50, -4) },
  projects: { ...at(DESKTOP_VB, 0, 6.05, 152, 10, -26), mobile: at(PHONE_VB, 0, 6.05, 170, 0, -8) },
  experience: { ...at(DESKTOP_VB, 1.5, 6.15, 0, 6, 22), mobile: at(PHONE_VB, 1.5, 6.15, 20, 0, 40) },
  contact: { ...at(DESKTOP_VB, 4.6, 0.5, 76, -6, 32), mobile: at(PHONE_VB, 4.6, 0.5, 40, -4, 26) },
};

/** Planes as SVG matrices. Local x/y are the plane's own axes; y is height on walls. */
const wallL = (u0: number, v: number, z0 = 0) => { const [x, y] = px(u0, v, z0); return `matrix(-48 24 0 -1 ${x} ${y})`; }; // v = const, local x = u - u0
const wallR = (u: number, v0: number, z0 = 0) => { const [x, y] = px(u, v0, z0); return `matrix(48 24 0 -1 ${x} ${y})`; }; // u = const, local x = v - v0
const floorM = (z: number) => `matrix(48 24 -48 24 ${OX} ${OY - z})`; // local x = v, local y = u

/** Lettering on a wall plane: skewed to the plane. Text is never split; each element holds one whole string. */
const SKEW_L = -26.57, SKEW_R = 26.57;
const mini = (x: number, y: number, skew: number, extra = '') => `translate(${r1(x)} ${r1(y)}) skewY(${skew})${extra}`;

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

/** Skill names short enough to letter along a book spine; imported, never retyped. */
const SPINE_SKILLS = skillGroups.flatMap((g) => g.skills).filter((s) => s.length <= 8);
const BOOKS = [
  [0.2, 20], [0.14, 24], [0.18, 17], [0.16, 22], [0.22, 19], [0.13, 25], [0.19, 21], [0.15, 18],
];
const SHELF_U0 = 1.3, SHELF_W = 2.2, ROW = 28;

const mq = '(max-width: 600px)';
const subscribe = (cb: () => void) => {
  const m = typeof window !== 'undefined' ? window.matchMedia?.(mq) : undefined;
  m?.addEventListener?.('change', cb);
  return () => m?.removeEventListener?.('change', cb);
};
const useIsPhone = () => useSyncExternalStore(subscribe, () => (typeof window !== 'undefined' ? window.matchMedia?.(mq)?.matches ?? false : false), () => false);

const stop = (offset: number, opacity: number, token = '--accent') => (
  <stop offset={offset} style={{ stopColor: `var(${token})`, stopOpacity: opacity }} />
);

export default function IsometricScene({ onOpen }: SceneProps) {
  const phone = useIsPhone();
  const vb = phone ? PHONE_VB : DESKTOP_VB;
  const gridU = range(N - 1).map((i) => `M${pt(i + 1, 0)}L${pt(i + 1, N)}`).join('');
  const gridV = range(N - 1).map((i) => `M${pt(0, i + 1)}L${pt(N, i + 1)}`).join('');
  // Door swing arc on the floor (hinge at u=6.8, v=0, leaf 1.3 long)
  const swing = range(10).map((i) => { const t = (i / 9) * (Math.PI / 2); return pt(6.8 - 1.3 * Math.cos(t), 1.3 * Math.sin(t)); }).join(' ');
  const [mx, my] = px(0.55, 1.0, 80); // monitor screen plane
  const [cx, cy] = px(1.5, 5.4, 0); // cabinet face
  const corner = px(0, 0, 0), cornerTop = px(0, 0, H), centre = px(3.5, 3.5);
  const dl = [px(8, 0), px(8, N)], dr = [px(N, 8), px(0, 8)], base = px(N, 0)[1];
  const mid = (p: P2, q: P2) => `${(p[0] + q[0]) / 2} ${(p[1] + q[1]) / 2}`;
  const grain = range(10).map((k) => {
    const u = 0.42 + k * 0.21;
    return `M${pt(u, 0.5, 65)}` + range(8).map((j) => { const v = 0.5 + (j + 1) * 0.55; return `L${pt(u + 0.03 * Math.sin(v * 2.1 + k), v, 65)}`; }).join('');
  }).join('');
  const keyGrid =
    range(3).map((k) => `M${pt(1.4 + (k + 1) * 0.15, 1.5, 67)}L${pt(1.4 + (k + 1) * 0.15, 3.3, 67)}`).join('') +
    range(11).map((j) => `M${pt(1.4, 1.5 + (j + 1) * 0.15, 67)}L${pt(2.0, 1.5 + (j + 1) * 0.15, 67)}`).join('');
  const deskTop = poly([0.3, 0.4, 65], [2.6, 0.4, 65], [2.6, 5.0, 65], [0.3, 5.0, 65]);

  // Lamp: clamp on the desk's front-right corner, two arm segments, conical shade aimed at the desk.
  const lampBase = px(2.42, 4.72, 70), elbow = px(2.3, 4.95, 140), pivot = px(1.5, 4.5, 128);
  const mouth: P2 = [pivot[0] - 15, pivot[1] + 20], mr = 20, mry = 7.5;
  const pool = px(1.8, 3.95, 65), prx = 84, pry = 40;
  const shade = `M${pivot[0] - 6} ${pivot[1]}L${mouth[0] - mr} ${mouth[1]}A${mr} ${mry} 0 0 0 ${mouth[0] + mr} ${mouth[1]}L${pivot[0] + 6} ${pivot[1]}Z`;
  const cone = `M${mouth[0] - mr} ${mouth[1]}L${pool[0] - prx * 0.88} ${pool[1] + 8}A${prx * 0.9} ${pry * 0.9} 0 0 0 ${pool[0] + prx * 0.88} ${pool[1] + 8}L${mouth[0] + mr} ${mouth[1]}A${mr} ${mry} 0 0 1 ${mouth[0] - mr} ${mouth[1]}Z`;
  const floorPool = px(3.3, 3.5, 0);

  // Cast shadows on the floor (cross-hatched), as footprints shifted away from the lamp.
  const shadowDesk = poly([0.3, 0.4, 0], [2.6, 0.4, 0], [3.4, 0.9, 0], [3.4, 5.5, 0], [1.1, 5.5, 0], [0.3, 5.0, 0]);
  const shadowChair = poly([3.0, 2.4, 0], [3.9, 2.3, 0], [4.45, 2.75, 0], [4.25, 3.45, 0], [3.4, 3.55, 0], [3.0, 3.1, 0]);
  const shadowCab = poly([0.1, 5.4, 0], [1.5, 5.4, 0], [2.3, 5.8, 0], [2.3, 7.0, 0], [0.1, 7.0, 0]);

  const spines: { u: number; z: number; len: number; name: string }[] = [];
  const books = range(5).flatMap((r) => {
    const total = BOOKS.reduce((s, [bw]) => s + bw, 0);
    const k = (SHELF_W - 0.2 - BOOKS.length * 0.03) / total;
    return BOOKS.map(([w, h], b) => {
      const x = 0.1 + BOOKS.slice(0, b).reduce((s, [bw]) => s + bw * k + 0.03, 0);
      const bh = Math.min(h + ((r * 3 + b) % 3) * 2 - 2, 25);
      const lean = r === 2 && b === 7;
      const idx = r * 3 + b;
      const name = SPINE_SKILLS[(idx * 5) % SPINE_SKILLS.length];
      if (!phone && !lean && (idx % 2 === 0 || b === 1) && name.length * 2.4 + 3 <= bh) spines.push({ u: SHELF_U0 + x + (w * k) / 2, z: r * ROW, len: bh, name });
      return { x, w: w * k, bh, r, b, lean, cls: (r + b) % 4 === 1 ? 'iso-book-a' : `iso-book iso-bk${(r + b) % 3}` };
    });
  });

  return (
    <VariantStage onOpen={onOpen} positions={positions}>
      <svg viewBox={vb.join(' ')} aria-hidden="true" focusable="false" className={phone ? 'iso-svg-phone' : 'iso-svg-desk'}>
        <defs>
          {/* 45-degree section hatching, cross-hatched shadows, perforated metal */}
          <pattern id="iso-hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="5" className="iso-hatch-line" />
          </pattern>
          <pattern id="iso-xhatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" className="iso-xhatch-line" />
            <line x1="0" y1="0" x2="6" y2="0" className="iso-xhatch-line" />
          </pattern>
          <pattern id="iso-perf" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="skewY(-26.57)">
            <circle cx="2.5" cy="2.5" r="1" className="iso-perf-hole" />
          </pattern>
          {/* Light, all from the accent */}
          <radialGradient id="iso-glow-wall" cx=".5" cy=".5" r=".5">{stop(0, 0.34)}{stop(0.55, 0.12)}{stop(1, 0)}</radialGradient>
          <radialGradient id="iso-glow-desk" cx=".5" cy=".5" r=".5">{stop(0, 0.3)}{stop(1, 0)}</radialGradient>
          <radialGradient id="iso-pool" cx=".5" cy=".5" r=".5">{stop(0, 0.5)}{stop(0.6, 0.2)}{stop(1, 0)}</radialGradient>
          <radialGradient id="iso-pool-core" cx=".5" cy=".5" r=".5">{stop(0, 0.34, '--evidence')}{stop(1, 0, '--evidence')}</radialGradient>
          <radialGradient id="iso-pool-floor" cx=".5" cy=".5" r=".5">{stop(0, 0.2)}{stop(1, 0)}</radialGradient>
          <linearGradient id="iso-cone" gradientUnits="userSpaceOnUse" x1="0" y1={mouth[1]} x2="0" y2={pool[1] + 10}>{stop(0, 0.22)}{stop(1, 0)}</linearGradient>
          <radialGradient id="iso-vignette" gradientUnits="userSpaceOnUse" cx="490" cy="272" r="340">
            <stop offset="0" style={{ stopColor: 'var(--hot)', stopOpacity: 0 }} />
            <stop offset=".5" style={{ stopColor: 'var(--hot)', stopOpacity: 0 }} />
            <stop offset="1" style={{ stopColor: 'var(--hot)', stopOpacity: 0.78 }} />
          </radialGradient>
          <clipPath id="iso-screen-clip">
            <polygon points={poly([0.55, 1.0, 80], [0.55, 4.4, 80], [0.55, 4.4, 142], [0.55, 1.0, 142])} />
          </clipPath>
          <clipPath id="iso-wallr-clip"><polygon points={poly([0, 0, 0], [0, N, 0], [0, N, H], [0, 0, H])} /></clipPath>
          <clipPath id="iso-desk-clip"><polygon points={deskTop} /></clipPath>
          <clipPath id="iso-room-clip">
            <polygon points={poly([N, 0, H], [0, 0, H], [0, N, H], [0, N, 0], [N, N, 0], [N, 0, 0])} />
          </clipPath>
          <clipPath id="iso-shadow-clip">
            <polygon points={shadowDesk} /><polygon points={shadowChair} /><polygon points={shadowCab} />
          </clipPath>
        </defs>

        {/* Room shell: walls and floor */}
        <polygon className="iso-wall" points={poly([0, 0, 0], [N, 0, 0], [N, 0, H], [0, 0, H])} />
        <polygon className="iso-wall iso-wall-r" points={poly([0, 0, 0], [0, N, 0], [0, N, H], [0, 0, H])} />
        <polygon className="iso-floor" points={poly([0, 0, 0], [N, 0, 0], [N, N, 0], [0, N, 0])} />
        <path className="iso-grid" d={gridU + gridV} />
        <path className="iso-datum" d={`M${pt(0, 0, 64)}L${pt(N, 0, 64)}M${pt(0, 0, 64)}L${pt(0, N, 64)}`} />

        {/* Light on the room: the monitor's glow on the back wall, the lamp's pool on the floor */}
        <g clipPath="url(#iso-wallr-clip)">
          <g transform={wallR(0, 0)}><ellipse cx="2.75" cy="112" rx="3.6" ry="66" fill="url(#iso-glow-wall)" /></g>
        </g>
        <ellipse cx={floorPool[0]} cy={floorPool[1]} rx="128" ry="64" fill="url(#iso-pool-floor)" />

        {/* Cast shadows: cross-hatch clipped to the shadow shapes (no blur) */}
        <g clipPath="url(#iso-shadow-clip)"><rect x="0" y="0" width="800" height="600" fill="url(#iso-xhatch)" /></g>

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

        {/* Mailbox on the left wall beside the entry: Contact */}
        <g data-object="contact">
          <g className="iso-l">
            <polygon points={poly([4.2, 0.5, 76], [5.0, 0.5, 76], [5.0, 0.5, 104], [4.2, 0.5, 104])} className="iso-body" />
            <polygon points={poly([4.2, 0, 104], [4.2, 0.5, 104], [5.0, 0.5, 104], [5.0, 0, 104])} className="iso-top" />
            <polygon points={poly([5.0, 0, 76], [5.0, 0.5, 76], [5.0, 0.5, 104], [5.0, 0, 104])} className="iso-body iso-body-dim" />
            <g transform={wallL(4.2, 0.5, 0)}>
              <rect x="0.15" y="90" width="0.5" height="3.5" className="iso-thin" />
              <rect x="0.15" y="80" width="0.5" height="6" className="iso-thin" />
            </g>
            <polyline points={poly([4.85, 0.5, 104], [4.85, 0.5, 124], [4.5, 0.5, 124])} className="iso-a" />
          </g>
          <polygon className="iso-fill-a" points={poly([4.5, 0.5, 124], [4.2, 0.5, 124], [4.2, 0.5, 116], [4.5, 0.5, 116])} />
          <polygon className="iso-hl" points={poly([4.2, 0.5, 76], [5.0, 0.5, 76], [5.0, 0, 76], [5.0, 0, 104], [4.2, 0, 104], [4.2, 0.5, 104])} />
        </g>

        {/* Bookshelf on the left wall: Skills. Spines carry skill names. */}
        <g data-object="skills">
          <g className="iso-l">
            <polygon points={poly([1.3, 0.7, 0], [3.5, 0.7, 0], [3.5, 0.7, 140], [1.3, 0.7, 140])} className="iso-body" />
            <polygon points={poly([1.3, 0, 140], [1.3, 0.7, 140], [3.5, 0.7, 140], [3.5, 0, 140])} className="iso-top" />
            <polygon points={poly([3.5, 0, 0], [3.5, 0.7, 0], [3.5, 0.7, 140], [3.5, 0, 140])} className="iso-body iso-body-dim" />
            <g transform={wallL(SHELF_U0, 0.7)}>
              {range(5).map((r) => <line key={`s${r}`} x1="0" y1={r * ROW} x2={SHELF_W} y2={r * ROW} />)}
              {books.map(({ x, w, bh, r, b, lean, cls }) => lean
                ? <polygon key={`${r}-${b}`} className={cls} points={`${x},${r * ROW} ${x + w},${r * ROW} ${x + w - 0.1},${r * ROW + bh} ${x - 0.1},${r * ROW + bh}`} />
                : <rect key={`${r}-${b}`} x={x} y={r * ROW} width={w} height={bh} className={cls} />)}
              {range(5).map((r) => (
                <g key={`be${r}`}>
                  <polyline points={`0.04,${r * ROW + 12} 0.04,${r * ROW} 0.12,${r * ROW}`} className="iso-bookend" />
                  <polyline points={`${SHELF_W - 0.04},${r * ROW + 12} ${SHELF_W - 0.04},${r * ROW} ${SHELF_W - 0.12},${r * ROW}`} className="iso-bookend" />
                </g>
              ))}
              <line x1="0" y1="140" x2={SHELF_W} y2="140" />
            </g>
          </g>
          {spines.map((s, i) => {
            const [x, y] = px(s.u, 0.7, s.z + 2);
            return <text key={i} className="iso-mini iso-spine" transform={`translate(${r1(x + 1.4)} ${r1(y)}) skewY(${SKEW_L}) rotate(-90)`}>{s.name}</text>;
          })}
          <polygon className="iso-hl" points={poly([1.3, 0.7, 0], [3.5, 0.7, 0], [3.5, 0, 0], [3.5, 0, 140], [1.3, 0, 140], [1.3, 0.7, 140])} />
        </g>

        {/* Framed project drawing on the right wall: Projects */}
        <g data-object="projects">
          <g className="iso-l">
            <polygon points={poly([0, 5.3, 92], [0, 6.85, 92], [0, 6.85, 152], [0, 5.3, 152])} className="iso-body" />
            <g transform={wallR(0, 5.45, 100)}>
              <rect x="0" y="-8" width="1.4" height="52" className="iso-mat" />
              <rect x="0.1" y="10" width="1.2" height="36" className="iso-thin" />
              <rect x="0.22" y="26" width="0.34" height="6" />
              <rect x="0.84" y="26" width="0.34" height="6" />
              <rect x="0.53" y="38" width="0.34" height="6" className="iso-book-a" />
              <polyline points="0.39,32 0.39,35 0.7,35 0.7,38" className="iso-thin" />
              <polyline points="1.01,32 1.01,35 0.7,35" className="iso-thin" />
              <line x1="0.1" y1="22" x2="1.3" y2="22" className="iso-thin" />
              </g>
          </g>
          {projects.slice(0, 2).map((p, i) => {
            const [x, y] = px(0, 6.075, 100 + 17 - i * 5);
            return <text key={p.name} className="iso-mini" textAnchor="middle" transform={mini(x, y + 1.5, SKEW_R)}>{p.name}</text>;
          })}
          <polygon className="iso-hl" points={poly([0, 5.3, 92], [0, 6.85, 92], [0, 6.85, 152], [0, 5.3, 152])} />
        </g>

        {/* Filing cabinet: Experience. Drawers carry the employers; the side is perforated metal. */}
        <g data-object="experience">
          <g className="iso-l">
            <polygon points={poly([0.1, 5.4, 70], [1.5, 5.4, 70], [1.5, 6.9, 70], [0.1, 6.9, 70])} className="iso-top" />
            <polygon points={poly([1.5, 5.4, 0], [1.5, 6.9, 0], [1.5, 6.9, 70], [1.5, 5.4, 70])} className="iso-body" />
            <polygon points={poly([0.1, 6.9, 0], [1.5, 6.9, 0], [1.5, 6.9, 70], [0.1, 6.9, 70])} className="iso-perf-face" />
            <g transform={`matrix(48 24 0 -1 ${cx} ${cy})`}>
              {range(3).map((d) => (
                <g key={d}>
                  <rect x="0.08" y={d * 23 + 2} width="1.34" height="19" className="iso-thin" />
                  <rect x="0.55" y={d * 23 + 16} width="0.4" height="2.2" className="iso-thin" />
                </g>
              ))}
            </g>
          </g>
          {experience.slice(0, 2).map((e, i) => {
            const [x, y] = px(1.5, 6.15, (2 - i) * 23 + 6);
            return <text key={e.org} className="iso-mini" textAnchor="middle" transform={mini(x, y, SKEW_R)}>{e.org}</text>;
          })}
          <polygon className="iso-hl" points={poly([1.5, 5.4, 0], [1.5, 6.9, 0], [0.1, 6.9, 0], [0.1, 6.9, 70], [0.1, 5.4, 70], [1.5, 5.4, 70])} />
        </g>

        {/* Desk: legs, top with wood grain, hatched slab cuts */}
        <g className="iso-l">
          <polygon points={poly([2.6, 0.4, 0], [2.6, 0.52, 0], [2.6, 0.52, 60], [2.6, 0.4, 60])} className="iso-body" />
          <polygon points={poly([2.6, 0.4, 0], [2.48, 0.4, 0], [2.48, 0.4, 60], [2.6, 0.4, 60])} className="iso-body iso-body-dim" />
          <polygon points={poly([2.6, 4.88, 0], [2.6, 5.0, 0], [2.6, 5.0, 60], [2.6, 4.88, 60])} className="iso-body" />
          <polygon points={poly([2.6, 5.0, 0], [2.48, 5.0, 0], [2.48, 5.0, 60], [2.6, 5.0, 60])} className="iso-body iso-body-dim" />
          <polygon points={poly([0.3, 4.88, 0], [0.3, 5.0, 0], [0.3, 5.0, 60], [0.3, 4.88, 60])} className="iso-body" />
          <polygon points={poly([0.3, 5.0, 0], [0.18, 5.0, 0], [0.18, 5.0, 60], [0.3, 5.0, 60])} className="iso-body iso-body-dim" />
          <polyline points={poly([2.2, 0.4, 20], [2.2, 5.0, 20])} className="iso-thin" />
          <polygon points={deskTop} className="iso-top" />
          <path d={grain} className="iso-grain" />
        </g>
        <g className="iso-cut">
          <polygon points={poly([2.6, 0.4, 65], [2.6, 5.0, 65], [2.6, 5.0, 60], [2.6, 0.4, 60])} />
          <polygon points={poly([2.6, 5.0, 65], [0.3, 5.0, 65], [0.3, 5.0, 60], [2.6, 5.0, 60])} />
        </g>
        <polyline className="iso-lit" points={poly([2.6, 0.4, 65], [2.6, 5.0, 65], [0.3, 5.0, 65])} />

        {/* Monitor glow spilling onto the desk */}
        <g clipPath="url(#iso-desk-clip)">
          <g transform={floorM(65)}><ellipse cx="2.7" cy="1.25" rx="2.3" ry="1.05" fill="url(#iso-glow-desk)" /></g>
        </g>

        {/* Keyboard with key grid, mouse, monitor cable */}
        <g className="iso-l">
          <polygon points={poly([1.4, 1.5, 65], [2.0, 1.5, 65], [2.0, 3.3, 65], [1.4, 3.3, 65])} className="iso-body iso-thin" />
          <polygon points={poly([2.0, 1.5, 65], [2.0, 3.3, 65], [2.0, 3.3, 68], [2.0, 1.5, 68])} className="iso-body iso-thin" />
          <polygon points={poly([1.4, 3.3, 65], [2.0, 3.3, 65], [2.0, 3.3, 68], [1.4, 3.3, 68])} className="iso-body iso-body-dim iso-thin" />
          <polygon points={poly([1.4, 1.5, 68], [2.0, 1.5, 68], [2.0, 3.3, 68], [1.4, 3.3, 68])} className="iso-top iso-thin" />
          <path d={keyGrid} className="iso-keys" />
          <polygon points={poly([1.85, 1.9, 68], [1.95, 1.9, 68], [1.95, 2.9, 68], [1.85, 2.9, 68])} className="iso-thin" />
          <polygon points={poly([1.55, 3.7, 65], [1.8, 3.7, 65], [1.8, 3.95, 65], [1.55, 3.95, 65])} className="iso-top iso-thin" />
          <polygon points={poly([1.8, 3.7, 65], [1.8, 3.95, 65], [1.8, 3.95, 67], [1.8, 3.7, 67])} className="iso-body iso-thin" />
          <path className="iso-cable" d={`M${pt(0.5, 2.85, 66)}Q${pt(0.36, 3.0, 65)} ${pt(0.36, 3.6, 65)}L${pt(0.36, 4.85, 65)}Q${pt(0.36, 5.03, 65)} ${pt(0.4, 5.03, 58)}L${pt(0.4, 5.03, 10)}Q${pt(0.4, 5.03, 0)} ${pt(0.3, 5.3, 0)}L${pt(0.14, 5.38, 0)}`} />
        </g>

        {/* Office chair in front of the desk (shadow already on the floor) */}
        <g className="iso-l">
          <polyline points={poly([3.45, 2.8, 6], [3.45, 2.8, 36])} className="iso-post" />
          <path className="iso-thin" d={range(5).map((k) => { const a = (k / 5) * Math.PI * 2 + 0.4; return `M${pt(3.45, 2.8, 6)}L${pt(3.45 + 0.62 * Math.cos(a), 2.8 + 0.62 * Math.sin(a), 3)}`; }).join('')} />
          <path className="iso-caster" d={range(5).map((k) => { const a = (k / 5) * Math.PI * 2 + 0.4; return `M${pt(3.45 + 0.62 * Math.cos(a), 2.8 + 0.62 * Math.sin(a), 0)}L${pt(3.45 + 0.62 * Math.cos(a), 2.8 + 0.62 * Math.sin(a), 3)}`; }).join('')} />
          <polygon points={poly([3.0, 2.35, 36], [3.9, 2.35, 36], [3.9, 3.25, 36], [3.0, 3.25, 36])} className="iso-top" />
          <polygon points={poly([3.9, 2.35, 36], [3.9, 3.25, 36], [3.9, 3.25, 31], [3.9, 2.35, 31])} className="iso-body" />
          <polygon points={poly([3.0, 3.25, 36], [3.9, 3.25, 36], [3.9, 3.25, 31], [3.0, 3.25, 31])} className="iso-body iso-body-dim" />
          <polygon points={poly([3.95, 2.45, 44], [3.95, 3.15, 44], [3.95, 3.15, 90], [3.95, 2.45, 90])} className="iso-body" />
          <polygon points={poly([3.95, 3.15, 44], [4.03, 3.15, 44], [4.03, 3.15, 90], [3.95, 3.15, 90])} className="iso-body iso-body-dim" />
          <polyline points={poly([3.95, 2.8, 36], [3.95, 2.8, 44])} className="iso-post" />
          <polyline points={poly([3.0, 3.3, 52], [3.7, 3.3, 52], [3.7, 3.3, 58])} className="iso-thin" />
        </g>

        {/* Monitor: stand, bezel, screen with scanline sweep. Cuts through to the focal hotspot. */}
        <g data-object="explorer">
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
              <rect x="2.2" y="14" width="0.9" height="3.2" className="iso-bar" opacity=".28" />
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
          <polygon className="iso-hl" points={poly([0.55, 0.85, 72], [0.55, 4.55, 72], [0.55, 4.55, 150], [0.55, 0.85, 150])} />
        </g>

        {/* The lamp's light: pool on the desk, cone from the shade, the lamp itself */}
        <g clipPath="url(#iso-desk-clip)">
          <ellipse cx={pool[0]} cy={pool[1]} rx={prx} ry={pry} fill="url(#iso-pool)" />
          <ellipse cx={pool[0]} cy={pool[1]} rx={prx * 0.5} ry={pry * 0.5} fill="url(#iso-pool-core)" />
        </g>
        <path d={cone} fill="url(#iso-cone)" />
        <g className="iso-lamp">
          <polygon points={poly([2.3, 4.6, 70], [2.58, 4.6, 70], [2.58, 4.86, 70], [2.3, 4.86, 70])} className="iso-lamp-fill" />
          <polygon points={poly([2.3, 4.86, 70], [2.58, 4.86, 70], [2.58, 4.86, 65], [2.3, 4.86, 65])} className="iso-lamp-fill" />
          <polygon points={poly([2.58, 4.6, 70], [2.58, 4.86, 70], [2.58, 4.86, 65], [2.58, 4.6, 65])} className="iso-lamp-fill" />
          <polyline points={poly([2.64, 4.6, 70], [2.64, 4.6, 58], [2.3, 4.6, 58])} className="iso-lamp-jaw" />
          <polyline points={`${lampBase[0]},${lampBase[1]} ${elbow[0]},${elbow[1]}`} className="iso-arm" />
          <polyline points={`${elbow[0]},${elbow[1]} ${pivot[0]},${pivot[1]}`} className="iso-arm" />
          <circle cx={lampBase[0]} cy={lampBase[1]} r="2.4" className="iso-joint" />
          <circle cx={elbow[0]} cy={elbow[1]} r="2.4" className="iso-joint" />
          <path d={shade} className="iso-shade" />
          <ellipse cx={mouth[0]} cy={mouth[1]} rx={mr} ry={mry} className="iso-bulb" />
        </g>

        {/* Far corners fall into shade, clipped to the room */}
        <g clipPath="url(#iso-room-clip)"><rect x="0" y="0" width="800" height="600" fill="url(#iso-vignette)" /></g>

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

/**
 * Drafting-sheet furniture behind the title block: a ruler along the top and bottom edges and faint
 * construction circles in the right column. The lettering guides and the dimension line under the name
 * are drawn in CSS on .rv-name.
 */
function IsometricHeroDecor() {
  return (
    <svg width="100%" height="100%" aria-hidden="true" focusable="false" className="iso-decor">
      <defs>
        <pattern id="iso-ruler" width="50" height="9" patternUnits="userSpaceOnUse">
          <path d="M0 0V6M10 0V3M20 0V3M30 0V3M40 0V3" className="iso-ruler-tick" />
        </pattern>
        <pattern id="iso-ruler-b" width="50" height="9" patternUnits="userSpaceOnUse" patternTransform="translate(0 0)">
          <path d="M0 9V3M10 9V6M20 9V6M30 9V6M40 9V6" className="iso-ruler-tick" />
        </pattern>
      </defs>
      <rect x="0" y="1" width="100%" height="9" fill="url(#iso-ruler)" />
      <rect x="0" y="100%" width="100%" height="9" fill="url(#iso-ruler-b)" transform="translate(0 -10)" />
      <g className="iso-construct">
        <circle cx="82%" cy="50%" r="64" />
        <circle cx="82%" cy="50%" r="108" />
        <line x1="62%" y1="50%" x2="100%" y2="50%" />
        <line x1="82%" y1="0" x2="82%" y2="100%" />
      </g>
    </svg>
  );
}
export const HeroDecor: import('react').ComponentType | null = IsometricHeroDecor;
