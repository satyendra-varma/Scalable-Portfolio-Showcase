import rawLinks from '../../../../docs/project-links.json';
import type { ProjectId } from '@/content/portfolio';

export type ProjectLink = { kind: 'live' | 'repository'; label: string; url: string };

const BLOCKED_HOSTS = /(^|\.)(example\.(com|org|net)|localhost|127\.0\.0\.1|0\.0\.0\.0)$/i;

export function validateUrl(value: unknown, field: string): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value !== 'string') throw new Error(`project-links: ${field} must be a string or null`);
  const trimmed = value.trim();
  if (trimmed === '') return null;
  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    throw new Error(`project-links: ${field} is not a valid URL`);
  }
  if (url.protocol !== 'https:') throw new Error(`project-links: ${field} must use https`);
  if (url.username || url.password || url.port || BLOCKED_HOSTS.test(url.hostname) ||
      !url.hostname.includes('.') || /^[\d.]+$/.test(url.hostname) ||
      /\.(local|internal)$/i.test(url.hostname)) {
    throw new Error(`project-links: ${field} is a placeholder or non-public host`);
  }
  return url.toString();
}

export function parseProjectLinks(input: unknown): Record<'crm' | 'ecommerce', ProjectLink[]> {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('project-links: expected a project configuration object');
  }
  if (Object.keys(input).some(key => key !== 'crm' && key !== 'ecommerce')) {
    throw new Error('project-links: only crm and ecommerce may have public links');
  }
  const src = (input ?? {}) as Record<string, { liveUrl?: unknown; repositoryUrl?: unknown } | undefined>;
  const build = (id: 'crm' | 'ecommerce'): ProjectLink[] => {
    const entry = src[id] ?? {};
    if (typeof entry !== 'object' || Array.isArray(entry)) {
      throw new Error(`project-links: ${id} must be an object`);
    }
    if (Object.keys(entry).some(key => key !== 'liveUrl' && key !== 'repositoryUrl')) {
      throw new Error(`project-links: unknown field for ${id}`);
    }
    const out: ProjectLink[] = [];
    const live = validateUrl(entry.liveUrl, `${id}.liveUrl`);
    const repo = validateUrl(entry.repositoryUrl, `${id}.repositoryUrl`);
    if (live) out.push({ kind: 'live', label: 'Live project', url: live });
    if (repo) out.push({ kind: 'repository', label: 'Source repository', url: repo });
    return out;
  };
  return { crm: build('crm'), ecommerce: build('ecommerce') };
}

// Validated at import time: an invalid populated value fails the build/start instead of publishing.
const LINKS = parseProjectLinks(rawLinks);

/** Operations is an internal tool and never receives an external link. */
export function getProjectLinks(id: ProjectId): ProjectLink[] {
  if (id === 'operations') return [];
  return LINKS[id];
}
