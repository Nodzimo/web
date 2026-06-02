# Dependency Updates

- This repository uses Bun, Next.js App Router, React, TypeScript strict mode, Tailwind CSS, Biome, Dependency Cruiser,
  and next-intl. Interpret dependency changes against those project surfaces, not as isolated package version bumps.
- Use `bun run deps:outdated` or `bun outdated` for available updates.
- Use `bun update --interactive` when the user explicitly asks to update packages interactively.
- For post-update review, inspect `package.json`, `bun.lock`, and any touched config or generated files.
- For framework/tooling updates, check app code and project tooling even when the package has few direct imports:
  `src`, `scripts`, config files, `messages`, `.codex`, and `.idea` only when relevant.
- For `@sefo/nodzimo-ui`, review public package usage only: `.`, `./client`, and `./styles.css`. Do not deep-import
  internals from `src`, `dist`, or other package-private paths.
- For Next updates, read the installed docs under `node_modules/next/dist/docs/` before changing rendering, routing,
  metadata, Turbopack, or App Router behavior.
- For Biome updates, treat `biome.json` as part of the dependency update surface, even for patch updates. Check the
  schema/migration surface and prefer the local `bun run biome:migrate` script when migration is needed.
- Do not recommend `bunx` for Biome migration when `@biomejs/biome` is already installed locally.
- Prefer the smallest relevant checks from [Verification](verification.md). Use `bun run project:verify` only when
  production readiness or broad framework behavior is in scope.
- Do not remove translations, generated declarations, lockfile entries, IDE settings, or dependency graph artifacts
  during dependency review unless the user explicitly asks for that cleanup.
