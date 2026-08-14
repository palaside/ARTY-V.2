# SilentArc Tokens v0

Status: first scaffold token contract

## Base substrate

- `surface.bg`: `#000000`
- `surface.base`: `#0d0f12`
- `surface.raised`: `#16191e`
- `surface.panel`: `rgba(13, 15, 18, 0.88)`
- `surface.panel-strong`: `rgba(22, 25, 30, 0.96)`
- `surface.overlay`: `rgba(0, 0, 0, 0.54)`

## Border system

- `border.subtle`: `rgba(74, 92, 84, 0.28)`
- `border.default`: `rgba(90, 118, 104, 0.45)`
- `border.strong`: `rgba(140, 170, 154, 0.62)`
- `border.signal`: `rgba(0, 255, 102, 0.45)`

## Text system

- `text.primary`: `#E8ECF1`
- `text.secondary`: `#A7B0BA`
- `text.muted`: `#6F7A86`
- `text.inverse`: `#040404`

## Accent roles

- `accent.active`: `#00FF66`
- `accent.caution`: `#FF5500`
- `accent.critical`: `#FF003C`
- `accent.signal`: `#7CFFB2`

## Severity surfaces

- `severity.live.bg`: `rgba(0, 255, 102, 0.08)`
- `severity.warning.bg`: `rgba(255, 85, 0, 0.10)`
- `severity.critical.bg`: `rgba(255, 0, 60, 0.12)`
- `severity.locked.bg`: `rgba(102, 118, 135, 0.12)`

## Typography

- `font.ui`: `"Mona Sans", "Helvetica Neue", sans-serif`
- `font.mono`: `"JetBrains Mono", "IBM Plex Mono", "SFMono-Regular", monospace`
- `font.metric`: same as `font.mono`

Rules:
- body copy stays readable and compressed
- headings stay upright, never italic
- metrics use tabular figures
- micro labels use light positive tracking

## Geometry

- `radius.xs`: `2px`
- `radius.sm`: `4px`
- no large rounding on shell surfaces
- grid edges remain rigid and controlled

## Spacing

- `space.1`: `4px`
- `space.2`: `8px`
- `space.3`: `12px`
- `space.4`: `16px`
- `space.5`: `20px`
- `space.6`: `24px`

Policy:
- dense layout, no one-off spacing
- internal gaps are tighter than shell gaps

## Motion readiness

Reserved hooks:
- `data-motion-zone`
- `data-stack-layer`
- `data-state`

Reduced motion:
- no forced reveal-only visibility
- all states remain readable when motion is removed
