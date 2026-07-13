# Dependency Sources

Use this reference as a starting map for official upstream sources in this project. Verify source URLs against npm
metadata when a package changes ownership, homepage, or repository.

## Runtime Dependencies

| Package       | Official sources                                                                                       | Review focus                                                                                                                                                                                                             |
|---------------|--------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `next`        | https://github.com/vercel/next.js, https://nextjs.org/docs, https://github.com/vercel/next.js/releases | App Router behavior, config options, Turbopack, typed routes, metadata, static/dynamic rendering, build output route table. Read `node_modules/next/dist/docs/` before code changes because this project tracks Next 16. |
| `react`       | https://github.com/facebook/react, https://react.dev/blog                                              | React 19 behavior, compiler compatibility, server/client component constraints, hooks/runtime changes.                                                                                                                   |
| `react-dom`   | https://github.com/facebook/react, https://react.dev/blog                                              | React DOM/server rendering behavior, hydration, streaming, compiler/runtime compatibility.                                                                                                                               |
| `next-intl`   | https://github.com/amannn/next-intl, https://next-intl.dev/docs                                        | App Router i18n APIs, plugin config, middleware/proxy, routing helpers, message precompile, `useExtracted`, extraction, generated message declarations.                                                                  |
| `@nodzimo/ui` | npm package metadata and the sibling `../ui` repo when present                                         | Public exports only: `.`, `./client`, `./styles.css`; package exports, compiled CSS, React Compiler compatibility, Turbopack resolution. Do not deep-import internals.                                                   |
| `clsx`        | https://github.com/lukeed/clsx                                                                         | Runtime class composition API. Usually low risk; check only if major update or import/export format changes.                                                                                                             |

## Development Dependencies

| Package                       | Official sources                                                                                                                  | Review focus                                                                                                                                       |
|-------------------------------|-----------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------|
| `typescript`                  | https://github.com/microsoft/TypeScript, https://devblogs.microsoft.com/typescript/                                               | Strict type changes, module resolution, Node target support, generated Next route types, declaration generation.                                   |
| `@biomejs/biome`              | https://github.com/biomejs/biome, https://biomejs.dev                                                                             | Formatter/linter rule changes, Tailwind class sorting, CSS parser support, JSON strictness, config schema changes, `biome migrate --write` output. |
| `tailwindcss`                 | https://github.com/tailwindlabs/tailwindcss, https://tailwindcss.com/docs                                                         | Tailwind v4 directives, CSS parser behavior, utility names/order, PostCSS integration.                                                             |
| `@tailwindcss/postcss`        | https://github.com/tailwindlabs/tailwindcss, https://tailwindcss.com/docs/installation/using-postcss                              | PostCSS plugin setup, Next/Turbopack CSS processing, Tailwind v4 compatibility.                                                                    |
| `@types/node`                 | https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/node                                                         | Node API typings, engine alignment, script/config type errors.                                                                                     |
| `@types/react`                | https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react                                                        | React component and hook typings, JSX typing, React 19 compatibility.                                                                              |
| `@types/react-dom`            | https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react-dom                                                    | React DOM/server typing, hydration/root APIs.                                                                                                      |
| `babel-plugin-react-compiler` | https://github.com/facebook/react/tree/main/compiler/packages/babel-plugin-react-compiler, https://react.dev/learn/react-compiler | Compiler diagnostics, Next `reactCompiler` compatibility, memoization semantics.                                                                   |
| `dependency-cruiser`          | https://github.com/sverweij/dependency-cruiser, https://github.com/sverweij/dependency-cruiser/releases                           | Config schema, no-orphans behavior, TS/ESM parser support, dependency graph generation.                                                            |
| `@lingual/i18n-check`         | https://github.com/lingualdev/i18n-check                                                                                          | Missing/unused/invalid key detection, next-intl format handling, false positives around wrappers and metadata helpers.                             |
| `fkill-cli`                   | https://github.com/sindresorhus/fkill-cli, https://github.com/sindresorhus/fkill                                                  | `clean:ports` behavior, CLI port-target syntax, cross-platform process termination, and failure output.                                            |

## Local Review Commands

- Use `bun outdated` or `bun run deps:outdated` to see available updates.
- Use `bun update --interactive` or project-specific update commands when the user asks to update.
- Use `bun run project:audit` for the full non-build audit.
- Use `bun run project:verify` only when the user wants production-ready verification.

## Source Maintenance

When a new direct dependency is added, add an entry with:

- package name
- official repository/docs/changelog URL
- local review focus

Do not pin current installed versions in this file. Version state belongs to `package.json` and the lockfile.
