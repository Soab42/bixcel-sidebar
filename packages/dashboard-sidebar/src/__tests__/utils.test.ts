import { describe, it, expect } from "vitest";
import { cleanHref, isRouteActive, isParentRouteActive } from "../utils";

describe("cleanHref", () => {
  it("strips page and pageSize params", () => {
    expect(
      cleanHref("/dashboard/applications?status=in-progress&page=1&pageSize=20")
    ).toBe("/dashboard/applications?status=in-progress");
  });

  it("returns pathname only when no remaining params", () => {
    expect(cleanHref("/dashboard/applications?page=2&pageSize=50")).toBe(
      "/dashboard/applications"
    );
  });

  it("is a no-op when no pagination params are present", () => {
    expect(cleanHref("/dashboard/applications?status=all-application")).toBe(
      "/dashboard/applications?status=all-application"
    );
  });

  it("handles plain paths with no query", () => {
    expect(cleanHref("/dashboard")).toBe("/dashboard");
  });
});

describe("isRouteActive", () => {
  it("returns true when pathname and status match", () => {
    expect(
      isRouteActive(
        "/dashboard/applications?status=in-progress",
        "/dashboard/applications",
        "in-progress"
      )
    ).toBe(true);
  });

  it("returns false when status differs", () => {
    expect(
      isRouteActive(
        "/dashboard/applications?status=in-progress",
        "/dashboard/applications",
        "in-approval"
      )
    ).toBe(false);
  });

  it("returns false when pathname differs", () => {
    expect(
      isRouteActive(
        "/dashboard/credit-analyst?status=in-progress",
        "/dashboard/applications",
        "in-progress"
      )
    ).toBe(false);
  });

  it("handles hrefs with pagination params", () => {
    expect(
      isRouteActive(
        "/dashboard/applications?status=in-progress&page=1&pageSize=20",
        "/dashboard/applications",
        "in-progress"
      )
    ).toBe(true);
  });
});

describe("isParentRouteActive", () => {
  const menu = {
    id: "applications",
    label: "Applications",
    href: "/dashboard/applications",
    children: [
      {
        id: "a1",
        label: "All",
        href: "/dashboard/applications?status=all-application",
      },
      {
        id: "a2",
        label: "In Progress",
        href: "/dashboard/applications?status=in-progress",
      },
    ],
  };

  it("returns true when a child is active", () => {
    expect(
      isParentRouteActive(menu, "/dashboard/applications", "in-progress")
    ).toBe(true);
  });

  it("returns false when no child matches", () => {
    expect(
      isParentRouteActive(menu, "/dashboard/reports", null)
    ).toBe(false);
  });
});
