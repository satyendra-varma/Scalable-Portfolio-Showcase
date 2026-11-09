const BLOCKED_HOSTS = /(^|\.)(example\.(com|org|net)|localhost|127\.0\.0\.1|0\.0\.0\.0)$/i;

/**
 * Validates a project link from src/content/site.ts. Blank means "no link yet";
 * anything else must be a public HTTPS URL, or the build fails instead of publishing it.
 */
export function validateUrl(value: unknown, field: string): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value !== 'string') throw new Error(`${field} must be a string`);
  const trimmed = value.trim();
  if (trimmed === '') return null;
  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    throw new Error(`${field} is not a valid URL`);
  }
  if (url.protocol !== 'https:') throw new Error(`${field} must use https`);
  if (url.username || url.password || url.port || BLOCKED_HOSTS.test(url.hostname) ||
      !url.hostname.includes('.') || /^[\d.]+$/.test(url.hostname) ||
      /\.(local|internal)$/i.test(url.hostname)) {
    throw new Error(`${field} is a placeholder or non-public host`);
  }
  return url.toString();
}
