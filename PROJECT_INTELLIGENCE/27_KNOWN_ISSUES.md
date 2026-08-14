# 27_KNOWN_ISSUES

> Only issues with evidence from repository. Severity: LOW / MEDIUM / HIGH / CRITICAL.

---

## ISSUE-01: fuzeTime state has no downstream consumer
- **SEVERITY:** MEDIUM
- **EVIDENCE:** grep `fuzeTime` in `FdcWindow.tsx` = 0 hits; only WeaponsWindow slider updates it, MunitionsWindow does not consume it
- **IMPACT:** User configures VT airburst time but has no effect on projectile behavior — misleading UX
- **PATH:** `App.tsx:52,594`, `WeaponsWindow.tsx`

## ISSUE-02: headingMils from CompassWindow disconnected from FDC
- **SEVERITY:** MEDIUM
- **EVIDENCE:** `App.tsx:615-620` — headingMils only passed back to CompassWindow itself; `FdcWindow.tsx` prop list does not include headingMils
- **IMPACT:** The compass interaction "does nothing useful" from a firing standpoint
- **RELATED:** CA-02 in taxonomy

## ISSUE-03: gridOffset from Surveillance not used in any calculation
- **SEVERITY:** MEDIUM
- **EVIDENCE:** grep `gridOffset` returns only App.tsx state declaration + prop pass to SurveillanceWindow + footer display; NO calc site
- **IMPACT:** Slide/Swing calibration is decorative

## ISSUE-04: supplementaryCharge warning is non-blocking
- **SEVERITY:** HIGH (safety-related in intent)
- **EVIDENCE:** `MunitionsWindow.tsx:18-64` shows warning card but does not participate in `isFireSafe` gate
- **IMPACT:** VT airburst + supp charge can still be "fired" — safety label misleading

## ISSUE-05: Simulate Call reimplements Polar Plot inline
- **SEVERITY:** LOW
- **EVIDENCE:** `App.tsx:321-322` uses `Math.sin(1200/6400×2π)` inline instead of `calculatePolarPlot()`
- **IMPACT:** Code duplication; formula divergence risk

## ISSUE-06: Counter-Battery target coordinates are hardcoded
- **SEVERITY:** HIGH (semantic incorrectness)
- **EVIDENCE:** `HowitzerWindow.tsx` CB submit uses `enemyEasting = 34500, enemyNorthing = 48500`
- **IMPACT:** Feature displays as "resolved" but result is identical regardless of splash inputs

## ISSUE-07: Multiple redundant navigation controls for same actions
- **SEVERITY:** LOW
- **EVIDENCE:** F031/F032/F033/F035 all open same windows; F028/F029 exist in ControlPanel + Start Menu
- **IMPACT:** Increased maintenance surface; user confusion

## ISSUE-08: OPSEC toggle has partial scope
- **SEVERITY:** MEDIUM
- **EVIDENCE:** `App.tsx:412` header text still shows `E:X N:Y` even when `hideBatteryCoords===true`
- **IMPACT:** Toggle claims to hide OPSEC info but leaks in multiple places

## ISSUE-09: Kill Switch clears localStorage entirely
- **SEVERITY:** MEDIUM
- **EVIDENCE:** `App.tsx:302` `localStorage.clear()`
- **IMPACT:** If future features add other keys, Kill Switch nukes them too

## ISSUE-10: indexedDB.deleteDatabase targets non-existent DB
- **SEVERITY:** LOW
- **EVIDENCE:** `App.tsx:306` — `fdc_offline_queue` never created by any `indexedDB.open()`
- **IMPACT:** Dead cleanup logic (harmless but misleading)

## ISSUE-11: No touch/pointer handlers for drag operations
- **SEVERITY:** HIGH (mobile users)
- **EVIDENCE:** `WindowManager.tsx`, `TacticalMap.tsx`, `CompassWindow.tsx`, `HowitzerWindow.tsx` all use `mousedown/move/up`
- **IMPACT:** Window drag, map pan, compass rotation, bubble drag, gun repositioning all broken on touch devices

## ISSUE-12: No click-outside-to-close for Start Menu
- **SEVERITY:** LOW
- **EVIDENCE:** `App.tsx:664-717` — only Start button toggles; menu items close via `setIsStartMenuOpen(false)` after action
- **IMPACT:** Menu stays open if user clicks elsewhere

## ISSUE-13: Auto-center on activeTarget overrides user pan
- **SEVERITY:** LOW-MEDIUM
- **EVIDENCE:** `TacticalMap.tsx` useEffect resets `panOffset` whenever activeTarget changes
- **IMPACT:** User manually pans → creates target → pan lost

## ISSUE-14: audioVolume toggle is fake
- **SEVERITY:** LOW
- **EVIDENCE:** `App.tsx:70,781-791` — state exists but `SoundGenerator.ts` has no gain-control tied to it
- **IMPACT:** Users cannot actually mute sounds via the tray icon

## ISSUE-15: Window drag can exit viewport on X/right/bottom axes
- **SEVERITY:** MEDIUM
- **EVIDENCE:** `WindowManager.tsx:74-77` — only `y < 40` bounded
- **IMPACT:** Window can become unreachable if dragged fully off-screen right; requires page refresh

## ISSUE-16: Window state (position/size/isOpen) not persisted
- **SEVERITY:** MEDIUM
- **EVIDENCE:** No `windows` state in localStorage — only `batteryCoords`
- **IMPACT:** Every refresh resets layout

## ISSUE-17: Traverse form closure formula uses placeholder logic
- **SEVERITY:** MEDIUM
- **EVIDENCE:** `SurveillanceWindow.tsx:57` — code comment says "placeholder simple evaluation"
- **IMPACT:** Closure bearing error may not match doctrinal calculation

## ISSUE-18: Sound speed hardcoded (no atmospheric adjustment)
- **SEVERITY:** LOW
- **EVIDENCE:** `ForwardObserverWindow.tsx:79` — literal 340
- **IMPACT:** Flash-to-Bang distance simplified

## ISSUE-19: Wind coefficients hardcoded, unattributed
- **SEVERITY:** MEDIUM
- **EVIDENCE:** `ballistics.ts:90-91` — `× 3.5`, `× 0.8` with only comment "Rule of thumb"
- **IMPACT:** Values may not match specific tables of record; no citation

## ISSUE-20: VE elevation shift factor hardcoded
- **SEVERITY:** LOW
- **EVIDENCE:** `FdcWindow.tsx:~247` — `× 0.15` for per-gun QE adjustment
- **IMPACT:** No config; per-piece VE assumed to be linear

## ISSUE-21: Fire table has only 12 rows (2500-8000m)
- **SEVERITY:** LOW (by design, mock data)
- **EVIDENCE:** `ballistics.ts:11-24`
- **IMPACT:** Cannot simulate short/long-range firing; boundary interpolation flag raised

## ISSUE-22: Native window.confirm() is only Kill Switch guard
- **SEVERITY:** LOW
- **EVIDENCE:** `ControlPanelWindow.tsx:29`
- **IMPACT:** Style inconsistency (all other dialogs are custom Tailwind); native dialog can be dismissed with Enter accidentally

## ISSUE-23: All state changes re-render entire dashboard
- **SEVERITY:** MEDIUM (performance)
- **EVIDENCE:** No `React.memo`, `useMemo`, `useCallback` used anywhere (grep = 0)
- **IMPACT:** Fire mission 10Hz timer causes 10 full re-renders/sec; noticeable on low-end devices

## ISSUE-24: `zIndex` grows unbounded
- **SEVERITY:** LOW
- **EVIDENCE:** `App.tsx:117-126` — `maxZ + 1` with no reset
- **IMPACT:** After many focus events, `zIndex` reaches large numbers (harmless but unclean)

## ISSUE-25: No aria-live for critical events (splash, misfire)
- **SEVERITY:** MEDIUM (accessibility)
- **EVIDENCE:** grep `aria-live` = 0 hits
- **IMPACT:** Screen reader users don't hear countdown / impact announcements

## ISSUE-26: `focus:outline-none` used extensively
- **SEVERITY:** MEDIUM (accessibility)
- **EVIDENCE:** grep `focus:outline-none` = many hits
- **IMPACT:** Keyboard users lose focus indicator

## ISSUE-27: Thai/English label mixing in tooltips
- **SEVERITY:** LOW
- **EVIDENCE:** `App.tsx:447` `title="Toggle Friendly Position Privacy..."` (English) but visible label is Thai
- **IMPACT:** i18n inconsistency

## ISSUE-28: Text sizes vary by 0.5px increments (8/8.5/9/9.5)
- **SEVERITY:** LOW
- **EVIDENCE:** grep shows `text-[8px]`, `text-[8.5px]`, `text-[9px]`, `text-[9.5px]`
- **IMPACT:** Design inconsistency, likely copy-paste drift

## ISSUE-29: `text-vertical` class in Start Menu is unknown
- **SEVERITY:** LOW
- **EVIDENCE:** `App.tsx:669` uses `className="... text-vertical ..."` — Tailwind does not ship this utility
- **IMPACT:** Class may be silently ignored; effect achieved via inline `writingMode` style

## ISSUE-30: TacticalMap has local `milsToDegrees` duplicating utils
- **SEVERITY:** LOW
- **EVIDENCE:** `ballistics.ts:121` exports `milsToDegrees`; `TacticalMap.tsx` end-of-file defines same function locally
- **IMPACT:** Duplication risk

## ISSUE-31: Types re-declared 3× (TargetData in 3 files)
- **SEVERITY:** LOW-MEDIUM
- **EVIDENCE:** identical `interface TargetData` in ForwardObserverWindow.tsx and FdcWindow.tsx + inline in App.tsx
- **IMPACT:** Schema drift risk

## ISSUE-32: `lucide-react` version `^1.31.0` unusual
- **SEVERITY:** UNKNOWN
- **EVIDENCE:** `package.json:14`
- **IMPACT:** UNKNOWN — could not verify at build time without network install

## ISSUE-33: No lockfile
- **SEVERITY:** MEDIUM
- **EVIDENCE:** file listing does not include `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`
- **IMPACT:** Non-reproducible builds

## ISSUE-34: No LICENSE / README / CHANGELOG at root
- **SEVERITY:** LOW
- **EVIDENCE:** file listing
- **IMPACT:** Legal/onboarding unclear

## ISSUE-35: `noUnusedLocals: true` bypassed in some files (potential)
- **SEVERITY:** UNKNOWN — build succeeded so probably clean, but historical CI would catch drift
- **EVIDENCE:** No `eslint-disable` grep found; `tsc` catches it during build

## SEVERITY SUMMARY

| Severity | Count |
|---|---|
| CRITICAL | 0 |
| HIGH | 3 (ISSUE-04, ISSUE-06, ISSUE-11) |
| MEDIUM | 14 |
| LOW | 18 |
