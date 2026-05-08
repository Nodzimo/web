<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project Conventions

## Stack

- Package/runtime tooling: Bun.
- Framework: Next.js 16 App Router with React 19 and TypeScript strict mode.
- Styling: Tailwind CSS v4, checked by Biome with sorted Tailwind classes.
- Internationalization: `next-intl` with locale routes under `src/app/[locale]`.
- Routing helpers live in `src/i18n`; prefer them over raw Next navigation when locale-aware behavior is needed.

## Collaboration

- If the user asks an architecture or best-practice question, answer first and do not edit files unless explicitly asked.
- If the user asks to implement, keep changes scoped and verify with the smallest relevant checks.
- Preserve the existing Russian conversational tone in user-facing discussion, but keep committed code and comments concise.
- Do not add broad abstractions just to reduce line count. Extract code when it creates a clear route-local component, provider wrapper, or shared helper.

## Skills

- For next-intl message translation, synchronization, or validation, use the project-local `next-intl-localizer` skill at `.codex/skills/next-intl-localizer`.
- Keep supported locale order consistent across routing, selectors, and message select cases: `en`, `ru`, `be`, `uk`, `de`, `fr`, `it`, `es`, `ar`, `zh`, `ja`.

## App Router Structure

- Keep route-specific code colocated with the route segment.
- Use private route folders such as `_components` and `_lib` under `src/app/[locale]`.
- Use `src/components` only for genuinely shared UI primitives that are not owned by a route.
- Route-local barrels are allowed when they define the public surface of a local folder, e.g. `src/app/[locale]/_components/index.ts`.
- Prefer relative imports for nearby route-local files and `@/` imports for cross-boundary project modules.

## Exports

- Use default exports only for framework convention files that require them, such as `page.tsx`, `layout.tsx`, `loading.tsx`, `not-found.tsx`, `error.tsx`, `template.tsx`, and config entry points.
- Use named exports for ordinary components, utilities, constants, and route-local helpers.
- Prefer `export function ComponentName()` for normal React components.
- Barrel files should re-export named symbols, e.g. `export { Header } from './header'`.

## Layouts And Shell

- Keep `<html>` and `<body>` in the route layout. They are part of the Next root layout contract.
- The top-level `src/app/layout.tsx` exists for the root `not-found.tsx` fallback and should stay minimal: import `./globals.css` and pass through `children`.
- It is fine to extract providers, header/footer/main shell components, and font setup out of the layout.
- Keep `next/font` setup in route-local `_lib/fonts.ts` and export font variables/classes only. Do not hide unrelated HTML/Tailwind classes in font helpers.
- Provider wrappers should stay thin. For `NextIntlClientProvider`, keep `messages={null}` unless client-side translations are intentionally needed.

## next-intl And Static Rendering

- `[locale]/layout.tsx` is responsible for validating locale params and calling `setRequestLocale` through `setStaticLocaleFromParams`.
- In `generateMetadata`, pass the locale explicitly to `getTranslations`, e.g. `getTranslations({locale, namespace})`.
- In pages/layout children that receive params, call `useStaticLocale(params)` or the async helper before server `next-intl` APIs when static rendering matters.
- Do not pass fake `params` props to special files. `loading.tsx` and `not-found.tsx` do not accept props.
- Avoid server `useTranslations` in `loading.tsx`; use a neutral spinner/skeleton there. For translated loading states, prefer page/layout-level `<Suspense fallback>` where locale is already known, or a client component when handling client-side API state.
- Localized `src/app/[locale]/not-found.tsx` may use `useTranslations`; it relies on locale setup from `[locale]/layout.tsx`.
- For catch-all routes that always 404, use `export const dynamic = 'force-static'` and call `notFound()`.
- Keep the root `src/app/not-found.tsx` as a standalone static fallback for non-localized edge cases such as dotted invalid URLs. Do not read `cookies()` or `headers()` there, and do not add a root-level next-intl provider just for this file; either choice can make static routes dynamic or duplicate i18n setup.
- Root `not-found.tsx` is outside `[locale]`, so do not use next-intl hooks or locale-aware navigation there. Use a plain `<a href="/">` to return through the normal locale detection path.
- If root `not-found.tsx` needs its own `<title>` or description, write a small `<head>` in that full-document fallback. Do not rely on `metadata` exports from `not-found.tsx`; Next documents metadata support for `global-not-found.tsx`, layouts, and pages, not ordinary `not-found.tsx`.

## Styling

- Import Tailwind/global CSS once from `src/app/layout.tsx`. Do not re-import `@import "tailwindcss"` in a root 404-specific stylesheet.
- Put global element defaults, such as `body` styles, inside `@layer base` so Tailwind utility classes can override them without `!important`.
- Avoid broad global link styling unless it is intentionally a site-wide default; prefer component or route-level Tailwind classes for specific link appearances.

## Verification

- Prefer `bun run typegen-check` for route type and TypeScript validation.
- Prefer `bun run biome:lint` for lint/style validation.
- Use `bun run build` when changes affect routing, rendering mode, i18n, metadata, fonts, providers, or App Router special files.
- Watch the build route table. Expected healthy output for current localized routes is static/SSG, not `ƒ Dynamic`, except middleware/proxy.
