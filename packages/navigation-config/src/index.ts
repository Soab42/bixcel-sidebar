// Configs
export { crmSidebarConfig } from "./crmSidebarConfig";
export { adminSidebarConfig } from "./adminSidebarConfig";

// Config resolution
export {
  getSidebarConfig,
  getSidebarConfigForRole,
  setEmergencyConfig,
  isEmergencyConfigActive,
} from "./getSidebarConfig";

// Zod validation
export {
  BixcelRoleSchema,
  SidebarMenuItemSchema,
  SidebarConfigSchema,
  validateSidebarConfig,
  safeParseSidebarConfig,
} from "./schema";

// Inferred schema types
export type { SidebarMenuItemInput, SidebarConfigInput } from "./schema";
