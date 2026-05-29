---
name: code-style-reviewer
description: Review and fix project code-style conventions that Biome, TypeScript, and Next.js do not fully enforce. Use when Codex is asked for a final project convention pass, cleanup after copied React/Tailwind code, consistency review, JSX literal normalization, rest-prop naming, type-vs-interface review, literal table typing, module constant naming, file extension/import/export style checks, or app-wide style cleanup.
---

# Code Style Reviewer

## Overview

Use this skill as the final project convention pass. It covers readability and maintenance rules that are not fully
enforced by Biome, TypeScript, or Next.js.

This skill is a reviewer and safe-fix orchestrator. It should fix mechanical convention drift and report semantic
decisions instead of rewriting code by taste.

## Scope Boundaries

- Do not duplicate Biome. Let Biome handle formatting, import organization, sorted object keys, sorted JSX attributes,
  sorted interface members, sorted Tailwind classes, and ordinary lint diagnostics.
- Do not replace focused skills. Use `tailwind-class-formatter` for long Tailwind class-list grouping,
  `next-rendering-diagnostics` for RSC/SSR/client-boundary decisions, and `next-intl-localizer` for translation/message
  work.
- Do not make broad refactors under the label of style review.
- Do not change runtime behavior, public route behavior, rendered markup structure, accessibility semantics, or
  component styling unless the user explicitly asks for that implementation change.
- Treat generated output as generator-owned. Do not hand-normalize generated Next type files, `.next` output, or other
  generated artifacts.

## Safe Fixes

These changes are usually safe when the local code shape is clear:

- Rename destructured remainder objects to `restProps`, `restArgs`, or `restParams`.
- Normalize JSX string literal props in TSX source to expression containers.
- Replace widened literal-table annotations with `as const` when downstream code derives unions from values or keys.
- Add `satisfies readonly SomeType[]` to literal option arrays when the array is meant to validate against an external
  finite union without widening its elements.
- Rename intentional module-scope immutable literal tables, mappings, option arrays, and defaults to `UPPER_SNAKE_CASE`.
  Apply this only when the value itself is effectively immutable by construction, not merely because the binding uses
  `const`.
- Derive unions from literal tables instead of duplicating string unions by hand.
- Rename hand-authored `.tsx` files to `.ts` when they contain no JSX, and use `.tsx` when JSX is present.
- Remove explicit `.ts` / `.tsx` extensions from local TypeScript imports when the project resolver can resolve the
  module without them.
- Separate multiline declarations from neighboring declarations with blank lines when they would otherwise visually
  stick to single-line constants or functions.

Run verification after safe fixes.

## Review-Only Decisions

Report these unless the correct change is obvious from local context:

- Converting between `type` and `interface`.
- Moving values between module scope and render scope.
- Changing public exported names.
- Changing export style when it affects route readability, framework convention files, or shared module surfaces.
- Changing raw SVG, HTML, MDX, CSS, or generated file quote style.
- Replacing object maps with arrays because order is semantically important.
- Changing `Object.freeze(...)` usage when runtime immutability is part of the contract.

## JSX Literal Policy

In hand-authored TSX source, prefer expression containers for string literal prop values:

```tsx
<Button data-slot={'button'} variant={'default'}/>
```

Do not prefer bare string JSX attributes in TSX source:

```tsx
<Button data-slot='button' variant='default'/>
```

Rationale:

- JSX prop values use one consistent expression-container shape.
- Refactoring a literal to a variable, function call, object, or class merge does not require changing the prop shell.
- The string remains visually obvious because the literal still has quotes inside the braces.

Limits:

- Do not apply this rule to raw HTML, raw SVG, MDX, CSS, or generated files.
- Keep boolean shorthand for boolean props when it is the clearest form.
- Keep spread props as spreads.
- Keep attribute values that are already expressions as expressions.

Valid:

```tsx
<Button disabled data-slot={'button'} onClick={handleClick} {...restProps} />
```

Do not rewrite to:

```tsx
<Button disabled={true} data-slot={'button'} onClick={handleClick} {...restProps} />
```

## Quote Policy

- JS, TS, and TSX use single quotes where possible.
- JSX string literals should still be inside expression containers in TSX source, for example `kind={'primary'}`.
- CSS may use single quotes where practical, but double quotes are acceptable when nested quotes make them clearer or
  when tool output requires them.
- Raw HTML and raw SVG may keep double-quoted attributes. Do not churn raw SVG assets only to satisfy JS quote taste.
- Markdown fenced code blocks should use a language tag only when the snippet is syntactically valid as that language
  on its own. Use `text` for partial JSX attributes, JSON fragments, placeholders, or intentionally invalid examples.

## Rest Naming

When destructuring an object and collecting the remaining properties, name the remainder for what it is:

- Component props remainder: `restProps`.
- Function/helper arg remainder: `restArgs`.
- Route/query/config parameter remainder: `restParams`.

Good:

```tsx
function Button({className, variant, ...restProps}: ButtonProps) {
    return <button className={className} {...restProps} />
}
```

Avoid:

```tsx
function Button({className, variant, ...props}: ButtonProps) {
    return <button className={className} {...props} />
}
```

Use `props`, `args`, or `params` only when the object is not a remainder, for example a whole input object passed into a
helper or component without destructuring in the same binding.

## Type And Interface Policy

Use `type` where TypeScript type composition is the point:

- unions;
- intersections;
- utility types;
- `ComponentProps<...>`;
- extracted callback signatures;
- type aliases derived from literal tables.

Use `interface` where an object contract is intentionally open, extendable, or naturally implemented/augmented:

- public object shapes expected to be extended;
- declaration-merge-friendly contracts;
- class implementation contracts;
- external-facing object contracts where extension is part of the model.

Do not convert between `type` and `interface` only for taste or only because one form sorts better. If the best choice
is
not clear, report the candidate and reason instead of editing.

## File Extension Policy

Use file extensions to communicate whether a source file contains JSX:

- Use `.ts` for TypeScript files without JSX.
- Use `.tsx` for files that contain JSX.
- Do not keep a `.tsx` extension only because the file is part of a React component folder.
- Do not rename framework convention files in ways that conflict with Next's expected file names.
- Do not rename generated files manually.

When renaming `.tsx` to `.ts` or `.ts` to `.tsx`, update local imports as needed and run TypeScript verification.

## Import Path Policy

Do not include explicit `.ts` or `.tsx` extensions in TypeScript source imports:

```ts
import {Header} from './header'
import {getMetadataTranslations} from './metadata'
```

Avoid:

```ts
import {Header} from './header.tsx'
import {getMetadataTranslations} from './metadata.ts'
```

Rationale:

- The project resolver and bundler already resolve TypeScript source modules.
- Extensionless imports survive `.ts` / `.tsx` renames better.
- Explicit source extensions create unnecessary churn in a Next app.

Do not apply this rule to non-TypeScript asset imports where the extension is the contract, such as CSS, raw Markdown,
or query-suffixed imports.

## Export Style Policy

Choose export style by file shape, not personal preference.

Use default exports only for Next framework convention files that require them, such as `page.tsx`, `layout.tsx`,
`loading.tsx`, `not-found.tsx`, `error.tsx`, `template.tsx`, and config entry points.

Use direct named exports for small leaf files with one primary runtime export and maybe its local type:

```tsx
export type HeaderProps = ComponentProps<'header'>

export function Header({className, ...restProps}: HeaderProps) {
    return <header className={className} {...restProps} />
}
```

Use a grouped export block at the end for compound or multipart files where many local declarations are intentionally
public:

```ts
export {
    LOCALE_OPTIONS,
    LocaleSwitcher,
    type LocaleOption,
}
```

This keeps compound files readable: first inspect the local implementation, then review the intentional public surface
in one place.

Do not churn export style in files where the current shape is already clear. Prefer grouped exports when a file exposes
several related components, constants, and types from one module.

## Literal Table Policy

Use module-scope `UPPER_SNAKE_CASE` for intentional immutable literal tables, mappings, defaults, and finite option
lists:

```ts
const LOCALE_OPTIONS = ['en', 'ru', 'be', 'uk'] as const
type LocaleOption = (typeof LOCALE_OPTIONS)[number]
```

When validating against an external finite union, preserve literal inference and validate shape:

```ts
const NAVIGATION_ITEMS = [
    'home',
    'projects',
    'contact',
] as const satisfies readonly NavigationItem[]
```

Avoid widened annotations when downstream code needs literal values:

```ts
const LOCALE_OPTIONS: readonly string[] = ['en', 'ru']
```

Do not duplicate unions by hand when they can be derived from the table. For object mappings, derive key and value types
from the mapping:

```ts
const SOCIAL_LINKS = {
    github: 'https://github.com/Nodzimo',
    website: 'https://Nodzimo.com',
} as const

type SocialLinkName = keyof typeof SOCIAL_LINKS
type SocialLinkHref = (typeof SOCIAL_LINKS)[SocialLinkName]
```

For runtime APIs that widen keys, cast narrowly after the literal object is declared:

```ts
const SOCIAL_LINK_NAMES = Object.keys(SOCIAL_LINKS) as SocialLinkName[]
```

Do not rename every module-scope `const` to `UPPER_SNAKE_CASE`. A `const` binding only prevents rebinding; it does not
make the referenced value immutable. Keep camelCase for mutable objects, class instances, framework descriptors, or
values returned from factory/runtime functions unless the returned value is explicitly frozen or readonly and local
conventions already treat that exact kind of value as a constant.

Examples that should usually stay camelCase:

```ts
const ibmPlexSans = IBM_Plex_Sans({
    subsets: ['latin'],
    variable: '--app-font-sans',
})

const searchParams = new URLSearchParams()
const formatter = new Intl.NumberFormat('en')
```

These are module-scope values, but they are not literal immutable tables or defaults. For framework factory functions
such as `next/font`, preserve the framework's idiomatic camelCase names unless the project has an explicit local rule
for that API.

## Declaration Spacing Policy

Use blank lines to separate multiline declarations from neighboring declarations. Single-line declarations that are
closely related may be grouped together, but a multiline array, object, function, or expression should not visually
stick to a one-line constant above or below it.

Good:

```ts
const basePath = '/'
const {locale, namespace} = input

const navigationItems = [
    'home',
    'projects',
    'contact',
]

function getNavigationHref(item: NavigationItem) {
    return `${basePath}${item}`
}
```

Avoid:

```ts
const basePath = '/'
const {locale, namespace} = input
const navigationItems = [
    'home',
    'projects',
    'contact',
]

function getNavigationHref(item: NavigationItem) {
    return `${basePath}${item}`
}
```

This is a readability convention, not a request for decorative spacing everywhere. Do not add blank lines between every
small local binding. Use the rule when a multiline declaration creates a visual block that should be scanned as its own
unit.

## Tailwind Class Lists

When long Tailwind class strings hurt scanning or diffs, use the `tailwind-class-formatter` skill. Do not duplicate that
skill's grouping rules here.

After applying it, verify that class tokens match before and after formatting when practical. Formatting must not add,
remove, rename, or "fix" classes.

## Workflow

1. Inspect the changed files and identify which conventions apply.
2. Run or rely on Biome for its owned mechanical checks before spending review time on local conventions.
3. Apply safe fixes only when the local intent is clear.
4. For long Tailwind class lists, invoke `tailwind-class-formatter` and preserve class tokens exactly.
5. For type/interface decisions, fix only obvious mismatches; otherwise report the candidate with the tradeoff.
6. Leave raw SVG, raw HTML, MDX, CSS, and generated output alone unless the task explicitly targets those files.
7. Run the smallest relevant verification:
    - `bunx biome check <changed-files>` for style-only changes.
    - `bun run type:check` after TypeScript type-shape, route, component, or exported type changes.
    - Tailwind class-token comparison when class-list formatting changed.
8. Summarize changed conventions and any review-only findings.

## Review Checklist

- JSX string literal props in hand-authored TSX use `{...}` expression containers.
- Boolean shorthand remains shorthand when appropriate.
- Destructured remainder names use `restProps`, `restArgs`, or `restParams`.
- Module-scope immutable literal tables use `UPPER_SNAKE_CASE`; mutable objects and factory return values stay
  camelCase.
- Literal option arrays and mappings use `as const` when deriving unions.
- `satisfies` validates external contracts without widening literal values.
- `type` and `interface` choices reflect TypeScript semantics, not preference.
- Long Tailwind class lists have been delegated to `tailwind-class-formatter`.
- `.ts` files do not contain JSX, and `.tsx` files are used when JSX is present.
- TypeScript source imports omit `.ts` and `.tsx` extensions.
- Export style matches file shape: direct exports for small leaf modules, grouped export blocks for compound modules,
  default exports only for framework convention files.
- Multiline declarations are visually separated from adjacent single-line declarations when needed for scanning.
- Raw SVG/HTML quote churn was not introduced.
- Biome and TypeScript verification passed where relevant.
