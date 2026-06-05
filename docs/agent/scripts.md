# Scripts

## Project-Level Scripts

- `bun run project:audit` is the main non-build audit button. It runs route type generation/checking, Biome checks,
  i18n validation, Dependency Cruiser checks, and dependency update visibility checks.
- `bun run project:verify` is the main full verification button. It installs dependencies, runs `project:audit`, then
  runs the production Next build.

## App Runtime Scripts

- `bun run dev` starts the regular Next dev server on port `3100`.
- `bun run dev:https` starts the dev server on port `3200` with experimental HTTPS.
- `bun run dev:webpack` starts the dev server on port `3150` with webpack instead of the default bundler.
- `bun run build` runs `next build --debug`.
- `bun run start` starts the built Next app.
- `bun run start:preview` builds the app and starts it on port `3300`.
- `bun run start:cpu-prof` starts the built app on port `3400` with experimental CPU profiling.

## Analysis Scripts

- `bun run analyze` runs Next's experimental analyzer.
- `bun run analyze:info` prints Next environment information.
- `bun run analyze:output` runs the analyzer with output enabled.

## Check Scripts

- `bun run type:gen` generates Next route types.
- `bun run type:check` generates route types and runs TypeScript with `tsc --noEmit`.
- `bun run check:lint` runs Biome checks.
- `bun run check:deps` runs Dependency Cruiser against `src`.
- `bun run check:deps-graph` generates `dependency-graph.svg` from Dependency Cruiser output and requires Graphviz
  `dot`.
- `bun run check:format` runs only Biome formatting.
- `bun run check:fix` applies safe Biome fixes, formatting, and import organization.
- `bun run check:fix-unsafe` applies unsafe Biome fixes intentionally.
- `bun run biome:migrate` runs Biome's local migration command after a Biome dependency update.
- `bun run i18n:check` validates next-intl messages using English as the source locale.
- `bun run i18n:unused` checks for unused message keys under `src`.

## Cleanup Scripts

- `bun run clean:next` removes generated Next artifacts.
- `bun run clean:modules` removes dependency installs.
- `bun run clean:certs` removes local HTTPS certificates.
- `bun run clean:all` removes generated Next artifacts, dependency installs, and local HTTPS certificates.
- `bun run clean:ports` uses `fkill-cli` to free the known local development ports: `3100`, `3150`, `3200`, `3300`,
  and `3400`. Ports must stay prefixed with `:` in the script because bare numbers are process ids for `fkill`.

## Dependency Scripts

- `bun run deps:install` installs dependencies.
- `bun run deps:audit` runs Bun's dependency audit.
- `bun run deps:outdated` checks dependency updates.
- `bun run deps:update` starts Bun's interactive dependency update flow.

## Release Scripts

- `bun run release:patch` bumps the package patch version with `bun pm version patch`, creating the version commit and
  version tag.
- `bun run release:version` prints the current package version through `bun pm version`.
- `bun run release:push` pushes the current branch and missing annotated version tags with `git push --follow-tags`.
  This triggers the GitHub Release workflow when a single matching version tag is pushed. See
  [GitHub Releases](github-releases.md).

## Local UI-Kit Scripts

- `bun run ui-kit:add` installs the sibling UI-kit tarball from `../nodzimo-ui/nodzimo-ui.tgz`.
- `bun run ui-kit:remove` removes the installed UI-kit package.
- `bun run ui-kit:reinstall` removes and reinstall the sibling UI-kit tarball.
- `bun run ui-kit:link` links the UI kit through Bun. Prefer published package or tarball testing for Next/Turbopack;
  see [UI Kit Consumption](ui-kit-consumption.md).

## Git Helper Scripts

- `bun run git:status`, `bun run git:pull`, `bun run git:stash`, `bun run git:stash-pop`, `bun run git:reset`,
  `bun run git:push`, and `bun run git:normalize` are lightweight local git helpers.
