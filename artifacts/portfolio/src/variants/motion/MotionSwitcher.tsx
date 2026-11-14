import { Link } from 'wouter';
import { MOTIONS, DEFAULT_SPEED, SPEEDS, motionHref, type MotionId, type SpeedId } from './options';
import './switcher.css';

type Props = {
  shownMotion: MotionId;
  reducedMotion: boolean;
  speed?: SpeedId;
  collapsed: boolean;
  onToggle: () => void;
  onReplay?: () => void;
};

/** Fixed switcher for /room-motion: the motion concept. The choice lives in the query string. */
export function MotionSwitcher({ shownMotion, reducedMotion, speed = DEFAULT_SPEED, collapsed, onToggle, onReplay }: Props) {
  const motion = MOTIONS.find((m) => m.id === shownMotion) ?? MOTIONS[MOTIONS.length - 1];

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
        <span className="rms-label">Motion</span>
        <span className="rms-current">{motion.code} · {motion.name}</span>
        <span className="rms-chevron" aria-hidden="true">{collapsed ? '▴' : '▾'}</span>
      </button>
      <div id="rms-body" className="rms-body" hidden={collapsed}>
        {reducedMotion && (
          <p className="rms-note" data-testid="note-reduced-motion">Your system asks for reduced motion, so the room is shown still.</p>
        )}
        <ul className="rms-list" aria-label="Motion">
          {MOTIONS.map((m) => {
            const inner = (
              <>
                <span className="rms-name"><span className="rms-code">{m.code}</span> · {m.name}</span>
                <span className="rms-meta">{m.summary}</span>
              </>
            );
            const disabled = reducedMotion && m.id !== 'off';
            return (
              <li key={m.id}>
                {disabled ? (
                  <span className="rms-link" aria-disabled="true" data-testid={`link-motion-${m.id}`}>{inner}</span>
                ) : (
                  <Link
                    href={motionHref(m.id, speed)}
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
        {shownMotion === 'b' && !reducedMotion && (
          <div className="rms-speed" data-testid="speed-row">
            <span className="rms-label">Opening</span>
            <ul className="rms-speeds" aria-label="Opening speed">
              {SPEEDS.map((s) => (
                <li key={s.id}>
                  <Link
                    href={motionHref('b', s.id)}
                    replace
                    className="rms-link rms-speed-link"
                    aria-current={s.id === speed ? 'true' : undefined}
                    data-testid={`link-speed-${s.id}`}
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
            <button type="button" className="rms-replay" onClick={onReplay} data-testid="button-replay">Replay</button>
          </div>
        )}
      </div>
    </nav>
  );
}
