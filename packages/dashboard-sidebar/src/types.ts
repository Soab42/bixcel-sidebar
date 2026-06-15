import type { ReactNode } from "react";

// ---------------------------------------------------------------------------
// Core domain types
// ---------------------------------------------------------------------------

/**
 * Roles present in the Bixcel platform.
 * Extend this union as new roles are added.
 */
export type BixcelRole =
  | "root"
  | "client"
  | "broker"
  | "admin"
  | "super_admin"
  | "credit_analyst"
  | "settlement_officer"
  | "lawyer";

/**
 * Represents the authenticated user's context.
 * Passed into DashboardSidebar to drive role/feature filtering.
 */
export interface UserContext {
  /** Internal user ID */
  userId: string;
  /** Primary role assigned to this user */
  role: BixcelRole | string;
  /** Granular permissions (optional — for future fine-grained control) */
  permissions?: string[];
  /** Tenant / organisation ID for multi-tenant setups */
  tenantId?: string;
  /** Feature flags currently enabled for this user / tenant */
  enabledFeatures?: string[];
}

// ---------------------------------------------------------------------------
// Menu item types
// ---------------------------------------------------------------------------

/**
 * A single navigation item — leaf node or parent of `children`.
 */
/**
 * Identifies an app that an `app`-type link points at. The frontend resolves
 * the absolute origin from `subdomain` + the configured root domain; `key` is a
 * stable display/identity slug.
 */
export interface SidebarTargetApp {
  key: string;
  subdomain?: string | null;
}

/**
 * Routing classification for a menu item:
 *  - `internal` → a route inside the app currently rendering (client-side nav)
 *  - `app`      → a route owned by ANOTHER Bixcel app (full-page nav, SSO carries)
 *  - `external` → a third-party URL (opens in a new tab)
 * A missing value is treated as `internal` (back-compat with `isExternal`).
 */
export type SidebarLinkType = "internal" | "app" | "external";

export interface SidebarMenuItem {
  /** Unique identifier within a config */
  id: string | number;
  /** Display text */
  label: string;
  /** Target URL (supports query strings). For `app` links this is a path within
   *  the target app; the absolute origin is resolved at render time. */
  href: string;
  /** Routing classification — see {@link SidebarLinkType}. Defaults to `internal`. */
  linkType?: SidebarLinkType;
  /** For `app` links — which app this points at. */
  targetApp?: SidebarTargetApp;
  /** Lucide icon element or any ReactNode. Supply without className — the
   *  sidebar injects sizing/colour classes via React.cloneElement. */
  icon?: ReactNode;
  /** If set, only users whose `role` is in this array will see the item */
  requiredRoles?: (BixcelRole | string)[];
  /** If set, the item is only shown when `UserContext.enabledFeatures` includes
   *  this flag string */
  featureFlag?: string;
  /** Nested child items — renders as a collapsible sub-list */
  children?: SidebarMenuItem[];
  /** When true the link opens in a new tab (_blank) */
  isExternal?: boolean;
  /** Badge value shown next to the label (counts, "NEW", etc.) */
  badge?: number | string | null;
  /** Prevents navigation and dims the item when true */
  disabled?: boolean;
}

// ---------------------------------------------------------------------------
// Config types
// ---------------------------------------------------------------------------

/**
 * Top-level sidebar configuration object.
 * Top-level sidebar configuration — produced by `getSidebarConfig()` or defined inline.
 */
export interface SidebarConfig {
  /** Identifying name for the app that owns this config (e.g. "crm") */
  app: string;
  /** Semantic version string — used for compatibility checks and logging */
  version: string;
  /** Ordered list of top-level navigation items */
  items: SidebarMenuItem[];
}

// ---------------------------------------------------------------------------
// Component prop types
// ---------------------------------------------------------------------------

export interface MenuCountMap {
  [href: string]: number | null | undefined;
}

/**
 * Identifies the app currently rendering the sidebar. Used to decide whether an
 * `app` link is to *this* app (client-side nav + active highlighting) or to a
 * different app (full-page navigation, never highlighted here).
 */
export interface CurrentAppContext {
  /** This app's key — compared against `SidebarMenuItem.targetApp.key`. */
  appKey: string;
  /** This app's subdomain (informational). */
  subdomain?: string | null;
  /** Optional base path this app is mounted under. */
  basePath?: string;
}

/**
 * Builds an absolute URL for a cross-app (`app`) link. Typically composes
 * `https://{targetApp.subdomain}.{ROOT_DOMAIN}{href}`. Supplied by the host app
 * so origins stay environment-driven (never hard-coded in configs).
 */
export type AppUrlResolver = (
  targetApp: SidebarTargetApp,
  href: string
) => string;

/**
 * Result of classifying a menu item's link for rendering.
 */
export interface ResolvedLink {
  /** Final href — absolute for cross-app links, as-authored otherwise. */
  href: string;
  /** True → render with Next `<Link>` (client nav); false → plain `<a>`. */
  isInternalNav: boolean;
  /** True → open in a new tab (`target="_blank"`). */
  openInNewTab: boolean;
}

/**
 * Callback fired on mouse-enter of a child link.
 * Consumers can use this to trigger data prefetching.
 */
export type OnMenuHover = (href: string) => void;

/**
 * Callback fired when the active sidebar count should be refreshed.
 * Consumers should call their count-fetch API and call `updateCounts`.
 */
export type OnRefreshCounts = () => void;

export interface DashboardSidebarProps {
  /** Navigation configuration — use `getSidebarConfig()` or import a config directly */
  config: SidebarConfig;
  /** Authenticated user context for role/feature filtering */
  user: UserContext;
  /** Bearer token forwarded to count APIs (optional) */
  token?: string | undefined;
  /** Pre-fetched per-route counts. Keys are clean hrefs (no pagination params).
   *  When a count is non-null and non-zero it renders as a badge. */
  counts?: MenuCountMap | undefined;
  /** Called when a child link is hovered — use for route prefetching */
  onHover?: OnMenuHover | undefined;
  /** Slot for the bottom footer area (Support button, Logout, etc.) */
  footerSlot?: ReactNode | undefined;
  /** Additional className applied to the outer <aside> */
  className?: string | undefined;
  /** Identity of the app rendering this sidebar — enables cross-app routing
   *  and correct active-state when one shared config spans multiple apps. */
  currentApp?: CurrentAppContext | undefined;
  /** Resolves absolute URLs for `app`-type links. Required for cross-app nav;
   *  without it, `app` links fall back to their raw href. */
  appUrlResolver?: AppUrlResolver | undefined;
}

export interface SidebarItemProps {
  item: SidebarMenuItem;
  user: UserContext;
  counts?: MenuCountMap | undefined;
  onHover?: OnMenuHover | undefined;
  /** Current Next.js pathname from usePathname() */
  pathname: string;
  /** Current status search param */
  statusParam: string | null;
  isOpen: boolean;
  onToggle: () => void;
}

export interface SidebarGroupProps {
  item: SidebarMenuItem;
  user: UserContext;
  counts?: MenuCountMap | undefined;
  onHover?: OnMenuHover | undefined;
  pathname: string;
  statusParam: string | null;
  isOpen: boolean;
  onToggle: () => void;
}

export interface SidebarCollapseButtonProps {
  /** Whether the sidebar is currently expanded */
  isExpanded: boolean;
  onToggle: () => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// Icon types
// ---------------------------------------------------------------------------

/**
 * Describes how a single menu icon should be rendered. Produced by the backend
 * icon registry and embedded per-item when the config is fetched with
 * `?expand=icons`. `icon` itself stays a plain name string on the item — the
 * descriptor carries the renderable payload.
 *
 *  - `bundled` → resolved to an app-provided React element (see `bundled` prop)
 *  - `url`     → rendered as a CSS-mask (monochrome) or <img>
 *  - `inline`  → raw SVG markup (sanitized by the backend on save)
 */
export type IconDescriptor =
  | { name: string; source: "bundled"; is_monochrome?: boolean }
  | { name: string; source: "url"; is_monochrome?: boolean; svg_url: string }
  | {
      name: string;
      source: "inline";
      is_monochrome?: boolean;
      svg_markup: string;
    };

export interface SidebarIconProps {
  /** Registry descriptor for `url` / `inline` icons (from `?expand=icons`). */
  descriptor?: IconDescriptor | null;
  /**
   * App-provided fallback element for `bundled` icons (resolved from the
   * consuming app's own icon map). The package never bundles SVG components.
   */
  bundled?: ReactNode;
  /**
   * Forwarded to the rendered element. When `SidebarIcon` is used as a menu
   * item's `icon`, the sidebar injects sizing/colour classes here via
   * `React.cloneElement`.
   */
  className?: string;
}

// ---------------------------------------------------------------------------
// Header types
// ---------------------------------------------------------------------------

/**
 * Props for the DashboardHeader component.
 *
 * All content areas are accepted as ReactNode slots so the package stays
 * framework-agnostic (no Next.js Image / auth imports at package level).
 *
 * @example
 * ```tsx
 * <DashboardHeader
 *   leftSlot={<BarButton />}
 *   logoSlot={
 *     <Link href="/">
 *       <Image src={logo} alt="Bixcel"
 *         className="w-10 md:w-11 3xl:w-20 fhd:w-24 2k:w-32 3k:w-40 4k:w-50" />
 *     </Link>
 *   }
 *   rightSlot={
 *     <>
 *       <DashboardNotification session={session} initialNotifications={data} />
 *       <UserAvatarDropdown />
 *     </>
 *   }
 * />
 * ```
 */
export interface DashboardHeaderProps {
  /** Left section — typically a sidebar toggle button (BarButton). */
  leftSlot?: ReactNode;
  /** Centre section — app icon / logo. */
  logoSlot?: ReactNode;
  /** Right section — notification bell, avatar dropdown, etc. */
  rightSlot?: ReactNode;
  /** Additional className applied to the outer <header> element. */
  className?: string;
}
