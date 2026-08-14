# 08_UI_BEHAVIOR_INVENTORY

## PURPOSE

Detailed behavior of every important control. Enough for future UI redesign without breaking features.

---

## LOGIN MODAL CONTROLS

### C-001: Login "เชื่อมต่อความปลอดภัย" button
- **LOCATION:** LoginModal, primary button
- **ACTION:** Validate non-empty → mock auth 1.5s → decide route
- **STATE_CHANGE:** local `isAuthenticating` T→F; local `error` set/cleared; parent App: `operatorId`, `batteryCoords`, `isLoggedIn`, `showRestoredBanner`
- **SIDE_EFFECT:** `playClick()`, later `playBeep(880)`, `localStorage.getItem`
- **DEPENDENCIES:** `SoundGenerator.playClick/playBeep`, `localStorage`
- **RESULT:** Setup form OR dashboard entry
- **FAILURE:** Empty inputs → red banner + `playBeep(440,0.3,'sawtooth')`
- **EVIDENCE:** `LoginModal.tsx:29-58`

### C-002: Show Password (Eye) toggle
- **ACTION:** Toggle input type between password/text
- **STATE_CHANGE:** local `showKey`
- **SIDE_EFFECT:** `playClick()`
- **EVIDENCE:** `LoginModal.tsx:158-167`

### C-003: Setup "เข้าสู่ศูนย์บัญชาการ" button
- **ACTION:** Validate coords → save to localStorage → onSuccess
- **STATE_CHANGE:** localStorage write, then App: `isLoggedIn=true` + all coord state
- **FAILURE:** Invalid → red banner (see WF-02)
- **EVIDENCE:** `LoginModal.tsx:60-82`

---

## GLOBAL SHELL CONTROLS

### C-010: OPSEC Toggle (Header)
- **LOCATION:** Header right side
- **ACTION:** Toggle `hideBatteryCoords`
- **SIDE_EFFECT:** `playClick()`
- **DOWNSTREAM:** Passed to `<TacticalMap>` → hides battery + gun rendering + shows red banner on map
- **⚠️ SCOPE_ISSUE:** Header itself still displays `E:${easting} N:${northing}` — not masked
- **EVIDENCE:** `App.tsx:440-460`

### C-011: Header Quick-Launch Button (8x)
- **ACTION:** `toggleWindow(id)` → open+focus or minimize
- **STATE_CHANGE:** window's `isOpen`, `isMinimized`; and `zIndex` via focus
- **EVIDENCE:** `App.tsx:419-435,150-162`

### C-012: Desktop Icon (8x)
- **INTERACTION:** double-click open, single-click beep only
- **SIDE_EFFECT:** `playBeep(1000)` on double, `playClick()` on single
- **⚠️ ODD:** Single-click is a "dead" interaction (visual highlight but nothing happens)
- **EVIDENCE:** `App.tsx:470-490`

### C-013: Start Button (Taskbar)
- **ACTION:** Toggle `isStartMenuOpen`
- **STATE_CHANGE:** overlay visibility
- **⚠️ ISSUE:** No click-outside-to-close
- **EVIDENCE:** `App.tsx:724-737`

### C-014: Taskbar Task Button (8x)
- **BEHAVIOR:** if minimized OR closed → open + focus; if active → minimize
- **⚠️ ODD:** "Toggle to minimize" doesn't match Win32 conventional "click active window taskbar = minimize/restore"
- **EVIDENCE:** `App.tsx:746-767`

### C-015: Volume Toggle (System Tray)
- **ACTION:** Toggle `audioVolume` boolean + log
- **⚠️ FAKE:** Does not actually mute Web Audio — only changes emoji 🔊↔🔇 and appends log
- **EVIDENCE:** `App.tsx:781-791`

### C-016: Start Menu — Program items (8x)
- **ACTION:** Close menu + toggleWindow
- **EVIDENCE:** `App.tsx:677-689`

### C-017: Start Menu — "จำลองการเรียกยิงจาก ผตน."
- **DUPLICATE OF:** C-060 (ControlPanel button)
- **EVIDENCE:** `App.tsx:694-703`

### C-018: Start Menu — "สวิตช์ล้างระบบฉุกเฉิน"
- **DUPLICATE OF:** C-061 (ControlPanel button)
- **EVIDENCE:** `App.tsx:704-713`

---

## WINDOW CHROME CONTROLS (WindowManager)

### C-020: Title bar drag
- **ACTION:** mousedown on title → global mousemove tracks → `onUpdatePosition`
- **BOUND:** `y >= 40`; no x/right/bottom bounds
- **EVIDENCE:** `WindowManager.tsx:50-85`

### C-021: Minimize button (Minus icon)
- **ACTION:** `onMinimize(id)` → `isMinimized=true`
- **EVIDENCE:** `WindowManager.tsx:187-195`

### C-022: Maximize button (Square icon)
- **ACTION:** `toggleMaximize` — store prev state, fill viewport minus header/footer (80px total)
- **EVIDENCE:** `WindowManager.tsx:124-138,196-202`

### C-023: Close button (X icon)
- **ACTION:** `onClose(id)` → `isOpen=false`
- **EVIDENCE:** `WindowManager.tsx:203-209`

### C-024: Resize grip (SE corner SVG)
- **ACTION:** mousedown → global mousemove → `onUpdateSize` with min 250×150
- **EVIDENCE:** `WindowManager.tsx:87-121,224-237`

### C-025: Window focus click
- **ACTION:** Any click on window → `onFocus(id)` → zIndex = max+1
- **EVIDENCE:** `WindowManager.tsx:166`

---

## FORWARD OBSERVER (ผตน.) CONTROLS

### C-030 Tab switcher: Grid / Polar / Shift
- **ACTION:** `setActiveTab` + `playClick`
- **EVIDENCE:** `ForwardObserverWindow.tsx:~195-230`

### C-031: Grid form — inputs (Name, E, N, Alt)
- **ACTION:** Update local state on change
- **EVIDENCE:** `ForwardObserverWindow.tsx:~232-280`

### C-032: "บันทึกพิกัดเป้าหมาย" button
- **ACTION:** WF-03 (F006)
- **EVIDENCE:** `ForwardObserverWindow.tsx:96-107,~285-291`

### C-033: Polar inputs (foE, foN, azimuth, distance)
- **EVIDENCE:** `ForwardObserverWindow.tsx:~295-350`

### C-034: "คำนวณพิกัดเชิงขั้ว" button
- **ACTION:** WF-04 (F007) — uses `calculatePolarPlot`
- **EVIDENCE:** `ForwardObserverWindow.tsx:109-124,~355-361`

### C-035: Shift dropdown (Known Point)
- **ACTION:** Set `shiftFromId` + playClick
- **EVIDENCE:** `ForwardObserverWindow.tsx:~370-385`

### C-036: Shift numeric inputs (lateral/range/altitude)
- **EVIDENCE:** `ForwardObserverWindow.tsx:~390-420`

### C-037: "เลื่อนจากพิกัดที่รู้ค่า" button
- **DISABLED:** if `!shiftFromId`
- **ACTION:** WF-05
- **EVIDENCE:** `ForwardObserverWindow.tsx:126-140,~425-431`

### C-038: Flash-to-Bang start/stop button
- **ACTION:** WF-07 (toggles timer)
- **SIDE_EFFECT:** overwrites `polarDistance` on stop
- **EVIDENCE:** `ForwardObserverWindow.tsx:75-93,~447-460`

### C-039: Mil width slider
- **ACTION:** Update `objectWidth`, live recompute `computedMilDistance`
- **EVIDENCE:** `ForwardObserverWindow.tsx:~470-482`

### C-040: Mil angle input
- **EVIDENCE:** `ForwardObserverWindow.tsx:~484-492`

### C-041: "นำไปใช้ Nm" apply button
- **DISABLED:** if `computedMilDistance === 0`
- **ACTION:** `setPolarDistance(computedMilDistance)` + log
- **EVIDENCE:** `ForwardObserverWindow.tsx:~494-505`

### C-042..C-051: Adjustment pad buttons (10 buttons)
- Directional pad (ADD/DROP/LEFT/RIGHT ±100/50m) and text buttons (ALT ±10, RANGE ±200)
- **GUARD:** if `!activeTarget` → beep + no-op
- **EVIDENCE:** `ForwardObserverWindow.tsx:143-183,~508-542`

---

## SURVEILLANCE CONTROLS

### C-060..C-063: Tab switcher (4 tabs)
- **EVIDENCE:** `SurveillanceWindow.tsx:~105-140`

### C-064: Traverse table cells (editable inputs 8 cells)
- **ACTION:** `handleUpdateTraverse(idx, field, val)` — updates row + triggers closure recompute
- **EVIDENCE:** `SurveillanceWindow.tsx:60-66,~156-175`

### C-065: "ส่งข้อมูลการสำรวจวงรอบ" submit button
- **DISABLED:** if `isClosureLimitExceeded`
- **EVIDENCE:** `SurveillanceWindow.tsx:~200-215`

### C-066..C-071: Intersection form (6 inputs)
- **EVIDENCE:** `SurveillanceWindow.tsx:~225-250`

### C-072: "คำนวณหาพิกัดตัดสองมุมทิศ" solve button
- **ACTION:** WF-10
- **EVIDENCE:** `SurveillanceWindow.tsx:69-95,~255-262`

### C-073, C-074: Slope inputs (distance, angle)
- **EVIDENCE:** `SurveillanceWindow.tsx:~275-295`

### C-075: "ยืนยัน" slope verify button (logs)
- **EVIDENCE:** `SurveillanceWindow.tsx:~310-317`

### C-076, C-077, C-078: Calibration sliders (slideX, slideY, swing)
- **⚠️ OUTPUT UNUSED** (see F015 / CA-03)
- **EVIDENCE:** `SurveillanceWindow.tsx:~330-390`

---

## HOWITZER CONTROLS

### C-080, C-081: Tab switcher (2 tabs)
- **EVIDENCE:** `HowitzerWindow.tsx:~95-118`

### C-082..C-087: Draggable gun icons (G1-G6)
- **INTERACTION:** mousedown → global mousemove → update offsetX/Y (1px=1m)
- **VISUAL:** G1 highlighted emerald (base piece)
- **EVIDENCE:** `HowitzerWindow.tsx:44-91,~150-175`

### C-088: Splash Direction input (mils)
- **EVIDENCE:** `HowitzerWindow.tsx:~230-238`

### C-089: Crater Width input (m)
- **AFFECTS:** live weapon identification
- **EVIDENCE:** `HowitzerWindow.tsx:~240-248`

### C-090: Plumb Bob Angle input (°)
- **EVIDENCE:** `HowitzerWindow.tsx:~250-258`

### C-091: Wind Direction slider (mils)
- **EVIDENCE:** `HowitzerWindow.tsx:~265-273`

### C-092: "ส่งคำขอเป้าหมายยิงโต้แบตเตอรี" submit button
- **DISABLED:** if `!isCraterValid`
- **⚠️ ISSUE:** Hardcoded CB pos (34500, 48500)
- **EVIDENCE:** `HowitzerWindow.tsx:~300-320`

---

## FDC CONTROLS

### C-100, C-101: Tab switcher (Ballistics / Min QE)
- **EVIDENCE:** `FdcWindow.tsx:~120-140`

### C-102: Range input
- **EVIDENCE:** `FdcWindow.tsx:~155-165`

### C-103: Firing Azimuth input
- **EVIDENCE:** `FdcWindow.tsx:~167-172`

### C-104: Wind Speed input
- **EVIDENCE:** `FdcWindow.tsx:~183-190`

### C-105: Wind Direction input
- **EVIDENCE:** `FdcWindow.tsx:~192-200`

### C-106: FIRE button
- **STATES:**
  - `fireMissionActive`: amber "นับถอยหลัง: Xs" (Square icon spinning)
  - `isFireSafe && !active`: green "สั่งยิง (FIRE_EXECUTE)" (Play icon)
  - `!isFireSafe`: red "ยิงไม่ได้ (ตรวจการปรับเทียบ)" (Shield icon, disabled)
- **ACTION on click:** `playFireSound()` + `onFireExecute(tof)` (App enables timer)
- **EVIDENCE:** `FdcWindow.tsx:107-121,~355-375`

### C-107..C-109: Min QE inputs (crestHeight, crestDistance, pieceToCrestSlope)
- **EVIDENCE:** `FdcWindow.tsx:~277-317`

---

## WEAPONS CONTROLS

### C-120..C-122: Tab switcher (Fuze / ICM / Misfire)
- **EVIDENCE:** `WeaponsWindow.tsx:~55-84`

### C-123..C-125: Fuze radio (Impact/Delay/VT Airburst)
- **EVIDENCE:** `WeaponsWindow.tsx:~99-118`

### C-126: Fuze Time slider (1.5-100s)
- **DISABLED:** if `fuzeType !== 'VT Airburst'`
- **⚠️ VALUE UNUSED** downstream
- **EVIDENCE:** `WeaponsWindow.tsx:~128-140`

### C-127: Ammo dropdown (HE/APICM/DPICM/ILLUM/SMOKE)
- **EVIDENCE:** `WeaponsWindow.tsx:~165-185`

### C-128: Misfire trigger button
- **BEHAVIOR:** Toggle `misfireActive` + `playAlarm(true)`
- **EVIDENCE:** `WeaponsWindow.tsx:44-52,~245-260`

---

## COMPASS CONTROLS

### C-140: Compass bezel drag (SVG)
- **INTERACTION:** mousedown on svg → global mousemove → compute angle from center → `onHeadingChange(mils)`
- **⚠️ VALUE UNUSED** in FDC calc (see CA-02)
- **EVIDENCE:** `CompassWindow.tsx:41-71,~175-235`

### C-141: Bubble vial drag
- **INTERACTION:** mousedown on vial → global mousemove → bounded radius 35px → scaled to ±15
- **EVIDENCE:** `CompassWindow.tsx:73-102,~250-280`

### C-142, C-143: Bubble sliders (X, Y ±15)
- **EVIDENCE:** `CompassWindow.tsx:~290-320`

### C-144: "ปรับระดับอัตโนมัติ" button
- **ACTION:** `onBubbleChange({x:0, y:0})` + `playBeep(1000)`
- **EVIDENCE:** `CompassWindow.tsx:~322-330`

---

## MUNITIONS CONTROLS

### C-160: Rotate button
- **ACTION:** `rotation = (prev + 90) % 360` + playClick
- **EVIDENCE:** `MunitionsWindow.tsx:22-32`

### C-161: Shell body click (rotate 45°)
- **ACTION:** rotation += 45 + playClick
- **EVIDENCE:** `MunitionsWindow.tsx:~92-102`

### C-162: "ถอดจรวดเสริมทันที" quick-fix button
- **VISIBLE:** only when `showSafetyWarning`
- **ACTION:** `onSupplementaryChargeToggle(false)` + `playBeep(1100)`
- **EVIDENCE:** `MunitionsWindow.tsx:~57-64`

### C-163: Supplementary Charge checkbox
- **ACTION:** Toggle `supplementaryCharge` boolean
- **EVIDENCE:** `MunitionsWindow.tsx:~225-238`

---

## CONSOLE CONTROLS

### C-180: Clear Console button
- **ACTION:** `onClearLogs()` → `setLogs([])`
- **EVIDENCE:** `ControlPanelWindow.tsx:~48-56`

### C-181: Simulate Spotter Call button (**DUPLICATE OF C-017**)
- **ACTION:** WF-19
- **EVIDENCE:** `ControlPanelWindow.tsx:23-26,~75-83`

### C-182: Net Diagnostic Ping button
- **ACTION:** Log `[ตรวจเครือข่าย]` static string
- **⚠️ FAKE:** No actual network check
- **EVIDENCE:** `ControlPanelWindow.tsx:~85-95`

### C-183: Kill Switch button (**DUPLICATE OF C-018**)
- **ACTION:** WF-18 with `window.confirm()`
- **EVIDENCE:** `ControlPanelWindow.tsx:27-33,~112-120`

---

## MAP CONTROLS (TacticalMap widget cluster)

### C-200: Map drag pan
- **ACTION:** mousedown on canvas → mousemove → `setPanOffset`
- **EVIDENCE:** `TacticalMap.tsx` (bottom section)

### C-201: Zoom In button
- **ACTION:** `zoom = min(0.2, zoom × 1.3)`
- **EVIDENCE:** `TacticalMap.tsx` (map controls)

### C-202: Zoom Out button
- **ACTION:** `zoom = max(0.005, zoom / 1.3)`
- **EVIDENCE:** `TacticalMap.tsx`

---

## LOCKOUT CONTROLS

### C-220: "เชื่อมต่อใหม่" (Re-Authorize) button
- **ACTION:** `setForceLockout(false)` → falls back to Login (since `isLoggedIn=false`)
- **EVIDENCE:** `App.tsx:359-367`

---

## GLOBAL BEHAVIOR NOTES

- **Every clickable control** invokes `playClick()` or a `playBeep()` — no silent buttons
- **No keyboard shortcuts** implemented (only Tab-navigable native inputs)
- **No aria-label / aria-live** attributes observed → accessibility limited
- **All drag operations** use `mousedown/mousemove/mouseup` (no `pointerdown` or `touchstart`) → mobile broken
- **No confirm dialog** for destructive actions except Kill Switch (Close window ⇒ instant, unrecoverable window state loss)
