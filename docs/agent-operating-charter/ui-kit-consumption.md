# UI Kit Consumption

- `@nodzimo/ui` is published to npm and consumed from the registry for the normal app baseline and production
  deploys.
- Keep `@nodzimo/ui` in `dependencies`, not `devDependencies`, because app code imports its runtime components
  and
  compiled stylesheet.
- Pin `@nodzimo/ui` to the intended published version in `package.json` for reproducible app installs. Update it
  intentionally with `bun add @nodzimo/ui@<version>` or `bun update @nodzimo/ui` when refreshing the
  installed
  package; avoid switching back to a floating `latest` range unless that policy is explicitly chosen again.
- Local UI-kit development still uses the sibling `../ui` project when testing unpublished changes. Build and
  pack the UI kit there, then install the generated tarball here through the existing app scripts.
- Preferred local unpublished-change workflow: run `bun run lib:pack` in `../ui`, then run
  `bun run ui-kit:reinstall`
  in this project. This temporarily changes the installed package source to the generated local `.tgz`; switch back to
  npm with `bun add @nodzimo/ui@<version>` or `bun update @nodzimo/ui` before treating the app as
  production-ready.
- Avoid `bun run ui-kit:link` and `bun link @nodzimo/ui` for Next/Turbopack.
  Linked/junction packages can fail Turbopack resolution even when Node, Bun, and the IDE resolve them correctly.
  Related upstream issues:
    - https://github.com/vercel/next.js/issues/85057
    - https://github.com/vercel/next.js/issues/77562
    - https://github.com/vercel/next.js/issues/65125
    - https://github.com/vercel/next.js/issues/64472
- `turbopack.root` is the official linked-package workaround: Turbopack only resolves files inside its root, and linked
  dependencies outside the project root require setting the root to the parent of both the app and linked dependency. Do
  not use that workaround here unless the parent folder becomes a real workspace/monorepo root with its own
  `package.json` and dependency install. In this project, setting `turbopack.root` to the sibling parent broke
  Tailwind/PostCSS dependency resolution.
- Avoid `file:../ui` as a folder dependency with Bun on Windows. Bun can try to copy the whole UI kit working
  directory, including `.git`, and fail with `EPERM`. Prefer the packed `.tgz` file for local UI-kit testing.
- Keep this project on Turbopack for normal dev/build. Do not switch the default workflow to webpack for the UI kit.
- Do not add `transpilePackages: ['@nodzimo/ui']` by default. Add it only for a reproduced package-transpilation
  problem, document the exact error it fixes, and verify that removing it still fails.
- Keep `reactCompiler: true` enabled in this app; the UI kit also uses React Compiler for its client entry.
- Import UI kit exports only from public entrypoints:
    - `@nodzimo/ui` for RSC-safe/core exports.
    - `@nodzimo/ui/client` for client-boundary exports.
    - `@nodzimo/ui/styles.css` for the compiled global stylesheet.
    - `@nodzimo/ui/theme.css` for Tailwind compiler theme mappings in Tailwind consumers.
- Keep the two CSS entrypoints separate. `styles.css` is browser-ready runtime CSS containing components, raw
  `--nui-*` token values, animations, and opt-in foundation classes. `theme.css` is compiler input that teaches the
  app's Tailwind build to generate consumer-authored utilities such as `bg-nui-card`, `ring-nui-ring`, variants, and
  opacity forms; it is not a replacement runtime stylesheet.
- Do not import from `@nodzimo/ui/src`, `@nodzimo/ui/dist`, or other deep internal paths.
- If UI kit imports fail, first verify the installed package in `node_modules/@nodzimo/ui` contains the expected
  built files and package `exports` entries for `"."`, `"./client"`, `"./styles.css"`, and `"./theme.css"` before
  changing app architecture.
