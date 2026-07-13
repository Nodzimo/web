<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read
the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Nodzimo Web Agent Operating Charter

## Context Economy

Use [Agent Context Economy](docs/agent-operating-charter/context-economy.md) as the default Codex working contract:
scope first, read in layers, use broad context deliberately, verify narrowly, and report concisely.

## Stack

This project is a Bun-based Next.js 16 App Router consumer of `@nodzimo/ui`, with React 19, TypeScript strict
mode,
Tailwind CSS 4, Biome, and next-intl.

See [docs/agent-operating-charter/stack.md](docs/agent-operating-charter/stack.md).

## UI Kit Consumption

`@nodzimo/ui` is consumed from the public package surface for production and through packed sibling-project
tarballs for local unpublished UI-kit testing.

See [docs/agent-operating-charter/ui-kit-consumption.md](docs/agent-operating-charter/ui-kit-consumption.md).

## Collaboration

Project work should stay scoped, explicit, readable, and aligned with the established Russian conversational tone for
discussion and concise committed code.

See [docs/agent-operating-charter/collaboration.md](docs/agent-operating-charter/collaboration.md).

## Change Management

Propose requested commit messages in English using Conventional Commits 1.0.0. Apply Semantic Versioning 2.0.0 and
English Keep a Changelog 1.1.0 only when version or changelog work is explicitly in scope; do not introduce either by
default.

## Code Style Conventions

Code-style review should preserve local readability conventions around JSX literals, rest names, literal tables, file
extensions, imports, exports, declaration spacing, and text/quote boundaries.

See [docs/agent-operating-charter/code-style-conventions.md](docs/agent-operating-charter/code-style-conventions.md).

## WebStorm Project Settings

Shared WebStorm settings are intentionally narrow and should use scoped inspection exclusions instead of broad IDE
suppressions.

See [docs/agent-operating-charter/webstorm-project-settings.md](docs/agent-operating-charter/webstorm-project-settings.md).

## Repository Text Format

Repository text normalization is controlled through `.gitattributes`, including LF defaults and CRLF Windows command
files.

See [docs/agent-operating-charter/repository-text-format.md](docs/agent-operating-charter/repository-text-format.md).

## Community Health Files

GitHub community health files live under `.github`, with README links used to make less-prominent files discoverable
across GitHub and IDE surfaces.

See [docs/agent-operating-charter/community-health-files.md](docs/agent-operating-charter/community-health-files.md).

## Skills

Use the project-local skills for next-intl localization, dependency review, Next rendering diagnostics, Tailwind class
formatting, and final code-style review.

See [docs/agent-operating-charter/skills.md](docs/agent-operating-charter/skills.md).

## Dependency Updates

Dependency update review should combine official upstream research, local package usage, project verification commands,
and package-specific notes for Next, Biome, Tailwind, next-intl, and the sibling UI kit.

See [docs/agent-operating-charter/dependency-updates.md](docs/agent-operating-charter/dependency-updates.md).

## Biome Policy

Biome configuration should stay compact and intentional, with project-specific formatter, linter, assist, Tailwind,
HTML, JSON, and VCS expectations preserved.

See [docs/agent-operating-charter/biome-policy.md](docs/agent-operating-charter/biome-policy.md).

## App Router Structure

Route-owned code should stay colocated with route segments, while genuinely shared UI primitives belong under
`src/components`.

See [docs/agent-operating-charter/app-router-structure.md](docs/agent-operating-charter/app-router-structure.md).

## Exports

Use default exports only for Next framework convention files and named exports for ordinary components, utilities,
constants, and route-local helpers.

See [docs/agent-operating-charter/exports.md](docs/agent-operating-charter/exports.md).

## Layouts And Shell

Root and locale layouts should preserve the Next layout contract, app CSS order, thin providers, and shared font setup.

See [docs/agent-operating-charter/layouts-and-shell.md](docs/agent-operating-charter/layouts-and-shell.md).

## Next Rendering Model

Next 16 rendering work must distinguish RSC, SSR, SSG/static output, dynamic rendering, Suspense streaming, and client
boundaries before changing route behavior.

See [docs/agent-operating-charter/next-rendering-model.md](docs/agent-operating-charter/next-rendering-model.md).

## next-intl And Static Rendering

Localized routes should preserve static rendering, correct locale setup, typed metadata helpers, sitemap behavior, and
special-file constraints.

See [docs/agent-operating-charter/next-intl-and-static-rendering.md](docs/agent-operating-charter/next-intl-and-static-rendering.md).

## next-intl Localization

Message localization uses English as the canonical source, Russian as tone/context, and a fixed supported-locale order
across routing, selectors, messages, and user-visible locale choices.

See [docs/agent-operating-charter/next-intl-localization.md](docs/agent-operating-charter/next-intl-localization.md).

## Styling

Styling conventions cover Tailwind class naming, WebStorm class regex documentation, global CSS import order, base layer
defaults, and link styling.

See [docs/agent-operating-charter/styling.md](docs/agent-operating-charter/styling.md).

## Cleanup Scripts

Cleanup scripts separate generated Next artifacts, dependency installs, HTTPS certificates, and known local development
ports.

See [docs/agent-operating-charter/cleanup-scripts.md](docs/agent-operating-charter/cleanup-scripts.md).

## GitHub Releases

GitHub Releases are automated from pushed version tags through a minimal GitHub Actions workflow, while deployment
remains a separate site-hosting concern.

See [docs/agent-operating-charter/github-releases.md](docs/agent-operating-charter/github-releases.md).

## Scripts

Project scripts define the regular analysis, build, check, clean, dependency, release, local UI-kit, and git helper
commands.

See [docs/agent-operating-charter/scripts.md](docs/agent-operating-charter/scripts.md).

## Verification

Use the smallest relevant verification command, escalating to project audit, production build, or full verify when
routing, rendering, i18n, metadata, fonts, providers, or App Router special files are affected.

See [docs/agent-operating-charter/verification.md](docs/agent-operating-charter/verification.md).
