# 17_API_INTEGRATIONS

## SURVEY RESULTS

### External Network APIs
- **VERIFIED — ZERO external API calls in application code.**
- No `fetch()`, no `XMLHttpRequest`, no `axios`, no `ky`, no `got`, no `WebSocket`, no `EventSource`
- The word "WebSocket" appears in **log strings only** (e.g., `[เหตุการณ์: WEBSOCKET_ADJUSTMENT]`, `บันทึกเหตุการณ์สด WebSocket`) — it is **cosmetic labeling**, not an actual WebSocket connection

### External Font Load (Runtime)
- **API_ID:** API-01
- **PROVIDER:** Google Fonts CSS
- **PURPOSE:** Load web fonts (JetBrains Mono, Fira Code, Share Tech Mono)
- **CALL_SITE:** `index.html:11` — `<link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600;700&family=JetBrains+Mono:...&family=Share+Tech+Mono&display=swap" rel="stylesheet">`
- **INPUT:** URL query parameters
- **OUTPUT:** CSS + font WOFF2 files
- **ERROR_HANDLING:** none — if Google Fonts unreachable, browser falls back to `monospace` (via `body { font-family: 'JetBrains Mono', 'Fira Code', monospace; }` in inline CSS)
- **AUTH:** none
- **EVIDENCE:** `index.html:8-11`
- **CONFIDENCE:** VERIFIED
- **NOTE:** This is the **only external network call** the entire app makes

### Preconnect Hints
- **API_ID:** API-02
- **URLS:**
  - `https://fonts.googleapis.com` (`index.html:8`)
  - `https://fonts.gstatic.com` (`index.html:9`, `crossorigin`)
- **PURPOSE:** DNS + TLS pre-negotiation for API-01

## BROWSER APIs USED

| API | Where | Purpose |
|---|---|---|
| `window.AudioContext` / `webkitAudioContext` | `SoundGenerator.ts:7` | Web Audio synthesis (playClick/Beep/Alarm/Fire/Splash) |
| `AudioContext.createOscillator()` | `SoundGenerator.ts` (all 5 functions) | Sound wave generation |
| `AudioContext.createGain()` | `SoundGenerator.ts` | Volume envelope |
| `HTMLCanvasElement.getContext('2d')` | `TacticalMap.tsx` | Map rendering |
| Canvas 2D API (fillText, beginPath, arc, moveTo, lineTo, stroke, fill, setLineDash, etc.) | `TacticalMap.tsx` | Map drawing |
| `localStorage.getItem/setItem/clear` | `LoginModal.tsx`, `App.tsx` | Persistence |
| `indexedDB.deleteDatabase` | `App.tsx:306` | Kill Switch cleanup (of non-existent DB) |
| `setInterval` / `clearInterval` | `App.tsx` (3 timers), `LoginModal.tsx`, `ForwardObserverWindow.tsx` | Ticking timers |
| `setTimeout` | `LoginModal.tsx` (mock auth 1500ms), `App.tsx` (banner auto-hide 4000ms) | Delayed callbacks |
| `requestAnimationFrame` / `cancelAnimationFrame` | `TacticalMap.tsx` (terrain animation) | Animation loop |
| `window.addEventListener('resize'/'mousemove'/'mouseup')` | `WindowManager.tsx`, `TacticalMap.tsx`, `CompassWindow.tsx`, `HowitzerWindow.tsx` | Global drag / resize |
| `window.confirm` | `ControlPanelWindow.tsx:29` | Kill Switch confirmation |
| `window.innerWidth` / `innerHeight` | `WindowManager.tsx` (maximize), `TacticalMap.tsx` (canvas resize) | Viewport sizing |
| `document.getElementById` | `main.tsx:6` | Mount root |
| `Element.getBoundingClientRect()` | `WindowManager.tsx`, `CompassWindow.tsx`, `HowitzerWindow.tsx` | Drag geometry |
| `Date` | `App.tsx` (clock, log timestamps) | Time |
| `Math.*` | Everywhere | Calculations |

## APIs **NOT USED** (verified absent)

- ❌ Geolocation API (`navigator.geolocation`)
- ❌ Device Orientation API (`window.addEventListener('deviceorientation')`)
- ❌ Gamepad API
- ❌ WebRTC
- ❌ WebGL / WebGPU
- ❌ Service Worker (no `sw.js`, no `navigator.serviceWorker.register`)
- ❌ Web Share API
- ❌ File API / File System Access API
- ❌ Clipboard API
- ❌ Notification API
- ❌ Push API
- ❌ Payment Request API
- ❌ WebSocket API
- ❌ Broadcast Channel API (no multi-tab sync)
- ❌ Wake Lock API
- ❌ Screen Orientation API
- ❌ MediaDevices (no camera/mic)
- ❌ Speech Synthesis / Recognition
- ❌ Intersection Observer / Resize Observer / Mutation Observer
- ❌ Performance API (no measurement instrumentation)
- ❌ Battery Status
- ❌ Ambient Light Sensor

## MAP TILE PROVIDERS

**VERIFIED — NONE.**
- No Google Maps script include
- No Leaflet dependency
- No Mapbox GL / Mapbox Static
- No OpenLayers
- No MapLibre
- No tile URL requests

The "map" is **entirely hand-drawn** on HTML5 Canvas from local math (grid lines, terrain mesh, guns, targets). See `18_MAP_GEO_SYSTEM.md`.

## AUTH PROVIDERS

**VERIFIED — NONE.**
- Login is a mock validation (non-empty check + 1500ms delay)
- No OAuth flows, no JWT, no session cookies from server, no Firebase Auth, no Auth0, no Clerk, no Supabase

## ANALYTICS / OBSERVABILITY

**VERIFIED — NONE.**
- No Google Analytics, GA4, Segment, Mixpanel, Amplitude
- No Sentry, Rollbar, Bugsnag, Datadog RUM
- No Prometheus, LogRocket, FullStory, Hotjar
- No console instrumentation beyond the internal `logs` array

## CDN USAGE

- Only 1 external CDN: Google Fonts (API-01)
- All JS/CSS is bundled into the single HTML file (via `vite-plugin-singlefile`) — no CDN for app assets

## SUMMARY: INTEGRATION SURFACE

| Category | Count |
|---|---|
| External APIs (network) | **1** (Google Fonts CSS — optional, has fallback) |
| Browser APIs (used) | ~15 (Audio, Canvas, localStorage, indexedDB, timers, RAF, mouse events, confirm, viewport) |
| Third-party services | 0 |
| Auth providers | 0 |
| Analytics services | 0 |
| Map providers | 0 |
| Payment / social | 0 |

## IMPLICATIONS FOR REDESIGN

- **Air-gapped operation possible:** self-host Google Fonts locally (or accept fallback) → app runs on zero-network environments (matches offline-first intent implied by `fdc_offline_queue` name)
- **No network attack surface** to reduce during hardening
- **Real-time collaboration would require adding:** WebSocket layer (client), signaling server, presence protocol, CRDT/OT for target list — currently NONE of this exists
