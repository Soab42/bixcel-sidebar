# Bixcel Sidebar Monorepo

Monorepo for `@soab42/dashboard-sidebar` — shared, production-quality dashboard UI package for Bixcel SaaS apps.

---

## Packages

| Package | Description |
|---|---|
| [`@soab42/dashboard-sidebar`](./packages/dashboard-sidebar) | Sidebar + header components, types, Zod validation |

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Repo Setup](#repo-setup)
- [Local Development](#local-development)
- [Using the Package in Another App](#using-the-package-in-another-app)
- [Running Tests](#running-tests)
- [Building for Production](#building-for-production)
- [Publishing](#publishing)
- [Consuming the Published Package](#consuming-the-published-package)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

| Tool | Minimum version |
|---|---|
| Node.js | 18.x |
| pnpm | 9.x |

```bash
npm install -g pnpm@9
```

---

## Repo Setup

```bash
git clone git@github.com:bixcel-org/bixcel-sidebar.git
cd bixcel-sidebar
pnpm install
```

---

## Local Development

```bash
# Watch mode — rebuilds on every save
cd packages/dashboard-sidebar
pnpm dev

# Or from the root (all workspaces in parallel)
pnpm dev
```

### TypeScript checking

```bash
pnpm typecheck
```

---

## Using the Package in Another App

### Option A — pnpm workspace protocol (recommended)

```jsonc
// bixcel-frontend/package.json
{
  "dependencies": {
    "@soab42/dashboard-sidebar": "workspace:*"
  }
}
```

Build first, then install:

```bash
pnpm build        # from monorepo root
pnpm install      # in bixcel-frontend
```

### Option B — `pnpm link` (separate repo)

```bash
# In packages/dashboard-sidebar
pnpm build
pnpm link --global

# In bixcel-frontend
pnpm link --global @soab42/dashboard-sidebar
```

### Option C — direct path

```jsonc
{
  "dependencies": {
    "@soab42/dashboard-sidebar": "file:../bixcel-sidebar/packages/dashboard-sidebar"
  }
}
```

> With Options B and C you must rebuild after every source change. Option A + watch mode is the smoothest DX.

---

## Running Tests

```bash
pnpm test          # unit tests
pnpm test:watch    # watch mode
pnpm test:a11y     # accessibility tests (jsdom + axe)
```

---

## Building for Production

```bash
pnpm build
```

Output in `packages/dashboard-sidebar/dist/`:

```
dist/
  index.js       ← CommonJS
  index.mjs      ← ESM
  index.d.ts     ← TypeScript declarations
```

---

## Publishing

Packages publish to **GitHub Packages** (`https://npm.pkg.github.com`).

### 1. Authenticate

Create a GitHub PAT with `write:packages` scope and add to `~/.npmrc`:

```
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_PAT
```

### 2. Build + bump version

```bash
pnpm build
cd packages/dashboard-sidebar
pnpm version patch   # or minor / major
```

### 3. Publish

```bash
pnpm publish --no-git-checks

# Or from root
pnpm publish -r --no-git-checks
```

### CI (GitHub Actions)

```yaml
name: Publish

on:
  push:
    tags: ["@soab42/*@*"]

jobs:
  publish:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          registry-url: https://npm.pkg.github.com
          scope: "@soab42"
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - run: pnpm publish -r --no-git-checks
        env:
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

---

## Consuming the Published Package

```bash
pnpm add @soab42/dashboard-sidebar
```

Add to `.npmrc` in the consuming app:

```
@soab42:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

### Basic usage

```tsx
import { DashboardSidebar, DashboardHeader } from "@soab42/dashboard-sidebar";
import type { SidebarConfig } from "@soab42/dashboard-sidebar";

// config comes from your API
const config: SidebarConfig = await getNavConfigAction();

<DashboardHeader
  leftSlot={<BarButton />}
  logoSlot={<Link href="/"><Image src={logo} alt="logo" /></Link>}
  rightSlot={<><Notifications /><UserAvatar /></>}
/>

<DashboardSidebar
  config={config}
  user={{ userId: session.user.id, role: session.user.role, enabledFeatures: session.user.features }}
  footerSlot={<LogoutButton token={token} />}
/>
```

---

## Troubleshooting

**`Cannot find module '@soab42/dashboard-sidebar'`** — run `pnpm build` from the monorepo root.

**Types are stale** — `dist/` is out of date. Run `pnpm dev` or `pnpm build`.

**`401 Unauthorized` when publishing** — regenerate your GitHub PAT with `write:packages`.

**`localStorage is not defined` in SSR** — `DashboardSidebar` must be inside a `"use client"` component.
