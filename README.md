# Bug: `preserveModules` doesn't strip query strings from module IDs

When using `preserveModules: true` with plugins that add query strings to module IDs
(e.g., `vite-plugin-svgr` adds `?react`), Rolldown passes the raw query string through
to the `fileName` / `entryFileNames` callback and into the output filename.

Rollup explicitly strips query strings via `module.id.split(/[#?]/, 1)[0]` in
[`getPreserveModulesChunkNameFromModule`](https://github.com/rollup/rollup/blob/main/src/Chunk.ts#L1147-L1171).

## Reproduction

```bash
npm install
npx vite build
```

## Expected behavior

The `fileName` callback should receive `entryName` without query strings, matching Rollup's behavior:

```
[fileName callback] {"format":"es","entryName":"icon.svg"}    ← query stripped
```

## Actual behavior

```
[fileName callback] {"format":"es","entryName":"icon.svg?react"}    ← query NOT stripped
```

Output files:
```
dist/
  icon.svg?react.js   ← literal ? in filename
  greeting.js
  index.js
```

The `?` character in filenames is invalid on Windows and problematic on most systems.

## Versions

- vite: 8.0.0
- rolldown: 1.0.0-rc.9 (bundled with vite 8.0.0)
- vite-plugin-svgr: 4.5.0
