// ---------------------------------------------------------------------------
// Server-safe entry — pure helpers + shared types only.
//
// This module contains NO React client boundaries (`"use client"`, hooks,
// `createContext`), so it is importable from React Server Components. Import
// the client components (`DashboardSidebar`, `DashboardHeader`, `SidebarIcon`)
// from the package root instead.
// ---------------------------------------------------------------------------

// Pure utilities
export {
  cleanHref,
  isRouteActive,
  isParentRouteActive,
  isItemVisible,
  filterMenuItems,
  resolveItemLink,
  cn,
} from "./utils";

// Shared types
export type {
  BixcelRole,
  UserContext,
  SidebarMenuItem,
  SidebarConfig,
  SidebarMenuItemInput,
  SidebarConfigInput,
  SidebarLinkType,
  SidebarTargetApp,
  CurrentAppContext,
  AppUrlResolver,
  ResolvedLink,
  MenuCountMap,
  OnMenuHover,
  DashboardSidebarProps,
  DashboardHeaderProps,
  IconDescriptor,
  SidebarIconProps,
} from "./types";
