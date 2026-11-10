export type HotspotId = 'explorer' | 'skills' | 'experience' | 'projects' | 'contact';

export const hotspots: { id: HotspotId; label: string; object: string; x: number; y: number }[] = [
  { id: 'explorer', label: 'System Explorer', object: 'Desk monitor', x: 50, y: 40 },
  { id: 'skills', label: 'Skills', object: 'Bookshelf', x: 20, y: 27 },
  { id: 'projects', label: 'Projects', object: 'Project frame', x: 67, y: 19 },
  { id: 'experience', label: 'Experience', object: 'Filing cabinet', x: 77, y: 58 },
  { id: 'contact', label: 'Contact', object: 'Mailbox', x: 22, y: 71 },
];

export function BlueprintRoom() {
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

export function RoomScene({ onOpen }: { onOpen: (id: HotspotId, el: HTMLButtonElement) => void }) {
  return (
    <figure className="room-figure" aria-labelledby="room-caption">
      <div className="room-stage">
        <BlueprintRoom />
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
