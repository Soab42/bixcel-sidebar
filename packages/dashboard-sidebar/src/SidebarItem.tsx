"use client";

import React, { cloneElement, isValidElement } from "react";
import Link from "next/link";
import type { SidebarItemProps } from "./types";
import { cn, isParentRouteActive } from "./utils";
import { SidebarGroup } from "./SidebarGroup";

/**
 * Renders a single top-level menu item.
 *
 * - If the item has children → delegates to `SidebarGroup` (collapsible).
 * - If the item is a leaf → renders a direct `<Link>`.
 */
export function SidebarItem({
  item,
  user,
  counts,
  onHover,
  pathname,
  statusParam,
  isOpen,
  onToggle,
}: SidebarItemProps) {
  const hasChildren = Boolean(item.children && item.children.length > 0);
  const isActive = isParentRouteActive(item, pathname, statusParam);

  if (hasChildren) {
    return (
      <SidebarGroup
        item={item}
        user={user}
        counts={counts}
        onHover={onHover}
        pathname={pathname}
        statusParam={statusParam}
        isOpen={isOpen}
        onToggle={onToggle}
      />
    );
  }

  // Leaf node — direct link
  return (
    <div
      className={cn(
        "ml-4 md:ml-3 lg:ml-5 3xl:ml-6 fhd:ml-8 2k:ml-10 3k:ml-12 4k:ml-15",
        "mr-3 md:mr-2 lg:mr-4 3xl:mr-5 fhd:mr-6 2k:mr-7 3k:mr-8 4k:mr-9",
        "transition-all duration-300 border border-transparent",
        isActive
          ? "text-primaryText bg-primary/30 border-primary/30 rounded-md 3xl:rounded-xl fhd:rounded-2xl"
          : "hover:text-primaryText"
      )}
    >
      <Link
        href={item.disabled ? "#" : item.href}
        aria-disabled={item.disabled}
        aria-current={isActive ? "page" : undefined}
        onMouseEnter={() => !item.disabled && onHover?.(item.href)}
        target={item.isExternal ? "_blank" : undefined}
        rel={item.isExternal ? "noopener noreferrer" : undefined}
        className={cn(
          "sidebar_nav_link justify-between group",
          isActive ? "text-primaryText bg-primary/20" : "hover:text-primaryText",
          item.disabled && "opacity-50 cursor-not-allowed pointer-events-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
        )}
      >
        <div className="flex items-center gap-2 lg:gap-3 3xl:gap-4 fhd:gap-5 2k:gap-7 3k:gap-8 4k:gap-10">
          {isValidElement(item.icon) &&
            cloneElement(item.icon as React.ReactElement<{ className?: string }>, {
              className: cn(
                "min-w-3 w-3 3xl:w-5 3xl:min-w-5 fhd:w-7 fhd:min-w-7 2k:w-9 2k:min-w-9 3k:w-11 3k:min-w-11 4k:w-13 4k:min-w-13",
                "h-3 3xl:h-5 fhd:h-7 2k:h-9 3k:h-11 4k:h-13 transition duration-300",
                isActive
                  ? "fill-primary"
                  : "fill-secondaryText group-hover:fill-primary"
              ),
            })}
          <span>{item.label}</span>
        </div>

        {item.badge != null && item.badge !== 0 && (
          <span
            aria-label={`${item.badge} items`}
            className="inline-block px-2 py-0.5 rounded bg-secondaryText/15 text-secondaryText text-xs font-bold"
          >
            {item.badge}
          </span>
        )}
      </Link>
    </div>
  );
}

export default SidebarItem;
