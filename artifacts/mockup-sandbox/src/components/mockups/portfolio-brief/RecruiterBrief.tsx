import { useState } from 'react';
import { ArrowUpRight, ArrowRight, Check, ChevronRight, MapPin, FileText, ShieldCheck, Copy, ChevronDown } from 'lucide-react';
import './RecruiterBrief.css';

const work = [
  { title: 'Enterprise CRM Platform', type: 'Multi-tenant CRM', stack: '.NET 8 · EF Core · Redis · MediatR', headline: 'Domain-driven foundations. Practical application boundaries.', text: 'Delivered a scalable multi-tenant enterprise CRM using .NET 8 and Domain-Driven Design, with JWT/RBAC authorization, EF Core global query filters for soft deletes, Redis distributed caching, and MediatR CQRS handlers.', flow: ['JWT / RBAC', 'MediatR CQRS', 'EF Core + Redis'], labels: ['AUTHORIZE', 'HANDLE', 'PERSIST / CACHE'], boundary: 'The resume does not specify tenant counts, traffic, tenant-isolation mechanisms, or deployment topology. This is a capability summary, not a production architecture diagram.', metric: 'DDD', metricText: 'Domain-Driven Design in a multi-tenant CRM', metricSource: 'Resume-listed architecture · no scale figures claimed.' },
  { title: 'Cloud E-Commerce Platform', type: 'Cloud delivery', stack: 'C# .NET Core · MSSQL · Docker · AWS EC2', headline: 'From tested services to a configured web edge.', text: 'Developed and deployed containerized full-stack infrastructure using C# .NET Core and MSSQL on AWS EC2 with Docker, backed by xUnit unit testing, NGINX reverse proxying, and automated Certbot SSL encryption.', flow: ['xUnit', 'Docker / EC2', 'NGINX + Certbot'], labels: ['TEST', 'DEPLOY', 'SERVE'], boundary: 'No sales, payment-provider, traffic, or uptime figures are provided by the resume. Public project links have not been supplied; this preview does not invent a demo or repository.', metric: 'EC2', metricText: 'Containerized full-stack infrastructure on AWS', metricSource: 'Resume-listed deployment · no uptime figures claimed.' }
];
const priorities = ['.NET backend', 'Full-stack delivery', 'Cloud & deployment'];
const focusProjects = [0, 1, 1];
const positioning = 'Backend-led full-stack engineer building scalable .NET systems and shipping them end to end.';
const skillGroups = [
  ['Backend & systems', 'C#, .NET 8, ASP.NET Core, Web API, MVC, Entity Framework Core, LINQ, REST APIs'],
  ['Frontend', 'React, TypeScript, JavaScript, HTML5/CSS3, Bootstrap'],
  ['Data & security', 'SQL Server, PostgreSQL, SQLite, Oracle DB, JWT Auth, RBAC'],
  ['Cloud & delivery', 'AWS EC2 / S3, Docker, GitHub Actions, Jenkins, NGINX, Certbot, Git, CI/CD. Kubernetes: familiarity.'],
  ['Architecture & testing', 'Domain-Driven Design, MediatR, MassTransit, Redis, xUnit, Serilog, EF Core Global Query Filters'],
  ['Development practices', 'Agile / Scrum, SDLC, code review, debugging, production support']
];

export function RecruiterBrief() {
  const [priority, setPriority] = useState(0);
  const [selected, setSelected] = useState(0);
  const [section, setSection] = useState(0);
  const [sources, setSources] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const project = work[selected];
  const choose = (index: number) => { setPriority(index); setSelected(focusProjects[index]); setSources(false); };
  const copyBrief = async () => {
    try {
      await navigator.clipboard.writeText(`Satyendra Varma Nadimpalli — Full Stack .NET Software Engineer, Vancouver, BC, Canada.\n${positioning}\nHiring focus: ${priorities[priority]}\n${project.title}: ${project.text}\nLive link coming soon\nSource: resume-reported work, Crescenza Consulting Group, Apr 2023–Present, as stated in the supplied resume.\nsatyendrasatya447@gmail.com`);
      setCopied(true); setCopyError(false); setTimeout(() => setCopied(false), 2500);
    } catch { setCopyError(true); }
  };
  return (
    <div className="rb">
      <div className="rb-shell">
        <aside className="rb-sidebar">
          <div className="rb-monogram" aria-hidden="true">sv.</div>
          <h1>Satyendra Varma{' '}<br />Nadimpalli</h1>
          <p className="rb-role">Full Stack .NET{' '}<br />Software Engineer</p>
          <span className="rb-location"><MapPin size={12} /> Vancouver, BC, Canada</span>
          <p className="rb-sidebar-note">{positioning}</p>
          <nav className="rb-menu" aria-label="Briefing sections">
            {['The hiring brief', 'Career & context', 'Technical toolkit'].map((name, index) => <button key={name} className={section === index ? 'active' : ''} aria-current={section === index ? 'page' : undefined} onClick={() => setSection(index)}><span>0{index + 1}</span><span>{name}</span><ChevronRight size={14} /></button>)}
          </nav>
          <div className="rb-sidebar-bottom">
            <p className="rb-label" style={{ marginBottom: 13, color: 'var(--muted)' }}>Start a conversation</p>
            <a className="rb-contact" href="mailto:satyendrasatya447@gmail.com">Email Satyendra <ArrowUpRight size={15} /></a>
            <div className="rb-socials"><a href="https://www.linkedin.com/in/satyendra-varma-nadimpalli-56a199247" target="_blank" rel="noreferrer">LinkedIn ↗</a><span>Vancouver, BC</span></div>
          </div>
        </aside>
        <main className="rb-main">
          <header className="rb-topbar"><span className="rb-label">An engineer, in evidence.</span><a href="mailto:satyendrasatya447@gmail.com">Let’s talk <ArrowUpRight size={14} /></a></header>
          <div className="rb-intro">
            <div><span className="rb-label" style={{ color: 'var(--accent)' }}>The recruiter’s field notes / 0{section + 1}</span><h2>{section === 0 ? <>A backend mindset.<br /><em>An end-to-end builder.</em></> : section === 1 ? <>The work behind<br /><em>the experience.</em></> : <>A broad toolkit.<br /><em>Clear boundaries.</em></>}</h2></div>
            <p>{section === 0 ? positioning : section === 1 ? 'The roles, reported outcomes, and education behind the project evidence.' : 'Resume-listed capabilities. Project-specific technologies are identified in the hiring brief.'}</p>
          </div>
          {section === 0 ? <div className="rb-enter">
            <div className="rb-priority"><span>I’m hiring for</span><div className="rb-choices" aria-label="Hiring focus">{priorities.map((p, i) => <button key={p} onClick={() => choose(i)} aria-pressed={priority === i} className={priority === i ? 'selected' : ''}>{priority === i && <Check size={12} />}{p}</button>)}</div></div>
            <div className="rb-section-top"><h3>Your evidence brief</h3><span className="rb-label">Resume-backed work</span></div>
            <div className="rb-evidence rb-enter" key={selected}>
              <article className="rb-answer"><span className="rb-label">0{selected + 1} / {project.type}</span><h3>{project.headline}</h3><p>{project.text}</p><div className="rb-answer-bottom"><ShieldCheck size={13} /> Resume-reported contribution · Crescenza Consulting Group</div></article>
              <aside className="rb-metric"><span className="rb-label">The signal</span><strong>{project.metric}</strong><p>{project.metricText}</p><small>{project.metricSource}</small></aside>
            </div>
            <div className="rb-projects">
              <div className="rb-section-top"><span className="rb-label">Work to discuss</span><span>Two projects · select to review</span></div>
              {work.map((item, id) => <div key={item.title} className={`rb-project-entry ${selected === id ? 'current' : ''}`}><button className="rb-project-row" aria-pressed={selected === id} onClick={() => { setSelected(id); setSources(false); }}><span>0{id + 1}</span><div><h3>{item.title}</h3><p>{item.stack}</p></div><span className="rb-row-end">{selected === id ? <ArrowRight size={16} /> : <ArrowUpRight size={16} />}</span></button><p className="rb-link-pending">Live link coming soon</p></div>)}
            </div>
            <article className="rb-detail">
              <div className="rb-detail-head"><div><span className="rb-label" style={{ color: 'var(--muted)' }}>A closer look / 0{selected + 1}</span><h3>The implementation, in brief.</h3></div><span>RESUME EVIDENCE</span></div>
              <div className="rb-flow">{project.flow.map((step, i) => <div key={step}><small className="rb-label">{project.labels[i]}</small>{step}</div>)}</div>
              <p>Software Engineer (Contract) · Crescenza Consulting Group · Apr 2023 – Present, as stated in the supplied resume.<br />Capability grouping above is illustrative; it does not represent a production architecture.</p>
              <button className="rb-source-toggle" onClick={() => setSources(!sources)} aria-expanded={sources}>Source & disclosure boundaries <ChevronDown size={13} style={{ transform: sources ? 'rotate(180deg)' : undefined }} /></button>
              {sources && <div className="rb-boundary">{project.boundary}</div>}
            </article>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 17 }}><button onClick={copyBrief} className="rb-source-toggle" style={{ marginTop: 0 }}>{copied ? <Check size={13} /> : <Copy size={13} />}{copied ? 'Brief copied' : 'Copy this hiring brief'}</button></div>
            {copyError && <p role="alert" className="rb-saved">Clipboard access is unavailable. Select the brief text above to copy it manually.</p>}
          </div> : section === 1 ? <div className="rb-enter rb-timeline">
            <article><span className="rb-label">Apr 2023 — Present · As stated in the supplied resume</span><h3>Software Engineer</h3><b>Crescenza Consulting Group · Contract</b><p>Delivered the Enterprise CRM Platform using .NET 8 and Domain-Driven Design. Developed and deployed the Cloud E-Commerce Platform using C# .NET Core, MSSQL, Docker, and AWS EC2.</p><button className="rb-source-toggle" onClick={() => { setSection(0); choose(0); }}>Review the project evidence <ArrowRight size={13} /></button></article>
            <article><span className="rb-label">Sep 2021 — Apr 2023</span><h3>Master’s in Applied Computer Science</h3><b>Fairleigh Dickinson University · Vancouver, BC</b><p>Advanced Application Development, Web Architecture, Component Security & Secure Cryptographic Hashing.</p></article>
            <article><span className="rb-label">Jul 2020 — Jun 2021</span><h3>.NET Developer</h3><b>Nanomindz Technologies · India</b><p>Reduced complex database query execution times by 35% at Nanomindz Technologies by optimizing SQL Server and Oracle stored procedures, indexes, and complex queries. Developed RESTful Web APIs and WCF services in C#; containerized legacy components with Docker and integrated them into Jenkins CI/CD pipelines.</p><div className="rb-boundary">The 35% query-time reduction is attributed only to Nanomindz Technologies—not to either featured project.</div></article>
          </div> : <div className="rb-enter">{skillGroups.map(([name, skills]) => <article className="rb-skill" key={name}><h3>{name}</h3><p>{skills}</p></article>)}<div className="rb-boundary"><ShieldCheck size={14} style={{ verticalAlign: 'middle', marginRight: 7 }} />These are resume-listed skills, not claims that every technology was used on every project.</div><button className="rb-source-toggle" onClick={() => setSection(0)}>Find the technologies in context <ArrowRight size={13} /></button></div>}
          <footer className="rb-footer"><span><FileText size={12} /> Resume-backed facts. Public-safe details.</span><span>Independent portfolio / SV.N</span></footer>
        </main>
      </div>
    </div>
  );
}

export default RecruiterBrief;
