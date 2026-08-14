# 01_SYSTEM_OVERVIEW

## WHAT IS THIS SYSTEM

### VERIFIED
- **Web Application แบบ Single-Page Application (SPA)** ที่จำลอง "ศูนย์อำนวยการยิงปืนใหญ่" (Fire Direction Center — FDC)
- **UI Metaphor:** Windows 95/98 (Win32) Desktop OS + Tactical Cyberpunk HUD
- **หน้าต่างลอย 8 ตัว** วางบน full-screen Canvas map
- **ทุก state อยู่ในหน่วยความจำ browser** — ไม่มี server, ไม่มี network calls จริง
- **Build เป็นไฟล์ HTML เดียว** (via `vite-plugin-singlefile`) — deploy โดย copy `dist/index.html` ได้ทันที
- Evidence: `vite.config.ts:6,13`, `src/App.tsx`, `index.html:6`

### INFERRED
- **เจตนา:** ใช้เป็นเดโม/prototype/สื่อการสอนแนวคิด C2 ปืนใหญ่ (105 มม.) ไม่ใช่ระบบใช้จริง
  - เหตุผลอนุมาน: mock data ทั้งหมด, ไม่มี auth จริง, ไม่มี server, ตารางยิงมี 12 rows ไม่ครบ

### UNKNOWN
- **ชื่อโปรเจกต์จริง** — Task prompt เรียกว่า "Wensite / lithos-hero" แต่ไม่พบชื่อนี้ใน `package.json`, `README`, หรือไฟล์ใด
- **เจ้าของโปรเจกต์ / license** — ไม่มี LICENSE file
- **Target audience** — ไม่มีเอกสารระบุ user persona

## PRIMARY USERS

### VERIFIED (จากป้ายใน UI)
- **ผู้ปฏิบัติการ FDC** (Fire Direction Center Operator) — ตัวอย่าง Operator ID เริ่มต้น: `ARTY-FDC-401`
- **สายตรวจการณ์หน้า (ผตน. / Forward Observer)** — โมดูล `observer`
- **หมู่ปืน (Gun Section)** — โมดูล `howitzer`
- **ทหารสำรวจ (Surveyor)** — โมดูล `surveillance`
- **ผู้บังคับบัญชา (Commander)** — เข้าถึง Kill Switch ผ่าน `ControlPanelWindow`

### INFERRED
- ระบบไม่มีการแยก role/permission ในโค้ด — ผู้ใช้เข้าสู่ระบบครั้งเดียวเห็นทุกอย่าง
- ป้ายชื่อ role ในหน้า UI เป็นเพียง **contextual labeling** ไม่มี access control

## PROBLEM DOMAIN

### VERIFIED
- **Fire Direction Computation** สำหรับปืนใหญ่ 105 มม. (Charge 5)
- **Target acquisition** ผ่าน 3 วิธี: Grid / Polar / Shift from Known Point
- **Ballistics calculation:** interpolation จากตารางยิงจำลอง + wind splitting
- **Safety checks:** ICM boundary (600m), Min QE (round-up), Level bubble
- **Emergency procedures:** Misfire hangfire wait (30 minutes)
- **Coordinate systems:** UTM-style Easting/Northing (ตัวเลขเมตร) + Mils (0-6400) สำหรับมุม
- Evidence: `src/utils/ballistics.ts:1-155`

### INFERRED
- **สนธิสัญญา/มาตรฐาน:** อ้างอิงในโค้ดถึง "ทบ.344-202" (Surveillance form) — เป็นแบบฟอร์มกองทัพบกไทย
- **ระบบมิลส์:** 6400 mils/circle — เป็นมาตรฐาน NATO (ไม่ใช่ Soviet 6000)
  - Evidence: `ballistics.ts:107 // 6400 Mils = 360 Degrees`

### UNKNOWN
- ระบบเทียบกับข้อกำหนดจริงของกองทัพใดหรือไม่ — ตารางยิงไม่ระบุแหล่งอ้างอิง
- ค่าคงที่ต่าง ๆ (3.5 m/knot headwind, 0.8 mils/knot crosswind, 0.15 mils/VE) ตรงกับ TM จริงหรือไม่

## PRIMARY WORKFLOW

**Login → Setup/Hydrate → Dashboard → Create Target → Compute → Fire → Impact**

รายละเอียดใน [06_USER_WORKFLOWS.md](./06_USER_WORKFLOWS.md)

## APPLICATION TYPE

| Attribute | Value | Evidence |
|---|---|---|
| Rendering | Client-side rendering (SPA) | `src/main.tsx:6` — `createRoot(...).render(<App/>)` |
| Routing | **None** — ใช้ conditional rendering + state ที่ `App.tsx` | `App.tsx:374-376` (Login gate), `App.tsx:494-660` (window gates) |
| Backend | **None** | ไม่พบ `fetch()`, `axios`, WebSocket API, หรือ any HTTP client |
| Real-time | Local timers (10Hz, 1Hz) ผ่าน `setInterval` | `App.tsx:239,264,270,287` |
| Persistence | LocalStorage + IndexedDB (deletion only) | `LoginModal.tsx`, `App.tsx:302-306` |
| Multi-user | ❌ Single-user, single-tab | ไม่มี cross-tab sync, ไม่มี user list |
| Offline | ✅ ทำงานได้ทั้งหมด offline (ไม่มี network dependency) | ไม่มี fetch calls |

## MAJOR CAPABILITIES (VERIFIED)

1. **Authentication (Mock)** — รับ operatorId + accessKey ตรวจว่าไม่ว่างเท่านั้น
2. **Battery Setup** — ตั้งค่า Easting/Northing/Altitude/SimDir + persist ลง LocalStorage
3. **Hydration** — อ่าน LocalStorage อัตโนมัติเมื่อ login สำเร็จ
4. **Target Acquisition** — 3 วิธี (Grid, Polar, Shift)
5. **Flash-to-Bang Timer** — จับเวลาแล้วคูณ 340 m/s
6. **Mil Formula Calculator** — D = (W × 1000) / M
7. **Target Adjustment** — arrow pad ปรับ E/N/Alt ของ activeTarget
8. **Surveillance Traverse Form** — ตาราง 4 สถานี + closure error calculation
9. **Intersection Solver** — หา coordinate ของ 2 มุมทิศ
10. **Slope-to-Horizontal** — cos/sin projection
11. **Coordinate Calibration** — Slide + Swing sliders (แต่ไม่ได้ใช้ผลใน calc)
12. **M.17 Plotting Board** — ลากปืน 6 กระบอกเพื่อเปลี่ยน offset X/Y
13. **Crater Analysis** — 3 panels + weapon identification จากขนาดหลุม
14. **Ballistics Interpolation** — linear interp จากตาราง 12 rows
15. **Wind Splitting** — เวกเตอร์ headwind/crosswind
16. **Individual Gun Corrections** — ปรับ QE ตาม VE variance + spatial offset
17. **Min QE Calculator** — Math.ceil() safety rule
18. **Fire Execute** — timer 10Hz + parabolic arc animation
19. **Splash Impact** — sound + log event
20. **Fuze Configuration** — Impact/Delay/VT Airburst radio + time slider
21. **ICM Boundary Blocker** — ตรวจ 600m safety zone
22. **Misfire Countdown** — 30-minute timer + SOP display
23. **Munitions Cutaway** — SVG shell diagram + 3D rotation
24. **VT+Supplementary Warning** — safety validation
25. **Console Log Feed** — string array display
26. **Simulate Incoming Call** — mock event trigger
27. **Kill Switch** — wipe LocalStorage + IndexedDB + state
28. **Compass Rotation** — SVG dial ลากได้ + N/S sensor logic
29. **Level Bubble** — ลากได้ + drift < 2px unlock
30. **Window Manipulation** — drag/resize/minimize/focus/maximize
31. **Taskbar / Start Menu / Desktop Icons** — 3 ทาง navigation
32. **OPSEC Toggle** — พรางพิกัดบนแผนที่
33. **System Clock** — Live 1Hz update
34. **Audio Volume Toggle** — เปลี่ยน emoji เท่านั้น (ไม่ผูกกับ Web Audio จริง)

## MAJOR OPERATIONAL MODES

1. **Logged-out mode** — แสดง `LoginModal` เท่านั้น
2. **Setup mode** — แสดง Setup form (ภายใน LoginModal)
3. **Dashboard mode** — แสดงหน้าต่าง 8 ตัว + Taskbar + Map
4. **Fire Mission mode** — timer 10Hz กำลังทำงาน + วาดวิถีบนแผนที่
5. **Misfire mode** — timer 1Hz + กระพริบ + SOP
6. **OPSEC mode** — แผนที่ซ่อนพิกัดฐาน
7. **Lockout mode** — หน้าจอดำหลัง Kill Switch

## INPUTS

| Input Type | Source | Purpose |
|---|---|---|
| Text/Number inputs | User keyboard | Coordinates, ranges, angles, fuze time, wind |
| Mouse click | User | ทุกปุ่มและ toggle |
| Mouse drag | User | Window drag/resize, gun M.17 board, compass, bubble level |
| Radio buttons | User | Fuze type (Impact/Delay/VT) |
| Dropdown | User | Ammo type (HE/APICM/DPICM/ILLUM/SMOKE), known point selection |
| Range sliders | User | Object width, mil angle, wind, slide/swing, bubble X/Y |
| LocalStorage | Browser | Boot-time hydration ของพิกัด battery |

## PROCESSING (VERIFIED)

- **Linear interpolation** จากตารางยิง 12 rows
- **Trigonometric calculations** (sin/cos/atan2) สำหรับ polar, wind, azimuth
- **Vector arithmetic** สำหรับ traverse closure
- **Timer-based state updates** (10Hz fire mission, 1Hz misfire, 1Hz clock)
- **Math.ceil()** สำหรับ Min QE safety rule
- **String template logging** สำหรับ Console events

## OUTPUTS

| Output | Where | Format |
|---|---|---|
| Corrected QE | FDC window | Large number (48px) in mils |
| Corrected Deflection | FDC window | Large number (48px) in mils |
| Time of Flight | FDC window | Seconds with 1 decimal |
| Per-gun QE + Deflection | FDC window (6 cells) | mils per gun |
| Min QE | FDC "MIN QE" tab | Whole number (Math.ceil) |
| Target on map | Canvas | Ring + crosshair + label |
| Parabolic trajectory | Canvas | Orange glowing curve |
| Threat dome | Canvas | Red semi-transparent circle |
| ICM safe boundary | Canvas | Yellow dashed circle (600m) |
| Console log | ControlPanel | Newest-first list of strings |
| Sound feedback | Speakers | Web Audio synthesized |
| LocalStorage entry | Browser | `artyc2_battery_coords` (JSON string) |

## SYSTEM BOUNDARIES

### VERIFIED (ระบบไม่ทำสิ่งเหล่านี้)
- ❌ ไม่ทำ network requests ใด ๆ
- ❌ ไม่มี real-time collaboration (single-tab เท่านั้น)
- ❌ ไม่มี user database
- ❌ ไม่บันทึก log ลง server
- ❌ ไม่ส่ง telemetry
- ❌ ไม่มี notification/push
- ❌ ไม่มี file upload/download
- ❌ ไม่มี export PDF/CSV/report
- ❌ ไม่มี print stylesheet
- ❌ ไม่มี dark/light mode switching (มี dark only)
- ❌ ไม่มี i18n (มี Thai + สั่งการเทคนิคภาษาอังกฤษ, ไม่มี switch)
- ❌ ไม่รองรับ keyboard shortcut (นอกจาก native browser)
- ❌ ไม่มี drag-and-drop ไฟล์
- ❌ ไม่เข้ารหัส LocalStorage
- ❌ ไม่มี geolocation API usage
- ❌ ไม่มี device orientation API usage (ที่อ้างถึงใน prompt แต่ไม่พบใน code)

## CONFIDENCE SUMMARY

| Claim | Confidence |
|---|---|
| System is SPA + Win32 metaphor | **VERIFIED** |
| No real backend | **VERIFIED** (grep ไม่พบ fetch/axios/websocket) |
| Single-user | **VERIFIED** (ไม่มี user table) |
| No i18n | **VERIFIED** (ไม่มี react-i18next, ข้อความ hardcoded) |
| No a11y focus | **INFERRED** (ไม่พบ aria-* ที่ครอบคลุม) |
| Target audience is demo/training | **INFERRED** |
| Compliance กับมาตรฐานทหารจริง | **UNKNOWN** |
