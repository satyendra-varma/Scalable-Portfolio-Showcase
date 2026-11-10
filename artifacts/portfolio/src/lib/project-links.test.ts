import { describe, expect, it } from 'vitest';
import { validateUrl } from './project-links';
import { CRM_LINK, ECOMMERCE_LINK } from '@/content/site';

describe('project link validation', () => {
  it('treats null and blank values as "no link yet"', () => {
    expect(validateUrl(null, 'test')).toBeNull();
    expect(validateUrl('', 'test')).toBeNull();
    expect(validateUrl('   ', 'test')).toBeNull();
  });

  it('accepts and normalizes public HTTPS URLs', () => {
    expect(validateUrl('https://crm.company.dev', 'test')).toBe('https://crm.company.dev/');
    expect(validateUrl(' https://github.com/owner/store ', 'test')).toBe('https://github.com/owner/store');
  });

  it.each(['https://example.com', 'http://site.dev', 'javascript:alert(1)', 'https://localhost',
    'https://127.0.0.1', 'https://10.0.0.1', 'https://user:pass@site.dev',
    'https://site.local', 'not a url'])('rejects unsafe or placeholder values: %s', value => {
    expect(() => validateUrl(value, 'test')).toThrow();
  });

  it('rejects non-string values', () => {
    expect(() => validateUrl(42, 'test')).toThrow();
  });

  it('keeps the committed site.ts links valid', () => {
    expect(() => validateUrl(CRM_LINK, 'CRM_LINK')).not.toThrow();
    expect(() => validateUrl(ECOMMERCE_LINK, 'ECOMMERCE_LINK')).not.toThrow();
  });
});
