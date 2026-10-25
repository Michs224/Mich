# michgerald.online

Portfolio of Michael Geraldin Wijaya, AI engineer. Live at <https://michgerald.online>.

## Stack

- [Astro](https://astro.build) 7 with static output and TypeScript, no UI framework
- Plain CSS on design tokens (`src/styles/tokens.css`), CSS scroll-driven animations, native view transitions
- WebGL2 without a library for the embedding map in the hero and the sound landscape (a spectrogram terrain) under Contact
- Playwright end-to-end, accessibility (axe), and visual checks in Chromium and Firefox
- Hosted on Vercel

## Commands

Node 24 (see `.node-version`).

| Command | What it does |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Dev server at http://localhost:4321 |
| `npm run build` | Type-check, then build to `dist/` |
| `npm run preview` | Serve `dist/` |
| `npm run test:e2e` | Playwright tests against the built site (build first) |
| `npm run budget` | Size budget per page: HTML, JavaScript, font preloads, 3D chunks, map posters (build first) |
| `npm run lh` | Lighthouse, mobile and desktop, on `dist/` served the way Vercel serves it; `npm run lh -- <url>` audits a deployed page |

## Content

- Projects: `src/content/projects/*.md`, one file per project, validated in `src/content.config.ts`. To add one, copy `src/content/project-template.md` into that folder and fill it in. Every project uses the same card and page; `featured: true` gives it a card in Projects and its own page, with the Markdown body as free text (the description when there is none). The picture on the card and the page (or beside its row in More projects) is the project's `cover` if it has one, which opens larger on a project page; otherwise the site draws the project's place on the embedding map. Every tag shows: in the details panel of a project page (stack groups, then the rest under Topics), or under the project's row in More projects.
- Experience, education, awards, certifications, publications: `src/content/*.yaml`; certificate pictures in `src/assets/certificates/` (a certification's `image`)
- Name, links, resume path, and the contact form endpoint: `src/data/site.ts`
- Resume files: `public/downloads/`

Generated data, rerun after the matching content changes:

| Output | Command |
|---|---|
| Embedding map (`src/data/embedding-map.json`) | `python -I tools/embedding-map/build.py` (requirements in `tools/embedding-map/requirements.txt`) |
| Map posters (`src/assets/map/`) | `node tools/embedding-map/poster.mjs` with a preview running, then rebuild |
| Spectrogram for the sound landscape (`src/data/spectrogram.json`) | `python -I tools/spectrogram/build.py` (Windows: uses System.Speech) |
| Open Graph image (`public/og-default.png`) | `node tools/og.mjs` |

A new project builds right away. It joins the embedding map once both map commands have run; until then the build prints a warning naming it.

## Deploy

This site lives on the branch `v2`; `main` still holds the old static site, so the two versions sit side by side. Vercel's Production Branch (Settings → Git) decides which one michgerald.online serves: `v2` for this site. A push to the production branch deploys it; every other branch gets a preview deployment. Build settings live in `vercel.json`, which only `v2` has, along with the security headers and the redirects for old URLs; leave the dashboard's own build settings alone, so `main` still deploys as plain static files. The project's Node.js version setting must be 24.x.

## Rollback

1. Fastest: Vercel dashboard → Deployments → the previous production deployment → Instant Rollback. On the Hobby plan this reaches only the deployment right before.
2. Back to the old site: set the Production Branch to `main` and redeploy its latest commit. Return to this site the same way with `v2`.
3. The tag `legacy-site` marks the last commit of the old site.
