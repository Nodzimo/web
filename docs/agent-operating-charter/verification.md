# Verification

- Use `bun run project:audit` for the full non-build project audit. It runs route type generation/checking, Biome,
  i18n validation, Dependency Cruiser checks, and outdated dependency reporting.
- Use `bun run project:verify` before treating changes as production-ready. It refreshes dependencies with
  `bun install`, runs `project:audit`, then runs the production build.
- For GitHub Release workflow changes, validate with a single test version tag when needed and clean up experimental
  tags/releases explicitly. See [GitHub Releases](github-releases.md).
- Prefer `bun run type:check` for route type and TypeScript validation.
- If `next typegen` reports that TypeScript required packages are missing after a TypeScript major update, check the
  [TypeScript 7 incident](dependency-updates.md#typescript-7-incident) before installing packages manually.
- Prefer `bun run check:lint` for lint/style validation.
- Use `bun run check:deps` for Dependency Cruiser validation. Use `bun run check:deps-graph` only when intentionally
  regenerating the SVG dependency graph; it requires Graphviz `dot` to be available on `PATH`.
- Dependency Cruiser `no-orphans` may need narrow exceptions for Next.js file-convention modules that are consumed by
  the framework instead of direct imports. Keep these exceptions specific and add them only as warnings appear; the
  current exception for `src/app/[locale]/loading.tsx` is intentional.
- `i18n-check --unused` can report false positives for translation keys used through metadata helpers or other wrapper
  functions. Treat missing, invalid, and undefined keys as hard failures; review unused-key findings before removing
  translations.
- Use `bun run build` when changes affect routing, rendering mode, i18n, metadata, fonts, providers, or App Router
  special files.
- Watch the build route table. Expected healthy output for current localized routes is static/SSG, not `ƒ Dynamic`,
  except middleware/proxy.
