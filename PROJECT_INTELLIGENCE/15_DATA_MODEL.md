# 15_DATA_MODEL

> Interfaces / types / models / persistent entities ที่พบใน repository.

---

## E-001: Target (Inline Type)
- **NAME:** Target (unnamed structural type — inline in multiple places)
- **PATH:** `App.tsx:29-33` (state declaration), `App.tsx:33-39` (activeTarget initial), passed as props to multiple windows
- **FIELDS:**
  | Field | Type | Notes |
  |---|---|---|
  | `id` | string | e.g. `T-427`, `POLAR-...`, `SHIFT-...`, `CB-...`, `FO-...` |
  | `name` | string | display label |
  | `easting` | number (m, UTM) | — |
  | `northing` | number (m, UTM) | — |
  | `altitude` | number (m) | — |
- **RELATIONSHIPS:** None formal — `targetsList` contains many; `activeTarget` points to one (may be null)
- **CREATED_BY:** `handleAddTarget` in App (via FO Grid/Polar/Shift, Howitzer Crater, App Simulate Call), initial seed
- **UPDATED_BY:** `handleSetTarget` (App), Adjustment pad (ForwardObserver)
- **READ_BY:** TacticalMap, FdcWindow (auto-sync), ForwardObserverWindow (Shift dropdown)
- **PERSISTENCE:** None — lost on refresh
- **⚠️ ANTI-PATTERN:** Same structural type declared inline in **~15 places** — no `interface Target { ... }` extracted
- **EVIDENCE:** `App.tsx:29,33,218,226,545,563`, `ForwardObserverWindow.tsx:7-13` (has local `TargetData` interface, structurally identical), `FdcWindow.tsx:7-13` (again — 3rd redeclaration)
- **CONFIDENCE:** VERIFIED

## E-002: TargetData Interface (Redeclared)
- **PATH:** `ForwardObserverWindow.tsx:7-13`, `FdcWindow.tsx:7-13`
- **FIELDS:** identical to E-001
- **⚠️ DUPLICATE_TYPE:** two identical `interface TargetData` declarations
- **CONFIDENCE:** VERIFIED

## E-003: BatteryCoords (Inline Type)
- **PATH:** `App.tsx:21` state, `LoginModal.tsx:9` prop type, `FdcWindow.tsx:18` prop type, `ForwardObserverWindow.tsx:23` prop type, `TacticalMap.tsx` prop type
- **FIELDS:**
  | Field | Type |
  |---|---|
  | `easting` | number |
  | `northing` | number |
  | `altitude` | number |
  | `simDir` | number (mils, 0-6400) |
- **CREATED_BY:** LoginModal Setup form → localStorage → App state
- **PERSISTENCE:** **YES** — `localStorage['artyc2_battery_coords']` as JSON
- **⚠️ REDECLARED:** at least 4 times inline

## E-004: FriendlyCoords (Constant)
- **PATH:** `App.tsx:26`
- **NATURE:** hardcoded const, not React state
- **FIELDS:** easting, northing, altitude
- **VALUES:** `{32500, 44500, 110}`
- **USED_BY:** friendlyDist calc, TacticalMap render
- **CONFIDENCE:** VERIFIED

## E-005: GunPosition Interface
- **PATH:** `src/utils/ballistics.ts:141-145`
- **DECLARATION:**
  ```typescript
  export interface GunPosition {
    id: number;
    offsetX: number; // meters from battery center
    offsetY: number; // meters from battery center
  }
  ```
- **RELATIONSHIPS:** array of 6 in `App.gunPositions`
- **CREATED_BY:** `INITIAL_GUN_POSITIONS` const seed
- **UPDATED_BY:** HowitzerWindow M.17 drag → App.setGunPositions
- **READ_BY:** FdcWindow (per-gun corrections), TacticalMap (rendering)
- **PERSISTENCE:** None
- **CONFIDENCE:** VERIFIED

## E-006: FireTableEntry Interface
- **PATH:** `src/utils/ballistics.ts:5-9`
- **DECLARATION:**
  ```typescript
  export interface FireTableEntry {
    range: number;      // meters
    elevation: number;  // mils
    tof: number;        // seconds
  }
  ```
- **INSTANCE:** `CHARGE_5_FIRE_TABLE` — 12 rows spanning 2500-8000m
- **PERSISTENCE:** Constant in source
- **CONFIDENCE:** VERIFIED

## E-007: WindowData Interface
- **PATH:** `src/components/WindowManager.tsx:5-18`
- **DECLARATION:**
  ```typescript
  export interface WindowData {
    id: string;
    title: string;
    thaiTitle: string;
    x: number;
    y: number;
    w: number;
    h: number;
    minW?: number;
    minH?: number;
    isOpen: boolean;
    isMinimized: boolean;
    zIndex: number;
  }
  ```
- **INSTANCES:** 8 in `App.windows` seed array
- **UPDATED_BY:** focus/close/minimize/toggle/drag/resize/maximize handlers in App.tsx
- **PERSISTENCE:** None
- **CONFIDENCE:** VERIFIED

## E-008: TraverseStation (Inline)
- **PATH:** `SurveillanceWindow.tsx:14-19` state initial
- **FIELDS:**
  | Field | Type |
  |---|---|
  | `id` | string (e.g. 'S1-S2') |
  | `start` | string |
  | `end` | string |
  | `bearing` | number (mils) |
  | `distance` | number (m) |
- **INSTANCES:** 4 (S1→S2, S2→S3, S3→S4, S4→S1) — hardcoded seed
- **PERSISTENCE:** None (session-local)
- **CONFIDENCE:** VERIFIED

## E-009: DesktopIcon (Inline in App.tsx)
- **PATH:** `App.tsx:85-94`
- **FIELDS:** id, label, desc, icon (emoji string)
- **INSTANCES:** 8 hardcoded
- **NATURE:** const array, not state
- **CONFIDENCE:** VERIFIED

## E-010: GridOffset (Inline)
- **PATH:** `App.tsx:47`
- **FIELDS:** slideX, slideY, swing (all number)
- **USED_BY:** Footer display only (see F015 stub)

## E-011: BubbleOffset (Inline)
- **PATH:** `App.tsx:46`
- **FIELDS:** x, y (number, pixel offset -15..+15)

## E-012: WindSplitting Return (Inline in Function)
- **PATH:** `ballistics.ts:74`
- **RETURN TYPE:**
  ```typescript
  { headwind: number; crosswind: number; rangeCorrection: number; deflectionCorrection: number }
  ```

## E-013: InterpolateBallistics Return
- **PATH:** `ballistics.ts:29`
- **RETURN TYPE:**
  ```typescript
  { qe: number; tof: number; error?: string }
  ```

## E-014: PolarPlot Return
- **PATH:** `ballistics.ts:105`
- **RETURN TYPE:** `{ easting: number; northing: number }`

## E-015: OnSuccess Callback Payload
- **PATH:** `LoginModal.tsx:6-10` (props type)
- **FIELDS:**
  ```typescript
  {
    operatorId: string;
    batteryCoords: { easting; northing; altitude; simDir };
    restored: boolean;
  }
  ```

## E-016: Logs (Simple)
- **TYPE:** `string[]` — max 50 entries
- **PATH:** `App.tsx:97`
- **⚠️ ANTI-PATTERN:** unstructured strings prevent filtering/searching/parsing

## E-017: SessionTime (Simple)
- **TYPE:** `string` — `hh:mm:ss` locale
- **PATH:** `App.tsx:71`

---

## SUMMARY: DATA MODEL HEALTH

| Concern | Status |
|---|---|
| Named interface files | Only `ballistics.ts` (2 interfaces) and `WindowManager.tsx` (1) |
| Inline / redeclared types | ~9 types — `Target/TargetData` redeclared 3+ times |
| No `types/` folder | Verified absent |
| No Zod / Yup / Runtime validation | Verified absent |
| Persisted schema versioning | None |
| Migration strategy | None |

**INFERRED:** For refactor, extract `types/` folder consolidating Target, BatteryCoords, GunPosition, WindowData, TraverseStation, DesktopIcon into a single shared module.
