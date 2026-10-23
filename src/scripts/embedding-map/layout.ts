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
const FOCAL = 1.35 / Math.tan(Math.PI / 8); // about 34° vertical field of view: zoom without moving closer
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

/** A label to place: its point (x, y) and its size. */
export interface LabelSpot {
  x: number;
  y: number;
  w: number;
  h: number;
}

const LABEL_GAP = 14; // between a point and its label
const POINT_CLEARANCE = 4; // how close another point may come to a label's edge

/**
 * Top-left corners for labels, in the order given. Each label sits beside its point: to the right,
 * unless the point is in the right part of the stage or the label would run past the edge. It takes
 * the other side when its usual side would cover a point (its own included, which happens when the
 * stage edge pushes it back), moves down past labels placed before it, and always stays inside the
 * stage.
 */
export function placeLabels(spots: readonly LabelSpot[], width: number, points: readonly { x: number; y: number }[]): { x: number; y: number }[] {
  const placed: { x: number; y: number; w: number; h: number }[] = [];
  const corners: { x: number; y: number }[] = new Array(spots.length);
  const byHeight = spots.map((_, i) => i).sort((a, b) => spots[a].y - spots[b].y);
  for (const i of byHeight) {
    const { x: px, y: py, w, h } = spots[i];
    const inside = (x: number) => Math.min(Math.max(x, 0), Math.max(0, width - w));
    const right = px + LABEL_GAP;
    const left = px - LABEL_GAP - w;
    const sides = (px > width * 0.62 || right + w > width ? [left, right] : [right, left]).map(inside);
    const level = py - h / 2;
    const covers = ([x, y]: number[]) =>
      points.some(
        (p) =>
          p.x > x - POINT_CLEARANCE &&
          p.x < x + w + POINT_CLEARANCE &&
          p.y > y - POINT_CLEARANCE &&
          p.y < y + h + POINT_CLEARANCE,
      );
    // Level with the point on either side first, then a line above, then a line below.
    const candidates = [level, level - h - 6, level + h + 6].flatMap((y) => sides.map((x) => [x, y]));
    const [x, clearY] = candidates.find((candidate) => !covers(candidate)) ?? [sides[0], level];
    let y = clearY;
    for (let attempt = 0; attempt < 4; attempt++) {
      const hit = placed.find((r) => x < r.x + r.w && x + w > r.x && y < r.y + r.h && y + h > r.y);
      if (!hit) break;
      y = hit.y + hit.h + 2;
    }
    placed.push({ x, y, w, h });
    corners[i] = { x, y };
  }
  return corners;
}
