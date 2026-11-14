import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { VIEW } from './layers';
import { ENTRY, Heads, pieces, type Piece } from './wiring';

type Shape = { d: string; px: number; units: number; scale: number; heads: Piece[] };
type XY = [number, number];

const PACKETS = [0, 1, 2, 3, 4];
const CUT = 8; // px: corners are cut at 45 degrees, like a trace on a board

/** The line from the end of the loading bar to the top of the wall's corner, in px inside `main`. */
function trace(main: HTMLElement): Shape | null {
  const bar = main.querySelector('.rmh-bar')?.getBoundingClientRect();
  const hero = main.querySelector('.rmh')?.getBoundingClientRect();
  const stage = main.querySelector('.rm-stage')?.getBoundingClientRect();
  const canvas = main.querySelector('.rm-canvas')?.getBoundingClientRect();
  if (!bar || !hero || !stage || !canvas || !canvas.width) return null;
  const m = main.getBoundingClientRect();
  const scale = canvas.width / VIEW.w;
  const end: XY = [canvas.left - m.left + ENTRY[0] * scale, canvas.top - m.top + ENTRY[1] * (canvas.height / VIEW.h)];
  const start: XY = [bar.right - m.left, bar.top - m.top + bar.height / 2];
  // Header above the room: out of the bar's end, down past the header, across in the gap, then down onto the wall.
  // Header beside the room (the bar is lower than the top of the wall): out past the header's edge, up beside it,
  // across over the top of the wall, then down into the corner.
  const beside = start[1] > end[1] - 24;
  const x1 = beside ? Math.max(start[0] + 14, hero.right - m.left + 12) : start[0] + 14;
  const across = beside
    ? Math.max(3, end[1] - Math.max(14, 22 * scale))
    : hero.bottom - m.top + Math.max(4, (stage.top - hero.bottom) / 2);
  const dx = end[0] - x1, side = Math.sign(dx) || 1, cut = Math.min(CUT, Math.abs(dx) / 2);
  const up = beside ? -1 : 1; // which way the line leaves the bar's level
  const points: XY[] = [
    start, [x1 - CUT, start[1]], [x1, start[1] + up * CUT],
    [x1, across - up * cut], [x1 + side * cut, across], [end[0] - side * cut, across], [end[0], across + cut],
    end,
  ];
  const px = points.slice(1).reduce((sum, p, i) => sum + Math.hypot(p[0] - points[i][0], p[1] - points[i][1]), 0);
  // The head's pieces count their distance back from the room's entry point: the feed ends where the room's wiring starts.
  const heads = pieces(points, -px / scale, scale);
  return { d: 'M' + points.map((p) => p.map((n) => Math.round(n * 10) / 10).join(',')).join('L'), px: Math.ceil(px), units: Math.round(px / scale), scale, heads };
}

/**
 * The feed (docs/BRIEF-room-motion.md, Motion B): one trace from the header's loading bar down into the room,
 * where it meets the wiring at the top of the wall. The header is HTML and the room is a drawing, so the line is
 * measured from where the two are on the page, and measured again whenever the page is resized.
 * It tells the room how long it is (--rm-feed on the room's root, in drawing units), so power can run down it
 * and carry on along the room's traces at the same speed.
 */
export function Feed() {
  const [shape, setShape] = useState<Shape | null>(null);
  const svg = useRef<SVGSVGElement>(null);

  useLayoutEffect(() => {
    // The line is laid over the room's <main>, which is this element's parent.
    const el = svg.current?.parentElement;
    if (!el) return;
    const measure = () => {
      const next = trace(el);
      setShape((prev) => (prev && next && prev.d === next.d ? prev : next));
      if (next) el.closest<HTMLElement>('.rm')?.style.setProperty('--rm-feed', String(next.units));
    };
    measure();
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    observer?.observe(el);
    // Where the page is fitted to the window, the header and the room can change size while <main> does not.
    el.querySelectorAll('.rmh, .rm-stage').forEach((part) => observer?.observe(part));
    window.addEventListener('resize', measure);
    void document.fonts?.ready.then(measure);
    return () => { observer?.disconnect(); window.removeEventListener('resize', measure); };
  }, []);

  return (
    <svg ref={svg} className="rm-feed" aria-hidden="true" focusable="false" data-px={shape?.px} data-units={shape?.units} style={shape ? ({ '--len': shape.px, '--sw': shape.scale } as CSSProperties) : undefined}>
      {shape && (
        <>
          <path className="rm-w-base" d={shape.d} />
          <path className="rm-w-glow" d={shape.d} />
          <path className="rm-w-lit" d={shape.d} />
          {/* One per object: each packet runs down the feed before it runs to its object (usePowerOn). */}
          {PACKETS.map((i) => <path key={i} className="rm-flow rm-packet" d={shape.d} />)}
          <Heads id="feed" list={shape.heads} scale={shape.scale} />
        </>
      )}
    </svg>
  );
}
