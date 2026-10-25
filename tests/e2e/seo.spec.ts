import { readFileSync } from 'node:fs';
import sharp from 'sharp';
import { test, expect } from './fixtures';
import { site } from '../../src/data/site';

interface VercelConfig {
  redirects?: { source: string; destination: string; permanent: boolean }[];
  headers?: { source: string; headers: { key: string; value: string }[] }[];
}
const vercel: VercelConfig = JSON.parse(readFileSync('vercel.json', 'utf8'));

test('home metadata', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Michael Geraldin Wijaya | AI Engineer');
  const description = (await page.locator('meta[name="description"]').getAttribute('content')) ?? '';
  expect(description.length).toBeGreaterThanOrEqual(50);
  expect(description.length).toBeLessThanOrEqual(155);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${site.url}/`);
});

test('case pages have clean canonical URLs', async ({ page }) => {
  await page.goto('/work/voice-agent');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${site.url}/work/voice-agent`);
});

test('open graph image is absolute', async ({ page, request }) => {
  await page.goto('/');
  const image = page.locator('meta[property="og:image"]');
  await expect(image).toHaveAttribute('content', /^https:\/\/.+\.png$/);
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
  const path = new URL((await image.getAttribute('content'))!).pathname;
  const file = await request.get(path);
  expect(file.status()).toBe(200);
  const { width, height } = await sharp(await file.body()).metadata();
  expect([width, height]).toEqual([1200, 630]);
});

test('person structured data', async ({ page }) => {
  await page.goto('/');
  const data = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent()) ?? '{}');
  expect(data['@type']).toBe('ProfilePage');
  expect(data.mainEntity['@type']).toBe('Person');
  // Both names people use, so a search for either finds him.
  expect(data.mainEntity.alternateName).toEqual(['Gerald', 'Mich']);
  expect(data.mainEntity.sameAs).toEqual(expect.arrayContaining([site.socials.linkedin, site.socials.github]));
});

// Owner's choice (2026-10-25), as on the old site: the parts of a tab title are split by a bar.
test('every page titles its tab with a bar between the parts', async ({ page }) => {
  for (const [path, title] of [
    ['/work/vision-qc', 'Vision QC (Fiber Installation Audit) | Michael Geraldin Wijaya'],
    ['/this-page-does-not-exist', 'Page not found | Michael Geraldin Wijaya'],
  ]) {
    await page.goto(path);
    await expect(page, path).toHaveTitle(title);
    await expect(page.locator('meta[property="og:title"]'), path).toHaveAttribute('content', title);
  }
});

test('404 is noindex', async ({ page }) => {
  const response = await page.goto('/this-page-does-not-exist');
  expect(response?.status()).toBe(404);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
});

// Owner's note (2026-10-25): the page says what happened and where to go, and leaves the old site out
// of it (old links are redirected anyway, vercel.json).
test('404 points home without talking about the old site', async ({ page }) => {
  await page.goto('/this-page-does-not-exist');
  await expect(page.locator('main')).not.toContainText(/old site/i);
  // A light touch (owner, 2026-10-25: not so stiff, one emoji at most), and still why: the likely
  // causes. The emoji is decoration, so screen readers skip it.
  await expect(page.locator('main .t-lead')).toContainText('I sent my agent to find this page, and it came back empty-handed');
  await expect(page.locator('main')).toContainText('The link may be out of date, or the address mistyped.');
  const emoji = await page.locator('main').evaluate((el) => el.textContent!.match(/\p{Extended_Pictographic}/gu) ?? []);
  expect(emoji).toHaveLength(1);
  await expect(page.locator('main [aria-hidden="true"]', { hasText: emoji[0] })).toHaveCount(1);
  await expect(page.locator('main').getByRole('link', { name: 'Go to the home page' })).toHaveAttribute('href', '/');
});

test('redirect rules cover old URLs', () => {
  // /Mich too, in case Vercel's cleanUrls strips .html before the explicit rule runs.
  for (const source of ['/Mich.html', '/Mich', '/index.html', '/certificates/:path*']) {
    const rule = vercel.redirects?.find((r) => r.source === source);
    expect(rule, source).toBeTruthy();
    expect(rule?.permanent, source).toBe(true);
  }
});

test('security headers are configured', () => {
  const everywhere = vercel.headers?.find((h) => h.source === '/(.*)')?.headers.map((h) => h.key) ?? [];
  expect(everywhere).toEqual(
    expect.arrayContaining(['X-Content-Type-Options', 'Referrer-Policy', 'Permissions-Policy', 'X-Frame-Options']),
  );
  const assets = vercel.headers?.find((h) => h.source === '/_astro/(.*)')?.headers ?? [];
  expect(assets).toContainEqual({ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' });
});

test('sitemap and robots', async ({ request }) => {
  expect(await (await request.get('/robots.txt')).text()).toContain(`Sitemap: ${site.url}/sitemap-index.xml`);
  const sitemap = await (await request.get('/sitemap-0.xml')).text();
  expect(sitemap).toContain(`<loc>${site.url}/</loc>`);
  expect(sitemap).toContain(`<loc>${site.url}/work/voice-agent</loc>`);
  expect(sitemap).not.toContain('404');
});

test('pages run under the CSP without violations', async ({ page, browserName }) => {
  await page.addInitScript(() => {
    const log: string[] = [];
    Object.assign(window, { cspViolations: log });
    document.addEventListener('securitypolicyviolation', (e) => log.push(`${e.violatedDirective} ${e.blockedURI}`));
  });
  const violations = () => page.evaluate(() => (window as unknown as { cspViolations: string[] }).cspViolations);
  await page.route(`${site.formEndpoint}*`, (route) => route.fulfill({ status: 200 }));
  await page.setViewportSize({ width: 1440, height: 900 });

  await page.goto('/');
  await expect(page.locator('meta[http-equiv="content-security-policy"]')).toHaveAttribute('content', /script-src/);
  // Chromium also loads the WebGL chunk, a dynamic import the policy has to allow.
  if (browserName === 'chromium') await expect(page.locator('figure.map')).toHaveClass(/is-live/, { timeout: 10_000 });
  const form = page.locator('form[name="contact"]');
  await form.getByLabel('Name').fill('Ada Lovelace');
  await form.getByLabel('Email').fill('ada@example.com');
  await form.getByLabel('Message').fill('Checking the content security policy.');
  await form.getByRole('button', { name: 'Send message' }).click();
  await expect(form.getByRole('status')).toContainText('Message sent');
  expect(await violations()).toEqual([]);

  await page.goto('/work/voice-agent');
  await expect(page.locator('h1')).toBeVisible();
  expect(await violations()).toEqual([]);
});
