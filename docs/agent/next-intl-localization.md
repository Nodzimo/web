# next-intl Localization

- Treat `messages/en.json` as the default locale and primary translation source.
- Treat `messages/ru.json` as the author's native-language context for tone, jokes, cultural references, and intent.
- Generate secondary locales from English while consulting Russian when wording is ambiguous.
- Keep locale order grouped by product intent:
    - `en`: default/canonical source.
    - `ru`: author's native-language context.
    - `be`, `uk`: nearby Slavic block.
    - `de`, `fr`, `it`, `es`: European block.
    - `ar`: Modern Standard Arabic for broad Arabic UI use.
    - `zh`: Simplified Chinese with Mainland-style UI wording.
    - `ja`: natural Japanese UI wording, concise and not overly literal.
- Preserve this order everywhere users see or route through locales: `en`, `ru`, `be`, `uk`, `de`, `fr`, `it`, `es`,
  `ar`, `zh`, `ja`.
- Do not invent dialect-specific Arabic, Traditional Chinese, regional Japanese variants, or alternate European regional
  variants unless the user explicitly asks.
- Preserve ICU expressions exactly:
    - variables like `{name}`, `{count}`, `{locale}`
    - select/plural argument names
    - rich-text tags like `<link>...</link>`
- Do not translate brand names, route slugs, component names, CSS classes, env names, file paths, or technical
  identifiers.
- Use `bun .codex/skills/next-intl-localizer/scripts/check-locales.ts` for deterministic locale key and ICU placeholder
  checks.
- Use `bun run i18n:check` for the project-level next-intl validation path when dependencies are available.
