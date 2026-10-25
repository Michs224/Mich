// Captures the embedding-map posters from the real renderer, in the pose the canvas starts in,
// so swapping the poster for the live canvas shows no jump (02 §8b).
//
// Usage (after `npm run build` and with `npx astro preview` running on port 4321):
//   node tools/embedding-map/poster.mjs [url]
// Then rebuild so astro:assets regenerates the AVIF and WebP files.
import { chromium } from '@playwright/test';

// 127.0.0.1, not localhost: a dev server may hold localhost (IPv6) on the same port.
const url = process.argv[2] ?? 'http://127.0.0.1:4321/';
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
  // Arriving as from a page of the site, so the opening scene (src/lib/intro.ts) never covers the map.
  await page.goto(url, { referer: url });
  // Transparent like the live canvas, so the light behind the map shows through the poster too.
  // Labels, the pause button and that light sit over or under the canvas; they are not part of it.
  await page.addStyleTag({
    content: 'html, body { background: transparent !important; } .map-labels, .map-turn, .hero-visual::before { display: none !important; }',
  });
  await page.locator('figure.map').scrollIntoViewIfNeeded();
  await page.locator('figure.map.is-live').waitFor({ timeout: 10_000 });
  const path = `src/assets/map/poster-${scheme}.png`;
  await page.locator('figure.map canvas').screenshot({ path, scale: 'device', omitBackground: true });
  console.log(`wrote ${path}`);
  await context.close();
}

await browser.close();
