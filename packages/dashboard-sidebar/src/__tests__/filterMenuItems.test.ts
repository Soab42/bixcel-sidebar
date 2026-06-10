import { describe, it, expect } from "vitest";
import { filterMenuItems, isItemVisible } from "../utils";
import type { SidebarMenuItem, UserContext } from "../types";

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const brokerUser: UserContext = {
  userId: "u1",
  role: "broker",
  enabledFeatures: ["broker-commission"],
};

const adminUser: UserContext = {
  userId: "u2",
  role: "admin",
  enabledFeatures: ["referrals"],
};

const clientUser: UserContext = {
  userId: "u3",
  role: "client",
  enabledFeatures: [],
};

const items: SidebarMenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/dashboard",
    requiredRoles: ["root", "client"],
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
        href: "/dashboard/applications?status=all-application",
        requiredRoles: ["root", "broker", "admin", "super_admin"],
      },
      {
        id: "applications-draft",
        label: "Draft",
        href: "/dashboard/applications?status=in-draft",
        requiredRoles: ["root", "broker"],
      },
      {
        id: "applications-settled",
        label: "Settled",
        href: "/dashboard/applications?status=in-settled",
        requiredRoles: ["root", "broker"],
      },
    ],
  },
  {
    id: "referrers",
    label: "Referrers",
    href: "/dashboard/referrers",
    requiredRoles: ["root", "admin", "super_admin"],
    featureFlag: "referrals",
    children: [],
  },
  {
    id: "commission",
    label: "Commission",
    href: "/dashboard/commission",
    requiredRoles: ["broker"],
    featureFlag: "broker-commission",
    children: [],
  },
  {
    id: "disabled-item",
    label: "Disabled",
    href: "/dashboard/disabled",
    disabled: true,
    children: [],
  },
];

// ---------------------------------------------------------------------------
// isItemVisible
// ---------------------------------------------------------------------------

describe("isItemVisible", () => {
  it("returns false when item.disabled is true", () => {
    const item = items.find((i) => i.id === "disabled-item")!;
    expect(isItemVisible(item, brokerUser)).toBe(false);
  });

  it("returns false when user role is not in requiredRoles", () => {
    const item = items.find((i) => i.id === "dashboard")!;
    expect(isItemVisible(item, brokerUser)).toBe(false);
  });

  it("returns true when user role is in requiredRoles", () => {
    const item = items.find((i) => i.id === "dashboard")!;
    expect(isItemVisible(item, clientUser)).toBe(true);
  });

  it("returns false when featureFlag is set but not in user.enabledFeatures", () => {
    const item = items.find((i) => i.id === "referrers")!;
    expect(isItemVisible(item, brokerUser)).toBe(false);
  });

  it("returns true when featureFlag is satisfied", () => {
    const item = items.find((i) => i.id === "referrers")!;
    expect(isItemVisible(item, adminUser)).toBe(true);
  });

  it("returns false when role AND featureFlag both need to pass but one fails", () => {
    // broker has the feature flag but not the role
    const item = items.find((i) => i.id === "referrers")!;
    expect(isItemVisible(item, brokerUser)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// filterMenuItems
// ---------------------------------------------------------------------------

describe("filterMenuItems", () => {
  it("filters top-level items by role", () => {
    const result = filterMenuItems(items, brokerUser);
    const ids = result.map((i) => i.id);
    expect(ids).toContain("applications");
    expect(ids).not.toContain("dashboard"); // client-only
    expect(ids).not.toContain("referrers"); // admin-only
  });

  it("filters children by role", () => {
    const result = filterMenuItems(items, adminUser);
    const apps = result.find((i) => i.id === "applications");
    expect(apps).toBeDefined();
    // draft is broker-only, should be filtered for admin
    const childIds = apps!.children!.map((c) => c.id);
    expect(childIds).not.toContain("applications-draft");
    expect(childIds).toContain("applications-all");
  });

  it("includes commission when broker has the feature flag", () => {
    const result = filterMenuItems(items, brokerUser);
    expect(result.find((i) => i.id === "commission")).toBeDefined();
  });

  it("excludes commission when broker lacks the feature flag", () => {
    const brokerNoFlag: UserContext = { ...brokerUser, enabledFeatures: [] };
    const result = filterMenuItems(items, brokerNoFlag);
    expect(result.find((i) => i.id === "commission")).toBeUndefined();
  });

  it("excludes disabled items regardless of role", () => {
    const result = filterMenuItems(items, adminUser);
    expect(result.find((i) => i.id === "disabled-item")).toBeUndefined();
  });

  it("returns empty array when no items match", () => {
    const superRestrictedUser: UserContext = {
      userId: "u9",
      role: "unknown_role",
      enabledFeatures: [],
    };
    const result = filterMenuItems(items, superRestrictedUser);
    // Nothing has "unknown_role" in requiredRoles
    expect(result.length).toBe(0);
  });
});
