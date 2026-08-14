# 18_MAP_GEO_SYSTEM

## OVERVIEW

**VERIFIED:** The "map" is a **fully hand-rendered HTML5 Canvas 2D** system. No geospatial libraries are imported.

## SUBSYSTEM COMPONENTS

### MAP-01: Canvas Rendering Layer
- **PATH:** `src/components/TacticalMap.tsx`
- **TECH:** `<canvas>` + `getContext('2d')`
- **SIZE:** Fills `window.innerWidth × window.innerHeight` — resized on `window.resize` event
- **DRAWN LAYERS (bottom to top):**
  1. Solid black background (`fillStyle = '#040404'`)
  2. UTM 1000m grid lines (subtle green)
  3. Grid labels (Easting/Northing values at edges)
  4. 3D terrain wireframe mesh (auto-rotating, `terrainAngle` animation)
  5. Battery center + 6 gun dots (if NOT OPSEC mode)
  6. Friendly point (triangle) + 600m ICM safe boundary (yellow dashed circle)
  7. Each target: threat dome (red translucent circle 300m), crosshair, ring, label
  8. Live projectile trajectory (during fire mission): dashed orange trail + glowing bullet marker + shell metadata text
  9. OPSEC red banner (if hideBatteryCoords)
- **EVIDENCE:** `TacticalMap.tsx` (~500 lines)

### MAP-02: Tile Provider
- **VERIFIED — NONE.**
- No Leaflet, Mapbox, Google Maps, OpenLayers, MapLibre imports
- No tile URL fetches
- Confirmed via `package.json` grep and import survey

### MAP-03: Coordinate System
- **TYPE:** UTM-like (Easting/Northing in meters)
- **NOT** WGS-84 (no lat/lon anywhere)
- **NOT** MGRS format (grep confirms no MGRS strings)
- Coordinates are plain positive integers — treated as arbitrary metric grid
- Displayed in footer as `UTM REFERENCE SYSTEM: WGS-84 ZONE 47N` (previous session — needs verification in current build)

### MAP-04: Projection
- **TYPE:** identity (screen `x` = easting, screen `y` = inverted northing) via helper:
  ```typescript
  const project = (easting, northing) => {
    const dx = easting - batteryCoords.easting;
    const dy = northing - batteryCoords.northing;
    const x = width/2 + dx * zoom + panOffset.x;
    const y = height/2 - dy * zoom + panOffset.y;  // Y inverted (north = up)
    return { x, y };
  };
  ```
- **PATH:** `TacticalMap.tsx` (~line 85)
- **CONFIDENCE:** VERIFIED

### MAP-05: Zoom
- **VARIABLE:** `zoom` (state, default 0.04, min 0.005, max 0.2)
- **UNITS:** pixels per meter
- **UI:** Zoom In/Out buttons (bottom-right z-40)
- **STEP:** `× 1.3` per click
- **INTERACTION:** No mouse-wheel zoom (only button clicks)
- **EVIDENCE:** `TacticalMap.tsx` (state + button handlers)

### MAP-06: Pan
- **VARIABLE:** `panOffset {x, y}`
- **INTERACTION:** mousedown on canvas → `isPanning=true` → mousemove updates offset relative to start
- **⚠️ ISSUE:** Auto-centers on `activeTarget` via `useEffect` — this may overwrite user pan whenever a new target is chosen
- **EVIDENCE:** `TacticalMap.tsx` pan handlers, useEffect

### MAP-07: MGRS Handling
- **VERIFIED — NONE.**
- No MGRS parsing/formatting
- No conversion between UTM/MGRS/lat-lon

### MAP-08: Markers
- **INLINE Canvas drawing** — no `<marker>` components
- **Types drawn:**
  - Battery: filled circle + hairline crosshairs + label "ศก.ร้อย"
  - Guns (6): color-coded circles (G1 emerald+red border for base piece; G2-G6 dark bg)
  - Friendly: yellow triangle
  - Target: red concentric rings + crosshair (larger when active); pulsates via `sin(Date.now())` based scale
  - Projectile: glowing orange dot with shadow + trail
- **EVIDENCE:** `TacticalMap.tsx`

### MAP-09: Drag Behavior (Guns)
- **NOT on map** — gun repositioning happens in `HowitzerWindow` M.17 Board (a separate mini-canvas, not the main tactical map)
- Main map only **renders** the resulting positions

### MAP-10: Compass Widget on Map
- **LOCATION:** Top-right of map (z-40 overlay div)
- **VISUAL:** Rotating `<Compass>` Lucide icon animating slowly, with rotation set to `milsToDegrees(batteryCoords.simDir)`
- **⚠️ IMPORTANT:** Uses `batteryCoords.simDir` (from Setup) — NOT `headingMils` (from CompassWindow interactions). See CA-02
- **EVIDENCE:** `TacticalMap.tsx` (compass indicator block)

### MAP-11: Legend
- **LOCATION:** Bottom-left of map (z-40 overlay div)
- **CONTENT:** 4 items with color swatches + Thai labels (Battery Center, Active Target, Friendly Point, ICM 600m Safe Boundary)

### MAP-12: Zoom Controls Widget
- **LOCATION:** Bottom-right of map (z-40 overlay div)
- **BUTTONS:** ZoomIn (Lucide icon), ZoomOut

### MAP-13: Threat Dome Rendering
- Each target draws a red translucent circle radius 300m centered on target
- Active target gets brighter fill + pulsing crosshair
- **EVIDENCE:** `TacticalMap.tsx` target block

### MAP-14: ICM Safe Boundary
- Yellow dashed circle radius 600m centered on `friendlyCoords`
- Label "เขตปลอดภัยกระสุน ICM (600 ม.)"
- **EVIDENCE:** `TacticalMap.tsx`

### MAP-15: Trajectory (Fire Mission)
- During `fireMissionActive`: from battery → target
- Traces a parabolic arc using `fireMissionProgress` as parameter `t ∈ [0, 1]`
- Height offset via `4 × H_max × t × (1-t)` formula
- Projectile marker (orange filled circle with shadow glow)
- Shell metadata text (ammo type + altitude)
- **EVIDENCE:** `TacticalMap.tsx` (trajectory block, ~lines 340-395)

### MAP-16: Grid Lines
- **SPACING:** 1000m (major)
- **STYLE:** faint green `rgba(43, 64, 52, 0.15)`
- **LABELS:** Easting number at bottom edge, Northing number at left edge
- **EVIDENCE:** `TacticalMap.tsx` grid block

### MAP-17: Terrain Wireframe
- **MESH:** 25×25 points spaced 250m apart, centered around battery
- **ELEVATION FORMULA:** `elevation = 120 × sin(e × 0.001 + terrainAngle) × cos(n × 0.0015)` — visual only, not real DEM data
- **ANIMATION:** `terrainAngle += 0.002` per RAF tick (~1Hz visible drift)
- **EVIDENCE:** `TacticalMap.tsx` mesh block

## GEOLOCATION / DEVICE ORIENTATION

**VERIFIED — NEITHER USED.**
- No `navigator.geolocation.getCurrentPosition/watchPosition` calls
- No `deviceorientation` / `devicemotion` event listeners
- The prompt text mentions "geolocation" and "orientation" but repository does not use them

## TARGET PLOTTING

- **Where:** targets are ADDED to `App.targetsList` from multiple sources (FO 3 methods, Simulate Call, Crater CB)
- **Rendering:** always by `TacticalMap.tsx` via `targetsList.forEach(...)` in canvas draw block
- **Active vs inactive:** `activeTarget?.id === target.id` gets pulsing scale + brighter fill

## SEPARATION OF CONCERNS

- All map drawing is inside `TacticalMap.tsx`
- Coordinate math (`calculatePolarPlot`) is in `utils/ballistics.ts`
- `milsToDegrees` is duplicated — one export in `ballistics.ts`, one inline helper at end of `TacticalMap.tsx`
- Gun positions come from App state; targets from App state; battery from App state — all wired via props

## LIMITATIONS OF CURRENT MAP SYSTEM

1. No real geographic data (DEM, satellite, roads, elevation contours)
2. No coordinate transformation between systems
3. No projection accuracy — treats everything as flat Cartesian
4. No touch/pinch gestures for mobile
5. No mouse-wheel zoom
6. Auto-center on target may fight user pan
7. Cannot pan when clicking overlays (bottom-left legend, bottom-right zoom) — bounded to canvas element only
8. No layer toggles (all layers always drawn)
9. Terrain wireframe is purely decorative — does not represent real elevation
