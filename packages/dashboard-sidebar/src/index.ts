// Components
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
  SidebarItemProps,
  SidebarGroupProps,
  SidebarCollapseButtonProps,
} from "./types";

// Utilities (exported for consumers who need them, e.g. navigation-config)
export {
  cleanHref,
  isRouteActive,
  isParentRouteActive,
  isItemVisible,
  filterMenuItems,
  cn,
} from "./utils";
