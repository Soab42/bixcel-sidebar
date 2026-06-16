# @soab42/dashboard-sidebar

Production-ready dashboard UI package for Bixcel SaaS apps. Ships the sidebar, header, and their types.

## What's included

- `DashboardSidebar` — config-driven, role-filtered sidebar
- `DashboardHeader` — fixed top nav bar with logo/left/right slots
- `SidebarIcon` — registry-driven icon renderer (`bundled` / `url` / `inline`)
- Full TypeScript types (`SidebarConfig`, `SidebarMenuItem`, `UserContext`, …)
- A server-safe `@soab42/dashboard-sidebar/core` entry for pure helpers + types

## Entry points

| Import | Contains | Safe in React Server Components? |
|---|---|---|
| `@soab42/dashboard-sidebar` | `DashboardSidebar`, `DashboardHeader`, `SidebarIcon` + types | No — client components (`"use client"`) |
| `@soab42/dashboard-sidebar/core` | `cleanHref`, `isRouteActive`, `isParentRouteActive`, `isItemVisible`, `filterMenuItems`, `resolveItemLink`, `cn` + types | Yes — no client boundary |

Import pure helpers and types from `/core` in server components; import the
components from the package root in client code.

## Installation

```bash
pnpm add @soab42/dashboard-sidebar
```

Peer dependencies:

```bash
pnpm add next react react-dom
```

---

## DashboardHeader

Fixed top navigation bar. All content injected as slots — no Next.js Image or auth imports inside the package.

```tsx
import { DashboardHeader } from "@soab42/dashboard-sidebar";

<DashboardHeader
  leftSlot={<BarButton />}
  logoSlot={
    <Link href="/">
      <Image
        src={logo}
        alt="Bixcel"
        className="w-10 md:w-11 3xl:w-20 fhd:w-24 2k:w-32 3k:w-40 4k:w-50"
      />
    </Link>
  }
  rightSlot={
    <>
      <DashboardNotification session={session} initialNotifications={data} />
      <UserAvatarDropdown />
    </>
  }
/>
```

### Props

| Prop | Type | Description |
|---|---|---|
| `leftSlot` | `ReactNode` | Left area — sidebar toggle button |
| `logoSlot` | `ReactNode` | Centre area — app icon / logo |
| `rightSlot` | `ReactNode` | Right area — notifications, avatar, etc. |
| `className` | `string` | Extra class on the outer `<header>` |

Responsive heights: `h-11` → `lg:h-14` → `3xl:h-20` → `fhd:h-24` → `2k:h-32` → `3k:h-40` → `4k:h-50`

---

## DashboardSidebar

Config-driven sidebar. Navigation config is fetched from your API and passed as a prop.

```tsx
import { DashboardSidebar } from "@soab42/dashboard-sidebar";
import type { SidebarConfig } from "@soab42/dashboard-sidebar";

// Fetch from API in your server component / action
const config: SidebarConfig = await getNavConfigAction();

<DashboardSidebar
  config={config}
  user={{
    userId: session.user.id,
    role: session.user.role,
    enabledFeatures: session.user.enabledFeatures,
  }}
  token={session.user.token}
  counts={menuCounts}
  onHover={prefetchRoute}
  footerSlot={<LogoutButton token={token} />}
/>
```

### Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `config` | `SidebarConfig` | ✓ | Navigation config from API |
| `user` | `UserContext` | ✓ | Authenticated user for role/feature filtering |
| `token` | `string` | — | Bearer token for count APIs |
| `counts` | `MenuCountMap` | — | Per-route counts for badges |
| `onHover` | `(href: string) => void` | — | Hover callback for prefetching |
| `footerSlot` | `ReactNode` | — | Footer content (logout, support, etc.) |
| `className` | `string` | — | Extra class on the outer element |

### Menu item filtering

Items are hidden when any of these conditions are true:

- `disabled: true`
- `requiredRoles` is set and `user.role` is not in the array
- `featureFlag` is set and `user.enabledFeatures` doesn't include the flag

---

## Server-safe helpers (`/core`)

Pure functions and types — importable from React Server Components:

```ts
import {
  cleanHref,
  isRouteActive,
  isParentRouteActive,
  isItemVisible,
  filterMenuItems,
  resolveItemLink,
  cn,
} from "@soab42/dashboard-sidebar/core";

// e.g. strip pagination params before a count-map lookup
const key = cleanHref("/dashboard/applications?status=open&page=2");
```

---

## Types

Types are re-exported from both entries — use `/core` in server code:

```ts
import type {
  SidebarConfig,
  SidebarMenuItem,
  SidebarConfigInput,
  UserContext,
  BixcelRole,
  MenuCountMap,
  DashboardSidebarProps,
  DashboardHeaderProps,
} from "@soab42/dashboard-sidebar/core";
```

---

## Accessibility

- `<nav aria-label="Main navigation">` landmark
- `aria-current="page"` on the active leaf link
- `aria-expanded` on collapsible groups
- `aria-disabled` on disabled items
- Full keyboard navigation (`Tab`, `Enter`, `Space`)

---

## Development

```bash
pnpm dev          # watch mode
pnpm typecheck    # TypeScript check
pnpm test         # unit tests
pnpm test:a11y    # accessibility tests
pnpm build        # production build
```
