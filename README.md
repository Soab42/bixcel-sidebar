# Bixcel Sidebar Monorepo

Monorepo for `@bixcel/dashboard-sidebar` and `@bixcel/navigation-config` — shared, production-quality sidebar packages for Bixcel SaaS dashboard apps.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Repo Setup](#repo-setup)
- [Local Development](#local-development)
- [Using Packages in Another App Locally](#using-packages-in-another-app-locally)
- [Running Tests](#running-tests)
- [Building for Production](#building-for-production)
- [Publishing to a Private Registry](#publishing-to-a-private-registry)
- [Consuming Published Packages](#consuming-published-packages)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

| Tool | Minimum version | Why |
|---|---|---|
| Node.js | 18.x | Required by Next.js 14+ |
| pnpm | 9.x | Workspace manager used in this repo |
| Git | any | Version control |

Install pnpm if you don't have it:

```bash
npm install -g pnpm@9
```

---

## Repo Setup

```bash
# Clone
git clone git@github.com:bixcel-org/bixcel-sidebar.git
cd bixcel-sidebar

# Install all dependencies for every package in the monorepo
pnpm install
```

This installs dependencies for all workspaces (`packages/*` and `apps/*`) in one go and links local packages to each other automatically via pnpm workspaces.

---

## Local Development

### Watch mode (recommended during active development)

Open two terminals — one per package:

```bash
# Terminal 1 — sidebar UI package
cd packages/dashboard-sidebar
pnpm dev
```

```bash
# Terminal 2 — navigation config package
cd packages/navigation-config
pnpm dev
```

Both commands run `tsup` in watch mode. Every time you save a source file the package rebuilds and the consuming app hot-reloads automatically.

### Run from the monorepo root

If you have Turborepo installed you can run all packages in parallel:

```bash
pnpm dev   # runs "dev" in every workspace concurrently
```

### TypeScript checking

```bash
# Check a single package
cd packages/dashboard-sidebar
pnpm typecheck

# Check everything from the root
pnpm typecheck
```

---

## Using Packages in Another App Locally

There are two ways to consume these packages in `bixcel-frontend` or any other local app before publishing.

### Option A — pnpm workspace protocol (recommended)

If both repos are siblings in the same monorepo or you add `bixcel-frontend` as a workspace app, use the `workspace:*` protocol:

```jsonc
// apps/crm/package.json  (or bixcel-frontend/package.json)
{
  "dependencies": {
    "@bixcel/dashboard-sidebar": "workspace:*",
    "@bixcel/navigation-config": "workspace:*"
  }
}
```

Then run `pnpm install` from the repo root. pnpm symlinks the local `dist/` folders — no publishing needed.

**Make sure to build the packages first:**

```bash
pnpm build   # from monorepo root — builds both packages
```

### Option B — `pnpm link` (for a separate repo)

Use this when `bixcel-frontend` lives in a completely separate directory.

```bash
# 1. Build and register the packages globally
cd packages/dashboard-sidebar
pnpm build
pnpm link --global

cd ../navigation-config
pnpm build
pnpm link --global

# 2. In the bixcel-frontend repo, link them
cd /path/to/bixcel-frontend
pnpm link --global @bixcel/dashboard-sidebar
pnpm link --global @bixcel/navigation-config
```

To unlink when done:

```bash
cd /path/to/bixcel-frontend
pnpm unlink @bixcel/dashboard-sidebar
pnpm unlink @bixcel/navigation-config
pnpm install   # restore normal resolution
```

### Option C — direct path in package.json

Quick and zero-config. Point directly at the local dist folder:

```jsonc
// bixcel-frontend/package.json
{
  "dependencies": {
    "@bixcel/dashboard-sidebar": "file:../bixcel-sidebar/packages/dashboard-sidebar",
    "@bixcel/navigation-config": "file:../bixcel-sidebar/packages/navigation-config"
  }
}
```

Run `pnpm install` in `bixcel-frontend` after adding these entries.

> **Tip:** With Options B and C you must rebuild the packages (`pnpm build`) every time you change source files. Option A + watch mode is the smoothest DX.

---

## Running Tests

### Unit tests (filtering logic, utilities)

```bash
# Single package
cd packages/dashboard-sidebar
pnpm test

# All packages from root
pnpm test
```

### Watch mode

```bash
pnpm test:watch
```

### Contract tests (Zod schema validation)

```bash
cd packages/navigation-config
pnpm test
```

### Accessibility tests (axe)

```bash
cd packages/dashboard-sidebar
pnpm test:a11y
```

These tests render the sidebar in a jsdom environment and run `jest-axe` against it. They require the following in `vitest.config.ts`:

```ts
// packages/dashboard-sidebar/vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/__tests__/setup.ts"],
  },
});
```

### All tests from the root

```bash
pnpm test        # runs all test suites once
pnpm test:watch  # watch mode
```

---

## Building for Production

```bash
# Build both packages
pnpm build

# Build a single package
cd packages/dashboard-sidebar
pnpm build
```

Build output lands in `packages/<name>/dist/`:

```
dist/
  index.js       ← CommonJS bundle
  index.mjs      ← ESM bundle
  index.d.ts     ← TypeScript declarations
  index.d.ts.map ← Declaration source maps
```

Verify the build is correct before publishing:

```bash
# Check that all expected exports are present
node -e "const s = require('./packages/dashboard-sidebar/dist/index.js'); console.log(Object.keys(s))"
```

---

## Publishing to a Private Registry

This repo is configured to publish to the **GitHub Packages npm registry** (`https://npm.pkg.github.com`). Adjust the registry URL in `package.json` if you use a different private registry (Verdaccio, Nexus, AWS CodeArtifact, etc.).

### 1. Authenticate

Create a GitHub Personal Access Token (PAT) with the `write:packages` scope at  
`https://github.com/settings/tokens`

Add it to your `~/.npmrc`:

```
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_PAT
```

Or export it as an environment variable (useful in CI):

```bash
export NODE_AUTH_TOKEN=YOUR_GITHUB_PAT
```

### 2. Set the registry in `.npmrc` (repo-level)

Create `.npmrc` at the repo root if it doesn't exist:

```
@bixcel:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

### 3. Build the packages

```bash
pnpm build
```

### 4. Bump the version

Follow semantic versioning (see [CHANGELOG.md](./CHANGELOG.md) for the policy).

```bash
# From the package directory
cd packages/dashboard-sidebar
pnpm version patch    # 1.0.0 → 1.0.1  (bug fix)
pnpm version minor    # 1.0.0 → 1.1.0  (new feature, backward compatible)
pnpm version major    # 1.0.0 → 2.0.0  (breaking change)
```

Commit the version bump:

```bash
git add packages/dashboard-sidebar/package.json
git commit -m "chore(dashboard-sidebar): bump to 1.0.1"
git tag @bixcel/dashboard-sidebar@1.0.1
git push origin main --tags
```

### 5. Publish

```bash
# Publish a single package
cd packages/dashboard-sidebar
pnpm publish --no-git-checks

# Publish both packages from the root
pnpm publish -r --no-git-checks
```

`--no-git-checks` skips the "clean working tree" check. Remove it if you want that guard.

### 6. Verify

```bash
# Should list the new version
pnpm view @bixcel/dashboard-sidebar --registry https://npm.pkg.github.com
```

### Publishing via CI (GitHub Actions)

```yaml
# .github/workflows/publish.yml
name: Publish Packages

on:
  push:
    tags:
      - "@bixcel/*@*"

jobs:
  publish:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v3
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          registry-url: https://npm.pkg.github.com
          scope: "@bixcel"

      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - run: pnpm publish -r --no-git-checks
        env:
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

---

## Consuming Published Packages

In any Bixcel app (e.g. `bixcel-frontend`):

### 1. Add `.npmrc` to the app repo

```
@bixcel:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

### 2. Install

```bash
pnpm add @bixcel/dashboard-sidebar @bixcel/navigation-config
```

### 3. Use

```tsx
import { DashboardSidebar } from "@bixcel/dashboard-sidebar";
import { getSidebarConfigForRole } from "@bixcel/navigation-config";

const config = getSidebarConfigForRole(user.role);

<DashboardSidebar
  config={config}
  user={{ userId: user.id, role: user.role, enabledFeatures: user.features }}
  footerSlot={<LogoutButton />}
/>
```

---

## Troubleshooting

**`Cannot find module '@bixcel/dashboard-sidebar'`**  
The package hasn't been built yet. Run `pnpm build` from the monorepo root.

**Types are stale after editing source**  
The `dist/` folder is out of date. Run `pnpm dev` in watch mode or `pnpm build` again.

**`401 Unauthorized` when publishing**  
Your `NODE_AUTH_TOKEN` is missing or expired. Regenerate the PAT on GitHub and update `~/.npmrc`.

**`403 Forbidden` when installing in another repo**  
The consumer's PAT only has `read:packages`. Ensure it includes at least `read:packages` scope. Publishing requires `write:packages`.

**pnpm link not reflecting changes**  
Linked packages resolve from `dist/`, not `src/`. You must rebuild after every source change when using `pnpm link`.

**`localStorage is not defined` in SSR**  
The `loadOpenMenusFromStorage` utility has an SSR guard (`typeof window === "undefined"`). If you see this error it means the component is being rendered as a Server Component. Ensure `DashboardSidebar` (or its wrapper) is a `"use client"` component.
