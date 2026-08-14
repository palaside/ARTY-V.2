# 07_UI_SCREEN_INVENTORY

## OVERVIEW

Repository contains **1 physical HTML page** (`index.html`) but the SPA presents multiple logical "screens" via conditional rendering.

## SCREENS / VIEWS / MODALS / OVERLAYS

### UI-01: Login Screen
- **UI_ID:** UI-01
- **NAME:** Login Modal
- **TYPE:** Full-screen modal (fixed inset-0, z-50)
- **OPENED_FROM:** App boot when `!isLoggedIn && !forceLockout`
- **CLOSED_BY:** Successful login (Setup submit OR Hydration)
- **MAIN_COMPONENT:** `LoginModal.tsx`
- **CHILD_COMPONENTS:** None (self-contained)
- **PRIMARY_ACTION:** "เชื่อมต่อความปลอดภัย" button
- **SECONDARY_ACTION:** Toggle password visibility (Eye icon)
- **CURRENT_LAYOUT:** Center card `max-w-lg`, black tactical-grid background with scanlines
- **MOBILE_LAYOUT:** UNKNOWN — no viewport-specific CSS observed
- **STATE_DEPENDENCY:** `isLoggedIn`, `forceLockout`
- **EVIDENCE:** `LoginModal.tsx:85-244`, `App.tsx:373-376`

### UI-02: Setup Screen (embedded in Login)
- **UI_ID:** UI-02
- **NAME:** Battery Setup Form
- **TYPE:** Modal (replaces LoginModal body when `showSetup=true`)
- **OPENED_FROM:** Login mock-auth completes with no LocalStorage
- **CLOSED_BY:** Setup submit (writes to LocalStorage)
- **MAIN_COMPONENT:** `LoginModal.tsx` (Setup form section)
- **PRIMARY_ACTION:** "เข้าสู่ศูนย์บัญชาการ" button
- **CURRENT_LAYOUT:** 2×2 grid of inputs + button
- **STATE_DEPENDENCY:** `showSetup`, local {easting, northing, altitude, simDir}
- **EVIDENCE:** `LoginModal.tsx:195-243`

### UI-03: Restored Coordinates Banner
- **UI_ID:** UI-03
- **NAME:** Green "กู้คืน..." Banner
- **TYPE:** Toast (absolute top-14, z-50, auto-hide 4s)
- **OPENED_FROM:** Hydration path (`data.restored === true`)
- **CLOSED_BY:** `setTimeout(4000)` auto-hide
- **MAIN_COMPONENT:** Inline in `App.tsx:393-401`
- **CURRENT_LAYOUT:** Centered horizontally near top; animate-bounce
- **STATE_DEPENDENCY:** `showRestoredBanner`
- **EVIDENCE:** `App.tsx:393-401`

### UI-04: Dashboard Shell
- **UI_ID:** UI-04
- **NAME:** Main Dashboard
- **TYPE:** Root view (fills viewport when logged in and not locked out)
- **OPENED_FROM:** Successful Login
- **CLOSED_BY:** Kill Switch → Lockout
- **MAIN_COMPONENT:** `App.tsx:378-800` root `<div>`
- **CHILD_COMPONENTS:** TacticalMap, Header, Main (windows + desktop icons), Start Menu (conditional), Footer taskbar
- **CURRENT_LAYOUT:** `w-screen h-screen overflow-hidden`, header h-12, footer h-12, main fills middle
- **MOBILE_LAYOUT:** UNKNOWN — some `hidden sm:flex` and `hidden lg:block` observed in taskbar but general layout not responsive
- **EVIDENCE:** `App.tsx:378-800`

### UI-05: Tactical Map (Background)
- **UI_ID:** UI-05
- **NAME:** Full-screen Canvas Map
- **TYPE:** Persistent panel (base layer, z-0)
- **OPENED_FROM:** Always rendered in Dashboard
- **CLOSED_BY:** N/A (persistent)
- **MAIN_COMPONENT:** `TacticalMap.tsx`
- **INTERNAL WIDGETS:** Compass indicator (top-right, z-40), Zoom controls (bottom-right, z-40), Legend (bottom-left, z-40)
- **STATE_DEPENDENCY:** batteryCoords, friendlyCoords, activeTarget, targetsList, gunPositions, fireMissionActive, fireMissionProgress, selectedAmmuType, hideBatteryCoords
- **EVIDENCE:** `App.tsx:381-391`, `TacticalMap.tsx`

### UI-06: Top Header Bar
- **UI_ID:** UI-06
- **NAME:** Header
- **TYPE:** Persistent bar (absolute top-0, h-12, z-40)
- **CONTENTS:** Terminal icon + Title + operatorId/coords + Quick-launch buttons (8) + OPSEC toggle
- **EVIDENCE:** `App.tsx:404-462`

### UI-07: Footer Taskbar
- **UI_ID:** UI-07
- **NAME:** Win32 Classic Taskbar
- **TYPE:** Persistent bar (absolute bottom-0, h-12, z-40)
- **CONTENTS:** Start button + Task buttons (8) + System tray (grid offset + volume + clock)
- **EVIDENCE:** `App.tsx:720-798`

### UI-08: Start Menu
- **UI_ID:** UI-08
- **NAME:** Start Menu Overlay
- **TYPE:** Popup (absolute bottom-12, z-50)
- **OPENED_FROM:** Click Start button
- **CLOSED_BY:** Click any item OR click Start again OR (no outside-click close observed)
- **CONTENTS:** Vertical strip label "C2_OS_98_GEN" + 8 programs + 2 utilities
- **⚠️ ISSUE:** No click-outside-to-close handler
- **EVIDENCE:** `App.tsx:664-717`

### UI-09: Desktop Icons Panel
- **UI_ID:** UI-09
- **NAME:** Desktop Shortcuts (Emoji)
- **TYPE:** Panel (absolute top-16 left-6, z-10)
- **CONTENTS:** 8 emoji shortcuts with Thai labels
- **INTERACTION:** double-click open + beep; single click beep only
- **EVIDENCE:** `App.tsx:468-491`

### UI-10: Window — Forward Observer (ผตน.)
- **UI_ID:** UI-10
- **TYPE:** Floating window (draggable, resizable, minimizable, closable, maximizable)
- **DEFAULT_POS:** (40, 80) — 420×480
- **OPENED_FROM:** Header btn / Taskbar / Desktop icon / Start Menu
- **CLOSED_BY:** Close X in title bar
- **MAIN_COMPONENT:** `ForwardObserverWindow.tsx`
- **TABS:** Grid / Polar / Shift
- **INNER PANELS:** Target Entry tabs, Flash-to-Bang card, Mil Formula card, Adjustment pad
- **EVIDENCE:** `App.tsx:105,494-512`

### UI-11: Window — Surveillance
- **UI_ID:** UI-11
- **DEFAULT_POS:** (480, 80) — 400×460
- **MAIN_COMPONENT:** `SurveillanceWindow.tsx`
- **TABS:** ทบ.344-202 / จุดตัด / เอียง-ราบ / ปรับเทียบ
- **EVIDENCE:** `App.tsx:106,515-529`

### UI-12: Window — Howitzer
- **UI_ID:** UI-12
- **DEFAULT_POS:** (900, 80) — 420×460
- **MAIN_COMPONENT:** `HowitzerWindow.tsx`
- **TABS:** กระดานพล็อต M.17 / วิเคราะห์หลุมกระสุน
- **EVIDENCE:** `App.tsx:107,532-548`

### UI-13: Window — FDC (ศอย.)
- **UI_ID:** UI-13
- **DEFAULT_POS:** (200, 300) — 450×500
- **MAIN_COMPONENT:** `FdcWindow.tsx`
- **TABS:** เอนจินวิถีกระสุน / เครื่องคิด Min QE
- **PROMINENT UI:** Corrected QE + Deflection at 48px (JetBrains Mono) — the largest readouts in the app
- **EVIDENCE:** `App.tsx:108,551-577`

### UI-14: Window — Weapons
- **UI_ID:** UI-14
- **DEFAULT_POS:** (670, 300) — 400×460
- **MAIN_COMPONENT:** `WeaponsWindow.tsx`
- **TABS:** ตรรกะหัวชนวน / ขอบเขต ICM / เตือนค้างยิง
- **EVIDENCE:** `App.tsx:109,580-603`

### UI-15: Window — Compass M.2
- **UI_ID:** UI-15
- **DEFAULT_POS:** (1090, 250) — 340×480
- **DEFAULT_OPEN:** ❌ (starts closed)
- **MAIN_COMPONENT:** `CompassWindow.tsx`
- **INNER:** SVG compass + bubble level vial + 2 sliders + auto-stabilize button
- **EVIDENCE:** `App.tsx:110,606-622`

### UI-16: Window — Munitions Cutaway
- **UI_ID:** UI-16
- **DEFAULT_POS:** (1100, 300) — 360×480
- **DEFAULT_OPEN:** ❌
- **MAIN_COMPONENT:** `MunitionsWindow.tsx`
- **INNER:** SVG shell cutaway (6 parts) + 3D rotate button + supp charge checkbox
- **EVIDENCE:** `App.tsx:111,625-640`

### UI-17: Window — Console (ระบบควบคุม)
- **UI_ID:** UI-17
- **DEFAULT_POS:** (740, 200) — 380×420
- **MAIN_COMPONENT:** `ControlPanelWindow.tsx`
- **INNER:** Log feed (h-44 scroll) + clear btn + 2 sim buttons + Kill Switch section
- **EVIDENCE:** `App.tsx:112,643-660`

### UI-18: Confirm Dialog (Kill Switch)
- **UI_ID:** UI-18
- **NAME:** Native browser confirm
- **TYPE:** Native `window.confirm()` — browser-managed dialog
- **OPENED_FROM:** Kill Switch button
- **STYLING:** Native, non-customizable
- **EVIDENCE:** `ControlPanelWindow.tsx:29`

### UI-19: Lockout Screen
- **UI_ID:** UI-19
- **NAME:** Security Terminal Deactivated
- **TYPE:** Full-screen (fixed inset-0, z-50)
- **OPENED_FROM:** Kill Switch confirmed
- **CLOSED_BY:** Click "เชื่อมต่อใหม่" → sets `forceLockout=false`
- **MAIN_COMPONENT:** Inline in `App.tsx:346-371`
- **EVIDENCE:** `App.tsx:346-371`

### UI-20..UI-27: Sub-tabs (within Windows)

| UI_ID | Location | Tabs |
|---|---|---|
| UI-20 | ForwardObserver | grid / polar / shift |
| UI-21 | Surveillance | traverse / intersection / slope / calibration |
| UI-22 | Howitzer | m17 / crater |
| UI-23 | FDC | ballistics / minqe |
| UI-24 | Weapons | fuze / icm / misfire |
| UI-25 | Compass | (single view — no tabs) |
| UI-26 | Munitions | (single view — no tabs) |
| UI-27 | Console | (single view — no tabs) |

## LAYERING SUMMARY (Z-INDEX)

```
z-50: LoginModal, Lockout, StartMenu (open), Restored Banner
z-40: Header, Footer, In-map widgets (Compass/Zoom/Legend)
z-10: Desktop Icons
z-1..N: Floating Windows (dynamic; max+1 on focus)
z-0:  TacticalMap Canvas (base)
```

## MOBILE LAYOUT NOTES

- **VERIFIED responsive classes found:**
  - `hidden sm:flex` — Taskbar tasks hidden below 640px (`App.tsx:742`)
  - `hidden lg:block` — Grid offset display hidden below 1024px (`App.tsx:776`)
- **NOT responsive:**
  - Windows are absolutely positioned in pixels — they will overflow on small screens
  - Login form uses `max-w-lg` but no viewport testing observed
  - Canvas map fills viewport but touch/pinch gestures not implemented (only mouse `mousedown`/`mousemove`/`mouseup`)
- **VERIFIED gap:** No `touch`/`pointer` event handlers found in drag/resize code — mobile drag likely broken
- **CONFIDENCE:** VERIFIED (behavior); INFERRED (mobile usability)
