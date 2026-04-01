import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E Test Configuration
 * 
 * Runs E2E tests against the Angular application.
 * The Angular dev server is started automatically via webServer.
 * 
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',
  /* Run tests in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env['CI'],
  /* Retry on CI only */
  retries: process.env['CI'] ? 2 : 0,
  /* Reporter */
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
  ],
  use: {
    /* Base URL of the Angular app */
    baseURL: 'http://localhost:4200',
    /* Collect trace on failure */
    trace: 'on-first-retry',
    /* Record screenshots on failure */
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  /* Start the Angular dev server before running tests */
  webServer: {
    command: 'cd angular-app && npx ng serve --port 4200',
    url: 'http://localhost:4200',
    reuseExistingServer: !process.env['CI'],
    timeout: 120000,
  },
});
