import { contact, education, experience, projects, projectEvidence, skillGroups } from '@/content/room';

export function ProjectList({ activeSkill, headingLevel = 3 }: { activeSkill: string | null; headingLevel?: 3 | 4 }) {
  const ids = activeSkill ? projectEvidence[activeSkill] ?? [] : null;
  const list = ids ? projects.filter((p) => ids.includes(p.id)) : projects;
  const H = `h${headingLevel}` as 'h3';
  return (
    <div className="rp-projects" data-testid="list-projects">
      <p className="rp-status" role="status" data-testid="status-filter">
        {activeSkill
          ? list.length
            ? `Showing projects with source evidence for ${activeSkill}.`
            : `${activeSkill} is a general resume skill; neither featured project lists it as project evidence.`
          : 'Showing both featured projects.'}
      </p>
      {list.map((p) => (
        <article key={p.id} className="rp-card" data-testid={`card-project-${p.id}`}>
          <H className="rp-card-title">{p.name}</H>
          <ul className="rp-bullets rp-card-points">{p.points.map((pt) => <li key={pt}>{pt}</li>)}</ul>
          {p.link ? (
            <a className="rp-link" href={p.link} target="_blank" rel="noreferrer" data-testid={`link-project-${p.id}`}>Visit live project</a>
          ) : null}
        </article>
      ))}
    </div>
  );
}

export function SkillsContent({ activeSkill, setActiveSkill }: { activeSkill: string | null; setActiveSkill: (s: string | null) => void }) {
  return (
    <div>
      <p className="rp-muted">Grouped from the resume. Highlighted chips have project evidence; choosing a chip filters the projects. General skills are not project evidence.</p>
      {skillGroups.map((g) => (
        <fieldset key={g.label} className="rp-group">
          <legend>{g.label}</legend>
          <div className="rp-chips">
            {g.skills.map((s) => (
              <button
                key={s}
                type="button"
                className={`rp-chip${projectEvidence[s] ? ' is-evidence' : ''}`}
                aria-pressed={activeSkill === s}
                onClick={() => setActiveSkill(activeSkill === s ? null : s)}
                data-testid={`chip-skill-${s.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`}
              >
                {s}
              </button>
            ))}
          </div>
        </fieldset>
      ))}
      {activeSkill && (
        <button type="button" className="rp-text-btn" onClick={() => setActiveSkill(null)} data-testid="button-clear-filter">
          Clear filter
        </button>
      )}
      <ProjectList activeSkill={activeSkill} headingLevel={4} />
    </div>
  );
}

export function ExperienceContent() {
  return (
    <div className="rp-timeline">
      {experience.map((e) => (
        <article key={e.org} className="rp-card">
          <h3 className="rp-card-title">{e.org}</h3>
          <p className="rp-meta">{e.title} · {e.dates}</p>
          <ul className="rp-bullets">{e.points.map((pt) => <li key={pt}>{pt}</li>)}</ul>
        </article>
      ))}
      <article className="rp-card">
        <h3 className="rp-card-title">{education.degree}</h3>
        <p className="rp-meta">{education.school} · {education.dates}</p>
        <p>{education.focus}</p>
      </article>
    </div>
  );
}

export function ContactContent() {
  return (
    <div>
      <dl className="rp-dl">
        <dt>Email</dt><dd><a className="rp-link" href={`mailto:${contact.email}`} data-testid="link-email">{contact.email}</a></dd>
        <dt>LinkedIn</dt><dd><a className="rp-link" href={contact.linkedin} target="_blank" rel="noreferrer" data-testid="link-linkedin">Satyendra Varma Nadimpalli on LinkedIn</a></dd>
        <dt>Location</dt><dd>{contact.location}</dd>
        <dt>Resume</dt><dd><span className="rp-placeholder" aria-disabled="true" data-testid="text-resume-placeholder">Resume download unavailable: pending a newly reviewed public PDF</span></dd>
      </dl>
    </div>
  );
}
