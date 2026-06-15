# Changelog

All notable changes to `@soab42/dashboard-sidebar` are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versioning follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

---

## [1.2.2] — 2026-06-15

### `@soab42/dashboard-sidebar@1.2.2`

#### Fixed
- Icon hover/active theming for **stroke-based** (Lucide-style `stroke="currentColor"`)
  and **url-mask** icons. The sidebar previously injected only `fill-*` classes,
  which never affect `currentColor`, so such icons rendered flat and ignored
  hover/active. `SidebarItem`/`SidebarGroup` now inject matching `text-*` classes
  (`text-secondaryText` → `group-hover:text-primary`, `text-primary` when active)
  so `currentColor` follows the same scheme. `SidebarIcon`'s `inline` branch no
  longer forces `fill: inherit` (ineffective for stroke icons) — colour flows via
  `currentColor`.

---

## [1.2.1] — 2026-06-15

### `@soab42/dashboard-sidebar@1.2.1`

#### Fixed
- `SidebarIcon` — `inline` (SVG markup) icons rendered flat and ignored
  hover/active theming. The sidebar injects `fill-*` classes onto the icon
  wrapper; monochrome inline icons now force `fill: inherit` on all descendants
  so they pick up that fill (overriding any hard-coded `fill="…"` in the markup)
  and theme identically to bundled icons. Multi-colour inline icons
  (`is_monochrome: false`) keep their own fills.

---

## [1.2.0] — 2026-06-15

### `@soab42/dashboard-sidebar@1.2.0`

#### Added
- `SidebarIcon` component — hybrid icon renderer that resolves an icon by its
  registry `source`: `bundled` (app-provided element), `url` (CSS-mask for
  monochrome icons, else `<img>`), or `inline` (raw SVG markup). Lets admin-managed
  `url`/`inline` icons render with no frontend deploy; `bundled` icons still come
  from the consuming app's own icon map.
- `IconDescriptor` and `SidebarIconProps` types exported from the package. The
  descriptor is embedded per-item when the config is fetched with `?expand=icons`.

#### Notes
- Backward-compatible. Consumers that inject bundled icons directly need no change;
  to support `url`/`inline` icons, wrap the resolved bundled element and descriptor:
  `icon: <SidebarIcon descriptor={item.iconDescriptor} bundled={ICON_MAP[item.icon]} />`.
- `inline` markup is rendered via `dangerouslySetInnerHTML`. The backend sanitizes
  on save; add a client-side sanitizer in `SidebarIcon` if the source is untrusted.

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
