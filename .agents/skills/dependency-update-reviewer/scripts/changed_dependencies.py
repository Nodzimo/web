#!/usr/bin/env python3
"""Print direct dependency version changes from package.json vs HEAD."""

from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path


SECTIONS = (
    "dependencies",
    "devDependencies",
    "peerDependencies",
    "optionalDependencies",
)


def read_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def read_head_package(repo: Path) -> dict:
    result = subprocess.run(
        ["git", "show", "HEAD:package.json"],
        cwd=repo,
        check=False,
        capture_output=True,
        text=True,
        encoding="utf-8",
    )
    if result.returncode != 0:
        return {}
    return json.loads(result.stdout)


def main() -> int:
    repo = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else Path.cwd()
    current_path = repo / "package.json"
    if not current_path.exists():
        print(f"No package.json found at {current_path}", file=sys.stderr)
        return 1

    before = read_head_package(repo)
    after = read_json(current_path)

    changes: list[tuple[str, str, str, str]] = []
    for section in SECTIONS:
        before_deps = before.get(section, {}) or {}
        after_deps = after.get(section, {}) or {}
        for name in sorted(set(before_deps) | set(after_deps)):
            old = before_deps.get(name)
            new = after_deps.get(name)
            if old != new:
                changes.append((section, name, str(old), str(new)))

    if not changes:
        print("No direct dependency spec changes in package.json vs HEAD.")
        return 0

    for section, name, old, new in changes:
        print(f"{section}: {name} {old} -> {new}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
