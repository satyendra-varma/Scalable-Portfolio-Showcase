import { ExternalLink, LockKeyhole } from 'lucide-react';
import type { Project } from '@/content/portfolio';
import { getProjectLinks } from '@/lib/project-links';

export function ProjectLinks({ project }: { project: Project }) {
  const links = getProjectLinks(project.id);
  return (
    <>
      {project.internal && (
        <p className="sx-internal-note"><LockKeyhole size={13} aria-hidden="true" /> Internal tool — no public access link.</p>
      )}
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
