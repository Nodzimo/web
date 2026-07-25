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
  split and the detailed boundary below as the reference pattern.
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

## Locale Switcher Boundary

- Treat `src/app/[locale]/_components/locale-switcher.tsx` and `locale-switcher-select.tsx` as the reference
  server/client split for localized interactive controls. The Server Component owns translations and prepared product
  data; the Client Component owns navigation, transitions, and the interactive Select.
- Import RSC-safe flag icons from `@nodzimo/ui` in the Server Component, instantiate them there, and store each prepared
  icon as `ReactElement` beside its translated label and `Locale` value. Passing these ready elements through grouped
  props is supported RSC composition and avoids duplicating a locale-to-icon mapping in the client.
- Extend `SelectOption<Locale>` locally as `LocaleSwitcherOption` for rich option metadata. Keep that option type
  internal to the client module; export `LocaleSwitcherGroup` because the Server Component uses it to validate the
  prepared group contract.
- Keep the naming distinction deliberate: an option is a data object, `items` is the collection/lookup vocabulary used
  by the Select API, and `SelectItem` is the rendered compound component.
- Keep the ordered `groups` array as the single product-data source. The client's `flatMap` is a derived flat view used
  by the Select `items` lookup and custom selected-value rendering; it is not a second option model. Render popup groups
  from the original nested data.
- When mapping groups, use a keyed `Fragment` to return the separator and group without introducing an extra DOM wrapper
  into the compound Select content. Render `SelectSeparator` before every group except the first so separators appear
  only between groups.
- The locale selector is controlled by a valid `Locale` and has no placeholder option, so narrow the `SelectValue`
  render value to `Locale`, not `Locale | null`. Retain the missing-result guard after `find()` because TypeScript
  correctly returns `undefined`; rendering `null` is sufficient and should not become a localized error flow.
- Keep a named `onValueChange` parameter as `Locale | null` and guard `null` because that is the external Base UI
  single-select callback contract, even though the current product UI does not expose a clearable state.
- Preserve the localized `aria-label` on the visually unlabeled trigger. For flag-bearing rows use
  `className={'*:items-center'}` on `SelectItem`; let the custom selected-value wrapper own its
  `flex items-center gap-2` composition.
