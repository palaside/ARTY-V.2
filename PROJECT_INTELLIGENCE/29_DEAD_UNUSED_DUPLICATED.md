# 29_DEAD_UNUSED_DUPLICATED

## DEAD COMPONENTS

**VERIFIED — None.** All 10 UI components are imported and rendered by `App.tsx`.

## DEAD FILES

### DEAD-01: `src/utils/cn.ts`
- **PATH:** `src/utils/cn.ts` (7 lines)
- **NATURE:** Exports `cn()` helper that combines `clsx` + `twMerge`
- **EVIDENCE:** grep for `from "..*/utils/cn"` = 0 results; grep for `import.*cn.*utils` = 0
- **IMPACT:** Utility exists but nothing calls it; keeps 2 dependencies alive
- **RECOMMENDATION (not taken):** Remove file + remove `clsx`, `tailwind-merge` from deps

## UNUSED IMPORTS

**VERIFIED — Cannot be exhaustively grep'd without full scan, but TypeScript `noUnusedLocals` in tsconfig catches these at build time.** Build passed so most likely none.

**Manual spot checks:**
- `App.tsx` imports appear all used
- Each Window's lucide-react imports match usage
- No `import` lines with unused symbols found in recent reads

## UNUSED DEPENDENCIES (Runtime)

| Package | Evidence |
|---|---|
| `framer-motion` (`^13.1.0`) | Zero source files import `framer-motion` |
| `clsx` (`2.1.1`) | Only cn.ts imports it — but cn.ts has zero consumers → dead chain |
| `tailwind-merge` (`3.4.0`) | Same as clsx — via dead cn.ts |

## UNREACHABLE VIEWS

**VERIFIED — None.**
- All 8 window components can be opened from at least 4 navigation surfaces
- Login and Setup screens gate app entry; Lockout screen reachable via Kill Switch
- All conditionals in `App.tsx` render branches are reachable given valid state transitions

## DUPLICATE FEATURES (Same behavior in multiple places)

### DUP-01: "Simulate Spotter Call" — 2 access points
- ControlPanelWindow button (`ControlPanelWindow.tsx:75-83`) + Start Menu item (`App.tsx:694-703`)
- Both call `handleSimulateIncomingCall`

### DUP-02: "Kill Switch" — 2 access points
- ControlPanelWindow button (`ControlPanelWindow.tsx:112-120`) + Start Menu item (`App.tsx:704-713`)

### DUP-03: Window open — 4 access points per window (× 8 windows = 32 controls)
- Header quick-launch (`App.tsx:419-435`)
- Desktop icons (`App.tsx:470-490`)
- Taskbar tasks (`App.tsx:746-767`)
- Start Menu programs (`App.tsx:677-689`)

## DUPLICATE LOGIC

### DUPL-01: Polar plot math
- **CANONICAL:** `ballistics.ts:100-116` (`calculatePolarPlot`)
- **DUPLICATE:** `App.tsx:321-322` (inline in `handleSimulateIncomingCall`)

### DUPL-02: `milsToDegrees` conversion
- **CANONICAL:** `ballistics.ts:121-123`
- **DUPLICATE:** local helper defined at bottom of `TacticalMap.tsx`

### DUPL-03: Level bubble drift check
- **PRIMARY:** `App.tsx:342` (`levelIsCentered`)
- **DUPLICATE:** `CompassWindow.tsx:35` (`isLevel = bubbleDrift < 2`)
- Both compute same formula; used independently

### DUPL-04: Target creation boilerplate
- Grid, Polar, Shift, Crater CB, Simulate Call — 5 places manually construct `{id, name, easting, northing, altitude}` object literal

### DUPL-05: `TargetData` interface
- **PATHS:** `ForwardObserverWindow.tsx:7-13`, `FdcWindow.tsx:7-13`
- Identical structural type declared twice

### DUPL-06: BatteryCoords type
- Inline `{easting, northing, altitude, simDir}` re-declared in prop types across at least 5 files

### DUPL-07: `Target` inline structural type
- Re-declared inline in ~15 places

### DUPL-08: Global mousemove/mouseup listener pattern
- Repeated in `WindowManager.tsx` (drag + resize), `CompassWindow.tsx` (compass + bubble), `HowitzerWindow.tsx` (M.17 board)
- 6+ separate implementations of the same pattern

## STALE ASSETS

**VERIFIED — None.**
- No image files, audio files, or font files in repo (except Google Fonts loaded via CSS)
- No unused `public/` folder

## ORPHAN FILES

- `src/utils/cn.ts` (see DEAD-01)
- `docs/C2_CLONE_GUIDE.md` — documentation created by prior sessions, not imported by any code, but intentionally kept as reference
- `WORKFLOW.md` — same as above

**Assessment:** These are not "orphans" in a harmful sense; they are documentation artifacts.

## COMMENTED-OUT CODE

**Spot checks:** did not observe large commented blocks in the files read. Some inline comments (`// TODO`, `// FIXME`) may exist — not fully surveyed.

## UNREACHABLE BRANCHES

### UB-01: `interpolateBallistics` fallback
- **PATH:** `ballistics.ts:62` — returns `{ qe: 0, tof: 0, error: "OUT_OF_BOUNDS" }`
- **REACHABILITY:** unreachable in practice — the two boundary checks at lines 32 & 40 cover all `range` values outside [2500, 8000], and the for-loop covers all values inside → return statement is dead code
- **EVIDENCE:** `ballistics.ts:32-62`

### UB-02: `try/catch` on `indexedDB.deleteDatabase`
- **PATH:** `App.tsx:305-309`
- Delete of non-existent DB does not throw (per spec) → catch never triggers
- Effectively dead branch

### UB-03: JSON.parse catch in LoginModal
- **PATH:** `LoginModal.tsx:47-56`
- Reachable only if LocalStorage contains malformed JSON (user tampering)

## SUMMARY

| Category | Count |
|---|---|
| Dead files | 1 (`cn.ts`) |
| Dead dependencies | 3 (`framer-motion`, `clsx`, `tailwind-merge`) |
| Duplicate feature UI | 3 sets (F028, F029, window-open × 4) |
| Duplicate logic sites | 8 |
| Duplicate type declarations | 3+ |
| Duplicate mouse handler patterns | 6+ |
| Unreachable code branches | 2 (fallback + IDB catch) |

**Total code smells:** ~25 distinct items — none is a critical bug on its own, but collectively represent significant cleanup opportunity.

**Note per Task Contract:** Nothing is deleted or moved. This document catalogs findings only.
