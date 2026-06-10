# Governance & Release Process

## Package Ownership

| Package | Primary Owner | Secondary Owner |
|---|---|---|
| `@bixcel/dashboard-sidebar` | Design System / Frontend Platform | — |
| `@bixcel/navigation-config` | Frontend Platform | Product Owners |

Changes to `dashboard-sidebar` require approval from at least one member of
`@bixcel-org/design-system`. Changes to `navigation-config` require approval
from both `@bixcel-org/frontend-platform` AND `@bixcel-org/product-owners`
because route changes affect live user flows.

## Release Process

### 1. Branch strategy
- All changes land on feature branches: `feat/<package>/<description>`
- Hotfixes branch from `main`: `hotfix/<package>/<description>`
- No direct commits to `main`

### 2. PR checklist
Before merging:
- [ ] `pnpm typecheck` passes
- [ ] `pnpm test` passes (unit + contract + a11y)
- [ ] `CHANGELOG.md` updated under `[Unreleased]`
- [ ] CODEOWNERS review approved
- [ ] `version` in `package.json` bumped appropriately (see versioning policy)

### 3. Tagging & publishing
```bash
# Bump version in package.json
pnpm version patch   # or minor / major

# Create git tag
git tag @bixcel/dashboard-sidebar@1.0.1
git push origin --tags

# Publish to internal npm registry
pnpm publish --filter @bixcel/dashboard-sidebar
```

### 4. Announce the release
Post in `#frontend-platform` Slack with:
- Package name + version
- Summary of changes
- Migration steps if breaking
- Link to PR

---

## Emergency Rollback Strategy

If a sidebar config deployment causes a production incident (broken navigation,
role leak, missing menu items):

### Option A — Config override (< 5 min)
Use `setEmergencyConfig()` at runtime via a feature-flag service:

```ts
// In your feature-flag initialisation (runs on app boot):
import { setEmergencyConfig } from "@bixcel/navigation-config";
import { minimalSafeConfig } from "./emergency-configs";

if (featureFlags.SIDEBAR_EMERGENCY_ROLLBACK) {
  setEmergencyConfig(minimalSafeConfig);
}
```

The override takes effect immediately for all new renders. No deployment needed.

### Option B — Package version pin (< 15 min)
Pin the consuming app to the last known good version:

```bash
# In apps/crm/package.json:
"@bixcel/navigation-config": "1.0.0"  # pin to previous

pnpm install && pnpm build && git push
```

Trigger a redeploy via CI.

### Option C — Feature flag (runtime)
If your platform has a runtime feature-flag service, gate the new config behind
a flag and flip it off without any code deployment.

### Rollback decision matrix

| Severity | Time budget | Recommended action |
|---|---|---|
| P0 — nav broken for all users | < 5 min | Option A (config override) |
| P1 — role leak / wrong items shown | < 5 min | Option A, then B |
| P2 — visual regression | < 15 min | Option B |
| P3 — minor cosmetic issue | Next deploy | Fix forward |

---

## Adding a New App

1. Create your config in `packages/navigation-config/src/<appName>SidebarConfig.ts`
2. Validate it with `validateSidebarConfig(yourConfig)` in a test
3. Register it in `getSidebarConfig.ts`
4. Add CODEOWNER entry in `CODEOWNERS`
5. Bump `navigation-config` minor version

---

## Adding a New Role

1. Add the role string to `BixcelRole` union in `@bixcel/dashboard-sidebar/src/types.ts`
2. Add it to `BixcelRoleSchema` in `@bixcel/navigation-config/src/schema.ts`
3. Update `requiredRoles` arrays in affected config files
4. Run `pnpm typecheck` and `pnpm test` across both packages
5. Bump both packages' minor version
6. Update CHANGELOG under `[Unreleased]`
