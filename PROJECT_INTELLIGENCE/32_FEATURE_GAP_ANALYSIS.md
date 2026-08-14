# 32_FEATURE_GAP_ANALYSIS

## MISSING PLANNED FEATURES

Based on inferred intent (see `30_INTENT_VS_IMPLEMENTATION.md`):

### MP-01: Resection Solver
- Original hint: "Intersection & Resection: Real-time calculators that solve coordinate systems based on double-azimuth intersections OR known strategic monuments" (from prompt)
- **Present:** Intersection only
- **Missing:** Resection variant

### MP-02: Real WebSocket Layer
- Original: real-time communication with server
- **Present:** Nothing
- **Missing:** WebSocket client + protocol

### MP-03: Report/Export
- Original: unclear if planned
- **Present:** Nothing
- **Missing:** PDF/CSV export, print stylesheet

### MP-04: Multi-user / Multi-battery
- Original: unclear
- **Present:** Single-user only
- **Missing:** User table, permissions, session sharing

### MP-05: Offline Queue for FDC
- Hint: `indexedDB.deleteDatabase('fdc_offline_queue')` name
- **Present:** Only the cleanup call (dead)
- **Missing:** Queue write/read/sync logic

### MP-06: Compass → FDC Integration
- Hint: Compass has full N/S sensor + auto +180° logic
- **Present:** State exists but never consumed downstream
- **Missing:** Wire `headingMils` into FDC azimuth calc

### MP-07: Fuze Time → ToF Integration
- Hint: WeaponsWindow tab dedicated to fuze timing
- **Present:** Slider updates state
- **Missing:** Feed `fuzeTime` into fire mission timer or splash logic

### MP-08: Grid Calibration → Coordinate Transform
- Hint: SurveillanceWindow has Slide + Swing sliders
- **Present:** State only
- **Missing:** Apply `gridOffset` to displayed coords or as UTM transform

### MP-09: VT Supp Charge → FIRE Gate
- Hint: MunitionsWindow shows safety warning
- **Present:** Warning card + quick-fix button (visual)
- **Missing:** Include in `isFireSafe` composite gate

### MP-10: Volume Mute (Actual)
- Hint: Tray icon toggles 🔊 ↔ 🔇 + logs event
- **Present:** State toggle only
- **Missing:** Global Web Audio gain control wired to `audioVolume`

### MP-11: Persistent Window Layout
- Hint: users configure window positions
- **Present:** Not persisted
- **Missing:** Save `windows` to localStorage on change; restore on hydrate

### MP-12: Persistent Target List / Session
- **Missing:** targetsList, activeTarget, gunPositions all vanish on refresh

### MP-13: Real Auth
- **Missing:** Any server, hashing, token, OAuth

### MP-14: Deep Linking
- Hint: no router
- **Missing:** URL-based state so links can be shared

### MP-15: Keyboard Shortcuts
- **Missing:** No hotkeys for FIRE, adjust, tab-switch

### MP-16: Notifications (browser)
- **Missing:** No Notification API — splash impact only produces sound + log

### MP-17: Touch/Pointer Handlers
- **Missing:** Mobile drag/pan does not work

### MP-18: Test Suite
- **Missing:** Zero tests

### MP-19: Error Boundary
- **Missing:** No `<ErrorBoundary>` — throw crashes app

### MP-20: Accessibility (aria, focus rings)
- **Missing:** Extensive `focus:outline-none` + no aria-live

---

## PARTIAL FEATURES (Present but incomplete)

| ID | Feature | Missing Part |
|---|---|---|
| F001 | Login | Real auth |
| F008 | Shift Known Point | Rotate to observer axis |
| F011 | Adjustment Pad | Rotate to observer axis |
| F013 | Intersection Solver | Result → target |
| F015 | Grid Calibration | Downstream calc consumer |
| F017 | Crater Analysis | Derive CB coords from vectors |
| F021 | Fuze Logic | `fuzeTime` consumer |
| F024 | Compass | Downstream `headingMils` consumer |
| F026 | Munitions | FIRE gate integration |
| F028 | Simulate Call | Use `calculatePolarPlot` instead of inline |
| F030 | OPSEC Toggle | Header + FDC coord masking |
| F034 | System Tray | Real volume mute |

**Total partial:** 12

---

## STUB FEATURES

| ID | Feature | Nature |
|---|---|---|
| F015 | Grid Calibration | UI complete but no downstream calc reader |

---

## IMPLEMENTED EXTRA FEATURES (Beyond expected/planned)

| Feature | Notes |
|---|---|
| Terrain wireframe animation | Visual polish, not in original scope |
| Desktop shortcuts (icons) | Added as Option B |
| Live system clock (1Hz) | Added as Option B |
| Auto-center on target change | May conflict with user pan |
| Restored coordinates banner (4s auto-hide) | UX polish |

---

## DUPLICATE / OVERLAPPING FEATURES

| Group | Members |
|---|---|
| Window navigation | Header quick-launch + Desktop icons + Taskbar + Start Menu (4×) |
| Simulate Call | ControlPanel button + Start Menu item |
| Kill Switch | ControlPanel button + Start Menu item |

---

## CATEGORY ANOMALIES

Refer to `05_FEATURE_TAXONOMY_CURRENT.md`:
- CA-01: Crater in Howitzer
- CA-02: Compass value isolated
- CA-03: Grid calibration output unused
- CA-04: Fuze time + supp charge not in pipeline
- CA-05: OPSEC partial scope
- CA-06: Redundant 4× navigation
- CA-07: Simulate/Kill in 2 places

---

## FEATURE COMPLETION MATRIX

| Category | Complete | Partial | Stub | Missing (planned) | Total |
|---|---|---|---|---|---|
| observer (ผตน.) | 4 | 2 | 0 | 0 | 6 |
| surveillance | 2 | 1 | 1 | 1 (Resection) | 5 |
| howitzer | 1 | 1 | 0 | 0 | 2 |
| fdc | 3 | 0 | 0 | 3 (compass, fuze, grid integrations) | 6 |
| weapons | 2 | 1 | 0 | 1 (VT gate) | 4 |
| compass | 1 | 1 | 0 | 1 (integrate) | 3 |
| munitions | 0 | 1 | 0 | 0 | 1 |
| console | 1 | 2 | 0 | 0 | 3 |
| Global | 5 | 3 | 0 | 6 (WS, offline, auth, tests, deep link, etc.) | 14 |
| UI Shell | 5 | 1 | 0 | 3 (touch, keyboard, a11y) | 9 |

**Overall completion rate:** 60% COMPLETE + 37.5% PARTIAL + 2.5% STUB (of implemented features)

**With planned-but-missing counted:** significantly lower — see 20+ missing items above.

---

## PRIORITIZED GAPS (for future planning — NOT implemented in this task)

### CRITICAL (safety-related)
- MP-09: VT + Supp charge → FIRE gate integration

### HIGH (feature-integration)
- MP-06: Compass value → FDC
- MP-07: Fuze time → fire mission
- MP-08: Grid Offset → coordinate transform
- Fix F011, F008 rotation to observer axis
- Fix F017 CB pos derivation

### MEDIUM (UX / persistence)
- MP-10: Real volume mute
- MP-11: Persistent window layout
- MP-12: Persistent session
- MP-17: Touch handlers
- Fix F030 scope

### LOW (nice-to-have)
- MP-01: Resection solver
- MP-14: Deep linking
- MP-15: Keyboard shortcuts
- MP-16: Browser notifications
- MP-13: Real auth (if this becomes production)
