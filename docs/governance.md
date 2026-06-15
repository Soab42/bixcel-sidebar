# Governance & Release Process

## Package Ownership

| Package | Primary Owner | Secondary Owner |
|---|---|---|
| `@soab42/dashboard-sidebar` | Design System / Frontend Platform | Product Owners |

Changes to UI components require approval from `@bixcel-org/design-system`.
Changes that affect navigation structure (types, Zod schemas) require approval from `@bixcel-org/product-owners` because route shape changes affect live user flows.

## Release Process

### 1. Branch strategy
- Feature branches: `feat/dashboard-sidebar/<description>`
- Hotfixes: `hotfix/dashboard-sidebar/<description>`
- No direct commits to `main`

### 2. PR checklist
- [ ] `pnpm typecheck` passes
- [ ] `pnpm test` passes (unit + a11y)
- [ ] `CHANGELOG.md` updated under `[Unreleased]`
- [ ] CODEOWNERS review approved
- [ ] `version` in `package.json` bumped appropriately

### 3. Tagging & publishing
```bash
cd packages/dashboard-sidebar
pnpm version patch   # or minor / major
git tag @soab42/dashboard-sidebar@<version>
git push origin --tags
pnpm publish --filter @soab42/dashboard-sidebar
```

### 4. Announce the release
Post in `#frontend-platform` Slack with version, summary of changes, migration steps if breaking.

---

## Adding a New UI Component

1. Create `packages/dashboard-sidebar/src/<ComponentName>.tsx`
2. Add types to `src/types.ts`
3. Export from `src/index.ts`
4. Write unit + a11y tests
5. Update `packages/dashboard-sidebar/README.md`
6. Bump minor version

## Adding a New Role

1. Add the role string to `BixcelRole` union in `src/types.ts`
2. Add it to `BixcelRoleSchema` in `src/schema.ts`
3. Run `pnpm typecheck` and `pnpm test`
4. Bump minor version, update CHANGELOG

## Updating Navigation Structure

Navigation config is API-driven — the `SidebarConfig` / `SidebarMenuItem` types in this package define the contract between the API and the UI. If the shape needs to change:

1. Update `SidebarConfig` / `SidebarMenuItem` in `src/types.ts`
2. Update `SidebarMenuItemSchema` / `SidebarConfigSchema` in `src/schema.ts`
3. Update the API to return the new shape
4. Bump major version if the change is breaking, minor if additive

---

## Emergency Rollback

If a nav config change causes a production incident, the API is the source of truth — roll back the API response to the previous shape. No package deployment needed.

For component-level issues, pin the consuming app to the last known good version:

```bash
# In bixcel-frontend/package.json
"@soab42/dashboard-sidebar": "1.0.0"
pnpm install && pnpm build
```

### Rollback decision matrix

| Severity | Action |
|---|---|
| P0 — nav broken for all users | Roll back API config response |
| P1 — role leak / wrong items shown | Roll back API, then pin package version |
| P2 — visual regression | Pin package version, fix forward |
| P3 — cosmetic | Fix forward |
