import { readFileSync } from 'node:fs';
import sharp from 'sharp';
import { test, expect } from '@playwright/test';
import { site } from '../../src/data/site';

interface VercelConfig {
  redirects?: { source: string; destination: string; permanent: boolean }[];
  headers?: { source: string; headers: { key: string; value: string }[] }[];
}
const vercel: VercelConfig = JSON.parse(readFileSync('vercel.json', 'utf8'));

test('home metadata', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Michael Geraldin Wijaya, AI Engineer');
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
  expect(data.mainEntity.sameAs).toEqual(expect.arrayContaining([site.socials.linkedin, site.socials.github]));
});

test('404 is noindex', async ({ page }) => {
  const response = await page.goto('/this-page-does-not-exist');
  expect(response?.status()).toBe(404);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
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
