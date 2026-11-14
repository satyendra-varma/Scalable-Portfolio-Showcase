import { useSyncExternalStore } from 'react';
import { hero } from '@/content/room';
import { useDocumentMeta } from '@/hooks/use-document-meta';
import { MotionRoom } from '@/variants/motion/MotionRoom';
import type { MotionId } from '@/variants/motion/options';

const REDUCED_QUERY = '(prefers-reduced-motion: reduce)';

function subscribeReduced(onChange: () => void) {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {};
  const mq = window.matchMedia(REDUCED_QUERY);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}
const reducedSnapshot = () => (typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(REDUCED_QUERY).matches : false);
const reducedServerSnapshot = () => false;

/** The home page: the engineer's room powering on, or the still room where the visitor prefers reduced motion. */
export default function HomePage() {
  const reduced = useSyncExternalStore(subscribeReduced, reducedSnapshot, reducedServerSnapshot);
  const motion: MotionId = reduced ? 'off' : 'b';

  useDocumentMeta('Satyendra Varma Nadimpalli | Full Stack .NET Software Engineer', hero.positioning);

  // Keyed by motion: a change of the system setting starts the room afresh.
  return <MotionRoom key={motion} motion={motion} />;
}
