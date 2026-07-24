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
- [shadcn/ui dark mode for Next.js](https://ui.shadcn.com/docs/dark-mode/next)
- [Next.js preventing-flash guide](https://nextjs.org/docs/app/guides/preventing-flash-before-hydration)

## shadcn/ui Reference And Provider Defaults

The shadcn/ui Next.js dark-mode guide is the architectural reference because `@nodzimo/ui` follows the same class-based
theming model as its upstream component patterns. Follow that contract without treating shadcn/ui's choice of
`next-themes` or its local client wrapper as mandatory application architecture.

The shadcn/ui wrapper exists to place the client-only `next-themes` provider behind a correct Client Component boundary
and forward its props. This application does not need an equivalent wrapper: `@wrksz/themes/next` already supplies a
Next-specific Server Component that inserts the pre-hydration script, while the route-local `Providers` component is
already the application composition boundary.

The intentionally bare `<ThemeProvider>` currently matches the relevant shadcn/ui configuration through the pinned
`@wrksz/themes` defaults:

| Behavior                                       | shadcn/ui example           | `@wrksz/themes` default                   | Application decision     |
|------------------------------------------------|-----------------------------|-------------------------------------------|--------------------------|
| Apply the resolved theme through a class       | `attribute="class"`         | `attribute="class"`                       | Rely on the default      |
| Start from the operating-system preference     | `defaultTheme="system"`     | `"system"` when system support is enabled | Rely on the default      |
| Listen to the operating-system preference      | `enableSystem`              | `enableSystem={true}`                     | Rely on the default      |
| Suppress CSS transitions during a theme change | `disableTransitionOnChange` | `disableTransitionOnChange={false}`       | Keep transitions enabled |

Do not repeat matching defaults as local props merely to mirror the shadcn/ui snippet. The exact dependency pin makes
the current defaults stable, and omitting redundant configuration keeps the provider focused on application-specific
behavior. When updating `@wrksz/themes`, compare these defaults with the new version before accepting the update.

`disableTransitionOnChange` does not add an animation and is unrelated to hydration or first-paint theme selection. When
enabled, it temporarily applies the equivalent of
`*, *::before, *::after { transition: none !important; }` while the theme class changes, then removes that override
after two animation frames. It affects only elements that already define a CSS transition. For example, a surface with
`transition: background-color 300ms` gradually changes from its light color to its dark color when the option is off and
changes immediately when the option is on.

The current application has no unwanted full-page color, border, shadow, or icon interpolation during theme changes, so
disabling every transition would provide no visible benefit and could suppress intentional component motion during the
switch. Reconsider the option if future styling makes theme changes visibly lag, ripple through the page, or pass
through distracting intermediate colors.

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
- The standalone root 404 is currently outside the theme provider and is intentionally not part of the themed localized
  shell. Do not place a provider outside its full `<html>` document merely to theme that fallback.

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

## Three-Way Selector Reference

The route-local `ThemeToggle` / `ThemeToggleMenu` pair is the reference implementation for a small localized interactive
control. It follows the same server-wrapper/client-leaf architecture as
`LocaleSwitcher` / `LocaleSwitcherSelect`, with a component-specific item contract because theme options also carry
icons.

### Server And Client Boundary

- Keep `ThemeToggle` as a Server Component. Resolve `ThemeToggle` messages there with `useTranslations`, construct the
  localized items, and pass only the trigger label and item data to the client boundary.
- Keep the whole interactive dropdown in `ThemeToggleMenu`. Base UI menu primitives and `useTheme` are client concerns;
  splitting only the hook into a deeper client wrapper would add an RSC slot boundary without removing the dropdown
  primitives from the client bundle.
- Do not add `ThemeToggle` messages to the route-wide `NextIntlClientProvider` and do not pass a raw message namespace
  to the client. next-intl's preferred approach is to process translations in a Server Component and pass translated
  labels through props or `children`.
- Client Components do not make the localized route dynamic. The selector uses no request-time API, so the route remains
  eligible for SSG and the interactive dropdown is prerendered to HTML before hydration.

The item boundary is intentionally small:

```tsx
export type ThemeToggleItem = {
    icon: ReactElement
    label: string
    value: ThemeSelection
}
```

Construct `ThemeToggleItem[]` directly in the server wrapper. A ready React element such as `<SunIcon />` can cross the
RSC boundary as renderable data; a component function such as `SunIcon` is not an ordinary serializable prop. Importing
`ThemeToggleItem` with `import type` does not extend the client module graph because the import is erased during
compilation.

Do not reuse `SelectOptions` merely because both contracts contain `label` and `value`. `SelectOptions` belongs to the
Select API and represents homogeneous select data. `ThemeToggleItem` belongs to this domain control and additionally
requires a rendered icon. Promote a generic dropdown option type to `@nodzimo/ui` only after multiple real consumers
share the same data contract.

The explicit annotation is sufficient:

```tsx
const themeItems: ThemeToggleItem[] = [
    // Localized items
]
```

Do not add `as const` or `satisfies` when no literal union is derived from this render-local array. The annotation
already validates every item, and the translated labels are runtime strings.

### Selection Semantics

- Use `DropdownMenuRadioGroup` because `light`, `dark`, and `system` are mutually exclusive values of one persisted
  setting. Ordinary menu items can perform the same assignments, but they do not expose the saved selection.
- Bind the radio group to `theme`, not `resolvedTheme`. `theme` preserves whether the user selected `system`;
  `resolvedTheme` only reports whether that setting currently resolves to `light` or `dark`.
- Keep the trigger visual tied to the resolved `.dark` class, so it shows the effective sun or moon. The radio indicator
  separately communicates that `system` is the saved setting and removes the ambiguity of a system choice immediately
  returning to a sun or moon icon.
- Base UI radio items remain open after selection by default. Add `closeOnClick` to each radio item when the product
  should close the menu after one choice; omit it when keeping the three choices visible is intentional. This differs
  from ordinary action items and should be a deliberate UX decision.
- Keep the internal values `system`, `light`, and `dark` untranslated and pass the selected `ThemeSelection` directly to
  `setTheme`.

### Base UI Composition And Trigger Motion

- The shadcn dark-mode example uses Radix composition with `asChild`. `@nodzimo/ui` is based on Base UI, so compose the
  trigger with `render={<Button ... />}` instead. Treat the shadcn example as a behavioral and styling reference, not as
  a drop-in API reference.
- Keep `align="end"` so the menu's inline end follows the header-edge trigger and the popup grows inward. The Nodzimo UI
  wrapper defaults to `start`.
- Render both `SunIcon` and `MoonIcon` in the trigger. The light icon starts at normal rotation and scale while the dark
  icon starts rotated, scaled to zero, and absolutely overlaid. The `dark:*` classes swap those states and
  `transition-all` interpolates the transform.
- The absolute dark icon intentionally occupies no additional layout space; both icons share the same visual center.
  These transform and transition utilities are built into Tailwind and do not require `tw-animate-css`.
- Do not copy shadcn's `h-[1.2rem] w-[1.2rem]` sizing automatically. Nodzimo UI gives both Button child icons and
  dropdown item icons the shared `size-4` default, while `Button size="icon"` and the default Select trigger both use a
  32-pixel control height. Keeping the defaults preserves header and menu icon consistency.

### Localized Popup Width

Nodzimo UI's Base UI dropdown content defaults to the anchor width with a 128-pixel minimum:

```text
w-(--anchor-width) min-w-32
```

This width is styling from the shadcn-derived wrapper, not behavior imposed by the unstyled Base UI primitive. The
Radix-based theme-toggle reference and the Base UI dropdown wrapper therefore do not share the same popup-sizing
contract.

That default is useful when a menu should track a text trigger, but an icon-only trigger is only 32 pixels wide and
therefore leaves the popup fixed at the 128-pixel minimum. A radio item with a leading icon, a long unbroken localized
label, and an absolutely positioned trailing indicator can then exhaust the available inline space and visually overlap
the indicator.

For this composition, override the popup through its supported consumer styling surface:

```text
<DropdownMenuContent align={'end'} className={'w-auto'}>
```

`mcn` resolves the conflicting width utilities, `min-w-32` remains in force, and the popup can grow with translated
content. This is a component-specific composition override, not a translation fix or a reason to change the global
Dropdown Menu default. Revisit the UI-kit default only if multiple independent consumers demonstrate that content-sized
menus should be the shared contract.

### Naming

Keep these names as the local reference:

- `ThemeToggle`: server translation and item assembly;
- `ThemeToggleMenu`: client interaction and dropdown rendering;
- `ThemeToggleItem`: one server/client boundary item contract;
- `themeItems`: the server-created collection;
- `onThemeSelectionChange`: the radio-group handler.

References:

- [next-intl: passing translated labels to Client Components](https://next-intl.dev/docs/environments/server-client-components#option-1-passing-translated-labels-to-client-components)
- [Next.js: interleaving Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components#interleaving-server-and-client-components)
- [shadcn/ui Base UI Dropdown Menu](https://ui.shadcn.com/docs/components/base/dropdown-menu)
- [Base UI Menu, including radio items and `closeOnClick`](https://base-ui.com/react/components/menu#close-on-click)

## Verification

After provider, layout, storage, or theme dependency changes:

- run `bun run type:check` and `bun run check:lint`;
- run `bun run build` and confirm localized routes remain static/SSG unless dynamic rendering was intentional;
- test a hard refresh with saved light and dark preferences;
- test the default system preference and a live operating-system theme change;
- test synchronization between two tabs when using `localStorage`;
- test the selector in English and the longest supported localized labels, including RTL;
- confirm the saved `system` value remains selected while the trigger follows the effective light/dark class;
- confirm the popup grows without label/indicator overlap and stays aligned to the header edge;
- confirm there is no first-paint flash or hydration warning in a production build.
