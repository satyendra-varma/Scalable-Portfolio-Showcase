import { useRef, useState, type KeyboardEvent } from 'react';
import { crmFlow, deferredFlows, flowSequenceNote } from '@/content/room';

export function RoomExplorer({ initialAsList = false }: { initialAsList?: boolean }) {
  const [active, setActive] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [asList, setAsList] = useState(initialAsList);
  const nodes = useRef<(HTMLButtonElement | null)[]>([]);
  const move = (i: number) => { const n = (i + crmFlow.length) % crmFlow.length; setActive(n); nodes.current[n]?.focus(); };
  const onKey = (e: KeyboardEvent) => {
    const map: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    if (e.key in map) { e.preventDefault(); move(active + map[e.key]); }
    else if (e.key === 'Home') { e.preventDefault(); move(0); }
    else if (e.key === 'End') { e.preventDefault(); move(crmFlow.length - 1); }
  };
  const shown = selected ?? active;
  return (
    <div className="ex">
      <p className="ex-banner" data-testid="text-flow-status">One flow is mapped so far. The other nine are listed and not drawn yet.</p>
      <div className="ex-grid">
        <nav className="ex-selector" aria-label="Flow selector">
          <h3 className="ex-h">Enterprise CRM Platform</h3>
          <div role="radiogroup" aria-label="Available flows">
            <button type="button" role="radio" aria-checked="true" className="ex-flow is-on" data-testid="button-flow-crm-request">
              CRM request lifecycle <span className="ex-count">10 nodes</span>
            </button>
          </div>
          <h3 className="ex-h">Not drawn yet</h3>
          {deferredFlows.map((g) => (
            <div key={g.project} className="ex-deferred">
              <p className="ex-proj">{g.project}</p>
              <ul>{g.flows.map((f) => <li key={f}>{f} <span className="ex-tag">Planned</span></li>)}</ul>
            </div>
          ))}
        </nav>
        <section className="ex-main" aria-labelledby="ex-flow-title">
          <div className="ex-main-head">
            <h3 id="ex-flow-title" className="ex-title">CRM request lifecycle</h3>
            <button type="button" className="rp-text-btn" aria-pressed={asList} onClick={() => setAsList(!asList)} data-testid="button-explorer-list">
              {asList ? 'View as diagram' : 'View as list'}
            </button>
          </div>
          <p className="ex-note">{flowSequenceNote}</p>
          {asList ? (
            <ol className="ex-list" data-testid="list-flow-nodes">
              {crmFlow.map((n) => (
                <li key={n.title}><strong>{n.title}</strong> <span className={`ex-src ${n.source === 'From resume' ? 'is-resume' : ''}`}>{n.source}</span><br />{n.note}</li>
              ))}
            </ol>
          ) : (
            <>
              <ol className="ex-diagram" role="list" aria-label="Diagram nodes. Use arrow keys to move, Enter or Space to select." onKeyDown={onKey}>
                {crmFlow.map((n, i) => (
                  <li key={n.title} className="ex-li" style={{ ['--i' as string]: i }}>
                    <button
                      ref={(el) => { nodes.current[i] = el; }}
                      type="button"
                      tabIndex={i === active ? 0 : -1}
                      aria-pressed={selected === i}
                      className={`ex-node${selected === i ? ' is-sel' : ''}${n.source === 'From resume' ? ' is-resume' : ''}`}
                      onFocus={() => setActive(i)}
                      onClick={() => { setActive(i); setSelected(i); }}
                      data-testid={`button-node-${i + 1}`}
                    >
                      <span className="ex-num">{String(i + 1).padStart(2, '0')}</span>
                      <span className="ex-node-title">{n.title}</span>
                      <span className="ex-node-src">{n.source}</span>
                    </button>
                  </li>
                ))}
              </ol>
              <div className="ex-detail" aria-live="polite" data-testid="panel-node-detail">
                <p className="ex-detail-k">Node {shown + 1} of {crmFlow.length}</p>
                <h4 className="ex-detail-t">{crmFlow[shown].title}</h4>
                <p className={`ex-src ${crmFlow[shown].source === 'From resume' ? 'is-resume' : ''}`}>{crmFlow[shown].source}</p>
                <p>{crmFlow[shown].note}</p>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
