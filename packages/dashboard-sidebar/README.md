# @soab42/dashboard-sidebar

Production-ready dashboard UI package for Bixcel SaaS apps. Includes the sidebar, header, types, and Zod validation — one import for everything.

## What's included

- `DashboardSidebar` — config-driven, role-filtered sidebar
- `DashboardHeader` — fixed top nav bar with logo/left/right slots
- `SidebarItem`, `SidebarGroup`, `SidebarCollapseButton` — composable primitives
- Full TypeScript types (`SidebarConfig`, `SidebarMenuItem`, `UserContext`, …)
- Zod schemas for validating API-sourced nav config

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

## Zod validation

Validate your API response before passing to the sidebar:

```ts
import { validateSidebarConfig, safeParseSidebarConfig } from "@soab42/dashboard-sidebar";

// Throws on invalid shape
const config = validateSidebarConfig(apiResponse);

// Returns { success, data | error }
const result = safeParseSidebarConfig(apiResponse);
if (!result.success) console.error(result.error);
```

---

## Types

```ts
import type {
  SidebarConfig,
  SidebarMenuItem,
  UserContext,
  BixcelRole,
  MenuCountMap,
  DashboardSidebarProps,
  DashboardHeaderProps,
} from "@soab42/dashboard-sidebar";
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
