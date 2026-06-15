"use client";

import React, { cloneElement, isValidElement } from "react";
import type { SidebarIconProps } from "./types";
import { cn } from "./utils";

/**
 * SidebarIcon
 *
 * Hybrid icon renderer for config-driven sidebars. Resolution depends on the
 * registry `source` carried by the optional `descriptor`:
 *
 *  - `bundled` (or no descriptor) → renders the app-provided `bundled` element.
 *    The package never ships SVG components — each app supplies its own via its
 *    icon map and passes the resolved element here.
 *  - `url`    → CSS-mask (monochrome, themeable via `currentColor`) or `<img>`.
 *  - `inline` → raw SVG markup. The backend sanitizes markup on save; add a
 *    client-side sanitizer (e.g. DOMPurify) here if the source becomes untrusted.
 *
 * `url`/`inline` icons are fully backend-driven, so admins can add icons with no
 * frontend deploy. The `className` prop is forwarded to the rendered element —
 * when this component is used as a menu item's `icon`, the sidebar injects its
 * sizing/colour classes here via `React.cloneElement`.
 *
 * @example
 * ```tsx
 * // In the consuming app's injectIcons():
 * icon: <SidebarIcon descriptor={item.iconDescriptor} bundled={ICON_MAP[item.icon]} />
 * ```
 */
export function SidebarIcon({ descriptor, bundled, className }: SidebarIconProps) {
  // No descriptor or an explicitly-bundled icon → use the app-provided element.
  if (!descriptor || descriptor.source === "bundled") {
    if (isValidElement(bundled)) {
      return cloneElement(
        bundled as React.ReactElement<{ className?: string }>,
        { className },
      );
    }
    return <>{bundled ?? null}</>;
  }

  if (descriptor.source === "url" && descriptor.svg_url) {
    return descriptor.is_monochrome ? (
      <span
        aria-hidden
        className={cn("inline-block", className)}
        style={{
          WebkitMaskImage: `url(${descriptor.svg_url})`,
          maskImage: `url(${descriptor.svg_url})`,
          backgroundColor: "currentColor",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskSize: "contain",
          maskSize: "contain",
        }}
      />
    ) : (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={descriptor.svg_url} alt="" aria-hidden className={className} />
    );
  }

  if (descriptor.source === "inline" && descriptor.svg_markup) {
    // The sidebar injects both `fill-*` and `text-*` classes onto this wrapper.
    // Monochrome inline SVGs that use `currentColor` (Lucide stroke icons, or
    // `fill="currentColor"`) inherit the wrapper's `color`, so they theme on the
    // same secondaryText → primary (hover/active) scheme. The svg is sized to
    // fill the wrapper.
    return (
      <span
        aria-hidden
        className={cn("inline-flex [&>svg]:w-full [&>svg]:h-full", className)}
        dangerouslySetInnerHTML={{ __html: descriptor.svg_markup }}
      />
    );
  }

  // Descriptor present but no usable payload → fall back to bundled (or nothing).
  return <>{bundled ?? null}</>;
}

export default SidebarIcon;
