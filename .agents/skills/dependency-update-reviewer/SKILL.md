---
name: dependency-update-reviewer
description: Review available or already-installed package dependency updates. Use when Codex is asked to run or interpret npm/Bun outdated results, decide whether packages should be updated, inspect package.json/lockfile update diffs, research official release notes, changelogs, GitHub PRs, migrations, or breaking changes, compare them to local project usage, and report whether code/config changes or verification steps are needed.
---

# Dependency Update Reviewer

## Overview

Use this skill to turn dependency update noise into a short engineering decision report. Research what changed upstream,
map the changes to the codebase's actual usage, and say whether the project should update, can commit an existing
update, or needs action.

This skill is a review workflow. Read project context conditionally instead of loading every dependency document by
default:

- Always read `docs/agent-operating-charter/dependency-updates.md` and
  `docs/agent-operating-charter/verification.md`.
- Read `docs/agent-operating-charter/biome-policy.md` only when Biome is involved.
- Read `docs/agent-operating-charter/ui-kit-consumption.md` only when `@nodzimo/ui`, local tarball testing, package
  linking, or sibling UI-kit compatibility is involved.
- Read `references/dependency-sources.md` only when official upstream source routing is needed for the selected
  packages.

Do not edit project files unless the user explicitly asks for implementation. A review request should end with a report,
not a patch.

## Mode Selection

Start by deciding which mode applies:

- **Pre-update review**: no dependency diff exists, or the user asks whether available updates are worth taking. Run the
  package manager's outdated command and produce an update recommendation before changing files.
- **Post-update review**: `package.json`, lockfiles, or dependency install artifacts already changed. Inspect exact
  installed/spec changes and decide whether the update is safe to commit or needs follow-up work.
- **Mixed review**: if both outdated candidates and existing diffs are present, review existing diffs first, then
  mention additional available updates separately.

## Pre-Update Workflow

1. Inspect working tree and available candidates.
    - Run `git status --short`.
    - If the package manager is Bun, run `bun outdated`.
    - If this project defines a wrapper script such as `bun run deps:outdated`, prefer it when the user wants the
      project's normal workflow.
    - Treat outdated output as a candidate list, not as a lockfile truth. Confirm exact latest/current versions from npm
      metadata or official release pages when risk matters.

2. Select review scope.
    - Include direct runtime dependencies and devDependencies.
    - Prioritize frameworks, compilers, bundlers, linters, type systems, CSS tooling, i18n tooling, test/build tooling,
      and packages with major/minor updates.
    - For large update sets, group low-risk patch updates and spend research time on high-risk packages first.

3. Research upstream and local usage using the shared research workflow below.

4. Report an update plan.
    - Say which packages are safe to update together.
    - Say which packages should be updated separately.
    - Say which packages should wait or need migration work first.
    - Recommend checks to run after the update.

## Post-Update Workflow

1. Inspect exact local update scope.
    - Run `git status --short`.
    - Run `git diff -- package.json bun.lock package-lock.json pnpm-lock.yaml yarn.lock`.
    - If useful, run `python .agents/skills/dependency-update-reviewer/scripts/changed_dependencies.py`.
    - Identify each changed direct dependency and version pair.

2. Research upstream and local usage using the shared research workflow below.

3. Report commit readiness.
    - Say whether the existing dependency diff is reasonable to commit.
    - Name required local code/config changes, if any.
    - Recommend checks to run before commit or production readiness.
    - For Biome updates, verify whether `biome.json`/`biome.jsonc` changed with the dependency update. If it did not,
      run the local migration script when available, or recommend `biome migrate --write` before treating the update as
      complete.

## Shared Research Workflow

1. Classify each update.
    - Use SemVer terms exactly: `major.minor.patch`.
    - `major`: first number changed.
    - `minor`: middle number changed.
    - `patch`: last number changed.
    - Treat `latest`, prereleases, canaries, date versions, and non-SemVer ranges as higher risk until verified from
      official sources.

2. Research official upstream sources.
    - Prefer the package's official GitHub releases, changelog, migration guide, docs, and linked PRs.
    - Read `references/dependency-sources.md` for known official sources and project-specific review focus.
    - If the reference has no entry or looks stale, verify via npm package metadata and official docs before using
      search results.
    - For current release notes, changelogs, dates, and PR contents, browse the web and cite sources in the answer.

3. Check local usage.
    - Search with `rg` for imports, config keys, CLI usage, generated files, and package-specific APIs.
    - Check both app code and project tooling files: `src`, `scripts`, config files, `messages`, `.codex`, `.idea` only
      when relevant.
    - For framework/tooling updates, inspect config and scripts even when there are few direct imports.

4. Decide impact.
    - Mark each dependency as one of:
        - `No action`: upstream changes do not touch local usage.
        - `Watch`: likely safe, but release notes mention nearby behavior or weakly-covered paths.
        - `Action needed`: local code/config/scripts should change.
        - `Blocked`: cannot decide without a failing check, missing source, or user choice.
    - Name the exact local files or commands involved.

5. Recommend verification.
    - Prefer the smallest relevant checks.
    - For this Bun/Next project, common checks are `bun run type:check`, `bun run check:lint`, `bun run i18n:check`,
      `bun run check:deps`, `bun run project:audit`, and `bun run build`.
    - Recommend `bun run project:verify` only when production readiness or broad framework behavior is in scope.

## Report Format

Keep the report compact and decision-oriented:

```text
Dependency: next-intl 4.11.2 -> 4.12.0
Update type: minor
Risk: Low
Upstream changes: ...
Local usage: ...
Decision: No action
Verification: bun run type:check, optionally bun run project:audit
Sources: ...
```

For multiple packages, group by risk: action needed first, watch second, no action last. Include a short final
recommendation about whether the dependency update diff is reasonable to commit.

For pre-update review, use this shape:

```text
Dependency: next-intl 4.11.2 -> 4.12.0 available
Update type: minor
Risk: Low
Upstream changes: ...
Local usage: ...
Recommendation: Safe to update with normal audit
After-update checks: bun run type:check, optionally bun run project:audit
Sources: ...
```

## Research Standards

- Use official sources first. Do not rely on blog posts, issue comments, or generated summaries unless official sources
  are missing.
- Distinguish facts from inference. Say "This appears safe because..." when mapping upstream changes to local usage.
- Prefer release ranges over single PRs when possible. If the user gives a PR, read it, but still check whether the
  installed version includes related follow-up fixes.
- Never assume a minor update is safe for frameworks, compilers, linters, bundlers, type systems, i18n tooling, or CSS
  tooling.
- In pre-update mode, do not mutate dependencies unless the user explicitly asks to update after reading the review.
- Do not remove translations, generated declarations, lockfile entries, IDE settings, or dependency graph artifacts
  during review.

## Project-Specific Notes

Keep reusable dependency-review workflow rules in this skill. Keep project policy in
`docs/agent-operating-charter/dependency-updates.md`
and the current dependency source map in `references/dependency-sources.md`.
