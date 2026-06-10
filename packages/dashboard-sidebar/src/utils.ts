import type { SidebarMenuItem, UserContext } from "./types";

// ---------------------------------------------------------------------------
// URL helpers
// ---------------------------------------------------------------------------

/**
 * Strips the standard pagination query params (`page`, `pageSize`) from an
 * href so that route-matching and count-map lookups are stable regardless of
 * the page the user navigated to.
 *
 * @example
 * cleanHref("/dashboard/applications?status=in-progress&page=1&pageSize=20")
 * // "/dashboard/applications?status=in-progress"
 */
export function cleanHref(href: string): string {
  if (!href) return href;
  try {
    // Use a dummy base so we can parse relative URLs
    const url = new URL(href, "http://x");
    url.searchParams.delete("page");
    url.searchParams.delete("pageSize");
    const search = url.searchParams.toString();
    return url.pathname + (search ? `?${search}` : "");
  } catch {
    return href;
  }
}

/**
 * Returns true when the given href is the currently active route,
 * comparing both the pathname and the `status` search param.
 */
export function isRouteActive(
  href: string,
  pathname: string,
  statusParam: string | null
): boolean {
  const clean = cleanHref(href);
  try {
    const url = new URL(clean, "http://x");
    const hrefStatus = url.searchParams.get("status");
    const pathnameMatches = pathname === url.pathname;
    const statusMatches = statusParam === hrefStatus;
    return pathnameMatches && statusMatches;
  } catch {
    return false;
  }
}

/**
 * Returns true when any direct child of `item` is the currently active route.
 * Used to apply an "active parent" highlight style.
 */
export function isParentRouteActive(
  item: SidebarMenuItem,
  pathname: string,
  statusParam: string | null
): boolean {
  if (!item.children?.length) {
    return isRouteActive(item.href, pathname, statusParam);
  }
  // Match on clean href of parent (no status) or any child
  const parentClean = cleanHref(item.href);
  if (pathname === parentClean && !statusParam) return true;
  return item.children.some((child) =>
    isRouteActive(child.href, pathname, statusParam)
  );
}

// ---------------------------------------------------------------------------
// Filtering helpers
// ---------------------------------------------------------------------------

/**
 * Returns true when the given menu item should be visible for `user`.
 *
 * Visibility rules (all must pass):
 *   1. `disabled` must not be true
 *   2. If `requiredRoles` is set, `user.role` must be in the list
 *   3. If `featureFlag` is set, `user.enabledFeatures` must include the flag
 */
export function isItemVisible(item: SidebarMenuItem, user: UserContext): boolean {
  if (item.disabled) return false;

  if (item.requiredRoles && item.requiredRoles.length > 0) {
    if (!item.requiredRoles.includes(user.role)) return false;
  }

  if (item.featureFlag) {
    if (!user.enabledFeatures?.includes(item.featureFlag)) return false;
  }

  return true;
}

/**
 * Recursively filters a list of `SidebarMenuItem` objects for a given user.
 * Children are filtered first; a parent is kept if it passes visibility AND
 * has at least one visible child (or no children at all).
 */
export function filterMenuItems(
  items: SidebarMenuItem[],
  user: UserContext
): SidebarMenuItem[] {
  return items.reduce<SidebarMenuItem[]>((acc, item) => {
    if (!isItemVisible(item, user)) return acc;

    if (item.children && item.children.length > 0) {
      const filteredChildren = filterMenuItems(item.children, user);
      // Keep parent even when all children are filtered — it may be a direct link too
      acc.push({ ...item, children: filteredChildren });
    } else {
      acc.push(item);
    }

    return acc;
  }, []);
}

// ---------------------------------------------------------------------------
// localStorage helpers (safe for SSR)
// ---------------------------------------------------------------------------

const STORAGE_KEY = "bixcel_sidebar_open_menus";

export function loadOpenMenusFromStorage(
  menuIds: (string | number)[]
): Record<string | number, boolean> {
  const base: Record<string | number, boolean> = {};
  menuIds.forEach((id) => {
    base[id] = false;
  });

  if (typeof window === "undefined") return base;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return base;
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      window.localStorage.removeItem(STORAGE_KEY);
      return base;
    }
    const validIds = (parsed as unknown[]).filter(
      (id) => typeof id === "string" || typeof id === "number"
    ) as (string | number)[];
    validIds.forEach((id) => {
      if (id in base) base[id] = true;
    });
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
  }

  return base;
}

export function saveOpenMenusToStorage(
  openMenus: Record<string | number, boolean>
): void {
  if (typeof window === "undefined") return;
  try {
    const openIds = Object.entries(openMenus)
      .filter(([, v]) => v)
      .map(([k]) => (isNaN(Number(k)) ? k : Number(k)));
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(openIds));
  } catch {
    // Storage quota exceeded — silently ignore
  }
}

// ---------------------------------------------------------------------------
// Class name helper (avoids pulling in full clsx if not already present)
// ---------------------------------------------------------------------------

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
