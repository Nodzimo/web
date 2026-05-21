<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read
the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project Conventions

## Stack

- Package/runtime tooling: Bun.
- Runtime baseline: Node 25.x, Bun 1.3.x.
- Framework: Next.js 16 App Router with React 19 and TypeScript strict mode.
- Styling: Tailwind CSS v4, checked by Biome with sorted Tailwind classes.
- Internationalization: `next-intl` with locale routes under `src/app/[locale]`.
- Routing helpers live in `src/i18n`; prefer them over raw Next navigation when locale-aware behavior is needed.
- `src/i18n/index.ts` is the public i18n barrel. App code may import navigation, routing, and static-locale helpers from
  `@/i18n`; keep `request.ts` as an internal config entry and do not re-export it from the barrel.

## UI Kit Consumption

- `@sefo/nodzimo-ui` is published to npm and consumed from the registry for the normal app baseline and production
  deploys.
- Keep `@sefo/nodzimo-ui` in `dependencies`, not `devDependencies`, because app code imports its runtime components and
  compiled stylesheet.
- Pin `@sefo/nodzimo-ui` to the intended published version in `package.json` for reproducible app installs. Update it
  intentionally with `bun add @sefo/nodzimo-ui@<version>` or `bun update @sefo/nodzimo-ui` when refreshing the installed
  package; avoid switching back to a floating `latest` range unless that policy is explicitly chosen again.
- Local UI-kit development still uses the sibling `../nodzimo-ui` project when testing unpublished changes. Build and
  pack the UI kit there, then install the generated tarball here through the existing app scripts.
- Preferred local unpublished-change workflow: run `bun run lib:pack` in `../nodzimo-ui`, then run
  `bun run ui:reinstall`
  in this project. This temporarily changes the installed package source to the generated local `.tgz`; switch back to
  npm with `bun add @sefo/nodzimo-ui@<version>` or `bun update @sefo/nodzimo-ui` before treating the app as
  production-ready.
- Avoid `bun run ui:link`, `bun link nodzimo-ui`, and `bun link @sefo/nodzimo-ui` for Next/Turbopack.
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
- Avoid `file:../nodzimo-ui` as a folder dependency with Bun on Windows. Bun can try to copy the whole UI kit working
  directory, including `.git`, and fail with `EPERM`. Prefer the packed `.tgz` file for local UI-kit testing.
- Keep this project on Turbopack for normal dev/build. Do not switch the default workflow to webpack for the UI kit.
- Do not add `transpilePackages: ['@sefo/nodzimo-ui']` by default. Add it only for a reproduced package-transpilation
  problem, document the exact error it fixes, and verify that removing it still fails.
- Keep `reactCompiler: true` enabled in this app; the UI kit also uses React Compiler for its client entry.
- Import UI kit exports only from public entrypoints:
    - `@sefo/nodzimo-ui` for RSC-safe/core exports.
    - `@sefo/nodzimo-ui/client` for client-boundary exports.
    - `@sefo/nodzimo-ui/styles.css` for the compiled global stylesheet.
- Do not import from `@sefo/nodzimo-ui/src`, `@sefo/nodzimo-ui/dist`, or other deep internal paths.
- If UI kit imports fail, first verify the installed package in `node_modules/@sefo/nodzimo-ui` contains the expected
  built files and package `exports` entries for `"."`, `"./client"`, and `"./styles.css"` before changing app
  architecture.

## Collaboration

- If the user asks an architecture or best-practice question, answer first and do not edit files unless explicitly
  asked.
- If the user asks to implement, keep changes scoped and verify with the smallest relevant checks.
- Preserve the existing Russian conversational tone in user-facing discussion, but keep committed code and comments
  concise.
- Do not add broad abstractions just to reduce line count. Extract code when it creates a clear route-local component,
  provider wrapper, or shared helper.

## WebStorm Project Settings

- The project intentionally shares selected WebStorm settings under `.idea`: dictionaries, inspection profiles, and
  scopes. Keep `.idea` sharing narrow and do not commit workspace state, shelves, local run history, or user-specific
  IDE files.
- Use shared inspection scopes for repeatable WebStorm false positives in generated, tooling, or convention files.
  Prefer disabling a specific inspection for a narrow scope over adding `// noinspection` comments to source files or
  disabling an inspection globally.
- When extending WebStorm inspection exclusions, add the affected files to `.idea/scopes` and adjust the project profile
  in `.idea/inspectionProfiles`. Keep the scope name and profile entry descriptive enough that another developer can see
  which IDE warning is being silenced and where.

## Skills

- For next-intl message translation, synchronization, or validation, use the project-local `next-intl-localizer` skill
  at `.codex/skills/next-intl-localizer`.
- For pre-update dependency research from `bun outdated`, post-update changelog review, breaking-change triage, or
  deciding whether upgraded packages need local code/config changes, use the project-local
  `dependency-update-reviewer` skill at `.codex/skills/dependency-update-reviewer`.
- For choosing or debugging Next rendering modes, RSC/SSR/client boundaries, route static/dynamic behavior, Suspense
  streaming, or build failures involving `createContext`, hooks, or third-party packages, use the project-local
  `next-rendering-diagnostics` skill at `.codex/skills/next-rendering-diagnostics`.
- Keep supported locale order consistent across routing, selectors, and message select cases: `en`, `ru`, `be`, `uk`,
  `de`, `fr`, `it`, `es`, `ar`, `zh`, `ja`.

## Biome Policy

- Keep `biome.json` compact and explicit. Prefer Biome defaults unless the project intentionally needs a different
  behavior.
- Do not add explicit defaults such as `formatter.enabled`, `linter.enabled`, `assist.enabled`, or
  `linter.rules.recommended` just for completeness.
- Every setting in `biome.json` should document an actual project preference or compatibility need, not mirror generated
  template noise.
- Keep VCS integration enabled with Git ignore support. The project relies on `.gitignore` to keep generated and service
  files such as `.next`, `node_modules`, build output, IDE metadata, generated declarations, and local package artifacts
  out of Biome checks.
- Keep the Next and React lint domains enabled because this is a Next/React application.
- Keep JavaScript formatter preferences explicit: single quotes, no unnecessary semicolons, single JSX quotes, and
  as-needed arrow parentheses.
- Keep HTML formatter support enabled so checked HTML-like files follow the same project tooling path.
- Keep JSON comments disabled. Project JSON files should be strict JSON, not JSONC.
- Keep Tailwind CSS v4 parser support enabled through `css.parser.tailwindDirectives`.
- Do not add a `suspicious.noUnknownAtRules` exception unless the current Biome version again reports Tailwind v4
  directives such as `@theme` as false positives.
- Keep Tailwind utility class sorting enabled through Biome's `nursery.useSortedClasses` rule.
- Keep attribute sorting enabled through `assist.actions.source.useSortedAttributes`.
- Keep `style.noUnusedTemplateLiteral` enabled to catch unnecessary template literals.
- Do not add `files.includes` globs that duplicate `.gitignore` unless Biome needs a narrower project-specific scope.
- Biome does not format Markdown in this setup. Format Markdown files manually or with the editor, and avoid assuming
  `bun run check:lint` validates Markdown formatting.

## App Router Structure

- Keep route-specific code colocated with the route segment.
- Use private route folders such as `_components` and `_lib` under `src/app/[locale]`.
- Use `src/components` only for genuinely shared UI primitives that are not owned by a route.
- Route-local barrels are allowed when they define the public surface of a local folder, e.g.
  `src/app/[locale]/_components/index.ts`.
- Prefer relative imports for nearby route-local files and `@/` imports for cross-boundary project modules.

## Exports

- Use default exports only for framework convention files that require them, such as `page.tsx`, `layout.tsx`,
  `loading.tsx`, `not-found.tsx`, `error.tsx`, `template.tsx`, and config entry points.
- Use named exports for ordinary components, utilities, constants, and route-local helpers.
- Prefer `export function ComponentName()` for normal React components.
- Barrel files should re-export named symbols, e.g. `export { Header } from './header'`.

## Layouts And Shell

- Keep `<html>` and `<body>` in the route layout. They are part of the Next root layout contract.
- The top-level `src/app/layout.tsx` exists for the root `not-found.tsx` fallback and should stay minimal: import
  `@sefo/nodzimo-ui/styles.css`, then `./globals.css`, and pass through `children`.
- It is fine to extract providers, header/footer/main shell components, and font setup out of the layout.
- Keep app-wide `next/font` setup in `src/app/_lib/fonts.ts` when root special files such as `not-found.tsx` or
  `global-error.tsx` need the same font variables. Export font variables/classes only; do not hide unrelated
  HTML/Tailwind classes in font helpers.
- Provider wrappers should stay thin. For `NextIntlClientProvider`, keep `messages={null}` unless client-side
  translations are intentionally needed.

## Next Rendering Model

- Read the installed Next docs under `node_modules/next/dist/docs/` before changing rendering behavior. This project is
  on Next 16, and old App Router assumptions may be wrong.
- Pages and layouts are Server Components by default. Use them for data access, metadata, locale setup, static shell
  rendering, streaming, and keeping JavaScript out of the browser bundle.
- React Server Components (RSC) are the server component graph and payload layer. RSC decides what can run only on the
  server, what data is passed to client islands, and what JavaScript can be omitted from the browser bundle.
- Server-side rendering (SSR) is the HTML render pass. It turns the RSC payload plus Client Component references into
  initial HTML for first load, SSG output, or request-time responses.
- In App Router, RSC and SSR usually work together: RSC builds the server/client component tree, then SSR/prerendering
  produces HTML from that tree. Do not treat them as mutually exclusive page modes.
- RSC is stricter because its output must be serializable across the server/client boundary and must not depend on
  per-browser runtime state. It uses React's `react-server` condition and cannot use React context APIs such as
  `createContext`/`useContext`, state/effect hooks, event handlers, or browser APIs.
- SSR can render many ordinary React components on the server with APIs such as `createContext`, `forwardRef`, and
  `createElement`, but SSR compatibility does not prove RSC compatibility. A package can be fine in the HTML render pass
  and still fail if imported into the RSC graph.
- Use RSC when the work is about data, routing, locale, metadata, server-only secrets, static structure, or reducing
  client JavaScript. Think "server-owned component tree and data boundary".
- Think of SSR as delivery of HTML, not as the place to put interactivity. SSR improves first paint and crawlers/users
  seeing content before hydration, but any interactive behavior still needs Client Components.
- Client Components start at a `'use client'` boundary. Use them only for state, effects, event handlers, browser APIs,
  custom client hooks, and third-party widgets that are not RSC-safe. Keep the boundary as deep and narrow as possible.
- A Server Component may render a Client Component. The route can still remain static/SSG if it does not use
  request-time
  APIs or uncached runtime data.
- Static/SSG output means the route was pre-rendered at build time. It is the expected default for this small localized
  site and gives fast HTML, cacheable output, and less runtime server work.
- Dynamic rendering is for route output that must depend on request-time data such as `headers()`, `cookies()`,
  `searchParams`, auth/session state, geolocation, uncached fetches, or explicitly request-bound values through
  `connection()`.
- `searchParams` is request-time data and opts the page into dynamic rendering. Avoid it in pages intended to stay SSG;
  prefer static params, localized path segments, or client-side query handling when the content can remain static.
- Use `<Suspense>` close to slow or uncached data so stable page chrome can render or stream independently. A
  segment-level `loading.tsx` wraps the page below it, but uncached/runtime work in a layout can still block navigation.
- Providers should be rendered as deep as possible. Do not wrap the entire document with client providers unless the
  whole tree genuinely needs that provider; this helps Next optimize static Server Component regions.
- When adding third-party UI packages, first decide whether they are imported from a Server Component or behind a client
  boundary. If a package needs hooks, context, effects, event handlers, or browser APIs and does not provide a correct
  `'use client'` entry, wrap it in a local Client Component.
- A build error like `TypeError: createContext is not a function` during page data collection usually means an RSC graph
  imported code that expects ordinary/client React. First inspect the importing route, UI-kit package entrypoint,
  third-party package boundary, and compiled `.next/server/chunks` before changing app architecture.

## next-intl And Static Rendering

- `[locale]/layout.tsx` is responsible for validating locale params and calling `setRequestLocale` through
  `setStaticLocaleFromParams`.
- In `generateMetadata`, pass the locale explicitly to `getTranslations`, e.g. `getTranslations({locale, namespace})`.
- For localized route metadata under `src/app/[locale]`, prefer the route-local `getMetadataTranslations` helper from
  `src/app/[locale]/_lib` to get `{locale, params, t}` from `params` and a typed `next-intl` namespace, then return the
  actual `Metadata` object explicitly in the page/layout.
- Do not export both `metadata` and `generateMetadata` from the same route segment.
- In pages/layout children that receive params, call `useStaticLocale(params)` or the async helper before server
  `next-intl` APIs when static rendering matters.
- Keep the generated sitemap at `src/app/sitemap.ts`. Build localized sitemap URLs through `getPathname` from
  `src/i18n/navigation` and `routing.locales`; do not hand-build locale prefixes.
- With locale-prefix routing, default-locale sitemap URLs such as `/en` are expected. The root `/` is an entry point for
  locale detection, not the canonical content URL.
- For the current small static route set, use one sitemap entry per route with `alternates.languages` for all locales.
  Move to per-locale entries only when localized pages need separate metadata such as distinct `lastModified` values.
- Do not pass fake `params` props to special files. `loading.tsx` and `not-found.tsx` do not accept props.
- Avoid server `useTranslations` in `loading.tsx`; use a neutral spinner/skeleton there. For translated loading states,
  prefer page/layout-level `<Suspense fallback>` where locale is already known, or a client component when handling
  client-side API state.
- Localized `src/app/[locale]/not-found.tsx` may use `useTranslations`; it relies on locale setup from
  `[locale]/layout.tsx`.
- For catch-all routes that always 404, use `export const dynamic = 'force-static'` and call `notFound()`.
- Keep the root `src/app/not-found.tsx` as a standalone static fallback for non-localized edge cases such as dotted
  invalid URLs. Do not read `cookies()` or `headers()` there, and do not add a root-level next-intl provider just for
  this file; either choice can make static routes dynamic or duplicate i18n setup.
- Root `not-found.tsx` is outside `[locale]`, so do not use next-intl hooks or locale-aware navigation there. Use a
  plain `<a href="/">` to return through the normal locale detection path.
- If root `not-found.tsx` needs its own `<title>` or description, write a small `<head>` in that full-document fallback.
  Do not rely on `metadata` exports from `not-found.tsx`; Next documents metadata support for `global-not-found.tsx`,
  layouts, and pages, not ordinary `not-found.tsx`.

## Styling

- Import Tailwind/global CSS once from `src/app/layout.tsx`. Do not re-import `@import "tailwindcss"` in a root
  404-specific stylesheet.
- Import the UI kit compiled stylesheet before this app's `./globals.css` so app-level globals, CSS variables, and
  overrides have the final cascade position.
- Put global element defaults, such as `body` styles, inside `@layer base` so Tailwind utility classes can override them
  without `!important`.
- Avoid broad global link styling unless it is intentionally a site-wide default; prefer component or route-level
  Tailwind classes for specific link appearances.

## Cleanup Scripts

- Keep generated project artifacts under `clean:next`, including Next output, generated TypeScript files, generated
  i18n declarations, and the Dependency Cruiser SVG graph.
- Keep dependency installs under `clean:modules`.
- Keep generated HTTPS certificates under `clean:certs`; `clean:all` should include certificates along with the other
  cleanup targets.
- Keep local development port cleanup under `clean:ports`. The project uses `fkill-cli`; list each `:port` explicitly
  because `fkill` does not support a documented port-range argument.

## Verification

- Use `bun run project:audit` for the full non-build project audit. It runs route type generation/checking, Biome,
  i18n validation, Dependency Cruiser checks, and outdated dependency reporting.
- Use `bun run project:verify` before treating changes as production-ready. It refreshes dependencies with
  `bun install`, runs `project:audit`, then runs the production build.
- Prefer `bun run type:check` for route type and TypeScript validation.
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
