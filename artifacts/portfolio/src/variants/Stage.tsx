import type { CSSProperties, ReactNode } from 'react';
import { hotspots, type HotspotId } from '@/components/room/RoomScene';

export type SceneProps = { onOpen: (id: HotspotId, el: HTMLButtonElement) => void };

/** Hotspot centre in % of the stage. `mobile` (optional) applies at 600px and below. */
export type HotspotPosition = { x: number; y: number; mobile?: { x: number; y: number } };
export type HotspotPositions = Record<HotspotId, HotspotPosition>;

/**
 * Shared frame for every variant scene: the decorative drawing (children, an aria-hidden SVG),
 * the five hotspot buttons with visible labels, and the caption. Variants supply only the drawing
 * and the hotspot positions, so labels, order and accessibility stay identical across variants.
 * Each button carries data-hotspot="<id>"; a drawing marks the matching object with
 * data-object="<id>" and can respond with :has([data-hotspot=<id>]:is(:hover, :focus-visible)).
 */
export function VariantStage({ onOpen, positions, children }: SceneProps & { positions: HotspotPositions; children: ReactNode }) {
  return (
    <figure className="rv-figure" aria-labelledby="rv-caption" data-testid="variant-scene">
      <div className="rv-stage">
        {children}
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
