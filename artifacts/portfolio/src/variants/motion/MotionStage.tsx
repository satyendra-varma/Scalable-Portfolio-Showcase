import type { CSSProperties } from 'react';
import { hotspots } from '@/components/room/RoomScene';
import type { SceneProps } from '../Stage';
import { VIEW, defs, layers, positions } from './layers';
import './room.css';

/**
 * The Exploded room with every depth layer in its own <svg>, stacked in one stage so each can move on its own.
 * Hotspots and caption mirror ../Stage.tsx.
 */
export function MotionStage({ onOpen }: SceneProps) {
  return (
    <figure className="rv-figure rm-figure" aria-labelledby="rv-caption" data-testid="variant-scene">
      <div className="rm-stage" data-testid="motion-stage">
        <svg className="rm-defs" width="0" height="0" aria-hidden="true" focusable="false"><defs>{defs}</defs></svg>
        <div className="rm-canvas" aria-hidden="true">
          {layers.map((l) => (
            <svg key={l.id} className="rm-layer" data-layer={l.id} data-object={l.object} viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} focusable="false">{l.art}</svg>
          ))}
        </div>
        <ul className="rv-hotspots" aria-label="Room objects">
          {hotspots.map((h, i) => {
            const p = positions[h.id];
            const style = {
              '--i': i,
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
