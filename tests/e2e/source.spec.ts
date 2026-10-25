import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect } from './fixtures';

// Checks on the source itself; no page is opened.

test('every light-dark() token has a fallback for browsers without it', () => {
  const css = readFileSync('src/styles/tokens.css', 'utf8');
  const tokens = new Set([...css.matchAll(/(--[\w-]+):[^;]*light-dark\(/g)].map((m) => m[1]));
  const fallback = css.split('@supports not (color: light-dark(')[1] ?? '';
  expect(tokens.size).toBeGreaterThan(10);
  for (const token of tokens) expect(fallback, token).toContain(`${token}:`);
});

// D8 (owner, 2026-10-21): the company stays off the site for now, and the repo is public.
test('the public repo does not name the company kept off the site', () => {
  const name = ['intel', 'evo'].join('');
  const textFile = /\.(astro|ts|mjs|js|css|md|json|ya?ml|py|html|txt|xml)$/;
  const hits: string[] = [];
  const walk = (path: string) => {
    if (statSync(path).isDirectory()) {
      for (const entry of readdirSync(path)) if (!entry.startsWith('.') && entry !== '__pycache__') walk(join(path, entry));
    } else if (textFile.test(path) && readFileSync(path, 'utf8').toLowerCase().includes(name)) {
      hits.push(path);
    }
  };
  for (const root of ['src', 'tests', 'tools', 'scripts', 'public', 'README.md', 'astro.config.mjs', 'vercel.json', 'package.json']) walk(root);
  expect(hits).toEqual([]);
});
