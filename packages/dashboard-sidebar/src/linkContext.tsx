"use client";

import { createContext, useContext } from "react";
import type { AppUrlResolver, CurrentAppContext, ResolvedLink, SidebarMenuItem } from "./types";
import { resolveItemLink } from "./utils";

interface SidebarLinkValue {
  currentApp?: CurrentAppContext;
  appUrlResolver?: AppUrlResolver;
}

/**
 * Carries the current-app identity and cross-app URL resolver down to
 * `SidebarItem` / `SidebarGroup` so leaf and child links can be classified
 * without threading props through every level.
 */
const SidebarLinkContext = createContext<SidebarLinkValue>({});

export const SidebarLinkProvider = SidebarLinkContext.Provider;

/**
 * Returns a memo-free helper that classifies a menu item's link using the
 * current app context from the provider.
 */
export function useResolveLink(): (item: SidebarMenuItem) => ResolvedLink {
  const { currentApp, appUrlResolver } = useContext(SidebarLinkContext);
  return (item: SidebarMenuItem) =>
    resolveItemLink(item, currentApp, appUrlResolver);
}
