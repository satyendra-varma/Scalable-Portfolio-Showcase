const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Absolute path within the app, honoring the deployment base path. */
export const appPath = (path: string) => `${BASE}${path.startsWith('/') ? path : `/${path}`}`;

/** Home-page section link that works from any route. */
export const sectionHref = (hash: string, onHome: boolean) => (onHome ? hash : `${appPath('/')}${hash}`);

export const RESUME_URL = `${import.meta.env.BASE_URL}resume.pdf`;

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export const scrollToId = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
};
