# Theme Management

## Decision

- Use `@wrksz/themes` for application theme state and persistence.
- Keep the dependency pinned to an exact version while the package is young; review upstream changes before updating.
- Use `light`, `dark`, and `system` as stable internal theme values. Translate only their user-visible labels.
- Apply the resolved theme as a class on `<html>`. `@nodzimo/ui` and its Tailwind `dark:*` utilities use `.dark` as
  their shared styling contract.

## Why This Package

Three approaches were evaluated when theme switching was introduced:

- `next-themes` is the established ecosystem default and shaped the familiar provider/hook API. At the time of this
  decision, however, its latest release was from March 2025 and known React 19, Next 16, and Node 25+ fixes remained
  unreleased. That maintenance state was a poor fit for this project's bleeding-edge runtime baseline.
- The official Next.js approach explains the essential pre-hydration script pattern, but it is a reference
  implementation rather than a complete theme subsystem. Owning it would also mean maintaining persistence, system
  preference listeners, cross-tab synchronization, React state, CSP handling, transitions, and hydration behavior.
- `@wrksz/themes` keeps the small `next-themes`-style API while targeting current React and Next behavior, providing
  separate Next/server and client entrypoints, and carrying no runtime dependencies. Its freshness is a maintenance
  risk, so the package remains replaceable and exact-version pinned.

Upstream references:

- [`@wrksz/themes` documentation](https://themes.wrksz.dev/)
- [`@wrksz/themes` repository](https://github.com/jakubwarkusz/themes)
- [Next.js preventing-flash guide](https://nextjs.org/docs/app/guides/preventing-flash-before-hydration)

## Layout And Provider Placement

- `src/app/layout.tsx` is a minimal pass-through required by the standalone root `not-found.tsx`; it does not own the
  localized document markup.
- `src/app/[locale]/layout.tsx` owns `<html>` and `<body>` for normal localized routes. Put the theme hydration contract
  on its `<html>` element.
- Keep the application-wide `ThemeProvider` in the route-local `Providers` composition component, outside
  `NextIntlClientProvider`. The providers do not depend on one another, but theme is the broader concern.
- Import `ThemeProvider` from `@wrksz/themes/next`. It is an async Server Component and the `Providers` composition file
  must not be marked `'use client'`.
- Import interactive hooks such as `useTheme` from `@wrksz/themes/client` only inside Client Components such as the
  theme toggle.
- The standalone root 404 is currently outside the theme provider and is intentionally not part of the themed
  localized shell. Do not place a provider outside its full `<html>` document merely to theme that fallback.

The intended composition is:

```tsx
<html suppressHydrationWarning>
<body>
<ThemeProvider>
    <NextIntlClientProvider messages={messages}>
        {children}
    </NextIntlClientProvider>
</ThemeProvider>
</body>
</html>
```

## Hydration Contract

The server cannot read a browser's `localStorage` or system color preference. The theme provider therefore inserts a
small script that runs before the first paint and applies the resolved class and native `color-scheme` to `<html>`.

This intentionally makes the browser DOM differ from the original server markup before React hydrates it. Keep
`suppressHydrationWarning` on the localized `<html>` element. It acknowledges this one-level, expected attribute
difference; it should not be moved to broad descendants or used to hide unrelated hydration errors.

## Storage And Static Rendering

- Keep the default `localStorage` mode. The pre-hydration script applies the stored or system theme before paint, so it
  avoids a visible theme flash while preserving static generation.
- Do not enable `storage="cookie"` or `storage="hybrid"` by default. The Next provider reads `cookies()` for those
  modes, introducing request-time data and changing the localized routes' SSG behavior.
- Consider cookie-backed storage only when server-rendered output genuinely depends on the saved theme and the project
  explicitly accepts dynamic rendering and its cache consequences.
- Do not add a parallel `prefers-color-scheme` CSS fallback for the same theme tokens. It can disagree with an explicit
  stored preference while the provider already resolves `system` before paint.

## Toggle Behavior

- The initial default is `system`; `resolvedTheme` reports whether that currently resolves to `light` or `dark`.
- The first implementation toggles explicit `light` and `dark` values. After the user clicks it, the saved preference
  no longer follows the operating system.
- A future three-way selector should call `setTheme('light')`, `setTheme('dark')`, or `setTheme('system')` and localize
  the labels through next-intl. Keep the stored identifiers untranslated.
- Avoid rendering theme-dependent labels or imagery from an unresolved theme during SSR. Use a mounted-safe control or
  the library's theme-aware helpers when the visible output itself differs by theme.

## Verification

After provider, layout, storage, or theme dependency changes:

- run `bun run type:check` and `bun run check:lint`;
- run `bun run build` and confirm localized routes remain static/SSG unless dynamic rendering was intentional;
- test a hard refresh with saved light and dark preferences;
- test the default system preference and a live operating-system theme change;
- test synchronization between two tabs when using `localStorage`;
- confirm there is no first-paint flash or hydration warning in a production build.
