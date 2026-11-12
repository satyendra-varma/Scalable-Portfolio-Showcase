import type { ReactNode } from 'react';
import { hero } from '@/content/room';
import type { HeaderId } from './options';
import './header.css';

/**
 * Hero decoration of the LED header: a ruler along the top edge and a readout tag, behind the heading.
 * Copied from the Elevation concept's HeroDecor (classes el-hd* are rmh-led*, the pattern id is rmh-ruler).
 * The segmented LED bar is the real .rmh-bar element below the name, not CSS on the name.
 */
function LedDecor() {
  return (
    <svg className="rmh-led" width="100%" height="100%" aria-hidden="true" focusable="false">
      <defs>
        <pattern id="rmh-ruler" width="12" height="9" patternUnits="userSpaceOnUse">
          <path d="M.5 0V4M6.5 0V8" className="rmh-led-tick" />
        </pattern>
      </defs>
      <rect x="34" y="0" width="100%" height="9" fill="url(#rmh-ruler)" className="rmh-led-ruler" />
      <text className="rmh-led-txt" x="100%" y="22" textAnchor="end" dx="-6">ROOM_01 / 4.20 m</text>
    </svg>
  );
}

/**
 * The name, exploded: an outline copy lifted up and to the left behind the solid name, joined to it by short
 * dashed guides. Copied from the Exploded concept's ExplodedHeroDecor (classes xd-hd* are rmh-own*).
 */
function OwnDecor() {
  return (
    <svg className="rmh-own" aria-hidden="true" focusable="false">
      <text className="rmh-own-text" x="0" y="0">{hero.name}</text>
      <rect className="rmh-own-g rmh-own-g1" width="0.01" />
      <rect className="rmh-own-g rmh-own-g2" width="0.01" />
      <rect className="rmh-own-g rmh-own-g3" width="0.01" />
    </svg>
  );
}

export function MotionHeader({ header, children }: { header: HeaderId; children?: ReactNode }) {
  return (
    <section className="rv-hero rmh" data-header={header} aria-labelledby="rv-name" data-testid="variant-hero">
      <div className="rv-hero-decor" aria-hidden="true" data-testid="hero-decor">
        {header === 'led' ? <LedDecor /> : <OwnDecor />}
      </div>
      <h1 id="rv-name" className="rp-name rv-name" data-testid="text-name">{hero.name}</h1>
      {header === 'led' && (
        <div className="rmh-bar" aria-hidden="true" data-testid="header-bar"><span className="rmh-bar-fill" /></div>
      )}
      <p className="rp-role rv-role" data-testid="text-role">{hero.role}</p>
      <p className="rp-pos rv-pos" data-testid="text-positioning">{hero.positioning}</p>
      {children}
    </section>
  );
}
