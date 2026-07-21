# Repository Backlog

This file defines how unresolved work should be preserved in this repository.

The target model is:

```text
unresolved concern -> accepted record -> explicit next step -> resolution
```

## Purpose

The backlog is the versioned source of truth for accepted repository work that must survive the current work session. It
covers deferred improvements, known bugs, research, ideas, upstream dependencies, and temporary workarounds that still
require an action, decision, or verification.

It does not replace permanent documentation, agent instructions, an execution plan for current work, or Git history. It
is not an autonomous queue that an agent may execute without a request.

Keep one independently resolvable concern in each Markdown file. When backlog work is in scope, read this contract and
only the records needed for the task. Inspect the full directory only for an explicit triage, audit, or cleanup request.

## Admission

Create a record only when:

- the concern belongs to this repository and is expected to remain unresolved beyond the current session;
- enough context exists to state a useful outcome and next step;
- forgetting it would create meaningful rework, risk, or a permanent temporary workaround.

A concern becomes accepted backlog work only when a responsible maintainer asks to record it or approves a proposal.
Coding agents may propose concerns, but must not silently add them while performing unrelated work. A `ready` record is
actionable, not pre-authorized for execution.

Do not record vague aspirations, incidental observations, chat transcripts, activity journals, completed work, or notes
that will be resolved in the current session. Move durable knowledge to project documentation, recurring agent guidance
to `AGENTS.md`, and reusable procedures to `.agents/skills`.

## Record Format

Keep records directly under `backlog/`. Use a short, stable, descriptive kebab-case filename such as
`verify-upstream-fix.md`. Do not encode status, priority, dates, or numeric IDs in the filename.

Status is the only metadata required for every record:

```markdown
---
status: ready
---

# Describe the desired outcome

## Context

Explain the current state, why it matters, and any temporary behavior that must be preserved.

## Outcome

Describe the observable conditions that make the work complete.

## Next step

State the smallest concrete action that moves the record forward.
```

The title, `Context`, `Outcome`, and `Next step` are required. Add `References` when primary upstream sources, issues,
or repository files would help verify or resume the work. Add `Current workaround`, `Resume when`, or `Unblock when`
only when needed.

Keep the record concise and current. Replace superseded assumptions and next steps instead of appending a chronological
diary; Git preserves the history.

## Status

Use exactly one status:

- `ready`: the next step can be taken with the available information;
- `waiting`: progress depends on an external release, issue, date, or other observable event;
- `blocked`: progress requires an unavailable internal decision, prerequisite, access, or information.

A `waiting` record must include `review_after: YYYY-MM-DD` in its front matter and a `Resume when` section naming the
external trigger. The date schedules a review, not automatic execution. When the review date arrives, check the trigger.
If it has occurred, proceed with the record; otherwise, set a new evidence-based review date.

A `blocked` record must include an `Unblock when` section naming the missing decision or prerequisite. Do not use
`blocked` merely because work is difficult or low priority.

There is no `active` status. Current execution state belongs to the active branch, working tree, issue, conversation, or
execution plan. If work stops before completion, update the record so another session can resume it accurately.

## Lifecycle

1. Capture the accepted concern with its current context, observable outcome, and smallest useful next step.
2. Update the record when evidence, a workaround, status, or the next step materially changes.
3. Begin implementation only when a maintainer explicitly selects the record. Once selected, maintaining it through
   completion is part of the task unless the maintainer says otherwise.
4. On completion, move durable conclusions into code, tests, permanent documentation, or a decision record.
5. Delete the backlog file in the same change that completes or deliberately abandons the work.

Do not keep a completed archive. Git records the outcome; state a non-obvious completion or rejection reason in the
commit or pull request.

## Maintenance

Review the backlog when capturing work, selecting the next record, checking due waiting records, or cleaning stale
state. Remove obsolete records, repair unclear outcomes or next steps, and split records that contain multiple
independently resolvable concerns.

Add priority, classification, ownership, estimates, indexes, additional directories, or automation only after observed
scale or recurring friction demonstrates the need.
