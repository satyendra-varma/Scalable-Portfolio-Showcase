import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowDownRight, ArrowUpRight, Check, ChevronDown, ChevronRight,
  Circle, Code2, Database, ExternalLink, Layers3, LockKeyhole,
  Mail, Menu, Network, Server, ShieldCheck, X,
} from "lucide-react";
import "./_group.css";

type Project = {
  id: string;
  index: string;
  title: string;
  type: string;
  summary: string;
  outcome: string;
  outcomeLabel: string;
  stack: string[];
  details: string[];
  icon: typeof Layers3;
};

const projects: Project[] = [
  {
    id: "crm",
    index: "01",
    title: "Enterprise CRM Platform",
    type: "MULTI-TENANT CRM · .NET 8",
    summary: "A domain-driven CRM with authorization, soft deletes, distributed caching, and CQRS handlers.",
    outcome: "Scalable multi-tenant CRM delivered",
    outcomeLabel: "Resume-reported contribution",
    stack: [".NET 8", "DDD", "JWT / RBAC", "EF Core", "Redis", "MediatR"],
    details: [
      "Delivered a scalable multi-tenant enterprise CRM using .NET 8 and Domain-Driven Design.",
      "Incorporated secure JWT/RBAC authorization and EF Core Global Query Filters for automated soft deletes.",
      "Paired Redis distributed caching with MediatR CQRS handlers.",
    ],
    icon: Layers3,
  },
  {
    id: "operations",
    index: "02",
    title: "Business Operations & Auditing Engine",
    type: "INTERNAL OPERATIONS · .NET + REACT",
    summary: "Daily transaction auditing that automates balance calculations, shift scheduling, and restricted record management.",
    outcome: "15+ hours",
    outcomeLabel: "weekly reconciliation time reduced",
    stack: [".NET Core Web API", "React", "Balance calculations", "Shift scheduling", "Role-restricted records"],
    details: [
      "Architected and deployed a high-reliability daily transactional auditing system using .NET Core Web API and React.",
      "Automated complex balance calculations and shift scheduling.",
      "Added role-restricted record management; reduced weekly reconciliation time by 15+ hours.",
    ],
    icon: ShieldCheck,
  },
  {
    id: "ecommerce",
    index: "03",
    title: "Cloud E-Commerce Platform",
    type: "CLOUD DELIVERY · AWS EC2",
    summary: "A containerized full-stack platform with tested .NET services and a configured web edge.",
    outcome: "Containerized",
    outcomeLabel: "full-stack infrastructure on AWS EC2",
    stack: ["C# .NET Core", "MSSQL", "Docker", "AWS EC2", "xUnit", "NGINX", "Certbot"],
    details: [
      "Developed and deployed a containerized full-stack e-commerce infrastructure using C# .NET Core, MSSQL, and Docker on AWS EC2.",
      "Backed the application with comprehensive xUnit unit testing.",
      "Configured NGINX reverse proxying and automated Certbot SSL encryption.",
    ],
    icon: Server,
  },
];

const skillGroups = [
  { name: "Backend & systems", items: "C#, .NET 8, ASP.NET Core, Web API, MVC, Entity Framework Core, LINQ, REST APIs" },
  { name: "Frontend", items: "React, TypeScript, JavaScript, HTML5/CSS3, Bootstrap" },
  { name: "Databases & security", items: "SQL Server (MSSQL), PostgreSQL, SQLite, Oracle DB, JWT Auth, RBAC" },
  { name: "Cloud & DevOps", items: "AWS (EC2, S3), Docker, Kubernetes (familiarity), GitHub Actions, Jenkins, NGINX, Certbot, Git, CI/CD" },
  { name: "Architecture & testing", items: "Domain-Driven Design (DDD), MediatR, MassTransit, Redis, xUnit, Serilog, EF Core Global Query Filters" },
  { name: "Development practices", items: "Agile/Scrum, SDLC, Code Review, Debugging, Production Support" },
];

export function SystemExplorer() {
  const [activeProject, setActiveProject] = useState("crm");
  const [expanded, setExpanded] = useState<string[]>(["crm"]);
  const [mobileMenu, setMobileMenu] = useState(false);
  const current = projects.find((project) => project.id === activeProject) ?? projects[0];
  const CurrentIcon = current.icon;

  const selectProject = (id: string) => {
    setActiveProject(id);
    setExpanded((existing) => existing.includes(id) ? existing : [...existing, id]);
  };

  return (
    <main className="sx">
      <header className="sx-topbar">
        <a className="sx-brand" href="#top" aria-label="Satyendra Varma Nadimpalli — home">
          <span className="sx-brand-mark">SVN<span>.</span></span>
          <span className="sx-brand-caption">SYSTEMS / ENGINEERING</span>
        </a>
        <button className="sx-menu-toggle" onClick={() => setMobileMenu(!mobileMenu)} aria-label={mobileMenu ? "Close navigation" : "Open navigation"}>
          {mobileMenu ? <X size={20} /> : <Menu size={20} />}
        </button>
        <nav className={`sx-nav ${mobileMenu ? "is-open" : ""}`} aria-label="Main navigation">
          <a href="#explorer" onClick={() => setMobileMenu(false)}>System explorer</a>
          <a href="#experience" onClick={() => setMobileMenu(false)}>Experience</a>
          <a href="#about" onClick={() => setMobileMenu(false)}>Background</a>
          <a className="sx-nav-contact" href="mailto:satyendrasatya447@gmail.com">Contact <ArrowUpRight size={14} /></a>
        </nav>
      </header>

      <section className="sx-hero" id="top">
        <div className="sx-hero-grid">
          <motion.div className="sx-hero-copy" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
            <p className="sx-kicker"><span className="sx-live-dot" /> FULL STACK ENGINEERING <span className="sx-kicker-sep">/</span> VANCOUVER, BC</p>
            <h1>Satyendra Varma<br /><em>Nadimpalli</em></h1>
            <p className="sx-role">Full Stack .NET Software Engineer</p>
            <p className="sx-intro">I connect dependable .NET backend systems to practical business outcomes—with React and cloud delivery as part of the build.</p>
            <div className="sx-hero-actions">
              <a className="sx-button sx-button-accent" href="#explorer">Explore the work <ArrowDownRight size={16} /></a>
              <a className="sx-text-link" href="mailto:satyendrasatya447@gmail.com">Get in touch <ArrowUpRight size={15} /></a>
            </div>
          </motion.div>

          <motion.aside className="sx-instrument" aria-label="Capability map, illustrative" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, delay: 0.15 }}>
            <div className="sx-instrument-head"><span>CAPABILITY MAP</span><span className="sx-instrument-status"><Circle size={7} fill="currentColor" /> ILLUSTRATIVE</span></div>
            <div className="sx-map">
              <div className="sx-map-node sx-map-core"><Code2 size={18} /><b>.NET</b><small>BACKEND CORE</small></div>
              <div className="sx-map-link sx-link-a" />
              <div className="sx-map-node sx-map-react"><Layers3 size={16} /><b>React</b><small>INTERFACE</small></div>
              <div className="sx-map-link sx-link-b" />
              <div className="sx-map-node sx-map-cloud"><Network size={16} /><b>Cloud</b><small>DELIVERY</small></div>
              <span className="sx-map-orbit sx-orbit-one" /><span className="sx-map-orbit sx-orbit-two" />
              <span className="sx-map-label">SYSTEMS THINKING · BUSINESS CONTEXT</span>
            </div>
            <p className="sx-illustrative-note">Conceptual capability view — not a production architecture diagram.</p>
          </motion.aside>
        </div>
        <div className="sx-hero-foot">
          <span>4+ YEARS OF SOFTWARE ENGINEERING EXPERIENCE</span>
          <span className="sx-scroll-hint">SCROLL TO EXPLORE <ArrowDownRight size={13} /></span>
        </div>
      </section>

      <section className="sx-explorer" id="explorer">
        <div className="sx-section-heading">
          <div><p className="sx-kicker sx-kicker-dark">01 / TECHNICAL EVIDENCE</p><h2>Trace the work.</h2></div>
          <p className="sx-section-deck">Choose a system to see the engineering contribution, outcome, and technologies the resume actually names.</p>
        </div>
        <div className="sx-explorer-layout">
          <div className="sx-project-list" role="tablist" aria-label="Featured systems">
            {projects.map((project) => {
              const Icon = project.icon;
              return <button key={project.id} className={`sx-project-tab ${activeProject === project.id ? "active" : ""}`} role="tab" aria-selected={activeProject === project.id} onClick={() => selectProject(project.id)}>
                <span className="sx-tab-index">{project.index}</span><span className="sx-tab-icon"><Icon size={18} /></span>
                <span className="sx-tab-copy"><small>{project.type}</small><b>{project.title}</b></span>
                <ChevronRight className="sx-tab-arrow" size={17} />
              </button>;
            })}
            <div className="sx-list-foot"><span className="sx-list-rule" /> 3 SELECTED SYSTEMS</div>
          </div>
          <div className="sx-project-detail" role="tabpanel" key={current.id}>
            <div className="sx-detail-top"><span className="sx-detail-index">SYSTEM / {current.index}</span><span className="sx-detail-icon"><CurrentIcon size={19} /></span></div>
            <h3>{current.title}</h3><p className="sx-detail-summary">{current.summary}</p>
            <div className="sx-outcome"><span className="sx-outcome-label">{current.outcomeLabel}</span><strong>{current.outcome}</strong></div>
            <div className="sx-evidence">
              <button className="sx-evidence-toggle" onClick={() => setExpanded((prev) => prev.includes(current.id) ? prev.filter((id) => id !== current.id) : [...prev, current.id])} aria-expanded={expanded.includes(current.id)}>
                <span><span className="sx-evidence-marker" /> Resume-backed contribution</span><ChevronDown size={17} className={expanded.includes(current.id) ? "rotated" : ""} />
              </button>
              <AnimatePresence initial={false}>{expanded.includes(current.id) && <motion.ul className="sx-evidence-list" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.24 }}>
                {current.details.map((detail) => <li key={detail}><Check size={14} /> <span>{detail}</span></li>)}
              </motion.ul>}</AnimatePresence>
            </div>
            <div className="sx-stack"><span className="sx-stack-label">TECHNOLOGIES NAMED</span><div className="sx-tags">{current.stack.map((item) => <span key={item}>{item}</span>)}</div></div>
            {current.id === "operations" && <p className="sx-internal-note"><LockKeyhole size={13} /> Internal tool — no public access link.</p>}
            <p className="sx-no-links">No public project URL supplied.</p>
          </div>
        </div>
      </section>

      <section className="sx-impact-band">
        <div className="sx-impact-marker">OUTCOME / 02</div>
        <div className="sx-impact-main"><span>REAL-WORLD IMPACT</span><strong>15<span>+</span></strong><p>hours of weekly reconciliation time reduced</p></div>
        <div className="sx-impact-context"><span className="sx-impact-line" /><p>Reported for the <b>Business Operations & Auditing Engine</b>—not a CRM metric.</p></div>
        <div className="sx-impact-coordinate">BUSINESS OPERATIONS<br />& AUDITING ENGINE</div>
      </section>

      <section className="sx-experience" id="experience">
        <div className="sx-section-heading">
          <div><p className="sx-kicker sx-kicker-dark">02 / PROFESSIONAL EXPERIENCE</p><h2>Systems, in context.</h2></div>
          <p className="sx-section-deck">The work behind the projects, with outcomes attributed to the right role.</p>
        </div>
        <div className="sx-timeline">
          <article className="sx-role-entry">
            <div className="sx-entry-date"><span>APR 2023</span><i /><span>PRESENT</span></div>
            <div className="sx-entry-body"><div className="sx-entry-heading"><div><h3>Software Engineer <span>(Contract)</span></h3><p>Crescenza Consulting Group</p></div><span className="sx-entry-current">CURRENT ROLE</span></div>
              <div className="sx-entry-projects">
                {projects.map((project) => <button key={project.id} className={`sx-entry-project ${activeProject === project.id ? "selected" : ""}`} onClick={() => { selectProject(project.id); document.getElementById("explorer")?.scrollIntoView({ behavior: "smooth" }); }}>
                  <span>{project.index}</span>{project.title}<ArrowUpRight size={14} />
                </button>)}
              </div>
            </div>
          </article>
          <article className="sx-role-entry">
            <div className="sx-entry-date"><span>JUL 2020</span><i /><span>JUN 2021</span></div>
            <div className="sx-entry-body"><div className="sx-entry-heading"><div><h3>.NET Developer</h3><p>Nanomindz Technologies <span className="sx-country">· India</span></p></div><span className="sx-entry-period">2020 — 2021</span></div>
              <div className="sx-nano-grid">
                <div><span className="sx-nano-label"><Database size={13} /> DATABASE PERFORMANCE</span><strong>35%</strong><p>reduction in complex database query execution times</p></div>
                <div><span className="sx-nano-label"><Server size={13} /> API INTEGRATION</span><p>Developed backend RESTful Web APIs and WCF services in C# to integrate internal enterprise subsystems with web clients.</p></div>
                <div><span className="sx-nano-label"><Code2 size={13} /> DELIVERY</span><p>Containerized legacy application components with Docker and integrated them into Jenkins CI/CD build pipelines.</p></div>
              </div>
              <p className="sx-attribution">The 35% query-time reduction is attributed to Nanomindz experience.</p>
            </div>
          </article>
        </div>
      </section>

      <section className="sx-skills" id="capabilities">
        <div className="sx-skills-heading"><p className="sx-kicker">03 / CAPABILITY INDEX</p><h2>A broad toolkit.<br /><em>Clear boundaries.</em></h2><p>Resume-listed skills are shown as a professional toolkit—not assigned to individual projects unless the evidence says so.</p></div>
        <div className="sx-skill-list">{skillGroups.map((group, i) => <div className="sx-skill-row" key={group.name}><span className="sx-skill-number">0{i + 1}</span><h3>{group.name}</h3><p>{group.items}</p><span className="sx-skill-cross">+</span></div>)}</div>
      </section>

      <section className="sx-background" id="about">
        <div className="sx-background-heading"><p className="sx-kicker">04 / FOUNDATION</p><h2>Grounded in<br /><em>the fundamentals.</em></h2></div>
        <div className="sx-background-body">
          <div className="sx-education"><span className="sx-bg-label">EDUCATION</span><h3>Master’s in Applied Computer Science</h3><p>Fairleigh Dickinson University</p><span>Vancouver, BC, Canada <i>·</i> Sep 2021 – Apr 2023</span><div className="sx-focus"><b>FOCUS AREAS</b><p>Advanced Application Development, Web Architecture, Component Security & Secure Cryptographic Hashing</p></div></div>
          <div className="sx-profile-note"><span className="sx-bg-label">ENGINEERING APPROACH</span><p>Distributed architectures, cloud services, and high-performance backend systems—paired with a practical focus on how software changes day-to-day work.</p><span className="sx-profile-rule" /><span className="sx-location"><Circle size={7} fill="currentColor" /> Vancouver, BC, Canada</span></div>
        </div>
      </section>

      <footer className="sx-footer" id="contact">
        <div className="sx-footer-top"><p className="sx-kicker">LET’S TALK SYSTEMS</p><h2>Good engineering<br />starts with <em>the right problem.</em></h2><a className="sx-button sx-button-light" href="mailto:satyendrasatya447@gmail.com"><Mail size={16} /> Email Satyendra <ArrowUpRight size={15} /></a></div>
        <div className="sx-footer-bottom"><a href="mailto:satyendrasatya447@gmail.com">satyendrasatya447@gmail.com</a><a href="https://www.linkedin.com/in/satyendra-varma-nadimpalli-56a199247" target="_blank" rel="noreferrer">LinkedIn <ExternalLink size={13} /></a><span>Vancouver, BC, Canada</span><span className="sx-footer-note">PUBLIC-SAFE PROFILE · RESUME PDF PENDING REVIEW</span><a className="sx-back-top" href="#top">BACK TO TOP ↑</a></div>
      </footer>
    </main>
  );
}
