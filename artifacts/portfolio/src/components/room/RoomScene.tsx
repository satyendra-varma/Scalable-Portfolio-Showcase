export type Direction = 'warm' | 'dark';
export type HotspotId = 'explorer' | 'skills' | 'experience' | 'projects' | 'contact';

export const hotspots: { id: HotspotId; label: string; object: string; x: number; y: number }[] = [
  { id: 'explorer', label: 'System Explorer', object: 'Desk monitor', x: 50, y: 40 },
  { id: 'skills', label: 'Skills', object: 'Bookshelf', x: 20, y: 27 },
  { id: 'projects', label: 'Projects', object: 'Project frame', x: 67, y: 19 },
  { id: 'experience', label: 'Experience', object: 'Filing cabinet', x: 77, y: 58 },
  { id: 'contact', label: 'Contact', object: 'Mailbox', x: 22, y: 71 },
];

function WarmRoom() {
  return (
    <svg viewBox="0 0 800 600" className="room-svg" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="w-wallL" x1="0" x2="1"><stop offset="0" stopColor="#e9d3b4" /><stop offset="1" stopColor="#f3e2c8" /></linearGradient>
        <linearGradient id="w-wallR" x1="0" x2="1"><stop offset="0" stopColor="#dcc09b" /><stop offset="1" stopColor="#cfae86" /></linearGradient>
        <linearGradient id="w-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#b9773f" /><stop offset="1" stopColor="#8f5527" /></linearGradient>
        <linearGradient id="w-oak" x1="0" x2="1"><stop offset="0" stopColor="#c98a4b" /><stop offset="1" stopColor="#a96a33" /></linearGradient>
        <linearGradient id="w-beam" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff6dd" stopOpacity=".75" /><stop offset="1" stopColor="#fff6dd" stopOpacity="0" /></linearGradient>
        <filter id="w-paper"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" result="n" /><feColorMatrix type="saturate" values="0" /><feComponentTransfer><feFuncA type="table" tableValues="0 .09" /></feComponentTransfer><feComposite in2="SourceGraphic" operator="in" /><feBlend in="SourceGraphic" mode="multiply" /></filter>
        <filter id="w-soft"><feGaussianBlur stdDeviation="6" /></filter>
      </defs>
      <polygon points="40,380 400,200 400,20 40,200" fill="url(#w-wallL)" filter="url(#w-paper)" />
      <polygon points="400,200 760,380 760,200 400,20" fill="url(#w-wallR)" filter="url(#w-paper)" />
      <polygon points="400,560 760,380 400,200 40,380" fill="url(#w-floor)" />
      {Array.from({ length: 9 }).map((_, i) => (
        <line key={i} x1={40 + i * 40} y1={380 + i * 20} x2={400 + i * 40} y2={200 + i * 20} stroke="#7a4520" strokeOpacity=".35" strokeWidth="1.5" />
      ))}
      {/* window + daylight */}
      <polygon points="250,235 335,192 335,92 250,135" fill="#fdf4dc" stroke="#8a5a2e" strokeWidth="6" />
      <line x1="292" y1="113" x2="292" y2="213" stroke="#8a5a2e" strokeWidth="4" />
      <polygon points="250,235 335,192 560,420 440,500" fill="url(#w-beam)" opacity=".55" />
      {/* rug */}
      <ellipse cx="400" cy="440" rx="190" ry="80" fill="#c4553a" opacity=".85" filter="url(#w-paper)" />
      <ellipse cx="400" cy="440" rx="160" ry="62" fill="none" stroke="#f1d5a8" strokeWidth="3" strokeDasharray="2 7" />
      {/* bookshelf */}
      <polygon points="100,330 215,272 215,122 100,180" fill="url(#w-oak)" stroke="#6b3c18" strokeWidth="3" />
      <polygon points="100,330 82,320 82,170 100,180" fill="#7d4a20" />
      {[0, 1, 2].map((r) => (
        <g key={r}>
          <line x1="100" y1={225 + r * 40} x2="215" y2={167 + r * 40} stroke="#6b3c18" strokeWidth="5" />
          {[0, 1, 2, 3, 4, 5].map((b) => (
            <polygon key={b} points={`${108 + b * 15},${220 + r * 40 - b * 7.5} ${118 + b * 15},${215 + r * 40 - b * 7.5} ${118 + b * 15},${190 + r * 40 - b * 7.5 - (b % 3) * 3} ${108 + b * 15},${195 + r * 40 - b * 7.5 - (b % 3) * 3}`} fill={['#2f5d62', '#e2b04a', '#a8432a', '#f0e2c4', '#5b6c3a', '#7a3b52'][(b + r) % 6]} />
          ))}
        </g>
      ))}
      {/* project frame */}
      <polygon points="478,162 596,221 596,131 478,72" fill="#f6ead2" stroke="#6b3c18" strokeWidth="7" filter="url(#w-paper)" />
      <polyline points="495,150 520,125 545,150 575,140" fill="none" stroke="#2f5d62" strokeWidth="3" />
      <rect x="0" y="0" width="0" height="0" />
      <circle cx="520" cy="110" r="7" fill="#a8432a" />
      {/* desk */}
      <polygon points="290,382 420,317 530,372 400,437" fill="url(#w-oak)" stroke="#6b3c18" strokeWidth="3" />
      <polygon points="290,382 400,437 400,450 290,395" fill="#7d4a20" />
      <polygon points="400,437 530,372 530,385 400,450" fill="#5f3415" />
      <line x1="300" y1="395" x2="300" y2="465" stroke="#5f3415" strokeWidth="7" />
      <line x1="395" y1="450" x2="395" y2="520" stroke="#5f3415" strokeWidth="7" />
      <line x1="522" y1="385" x2="522" y2="455" stroke="#5f3415" strokeWidth="7" />
      {/* monitor */}
      <polygon points="355,350 445,305 445,225 355,270" fill="#3a2a1d" />
      <polygon points="362,342 438,304 438,233 362,271" fill="#f4e7c9" />
      <g stroke="#a8432a" strokeWidth="2.5">
        <line x1="372" y1="300" x2="420" y2="276" /><line x1="372" y1="312" x2="410" y2="293" /><line x1="372" y1="324" x2="428" y2="296" />
      </g>
      <polygon points="395,345 410,338 418,360 402,368" fill="#3a2a1d" />
      {/* paper stack + mug + plant */}
      <polygon points="455,380 490,362 510,372 475,390" fill="#fbf3e2" stroke="#b79a6c" />
      <polygon points="455,375 490,357 510,367 475,385" fill="#fffaf0" stroke="#b79a6c" />
      <ellipse cx="320" cy="370" rx="10" ry="5" fill="#2f5d62" /><rect x="310" y="352" width="20" height="18" fill="#2f5d62" />
      <ellipse cx="320" cy="352" rx="10" ry="5" fill="#244a4e" />
      {/* lamp glow */}
      <circle cx="470" cy="300" r="55" fill="#ffe2a3" opacity=".45" filter="url(#w-soft)" />
      <path d="M470 365 L478 320 L455 300" stroke="#3a2a1d" strokeWidth="4" fill="none" />
      <polygon points="440,305 470,290 462,280 445,288" fill="#e2b04a" />
      {/* filing cabinet */}
      <polygon points="565,428 625,458 625,328 565,298" fill="#d9a066" stroke="#6b3c18" strokeWidth="3" />
      <polygon points="625,458 668,436 668,306 625,328" fill="#a8703c" />
      <polygon points="565,298 625,328 668,306 608,276" fill="#e8b97e" />
      {[0, 1, 2].map((d) => (
        <g key={d}>
          <line x1="570" y1={340 + d * 40} x2="620" y2={365 + d * 40} stroke="#6b3c18" strokeWidth="2" />
          <rect x="587" y={335 + d * 40} width="16" height="5" fill="#3a2a1d" transform={`skewY(26.5)`} style={{ transformOrigin: `595px ${337 + d * 40}px` }} />
        </g>
      ))}
      {/* mailbox */}
      <line x1="178" y1="430" x2="178" y2="500" stroke="#5f3415" strokeWidth="9" />
      <path d="M145 420 L195 395 L215 405 L215 432 L165 457 L145 447 Z" fill="#a8432a" stroke="#5f3415" strokeWidth="3" />
      <path d="M145 420 Q155 400 175 405 L195 395" fill="#c4553a" />
      <polygon points="152,428 172,418 172,410 152,420" fill="#fbf3e2" />
      <line x1="215" y1="410" x2="215" y2="385" stroke="#e2b04a" strokeWidth="4" />
      <polygon points="215,385 230,378 230,390 215,397" fill="#e2b04a" />
    </svg>
  );
}

function DarkRoom() {
  const line = { fill: 'none', stroke: '#6fc3d6', strokeWidth: 1.6 };
  return (
    <svg viewBox="0 0 800 600" className="room-svg" aria-hidden="true" focusable="false">
      <defs>
        <pattern id="d-grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="#1d3d55" strokeWidth=".8" /></pattern>
        <radialGradient id="d-glow" cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#3fd0e0" stopOpacity=".45" /><stop offset="1" stopColor="#3fd0e0" stopOpacity="0" /></radialGradient>
      </defs>
      <rect width="800" height="600" fill="url(#d-grid)" opacity=".5" />
      <polygon points="40,380 400,200 400,20 40,200" fill="#0f2233" {...{ stroke: '#2c5a78', strokeWidth: 1.4 }} />
      <polygon points="400,200 760,380 760,200 400,20" fill="#0c1c2b" stroke="#2c5a78" strokeWidth="1.4" />
      <polygon points="400,560 760,380 400,200 40,380" fill="#0a1824" stroke="#2c5a78" strokeWidth="1.4" />
      {Array.from({ length: 17 }).map((_, i) => (
        <g key={i} stroke="#1f4560" strokeWidth=".8">
          <line x1={40 + i * 22.5} y1={380 + i * 11.25} x2={400 + i * 22.5} y2={200 + i * 11.25} />
          <line x1={40 + i * 22.5} y1={380 - i * 11.25} x2={400 + i * 22.5} y2={560 - i * 11.25} />
        </g>
      ))}
      {/* dimension callouts */}
      <g stroke="#3b7ea0" strokeWidth="1" strokeDasharray="4 4" fill="none">
        <line x1="30" y1="395" x2="390" y2="575" /><line x1="410" y1="575" x2="770" y2="395" />
      </g>
      <text x="170" y="505" fill="#5aa7c4" fontSize="11" fontFamily="monospace" transform="rotate(26.5 170 505)">ROOM_01 / 4.20 m</text>
      {/* server rack style bookshelf */}
      <polygon points="100,330 215,272 215,122 100,180" {...line} />
      <polygon points="100,330 82,320 82,170 100,180" {...line} strokeOpacity=".6" />
      {[0, 1, 2, 3].map((r) => (
        <g key={r}>
          <line x1="100" y1={215 + r * 30} x2="215" y2={157 + r * 30} {...line} />
          {[0, 1, 2, 3, 4].map((b) => (
            <line key={b} x1={110 + b * 20} y1={208 + r * 30 - b * 10} x2={110 + b * 20} y2={190 + r * 30 - b * 10} stroke={b % 2 ? '#f2b84b' : '#6fc3d6'} strokeWidth="3" />
          ))}
        </g>
      ))}
      {/* blueprint frame */}
      <polygon points="478,162 596,221 596,131 478,72" fill="#10304a" stroke="#6fc3d6" strokeWidth="1.6" />
      <g stroke="#9fe3ee" strokeWidth="1" fill="none">
        <rect x="0" y="0" width="0" height="0" />
        <polyline points="492,140 515,130 515,108 538,119 538,145 565,158 565,135 584,145" />
        <circle cx="515" cy="108" r="3" /><circle cx="565" cy="135" r="3" />
      </g>
      {/* desk */}
      <polygon points="290,382 420,317 530,372 400,437" {...line} fill="#0d2232" />
      <polyline points="290,382 290,395 400,450 530,385 530,372" {...line} />
      <line x1="300" y1="395" x2="300" y2="465" {...line} /><line x1="400" y1="450" x2="400" y2="520" {...line} /><line x1="522" y1="389" x2="522" y2="455" {...line} />
      {/* monitor with glow */}
      <ellipse cx="400" cy="290" rx="120" ry="90" fill="url(#d-glow)" className="room-glow" />
      <polygon points="355,350 445,305 445,225 355,270" fill="#06121b" stroke="#6fc3d6" strokeWidth="2" />
      <polygon points="362,342 438,304 438,233 362,271" fill="#082a35" />
      <g fontFamily="monospace" fontSize="9" fill="#7ef0c8">
        <text x="368" y="290" transform="skewY(-26.5)" style={{ transformOrigin: '368px 290px' }}>&gt; dotnet run</text>
      </g>
      <g stroke="#7ef0c8" strokeWidth="2">
        <line x1="370" y1="305" x2="400" y2="290" /><line x1="370" y1="317" x2="425" y2="290" strokeOpacity=".6" /><line x1="370" y1="329" x2="412" y2="308" strokeOpacity=".4" />
      </g>
      <polygon points="395,345 410,338 418,360 402,368" {...line} />
      {/* keyboard */}
      <polygon points="370,385 430,355 455,367 395,397" {...line} strokeOpacity=".8" />
      {/* second monitor terminal amber */}
      <polygon points="450,345 505,318 505,268 450,295" fill="#06121b" stroke="#f2b84b" strokeWidth="1.6" />
      <g stroke="#f2b84b" strokeWidth="1.6"><line x1="457" y1="312" x2="490" y2="296" /><line x1="457" y1="322" x2="480" y2="311" /></g>
      {/* cabinet */}
      <polygon points="565,428 625,458 625,328 565,298" {...line} fill="#0b1d2b" />
      <polygon points="625,458 668,436 668,306 625,328" {...line} />
      <polygon points="565,298 625,328 668,306 608,276" {...line} />
      {[0, 1, 2].map((d) => (
        <g key={d}>
          <line x1="565" y1={341 + d * 43} x2="625" y2={371 + d * 43} {...line} />
          <line x1="585" y1={333 + d * 43} x2="605" y2={343 + d * 43} stroke="#f2b84b" strokeWidth="2" />
        </g>
      ))}
      {/* mailbox / network drop */}
      <line x1="178" y1="430" x2="178" y2="500" {...line} />
      <path d="M145 420 L195 395 L215 405 L215 432 L165 457 L145 447 Z" {...line} fill="#0d2232" />
      <path d="M145 420 Q155 400 175 405 L195 395" {...line} />
      <line x1="215" y1="410" x2="215" y2="385" stroke="#f2b84b" strokeWidth="2" />
      <polygon points="215,385 230,378 230,390 215,397" fill="#f2b84b" />
      <text x="608" y="500" fill="#5aa7c4" fontSize="10" fontFamily="monospace">// scale 1:40</text>
    </svg>
  );
}

export function RoomScene({
  direction,
  onOpen,
}: {
  direction: Direction;
  onOpen: (id: HotspotId, el: HTMLButtonElement) => void;
}) {
  return (
    <figure className="room-figure" aria-labelledby="room-caption">
      <div className="room-stage">
        {direction === 'warm' ? <WarmRoom /> : <DarkRoom />}
        <ul className="room-hotspots" aria-label="Room objects">
          {hotspots.map((h, i) => (
            <li key={h.id} style={{ left: `${h.x}%`, top: `${h.y}%`, ['--i' as string]: i }}>
              <button
                type="button"
                className="hotspot"
                data-testid={`hotspot-${h.id}`}
                aria-haspopup="dialog"
                onClick={(e) => onOpen(h.id, e.currentTarget)}
              >
                <span className="hotspot-dot" aria-hidden="true" />
                <span className="hotspot-label">
                  <span className="hotspot-object">{h.object}</span>
                  {h.label}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <figcaption id="room-caption" className="room-caption">
        Illustrated engineer's room. Each labeled object opens a section.
      </figcaption>
    </figure>
  );
}
