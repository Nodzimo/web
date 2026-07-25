# Next Rendering Model

- Read the installed Next docs under `node_modules/next/dist/docs/` before changing rendering behavior. This project is
  on Next 16, and old App Router assumptions may be wrong.
- Pages and layouts are Server Components by default. Use them for data access, metadata, locale setup, static shell
  rendering, streaming, and keeping JavaScript out of the browser bundle.
- React Server Components (RSC) are the server component graph and payload layer. RSC decides what can run only on the
  server, what data is passed to client islands, and what JavaScript can be omitted from the browser bundle.
- Server-side rendering (SSR) is the HTML render pass. It turns the RSC payload plus Client Component references into
  initial HTML for first load, SSG output, or request-time responses.
- In App Router, RSC and SSR usually work together: RSC builds the server/client component tree, then SSR/prerendering
  produces HTML from that tree. Do not treat them as mutually exclusive page modes.
- RSC is stricter because its output must be serializable across the server/client boundary and must not depend on
  per-browser runtime state. It uses React's `react-server` condition and cannot use React context APIs such as
  `createContext`/`useContext`, state/effect hooks, event handlers, or browser APIs.
- SSR can render many ordinary React components on the server with APIs such as `createContext`, `forwardRef`, and
  `createElement`, but SSR compatibility does not prove RSC compatibility. A package can be fine in the HTML render pass
  and still fail if imported into the RSC graph.
- Use RSC when the work is about data, routing, locale, metadata, server-only secrets, static structure, or reducing
  client JavaScript. Think "server-owned component tree and data boundary".
- Think of SSR as delivery of HTML, not as the place to put interactivity. SSR improves first paint and crawlers/users
  seeing content before hydration, but any interactive behavior still needs Client Components.
- Client Components start at a `'use client'` boundary. Use them only for state, effects, event handlers, browser APIs,
  custom client hooks, and third-party widgets that are not RSC-safe. Keep the boundary as deep and narrow as possible.
- A Server Component may render a Client Component. The route can still remain static/SSG if it does not use
  request-time APIs or uncached runtime data.
- React-serializable props are broader than plain JSON. A Server Component may instantiate an RSC-safe component and
  pass the resulting React element or rendered node to a Client Component through `children` or another renderable prop.
  The client receives rendered output through the RSC payload; this does not pull the source component into the client
  module graph or make the route dynamic.
- Distinguish a component reference such as `FlagIcon: ComponentType<...>` from an already-created element such as
  `icon: <FlagIcon />`. Do not pass an ordinary component function across the RSC boundary. When the server owns
  localized option data and the client only needs to display the icon, instantiate it on the server and type the field
  as `ReactElement`.
- Do not introduce a second client-side locale-to-icon mapping solely to avoid passing rendered elements. Keep one
  server-owned option model when the relevant icon entrypoint is RSC-safe and the Client Component only renders the
  prepared nodes.
- Static/SSG output means the route was pre-rendered at build time. It is the expected default for this small localized
  site and gives fast HTML, cacheable output, and less runtime server work.
- Dynamic rendering is for route output that must depend on request-time data such as `headers()`, `cookies()`,
  `searchParams`, auth/session state, geolocation, uncached fetches, or explicitly request-bound values through
  `connection()`.
- `searchParams` is request-time data and opts the page into dynamic rendering. Avoid it in pages intended to stay SSG;
  prefer static params, localized path segments, or client-side query handling when the content can remain static.
- Use `<Suspense>` close to slow or uncached data so stable page chrome can render or stream independently. A
  segment-level `loading.tsx` wraps the page below it, but uncached/runtime work in a layout can still block navigation.
- Providers should be rendered as deep as possible. Do not wrap the entire document with client providers unless the
  whole tree genuinely needs that provider; this helps Next optimize static Server Component regions.
- When adding third-party UI packages, first decide whether they are imported from a Server Component or behind a client
  boundary. If a package needs hooks, context, effects, event handlers, or browser APIs and does not provide a correct
  `'use client'` entry, wrap it in a local Client Component.
- A build error like `TypeError: createContext is not a function` during page data collection usually means an RSC graph
  imported code that expects ordinary/client React. First inspect the importing route, UI-kit package entrypoint,
  third-party package boundary, and compiled `.next/server/chunks` before changing app architecture.
