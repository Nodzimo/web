# Translation Style

## Source Priority

Use English as the canonical UI source. Use Russian as a tone and intent reference, especially when the author uses jokes, folklore, poetic phrasing, or conversational wording that is flattened in English.

When English and Russian disagree, pause and mention the conflict unless the intended meaning is obvious from code context.

## Target Locales

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
- Do not translate `Nodzimo`, `Sefo`, route paths, code identifiers, package names, or config values.

## Review Notes

For fun/decorative locales, correctness still matters, but do not over-engineer localization management. Translate small batches, validate structure, and leave comments in the final response for any string that needs product/context clarification.
