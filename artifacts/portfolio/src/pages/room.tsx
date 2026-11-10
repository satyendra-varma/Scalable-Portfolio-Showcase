import { useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { useDocumentMeta } from '@/hooks/use-document-meta';
import { contact, hero } from '@/content/room';
import { RoomScene, hotspots, type HotspotId } from '@/components/room/RoomScene';
import { RoomDialog } from '@/components/room/RoomDialog';
import { SystemExplorer } from '@/components/room/SystemExplorer';
import { ContactContent, ExperienceContent, ProjectList, SkillsContent } from '@/components/room/RoomContent';
import '@/styles/room.css';

export default function Room() {
  const [open, setOpen] = useState<HotspotId | null>(null);
  const [listView, setListView] = useState(false);
  const [activeSkill, setActiveSkill] = useState<string | null>(null);
  const opener = useRef<HTMLElement | null>(null);

  useDocumentMeta('Satyendra Varma Nadimpalli | Full Stack .NET Software Engineer', hero.positioning);

  // Close the panel now, then hand focus back to the object that opened it. A deferred focus
  // (requestAnimationFrame) never runs while the page is in the background, so focus would be lost.
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

  return (
    <div className="rp" data-testid="page-room">
      <a href="#rp-main" className="rp-skip">Skip to content</a>
      <header className="rp-bar">
        <p className="rp-bar-tag">
          <span className="rp-pill">Engineer’s Room</span>
          Interactive portfolio
        </p>
        <a className="rp-bar-link" href={`mailto:${contact.email}`} data-testid="link-header-email">
          Get in touch
        </a>
      </header>
      <main id="rp-main" className="rp-main">
        <section className="rp-hero" aria-labelledby="rp-name">
          <div className="rp-hero-text">
            <h1 id="rp-name" className="rp-name" data-testid="text-name">{hero.name}</h1>
            <p className="rp-role" data-testid="text-role">{hero.role}</p>
            <p className="rp-pos" data-testid="text-positioning">{hero.positioning}</p>
            <button type="button" className="rp-toggle" aria-pressed={listView} onClick={() => setListView(!listView)} data-testid="button-list-view">
              {listView ? 'View as room' : 'View as list'}
            </button>
          </div>
          {!listView && (
            <RoomScene onOpen={(id, el) => { opener.current = el; setOpen(id); }} />
          )}
        </section>
        {listView && (
          <div className="rp-sections" data-testid="list-sections">
            {hotspots.map((h) => (
              <section key={h.id} className="rp-section" aria-labelledby={`sec-${h.id}`}>
                <h2 id={`sec-${h.id}`} className="rp-section-h">{h.label}</h2>
                {body(h.id)}
              </section>
            ))}
          </div>
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
