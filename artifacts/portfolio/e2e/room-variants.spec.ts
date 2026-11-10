import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const WCAG = ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'];
const VARIANTS = ['isometric', 'elevation', 'plan', 'exploded'];
const HOTSPOTS = ['explorer', 'skills', 'projects', 'experience', 'contact'];

const axe = async (page: Page) => (await new AxeBuilder({ page }).withTags(WCAG).analyze()).violations;

for (const id of VARIANTS) {
  test(`${id}: hero above the scene, labelled hotspots, explorer, motion and contrast`, async ({ page, isMobile }) => {
    test.slow();
    if (!isMobile) await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`/room-variants/${id}`);
    await expect(page.getByTestId(`variant-${id}`)).toBeVisible();

    // Hero first: name, role and positioning are on screen and end above the scene.
    for (const t of ['text-name', 'text-role', 'text-positioning']) await expect(page.getByTestId(t)).toBeInViewport();
    const hero = (await page.getByTestId('text-positioning').boundingBox())!;
    const scene = (await page.getByTestId('variant-scene').boundingBox())!;
    expect(hero.y + hero.height).toBeLessThanOrEqual(scene.y + 1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);

    // Hotspots: real buttons with visible text, at least 24x24, not overlapping.
    const boxes = [];
    for (const h of HOTSPOTS) {
      const b = page.getByTestId(`hotspot-${h}`);
      await expect(b).toBeVisible();
      expect(await b.evaluate((el) => el.tagName)).toBe('BUTTON');
      expect((await b.innerText()).trim()).not.toBe('');
      const box = (await b.boundingBox())!;
      expect(box.width).toBeGreaterThanOrEqual(24);
      expect(box.height).toBeGreaterThanOrEqual(24);
      boxes.push(box);
    }
    for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
      const [a, c] = [boxes[i], boxes[j]];
      const overlap = a.x < c.x + c.width && c.x < a.x + a.width && a.y < c.y + c.height && c.y < a.y + a.height;
      expect(overlap, `hotspots ${HOTSPOTS[i]} and ${HOTSPOTS[j]} overlap`).toBe(false);
    }
    expect(await axe(page)).toEqual([]);

    // Reduced motion: nothing animates, and keyboard focus is still clearly visible.
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const animated = await page.evaluate((v) => {
      const root = document.querySelector(`[data-variant="${v}"]`)!;
      return [...root.querySelectorAll('*')].filter((el) =>
        ['', '::before', '::after'].some((p) => getComputedStyle(el, p || null).animationName !== 'none')).length;
    }, id);
    expect(animated).toBe(0);
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press('Tab');
      if (await page.getByTestId('hotspot-explorer').evaluate((el) => el === document.activeElement)) break;
    }
    const focal = page.getByTestId('hotspot-explorer');
    await expect(focal).toBeFocused();
    expect(await focal.evaluate((el) => getComputedStyle(el).outlineStyle)).not.toBe('none');
    await page.emulateMedia({ reducedMotion: 'no-preference' });

    // The desk monitor opens the full-screen System Explorer: flow 01 works, 02-10 are Planned.
    await focal.click();
    const panel = page.getByTestId('panel-explorer');
    await expect(panel).toBeVisible();
    const viewport = page.viewportSize()!;
    expect((await panel.boundingBox())!.width).toBeGreaterThanOrEqual(viewport.width - 1);
    const planned = panel.locator('[data-flow-status="planned"]');
    await expect(planned).toHaveCount(9);
    await expect(planned.filter({ hasText: 'Planned' })).toHaveCount(9);
    await expect(planned.locator('a, button, [tabindex]')).toHaveCount(0);
    await expect(panel.getByTestId('button-flow-crm-request')).toBeVisible();
    await panel.getByTestId('button-node-1').click();
    await expect(panel.getByTestId('panel-node-detail')).toContainText('Client request');
    expect(await axe(page)).toEqual([]);
    await page.keyboard.press('Escape');
    await expect(focal).toBeFocused();

    // List view: every section's content, same tokens, still accessible.
    await page.getByTestId('button-list-view').click();
    await expect(page.getByTestId('list-sections').locator(':scope > section')).toHaveCount(5);
    expect(await axe(page)).toEqual([]);
  });
}

test('comparison page switches variants with one click and stays out of search', async ({ page }) => {
  await page.goto('/room-variants');
  await expect(page.getByTestId('variant-isometric')).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  const dock = page.getByTestId('variant-dock');
  await expect(dock.getByRole('link')).toHaveCount(4);
  for (const id of [...VARIANTS].reverse()) {
    await page.getByTestId(`link-variant-${id}`).click();
    await expect(page.getByTestId(`variant-${id}`)).toBeVisible();
    await expect(page.getByTestId(`link-variant-${id}`)).toHaveAttribute('aria-current', 'page');
    await expect(page).toHaveURL(new RegExp(`/room-variants/${id}$`));
  }
});

test('unknown variant shows the 404 page', async ({ page }) => {
  await page.goto('/room-variants/warm');
  await expect(page.getByTestId('page-not-found')).toBeVisible();
});
