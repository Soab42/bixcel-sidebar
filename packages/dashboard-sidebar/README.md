# @bixcel/dashboard-sidebar

Production-ready, config-driven sidebar UI package for Bixcel SaaS dashboard apps.

## Features

- Config-driven — no hardcoded routes or roles
- Role-based and feature-flag item filtering
- Collapsible groups with localStorage state persistence
- Active-route highlighting via `usePathname` + `?status=` param
- Count badges per route
- Hover callbacks for data prefetching
- Accessible: `<nav aria-label>`, `aria-current="page"`, `aria-expanded`, keyboard navigation
- Mobile drawer via shadcn `SidebarProvider`
- Responsive at Bixcel breakpoints: `md` → `lg` → `3xl` → `fhd` → `2k` → `3k` → `4k`
- Full TypeScript

## Installation

```bash
pnpm add @bixcel/dashboard-sidebar
```

Peer dependencies required in the consuming app:

```bash
pnpm add next react react-dom
```

## Quick Start

```tsx
// app/dashboard/layout.tsx
import { DashboardSidebar } from "@bixcel/dashboard-sidebar";
import { crmSidebarConfig } from "@bixcel/navigation-config";

export default function Layout({ children }) {
  const session = await auth();

  return (
    <SidebarProvider>
      <DashboardSidebar
        config={crmSidebarConfig}
        user={{
          userId: session.user.id,
          role: session.user.role,
          enabledFeatures: session.user.enabledFeatures,
        }}
        footerSlot={<LogoutButton token={session.user.token} />}
      />
      <main>{children}</main>
    </SidebarProvider>
  );
}
```

## Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `config` | `SidebarConfig` | ✓ | Navigation config from `@bixcel/navigation-config` |
| `user` | `UserContext` | ✓ | Authenticated user context for filtering |
| `token` | `string` | — | Bearer token passed to count APIs |
| `counts` | `MenuCountMap` | — | Per-route item counts for badges |
| `onHover` | `(href: string) => void` | — | Called on child link hover for prefetching |
| `footerSlot` | `ReactNode` | — | Footer content (logout, support, etc.) |
| `className` | `string` | — | Additional class on outer element |

## Menu Filtering

Items are filtered by:

1. **`disabled`** — hidden when `true`
2. **`requiredRoles`** — hidden when `user.role` is not in the array
3. **`featureFlag`** — hidden when `user.enabledFeatures` does not include the flag

All three rules must pass for an item to be visible.

## Accessibility

- `<nav aria-label="Main navigation">` landmark
- `aria-current="page"` on the active leaf link
- `aria-expanded` on collapsible parent buttons
- `aria-disabled` on disabled items
- Collapsed icon-only mode: pass icon with `aria-label` set in the icon component
- All interactive elements are keyboard-focusable with visible `:focus-visible` ring

## Keyboard Navigation

| Key | Action |
|---|---|
| `Tab` | Move focus to next interactive element |
| `Shift+Tab` | Move focus to previous interactive element |
| `Enter` / `Space` | Activate focused link or toggle group |
| `Escape` | Close mobile drawer (handled by shadcn `SidebarProvider`) |

## Development

```bash
pnpm dev          # watch mode
pnpm typecheck    # TypeScript check
pnpm test         # unit tests
pnpm test:a11y    # accessibility tests
pnpm build        # production build
```
