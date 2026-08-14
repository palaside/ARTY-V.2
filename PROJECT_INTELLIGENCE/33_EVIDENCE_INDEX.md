# 33_EVIDENCE_INDEX

> Every major claim must be traceable. Uses format:
> EVIDENCE_ID | CLAIM | SOURCE_PATH | SYMBOL/FUNCTION/COMPONENT | LINE_RANGE | USED_IN_DOCUMENTS | CONFIDENCE

---

## E-001 — Repository is React 19 + Vite 7 + TS
- **CLAIM:** Uses React 19.2.6, Vite 7.3.2, TypeScript 5.9.3
- **SOURCE:** `package.json`
- **LINES:** 15, 27, 27
- **USED_IN:** 00, 01, 03, 19, 25
- **CONFIDENCE:** VERIFIED

## E-002 — Build produces single HTML file
- **CLAIM:** `vite-plugin-singlefile` inlines all assets
- **SOURCE:** `vite.config.ts`
- **LINES:** 6, 13
- **USED_IN:** 00, 01, 03, 25
- **CONFIDENCE:** VERIFIED

## E-003 — App is a God Component
- **CLAIM:** App.tsx is 802 lines with 20+ useState hooks
- **SOURCE:** `src/App.tsx`
- **LINES:** 1-802 (whole file)
- **USED_IN:** 00, 01, 03, 10, 11, 28
- **CONFIDENCE:** VERIFIED

## E-004 — 8 windows registered
- **CLAIM:** Exactly 8 window entries in state
- **SOURCE:** `src/App.tsx`
- **LINES:** 104-113
- **USED_IN:** 00, 05, 07, 09, 10
- **CONFIDENCE:** VERIFIED

## E-005 — LocalStorage key `artyc2_battery_coords`
- **CLAIM:** Single persistence key
- **SOURCE:** `src/components/LoginModal.tsx`, `src/App.tsx`
- **LINES:** LoginModal:44, 73; App:302
- **USED_IN:** 00, 16
- **CONFIDENCE:** VERIFIED

## E-006 — IndexedDB delete of non-existent DB
- **CLAIM:** `fdc_offline_queue` is never created by any code
- **SOURCE:** grep `indexedDB` across `src/`
- **LINE:** App.tsx:306
- **USED_IN:** 00, 16, 27 (ISSUE-10), 29
- **CONFIDENCE:** VERIFIED

## E-007 — Sound synth via Web Audio API
- **CLAIM:** 5 sound functions using AudioContext
- **SOURCE:** `src/components/SoundGenerator.ts`
- **LINES:** 1-137 (whole file)
- **USED_IN:** 00, 03, 08, 17, 20
- **CONFIDENCE:** VERIFIED

## E-008 — Ballistics engine has 5 exports + 12-row fire table
- **CLAIM:** interpolateBallistics, calculateWindSplitting, calculatePolarPlot, milsToDegrees, degreesToMils
- **SOURCE:** `src/utils/ballistics.ts`
- **LINES:** 11-24 (table), 29-127 (functions)
- **USED_IN:** 00, 14, 15
- **CONFIDENCE:** VERIFIED

## E-009 — Login has no real auth
- **CLAIM:** Only non-empty check + setTimeout mock
- **SOURCE:** `src/components/LoginModal.tsx`
- **LINES:** 29-58
- **USED_IN:** 00, 23, 27
- **CONFIDENCE:** VERIFIED

## E-010 — No test files
- **CLAIM:** Zero test/spec files
- **SOURCE:** file listing
- **USED_IN:** 00, 24
- **CONFIDENCE:** VERIFIED

## E-011 — framer-motion unused
- **CLAIM:** No imports of framer-motion anywhere
- **SOURCE:** grep across `src/`
- **PACKAGE:** package.json:13
- **USED_IN:** 00, 19, 29
- **CONFIDENCE:** VERIFIED

## E-012 — `cn.ts` has no consumers
- **CLAIM:** `utils/cn.ts` exists but is not imported
- **SOURCE:** grep `from ".*utils/cn"` = 0 results
- **PATH:** src/utils/cn.ts
- **USED_IN:** 02, 19, 29
- **CONFIDENCE:** VERIFIED

## E-013 — GUN_VE_VARIANCES constant array
- **CLAIM:** 6 hardcoded VE values [+1.2, -0.8, +0.4, -1.5, +0.2, -0.5]
- **SOURCE:** `src/utils/ballistics.ts`
- **LINES:** 132-139
- **USED_IN:** 07, 11, 13, 14, 15
- **CONFIDENCE:** VERIFIED

## E-014 — Fire mission timer 10Hz
- **CLAIM:** setInterval(100ms) with 0.1s decrement
- **SOURCE:** `src/App.tsx`
- **LINES:** 235-267
- **USED_IN:** 01, 06, 12, 13
- **CONFIDENCE:** VERIFIED

## E-015 — Misfire timer 1Hz, 30 min
- **CLAIM:** setInterval(1000ms), initial 1800, plays alarm every 10s
- **SOURCE:** `src/App.tsx`
- **LINES:** 269-290
- **USED_IN:** 06, 12, 13
- **CONFIDENCE:** VERIFIED

## E-016 — Kill Switch actions
- **CLAIM:** Wipes state, localStorage.clear, indexedDB.deleteDatabase, forceLockout
- **SOURCE:** `src/App.tsx`
- **LINES:** 292-313
- **USED_IN:** 04, 06, 09, 13, 16, 23
- **CONFIDENCE:** VERIFIED

## E-017 — Windows lifted state array
- **CLAIM:** `windows[]` with 8 entries containing x/y/w/h/isOpen/isMinimized/zIndex
- **SOURCE:** `src/App.tsx:104-113`
- **TYPE:** `WindowManager.tsx:5-18`
- **USED_IN:** 04, 07, 09, 10, 15
- **CONFIDENCE:** VERIFIED

## E-018 — Window drag/resize implementation
- **CLAIM:** mousedown → global mousemove/mouseup listeners
- **SOURCE:** `src/components/WindowManager.tsx`
- **LINES:** 50-121
- **USED_IN:** 04, 08, 21
- **CONFIDENCE:** VERIFIED

## E-019 — TacticalMap on Canvas
- **CLAIM:** Full-screen Canvas 2D drawing
- **SOURCE:** `src/components/TacticalMap.tsx` (whole file)
- **USED_IN:** 05, 18
- **CONFIDENCE:** VERIFIED

## E-020 — 4-way navigation redundancy
- **CLAIM:** Same windows accessible from Header, Desktop Icons, Taskbar, Start Menu
- **SOURCE:** `src/App.tsx`
- **LINES:** Header:419-435; Desktop:470-490; Taskbar:746-767; StartMenu:677-689
- **USED_IN:** 05, 09, 27, 28, 29
- **CONFIDENCE:** VERIFIED

## E-021 — Simulate Call uses inline polar math
- **CLAIM:** Does NOT call `calculatePolarPlot()` — inline `sin/cos`
- **SOURCE:** `src/App.tsx`
- **LINES:** 315-330 (specifically 321-322)
- **USED_IN:** 04 (F028), 14, 27 (ISSUE-05), 29
- **CONFIDENCE:** VERIFIED

## E-022 — Crater CB has hardcoded coords
- **CLAIM:** `enemyEasting=34500, enemyNorthing=48500`
- **SOURCE:** `src/components/HowitzerWindow.tsx` crater submit
- **USED_IN:** 04 (F017), 13 (BR-014), 27 (ISSUE-06)
- **CONFIDENCE:** VERIFIED

## E-023 — Compass headingMils not consumed downstream
- **CLAIM:** State exists, only round-trips to CompassWindow
- **SOURCE:** grep of `headingMils` across `src/`; FdcWindow prop list
- **USED_IN:** 04 (F024), 05 (CA-02), 27 (ISSUE-02)
- **CONFIDENCE:** VERIFIED

## E-024 — Fuze time not consumed
- **CLAIM:** Only WeaponsWindow slider updates, FdcWindow does not read
- **SOURCE:** grep of `fuzeTime` in `FdcWindow.tsx` = 0
- **USED_IN:** 04 (F021), 27 (ISSUE-01)
- **CONFIDENCE:** VERIFIED

## E-025 — Grid Offset not consumed
- **CLAIM:** Only App footer displays; no calc site
- **SOURCE:** grep `gridOffset` across `src/`
- **USED_IN:** 04 (F015), 05 (CA-03), 27 (ISSUE-03)
- **CONFIDENCE:** VERIFIED

## E-026 — Supp Charge warning non-blocking
- **CLAIM:** MunitionsWindow warning UI only; not in `isFireSafe`
- **SOURCE:** `MunitionsWindow.tsx:18-64` + FdcWindow gate
- **USED_IN:** 04 (F026), 27 (ISSUE-04)
- **CONFIDENCE:** VERIFIED

## E-027 — Fire tables 2500–8000m
- **CLAIM:** 12 rows in CHARGE_5_FIRE_TABLE
- **SOURCE:** `src/utils/ballistics.ts:11-24`
- **USED_IN:** 01, 14 (CALC-01), 15 (E-006), 27 (ISSUE-21)
- **CONFIDENCE:** VERIFIED

## E-028 — Coefficient constants
- **CLAIM:** headwind ×3.5, crosswind ×0.8, VE ×0.15, safety +5, base defl 3200
- **SOURCE:** ballistics.ts:87-91; FdcWindow.tsx:~62-89
- **USED_IN:** 13 (BR-016..020), 14 (constants table), 27 (ISSUE-19, 20)
- **CONFIDENCE:** VERIFIED

## E-029 — ICM 600m threshold
- **CLAIM:** friendlyDistance >= 600 → safe
- **SOURCE:** App.tsx:344; WeaponsWindow.tsx:33
- **USED_IN:** 04 (F022), 13 (BR-023), 14
- **CONFIDENCE:** VERIFIED

## E-030 — Level bubble threshold
- **CLAIM:** drift < 2 (pixels)
- **SOURCE:** App.tsx:342; CompassWindow.tsx:35
- **USED_IN:** 13 (BR-022), 14 (CALC-08), 22
- **CONFIDENCE:** VERIFIED

## E-031 — Traverse thresholds
- **CLAIM:** 10m dist, 2 mils bearing
- **SOURCE:** SurveillanceWindow.tsx:52-58
- **USED_IN:** 04 (F012), 13 (BR-010), 14 (CALC-12), 22
- **CONFIDENCE:** VERIFIED

## E-032 — Google Fonts (only external URL)
- **CLAIM:** Only network resource loaded
- **SOURCE:** `index.html:8-11`
- **USED_IN:** 17 (API-01), 23
- **CONFIDENCE:** VERIFIED

## E-033 — No React Context / no store lib
- **CLAIM:** No createContext, no Zustand/Redux
- **SOURCE:** grep `createContext` = 0, package.json = no store libs
- **USED_IN:** 03, 10, 11, 28 (TD-02)
- **CONFIDENCE:** VERIFIED

## E-034 — Round-up Min QE rule
- **CLAIM:** `Math.ceil(rawMinQE)`
- **SOURCE:** `FdcWindow.tsx:~63`
- **USED_IN:** 01, 13 (BR-020), 14 (CALC-11)
- **CONFIDENCE:** VERIFIED

## E-035 — Compass N/S auto +180°
- **CLAIM:** `isNorthbound = deg ≥ 270 || deg ≤ 90; correctedAngle = isNorthbound ? deg : (deg+180)%360`
- **SOURCE:** `CompassWindow.tsx:31-33`
- **USED_IN:** 01, 13 (BR-024), 14 (CALC-20)
- **CONFIDENCE:** VERIFIED

## E-036 — Log buffer max 50
- **CLAIM:** `logs = [new, ...prev.slice(0, 49)]`
- **SOURCE:** `App.tsx:207-210`
- **USED_IN:** 13 (BR-006)
- **CONFIDENCE:** VERIFIED

## E-037 — Original documents not in repo
- **CLAIM:** No `FIRST_ALL_PROJECT.md`, `lithos-hero.md`, `implementation_plan.md`
- **SOURCE:** `list_files` output
- **USED_IN:** 00, 02, 30, 31
- **CONFIDENCE:** VERIFIED

## E-038 — No git tooling available
- **CLAIM:** Cannot record branch/commit SHA
- **SOURCE:** No git-related tool in environment
- **USED_IN:** 00
- **CONFIDENCE:** VERIFIED (limitation of environment)

## E-039 — Restored banner 4s
- **CLAIM:** `setTimeout(4000)` auto-hide
- **SOURCE:** `App.tsx:198-201`
- **USED_IN:** 06, 13 (BR-029)
- **CONFIDENCE:** VERIFIED

## E-040 — 8 desktop icons
- **CLAIM:** hardcoded array of 8 emoji shortcuts
- **SOURCE:** `App.tsx:85-94`
- **USED_IN:** 04, 15 (E-009)
- **CONFIDENCE:** VERIFIED

## E-041 — Volume toggle fake
- **CLAIM:** `audioVolume` state only toggles emoji + log; no Web Audio gain control
- **SOURCE:** `App.tsx:70,781-791`; `SoundGenerator.ts` has no global gain node tied to state
- **USED_IN:** 04 (F034), 27 (ISSUE-14)
- **CONFIDENCE:** VERIFIED

## E-042 — TargetData interface duplicated
- **CLAIM:** Redeclared in ForwardObserverWindow.tsx and FdcWindow.tsx
- **SOURCE:** `ForwardObserverWindow.tsx:7-13`, `FdcWindow.tsx:7-13`
- **USED_IN:** 15, 28 (TD-03), 29
- **CONFIDENCE:** VERIFIED

## E-043 — INITIAL_GUN_POSITIONS
- **CLAIM:** 6 gun offsets seeded
- **SOURCE:** `ballistics.ts:147-154`
- **USED_IN:** 04, 13 (BR-037), 15
- **CONFIDENCE:** VERIFIED

## E-044 — friendlyCoords hardcoded const
- **CLAIM:** Not React state — const in App.tsx
- **SOURCE:** `App.tsx:26`
- **USED_IN:** 13 (BR-035), 15 (E-004)
- **CONFIDENCE:** VERIFIED

## E-045 — Auto-center on target
- **CLAIM:** useEffect resets panOffset when activeTarget changes
- **SOURCE:** `TacticalMap.tsx` (useEffect on activeTarget)
- **USED_IN:** 18, 27 (ISSUE-13)
- **CONFIDENCE:** VERIFIED

---

## USAGE OF EVIDENCE ACROSS DOCUMENTS

| Document | Evidence IDs cited |
|---|---|
| 00_MASTER | E-001..E-013, E-016, E-017, E-020..E-025, E-037, E-038, E-041 |
| 01_SYSTEM | E-001..E-005, E-007, E-014, E-034 |
| 02_REPO | E-012, E-037 |
| 03_ARCH | E-002, E-003, E-018, E-033 |
| 04_FEATURES | E-004, E-013, E-016..E-025, E-026, E-040, E-041, E-042, E-043 |
| 05_TAXONOMY | E-004, E-017, E-020..E-026 |
| 06_WORKFLOWS | E-009, E-014, E-015, E-016, E-039 |
| 07_UI_SCREENS | E-004, E-017 |
| 08_UI_BEHAVIOR | E-007, E-018, E-020 |
| 09_NAVIGATION | E-004, E-020 |
| 10_COMPONENTS | E-003, E-011, E-012, E-017, E-033 |
| 11_STATE | E-003, E-013, E-017, E-023, E-024, E-025, E-033 |
| 12_DATA_FLOW | E-014, E-015, E-016, E-021, E-023..E-025 |
| 13_BUSINESS | E-009, E-013, E-023, E-027..E-031, E-034..E-036, E-039, E-043, E-044 |
| 14_CALCULATIONS | E-008, E-013, E-027, E-028, E-034, E-035 |
| 15_DATA_MODEL | E-004, E-005, E-013, E-017, E-042, E-043, E-044 |
| 16_STORAGE | E-005, E-006, E-016 |
| 17_APIs | E-006, E-007, E-032 |
| 18_MAP | E-019, E-045 |
| 19_DEPS | E-001, E-011, E-012 |
| 20_DESIGN | (all inline, no re-cite needed) |
| 21_RESPONSIVE | (spot: App.tsx:742,776) |
| 22_VALIDATION | E-009, E-030, E-031 |
| 23_SECURITY | E-005, E-006, E-009, E-032 |
| 24_TESTS | E-010 |
| 25_BUILD | E-001, E-002 |
| 26_STATUS | (aggregated from features) |
| 27_ISSUES | E-021, E-022, E-023, E-024, E-025, E-026, E-045, E-041 |
| 28_DEBT | E-003, E-011, E-012, E-013, E-020, E-021, E-023..E-026, E-033, E-042 |
| 29_DEAD | E-006, E-011, E-012, E-021, E-042 |
| 30_INTENT | E-006, E-011, E-012, E-023..E-026, E-037 |
| 31_DRIFT | E-006, E-011, E-023..E-026, E-033, E-037 |
| 32_GAPS | (aggregated) |

---

## SELF-AUDIT ANNOTATIONS

Each evidence entry has been verified against direct file reads performed during this session. Where line ranges are approximated (`~62`), the surrounding context was confirmed but exact line numbers were rounded due to file-read pagination. Numbers marked with `~` should be treated as APPROXIMATE_LOCATION.

**Confidence distribution across all evidence entries:**
- VERIFIED: 44 / 45 (98%)
- INFERRED: 0 (this file only records direct evidence)
- UNKNOWN: 1 / 45 (E-038, git tools unavailable)

**No claim in the 34-file package is presented as VERIFIED without a corresponding EVIDENCE_ID here or a direct file+line citation inline.**
