# 22_ERROR_VALIDATION_RULES

> Form validation, invalid input handling, guard conditions, fallback, error states, user messages.

## V-001: LOGIN — EMPTY FIELD CHECK
- **RULE:** operatorId and accessKey must be non-empty (after `.trim()`)
- **ON FAIL:** red banner "วิกฤต: ต้องกรอกรหัสผู้ปฏิบัติการและรหัสลับเพื่อเชื่อมต่อระบบ C2" + `playBeep(440, 0.3, 'sawtooth')`
- **RETRY:** stays on form; user re-enters
- **PATH:** `LoginModal.tsx:30-38`

## V-002: SETUP — VALUE RANGES
- **RULES:**
  - `easting > 0`
  - `northing > 0`
  - `altitude >= 0`
  - `simDir >= 0 && simDir <= 6400`
- **ON FAIL:** red banner "วิกฤต: ค่าปรับเทียบผิดพลาด ค่าเกินขอบเขตความปลอดภัยการปฏิบัติ" + sawtooth beep
- **RETRY:** stays on form
- **PATH:** `LoginModal.tsx:66-70`

## V-003: LOCALSTORAGE PARSE FALLBACK
- **RULE:** if `JSON.parse(localStorage.getItem(...))` throws → catch and fallback to Setup
- **RESULT:** silent fallback — user sees Setup form; no error banner
- **PATH:** `LoginModal.tsx:47-58` (try/catch)

## V-004: TARGET ADJUSTMENT — GUARD
- **RULE:** `if (!activeTarget) → beep 440Hz sawtooth + return`
- **UI:** no visible message, just audio feedback
- **PATH:** `ForwardObserverWindow.tsx:143-146`

## V-005: SHIFT SUBMIT — DROPDOWN REQUIRED
- **RULE:** button `disabled={!shiftFromId}`
- **UI:** button opacity dimmed and non-clickable
- **PATH:** `ForwardObserverWindow.tsx` shift-tab submit

## V-006: MIL FORMULA — DIVISION GUARD
- **RULE:** `computedMilDistance = milAngle > 0 ? ... : 0`
- **UI:** "Apply" button disabled if result is 0
- **PATH:** `ForwardObserverWindow.tsx:49-51`

## V-007: TRAVERSE CLOSURE ERROR
- **RULE:** `closureDistError > 10 (m) || closureBearingError > 2 (mils)` → violation
- **UI:** yellow pulse card "⚠️ เกินค่าความคลาดเคลื่อนที่ยอมรับได้: ความคลาดเคลื่อนปิดวงรอบ X ม. (เกณฑ์ปลอดภัย: 10 ม.) ระงับการส่งข้อมูล"
- **Submit button:** disabled
- **PATH:** `SurveillanceWindow.tsx:52-58,~187-200`

## V-008: INTERSECTION — PARALLEL LINES
- **RULE:** `|angleRadA - angleRadB| < 0.05 rad` → abort
- **LOG:** `[สำรวจ]: ตัวแก้จุดตัดผิดพลาด - เส้นขนานกัน (ไม่มีจุดตัด)`
- **UI:** no visible error card — logged to Console only
- **⚠️ ISSUE:** user may not notice
- **PATH:** `SurveillanceWindow.tsx:80-84`

## V-009: INTERSECTION — DIVIDE-BY-ZERO GUARD
- **RULE:** `sin(θ) || 0.001` fallback prevents `NaN`
- **UI:** none — silent numerical protection
- **PATH:** `SurveillanceWindow.tsx:86-88`

## V-010: CRATER VALIDATION
- **RULES:**
  - `|splashDir - windDir| ≤ 2000 mils`
  - `plumbBobAngle >= 10 AND ≤ 80`
- **ON FAIL:** red pulse card "⚠️ ข้อผิดพลาดความสอดคล้องของเวกเตอร์: ทิศเศษดินเบี่ยงเบน..."
- **Submit button:** disabled
- **PATH:** `HowitzerWindow.tsx:43-45,~285-297`

## V-011: RANGE OUT OF FIRE TABLE
- **RULES:**
  - `range < 2500` → error "ระยะสั้นเกินไป..."
  - `range > 8000` → error "ระยะเกินขีดจำกัด..."
- **UI:** small red text in FDC ballistics tab
- **DOWNSTREAM:** contributes to `!isFireSafe` → FIRE button disabled
- **PATH:** `ballistics.ts:32-46`, `FdcWindow.tsx:~170-173`

## V-012: FIRE MISSION GATES
- **RULES (all must be true):**
  1. `levelIsCentered` (bubble drift < 2px)
  2. `icmSafe` (not ICM ammo OR friendly ≥ 600m)
  3. `!interpError` (range in table)
  4. `correctedQE >= finalMinQE` (clears crest)
- **ON FAIL:** FIRE button turns red "ยิงไม่ได้ (ตรวจการปรับเทียบ)" with Shield icon + `disabled` + `opacity-50`
- **⚠️ ISSUE:** button doesn't indicate WHICH gate failed
- **PATH:** `FdcWindow.tsx:~104-107`

## V-013: MUNITIONS VT + SUPP CHARGE WARNING
- **RULE:** `fuzeType === 'VT Airburst' && supplementaryCharge === true` → show warning
- **UI:** red flashing card "⚠️ คำเตือนความปลอดภัยก่อนประกอบหัวชนวน..." + "ถอดจรวดเสริมทันที" quick-fix button
- **⚠️ NON-BLOCKING:** does NOT prevent FIRE — visual warning only
- **PATH:** `MunitionsWindow.tsx:18-64`

## V-014: ICM VIOLATION WARNING
- **RULE:** APICM/DPICM ammo AND friendlyDist < 600m
- **UI:** red pulse card "⚠️ ละเมิดเขตปลอดภัยกระสุน ICM!" in WeaponsWindow ICM tab
- **BLOCKING:** yes (via V-012 gate 2)
- **PATH:** `WeaponsWindow.tsx:33-34,~190-201`

## V-015: KILL SWITCH CONFIRMATION
- **RULE:** `window.confirm('⚠️ คำเตือน: การกดสวิตช์ฆ่าจะลบข้อมูลทั้งหมด...')` before executing
- **ON Cancel:** no-op
- **PATH:** `ControlPanelWindow.tsx:29`

## V-016: FUZE TIME SLIDER DISABLED
- **RULE:** slider disabled unless `fuzeType === 'VT Airburst'`
- **UI:** slider grayed out
- **PATH:** `WeaponsWindow.tsx:~135`

## V-017: WINDOW DRAG BOUND (Y-axis only)
- **RULE:** `if (newY < 40) newY = 40`
- **UI:** window cannot be dragged above header
- **X-axis:** NO bound → can drag off-screen right
- **PATH:** `WindowManager.tsx:74-77`

## V-018: WINDOW RESIZE MIN
- **RULE:** min 250×150 px (or per-window `minW`/`minH` if provided)
- **PATH:** `WindowManager.tsx:109-113`

## V-019: DUPLICATE TARGET ID GUARD
- **RULE:** `if (prev.some(t => t.id === newTgt.id)) return prev`
- **UI:** none — silently skipped
- **PATH:** `App.tsx:220-223`

## V-020: SIMULATE CALL ID COLLISION
- **RULE:** none beyond V-019 — random 10-99 range gives ~90 possibilities, collisions rare but possible
- **PATH:** `App.tsx:319`

## V-021: BUBBLE VIAL DRAG BOUND
- **RULE:** `maxRadius = 35px` — if drag beyond, clamp to circle edge
- **PATH:** `CompassWindow.tsx:87-93`

## V-022: AUDIO CONTEXT INIT
- **RULE:** wrap all Web Audio in `try/catch` — silent failure if context not initialized or blocked
- **UI:** none
- **PATH:** `SoundGenerator.ts:32,66,...` (each function has try/catch)

## V-023: INDEXEDDB DELETE ERROR
- **RULE:** wrap `indexedDB.deleteDatabase` in `try/catch`
- **UI:** none
- **PATH:** `App.tsx:305-309`

## FALLBACK STATES

| Condition | Fallback |
|---|---|
| localStorage parse fail | Go to Setup screen |
| No audio context | Silent (no error to user) |
| No activeTarget when adjusting | Beep + no-op |
| No activeTarget for friendlyDist | Returns 99999 (auto ICM safe) |
| Traverse violation | Yellow warning + block submit |
| Range out of table | Use boundary + error text |
| Fire safety gate fail | Red disabled button |

## ERROR STATE STYLING

- **Red (critical):** `bg-red-950/40 border-2 border-red-500/50 text-red-400/500`
- **Yellow (warning):** `bg-yellow-950/30 border border-[#8A852B] text-yellow-500`
- **Green (success):** `bg-[#2b4034]/20 border border-[#3be099]/30 text-[#3be099]`
- **All warnings use `animate-pulse`** for attention

## MESSAGES INVENTORY (Selected — Thai)

| Message | Where |
|---|---|
| "วิกฤต: ต้องกรอกรหัสผู้ปฏิบัติการและรหัสลับเพื่อเชื่อมต่อระบบ C2" | Login empty |
| "วิกฤต: ค่าปรับเทียบผิดพลาด ค่าเกินขอบเขตความปลอดภัยการปฏิบัติ" | Setup invalid |
| "⚠️ เกินค่าความคลาดเคลื่อนที่ยอมรับได้..." | Traverse violation |
| "⚠️ ข้อผิดพลาดความสอดคล้องของเวกเตอร์..." | Crater invalid |
| "⚠️ คำเตือนความปลอดภัยก่อนประกอบหัวชนวน..." | VT + Supp Charge |
| "⚠️ ละเมิดเขตปลอดภัยกระสุน ICM!" | ICM violation |
| "ระยะสั้นเกินไป: ระยะต่ำสุดคือ 2500 เมตร..." | Range below |
| "ระยะเกินขีดจำกัด: ระยะสูงสุดคือ 8000 เมตร..." | Range above |
| "ยิงไม่ได้ (ตรวจการปรับเทียบ)" | FIRE gate fail |
| "⚠️ คำเตือน: การกดสวิตช์ฆ่าจะลบข้อมูลทั้งหมด..." | Kill Switch confirm |
| "แท่นปืนไม่ได้ระดับ / ล็อกการยิง" | Level not centered |

## VALIDATION MATURITY

- **VERIFIED:** No schema validation library (no Zod/Yup/Ajv)
- **VERIFIED:** No form library (no React Hook Form / Formik)
- **INFERRED:** Validation is scattered inline in event handlers → hard to unit test
- **NO** i18n handling for error messages (Thai hardcoded)
