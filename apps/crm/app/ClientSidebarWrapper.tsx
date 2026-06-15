"use client";

import { useCallback, useEffect, useState, Suspense, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@soab42/dashboard-sidebar";
import type { SidebarConfig, MenuCountMap, SidebarMenuItem } from "@soab42/dashboard-sidebar";
import { cleanHref } from "@soab42/dashboard-sidebar";
import CONSTRAINTS from "@/lib/constraints";
import { prefetchData, getWithCacheGeneric } from "@/lib/manual-prefetch";
import { API_BASE_URL } from "@/lib/constraints";
import {
  statsAllApplicationAction,
  statsAllCreditAnalystAction,
  statsSettlementAction,
} from "@/actions/loan-statistics";
import LogoutButton from "@/components/auth/logout-button";
import IconMenuResources from "@/components/Icons/icon-menu-resources";
import IconMenuSupport from "@/components/Icons/icon-menu-support";

// Icons injected here (client side) — avoids RSC serialisation issue with cloneElement
import DashboardIcon from "@/components/Icons/dashboard/dashboardIcon";
import ApplicationIcon from "@/components/Icons/dashboard/application-icon";
import CreditAnalystIcon from "@/components/Icons/dashboard/credit-analyst-icon";
import Settlements from "@/components/Icons/dashboard/settlements";
import CurrentPortfolioIcon from "@/components/Icons/dashboard/current-portfolio-icon";
import CompletedLoansIcon from "@/components/Icons/dashboard/completed-loans-icon";
import ReportIcon from "@/components/Icons/dashboard/report-icon";
import IconSidebarReferralPartner from "@/components/Icons/icon-sidebar-referral-partner";
import IconReferrersCommissions from "@/components/Icons/icon-referrers-commissions";

// Store as JSX elements (not component refs) — required for cloneElement in the package
const ICON_MAP: Record<string, React.ReactNode> = {
  "dashboard":          <DashboardIcon />,
  "applications":       <ApplicationIcon />,
  "credit-analyst":     <CreditAnalystIcon />,
  "settlements":        <Settlements />,
  "current-portfolio":  <CurrentPortfolioIcon />,
  "completed-loans":    <CompletedLoansIcon />,
  "reports":            <ReportIcon />,
  "referrers":          <IconSidebarReferralPartner />,
  "commission":         <IconReferrersCommissions />,
};

function injectIcons(items: SidebarMenuItem[]): SidebarMenuItem[] {
  return items.map((item) => ({
    ...item,
    icon: ICON_MAP[String(item.id)] ?? item.icon,
    children: item.children ? injectIcons(item.children) : undefined,
  }));
}

interface ClientSidebarWrapperProps {
  config: SidebarConfig;
  userId: string;
  role: string;
  enabledFeatures: string[];
  token: string;
}

export default function ClientSidebarWrapper({
  config,
  userId,
  role,
  enabledFeatures,
  token,
}: ClientSidebarWrapperProps) {
  const pathname = usePathname();
  const [counts, setCounts] = useState<MenuCountMap>({});

  // Inject icons on the client — stable reference (config never changes at runtime)
  const configWithIcons = useMemo<SidebarConfig>(() => ({
    ...config,
    items: injectIcons(config.items),
  }), [config]);

  // ---------------------------------------------------------------------------
  // Count fetching
  // ---------------------------------------------------------------------------
  const fetchCounts = useCallback(() => {
    if (!token) return;
    fetch(CONSTRAINTS.SIDEBAR_STANDARD_COUNT, {
      method: "POST",
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(
        config.items.map((item) => ({
          id: item.id,
          href: cleanHref(item.href),
          children: item.children?.map((c) => ({ id: c.id, href: cleanHref(c.href) })),
        }))
      ),
    })
      .then((r) => r.json())
      .then((res) => { if (res.success) setCounts(res.data as MenuCountMap); })
      .catch(() => {});
  }, [token, config]);

  useEffect(() => {
    fetchCounts();
    window.addEventListener("refresh-sidebar-count", fetchCounts);
    return () => window.removeEventListener("refresh-sidebar-count", fetchCounts);
  }, [fetchCounts]);

  // ---------------------------------------------------------------------------
  // Hover prefetch
  // ---------------------------------------------------------------------------
  const handleHover = useCallback((href: string) => {
    if (!token) return;
    try {
      const url = new URL(href, window.location.origin);
      const allowedPaths = ["applications", "credit-analyst", "settlements"];
      if (!allowedPaths.some((p) => url.pathname.includes(p))) return;

      const status = url.searchParams.get("status") || "all-application";
      let userType = url.pathname.split("/")[2] ?? "";
      if (userType.endsWith("s")) userType = userType.slice(0, -1);

      const endpoint = `${API_BASE_URL}/dashboard/${userType}${
        status && !status.includes("all-application") ? `/${status}` : ""
      }`;
      prefetchData(endpoint, { keyword: "", per_page: 20, page: 1 }, token);

      const statsStatus = status.replaceAll("-application", "") || "all";
      const statsCacheKey = `stats:${role}:${statsStatus}:${url.pathname}`;
      const fetchStats = () => {
        if (url.pathname.includes("applications")) return statsAllApplicationAction({}, statsStatus);
        if (url.pathname.includes("credit-analyst")) return statsAllCreditAnalystAction({}, statsStatus);
        if (url.pathname.includes("settlements")) return statsSettlementAction({}, statsStatus);
      };
      if (fetchStats()) getWithCacheGeneric(statsCacheKey, fetchStats);
    } catch {}
  }, [token, role]);

  // ---------------------------------------------------------------------------
  // Intercom (broker only)
  // ---------------------------------------------------------------------------
  const handleOpenIntercom = () => {
    if (typeof window !== "undefined" && window.Intercom) {
      window.Intercom("show");
    }
  };

  // ---------------------------------------------------------------------------
  // Footer
  // ---------------------------------------------------------------------------
  const isResourcesPath = pathname.startsWith("/dashboard/resources");

  const footerSlot = (
    <>
      {role !== "client" && (
        <li>
          <Link
            href="/dashboard/resources"
            className={`sidebar_nav_link group${isResourcesPath ? " text-primaryText bg-primary/20" : ""}`}
          >
            <IconMenuResources />
            Resources
          </Link>
        </li>
      )}
      {role === "broker" && (
        <li>
          <button
            onClick={handleOpenIntercom}
            className="sidebar_nav_link group w-full text-left"
          >
            <IconMenuSupport />
            <span>Live Chat</span>
          </button>
        </li>
      )}
      <li>
        <Suspense fallback={<div className="sidebar_nav_link">Loading...</div>}>
          <LogoutButton token={token} className="w-full" />
        </Suspense>
      </li>
    </>
  );

  return (
    <Sidebar className="mt-11 md:mt-0 border-0 border-none w-45 min-w-45 md:min-w-42 md:w-42 lg:min-w-56 lg:w-56 3xl:min-w-80 3xl:w-80 fhd:min-w-90 fhd:w-90 2k:min-w-135 2k:w-135 3k:min-w-160 3k:w-160 4k:min-w-210 4k:w-210 bg-none">
      <DashboardSidebar
        config={configWithIcons}
        user={{ userId, role, enabledFeatures }}
        token={token}
        counts={counts}
        onHover={handleHover}
        footerSlot={footerSlot}
      />
    </Sidebar>
  );
}
