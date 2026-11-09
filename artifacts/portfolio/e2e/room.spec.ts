import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const WCAG = ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'];

test('room: panels, filters, Explorer and accessible alternatives', async ({ page, isMobile }) => {
  if (!isMobile) await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
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
  await expect(page.getByText('Live link coming soon')).toHaveCount(2);
  await page.keyboard.press('Escape');
  await page.getByTestId('hotspot-explorer').click();
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

for (const path of ['/room-directions', '/room-directions/warm', '/projects/crm', '/no-such-page']) {
  test(`retired or unknown route ${path} shows the 404 page`, async ({ page }) => {
    await page.goto(path);
    await expect(page.getByTestId('page-not-found')).toBeVisible();
    await expect(page.getByRole('link')).toHaveCount(1);
    await page.getByTestId('link-404-home').click();
    await expect(page.getByTestId('page-room')).toBeVisible();
    expect((await new AxeBuilder({ page }).withTags(WCAG).analyze()).violations).toEqual([]);
  });
}
