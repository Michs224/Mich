import { defineConfig, devices } from '@playwright/test';

// Tests run against the production build (`npm run build` first), served by `astro preview`.
// 127.0.0.1, not localhost: Node binds localhost to ::1 only, and Firefox spends about 2s per
// navigation failing over from 127.0.0.1, which times tests out when the suite runs in parallel.
const URL = 'http://127.0.0.1:4321';

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  // One retry: under load, Firefox's automation layer sometimes throws while closing a context
  // ("removeBrowserContext ... _maybeDontRestoreTabs") after a test has passed. A retried pass is
  // still reported as "flaky", so a real flake stays visible.
  retries: 1,
  reporter: [['list']],
  use: {
    baseURL: URL,
    // The owner's Windows reports reduced motion; tests opt into it explicitly where needed.
    reducedMotion: 'no-preference',
  },
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1',
    url: URL,
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  ],
});
