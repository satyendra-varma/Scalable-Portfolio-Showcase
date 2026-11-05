import { useRef, type KeyboardEvent } from 'react';
import { Link } from 'wouter';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Check, ChevronDown, ChevronRight } from 'lucide-react';
import { projects, type ProjectId } from '@/content/portfolio';
import { ProjectLinks } from './ProjectLinks';

type Props = {
  activeProject: ProjectId;
  expanded: ProjectId[];
  onSelect: (id: ProjectId) => void;
  onToggle: (id: ProjectId) => void;
};

export function Explorer({ activeProject, expanded, onSelect, onToggle }: Props) {
  const reduce = useReducedMotion();
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const current = projects.find((p) => p.id === activeProject) ?? projects[0];
  const CurrentIcon = current.icon;
  const isOpen = expanded.includes(current.id);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = projects.findIndex((p) => p.id === activeProject);
    let next = -1;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (i + 1) % projects.length;
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = (i - 1 + projects.length) % projects.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = projects.length - 1;
    if (next < 0) return;
    e.preventDefault();
    const id = projects[next].id;
    onSelect(id);
    tabRefs.current[id]?.focus();
  };

  return (
    <section className="sx-explorer" id="explorer" aria-labelledby="explorer-title">
      <div className="sx-section-heading">
        <div><p className="sx-kicker sx-kicker-dark">01 / TECHNICAL EVIDENCE</p><h2 id="explorer-title">Trace the work.</h2></div>
        <p className="sx-section-deck">Choose a system to see the engineering contribution, outcome, and technologies the resume actually names.</p>
      </div>
      <div className="sx-explorer-layout">
        <div className="sx-project-list">
          <div role="tablist" aria-label="Featured systems" aria-orientation="vertical" onKeyDown={onKeyDown}>
            {projects.map((project) => {
              const Icon = project.icon;
              const selected = activeProject === project.id;
              return (
                <button
                  key={project.id}
                  ref={(el) => { tabRefs.current[project.id] = el; }}
                  id={`tab-${project.id}`}
                  className={`sx-project-tab ${selected ? 'active' : ''}`}
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`panel-${project.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => onSelect(project.id)}
                  data-testid={`tab-project-${project.id}`}
                >
                  <span className="sx-tab-index">{project.index}</span><span className="sx-tab-icon" aria-hidden="true"><Icon size={18} /></span>
                  <span className="sx-tab-copy"><small>{project.type}</small><b>{project.title}</b></span>
                  <ChevronRight className="sx-tab-arrow" size={17} aria-hidden="true" />
                </button>
              );
            })}
          </div>
          <div className="sx-list-foot" aria-hidden="true"><span className="sx-list-rule" /> 3 SELECTED SYSTEMS</div>
        </div>
        <div className="sx-project-detail" role="tabpanel" id={`panel-${current.id}`} aria-labelledby={`tab-${current.id}`} key={current.id} tabIndex={0} data-testid={`panel-project-${current.id}`}>
          <div className="sx-detail-top"><span className="sx-detail-index">SYSTEM / {current.index}</span><span className="sx-detail-icon" aria-hidden="true"><CurrentIcon size={19} /></span></div>
          <h3>{current.title}</h3><p className="sx-detail-summary">{current.summary}</p>
          <div className="sx-outcome"><span className="sx-outcome-label">{current.outcomeLabel}</span><strong>{current.outcome}</strong></div>
          <div className="sx-evidence">
            <button className="sx-evidence-toggle" onClick={() => onToggle(current.id)} aria-expanded={isOpen} aria-controls={`evidence-${current.id}`} data-testid={`button-evidence-${current.id}`}>
              <span><span className="sx-evidence-marker" aria-hidden="true" /> Resume-backed contribution</span><ChevronDown size={17} className={isOpen ? 'rotated' : ''} aria-hidden="true" />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.ul id={`evidence-${current.id}`} className="sx-evidence-list" initial={reduce ? false : { height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }} transition={{ duration: reduce ? 0 : 0.24 }}>
                  {current.details.map((d) => <li key={d}><Check size={14} aria-hidden="true" /> <span>{d}</span></li>)}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
          <div className="sx-stack"><span className="sx-stack-label">TECHNOLOGIES NAMED</span><div className="sx-tags">{current.stack.map((s) => <span key={s}>{s}</span>)}</div></div>
          <ProjectLinks project={current} />
          <Link className="sx-case-link" href={`/projects/${current.id}`} data-testid={`link-case-${current.id}`}>
            Open case study <ArrowUpRight size={12} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
