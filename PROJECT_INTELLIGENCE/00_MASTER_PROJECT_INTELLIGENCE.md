# 00_MASTER_PROJECT_INTELLIGENCE

> **TASK_ID:** WENSITE-INTELLIGENCE-001
> **MODE:** AS-IS Repository Intelligence Extraction
> **PURPOSE:** Entry point ของ PROJECT_INTELLIGENCE package ทั้งชุด — อ่านไฟล์นี้แล้วรู้ว่าควรไปอ่านอะไรต่อ

---

## PROJECT IDENTITY

| Field | Value | Confidence |
|---|---|---|
| Project Name (package.json) | `react-vite-tailwind` | **VERIFIED** (`package.json:2`) |
| Project Name (index.html title) | `ระบบอำนวยการยิงปืนใหญ่ C2 ยุคถัดไป` | **VERIFIED** (`index.html:6`) |
| Prompt-referenced name | `Wensite / lithos-hero` | **UNKNOWN** — ชื่อนี้ปรากฏใน task prompt แต่ **ไม่พบใน repository ปัจจุบัน** ไม่มีไฟล์ `lithos-hero.md`, `FIRST_ALL_PROJECT.md`, หรือ `implementation_plan.md` |
| Version | `0.0.0` | **VERIFIED** (`package.json:4`) |
| Private | `true` | **VERIFIED** (`package.json:3`) |
| Module Type | ESM (`"type": "module"`) | **VERIFIED** (`package.json:5`) |
| Application Type | Single-Page Application (SPA), no router | **VERIFIED** (`src/main.tsx`, `src/App.tsx`) |
| Build Output | **Single-file HTML** (via `vite-plugin-singlefile`) | **VERIFIED** (`vite.config.ts:6,13`) |

## SNAPSHOT

| Field | Value |
|---|---|
| Snapshot Branch | **UNKNOWN** — ไม่มีเครื่องมือ git ในสภาพแวดล้อมนี้ |
| Snapshot Commit SHA | **UNKNOWN** — ไม่มีเครื่องมือ git ในสภาพแวดล้อมนี้ |
| Snapshot Date | 2026 (ปีปัจจุบันของ session) |
| Working Directory | Repository root (relative paths) |

## SYSTEM SUMMARY

ระบบเป็น **Web Application แบบ Single-Page** จำลอง "ศูนย์อำนวยการยิงปืนใหญ่" (Fire Direction Center — FDC) ในรูปแบบเดสก์ท็อป OS แบบ Win32 Classic โดย:

- **เรนเดอร์เป็น full-screen tactical map** บน HTML5 Canvas
- **มีหน้าต่างลอย 8 ตัว** ที่ลาก/ปรับขนาด/ย่อ/ขยายได้
- **State ทั้งหมดถูกยกไว้ที่ `App.tsx`** (802 บรรทัด) — ไม่มี Context/Redux/Zustand จริง
- **Persistence:** LocalStorage เท่านั้น (`artyc2_battery_coords`) + `indexedDB.deleteDatabase('fdc_offline_queue')` (ล้างเท่านั้น ไม่มีการเขียน)
- **ไม่มี Network calls จริง** — WebSocket, API เป็นการจำลองผ่าน string logging เท่านั้น
- **ไม่มี Router** — การนำทางใช้ state `windows[].isOpen` เท่านั้น
- **ไม่มี Test files**

## MAJOR ARCHITECTURE

- **Framework:** React 19.2.6 + TypeScript 5.9.3 + Vite 7.3.2
- **Styling:** Tailwind CSS 4.1.17 (via `@tailwindcss/vite`)
- **Icons:** `lucide-react` (^1.31.0)
- **Animation library:** `framer-motion` (^13.1.0) — **INSTALLED แต่ไม่มีการ import ในโค้ดใด**
- **Utility:** `clsx` + `tailwind-merge` (via `src/utils/cn.ts`) — **DEAD** (ไม่มี component ใด import ใช้)
- **State Model:** giant App component (802 lines) ยก state ทั้งหมด, ส่งลง component ลูกผ่าน props/callbacks
- **UI Model:** Win32-style floating windows on top of full-screen Canvas map
- **Sound:** Web Audio API สังเคราะห์ 100% (ไม่มีไฟล์เสียง)

## MAJOR MODULES (8 Windows)

| Window ID | หน้าต่าง (Thai Title) | Component File | ค่าเริ่มต้น: เปิด? |
|---|---|---|---|
| `observer` | ผตน. (Forward Observer) | `ForwardObserverWindow.tsx` | ✅ |
| `surveillance` | สำรวจ/แผนที่ | `SurveillanceWindow.tsx` | ✅ |
| `howitzer` | หมู่ปืน | `HowitzerWindow.tsx` | ✅ |
| `fdc` | ศอย. | `FdcWindow.tsx` | ✅ |
| `weapons` | อาวุธ/กระสุน | `WeaponsWindow.tsx` | ✅ |
| `compass` | เข็มทิศ M2 | `CompassWindow.tsx` | ❌ |
| `munitions` | กระสุน 105 | `MunitionsWindow.tsx` | ❌ |
| `console` | ระบบควบคุม | `ControlPanelWindow.tsx` | ✅ |

## MAJOR ROLES / MODES

**VERIFIED ROLES:**
- ไม่มีระบบ role-based auth ที่แท้จริง
- Login เป็นการรับ `operatorId` + `accessKey` แต่ **ไม่ตรวจสอบค่า** — จำลอง Auth ผ่าน `setTimeout(1500)` เท่านั้น (`LoginModal.tsx`)

**MODES ที่พบใน state:**
- `isLoggedIn` (boolean) — สลับหน้า Login ↔ Dashboard
- `forceLockout` (boolean) — Kill Switch mode
- `hideBatteryCoords` (boolean) — "OPSEC" toggle
- `fireMissionActive` (boolean) — โหมดยิง
- `misfireActive` (boolean) — โหมดฉุกเฉินค้างยิง

## MAJOR SHARED TOOLS (Cross-module)

| Tool | Location | ใช้โดย |
|---|---|---|
| `SoundGenerator.ts` (playClick, playBeep, playAlarm, playFireSound, playSplashSound) | `src/components/SoundGenerator.ts` | ทุก component |
| `ballistics.ts` (interpolateBallistics, calculateWindSplitting, calculatePolarPlot, milsToDegrees, GUN_VE_VARIANCES, INITIAL_GUN_POSITIONS) | `src/utils/ballistics.ts` | `FdcWindow`, `ForwardObserverWindow`, `App.tsx` |
| `WindowManager.tsx` (Window component + WindowData type) | `src/components/WindowManager.tsx` | ทุก window ถูก wrap ด้วย `<Window>` ใน `App.tsx` |
| `TacticalMap.tsx` | `src/components/TacticalMap.tsx` | เรนเดอร์เพียงครั้งเดียวใน `App.tsx` เป็นพื้นหลัง |

## MAJOR WORKFLOWS (VERIFIED จาก App.tsx)

1. **Boot → Login → Hydration/Setup → Dashboard**
2. **Create Target** (ผตน. — 3 วิธี: Grid / Polar / Shift)
3. **Adjust Target** (Adjustment arrow pad → mutate `activeTarget`)
4. **Fire Mission** (FDC สั่งยิง → Timer 10Hz → Splash impact)
5. **Misfire Emergency** (30-นาที countdown, 1Hz timer)
6. **Kill Switch** (ล้าง localStorage + indexedDB + state → lockout screen)
7. **Window Manipulation** (drag / resize / minimize / focus)

## KEY RISKS

| Risk | Evidence | Severity |
|---|---|---|
| **Giant God Component** — `App.tsx` มี 802 บรรทัด ถือ state 20+ ตัว | `src/App.tsx:1-802` | HIGH |
| **No State Management library** — ทุกอย่างเป็น `useState` local | `App.tsx` — ไม่มี Context Provider | MEDIUM |
| **Unused Dependencies** — `framer-motion`, `clsx`, `tailwind-merge` ไม่ถูก import | `package.json:12,13,17` vs. grep results | LOW |
| **No Tests** | ไม่พบ `.test.*`, `.spec.*`, หรือ config test | HIGH |
| **No Auth Validation** — Login รับค่าอะไรก็ได้ | `LoginModal.tsx:handleLogin` | HIGH |
| **Mock Data ในไฟล์ต้นทาง** — `CHARGE_5_FIRE_TABLE` เป็น hardcoded 12 rows | `src/utils/ballistics.ts:11-24` | MEDIUM (ตั้งใจให้เป็น mock) |
| **Counter-Battery target มีพิกัดคงที่** — `enemyEasting = 34500, enemyNorthing = 48500` | `HowitzerWindow.tsx` (Crater Analysis) | MEDIUM |
| **`audioVolume` state ไม่ถูกผูกกับ Audio system จริง** | `App.tsx:70` — ใช้เพียงเปลี่ยน emoji 🔊/🔇 | LOW |
| **`gridOffset` ถูกกำหนดจาก Surveillance แต่ไม่ถูกใช้ในการคำนวณใด** | grep: อ่านเพียงใน footer แสดง | MEDIUM |
| **`headingMils` ที่ CompassWindow ปรับ ไม่ถูกส่งไป FDC ในการคำนวณ** | `App.tsx:562-576` FdcWindow ไม่รับ prop `headingMils` | MEDIUM |
| **`fuzeTime`, `supplementaryCharge` ถูกตั้งค่าแต่ไม่ถูกใช้ในการยิง** | `App.tsx` — ไม่ส่งเข้า FDC | MEDIUM |

## KNOWN ARCHITECTURE ANOMALIES

1. **หน้าต่าง "หมู่ปืน" (HowitzerWindow) มี tab "Crater Analysis"** — ตามหลัก workflow ควรอยู่ในหมวด Surveillance/Intelligence แต่ปัจจุบันอยู่ในหมวด "ส่วนยิง" → `CATEGORY_ANOMALY`
2. **การจำลอง "WebSocket"** เป็นแค่ `console log` ในอาร์เรย์ `logs` — ไม่มี WebSocket จริงหรือ network layer
3. **`indexedDB.deleteDatabase()` ถูกเรียก** แต่ **ไม่มีการ `openDB` หรือ write** ที่ใดในโค้ด → เป็นการล้างที่ไม่มีข้อมูล
4. **ปุ่ม "OPSEC" toggle** อยู่ที่ header แต่การพราง (`hideBatteryCoords`) ทำงานเฉพาะบน TacticalMap เท่านั้น ไม่ซ่อนใน FDC หรือ Howitzer window
5. **Desktop icons + Taskbar buttons + Header buttons** ทำงานซ้อนกัน 3 ที่ (Duplicated navigation controls)

## KNOWLEDGE CONFIDENCE SUMMARY

| Aspect | Confidence | Reason |
|---|---|---|
| Component structure | **HIGH** | ทุกไฟล์อ่านเนื้อหาโดยตรง |
| State management | **HIGH** | App.tsx ถูกอ่านครบ 802 บรรทัด |
| Calculation formulas | **HIGH** | `ballistics.ts` มี 155 บรรทัด ครบสูตร |
| Persistence | **HIGH** | localStorage key ตรวจสอบใน 2 จุด (LoginModal + App Kill Switch) |
| Navigation | **HIGH** | ไม่มี router — ทุกจุดใช้ toggleWindow |
| UI behavior | **HIGH** | ทุก window handler ถูก trace ได้ |
| Git history | **UNKNOWN** | ไม่มีเครื่องมือ git ในสภาพแวดล้อม |
| Test coverage | **VERIFIED (0%)** | ไม่มีไฟล์ test เลย |
| Original spec (lithos-hero) | **UNKNOWN** | ไม่พบไฟล์ต้นฉบับใน repository |

## LINKS TO DETAILED DOCUMENTS

| # | File | Focus |
|---|---|---|
| 01 | [01_SYSTEM_OVERVIEW.md](./01_SYSTEM_OVERVIEW.md) | ระบบคืออะไร + ผู้ใช้ + ขอบเขต |
| 02 | [02_REPOSITORY_MAP.md](./02_REPOSITORY_MAP.md) | ไฟล์ tree + purpose |
| 03 | [03_ARCHITECTURE_AS_IS.md](./03_ARCHITECTURE_AS_IS.md) | Architecture diagram |
| 04 | [04_FEATURE_INVENTORY.md](./04_FEATURE_INVENTORY.md) | ⭐ Feature ทุกตัว |
| 05 | [05_FEATURE_TAXONOMY_CURRENT.md](./05_FEATURE_TAXONOMY_CURRENT.md) | หมวดปัจจุบัน + anomaly |
| 06 | [06_USER_WORKFLOWS.md](./06_USER_WORKFLOWS.md) | User journey |
| 07 | [07_UI_SCREEN_INVENTORY.md](./07_UI_SCREEN_INVENTORY.md) | ทุก Screen/Modal/Panel |
| 08 | [08_UI_BEHAVIOR_INVENTORY.md](./08_UI_BEHAVIOR_INVENTORY.md) | Behavior ของทุก control |
| 09 | [09_NAVIGATION_MAP.md](./09_NAVIGATION_MAP.md) | Nav graph |
| 10 | [10_COMPONENT_MAP.md](./10_COMPONENT_MAP.md) | Component tree |
| 11 | [11_STATE_MANAGEMENT.md](./11_STATE_MANAGEMENT.md) | State ทุกตัว |
| 12 | [12_DATA_FLOW.md](./12_DATA_FLOW.md) | Data flow diagrams |
| 13 | [13_BUSINESS_RULES.md](./13_BUSINESS_RULES.md) | Business rule ที่พบ |
| 14 | [14_CALCULATION_ENGINE.md](./14_CALCULATION_ENGINE.md) | ⭐ ทุกสูตรคำนวณ |
| 15 | [15_DATA_MODEL.md](./15_DATA_MODEL.md) | Interfaces/types |
| 16 | [16_STORAGE_PERSISTENCE.md](./16_STORAGE_PERSISTENCE.md) | LocalStorage + IndexedDB |
| 17 | [17_API_INTEGRATIONS.md](./17_API_INTEGRATIONS.md) | API + Browser APIs |
| 18 | [18_MAP_GEO_SYSTEM.md](./18_MAP_GEO_SYSTEM.md) | Canvas map subsystem |
| 19 | [19_DEPENDENCY_MAP.md](./19_DEPENDENCY_MAP.md) | ⭐ Actual usage of deps |
| 20 | [20_DESIGN_SYSTEM_AS_IS.md](./20_DESIGN_SYSTEM_AS_IS.md) | Design tokens |
| 21 | [21_RESPONSIVE_BEHAVIOR.md](./21_RESPONSIVE_BEHAVIOR.md) | Breakpoints |
| 22 | [22_ERROR_VALIDATION_RULES.md](./22_ERROR_VALIDATION_RULES.md) | Validation |
| 23 | [23_SECURITY_MODEL.md](./23_SECURITY_MODEL.md) | Security |
| 24 | [24_TEST_VALIDATION_MAP.md](./24_TEST_VALIDATION_MAP.md) | Tests (none) |
| 25 | [25_BUILD_DEPLOYMENT.md](./25_BUILD_DEPLOYMENT.md) | Build scripts |
| 26 | [26_PROJECT_STATUS_AS_IS.md](./26_PROJECT_STATUS_AS_IS.md) | Status per feature |
| 27 | [27_KNOWN_ISSUES.md](./27_KNOWN_ISSUES.md) | Known issues |
| 28 | [28_TECH_DEBT.md](./28_TECH_DEBT.md) | Tech debt |
| 29 | [29_DEAD_UNUSED_DUPLICATED.md](./29_DEAD_UNUSED_DUPLICATED.md) | Dead code |
| 30 | [30_INTENT_VS_IMPLEMENTATION.md](./30_INTENT_VS_IMPLEMENTATION.md) | Original vs current |
| 31 | [31_ARCHITECTURE_DRIFT.md](./31_ARCHITECTURE_DRIFT.md) | Drift |
| 32 | [32_FEATURE_GAP_ANALYSIS.md](./32_FEATURE_GAP_ANALYSIS.md) | Gaps |
| 33 | [33_EVIDENCE_INDEX.md](./33_EVIDENCE_INDEX.md) | ⭐ Traceability |

## HOW TO USE THIS INTELLIGENCE PACKAGE

**สำหรับ AI Architect ภายนอก:**
1. อ่านไฟล์ 00 (ไฟล์นี้) ก่อน — ได้ mental model ทั้งระบบ
2. เพื่อทำ redesign → อ่าน 04 (Features) + 10 (Components) + 32 (Gaps)
3. เพื่อทำ refactor → อ่าน 27 (Issues) + 28 (Debt) + 31 (Drift) + 29 (Dead)
4. เพื่อ integrate ระบบใหม่ → อ่าน 11 (State) + 12 (Data Flow) + 17 (API)
5. ทุก claim สำคัญ ตรวจสอบได้ที่ 33 (Evidence Index)

## FINAL NOTE

- **ไม่มี production source file ใดถูกแก้ไข** ในภารกิจนี้
- ทุก path ระบุใน document ตรวจสอบได้ในไฟล์จริง
- ข้อสรุปที่มีความเสี่ยงถูกจัดเป็น **INFERRED / UNKNOWN** อย่างชัดเจน
- ไฟล์ทั้ง 34 อยู่ภายใต้ `PROJECT_INTELLIGENCE/` (ไม่แตะโค้ด production)
