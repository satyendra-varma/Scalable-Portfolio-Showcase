import { Link, useParams } from 'wouter';
import { ArrowUpRight, Check } from 'lucide-react';
import { SiteShell } from '@/components/site/SiteShell';
import { ProjectLinks } from '@/components/site/ProjectLinks';
import { useDocumentMeta } from '@/hooks/use-document-meta';
import { getProject, projects } from '@/content/portfolio';
import NotFound from './not-found';

export default function ProjectPage() {
  const params = useParams<{ slug: string }>();
  const project = getProject(params.slug);
  useDocumentMeta(
    project ? `${project.title} — Satyendra Varma Nadimpalli` : 'Page not found — Satyendra Varma Nadimpalli',
    project ? `${project.summary} Resume-backed case study.` : 'This page does not exist.',
  );
  if (!project) return <NotFound />;
  const Icon = project.icon;

  return (
    <SiteShell>
      <article className="sx-case" aria-labelledby="case-title">
        <div className="sx-case-inner">
          <nav className="sx-crumb" aria-label="Breadcrumb">
            <Link href="/" data-testid="link-crumb-home">Portfolio</Link><span aria-hidden="true">/</span>
            <a href={`${import.meta.env.BASE_URL}#explorer`}>Systems</a><span aria-hidden="true">/</span>
            <span aria-current="page">{project.index}</span>
          </nav>
          <header className="sx-case-head">
            <div>
              <p className="sx-kicker sx-kicker-dark">SYSTEM / {project.index} · {project.type}</p>
              <h1 id="case-title">{project.title}</h1>
              <p className="sx-detail-summary">{project.summary}</p>
            </div>
            <div>
              <span className="sx-detail-icon" aria-hidden="true"><Icon size={19} /></span>
              <div className="sx-outcome"><span className="sx-outcome-label">{project.outcomeLabel}</span><strong>{project.outcome}</strong></div>
            </div>
          </header>
          <div className="sx-case-grid">
            <div>
              <div className="sx-case-block"><span className="sx-bg-label">ROLE CONTEXT</span><h2>Where this work happened</h2><p>{project.context}</p></div>
              <div className="sx-case-block"><span className="sx-bg-label">EVIDENCE BOUNDARY</span><h2>What is not claimed</h2><p>{project.boundary}</p></div>
            </div>
            <div>
              <div className="sx-case-block">
                <span className="sx-bg-label">RESUME-BACKED CONTRIBUTION</span>
                <ul className="sx-evidence-list" style={{ paddingTop: 10 }}>
                  {project.details.map((d) => <li key={d}><Check size={14} aria-hidden="true" /> <span>{d}</span></li>)}
                </ul>
              </div>
              <div className="sx-case-block">
                <div className="sx-stack" style={{ marginTop: 0 }}><span className="sx-stack-label">TECHNOLOGIES NAMED</span><div className="sx-tags">{project.stack.map((s) => <span key={s}>{s}</span>)}</div></div>
                <ProjectLinks project={project} />
              </div>
            </div>
          </div>
          <nav className="sx-case-nav" aria-label="Other systems">
            {projects.map((p) => (
              <Link key={p.id} href={`/projects/${p.id}`} className={`sx-entry-project ${p.id === project.id ? 'selected' : ''}`} aria-current={p.id === project.id ? 'page' : undefined} data-testid={`link-case-nav-${p.id}`}>
                <span>{p.index}</span>{p.title}<ArrowUpRight size={14} aria-hidden="true" />
              </Link>
            ))}
          </nav>
        </div>
      </article>
    </SiteShell>
  );
}
