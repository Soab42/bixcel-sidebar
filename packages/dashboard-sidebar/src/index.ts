// Components
export { DashboardHeader } from "./DashboardHeader";
export { DashboardSidebar } from "./DashboardSidebar";
export { SidebarItem } from "./SidebarItem";
export { SidebarGroup } from "./SidebarGroup";
export { SidebarCollapseButton } from "./SidebarCollapseButton";
export { SidebarIcon } from "./SidebarIcon";

// Types
export type {
  BixcelRole,
  UserContext,
  SidebarMenuItem,
  SidebarConfig,
  SidebarLinkType,
  SidebarTargetApp,
  CurrentAppContext,
  AppUrlResolver,
  ResolvedLink,
  MenuCountMap,
  OnMenuHover,
  OnRefreshCounts,
  DashboardSidebarProps,
  DashboardHeaderProps,
  SidebarItemProps,
  SidebarGroupProps,
  SidebarCollapseButtonProps,
  IconDescriptor,
  SidebarIconProps,
} from "./types";

// Utilities
export {
  cleanHref,
  isRouteActive,
  isParentRouteActive,
  isItemVisible,
  filterMenuItems,
  resolveItemLink,
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
