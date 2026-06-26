# Agent Context Economy

This file defines how Codex should spend context in this project.

The target mode is:

```text
enough context to be correct, not enough context to drown
```

The best workflow is not a giant prompt. It is a clear task, a strong local project charter, narrow reading by default,
and deliberate expansion only when the work genuinely needs it.

This file is meant to be copied into each standalone repository that wants the same Codex working style. Do not depend
on a parent-folder `AGENTS.md` for this rule unless the projects are intentionally managed as one workspace.

## Core Contract

Default to:

```text
goal -> scope -> source of truth -> focused work -> relevant verification -> short answer
```

Use small context for ordinary implementation, bug fixes, reviews, and routine docs.

Use large context for architecture, incidents, migrations, dependency upgrades, package/API boundaries,
cross-project compatibility, and documentation-system audits.

Think deeply when needed. Report briefly unless the user asks for a long analysis.

If Codex repeats the same mistake twice, do a short retrospective and update the durable project guidance instead of
solving the same problem again in chat.

## Start Every Task

Before working, establish:

- what the user wants;
- which project area is affected;
- which file or document is the source of truth;
- what should stay untouched.

If the request is a question, architecture discussion, or review, answer first. Do not edit files unless the user asks
for edits or the task clearly requires them.

## Reading Order

Read in layers:

1. `AGENTS.md`
2. the one linked charter, runbook, doctrine, or skill relevant to the task
3. directly affected source files
4. adjacent files only when required by imports, tests, or behavior
5. historical docs, references, generated output, evidence, or sibling projects only when the task needs that context

Do not read the whole repository, all docs, all skills, or all references by default.

When expanding context, state the reason:

```text
I need to inspect X because Y depends on it.
```

## Prompt Policy

Prompt packs are not needed.

Do not rely on "top 100 prompts", roleplay formulas, or long reusable prompt templates. They waste context and usually
hide the real task. Deprecated custom prompt files should not be the main reuse mechanism; use project instructions or
skills instead.

A strong prompt usually contains:

- goal: what should change or be answered;
- context: files, errors, docs, screenshots, or prior decisions that matter;
- constraints: what must be preserved or avoided;
- done when: how to know the task is complete.

Useful prompts are short and concrete:

```text
Analyze first. Do not edit yet.
```

```text
Implement the smallest safe fix and verify only what is relevant.
```

```text
Review this diff for bugs. Findings first.
```

```text
This is a broad audit. Spend context deliberately, then give a short action plan.
```

The user should provide the goal, constraints, and expected output. The project should provide the standing rules.

## Autonomy

Do without asking:

- read narrow relevant files;
- search for exact symbols, commands, errors, or filenames;
- make scoped edits requested by the user;
- run the smallest relevant verification;
- summarize command output instead of pasting logs.

Ask or pause before:

- changing architecture;
- broad rewrites;
- touching unrelated files;
- crossing into another sibling project;
- running expensive verification without clear value;
- destructive or hard-to-reverse operations.

## Documentation Routing

Use the smallest durable home for each rule:

- `AGENTS.md`: entrypoint, routing, and project-specific non-negotiable rules. Keep it short enough to load reliably.
- `docs/agent-operating-charter`: durable agent/project rules.
- domain docs: product, design, operations, runbooks, incidents, evidence.
- `.codex/skills`: repeatable procedures.
- skill `references`: long background loaded only when needed.
- skill `scripts`: repeatable mechanical work.
- Codex memories: optional local recall, never the only source for required project rules.

Do not duplicate the same rule across all layers. Link or route to the owner.

## Skill Standard

Create or use a skill only when it saves repeated reasoning.

Skills are good for context economy because Codex initially sees only skill names and descriptions, then loads the full
`SKILL.md` only when the skill is selected. This works only if descriptions are scoped and the selected skill is not
bloated.

A good skill has:

- trigger: when to use it;
- required reading: only the minimum starting context;
- procedure: what to do;
- verification/reporting: how to finish.

A skill should not be the project handbook. If it becomes long, move stable rules to charter docs, background to
`references`, and mechanics to `scripts`.

Prefer one focused skill over one universal skill. Disable implicit invocation for skills that are useful only when the
user explicitly asks for them.

## Verification

Run the cheapest check that can catch the likely failure.

Use full verification only for release, publish, deploy, dependency updates, package/API boundary changes, migrations,
or broad refactors.

If local verification is unavailable, unsafe, or not meaningful, say so plainly and describe the closest useful check.

## Output Contract

Default final answer:

```text
Changed: ...
Verified: ...
Notes: ...
```

For reviews:

```text
Findings.
Questions.
Summary.
```

For audits:

```text
Verdict.
Concrete changes.
Do not change.
Order of work.
```

Do not dump raw logs, broad reasoning, or long summaries unless exact output or deep analysis was requested.

## Chat Lifecycle

Prefer one task per chat.

When a task is complete, a decision is recorded, or the context becomes stale, recommend starting a new chat instead of
carrying old context forward.

## Performance Rule

The agent performs best with strict entry conditions and freedom inside the relevant scope:

```text
clear goal
clear boundaries
clear source of truth
permission to inspect what is relevant
short final answer
```

Do not starve the agent. Do not flood the agent. Route the agent.
