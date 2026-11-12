import type { CSSProperties } from 'react';
import { Link } from 'wouter';
import { ACCENTS, HEADERS, MOTIONS, optionsHref, type MotionId, type RoomMotionOptions } from './options';
import './switcher.css';

type Props = {
  options: RoomMotionOptions;
  shownMotion: MotionId;
  reducedMotion: boolean;
  collapsed: boolean;
  onToggle: () => void;
};

/** Fixed switcher for /room-motion: motion concept, header and accent. Choices live in the query string. */
export function MotionSwitcher({ options, shownMotion, reducedMotion, collapsed, onToggle }: Props) {
  const motion = MOTIONS.find((m) => m.id === shownMotion) ?? MOTIONS[MOTIONS.length - 1];
  const header = HEADERS.find((h) => h.id === options.header) ?? HEADERS[0];

  return (
    <nav className="rms-dock" aria-label="Room motion options" data-testid="motion-switcher">
      <button
        type="button"
        className="rms-toggle"
        aria-expanded={!collapsed}
        aria-controls="rms-body"
        onClick={onToggle}
        data-testid="button-switcher-toggle"
      >
        <span className="rms-swatch" style={{ '--sw': options.accent.hex } as CSSProperties} aria-hidden="true" />
        <span className="rms-current">{motion.code} · {motion.name} · {header.name} · {options.accent.name}</span>
        <span className="rms-chevron" aria-hidden="true">{collapsed ? '▴' : '▾'}</span>
      </button>
      <div id="rms-body" className="rms-body" hidden={collapsed}>
        {reducedMotion && (
          <p className="rms-note" data-testid="note-reduced-motion">Your system asks for reduced motion, so the room is shown still.</p>
        )}
        <div className="rms-groups">
          <div className="rms-group">
            <span id="rms-label-motion" className="rms-label">Motion</span>
            <ul className="rms-list rms-list-motion" aria-labelledby="rms-label-motion">
              {MOTIONS.map((m) => {
                const inner = (
                  <>
                    <span className="rms-name"><span className="rms-code">{m.code}</span> · {m.name}</span>
                    <span className="rms-meta rms-summary">{m.summary}</span>
                  </>
                );
                const disabled = reducedMotion && m.id !== 'off';
                return (
                  <li key={m.id}>
                    {disabled ? (
                      <span className="rms-link" aria-disabled="true" data-testid={`link-motion-${m.id}`}>{inner}</span>
                    ) : (
                      <Link
                        href={optionsHref(options, { motion: m.id })}
                        replace
                        className="rms-link"
                        aria-current={m.id === shownMotion ? 'true' : undefined}
                        data-testid={`link-motion-${m.id}`}
                      >
                        {inner}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="rms-group">
            <span id="rms-label-header" className="rms-label">Header</span>
            <ul className="rms-list" aria-labelledby="rms-label-header">
              {HEADERS.map((h) => (
                <li key={h.id}>
                  <Link
                    href={optionsHref(options, { header: h.id })}
                    replace
                    className="rms-link"
                    aria-current={h.id === options.header ? 'true' : undefined}
                    data-testid={`link-header-${h.id}`}
                  >
                    <span className="rms-name">{h.name}</span>
                    <span className="rms-meta">{h.summary}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="rms-group">
            <span id="rms-label-accent" className="rms-label">Accent</span>
            <ul className="rms-list" aria-labelledby="rms-label-accent">
              {ACCENTS.map((a) => (
                <li key={a.id}>
                  <Link
                    href={optionsHref(options, { accent: a })}
                    replace
                    className="rms-link rms-link-accent"
                    aria-current={a.id === options.accent.id ? 'true' : undefined}
                    style={{ '--sw': a.hex } as CSSProperties}
                    data-testid={`link-accent-${a.id}`}
                  >
                    <span className="rms-swatch" aria-hidden="true" />
                    <span className="rms-name">{a.name}</span>
                    <span className="rms-meta">{a.hex}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
