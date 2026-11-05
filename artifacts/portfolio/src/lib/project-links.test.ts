import { describe, expect, it } from 'vitest';
import { getProjectLinks, parseProjectLinks, validateUrl } from './project-links';

describe('optional project URLs', () => {
  it('omits null and blank links', () => {
    expect(parseProjectLinks({ crm: { liveUrl: null, repositoryUrl: '' }, ecommerce: {} }))
      .toEqual({ crm: [], ecommerce: [] });
  });

  it('shows supplied HTTPS links with their correct labels', () => {
    const parsed = parseProjectLinks({
      crm: { liveUrl: 'https://crm.company.dev' },
      ecommerce: { repositoryUrl: 'https://github.com/owner/store' },
    });
    expect(parsed.crm[0]).toMatchObject({ kind: 'live', url: 'https://crm.company.dev/' });
    expect(parsed.ecommerce[0]).toMatchObject({ kind: 'repository', label: 'Source repository' });
  });

  it.each(['https://example.com', 'http://site.dev', 'javascript:alert(1)', 'https://localhost',
    'https://127.0.0.1', 'https://10.0.0.1', 'https://user:pass@site.dev',
    'https://site.local', 'not a url'])('rejects unsafe or placeholder values: %s', value => {
    expect(() => validateUrl(value, 'test')).toThrow();
  });

  it.each([null, [], 'wrong', { operations: { liveUrl: 'https://private.company.dev' } },
    { crm: [] }, { crm: { typoUrl: 'https://site.dev' } }])('rejects invalid configuration shapes', input => {
    expect(() => parseProjectLinks(input)).toThrow();
  });

  it('never returns an external link for the internal operations tool', () => {
    expect(getProjectLinks('operations')).toEqual([]);
  });
});
