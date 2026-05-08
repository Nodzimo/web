# Translation Style

## Source Priority

Use English as the canonical UI source. Use Russian as a tone and intent reference, especially when the author uses jokes, folklore, poetic phrasing, or conversational wording that is flattened in English.

When English and Russian disagree, pause and mention the conflict unless the intended meaning is obvious from code context.

## Target Locales

### Belarusian `be`

- Use natural Belarusian in Cyrillic script.
- Keep the UI wording close to Russian context when tone matters, but do not Russify Belarusian grammar or vocabulary.
- Preserve concise interface phrasing.

### Ukrainian `uk`

- Use natural Ukrainian in Cyrillic script.
- Use Russian as a nearby tone reference only; translate from English for interface clarity.
- Preserve concise interface phrasing.

### German `de`

- Use standard German UI wording.
- Prefer clear product language over long literal compounds when a shorter UI phrase is common.
- Keep formal/neutral wording unless the source explicitly needs a more playful voice.

### French `fr`

- Use standard French UI wording.
- Keep typography and punctuation natural for French where it does not conflict with JSON or ICU syntax.
- Prefer concise, elegant phrasing over literal English word order.

### Italian `it`

- Use standard Italian UI wording.
- Prefer warm but clear interface language.
- Keep labels short enough for buttons and selectors.

### Spanish `es`

- Use neutral international Spanish.
- Avoid country-specific slang.
- Prefer clear, common UI terms that work for Spain and Latin America.

### Arabic `ar`

- Use Modern Standard Arabic.
- Keep wording suitable for product UI, not a regional dialect.
- Prefer clear neutral phrasing over ornate literary Arabic.
- Remember that Arabic is RTL; mention UI review needs if a string contains arrows, inline punctuation, mixed Latin text, numbers, or directional wording.

### Japanese `ja`

- Use natural Japanese UI language.
- Prefer concise phrases to literal Russian or English structure.
- Avoid unnecessary pronouns.
- Keep tone calm and clear unless the source intentionally has stronger character.

### Chinese `zh`

- Use Simplified Chinese.
- Use Mainland-style UI wording.
- Prefer practical, common UI terms over decorative or classical phrasing.
- Do not output Traditional Chinese unless the user explicitly changes the locale policy.

## Preservation Rules

- Preserve ICU placeholders and argument names exactly.
- Preserve newlines when they are part of the visible rhythm or layout.
- Preserve Markdown, HTML-like rich-text tags, and escaped characters.
- Keep punctuation natural for the target language, but do not break ICU syntax.
- Do not translate route paths, code identifiers, package names, or config values.
- Keep `Sefo Nodzimo` unchanged in Latin-script locales. In `Metadata.title`, transliterate the pseudonym for non-Latin scripts when that locale already localizes visible names.

## Review Notes

For fun/decorative locales, correctness still matters, but do not over-engineer localization management. Translate small batches, validate structure, and leave comments in the final response for any string that needs product/context clarification.
