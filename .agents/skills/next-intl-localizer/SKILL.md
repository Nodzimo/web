---
name: next-intl-localizer
description: Update, review, or validate this project's next-intl message files. Use when Codex is asked to add missing locale keys, translate changed UI messages, synchronize messages/*.json, preserve ICU placeholders, or apply the project's English-source/Russian-context translation workflow across Slavic, European, Arabic, Japanese, and Chinese locales.
---

# Next Intl Localizer

## Overview

Use this skill for the local `next-intl` message workflow in this repo.

This skill is a localization workflow. Before translating or reviewing messages, read:

- `docs/agent-operating-charter/next-intl-localization.md`
- `docs/agent-operating-charter/next-intl-and-static-rendering.md` when routing, locale lists, metadata, sitemap,
  loading, or not-found
  behavior changes
- `references/translation-style.md` before translating or reviewing wording

Keep the skill body focused on the update procedure. Keep durable locale policy in agent docs and language guidance in
the reference.

## Update Workflow

1. Inspect `messages/en.json`, `messages/ru.json`, and existing target locale files.
2. Identify missing, extra, or changed keys by comparing nested key paths.
3. Translate only missing or intentionally changed values unless the user asks for a full review.
4. Preserve JSON object structure and nearby formatting.
5. Preserve ICU expressions, brand names, route slugs, component names, CSS classes, env names, file paths, and
   technical identifiers according to `docs/agent-operating-charter/next-intl-localization.md`.
6. After edits, run the smallest useful validation:
    - `bun .agents/skills/next-intl-localizer/scripts/check-locales.ts`
    - `bun run i18n:check` when project dependencies are available
7. If routing or locale lists are changed, also follow `docs/agent-operating-charter/next-intl-and-static-rendering.md`.

## Expected User Prompts

Typical requests that should use this skill:

- "Update locales after I added new English/Russian messages."
- "Fill missing Belarusian, Ukrainian, German, French, Italian, Spanish, Arabic, Japanese, and Chinese translations."
- "Sync `messages/*.json` using the project localization rules."
- "Check that all next-intl locale files still match."

When the user only asks for advice about localization architecture, answer first and do not edit files unless they
explicitly ask for implementation.
