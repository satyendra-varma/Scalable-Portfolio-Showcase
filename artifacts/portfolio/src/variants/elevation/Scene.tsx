import type { ReactNode } from 'react';
import { VariantStage, type HotspotPositions, type SceneProps } from '../Stage';
import './elevation.css';

/*
 * Front elevation of the desk wall. Two compositions share the same object components:
 * a wide one (1200 x 720) and a taller phone crop (600 x 780). Objects are drawn at a local
 * origin and placed with translate/scale, so brackets and linework stay consistent.
 */

const positions: HotspotPositions = {
  explorer: { x: 51.7, y: 54.4, mobile: { x: 36.7, y: 70.4 } },
  skills: { x: 26.7, y: 20.8, mobile: { x: 18.3, y: 27.6 } },
  projects: { x: 84.2, y: 44.4, mobile: { x: 75.8, y: 34.9 } },
  experience: { x: 82.9, y: 61.1, mobile: { x: 84.7, y: 65.5 } },
  contact: { x: 16, y: 62.2, mobile: { x: 83.7, y: 49.4 } },
};

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

const SPINES: [number, number, boolean?][] = [
  [9, 0.78], [12, 0.92, true], [8, 0.66], [11, 0.84], [7, 0.58], [13, 0.96], [9, 0.72, true], [10, 0.88], [8, 0.62], [12, 0.8], [7, 0.7], [11, 0.94],
];

function Shelf({ w, h, rows, wall }: { w: number; h: number; rows: number; wall?: boolean }) {
  const pad = 8;
  const rh = (h - pad * 2) / rows;
  const els: ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    const base = pad + (r + 1) * rh;
    let x = pad + 4;
    let i = (r * 5) % SPINES.length;
    for (;;) {
      const [bw, bh, hot] = SPINES[i % SPINES.length];
      if (x + bw > w - pad - 3) break;
      const sh = (rh - 8) * bh;
      els.push(<rect key={`${r}-${x}`} className={hot ? 'el-spine el-hot' : 'el-spine'} x={x} y={base - 2 - sh} width={bw - 2} height={sh} />);
      x += bw;
      i += 1;
    }
    els.push(<rect key={`p${r}`} className="el-edge" x={pad - 2} y={base - 2} width={w - pad * 2 + 4} height={3} />);
  }
  return (
    <g className="el-obj">
      <rect className="el-body" x={0} y={0} width={w} height={h} />
      <rect className="el-in" x={pad - 2} y={pad - 2} width={w - pad * 2 + 4} height={h - pad * 2 + 4} />
      {els}
      {wall ? <path className="el-l" d={`M-8 ${h + 6}H${w + 8}M14 ${h}V${h + 6}M${w - 14} ${h}V${h + 6}`} /> : null}
      <Brackets x={-8} y={-8} w={w + 16} h={h + 16} />
    </g>
  );
}

function Monitor() {
  return (
    <g className="el-obj el-monitor">
      <path className="el-halo" d="M-26 -22H346V226H-26Z" />
      <path className="el-halo el-halo2" d="M-12 -10H332V212H-12Z" />
      <rect className="el-body" x={0} y={0} width={320} height={200} rx={6} />
      <rect className="el-active" x={0} y={0} width={320} height={200} rx={6} />
      <rect className="el-screen" x={10} y={10} width={300} height={160} rx={2} />
      <path className="el-glint" d="M10 10H110L40 170H10Z" />
      <path className="el-ruler" d="M22 160H298" />
      <g className="el-code">
        <text className="el-prompt" x={26} y={46}>&gt; dotnet run</text>
        <rect className="el-line el-l2" x={44} y={62} width={190} height={9} rx={4.5} />
        <rect className="el-line el-l3 el-a" x={44} y={84} width={120} height={9} rx={4.5} />
        <rect className="el-line el-l4" x={26} y={106} width={216} height={9} rx={4.5} />
        <rect className="el-line el-l5 el-a" x={26} y={128} width={92} height={9} rx={4.5} />
        <rect className="el-caret" x={124} y={125} width={9} height={15} />
      </g>
      <rect className="el-led" x={154} y={181} width={12} height={4} rx={2} />
      <path className="el-l" d="M152 200V253M168 200V253" />
      <rect className="el-body" x={105} y={253} width={110} height={8} rx={3} />
      <Brackets x={-10} y={-10} w={340} h={281} l={18} />
    </g>
  );
}

function Desk({ w, h }: { w: number; h: number }) {
  const px = w - 118;
  const dh = (h - 52) / 2;
  return (
    <g className="el-obj">
      <rect className="el-body" x={0} y={0} width={w} height={16} />
      <path className="el-active" d={`M0 0H${w}`} />
      <rect className="el-body" x={14} y={16} width={10} height={h - 16} />
      <rect className="el-body" x={px} y={16} width={104} height={h - 16} />
      <rect className="el-in" x={px + 8} y={26} width={88} height={dh} />
      <rect className="el-in" x={px + 8} y={36 + dh} width={88} height={dh} />
      <path className="el-handle" d={`M${px + 38} ${26 + dh / 2}h28M${px + 38} ${36 + dh * 1.5}h28`} />
      <Brackets x={-8} y={-8} w={w + 16} h={h + 8} />
    </g>
  );
}

function Keyboard() {
  return (
    <g className="el-obj">
      <rect className="el-body" x={0} y={0} width={92} height={9} rx={2} />
      <path className="el-l" d="M8 4.5h76" />
    </g>
  );
}

function Cabinet() {
  return (
    <g className="el-obj">
      <rect className="el-body" x={0} y={0} width={170} height={240} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect className="el-in" x={10} y={10 + i * 76} width={150} height={68} />
          <path className="el-handle" d={`M64 ${52 + i * 76}h42`} />
          <rect className="el-slot" x={72} y={22 + i * 76} width={26} height={10} />
        </g>
      ))}
      <Brackets x={-8} y={-8} w={186} h={256} />
    </g>
  );
}

function Frame() {
  return (
    <g className="el-obj">
      <path className="el-l" d="M52 0L105 -14L158 0" />
      <rect className="el-body" x={0} y={0} width={210} height={200} />
      <rect className="el-in" x={12} y={12} width={186} height={176} />
      {/* abstract system diagram: boxes and connectors, no text */}
      <rect className="el-box" x={26} y={26} width={46} height={30} />
      <rect className="el-box el-hot" x={82} y={26} width={46} height={30} />
      <rect className="el-box" x={138} y={26} width={46} height={30} />
      <path className="el-conn" d="M72 41H82M128 41H138" />
      <path className="el-conn el-hotl" d="M105 56V84M105 84H48V104M105 84H162V104" />
      <rect className="el-box" x={26} y={104} width={46} height={26} />
      <rect className="el-box" x={139} y={104} width={46} height={26} />
      <path className="el-conn" d="M49 130V146M162 130V146M72 117H139" />
      <ellipse className="el-box" cx={49} cy={157} rx={22} ry={7} />
      <path className="el-box" d="M27 157V170a22 7 0 0 0 44 0V157" />
      <rect className="el-box el-hot" x={142} y={146} width={40} height={10} />
      <rect className="el-box" x={142} y={162} width={40} height={10} />
      <Brackets x={-8} y={-8} w={226} h={216} />
    </g>
  );
}

function Mailbox() {
  return (
    <g className="el-obj">
      <rect className="el-body" x={0} y={8} width={64} height={46} rx={3} />
      <path className="el-l" d="M0 20H64" />
      <rect className="el-slot" x={14} y={28} width={36} height={6} />
      <path className="el-active" d="M54 8V-6H66" />
      <circle className="el-screw" cx={8} cy={46} r={2} />
      <circle className="el-screw" cx={56} cy={46} r={2} />
      <Brackets x={-8} y={-10} w={80} h={72} l={12} />
    </g>
  );
}

function Door() {
  return (
    <g className="el-obj">
      <rect className="el-body" x={0} y={0} width={104} height={410} />
      <rect className="el-in" x={10} y={10} width={84} height={400} />
      <rect className="el-l" x={22} y={28} width={60} height={150} />
      <rect className="el-l" x={22} y={196} width={60} height={190} />
      <circle className="el-knob" cx={80} cy={224} r={4} />
      <Brackets x={-8} y={-8} w={120} h={426} />
    </g>
  );
}

/** Ticks along a floor line, every `step`, with a long tick every fifth. */
function ticks(x0: number, x1: number, y: number, step: number) {
  let d = '';
  for (let x = x0, n = 0; x <= x1; x += step, n++) d += `M${x} ${y}v${n % 5 === 0 ? 14 : 7}`;
  return d;
}

function Grid({ id }: { id: string }) {
  return (
    <defs>
      <pattern id={id} width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M40 0H0V40" className="el-gridl" />
      </pattern>
    </defs>
  );
}

function Wide() {
  return (
    <svg className="el-svg el-wide" viewBox="0 0 1200 720" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
      <Grid id="el-grid-w" />
      <rect className="el-wall" x={0} y={0} width={1200} height={640} />
      <rect fill="url(#el-grid-w)" x={0} y={0} width={1200} height={640} />
      <path className="el-dim" d="M30 70H1170M30 62v16M1170 62v16" />
      <text className="el-txt" x={30} y={54}>ROOM_01 / 4.20 m</text>
      <path className="el-floor" d="M0 640H1200" />
      <path className="el-tick" d={ticks(30, 1170, 640, 30)} />
      <text className="el-txt" x={1170} y={686} textAnchor="end">// scale 1:40</text>
      <g transform="translate(30 230)"><Door /></g>
      <g transform="translate(160 360)"><Mailbox /></g>
      <g transform="translate(255 140)"><Shelf w={130} h={500} rows={5} /></g>
      <g transform="translate(420 470)"><Desk w={400} h={170} /></g>
      <g transform="translate(460 205)"><Monitor /></g>
      <g transform="translate(685 461)"><Keyboard /></g>
      <g transform="translate(910 400)"><Cabinet /></g>
      <g transform="translate(905 120)"><Frame /></g>
    </svg>
  );
}

function Narrow() {
  return (
    <svg className="el-svg el-narrow" viewBox="0 0 600 780" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
      <Grid id="el-grid-n" />
      <rect className="el-wall" x={0} y={0} width={600} height={700} />
      <rect fill="url(#el-grid-n)" x={0} y={0} width={600} height={700} />
      <path className="el-floor" d="M0 700H600" />
      <path className="el-tick" d={ticks(20, 580, 700, 20)} />
      <text className="el-txt" x={580} y={744} textAnchor="end">// scale 1:40</text>
      <text className="el-txt" x={20} y={744}>ROOM_01 / 4.20 m</text>
      <g transform="translate(30 70)"><Shelf w={160} h={270} rows={4} wall /></g>
      <g transform="translate(350 60)"><Frame /></g>
      <g transform="translate(470 310)"><Mailbox /></g>
      <g transform="translate(30 625)"><Desk w={380} h={75} /></g>
      <g transform="translate(60 364)"><Monitor /></g>
      <g transform="translate(445 532) scale(.7)"><Cabinet /></g>
    </svg>
  );
}

export default function ElevationScene({ onOpen }: SceneProps) {
  return (
    <VariantStage onOpen={onOpen} positions={positions}>
      <Wide />
      <Narrow />
    </VariantStage>
  );
}

/** Optional aria-hidden decoration rendered inside the hero, behind the heading (see ../scenes.ts). */
export const HeroDecor: import('react').ComponentType | null = null;
