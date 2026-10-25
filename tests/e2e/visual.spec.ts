import { test, expect, type Page } from './fixtures';

// The visual QA matrix (02 §16): full-page screenshots for review, written to qa-screenshots/
// (git-ignored). Nothing is compared pixel by pixel; every shot also checks for sideways scroll.
const PAGES = [
  { name: 'home', path: '/' },
  { name: 'project', path: '/work/vision-qc' },
  { name: '404', path: '/this-page-does-not-exist' },
];
const VIEWPORTS = [
  { width: 375, height: 812 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
];

async function shoot(page: Page, file: string) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    // A full-page shot never scrolls, so lazy images would stay blank; load them all first.
    const images = [...document.querySelectorAll<HTMLImageElement>('img[loading="lazy"]')];
    for (const img of images) img.loading = 'eager';
    await Promise.all(images.map((img) => img.decode().catch(() => {})));
    // Let one-shot entrance animations finish so nothing is caught half faded.
    await Promise.all(
      document
        .getAnimations()
        .filter((a) => a.timeline === document.timeline && a.effect?.getComputedTiming().endTime !== Infinity)
        .map((a) => a.finished),
    );
  });
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0);
  await page.screenshot({ path: `qa-screenshots/${file}.png`, fullPage: true });
}

test.describe('visual matrix', () => {
  test.skip(({ browserName }) => browserName !== 'chromium', 'Screenshots come from Chromium');

  for (const colorScheme of ['light', 'dark'] as const) {
    for (const viewport of VIEWPORTS) {
      for (const { name, path } of PAGES) {
        test(`${name} ${viewport.width} ${colorScheme}`, async ({ page }) => {
          await page.setViewportSize(viewport);
          await page.emulateMedia({ colorScheme });
          await page.goto(path);
          await shoot(page, `${name}-${viewport.width}-${colorScheme}`);
        });
      }
    }
  }

  for (const viewport of [VIEWPORTS[0], VIEWPORTS[2]]) {
    test(`home ${viewport.width} reduced motion`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto('/');
      await shoot(page, `home-${viewport.width}-reduced`);
    });
  }
});
