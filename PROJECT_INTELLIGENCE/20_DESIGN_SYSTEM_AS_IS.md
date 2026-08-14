# 20_DESIGN_SYSTEM_AS_IS

> บันทึกของจริงที่พบใน code เท่านั้น. ห้ามเสนอ redesign.

## COLOR PALETTE (Hardcoded Hex/RGB in Tailwind arbitrary values)

| Token | Value | Purpose | Evidence |
|---|---|---|---|
| Background primary | `#040404` | root bg (night ops black) | `App.tsx:349,379`, `index.html` inline |
| Panel bg | `#121413` | window/panel bg (charcoal) | ~50+ occurrences |
| Border olive | `#2b4034` | tactical olive green border | ~150+ occurrences |
| Accent neon lime | `#CEDE62` | high-importance readouts | ~40+ occurrences |
| Success mint | `#3be099` | ready/OK states | ~30+ occurrences |
| Critical red | `#FF3B30` | alerts/danger | ~25+ occurrences |
| Olive gold warning | `#8A852B` | traverse warning | `SurveillanceWindow.tsx` |
| Warning yellow | `#e6dc64` | friendly point / boundary | `TacticalMap.tsx` |
| Text off-white | `#E0EBE2` | body text | window text |
| Matte black (compass) | `#1A1A1A` | southbound needle | `CompassWindow.tsx:236` |
| Projectile orange | `#ff6e00` | shell/trajectory | `TacticalMap.tsx` |
| Gold copper | `#d4af37` / `#9a7b1c` | driving band | `MunitionsWindow.tsx` |
| Fuze accent | `#fca311` | TNT filling | `MunitionsWindow.tsx` |

**No CSS variables** — all colors are inline Tailwind arbitrary values `bg-[#xxxxxx]`.

## TYPOGRAPHY

- **Font families loaded (Google Fonts):** JetBrains Mono, Fira Code, Share Tech Mono
- **Applied globally:** `body { font-family: 'JetBrains Mono', 'Fira Code', monospace; }` (`index.html` inline `<style>`)
- **Per-component:** most components add `font-mono` Tailwind class
- **Size scale (verified):**
  - Tiny: `text-[8px]`, `text-[8.5px]`, `text-[9px]`, `text-[9.5px]`, `text-[10px]`, `text-[11px]`
  - Standard: `text-xs`, `text-sm`
  - Large: `text-2xl`, `text-3xl`
  - Extra large: `text-4xl`, `text-5xl` (FDC readouts), inline `style={{fontSize: '48px'}}` (FDC corrected QE/Deflection)
- **Weight scale:** default, `font-semibold`, `font-bold`, `font-extrabold`
- **Tracking:** `tracking-wide`, `tracking-wider`, `tracking-widest` (used to reinforce "tactical HUD" feel)

## SPACING

Standard Tailwind scale (`p-1` through `p-6`, `gap-1` through `gap-6`).
No custom spacing tokens observed.

## SURFACES / PANELS

- **Bordered dark boxes:** `bg-black/40` or `bg-[#121413]/85..95` + `border border-[#2b4034]` + `rounded-sm` or `rounded-none`
- **Backdrop blur:** many overlays use `backdrop-blur-md` or `backdrop-blur-xl` (login, header, footer, windows, banner)
- **Glassmorphism:** typically `bg-[#121413]/90 backdrop-blur-xl` for windows

## WINDOW CHROME (Win32 Classic)

- **Bevel borders:** simulated using **4 separate side-colored borders**:
  - Top/Left: `border-t-stone-200 border-l-stone-200` (light)
  - Right/Bottom: `border-r-black border-b-black` (dark)
  - Inverted for "pressed" state (e.g., active Start button)
- Applied on: window frames, Start button, taskbar task buttons, system tray container
- **Evidence:** `WindowManager.tsx:163-165`, `App.tsx:729-733,759-763`

## BUTTONS (Inconsistent — no shared component)

Each window defines its own button pattern. Common variants observed:

| Variant | Class Pattern | Where |
|---|---|---|
| Primary lime | `bg-[#2b4034]/30 hover:bg-[#2b4034]/60 border border-[#CEDE62]/40 text-[#CEDE62] font-bold uppercase` | Submit buttons across features |
| Success mint | `bg-[#3be099]/10 border border-[#3be099]/40 text-[#3be099]` | Login "Enter Command", FIRE (safe) |
| Danger red | `bg-red-950 border-red-500 text-red-400 hover:bg-red-900` | Kill Switch, Misfire trigger, "Fire Block", Re-Authorize |
| Small tab button | `flex-1 py-1 text-center font-semibold uppercase ${active ? 'bg-[#2b4034]/50 text-[#CEDE62]' : 'text-stone-400 hover:bg-[#2b4034]/20'}` | Every window tabbed nav |
| Adjustment pad | `p-1.5 border border-[#2b4034] bg-[#121413] hover:bg-[#2b4034]/30` | FO arrow buttons |

**⚠️ No shared `<Button>` component** — copies exist in every window.

## CARDS

Panel cards: `bg-black/40 border border-[#2b4034] p-2.5 rounded-sm` (recurring pattern).
Header row inside cards: often `text-[10px] text-[#2b4034] uppercase font-bold` label + neon-colored bold value below.

## INPUTS

- **Text/number:** `bg-black border border-[#2b4034] text-{color} font-mono px-2 py-0.5 focus:outline-none focus:border-[#CEDE62]`
- **Radio:** `accent-[#3be099] h-3.5 w-3.5`
- **Checkbox:** `accent-[#CEDE62] h-4 w-4`
- **Range slider:** `w-full accent-[#CEDE62] bg-[#121413] h-1 border border-[#2b4034]`
- **Select dropdown:** `bg-black border border-[#2b4034] text-white px-2 py-1 focus:border-[#CEDE62] rounded-none`

## SHADOWS

- Window shadow: `shadow-2xl` (default), plus focused glow `shadow-[0_0_20px_rgba(206,222,98,0.25)]`
- Lockout screen: `shadow-[0_0_30px_rgba(255,59,48,0.3)]`
- Kill switch button: `shadow-lg shadow-red-950/40`

## ANIMATIONS (Tailwind + custom)

- `animate-pulse` — used extensively (icons, warnings, headers, terminal cursor)
- `animate-spin` — Compass icon (`animationDuration: 40s`), Refresh icons, Square (during fire countdown)
- `animate-bounce` — Restored banner, ShieldCheck icons
- `animate-ping` — Misfire panel background
- **CSS transition:** `transition-colors`, `transition-all`, `transition-transform`, `duration-150/200/300`
- **Custom CSS in index.html:**
  - `.tactical-grid` — 40px grid overlay via linear-gradient
  - `.tactical-scanlines` — scanline effect via linear-gradient
  - `::-webkit-scrollbar` — custom scrollbar (6px, olive/lime)

## ICON LIBRARY

- **Lucide React** — only icon library
- Sizes: `w-2.5`, `w-3`, `w-3.5`, `w-4`, `w-4.5`, `w-5`, `w-5.5`, `w-8`, `w-16` (mixed literal + Tailwind)
- Emoji used as icons in Desktop shortcuts + Taskbar tasks + Start Menu (🎯 🗺️ ⚙️ 💻 🔒 🧭 🚀 📟 🖥️ 🚨 ⚠️ 🔊 🔇 ⏱️ 🔒)

## MODAL PATTERN

- Full-screen: `fixed inset-0 z-50 flex items-center justify-center`
- Centered card: `max-w-{size} bg-[#121413]/90 border-2 border-[#2b4034] p-6 shadow-2xl backdrop-blur-md`
- Corner accent markers: 4 small L-shaped elements (LoginModal only)
- Applied to: LoginModal, Lockout screen
- **No shared `<Modal>` component**

## PANEL PATTERN

- Tab navigation: horizontal strip with `flex-1 py-1` buttons + active state
- Content area: `p-1` or `p-3` container
- Sub-panels: `bg-black/40 border border-[#2b4034] p-2 rounded-sm`
- Applied to: every feature window (each redefines the pattern)

## DESIGN INCONSISTENCIES OBSERVED (Findings, not fixes)

1. **Border radius mixed:** `rounded-sm` vs `rounded-none` vs default `rounded` — no rule
2. **Padding scale mixed:** `p-1, p-2, p-2.5, p-3` all used interchangeably
3. **Text sizes**: `text-[8px]`, `text-[8.5px]`, `text-[9px]` all appear — likely copy-paste drift
4. **Border color mixed:** `border-[#2b4034]/40`, `/50`, `/30`, plain `border-[#2b4034]` — opacity variation not systematic
5. **Button labels** in Thai but hover titles sometimes English (e.g., `title="Toggle Friendly Position Privacy..."` at `App.tsx:447`)
6. **Icon sizing:** mix of Tailwind scale (`w-4`) and arbitrary (`w-4.5`, `w-5.5`) — `w-4.5` and `w-5.5` are non-standard Tailwind fractional values
7. **`text-vertical` class in Start Menu** (`App.tsx:669`) — likely a custom or ignored class name; Tailwind does not ship this

## DARK-ONLY MODE

- No `dark:` variants used
- No theme switcher
- App is designed exclusively for dark night-operations aesthetic

## GLOBAL LAYOUT CSS (from `index.html` inline `<style>`)

- `body`: overflow hidden, `#040404` bg, `#fff` text, JetBrains Mono font
- `.tactical-grid`: 40×40 background grid overlay
- `.tactical-scanlines`: horizontal scanlines effect
- Custom scrollbar: 6px, `#121413` track, `#2b4034` thumb, `#CEDE62` hover

## ACCESSIBILITY (VERIFIED — LIMITED)

- No `aria-label`, `aria-live`, `aria-describedby` audits — only `title` attributes on some buttons
- No keyboard shortcuts
- Focus outline: `focus:outline-none` used extensively → removes default browser focus ring (poor for keyboard users)
- No skip-links
- Color contrast: some `text-[#2b4034]` on dark bg may fail WCAG AA (olive on dark → low contrast)
- No screen reader announcements for fire mission countdown, misfire alarm, or Splash impact

## SUMMARY: DESIGN SYSTEM MATURITY

- **No design tokens file** (no `tokens.ts` / `theme.ts`)
- **No component library** (no shared Button/Input/Card/Modal)
- **No storybook**
- **Consistency via convention** — recurring class strings that developers copy manually
- **Strong visual identity** (tactical HUD) but implementation is scattered
