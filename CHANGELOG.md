# Changelog

All notable changes to `@soab42/dashboard-sidebar` are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versioning follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

---

## [1.1.0] — 2026-06-15

### `@soab42/dashboard-sidebar@1.1.0`

#### Added
- `DashboardHeader` component — fixed top navigation bar with `leftSlot`, `logoSlot`, `rightSlot` props. Responsive at all Bixcel breakpoints. No Next.js or auth imports inside the package.
- `DashboardHeaderProps` type exported from the package.
- Zod schemas (`BixcelRoleSchema`, `SidebarMenuItemSchema`, `SidebarConfigSchema`) and validation helpers (`validateSidebarConfig`, `safeParseSidebarConfig`) — moved from the now-removed `@soab42/navigation-config` package.
- `zod` added as a runtime dependency.

#### Removed
- `@soab42/navigation-config` package — merged entirely into this package. Consumers should update their imports from `@soab42/navigation-config` to `@soab42/dashboard-sidebar`.
- Static `crmSidebarConfig` and `adminSidebarConfig` — navigation config is now fetched from the API and passed to `DashboardSidebar` as a prop.
- `getSidebarConfig`, `getSidebarConfigForRole`, `setEmergencyConfig`, `isEmergencyConfigActive` — no longer needed with API-driven config.

#### Migration from `@soab42/navigation-config`

Replace all imports:

```diff
- import { crmSidebarConfig } from "@soab42/navigation-config";
- import { validateSidebarConfig } from "@soab42/navigation-config";
+ import { validateSidebarConfig } from "@soab42/dashboard-sidebar";
```

Replace static config with an API fetch:

```diff
- import { crmSidebarConfig } from "@soab42/navigation-config";
- <ClientSidebarWrapper config={crmSidebarConfig} ... />
+ const navConfig = await getNavConfigAction();
+ <ClientSidebarWrapper config={navConfig} ... />
```

---

## [1.0.0] — 2026-06-09

### `@soab42/dashboard-sidebar@1.0.0`

#### Added
- `DashboardSidebar` — config-driven sidebar replacing the previous hardcoded components
- `SidebarItem` — leaf-node menu item with active-route highlighting and `aria-current="page"`
- `SidebarGroup` — collapsible parent group with `aria-expanded`
- `SidebarCollapseButton` — accessible toggle button
- `filterMenuItems(items, user)` — role + feature-flag + disabled filtering
- `cleanHref(href)` — strips pagination params for stable route matching
- `isRouteActive` / `isParentRouteActive` — active-state detection honouring `?status=` param
- `loadOpenMenusFromStorage` / `saveOpenMenusToStorage` — localStorage persistence with SSR guard
- Full TypeScript types: `SidebarConfig`, `SidebarMenuItem`, `UserContext`, `BixcelRole`
- Responsive breakpoint scale: `md` → `lg` → `3xl` → `fhd` → `2k` → `3k` → `4k`
- `footerSlot` prop for product-specific footer content
- `onHover` callback for hover-based data prefetching

---

## Versioning Policy

### Patch (1.0.x) — bug fixes, dependency patches, doc corrections
### Minor (1.x.0) — new optional props, new exports, backward-compatible changes
### Major (x.0.0) — removed/renamed exports, breaking prop changes, config shape changes
