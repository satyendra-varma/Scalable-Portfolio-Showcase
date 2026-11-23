import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const WCAG = ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'];

test('earlier room (/room-original): panels, filters, Explorer and accessible alternatives', async ({ page, isMobile }) => {
  // A long journey (five panels, filters, keyboard paths, two axe scans). Cold Windows CI runners
  // have taken over 30 s for it, so give it the slow-test budget instead of the 30 s default.
  test.slow();
  if (!isMobile) await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/room-original');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  for (const id of ['text-name', 'text-role', 'text-positioning']) {
    await expect(page.getByTestId(id)).toBeInViewport();
  }
  await expect(page.getByRole('navigation', { name: 'Direction switcher' })).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  for (const id of ['skills', 'experience', 'projects', 'contact', 'explorer']) {
    await page.getByTestId(`hotspot-${id}`).click();
    await expect(page.getByTestId(`panel-${id}`)).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByTestId(`hotspot-${id}`)).toBeFocused();
  }
  await page.getByTestId('hotspot-skills').click();
  await page.getByTestId('chip-skill-redis').click();
  await expect(page.getByTestId('card-project-crm')).toBeVisible();
  await expect(page.getByTestId('card-project-ecommerce')).toHaveCount(0);
  await page.getByTestId('chip-skill-react').click();
  await expect(page.getByTestId('list-projects').getByRole('article')).toHaveCount(0);
  await page.getByTestId('button-clear-filter').click();
  await expect(page.getByTestId('list-projects').getByRole('article')).toHaveCount(2);
  await expect(page.getByText('Live link coming soon')).toHaveCount(0);
  await page.keyboard.press('Escape');
  await page.getByTestId('hotspot-explorer').click();
  const planned = page.getByTestId('panel-explorer').locator('[data-flow-status="planned"]');
  await expect(planned).toHaveCount(9);
  await expect(planned.filter({ hasText: 'Planned' })).toHaveCount(9);
  await expect(planned.locator('a, button, [tabindex]')).toHaveCount(0);
  await page.getByTestId('button-flow-crm-request').focus();
  await page.keyboard.press('Tab');
  await expect(page.getByTestId('button-explorer-list')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByTestId('button-node-1')).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('button-node-2')).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press('End');
  await page.keyboard.press('Space');
  await expect(page.getByTestId('button-node-10')).toHaveAttribute('aria-pressed', 'true');
  await page.getByTestId('button-explorer-list').click();
  await expect(page.getByTestId('list-flow-nodes').locator('li')).toHaveCount(10);
  expect((await new AxeBuilder({ page }).withTags(WCAG).analyze()).violations).toEqual([]);
  await page.keyboard.press('Escape');
  await page.getByTestId('button-list-view').click();
  await expect(page.getByTestId('list-sections').locator(':scope > section')).toHaveCount(5);
  await expect(page.locator('a[href$="resume.pdf"]')).toHaveCount(0);
  await expect(page.getByTestId('text-resume-placeholder')).not.toHaveAttribute('tabindex');
  expect((await new AxeBuilder({ page }).withTags(WCAG).analyze()).violations).toEqual([]);
  await page.getByTestId('button-list-view').click();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(await page.getByTestId('hotspot-explorer').evaluate(el => getComputedStyle(el).animationName)).toBe('none');
  await page.getByTestId('hotspot-explorer').click();
  expect(await page.getByTestId('button-node-1').evaluate(el => getComputedStyle(el).animationName)).toBe('none');
});

// Two font tests, because the faces are not all used at once on the home page: its first screen
// uses only DM Sans and JetBrains Mono, and Space Grotesk is fetched quietly once the opening has
// finished (so the first panel or list view opens without a font change). The earlier room uses all
// three faces on its first screen.
function recordFontRequests(page: Page) {
  const external: string[] = [];
  const fonts: string[] = [];
  page.on('request', (req) => {
    if (/fonts\.(googleapis|gstatic)\.com/.test(req.url())) external.push(req.url());
    if (req.resourceType() === 'font') fonts.push(req.url());
  });
  return { external, fonts };
}

function expectSelfHosted(page: Page, rec: { external: string[]; fonts: string[] }) {
  expect(rec.external).toEqual([]);
  const origin = new URL(page.url()).origin;
  for (const url of rec.fonts) {
    const u = new URL(url);
    expect(u.origin).toBe(origin);
    expect(u.pathname).toContain('/fonts/');
  }
}

test('fonts on the home page are self-hosted, and the heading face loads by itself after the opening', async ({ page }) => {
  // Two waits of up to 20 s each (the opening, then the font) can add up on a slow runner: give this one test the slow-test budget.
  test.slow();
  const rec = recordFontRequests(page);
  await page.goto('/');
  await expect(page.getByTestId('room-motion')).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  expectSelfHosted(page, rec);
  for (const face of ['DM Sans', 'JetBrains Mono']) {
    await expect.poll(() => page.evaluate((f) => document.fonts.check(`16px "${f}"`), face)).toBe(true);
  }
  // The heading face must not be fetched before the room is on. Reading both in one evaluate is what makes
  // this race-free: the room cannot go on between the two reads.
  const early = await page.evaluate(() => ({
    on: document.querySelector('[data-testid="room-motion"]')?.getAttribute('data-b') === 'on',
    fetched: performance.getEntriesByType('resource').some((e) => e.name.includes('space-grotesk')),
  }));
  expect(early.on || !early.fetched).toBe(true);
  // The room goes on when the opening ends (about 5 s on a desktop; data-b is 'on'). Wait for that settled state rather than
  // racing the animation, then the face must arrive by itself (an idle callback), with nothing opened.
  await expect(page.getByTestId('room-motion')).toHaveAttribute('data-b', 'on', { timeout: 20_000 });
  await expect.poll(() => page.evaluate(() => document.fonts.check('700 26px "Space Grotesk"')), { timeout: 20_000 }).toBe(true);
  // The room is settled, so one click opens the list view.
  await page.getByTestId('button-list-view').click();
  await expect(page.getByTestId('list-sections')).toBeVisible();
  expect(await page.evaluate(() => document.fonts.check('700 26px "Space Grotesk"'))).toBe(true);
  expectSelfHosted(page, rec);
});

test('fonts on the earlier room (/room-original) are self-hosted: all three faces load on its first screen', async ({ page }) => {
  const rec = recordFontRequests(page);
  await page.goto('/room-original');
  await expect(page.getByTestId('text-name')).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  expectSelfHosted(page, rec);
  for (const face of ['DM Sans', 'Space Grotesk', 'JetBrains Mono']) {
    await expect.poll(() => page.evaluate((f) => document.fonts.check(`16px "${f}"`), face)).toBe(true);
  }
});

test('no resume PDF is published until the clean copy exists', async ({ page }) => {
  const res = await page.request.get('/resume.pdf');
  expect(res.headers()['content-type'] ?? '').not.toContain('application/pdf');
  expect((await res.body()).subarray(0, 4).toString()).not.toBe('%PDF');
});

for (const path of ['/room-directions', '/room-directions/warm', '/room-variants', '/room-variants/isometric', '/projects/crm', '/no-such-page']) {
  test(`retired or unknown route ${path} shows the 404 page`, async ({ page }) => {
    await page.goto(path);
    await expect(page.getByTestId('page-not-found')).toBeVisible();
    await expect(page.getByRole('link')).toHaveCount(1);
    await page.getByTestId('link-404-home').click();
    await expect(page.getByTestId('room-motion')).toBeVisible();
    await expect(page).toHaveURL(/\/$/);
    // The axe scan used to run on the old home page after the click; that page is still scanned twice in the journey test above.
  });
}
