# 10_COMPONENT_MAP

## COMPONENT TREE (Render hierarchy)

```
<StrictMode>                             (main.tsx)
└── <App>                                (App.tsx)
    ├── (if forceLockout) Lockout div
    ├── (if !isLoggedIn) <LoginModal>
    │   └── (native form + inputs)
    └── (Dashboard branch)
        ├── <TacticalMap>                (background z-0)
        │   └── <canvas>                 (Canvas 2D API)
        │       + overlay <div>s (compass widget, zoom controls, legend)
        ├── (Restored Banner div)        (transient z-50)
        ├── <header>                     (z-40)
        │   ├── Title block
        │   ├── Quick-launch buttons (8x)
        │   └── OPSEC toggle button
        ├── <main>                       (window container)
        │   ├── Desktop icons panel (8x buttons)
        │   ├── <Window id="observer"> → <ForwardObserverWindow>
        │   ├── <Window id="surveillance"> → <SurveillanceWindow>
        │   ├── <Window id="howitzer"> → <HowitzerWindow>
        │   ├── <Window id="fdc"> → <FdcWindow>
        │   ├── <Window id="weapons"> → <WeaponsWindow>
        │   ├── <Window id="compass"> → <CompassWindow>
        │   ├── <Window id="munitions"> → <MunitionsWindow>
        │   └── <Window id="console"> → <ControlPanelWindow>
        ├── (Start Menu overlay)         (conditional z-50)
        └── <footer>                     (z-40)
            ├── Start button
            ├── Task buttons (8x)
            └── System tray (grid offset + volume + clock)
```

## COMPONENT DETAILS

### App
- **COMPONENT:** `App`
- **PATH:** `src/App.tsx`
- **TYPE:** Root functional component (default export)
- **PARENT:** `main.tsx` (StrictMode)
- **CHILDREN:** LoginModal, TacticalMap, Window (×8), inline overlays
- **PROPS:** none
- **STATE:** ~20 useState hooks (see `11_STATE_MANAGEMENT.md`)
- **CONTEXT:** none (no consumer or provider)
- **HOOKS:** `useState`, `useEffect` (×3 timers)
- **UTILITIES:** `playClick`, `playBeep`, `playSplashSound`, `playAlarm`, `INITIAL_GUN_POSITIONS`, `GunPosition`
- **SIDE_EFFECTS:** localStorage.clear, indexedDB.deleteDatabase, Web Audio, timers
- **FEATURES:** F001-F005 (partial orchestration), F020 (fire timer), F023 (misfire timer), F028, F029, F031-F037
- **EVIDENCE:** `App.tsx:1-802`

### LoginModal
- **PATH:** `src/components/LoginModal.tsx`
- **TYPE:** Functional component
- **PARENT:** App
- **CHILDREN:** none
- **PROPS:** `onSuccess: (data: {operatorId, batteryCoords, restored}) => void`
- **STATE (local):** operatorId, accessKey, showKey, isAuthenticating, showSetup, error, easting, northing, altitude, simDir
- **HOOKS:** `useState`
- **UTILITIES:** `playClick`, `playBeep`, localStorage.getItem/setItem
- **FEATURES:** F001 (Login), F002 (Hydration), F003 (Setup)
- **EVIDENCE:** `LoginModal.tsx:1-244`

### TacticalMap
- **PATH:** `src/components/TacticalMap.tsx`
- **TYPE:** Functional component
- **PARENT:** App
- **PROPS:** batteryCoords, friendlyCoords, activeTarget, targetsList, gunPositions, fireMissionActive, fireMissionProgress, selectedAmmuType, hideBatteryCoords
- **STATE (local):** zoom, panOffset, isPanning, terrainAngle
- **HOOKS:** `useState`, `useEffect`, `useRef` (canvasRef)
- **UTILITIES:** `milsToDegrees` (from ballistics), `playClick`, Canvas 2D API, requestAnimationFrame
- **FEATURES:** F005 (map), F039 (terrain wireframe), F040 (pan/zoom), part of F020 (trajectory rendering), F030 (OPSEC mask)
- **EVIDENCE:** `TacticalMap.tsx`

### WindowManager (Window)
- **PATH:** `src/components/WindowManager.tsx`
- **TYPE:** Functional component + type export
- **PARENT:** App (used 8×)
- **CHILDREN:** any React node passed as children
- **PROPS:** win: WindowData, onFocus, onClose, onMinimize, onUpdatePosition, onUpdateSize, children
- **STATE (local):** isMaximized, preMaxState, drag refs, resize refs
- **HOOKS:** `useState`, `useRef`, `useEffect`
- **UTILITIES:** `playClick`, lucide icons (Minus, Square, X, Move)
- **FEATURES:** F004 (window system)
- **EVIDENCE:** `WindowManager.tsx:1-241`

### ForwardObserverWindow
- **PATH:** `src/components/ForwardObserverWindow.tsx`
- **PARENT:** wrapped in Window
- **PROPS:** targetsList, activeTarget, onSetTarget, onAddTarget, onLogEvent, batteryCoords
- **STATE (local):** activeTab, gridE/N/H, targetName, foE/N, polarAzimuth, polarDistance, shiftFromId, lateralShift/rangeShift/altitudeShift, timerRunning, timerSeconds, objectWidth, milAngle
- **HOOKS:** `useState`, `useEffect`, `useRef` (timer)
- **UTILITIES:** `playClick`, `playBeep`, `calculatePolarPlot`, lucide icons
- **FEATURES:** F006-F011
- **EVIDENCE:** `ForwardObserverWindow.tsx:1-554`

### SurveillanceWindow
- **PATH:** `src/components/SurveillanceWindow.tsx`
- **PROPS:** onLogEvent, onUpdateGridOffset
- **STATE (local):** activeTab, stations[], stationAE/AN/BE/BN, bearingA/B, slopeDistance, inclinometerAngle, slideX/Y, swing
- **UTILITIES:** `playClick`, `playBeep`
- **FEATURES:** F012-F015
- **EVIDENCE:** `SurveillanceWindow.tsx`

### HowitzerWindow
- **PATH:** `src/components/HowitzerWindow.tsx`
- **PROPS:** gunPositions, onUpdateGuns, onLogEvent, onAddTarget
- **STATE (local):** activeTab, splashDir, craterWidth, plumbBobAngle, windDir, draggedGunId
- **HOOKS:** `useState`, `useRef` (boardRef), `useEffect` (global mouseup)
- **UTILITIES:** `playClick`, `playBeep`
- **FEATURES:** F016 (M.17 board), F017 (crater analysis)
- **EVIDENCE:** `HowitzerWindow.tsx`

### FdcWindow
- **PATH:** `src/components/FdcWindow.tsx`
- **PROPS:** batteryCoords, activeTarget, gunPositions, onLogEvent, onFireExecute, fireMissionActive, fireMissionTimeLeft, levelIsCentered, icmSafe
- **STATE (local):** activeTab, targetRange, firingAzimuth, windSpeed, windDirection, crestHeight, crestDistance, pieceToCrestSlope
- **HOOKS:** `useState`, `useEffect` (auto-sync target)
- **UTILITIES:** `playClick`, `playBeep`, `playFireSound`, `interpolateBallistics`, `calculateWindSplitting`, `GUN_VE_VARIANCES`
- **FEATURES:** F018 (ballistics), F019 (Min QE), F020 (fire button)
- **EVIDENCE:** `FdcWindow.tsx`

### WeaponsWindow
- **PATH:** `src/components/WeaponsWindow.tsx`
- **PROPS:** ammuType, onAmmuTypeChange, fuzeType, onFuzeTypeChange, fuzeTime, onFuzeTimeChange, misfireActive, onMisfireToggle, misfireTimeLeft, onLogEvent, friendlyDistance
- **STATE (local):** activeTab
- **UTILITIES:** `playClick`, `playAlarm`
- **FEATURES:** F021, F022, F023
- **EVIDENCE:** `WeaponsWindow.tsx`

### CompassWindow
- **PATH:** `src/components/CompassWindow.tsx`
- **PROPS:** headingMils, onHeadingChange, bubbleOffset, onBubbleChange
- **STATE (local):** isDraggingCompass, isDraggingBubble
- **HOOKS:** `useState`, `useRef` (compassRef, bubbleVialRef), `useEffect` (global mouse listeners)
- **UTILITIES:** `playClick`, `playBeep`
- **FEATURES:** F024, F025
- **EVIDENCE:** `CompassWindow.tsx`

### MunitionsWindow
- **PATH:** `src/components/MunitionsWindow.tsx`
- **PROPS:** fuzeType, supplementaryCharge, onSupplementaryChargeToggle
- **STATE (local):** rotation
- **UTILITIES:** `playClick`, `playBeep`
- **FEATURES:** F026
- **EVIDENCE:** `MunitionsWindow.tsx`

### ControlPanelWindow
- **PATH:** `src/components/ControlPanelWindow.tsx`
- **PROPS:** logs, onLogEvent, onClearLogs, onKillSwitch, onSimulateIncomingCall
- **STATE (local):** none
- **UTILITIES:** `playClick`, `playBeep`, `window.confirm`
- **FEATURES:** F027, F028 (delegate to App), F029 (delegate to App)
- **EVIDENCE:** `ControlPanelWindow.tsx`

## DEPENDENCY TREE (Import graph)

```
main.tsx
  ├── index.css
  └── App
      ├── react (useState, useEffect)
      ├── lucide-react (Terminal, Eye, EyeOff, LayoutGrid, CheckCircle2, ShieldAlert)
      ├── WindowManager  (Window, WindowData)
      ├── TacticalMap
      ├── LoginModal
      ├── ForwardObserverWindow
      ├── SurveillanceWindow
      ├── HowitzerWindow
      ├── FdcWindow
      ├── WeaponsWindow
      ├── CompassWindow
      ├── MunitionsWindow
      ├── ControlPanelWindow
      ├── SoundGenerator (playClick, playBeep, playSplashSound, playAlarm)
      └── utils/ballistics (INITIAL_GUN_POSITIONS, GunPosition)

WindowManager
  ├── react
  ├── lucide-react (Minus, Square, X, Move)
  └── SoundGenerator (playClick)

TacticalMap
  ├── react
  ├── lucide-react (Compass, ZoomIn, ZoomOut)
  └── SoundGenerator (playClick)
      -- also uses helper milsToDegrees defined locally at file bottom
      -- (does NOT import from utils/ballistics; there is a helper `milsToDegrees`
         at end of file — grep-verify against duplicate)

LoginModal
  ├── react
  ├── lucide-react (Lock, ShieldAlert, Terminal, Eye, Navigation)
  └── SoundGenerator (playClick, playBeep)

ForwardObserverWindow
  ├── react
  ├── lucide-react (Target, Timer, Compass, CornerRightDown, ArrowUp/Down/Left/Right, ShieldAlert, Sliders)
  ├── SoundGenerator (playClick, playBeep)
  └── utils/ballistics (calculatePolarPlot)

SurveillanceWindow
  ├── react
  ├── lucide-react (Table, Layers, AlertTriangle, ShieldCheck, RefreshCw)
  └── SoundGenerator (playClick, playBeep)

HowitzerWindow
  ├── react
  ├── lucide-react (ShieldAlert, Crosshair, AlertTriangle, ShieldCheck)
  └── SoundGenerator (playClick, playBeep)

FdcWindow
  ├── react
  ├── lucide-react (Calculator, Shield, Wind, Check, Play, Square, Activity)
  ├── SoundGenerator (playClick, playBeep, playFireSound)
  └── utils/ballistics (interpolateBallistics, calculateWindSplitting, GUN_VE_VARIANCES)

WeaponsWindow
  ├── react
  ├── lucide-react (ShieldAlert, AlertTriangle, ShieldCheck, Flame)
  └── SoundGenerator (playClick, playAlarm)

CompassWindow
  ├── react
  ├── lucide-react (Compass, AlertTriangle, ShieldCheck)
  └── SoundGenerator (playClick, playBeep)

MunitionsWindow
  ├── react
  ├── lucide-react (ShieldAlert, RefreshCw, Layers, CheckCircle2)
  └── SoundGenerator (playClick, playBeep)

ControlPanelWindow
  ├── react
  ├── lucide-react (Terminal, ShieldAlert, Wifi, Trash2, Send)
  └── SoundGenerator (playClick, playBeep)

utils/ballistics
  └── (no imports — pure module)

utils/cn
  ├── clsx (⚠️ IMPORTED here only, but cn.ts itself has ZERO importers)
  └── tailwind-merge
```

## COMPONENT REUSE

- `<Window>` reused 8 times (only shell reuse in codebase)
- All *Window components used exactly once each
- No shared UI atoms (no Button, Input, Card component library)
- Each window duplicates its own input/button/tab styling → inconsistent design (see `20_DESIGN_SYSTEM_AS_IS.md`)

## CIRCULAR / INDIRECT DEPENDENCIES

**VERIFIED:** None found. Dependency graph is a strict DAG.
