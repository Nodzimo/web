# Stack

- Package/runtime tooling: Bun.
- Runtime baseline: Node 26.x, Bun 1.3.x.
- Framework: Next.js 16 App Router with React 19 and TypeScript strict mode.
- Styling: Tailwind CSS v4, checked by Biome with sorted Tailwind classes.
- Internationalization: `next-intl` with locale routes under `src/app/[locale]`.
- Routing helpers live in `src/i18n`; prefer them over raw Next navigation when locale-aware behavior is needed.
- `src/i18n/index.ts` is the public i18n barrel. App code may import navigation, routing, and static-locale helpers from
  `@/i18n`; keep `request.ts` as an internal config entry and do not re-export it from the barrel.
