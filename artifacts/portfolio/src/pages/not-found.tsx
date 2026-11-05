import { Link } from 'wouter';
import { ArrowUpRight } from 'lucide-react';
import { SiteShell } from '@/components/site/SiteShell';
import { useDocumentMeta } from '@/hooks/use-document-meta';
import { projects } from '@/content/portfolio';

export default function NotFound() {
  useDocumentMeta('Page not found — Satyendra Varma Nadimpalli', 'This page does not exist on the portfolio.');
  return (
    <SiteShell>
      <section className="sx-404" aria-labelledby="nf-title">
        <div className="sx-404-inner">
          <p className="sx-kicker sx-kicker-dark">404 / NO EVIDENCE AT THIS ADDRESS</p>
          <h1 id="nf-title">This page<br /><em>isn’t on the record.</em></h1>
          <p>The link may be mistyped or out of date. These routes do exist:</p>
          <div className="sx-404-links">
            <Link href="/" className="sx-entry-project" data-testid="link-404-home"><span>00</span>Portfolio home<ArrowUpRight size={14} aria-hidden="true" /></Link>
            {projects.map((p) => (
              <Link key={p.id} href={`/projects/${p.id}`} className="sx-entry-project" data-testid={`link-404-${p.id}`}>
                <span>{p.index}</span>{p.title}<ArrowUpRight size={14} aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
