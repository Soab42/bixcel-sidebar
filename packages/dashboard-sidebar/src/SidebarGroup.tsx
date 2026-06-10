"use client";

import React, { cloneElement, isValidElement } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { SidebarGroupProps } from "./types";
import { cn, isParentRouteActive, isRouteActive, cleanHref } from "./utils";

/**
 * A collapsible menu group — renders a parent item with a chevron toggle and
 * an animated child list.  Child items that are not visible for the current
 * user have already been filtered out before this component is rendered.
 */
export function SidebarGroup({
  item,
  counts,
  onHover,
  pathname,
  statusParam,
  isOpen,
  onToggle,
}: SidebarGroupProps) {
  const parentActive = isParentRouteActive(item, pathname, statusParam);

  return (
    <div
      className={cn(
        "ml-4 md:ml-3 lg:ml-5 3xl:ml-6 fhd:ml-8 2k:ml-10 3k:ml-12 4k:ml-15",
        "mr-3 md:mr-2 lg:mr-4 3xl:mr-5 fhd:mr-6 2k:mr-7 3k:mr-8 4k:mr-9",
        "transition-all duration-300 border border-transparent",
        (parentActive || isOpen)
          ? "text-primaryText bg-primary/20 border-primary/30 rounded-md 3xl:rounded-xl fhd:rounded-2xl"
          : "hover:text-primaryText"
      )}
    >
      {/* Parent row */}
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={`sidebar-children-${item.id}`}
        onClick={onToggle}
        className={cn(
          "sidebar_nav_link justify-between group w-full text-left",
          parentActive ? "text-primaryText bg-primary/20" : "hover:text-primaryText",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
        )}
      >
        <div className="flex items-center gap-2 lg:gap-3 3xl:gap-4 fhd:gap-5 2k:gap-7 3k:gap-8 4k:gap-10">
          {isValidElement(item.icon) &&
            cloneElement(item.icon as React.ReactElement<{ className?: string }>, {
              className: cn(
                "min-w-3 w-3 3xl:w-5 3xl:min-w-5 fhd:w-7 fhd:min-w-7 2k:w-9 2k:min-w-9 3k:w-11 3k:min-w-11 4k:w-13 4k:min-w-13",
                "h-3 3xl:h-5 fhd:h-7 2k:h-9 3k:h-11 4k:h-13",
                "transition duration-300",
                parentActive
                  ? "fill-primary"
                  : "fill-secondaryText group-hover:fill-primary"
              ),
            })}
          <span>{item.label}</span>
        </div>

        <span className="flex items-center gap-1">
          {typeof item.badge === "number" && item.badge > 0 && (
            <span className="rounded-full bg-primary text-white text-[8px] px-1.5 py-0.5 font-semibold leading-none">
              {item.badge}
            </span>
          )}
          {isOpen ? (
            <ChevronDown
              aria-hidden="true"
              className="size-2.5 min-w-2.5 3xl:size-4 3xl:min-w-4 fhd:size-5 fhd:min-w-5 2k:size-7 3k:size-8 4k:size-10"
            />
          ) : (
            <ChevronRight
              aria-hidden="true"
              className="size-2.5 min-w-2.5 3xl:size-4 3xl:min-w-4 fhd:size-5 fhd:min-w-5 2k:size-7 3k:size-8 4k:size-10"
            />
          )}
        </span>
      </button>

      {/* Child list */}
      {isOpen && item.children && item.children.length > 0 && (
        <ul
          id={`sidebar-children-${item.id}`}
          role="list"
          className="my-4 4k:my-8 mr-2 lg:mr-3 3xl:mr-4 2k:mr-7 3k:mr-10 4k:mr-14"
        >
          {item.children.map((child) => {
            const childActive = isRouteActive(child.href, pathname, statusParam);
            const childCount = counts?.[cleanHref(child.href)];

            return (
              <li
                key={child.id}
                className={cn(
                  "pt-2 3xl:pt-3 fhd:pt-4 2k:pt-5 3k:pt-6 4k:pt-7 first:pt-0 relative",
                  "before:absolute before:content-[''] before:h-full last:before:h-1/2",
                  "before:w-px before:2k:w-0.5 before:bg-secondaryText",
                  "before:top-0 before:-left-3 before:3xl:-left-5 before:fhd:-left-7 before:2k:-left-9 before:3k:-left-11 before:4k:-left-14",
                  "ml-5 3xl:ml-10 fhd:ml-12 2k:ml-17 3k:ml-22 4k:ml-28"
                )}
              >
                <Link
                  href={child.disabled ? "#" : child.href}
                  aria-disabled={child.disabled}
                  aria-current={childActive ? "page" : undefined}
                  onMouseEnter={() => !child.disabled && onHover?.(child.href)}
                  target={child.isExternal ? "_blank" : undefined}
                  rel={child.isExternal ? "noopener noreferrer" : undefined}
                  className={cn(
                    "text-[8px] lg:text-mxs 3xl:text-base fhd:text-lg 2k:text-2.5xl 3k:text-3.5xl 4k:text-4.5xl",
                    "text-primaryText font-semibold w-full transition-all duration-300",
                    "h-6 lg:h-8 3xl:h-10 fhd:h-12 2k:h-18 3k:h-22 4k:h-26",
                    "px-2 py-1.5 3xl:px-3.5 2k:px-6 3k:px-8 4k:px-12",
                    "rounded-md 3xl:rounded-xl fhd:rounded-2xl 2k:rounded-3xl 3k:rounded-4xl 4k:rounded-5xl",
                    "inline-flex items-center relative",
                    // connector line decoration
                    "before:absolute before:content-[''] before:w-2 before:h-4",
                    "before:3xl:w-3 before:3xl:h-5 before:fhd:h-6 before:2k:w-6 before:2k:h-9 before:3k:h-13 before:4k:w-6 before:4k:h-15",
                    "before:border-l before:border-b 2k:before:border-l-2 2k:before:border-b-2 before:border-secondaryText",
                    "before:rounded-bl-xl before:3xl:rounded-bl-lg before:2k:rounded-bl-2xl before:3k:rounded-bl-3xl",
                    "before:-left-3 before:3xl:-left-5 before:fhd:-left-7 before:2k:-left-9 before:3k:-left-11 before:4k:-left-14",
                    "before:bottom-3 before:lg:bottom-[13px] before:3xl:bottom-5 before:fhd:bottom-6 before:2k:bottom-8 before:3k:bottom-10 before:4k:bottom-12",
                    childActive ? "bg-secondaryText/10" : "hover:bg-secondaryText/10",
                    child.disabled && "opacity-50 cursor-not-allowed pointer-events-none"
                  )}
                >
                  {child.label}
                  {childCount != null && childCount > 0 && (
                    <span
                      aria-label={`${childCount} items`}
                      className={cn(
                        "rounded-full max-w-max bg-white border border-gray-200",
                        "px-2 2k:px-3 4k:px-4 py-2 min-w-4",
                        "h-4 3xl:h-7 fhd:h-8 2k:h-10 3k:h-12 4k:h-15",
                        "flex items-center justify-center ml-2 2k:ml-3 4k:ml-5",
                        "text-[8px] lg:text-xs 3xl:text-sm fhd:text-base 2k:text-2xl 3k:text-3xl 4k:text-3.5xl font-medium"
                      )}
                    >
                      {childCount}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default SidebarGroup;
