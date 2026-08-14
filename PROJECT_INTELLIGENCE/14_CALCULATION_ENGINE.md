# 14_CALCULATION_ENGINE

> Inventory ทุก function/expression ที่ทำการคำนวณ.
> ถ้าสูตรไม่เห็นครบ → UNKNOWN. ห้าม derive สูตรเอง.

---

## CALC-01: LINEAR BALLISTIC INTERPOLATION
- **CALC_ID:** CALC-01
- **NAME:** `interpolateBallistics`
- **PATH:** `src/utils/ballistics.ts:29-63`
- **FUNCTION SIGNATURE:** `interpolateBallistics(range: number): { qe: number; tof: number; error?: string }`
- **INPUT:** `range` (meters) — expected in [2500, 8000]
- **FORMULA_AS_IMPLEMENTED:**
  ```
  if (range < 2500):  return { qe: 110, tof: 10.1, error: "ระยะสั้นเกินไป..." }
  if (range > 8000):  return { qe: 830, tof: 56.1, error: "ระยะเกินขีดจำกัด..." }
  for each row i in table[0..10]:
      if (range >= table[i].range && range <= table[i+1].range):
          fraction = (range - table[i].range) / (table[i+1].range - table[i].range)
          qe  = table[i].elevation + fraction × (table[i+1].elevation - table[i].elevation)
          tof = table[i].tof       + fraction × (table[i+1].tof       - table[i].tof)
          return { qe: round(qe × 10) / 10, tof: round(tof × 10) / 10 }
  return { qe: 0, tof: 0, error: "OUT_OF_BOUNDS" }  // fallback (unreachable in current table)
  ```
- **OUTPUT:** `{qe: mils, tof: seconds, error?: string}` — rounded to 1 decimal
- **UNIT:** mils, seconds
- **USED_BY:** `FdcWindow.tsx` (called twice per render: raw + corrected)
- **EDGE_CASE:** exactly at boundary → uses interpolate loop (fraction=0 or 1)
- **TEST:** ❌ none
- **EVIDENCE:** `src/utils/ballistics.ts:29-63`
- **CONFIDENCE:** VERIFIED

## CALC-02: WIND SPLITTING
- **CALC_ID:** CALC-02
- **NAME:** `calculateWindSplitting`
- **PATH:** `src/utils/ballistics.ts:70-94`
- **FUNCTION:** `calculateWindSplitting(firingAzimuthMils, windSpeedKts, windDirMils)`
- **FORMULA:**
  ```
  firingRad = firingAzimuthMils × 2π / 6400
  windRad   = windDirMils × 2π / 6400
  angleDiff = windRad - firingRad
  headwind  = windSpeedKts × cos(angleDiff)
  crosswind = windSpeedKts × sin(angleDiff)
  rangeCorrection      = round(headwind × 3.5 × 10) / 10   // m/knot factor 3.5
  deflectionCorrection = round(-crosswind × 0.8 × 10) / 10 // mils/knot factor 0.8, negative sign
  ```
- **OUTPUT:** `{headwind, crosswind, rangeCorrection, deflectionCorrection}`
- **UNIT:** knots (kts), meters, mils
- **USED_BY:** `FdcWindow.tsx`
- **UNKNOWN:** provenance of coefficients 3.5 and 0.8 — code comment says "Rule of thumb for standard 105mm corrections" (no source citation)
- **EVIDENCE:** `src/utils/ballistics.ts:70-94`

## CALC-03: POLAR PLOT
- **CALC_ID:** CALC-03
- **NAME:** `calculatePolarPlot`
- **PATH:** `src/utils/ballistics.ts:100-116`
- **FUNCTION:** `calculatePolarPlot(foEasting, foNorthing, azimuthMils, distance)`
- **FORMULA:**
  ```
  angleRad = azimuthMils × 2π / 6400
  ΔE = distance × sin(angleRad)
  ΔN = distance × cos(angleRad)
  return { easting: round(foEasting + ΔE), northing: round(foNorthing + ΔN) }
  ```
- **UNIT:** meters
- **USED_BY:** `ForwardObserverWindow.tsx` (Polar tab submit)
- **EDGE_CASE:** azimuth = 0 → ΔE=0, ΔN=distance (due north); azimuth = 1600 (=90°) → ΔE=distance, ΔN=0 (due east)
- **EVIDENCE:** `src/utils/ballistics.ts:100-116`
- **CONFIDENCE:** VERIFIED

## CALC-04: MILS ↔ DEGREES
- **CALC_ID:** CALC-04
- **PATH:** `src/utils/ballistics.ts:121-127`
- **FORMULAS:**
  - `milsToDegrees(mils) = (mils / 6400) × 360`
  - `degreesToMils(degrees) = (degrees / 360) × 6400`
- **USED_BY:** `TacticalMap.tsx` (rotate compass widget), `CompassWindow.tsx` (inline `headingDegrees = (headingMils / 6400) × 360`, not calling exported fn)
- **⚠️ DUPLICATION:** `TacticalMap.tsx` has a local `milsToDegrees` helper at the bottom of the file (verified in earlier exploration) — same formula
- **CONFIDENCE:** VERIFIED

## CALC-05: RANGE FROM COORDINATES
- **CALC_ID:** CALC-05
- **PATH:** inline in `FdcWindow.tsx` useEffect
- **FORMULA:**
  ```
  ΔE = activeTarget.easting - batteryCoords.easting
  ΔN = activeTarget.northing - batteryCoords.northing
  range = round(√(ΔE² + ΔN²))
  ```
- **UNIT:** meters
- **USED_BY:** FdcWindow auto-sync → feeds CALC-01
- **EVIDENCE:** `FdcWindow.tsx:~53-58`

## CALC-06: AZIMUTH FROM COORDINATES
- **CALC_ID:** CALC-06
- **PATH:** inline in `FdcWindow.tsx` useEffect
- **FORMULA:**
  ```
  rad = atan2(ΔE, ΔN)     // note: E first, N second (screen-y-down convention)
  if (rad < 0) rad += 2π
  azimuthMils = round(rad × 6400 / (2π))
  ```
- **EDGE_CASE:** target at same location → atan2(0,0) = 0 → azimuth 0 (due north)
- **EVIDENCE:** `FdcWindow.tsx:~60-64`

## CALC-07: FRIENDLY DISTANCE
- **CALC_ID:** CALC-07
- **PATH:** `App.tsx:333-338`
- **FORMULA:**
  ```
  if (!activeTarget) return 99999
  dx = activeTarget.easting - friendlyCoords.easting
  dy = activeTarget.northing - friendlyCoords.northing
  return round(√(dx² + dy²))
  ```
- **USED_BY:** `icmSafe` derivation → FDC ICM gate
- **EVIDENCE:** `App.tsx:333-338`

## CALC-08: LEVEL BUBBLE DRIFT
- **CALC_ID:** CALC-08
- **PATH:** `App.tsx:342`, `CompassWindow.tsx:35`
- **FORMULA:** `drift = √(bubbleOffset.x² + bubbleOffset.y²)` → `isLevel = drift < 2`
- **EVIDENCE:** as above

## CALC-09: PER-GUN QE
- **CALC_ID:** CALC-09
- **PATH:** `FdcWindow.tsx:~240-247`
- **FORMULA:** `gunQE = round((correctedQE - VE × 0.15) × 10) / 10`
- **CONSTANT:** 0.15 mils per m/s VE (hardcoded, no citation)
- **USED_BY:** display in per-gun grid
- **EVIDENCE:** as above

## CALC-10: PER-GUN DEFLECTION
- **CALC_ID:** CALC-10
- **PATH:** `FdcWindow.tsx:~238-244`
- **FORMULA:**
  ```
  spatialCorrection = (targetRange > 0)
      ? round(gun.offsetX × 1000 / targetRange)
      : 0
  gunDeflection = finalDeflection + spatialCorrection
  ```
- **UNIT:** mils
- **EDGE_CASE:** range=0 → spatialCorrection=0 (avoid divide-by-zero)
- **EVIDENCE:** as above

## CALC-11: MIN QE (ROUND-UP RULE)
- **CALC_ID:** CALC-11
- **PATH:** `FdcWindow.tsx:~62-63`
- **FORMULA:**
  ```
  rawMinQE = pieceToCrestSlope + 5 + round(crestHeight × 1000 / crestDistance)
  finalMinQE = Math.ceil(rawMinQE)
  ```
- **⚠️ INFERRED:** the term `crestHeight × 1000 / crestDistance` looks like an angular slope in mils (m to km conversion + small-angle approx), but no unit label in code
- **CONFIDENCE:** VERIFIED (formula); INFERRED (unit interpretation)

## CALC-12: TRAVERSE CLOSURE
- **CALC_ID:** CALC-12
- **PATH:** `SurveillanceWindow.tsx:41-58`
- **FORMULA:**
  ```
  for each station st:
      angleRad = st.bearing × 2π / 6400
      totalDeltaE += st.distance × sin(angleRad)
      totalDeltaN += st.distance × cos(angleRad)
  closureDistError = √(totalDeltaE² + totalDeltaN²)
  totalBearing = (Σ st.bearing) mod 6400
  closureBearingError = |(totalBearing - 3200) mod 6400|
  isExceeded = closureDistError > 10 || closureBearingError > 2
  ```
- **⚠️ UNKNOWN provenance:** `closureBearingError` formula against `3200` (2 quadrants) — comment in code labels it "placeholder simple evaluation"

## CALC-13: INTERSECTION SOLVER
- **CALC_ID:** CALC-13
- **PATH:** `SurveillanceWindow.tsx:71-93`
- **FORMULA:**
  ```
  angleRadA = bearingA × 2π / 6400
  angleRadB = bearingB × 2π / 6400
  if (|angleRadA - angleRadB| < 0.05) → parallel, abort
  m1 = cos(angleRadA) / (sin(angleRadA) || 0.001)
  m2 = cos(angleRadB) / (sin(angleRadB) || 0.001)
  intE = ((stationBN - stationAN) + m1 × stationAE - m2 × stationBE) / (m1 - m2 || 0.001)
  intN = stationAN + m1 × (intE - stationAE)
  ```
- **⚠️ INFERRED:** The formula uses `cot(θ)` = cos/sin (bearing measured from north, so slope-in-N/E-plane). Numerically stable via `|| 0.001` fallback for edge cases (bearing = 0, π, 2π)

## CALC-14: SLOPE-TO-HORIZONTAL
- **CALC_ID:** CALC-14
- **PATH:** `SurveillanceWindow.tsx:98-100`
- **FORMULA:**
  ```
  θ = inclinometerAngle × π / 180   // convert degrees to radians
  horizontalDistance = round(slopeDistance × cos(θ) × 10) / 10
  elevationDifference = round(slopeDistance × sin(θ) × 10) / 10
  ```
- **UNIT:** meters
- **EVIDENCE:** as above

## CALC-15: FLASH-TO-BANG DISTANCE
- **CALC_ID:** CALC-15
- **PATH:** `ForwardObserverWindow.tsx:79`
- **FORMULA:** `dist = round(timerSeconds × 340)` — speed of sound assumed 340 m/s
- **⚠️ HARDCODED:** does not account for altitude / temperature / humidity variations of sound speed

## CALC-16: MIL FORMULA
- **CALC_ID:** CALC-16
- **PATH:** `ForwardObserverWindow.tsx:49-51`
- **FORMULA:** `computedMilDistance = milAngle > 0 ? round(objectWidth × 1000 / milAngle) : 0`
- **UNIT:** meters (W in meters × 1000 gives mil × meter, / mils = meters)

## CALC-17: SIMULATE CALL COORD (Inline Polar — Duplicate)
- **CALC_ID:** CALC-17
- **PATH:** `App.tsx:321-322`
- **FORMULA:**
  ```
  easting  = batteryCoords.easting  + round(randomRange × sin(1200 / 6400 × 2π))
  northing = batteryCoords.northing + round(randomRange × cos(1200 / 6400 × 2π))
  ```
- **⚠️ DUPLICATE_LOGIC:** identical math to `calculatePolarPlot()` but inline (not reusing the function)

## CALC-18: WEAPON IDENTIFICATION BINS
- **CALC_ID:** CALC-18
- **PATH:** `HowitzerWindow.tsx:36-42`
- **FORMULA:** if-else chain on `craterWidth`:
  - `< 2` → ปืนครกเบา 81 มม.
  - `< 4` → ปืนใหญ่กลาง 105 มม.
  - `< 6` → จรวดยุทธวิธี 122 มม.
  - `≥ 6` → ปืนใหญ่หนัก 152/155 มม.

## CALC-19: CRATER VALIDATOR
- **CALC_ID:** CALC-19
- **PATH:** `HowitzerWindow.tsx:44-45`
- **FORMULA:**
  ```
  angleErrorCheck = |splashDir - windDir| > 2000
  isCraterValid = !angleErrorCheck && plumbBobAngle >= 10 && plumbBobAngle <= 80
  ```

## CALC-20: COMPASS N/S CORRECTION
- **CALC_ID:** CALC-20
- **PATH:** `CompassWindow.tsx:31-33`
- **FORMULA:**
  ```
  headingDegrees = headingMils × 360 / 6400
  isNorthbound = headingDegrees >= 270 || headingDegrees <= 90
  correctedAngle = isNorthbound ? headingDegrees : (headingDegrees + 180) mod 360
  correctedMils = correctedAngle × 6400 / 360
  ```

## CALC-21: CANVAS PARABOLIC ARC
- **CALC_ID:** CALC-21
- **PATH:** `TacticalMap.tsx` (trajectory drawing block)
- **NATURE:** for each `t` in [0, fireMissionProgress]:
  - Interpolate `(x, y)` = lerp(battery, target, t)
  - Height offset from parabola formula (grep needed for exact eq)
- **CONFIDENCE:** INFERRED (formula visible in prior read: uses `t × (1-t)` parabolic shape)
- **EVIDENCE:** `TacticalMap.tsx` around trajectory `if (fireMissionActive)` block

## CALC-22: TERRAIN WIREFRAME ANIMATION
- **CALC_ID:** CALC-22
- **PATH:** `TacticalMap.tsx` (background mesh)
- **NATURE:** rotate mesh via `terrainAngle += small step` per `requestAnimationFrame`
- **CONFIDENCE:** VERIFIED (behavior); INFERRED (exact formula)

## CALC-23: WINDOW MAXIMIZE SIZE
- **CALC_ID:** CALC-23
- **PATH:** `WindowManager.tsx:134-135`
- **FORMULA:** `w = window.innerWidth`, `h = window.innerHeight - 80` (header 12 + footer 12 + margin)
- **PLACEMENT:** `x = 0, y = 48` (just below header)

## SUMMARY: SHARED VS INLINE CALCULATIONS

| Where | Count |
|---|---|
| Exported pure functions (`ballistics.ts`) | 5 (interpolate, wind, polar, milsToDeg, degToMils) |
| Inline in App.tsx | 3 (CALC-07, CALC-08, CALC-17) |
| Inline in FdcWindow.tsx | 5 (CALC-05, CALC-06, CALC-09, CALC-10, CALC-11) |
| Inline in SurveillanceWindow.tsx | 3 (CALC-12, CALC-13, CALC-14) |
| Inline in ForwardObserverWindow.tsx | 2 (CALC-15, CALC-16) |
| Inline in HowitzerWindow.tsx | 2 (CALC-18, CALC-19) |
| Inline in CompassWindow.tsx | 1 (CALC-20) |
| Inline in TacticalMap.tsx | 2 (CALC-21, CALC-22) |
| Inline in WindowManager.tsx | 1 (CALC-23) |
| **TOTAL** | **24 distinct calculations** |

## KNOWN COEFFICIENT CONSTANTS

| Constant | Value | Purpose | Source |
|---|---|---|---|
| Sound speed | 340 m/s | Flash-to-Bang | `ForwardObserverWindow.tsx:79` |
| Headwind factor | 3.5 m/kt | Range correction | `ballistics.ts:90` |
| Crosswind factor | 0.8 mils/kt (negative) | Deflection correction | `ballistics.ts:91` |
| VE elevation shift | 0.15 mils per m/s | Per-gun QE | `FdcWindow.tsx:~247` |
| Safety buffer | 5 mils | Min QE addend | `FdcWindow.tsx:~62` |
| Base deflection | 3200 mils | Zero-deflection center | `FdcWindow.tsx:~89` |
| Level threshold | 2 px | Bubble drift | `App.tsx:342` |
| ICM safe zone | 600 m | Friendly proximity | `App.tsx:344`, `WeaponsWindow.tsx:33` |
| Traverse dist tol | 10 m | Closure error | `SurveillanceWindow.tsx:58` |
| Traverse bearing tol | 2 mils | Closure error | `SurveillanceWindow.tsx:58` |
| Crater vs wind tol | 2000 mils | Validation | `HowitzerWindow.tsx:44` |
| Plumb bob range | 10°–80° | Validation | `HowitzerWindow.tsx:45` |
| Full circle mils | 6400 mils | Conversion factor | `ballistics.ts:107` etc. |
| Parallel-line tol | 0.05 rad | Intersection guard | `SurveillanceWindow.tsx:80` |
| Divide-by-zero fallback | 0.001 | Intersection solver | `SurveillanceWindow.tsx:88` |

**⚠️ ALL coefficients are hardcoded literals in source. No config file, no environment variable.**
