// Components
export { DashboardHeader } from "./DashboardHeader";
export { DashboardSidebar } from "./DashboardSidebar";
export { SidebarItem } from "./SidebarItem";
export { SidebarGroup } from "./SidebarGroup";
export { SidebarCollapseButton } from "./SidebarCollapseButton";

// Types
export type {
  BixcelRole,
  UserContext,
  SidebarMenuItem,
  SidebarConfig,
  MenuCountMap,
  OnMenuHover,
  OnRefreshCounts,
  DashboardSidebarProps,
  DashboardHeaderProps,
  SidebarItemProps,
  SidebarGroupProps,
  SidebarCollapseButtonProps,
} from "./types";

// Utilities
export {
  cleanHref,
  isRouteActive,
  isParentRouteActive,
  isItemVisible,
  filterMenuItems,
  cn,
} from "./utils";

// Zod validation
export {
  BixcelRoleSchema,
  SidebarMenuItemSchema,
  SidebarConfigSchema,
  validateSidebarConfig,
  safeParseSidebarConfig,
} from "./schema";
export type { SidebarMenuItemInput, SidebarConfigInput } from "./schema";
