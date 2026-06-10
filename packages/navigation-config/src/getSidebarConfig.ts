import type { SidebarConfig, BixcelRole } from "@bixcel/dashboard-sidebar";
import { crmSidebarConfig } from "./crmSidebarConfig";
import { adminSidebarConfig } from "./adminSidebarConfig";

// ---------------------------------------------------------------------------
// App-to-config registry
// ---------------------------------------------------------------------------

type AppName = "crm" | "admin";

const CONFIG_REGISTRY: Record<AppName, SidebarConfig> = {
  crm: crmSidebarConfig,
  admin: adminSidebarConfig,
};

/**
 * Returns the sidebar config for the given app.
 *
 * @example
 * const config = getSidebarConfig("crm");
 */
export function getSidebarConfig(app: AppName): SidebarConfig {
  const config = CONFIG_REGISTRY[app];
  if (!config) {
    throw new Error(
      `[navigation-config] No sidebar config registered for app "${app}". ` +
        `Available apps: ${Object.keys(CONFIG_REGISTRY).join(", ")}`
    );
  }
  return config;
}

// ---------------------------------------------------------------------------
// Role → default app resolver
// ---------------------------------------------------------------------------

/**
 * Maps a user role to the most appropriate app config.
 * Falls back to CRM config for all broker/client flows.
 */
export function getSidebarConfigForRole(role: BixcelRole | string): SidebarConfig {
  const adminRoles: (BixcelRole | string)[] = ["admin", "super_admin", "root"];
  if (adminRoles.includes(role)) return adminSidebarConfig;
  return crmSidebarConfig;
}

// ---------------------------------------------------------------------------
// Emergency rollback override
// ---------------------------------------------------------------------------

let _overrideConfig: SidebarConfig | null = null;

/**
 * Sets a global emergency override config.
 *
 * When set, ALL calls to `getSidebarConfig` and `getSidebarConfigForRole`
 * return this config regardless of app name or role.
 *
 * Use this for emergency rollbacks:
 * ```ts
 * // In a feature-flag service or runtime config:
 * setEmergencyConfig(safeMinimalConfig);
 * ```
 *
 * To clear the override:
 * ```ts
 * setEmergencyConfig(null);
 * ```
 */
export function setEmergencyConfig(config: SidebarConfig | null): void {
  _overrideConfig = config;
  if (config) {
    console.warn(
      `[navigation-config] EMERGENCY CONFIG ACTIVE for app "${config.app}" v${config.version}. ` +
        "All sidebar configs are overridden. Clear with setEmergencyConfig(null)."
    );
  } else {
    console.info("[navigation-config] Emergency config cleared. Normal routing restored.");
  }
}

/**
 * Returns true when an emergency override is active.
 */
export function isEmergencyConfigActive(): boolean {
  return _overrideConfig !== null;
}
