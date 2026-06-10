import type { SidebarConfig } from "@bixcel/dashboard-sidebar";

/**
 * CRM / Broker Portal sidebar configuration.
 *
 * Icons are imported by the consuming app and injected at runtime — this
 * module only carries the structural config so it remains JSON-serialisable
 * and easy to validate with Zod.
 *
 * Roles present: root, client, broker, admin, super_admin, credit_analyst,
 *                settlement_officer, lawyer
 *
 * Usage:
 * ```tsx
 * import { crmSidebarConfig } from "@bixcel/navigation-config";
 * import { withIcons } from "@bixcel/navigation-config";
 * import * as Icons from "@/components/icons/sidebar";
 *
 * const config = withIcons(crmSidebarConfig, Icons);
 * ```
 */
export const crmSidebarConfig: SidebarConfig = {
  app: "crm",
  version: "1.0.0",
  items: [
    {
      id: "dashboard",
      label: "Dashboard",
      href: "/dashboard",
      requiredRoles: ["root", "client"],
      children: [],
    },
    {
      id: "applications",
      label: "Applications",
      href: "/dashboard/applications",
      requiredRoles: ["root", "broker", "admin", "super_admin"],
      children: [
        {
          id: "applications-all",
          label: "All Applications",
          href: "/dashboard/applications?status=all-application&page=1&pageSize=20",
          requiredRoles: ["root", "broker", "admin", "super_admin"],
        },
        {
          id: "applications-draft",
          label: "Draft",
          href: "/dashboard/applications?status=in-draft&page=1&pageSize=20",
          requiredRoles: ["root", "broker"],
        },
        {
          id: "applications-in-progress",
          label: "In Progress",
          href: "/dashboard/applications?status=in-progress&page=1&pageSize=20",
          requiredRoles: ["root", "broker", "admin", "super_admin"],
        },
        {
          id: "applications-approved",
          label: "Approved",
          href: "/dashboard/applications?status=in-approval&page=1&pageSize=20",
          requiredRoles: ["root", "broker", "admin", "super_admin"],
        },
        {
          id: "applications-in-settlement",
          label: "In-Settlement",
          href: "/dashboard/applications?status=awaiting&page=1&pageSize=20",
          requiredRoles: ["root", "broker", "admin", "super_admin"],
        },
        {
          id: "applications-settled",
          label: "Settled",
          href: "/dashboard/applications?status=in-settled&page=1&pageSize=20",
          requiredRoles: ["root", "broker"],
        },
        {
          id: "applications-archived",
          label: "Archived",
          href: "/dashboard/applications?status=in-archieved&page=1&pageSize=20",
          requiredRoles: ["root", "broker"],
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
        {
          id: "ca-settled",
          label: "Settled",
          href: "/dashboard/credit-analyst?status=in-settled&page=1&pageSize=20",
          requiredRoles: ["root", "credit_analyst"],
        },
        {
          id: "ca-archived",
          label: "Archived",
          href: "/dashboard/credit-analyst?status=in-archieved&page=1&pageSize=20",
          requiredRoles: ["root", "credit_analyst"],
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
      // featureFlag: "referrals" — add this when you want to gate it per tenant
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
      id: "commission",
      label: "Commission",
      href: "/dashboard/commission",
      requiredRoles: ["broker"],
      // featureFlag: "broker-commission" — add this when you want to gate it per tenant
      children: [],
    },
  ],
};
