// Captures the embedding-map posters from the real renderer, in the pose the canvas starts in,
// so swapping the poster for the live canvas shows no jump (02 §8b).
//
// Usage (after `npm run build` and with `npx astro preview` running on port 4321):
//   node tools/embedding-map/poster.mjs [url]
// Then rebuild so astro:assets regenerates the AVIF and WebP files.
import { chromium } from '@playwright/test';

const url = process.argv[2] ?? 'http://localhost:4321/';
const browser = await chromium.launch();

for (const scheme of ['light', 'dark']) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    colorScheme: scheme,
    reducedMotion: 'no-preference',
  });
  const page = await context.newPage();
  // Without animation frames the intro never starts, so the canvas keeps its first frame.
  await page.addInitScript(() => {
    window.requestAnimationFrame = () => 0;
  });
  await page.goto(url);
  await page.addStyleTag({ content: '.map-labels { display: none !important; }' });
  await page.locator('figure.map').scrollIntoViewIfNeeded();
  await page.locator('figure.map.is-live').waitFor({ timeout: 10_000 });
  const path = `src/assets/map/poster-${scheme}.png`;
  await page.locator('figure.map canvas').screenshot({ path, scale: 'device' });
  console.log(`wrote ${path}`);
  await context.close();
}

await browser.close();
