---
name: next-intl-localizer
description: Update, review, or validate this project's next-intl message files. Use when Codex is asked to add missing locale keys, translate changed UI messages, synchronize messages/*.json, preserve ICU placeholders, or apply the project's English-source/Russian-context translation workflow across Slavic, European, Arabic, Japanese, and Chinese locales.
---

# Next Intl Localizer

## Overview

Use this skill for the local `next-intl` workflow in this repo. The project uses English as the canonical UI source, Russian as tone/context, and generated secondary locales for Slavic, European, Arabic, Japanese, and Chinese audiences.

## Locale Policy

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
- Preserve this order everywhere users see or route through locales: `en`, `ru`, `be`, `uk`, `de`, `fr`, `it`, `es`, `ar`, `zh`, `ja`.
- Do not invent dialect-specific Arabic, Traditional Chinese, regional Japanese variants, or alternate European regional variants unless the user explicitly asks.

## Update Workflow

1. Inspect `messages/en.json`, `messages/ru.json`, and existing target locale files.
2. Identify missing, extra, or changed keys by comparing nested key paths.
3. Translate only missing or intentionally changed values unless the user asks for a full review.
4. Preserve JSON object structure and nearby formatting.
5. Preserve ICU expressions exactly:
   - variables like `{name}`, `{count}`, `{locale}`
   - select/plural argument names
   - rich-text tags like `<link>...</link>`
6. Do not translate brand names, route slugs, component names, CSS classes, env names, file paths, or technical identifiers.
7. After edits, run the smallest useful validation:
   - `bun .codex/skills/next-intl-localizer/scripts/check-locales.ts`
   - `bun run i18n:check` when project dependencies are available
8. If routing or locale lists are changed, also follow the repo's App Router verification rules from `AGENTS.md`.

## Translation Style

Read `references/translation-style.md` before translating or reviewing wording. Keep the skill body lean; put detailed language rules and examples there.

## Expected User Prompts

Typical requests that should use this skill:

- "Update locales after I added new English/Russian messages."
- "Fill missing Belarusian, Ukrainian, German, French, Italian, Spanish, Arabic, Japanese, and Chinese translations."
- "Sync `messages/*.json` using the project localization rules."
- "Check that all next-intl locale files still match."

When the user only asks for advice about localization architecture, answer first and do not edit files unless they explicitly ask for implementation.
