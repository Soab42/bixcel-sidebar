import { z } from "zod";

// ---------------------------------------------------------------------------
// Zod schemas
// ---------------------------------------------------------------------------

export const BixcelRoleSchema = z.union([
  z.enum([
    "root",
    "client",
    "broker",
    "admin",
    "super_admin",
    "credit_analyst",
    "settlement_officer",
    "lawyer",
  ]),
  z.string(), // forward-compatibility with new roles
]);

/**
 * Recursive menu-item schema.
 *
 * `icon` is excluded — it is a React element and not JSON-serialisable.
 * Inject icons at runtime in the consuming app.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SidebarLinkTypeSchema = z.enum(["internal", "app", "external"]);

export const SidebarTargetAppSchema = z.object({
  key: z.string().min(1),
  subdomain: z.string().nullable().optional(),
});

export const SidebarMenuItemSchema: z.ZodTypeAny = z.lazy(() =>
  z.object({
    id: z.union([z.string(), z.number()]),
    label: z.string().min(1, "Label must not be empty"),
    href: z.string().min(1, "href must not be empty"),
    linkType: SidebarLinkTypeSchema.optional(),
    targetApp: SidebarTargetAppSchema.optional(),
    requiredRoles: z.array(BixcelRoleSchema).optional(),
    featureFlag: z.string().optional(),
    children: z.array(SidebarMenuItemSchema).optional(),
    isExternal: z.boolean().optional(),
    badge: z.union([z.number(), z.string(), z.null()]).optional(),
    disabled: z.boolean().optional(),
  })
);

export const SidebarConfigSchema = z.object({
  app: z.string().min(1, "app name must not be empty"),
  version: z
    .string()
    .regex(/^\d+\.\d+\.\d+$/, "version must be semver (e.g. 1.0.0)"),
  items: z
    .array(SidebarMenuItemSchema)
    .min(1, "config must have at least one item"),
});

// ---------------------------------------------------------------------------
// Inferred types (icon-free — suitable for JSON transport / server actions)
// ---------------------------------------------------------------------------

export type SidebarMenuItemInput = {
  id: string | number;
  label: string;
  href: string;
  linkType?: "internal" | "app" | "external";
  targetApp?: { key: string; subdomain?: string | null };
  requiredRoles?: string[];
  featureFlag?: string;
  children?: SidebarMenuItemInput[];
  isExternal?: boolean;
  badge?: number | string | null;
  disabled?: boolean;
};

export type SidebarConfigInput = {
  app: string;
  version: string;
  items: SidebarMenuItemInput[];
};

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

export function validateSidebarConfig(config: unknown): SidebarConfigInput {
  return SidebarConfigSchema.parse(config) as SidebarConfigInput;
}

export function safeParseSidebarConfig(config: unknown) {
  const result = SidebarConfigSchema.safeParse(config);
  if (result.success) {
    return { success: true as const, data: result.data as SidebarConfigInput };
  }
  return { success: false as const, error: result.error };
}
