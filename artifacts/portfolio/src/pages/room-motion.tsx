import { useEffect, useState, useSyncExternalStore } from 'react';
import { useSearch } from 'wouter';
import { useDocumentMeta } from '@/hooks/use-document-meta';
import { MotionRoom } from '@/variants/motion/MotionRoom';
import { MotionSwitcher } from '@/variants/motion/MotionSwitcher';
import { parseMotion, type MotionId } from '@/variants/motion/options';

const REDUCED_QUERY = '(prefers-reduced-motion: reduce)';

function subscribeReduced(onChange: () => void) {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {};
  const mq = window.matchMedia(REDUCED_QUERY);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}
const reducedSnapshot = () => (typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(REDUCED_QUERY).matches : false);
const reducedServerSnapshot = () => false;

/** The switcher starts collapsed on a phone; the owner's last choice then lasts for the visit. */
let switcherCollapsed: boolean | undefined;
const startsCollapsed = () =>
  switcherCollapsed ?? (typeof window !== 'undefined' && (window.matchMedia?.('(max-width: 640px)').matches ?? false));

/** The motion room: the engineer's room powering on. Not for search engines. */
export default function RoomMotionPage() {
  const search = useSearch();
  const motion = parseMotion(search);
  const [replay, setReplay] = useState(0);
  const reduced = useSyncExternalStore(subscribeReduced, reducedSnapshot, reducedServerSnapshot);
  const shownMotion: MotionId = reduced ? 'off' : motion;
  const [collapsed, setCollapsedState] = useState(startsCollapsed);
  const setCollapsed = (next: boolean) => { switcherCollapsed = next; setCollapsedState(next); };

  useDocumentMeta('Room motion | Satyendra Varma Nadimpalli', 'The engineer’s room, powering on.');
  useEffect(() => {
    const robots = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const previous = robots?.content;
    const meta = robots ?? Object.assign(document.createElement('meta'), { name: 'robots' });
    meta.content = 'noindex, nofollow';
    if (!robots) document.head.appendChild(meta);
    return () => { if (robots && previous !== undefined) robots.content = previous; else meta.remove(); };
  }, []);

  return (
    <div className="rms-page" data-switcher={collapsed ? 'collapsed' : 'open'}>
      {/* Keyed by motion and replay count: changing either starts the room afresh. */}
      <MotionRoom key={`${shownMotion}-${replay}`} motion={shownMotion} />
      <MotionSwitcher
        shownMotion={shownMotion}
        reducedMotion={reduced}
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        onReplay={() => setReplay((n) => n + 1)}
      />
    </div>
  );
}
