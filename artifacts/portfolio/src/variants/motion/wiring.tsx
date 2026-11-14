import type { CSSProperties } from 'react';
import type { HotspotId } from '@/components/room/RoomScene';

/**
 * The room's wiring (docs/BRIEF-room-motion.md, Motion B). Power enters at the top of the wall's corner, where the
 * feed from the header's loading bar arrives, and reaches every object along one tree of traces:
 *
 *   corner riser ─┬─ along the back slab ── project frame
 *                 └─ along the left slab ─┬─ bookshelf
 *                                         └─ down the slab's end to the floor ── filing cabinet ─┬─ ground pad
 *                                                                                                └─ hub ─┬─ desk and monitor
 *                                                                                                        └─ mailbox
 *
 * Every segment knows how far it is from the entry point (`at`) and how long it is (`len`), in drawing units.
 * That is all the stylesheet needs to light the tree at one constant speed, and to light each object as its
 * trace arrives. Same projection as layers.tsx (a test keeps the two in step).
 */
type V3 = [number, number, number];
type XY = [number, number];
export const project = (u: number, v: number, z = 0): XY => [560 + u - v, 350 + (u + v) / 2 - z];

const T = 10; // slab thickness: the inner faces of the wall are the planes u = T and v = T
const STRIP = 178; // height of the traces that run along the foot of the wall

const N = {
  top: [T, T, 330], split: [T, T, STRIP],
  frameFoot: [205, T, STRIP], frame: [205, T, 186],
  shelfFoot: [T, 164, STRIP], shelf: [T, 164, 188],
  wallEnd: [T, 320, STRIP], floor: [T, 320, 0], turn: [T, 295, 0],
  cabinet: [70, 295, 0], junction: [330, 295, 0], ground: [330, 336, 0],
  hub: [330, 240, 0], desk: [330, 240, 116],
  mailTurn: [445, 240, 0], mailbox: [445, 70, 0],
} satisfies Record<string, V3>;

export type Segment = { id: string; layer: 'wall' | 'floor'; at: number; len: number; end: number; points: XY[]; d: string };

const path = (points: XY[]) => 'M' + points.map((p) => p.join(',')).join('L');
const length = (points: XY[]) => points.slice(1).reduce((sum, p, i) => sum + Math.hypot(p[0] - points[i][0], p[1] - points[i][1]), 0);
const round = (n: number) => Math.round(n * 10) / 10;

function segment(id: string, layer: Segment['layer'], after: Segment | null, nodes: V3[]): Segment {
  const points = nodes.map((n) => project(...n));
  const at = after ? after.end : 0;
  const len = round(length(points));
  return { id, layer, at, len, end: round(at + len), points, d: path(points) };
}

const riser = segment('riser', 'wall', null, [N.top, N.split]);
const frame = segment('frame', 'wall', riser, [N.split, N.frameFoot, N.frame]);
const shelfRun = segment('shelf-run', 'wall', riser, [N.split, N.shelfFoot]);
const shelf = segment('shelf', 'wall', shelfRun, [N.shelfFoot, N.shelf]);
const wallRun = segment('wall-run', 'wall', shelfRun, [N.shelfFoot, N.wallEnd]);
const drop = segment('drop', 'wall', wallRun, [N.wallEnd, N.floor]);
const cabinet = segment('cabinet', 'floor', drop, [N.floor, N.turn, N.cabinet]);
const bus = segment('bus', 'floor', cabinet, [N.cabinet, N.junction]);
const ground = segment('ground', 'floor', bus, [N.junction, N.ground]);
const hub = segment('hub', 'floor', bus, [N.junction, N.hub]);
const desk = segment('desk', 'floor', hub, [N.hub, N.desk]);
const mailbox = segment('mailbox', 'floor', hub, [N.hub, N.mailTurn, N.mailbox]);

export const segments: Segment[] = [riser, frame, shelfRun, shelf, wallRun, drop, cabinet, bus, ground, hub, desk, mailbox];

/** Where the feed from the header meets the room: the top of the wall's corner, in drawing units. */
export const ENTRY: XY = project(...N.top);

/** The chain of segments from the entry point to each object. */
const chains: Record<HotspotId, Segment[]> = {
  projects: [riser, frame],
  skills: [riser, shelfRun, shelf],
  experience: [riser, shelfRun, wallRun, drop, cabinet],
  explorer: [riser, shelfRun, wallRun, drop, cabinet, bus, hub, desk],
  contact: [riser, shelfRun, wallRun, drop, cabinet, bus, hub, mailbox],
};

/** One unbroken path from the entry point to each object: what a packet or a pulse travels along. */
export const routes = Object.fromEntries(
  (Object.keys(chains) as HotspotId[]).map((id) => {
    const points = chains[id].flatMap((s, i) => (i === 0 ? s.points : s.points.slice(1)));
    return [id, { d: path(points), len: round(length(points)) }];
  }),
) as Record<HotspotId, { d: string; len: number }>;

/** How far each object is from the entry point: its trace arrives, and it lights, after this much travel. */
export const ARRIVAL = Object.fromEntries(
  (Object.keys(chains) as HotspotId[]).map((id) => [id, chains[id][chains[id].length - 1].end]),
) as Record<HotspotId, number>;

/** The furthest any trace runs from the entry point. */
export const REACH = Math.max(...segments.map((s) => s.end));

/** Where power reaches the floor plate: the foot of the drop from the wall's end. */
export const FLOOR_AT = drop.end;

/** A straight piece of a line: where it starts, which way it runs, how far along the line it starts, how long it is. */
export type Piece = { x: number; y: number; angle: number; at: number; len: number };

/**
 * The straight pieces of the line through `points`. `at` is how far from the room's entry point the line starts;
 * `scale` is how many of the points' units make one drawing unit (the feed is measured in px).
 */
export function pieces(points: XY[], at = 0, scale = 1): Piece[] {
  const out: Piece[] = [];
  let run = at;
  points.slice(1).forEach((p, i) => {
    const a = points[i];
    const len = Math.hypot(p[0] - a[0], p[1] - a[1]) / scale;
    if (len > 0) out.push({ x: a[0], y: a[1], angle: (Math.atan2(p[1] - a[1], p[0] - a[0]) * 180) / Math.PI, at: run, len });
    run += len;
  });
  return out;
}

const TAIL = 150; // drawing units: the length of the fading tail behind the head
const fine = (n: number) => Math.round(n * 100) / 100;

/**
 * The head of the power as it travels in (Motion B's opening): a hot point with a fading tail. There is one per
 * straight piece of a line, lying along it and clipped to it, and the stylesheet slides each along its piece
 * when power gets there (--at, --len). Where two pieces meet, one head leaves as the next enters, so the eye
 * sees a single point turn the corner, and a branch splits it in two. Only transform moves.
 */
export function Heads({ id, list, scale = 1 }: { id: string; list: Piece[]; scale?: number }) {
  return (
    <g className="rm-heads">
      {list.map((p, i) => (
        <g key={i} transform={`translate(${fine(p.x)} ${fine(p.y)}) rotate(${fine(p.angle)}) scale(${fine(scale)})`}>
          <clipPath id={`rm-hc-${id}-${i}`}><rect x={-1.5} y={-14} width={fine(p.len + 3)} height={28} /></clipPath>
          <g clipPath={`url(#rm-hc-${id}-${i})`}>
            <g className="rm-head" style={{ '--at': fine(p.at), '--len': fine(p.len) } as CSSProperties}>
              <rect className="rm-head-halo" x={-TAIL} y={-5} width={TAIL} height={10} rx={5} fill="url(#rm-tail)" />
              <rect className="rm-head-tail" x={-TAIL} y={-1.7} width={TAIL} height={3.4} rx={1.7} fill="url(#rm-tail)" />
              <circle className="rm-head-glow" r={11} fill="url(#rm-hot)" />
              <circle className="rm-head-core" r={3.2} />
            </g>
          </g>
        </g>
      ))}
    </g>
  );
}

/** The head's gradients. Drawn once, with the wall's wiring; the feed uses them too (ids are document-wide). */
const headDefs = (
  <defs>
    <linearGradient id="rm-tail" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" style={{ stopColor: 'var(--accent)' }} stopOpacity="0" />
      <stop offset=".5" style={{ stopColor: 'var(--accent)' }} stopOpacity=".28" />
      <stop offset=".88" style={{ stopColor: 'var(--accent)' }} stopOpacity=".95" />
      <stop offset="1" stopColor="#FFF6DE" />
    </linearGradient>
    <radialGradient id="rm-hot">
      <stop offset="0" stopColor="#FFF6DE" stopOpacity=".95" />
      <stop offset=".34" style={{ stopColor: 'var(--accent)' }} stopOpacity=".5" />
      <stop offset="1" style={{ stopColor: 'var(--accent)' }} stopOpacity="0" />
    </radialGradient>
  </defs>
);
const headsOn = (layer: Segment['layer']) => segments.filter((s) => s.layer === layer).flatMap((s) => pieces(s.points, s.at));

/** Each object's box in the drawing ([x0, y0, x1, y1]): where its glow sits, and where its panel unfolds from. */
export const OBJECT_BOX: Record<HotspotId, [number, number, number, number]> = {
  skills: [278, 57, 534, 315],
  projects: [659, 94, 849, 322],
  experience: [260, 295, 360, 445],
  explorer: [518, 225, 720, 456], // the monitor
  contact: [910, 374, 1010, 490],
};

const timing = (s: { at: number; len: number }) => ({ '--at': s.at, '--len': s.len }) as CSSProperties;

/** A trace is three strokes on one path: the dim copper that is always there, and the glow and the lit core that power draws. */
function Trace({ s }: { s: Segment }) {
  return (
    <g className="rm-w" data-seg={s.id} style={timing(s)}>
      <path className="rm-w-base" d={s.d} />
      <path className="rm-w-glow" d={s.d} />
      <path className="rm-w-lit" d={s.d} />
    </g>
  );
}

/** A solder pad, lit when power reaches it, and the ring that spreads from it at that moment. */
function Pad({ at, node, small = false }: { at: number; node: V3; small?: boolean }) {
  const [cx, cy] = project(...node);
  const style = { '--at': at } as CSSProperties;
  return (
    <>
      <circle className="rm-pad-ring" cx={cx} cy={cy} r={small ? 3 : 4.5} style={style} />
      <circle className={`rm-pad${small ? ' rm-pad-s' : ''}`} cx={cx} cy={cy} r={small ? 3 : 4.5} style={style} />
    </>
  );
}

/** The traces on the wall, and the drop from the wall's end to the floor. Painted over the wall, under the shelf and the frame. */
export function WallWiring() {
  return (
    <g className="rm-l rm-l-wallwire">
      {segments.filter((s) => s.layer === 'wall').map((s) => <Trace key={s.id} s={s} />)}
      <Pad at={0} node={N.top} small />
      <Pad at={riser.end} node={N.split} small />
      <Pad at={shelfRun.end} node={N.shelfFoot} small />
      <Pad at={shelf.end} node={N.shelf} />
      <Pad at={frame.end} node={N.frame} />
      {headDefs}
      <Heads id="wall" list={headsOn('wall')} />
    </g>
  );
}

/** The traces on the floor plate, with the riser to the desk. `children` is the unpowered decoration under them. */
export function FloorWiring() {
  return (
    <>
      {segments.filter((s) => s.layer === 'floor').map((s) => <Trace key={s.id} s={s} />)}
      <Pad at={cabinet.end} node={N.cabinet} />
      <Pad at={bus.end} node={N.junction} small />
      <Pad at={ground.end} node={N.ground} />
      <Pad at={hub.end} node={N.hub} />
      <Pad at={mailbox.end} node={N.mailbox} />
      <Heads id="floor" list={headsOn('floor')} />
    </>
  );
}

/** A soft glow behind each object: it flashes as the object lights and rises while its hotspot is pointed at or focused. */
export function Blooms() {
  return (
    <g className="rm-l rm-l-bloom">
      {(Object.keys(OBJECT_BOX) as HotspotId[]).map((id) => {
        const [x0, y0, x1, y1] = OBJECT_BOX[id];
        return (
          <ellipse
            key={id}
            className="rm-bloom"
            data-bloom={id}
            cx={(x0 + x1) / 2}
            cy={(y0 + y1) / 2}
            rx={(x1 - x0) * 0.85}
            ry={(y1 - y0) * 0.8}
            fill="url(#rm-glow)"
            style={{ '--at': ARRIVAL[id] } as CSSProperties}
          />
        );
      })}
    </g>
  );
}

/**
 * What travels on the traces: one path per object, from the entry point to the object. A short dash moved along
 * it is a packet (idle) or a pulse (hover or focus). Hidden unless a motion concept shows it.
 */
export function Flows() {
  return (
    <g className="rm-l rm-l-flows">
      {(Object.keys(routes) as HotspotId[]).map((id, i) => (
        <g key={id} data-flow={id} style={{ '--len': routes[id].len, '--i': i } as CSSProperties}>
          <path className="rm-flow rm-packet" d={routes[id].d} />
          <path className="rm-flow rm-pulse" d={routes[id].d} />
        </g>
      ))}
    </g>
  );
}
