# Bug: `preserveModules` doesn't strip query strings from module IDs

## Reproduction

```bash
npm install
npx vite build        # Uses Rolldown (Vite 8)
npx rollup -c rollup.config.js  # Uses Rollup for comparison
```

## Expected behavior (Rollup)

Rollup strips query strings from module IDs before passing them to `entryFileNames` callbacks,
via `module.id.split(/[#?]/, 1)[0]` in `getPreserveModulesChunkNameFromModule` ([source](https://github.com/rollup/rollup/blob/main/src/Chunk.ts#L1147-L1171)).

```
[entryFileNames callback] {"name":"index"}
[entryFileNames callback] {"name":"_virtual/icon.svg"}    ← query stripped
[entryFileNames callback] {"name":"greeting"}
```

Output files:
```
dist-rollup/
  _virtual/icon.svg.js   ✅ valid filename
  greeting.js
  index.js
```

## Actual behavior (Rolldown / Vite 8)

Rolldown passes the raw module ID, including query strings, to the `fileName` callback:

```
[fileName callback] {"format":"es","entryName":"index"}
[fileName callback] {"format":"es","entryName":"icon.svg?component"}    ← query NOT stripped
[fileName callback] {"format":"es","entryName":"greeting"}
```

Output files:
```
dist/
  icon.svg?component.js   ❌ broken filename (literal ? in path)
  greeting.js
  index.js
```

## Impact

This affects any library build using `preserveModules: true` with plugins that add query
strings to module IDs (e.g., `vite-plugin-svgr` with `?react`, raw imports with `?raw`).

The `?` character in filenames is invalid on Windows and problematic on most systems.

## Versions

- vite: 8.0.0
- rolldown: 1.0.0-rc.9 (bundled with vite 8.0.0)
- rollup: 4.x (for comparison)
