// @ts-check
import { defineConfig, fontProviders, sharpImageService } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://michgerald.online',
  integrations: [sitemap({ filter: (page) => !page.endsWith('/404') })],
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "base-uri 'self'",
        "object-src 'none'",
        // The contact form posts to Google Apps Script, which answers through googleusercontent.
        "connect-src 'self' https://script.google.com https://script.googleusercontent.com",
        "form-action 'self' https://script.google.com https://script.googleusercontent.com",
      ],
      // Inline style attributes carry per-element values (--i, --field, view-transition-name, map
      // label positions), so style-src allows 'unsafe-inline' and Astro emits no style hashes.
      // Scripts keep their hashes.
      styleDirective: { resources: ["'self'", "'unsafe-inline'"] },
    },
  },
  // The map posters are transparent, and WebP keeps transparency at full quality by default, which
  // nearly doubles them. At 60 the points and lines look the same; images without it are unaffected.
  image: { service: sharpImageService({ webp: { alphaQuality: 60, effort: 6 } }) },
  // 'file' writes /work/voice-agent.html; vercel.json cleanUrls serves it at /work/voice-agent.
  trailingSlash: 'never',
  build: {
    format: 'file',
    // All CSS inline: no render-blocking stylesheet requests (02 §14).
    inlineStylesheets: 'always',
  },
  // One self-hosted variable font. The file carries the wght and MONO axes (02 §4).
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Recursive',
      cssVariable: '--font-sans',
      fallbacks: ['ui-sans-serif', 'system-ui', 'sans-serif'],
      options: {
        variants: [
          {
            src: ['./src/assets/fonts/recursive-latin-mono-normal.woff2'],
            weight: '300 1000',
            style: 'normal',
            display: 'swap',
          },
        ],
      },
    },
  ],
});
