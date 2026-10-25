import { readdirSync, readFileSync } from 'node:fs';

/** The items of a list in the frontmatter, such as tags, without quotes. */
function list(front: string, key: string): string[] {
  const block = front.match(new RegExp(`^${key}:\\r?\\n((?:[ \\t]+- .*\\r?\\n)+)`, 'm'))?.[1] ?? '';
  return block
    .split(/\r?\n/)
    .filter((line) => line.trim())
    .map((line) => line.replace(/^\s+- /, '').trim().replace(/^"(.*)"$/, '$1'));
}

/** Every project file's frontmatter, read straight from disk, in the site's order. */
export const projects = readdirSync('src/content/projects')
  .filter((file) => file.endsWith('.md'))
  .map((file) => {
    const front = readFileSync(`src/content/projects/${file}`, 'utf8').split('---')[1];
    return {
      slug: file.replace(/\.md$/, ''),
      title: front.match(/^title:\s*"?(.*?)"?\s*$/m)![1],
      description: front.match(/^description:\s*"?(.*?)"?\s*$/m)![1],
      featured: /^featured:\s*true\s*$/m.test(front),
      order: Number(front.match(/^order:\s*(\d+)/m)![1]),
      repo: front.match(/^\s+repo:\s*(\S+)/m)?.[1],
      confidential: /^confidential:\s*true\s*$/m.test(front),
      metrics: /^metrics:/m.test(front),
      tags: list(front, 'tags'),
    };
  })
  .sort((a, b) => a.order - b.order);
