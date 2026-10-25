import { test, expect } from './fixtures';
import { pickHover, placeLabels, type Placement } from '../../src/scripts/embedding-map/layout';

// Label placement for the embedding map, as plain math: no page is opened.

const STAGE = { width: 1000, height: 1000 };

/** For cases with room for every label: the corners, with none left out. */
function all(...args: Parameters<typeof placeLabels>) {
  const corners = placeLabels(...args);
  expect(corners).not.toContain(null);
  return corners as Placement[];
}

test('a label takes the other side of its point rather than cover another point', () => {
  const points = [{ x: 300, y: 100 }, { x: 360, y: 100 }];
  const [spot] = all([{ x: 300, y: 100, w: 120, h: 20 }], STAGE, points);
  expect(spot.x + 120).toBeLessThanOrEqual(300);
});

test('when both sides would cover a point, the label moves a line up on its usual side', () => {
  const points = [{ x: 300, y: 100 }, { x: 360, y: 100 }, { x: 240, y: 100 }];
  const [spot] = all([{ x: 300, y: 100, w: 120, h: 20 }], STAGE, points);
  expect(spot.x).toBe(314);
  expect(spot.y + 20).toBeLessThan(100 - 4);
});

test('a label with no clear spot keeps its usual place', () => {
  const crowd = [-30, 0, 30].flatMap((dy) => [{ x: 360, y: 100 + dy }, { x: 240, y: 100 + dy }]);
  const [spot] = all([{ x: 300, y: 100, w: 120, h: 20 }], STAGE, [{ x: 300, y: 100 }, ...crowd]);
  expect(spot).toMatchObject({ x: 314, y: 90 });
});

test('a label pushed back by the stage edge does not land on its own point', () => {
  // Left of x=100 there is no room for 120px, so the right side wins even though it covers a point.
  const points = [{ x: 100, y: 100 }, { x: 160, y: 100 }];
  const [spot] = all([{ x: 100, y: 100, w: 120, h: 20 }], STAGE, points);
  expect(spot.x).toBe(114);
});

test('labels never leave the stage', () => {
  const [spot] = all([{ x: 990, y: 50, w: 200, h: 20 }], STAGE, [{ x: 990, y: 50 }]);
  expect(spot.x).toBeGreaterThanOrEqual(0);
  expect(spot.x + 200).toBeLessThanOrEqual(1000);
});

// Audit (2026-10-25): with a field pressed, labels were pushed past the stage's bottom onto the
// legend, or above its top under the header.
test('labels never leave the stage at the top or bottom', () => {
  const [low] = all([{ x: 500, y: 995, w: 120, h: 20 }], STAGE, [{ x: 500, y: 995 }]);
  expect(low.y + 20).toBeLessThanOrEqual(1000);
  const [high] = all([{ x: 500, y: 3, w: 120, h: 20 }], STAGE, [{ x: 500, y: 3 }]);
  expect(high.y).toBeGreaterThanOrEqual(0);
  // Three labels at the bottom edge: moving down past each other would leave the stage, so they move up.
  const stack = all(
    [990, 991, 992].map((y) => ({ x: 300, y, w: 120, h: 20 })),
    STAGE,
    [{ x: 300, y: 990 }],
  );
  for (const spot of stack) expect(spot.y + 20).toBeLessThanOrEqual(1000);
});

test('labels keep clear of an obstacle such as the pause button', () => {
  const button = { x: 950, y: 950, w: 40, h: 40 };
  const [spot] = all([{ x: 980, y: 960, w: 80, h: 20 }], STAGE, [{ x: 980, y: 960 }], [button]);
  const overlaps = spot.x < button.x + button.w && spot.x + 80 > button.x && spot.y < button.y + button.h && spot.y + 20 > button.y;
  expect(overlaps).toBe(false);
  expect(spot.y + 20).toBeLessThanOrEqual(1000);
});

// Audit (2026-10-25): crowded labels landed on each other. A label with no free spot within three
// lines of its point is left out (the caller hides it) rather than written over another.
test('a label with no free spot is left out rather than covering another label', () => {
  const stage = { width: 200, height: 40 };
  const [first, second] = placeLabels(
    [{ x: 100, y: 20, w: 180, h: 20 }, { x: 100, y: 21, w: 180, h: 20 }],
    stage,
    [{ x: 100, y: 20 }],
  );
  expect(first).not.toBeNull();
  expect(second).toBeNull();
});

test('labels move further than one line to stay off each other', () => {
  const spots = [0, 1, 2, 3].map((i) => ({ x: 500, y: 500 + i, w: 120, h: 20 }));
  const placed = placeLabels(spots, STAGE, [{ x: 500, y: 500 }]).filter((spot) => spot !== null);
  expect(placed).toHaveLength(4);
  for (const a of placed) {
    for (const b of placed) {
      if (a === b) continue;
      const overlap = a.x < b.x + 120 && a.x + 120 > b.x && a.y < b.y + 20 && a.y + 20 > b.y;
      expect(overlap).toBe(false);
    }
  }
});

// Audit 2: labels touching edge to edge read as one; they keep a small gap.
test('labels keep a small gap between them', () => {
  // B's own place would sit 2px under A's: not an overlap, but too close.
  const placed = all([{ x: 500, y: 500, w: 120, h: 20 }, { x: 500, y: 522, w: 120, h: 20 }], STAGE, [{ x: 500, y: 500 }, { x: 500, y: 522 }]);
  const [a, b] = placed;
  const gapX = Math.max(b.x - (a.x + 120), a.x - (b.x + 120));
  const gapY = Math.max(b.y - (a.y + 20), a.y - (b.y + 20));
  expect(Math.max(gapX, gapY)).toBeGreaterThanOrEqual(4);
});

// Owner's question (2026-10-25): labels hopped about while the map turned (Vision QC 24 times in one
// turn), because each frame chose a place from scratch. Given where each label was, a label stays
// there while that place stays clear, and moves only when a point or a label comes onto it.
test('a label keeps its place while it stays clear, instead of jumping back', () => {
  const spot = { x: 300, y: 100, w: 120, h: 20 };
  // A point on its right sends it to the left...
  const [first] = all([spot], STAGE, [{ x: 300, y: 100 }, { x: 360, y: 100 }]);
  expect(first.x + 120).toBeLessThanOrEqual(300);
  // ...and once that point has moved on, it stays on the left rather than jump back.
  const [second] = all([spot], STAGE, [{ x: 300, y: 100 }, { x: 360, y: 400 }], [], [first]);
  expect(second).toMatchObject({ x: first.x, y: first.y });
});

test('a label moves on once a point comes onto its place', () => {
  const spot = { x: 300, y: 100, w: 120, h: 20 };
  const [first] = all([spot], STAGE, [{ x: 300, y: 100 }]);
  expect(first.x).toBe(314);
  const [second] = all([spot], STAGE, [{ x: 300, y: 100 }, { x: 360, y: 100 }], [], [first]);
  expect(second.x + 120).toBeLessThanOrEqual(300);
});

// Found while checking the map's ctrl-click (2026-10-25): the map tilts toward the pointer, which can
// carry the hovered point a few pixels away from a pointer at rest, past the 22px reach; the next
// tiny move (a click makes one) then dropped the label just before the click landed.
const at = (x: number, y: number) => ({ x, y, depth: 0 });

test('the hovered point stays hovered while the pointer is within twice the reach', () => {
  expect(pickHover({ x: 0, y: 0 }, [at(30, 0)], 0, 22)).toBe(0);
});

test('another point within reach takes over the hover', () => {
  expect(pickHover({ x: 0, y: 0 }, [at(30, 0), at(10, 0)], 0, 22)).toBe(1);
});

test('beyond twice the reach the hover ends, and nothing far is picked up', () => {
  expect(pickHover({ x: 0, y: 0 }, [at(50, 0)], 0, 22)).toBe(-1);
  expect(pickHover({ x: 0, y: 0 }, [at(30, 0)], -1, 22)).toBe(-1);
});
