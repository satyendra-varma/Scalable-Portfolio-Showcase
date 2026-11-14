import type { CSSProperties } from 'react';
import { hotspots } from '@/components/room/RoomScene';
import type { SceneProps } from '../Stage';
import { VIEW, defs, layers, positions, type LayerId } from './layers';
import { ARRIVAL, FLOOR_AT, OBJECT_BOX } from './wiring';
import './room.css';

const VIEW_BOX = `0 0 ${VIEW.w} ${VIEW.h}`;

/**
 * The room itself, as opposed to the things in it, and where power first touches each part (--at): the wall at
 * the entry point, the floor plate and what lies on it at the foot of the drop from the wall.
 */
const ZONE: Partial<Record<LayerId, number>> = { wall: 0, floor: FLOOR_AT, shadows: FLOOR_AT, guides: FLOOR_AT };

/** The order in which the linework is drawn, for the layers that have linework: the plate first, the monitor last. */
const WIRE_ORDER: Partial<Record<LayerId, number>> = { floor: 0, guides: 1, desk: 2, cabinet: 3, mailbox: 3, wall: 4, shelf: 5, frame: 5, monitor: 6 };

/** When a layer's trace arrives (--at, in drawing units from the entry point), and the point an object lands about. */
function layerStyle(id: LayerId, object?: keyof typeof ARRIVAL): CSSProperties | undefined {
  if (object) {
    const [x0, y0, x1, y1] = OBJECT_BOX[object];
    return { '--at': ARRIVAL[object], transformOrigin: `${((x0 + x1) / 2 / VIEW.w) * 100}% ${((y0 + y1) / 2 / VIEW.h) * 100}%` } as CSSProperties;
  }
  return ZONE[id] === undefined ? undefined : ({ '--at': ZONE[id] } as CSSProperties);
}

/**
 * The Exploded room with every depth layer in its own <svg>, stacked in one stage so each can move on its own.
 * Hotspots and caption mirror ../Stage.tsx.
 * `wire` adds a strokes-only copy of the drawing on top, which Motion B draws as linework while it opens.
 */
export function MotionStage({ onOpen, wire = false }: SceneProps & { wire?: boolean }) {
  return (
    <figure className="rv-figure rm-figure" aria-labelledby="rv-caption" data-testid="variant-scene">
      <div className="rm-stage" data-testid="motion-stage">
        <svg className="rm-defs" width="0" height="0" aria-hidden="true" focusable="false"><defs>{defs}</defs></svg>
        <div className="rm-canvas" aria-hidden="true">
          {layers.map((l) => (
            <svg key={l.id} className="rm-layer" data-layer={l.id} data-object={l.object} viewBox={VIEW_BOX} focusable="false" style={layerStyle(l.id, l.object)}>{l.art}</svg>
          ))}
          {wire && (
            <svg className="rm-wire" viewBox={VIEW_BOX} focusable="false" data-testid="room-linework">
              {layers.filter((l) => WIRE_ORDER[l.id] !== undefined).map((l) => (
                <g key={l.id} data-wire={l.id} data-object={l.object} style={{ '--wi': WIRE_ORDER[l.id], '--at': l.object ? ARRIVAL[l.object] : ZONE[l.id] ?? 0 } as CSSProperties}>{l.art}</g>
              ))}
            </svg>
          )}
        </div>
        <ul className="rv-hotspots" aria-label="Room objects">
          {hotspots.map((h, i) => {
            const p = positions[h.id];
            const style = {
              '--i': i,
              '--at': ARRIVAL[h.id],
              '--x': `${p.x}%`,
              '--y': `${p.y}%`,
              ...(p.mobile ? { '--mx': `${p.mobile.x}%`, '--my': `${p.mobile.y}%` } : {}),
            } as CSSProperties;
            return (
              <li key={h.id} style={style}>
                <button
                  type="button"
                  className={`rv-hotspot${h.id === 'explorer' ? ' is-focal' : ''}`}
                  data-testid={`hotspot-${h.id}`}
                  data-hotspot={h.id}
                  aria-haspopup="dialog"
                  onClick={(e) => onOpen(h.id, e.currentTarget)}
                >
                  <span className="rv-hotspot-dot" aria-hidden="true" />
                  <span className="rv-hotspot-label">
                    <span className="rv-hotspot-object">{h.object}</span>
                    {h.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <figcaption id="rv-caption" className="rv-caption">
        Illustrated engineer's room. Each labeled object opens a section.
      </figcaption>
    </figure>
  );
}
