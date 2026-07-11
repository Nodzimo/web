# Dependency Updates

- This repository uses Bun, Next.js App Router, React, TypeScript strict mode, Tailwind CSS, Biome, Dependency Cruiser,
  and next-intl. Interpret dependency changes against those project surfaces, not as isolated package version bumps.
- Use `bun run deps:outdated` or `bun outdated` for available updates.
- Use `bun run deps:audit` for dependency security audit visibility.
- Use `bun update --interactive` when the user explicitly asks to update packages interactively.
- For post-update review, inspect `package.json`, `bun.lock`, and any touched config or generated files.
- Treat audit warnings as triage input, not an automatic mandate to rewrite the dependency tree. First check whether
  direct dependencies are already up to date; if they are, classify findings by severity, runtime exposure, and whether
  they affect production code or only development tooling.
- Do not add transitive packages to `dependencies` merely to silence audit warnings.
- Consider `overrides` heavy artillery for transitive vulnerabilities. Use them only after explicit review and
  agreement, especially for critical/high findings or confirmed runtime exposure that cannot wait for upstream fixes.
- For framework/tooling updates, check app code and project tooling even when the package has few direct imports:
  `src`, `scripts`, config files, `messages`, `.codex`, and `.idea` only when relevant.
- For `@nodzimo/ui`, review public package usage only: `.`, `./client`, and `./styles.css`. Do not deep-import
  internals from `src`, `dist`, or other package-private paths.
- For Next updates, read the installed docs under `node_modules/next/dist/docs/` before changing rendering, routing,
  metadata, Turbopack, or App Router behavior.
- For TypeScript major updates, treat framework integration as part of the update surface, not just `tsc --noEmit`.
  Next's route type generation, `next.config.ts` loading, production build type checking, IDE language services, and
  any sibling UI-kit validation must all be compatible before updating the main project.
- For Biome updates, treat `biome.json` as part of the dependency update surface, even for patch updates. Check the
  schema/migration surface and prefer the local `bun run biome:migrate` script when migration is needed.
- Do not recommend `bunx` for Biome migration when `@biomejs/biome` is already installed locally.
- Prefer the smallest relevant checks from [Verification](verification.md). Use `bun run project:verify` only when
  production readiness or broad framework behavior is in scope.
- Do not remove translations, generated declarations, lockfile entries, IDE settings, or dependency graph artifacts
  during dependency review unless the user explicitly asks for that cleanup.

## TypeScript 7 Incident

- TypeScript 7.0 is a desired bleeding-edge target for this project, but it is temporarily blocked for the main Next.js
  app. The current safe baseline is TypeScript 6.x until Next.js stable supports the TypeScript 7 integration path.
- The attempted `typescript@7.0.2` update broke `bun run type:check` at the `next typegen` step with Next's misleading
  TypeScript setup message:
  `It looks like you're trying to use TypeScript but do not have the required package(s) installed.`
- The failure is not caused by app code. TypeScript 7.0 ships the new native Go compiler and does not include the legacy
  `typescript/lib/typescript.js` JavaScript Compiler API file that Next.js stable currently probes and loads for parts
  of its TypeScript integration.
- After that failed detection, Next tried to auto-install TypeScript during the verification run. In this Bun-managed
  repository that invoked `pnpm add --save-exact --save-dev typescript`, caused `pnpm` to move Bun-installed packages
  into `node_modules/.ignored`, and then failed on Windows while unlinking `node_modules/.bin/next.EXE`.
- Do not mix package managers to fix this. If this incident is reproduced locally, close running Next/IDE processes,
  remove the mixed `node_modules` state, reinstall with Bun, and restore `typescript` to the supported 6.x package.
- Do not add `experimental.useTypeScriptCli` in `next.config.ts` on stable Next. That flag exists in the merged Next.js
  TypeScript 7 support work, but it is an experimental canary path until it ships and stabilizes in a stable Next.js
  release.
- The side-by-side workaround from the TypeScript team (`typescript` aliased to `@typescript/typescript6` plus
  `@typescript/native` for the 7.0 CLI) is useful for standalone `tsc` experiments, but it does not make this app a
  real TypeScript 7 Next project because Next still type-checks through the TypeScript 6 API path.
- Revisit the update only when all the following are true:
    - Next.js stable includes TypeScript 7 support or a documented stable replacement for its TypeScript Compiler API
      integration.
    - TypeScript 7.1 or later exposes the API surface expected by framework/tooling integrations, or Next no longer
      requires that API for this project path.
    - `bun run type:check`, `bun run project:audit`, and `bun run build` pass from a clean Bun install without invoking
      another package manager.
- Track upstream:
    - [TypeScript 7.0 announcement](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/)
    - [Next.js discussion: Add support for TypeScript 7](https://github.com/vercel/next.js/discussions/95633)
    - [Next.js PR: Add experimental TypeScript CLI backend](https://github.com/vercel/next.js/pull/95639)
