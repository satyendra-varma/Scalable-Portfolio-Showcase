import type { CSSProperties } from 'react';

const rad = (d: number) => (d * Math.PI) / 180;
/** Point at `deg` clockwise from straight up. */
const pt = (cx: number, cy: number, r: number, deg: number) =>
  `${(cx + r * Math.sin(rad(deg))).toFixed(1)} ${(cy - r * Math.cos(rad(deg))).toFixed(1)}`;

const blips = [
  { a: 70, f: 0.56 },
  { a: 160, f: 0.8 },
  { a: 290, f: 0.38 },
];
const SWEEP_S = 4;

/** The magnified monitor: range rings, crosshairs, a sweep wedge (rotates) and three blips. */
export function Radar({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const inner = r - 14;
  const origin = { transformOrigin: `${cx}px ${cy}px` } as CSSProperties;
  const slices = Array.from({ length: 7 }, (_, k) => {
    const a1 = -(k + 1) * 9;
    const a2 = -k * 9;
    return (
      <path
        key={k}
        d={`M${cx} ${cy}L${pt(cx, cy, inner, a1)}A${inner} ${inner} 0 0 1 ${pt(cx, cy, inner, a2)}Z`}
        className="plan-wedge"
        style={{ opacity: 0.3 - k * 0.04 }}
      />
    );
  });
  const ticks = Array.from({ length: 36 }, (_, i) => {
    const major = i % 3 === 0;
    return <path key={i} d={`M${pt(cx, cy, r - (major ? 9 : 5), i * 10)}L${pt(cx, cy, r - 1, i * 10)}`} />;
  });
  return (
    <g className="plan-radar">
      <circle cx={cx} cy={cy} r={r + 9} className="plan-halo" />
      <circle cx={cx} cy={cy} r={r} className="plan-disc" />
      {/* the monitor screen, magnified: a frame and skeleton lines behind the rings */}
      <g className="plan-screen">
        <rect x={cx - 92} y={cy - 58} width="184" height="116" rx="5" />
        <path d={`M${cx - 74} ${cy - 34}h58M${cx - 74} ${cy - 18}h96M${cx - 74} ${cy - 2}h44M${cx - 74} ${cy + 14}h110M${cx - 74} ${cy + 30}h70`} />
      </g>
      <g className="plan-ticks">{ticks}</g>
      <g className="plan-rings">
        {[0.25, 0.5, 0.75, 1].map((f) => (
          <circle key={f} cx={cx} cy={cy} r={inner * f} />
        ))}
        <path d={`M${cx - inner} ${cy}H${cx + inner}M${cx} ${cy - inner}V${cy + inner}`} />
      </g>
      <text x={cx} y={cy - inner * 0.62} textAnchor="middle" className="plan-cmd">&gt; dotnet run</text>
      <g className="plan-sweep" style={origin}>
        {slices}
        <path d={`M${cx} ${cy}L${pt(cx, cy, inner, 0)}`} className="plan-arm" />
      </g>
      {blips.map((b, i) => {
        const [x, y] = pt(cx, cy, inner * b.f, b.a).split(' ');
        const delay = `${((b.a / 360) * SWEEP_S + 0.12 - SWEEP_S).toFixed(2)}s`;
        return (
          <g key={i} className="plan-blip" style={{ animationDelay: delay }}>
            <circle cx={x} cy={y} r="9" className="plan-blip-ring" />
            <circle cx={x} cy={y} r="3.6" className="plan-blip-dot" />
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r="3" className="plan-hub" />
      <circle cx={cx} cy={cy} r={r} className="plan-rim" />
    </g>
  );
}
