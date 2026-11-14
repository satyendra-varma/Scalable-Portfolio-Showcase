import { useSyncExternalStore, type CSSProperties, type ReactNode } from 'react';
import { experience, projects, skillGroups } from '@/content/room';
import { VariantStage, type HotspotPositions, type SceneProps } from '../Stage';
import './elevation.css';

/*
 * Front elevation of the desk wall, lights down: the monitor is the light source. Two compositions
 * share the same object components (a wide one, 1200 x 720, and a phone crop, 600 x 720); only the one
 * for the current width is rendered, so the drawing stays small. Each hotspot object carries
 * data-object so the stage can power it up (brackets and light) on hover and focus.
 */

const positions: HotspotPositions = {
  explorer: { x: 51.7, y: 48.5, mobile: { x: 33.3, y: 63.4 } },
  skills: { x: 27.5, y: 17.4, mobile: { x: 16.5, y: 21.5 } },
  projects: { x: 84.2, y: 44.8, mobile: { x: 77.3, y: 16.7 } },
  experience: { x: 82.9, y: 54.9, mobile: { x: 83.3, y: 69.4 } },
  contact: { x: 16, y: 61, mobile: { x: 83.7, y: 38.5 } },
};

const NARROW = '(max-width: 600px)';
const subscribe = (cb: () => void) => {
  const m = window.matchMedia?.(NARROW);
  m?.addEventListener('change', cb);
  return () => m?.removeEventListener('change', cb);
};
const useNarrow = () =>
  useSyncExternalStore(subscribe, () => !!window.matchMedia?.(NARROW).matches, () => false);

const A = { stopColor: 'var(--accent)' } as CSSProperties;
const sh = (s: number) => ({ '--sh': s }) as CSSProperties;

/** Gradients and patterns shared by both compositions. */
function Defs() {
  return (
    <defs>
      <linearGradient id="elg-wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#171A1F" />
        <stop offset=".6" stopColor="#101317" />
        <stop offset="1" stopColor="#090B0D" />
      </linearGradient>
      <radialGradient id="elg-spill" cx=".5" cy=".5" r=".5">
        <stop offset="0" style={A} stopOpacity=".4" />
        <stop offset=".5" style={A} stopOpacity=".12" />
        <stop offset="1" style={A} stopOpacity="0" />
      </radialGradient>
      <linearGradient id="elg-vig" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#000" stopOpacity=".6" />
        <stop offset=".3" stopColor="#000" stopOpacity="0" />
        <stop offset=".7" stopColor="#000" stopOpacity="0" />
        <stop offset="1" stopColor="#000" stopOpacity=".6" />
      </linearGradient>
      <linearGradient id="elg-cone" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" style={A} stopOpacity=".4" />
        <stop offset="1" style={A} stopOpacity=".05" />
      </linearGradient>
      <linearGradient id="elg-fcone" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" style={A} stopOpacity=".3" />
        <stop offset="1" style={A} stopOpacity="0" />
      </linearGradient>
      <linearGradient id="elg-floor" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#0F1114" />
        <stop offset="1" stopColor="#07080A" />
      </linearGradient>
      <linearGradient id="elg-face" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#272D35" />
        <stop offset="1" stopColor="#171B21" />
      </linearGradient>
      <linearGradient id="elg-rim" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" style={A} stopOpacity="0" />
        <stop offset=".5" style={A} stopOpacity=".95" />
        <stop offset="1" style={A} stopOpacity="0" />
      </linearGradient>
      <linearGradient id="elg-under" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#000" stopOpacity=".6" />
        <stop offset="1" stopColor="#000" stopOpacity="0" />
      </linearGradient>
      <radialGradient id="elg-glow" cx=".5" cy=".55" r=".6">
        <stop offset="0" style={A} stopOpacity=".5" />
        <stop offset="1" style={A} stopOpacity=".08" />
      </radialGradient>
      <linearGradient id="elg-glass" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity=".09" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      <radialGradient id="elg-lit" cx=".5" cy=".5" r=".7">
        <stop offset="0" style={A} stopOpacity=".34" />
        <stop offset="1" style={A} stopOpacity="0" />
      </radialGradient>
      <linearGradient id="elg-edge" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" style={A} stopOpacity="0" />
        <stop offset="1" style={A} stopOpacity=".2" />
      </linearGradient>
      <pattern id="elg-grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M40 0H0V40" className="el-gridl" />
      </pattern>
      <pattern id="elg-key" width="7" height="5" patternUnits="userSpaceOnUse">
        <rect x=".6" y=".6" width="5.8" height="3.6" rx=".9" className="el-keycap" />
      </pattern>
      <pattern id="elg-port" width="12" height="8" patternUnits="userSpaceOnUse">
        <rect x="1.5" y="1" width="9" height="6" rx="1" className="el-port" />
        <rect x="3.5" y="1" width="5" height="2" className="el-portlip" />
      </pattern>
    </defs>
  );
}

/** HUD corner brackets as one path. */
function Brackets({ x, y, w, h, l = 14 }: { x: number; y: number; w: number; h: number; l?: number }) {
  const r = x + w;
  const b = y + h;
  return (
    <path
      className="el-br"
      d={`M${x} ${y + l}V${y}H${x + l}M${r - l} ${y}H${r}V${y + l}M${r} ${b - l}V${b}H${r - l}M${x + l} ${b}H${x}V${b - l}`}
    />
  );
}

/** The light an object gains when its hotspot is pointed at, and the shade it sits in otherwise. */
const Lit = ({ x, y, w, h }: { x: number; y: number; w: number; h: number }) => (
  <rect className="el-lit" x={x} y={y} width={w} height={h} fill="url(#elg-lit)" />
);
const Shade = ({ x, y, w, h, s }: { x: number; y: number; w: number; h: number; s: number }) => (
  <rect className="el-shade" x={x} y={y} width={w} height={h} style={sh(s)} />
);

/* ---------- Skills shelf: book spines carry the skill names ---------- */

const POOL = skillGroups.flatMap((g) => g.skills).filter((s) => s.length <= 13);
const SPINE_W = [15, 17, 14, 16, 15, 18, 14, 16];
const CHAR = 4.9;

function Shelf({ w, h, rows, boxes, wall, maxLen }: { w: number; h: number; rows: number; boxes?: boolean; wall?: boolean; maxLen: number }) {
  const pad = 8;
  const rh = (h - pad * 2) / rows;
  const pool = POOL.filter((s) => s.length <= maxLen && s.length * CHAR + 14 <= rh - 10);
  let k = 0;
  const els: ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    const base = pad + (r + 1) * rh;
    if (boxes && r === rows - 1) {
      els.push(
        <g key="boxes">
          <rect className="el-boxf" x={pad + 6} y={base - 44} width={54} height={42} />
          <rect className="el-boxlid" x={pad + 3} y={base - 50} width={60} height={8} />
          <rect className="el-boxf" x={pad + 70} y={base - 34} width={50} height={32} />
          <rect className="el-boxlid" x={pad + 67} y={base - 40} width={56} height={8} />
        </g>,
      );
    } else {
      let x = pad + 4;
      for (let i = 0; ; i++) {
        const bw = SPINE_W[(i + r * 3) % SPINE_W.length];
        if (x + bw > w - pad - 3) break;
        const skill = pool[k++];
        const sph = skill ? Math.max(48, skill.length * CHAR + 14) : 38 + ((i * 7 + r * 5) % 4) * 6;
        const hot = (i * 3 + r) % 7 === 4;
        const top = base - 2 - sph;
        els.push(
          <g key={`${r}-${i}`}>
            <rect className={hot ? 'el-spine el-hot' : `el-spine el-t${(i + r) % 4}`} x={x} y={top} width={bw - 2} height={sph} />
            {skill ? (
              <text className={hot ? 'el-spt el-spt-hot' : 'el-spt'} transform={`translate(${x + (bw - 2) / 2} ${top + 6}) rotate(90)`} dy=".34em">
                {skill}
              </text>
            ) : null}
          </g>,
        );
        x += bw;
      }
    }
    els.push(<rect key={`p${r}`} className="el-plank" x={pad - 2} y={base - 2} width={w - pad * 2 + 4} height={4} />);
  }
  return (
    <g className="el-obj" data-object="skills">
      <rect className="el-body" x={0} y={0} width={w} height={h} fill="url(#elg-face)" />
      <rect className="el-in" x={pad - 2} y={pad - 2} width={w - pad * 2 + 4} height={h - pad * 2 + 4} />
      {els}
      <rect x={pad - 2} y={pad - 2} width={w - pad * 2 + 4} height={h - pad * 2 + 4} fill="url(#elg-edge)" />
      <path className="el-rim" d={`M${w} 2V${h - 2}`} />
      {wall ? <path className="el-l" d={`M-8 ${h + 6}H${w + 8}M14 ${h}V${h + 6}M${w - 14} ${h}V${h + 6}`} /> : null}
      <Lit x={-30} y={-30} w={w + 60} h={h + 60} />
      <Shade x={0} y={0} w={w} h={h} s={0.34} />
      <Brackets x={-8} y={-8} w={w + 16} h={h + 16} />
    </g>
  );
}

/* ---------- The monitor: the focal point and the room's light ---------- */

function Monitor() {
  return (
    <g className="el-obj el-monitor" data-object="explorer">
      <rect className="el-body" x={0} y={0} width={320} height={200} rx={6} fill="url(#elg-face)" />
      <path className="el-rim el-rim-hot" d="M8 .8H312" />
      <rect className="el-screen" x={10} y={10} width={300} height={160} rx={2} />
      <rect className="el-sglow" x={10} y={10} width={300} height={160} rx={2} fill="url(#elg-glow)" />
      <path className="el-ruler" d="M22 160H298" />
      <g className="el-code">
        <text className="el-prompt" x={26} y={46}>&gt; dotnet run</text>
        <rect className="el-line el-l2" x={44} y={62} width={190} height={9} rx={4.5} />
        <rect className="el-line el-l3 el-a" x={44} y={84} width={120} height={9} rx={4.5} />
        <rect className="el-line el-l4" x={26} y={106} width={216} height={9} rx={4.5} />
        <rect className="el-line el-l5 el-a" x={26} y={128} width={92} height={9} rx={4.5} />
        <rect className="el-caret" x={124} y={125} width={9} height={15} />
      </g>
      <path d="M10 10H120L52 170H10Z" fill="url(#elg-glass)" />
      <rect className="el-led" x={154} y={181} width={12} height={4} rx={2} />
      <path className="el-neck" d="M146 200H174L178 253H142Z" fill="url(#elg-face)" />
      <path className="el-l" d="M146 200L142 253" />
      <rect className="el-body" x={100} y={253} width={120} height={8} rx={3} fill="url(#elg-face)" />
      <path className="el-rim el-rim-hot" d="M104 253.6H216" />
      <Lit x={-40} y={-40} w={400} h={340} />
      <Brackets x={-10} y={-10} w={340} h={281} l={18} />
    </g>
  );
}

/* ---------- Desk, switch, cables, keyboard, mug ---------- */

function Desk({ w, h }: { w: number; h: number }) {
  const px = w - 118;
  const dh = (h - 52) / 2;
  return (
    <g className="el-obj">
      <rect x={0} y={16} width={w} height={42} fill="url(#elg-under)" />
      <rect className="el-body" x={14} y={16} width={10} height={h - 16} fill="url(#elg-face)" />
      <rect className="el-side" x={24} y={16} width={4} height={h - 16} />
      <rect className="el-body" x={px} y={16} width={104} height={h - 16} fill="url(#elg-face)" />
      <rect className="el-side" x={px + 104} y={16} width={6} height={h - 16} />
      <rect className="el-drawer" x={px + 8} y={26} width={88} height={dh} />
      <rect className="el-drawer" x={px + 8} y={36 + dh} width={88} height={dh} />
      <path className="el-handle" d={`M${px + 38} ${26 + dh / 2}h28M${px + 38} ${36 + dh * 1.5}h28`} />
      <rect className="el-top" x={0} y={0} width={w} height={6} />
      <rect className="el-body" x={0} y={6} width={w} height={10} fill="url(#elg-face)" />
      <rect x={0} y={-1} width={w} height={3} fill="url(#elg-rim)" />
      <path className="el-rim" d={`M0 16.5H${w}`} />
    </g>
  );
}

/** A 1U network switch hung under the desk: port rows and LED points. */
function Switch() {
  const leds = Array.from({ length: 12 }, (_, i) => i);
  return (
    <g>
      <path className="el-l" d="M10 -6V0M210 -6V0" />
      <rect className="el-ear" x={0} y={0} width={10} height={34} />
      <rect className="el-ear" x={210} y={0} width={10} height={34} />
      <rect className="el-body" x={8} y={0} width={204} height={34} fill="url(#elg-face)" />
      <rect className="el-top" x={8} y={0} width={204} height={2} />
      <rect x={14} y={11} width={144} height={8} fill="url(#elg-port)" />
      <rect x={14} y={22} width={144} height={8} fill="url(#elg-port)" />
      <rect className="el-port" x={166} y={11} width={18} height={8} rx={1} />
      <rect className="el-port" x={188} y={11} width={18} height={8} rx={1} />
      <rect className="el-port" x={166} y={22} width={40} height={8} rx={1} />
      {leds.map((i) => (
        <circle key={i} className={`el-pl el-b${(i * 5) % 7}`} cx={20 + i * 12} cy={6} r={1.7} />
      ))}
      <circle className="el-pl el-b2" cx={175} cy={6} r={1.7} />
      <circle className="el-pl el-b5" cx={197} cy={6} r={1.7} />
    </g>
  );
}

function Cable({ d }: { d: string }) {
  return (
    <g>
      <path className="el-cab" d={d} />
      <path className="el-cabh" d={d} transform="translate(-1.4 0)" />
    </g>
  );
}

function Keyboard() {
  return (
    <g>
      <path className="el-kb" d="M6 0H144L150 11H0Z" />
      <path d="M6 0H144L150 11H0Z" fill="url(#elg-key)" />
      <rect className="el-keycap el-space" x={46} y={7.4} width={58} height={2.6} rx={1} />
      <path d="M6 0H144L150 11H0Z" fill="url(#elg-fcone)" />
      <rect className="el-top" x={0} y={11} width={150} height={7} />
      <path className="el-rim" d="M0 11.4H150" />
    </g>
  );
}

function Mug() {
  const steam = ['M8 -30c-5 -6 4 -10 -1 -17', 'M14 -30c-4 -6 5 -11 0 -19', 'M20 -30c-5 -5 3 -9 -1 -15'];
  return (
    <g>
      {steam.map((d, i) => (
        <path key={i} className={`el-steam el-st${i}`} d={d} />
      ))}
      <path className="el-handle2" d="M25 -20h4q4 0 4 5t-4 5h-4" />
      <rect className="el-mug" x={2} y={-26} width={24} height={26} rx={3} fill="url(#elg-face)" />
      <rect className="el-coffee" x={4} y={-27} width={20} height={4} rx={2} />
      <path className="el-rim" d="M2.8 -22V-3" />
    </g>
  );
}

/* ---------- Experience: filing drawers labelled with the employers ---------- */

function Cabinet() {
  return (
    <g className="el-obj" data-object="experience">
      <rect className="el-body" x={0} y={0} width={170} height={240} fill="url(#elg-face)" />
      <rect className="el-side" x={158} y={0} width={12} height={240} />
      {[0, 1, 2].map((i) => {
        const org = experience[i]?.org;
        const y = 10 + i * 76;
        return (
          <g key={i}>
            <rect className="el-drawer" x={10} y={y} width={146} height={68} />
            <rect className="el-top" x={10} y={y} width={146} height={2} />
            <rect className="el-plate" x={18} y={y + 10} width={130} height={16} rx={1} />
            {org ? <text className="el-lbl" x={83} y={y + 18} textAnchor="middle" dy=".34em">{org}</text> : null}
            <rect className="el-pull" x={61} y={y + 44} width={44} height={6} rx={3} />
          </g>
        );
      })}
      <path className="el-rim" d="M.8 2V238" />
      <Lit x={-30} y={-30} w={230} h={300} />
      <Shade x={0} y={0} w={170} h={240} s={0.3} />
      <Brackets x={-8} y={-8} w={186} h={256} />
    </g>
  );
}

/* ---------- Projects: the framed system diagram, labelled with both projects ---------- */

function Frame() {
  const [a, b] = projects;
  return (
    <g className="el-obj" data-object="projects">
      <path className="el-l" d="M52 0L105 -14L158 0" />
      <rect className="el-body" x={0} y={0} width={210} height={200} fill="url(#elg-face)" />
      <rect className="el-in" x={12} y={12} width={186} height={176} />
      {/* group one */}
      <rect className="el-box el-hot" x={20} y={22} width={170} height={20} />
      <text className="el-dtxt" x={105} y={32} textAnchor="middle" dy=".34em">{a.name}</text>
      <path className="el-conn el-hotl" d="M45 42V56M105 42V56M165 42V56" />
      <rect className="el-box" x={22} y={56} width={46} height={14} />
      <rect className="el-box el-hot" x={82} y={56} width={46} height={14} />
      <rect className="el-box" x={142} y={56} width={46} height={14} />
      <ellipse className="el-box" cx={105} cy={86} rx={12} ry={4} />
      <path className="el-conn" d="M45 70V80M165 70V80M45 80H93M165 80H117M105 70V82M105 90V104" />
      <path className="el-conn el-hotl" d="M20 104H190" />
      {/* group two */}
      <path className="el-conn" d="M105 104V122" />
      <rect className="el-box el-hot" x={20} y={122} width={170} height={20} />
      <text className="el-dtxt" x={105} y={132} textAnchor="middle" dy=".34em">{b.name}</text>
      <path className="el-conn el-hotl" d="M45 142V156M105 142V156M165 142V156" />
      <rect className="el-box" x={22} y={156} width={46} height={14} />
      <rect className="el-box" x={82} y={156} width={46} height={14} />
      <rect className="el-box el-hot" x={142} y={156} width={46} height={14} />
      <path d="M12 12H130L62 188H12Z" fill="url(#elg-glass)" />
      <path className="el-rim" d="M.8 2V198" />
      <Lit x={-30} y={-30} w={270} h={260} />
      <Shade x={0} y={0} w={210} h={200} s={0.28} />
      <Brackets x={-8} y={-8} w={226} h={216} />
    </g>
  );
}

function Mailbox() {
  return (
    <g className="el-obj" data-object="contact">
      <rect className="el-side" x={4} y={52} width={56} height={5} />
      <rect className="el-body" x={0} y={8} width={64} height={46} rx={3} fill="url(#elg-face)" />
      <rect className="el-top" x={0} y={8} width={64} height={12} rx={3} />
      <rect className="el-slot" x={14} y={28} width={36} height={6} />
      <path className="el-active" d="M54 8V-6H66" />
      <circle className="el-screw" cx={8} cy={46} r={2} />
      <circle className="el-screw" cx={56} cy={46} r={2} />
      <path className="el-rim" d="M64 12V50" />
      <Lit x={-30} y={-30} w={124} h={116} />
      <Shade x={0} y={8} w={64} h={46} s={0.45} />
      <Brackets x={-8} y={-10} w={80} h={72} l={12} />
    </g>
  );
}

function Door() {
  return (
    <g className="el-obj">
      <rect className="el-body" x={0} y={0} width={104} height={410} fill="url(#elg-face)" />
      <rect className="el-in" x={10} y={10} width={84} height={400} />
      <rect className="el-panel" x={22} y={28} width={60} height={150} />
      <rect className="el-panel" x={22} y={196} width={60} height={190} />
      <circle className="el-knob" cx={80} cy={224} r={4} />
      <path className="el-rim" d="M104 4V408" />
      <Shade x={0} y={0} w={104} h={410} s={0.55} />
    </g>
  );
}

/** Ticks along a floor line, every `step`, with a long tick every fifth. */
function ticks(x0: number, x1: number, y: number, step: number) {
  let d = '';
  for (let x = x0, n = 0; x <= x1; x += step, n++) d += `M${x} ${y}v${n % 5 === 0 ? 14 : 7}`;
  return d;
}

/** The desk-top objects and the gear under the desk, in desk-local coordinates. */
function DeskSet({ x, y, w, h, mug }: { x: number; y: number; w: number; h: number; mug: number }) {
  return (
    <>
      <g transform={`translate(${x} ${y})`}>
        <Desk w={w} h={h} />
        <g transform="translate(30 24)"><Switch /></g>
        <Cable d={`M42 58C40 84 26 100 34 ${h - 4}`} />
        <Cable d={`M216 58C220 84 236 96 242 ${h - 8}`} />
        <Cable d={`M268 16V52C268 84 258 102 250 ${h - 10}`} />
        <rect className="el-strip" x={226} y={h - 10} width={52} height={9} rx={2} />
        <rect className="el-pl el-b3" x={232} y={h - 7} width={4} height={3} />
        <g transform={`translate(${mug} 0)`}><Mug /></g>
      </g>
    </>
  );
}

function Wide() {
  return (
    <svg className="el-svg el-wide" viewBox="0 0 1200 720" aria-hidden="true" focusable="false">
      <Defs />
      <rect fill="url(#elg-wall)" x={0} y={0} width={1200} height={640} />
      <rect fill="url(#elg-grid)" x={0} y={0} width={1200} height={640} />
      <ellipse cx={620} cy={300} rx={600} ry={380} fill="url(#elg-spill)" />
      <path d="M470 379H770L850 470H390Z" fill="url(#elg-cone)" />
      <rect fill="url(#elg-vig)" x={0} y={0} width={1200} height={640} />
      <path className="el-dim" d="M30 70H1170M30 62v16M1170 62v16" />
      <text className="el-txt" x={30} y={54}>ROOM_01 / 4.20 m</text>
      <rect fill="url(#elg-floor)" x={0} y={640} width={1200} height={80} />
      <path d="M520 640H720L930 720H310Z" fill="url(#elg-fcone)" />
      <path className="el-floor" d="M0 640H1200" />
      <path className="el-tick" d={ticks(30, 1170, 640, 30)} />
      <text className="el-txt" x={1170} y={686} textAnchor="end">// scale 1:40</text>
      <g transform="translate(30 230)"><Door /></g>
      <g transform="translate(160 360)"><Mailbox /></g>
      <g transform="translate(250 140)"><Shelf w={150} h={500} rows={5} boxes maxLen={13} /></g>
      <g transform="translate(910 400)"><Cabinet /></g>
      <g transform="translate(905 120)"><Frame /></g>
      <DeskSet x={420} y={470} w={400} h={170} mug={372} />
      <g transform="translate(460 209)"><Monitor /></g>
      <g transform="translate(545 452)"><Keyboard /></g>
    </svg>
  );
}

function Narrow() {
  return (
    <svg className="el-svg el-narrow" viewBox="0 0 600 720" aria-hidden="true" focusable="false">
      <Defs />
      <rect fill="url(#elg-wall)" x={0} y={0} width={600} height={650} />
      <rect fill="url(#elg-grid)" x={0} y={0} width={600} height={650} />
      <ellipse cx={200} cy={400} rx={430} ry={400} fill="url(#elg-spill)" />
      <path d="M50 470H350L430 561H-30Z" fill="url(#elg-cone)" />
      <rect fill="url(#elg-vig)" x={0} y={0} width={600} height={650} />
      <rect fill="url(#elg-floor)" x={0} y={650} width={600} height={70} />
      <path d="M100 650H320L420 720H0Z" fill="url(#elg-fcone)" />
      <path className="el-floor" d="M0 650H600" />
      <path className="el-tick" d={ticks(20, 580, 650, 20)} />
      <text className="el-txt" x={580} y={702} textAnchor="end">// scale 1:40</text>
      <text className="el-txt" x={20} y={702}>ROOM_01 / 4.20 m</text>
      <g transform="translate(24 40)"><Shelf w={150} h={240} rows={3} wall maxLen={10} /></g>
      <g transform="translate(380 40) scale(.8)"><Frame /></g>
      <g transform="translate(470 250)"><Mailbox /></g>
      <g transform="translate(448 501) scale(.62)"><Cabinet /></g>
      <DeskSet x={20} y={561} w={400} h={89} mug={352} />
      <g transform="translate(40 300)"><Monitor /></g>
      <g transform="translate(125 543)"><Keyboard /></g>
    </svg>
  );
}

export default function ElevationScene({ onOpen }: SceneProps) {
  const narrow = useNarrow();
  return (
    <VariantStage onOpen={onOpen} positions={positions}>
      {narrow ? <Narrow /> : <Wide />}
    </VariantStage>
  );
}

/**
 * Hero decoration: a ruler along the top edge and a readout tag, behind the heading. The segmented LED
 * bar under the name is CSS on .rv-name::after (see elevation.css).
 */
export function HeroDecor() {
  return (
    <svg className="el-hd" width="100%" height="100%" aria-hidden="true" focusable="false">
      <defs>
        <pattern id="elh-ruler" width="12" height="9" patternUnits="userSpaceOnUse">
          <path d="M.5 0V4M6.5 0V8" className="el-hd-tick" />
        </pattern>
      </defs>
      <rect x="34" y="0" width="100%" height="9" fill="url(#elh-ruler)" className="el-hd-ruler" />
      <text className="el-hd-txt" x="100%" y="22" textAnchor="end" dx="-6">ROOM_01 / 4.20 m</text>
    </svg>
  );
}
