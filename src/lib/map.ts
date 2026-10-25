import mapData from '../data/embedding-map.json';
import { joinMap } from '../scripts/embedding-map/join';
import { getProjects } from './content';

/** The embedding map (build.py) joined with the project content: see joinMap. */
export async function getMap() {
  return joinMap(
    mapData,
    (await getProjects()).map(({ id, data }) => ({
      slug: id,
      title: data.title,
      domain: data.domain,
      featured: data.featured,
      href: data.featured ? `/work/${id}` : (data.links.repo ?? '/#archive'),
    })),
  );
}
