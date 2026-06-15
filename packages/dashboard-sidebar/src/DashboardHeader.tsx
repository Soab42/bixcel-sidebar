"use client";

import React from "react";
import type { DashboardHeaderProps } from "./types";

/**
 * DashboardHeader
 *
 * Production-ready top navigation bar for Bixcel dashboard apps.
 *
 * Renders a fixed, full-width header bar that sits above the sidebar and
 * main content. All content areas are injected as slots — no Next.js auth,
 * image, or notification imports at package level.
 *
 * Responsive heights match the Bixcel breakpoint scale:
 *   mobile  : h-11  (44 px)
 *   lg      : h-14  (56 px)
 *   3xl     : h-20  (80 px)
 *   fhd     : h-24  (96 px)
 *   2k      : h-32  (128 px)
 *   3k      : h-40  (160 px)
 *   4k      : h-50  (200 px)
 */
export function DashboardHeader({
  leftSlot,
  logoSlot,
  rightSlot,
  className,
}: DashboardHeaderProps) {
  return (
    // Placeholder that reserves the header height in the layout flow.
    // The inner div is fixed so it stays on top of scrollable content.
    <header
      className={[
        "h-11 lg:h-14 3xl:h-20 fhd:h-24 2k:h-32 3k:h-40 4k:h-50 !z-40",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Fixed bar — covers the full viewport width */}
      <div className="fixed top-0 inset-x-0 w-full h-11 lg:h-14 3xl:h-20 fhd:h-24 2k:h-32 3k:h-40 4k:h-50 inline-flex items-center justify-center gap-5 bg-white px-4 md:px-5 lg:px-6 3xl:px-8 fhd:px-12 2k:px-14 3k:px-17 4k:px-22 border-b border-b-secondaryText border-opacity-10 !z-40">
        <nav className="w-full h-full flex items-center justify-between">
          {/* Left — sidebar toggle */}
          <div className="flex items-center">{leftSlot}</div>

          {/* Centre — app icon / logo */}
          <div className="inline-flex items-center gap-3">{logoSlot}</div>

          {/* Right — notifications, avatar, etc. */}
          <div className="flex items-center gap-3 3xl:gap-5 fhd:gap-6 2k:gap-8 3k:gap-12 4k:gap-16">
            {rightSlot}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default DashboardHeader;
