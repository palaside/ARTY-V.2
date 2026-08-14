# 31_ARCHITECTURE_DRIFT

> เฉพาะ drift ที่ evidence รองรับ. ไม่เสนอ fix.

## LIMITATION

Original architecture blueprint documents (`FIRST_ALL_PROJECT.md`, `lithos-hero.md`, `implementation_plan.md`) are **NOT PRESENT** in the repository (see 30_INTENT_VS_IMPLEMENTATION.md). Drift analysis below is based on:
- Standard React best practices (which the prompts implicitly assumed)
- Explicit design directives mentioned in earlier user prompts (from session context)
- Code hints (imports, comments, dead code)

Each drift item is marked with source of "original" reference where possible.

---

## DRIFT-01: STATE MANAGEMENT ARCHITECTURE

- **Original (implied):** Task prompt used the phrase "unified state store (simulating Zustand + Redux Toolkit)"
- **Current:** No Zustand or Redux. Pure `useState` in a single 802-line App.tsx
- **DRIFT:** Sophisticated state layer replaced with lifted-state prop-drilling
- **IMPACT:**
  - Every state change re-renders whole dashboard
  - Cross-component communication limited to top-down props
  - Cannot subscribe selectively
  - Refactoring one feature requires editing App.tsx

## DRIFT-02: WEBSOCKET LAYER

- **Original (implied):** "Simulated Real-time WebSocket Logger"
- **Current:** in-memory string array with WebSocket-flavored log names
- **DRIFT:** No WebSocket infrastructure at all; simulation is cosmetic labeling
- **IMPACT:** No path forward to real-time collaboration without building the layer from scratch

## DRIFT-03: ANIMATION LIBRARY

- **Original (indicated by install):** `framer-motion` was added as dependency
- **Current:** Zero framer-motion imports; animations all done via Tailwind `animate-pulse/bounce/spin/ping` + CSS transitions + `requestAnimationFrame`
- **DRIFT:** Planned animation strategy abandoned in favor of built-in Tailwind

## DRIFT-04: UI PRIMITIVE ABSTRACTION

- **Original (implied by tsconfig `@/*` alias and `cn.ts` helper):** design suggests intent to build a component library using `cn()` for className composition
- **Current:** `cn()` never used; every window duplicates its own button/input styles
- **DRIFT:** Component library never materialized; scaffold utilities orphaned

## DRIFT-05: FEATURE CATEGORIZATION

- **Original (from task prompt):** "5 tactical sections + special crater module" — suggests Crater is a **separate** module (not embedded)
- **Current:** Crater is a tab inside Howitzer window (F017 / CA-01)
- **DRIFT:** Doctrinal category boundary crossed — intelligence function embedded in gun-section UI

## DRIFT-06: DATA PIPELINE ISOLATION

- **Original (implied by having distinct compass/level/fuze windows):** each subsystem should feed the FDC ballistics engine
- **Current:**
  - Compass `headingMils` → **isolated** (does not affect FDC)
  - Fuze `fuzeTime` → **isolated** (does not affect ToF)
  - Grid Offset (Slide/Swing) → **isolated** (does not affect any calc)
  - Munitions `supplementaryCharge` → **isolated** (does not block FIRE)
- **DRIFT:** 4 subsystems are UI-only decoration
- **IMPACT:** Users configure options with no effect — misleading

## DRIFT-07: KILL SWITCH SEMANTICS

- **Original (from prompt):** wipe LocalStorage + IndexedDB completely
- **Current:** wipes LS via `.clear()` (nukes even non-app keys) + `deleteDatabase('fdc_offline_queue')` (a DB that was never created)
- **DRIFT:** Kill Switch cleanup is broader than warranted AND targets nonexistent DB
- **IMPACT:** Future keys will be lost; deletion op is no-op

## DRIFT-08: NAVIGATION SURFACE MULTIPLICATION

- **Original (implied):** windows opened via one primary navigation surface
- **Current:** 4 access points per window (Header, Desktop icons, Taskbar, Start Menu)
- **DRIFT:** UX complexity multiplied without user-facing hierarchy

## DRIFT-09: BUILD OUTPUT MODEL

- **Original (probably standard SPA):** dist/index.html + dist/assets/*.js/css
- **Current:** single-file HTML (via `vite-plugin-singlefile`)
- **DRIFT:** Deployment model changed to self-contained portable file
- **IMPACT:** Beneficial for offline distribution; harmful for CDN caching (all assets in one file → invalidation on any change)

## DRIFT-10: TYPESCRIPT DISCIPLINE

- **Original (tsconfig strict + noUnusedLocals):** rigorous typing intended
- **Current:** many inline structural types, TargetData declared 3× (see DUPL-05), inline anonymous types in props
- **DRIFT:** Weaker type reuse than tsconfig strictness suggests

## DRIFT-11: TEST INFRASTRUCTURE

- **Original (not explicitly required but typical for TS+React project):** vitest or jest
- **Current:** zero test setup
- **DRIFT:** Full test infrastructure missing

## DRIFT-12: OFFLINE QUEUE

- **Original (implied by `fdc_offline_queue` name in Kill Switch):** offline-first pattern with IndexedDB
- **Current:** no offline queue exists; only the delete-database call remains
- **DRIFT:** Offline-first architecture cancelled after being partially specified

## DRIFT-13: RESPONSIVE DESIGN

- **Original (implied by Tailwind availability):** responsive design intended
- **Current:** only 3 responsive class usages in ~4000 lines; mobile drag broken; windows fixed-pixel positioning
- **DRIFT:** Desktop-first design; mobile not addressed

## DRIFT-14: LOGIN AS SECURITY GATE

- **Original (implied by "cryptohandshake" language):** real authentication
- **Current:** any input passes; 1500ms delay simulates handshake
- **DRIFT:** Security boundary is decorative

## DRIFT-15: DOCUMENTATION VS CODE

- **Original documents (`FIRST_ALL_PROJECT.md`, `lithos-hero.md`, `implementation_plan.md`):** referenced in task prompt as sources of intent
- **Current:** None of these files exist in repository. Only reactive documentation (`WORKFLOW.md`, `C2_CLONE_GUIDE.md`) created in later sessions
- **DRIFT:** Original planning documents lost or never checked in; makes future architecture governance harder

## SUMMARY OF DRIFT

| # | Area | Direction |
|---|---|---|
| DRIFT-01 | State mgmt | Complex → simple useState |
| DRIFT-02 | Real-time | WebSocket → in-memory log |
| DRIFT-03 | Animations | Framer Motion → Tailwind CSS |
| DRIFT-04 | UI primitives | Shared library → per-window copies |
| DRIFT-05 | Feature boundaries | Doctrinal → practical (embedded) |
| DRIFT-06 | Data pipelines | Integrated → isolated |
| DRIFT-07 | Kill Switch | Targeted → broad + dead delete |
| DRIFT-08 | Navigation | Single → 4× surfaces |
| DRIFT-09 | Build output | Multi-file → single-file HTML |
| DRIFT-10 | Type reuse | Strong → duplicated |
| DRIFT-11 | Testing | Expected → absent |
| DRIFT-12 | Offline | Queued sync → cleanup-only |
| DRIFT-13 | Responsive | Multi-device → desktop-only |
| DRIFT-14 | Auth | Real → mock |
| DRIFT-15 | Documentation | Present → absent (originals) |

Almost all drift is **simplification** — features were reduced or replaced with lighter alternatives during development.
