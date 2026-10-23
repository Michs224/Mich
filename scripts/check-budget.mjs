// Performance budget for the built site (02 §14). Run after `npm run build`; exits 1 when over.
// Per page: HTML (with its inline CSS) and the JS it loads up front, both gzipped, plus no
// stylesheet requests and exactly one font preload. The lazy 3D chunks and the map posters have
// their own budgets because they load later or only on desktop.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, posix } from 'node:path';
import { gzipSync } from 'node:zlib';

const DIST = 'dist';
const KB = 1024;
const BUDGET = { html: 35 * KB, js: 10 * KB, lazyChunk: 8 * KB, poster: 60 * KB };

const gzipped = (file) => gzipSync(readFileSync(join(DIST, file)), { level: 9 }).length;
const walk = (dir) =>
  readdirSync(join(DIST, dir)).flatMap((name) => {
    const path = posix.join(dir, name);
    return statSync(join(DIST, path)).isDirectory() ? walk(path) : [path];
  });
const files = walk('');
const kb = (bytes) => `${(bytes / KB).toFixed(1)} KB`;

/** Follows static imports (relative, or /_astro/ from inline scripts); import() chunks load later. */
function addImports(code, from, seen) {
  for (const [, spec] of code.matchAll(/(?:import|export)\s*(?:[^'"()]*?from\s*)?["']((?:\.{1,2})?\/[^"']+\.js)["']/g)) {
    staticGraph(spec.startsWith('/') ? spec.slice(1) : posix.join(posix.dirname(from), spec), seen);
  }
}
function staticGraph(entry, seen) {
  if (seen.has(entry)) return;
  seen.add(entry);
  addImports(readFileSync(join(DIST, entry), 'utf8'), entry, seen);
}

let over = false;
const check = (ok) => {
  if (!ok) over = true;
  return ok ? 'ok' : 'OVER';
};

const upfront = new Set();
const pages = files.filter((file) => file.endsWith('.html')).map((file) => {
  const html = readFileSync(join(DIST, file), 'utf8');
  const links = html.match(/<link\b[^>]*>/g) ?? [];
  const entries = [
    ...[...html.matchAll(/<script\b[^>]*\bsrc="\/([^"]+\.js)"/g)].map((m) => m[1]),
    ...links.filter((l) => /rel="modulepreload"/.test(l)).map((l) => l.match(/href="\/([^"]+\.js)"/)?.[1]).filter(Boolean),
  ];
  // Astro inlines small module scripts into the page; they count as JS too.
  const inline = [...html.matchAll(/<script\b(?![^>]*\bsrc=)[^>]*\btype="module"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  const graph = new Set();
  for (const entry of entries) staticGraph(entry, graph);
  for (const code of inline) addImports(code, '', graph);
  graph.forEach((f) => upfront.add(f));
  const inlineSize = inline.reduce((sum, code) => sum + gzipSync(code, { level: 9 }).length, 0);
  const js = [...graph].reduce((sum, f) => sum + gzipped(f), inlineSize);
  const htmlSize = gzipped(file);
  const stylesheets = links.filter((l) => /rel="stylesheet"/.test(l)).length;
  const fontPreloads = links.filter((l) => /rel="preload"/.test(l) && /as="font"/.test(l)).length;
  return {
    page: file,
    'html gz': `${kb(htmlSize)} ${check(htmlSize <= BUDGET.html)}`,
    'js gz': `${kb(js)} ${check(js <= BUDGET.js)}`,
    stylesheets: `${stylesheets} ${check(stylesheets === 0)}`,
    'font preloads': `${fontPreloads} ${check(fontPreloads === 1)}`,
  };
});
console.log(`Pages (budget: HTML ${kb(BUDGET.html)}, JS ${kb(BUDGET.js)}, 0 stylesheets, 1 font preload)`);
console.table(pages);

const later = files
  .filter((f) => f.startsWith('_astro/') && f.endsWith('.js') && !upfront.has(f))
  .map((f) => ({ chunk: f, gz: `${kb(gzipped(f))} ${check(gzipped(f) <= BUDGET.lazyChunk)}` }));
console.log(`Lazy chunks (budget ${kb(BUDGET.lazyChunk)} each)`);
console.table(later);

const posters = files
  .filter((f) => /^_astro\/poster-[^/]+\.(avif|webp)$/.test(f))
  .map((f) => {
    const size = statSync(join(DIST, f)).size;
    return { poster: f, size: `${kb(size)} ${check(size <= BUDGET.poster)}` };
  });
console.log(`Map posters (budget ${kb(BUDGET.poster)} each)`);
console.table(posters);

if (pages.length === 0 || posters.length === 0) {
  console.error('Nothing to check: run `npm run build` first.');
  process.exit(1);
}
if (over) {
  console.error('Over budget.');
  process.exit(1);
}
console.log('Within budget.');
