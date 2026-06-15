import { describe, it, expect } from "vitest";
import { resolveItemLink } from "../utils";
import type { AppUrlResolver, CurrentAppContext, SidebarMenuItem } from "../types";

const currentApp: CurrentAppContext = { appKey: "crm", subdomain: "crm" };
const resolver: AppUrlResolver = (app, href) =>
  `https://${app.subdomain}.bixcel.net${href}`;

const item = (over: Partial<SidebarMenuItem>): SidebarMenuItem => ({
  id: "x",
  label: "X",
  href: "/dashboard",
  ...over,
});

describe("resolveItemLink", () => {
  it("treats a plain item as internal client-side nav", () => {
    expect(resolveItemLink(item({}), currentApp, resolver)).toEqual({
      href: "/dashboard",
      isInternalNav: true,
      openInNewTab: false,
    });
  });

  it("treats legacy isExternal as an external new-tab link", () => {
    expect(
      resolveItemLink(item({ href: "https://x.io", isExternal: true }), currentApp, resolver)
    ).toEqual({ href: "https://x.io", isInternalNav: false, openInNewTab: true });
  });

  it("treats linkType=external as a new-tab link", () => {
    const r = resolveItemLink(item({ href: "https://docs.io", linkType: "external" }), currentApp, resolver);
    expect(r.isInternalNav).toBe(false);
    expect(r.openInNewTab).toBe(true);
  });

  it("resolves a cross-app link to an absolute URL, same-tab full nav", () => {
    const r = resolveItemLink(
      item({ href: "/dealers", linkType: "app", targetApp: { key: "dealer", subdomain: "dealer" } }),
      currentApp,
      resolver
    );
    expect(r).toEqual({
      href: "https://dealer.bixcel.net/dealers",
      isInternalNav: false,
      openInNewTab: false,
    });
  });

  it("treats an app link pointing at the current app as internal", () => {
    const r = resolveItemLink(
      item({ href: "/self", linkType: "app", targetApp: { key: "crm", subdomain: "crm" } }),
      currentApp,
      resolver
    );
    expect(r).toEqual({ href: "/self", isInternalNav: true, openInNewTab: false });
  });

  it("falls back to the raw href for a cross-app link when no resolver is given", () => {
    const r = resolveItemLink(
      item({ href: "/dealers", linkType: "app", targetApp: { key: "dealer" } }),
      currentApp
    );
    expect(r).toEqual({ href: "/dealers", isInternalNav: false, openInNewTab: false });
  });
});
