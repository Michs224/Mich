"""Build src/data/embedding-map.json: projects placed by embedding, tools placed around them (02 §8b).

Each project is embedded from its title, as-is description, and tools with
sentence-transformers/all-MiniLM-L6-v2 (via fastembed), then reduced to 3D with PCA.
Tools used by several projects sit at the centroid of those projects; tools used once
orbit their project. Everything is deterministic, so the JSON only changes when content does.

Run from the repo root, in a virtual environment with requirements.txt installed:
    python -I tools/embedding-map/build.py
"""
import json
import pathlib
import re

import numpy as np
import yaml
from fastembed import TextEmbedding

MODEL = "sentence-transformers/all-MiniLM-L6-v2"
ROOT = pathlib.Path.cwd()
PROJECTS = ROOT / "src" / "content" / "projects"
OUT = ROOT / "src" / "data" / "embedding-map.json"
SPREAD = 0.42  # per-axis standard deviation after scaling; keeps the cloud inside about ±1
SHARED_RADIUS = 0.05
SINGLE_RADIUS = 0.16


def frontmatter(path: pathlib.Path) -> dict:
    match = re.match(r"^---\n(.*?)\n---", path.read_text(encoding="utf-8"), re.S)
    if not match:
        raise SystemExit(f"no frontmatter in {path}")
    return yaml.safe_load(match.group(1))


def fnv1a(text: str) -> int:
    h = 0x811C9DC5
    for byte in text.encode("utf-8"):
        h = ((h ^ byte) * 0x01000193) & 0xFFFFFFFF
    return h


def orbit(name: str, radius: float) -> np.ndarray:
    h = fnv1a(name)
    theta = (h % 6283) / 1000.0
    phi = ((h >> 13) % 3141) / 1000.0
    return radius * np.array([np.sin(phi) * np.cos(theta), np.cos(phi), np.sin(phi) * np.sin(theta)])


def main() -> None:
    entries = sorted(PROJECTS.glob("*.md"))
    projects = [(p.stem, frontmatter(p)) for p in entries]
    texts = [f"{d['title']}. {d['description']} Tools: {', '.join(d['tags'])}." for _, d in projects]

    emb = np.array(list(TextEmbedding(MODEL).embed(texts)))
    emb /= np.linalg.norm(emb, axis=1, keepdims=True)

    centered = emb - emb.mean(axis=0)
    _, s, vt = np.linalg.svd(centered, full_matrices=False)
    components = vt[:3]
    # SVD signs are arbitrary; make the largest loading of each component positive.
    for i in range(3):
        if components[i][np.argmax(np.abs(components[i]))] < 0:
            components[i] = -components[i]
    xyz = centered @ components.T
    xyz = xyz / xyz.std(axis=0) * SPREAD
    variance = float(((s**2) / (s**2).sum())[:3].sum())

    slug_index = {slug: i for i, (slug, _) in enumerate(projects)}
    tool_projects: dict[str, list[str]] = {}
    for slug, data in projects:
        for tag in data["tags"]:
            tool_projects.setdefault(tag, []).append(slug)

    tool_names = sorted(tool_projects)
    tool_xyz = []
    for name in tool_names:
        owners = tool_projects[name]
        center = np.mean([xyz[slug_index[s]] for s in owners], axis=0)
        radius = SHARED_RADIUS if len(owners) > 1 else SINGLE_RADIUS
        tool_xyz.append(center + orbit(name, radius))

    # Center on the bounding box and fit a unit sphere, so the camera framing does not depend on the data.
    every = np.vstack([xyz, np.array(tool_xyz)])
    center = (every.min(axis=0) + every.max(axis=0)) / 2
    scale = 1.0 / max(np.linalg.norm(every - center, axis=1))
    xyz = (xyz - center) * scale
    tools = [
        {"name": name, "projects": tool_projects[name], "xyz": [round(float(v), 4) for v in (point - center) * scale]}
        for name, point in zip(tool_names, tool_xyz)
    ]

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(
        json.dumps(
            {
                "model": MODEL,
                "method": "pca",
                "varianceExplained": round(variance, 4),
                "projects": [{"slug": slug, "xyz": [round(float(v), 4) for v in xyz[i]]} for i, (slug, _) in enumerate(projects)],
                "tools": tools,
            },
            indent=1,
        )
        + "\n",
        encoding="utf-8",
    )
    print(f"{len(projects)} projects, {len(tools)} tools, PCA variance {variance:.3f} -> {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
