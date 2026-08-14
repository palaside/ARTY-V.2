# 11_STATE_MANAGEMENT

## STATE ARCHITECTURE (AS-IS)

**VERIFIED:**
- **No** React Context (`grep createContext src/` = 0 results)
- **No** state management library (no Zustand/Redux/Jotai/Recoil/MobX in deps)
- **No** custom hooks folder
- **Pattern:** lifted state in `App.tsx` + local `useState` per component + prop drilling

## APP-LEVEL STATE (all in `src/App.tsx`)

### Session / Auth

| STATE_NAME | LINE | TYPE | INITIAL_VALUE | UPDATED_BY | READ_BY | SIDE_EFFECT | PERSISTED |
|---|---|---|---|---|---|---|---|
| `isLoggedIn` | 19 | boolean | `false` | `handleLoginSuccess`, `handleKillSwitch` | Layer-1 branch | View branch selection | No |
| `operatorId` | 20 | string | `''` | `handleLoginSuccess`, `handleKillSwitch` | Header display | Header render | No |
| `batteryCoords` | 21 | `{easting, northing, altitude, simDir}` | `{32000,45000,120,1600}` | `handleLoginSuccess` | TacticalMap, FdcWindow, Header, ForwardObserverWindow | Recompute range/azimuth | **YES** (localStorage) |
| `showRestoredBanner` | 22 | boolean | `false` | `handleLoginSuccess` (hydration branch), setTimeout(4000) | Banner conditional | Transient visual | No |
| `forceLockout` | 23 | boolean | `false` | `handleKillSwitch`, Re-Authorize btn | Layer-1 branch | View branch | No |

### Domain Data

| STATE_NAME | LINE | TYPE | INITIAL | UPDATED_BY | READ_BY | PERSISTED |
|---|---|---|---|---|---|---|
| `targetsList` | 29 | `Array<Target>` | 2 seeded targets (T-01, T-02) | `handleAddTarget`, `handleSetTarget`, Kill Switch | TacticalMap, ForwardObserverWindow (dropdown) | No |
| `activeTarget` | 33 | `Target \| null` | `T-01` seed | `handleSetTarget`, adjustment pad, Kill Switch, simulate call | TacticalMap, FdcWindow, WeaponsWindow (via friendlyDist derived), auto-sync effect | No |
| `gunPositions` | 42 | `GunPosition[]` | `INITIAL_GUN_POSITIONS` (6 items) | `HowitzerWindow.onUpdateGuns` (drag) | TacticalMap, FdcWindow | No |

### Calibration / Configuration

| STATE_NAME | LINE | TYPE | INITIAL | UPDATED_BY | READ_BY | NOTES |
|---|---|---|---|---|---|---|
| `headingMils` | 45 | number (mils) | 1600 | `CompassWindow.onHeadingChange`, `handleLoginSuccess` (from simDir) | CompassWindow (round-trip) ONLY | **⚠️ Isolated — no downstream calc** |
| `bubbleOffset` | 46 | `{x,y}` | `{0,0}` | `CompassWindow.onBubbleChange` | derived `levelIsCentered` → FdcWindow prop | Gates FIRE button |
| `gridOffset` | 47 | `{slideX, slideY, swing}` | `{0,0,0}` | `SurveillanceWindow.onUpdateGridOffset` | Footer display ONLY | **⚠️ STUB — not used in calc** |

### Munitions

| STATE_NAME | LINE | TYPE | INITIAL | UPDATED_BY | READ_BY |
|---|---|---|---|---|---|
| `ammuType` | 50 | string | `'HE'` | WeaponsWindow dropdown | derived `isIcmAmmo`, `icmSafe` → FdcWindow prop; TacticalMap (shell label) |
| `fuzeType` | 51 | string | `'Impact'` | WeaponsWindow radio | MunitionsWindow (VT warning) |
| `fuzeTime` | 52 | number (s) | `25.0` | WeaponsWindow slider | **⚠️ Not consumed** (dial visual only) |
| `supplementaryCharge` | 53 | boolean | `true` | MunitionsWindow toggle/quick-fix | MunitionsWindow (visual + warning) only |

### Fire Mission State Machine

| STATE_NAME | LINE | TYPE | INITIAL | UPDATED_BY | READ_BY |
|---|---|---|---|---|---|
| `fireMissionActive` | 56 | boolean | `false` | `onFireExecute`, 10Hz timer (on 0) | TacticalMap, FdcWindow, misfire display, timer effect guard |
| `fireMissionToF` | 57 | number | `0` | `onFireExecute` | 10Hz timer (progress calc) |
| `fireMissionProgress` | 58 | number 0-1 | `0` | 10Hz timer | TacticalMap (trajectory position) |
| `fireMissionTimeLeft` | 59 | number | `0` | 10Hz timer | FdcWindow button text |

### Emergency

| STATE_NAME | LINE | TYPE | INITIAL | UPDATED_BY | READ_BY |
|---|---|---|---|---|---|
| `misfireActive` | 62 | boolean | `false` | `WeaponsWindow.onMisfireToggle` | 1Hz timer, WeaponsWindow display |
| `misfireTimeLeft` | 63 | number (sec) | `1800` (30min) | 1Hz timer | WeaponsWindow display |

### UI Shell

| STATE_NAME | LINE | TYPE | INITIAL | UPDATED_BY | READ_BY |
|---|---|---|---|---|---|
| `hideBatteryCoords` | 66 | boolean | `false` | Header OPSEC button | TacticalMap prop |
| `isStartMenuOpen` | 69 | boolean | `false` | Start button, menu items | Start Menu conditional render |
| `audioVolume` | 70 | boolean | `true` | Tray icon click | Tray icon display, log message (**⚠️ NOT actually used to mute audio**) |
| `systemTime` | 71 | string | `''` | 1Hz clock effect (line 74-82) | Tray display |
| `logs` | 97 | `string[]` (max 50) | 3 seed logs | `addLogEvent` (from every module), `handleClearLogs`, Kill Switch | ControlPanelWindow display |
| `windows` | 104 | `WindowData[]` (8 items) | seeded static array | Focus/close/minimize/maximize/resize/drag handlers | Every window render + header/desktop/taskbar/start menu |

**Total useState hooks in App.tsx:** 20

## DERIVED STATE (Not stored, computed each render)

| DERIVED | LINE | FROM | USED_BY |
|---|---|---|---|
| `friendlyDist` | 339 | `activeTarget`, `friendlyCoords` (const) | `icmSafe`, WeaponsWindow prop |
| `levelIsCentered` | 342 | `bubbleOffset.x`, `bubbleOffset.y` | FdcWindow prop |
| `isIcmAmmo` | 343 | `ammuType` | `icmSafe` |
| `icmSafe` | 344 | `isIcmAmmo`, `friendlyDist` | FdcWindow prop |

**In FdcWindow (per-render):**
- `qe`, `tof`, `interpError` (from `interpolateBallistics(targetRange)`)
- `headwind`, `crosswind`, `rangeCorrection`, `deflectionCorrection` (from `calculateWindSplitting`)
- `correctedRange`, `correctedQE`
- `finalDeflection` (= 3200 + correction)
- `rawMinQE`, `finalMinQE` (Math.ceil)
- `isFireSafe` (composite gate)

## COMPONENT-LOCAL STATE INVENTORY

### LoginModal (10 useState)
`operatorId`, `accessKey`, `showKey`, `isAuthenticating`, `showSetup`, `error`, `easting`, `northing`, `altitude`, `simDir`

### TacticalMap (4 useState + 1 useRef)
`zoom`, `panOffset`, `isPanning`, `terrainAngle`, canvasRef

### WindowManager (2 useState + 4 useRef)
`isMaximized`, `preMaxState`, windowRef, titleBarRef, dragStart, resizeStart

### ForwardObserverWindow (14 useState + 1 useRef)
`activeTab`, `gridE`, `gridN`, `gridH`, `targetName`, `foE`, `foN`, `polarAzimuth`, `polarDistance`, `shiftFromId`, `lateralShift`, `rangeShift`, `altitudeShift`, `timerRunning`, `timerSeconds`, `objectWidth`, `milAngle`, timerRef

### SurveillanceWindow (~10 useState)
`activeTab`, `stations[]`, `stationAE`, `stationAN`, `bearingA`, `stationBE`, `stationBN`, `bearingB`, `slopeDistance`, `inclinometerAngle`, `slideX`, `slideY`, `swing`

### HowitzerWindow (5 useState + 1 useRef)
`activeTab`, `splashDir`, `craterWidth`, `plumbBobAngle`, `windDir`, `draggedGunId`, boardRef

### FdcWindow (6 useState)
`activeTab`, `targetRange`, `firingAzimuth`, `windSpeed`, `windDirection`, `crestHeight`, `crestDistance`, `pieceToCrestSlope`

### WeaponsWindow (1 useState)
`activeTab`

### CompassWindow (2 useState + 2 useRef)
`isDraggingCompass`, `isDraggingBubble`, compassRef, bubbleVialRef

### MunitionsWindow (1 useState)
`rotation`

### ControlPanelWindow (0 useState)
— pure presenter; all state via props

**Grand total useState in app:** approx **60+ hooks** (App: 20, LoginModal: 10, ForwardObserver: 17, Surveillance: 10, others: 6-8 each)

## PERSISTED STATE

Only one key persisted:

```
localStorage['artyc2_battery_coords'] = JSON.stringify({
  easting, northing, altitude, simDir
})
```

- **WRITE:** `LoginModal.tsx` Setup submit
- **READ:** `LoginModal.tsx` handleLogin (post-mock-auth)
- **CLEAR:** `App.tsx:302` `localStorage.clear()` on Kill Switch

**NOT persisted (lost on refresh):**
- targetsList, activeTarget, gunPositions
- All calibration (headingMils, bubbleOffset, gridOffset)
- All munitions state (ammuType, fuzeType, fuzeTime, supplementaryCharge)
- Fire mission state
- Misfire state
- Logs
- Window layout (positions, sizes, isOpen, isMinimized)
- OPSEC toggle

## STATE FLOW DIAGRAM (Mermaid)

```mermaid
graph LR
    subgraph "Persistence"
        LS[(localStorage<br/>artyc2_battery_coords)]
    end
    subgraph "App state (20 hooks)"
        S[Session] --> BC[batteryCoords]
        DOM[Domain] --> TG[targetsList]
        DOM --> AT[activeTarget]
        DOM --> GP[gunPositions]
        CAL[Calibration] --> HM[headingMils ⚠️isolated]
        CAL --> BO[bubbleOffset]
        CAL --> GO[gridOffset ⚠️stub]
        MUN[Munitions] --> AM[ammuType]
        MUN --> FT[fuzeType]
        MUN --> FTM[fuzeTime ⚠️unused]
        MUN --> SC[supplementaryCharge]
        FM[FireMission] --> FMA[active/ToF/progress/timeLeft]
        EM[Emergency] --> MA[misfireActive/timeLeft]
        UI[UI shell] --> WIN[windows[8]/StartMenu/OPSEC/Vol/Clock/Logs]
    end
    LS <-.-> BC
    BC --> TM[TacticalMap]
    BC --> FD[FdcWindow]
    AT --> TM
    AT --> FD
    GP --> TM
    GP --> FD
    BO --> LEV[derived levelIsCentered]
    LEV --> FD
    AM --> ICM[derived icmSafe]
    ICM --> FD
    FD -->|onFireExecute| FMA
    FMA --> TM
```

## RE-RENDER IMPACT

**VERIFIED:** Because all state is in App.tsx, **any state change re-renders the entire dashboard tree** (all 8 windows + TacticalMap + Header + Footer).

- No `React.memo` used anywhere (grep = 0)
- No `useMemo`, `useCallback` optimization (grep = 0)
- Canvas redraws in TacticalMap `useEffect` dependency includes 10+ props → redraw on every tick
- Fire mission 10Hz timer → App re-renders 10×/sec, cascading to all children
- Misfire 1Hz timer → App re-renders 1×/sec
- Clock 1Hz timer → App re-renders 1×/sec

**INFERRED PERFORMANCE RISK:** unmeasured but likely wasteful — see `28_TECH_DEBT.md`
