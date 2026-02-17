# VERCEL-REACT-NATIVE-SKILLS - MONOREPO
> Generated: 2026-02-17
> Rules: 2


### RULE: Install Native Dependencies in App Directory
(File: monorepo-native-deps-in-app.md)

## Install Native Dependencies in App Directory

In a monorepo, packages with native code must be installed in the native app's
directory directly. Autolinking only scans the app's `node_modules`—it won't
find native dependencies installed in other packages.

**Incorrect (native dep in shared package only):**

```
packages/
  ui/
    package.json  # has react-native-reanimated
  app/
    package.json  # missing react-native-reanimated
```

Autolinking fails—native code not linked.

**Correct (native dep in app directory):**

```
packages/
  ui/
    package.json  # has react-native-reanimated
  app/
    package.json  # also has react-native-reanimated
```

```json
// packages/app/package.json
{
  "dependencies": {
    "react-native-reanimated": "3.16.1"
  }
}
```

Even if the shared package uses the native dependency, the app must also list it
for autolinking to detect and link the native code.

### RULE: Use Single Dependency Versions Across Monorepo
(File: monorepo-single-dependency-versions.md)

## Use Single Dependency Versions Across Monorepo

Use a single version of each dependency across all packages in your monorepo.
Prefer exact versions over ranges. Multiple versions cause duplicate code in
bundles, runtime conflicts, and inconsistent behavior across packages.

Use a tool like syncpack to enforce this. As a last resort, use yarn resolutions
or npm overrides.

**Incorrect (version ranges, multiple versions):**

```json
// packages/app/package.json
{
  "dependencies": {
    "react-native-reanimated": "^3.0.0"
  }
}

// packages/ui/package.json
{
  "dependencies": {
    "react-native-reanimated": "^3.5.0"
  }
}
```

**Correct (exact versions, single source of truth):**

```json
// package.json (root)
{
  "pnpm": {
    "overrides": {
      "react-native-reanimated": "3.16.1"
    }
  }
}

// packages/app/package.json
{
  "dependencies": {
    "react-native-reanimated": "3.16.1"
  }
}

// packages/ui/package.json
{
  "dependencies": {
    "react-native-reanimated": "3.16.1"
  }
}
```

Use your package manager's override/resolution feature to enforce versions at
the root. When adding dependencies, specify exact versions without `^` or `~`.
