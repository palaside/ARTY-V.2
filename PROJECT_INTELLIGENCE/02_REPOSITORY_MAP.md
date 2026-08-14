# 02_REPOSITORY_MAP

## REPOSITORY TREE (AS-IS)

```
/
├─ index.html                                    [CONFIG] HTML shell + title + fonts + inline styles
├─ package.json                                  [CONFIG] Deps + scripts
├─ tsconfig.json                                 [CONFIG] TypeScript strict mode
├─ vite.config.ts                                [CONFIG] Vite + React + Tailwind + singlefile plugin
├─ WORKFLOW.md                                   [DOC]    Thai workflow doc (created in previous session)
├─ docs/
│  └─ C2_CLONE_GUIDE.md                          [DOC]    Thai clone-guide (created in previous session)
├─ PROJECT_INTELLIGENCE/                         [DOC]    ★ THIS PACKAGE (34 files, created by this task)
│  ├─ 00_MASTER_PROJECT_INTELLIGENCE.md
│  ├─ 01_SYSTEM_OVERVIEW.md
│  ├─ ... (through 33)
└─ src/
   ├─ main.tsx                                   [CORE]   Entry point (11 lines)
   ├─ App.tsx                                    [CORE]   ★ God component — all state + all layout (802 lines)
   ├─ index.css                                  [ASSET]  Tailwind import only (2 lines)
   ├─ utils/
   │  ├─ ballistics.ts                           [LOGIC]  ★ Calculation engine (155 lines)
   │  └─ cn.ts                                   [DEAD]   clsx+tailwind-merge helper (7 lines) — NOT IMPORTED anywhere
   └─ components/
      ├─ WindowManager.tsx                       [UI]     Window component + WindowData type (241 lines)
      ├─ LoginModal.tsx                          [UI]     Login + Setup screen (~240 lines)
      ├─ TacticalMap.tsx                         [UI]     Full-screen Canvas map (~500 lines)
      ├─ ForwardObserverWindow.tsx               [FEATURE] ผตน. module (554 lines)
      ├─ SurveillanceWindow.tsx                  [FEATURE] สำรวจ module (~410 lines)
      ├─ HowitzerWindow.tsx                      [FEATURE] หมู่ปืน + Crater Analysis (~330 lines)
      ├─ FdcWindow.tsx                           [FEATURE] ศอย. ballistics + Min QE (~375 lines)
      ├─ WeaponsWindow.tsx                       [FEATURE] อาวุธ Fuze/ICM/Misfire (~310 lines)
      ├─ CompassWindow.tsx                       [FEATURE] เข็มทิศ M.2 + Level (~330 lines)
      ├─ MunitionsWindow.tsx                     [FEATURE] Ammo cutaway (~230 lines)
      ├─ ControlPanelWindow.tsx                  [FEATURE] Log + Kill Switch (~120 lines)
      └─ SoundGenerator.ts                       [LOGIC]  Web Audio synth (137 lines)
```

**Total source files:** 13 (`.ts`, `.tsx`)
**Total lines of source code:** ~4,000+ lines (App.tsx alone = 802 lines)

## FILE-BY-FILE CLASSIFICATION

| Path | Purpose | Runtime Relevance | Used By | Class |
|---|---|---|---|---|
| `index.html` | HTML shell, title, Google Fonts import, tactical-grid CSS | ✅ CRITICAL (entry HTML) | Vite build | CONFIG |
| `package.json` | Dependency manifest + scripts (dev/build/preview) | ✅ Build only | npm/vite | CONFIG |
| `tsconfig.json` | TypeScript strict + `@/*` path alias | ✅ Build only | tsc | CONFIG |
| `vite.config.ts` | Plugins: react, tailwindcss, singlefile | ✅ Build only | vite | CONFIG |
| `src/main.tsx` | React root mounting + StrictMode | ✅ CRITICAL (entry point) | Vite | CORE |
| `src/App.tsx` | God component: 20+ state, 8 windows, taskbar, menu, timers | ✅ CRITICAL | main.tsx | CORE |
| `src/index.css` | `@import "tailwindcss";` only | ✅ Styling | main.tsx | ASSET |
| `src/utils/ballistics.ts` | Calc engine: interpolate, wind, polar, mils/deg, VE, gun positions | ✅ CRITICAL | FdcWindow, ForwardObserverWindow, App.tsx | LOGIC |
| `src/utils/cn.ts` | `cn()` helper (clsx + tailwind-merge) | ❌ **DEAD** — no imports found | (none) | **DEAD** |
| `src/components/WindowManager.tsx` | `<Window>` shell + drag/resize/minimize/close | ✅ Used 8 times in App.tsx | App.tsx | UI |
| `src/components/LoginModal.tsx` | Login form + Setup form + localStorage read/write | ✅ Rendered when `!isLoggedIn` | App.tsx | UI |
| `src/components/TacticalMap.tsx` | Full-screen Canvas: grid, guns, targets, trajectory, threat dome, ICM boundary | ✅ Always rendered (post-login) | App.tsx | UI |
| `src/components/ForwardObserverWindow.tsx` | ผตน. tabs: Grid/Polar/Shift + F2B timer + Mil formula + adjustment pad | ✅ Feature | App.tsx | FEATURE |
| `src/components/SurveillanceWindow.tsx` | 4 tabs: ทบ.344-202 / Intersection / Slope / Calibration | ✅ Feature | App.tsx | FEATURE |
| `src/components/HowitzerWindow.tsx` | 2 tabs: M.17 Board (drag guns) + Crater Analysis | ✅ Feature | App.tsx | FEATURE |
| `src/components/FdcWindow.tsx` | 2 tabs: Ballistics + Min QE + FIRE button | ✅ Feature | App.tsx | FEATURE |
| `src/components/WeaponsWindow.tsx` | 3 tabs: Fuze + ICM + Misfire | ✅ Feature | App.tsx | FEATURE |
| `src/components/CompassWindow.tsx` | SVG compass + N/S logic + Level bubble | ✅ Feature | App.tsx | FEATURE |
| `src/components/MunitionsWindow.tsx` | SVG 105mm shell cutaway + 3D rotate + supp charge toggle | ✅ Feature | App.tsx | FEATURE |
| `src/components/ControlPanelWindow.tsx` | Console log + Kill Switch + Simulate button | ✅ Feature | App.tsx | FEATURE |
| `src/components/SoundGenerator.ts` | Web Audio: playClick/playBeep/playAlarm/playFireSound/playSplashSound | ✅ Used by ALL components | * | LOGIC |
| `WORKFLOW.md` | Thai workflow doc (previous session output) | ❌ Documentation only | (readers) | DOC |
| `docs/C2_CLONE_GUIDE.md` | Thai clone guide (previous session output) | ❌ Documentation only | (readers) | DOC |

## FILES **NOT PRESENT** (Verified absent)

| Expected File | Present? | Impact |
|---|---|---|
| `README.md` | ❌ | No project overview at root |
| `LICENSE` | ❌ | No license info |
| `.gitignore` | UNKNOWN (not listed) | — |
| `.env` / `.env.example` | ❌ | No environment variables |
| `.eslintrc*` / `eslint.config.*` | ❌ | No custom lint config (relies on tsc `noUnusedLocals`, `noUnusedParameters`) |
| `.prettierrc*` | ❌ | No formatter config |
| `vitest.config.*` / `jest.config.*` | ❌ | No test framework |
| `**/*.test.ts` / `**/*.spec.ts` | ❌ | No test files |
| `**/*.test.tsx` / `**/*.spec.tsx` | ❌ | No component tests |
| `**/*.stories.tsx` | ❌ | No Storybook |
| `public/` folder | ❌ | No static assets |
| `assets/` folder | ❌ | No images/audio/fonts (all inline SVG or Web Audio) |
| `src/pages/` | ❌ | No page-based routing |
| `src/context/` | ❌ | No React Context usage |
| `src/hooks/` | ❌ | No custom hooks |
| `src/services/` | ❌ | No service layer |
| `src/api/` | ❌ | No API client |
| `src/store/` | ❌ | No state management library |
| `FIRST_ALL_PROJECT.md` (referenced in prompt) | ❌ | Not found |
| `lithos-hero.md` (referenced in prompt) | ❌ | Not found |
| `implementation_plan.md` (referenced in prompt) | ❌ | Not found |

**Implication:** ไม่มีเอกสาร original intent ให้เปรียบเทียบ — ทำให้ **30_INTENT_VS_IMPLEMENTATION** ต้องระบุ UNKNOWN สำหรับเจตนาเดิม

## FOLDER RESPONSIBILITY MATRIX

| Folder | Contains | Owns |
|---|---|---|
| `/` (root) | Config + docs | Build system, package manifest |
| `/docs` | 1 Thai clone guide | Human-readable documentation |
| `/PROJECT_INTELLIGENCE` | This package (34 files) | AI intelligence snapshot |
| `/src` | Application source | Runtime code |
| `/src/utils` | Pure functions (no React) | Business logic (ballistics.ts), unused helper (cn.ts) |
| `/src/components` | React components + SoundGenerator | UI + Web Audio |

## FILE SIZE DISTRIBUTION

**Verified from tool reads:**

| Size Category | Files |
|---|---|
| Very small (< 20 lines) | `main.tsx` (11), `cn.ts` (7), `index.css` (2) |
| Small (20-100) | `package.json` (31), `tsconfig.json` (32), `vite.config.ts` (20), `index.html` (~60) |
| Medium (100-300) | `ballistics.ts` (155), `SoundGenerator.ts` (137), `ControlPanelWindow.tsx` (~120), `MunitionsWindow.tsx` (~230), `WindowManager.tsx` (241) |
| Large (300-500) | `LoginModal.tsx`, `HowitzerWindow.tsx`, `CompassWindow.tsx`, `FdcWindow.tsx`, `WeaponsWindow.tsx`, `SurveillanceWindow.tsx` |
| Very large (> 500) | `TacticalMap.tsx`, `ForwardObserverWindow.tsx` (554), **`App.tsx` (802)** ⚠️ |

**⚠️ Concern:** `App.tsx` is 4× the average component size and holds ALL application state. See `28_TECH_DEBT.md`.

## RUNTIME-CRITICAL FILE LIST (ordered by dependency depth)

1. `index.html` (loads bundled JS)
2. `src/main.tsx` (mounts React)
3. `src/App.tsx` (state root)
4. `src/components/LoginModal.tsx` (first-render gate)
5. `src/components/TacticalMap.tsx` (background layer)
6. `src/components/WindowManager.tsx` (shell for 8 windows)
7. `src/components/{Forward,Surveillance,Howitzer,Fdc,Weapons,Compass,Munitions,ControlPanel}Window.tsx` (feature modules)
8. `src/utils/ballistics.ts` (math)
9. `src/components/SoundGenerator.ts` (audio)

## NOT USED AT RUNTIME (but present)

- `src/utils/cn.ts` — no import found (see `29_DEAD_UNUSED_DUPLICATED.md`)
- `docs/C2_CLONE_GUIDE.md`, `WORKFLOW.md` — documentation
- Dependencies `framer-motion`, `clsx`, `tailwind-merge` in package.json — not imported (see `19_DEPENDENCY_MAP.md`)
