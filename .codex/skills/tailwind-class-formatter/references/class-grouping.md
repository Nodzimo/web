# Tailwind Class Grouping

## Modifier Order

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
