import { test, expect } from './fixtures';
import { constellation } from '../../src/scripts/embedding-map/constellation';

// The picture a card draws when its project has no cover, as plain math: no page is opened.

const size = { width: 400, height: 250 };
const map = {
  projects: [
    { domain: 'llm-voice', xyz: [0.5, 0, 0] },
    { domain: 'ml-data', xyz: [-0.5, 0, 0] },
    { domain: 'other', xyz: [0.1, 0.6, 0.2] },
  ],
  tools: [
    { projects: [0, 1], xyz: [0.1, 0.1, 0] },
    { projects: [0], xyz: [0.55, 0.45, 0.1] },
    { projects: [2], xyz: [0.2, 0.7, 0.3] },
  ],
};
const inMiddle = (dot: { x: number; y: number }) =>
  dot.x >= size.width * 0.08 && dot.x <= size.width * 0.92 && dot.y >= size.height * 0.1 && dot.y <= size.height * 0.9;

test('the project sits in the middle, with its tools around it inside the picture', () => {
  const { focus, tools } = constellation(map, 0, size);
  expect(focus!.x).toBeCloseTo(size.width / 2, 3);
  expect(focus!.y).toBeCloseTo(size.height / 2, 3);
  expect(tools.filter((tool) => tool.own).every(inMiddle)).toBe(true);
});

test('the map turns the project toward the camera, in front of the projects behind it', () => {
  const { projects } = constellation(map, 0, size);
  expect(projects[0].r).toBeGreaterThan(projects[1].r);
});

test('the project links to its tools, and those tools to the other projects that use them', () => {
  const { links, tools } = constellation(map, 0, size);
  expect(links.filter((link) => link.own)).toHaveLength(2);
  expect(links.filter((link) => !link.own)).toHaveLength(1);
  expect(tools.map((tool) => tool.own)).toEqual([true, true, false]);
});

test('a project that is not on the map yet gets the whole cloud without a highlight', () => {
  const picture = constellation(map, -1, size);
  expect(picture.focus).toBeUndefined();
  expect(picture.links).toEqual([]);
  expect(picture.projects).toHaveLength(3);
  expect(picture.tools).toHaveLength(3);
});
