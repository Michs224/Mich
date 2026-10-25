// The picture a project card draws when the project has no cover: its own view of the embedding
// map. The project sits in the middle; the map turns until it faces the camera, give or take, and
// zooms in as far as its tools still fit around it. Pure math at build time, like layout.ts.
import { CAMERA_DISTANCE, INITIAL_POSE, project, viewProjection, type Pose, type ScreenPoint, type Size } from './layout';

interface MapLike {
  projects: readonly { domain: string; xyz: readonly number[] }[];
  tools: readonly { projects: readonly number[]; xyz: readonly number[] }[];
}

export interface Dot {
  x: number;
  y: number;
  /** Radius: nearer points are larger. */
  r: number;
  /** The pictured project, or one of its tools. */
  own: boolean;
}

export interface Constellation {
  projects: (Dot & { domain: string })[];
  tools: Dot[];
  /** Own links join the project to its tools; the others join those tools to the projects sharing them. */
  links: { x1: number; y1: number; x2: number; y2: number; own: boolean }[];
  /** Where the project is drawn; absent when it is not on the map yet. */
  focus?: { x: number; y: number };
}

const PROJECT_R = 3.2;
const TOOL_R = 1.4;
/** The share of the frame the project and its tools may take, across and down. */
const FILL = { x: 0.72, y: 0.62 };
const MAX_ZOOM = 2.6;
/** Turns tried around the facing pose, nearest first: up to 60° either way, so the project stays in front. */
const TURNS = [0, -1, 1, -2, 2, -3, 3, -4, 4].map((step) => (step * Math.PI) / 12);

/** index: the project's position in map.projects, or -1 when it is not on the map yet. */
export function constellation(map: MapLike, index: number, size: Size): Constellation {
  const own = map.projects[index];
  const ownTools = map.tools.filter((tool) => tool.projects.includes(index));
  const aspect = size.width / size.height;

  // The turn that lets the view zoom in furthest with every tool still inside. Without a project,
  // the hero's view.
  let view = { pose: INITIAL_POSE, matrix: viewProjection(INITIAL_POSE, aspect), zoom: 1, center: { x: size.width / 2, y: size.height / 2 } };
  if (own) {
    const facing = Math.atan2(-own.xyz[0], own.xyz[2]);
    let best = 0;
    for (const turn of TURNS) {
      const pose: Pose = { yaw: facing + turn, pitch: INITIAL_POSE.pitch };
      const matrix = viewProjection(pose, aspect);
      const center = project(own.xyz, pose, size, matrix);
      const zoom = Math.min(
        MAX_ZOOM,
        ...ownTools.map((tool) => {
          const point = project(tool.xyz, pose, size, matrix);
          const across = Math.abs(point.x - center.x) || 1e-6;
          const down = Math.abs(point.y - center.y) || 1e-6;
          return Math.min((size.width * FILL.x) / 2 / across, (size.height * FILL.y) / 2 / down);
        }),
      );
      if (zoom > best + 1e-9) {
        best = zoom;
        view = { pose, matrix, zoom, center };
      }
    }
  }

  const place = (xyz: readonly number[], radius: number) => {
    const point: ScreenPoint = project(xyz, view.pose, size, view.matrix);
    return {
      x: size.width / 2 + (point.x - view.center.x) * view.zoom,
      y: size.height / 2 + (point.y - view.center.y) * view.zoom,
      r: (radius * view.zoom * CAMERA_DISTANCE) / point.depth,
    };
  };
  const projects = map.projects.map((p, i) => ({ ...place(p.xyz, PROJECT_R), domain: p.domain, own: i === index }));
  const tools = map.tools.map((t) => ({ ...place(t.xyz, TOOL_R), own: t.projects.includes(index) }));
  const line = (a: Dot, b: Dot, isOwn: boolean) => ({ x1: a.x, y1: a.y, x2: b.x, y2: b.y, own: isOwn });
  const links = own
    ? map.tools.flatMap((t, i) =>
        tools[i].own
          ? [line(projects[index], tools[i], true), ...t.projects.filter((p) => p !== index).map((p) => line(tools[i], projects[p], false))]
          : [],
      )
    : [];
  return { projects, tools, links, focus: own ? { x: projects[index].x, y: projects[index].y } : undefined };
}
