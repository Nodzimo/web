<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read
the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project Conventions

## Stack

- Package/runtime tooling: Bun.
- Framework: Next.js 16 App Router with React 19 and TypeScript strict mode.
- Styling: Tailwind CSS v4, checked by Biome with sorted Tailwind classes.
- Internationalization: `next-intl` with locale routes under `src/app/[locale]`.
- Routing helpers live in `src/i18n`; prefer them over raw Next navigation when locale-aware behavior is needed.
- `src/i18n/index.ts` is the public i18n barrel. App code may import navigation, routing, and static-locale helpers from
  `@/i18n`; keep `request.ts` as an internal config entry and do not re-export it from the barrel.

## Local UI Kit Consumption

- `nodzimo-ui` is developed as a separate sibling project, not as part of a monorepo.
- Treat the sibling UI kit as its own project with its own `AGENTS.md`. Keep package-internal build, source layout,
  export-map, React Compiler, and core/client boundary rules documented there; keep only Next-consumer integration rules
  in this file.
- Keep this project on Turbopack for normal dev/build. Do not switch the default workflow to webpack just to consume the
  local UI kit.
- Avoid `bun link nodzimo-ui` for Next/Turbopack. Linked/junction packages can fail Turbopack resolution even when Node,
  Bun, and the IDE resolve them correctly. Related upstream issues:
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
  directory, including `.git`, and fail with `EPERM`.
- Preferred local workflow for now: build and pack `nodzimo-ui`, then consume the generated `.tgz` through a `file:`
  dependency.
- Current dependency shape is a local tarball dependency: `"nodzimo-ui": "../nodzimo-ui/nodzimo-ui.tgz"`.
- When updating the UI kit locally, run `bun run lib:pack` in `../nodzimo-ui`, then reinstall it here with
  `bun run ui:reinstall` before testing this app.
- Do not add `transpilePackages: ['nodzimo-ui']` by default. It did not fix the `bun link`/Turbopack issue, and the
  packed UI kit works as a normal built dependency without it.
- Add `transpilePackages` only for a reproduced package-transpilation problem, such as importing uncompiled source from
  a package. If added, document the exact error it fixes and verify that removing it still fails.
- Keep `reactCompiler: true` enabled in this app; the UI kit also uses React Compiler for its client entry.
- Import UI kit exports only from public entrypoints:
    - `nodzimo-ui` for RSC-safe/core exports.
    - `nodzimo-ui/client` for client-boundary exports.
- Do not import from `nodzimo-ui/src`, `nodzimo-ui/dist`, or other deep internal paths.
- If UI kit imports fail, first verify the installed package in `node_modules/nodzimo-ui` contains `dist/nodzimo-ui.js`,
  `dist/client.js`, generated declarations under `dist/src`, and package `exports` entries for `"."` and `"./client"`.
- If a component works in a plain Vite consumer but fails in this Next app, check the packed output and Next package
  installation before changing app architecture.
- The tarball workflow is a local development workaround, not a publishing requirement. Revisit it when the UI kit is
  published to a registry.

## Collaboration

- If the user asks an architecture or best-practice question, answer first and do not edit files unless explicitly
  asked.
- If the user asks to implement, keep changes scoped and verify with the smallest relevant checks.
- Preserve the existing Russian conversational tone in user-facing discussion, but keep committed code and comments
  concise.
- Do not add broad abstractions just to reduce line count. Extract code when it creates a clear route-local component,
  provider wrapper, or shared helper.

## Skills

- For next-intl message translation, synchronization, or validation, use the project-local `next-intl-localizer` skill
  at `.codex/skills/next-intl-localizer`.
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
- Keep JSON comments disabled. Project JSON files should be strict JSON, not JSONC.
- Keep Tailwind CSS v4 parser support enabled through `css.parser.tailwindDirectives`.
- Keep `suspicious.noUnknownAtRules` disabled while Tailwind v4 at-rules such as `@theme` are used and Biome's CSS rule
  would otherwise report them.
- Keep Tailwind utility class sorting enabled through Biome's `nursery.useSortedClasses` rule.
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
  `./globals.css` and pass through `children`.
- It is fine to extract providers, header/footer/main shell components, and font setup out of the layout.
- Keep app-wide `next/font` setup in `src/app/_lib/fonts.ts` when root special files such as `not-found.tsx` or
  `global-error.tsx` need the same font variables. Export font variables/classes only; do not hide unrelated
  HTML/Tailwind classes in font helpers.
- Provider wrappers should stay thin. For `NextIntlClientProvider`, keep `messages={null}` unless client-side
  translations are intentionally needed.

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
- Put global element defaults, such as `body` styles, inside `@layer base` so Tailwind utility classes can override them
  without `!important`.
- Avoid broad global link styling unless it is intentionally a site-wide default; prefer component or route-level
  Tailwind classes for specific link appearances.

## Verification

- Prefer `bun run type:check` for route type and TypeScript validation.
- Prefer `bun run lint` for lint/style validation.
- `i18n-check --unused` can report false positives for translation keys used through metadata helpers or other wrapper
  functions. Treat missing, invalid, and undefined keys as hard failures; review unused-key findings before removing
  translations.
- Use `bun run build` when changes affect routing, rendering mode, i18n, metadata, fonts, providers, or App Router
  special files.
- Watch the build route table. Expected healthy output for current localized routes is static/SSG, not `ƒ Dynamic`,
  except middleware/proxy.
