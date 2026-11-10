/** Wall band between an outer and an inner rectangle (thick double line). */
function Walls({ x, y, w, h, t }: { x: number; y: number; w: number; h: number; t: number }) {
  const d = `M${x} ${y}h${w}v${h}h${-w}ZM${x + t} ${y + t}v${h - 2 * t}h${w - 2 * t}v${-(h - 2 * t)}Z`;
  return <path d={d} className="plan-wall" fillRule="evenodd" />;
}

/** Shelf with dividers; tall shelves run top to bottom. */
function Shelf({ x, y, w, h, n }: { x: number; y: number; w: number; h: number; n: number }) {
  const len = h;
  const cuts = Array.from({ length: n - 1 }, (_, i) => ((i + 1) * len) / n);
  return (
    <g className="plan-line">
      <rect x={x} y={y} width={w} height={h} />
      {cuts.map((c, i) => (
        <path key={i} d={`M${x} ${y + c}h${w}`} />
      ))}
      <path d={`M${x + w / 2} ${y + 4}v${h - 8}`} className="plan-soft" />
    </g>
  );
}

function Cabinet({ x, y, s }: { x: number; y: number; s: number }) {
  const q = s / 3;
  return (
    <g className="plan-line">
      <rect x={x} y={y} width={s} height={s} />
      <path d={`M${x} ${y + q}h${s}M${x} ${y + 2 * q}h${s}`} />
      <path d={`M${x + s * 0.36} ${y + q / 2}h${s * 0.28}M${x + s * 0.36} ${y + 1.5 * q}h${s * 0.28}M${x + s * 0.36} ${y + 2.5 * q}h${s * 0.28}`} className="plan-lime" />
    </g>
  );
}

function Mailbox({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <g className="plan-line">
      <rect x={x} y={y} width={w} height={h} rx="2" />
      <path d={`M${x + 4} ${y + h * 0.4}h${w - 8}`} className="plan-lime" />
      <path d={`M${x} ${y}L${x + w / 2} ${y + h * 0.4}L${x + w} ${y}`} className="plan-soft" />
    </g>
  );
}

/** Door swing: leaf from the hinge, quarter arc to the opposite jamb. */
function DoorSwing({ hx, hy, r, dir }: { hx: number; hy: number; r: number; dir: 1 | -1 }) {
  return (
    <g className="plan-line">
      <path d={`M${hx} ${hy}V${hy - r}`} className="plan-lime" />
      <path d={`M${hx} ${hy - r}A${r} ${r} 0 0 ${dir === 1 ? 1 : 0} ${hx + dir * r} ${hy}`} className="plan-soft plan-dash" />
    </g>
  );
}

function Defs({ id }: { id: string }) {
  return (
    <defs>
      <pattern id={id} width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="1" cy="1" r="0.9" fill="#2F6B52" />
      </pattern>
    </defs>
  );
}

/** Wide composition, viewBox 800x600. */
export function DesktopPlan() {
  return (
    <g>
      <Defs id="plan-dots-d" />
      <rect x="0" y="0" width="800" height="600" fill="url(#plan-dots-d)" className="plan-dots" />
      {/* dimension line */}
      <g className="plan-dim">
        <path d="M30 32H500M30 26V38M500 26V38" />
        <rect x="170" y="22" width="190" height="20" className="plan-label-bg" />
        <text x="265" y="36" textAnchor="middle">ROOM_01 / 4.20 m</text>
      </g>
      <Walls x={30} y={50} w={470} h={520} t={10} />
      {/* window (top wall) */}
      <rect x="290" y="49" width="120" height="12" className="plan-gap" />
      <path d="M290 51H410M290 55H410M290 59H410M290 50V60M410 50V60" className="plan-line" />
      {/* door (bottom wall) with swing */}
      <rect x="110" y="559" width="70" height="12" className="plan-gap" />
      <path d="M110 560V570M180 560V570" className="plan-line" />
      <DoorSwing hx={110} hy={560} r={70} dir={1} />
      {/* project frame on the top wall */}
      <rect x="130" y="52" width="110" height="6" className="plan-frame" />
      {/* bookshelf, left wall */}
      <Shelf x={40} y={120} w={28} h={200} n={8} />
      {/* filing cabinet, top-right corner */}
      <Cabinet x={428} y={70} s={56} />
      {/* mailbox by the door */}
      <Mailbox x={204} y={524} w={26} h={30} />
      {/* rug */}
      <rect x="160" y="268" width="260" height="210" rx="6" className="plan-soft plan-dash" />
      {/* desk, chair, keyboard */}
      <rect x="190" y="300" width="200" height="80" className="plan-desk" />
      <rect x="258" y="344" width="64" height="18" rx="2" className="plan-soft" />
      <circle cx="290" cy="430" r="24" className="plan-line" />
      <path d="M270 410A24 24 0 0 1 310 410" className="plan-soft" />
      {/* monitor: thin bar on the desk, with the leader to the magnified detail */}
      <path d="M250 315H330" className="plan-monitor" />
      <path d="M290 315V322" className="plan-soft" />
      <circle cx="330" cy="315" r="5" className="plan-pin" />
      <path d="M335 314L511 290" className="plan-leader" />
      <path d="M250 312L505 232M250 318L508 330" className="plan-cone" />
      {/* scale note */}
      <g className="plan-dim">
        <path d="M560 540H760M560 534V546M660 536V544M760 534V546" />
        <text x="660" y="564" textAnchor="middle">// scale 1:40</text>
      </g>
    </g>
  );
}

/** Tall composition for phones, viewBox 400x560: callout above, room below. */
export function MobilePlan() {
  return (
    <g>
      <Defs id="plan-dots-m" />
      <rect x="0" y="0" width="400" height="560" fill="url(#plan-dots-m)" className="plan-dots" />
      <Walls x={20} y={300} w={360} h={240} t={10} />
      {/* window (right wall) */}
      <rect x="369" y="395" width="12" height="76" className="plan-gap" />
      <path d="M371 395V471M375 395V471M379 395V471M370 395H380M370 471H380" className="plan-line" />
      {/* door (bottom wall) with swing, hinge right */}
      <rect x="300" y="529" width="60" height="12" className="plan-gap" />
      <path d="M300 530V540M360 530V540" className="plan-line" />
      <DoorSwing hx={360} hy={530} r={60} dir={-1} />
      {/* project frame on the top wall */}
      <rect x="70" y="302" width="72" height="6" className="plan-frame" />
      <Shelf x={30} y={372} w={22} h={118} n={6} />
      <Cabinet x={326} y={310} s={40} />
      <Mailbox x={262} y={500} w={22} h={26} />
      <rect x="160" y="400" width="150" height="44" className="plan-desk" />
      <rect x="213" y="424" width="44" height="12" rx="2" className="plan-soft" />
      <circle cx="235" cy="470" r="18" className="plan-line" />
      <path d="M221 456A18 18 0 0 1 249 456" className="plan-soft" />
      <path d="M195 413H275" className="plan-monitor" />
      <path d="M235 413V419" className="plan-soft" />
      <circle cx="235" cy="413" r="5" className="plan-pin" />
      <path d="M237 408L247 244" className="plan-leader" />
      <g className="plan-dim">
        <text x="200" y="556" textAnchor="middle">// scale 1:40</text>
      </g>
    </g>
  );
}
