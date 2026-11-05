import { useEffect, useState } from 'react';
import { SiteShell } from '@/components/site/SiteShell';
import { Hero } from '@/components/site/Hero';
import { Explorer } from '@/components/site/Explorer';
import { Ambassador } from '@/components/site/Ambassador';
import { Background, Experience, ImpactBand, Skills } from '@/components/site/Sections';
import { useDocumentMeta } from '@/hooks/use-document-meta';
import { scrollToId } from '@/lib/paths';
import type { ProjectId } from '@/content/portfolio';

export default function Home() {
  useDocumentMeta(
    'Satyendra Varma Nadimpalli — Full Stack .NET Software Engineer',
    'Resume-backed portfolio of Satyendra Varma Nadimpalli, Full Stack .NET Software Engineer in Vancouver, BC: .NET 8 CRM, operations auditing, and cloud e-commerce work.',
  );
  const [activeProject, setActiveProject] = useState<ProjectId>('crm');
  const [expanded, setExpanded] = useState<ProjectId[]>(['crm']);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) requestAnimationFrame(() => scrollToId(hash));
  }, []);

  const select = (id: ProjectId) => {
    setActiveProject(id);
    setExpanded((e) => (e.includes(id) ? e : [...e, id]));
  };
  const toggle = (id: ProjectId) => setExpanded((e) => (e.includes(id) ? e.filter((x) => x !== id) : [...e, id]));

  return (
    <SiteShell>
      <Hero />
      <Explorer activeProject={activeProject} expanded={expanded} onSelect={select} onToggle={toggle} />
      <ImpactBand />
      <Experience activeProject={activeProject} onJump={(id) => { select(id); scrollToId('explorer'); }} />
      <Skills />
      <Ambassador />
      <Background />
    </SiteShell>
  );
}
