# 25_BUILD_DEPLOYMENT

## PACKAGE SCRIPTS

From `package.json:6-10`:

| Script | Command | Purpose |
|---|---|---|
| `dev` | `vite` | Start dev server (typically `localhost:5173`) with HMR |
| `build` | `vite build` | Production build → single `dist/index.html` |
| `preview` | `vite preview` | Serve built output for local verification |

## BUILD PIPELINE (VERIFIED)

Configured in `vite.config.ts`:

```typescript
plugins: [react(), tailwindcss(), viteSingleFile()],
resolve: { alias: { "@": path.resolve(__dirname, "src") } }
```

**Pipeline:**
1. `@vitejs/plugin-react` compiles JSX/TSX + hot reload
2. `@tailwindcss/vite` processes Tailwind directives + arbitrary values
3. `vite-plugin-singlefile` **inlines all JS + CSS into `dist/index.html`** as a single self-contained file
4. TypeScript type checking runs implicitly via plugin

**Output:**
- **Single file:** `dist/index.html` (~380 KB, ~100 KB gzipped based on prior session build output)
- No separate JS/CSS files (all inlined via `<script>` and `<style>` tags)
- No public assets

## BUILD STATUS

- **VERIFIED:** In previous session `build_project` succeeded with:
  ```
  vite v7.3.2 building client environment for production...
  ✓ 1821 modules transformed.
  [plugin vite:singlefile] Inlining: index-BNSzQroZ.js
  [plugin vite:singlefile] Inlining: style-fZBjCret.css
  dist/index.html  382.62 kB │ gzip: 101.31 kB
  ✓ built in 2.73s
  ```
- **INFERRED:** Current state should still build (no code changes since)

## HOSTING

- **VERIFIED:** No hosting config in repository
- **NO** `vercel.json`, `netlify.toml`, `Dockerfile`, `render.yaml`, `firebase.json`, `wrangler.toml`
- **NO** `.github/workflows/deploy.*.yml`
- **INFERRED:** Deployment is **manual** — copy `dist/index.html` to any HTTP server

## ENVIRONMENT VARIABLES

- **VERIFIED:** No `.env`, no `.env.example`
- **VERIFIED:** No `import.meta.env` references in source
- App has no runtime configuration mechanism

## BUILD ASSUMPTIONS

1. Node.js environment capable of running Vite 7 (Node 18+)
2. npm package manager (no lockfile enforcement)
3. Modern browser target (Vite defaults; no `build.target` override)
4. No polyfills required beyond Vite defaults
5. No pre-build code generation

## DEPLOYMENT MODEL

**VERIFIED:**
- **Type:** Static single-file HTML
- **Server requirements:** any HTTP server that can serve `.html`
- **CDN-friendly:** yes (single asset)
- **Offline-capable:** yes once loaded (Google Fonts CSS is only external network dependency, has fallback)

## RUNTIME REQUIREMENTS (Browser)

- ES2020 support (per `tsconfig.json:3`)
- DOM API (standard)
- Web Audio API (for sound — silently fails if unsupported/blocked)
- HTML5 Canvas 2D
- LocalStorage
- IndexedDB (only `deleteDatabase` — will throw silently on non-support, caught)

## DEV SERVER

- **Command:** `npm run dev`
- **Default port:** 5173 (Vite default; not customized)
- **HMR:** enabled by default via `@vitejs/plugin-react`

## CI/CD

- **VERIFIED — NONE observed.**

## RELEASE VERSIONING

- **VERIFIED:** `package.json:4` version is `0.0.0` (never bumped)
- No CHANGELOG.md
- No git tags (git tooling unavailable in this environment)

## MONITORING / OBSERVABILITY

- **VERIFIED — NONE.**
- No source maps configuration (Vite defaults may include)
- No error tracking, no analytics

## SECURITY HEADERS

- **UNKNOWN** — depends on host
- Repository does not include any CSP `<meta>` tag in `index.html`
- No Subresource Integrity (SRI) on the Google Fonts `<link>`

## CACHING STRATEGY

- **VERIFIED — NONE APP-SPECIFIC.**
- Single-file deployment → simple browser cache with default headers from host
- No Service Worker → no offline caching after first load (Google Fonts still fetched each session unless browser-cached)

## SUMMARY

- **Deploy:** `npm install && npm run build` → serve `dist/index.html`
- **Rollback:** replace `index.html` with previous file
- **Zero server-side dependencies**
- **Zero environment configuration**
