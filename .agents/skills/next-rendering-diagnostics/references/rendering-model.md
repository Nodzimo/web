# Next Rendering Model

## Table Of Contents

- Server Components And RSC
- Server-Side Rendering
- Client Components
- Static And SSG
- Dynamic Rendering
- Streaming And Suspense
- Choosing A Mode
- Boundary Debugging
- Project Checks

## Server Components And RSC

Pages and layouts are Server Components by default in the App Router. They are the right default for this project
because they can run server-side logic, fetch data close to the source, keep secrets out of the browser, generate
metadata, set locale state, and reduce client JavaScript.

React Server Components produce an RSC payload, not just HTML. That payload contains rendered Server Component output,
placeholders for Client Components, references to client JavaScript, and serializable props passed from server to
client.

The most useful mental model: RSC is the server-owned component tree and data boundary. It lets React/Next execute parts
of the component tree in a server-only environment and send a compact description of the result to the browser instead
of sending the implementation code for those components.

That gives RSC its main performance value:

- Less client JavaScript. Server Component implementation code, server-only helpers, database clients, Markdown parsers,
  metadata helpers, and many formatting/data utilities do not need to hydrate in the browser.
- Better data placement. Data can be fetched where the server component needs it without prop-drilling everything
  through client code.
- Better security boundaries. Secrets, tokens, server-only APIs, and database access stay on the server.
- Streamable component output. React can send the server-rendered tree and Client Component references progressively.
- Better composition. Server Components can render Client Components as islands and pass only serializable data to them.

RSC is not primarily "HTML rendering". It is the component/data protocol that tells Next what the server part of the
tree is and where client islands begin.

RSC uses React's `react-server` condition. This is stricter than ordinary server rendering. Do not use these in Server
Components:

- `createContext` / `useContext` providers in the server graph.
- `useState`, `useEffect`, and other client-side hooks.
- Event handlers such as `onClick` and `onChange`.
- Browser APIs such as `window`, `document`, `localStorage`, or geolocation.
- Third-party UI packages that require those APIs unless they are behind a client boundary.

Use Server Components for:

- Static route shells and content.
- `generateMetadata` and server metadata work.
- Locale setup with `setRequestLocale` / route-local helpers.
- Server-only data access, secrets, and database/API calls.
- Passing serializable data into small Client Components.

## Server-Side Rendering

SSR is the server HTML render pass. It can render ordinary React components on the server and may have APIs such as
`createContext`, `forwardRef`, `createElement`, and `useContext` available through normal React.

The most useful mental model: SSR is an HTML delivery mechanism. It gives the browser useful HTML before client
JavaScript hydrates. It is what improves first paint, crawler visibility, and no-JS/non-interactive previews.

In the App Router, SSR is usually not a separate alternative to RSC. The normal pipeline is:

1. The RSC graph renders Server Components into the RSC payload.
2. The payload includes rendered Server Component output plus placeholders/references for Client Components.
3. Next uses that payload and Client Component references to pre-render or stream HTML.
4. The browser receives HTML first, then the RSC payload and client JavaScript hydrate the client islands.

For SSG routes, this HTML render pass happens at build time. For dynamic routes, it happens per request. In both cases,
RSC still defines the server/client component graph.

SSR-safe is not the same as RSC-safe. A package may render fine during SSR but fail when its module top level is
imported
in the RSC graph. This is why `createContext is not a function` often points to an RSC boundary problem, not a generic
server-rendering problem.

Use SSR/prerendered HTML for:

- Fast first paint from real HTML instead of an empty client shell.
- SEO and link previews where content needs to exist in the response HTML.
- Static build output and CDN-friendly pages.
- Request-time HTML when the response truly depends on request data.

Do not use SSR as the reason to put interactive logic in a Server Component. Event handlers, browser state, effects, and
client context still belong behind a Client Component boundary.

## RSC Vs SSR In Practice

Use this distinction when reasoning about bugs and design:

- RSC answers: "Which parts of the React tree run on the server, what data crosses to the client, and what client
  JavaScript can be omitted?"
- SSR answers: "What HTML can we send now for first load, build output, or request-time response?"
- Client Components answer: "Which parts need browser runtime, event handlers, effects, or client state?"

Example: a localized marketing page can be a Server Component route. RSC lets translations, metadata helpers, and static
content render on the server without shipping those helpers to the browser. SSR/SSG turns that result into HTML at build
time. A small language selector can still be a Client Component island without making the whole page dynamic.

Example: a dashboard page that reads user cookies for personalized data is still built from RSC and Client Components,
but its HTML render pass is dynamic because the output depends on the incoming request.

Example: a third-party widget that uses `createContext` may render fine during SSR under normal React. If its package
entrypoint is imported directly into a Server Component RSC graph, it can fail before SSR happens because RSC uses
React's restricted `react-server` condition.

This is why "works in SSR" is not enough for imports used by pages/layouts. For direct Server Component imports, ask:
"Can this module be evaluated in the RSC graph?" If not, wrap it in a Client Component or use a package entrypoint that
declares the client boundary.

## Client Components

A Client Component starts at a top-level `'use client'` directive. Everything imported into that module's client graph
is
part of the client boundary.

Use Client Components for:

- Local state and event handlers.
- Effects and browser APIs.
- Custom client hooks.
- Third-party widgets that are not RSC-safe.
- Context providers.

Keep client boundaries as deep and narrow as practical. Prefer a Server Component page/layout that renders small Client
Components for interactive islands. This reduces client JavaScript and keeps static server-rendered regions optimizable.

Props passed from Server Components to Client Components must be serializable.

## Static And SSG

Static/SSG means the route can be rendered at build time. It is the preferred baseline for this app's current localized
content routes. It gives fast initial HTML, CDN-friendly output, less runtime server work, and predictable route tables.

SSG does not mean "no Client Components". A static page can include Client Components; Next pre-renders the HTML and
hydrates the client islands later.

SSG also does not prove that every dependency is RSC-pure. It only proves the route did not require dynamic runtime
rendering during the build.

In this project:

- `[locale]/layout.tsx` validates locale params and calls `setRequestLocale` through `setStaticLocaleFromParams`.
- Pages/layout children that receive params should call `useStaticLocale(params)` or the async helper before server
  `next-intl` APIs when static rendering matters.
- Build route table output should remain static/SSG for the current localized routes unless dynamic rendering is
  intentional.

## Dynamic Rendering

Dynamic rendering means the route depends on request-time information and must render at request time.

Common dynamic triggers:

- `headers()` or `cookies()`.
- Page `searchParams`.
- Auth/session or per-request personalization.
- Uncached fetches or runtime data that cannot be known at build time.
- `connection()` when a route intentionally waits for an incoming request before continuing.

Use dynamic rendering when the actual HTML must differ per request. Do not use it just to add local interactivity; use a
Client Component for that.

If a static page needs query-string-driven controls, prefer client-side query handling when the server HTML does not
need to change. If server HTML must depend on `searchParams`, expect dynamic rendering.

## Streaming And Suspense

Streaming lets stable parts of the route show while slower server work resolves.

Use `loading.tsx` for a route-segment fallback around the page below that segment. Use `<Suspense>` closer to slow or
uncached data for more precise control.

Important limitation: runtime or uncached data in a layout can block navigation before a same-segment `loading.tsx`
fallback can help. Move that work into the page or wrap the smaller async region in `<Suspense>` where possible.

## Choosing A Mode

Prefer this order:

1. Server Component + SSG/cache for static content, locale setup, metadata, and server data.
2. Server Component page with small Client Components for interactivity.
3. Server Component with `<Suspense>` around slow/uncached server regions when streaming improves UX.
4. Dynamic rendering only when request-time HTML is required.
5. Fully client-side rendering only for UI that fundamentally depends on browser state and does not need meaningful
   server HTML.

## Boundary Debugging

For `TypeError: createContext is not a function`, `useState`/`useEffect` Server Component errors, or similar build
failures:

1. Reproduce with `bun run build`.
2. Identify the route named in the build error.
3. Inspect the route's imports and route-local barrels.
4. Check whether imports come from `@nodzimo/ui` vs `@nodzimo/ui/client`.
5. Inspect third-party package boundaries. A package that uses context/hooks may need a local Client Component wrapper
   or a different import entrypoint.
6. Search built server chunks when the source chain is unclear:

```powershell
rg -n "createContext|useContext|useState|useEffect|@nodzimo/ui|lucide-react|@base-ui" .next\server\chunks .next\server\app
```

Interpretation:

- A failure during "Collecting page data" often means module evaluation failed while Next was preparing static output.
- A Client Component can appear in server manifests/chunks as a reference; that alone is not a bug.
- The problem is usually an unsafe module being evaluated in the RSC graph, or a package entrypoint missing the correct
  client boundary.

## Project Checks

- `bun run type:check`: route typegen and TypeScript.
- `bun run build`: required for routing/rendering/i18n/metadata/provider/App Router changes.
- `bun run project:audit`: non-build audit pass.
- `bun run project:verify`: install, audit, and production build before production-ready dependency or framework
  changes.

Watch the build route table. Expected output for current localized routes is static/SSG, not `ƒ Dynamic`, except
middleware/proxy.
