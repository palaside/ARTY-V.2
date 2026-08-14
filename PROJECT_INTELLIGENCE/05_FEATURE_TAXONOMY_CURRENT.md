# 05_FEATURE_TAXONOMY_CURRENT

> บันทึกหมวดปัจจุบันเท่านั้น. **ห้ามเสนอ taxonomy ใหม่ในไฟล์นี้.**
> ถ้าพบว่าฟีเจอร์ดูผิดหมวด → mark `CATEGORY_ANOMALY: YES` พร้อม evidence แต่ยัง **ไม่ relocate**

## AS-IS CATEGORIES (จาก `App.tsx:104-113` windows registry + Global scope)

| Category ID | Thai Label | Container Component | Access Point |
|---|---|---|---|
| `observer` | ผตน. (สายตรวจการณ์หน้า) | `ForwardObserverWindow.tsx` | Window[0], header btn, desktop icon, start menu, taskbar |
| `surveillance` | สำรวจ/แผนที่ | `SurveillanceWindow.tsx` | Window[1], header btn, desktop icon, start menu, taskbar |
| `howitzer` | หมู่ปืน (ส่วนยิง) | `HowitzerWindow.tsx` | Window[2], header btn, desktop icon, start menu, taskbar |
| `fdc` | ศอย. (ศูนย์อำนวยการยิง) | `FdcWindow.tsx` | Window[3], header btn, desktop icon, start menu, taskbar |
| `weapons` | อาวุธ/กระสุน | `WeaponsWindow.tsx` | Window[4], header btn, desktop icon, start menu, taskbar |
| `compass` | เข็มทิศ M2 | `CompassWindow.tsx` | Window[5], header btn, desktop icon, start menu, taskbar |
| `munitions` | กระสุน 105 (ภาพตัด) | `MunitionsWindow.tsx` | Window[6], header btn, desktop icon, start menu, taskbar |
| `console` | ระบบควบคุม (Console) | `ControlPanelWindow.tsx` | Window[7], header btn, desktop icon, start menu, taskbar |
| `Global` | (n/a) | `App.tsx` + `LoginModal.tsx` + `TacticalMap.tsx` | Always visible or auth gate |
| `UI Shell` | (n/a) | `WindowManager.tsx` + header + footer | Wraps every window |

## FEATURE ↔ CATEGORY MAPPING

| FEATURE_ID | Name | PRIMARY_CURRENT_CATEGORY | SECONDARY_ACCESS | SHARED_WITH | CROSS_CATEGORY_DEPENDENCY | CATEGORY_ANOMALY |
|---|---|---|---|---|---|---|
| F001 | Login | Global | — | — | writes → all subsequent | — |
| F002 | Hydration | Global | — | — | reads localStorage | — |
| F003 | Setup | Global | — | — | writes localStorage → all reads later | — |
| F004 | Window Manager | UI Shell | — | ALL 8 windows | — | — |
| F005 | Tactical Map | Global | — | reads state from 5 windows | — | — |
| F006 | Grid target | observer | — | writes activeTarget → FDC | — | — |
| F007 | Polar plot | observer | — | writes activeTarget → FDC | uses `calculatePolarPlot` | — |
| F008 | Shift Known Point | observer | — | writes activeTarget → FDC | reads targetsList | — |
| F009 | Flash-to-Bang | observer | — | side-effects on Polar Distance field (same window) | — | — |
| F010 | Mil Formula | observer | — | side-effects on Polar Distance field | — | — |
| F011 | Adjustment Pad | observer | — | mutates activeTarget → FDC | — | — |
| F012 | Traverse | surveillance | — | — | — | — |
| F013 | Intersection | surveillance | — | log only (no target link) | — | — |
| F014 | Slope-to-Horizontal | surveillance | — | log only | — | — |
| F015 | Grid Calibration | surveillance | — | writes gridOffset → footer display only | — | **STUB** (see F015 doc) |
| F016 | M.17 Board | howitzer | — | writes gunPositions → FDC + TacticalMap | — | — |
| F017 | Crater Analysis | howitzer | — | writes CB target → all windows | — | **⚠️ YES — doctrinally belongs to Recon/Intelligence, not Howitzer** |
| F018 | FDC Ballistics | fdc | — | reads activeTarget, gunPositions, batteryCoords | uses `interpolateBallistics`, `calculateWindSplitting` | — |
| F019 | Min QE | fdc | — | gates FIRE button | — | — |
| F020 | FIRE Execute | fdc | — | triggers App-level timer → TacticalMap animation | uses `playFireSound`, `playSplashSound` | — |
| F021 | Fuze Logic | weapons | — | writes fuzeType → MunitionsWindow VT warning | — | — |
| F022 | ICM Blocker | weapons | — | writes ammuType → App icmSafe → FDC gate | — | — |
| F023 | Misfire | weapons | — | writes misfireActive → App timer | uses `playAlarm` | — |
| F024 | Compass N/S | compass | — | writes headingMils → **UNUSED** downstream | uses `milsToDegrees` | **⚠️ YES — value doesn't affect any calculation** |
| F025 | Level Bubble | compass | — | writes bubbleOffset → App levelIsCentered → FDC gate | — | — |
| F026 | Munitions Cutaway | munitions | — | reads fuzeType from weapons | — | — |
| F027 | Console Log | console | — | reads App-level logs (append-only from every module) | — | — |
| F028 | Simulate Call | console | **⚠️ Start Menu also** | writes activeTarget, targetsList, logs | uses `playBeep` | **⚠️ YES — duplicated in 2 places** |
| F029 | Kill Switch | console | **⚠️ Start Menu also** | wipes ALL state + localStorage + IndexedDB | uses `playBeep` | **⚠️ YES — duplicated in 2 places** |
| F030 | OPSEC Toggle | Global (Header) | — | passes prop to TacticalMap only | — | **⚠️ Partial coverage — pretends to hide coords but FDC/header still show them** |
| F031 | Desktop Icons | UI Shell | — | duplicates Header + Taskbar + StartMenu navigation | — | **⚠️ 4 access points redundant** |
| F032 | Taskbar Tasks | UI Shell | — | ditto F031 | — | **⚠️ redundant** |
| F033 | Start Menu | UI Shell | — | ditto F031 (+ hosts F028, F029 duplicates) | — | **⚠️ redundant** |
| F034 | System Tray | UI Shell | — | clock=OK, volume=fake, gridOffset=display only | — | — |
| F035 | Header Quick-Launch | UI Shell | — | ditto F031 | — | **⚠️ redundant** |
| F036 | Restored Banner | Global | — | listens to hydration event | — | — |
| F037 | Lockout Screen | Global | — | activated by F029 | — | — |
| F038 | Sound Synthesizer | Shared/Utility | — | called from every module | — | — |
| F039 | Terrain Wireframe | Global (TacticalMap) | — | visual only | — | — |
| F040 | Map Pan/Zoom | Global (TacticalMap) | — | visual only | — | — |

## CATEGORY ANOMALIES (marked, not moved)

### CA-01: Crater Analysis in Howitzer Section
- **Where:** `HowitzerWindow.tsx` tab 2 (`activeTab === 'crater'`)
- **Why anomaly:** Crater analysis is doctrinally a **counter-battery intelligence** function performed by artillery survey/target acquisition — NOT by gun crews (howitzer section)
- **Evidence:** `HowitzerWindow.tsx:26-47` (weapon ID + validation), `HowitzerWindow.tsx:219-320` (UI)
- **Impact:** Users navigating "หมู่ปืน" (Gun Section) unexpectedly find intelligence tools mixed with M.17 Board
- **Action:** MARKED — do not move (per Task Contract §11)

### CA-02: Compass Heading Value Isolated
- **Where:** `CompassWindow.tsx` sets `headingMils` via drag interaction
- **Why anomaly:** The value is passed up to App state but **never consumed** by FDC ballistics. TacticalMap shows a rotating compass using `batteryCoords.simDir` (from Setup), not `headingMils`.
- **Evidence:**
  - `App.tsx:45` `const [headingMils, setHeadingMils] = useState(1600);`
  - `App.tsx:615-620` passed only to `<CompassWindow>` (round-trip)
  - `TacticalMap.tsx` compass widget uses `batteryCoords.simDir` — grep-verify
- **Impact:** Feature appears interactive but has no downstream effect (Compass module is functionally isolated from Fire Direction pipeline)

### CA-03: Grid Calibration (Slide + Swing) Output Unused
- **Where:** `SurveillanceWindow.tsx` calibration tab → writes `gridOffset`
- **Why anomaly:** No calculation reads `gridOffset` — only displayed as decorative text in footer taskbar (`App.tsx:776-778`)
- **Evidence:** grep `gridOffset` in `src/` returns only `App.tsx:47, 522-526, 776-778` — no calc site

### CA-04: Fuze Time + Supplementary Charge Not in Fire Pipeline
- **Where:** `WeaponsWindow.tsx` `fuzeTime`, `MunitionsWindow.tsx` `supplementaryCharge`
- **Why anomaly:** VT airburst timing typically affects when shell detonates in ToF calculation, but `fuzeTime` is not read by FDC. `supplementaryCharge` shows a warning but doesn't block FIRE.
- **Evidence:** grep `fuzeTime` in `FdcWindow.tsx` = 0 results

### CA-05: OPSEC Toggle Partial Scope
- **Where:** `App.tsx:411-462` header → passes `hideBatteryCoords` to `<TacticalMap>` only
- **Why anomaly:** Header itself (line 412) continues to render `E:${batteryCoords.easting} N:${batteryCoords.northing}` regardless of toggle. Same for FDC ballistics inputs which show battery-based derived values.

### CA-06: Redundant Navigation Access Points (4 for the same window)
- Same window (e.g. `observer`) can be opened from: Header quick-launch (F035), Desktop icon (F031), Taskbar button (F032), Start Menu (F033)
- No hierarchy or preference indicated

### CA-07: Simulate Call + Kill Switch Duplication
- F028 and F029 have identical logic accessible from both `ControlPanelWindow` and `Start Menu`

## PRIMARY CATEGORY CONFIDENCE

| Category | Feature Count | Confidence |
|---|---|---|
| observer | 6 (F006-F011) | VERIFIED — all rendered inside ForwardObserverWindow |
| surveillance | 4 (F012-F015) | VERIFIED |
| howitzer | 2 (F016-F017) | VERIFIED (F017 anomaly noted) |
| fdc | 3 (F018-F020) | VERIFIED |
| weapons | 3 (F021-F023) | VERIFIED |
| compass | 2 (F024-F025) | VERIFIED (F024 anomaly noted) |
| munitions | 1 (F026) | VERIFIED |
| console | 3 (F027-F029) | VERIFIED |
| Global | 8 (F001-F005, F030, F036, F037, F039, F040) | VERIFIED |
| UI Shell | 5 (F004, F031-F035) | VERIFIED (many redundancies) |
| Shared/Utility | 1 (F038) | VERIFIED |
