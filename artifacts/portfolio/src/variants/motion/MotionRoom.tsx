import { useRef, useState, type CSSProperties } from 'react';
import { flushSync } from 'react-dom';
import { contact } from '@/content/room';
import { hotspots, type HotspotId } from '@/components/room/RoomScene';
import { RoomDialog } from '@/components/room/RoomDialog';
import { SystemExplorer } from '@/components/room/SystemExplorer';
import { ContactContent, ExperienceContent, ProjectList, SkillsContent } from '@/components/room/RoomContent';
import { MotionHeader } from './MotionHeader';
import { MotionStage } from './MotionStage';
import { ACCENT, type MotionId } from './options';
import '@/styles/room.css';
import '../variants.css';
import './room.css';

/**
 * The hybrid room (docs/BRIEF-room-motion.md): Elevation's Amber LED header over Exploded's room, in Kapton amber,
 * drawn as one svg per depth layer. Same content, panels and System Explorer as every other room.
 *
 * `motion` picks the motion concept: 'a' Assembly, 'b' Power-on, 'c' Depth focus, or 'off', the still state that
 * reduced motion also gets. The concepts are not built yet, so every value shows the still room for now.
 * The root carries the choice as data-motion and the accent as custom properties. --rm-progress (0 to 1) is what the header's loading bar shows; it rests at 1, a full bar.
 */
export function MotionRoom({ motion }: { motion: MotionId }) {
  const [open, setOpen] = useState<HotspotId | null>(null);
  const [origin, setOrigin] = useState<{ x: number; y: number } | null>(null);
  const [listView, setListView] = useState(false);
  const [activeSkill, setActiveSkill] = useState<string | null>(null);
  const opener = useRef<HTMLElement | null>(null);

  // Close the panel now, then hand focus back to the object that opened it (see VariantRoom).
  const close = () => {
    const el = opener.current;
    flushSync(() => setOpen(null));
    el?.focus();
  };

  const body = (id: HotspotId) => {
    switch (id) {
      case 'explorer': return <SystemExplorer initialAsList={listView && !open} />;
      case 'skills': return <SkillsContent activeSkill={activeSkill} setActiveSkill={setActiveSkill} />;
      case 'experience': return <ExperienceContent />;
      case 'projects': return <ProjectList activeSkill={activeSkill} />;
      case 'contact': return <ContactContent />;
    }
  };
  const label = (id: HotspotId) => hotspots.find((h) => h.id === id)!.label;
  const onOpen = (id: HotspotId, el: HTMLButtonElement) => {
    const r = el.getBoundingClientRect();
    opener.current = el;
    setOrigin({ x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2) });
    setOpen(id);
  };
  const style = {
    '--accent': ACCENT.hex,
    '--accent-ink': ACCENT.ink,
    '--evidence': ACCENT.support,
    '--rm-progress': 1,
    ...(origin ? { '--open-x': `${origin.x}px`, '--open-y': `${origin.y}px` } : {}),
  } as CSSProperties;

  return (
    <div
      className="rp rv rm"
      data-variant="room-motion"
      data-motion={motion}
      data-testid="room-motion"
      style={style}
    >
      <a href="#rv-main" className="rp-skip">Skip to content</a>
      <header className="rp-bar rv-bar">
        <p className="rp-bar-tag">
          <span className="rp-pill">Engineer’s Room</span>
          Interactive portfolio
        </p>
        <a className="rp-bar-link" href={`mailto:${contact.email}`} data-testid="link-header-email">
          Get in touch
        </a>
      </header>
      <main id="rv-main" className="rv-main">
        <MotionHeader>
          <button type="button" className="rp-toggle rv-toggle" aria-pressed={listView} onClick={() => setListView(!listView)} data-testid="button-list-view">
            {listView ? 'View as room' : 'View as list'}
          </button>
        </MotionHeader>
        {listView ? (
          <div className="rp-sections" data-testid="list-sections">
            {hotspots.map((h) => (
              <section key={h.id} className="rp-section" aria-labelledby={`sec-${h.id}`}>
                <h2 id={`sec-${h.id}`} className="rp-section-h">{h.label}</h2>
                {body(h.id)}
              </section>
            ))}
          </div>
        ) : (
          <MotionStage onOpen={onOpen} />
        )}
      </main>
      {open && (
        <RoomDialog title={label(open)} onClose={close} full={open === 'explorer'} testId={`panel-${open}`}>
          {body(open)}
        </RoomDialog>
      )}
    </div>
  );
}
