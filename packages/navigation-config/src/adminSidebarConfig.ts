import type { SidebarConfig } from "@bixcel/dashboard-sidebar";

/**
 * Admin / Super-Admin portal sidebar configuration.
 *
 * Exposes every section available in the platform and is the superset of all
 * other configs.  Role filtering inside DashboardSidebar ensures each admin
 * user only sees items their role permits.
 */
export const adminSidebarConfig: SidebarConfig = {
  app: "admin",
  version: "1.0.0",
  items: [
    {
      id: "dashboard",
      label: "Dashboard",
      href: "/dashboard",
      requiredRoles: ["root", "admin", "super_admin"],
      children: [],
    },
    {
      id: "applications",
      label: "Applications",
      href: "/dashboard/applications",
      requiredRoles: ["root", "admin", "super_admin"],
      children: [
        {
          id: "applications-all",
          label: "All Applications",
          href: "/dashboard/applications?status=all-application&page=1&pageSize=20",
          requiredRoles: ["root", "admin", "super_admin"],
        },
        {
          id: "applications-in-progress",
          label: "In Progress",
          href: "/dashboard/applications?status=in-progress&page=1&pageSize=20",
          requiredRoles: ["root", "admin", "super_admin"],
        },
        {
          id: "applications-approved",
          label: "Approved",
          href: "/dashboard/applications?status=in-approval&page=1&pageSize=20",
          requiredRoles: ["root", "admin", "super_admin"],
        },
        {
          id: "applications-in-settlement",
          label: "In-Settlement",
          href: "/dashboard/applications?status=awaiting&page=1&pageSize=20",
          requiredRoles: ["root", "admin", "super_admin"],
        },
        {
          id: "applications-settled",
          label: "Settled",
          href: "/dashboard/applications?status=in-settled&page=1&pageSize=20",
          requiredRoles: ["root", "admin", "super_admin"],
        },
      ],
    },
    {
      id: "credit-analyst",
      label: "Credit Analyst",
      href: "/dashboard/credit-analyst",
      requiredRoles: ["root", "credit_analyst", "admin", "super_admin"],
      children: [
        {
          id: "ca-all",
          label: "All Applications",
          href: "/dashboard/credit-analyst?status=all-application&page=1&pageSize=20",
          requiredRoles: ["root", "credit_analyst", "admin", "super_admin"],
        },
        {
          id: "ca-in-progress",
          label: "In Progress",
          href: "/dashboard/credit-analyst?status=in-progress&page=1&pageSize=20",
          requiredRoles: ["root", "credit_analyst", "admin", "super_admin"],
        },
        {
          id: "ca-approved",
          label: "Approved",
          href: "/dashboard/credit-analyst?status=in-approval&page=1&pageSize=20",
          requiredRoles: ["root", "credit_analyst", "admin", "super_admin"],
        },
      ],
    },
    {
      id: "settlements",
      label: "Settlements",
      href: "/dashboard/settlements",
      requiredRoles: ["root", "settlement_officer", "admin", "super_admin"],
      children: [
        {
          id: "settlements-in-settlement",
          label: "In-Settlement",
          href: "/dashboard/settlements?status=awaiting&page=1&pageSize=20",
          requiredRoles: ["root", "settlement_officer", "admin", "super_admin"],
        },
        {
          id: "settlements-settled",
          label: "Settled",
          href: "/dashboard/settlements?status=settled&page=1&pageSize=20",
          requiredRoles: ["root", "settlement_officer", "admin", "super_admin"],
        },
        {
          // Super-admin-only: legacy awaiting-settlement route
          id: "settlements-awaiting-legacy",
          label: "Awaiting Settlement",
          href: "/dashboard/settlements/awaiting-settlement?page=1&pageSize=20",
          requiredRoles: ["super_admin", "root"],
        },
      ],
    },
    {
      id: "current-portfolio",
      label: "Current Portfolio",
      href: "/dashboard/current-portfolio",
      requiredRoles: ["root", "admin", "super_admin", "lawyer"],
      children: [
        {
          id: "cp-summary",
          label: "Summary",
          href: "/dashboard/current-portfolio/summery",
          requiredRoles: ["root", "super_admin"],
        },
        {
          id: "cp-current-book",
          label: "Current Book",
          href: "/dashboard/current-portfolio/current-book",
          requiredRoles: ["root", "admin", "super_admin"],
        },
        {
          id: "cp-in-arrears",
          label: "In-Arrears",
          href: "/dashboard/current-portfolio/in-arrears",
          requiredRoles: ["root", "admin", "super_admin"],
        },
        {
          id: "cp-in-recovery",
          label: "In-Recovery",
          href: "/dashboard/current-portfolio/recovery",
          requiredRoles: ["root", "admin", "super_admin", "lawyer"],
        },
      ],
    },
    {
      id: "completed-loans",
      label: "Completed Loans",
      href: "/dashboard/completed-loans",
      requiredRoles: ["root", "admin", "super_admin"],
      children: [],
    },
    {
      id: "reports",
      label: "Reports",
      href: "/dashboard/reports",
      requiredRoles: ["root", "admin", "super_admin"],
      children: [
        {
          id: "reports-data-tape",
          label: "Data Tape",
          href: "/dashboard/reports/data-tape",
          requiredRoles: ["root", "super_admin", "lawyer"],
        },
        {
          id: "reports-revenue",
          label: "Revenue Report",
          href: "/dashboard/reports/revenue-report",
          requiredRoles: ["root", "admin", "super_admin", "lawyer"],
        },
        {
          id: "reports-transaction",
          label: "Transaction Report",
          href: "/dashboard/reports/transaction-report",
          requiredRoles: ["root", "admin", "super_admin", "lawyer"],
        },
      ],
    },
    {
      id: "referrers",
      label: "Referrers",
      href: "/dashboard/referrers",
      requiredRoles: ["root", "admin", "super_admin"],
      // featureFlag: "referrals" — add when you want per-tenant gating
      children: [
        {
          id: "referrers-partners",
          label: "Partners",
          href: "/dashboard/referrers/partners",
          requiredRoles: ["root", "admin", "super_admin"],
        },
        {
          id: "referrers-commission",
          label: "Commission",
          href: "/dashboard/referrers/commission",
          requiredRoles: ["root", "admin", "super_admin"],
        },
      ],
    },
    {
      id: "user-management",
      label: "User Management",
      href: "/dashboard/users",
      requiredRoles: ["root", "super_admin"],
      featureFlag: "user-management",
      children: [],
    },
  ],
};
