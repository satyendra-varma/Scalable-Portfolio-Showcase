import type { ReactNode } from 'react';
import { hero } from '@/content/room';
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

/** The room's header: Elevation's Amber LED block, with the loading bar as a real element. */
export function MotionHeader({ children }: { children?: ReactNode }) {
  return (
    <section className="rv-hero rmh" aria-labelledby="rv-name" data-testid="variant-hero">
      <div className="rv-hero-decor" aria-hidden="true" data-testid="hero-decor">
        <LedDecor />
      </div>
      <h1 id="rv-name" className="rp-name rv-name" data-testid="text-name">{hero.name}</h1>
      <div className="rmh-bar" aria-hidden="true" data-testid="header-bar"><span className="rmh-bar-fill" /></div>
      <p className="rp-role rv-role" data-testid="text-role">{hero.role}</p>
      <p className="rp-pos rv-pos" data-testid="text-positioning">{hero.positioning}</p>
      {children}
    </section>
  );
}
