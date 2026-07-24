# next-intl And Static Rendering

- `[locale]/layout.tsx` is responsible for validating locale params and calling `setRequestLocale` through
  `setStaticLocaleFromParams`.
- In `generateMetadata`, pass the locale explicitly to `getTranslations`, e.g. `getTranslations({locale, namespace})`.
- For localized route metadata under `src/app/[locale]`, prefer the route-local `getMetadataTranslations` helper from
  `src/app/[locale]/_lib` to get `{locale, params, t}` from `params` and a typed `next-intl` namespace, then return the
  actual `Metadata` object explicitly in the page/layout.
- Do not export both `metadata` and `generateMetadata` from the same route segment.
- In pages/layout children that receive params, call `useStaticLocale(params)` or the async helper before server
  `next-intl` APIs when static rendering matters.
- Prefer translating interactive UI in a Server Component wrapper and passing the resulting labels and option data as
  serializable props to a narrow Client Component. Follow the route-local `LocaleSwitcher` / `LocaleSwitcherSelect`
  split as the reference pattern.
- Do not add a leaf component's message namespace to the route-wide `NextIntlClientProvider` when its messages can be
  resolved by a Server Component wrapper. Provide client-side messages only when the translation genuinely depends on
  client-only state and cannot be prepared on the server.
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
