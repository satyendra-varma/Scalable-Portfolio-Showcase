import { ArrowUpRight, Plus, MapPin, Mail, Linkedin } from "lucide-react";
import "./_group.css";

const projects = [
  {
    id: "01",
    title: "Enterprise CRM Platform",
    type: "Multi-tenant systems · .NET 8",
    summary: "Delivered a scalable multi-tenant enterprise CRM using .NET 8 and Domain-Driven Design. The evidence is in the mechanisms named in the resume: authorization, soft-delete filtering, caching, and CQRS handlers.",
    tech: [".NET 8", "Domain-Driven Design", "JWT / RBAC", "EF Core", "Redis", "MediatR"],
    outcome: "Mechanism-led",
    outcomeText: "The resume identifies the system as scalable and multi-tenant; no scale figures or deployment topology are published.",
    note: "No public project URL provided.",
  },
  {
    id: "02",
    title: "Business Operations & Auditing Engine",
    type: "Business workflow · .NET Core Web API + React",
    summary: "Architected and deployed a daily transactional auditing system. Its practical value comes through the work it automated: complex balance calculations, shift scheduling, and role-restricted record management.",
    tech: [".NET Core Web API", "React"],
    outcome: "15+ hours",
    outcomeText: "of weekly reconciliation time reduced, as stated in the resume.",
    note: "Internal tool. No public access or project link.",
  },
  {
    id: "03",
    title: "Cloud E-Commerce Platform",
    type: "Full-stack delivery · AWS EC2",
    summary: "Developed and deployed a containerized full-stack e-commerce infrastructure on AWS EC2. The resume names the application stack, testing, reverse proxy, and SSL tooling without describing checkout or sales outcomes.",
    tech: ["C# .NET Core", "MSSQL", "Docker", "AWS EC2", "xUnit", "NGINX", "Certbot"],
    outcome: "Delivery",
    outcomeText: "Containerized deployment with xUnit testing, NGINX reverse proxying, and automated Certbot SSL encryption.",
    note: "No public project URL provided.",
  },
];

const skillGroups = [
  ["Backend & Systems", "C#, .NET 8, ASP.NET Core, Web API, MVC, Entity Framework Core, LINQ, REST APIs."],
  ["Frontend", "React, TypeScript, JavaScript, HTML5/CSS3, Bootstrap."],
  ["Databases & Security", "SQL Server (MSSQL), PostgreSQL, SQLite, Oracle DB, JWT Auth, RBAC."],
  ["Cloud & DevOps", "AWS (EC2, S3), Docker, Kubernetes (familiarity), GitHub Actions, Jenkins, NGINX, Certbot, Git, CI/CD."],
  ["Architecture & Testing", "Domain-Driven Design (DDD), MediatR, MassTransit, Redis, xUnit, Serilog, EF Core Global Query Filters."],
  ["Development Practices", "Agile/Scrum, SDLC, Code Review, Debugging, Production Support."],
  ["AI Development Tools", "GitHub Copilot, Claude Code, ChatGPT, Gemini, Google AI Studio."],
];

export function EvidenceStory() {
  return (
    <main className="evidence-story" id="top">
      <div className="es-shell">
        <header className="es-topline">
          <a className="es-topline-brand" href="#top" aria-label="Satyendra Varma Nadimpalli, top">
            <span className="es-mark">S</span><span>Engineering notes / 01</span>
          </a>
          <nav className="es-nav" aria-label="Main navigation">
            <a href="#work">Selected work</a>
            <a href="#experience">Experience</a>
            <a href="#capabilities">Capabilities</a>
          </nav>
        </header>

        <section className="es-hero" aria-labelledby="es-name">
          <div>
            <div className="es-kicker">A portfolio in evidence · Vancouver, BC</div>
            <h1 className="es-title" id="es-name">Satyendra Varma<br /><em>Nadimpalli</em></h1>
            <p className="es-intro">I connect .NET backend systems to practical business outcomes—with React and cloud delivery as part of the work, not a separate story.</p>
          </div>
          <aside className="es-hero-side">
            <p className="es-roleline">Full Stack .NET<br />Software Engineer</p>
            <div className="es-contact-row">
              <a className="es-pill" href="mailto:satyendrasatya447@gmail.com"><Mail size={15} /> Email</a>
              <a className="es-pill" href="https://www.linkedin.com/in/satyendra-varma-nadimpalli-56a199247" target="_blank" rel="noreferrer"><Linkedin size={15} /> LinkedIn <ArrowUpRight size={13} /></a>
            </div>
            <div className="es-location"><MapPin size={14} style={{ verticalAlign: "-2px", marginRight: 5 }} />Vancouver, BC, Canada</div>
          </aside>
        </section>
      </div>

      <div className="es-band">
        <div className="es-shell es-band-inner">
          <div className="es-label">Working thesis</div>
          <p>Good engineering is legible twice: in the choices made inside a system, and in the hours, workflows, or bottlenecks those choices change.</p>
        </div>
      </div>

      <section className="es-shell es-section" id="work">
        <div className="es-section-head">
          <div className="es-section-number">01 / Selected work</div>
          <div>
            <h2 className="es-section-title">Systems with a reason to exist.</h2>
            <p className="es-section-dek">Three resume-backed projects, ordered from domain-rich backend work to end-to-end delivery. Open a case note to inspect the evidence; no demo links are implied.</p>
          </div>
        </div>
        <div className="es-project-list">
          {projects.map((project) => (
            <details className="es-project" key={project.id}>
              <summary>
                <span className="es-project-index">{project.id} /</span>
                <div><h3 className="es-project-title">{project.title}</h3><div className="es-project-type">{project.type}</div></div>
                <span className="es-toggle" aria-hidden="true"><Plus size={18} /></span>
              </summary>
              <div className="es-project-body">
                <p>{project.summary}</p>
                <div className="es-project-meta">
                  <div className="es-meta-block">
                    <h4>Resume-listed technologies</h4>
                    <div className="es-tags">{project.tech.map((item) => <span className="es-tag" key={item}>{item}</span>)}</div>
                  </div>
                  <div className="es-meta-block">
                    <h4>Outcome / evidence</h4>
                    <div className="es-outcome"><strong>{project.outcome}</strong><span>{project.outcomeText}</span></div>
                  </div>
                </div>
                <div className="es-note">{project.note}</div>
              </div>
            </details>
          ))}
        </div>
        <div className="es-marginalia">
          <strong>Illustrative only</strong>
          <span>Conceptual reading, not a verified production topology: domain rules → application handlers → data access, with interfaces and delivery around the system. The resume does not establish exact service boundaries, tenant isolation mechanics, queues, or deployment topology.</span>
        </div>
      </section>

      <section className="es-shell es-section" id="experience">
        <div className="es-experience">
          <div className="es-timeline-label">02 / Work history</div>
          <div>
            <div className="es-job">
              <div className="es-job-top"><h3>Software Engineer (Contract)</h3><time>Apr 2023 – Present</time></div>
              <div className="es-employer">Crescenza Consulting Group</div>
              <p>Delivered a .NET 8 multi-tenant enterprise CRM using Domain-Driven Design, with JWT/RBAC authorization, EF Core Global Query Filters for automated soft deletes, and Redis distributed caching paired with MediatR CQRS handlers.</p>
              <p>Architected and deployed a daily transactional auditing system using .NET Core Web API and React. Automated balance calculations, shift scheduling, and role-restricted record management, reducing weekly reconciliation time by 15+ hours.</p>
              <p>Developed and deployed a containerized full-stack e-commerce infrastructure using C# .NET Core, MSSQL, Docker, AWS EC2, xUnit, NGINX, and Certbot SSL encryption.</p>
            </div>
            <div className="es-job">
              <div className="es-job-top"><h3>.NET Developer</h3><time>Jul 2020 – Jun 2021</time></div>
              <div className="es-employer">Nanomindz Technologies, India</div>
              <p>Developed backend RESTful Web APIs and WCF services in C# to integrate internal enterprise subsystems with web clients.</p>
              <p>Optimized SQL Server and Oracle stored procedures, indexing strategies, and complex queries to resolve database performance bottlenecks—reducing complex database query execution times by 35%.</p>
              <p>Containerized legacy application components using Docker and integrated them into Jenkins CI/CD build pipelines within an Agile/Scrum environment.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="es-shell es-section" id="capabilities">
        <div className="es-skills-layout">
          <div className="es-timeline-label">03 / Toolkit</div>
          <div>
            <h2 className="es-section-title" style={{ marginBottom: 30 }}>A working vocabulary,<br />not project labels.</h2>
            <div className="es-skill-grid">
              {skillGroups.map(([title, skills]) => <div className="es-skill" key={title}><h3>{title}</h3><p>{skills}</p></div>)}
            </div>
            <div className="es-skill-note">Skills are listed globally as stated in the resume; this list does not imply every skill was used in every project.</div>
          </div>
        </div>
      </section>

      <section className="es-shell es-section" id="education">
        <div className="es-education">
          <div className="es-timeline-label">04 / Education</div>
          <div className="es-education-card">
            <div><h3>Master’s in Applied Computer Science</h3><p>Fairleigh Dickinson University · Vancouver, BC, Canada</p></div>
            <time>Sep 2021 – Apr 2023</time>
          </div>
        </div>
      </section>

      <footer className="es-shell es-footer" id="contact">
        <div>
          <div className="es-kicker">For a conversation about the work</div>
          <h2>Let’s talk systems.</h2>
          <p>Full Stack .NET Software Engineer · Vancouver, BC, Canada</p>
          <a className="es-backtop" href="#top"><ArrowUpRight size={14} /> Back to the beginning</a>
        </div>
        <div className="es-footer-note">
          Public-safe resume PDF is pending review. This prototype does not expose the original resume.
          <br /><br />All project details and career claims are drawn from the supplied resume.
        </div>
      </footer>
    </main>
  );
}
