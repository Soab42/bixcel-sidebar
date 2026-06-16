# `@soab42/dashboard-sidebar` — Cleanup + Hybrid Footer

**Status:** Proposal / migration spec
**Targets:** next major (`2.0.0`) for the breaking pieces, additive `1.x` for the footer
**Audience:** package maintainers + the two consumer apps (`bixcel-dealer-others-fe`, `bixcel-frontend`)

This document describes (A) how the package works **today**, (B) the **cleanup**
that removes dead weight and fixes the RSC-import bug, and (C) a **hybrid footer
model** so the footer is built inside the package by default but can still be
overridden from the outside.

---

## A. Current flows (as-is)

### A.1 Consumers

The package is consumed by exactly two apps today:

| App | Runtime imports | Type imports | Footer |
|---|---|---|---|
| `bixcel-dealer-others-fe` (admin, API-driven) | `DashboardSidebar`, `DashboardHeader`, `SidebarIcon`, `cleanHref` | `DashboardHeaderProps`, `SidebarConfig`, `SidebarConfigInput`, `MenuCountMap`, `SidebarMenuItem`, `IconDescriptor`, `AppUrlResolver` | built outside, passed via `footerSlot` |
| `bixcel-frontend` (CRM, static config) | `DashboardSidebar`, `cleanHref` | `SidebarConfig`, `MenuCountMap`, `SidebarMenuItem` | built outside, passed via `footerSlot` |

The **union of runtime exports anyone imports is just four**:
`DashboardSidebar`, `DashboardHeader`, `SidebarIcon`, `cleanHref`. The barrel
currently exports **18** runtime symbols.

### A.2 Import / RSC flow

Every component file (`DashboardSidebar`, `SidebarItem`, `SidebarGroup`,
`SidebarIcon`, `SidebarCollapseButton`, `DashboardHeader`, `linkContext`) starts
with `"use client"`. The pure modules (`utils.ts`, `schema.ts`, `types.ts`) do
not — they are server-safe in source.

**But the build is a single entry:**

```
tsup src/index.ts --format esm,cjs --dts --external react
```

`tsup` flattens all modules into one `dist/index.mjs` and **drops every per-file
`"use client"` directive** (the built bundle's first line is `// src/DashboardHeader.tsx`,
with zero `"use client"` banners). `linkContext`'s `createContext(...)` therefore
runs at **module scope in a server-eligible bundle**, so importing *anything* from
the package into a React Server Component throws:

> Error: createContext only works in Client Components.

This is why `bixcel-dealer-others-fe/src/lib/sidebar-config.ts` cannot import the
package's `safeParseSidebarConfig` and re-implements a shallow guard locally,
using a **type-only** import to stay server-safe.

### A.3 CSS contract (implicit)

The package's `SidebarItem`/`SidebarGroup` render with the class
`sidebar_nav_link`, but that class is **not shipped by the package** — it is
defined in each consumer's `globals.css` (e.g.
`bixcel-dealer-others-fe/src/app/globals.css` via Tailwind `@apply`). The package
assumes the host app provides `.sidebar_nav_link`. Any footer the package renders
must follow the same contract.

### A.4 Footer flow

`DashboardSidebar` accepts a single `footerSlot?: ReactNode`. When present it is
wrapped in a pinned, bordered `<div><ul>…</ul></div>` (all spacing/border classes
owned by the package) and anchored to the bottom; when absent, no footer renders.

The consumer builds the **entire** footer content as bare `<li>` elements and
must know the package's internal markup conventions (`<ul>` wrapper supplied by
the package, `<li>` + `.sidebar_nav_link` supplied by the consumer). Example from
`bixcel-dealer-others-fe`:

```tsx
const footerSlot = (
  <>
    {role !== "client" && <li><Link className="sidebar_nav_link" …>Resources</Link></li>}
    {role === "broker" && <li><button className="sidebar_nav_link" …>Live Chat</button></li>}
    <li><Suspense …><LogoutButton token={token} /></Suspense></li>
  </>
);
```

Both apps duplicate the Resources / Support / Logout pattern with slightly
different role rules. That duplication is what the hybrid model removes.

### A.5 Cross-app link flow (legacy)

`resolveItemLink(item, currentApp, appUrlResolver)` composes an absolute URL for
`app`-type links pointing at a *different* app, falling back to the raw `href`
when no resolver is given. This is **dead** in both consumers:

- `bixcel-dealer-others-fe` passes a **no-op** `appUrlResolver` (`return href`)
  and never sets `linkType: "app"` / `targetApp` — the backend now absolutises
  cross-origin hrefs server-side from the item's `origin` and the caller `?domain=`.
- `bixcel-frontend` never passes `appUrlResolver` at all.

### A.6 Dependencies

```jsonc
"dependencies": {
  "clsx": "^2.1.0",          // ← never imported (cn is hand-rolled)
  "lucide-react": "^0.383.0", // ← 4 chevron icons only
  "tailwind-merge": "^2.3.0", // ← never imported
  "zod": "^3.23.0"            // ← only schema.ts, used by no consumer
}
```

---

## B. Cleanup changes

### B.1 Drop phantom dependencies (safe, immediate)

`cn` is hand-rolled in `utils.ts`:

```ts
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
```

`clsx` and `tailwind-merge` are imported **nowhere** in `src` (verified in both
build outputs). Remove both from `dependencies`. No behavior change.

### B.2 Remove `zod` + `schema.ts` (safe — unused by all consumers)

`./schema` is re-exported by the barrel but imported by **no internal module**,
and no consumer imports `BixcelRoleSchema`, `SidebarMenuItemSchema`,
`SidebarConfigSchema`, `validateSidebarConfig`, or `safeParseSidebarConfig`. The
nav tree is API-driven and validated server-side. Delete `schema.ts` and drop the
`zod` dependency. (If runtime validation is ever wanted again, reintroduce it on
the server-safe `/core` entry from B.4 so it never pulls into the client graph.)

### B.3 Trim dead / over-exposed exports

- **`OnRefreshCounts`** — exported, referenced by no prop or function. Delete.
- **`SidebarItem`, `SidebarGroup`, `SidebarCollapseButton`** (and their `*Props`
  types) — internal render pieces of `DashboardSidebar`, imported by no consumer.
  Keep the files; **un-export** them from the barrel.
- **`isRouteActive`, `isParentRouteActive`, `isItemVisible`, `filterMenuItems`,
  `resolveItemLink`, `cn`** — used internally, imported by no consumer. Keep them
  in `utils.ts`; move to the `/core` entry (B.4) instead of the default barrel.

Target public surface after trimming: `DashboardSidebar`, `DashboardHeader`,
`SidebarIcon`, `cleanHref` + the types the two apps use.

### B.4 Fix the RSC build (the important one)

Split the build so per-file client boundaries survive and pure helpers are
server-importable.

1. Add a server-safe entry `src/core.ts` exporting only pure modules:
   `cleanHref`, `isRouteActive`, `isParentRouteActive`, `isItemVisible`,
   `filterMenuItems`, `resolveItemLink`, `cn`, and the shared types.
2. Keep `src/index.ts` for the client components and add a `"use client"` banner
   to that bundle.
3. Multi-entry build + preserve directives:

```jsonc
// package.json
"exports": {
  ".":      { "types": "./dist/index.d.ts", "import": "./dist/index.mjs", "require": "./dist/index.js" },
  "./core": { "types": "./dist/core.d.ts",  "import": "./dist/core.mjs",  "require": "./dist/core.js" }
},
"scripts": {
  "build": "tsup src/index.ts src/core.ts --format esm,cjs --dts --external react"
}
```

```ts
// tsup.config.ts
import { defineConfig } from "tsup";
export default defineConfig({
  entry: ["src/index.ts", "src/core.ts"],
  format: ["esm", "cjs"],
  dts: true,
  external: ["react", "react-dom", "next"],
  esbuildOptions(o) { o.banner = { js: '"use client";' }; }, // index entry only — see note
});
```

> Note: apply the `"use client"` banner to the **client** entry only. If your
> bundler can't scope the banner per-entry, keep two configs or post-process so
> `core.*` ships **without** the directive (it must stay server-safe).

After this, RSC code imports from `@soab42/dashboard-sidebar/core` and the local
`safeParseSidebarConfig`/helper re-implementations in the consumers can be deleted.

### B.5 Remove the legacy cross-app machinery (optional, breaking)

If you've fully committed to backend absolutisation, delete the dead client-side
cross-app path: `appUrlResolver`, `AppUrlResolver`, `CurrentAppContext`,
`SidebarTargetApp`, the `targetApp` field on `SidebarMenuItem`, and the `app`
branch in `resolveItemLink`. **Pre-req:** confirm cross-origin items arrive marked
`external` (or `isExternal`) so they render as full-page `<a>` rather than a Next
`<Link>` to another origin. Defer this if any roadmap item still needs in-app
cross-app resolution.

---

## C. Hybrid footer model

### C.1 Goal

> "Wrap the footer into the package rather than build it from outside. Make it
> hybrid: if a slot is passed, use it; if not, the package builds it."

Move the Resources / Support / Logout footer **into** `DashboardSidebar`, driven
by declarative config, while keeping a full escape hatch. Each piece is
independently *override-or-default*.

### C.2 Precedence (the "if passes do it, else do it" rule)

Resolved top-down, first match wins:

| Condition | Result |
|---|---|
| `footerSlot` provided | Render `footerSlot` verbatim (today's behavior — full custom). |
| `footer` config provided | Package builds the footer from config (default markup + role rules). |
| neither | No footer (unchanged). |

Within `footer` config, each entry is itself hybrid: pass a custom `node` to
override that one row, pass options to get the package default, or `false`/omit
to hide it.

### C.3 Proposed API

```ts
import type { ReactNode } from "react";

/** One footer row: a link, a button, or a fully custom node. */
type SidebarFooterEntry =
  | { type: "link"; label: string; href: string; icon?: ReactNode;
      activeMatch?: string;            // pathname prefix → active styling
      visibleForRoles?: string[];      // omit = all roles
      hiddenForRoles?: string[]; }
  | { type: "action"; label: string; icon?: ReactNode; onClick: () => void;
      visibleForRoles?: string[]; hiddenForRoles?: string[]; }
  | { type: "node"; node: ReactNode; }; // escape hatch for one row (e.g. <LogoutButton/>)

interface SidebarFooterConfig {
  /** Ordered rows. Each renders as a package-owned <li> using .sidebar_nav_link. */
  entries: SidebarFooterEntry[];
}

interface DashboardSidebarProps {
  // …existing…
  /** Full custom footer. Highest precedence — bypasses `footer`. */
  footerSlot?: ReactNode;
  /** Declarative footer the package renders itself. Used when `footerSlot` is absent. */
  footer?: SidebarFooterConfig;
}
```

Role filtering reuses the existing `user.role` already passed to the sidebar, so
the consumer stops re-deriving `role !== "client"` style rules by hand. Logout
stays a `node` entry because auth (token, `LogoutButton`, `<Suspense>`) is
app-specific and must not move into the package.

### C.4 Rendering

The package keeps ownership of the pinned wrapper (`<div>` + `<ul>` + borders +
responsive spacing — unchanged from A.4) and, in `footer`-config mode, renders
each entry as an `<li>` with `.sidebar_nav_link`, applying `activeMatch` against
the current `pathname`. CSS contract from A.3 is unchanged: the host app still
provides `.sidebar_nav_link`.

```tsx
// inside DashboardSidebar, replacing the `footerSlot && (…)` block
const footerContent =
  footerSlot ?? (footer ? <FooterFromConfig footer={footer} user={user} pathname={pathname} /> : null);

{footerContent && (
  <div className={cn(/* …existing pinned wrapper classes… */)}>
    {footerSlot ? <ul className={/* …existing ul classes… */}>{footerSlot}</ul>
                : footerContent /* FooterFromConfig renders its own <ul> */}
  </div>
)}
```

> Keep the `<ul>` wrapper semantics identical in both modes so existing
> `footerSlot` callers (bare `<li>` children) render exactly as before.

### C.5 Consumer after (declarative)

`bixcel-dealer-others-fe` footer becomes data, not markup:

```tsx
<DashboardSidebar
  config={configWithIcons}
  user={{ userId, role, enabledFeatures }}
  counts={counts}
  onHover={handleHover}
  footer={{
    entries: [
      { type: "link", label: "Resources", href: "/dashboard/resources",
        icon: <IconMenuResources />, activeMatch: "/dashboard/resources",
        hiddenForRoles: ["client"] },
      { type: "action", label: "Live Chat", icon: <IconMenuSupport />,
        onClick: handleOpenIntercom, visibleForRoles: ["broker"] },
      { type: "node", node: <Suspense fallback={<div className="sidebar_nav_link">Loading…</div>}>
                              <LogoutButton token={token} /></Suspense> },
    ],
  }}
/>
```

Apps that need something the config can't express keep using `footerSlot` —
nothing breaks.

---

## D. Consumer migration checklist

**`bixcel-dealer-others-fe`**
1. After B.4: import pure helpers from `@soab42/dashboard-sidebar/core`; delete the
   local `safeParseSidebarConfig` re-implementation in `src/lib/sidebar-config.ts`.
2. Remove the no-op `appUrlResolver` (and its import + the `appUrlResolver={…}`
   prop). Drop `currentApp` too if B.5 lands.
3. Move the `footerSlot` JSX to a `footer={{ entries: […] }}` config (C.5).

**`bixcel-frontend` (CRM)**
1. After B.4: same `/core` import swap if it does any server-side validation.
2. Convert its hand-built `footerSlot` to `footer` config (or leave as-is — the
   slot still works).
3. No `appUrlResolver` change needed (never used it).

---

## E. Versioning

- **`2.0.0`** (breaking): single→multi entry + `"use client"` banner (B.4),
  removed exports (B.3), dropped `zod`/`schema` (B.2), and — if taken — the
  cross-app removal (B.5).
- Phantom-dep removal (B.1) is non-breaking but ship it in the same major.
- The hybrid footer (C) is **additive** — `footerSlot` is untouched — so it can
  land in a `1.x` minor *or* fold into `2.0.0`.

Update `CHANGELOG.md` under a new version heading; call out the `/core` entry and
the removed exports explicitly as **BREAKING**, and the `footer` prop as **Added**.

---

## Appendix — export disposition

| Export | Today | After |
|---|---|---|
| `DashboardSidebar`, `DashboardHeader`, `SidebarIcon` | barrel | barrel (client) |
| `cleanHref` | barrel | **`/core`** |
| `isRouteActive`, `isParentRouteActive`, `isItemVisible`, `filterMenuItems`, `resolveItemLink`, `cn` | barrel | **`/core`** (or internal) |
| `SidebarItem`, `SidebarGroup`, `SidebarCollapseButton` (+ `*Props`) | barrel | **internal** (un-exported) |
| `BixcelRoleSchema`, `SidebarMenuItemSchema`, `SidebarConfigSchema`, `validateSidebarConfig`, `safeParseSidebarConfig` | barrel | **removed** |
| `OnRefreshCounts` | barrel | **removed** |
| `AppUrlResolver`, `CurrentAppContext`, `SidebarTargetApp` | barrel | **removed** (B.5) |
| `clsx`, `tailwind-merge`, `zod` deps | present | **removed** |
| `lucide-react` dep | present | kept (or inline 4 chevrons → removed) |
