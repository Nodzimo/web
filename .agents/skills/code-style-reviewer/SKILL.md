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

Before reviewing, read:

- `docs/agent-operating-charter/code-style-conventions.md`
- `docs/agent-operating-charter/biome-policy.md`
- `docs/agent-operating-charter/styling.md` when Tailwind class naming or WebStorm class detection is involved
- `docs/agent-operating-charter/exports.md` when export style is involved

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

## Tailwind Class Lists

Use `class`, `className`, `classNames`, `classes`, and `*_CLASSES` naming for values that contain Tailwind class
strings, including string constants, arrays, and object tables. Reserve `style` and `styles` naming for inline style
objects, `CSSProperties`, and other non-Tailwind style declarations.

The shared WebStorm Tailwind `experimental.classRegex` convention should stay scoped to variable declarations whose
names contain class/className/classNames/classes/CLASSES. Do not broaden it to `styles`; JSX `className` attributes are
already handled by Tailwind's normal class-attribute support. The project regex convention is adapted from the
practical examples in <https://github.com/codewithhridoy/tailwind-autosuggestion-for-custom-classes>.

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
    - `bun run check:lint` or `bunx biome check <changed-files>` for style-only changes.
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
