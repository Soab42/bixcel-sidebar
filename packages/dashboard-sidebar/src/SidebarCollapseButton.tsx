"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { SidebarCollapseButtonProps } from "./types";
import { cn } from "./utils";

/**
 * Icon button that toggles the sidebar between collapsed and expanded states.
 * Rendered at the bottom of the sidebar or in the header bar.
 */
export function SidebarCollapseButton({
  isExpanded,
  onToggle,
  className,
}: SidebarCollapseButtonProps) {
  return (
    <button
      type="button"
      aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
      aria-expanded={isExpanded}
      onClick={onToggle}
      className={cn(
        "flex items-center justify-center w-6 h-6 rounded-full",
        "border border-secondaryText/20 bg-white shadow-sm",
        "hover:border-primary/50 hover:bg-primary/5",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        "transition-colors duration-200",
        className
      )}
    >
      {isExpanded ? (
        <ChevronLeft className="w-3 h-3 text-secondaryText" aria-hidden="true" />
      ) : (
        <ChevronRight className="w-3 h-3 text-secondaryText" aria-hidden="true" />
      )}
    </button>
  );
}

export default SidebarCollapseButton;
