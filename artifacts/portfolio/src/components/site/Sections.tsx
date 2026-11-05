import { ArrowUpRight, Circle, Code2, Database, Server } from 'lucide-react';
import { projects, skillGroups, type ProjectId } from '@/content/portfolio';

export function ImpactBand() {
  return (
    <section className="sx-impact-band" aria-label="Reported outcome">
      <div className="sx-impact-marker">OUTCOME / 02</div>
      <div className="sx-impact-main"><span>REAL-WORLD IMPACT</span><strong>15<span>+</span></strong><p>hours of weekly reconciliation time reduced</p></div>
      <div className="sx-impact-context"><span className="sx-impact-line" aria-hidden="true" /><p>Reported for the <b>Business Operations & Auditing Engine</b>—not a CRM metric.</p></div>
      <div className="sx-impact-coordinate" aria-hidden="true">BUSINESS OPERATIONS<br />& AUDITING ENGINE</div>
    </section>
  );
}

export function Experience({ activeProject, onJump }: { activeProject: ProjectId; onJump: (id: ProjectId) => void }) {
  return (
    <section className="sx-experience" id="experience" aria-labelledby="experience-title">
      <div className="sx-section-heading">
        <div><p className="sx-kicker sx-kicker-dark">02 / PROFESSIONAL EXPERIENCE</p><h2 id="experience-title">Systems, in context.</h2></div>
        <p className="sx-section-deck">The work behind the projects, with outcomes attributed to the right role.</p>
      </div>
      <div className="sx-timeline">
        <article className="sx-role-entry">
          <div className="sx-entry-date"><span>APR 2023</span><i aria-hidden="true" /><span>PRESENT</span></div>
          <div className="sx-entry-body">
            <div className="sx-entry-heading"><div><h3>Software Engineer <span>(Contract)</span></h3><p>Crescenza Consulting Group</p></div><span className="sx-entry-current">CURRENT ROLE</span></div>
            <div className="sx-entry-projects">
              {projects.map((p) => (
                <button key={p.id} className={`sx-entry-project ${activeProject === p.id ? 'selected' : ''}`} onClick={() => onJump(p.id)} aria-label={`View ${p.title} in the system explorer`} data-testid={`button-jump-${p.id}`}>
                  <span>{p.index}</span>{p.title}<ArrowUpRight size={14} aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>
        </article>
        <article className="sx-role-entry">
          <div className="sx-entry-date"><span>JUL 2020</span><i aria-hidden="true" /><span>JUN 2021</span></div>
          <div className="sx-entry-body">
            <div className="sx-entry-heading"><div><h3>.NET Developer</h3><p>Nanomindz Technologies <span className="sx-country">· India</span></p></div><span className="sx-entry-period">2020 — 2021</span></div>
            <div className="sx-nano-grid">
              <div><span className="sx-nano-label"><Database size={13} aria-hidden="true" /> DATABASE PERFORMANCE</span><strong>35%</strong><p>reduction in complex database query execution times</p></div>
              <div><span className="sx-nano-label"><Server size={13} aria-hidden="true" /> API INTEGRATION</span><p>Developed backend RESTful Web APIs and WCF services in C# to integrate internal enterprise subsystems with web clients.</p></div>
              <div><span className="sx-nano-label"><Code2 size={13} aria-hidden="true" /> DELIVERY</span><p>Containerized legacy application components with Docker and integrated them into Jenkins CI/CD build pipelines.</p></div>
            </div>
            <p className="sx-attribution">The 35% query-time reduction is attributed to Nanomindz experience.</p>
          </div>
        </article>
      </div>
    </section>
  );
}

export function Skills() {
  return (
    <section className="sx-skills" id="capabilities" aria-labelledby="skills-title">
      <div className="sx-skills-heading"><p className="sx-kicker">03 / CAPABILITY INDEX</p><h2 id="skills-title">A broad toolkit.<br /><em>Clear boundaries.</em></h2><p>Resume-listed skills are shown as a professional toolkit—not assigned to individual projects unless the evidence says so.</p></div>
      <ul className="sx-skill-list" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {skillGroups.map((g, i) => (
          <li className="sx-skill-row" key={g.name}><span className="sx-skill-number">0{i + 1}</span><h3>{g.name}</h3><p>{g.items}</p><span className="sx-skill-cross" aria-hidden="true">+</span></li>
        ))}
      </ul>
    </section>
  );
}

export function Background() {
  return (
    <section className="sx-background" id="about" aria-labelledby="about-title">
      <div className="sx-background-heading"><p className="sx-kicker">05 / FOUNDATION</p><h2 id="about-title">Grounded in<br /><em>the fundamentals.</em></h2></div>
      <div className="sx-background-body">
        <div className="sx-education"><span className="sx-bg-label">EDUCATION</span><h3>Master’s in Applied Computer Science</h3><p>Fairleigh Dickinson University</p><span>Vancouver, BC, Canada <i>·</i> Sep 2021 – Apr 2023</span><div className="sx-focus"><b>FOCUS AREAS</b><p>Advanced Application Development, Web Architecture, Component Security & Secure Cryptographic Hashing</p></div></div>
        <div className="sx-profile-note"><span className="sx-bg-label">ENGINEERING APPROACH</span><p>Distributed architectures, cloud services, and high-performance backend systems—paired with a practical focus on how software changes day-to-day work.</p><span className="sx-profile-rule" aria-hidden="true" /><span className="sx-location"><Circle size={7} fill="currentColor" aria-hidden="true" /> Vancouver, BC, Canada</span></div>
      </div>
    </section>
  );
}
