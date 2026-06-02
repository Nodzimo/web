<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read
the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

See [docs/agent/nextjs-version-warning.md](docs/agent/nextjs-version-warning.md).

# Nodzimo Web Agent Notes

## Stack

This project is a Bun-based Next.js 16 App Router consumer of `@sefo/nodzimo-ui`, with React 19, TypeScript strict mode,
Tailwind CSS 4, Biome, and next-intl.

See [docs/agent/stack.md](docs/agent/stack.md).

## UI Kit Consumption

`@sefo/nodzimo-ui` is consumed from the public package surface for production and through packed sibling-project
tarballs for local unpublished UI-kit testing.

See [docs/agent/ui-kit-consumption.md](docs/agent/ui-kit-consumption.md).

## Collaboration

Project work should stay scoped, explicit, readable, and aligned with the established Russian conversational tone for
discussion and concise committed code.

See [docs/agent/collaboration.md](docs/agent/collaboration.md).

## WebStorm Project Settings

Shared WebStorm settings are intentionally narrow and should use scoped inspection exclusions instead of broad IDE
suppressions.

See [docs/agent/webstorm-project-settings.md](docs/agent/webstorm-project-settings.md).

## Repository Text Format

Repository text normalization is controlled through `.gitattributes`, including LF defaults and CRLF Windows command
files.

See [docs/agent/repository-text-format.md](docs/agent/repository-text-format.md).

## Skills

Use the project-local skills for next-intl localization, dependency review, Next rendering diagnostics, Tailwind class
formatting, and final code-style review.

See [docs/agent/skills.md](docs/agent/skills.md).

## Dependency Updates

Dependency update review should combine official upstream research, local package usage, project verification commands,
and package-specific notes for Next, Biome, Tailwind, next-intl, and the sibling UI kit.

See [docs/agent/dependency-updates.md](docs/agent/dependency-updates.md).

## Biome Policy

Biome configuration should stay compact and intentional, with project-specific formatter, linter, assist, Tailwind,
HTML, JSON, and VCS expectations preserved.

See [docs/agent/biome-policy.md](docs/agent/biome-policy.md).

## App Router Structure

Route-owned code should stay colocated with route segments, while genuinely shared UI primitives belong under
`src/components`.

See [docs/agent/app-router-structure.md](docs/agent/app-router-structure.md).

## Exports

Use default exports only for Next framework convention files and named exports for ordinary components, utilities,
constants, and route-local helpers.

See [docs/agent/exports.md](docs/agent/exports.md).

## Layouts And Shell

Root and locale layouts should preserve the Next layout contract, app CSS order, thin providers, and shared font setup.

See [docs/agent/layouts-and-shell.md](docs/agent/layouts-and-shell.md).

## Next Rendering Model

Next 16 rendering work must distinguish RSC, SSR, SSG/static output, dynamic rendering, Suspense streaming, and client
boundaries before changing route behavior.

See [docs/agent/next-rendering-model.md](docs/agent/next-rendering-model.md).

## next-intl And Static Rendering

Localized routes should preserve static rendering, correct locale setup, typed metadata helpers, sitemap behavior, and
special-file constraints.

See [docs/agent/next-intl-and-static-rendering.md](docs/agent/next-intl-and-static-rendering.md).

## Styling

Styling conventions cover Tailwind class naming, WebStorm class regex documentation, global CSS import order, base layer
defaults, and link styling.

See [docs/agent/styling.md](docs/agent/styling.md).

## Cleanup Scripts

Cleanup scripts separate generated Next artifacts, dependency installs, HTTPS certificates, and known local development
ports.

See [docs/agent/cleanup-scripts.md](docs/agent/cleanup-scripts.md).

## Verification

Use the smallest relevant verification command, escalating to project audit, production build, or full verify when
routing, rendering, i18n, metadata, fonts, providers, or App Router special files are affected.

See [docs/agent/verification.md](docs/agent/verification.md).
