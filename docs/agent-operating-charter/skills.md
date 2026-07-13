# Skills

Keep skills procedural. Durable project rules belong in `docs/agent-operating-charter`, detailed skill-specific
references belong in skill
`references`, and repeatable checks belong in skill `scripts`. Do not duplicate large project rules inside `SKILL.md`;
when removing duplicated skill text, first verify that any unique project fact is preserved in the proper source of
truth.

- For next-intl message translation, synchronization, or validation, use the project-local `next-intl-localizer` skill
  at `.agents/skills/next-intl-localizer`.
- For pre-update dependency research from `bun outdated`, post-update changelog review, breaking-change triage, or
  deciding whether upgraded packages need local code/config changes, use the project-local
  `dependency-update-reviewer` skill at `.agents/skills/dependency-update-reviewer`.
- For choosing or debugging Next rendering modes, RSC/SSR/client boundaries, route static/dynamic behavior, Suspense
  streaming, or build failures involving `createContext`, hooks, or third-party packages, use the project-local
  `next-rendering-diagnostics` skill at `.agents/skills/next-rendering-diagnostics`.
- For formatting long Tailwind class strings into readable grouped chunks without changing the styles, use the
  project-local `tailwind-class-formatter` skill at `.agents/skills/tailwind-class-formatter`.
- For final project convention review and safe fixes beyond Biome, including JSX literal braces, rest-prop naming,
  type-vs-interface choices, literal table typing, module constant naming, file extension/import/export style checks,
  readable declaration spacing, and orchestration of Tailwind class formatting, use the project-local
  `code-style-reviewer` skill at `.agents/skills/code-style-reviewer`.
