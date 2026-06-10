# @bixcel/navigation-config

Typed navigation menu configuration for Bixcel SaaS dashboard apps.  
Provides Zod-validated config objects consumed by `@bixcel/dashboard-sidebar`.

## Installation

```bash
pnpm add @bixcel/navigation-config
```

## Usage

### Getting a config

```ts
import { getSidebarConfig } from "@bixcel/navigation-config";

const config = getSidebarConfig("crm");    // CRM / broker portal
const config = getSidebarConfig("admin");  // Admin / super-admin portal
```

### Role-based resolver

```ts
import { getSidebarConfigForRole } from "@bixcel/navigation-config";

// Returns admin config for admin/super_admin/root, crm config for everyone else
const config = getSidebarConfigForRole(user.role);
```

### Using a config directly

```ts
import { crmSidebarConfig } from "@bixcel/navigation-config";
```

### Injecting icons

Icons are not stored in the config (they are React elements and not
serialisable). Inject them in the consuming app:

```tsx
import { crmSidebarConfig } from "@bixcel/navigation-config";
import type { SidebarMenuItem } from "@bixcel/dashboard-sidebar";
import DashboardIcon from "@/components/icons/sidebar/dashboard-icon";

const ICON_MAP: Record<string, React.ReactNode> = {
  dashboard: <DashboardIcon />,
  applications: <ApplicationIcon />,
  // ...
};

function injectIcons(items: SidebarMenuItem[]): SidebarMenuItem[] {
  return items.map((item) => ({
    ...item,
    icon: ICON_MAP[String(item.id)] ?? item.icon,
    children: item.children ? injectIcons(item.children) : undefined,
  }));
}

const config = { ...crmSidebarConfig, items: injectIcons(crmSidebarConfig.items) };
```

### Validating a config with Zod

```ts
import { validateSidebarConfig, safeParseSidebarConfig } from "@bixcel/navigation-config";

// Throws ZodError on failure — use in tests or app startup
validateSidebarConfig(myConfig);

// Safe version — returns { success, data, error }
const result = safeParseSidebarConfig(myConfig);
if (!result.success) console.error(result.error.format());
```

## Feature Flag Example

Items with `featureFlag` are only shown when `user.enabledFeatures` includes
the flag string:

```ts
// In crmSidebarConfig.ts:
{
  id: "referrers",
  label: "Referrers",
  href: "/dashboard/referrers",
  requiredRoles: ["admin", "super_admin"],
  featureFlag: "referrals",   // ← only visible when "referrals" is enabled
}

// At runtime:
<DashboardSidebar
  config={crmSidebarConfig}
  user={{
    role: "admin",
    enabledFeatures: ["referrals"],  // ← referrers section appears
  }}
/>
```

## Emergency Rollback

```ts
import { setEmergencyConfig } from "@bixcel/navigation-config";

// Override all configs globally (e.g. via a feature-flag service)
setEmergencyConfig(minimalSafeConfig);

// Clear the override
setEmergencyConfig(null);
```

## Adding a New Config

1. Create `src/<appName>SidebarConfig.ts`
2. Register it in `getSidebarConfig.ts`
3. Add Zod contract test in `src/__tests__/schema.test.ts`
4. Export from `src/index.ts`
5. Bump minor version

## Development

```bash
pnpm dev        # watch mode
pnpm typecheck  # TypeScript check
pnpm test       # contract + unit tests
pnpm build      # production build
```
