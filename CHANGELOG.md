# Changelog

All notable changes to `@bixcel/dashboard-sidebar` and `@bixcel/navigation-config` are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versioning follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- `setEmergencyConfig()` / `isEmergencyConfigActive()` for runtime rollback in `navigation-config`

---

## [1.0.0] — 2026-06-09

### `@bixcel/dashboard-sidebar@1.0.0`

#### Added
- `DashboardSidebar` — config-driven sidebar component replacing the previous hardcoded `DashboardSidebarTW` and `DashboardSidebarShadCN` components
- `SidebarItem` — leaf-node menu item with active-route highlighting and `aria-current="page"`
- `SidebarGroup` — collapsible parent group with `aria-expanded` and child connector lines
- `SidebarCollapseButton` — accessible toggle for collapsed/expanded sidebar mode
- `filterMenuItems(items, user)` — role + feature-flag + disabled filtering utility
- `cleanHref(href)` — strips pagination params for stable route matching
- `isRouteActive(href, pathname, statusParam)` — active-state detection honouring `?status=` param
- `loadOpenMenusFromStorage` / `saveOpenMenusToStorage` — localStorage persistence with SSR guard
- Full TypeScript types: `SidebarConfig`, `SidebarMenuItem`, `UserContext`, `BixcelRole`
- Accessible `<nav aria-label="Main navigation">` landmark
- Responsive breakpoint scale: `md` → `lg` → `3xl` → `fhd` → `2k` → `3k` → `4k`
- `footerSlot` prop for product-specific footer content (logout, support, resources)
- `onHover` callback prop for hover-based data prefetching

### `@bixcel/navigation-config@1.0.0`

#### Added
- `crmSidebarConfig` — full CRM / broker portal menu structure extracted from `bixcel-frontend`
- `adminSidebarConfig` — admin / super-admin menu superset
- `getSidebarConfig(app)` — app-name-based config resolver
- `getSidebarConfigForRole(role)` — role-based config resolver
- `setEmergencyConfig(config)` — emergency rollback override
- Zod schemas: `SidebarConfigSchema`, `SidebarMenuItemSchema`, `BixcelRoleSchema`
- `validateSidebarConfig()` / `safeParseSidebarConfig()` helpers

### Migration from `bixcel-frontend` (breaking)

The following components are **replaced** by this package and should be deleted
from `bixcel-frontend` after migrating:

| Old component | Replacement |
|---|---|
| `components/dashboard/sidebar/sidebar.jsx` | `DashboardSidebar` + `crmSidebarConfig` |
| `components/dashboard/sidebar/dashboard-sidebar-shadcn.jsx` | `DashboardSidebar` + `ClientSidebarWrapper` |
| `components/dashboard/sidebar/sidebar-menu-item.jsx` | `SidebarItem` |
| `components/dashboard/sidebar/sidebar-menu-child-item.jsx` | `SidebarGroup` (child rendering) |
| `components/dashboard/sidebar/sidebar-child-count.jsx` | Count badge built into `SidebarGroup` |

---

## Versioning Policy

### Patch (1.0.x)
- Bug fixes that do not change component APIs or menu structure
- Dependency security patches
- Documentation corrections

### Minor (1.x.0)
- New optional props on existing components
- New menu items added to navigation configs
- New utility exports
- Role additions that are backward-compatible

### Major (x.0.0)
- Removal or rename of exported components / utilities
- Breaking changes to `SidebarConfig` or `SidebarMenuItem` shape
- Role renames that require consumer updates
- Removal of menu items that apps depend on

### Deprecation Policy
1. A deprecated API is marked with a `@deprecated` JSDoc tag and a console warning in development.
2. It remains functional for **at least one minor version** before removal.
3. The removal is documented in the next major version's changelog under **Breaking Changes**.

### Backward Compatibility
- The `items` array in any config may grow (new items) without a major bump.
- Removing items is always a **major** change.
- Adding a new required prop to a component is a **major** change.
- All `optional` props are backward-compatible minor changes.
