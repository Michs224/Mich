import { getCollection, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projects'>;
export type Domain = Project['data']['domain'];

/** Field names shared by the archive headings and the embedding map legend (02 §8b). */
export const DOMAIN_LABELS: Record<Domain, string> = {
  'llm-voice': 'LLM, RAG and voice',
  'vision-audio': 'Vision and audio',
  'ml-data': 'Machine learning and data',
  software: 'Software',
};
const DOMAIN_ORDER: Domain[] = ['llm-voice', 'vision-audio', 'ml-data', 'software'];

const byOrder = <T extends { data: { order: number } }>(a: T, b: T) => a.data.order - b.data.order;

export async function getProjects(): Promise<Project[]> {
  return (await getCollection('projects')).sort(byOrder);
}

export async function getFeatured(): Promise<Project[]> {
  return (await getProjects()).filter((p) => p.data.featured);
}

export async function getArchiveGroups(): Promise<{ domain: Domain; label: string; items: Project[] }[]> {
  const archive = (await getProjects()).filter((p) => !p.data.featured);
  return DOMAIN_ORDER.map((domain) => ({
    domain,
    label: DOMAIN_LABELS[domain],
    items: archive.filter((p) => p.data.domain === domain),
  })).filter((group) => group.items.length > 0);
}

export async function getExperience() {
  return (await getCollection('experience')).sort(byOrder);
}

export async function getEducation() {
  return (await getCollection('education')).sort(byOrder);
}

export async function getAwards() {
  const awards = (await getCollection('awards')).sort((a, b) => b.data.date.localeCompare(a.data.date));
  return {
    highlights: awards.filter((a) => a.data.tier === 'highlight'),
    earlier: awards.filter((a) => a.data.tier === 'earlier'),
  };
}

/** Newest first. */
export async function getCertifications() {
  return (await getCollection('certifications')).sort((a, b) => b.data.date.localeCompare(a.data.date));
}

export async function getPublications() {
  return (await getCollection('publications')).sort((a, b) => b.data.year - a.data.year);
}

/** "2025-12" → "12/2025"; the format the CV uses. */
export function formatMonth(value: string): string {
  const [year, month] = value.split('-');
  return `${month}/${year}`;
}
