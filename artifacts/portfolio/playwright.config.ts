import { defineConfig, devices } from '@playwright/test';

// Without PLAYWRIGHT_BASE_URL, Playwright builds the site and serves the production preview itself.
const externalBaseUrl = process.env.PLAYWRIGHT_BASE_URL;

export default defineConfig({
  testDir: './e2e',
  outputDir: '../../generated-artifacts/playwright-results',
  reporter: 'list',
  use: {
    baseURL: externalBaseUrl ?? 'http://localhost:4173',
    trace: 'retain-on-failure',
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE }
      : undefined,
  },
  webServer: externalBaseUrl
    ? undefined
    : {
        command: 'pnpm run build && pnpm run serve',
        url: 'http://localhost:4173',
        env: { PORT: '4173', BASE_PATH: '/' },
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
  projects: [
    { name: 'desktop-chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-chromium', use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' } },
  ],
});
