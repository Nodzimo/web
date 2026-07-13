---
name: next-rendering-diagnostics
description: Diagnose and guide Next.js 16 App Router rendering behavior in Nodzimo Web. Use when Codex needs to choose between Server Components, Client Components, SSG/static rendering, dynamic rendering, SSR, Suspense streaming, or debug build/runtime failures involving RSC boundaries, createContext/useContext, hooks, third-party packages, UI-kit imports, route table changes, request-time APIs, or unexpected dynamic routes.
---

# Next Rendering Diagnostics

## Overview

Use this skill for this Next 16 consumer app when a task touches rendering mode, App Router boundaries, static/dynamic
behavior, third-party package imports, or confusing build errors.

This skill is a diagnostic workflow. It should not replace the project rendering rules. Before changing behavior, read:

- `docs/agent-operating-charter/next-rendering-model.md`
- `docs/agent-operating-charter/next-intl-and-static-rendering.md` when localized routes, metadata, sitemap, loading, or
  not-found files
  are involved
- the relevant installed Next docs in `node_modules/next/dist/docs/`
- `references/rendering-model.md` when the task needs a detailed local model or boundary-debugging checklist

Keep the skill body focused on the steps to take. Keep durable rendering concepts in agent docs and the reference.

## Workflow

1. Identify the route and boundary.
    - Is the file a page/layout/loading/not-found/error/template or a normal component?
    - Is it inside `src/app/[locale]`, root `src/app`, or a client component tree?
    - Does it import from `@nodzimo/ui` or `@nodzimo/ui/client` correctly?

2. Classify the need.
    - Static content, locale setup, metadata, server data, or secrets: prefer Server Component and SSG/cache.
    - State, event handlers, browser APIs, custom client hooks, or unsafe third-party UI: use a Client Component
      boundary.
    - Request-time data such as `headers()`, `cookies()`, `searchParams`, uncached fetches, auth/session, or
      `connection()`: expect dynamic rendering unless the data is moved, cached, or handled on the client.

3. Preserve static rendering when intended.
    - In localized pages/layouts, keep `setRequestLocale` / `useStaticLocale(params)` before server `next-intl` APIs.
    - Avoid `searchParams` in pages that should remain SSG.
    - Keep providers deep and thin.

4. Diagnose boundary errors.
    - For `createContext is not a function`, `useState` in Server Component, or similar failures, inspect the import
      chain from the route through local components and package entrypoints.
    - Check whether a third-party package or UI-kit root import is being evaluated in the RSC graph.
    - Inspect `.next/server/chunks` only after reproducing with `bun run build`.

5. Verify.
    - Use `bun run type:check` for route/types.
    - Use `bun run build` when rendering mode, routing, metadata, providers, i18n, or App Router special files changed.
    - Watch the route table. Current localized routes should stay static/SSG unless dynamic rendering is intentional.
