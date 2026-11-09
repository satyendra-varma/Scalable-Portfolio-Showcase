import { ExternalLink } from 'lucide-react';
import type { Project } from '@/content/portfolio';
import { getProjectLinks } from '@/lib/project-links';

export function ProjectLinks({ project }: { project: Project }) {
  const links = getProjectLinks(project.id);
  return (
    <>
      {links.length > 0 ? (
        <div className="sx-project-links">
          {links.map((l) => (
            <a key={l.kind} href={l.url} target="_blank" rel="noreferrer" data-testid={`link-project-${l.kind}-${project.id}`}>
              {l.label} <ExternalLink size={11} aria-hidden="true" /><span className="sx-visually-hidden"> (opens in a new tab)</span>
            </a>
          ))}
        </div>
      ) : null}
    </>
  );
}
