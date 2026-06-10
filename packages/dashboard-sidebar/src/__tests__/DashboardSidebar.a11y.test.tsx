/**
 * Accessibility tests for DashboardSidebar.
 *
 * These tests use @testing-library/react + jest-axe to assert that the
 * rendered sidebar meets WCAG 2.1 AA standards.
 *
 * Run with: pnpm test:a11y
 *
 * NOTE: These tests require a jsdom environment and mock next/navigation.
 * Configure vitest.config.ts with { environment: "jsdom" }.
 */

import React from "react";
import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { describe, it, expect, vi, beforeAll } from "vitest";
import { DashboardSidebar } from "../DashboardSidebar";
import type { SidebarConfig, UserContext } from "../types";

// Extend Vitest's expect with jest-axe matchers
expect.extend(toHaveNoViolations);

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
  useSearchParams: () => new URLSearchParams(),
}));

// DashboardSidebar renders a plain <aside> — no shadcn mock needed.

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const testConfig: SidebarConfig = {
  app: "test",
  version: "1.0.0",
  items: [
    {
      id: "dashboard",
      label: "Dashboard",
      href: "/dashboard",
      requiredRoles: ["broker"],
      children: [],
    },
    {
      id: "applications",
      label: "Applications",
      href: "/dashboard/applications",
      requiredRoles: ["broker"],
      children: [
        {
          id: "apps-all",
          label: "All Applications",
          href: "/dashboard/applications?status=all-application",
          requiredRoles: ["broker"],
        },
      ],
    },
  ],
};

const brokerUser: UserContext = {
  userId: "u1",
  role: "broker",
  enabledFeatures: [],
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("DashboardSidebar — accessibility", () => {
  it("has no axe violations in default state", async () => {
    const { container } = render(
      <DashboardSidebar config={testConfig} user={brokerUser} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("nav element has aria-label", () => {
    const { getByRole } = render(
      <DashboardSidebar config={testConfig} user={brokerUser} />
    );
    const nav = getByRole("navigation", { name: /main navigation/i });
    expect(nav).toBeTruthy();
  });

  it("active link has aria-current='page'", () => {
    const { getByRole } = render(
      <DashboardSidebar config={testConfig} user={brokerUser} />
    );
    // /dashboard is the active path (mocked usePathname)
    const link = getByRole("link", { name: /dashboard/i });
    expect(link.getAttribute("aria-current")).toBe("page");
  });

  it("collapsible parent button has aria-expanded", () => {
    const { getByRole } = render(
      <DashboardSidebar config={testConfig} user={brokerUser} />
    );
    const btn = getByRole("button", { name: /applications/i });
    expect(btn).toHaveAttribute("aria-expanded");
  });
});
