import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import type { HotspotId } from '@/components/room/RoomScene';
import { VIEW } from './layers';
import { OBJECT_BOX } from './wiring';
import './panel.css';

const FOCUSABLE = 'a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])';

export type PanelRequest = { id: HotspotId; title: string; full: boolean };
type Box = { x: number; y: number; w: number; h: number };
type Lines = { object: Box; frame: Box };

/**
 * Drives one number, the panel's progress `p` (0 closed, 1 open), and hands every value to `apply`.
 * With motion it is a spring from Motion (loaded after first paint): asked for a new target in mid-flight, it
 * turns round from where it is, at the speed it has. Without motion, or until Motion has loaded, it jumps.
 */
function createDrive(apply: (p: number) => void) {
  type Lib = typeof import('./motionLib');
  let lib: Lib | null = null;
  let value: import('./motionLib').MotionValue<number> | null = null;
  let controls: { stop: () => void } | null = null;
  let p = 0;
  let run = 0;
  void import('./motionLib').then((m) => {
    lib = m;
    value = m.motionValue<number>(p);
    value.on('change', (v: number) => { p = v; apply(v); });
  }).catch(() => { /* without Motion the panel simply opens and closes at once */ });
  return {
    get: () => p,
    to(target: number, animated: boolean, done: () => void, brisk = false) {
      const mine = ++run;
      controls?.stop();
      if (!animated || !lib || !value) {
        p = target;
        value?.jump(target);
        apply(target);
        done();
        return;
      }
      const spring = lib.animate(value, target, { type: 'spring', stiffness: brisk ? 520 : 230, damping: brisk ? 44 : 27, restDelta: 0.002, restSpeed: 0.02 });
      controls = spring;
      void spring.then(() => { if (mine === run) done(); });
    },
    stop() { run++; controls?.stop(); },
  };
}

const boxOf = (r: DOMRect): Box => ({ x: r.left, y: r.top, w: r.width, h: r.height });
const corners = (b: Box): [number, number][] => [[b.x, b.y], [b.x + b.w, b.y], [b.x + b.w, b.y + b.h], [b.x, b.y + b.h]];
const len = (n: number) => ({ '--len': Math.ceil(n) }) as CSSProperties;

/** Where the object sits on screen, from the room's canvas and the object's box in the drawing. */
function objectBox(id: HotspotId): Box | null {
  const canvas = document.querySelector('.rm-canvas')?.getBoundingClientRect();
  if (!canvas || !canvas.width) return null;
  const [x0, y0, x1, y1] = OBJECT_BOX[id];
  const sx = canvas.width / VIEW.w, sy = canvas.height / VIEW.h;
  return { x: canvas.left + x0 * sx, y: canvas.top + y0 * sy, w: (x1 - x0) * sx, h: (y1 - y0) * sy };
}

/**
 * The room's panel: the same dialog as RoomDialog (labelled, modal, focus kept inside, Escape and the backdrop
 * close it), but it stays mounted while it closes, so closing can be shown, and turned round part-way.
 *
 * Everything it shows is a function of one number, --p, set on its root: 0 is closed, 1 is open (panel.css).
 * `animated` moves --p with a spring; otherwise it jumps, which is the still state.
 * Linework joins the object to the panel: the object's box, four ties to the panel's corners, the panel's frame.
 */
export function MotionPanel({ request, animated, onClose, children }: {
  request: PanelRequest | null;
  animated: boolean;
  onClose: () => void;
  children: (id: HotspotId) => ReactNode;
}) {
  const [shown, setShown] = useState<PanelRequest | null>(request);
  const [lines, setLines] = useState<Lines | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const sheet = useRef<HTMLDivElement>(null);
  const pending = useRef<PanelRequest | null>(null);
  const drive = useRef<ReturnType<typeof createDrive> | null>(null);
  if (!drive.current) drive.current = createDrive((p) => root.current?.style.setProperty('--p', String(Math.round(p * 1000) / 1000)));
  const live = useRef({ animated, onClose });
  live.current = { animated, onClose };

  // A request arrives or goes: open, close, or, if another panel is still well open, close that one briskly first.
  useLayoutEffect(() => {
    const d = drive.current!;
    if (request) {
      if (shown && shown.id !== request.id && d.get() > 0.2) {
        pending.current = request;
        d.to(0, live.current.animated, () => { const next = pending.current; pending.current = null; setShown(next); }, true);
      } else {
        pending.current = null;
        setShown(request);
      }
    } else if (shown) {
      pending.current = null;
      d.to(0, live.current.animated, () => setShown(null));
    }
    // Only a change of the requested panel starts anything; `shown` is read as it is at that moment.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request?.id]);

  // The panel on screen is the requested one: measure the linework, then open.
  const open = !!shown && shown.id === request?.id;
  useLayoutEffect(() => {
    if (!open || !shown) return;
    const measure = () => {
      const object = objectBox(shown.id), frame = sheet.current?.getBoundingClientRect();
      setLines(object && frame && frame.width ? { object, frame: boxOf(frame) } : null);
    };
    measure();
    // The room can still be moving under the panel (a resize, or a smooth scroll that had not finished).
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, { passive: true });
    drive.current!.to(1, live.current.animated, () => {});
    return () => { window.removeEventListener('resize', measure); window.removeEventListener('scroll', measure); };
  }, [open, shown]);

  // While open: focus goes in and stays in, Escape closes, and the page behind does not scroll.
  useEffect(() => {
    if (!open) return;
    const el = sheet.current;
    el?.querySelector<HTMLElement>('[data-autofocus]')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); live.current.onClose(); return; }
      if (e.key !== 'Tab' || !el) return;
      const items = Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [open, shown?.id]);

  useEffect(() => () => drive.current?.stop(), []);

  if (!shown) return null;
  const { id, title, full } = shown;
  const o = lines?.object, f = lines?.frame;
  // --p starts where the drive is, so a re-render in mid-flight does not move the panel.
  const style = {
    '--p': Math.round(drive.current.get() * 1000) / 1000,
    ...(o && f ? { '--ot': `${o.y - f.y}px`, '--ol': `${o.x - f.x}px`, '--ob': `${f.y + f.h - o.y - o.h}px`, '--or': `${f.x + f.w - o.x - o.w}px` } : {}),
  } as CSSProperties;

  return (
    <div ref={root} className="rmp" data-full={full ? '' : undefined} data-state={open ? 'open' : 'closing'} style={style}>
      <div className="rmp-backdrop" onMouseDown={onClose} />
      {o && f && (
        <svg className="rmp-lines" aria-hidden="true" focusable="false">
          <rect className="rmp-line rmp-object" x={o.x} y={o.y} width={o.w} height={o.h} style={len(2 * (o.w + o.h))} />
          {corners(o).map(([x, y], i) => {
            const [fx, fy] = corners(f)[i];
            return <line key={i} className="rmp-line rmp-tie" x1={x} y1={y} x2={fx} y2={fy} style={len(Math.hypot(fx - x, fy - y))} />;
          })}
          <rect className="rmp-line rmp-frame" x={f.x + 0.5} y={f.y + 0.5} width={f.w - 1} height={f.h - 1} style={len(2 * (f.w + f.h))} />
        </svg>
      )}
      <div
        ref={sheet}
        className="rmp-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`panel-${id}-title`}
        aria-hidden={open ? undefined : true}
        data-testid={`panel-${id}`}
      >
        <header className="rd-head">
          <h2 id={`panel-${id}-title`} className="rd-title">{title}</h2>
          <button type="button" className="rd-close" onClick={onClose} data-autofocus data-testid="button-close-panel">
            Close <span className="sr-only">{title}</span>
          </button>
        </header>
        <div className="rd-body">{children(id)}</div>
      </div>
    </div>
  );
}
