import { useRef, useState, type ComponentType } from 'react';
import { contact, hero } from '@/content/room';
import { hotspots, type HotspotId } from '@/components/room/RoomScene';
import { RoomDialog } from '@/components/room/RoomDialog';
import { SystemExplorer } from '@/components/room/SystemExplorer';
import { ContactContent, ExperienceContent, ProjectList, SkillsContent } from '@/components/room/RoomContent';
import type { VariantMeta } from './registry';
import type { SceneProps } from './Stage';
import '@/styles/room.css';
import './variants.css';

/**
 * The room as each variant renders it: same content, same panels, same explorer.
 * The hero always precedes the scene in the document and on screen.
 */
export function VariantRoom({ variant, Scene }: { variant: VariantMeta; Scene: ComponentType<SceneProps> }) {
  const [open, setOpen] = useState<HotspotId | null>(null);
  const [listView, setListView] = useState(false);
  const [activeSkill, setActiveSkill] = useState<string | null>(null);
  const opener = useRef<HTMLElement | null>(null);

  const close = () => {
    setOpen(null);
    const el = opener.current;
    requestAnimationFrame(() => el?.focus());
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
    <div className="rp rv" data-variant={variant.id} data-testid={`variant-${variant.id}`}>
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
        <section className="rv-hero" aria-labelledby="rv-name" data-testid="variant-hero">
          <h1 id="rv-name" className="rp-name rv-name" data-testid="text-name">{hero.name}</h1>
          <p className="rp-role rv-role" data-testid="text-role">{hero.role}</p>
          <p className="rp-pos rv-pos" data-testid="text-positioning">{hero.positioning}</p>
          <button type="button" className="rp-toggle rv-toggle" aria-pressed={listView} onClick={() => setListView(!listView)} data-testid="button-list-view">
            {listView ? 'View as room' : 'View as list'}
          </button>
        </section>
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
          <Scene onOpen={(id, el) => { opener.current = el; setOpen(id); }} />
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
