// Lighthouse on the home page and one project page, mobile and desktop (02 §14).
//   npm run lh             serves dist/ the way Vercel does (gzip, clean URLs, vercel.json headers)
//                          and audits it; run `npm run build` first
//   npm run lh -- <url>    audits one deployed page instead
// Reports go to qa-screenshots/lh/. Exits 1 when a score is under its threshold.
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, resolve, sep } from 'node:path';
import { gzipSync } from 'node:zlib';
import { chromium } from '@playwright/test';
import lighthouse from 'lighthouse';
import desktopConfig from 'lighthouse/core/config/desktop-config.js';

const THRESHOLDS = {
  mobile: { performance: 0.95, accessibility: 1, 'best-practices': 1, seo: 1 },
  // Target 100; 0.98 leaves room for run-to-run variance.
  desktop: { performance: 0.98, accessibility: 1, 'best-practices': 1, seo: 1 },
};
const MAP_CHUNK = /\/_astro\/render[^/]*\.js$/;
const PORT = 4322;
const DEBUG_PORT = 9223;
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.avif': 'image/avif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf',
};

/** dist/ over HTTP with Vercel's behavior for this project: cleanUrls, the 404 page, and vercel.json headers. */
async function serveDist() {
  const { headers: rules = [] } = JSON.parse(await readFile('vercel.json', 'utf8'));
  const isFile = (path) => stat(path).then((s) => s.isFile(), () => false);
  const server = createServer(async (req, res) => {
    const path = decodeURIComponent(new URL(req.url ?? '/', 'http://localhost').pathname);
    const candidates = path === '/' ? ['index.html'] : [path.slice(1), `${path.slice(1)}.html`];
    let file = null;
    // Never serve outside dist/, whatever "..", "%2F" or "%5C" the path carries.
    const inDist = (candidate) => resolve('dist', candidate).startsWith(resolve('dist') + sep);
    for (const candidate of candidates) {
      if (inDist(candidate) && (await isFile(join('dist', candidate)))) file = file ?? join('dist', candidate);
    }
    const status = file ? 200 : 404;
    file = file ?? join('dist', '404.html');
    const headers = { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream' };
    for (const rule of rules) {
      if (new RegExp(`^${rule.source}$`).test(path)) for (const { key, value } of rule.headers) headers[key] = value;
    }
    let body = await readFile(file);
    if (/^(text\/|application\/(json|xml)|image\/svg)/.test(headers['Content-Type']) && /gzip/.test(req.headers['accept-encoding'] ?? '')) {
      body = gzipSync(body);
      headers['Content-Encoding'] = 'gzip';
    }
    res.writeHead(status, headers).end(body);
  });
  await new Promise((resolve) => server.listen(PORT, '127.0.0.1', resolve));
  return server;
}

const given = process.argv[2];
const server = given ? null : await serveDist();
const urls = given ? [given] : [`http://127.0.0.1:${PORT}/`, `http://127.0.0.1:${PORT}/work/vision-qc`];

// Playwright's full Chromium; the owner's Windows reports reduced motion, and without this flag the
// map never loads while measuring.
const browser = await chromium.launch({
  channel: 'chromium',
  args: [`--remote-debugging-port=${DEBUG_PORT}`, '--force-prefers-no-reduced-motion'],
});
await mkdir('qa-screenshots/lh', { recursive: true });

const rows = [];
let failed = false;
for (const url of urls) {
  const slug = new URL(url).pathname.replace(/^\/|\/$/g, '').replace(/\//g, '-') || 'home';
  for (const form of ['mobile', 'desktop']) {
    const config = form === 'desktop' ? desktopConfig : undefined;
    const flags = {
      port: DEBUG_PORT,
      output: 'json',
      logLevel: 'error',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    };
    const { lhr } = await lighthouse(url, flags, config);
    await writeFile(`qa-screenshots/lh/${slug}-${form}.json`, JSON.stringify(lhr, null, 2));

    const problems = [];
    for (const [category, minimum] of Object.entries(THRESHOLDS[form])) {
      const score = lhr.categories[category]?.score ?? 0;
      if (score < minimum) problems.push(`${category} ${Math.round(score * 100)} < ${Math.round(minimum * 100)}`);
    }
    const requests = lhr.audits['network-requests']?.details?.items ?? [];
    if (form === 'desktop' && slug === 'home' && !requests.some((r) => MAP_CHUNK.test(r.url))) {
      problems.push('map chunk was not requested');
    }
    if (problems.length) failed = true;
    const score = (c) => Math.round((lhr.categories[c]?.score ?? 0) * 100);
    rows.push({
      page: slug,
      form,
      perf: score('performance'),
      a11y: score('accessibility'),
      bp: score('best-practices'),
      seo: score('seo'),
      LCP: lhr.audits['largest-contentful-paint'].displayValue,
      TBT: lhr.audits['total-blocking-time'].displayValue,
      CLS: lhr.audits['cumulative-layout-shift'].displayValue,
      result: problems.length ? problems.join('; ') : 'ok',
    });
  }
}

await browser.close();
server?.close();
console.table(rows);
process.exit(failed ? 1 : 0);
