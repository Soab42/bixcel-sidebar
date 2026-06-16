import { defineConfig, type Options } from "tsup";
import { readFile, writeFile } from "node:fs/promises";

const shared: Options = {
  format: ["esm", "cjs"],
  dts: true,
  external: ["react", "react-dom", "next"],
  sourcemap: true,
  treeshake: true,
};

// esbuild strips a `"use client";` *banner* as a duplicate module-level
// directive (it warns and drops it), so we prepend it to the built client
// bundles in a post-build step instead. The `core` entry deliberately stays
// without it so it remains importable from React Server Components.
async function prependUseClient() {
  for (const file of ["dist/index.mjs", "dist/index.js"]) {
    const src = await readFile(file, "utf8");
    if (!src.startsWith('"use client"')) {
      await writeFile(file, `"use client";\n${src}`);
    }
  }
}

export default defineConfig([
  // Client entry — React components.
  {
    ...shared,
    entry: { index: "src/index.ts" },
    clean: true,
    onSuccess: prependUseClient,
  },
  // Server-safe entry — pure helpers + types, no client boundary.
  {
    ...shared,
    entry: { core: "src/core.ts" },
    clean: false,
  },
]);
