import { useRef, useState } from 'react';
import { useDocumentMeta } from '@/hooks/use-document-meta';
import { Link, useParams } from 'wouter';
import { hero } from '@/content/room-preview';
import { RoomScene, hotspots, type Direction, type HotspotId } from '@/components/room/RoomScene';
import { RoomDialog } from '@/components/room/RoomDialog';
import { RoomExplorer } from '@/components/room/RoomExplorer';
import { ContactContent, ExperienceContent, ProjectList, SkillsContent } from '@/components/room/RoomContent';
import '@/styles/room.css';

const meta: Record<Direction, { letter: string; name: string; blurb: string }> = {
  warm: { letter: 'A', name: 'Warm workshop', blurb: 'Oak, paper and late-afternoon daylight.' },
  dark: { letter: 'B', name: 'Night blueprint', blurb: 'Linework, monitor glow and terminal accents.' },
};

export default function RoomDirections({ homepage = false }: { homepage?: boolean }) {
  const params = useParams<{ dir?: string }>();
  const direction: Direction = params.dir === 'dark' ? 'dark' : 'warm';
  const [open, setOpen] = useState<HotspotId | null>(null);
  const [listView, setListView] = useState(false);
  const [activeSkill, setActiveSkill] = useState<string | null>(null);
  const opener = useRef<HTMLElement | null>(null);

  useDocumentMeta(
    homepage
      ? 'Satyendra Varma Nadimpalli | Full Stack .NET Software Engineer'
      : `Room direction ${meta[direction].letter} preview | Satyendra Varma Nadimpalli`,
    homepage
      ? hero.positioning
      : 'Engineer room direction comparison: two approved projects and one representative CRM flow. Selection preview, not the live portfolio.',
  );

  const close = () => {
    setOpen(null);
    const el = opener.current;
    requestAnimationFrame(() => el?.focus());
  };

  const body = (id: HotspotId) => {
    switch (id) {
      case 'explorer': return <RoomExplorer initialAsList={listView && !open} />;
      case 'skills': return <SkillsContent activeSkill={activeSkill} setActiveSkill={setActiveSkill} />;
      case 'experience': return <ExperienceContent />;
      case 'projects': return <ProjectList activeSkill={activeSkill} />;
      case 'contact': return <ContactContent />;
    }
  };
  const label = (id: HotspotId) => hotspots.find((h) => h.id === id)!.label;

  return (
    <div className="rp" data-dir={direction} data-testid={`page-room-${direction}`}>
      <a href="#rp-main" className="rp-skip">Skip to content</a>
      <header className="rp-bar">
        <p className="rp-bar-tag">
          <span className="rp-pill">{homepage ? 'Engineer’s Room' : 'Direction preview'}</span>
          {homepage ? 'Interactive portfolio' : 'Not the live site'}
        </p>
        <nav aria-label="Direction switcher" className="rp-switch">
          {(['warm', 'dark'] as Direction[]).map((d) => (
            <Link key={d} href={`/room-directions/${d}`} className={`rp-switch-a${d === direction ? ' is-on' : ''}`} aria-current={d === direction ? 'page' : undefined} data-testid={`link-direction-${d}`}>
              {meta[d].letter}. {meta[d].name}
            </Link>
          ))}
        </nav>
      </header>
      <main id="rp-main" className="rp-main">
        <section className="rp-hero" aria-labelledby="rp-name">
          <div className="rp-hero-text">
            <h1 id="rp-name" className="rp-name" data-testid="text-name">{hero.name}</h1>
            <p className="rp-role" data-testid="text-role">{hero.role}</p>
            <p className="rp-pos" data-testid="text-positioning">{hero.positioning}</p>
            {!homepage && <p className="rp-dir-note">Direction {meta[direction].letter}: {meta[direction].blurb}</p>}
            <button type="button" className="rp-toggle" aria-pressed={listView} onClick={() => setListView(!listView)} data-testid="button-list-view">
              {listView ? 'View as room' : 'View as list'}
            </button>
          </div>
          {!listView && (
            <RoomScene direction={direction} onOpen={(id, el) => { opener.current = el; setOpen(id); }} />
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
