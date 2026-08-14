# 13_BUSINESS_RULES

> เฉพาะกฎที่พบจริงจาก code. ไม่เพิ่มความรู้ domain จากภายนอก.

---

## BR-001: LOGIN INPUT MUST BE NON-EMPTY
- **DESCRIPTION:** Both `operatorId` and `accessKey` fields must be non-empty (after trim) to proceed
- **TRIGGER:** click "เชื่อมต่อความปลอดภัย" in Login form
- **CONDITION:** `!operatorId.trim() || !accessKey.trim()`
- **ACTION:** Set error message, play sawtooth beep, return without auth attempt
- **EXCEPTION:** none — password strength/format not checked
- **SOURCE_FUNCTION:** `LoginModal.handleLogin`
- **EVIDENCE:** `LoginModal.tsx:30-38`
- **CONFIDENCE:** VERIFIED

## BR-002: SETUP VALUE RANGES
- **DESCRIPTION:** Battery setup accepts only:
  - easting > 0
  - northing > 0
  - altitude ≥ 0
  - simDir ∈ [0, 6400]
- **TRIGGER:** click "เข้าสู่ศูนย์บัญชาการ"
- **ACTION on fail:** error text "วิกฤต: ค่าปรับเทียบผิดพลาด..."
- **SOURCE_FUNCTION:** `LoginModal.handleSetupSubmit`
- **EVIDENCE:** `LoginModal.tsx:66-70`

## BR-003: HYDRATION PRECEDENCE
- **DESCRIPTION:** If `localStorage['artyc2_battery_coords']` exists (and JSON-parses successfully), skip Setup screen entirely
- **SOURCE:** `LoginModal.tsx:42-56`

## BR-004: KILL SWITCH REQUIRES CONFIRMATION
- **DESCRIPTION:** Native `window.confirm()` before executing wipe
- **SOURCE:** `ControlPanelWindow.tsx:29`

## BR-005: KILL SWITCH SCOPE
- Wipes: `isLoggedIn`, `operatorId`, `activeTarget`, `targetsList`, `logs`, `localStorage`, `indexedDB.deleteDatabase('fdc_offline_queue')`
- Does NOT wipe: `windows` positions/sizes, `batteryCoords`, `gunPositions`, `bubbleOffset`, `headingMils`, `gridOffset`, `ammuType`, `fuzeType`, `fuzeTime`, `supplementaryCharge`, `misfire*`, `hideBatteryCoords`, `audioVolume`, `isStartMenuOpen`
- **SOURCE:** `App.tsx:292-313`
- **⚠️ INFERRED ISSUE:** Partial wipe — subsequent Login on a fresh session may see stale in-memory state persist through the render cycle

## BR-006: LOG BUFFER MAX 50
- **DESCRIPTION:** `addLogEvent` prepends new entry and slices `[0, 49]`
- **SOURCE:** `App.tsx:207-210`

## BR-007: ADJUSTMENT PAD REQUIRES ACTIVE TARGET
- **CONDITION:** `if (!activeTarget) → beep 440Hz + return`
- **SOURCE:** `ForwardObserverWindow.tsx:143-146`

## BR-008: SHIFT REQUIRES KNOWN POINT
- Submit button disabled if `shiftFromId === ''` (no dropdown selection)
- **SOURCE:** `ForwardObserverWindow.tsx` (button `disabled={!shiftFromId}`)

## BR-009: MIL FORMULA GUARD
- `computedMilDistance = milAngle > 0 ? round(W×1000/M) : 0`
- Apply button disabled if `computedMilDistance === 0`
- **SOURCE:** `ForwardObserverWindow.tsx:49-51`

## BR-010: TRAVERSE CLOSURE THRESHOLDS
- **CONDITION:** `closureDistError > 10 (meters) OR closureBearingError > 2 (mils)` → violation
- **ACTION:** display yellow warning card + disable "Submit Traverse Data" button
- **SOURCE:** `SurveillanceWindow.tsx:52-58`
- **⚠️ INFERRED:** `closureBearingError = |(totalBearing - 3200) mod 6400|` — formula does not clearly match standard interior-angle sum rule; simplified placeholder

## BR-011: INTERSECTION PARALLEL GUARD
- **CONDITION:** `|angleRadA - angleRadB| < 0.05 rad`
- **ACTION:** log error "เส้นขนานกัน (ไม่มีจุดตัด)" and return
- **SOURCE:** `SurveillanceWindow.tsx:80-84`

## BR-012: CRATER VALIDATION
- **CONDITION:** `!angleErrorCheck && plumbBobAngle >= 10 && plumbBobAngle <= 80`
  - `angleErrorCheck = |splashDir - windDir| > 2000` (mils)
- **ACTION:** submit button enabled when valid
- **SOURCE:** `HowitzerWindow.tsx:43-45`

## BR-013: WEAPON IDENTIFICATION BINS
| craterWidth (m) | Identified weapon |
|---|---|
| < 2 | ปืนครกเบา 81 มม. |
| ≥ 2 and < 4 | ปืนใหญ่กลาง 105 มม. |
| ≥ 4 and < 6 | จรวดยุทธวิธี 122 มม. |
| ≥ 6 | ปืนใหญ่หนัก 152/155 มม. |
- **SOURCE:** `HowitzerWindow.tsx:37-42`

## BR-014: COUNTER-BATTERY TARGET IS HARDCODED
- On submit, target position is fixed at `E:34500, N:48500, Alt:150`
- **⚠️ ISSUE:** does not derive from crater direction/vectors
- **SOURCE:** `HowitzerWindow.tsx` (CB submit)

## BR-015: RANGE INTERPOLATION BOUNDS
- Table spans 2500–8000m
- Below → use table[0] (110 mils / 10.1s) + return error "ระยะสั้นเกินไป..."
- Above → use table[last] (830 mils / 56.1s) + return error "ระยะเกินขีดจำกัด..."
- **SOURCE:** `ballistics.ts:32-46`

## BR-016: LINEAR INTERPOLATION FORMULA
- `fraction = (range - table[i].range) / (table[i+1].range - table[i].range)`
- `qe = table[i].elevation + fraction × (table[i+1].elevation - table[i].elevation)`
- `tof = table[i].tof + fraction × (table[i+1].tof - table[i].tof)`
- Both rounded to 1 decimal
- **SOURCE:** `ballistics.ts:48-59`

## BR-017: WIND SPLIT COEFFICIENTS (Hardcoded)
- `rangeCorrection = round(headwind × 3.5 × 10) / 10` (meters per knot)
- `deflectionCorrection = round(-crosswind × 0.8 × 10) / 10` (mils per knot, opposite sign)
- **SOURCE:** `ballistics.ts:87-91`

## BR-018: BASE DEFLECTION CONSTANT
- Zero-deflection = 3200 mils (Firing calibration center)
- `finalDeflection = 3200 + deflectionCorrection`
- **SOURCE:** `FdcWindow.tsx:~89-91`

## BR-019: PER-GUN CORRECTIONS
- `gunQE = round((correctedQE - VE × 0.15) × 10) / 10`   [VE +1 m/s ≈ 0.15 mils elevation shift]
- `gunDeflection = finalDeflection + round(offsetX × 1000 / range)`   [spatial mils correction]
- **SOURCE:** `FdcWindow.tsx:~235-255`

## BR-020: MIN QE ROUND-UP SAFETY RULE
- `rawMinQE = pieceToCrestSlope + 5 + round(crestHeight × 1000 / crestDistance)`
- `finalMinQE = Math.ceil(rawMinQE)`   [ALWAYS round UP to next integer mil]
- **PURPOSE (per code comment):** ensure projectile clears friendly ridges
- **SOURCE:** `FdcWindow.tsx:~62-63`

## BR-021: FIRE EXECUTE GATE (Composite)
- `isFireSafe = levelIsCentered && icmSafe && !interpError && correctedQE >= finalMinQE`
- All 4 must be true
- **SOURCE:** `FdcWindow.tsx:~104-107`

## BR-022: LEVEL BUBBLE THRESHOLD
- `isLevel = √(bubbleOffset.x² + bubbleOffset.y²) < 2` (pixels)
- **SOURCE:** `App.tsx:342`, `CompassWindow.tsx:35`

## BR-023: ICM SAFE ZONE
- `isIcmAmmo = ammuType ∈ {APICM, DPICM}`
- `icmSafe = !isIcmAmmo || friendlyDistance ≥ 600` (meters)
- `friendlyDistance = round(√((activeTarget.E - friendlyE)² + (activeTarget.N - friendlyN)²))`
- If no activeTarget → `friendlyDistance = 99999` (auto-safe)
- **SOURCE:** `App.tsx:333-344`

## BR-024: COMPASS N/S DECISION
- `isNorthbound = headingDegrees >= 270 || headingDegrees <= 90`
- if Northbound → red needle glow + display raw angle
- if Southbound → matte black needle + display `(angle + 180) mod 360`
- **SOURCE:** `CompassWindow.tsx:30-33`

## BR-025: VT + SUPP CHARGE WARNING
- `showSafetyWarning = fuzeType === 'VT Airburst' && supplementaryCharge === true`
- Shows red flashing card + quick-fix button
- **⚠️ ISSUE:** Warning only. Does NOT block FIRE button
- **SOURCE:** `MunitionsWindow.tsx:18-20`

## BR-026: FUZE TIME SLIDER DISABLED
- Slider disabled unless `fuzeType === 'VT Airburst'`
- **SOURCE:** `WeaponsWindow.tsx:~135`

## BR-027: MISFIRE COUNTDOWN
- Start value 1800 seconds (30 minutes)
- Every 10 seconds → play alarm
- On reach 1 → clear timer, reset to 1800, `setMisfireActive(false)`
- **SOURCE:** `App.tsx:269-290`

## BR-028: FIRE MISSION TIMER
- Step 0.1s (10Hz)
- On `timeLeft ≤ 5` and integer boundary → beep 980Hz + log SPLASH_COUNTDOWN
- On `timeLeft === 0` → playSplashSound + log SPLASH_IMPACT + `setFireMissionActive(false)`
- **SOURCE:** `App.tsx:235-267`

## BR-029: RESTORED BANNER DURATION
- 4000ms fixed
- **SOURCE:** `App.tsx:198-201`

## BR-030: WINDOW DRAG BOUNDS
- Y-axis: `if (newY < 40) newY = 40` (prevents dragging under header)
- X-axis: no bound
- **SOURCE:** `WindowManager.tsx:74-77`

## BR-031: WINDOW MIN SIZE
- Default 250×150 px
- Per-window `minW`/`minH` may override
- **SOURCE:** `WindowManager.tsx:109-113`

## BR-032: DUPLICATE TARGET ID GUARD
- `handleAddTarget`: if id already exists → return previous list unchanged
- **SOURCE:** `App.tsx:220-223`

## BR-033: TARGET NAMING CONVENTIONS
- Grid method: `T-` + random 100-999
- Polar method: `POLAR-` + targetName (or index)
- Shift method: `SHIFT-` + knownName
- Simulate call: `FO-` + random 10-99 + `FIRE-MISSION-` + random 100-999
- Crater CB: `CB-` + random 100-999 + `CB-<weapon-first-word>`
- **SOURCE:** various onAddTarget calls

## BR-034: SIMULATE CALL DEFAULTS
- Random range 3000-5000m
- Fixed azimuth 1200 mils
- Uses inline `sin/cos` (NOT `calculatePolarPlot`) ⚠️ duplication
- **SOURCE:** `App.tsx:317-322`

## BR-035: FRIENDLY POSITION IS HARDCODED
- `friendlyCoords = { easting: 32500, northing: 44500, altitude: 110 }`
- **SOURCE:** `App.tsx:26`

## BR-036: INITIAL SEEDED TARGETS
- 2 seeded on boot: T-01 (33450/46210/140), T-02 (34100/43800/130)
- **SOURCE:** `App.tsx:29-32`

## BR-037: INITIAL GUN POSITIONS
- 6 fixed offsets — see `ballistics.ts:147-154`

## BR-038: GUN VE VARIANCES
- Fixed constant array: `[+1.2, -0.8, +0.4, -1.5, +0.2, -0.5]` (m/s)
- **SOURCE:** `ballistics.ts:132-139`
