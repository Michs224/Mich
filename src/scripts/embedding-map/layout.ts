// Camera math shared by the WebGL renderer, the HTML labels, picking, and the build-time label
// positions over the poster. No WebGL here, so the component can import it at build time.

export interface Pose {
  yaw: number;
  pitch: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface ScreenPoint {
  x: number;
  y: number;
  /** Clip-space w: distance from the camera. Larger is farther. */
  depth: number;
}

/** The pose the poster is rendered in and the canvas starts from (02 §8b). */
export const INITIAL_POSE: Pose = { yaw: 1.4, pitch: 0.35 };
/** The data fits a unit sphere (build.py), so this frames the cloud at about 85% of the canvas. */
export const CAMERA_DISTANCE = 3.0;
// About 34° vertical field of view, zoomed without moving closer; 1.24 rather than 1.35 leaves some
// margin, so the outermost points never touch the frame as the map turns (audit, 2026-10-25).
const FOCAL = 1.24 / Math.tan(Math.PI / 8);
const NEAR = 0.1;
const FAR = 20;

function multiply(a: ArrayLike<number>, b: ArrayLike<number>): Float32Array {
  const out = new Float32Array(16);
  for (let col = 0; col < 4; col++) {
    for (let row = 0; row < 4; row++) {
      let sum = 0;
      for (let k = 0; k < 4; k++) sum += a[k * 4 + row] * b[col * 4 + k];
      out[col * 4 + row] = sum;
    }
  }
  return out;
}

/** Column-major view-projection matrix: rotate by yaw then pitch, step back, perspective. */
export function viewProjection(pose: Pose, aspect: number): Float32Array {
  const cy = Math.cos(pose.yaw);
  const sy = Math.sin(pose.yaw);
  const cx = Math.cos(pose.pitch);
  const sx = Math.sin(pose.pitch);
  const rotY = [cy, 0, -sy, 0, 0, 1, 0, 0, sy, 0, cy, 0, 0, 0, 0, 1];
  const rotX = [1, 0, 0, 0, 0, cx, sx, 0, 0, -sx, cx, 0, 0, 0, 0, 1];
  const view = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, -CAMERA_DISTANCE, 1];
  const projection = [
    FOCAL / aspect, 0, 0, 0,
    0, FOCAL, 0, 0,
    0, 0, (FAR + NEAR) / (NEAR - FAR), -1,
    0, 0, (2 * FAR * NEAR) / (NEAR - FAR), 0,
  ];
  return multiply(projection, multiply(view, multiply(rotX, rotY)));
}

/** Where a data point lands on a canvas of the given CSS size. */
export function project(xyz: readonly number[], pose: Pose, size: Size, matrix = viewProjection(pose, size.width / size.height)): ScreenPoint {
  const [x, y, z] = xyz;
  const m = matrix;
  const w = m[3] * x + m[7] * y + m[11] * z + m[15];
  const nx = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
  const ny = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
  return { x: ((nx + 1) / 2) * size.width, y: ((1 - ny) / 2) * size.height, depth: w };
}

/** Index of the projected point nearest to the pointer, or -1 when none is within radiusPx. */
export function nearestProject(pointer: { x: number; y: number }, projected: readonly ScreenPoint[], radiusPx: number): number {
  let best = -1;
  let bestDistance = radiusPx * radiusPx;
  projected.forEach((point, index) => {
    const dx = point.x - pointer.x;
    const dy = point.y - pointer.y;
    const distance = dx * dx + dy * dy;
    // Prefer the nearer point when two overlap on screen.
    if (distance < bestDistance || (best >= 0 && distance === bestDistance && point.depth < projected[best].depth)) {
      best = index;
      bestDistance = distance;
    }
  });
  return best;
}

/**
 * The project to hover at the pointer: the nearest within reach; else the one hovered now (`current`),
 * while the pointer stays within twice the reach, since the map tilts toward the pointer and can carry
 * that point a little away from it; else none (-1).
 */
export function pickHover(pointer: { x: number; y: number }, projected: readonly ScreenPoint[], current: number, radiusPx: number): number {
  const nearest = nearestProject(pointer, projected, radiusPx);
  if (nearest >= 0 || current < 0) return nearest;
  const still = projected[current];
  return Math.hypot(still.x - pointer.x, still.y - pointer.y) <= radiusPx * 2 ? current : -1;
}

/** A label to place: its point (x, y) and its size. */
export interface LabelSpot {
  x: number;
  y: number;
  w: number;
  h: number;
}

const LABEL_GAP = 14; // between a point and its label
const POINT_CLEARANCE = 4; // how close another point may come to a label's edge
const LABEL_SPACING = 4; // the least room between two labels, or a label and an obstacle

/** A box on the stage: a placed label, or something labels must not cover, like the pause button. */
export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Lines away from the point a label may move: level first, then up and down in turn. */
const NEAR_LINES = [0, -1, 1];
const FAR_LINES = [0, -1, 1, -2, 2, -3, 3];

/** Where a label sits: its top-left corner, and the side of its point and line it took. */
export interface Placement {
  x: number;
  y: number;
  side: 'left' | 'right';
  /** Lines away from the point's level: 0 beside it, -1 a line up, 1 a line down. */
  line: number;
}

/**
 * Top-left corners for labels, in the order given. Each label sits beside its point: to the right,
 * unless the point is in the right part of the stage or the label would run past the edge. It takes
 * the other side, or a line up or down, when its usual place would cover a point (its own included,
 * which happens when the stage edge pushes it back). It never covers a label placed before it or an
 * obstacle (the pause button): it moves up to three lines away for that, and a label that still
 * finds no room gets null, for the caller to hide, rather than land on another. Every label stays
 * inside the stage.
 *
 * Given where each label was (`previous`, by index), a label keeps that side and line while they
 * stay clear, so a turning map does not make labels hop back and forth (owner's question,
 * 2026-10-25); it moves only when a point or another label comes onto its place.
 */
export function placeLabels(
  spots: readonly LabelSpot[],
  stage: { width: number; height: number },
  points: readonly { x: number; y: number }[],
  obstacles: readonly Box[] = [],
  previous: readonly (Placement | null | undefined)[] = [],
): (Placement | null)[] {
  const { width, height } = stage;
  const placed: Box[] = [...obstacles];
  const corners: (Placement | null)[] = new Array(spots.length).fill(null);
  const byHeight = spots.map((_, i) => i).sort((a, b) => spots[a].y - spots[b].y);
  for (const i of byHeight) {
    const { x: px, y: py, w, h } = spots[i];
    const inside = (x: number) => Math.min(Math.max(x, 0), Math.max(0, width - w));
    const insideY = (y: number) => Math.min(Math.max(y, 0), Math.max(0, height - h));
    const right = px + LABEL_GAP;
    const left = px - LABEL_GAP - w;
    const order: Placement['side'][] = px > width * 0.62 || right + w > width ? ['left', 'right'] : ['right', 'left'];
    const level = insideY(py - h / 2);
    const place = (side: Placement['side'], line: number): Placement => ({
      x: inside(side === 'right' ? right : left),
      y: insideY(level + line * (h + 6)),
      side,
      line,
    });
    const covers = ({ x, y }: Placement) =>
      points.some(
        (p) =>
          p.x > x - POINT_CLEARANCE &&
          p.x < x + w + POINT_CLEARANCE &&
          p.y > y - POINT_CLEARANCE &&
          p.y < y + h + POINT_CLEARANCE,
      );
    const s = LABEL_SPACING;
    const overlaps = ({ x, y }: Placement) =>
      placed.some((r) => x < r.x + r.w + s && x + w + s > r.x && y < r.y + r.h + s && y + h + s > r.y);
    const free = (c: Placement) => !overlaps(c);
    const clear = (c: Placement) => free(c) && !covers(c);
    const at = (lines: number[]) => lines.flatMap((line) => order.map((side) => place(side, line)));
    const before = previous[i];
    const was = before ? place(before.side, before.line) : undefined;
    // Where it was, while that is near its point and clear; else near its point and clear of
    // everything; else where it was, if that still covers no label; else anywhere within three lines
    // that covers no label, even if it covers a point.
    const spot =
      (was && NEAR_LINES.includes(was.line) && clear(was) ? was : undefined) ??
      at(NEAR_LINES).find(clear) ??
      (was && free(was) ? was : undefined) ??
      at(FAR_LINES).find(free);
    if (!spot) continue;
    placed.push({ x: spot.x, y: spot.y, w, h });
    corners[i] = spot;
  }
  return corners;
}
