// Renders tools/og.html into public/og-default.png, the 1200x630 Open Graph image.
// Usage: node tools/og.mjs
// The file is quantized to a palette PNG so link previews stay small (WhatsApp skips large images).
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';
import sharp from 'sharp';

const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] }); // font and photo are file:// too
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.goto(new URL('./og.html', import.meta.url).href);
await page.evaluate(() => document.fonts.ready);
if (!(await page.evaluate(() => document.fonts.check('780 68px Recursive')))) {
  throw new Error('Recursive did not load; the image would use a fallback font.');
}
const shot = await page.screenshot();
await browser.close();

const out = fileURLToPath(new URL('../public/og-default.png', import.meta.url));
const info = await sharp(shot).png({ palette: true, quality: 90, compressionLevel: 9 }).toFile(out);
console.log(`${info.width}x${info.height}, ${Math.round(info.size / 1024)} KB -> public/og-default.png`);
