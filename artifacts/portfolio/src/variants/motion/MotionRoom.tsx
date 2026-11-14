import { useRef, useState, type CSSProperties } from 'react';
import { contact } from '@/content/room';
import { hotspots, type HotspotId } from '@/components/room/RoomScene';
import { SystemExplorer } from '@/components/room/SystemExplorer';
import { ContactContent, ExperienceContent, ProjectList, SkillsContent } from '@/components/room/RoomContent';
import { Feed } from './Feed';
import { MotionHeader } from './MotionHeader';
import { MotionPanel } from './MotionPanel';
import { MotionStage } from './MotionStage';
import { openingSeen, pickOpening } from './opening';
import { ACCENT, type MotionId } from './options';
import { usePowerOn } from './usePowerOn';
import { ARRIVAL, REACH } from './wiring';
import '@/styles/room.css';
import '../variants.css';
import './room.css';
import './fit.css';
import './power.css';
import './lite.css';

/**
 * The hybrid room (docs/BRIEF-room-motion.md): Elevation's Amber LED header over Exploded's room, in Kapton amber,
 * drawn as one svg per depth layer. Same content, panels and System Explorer as every other room.
 *
 * `motion` is 'b', Power-on (usePowerOn, power.css; its opening takes about 4 seconds), or 'off', the still state
 * that reduced motion also gets. Power-on's opening is the full one on a session's first visit and a short one after.
 * The page keys this component by motion, so choosing a motion starts it afresh.
 * The root carries the choice as data-motion and the accent as custom properties. --rm-progress (0 to 1) is what
 * the header's loading bar shows; it rests at 1, a full bar.
 */
export function MotionRoom({ motion }: { motion: MotionId }) {
  const [open, setOpen] = useState<HotspotId | null>(null);
  const [listView, setListView] = useState(false);
  const [activeSkill, setActiveSkill] = useState<string | null>(null);
  const opener = useRef<HTMLElement | null>(null);
  const root = useRef<HTMLDivElement>(null);
  // The first visit in a session plays the full opening, later ones a short one; chosen once, at mount.
  const [opening] = useState(() => pickOpening({ seen: openingSeen(), mobile: false }));
  const power = usePowerOn(root, motion === 'b', opening);
  const full = opening === 'full';

  // Start closing, and hand focus straight back to the object that opened the panel: the visitor is not kept waiting.
  const close = () => {
    setOpen(null);
    opener.current?.focus();
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
    opener.current = el;
    setOpen(id);
  };
  const style = { '--accent': ACCENT.hex, '--accent-ink': ACCENT.ink, '--evidence': ACCENT.support, '--rm-progress': 1, '--rm-reach': REACH, '--rm-at-x': ARRIVAL.explorer } as CSSProperties;

  return (
    <div ref={root} className="rp rv rm" data-variant="room-motion" data-motion={motion} data-opening={motion === 'b' ? opening : undefined} data-b={full || power === 'on' ? power : undefined} data-lite={!full && power && power !== 'on' ? power : undefined} data-testid="room-motion" style={style}>
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
          <>
            <MotionStage onOpen={onOpen} wire={full && (power === 'dark' || power === 'opening')} />
            <Feed />
          </>
        )}
      </main>
      <MotionPanel
        request={open ? { id: open, title: label(open), full: open === 'explorer' } : null}
        animated={power === 'on'}
        onClose={close}
      >
        {body}
      </MotionPanel>
    </div>
  );
}
