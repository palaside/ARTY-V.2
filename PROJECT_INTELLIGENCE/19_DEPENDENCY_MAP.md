# 19_DEPENDENCY_MAP

> Every dependency in `package.json` vs. actual usage. UNUSED_DEPENDENCY_CANDIDATE flagged where evidence shows no import.

---

## DEPENDENCIES (Runtime)

### D-001: `react`
- **VERSION:** `19.2.6`
- **PURPOSE:** UI library
- **ACTUAL_USAGE:** VERIFIED — imported in every `.tsx` file (`import ... from 'react'`)
- **FILES_USING_IT:** `main.tsx`, `App.tsx`, all 10 component files
- **CRITICALITY:** CRITICAL (framework)
- **UNUSED_CANDIDATE:** NO
- **EVIDENCE:** grep imports react ~11 files

### D-002: `react-dom`
- **VERSION:** `19.2.6`
- **PURPOSE:** DOM renderer for React
- **ACTUAL_USAGE:** VERIFIED — `main.tsx:2` imports `createRoot` from `react-dom/client`
- **FILES_USING_IT:** `main.tsx`
- **CRITICALITY:** CRITICAL
- **EVIDENCE:** `main.tsx:2`

### D-003: `lucide-react`
- **VERSION:** `^1.31.0`
- **PURPOSE:** Icon library (React components for Lucide SVG icons)
- **ACTUAL_USAGE:** VERIFIED — imported in almost every component
- **FILES_USING_IT:**
  - App.tsx: Terminal, Eye, EyeOff, LayoutGrid, CheckCircle2, ShieldAlert
  - LoginModal.tsx: Lock, ShieldAlert, Terminal, Eye, Navigation
  - WindowManager.tsx: Minus, Square, X, Move
  - TacticalMap.tsx: Compass, ZoomIn, ZoomOut
  - ForwardObserverWindow.tsx: Target, Timer, Compass, CornerRightDown, ArrowUp/Down/Left/Right, ShieldAlert, Sliders
  - SurveillanceWindow.tsx: Table, Layers, AlertTriangle, ShieldCheck, RefreshCw
  - HowitzerWindow.tsx: ShieldAlert, Crosshair, AlertTriangle, ShieldCheck
  - FdcWindow.tsx: Calculator, Shield, Wind, Check, Play, Square, Activity
  - WeaponsWindow.tsx: ShieldAlert, AlertTriangle, ShieldCheck, Flame
  - CompassWindow.tsx: Compass, AlertTriangle, ShieldCheck
  - MunitionsWindow.tsx: ShieldAlert, RefreshCw, Layers, CheckCircle2
  - ControlPanelWindow.tsx: Terminal, ShieldAlert, Wifi, Trash2, Send
- **CRITICALITY:** HIGH (visual identity depends on it)
- **UNUSED_CANDIDATE:** NO
- **⚠️ VERSION NOTE:** `^1.31.0` — this appears unusually low for lucide-react; typical current versions are 0.4xx. May reflect a mock/local install. Grep imports work regardless — this is a VERSION_UNKNOWN concern for anyone trying to reproduce the install.

### D-004: `framer-motion`
- **VERSION:** `^13.1.0`
- **PURPOSE:** Animation library (per package description)
- **ACTUAL_USAGE:** **NO IMPORTS FOUND** in any `.ts`/`.tsx` file
- **FILES_USING_IT:** ❌ NONE
- **CRITICALITY:** ZERO (currently unused)
- **UNUSED_CANDIDATE:** ⚠️ **YES — UNUSED_DEPENDENCY_CANDIDATE**
- **EVIDENCE:** package.json:13, no import lines match `framer-motion`
- **CONTEXT:** Installed in a prior session with `install_npm_packages(["lucide-react", "framer-motion"])` but never wired into any component
- **CONFIDENCE:** VERIFIED

### D-005: `clsx`
- **VERSION:** `2.1.1`
- **PURPOSE:** conditional className string helper
- **ACTUAL_USAGE:** imported only by `src/utils/cn.ts`
- **BUT:** `src/utils/cn.ts` has **ZERO importers** in the codebase
- **INDIRECT USAGE:** effectively NONE
- **UNUSED_CANDIDATE:** ⚠️ **YES** (via transitive dead code)
- **EVIDENCE:** `cn.ts:1`, grep `from ".*/utils/cn"` = 0 results

### D-006: `tailwind-merge`
- **VERSION:** `3.4.0`
- **PURPOSE:** merge Tailwind class strings intelligently
- **ACTUAL_USAGE:** imported only by `src/utils/cn.ts` (same as clsx)
- **INDIRECT USAGE:** NONE
- **UNUSED_CANDIDATE:** ⚠️ **YES** (via transitive dead code)
- **EVIDENCE:** `cn.ts:2`

## DEV DEPENDENCIES

### D-007: `@tailwindcss/vite`
- **VERSION:** `4.1.17`
- **PURPOSE:** Vite plugin for Tailwind CSS v4
- **ACTUAL_USAGE:** `vite.config.ts:3, 13` (plugin registration)
- **UNUSED_CANDIDATE:** NO
- **CRITICALITY:** CRITICAL (styling)

### D-008: `tailwindcss`
- **VERSION:** `4.1.17`
- **PURPOSE:** Tailwind CSS framework
- **ACTUAL_USAGE:** `src/index.css:1` `@import "tailwindcss";` + used everywhere as classNames
- **UNUSED_CANDIDATE:** NO

### D-009: `@vitejs/plugin-react`
- **VERSION:** `5.1.1`
- **PURPOSE:** React support for Vite
- **ACTUAL_USAGE:** `vite.config.ts:4, 13`
- **UNUSED_CANDIDATE:** NO

### D-010: `vite`
- **VERSION:** `7.3.2`
- **PURPOSE:** build tool
- **ACTUAL_USAGE:** scripts + entire build pipeline
- **UNUSED_CANDIDATE:** NO

### D-011: `vite-plugin-singlefile`
- **VERSION:** `2.3.0`
- **PURPOSE:** inline all JS/CSS into a single HTML file
- **ACTUAL_USAGE:** `vite.config.ts:6, 13`
- **UNUSED_CANDIDATE:** NO
- **IMPACT:** enables offline-portable single-file deployment

### D-012: `typescript`
- **VERSION:** `5.9.3`
- **UNUSED_CANDIDATE:** NO (used by tsc + vite plugin)

### D-013: `@types/react`
- **VERSION:** `19.2.7`
- **UNUSED_CANDIDATE:** NO

### D-014: `@types/react-dom`
- **VERSION:** `19.2.3`
- **UNUSED_CANDIDATE:** NO

### D-015: `@types/node`
- **VERSION:** `22.19.17`
- **PURPOSE:** Node types (mentioned as `"types": ["node"]` in tsconfig for `vite.config.ts`)
- **UNUSED_CANDIDATE:** NO

---

## UNUSED DEPENDENCY CANDIDATES SUMMARY

| Package | Reason | Action Recommended (NOT taken) |
|---|---|---|
| `framer-motion` | Zero imports across all `.tsx`/`.ts` | Consider removal if no upcoming animation work planned |
| `clsx` | Only used in `cn.ts` which itself has zero consumers | Same — dead chain |
| `tailwind-merge` | Only used in `cn.ts` which itself has zero consumers | Same |

**IMPORTANT:** These are **candidates** — do not remove without further audit (they may be intended for planned features per original intent, which is UNKNOWN in this repo).

## PACKAGE MANAGER

- **VERIFIED:** No `pnpm-lock.yaml`, no `yarn.lock`, no `bun.lock` observed
- **INFERRED:** npm (default) — no `packageManager` field in package.json
- **CONFIDENCE:** INFERRED

## SCRIPTS

| Script | Command | Purpose |
|---|---|---|
| `dev` | `vite` | Dev server |
| `build` | `vite build` | Production build → `dist/index.html` (single file) |
| `preview` | `vite preview` | Preview built output |

**Missing scripts (verified absent):**
- `lint` / `format`
- `test` / `test:watch`
- `typecheck` (tsconfig has `noEmit: true` but no npm script wraps tsc)

## DEPENDENCY GRAPH SUMMARY

```
main.tsx
├── react, react-dom (D-001, D-002)      [CRITICAL]
└── App.tsx
    ├── react (D-001)                     [CRITICAL]
    ├── lucide-react (D-003)              [HIGH]
    └── local components (11 files)
        ├── react (D-001)                 [CRITICAL]
        └── lucide-react (D-003)          [HIGH]

Never imported at runtime:
├── framer-motion (D-004)                 [UNUSED CANDIDATE]
├── clsx (D-005) — via dead cn.ts         [UNUSED CANDIDATE]
└── tailwind-merge (D-006) — via dead cn.ts [UNUSED CANDIDATE]

Build-time only:
├── vite, vite-plugin-singlefile
├── @vitejs/plugin-react
├── @tailwindcss/vite
├── tailwindcss (also imported by CSS)
├── typescript
└── @types/*
```

## TOTAL DEPENDENCY COUNT

- Runtime: **6** (react, react-dom, lucide-react, framer-motion*, clsx*, tailwind-merge*)
- Dev: **9**
- Grand total: **15**
- **Actually used at runtime:** 3 (react, react-dom, lucide-react) ← the rest are dead or build-only

*= unused candidate
