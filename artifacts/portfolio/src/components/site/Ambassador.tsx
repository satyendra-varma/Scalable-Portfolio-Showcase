import { useRef, useState, type FormEvent } from 'react';
import { useAskAmbassador, useGetAmbassadorStatus, getGetAmbassadorStatusQueryKey } from '@workspace/api-client-react';
import type { AmbassadorAnswer, EvidenceSource } from '@workspace/api-client-react';
import { AlertTriangle, ArrowUpRight, Check, RotateCcw, Send, ShieldCheck, Sparkles, X } from 'lucide-react';
import { SECTION_ANCHORS, starterQuestions } from '@/content/portfolio';

const MAX = 1200;

type Turn =
  | { id: number; question: string; kind: 'answer'; answer: AmbassadorAnswer }
  | { id: number; question: string; kind: 'error'; message: string; retryable: boolean };

function describeError(err: unknown): { message: string; retryable: boolean } {
  const e = err as { status?: number; data?: { detail?: unknown; title?: unknown } | null } | null;
  const status = typeof e?.status === 'number' ? e.status : 0;
  const detail = typeof e?.data?.detail === 'string' ? e.data.detail : '';
  if (status === 429) return { message: 'Too many questions in a short time. Please wait a moment, then try again.', retryable: true };
  if (status === 400 || status === 422) return { message: detail || 'That question could not be accepted. Please rephrase it and keep it under 1200 characters.', retryable: false };
  if (status === 503) return { message: detail || 'The portfolio guide is not available right now. The rest of the site still has the full evidence.', retryable: true };
  if (status === 0) return { message: 'The request could not reach the server. Check your connection and try again.', retryable: true };
  return { message: detail || 'The guide could not answer right now. No example reply has been substituted.', retryable: true };
}

const safeSources = (sources: EvidenceSource[]) =>
  sources.filter((s) => (SECTION_ANCHORS as readonly string[]).includes(s.href) && typeof s.title === 'string');

export function Ambassador() {
  const status = useGetAmbassadorStatus({ query: { queryKey: getGetAmbassadorStatusQueryKey(), retry: false } });
  const ask = useAskAmbassador({ mutation: { gcTime: 0, retry: false } });
  const [turns, setTurns] = useState<Turn[]>([]);
  const [draft, setDraft] = useState('');
  const [pendingQ, setPendingQ] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const nextId = useRef(1);

  const unavailable = status.data?.available === false;
  const busy = pendingQ !== null;

  const submit = (raw: string, replaceId?: number) => {
    const question = raw.trim();
    if (!question) return setFieldError('Type a question first.');
    if (question.length > MAX) return setFieldError(`Questions are limited to ${MAX} characters.`);
    if (busy || unavailable) return;
    setFieldError(null);
    setPendingQ(question);
    if (replaceId !== undefined) setTurns((t) => t.filter((x) => x.id !== replaceId));
    ask.mutate(
      { data: { message: question } },
      {
        onSuccess: (answer) => {
          setTurns((t) => [...t, { id: nextId.current++, question, kind: 'answer', answer }]);
          setDraft('');
        },
        onError: (err) => {
          setTurns((t) => [...t, { id: nextId.current++, question, kind: 'error', ...describeError(err) }]);
        },
        onSettled: () => {
          setPendingQ(null);
          ask.reset();
        },
      },
    );
  };

  const onForm = (e: FormEvent) => {
    e.preventDefault();
    submit(draft);
  };

  const clear = () => {
    setTurns([]);
    setDraft('');
    setFieldError(null);
    ask.reset();
  };

  const statusLabel = status.isLoading ? 'CHECKING' : status.isError ? 'STATUS UNKNOWN' : unavailable ? 'NOT CONFIGURED' : 'CONFIGURED';
  const dotClass = status.isLoading || status.isError ? 'unknown' : unavailable ? 'off' : '';

  return (
    <section className="sx-ambassador" id="ambassador" aria-labelledby="ambassador-title">
      <div className="sx-ambassador-head">
        <div>
          <p className="sx-kicker sx-kicker-dark">04 / ASK FROM THE EVIDENCE</p>
          <h2 id="ambassador-title">A guided<br /><em>technical review.</em></h2>
          <p>Ask about the work. Answers are limited to approved resume evidence, and the guide says so when the resume doesn’t cover something.</p>
        </div>
        <div className="sx-status-badge" data-testid="status-ambassador">
          <Sparkles size={15} aria-hidden="true" />
          <span>AI PORTFOLIO GUIDE<br /><b>{statusLabel}</b></span>
        </div>
      </div>

      <div className="sx-ambassador-panel">
        <div className="sx-chat-top">
          <span className="sx-chat-avatar" aria-hidden="true">SV</span>
          <div><b>Portfolio guide</b><small>Resume-backed answers · sources linked</small></div>
          <span className="sx-chat-status"><i className={`sx-status-dot ${dotClass}`} aria-hidden="true" /> {statusLabel}</span>
        </div>
        <div className="sx-chat-content">
          {unavailable && (
            <div className="sx-answer-error" role="status" data-testid="text-ambassador-unavailable">
              <span className="sx-answer-label"><AlertTriangle size={13} aria-hidden="true" /> GUIDE UNAVAILABLE</span>
              <p>{status.data?.message || 'The portfolio guide is not configured. Every fact is still available in the sections above.'}</p>
            </div>
          )}
          <p className="sx-chat-prompt">Choose a starter question</p>
          <div className="sx-question-list">
            {starterQuestions.map((q, i) => (
              <button key={q} className="sx-question" disabled={busy || unavailable} onClick={() => submit(q)} data-testid={`button-starter-${i}`}>
                <span>0{i + 1}</span>{q}<ArrowUpRight size={14} aria-hidden="true" />
              </button>
            ))}
          </div>

          <div className="sx-transcript" aria-live="polite" aria-busy={busy} data-testid="list-transcript">
            {turns.map((t) => (
              <div key={t.id} style={{ display: 'grid', gap: 10 }}>
                <p className="sx-turn-q"><span className="sx-visually-hidden">You asked: </span>{t.question}</p>
                {t.kind === 'answer' ? (
                  <div className={`sx-answer ${t.answer.status === 'unsupported' ? 'unsupported' : ''}`} data-testid={`text-answer-${t.id}`}>
                    <span className="sx-answer-label">
                      {t.answer.status === 'supported' ? <><Check size={13} aria-hidden="true" /> SOURCE-BACKED ANSWER</> : <><AlertTriangle size={13} aria-hidden="true" /> NOT COVERED BY THE RESUME</>}
                    </span>
                    <p>{t.answer.answer}</p>
                    {safeSources(t.answer.sources).length > 0 && (
                      <div className="sx-source-list">
                        <span>SOURCES</span>
                        {safeSources(t.answer.sources).map((s) => (
                          <a key={`${s.id}-${s.href}`} href={s.href} data-testid={`link-source-${t.id}-${s.id}`}>{s.title} <ArrowUpRight size={11} aria-hidden="true" /></a>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="sx-answer-error" role="alert" data-testid={`text-error-${t.id}`}>
                    <span className="sx-answer-label"><AlertTriangle size={13} aria-hidden="true" /> NO ANSWER RETURNED</span>
                    <p>{t.message}</p>
                    {t.retryable && (
                      <button className="sx-inline-btn" disabled={busy || unavailable} onClick={() => submit(t.question, t.id)} data-testid={`button-retry-${t.id}`}>
                        <RotateCcw size={11} aria-hidden="true" /> Try again
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
            {pendingQ && (
              <div style={{ display: 'grid', gap: 10 }}>
                <p className="sx-turn-q">{pendingQ}</p>
                <div className="sx-skeleton" aria-label="Waiting for an answer" role="status"><i /><i /><i /></div>
              </div>
            )}
          </div>

          <form className="sx-ask-form" onSubmit={onForm} noValidate>
            <label htmlFor="ask-input">Or ask your own question</label>
            <textarea
              id="ask-input"
              value={draft}
              maxLength={MAX + 200}
              disabled={busy || unavailable}
              onChange={(e) => { setDraft(e.target.value); if (fieldError) setFieldError(null); }}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(draft); } }}
              placeholder="e.g. Which projects used Docker?"
              aria-describedby="ask-count ask-privacy"
              aria-invalid={!!fieldError || draft.length > MAX}
              autoComplete="off"
              data-testid="input-question"
            />
            {fieldError && <p className="sx-field-error" role="alert">{fieldError}</p>}
            <div className="sx-ask-row">
              <span id="ask-count" className={`sx-count ${draft.length > MAX ? 'over' : ''}`}>{draft.length} / {MAX}</span>
              <div className="sx-ask-buttons">
                {turns.length > 0 && (
                  <button type="button" className="sx-inline-btn" onClick={clear} disabled={busy} data-testid="button-clear-chat"><X size={11} aria-hidden="true" /> Clear chat</button>
                )}
                <button type="submit" className="sx-send" disabled={busy || unavailable || !draft.trim() || draft.length > MAX} data-testid="button-send">
                  {busy ? 'Asking…' : 'Ask'} <Send size={13} aria-hidden="true" />
                </button>
              </div>
            </div>
          </form>
          <p className="sx-privacy" id="ask-privacy">
            <ShieldCheck size={12} aria-hidden="true" />
            <span>Your question is sent to an AI service to generate the answer. This site doesn’t save chats; the conversation disappears when you clear it or leave. Please don’t include private or sensitive information.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
