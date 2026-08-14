# 04_FEATURE_INVENTORY

> **สำคัญที่สุดในชุดเอกสารนี้.**
> ทุก Feature ที่ค้นพบ ระบุครบทุกฟิลด์ตาม template.
> Status: IMPLEMENTED / PARTIAL / STUB / DEAD / DUPLICATED / UNKNOWN

---

## F001 — LOGIN AUTHENTICATION

- **FEATURE_ID:** F001
- **NAME:** Operator Login
- **CURRENT_CATEGORY:** Global / Session
- **CURRENT_ENTRY_POINT:** Auto-render when `!isLoggedIn`
- **STATUS:** **PARTIAL** — UI + flow มีครบ แต่ **ไม่มีการตรวจสอบค่ารหัส**
- **PURPOSE:** Gate entrance to dashboard
- **USER_ROLE:** any operator
- **TRIGGER:** app boot → `App.tsx:373-376` guard
- **INPUT:** operatorId (text), accessKey (password), toggle showKey (👁 icon)
- **PROCESSING:** ตรวจว่าทั้ง 2 ช่องไม่ว่าง → `setTimeout(1500ms)` จำลอง auth → เรียก `onSuccess()`
- **OUTPUT:** transition ไป Hydration (F002) หรือ Setup (F003)
- **STATE:** local `operatorId`, `accessKey`, `showKey`, `isAuthenticating`, `error`
- **CONTEXT:** none
- **UTILITIES:** `playClick`, `playBeep`
- **PERSISTENCE:** อ่าน `localStorage.artyc2_battery_coords` เพื่อตัดสินใจไป Setup หรือ Hydration
- **DEPENDENCIES:** lucide-react (Lock, Terminal, Eye, Navigation, ShieldAlert)
- **RELATED_COMPONENTS:** `LoginModal.tsx`
- **RESPONSIVE_BEHAVIOR:** `max-w-lg` centered — UNKNOWN behavior บน viewport < 400px
- **VALIDATION:** empty check + error message "วิกฤต: ต้องกรอกรหัสผู้ปฏิบัติการและรหัสลับ..."
- **KNOWN_ISSUES:** รหัสอะไรก็ผ่านได้; รหัสค่าเริ่มต้น hard-coded ใน UI (`ARTY-FDC-401`, `GRID-6400`)
- **EVIDENCE:** `src/components/LoginModal.tsx:14-83`
- **CONFIDENCE:** VERIFIED

---

## F002 — HYDRATION (Auto-Bypass Setup)

- **FEATURE_ID:** F002
- **NAME:** LocalStorage Hydration
- **CURRENT_CATEGORY:** Global / Session
- **STATUS:** **IMPLEMENTED**
- **TRIGGER:** ใน `LoginModal.handleLogin` หลัง auth mock — เมื่อพบ `artyc2_battery_coords`
- **PROCESSING:** `JSON.parse()` → `onSuccess({ restored: true })` → App set state + banner 4s
- **OUTPUT:** เข้า Dashboard + green banner "กู้คืนพิกัดตำแหน่งยิงเดิมเรียบร้อย" + log `[กู้คืน]`
- **STATE:** App: `showRestoredBanner` (auto-clear via `setTimeout(4000)`)
- **PERSISTENCE:** localStorage READ
- **EVIDENCE:** `LoginModal.tsx:42-58`, `App.tsx:195-201`
- **KNOWN_ISSUES:** JSON.parse ไม่มี schema validation — ถ้าข้อมูลใน localStorage เสียหายจะโยน exception (ถูก try-catch ให้ fallback ไป Setup)
- **CONFIDENCE:** VERIFIED

---

## F003 — BATTERY SETUP SCREEN

- **FEATURE_ID:** F003
- **NAME:** Battery Coordinate Setup
- **CURRENT_CATEGORY:** Global / Session
- **STATUS:** **IMPLEMENTED**
- **TRIGGER:** ใน LoginModal เมื่อไม่พบ localStorage
- **INPUT:** easting (default 32000), northing (default 45000), altitude (default 120), simDir (default 1600)
- **PROCESSING:** validate `E>0, N>0, Alt≥0, SimDir∈[0,6400]` → `localStorage.setItem(...)` → onSuccess
- **VALIDATION:** error "วิกฤต: ค่าปรับเทียบผิดพลาด ค่าเกินขอบเขตความปลอดภัยการปฏิบัติ"
- **PERSISTENCE:** localStorage WRITE
- **EVIDENCE:** `LoginModal.tsx:60-82, 195-244`
- **CONFIDENCE:** VERIFIED

---

## F004 — WINDOW MANAGER SYSTEM

- **FEATURE_ID:** F004
- **NAME:** Floating Window System (drag, resize, minimize, maximize, close, focus)
- **CURRENT_CATEGORY:** Global / UI Shell
- **STATUS:** **IMPLEMENTED**
- **TRIGGER:** ทุก mouse interaction บน `<Window>` component
- **PROCESSING:**
  - Drag: title-bar mousedown → global mousemove listener → `onUpdatePosition(id, x, y)` (bounded `y ≥ 40`)
  - Resize: se-grip mousedown → global mousemove → `onUpdateSize(id, w, h)` (min 250×150)
  - Focus: click anywhere on window → `zIndex = max(zIndex) + 1`
  - Maximize: fills `window.innerWidth × (innerHeight - 80)`, stores prev state
- **STATE:** App: `windows[]` (array of WindowData). Window: `isMaximized`, `preMaxState`, drag/resize refs
- **EVIDENCE:** `WindowManager.tsx:5-241`, `App.tsx:104-182`
- **KNOWN_ISSUES:**
  - No bounds check on X-axis or bottom edge (window can be dragged off-screen right/bottom)
  - `zIndex` grows unbounded (no re-normalization)
- **CONFIDENCE:** VERIFIED

---

## F005 — TACTICAL MAP CANVAS RENDERING

- **FEATURE_ID:** F005
- **NAME:** Full-screen Tactical Map
- **CURRENT_CATEGORY:** Global / Background
- **STATUS:** **IMPLEMENTED**
- **RENDERS:**
  - UTM 1000m grid
  - 3D-like terrain wireframe (animated `terrainAngle` at ~1Hz auto-rotation)
  - Battery center + 6 guns (hidden if OPSEC on)
  - Friendly point + 600m ICM safe boundary (yellow dashed)
  - Targets (crosshair + ring + threat dome 300m)
  - Live projectile arc during fire mission
  - Compass widget (top-right)
  - Zoom controls (bottom-right)
  - Legend (bottom-left)
- **STATE:** local: `zoom`, `panOffset`, `isPanning`, `terrainAngle`
- **INTERACTIONS:** drag to pan, zoom buttons, auto-center on activeTarget change
- **EVIDENCE:** `TacticalMap.tsx` (all ~500 lines)
- **CONFIDENCE:** VERIFIED

---

## F006 — FO GRID METHOD TARGET

- **FEATURE_ID:** F006
- **NAME:** ผตน. — Grid Method Target Entry
- **CURRENT_CATEGORY:** ผตน. (Forward Observer)
- **STATUS:** **IMPLEMENTED**
- **INPUT:** targetName, gridE, gridN, gridH
- **PROCESSING:** สุ่ม `id = T-XXX` → `onAddTarget` + `onSetTarget`
- **OUTPUT:** target on map + FDC recomputes + log `[CALL_FOR_FIRE]`
- **EVIDENCE:** `ForwardObserverWindow.tsx:96-107`
- **CONFIDENCE:** VERIFIED

---

## F007 — FO POLAR PLOT TARGET

- **FEATURE_ID:** F007
- **NAME:** ผตน. — Polar Plot (Azimuth + Distance)
- **CURRENT_CATEGORY:** ผตน.
- **STATUS:** **IMPLEMENTED**
- **INPUT:** foE, foN, polarAzimuth (mils), polarDistance (m)
- **PROCESSING:** `calculatePolarPlot()` (utils/ballistics.ts) → ΔE = D·sin(θ), ΔN = D·cos(θ)
- **UTILITIES:** `calculatePolarPlot`
- **EVIDENCE:** `ForwardObserverWindow.tsx:109-124`, `ballistics.ts:100-116`
- **CONFIDENCE:** VERIFIED

---

## F008 — FO SHIFT FROM KNOWN POINT

- **FEATURE_ID:** F008
- **NAME:** ผตน. — Shift Known Point
- **STATUS:** **IMPLEMENTED**
- **INPUT:** dropdown known target id, lateralShift, rangeShift, altitudeShift
- **PROCESSING:** `newE = known.E + lateral`, `newN = known.N + range`, `newH = known.H + alt`
  - **⚠️ INFERRED CATEGORY_ANOMALY:** ไม่มี rotation ตามมุมสังเกต — เป็นเพียง translation ตรงตาม UTM แกน E/N (ไม่ใช่แนวสังเกต) — Doctrine "shift from known point" จริงต้องใช้ observer line of sight
- **DISABLED เมื่อ:** ไม่ได้เลือก dropdown
- **EVIDENCE:** `ForwardObserverWindow.tsx:126-140`
- **CONFIDENCE:** VERIFIED (behavior); INFERRED (doctrinal mismatch)

---

## F009 — FLASH-TO-BANG TIMER

- **FEATURE_ID:** F009
- **NAME:** Sound-based Range Estimation
- **CURRENT_CATEGORY:** ผตน.
- **STATUS:** **IMPLEMENTED**
- **PROCESSING:** first click starts `setInterval(100ms)` → second click stops → `distance = seconds × 340` (m/s)
- **SIDE_EFFECT:** OTP auto-fills `polarDistance` field
- **EVIDENCE:** `ForwardObserverWindow.tsx:59-92`
- **CONFIDENCE:** VERIFIED

---

## F010 — MIL FORMULA CALCULATOR

- **FEATURE_ID:** F010
- **NAME:** Mil Relation `D = (W × 1000) / M`
- **CURRENT_CATEGORY:** ผตน.
- **STATUS:** **IMPLEMENTED**
- **INPUT:** `objectWidth` (slider 5-100m), `milAngle` (input mils)
- **DISABLED เมื่อ:** `milAngle === 0` → button disabled
- **SIDE_EFFECT:** applies to `polarDistance`
- **EVIDENCE:** `ForwardObserverWindow.tsx:47-51, ~440-490`
- **CONFIDENCE:** VERIFIED

---

## F011 — TARGET ADJUSTMENT PAD

- **FEATURE_ID:** F011
- **NAME:** Arrow-pad Fire Adjustment (ADD/DROP/LEFT/RIGHT/UP/DOWN)
- **CURRENT_CATEGORY:** ผตน.
- **STATUS:** **IMPLEMENTED**
- **BEHAVIOR:** ปุ่มลูกศร: ±100m (ADD/DROP), ±50m (LEFT/RIGHT), ±10m (UP/DOWN) + ปุ่ม text: ±200m (range), ±10m (alt)
- **GUARD:** ถ้า `!activeTarget` → beep error, no-op
- **SIDE_EFFECT:** mutate `activeTarget` E/N/Alt, log `[WEBSOCKET_ADJUSTMENT]`
- **⚠️ INFERRED ISSUE:** ADD/DROP shifts `northing` ตรงตัว — ไม่ rotate ตามมุมยิง (จริง ADD/DROP ต้องอิงแนวยิง observer→target)
- **EVIDENCE:** `ForwardObserverWindow.tsx:142-183`
- **CONFIDENCE:** VERIFIED (behavior); INFERRED (doctrinal shortcut)

---

## F012 — TRAVERSE SURVEY FORM (ทบ.344-202)

- **FEATURE_ID:** F012
- **NAME:** 4-station Traverse with Closure Error Check
- **CURRENT_CATEGORY:** สำรวจ
- **STATUS:** **IMPLEMENTED**
- **INPUT:** editable table of 4 rows: {start, end, bearing (mils), distance (m)}
- **PROCESSING:** Σ(D·sin/cos) → closureDistError = √(ΔE² + ΔN²), threshold 10m OR 2mils bearing error
- **OUTPUT:** เขียว "ยืนยัน" + submit enabled / เหลืองกระพริบ + submit disabled
- **⚠️ INFERRED ISSUE:** `closureBearingError = Math.abs((totalBearing - 3200) % 6400)` — สูตรไม่สอดคล้องกับ doctrine ปกติ (ต้องดู interior angles) แต่ตรงกับที่โค้ดเขียน
- **PERSISTENCE:** none (log only)
- **EVIDENCE:** `SurveillanceWindow.tsx:14-59, 130-190`
- **CONFIDENCE:** VERIFIED

---

## F013 — INTERSECTION SOLVER

- **FEATURE_ID:** F013
- **NAME:** Double-Azimuth Intersection
- **CURRENT_CATEGORY:** สำรวจ
- **STATUS:** **IMPLEMENTED**
- **INPUT:** 2 stations {E, N, bearing} = 6 inputs total
- **PROCESSING:** ระบบสมการเส้นตรง 2 เส้น (slope=cos/sin) → หา (intE, intN)
- **OUTPUT:** log entry เท่านั้น (ไม่มีการวาดบน map, ไม่มีปุ่มเพิ่มเป็น target)
- **⚠️ ISSUE:** ผลลัพธ์แสดงในคอนโซล log แต่ไม่มีปุ่ม "เพิ่มเป็น target" → workflow ไม่ครบ
- **EVIDENCE:** `SurveillanceWindow.tsx:69-95`
- **CONFIDENCE:** VERIFIED
- **STATUS override:** **PARTIAL** — output ไม่ได้เชื่อมกับระบบต่อ

---

## F014 — SLOPE TO HORIZONTAL

- **FEATURE_ID:** F014
- **NAME:** Slope Distance → Horizontal Distance
- **CURRENT_CATEGORY:** สำรวจ
- **STATUS:** **IMPLEMENTED**
- **INPUT:** slopeDistance (m), inclinometerAngle (degrees)
- **PROCESSING:** `H = D·cos(θ)`, `ΔElev = D·sin(θ)` where θ in radians
- **OUTPUT:** เรียลไทม์ 2 ค่าใน UI + log ค่า
- **EVIDENCE:** `SurveillanceWindow.tsx:97-100, 260-315`
- **CONFIDENCE:** VERIFIED

---

## F015 — GRID CALIBRATION (Slide + Swing)

- **FEATURE_ID:** F015
- **NAME:** Coordinate Grid Slide & Swing
- **CURRENT_CATEGORY:** สำรวจ
- **STATUS:** **STUB / DEAD OUTPUT**
- **INPUT:** slideX slider (-500 to +500), slideY slider (-500 to +500), swing slider (-100 to +100 mils)
- **PROCESSING:** ⚠️ **ไม่มีการใช้งานผลลัพธ์** — เพียง `setGridOffset()` และแสดงในแถบ Taskbar `App.tsx:776-778`
- **RECEIVER:** App state `gridOffset` — grep ไม่พบว่า `gridOffset` ถูกใช้ใน calculation ใด
- **EVIDENCE:** `SurveillanceWindow.tsx:319-395`, `App.tsx:47, 776-778`
- **STATUS:** **STUB** (UI มี, math ไม่ถูก apply)
- **CONFIDENCE:** VERIFIED

---

## F016 — M.17 PLOTTING BOARD

- **FEATURE_ID:** F016
- **NAME:** Drag-to-Position 6 Guns
- **CURRENT_CATEGORY:** หมู่ปืน
- **STATUS:** **IMPLEMENTED**
- **PROCESSING:** mousedown on gun → global mousemove tracks cursor → `offsetX = e.clientX - centerX`, `offsetY = -(e.clientY - centerY)` (Y-invert) → 1px = 1m mapping
- **BASE PIECE:** Gun 1 highlighted (`#3be099` bg, white border)
- **EVIDENCE:** `HowitzerWindow.tsx:44-91, 108-205`
- **DOWNSTREAM:** `gunPositions` used by FDC (spatial correction) + TacticalMap (visualization)
- **CONFIDENCE:** VERIFIED

---

## F017 — CRATER ANALYSIS TRI-PANEL

- **FEATURE_ID:** F017
- **NAME:** Crater Analysis + Counter-Battery Target Submit
- **CURRENT_CATEGORY:** หมู่ปืน ⚠️ **CATEGORY_ANOMALY** (doctrine: this belongs to reconnaissance/intelligence, not howitzer section)
- **STATUS:** **PARTIAL**
- **INPUT:** splashDir (mils), craterWidth (m), plumbBobAngle (°), windDir (slider mils)
- **PROCESSING:**
  - Weapon ID: `< 2m = 81mm mortar / 2-4m = 105 / 4-6m = 122mm rocket / ≥ 6m = 152/155mm`
  - Consistency: `|splashDir - windDir| ≤ 2000 mils` AND `10° ≤ plumbBobAngle ≤ 80°`
- **OUTPUT:** submit CB target — **⚠️ ISSUE:** hardcoded pos `E=34500, N=48500` ไม่ derive จาก crater vector
- **EVIDENCE:** `HowitzerWindow.tsx:28-47, 219-320`
- **CONFIDENCE:** VERIFIED (behavior); INFERRED (anomalies)

---

## F018 — FDC BALLISTICS ENGINE

- **FEATURE_ID:** F018
- **NAME:** Linear Interpolation + Wind Splitting + Per-Gun Corrections
- **CURRENT_CATEGORY:** ศอย.
- **STATUS:** **IMPLEMENTED**
- **AUTO-SYNC:** ถ้ามี activeTarget → calculate range/azimuth จากพิกัด ด้วย `√(ΔE²+ΔN²)` + `atan2(ΔE, ΔN)`
- **PROCESSING:**
  1. `interpolateBallistics(range)` → base QE + ToF
  2. `calculateWindSplitting(azimuth, speed, dir)` → rangeCorrection + deflectionCorrection
  3. `correctedRange = targetRange + rangeCorrection` → 2nd interpolate → correctedQE
  4. `finalDeflection = 3200 + deflectionCorrection`
  5. per-gun: `gunQE = correctedQE - VE·0.15`, `gunDef = finalDeflection + (offsetX·1000/range)`
- **OUTPUT:** 2 huge readouts (48px, JetBrains Mono) + 6-cell gun grid + ToF line
- **EVIDENCE:** `FdcWindow.tsx:45-107, 125-260`
- **CONFIDENCE:** VERIFIED

---

## F019 — MIN QE SAFETY CALCULATOR

- **FEATURE_ID:** F019
- **NAME:** Deputy Commander Min QE (Round-Up Rule)
- **CURRENT_CATEGORY:** ศอย.
- **STATUS:** **IMPLEMENTED**
- **INPUT:** crestHeight (m), crestDistance (m), pieceToCrestSlope (mils)
- **FORMULA:** `rawMinQE = slope + 5 + round(H·1000/D)`, `finalMinQE = Math.ceil(rawMinQE)`
- **EFFECT:** gate ปุ่ม FIRE (`isFireSafe = ... && correctedQE >= finalMinQE`)
- **EVIDENCE:** `FdcWindow.tsx:59-63, 261-355`
- **CONFIDENCE:** VERIFIED

---

## F020 — FIRE EXECUTE (Fire Mission Timer)

- **FEATURE_ID:** F020
- **NAME:** FIRE_EXECUTE + 10Hz Timer + Splash
- **CURRENT_CATEGORY:** ศอย.
- **STATUS:** **IMPLEMENTED**
- **GATE:** `levelIsCentered && icmSafe && !interpError && correctedQE >= finalMinQE`
- **ON PRESS:** `playFireSound()` + `onFireExecute(tof)` → App sets `fireMissionActive=true`, `fireMissionTimeLeft=tof`
- **TIMER (App.tsx:235-267):** `setInterval(100ms)` → decrement → progress → beep 980Hz per second when ≤5s → on 0: `playSplashSound()` + log `[SPLASH_IMPACT]`
- **VISUAL:** map draws parabolic arc, projectile emoji (orange), pulse animation
- **EVIDENCE:** `FdcWindow.tsx:107-121, 355-395`, `App.tsx:235-267`, `TacticalMap.tsx` (trajectory drawing)
- **CONFIDENCE:** VERIFIED

---

## F021 — FUZE LOGIC CENTER

- **FEATURE_ID:** F021
- **NAME:** M564 Fuze Configuration
- **CURRENT_CATEGORY:** อาวุธ
- **STATUS:** **PARTIAL**
- **INPUT:** radio {Impact, Delay, VT Airburst}, slider fuzeTime (1.5-100s, disabled unless VT)
- **VISUAL:** rotating SVG dial
- **⚠️ ISSUE:** `fuzeTime` state ไม่ถูกใช้ในการยิงหรือคำนวณใด — เป็น visual only
- **EVIDENCE:** `WeaponsWindow.tsx:87-158`, grep `fuzeTime` in App.tsx = state only
- **CONFIDENCE:** VERIFIED

---

## F022 — ICM BOUNDARY BLOCKER

- **FEATURE_ID:** F022
- **NAME:** ICM Safety Blocker (600m friendly zone)
- **CURRENT_CATEGORY:** อาวุธ
- **STATUS:** **IMPLEMENTED**
- **INPUT:** ammoType dropdown (HE/APICM/DPICM/ILLUM/SMOKE)
- **PROCESSING:** `isIcmAmmo = ammuType ∈ {APICM, DPICM}` + `icmSafe = !isIcmAmmo || friendlyDist >= 600`
- **EFFECT:** if violation → red pulse card + FDC FIRE button disabled (via `icmSafe` prop)
- **EVIDENCE:** `WeaponsWindow.tsx:31-33, 160-207`, `App.tsx:343-344`
- **CONFIDENCE:** VERIFIED

---

## F023 — MISFIRE EMERGENCY

- **FEATURE_ID:** F023
- **NAME:** Misfire 30-Minute Countdown + SOP
- **CURRENT_CATEGORY:** อาวุธ
- **STATUS:** **IMPLEMENTED**
- **ON PRESS:** toggle `misfireActive` → App timer (1Hz) นับถอยหลังจาก 1800s → beep every 10s (via `playAlarm`)
- **UI:** red pulse box + large countdown + 3-step SOP text
- **EVIDENCE:** `WeaponsWindow.tsx:37-52, 209-265`, `App.tsx:269-290`
- **CONFIDENCE:** VERIFIED

---

## F024 — M.2 COMPASS (Northbound/Southbound Logic)

- **FEATURE_ID:** F024
- **NAME:** Interactive SVG Compass with N/S sensor
- **CURRENT_CATEGORY:** เข็มทิศ M2
- **STATUS:** **PARTIAL**
- **INTERACTION:** click+drag outer bezel → `handleCompassDrag()` → `headingMils` updated
- **LOGIC:** `isNorthbound = (deg ≥ 270 || deg ≤ 90)` → north-side red glow / south-side matte black + auto +180° correction on readout
- **⚠️ ISSUE:** `headingMils` state ถูก set แต่ **ไม่ถูกส่งเข้า FDC หรือใช้ในการคำนวณยิง** — ใช้เพียงหมุน compass widget บน TacticalMap (`milsToDegrees(simDir)` — ใช้ `simDir` ไม่ใช่ `headingMils` !)
- **EVIDENCE:** `CompassWindow.tsx:24-71`, `App.tsx:45, 615-620`
- **CONFIDENCE:** VERIFIED
- **STATUS override:** **PARTIAL** — UI ทำงาน แต่ค่าไม่ integrate

---

## F025 — LEVEL BUBBLE VIAL

- **FEATURE_ID:** F025
- **NAME:** Draggable Bubble Level (unlocks FIRE)
- **CURRENT_CATEGORY:** เข็มทิศ M2
- **STATUS:** **IMPLEMENTED**
- **INTERACTION:** ลากฟองน้ำในหลอด (max radius 35px) หรือ slider X/Y (-15 ถึง +15) หรือปุ่ม "ปรับระดับอัตโนมัติ" → set (0,0)
- **THRESHOLD:** `drift = √(x² + y²) < 2` → `isLevel = true` → FIRE unlocked (via App.tsx:342)
- **EVIDENCE:** `CompassWindow.tsx:73-133, 249-334`, `App.tsx:342`
- **CONFIDENCE:** VERIFIED

---

## F026 — 105MM MUNITIONS CUTAWAY

- **FEATURE_ID:** F026
- **NAME:** SVG Shell Diagram + VT Safety Check
- **CURRENT_CATEGORY:** กระสุน
- **STATUS:** **IMPLEMENTED**
- **VISUAL:** 6-part SVG cutaway (M732 fuze / booster / supp charge / TNT / steel casing / driving band) + CSS 3D rotation (rotateY every 45° click)
- **SAFETY LOGIC:** `showSafetyWarning = fuzeType === 'VT Airburst' && supplementaryCharge === true` → red flashing card + quick-fix button
- **⚠️ ISSUE:** ไม่ block การยิงจริง — เป็นเพียง visual warning
- **EVIDENCE:** `MunitionsWindow.tsx:18-243`
- **CONFIDENCE:** VERIFIED

---

## F027 — CONSOLE LOG FEED

- **FEATURE_ID:** F027
- **NAME:** WebSocket Log Console (simulated)
- **CURRENT_CATEGORY:** ระบบควบคุม
- **STATUS:** **IMPLEMENTED**
- **DATA:** `logs: string[]` ใน App state (max 50 entries: `.slice(0, 49)` in `addLogEvent`)
- **INTERACTION:** clear button
- **⚠️ NOT WebSocket:** เป็นเพียง in-memory array — ไม่มีการสื่อสารจริง
- **EVIDENCE:** `ControlPanelWindow.tsx:34-73`, `App.tsx:207-215`
- **CONFIDENCE:** VERIFIED

---

## F028 — SIMULATE INCOMING CALL

- **FEATURE_ID:** F028
- **NAME:** Mock Spotter Fire Mission Trigger
- **CURRENT_CATEGORY:** ระบบควบคุม / Start Menu
- **STATUS:** **IMPLEMENTED**
- **BEHAVIOR:** สุ่มระยะ 3000-5000m + azimuth 1200 mils → คำนวณ E/N ผ่าน inline sin/cos (ไม่ใช้ `calculatePolarPlot()`) → add target + set active + log + beep 660Hz
- **⚠️ DUPLICATION:** ทำสิ่งเดียวกับ F007 (Polar Plot) แต่ **inline** ไม่ reuse `calculatePolarPlot()` → DUPLICATE_LOGIC
- **ACCESS POINTS:** 2 ที่ — ControlPanelWindow button + Start Menu item → DUPLICATED_UI
- **EVIDENCE:** `App.tsx:315-330`, `ControlPanelWindow.tsx:23-26`, `App.tsx:693-703`
- **CONFIDENCE:** VERIFIED

---

## F029 — KILL SWITCH (Sanitize All)

- **FEATURE_ID:** F029
- **NAME:** Emergency Session Revoke
- **CURRENT_CATEGORY:** ระบบควบคุม
- **STATUS:** **IMPLEMENTED**
- **CONFIRM:** `window.confirm()` — Cancel = no-op
- **ACTION:** clear session state, `localStorage.clear()`, `indexedDB.deleteDatabase('fdc_offline_queue')`, set `forceLockout=true`
- **RESULT:** black screen with "เทอร์มินัลความปลอดภัยถูกปิดการใช้งาน" + "เชื่อมต่อใหม่" button
- **⚠️ ACCESS POINTS:** 2 ที่ (ControlPanel button + Start Menu item) → DUPLICATED_UI
- **⚠️ ISSUE:** `indexedDB.deleteDatabase` targets `fdc_offline_queue` ที่ **never created** anywhere in code
- **EVIDENCE:** `App.tsx:292-313`, `ControlPanelWindow.tsx:27-33`
- **CONFIDENCE:** VERIFIED

---

## F030 — OPSEC MODE TOGGLE

- **FEATURE_ID:** F030
- **NAME:** Hide Battery Coordinates on Map
- **CURRENT_CATEGORY:** Global (Header)
- **STATUS:** **PARTIAL**
- **BEHAVIOR:** header button → set `hideBatteryCoords` → passed to `TacticalMap`
- **⚠️ SCOPE:** พรางเฉพาะบน map — พิกัดในหน้าต่าง FDC, Howitzer, และ header ยังแสดง `E:${batteryCoords.easting} N:${batteryCoords.northing}` เต็ม
- **EVIDENCE:** `App.tsx:66, 411-462`, `TacticalMap.tsx`
- **CONFIDENCE:** VERIFIED (partial coverage)

---

## F031 — DESKTOP ICONS

- **FEATURE_ID:** F031
- **NAME:** Emoji Desktop Shortcuts (double-click to open)
- **CURRENT_CATEGORY:** Global / UI Shell
- **STATUS:** **IMPLEMENTED** — 8 icons for 8 windows
- **INTERACTION:** double-click = toggleWindow + beep; single click = beep only
- **EVIDENCE:** `App.tsx:84-94, 468-491`
- **CONFIDENCE:** VERIFIED

---

## F032 — TASKBAR + WINDOW TASK BUTTONS

- **FEATURE_ID:** F032
- **NAME:** Bottom Taskbar with Task Buttons
- **CURRENT_CATEGORY:** Global / UI Shell
- **STATUS:** **IMPLEMENTED**
- **BEHAVIOR:** if minimized/closed → open+focus; if active → minimize (toggle)
- **⚠️ DUPLICATION:** ทำสิ่งเดียวกับ Header Quick-Launch buttons (`App.tsx:417-436`) และ Start Menu programs (`App.tsx:673-690`) → **3 access points for the same action**
- **EVIDENCE:** `App.tsx:741-770`
- **CONFIDENCE:** VERIFIED

---

## F033 — START MENU

- **FEATURE_ID:** F033
- **NAME:** Win32-style Start Menu Overlay
- **STATUS:** **IMPLEMENTED**
- **CONTENTS:** 8 program items (windows) + 2 utility items (Simulate Call / Kill Switch)
- **EVIDENCE:** `App.tsx:664-717`
- **CONFIDENCE:** VERIFIED

---

## F034 — SYSTEM TRAY (Clock + Volume)

- **FEATURE_ID:** F034
- **NAME:** Clock (1Hz) + Volume Toggle + Grid Offset Display
- **STATUS:** **PARTIAL**
- **CLOCK:** live 1Hz update via `useEffect + setInterval(1000)` — VERIFIED
- **VOLUME:** toggle emoji only (🔊 / 🔇) — **DOES NOT actually mute Web Audio** (`SoundGenerator.ts` has no gain control tied to state)
- **GRID OFFSET:** display only (see F015)
- **EVIDENCE:** `App.tsx:70-82, 773-797`
- **CONFIDENCE:** VERIFIED

---

## F035 — HEADER QUICK-LAUNCH BAR

- **FEATURE_ID:** F035
- **NAME:** Small buttons in Header for each Window
- **STATUS:** **DUPLICATED** (with F031, F032, F033)
- **EVIDENCE:** `App.tsx:417-436`
- **CONFIDENCE:** VERIFIED

---

## F036 — RESTORED BANNER

- **FEATURE_ID:** F036
- **NAME:** Green Banner "กู้คืนพิกัด..."
- **STATUS:** **IMPLEMENTED**
- **BEHAVIOR:** shown 4s after hydration success
- **EVIDENCE:** `App.tsx:393-401, 198-201`
- **CONFIDENCE:** VERIFIED

---

## F037 — LOCKOUT SCREEN

- **FEATURE_ID:** F037
- **NAME:** Full-screen Kill-Switch Aftermath
- **STATUS:** **IMPLEMENTED**
- **EVIDENCE:** `App.tsx:346-371`
- **CONFIDENCE:** VERIFIED

---

## F038 — SOUND SYNTHESIZER

- **FEATURE_ID:** F038
- **NAME:** Web Audio API Effects Library
- **STATUS:** **IMPLEMENTED**
- **EXPORTS:** `playClick`, `playBeep(f, d, type)`, `playAlarm`, `playFireSound`, `playSplashSound`
- **EVIDENCE:** `SoundGenerator.ts:1-137`
- **CONFIDENCE:** VERIFIED

---

## F039 — TERRAIN WIREFRAME (Auto-rotating)

- **FEATURE_ID:** F039
- **NAME:** Background 3D-like grid on Canvas
- **STATUS:** **IMPLEMENTED** (visual only)
- **BEHAVIOR:** `terrainAngle` increments every frame via `requestAnimationFrame`
- **EVIDENCE:** `TacticalMap.tsx` (~lines 55-75 for animation loop)
- **CONFIDENCE:** VERIFIED

---

## F040 — MAP PAN & ZOOM

- **FEATURE_ID:** F040
- **NAME:** Drag to Pan + Zoom In/Out Buttons
- **STATUS:** **IMPLEMENTED**
- **EVIDENCE:** `TacticalMap.tsx` (state: `zoom`, `panOffset`, `isPanning`)
- **CONFIDENCE:** VERIFIED

---

## SUMMARY STATISTICS

| Status | Count |
|---|---|
| IMPLEMENTED | 27 |
| PARTIAL | 8 (F001, F013, F017, F021, F024, F030, F034) + F008 doctrinal |
| STUB | 1 (F015 — grid calibration output unused) |
| DEAD | 0 features (but 1 utility: `cn.ts`) |
| DUPLICATED | F028 (logic + UI), F029 (UI), F032 vs F033 vs F035 (nav) |
| UNKNOWN | 0 (all discoverable features documented) |

**Total features:** 40
