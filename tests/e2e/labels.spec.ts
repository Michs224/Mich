import { test, expect } from '@playwright/test';
import { placeLabels } from '../../src/scripts/embedding-map/layout';

// Label placement for the embedding map, as plain math: no page is opened.

test('a label takes the other side of its point rather than cover another point', () => {
  const points = [{ x: 300, y: 100 }, { x: 360, y: 100 }];
  const [spot] = placeLabels([{ x: 300, y: 100, w: 120, h: 20 }], 1000, points);
  expect(spot.x + 120).toBeLessThanOrEqual(300);
});

test('when both sides would cover a point, the label moves a line up on its usual side', () => {
  const points = [{ x: 300, y: 100 }, { x: 360, y: 100 }, { x: 240, y: 100 }];
  const [spot] = placeLabels([{ x: 300, y: 100, w: 120, h: 20 }], 1000, points);
  expect(spot.x).toBe(314);
  expect(spot.y + 20).toBeLessThan(100 - 4);
});

test('a label with no clear spot keeps its usual place', () => {
  const crowd = [-30, 0, 30].flatMap((dy) => [{ x: 360, y: 100 + dy }, { x: 240, y: 100 + dy }]);
  const [spot] = placeLabels([{ x: 300, y: 100, w: 120, h: 20 }], 1000, [{ x: 300, y: 100 }, ...crowd]);
  expect(spot).toEqual({ x: 314, y: 90 });
});

test('a label pushed back by the stage edge does not land on its own point', () => {
  // Left of x=100 there is no room for 120px, so the right side wins even though it covers a point.
  const points = [{ x: 100, y: 100 }, { x: 160, y: 100 }];
  const [spot] = placeLabels([{ x: 100, y: 100, w: 120, h: 20 }], 1000, points);
  expect(spot.x).toBe(114);
});

test('labels never leave the stage', () => {
  const [spot] = placeLabels([{ x: 990, y: 50, w: 200, h: 20 }], 1000, [{ x: 990, y: 50 }]);
  expect(spot.x).toBeGreaterThanOrEqual(0);
  expect(spot.x + 200).toBeLessThanOrEqual(1000);
});
