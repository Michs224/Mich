import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

/** YYYY-MM, the precision the CV uses. */
const month = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'use YYYY-MM');

const pipelineStage = z.object({
  id: z.string(),
  label: z.string(),
  tech: z.string().optional(),
  detail: z.string().optional(),
  /** Branches a router can send work to, such as documents, database, or web. */
  options: z.array(z.object({ label: z.string(), tech: z.string().optional() })).optional(),
});

const traceStep = z.object({
  id: z.string(),
  label: z.string(),
  tech: z.string().optional(),
  speaker: z.enum(['rep', 'agent', 'system']).optional(),
  kind: z.enum(['speech', 'text', 'tool', 'score']),
  output: z.string(),
});

// Every project uses the same fields (src/content/project-template.md), so a new one needs no
// layout work. Metrics, pipeline, and trace are optional extras.
const projects = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        /** One line for the card and the top of the project page. */
        summary: z.string().max(160),
        /** The project description as written on the old site, kept as-is (02 §11, D10). */
        description: z.string(),
        period: z.object({ start: month, end: z.union([month, z.literal('present')]).optional() }).optional(),
        status: z.enum(['in-progress', 'shipped', 'course']),
        featured: z.boolean().default(false),
        order: z.number(),
        domain: z.enum(['llm-voice', 'vision-audio', 'ml-data', 'software']),
        tags: z.array(z.string()).min(1),
        role: z.string().optional(),
        context: z.string().optional(),
        confidential: z.boolean().default(false),
        /** Tools on the card; the first four tags when empty. */
        keyStack: z.array(z.string()).max(4).default([]),
        /** Tools by group on the project page; the tags when empty. */
        stack: z.record(z.string(), z.array(z.string())).default({}),
        metrics: z.array(z.object({ value: z.string(), label: z.string(), method: z.string().optional() })).optional(),
        pipeline: z.array(pipelineStage).optional(),
        trace: z.array(traceStep).optional(),
        links: z.object({ repo: z.url().optional(), demo: z.url().optional(), paper: z.url().optional() }).default({}),
        cover: image().optional(),
        coverAlt: z.string().optional(),
      })
      .refine((p) => !p.cover || p.coverAlt, { message: 'a cover needs coverAlt', path: ['coverAlt'] }),
});

const experience = defineCollection({
  loader: file('src/content/experience.yaml'),
  schema: z.object({
    org: z.string(),
    location: z.string().optional(),
    roles: z.array(z.object({ title: z.string(), start: month, end: month.optional() })).min(1),
    bullets: z.array(z.string()).max(4),
    order: z.number(),
  }),
});

const education = defineCollection({
  loader: file('src/content/education.yaml'),
  schema: z.object({
    school: z.string(),
    degree: z.string(),
    start: z.string(),
    end: z.string().optional(),
    focus: z.string(),
    gpa: z.string().optional(),
    honors: z.array(z.string()).optional(),
    order: z.number(),
  }),
});

const awards = defineCollection({
  loader: file('src/content/awards.yaml'),
  schema: z.object({
    title: z.string(),
    issuer: z.string(),
    date: month,
    tier: z.enum(['highlight', 'earlier']),
  }),
});

const certifications = defineCollection({
  loader: file('src/content/certifications.yaml'),
  schema: z.object({
    title: z.string(),
    issuer: z.string(),
    date: month,
    url: z.url().optional(),
  }),
});

const publications = defineCollection({
  loader: file('src/content/publications.yaml'),
  schema: z.object({
    title: z.string(),
    authors: z.array(z.string()).min(1),
    venue: z.string(),
    publisher: z.string(),
    volume: z.string().optional(),
    pages: z.string().optional(),
    year: z.number(),
    doi: z.string().optional(),
    url: z.url().optional(),
    note: z.string().optional(),
  }),
});

export const collections = { projects, experience, education, awards, certifications, publications };
