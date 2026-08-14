# 28_TECH_DEBT

> Only debt with evidence. Path + explanation required for each item.

## TD-01: GIANT APP COMPONENT
- **PATH:** `src/App.tsx` — 802 lines
- **NATURE:** Single component holds ~20 useState hooks, 3 useEffect timers, all callback handlers (~15), all conditional rendering, entire dashboard layout, header, footer, taskbar, start menu, and desktop icons
- **CONSEQUENCE:**
  - Any minor change requires understanding the entire file
  - Difficult to unit-test business logic (embedded in event handlers)
  - Prevents co-locating related state with feature
- **EVIDENCE:** `App.tsx:1-802`

## TD-02: NO REACT CONTEXT / STORE
- **PATH:** Everywhere
- **NATURE:** All shared state is prop-drilled from App.tsx
- **CONSEQUENCE:**
  - Adding a new state consumer requires editing App.tsx + intermediary components
  - Refactoring window props becomes cascading
  - No selector-based subscription → all state updates re-render everything

## TD-03: DUPLICATED TARGET TYPE (3 places)
- **PATHS:**
  - `App.tsx:29,33,218,226,545,563` — inline `{id, name, easting, northing, altitude}`
  - `ForwardObserverWindow.tsx:7-13` — `interface TargetData`
  - `FdcWindow.tsx:7-13` — `interface TargetData` (identical)
- **CONSEQUENCE:** Schema divergence risk

## TD-04: NO SHARED UI COMPONENT LIBRARY
- **PATH:** Every window component redefines its own button, input, tab, card
- **CONSEQUENCE:**
  - Design drift (ISSUE-28: text sizes vary)
  - Bug fixes require patching multiple locations
  - New features must rebuild primitives

## TD-05: DEAD UTILITY (`cn.ts`)
- **PATH:** `src/utils/cn.ts` (7 lines)
- **NATURE:** Utility imports `clsx` + `tailwind-merge` but nothing imports `cn.ts`
- **CONSEQUENCE:** 3 dependencies kept alive for a non-consumed file (see D-005, D-006)

## TD-06: MULTIPLE ACCESS POINTS FOR SAME ACTION
- **PATHS:**
  - Header quick-launch: `App.tsx:419-435`
  - Desktop icons: `App.tsx:470-490`
  - Taskbar tasks: `App.tsx:746-767`
  - Start menu programs: `App.tsx:677-689`
- **CONSEQUENCE:** 4 UI surfaces do the same `toggleWindow(id)` — 4× maintenance for each window; UX inconsistency (Desktop double-click vs. others single-click)

## TD-07: SIMULATE CALL DUPLICATES POLAR PLOT LOGIC
- **PATHS:** `App.tsx:321-322` (inline) vs. `ballistics.ts:100-116` (exported fn)
- **CONSEQUENCE:** Formula divergence risk when tuning polar calc

## TD-08: MILSTODEGREES DUPLICATED
- **PATHS:** `ballistics.ts:121` + inline helper at end of `TacticalMap.tsx`

## TD-09: INLINE CALCULATIONS SPREAD ACROSS COMPONENTS
- **PATHS:** Traverse closure (Surveillance), Intersection (Surveillance), Slope (Surveillance), Crater weapon ID (Howitzer), Min QE (FDC), Distance to friendly (App), Level threshold (App), Polar (App Simulate) — all inline
- **CONSEQUENCE:** Business logic tightly coupled to UI; cannot unit-test without React harness

## TD-10: NO MEMOIZATION
- **PATH:** Whole codebase (grep `React.memo`, `useMemo`, `useCallback` = 0)
- **CONSEQUENCE:** Full-tree re-renders on every state change; 10Hz fire timer amplifies this
- **RELATED:** ISSUE-23

## TD-11: DUP NAVIGATION HANDLERS (toggleWindow vs. Taskbar-specific inline)
- **PATH:** `App.tsx:149-162` `toggleWindow` vs. `App.tsx:750-757` inline different logic in taskbar
- **CONSEQUENCE:** Divergent behavior for the "same" click intent

## TD-12: LOG STRINGS UNSTRUCTURED
- **PATH:** `App.tsx:207-210` — plain string array
- **CONSEQUENCE:** Cannot filter by severity/category, cannot query, cannot export

## TD-13: MOCK AUTH IN PRODUCTION SHIPPING PATH
- **PATH:** `LoginModal.tsx:29-58`
- **CONSEQUENCE:** Real auth swap requires rewriting LoginModal + adding server infra + rewriting Kill Switch semantics

## TD-14: HARDCODED CONSTANTS EVERYWHERE
- **PATHS:** Sound speed 340, wind factors 3.5/0.8, VE factor 0.15, safety buffer 5, base deflection 3200, ICM 600m, thresholds 2px/10m/2mils/2000mils/10-80°
- **CONSEQUENCE:** No config file; changing any requires code edit + rebuild

## TD-15: MOCK DATABASE IN SOURCE
- **PATH:** `ballistics.ts:11-24` CHARGE_5_FIRE_TABLE (12 rows)
- **CONSEQUENCE:** Real fire tables must replace this in-code

## TD-16: NO PERSISTENCE FOR SESSION STATE
- **PATH:** All state except `batteryCoords` lost on refresh
- **CONSEQUENCE:** Every user session is a "fresh start" — impractical for real operations

## TD-17: NO ERROR BOUNDARY
- **PATH:** No `componentDidCatch` / `<ErrorBoundary>` — grep = 0
- **CONSEQUENCE:** Any thrown error crashes entire dashboard to blank

## TD-18: NO TEST INFRASTRUCTURE
- **PATH:** No test framework, no test files, no CI hooks
- **CONSEQUENCE:** Every code change is manual regression

## TD-19: MIXED THAI/ENGLISH LABELS
- **PATH:** UI labels Thai; `title` tooltips sometimes English (ISSUE-27)
- **CONSEQUENCE:** i18n groundwork must handle both

## TD-20: TAILWIND ARBITRARY VALUES EVERYWHERE
- **PATH:** `bg-[#121413]`, `text-[10px]`, `border-[#2b4034]`, etc. — hundreds of occurrences
- **CONSEQUENCE:** No design token abstraction; theme change requires find-and-replace

## TD-21: WINDOW LAYOUT NOT SERIALIZABLE
- **PATH:** `App.tsx:104-113` windows initial state has ~120 lines of duplicated boilerplate for 8 windows
- **CONSEQUENCE:** New window addition requires editing multiple places

## TD-22: EACH WINDOW RENDER USES `windows.find(w => w.id === X)!` (7×)
- **PATH:** `App.tsx:494-660` — repeated 8 times with `!` non-null assertion
- **CONSEQUENCE:** O(8×8) window lookups per render; verbose repetition

## TD-23: NO KEYBOARD SHORTCUTS
- **PATH:** grep no `keydown`/`keypress` (except native inputs)
- **CONSEQUENCE:** Operators requiring speed have no accelerators

## TD-24: NO LOCKFILE
- **PATH:** No `package-lock.json` etc.
- **CONSEQUENCE:** Non-reproducible builds (ISSUE-33)

## TD-25: NO BUILD/LINT/TEST CI
- **PATH:** No `.github/workflows/` etc.
- **CONSEQUENCE:** Regressions can ship undetected

## TECH DEBT PRIORITIZATION (by impact)

### CRITICAL (blocks future scale)
- TD-01 (God component)
- TD-02 (No state store)
- TD-13 (Mock auth)
- TD-18 (No tests)

### HIGH (impacts maintenance)
- TD-04 (No UI library)
- TD-09 (Inline calc logic)
- TD-16 (No session persistence)
- TD-17 (No error boundary)

### MEDIUM
- TD-03, TD-08, TD-11, TD-14, TD-15, TD-20, TD-24, TD-25

### LOW
- TD-05, TD-06, TD-07, TD-10, TD-12, TD-19, TD-21, TD-22, TD-23
