import { describe, it, expect } from "vitest";
import {
  validateSidebarConfig,
  safeParseSidebarConfig,
  SidebarConfigSchema,
} from "../schema";
import { crmSidebarConfig } from "../crmSidebarConfig";
import { adminSidebarConfig } from "../adminSidebarConfig";

describe("validateSidebarConfig", () => {
  it("validates crmSidebarConfig without throwing", () => {
    // icon fields are stripped from these configs — validation should pass
    expect(() => validateSidebarConfig(crmSidebarConfig)).not.toThrow();
  });

  it("validates adminSidebarConfig without throwing", () => {
    expect(() => validateSidebarConfig(adminSidebarConfig)).not.toThrow();
  });

  it("throws on invalid version format", () => {
    const invalid = { ...crmSidebarConfig, version: "v1.0" };
    expect(() => validateSidebarConfig(invalid)).toThrow();
  });

  it("throws when items array is empty", () => {
    const invalid = { ...crmSidebarConfig, items: [] };
    expect(() => validateSidebarConfig(invalid)).toThrow();
  });

  it("throws when a menu item has no label", () => {
    const invalid = {
      ...crmSidebarConfig,
      items: [{ id: 1, label: "", href: "/dashboard" }],
    };
    expect(() => validateSidebarConfig(invalid)).toThrow();
  });
});

describe("safeParseSidebarConfig", () => {
  it("returns success:true for valid config", () => {
    const result = safeParseSidebarConfig(crmSidebarConfig);
    expect(result.success).toBe(true);
  });

  it("returns success:false (not throws) for invalid config", () => {
    const result = safeParseSidebarConfig({ app: "", version: "bad", items: [] });
    expect(result.success).toBe(false);
  });
});

describe("SidebarConfigSchema — feature flag field", () => {
  it("accepts a config with featureFlag on an item", () => {
    const config = {
      app: "test",
      version: "1.0.0",
      items: [
        {
          id: "ref",
          label: "Referrers",
          href: "/dashboard/referrers",
          featureFlag: "referrals",
        },
      ],
    };
    expect(() => validateSidebarConfig(config)).not.toThrow();
  });
});
