# 21_RESPONSIVE_BEHAVIOR

## OVERVIEW

**VERIFIED:** The app is designed for **desktop viewport** (~1280×720 minimum). Very limited responsive design.

## TAILWIND BREAKPOINTS AVAILABLE (Default)

| Prefix | Min-width | Used? |
|---|---|---|
| `sm:` | 640px | YES (1 place) |
| `md:` | 768px | NO |
| `lg:` | 1024px | YES (1 place) |
| `xl:` | 1280px | NO |
| `2xl:` | 1536px | NO |

## USES OF RESPONSIVE CLASSES (Exhaustive)

| Component | Class | Effect | Path |
|---|---|---|---|
| Taskbar task list | `hidden sm:flex` | Hides all task buttons below 640px | `App.tsx:742` |
| System tray grid offset | `hidden lg:block` | Hides "ΔE/ΔN/SWING" text below 1024px | `App.tsx:776` |
| Login card | `max-w-lg` | Caps width at lg breakpoint | `LoginModal.tsx:97` |

**Total responsive utility uses:** 3 (across ~4000 lines)

## COMPONENT-BY-COMPONENT MOBILE BEHAVIOR

### LoginModal (UI-01, UI-02)
- **DESKTOP:** Centered card, `max-w-lg`
- **MOBILE:** Card will shrink but form inputs use `w-full` — likely usable, but not tested
- **KNOWN_ISSUE:** No specific mobile optimization; Thai text sizes not adjusted
- **CONFIDENCE:** INFERRED

### TacticalMap (UI-05)
- **DESKTOP:** Fills viewport; pan/zoom via mouse
- **MOBILE:**
  - Canvas resizes to `window.innerWidth × innerHeight` (VERIFIED via `resize` listener)
  - Pan via `mousedown/move/up` — **NO touch handlers** → mobile drag broken
  - Zoom via buttons OK but overlay widgets may crowd small screens
- **BREAKPOINT:** none

### Header (UI-06)
- **DESKTOP:** 3 sections (title / quick-launch / OPSEC toggle)
- **MOBILE:** No responsive collapse — 8 quick-launch buttons will overflow horizontally
- **KNOWN_ISSUE:** Overflow → text truncation or scroll horizontal
- **CONFIDENCE:** VERIFIED (behavior); INFERRED (usability impact)

### Footer Taskbar (UI-07)
- **DESKTOP:** Start btn + 8 tasks + System tray
- **MOBILE:**
  - Task list: `hidden sm:flex` → hidden below 640px (only Start btn + tray visible)
  - System tray grid offset: `hidden lg:block` → hidden below 1024px
  - Volume + clock: always visible

### Start Menu (UI-08)
- **DESKTOP:** 256px width, positioned above Start btn
- **MOBILE:** Same absolute dimensions → will overflow on ~360px screens

### Desktop Icons (UI-09)
- **DESKTOP:** vertical column, top-left
- **MOBILE:** absolute positioning `top-16 left-6`, `max-w-[120px]` — will overlap floating windows or map controls

### Floating Windows (UI-10..UI-17)
- **DESKTOP:** absolute positioned at seeded (x, y) with (w, h) in pixels
- **MOBILE:**
  - Window with default `w=420` at (40, 80) will not fit on 375px screen
  - Windows will overflow off-screen or be unusable
- **NO responsive positioning logic** for narrow viewports
- **KNOWN_ISSUE:** No mobile fallback (e.g., stacking, fullscreen mode, hidden)

### Drag/Resize Handlers (WindowManager, HowitzerBoard, Compass)
- **ALL** use `mousedown/mousemove/mouseup` DOM events
- **NO** `pointerdown/pointermove/pointerup` or `touchstart/touchmove/touchend` handlers
- **CONSEQUENCE:** touch dragging silently does nothing on mobile
- **EVIDENCE:** grep confirms zero `touch` or `pointer` handlers
- **CONFIDENCE:** VERIFIED

## VIEWPORT META (from `index.html`)

- **VERIFIED:** `<meta name="viewport" content="width=device-width, initial-scale=1.0" />` present
- This gives correct pixel mapping on mobile but does not compensate for fixed-pixel layouts

## SVG / CANVAS SCALING

- Compass SVG: `viewBox="0 0 200 200"` scaled via Tailwind `w-48 h-48` (192px) → will not shrink on mobile
- Munitions SVG: `viewBox="0 0 100 200"` with `w-32 h-60` (~128×240px)
- Canvas: dynamically sized to viewport → **only responsive graphic in the app**

## RESPONSIVE BEHAVIOR SUMMARY

| Component | Responsive? | Verified |
|---|---|---|
| TacticalMap Canvas resizing | ✅ (viewport resize handler) | VERIFIED |
| Taskbar task list | ⚠️ (hides below sm) | VERIFIED |
| System tray details | ⚠️ (hides below lg) | VERIFIED |
| Windows / drag | ❌ (fixed pixels + no touch) | VERIFIED |
| Header quick-launch | ❌ (will overflow) | VERIFIED |
| Desktop icons | ❌ | VERIFIED |
| SVG widgets | ❌ (fixed size) | VERIFIED |
| Modal (Login) | ⚠️ (partial — max-w-lg but no small-screen tweaks) | INFERRED |

## KNOWN RESPONSIVE ISSUES (documented, not fixed)

1. **Mobile drag entirely broken** — no touch/pointer handlers
2. **Windows overlap on narrow screens** — no auto-layout
3. **Header overflow** — 8 quick-launch buttons + long Thai title + OPSEC toggle exceed narrow widths
4. **SVG widgets fixed size** — cannot shrink Compass or Munitions cutaway
5. **Auto-center on target may confuse mobile** — pan gets overridden
6. **No orientation adaptation** — no `landscape:`/`portrait:` handling
7. **Fixed 48px readouts in FDC** — may overflow on narrow FDC window
