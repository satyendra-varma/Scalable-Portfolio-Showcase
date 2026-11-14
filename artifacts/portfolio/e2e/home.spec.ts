import { expect, test } from '@playwright/test';

test('home: the Power-on room at /, no switcher, indexable, links to no hidden page', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('room-motion')).toBeVisible();
  await expect(page.getByTestId('motion-switcher')).toHaveCount(0);
  await expect(page.getByTestId('button-replay')).toHaveCount(0);
  await expect(page).toHaveTitle('Satyendra Varma Nadimpalli | Full Stack .NET Software Engineer');
  await expect(page.locator('meta[name="robots"]')).not.toHaveAttribute('content', /noindex/);
  await expect(page.locator('a[href^="/room"]')).toHaveCount(0);
});

test('the old /room-motion address lands on the home page', async ({ page }) => {
  await page.goto('/room-motion');
  await expect(page.getByTestId('room-motion')).toBeVisible();
  expect(new URL(page.url()).pathname).toBe('/');
});
