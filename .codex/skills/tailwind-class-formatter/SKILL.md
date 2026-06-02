---
name: tailwind-class-formatter
description: Format long Tailwind class lists in Nodzimo Web React/TSX components into readable grouped chunks without changing visual behavior. Use when Codex is asked to clean up horizontal Tailwind className strings, split long className/clsx class lists, make copied Tailwind component styles readable, or apply the project's class grouping convention.
---

# Tailwind Class Formatter

## Overview

Use this skill to turn unreadable Tailwind class strings into maintainable grouped class chunks. The skill fills the
gap left by Biome and Tailwind: they can sort classes, but they do not split long class lists into readable project
groups.

This is a formatting and grouping skill only. It must preserve the exact style contract.

Before editing, read `docs/agent/styling.md` for project styling conventions and `docs/agent/biome-policy.md` for the
local Biome/Tailwind sorting policy.

## Non-Negotiable Safety Contract

- Do not add, remove, rename, replace, or "improve" Tailwind classes.
- Do not change arbitrary values, opacity suffixes, variants, modifiers, selectors, token names, or class spelling.
- Do not change component behavior, state handling, variants, DOM structure, accessibility semantics, route behavior, or
  public API.
- Do not move styles into helper objects, CSS files, or component variants only to shorten a class string.
- Do not introduce a new class merge helper just for formatting. Preserve the local mechanism already used by the file,
  such as `className`, template literals, or `clsx(...)`.
- Preserve external override order. Caller `className` must remain the last merge input when it was already last.
- If a class appears unsafe or suspicious, report it separately instead of editing it during formatting.

Before editing, treat the original class list as source-of-truth data. After editing, verify that every original class
still exists exactly once unless the original intentionally contained duplicates.

## When To Split

- Keep short readable class values inline.
- Split when a class list causes horizontal scrolling, contains several modifier families, or is hard to review in a
  diff.
- Prefer multiple static string arguments inside `clsx(...)` when the file already uses `clsx`.
- For plain JSX `className`, use a readable multiline expression only when it improves scanning without changing token
  visibility for Tailwind.
- Do not split into one utility per line. A line should represent a recognizable group.
- Do not chase equal line lengths. Optimize for quick scanning and cheap maintenance.

## Grouping Rule

Group first by visible Tailwind modifier or selector prefix. Inside unmodified base classes, group by obvious utility
families.

Use this order:

1. Base utilities without modifiers.
2. Pseudo and user states: `hover:*`, `focus:*`, `focus-visible:*`, `active:*`, `disabled:*`.
3. ARIA states: `aria-*:*`.
4. Data-family states: `data-*:*`, `has-data-*:*`, `in-data-*:*`, `not-data-*:*`.
5. Theme, media, and context modifiers: `dark:*`, `rtl:*`, `motion-*:*`, responsive modifiers such as `sm:*` and
   `md:*`.
6. Descendant relation selectors: `*:data-*:*`, `group-*:*`, `peer-*:*`.
7. Arbitrary descendant selectors: `[&_svg]:*`, `[&>span]:*`, `[&_[data-slot=x]]:*`, and similar bracket selectors.
8. External override input such as `className`.

If one modifier family grows too large, split it by the same visible prefix: one line for `focus-visible:*`, one line
for `disabled:*`, one line for `dark:hover:*`, etc.

## Base Utility Families

For base utilities without modifiers, use these recognizable families:

- Layout and sizing: `flex`, `grid`, `block`, `inline-*`, `relative`, `absolute`, `items-*`, `justify-*`, `overflow-*`,
  `w-*`, `h-*`, `size-*`, `min-*`, `max-*`.
- Spacing: `p-*`, `px-*`, `py-*`, `ps-*`, `pe-*`, `m-*`, `mx-*`, `my-*`, `ms-*`, `me-*`, `gap-*`, `space-*`.
- Text and content behavior: `text-*`, `font-*`, `leading-*`, `tracking-*`, `whitespace-*`, `line-clamp-*`,
  `truncate`, `select-*`.
- Shape and boundary: `rounded-*`, `border-*`, `outline-*`, `ring-*`, `divide-*`.
- Surface and motion: `bg-*`, `shadow-*`, `opacity-*`, `transition-*`, `duration-*`, `ease-*`, `animate-*`.
- Miscellaneous: classes that do not clearly fit another base family.

When a base family is tiny, it can share a line with a nearby family. Prefer obvious scanning to rigid taxonomy.

## Formatting Pattern

Good for existing `clsx(...)` usage:

```tsx
const triggerClassName = clsx(
    'flex min-h-10 w-full items-center justify-between',
    'gap-2 rounded-md border px-3 py-2',
    'text-sm shadow-sm transition-colors',
    'hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'data-[state=open]:bg-neutral-100',
    className,
)
```

Good for plain JSX when a multiline expression is clearer:

```tsx
<main
    className={
        'flex min-h-full flex-col items-center justify-center gap-6 px-4 py-10 text-center'
    }
>
    {children}
</main>
```

Avoid:

```tsx
<main
    className={'flex min-h-full flex-col items-center justify-center gap-6 px-4 py-10 text-center hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 data-[state=open]:bg-neutral-100'}>
    {children}
</main>
```

Also avoid introducing abstractions only as a line-break mechanism:

```ts
const styles = {
    main: '...',
}
```

Use helper objects only when the file already has a real variant or reuse model.

## Workflow

1. Identify long Tailwind class lists in `className`, `clsx`, template literals, or similar class composition calls.
2. Copy the original classes mentally as an immutable set. Do not reinterpret the design.
3. Split classes into the modifier groups and base utility families above.
4. Keep static class chunks as literal strings so Tailwind source scanning still sees them.
5. Keep caller `className` or override values last.
6. Run the smallest relevant verification, usually `bun run check:lint` or `bunx biome check <changed-file>`.
7. If the file already has automated class sorting, let Biome sort inside each string, then review that no class moved
   across a grouping boundary in a way that hurts readability.

## Review Checklist

- Every original class is still present with the same spelling.
- No new class was added.
- No class was silently "fixed" or adapted by this skill.
- Static Tailwind classes remain statically discoverable in string literals.
- Group boundaries follow visible prefixes first, then obvious base utility families.
- `className` remains last in merge calls.
- The result reduces horizontal scrolling and improves diff review.
