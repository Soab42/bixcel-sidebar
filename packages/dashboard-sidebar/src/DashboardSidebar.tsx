"use client";

import React, { useCallback, useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import type { DashboardSidebarProps } from "./types";
import {
  filterMenuItems,
  loadOpenMenusFromStorage,
  saveOpenMenusToStorage,
  cn,
} from "./utils";
import { SidebarItem } from "./SidebarItem";
import { SidebarLinkProvider } from "./linkContext";

/**
 * DashboardSidebar
 *
 * Production-ready, config-driven sidebar component for Bixcel dashboard apps.
 *
 * Renders a plain <aside> + <nav> — no shadcn provider dependency.
 * Wrap this in shadcn's <Sidebar> in the consuming app if you need the
 * mobile drawer behaviour (see ClientSidebarWrapper in apps/crm).
 *
 * Features:
 *  - Role-based & feature-flag item filtering
 *  - Collapsible menu groups with localStorage persistence
 *  - Active-route highlighting (pathname + ?status= param)
 *  - Count badges per route (driven by `counts` prop)
 *  - Hover callbacks for data prefetching
 *  - Accessible: nav landmark, aria-current, keyboard navigation
 *  - Responsive widths matching Bixcel breakpoint scale
 *
 * @example
 * ```tsx
 * <DashboardSidebar
 *   config={crmSidebarConfig}
 *   user={{ userId: "u1", role: "broker", enabledFeatures: ["referrals"] }}
 *   counts={menuCounts}
 *   onHover={prefetchRoute}
 *   footerSlot={<LogoutButton token={token} />}
 * />
 * ```
 */
export function DashboardSidebar({
  config,
  user,
  counts,
  onHover,
  footerSlot,
  className,
  currentApp,
  appUrlResolver,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const statusParam = searchParams.get("status");

  // Filter items once per render based on user context
  const visibleItems = filterMenuItems(config.items, user);

  // ---------------------------------------------------------------------------
  // Open/collapsed state for groups — persisted in localStorage
  // ---------------------------------------------------------------------------
  const [openMenus, setOpenMenus] = useState<Record<string | number, boolean>>(
    () => loadOpenMenusFromStorage(visibleItems.map((i) => i.id))
  );

  // Sync open state to storage whenever it changes
  useEffect(() => {
    saveOpenMenusToStorage(openMenus);
  }, [openMenus]);

  const toggleMenu = useCallback((id: string | number) => {
    setOpenMenus((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  // Auto-open the active parent group on pathname change
  useEffect(() => {
    const activeParent = visibleItems.find((item) => {
      if (!item.children?.length) return false;
      return item.children.some((child) => {
        try {
          const url = new URL(child.href, "http://x");
          const hrefStatus = url.searchParams.get("status");
          return pathname === url.pathname && statusParam === hrefStatus;
        } catch {
          return false;
        }
      });
    });
    if (activeParent) {
      setOpenMenus((prev) => ({ ...prev, [activeParent.id]: true }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, statusParam]);

  return (
    // Fixed inner div — same pattern as original dashboard-sidebar-shadcn.
    // <Sidebar> in the parent provides the flex-layout placeholder + mobile drawer.
    // This div is the actual visual panel pinned to the screen.
    <div
      data-lenis-prevent
      className={cn(
        "fixed",
        // Height subtracts header at each breakpoint so footer anchors correctly
        "h-full md:h-[calc(100vh-44px)] lg:h-[calc(100vh-56px)]",
        "3xl:h-[calc(100vh-80px)] fhd:h-[calc(100vh-96px)]",
        "2k:h-[calc(100vh-128px)] 3k:h-[calc(100vh-160px)] 4k:h-[calc(100vh-200px)]",
        // Width mirrors the <Sidebar> wrapper widths
        "w-45 min-w-45 md:min-w-42 md:w-42 lg:min-w-56 lg:w-56",
        "3xl:min-w-80 3xl:w-80 fhd:min-w-90 fhd:w-90",
        "2k:min-w-135 2k:w-135 3k:min-w-160 3k:w-160 4k:min-w-210 4k:w-210",
        "bg-sidebar flex flex-col border-r border-secondaryText/15",
        className
      )}
    >
      {/* Scrollable nav area — only this part scrolls, footer stays pinned */}
      <div className="flex-1 overflow-y-auto pt-6">
        <SidebarLinkProvider value={{ currentApp, appUrlResolver }}>
          <nav
            aria-label="Main navigation"
            className={cn(
              "space-y-1 3xl:space-y-1.5 fhd:space-y-2",
              "2k:space-y-3 3k:space-y-4 4k:space-y-5 pb-5"
            )}
          >
            {visibleItems.map((item) => (
              <SidebarItem
                key={item.id}
                item={item}
                user={user}
                counts={counts}
                onHover={onHover}
                pathname={pathname}
                statusParam={statusParam}
                isOpen={Boolean(openMenus[item.id])}
                onToggle={() => toggleMenu(item.id)}
              />
            ))}
          </nav>
        </SidebarLinkProvider>
      </div>

      {/* Footer — always pinned to the bottom, never scrolls away */}
      {footerSlot && (
        <div
          className={cn(
            "flex-shrink-0 pb-6",
            "pt-4 fhd:pt-6 2k:pt-8 4k:pt-10",
            "border-t 2k:border-t-[2px] 4k:border-t-[2.5px] border-secondaryText/30"
          )}
        >
          <ul
            className={cn(
              "space-y-1 3xl:space-y-1.5 fhd:space-y-2 2k:space-y-3 3k:space-y-4 4k:space-y-5",
              "ml-4 md:ml-3 lg:ml-5 3xl:ml-6 fhd:ml-8 2k:ml-10 3k:ml-12 4k:ml-15",
              "mr-3 md:mr-2 lg:mr-4 3xl:mr-5 fhd:mr-6 2k:mr-7 3k:mr-8 4k:mr-9"
            )}
          >
            {footerSlot}
          </ul>
        </div>
      )}
    </div>
  );
}

export default DashboardSidebar;
