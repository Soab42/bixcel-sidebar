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
export interface SidebarMenuItem {
  /** Unique identifier within a config */
  id: string | number;
  /** Display text */
  label: string;
  /** Target URL (supports query strings) */
  href: string;
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
 * Produced by `@bixcel/navigation-config` and consumed by `DashboardSidebar`.
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
  /** Navigation configuration — use `getSidebarConfig()` from
   *  `@bixcel/navigation-config` */
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
