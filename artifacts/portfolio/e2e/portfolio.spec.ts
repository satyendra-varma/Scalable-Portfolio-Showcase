import { expect, test } from '@playwright/test';

// Prepared for the release-verification stage. Not executed in the first build.
test('portfolio navigation, case study and real resume download', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Full Stack .NET Software Engineer', { exact: true })).toBeVisible();
  await page.goto('/projects/crm');
  await expect(page.getByRole('heading', { name: 'Enterprise CRM Platform', exact: true })).toBeVisible();
  const pdf = await page.request.get('/resume.pdf');
  expect(pdf.ok()).toBeTruthy();
  expect(pdf.headers()['content-type']).toContain('application/pdf');
  expect((await pdf.body()).subarray(0, 4).toString()).toBe('%PDF');
});

test('unsupported chat answer is visible without a paid provider call', async ({ page }) => {
  await page.goto('/#ambassador');
  await page.getByLabel('Or ask your own question').fill('What salary does he want?');
  await page.getByTestId('button-send').click();
  await expect(page.getByText('I don’t have verified information about that.', { exact: true })).toBeVisible();
});

test('unknown case study does not invent project content', async ({ page }) => {
  await page.goto('/projects/not-a-real-project');
  await expect(page.getByRole('heading', { name: /isn’t on the record/i })).toBeVisible();
});
