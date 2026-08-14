# 30_INTENT_VS_IMPLEMENTATION

> Compare original documents vs. current implementation.
> Original documents referenced in task prompt: `FIRST_ALL_PROJECT.md`, `lithos-hero.md`, `implementation_plan.md`

## AVAILABILITY OF ORIGINAL DOCUMENTS

- **`FIRST_ALL_PROJECT.md`** — ❌ NOT FOUND in repository
- **`lithos-hero.md`** — ❌ NOT FOUND in repository
- **`implementation_plan.md`** — ❌ NOT FOUND in repository
- **Only documents present:**
  - `WORKFLOW.md` (Thai, created in prior session — documents current implementation, not original intent)
  - `docs/C2_CLONE_GUIDE.md` (Thai, created in prior session — same)

**⚠️ CRITICAL CONSTRAINT:** Without the original documents, this comparison table is **primarily UNKNOWN**. What follows is inferred where possible from **user prompt text** in earlier sessions and from **code comments/labels** that suggest original scope.

## COMPARISON TABLE

| Item | Original Intent (source) | Current Implementation | Classification |
|---|---|---|---|
| Project name | "Wensite / lithos-hero" (from task prompt) | `react-vite-tailwind` in package.json; app title `ระบบอำนวยการยิงปืนใหญ่ C2 ยุคถัดไป` | UNKNOWN — names don't match; original context absent |
| Single-page app | (implied by having no router in original spec) | SPA, no router | INFERRED PLANNED_AND_IMPLEMENTED |
| Windows 95/98 window system | (mentioned in user prompt to build Option B taskbar) | Fully implemented in WindowManager + App | PLANNED_AND_IMPLEMENTED |
| Full-screen Canvas map | (mentioned in user prompt for map + trajectory + threat dome) | TacticalMap.tsx implements all of this | PLANNED_AND_IMPLEMENTED |
| 8 tactical windows | (matches "5 tactical sections + special crater module" from prompt) | 8 windows: FO, Surveillance, Howitzer (containing Crater), FDC, Weapons, Compass, Munitions, Console | PLANNED_AND_IMPLEMENTED (with structural difference: Crater embedded in Howitzer instead of separate) |
| Web Audio synthesized sound | (mentioned as "sound synthesis without files") | SoundGenerator.ts with 5 functions | PLANNED_AND_IMPLEMENTED |
| M.2 Compass with N/S sensor logic + auto +180° | (mentioned in earlier user prompt) | CompassWindow.tsx implements it | PLANNED_AND_IMPLEMENTED — but see CA-02 (not integrated with FDC) |
| Level bubble unlock | (mentioned) | Implemented as FIRE gate | PLANNED_AND_IMPLEMENTED |
| Kill Switch (wipe LS + IDB) | (mentioned) | Implemented; IDB delete is dead cleanup though | PLANNED_PARTIALLY_IMPLEMENTED |
| WebSocket real-time logging | (mentioned) | Only in-memory string array, no actual WS | PLANNED_NOT_FOUND (as actual WS); LABEL-ONLY implementation |
| Fire mission timer + parabolic arc | (mentioned) | 10Hz timer + canvas arc drawing | PLANNED_AND_IMPLEMENTED |
| 105mm shell cutaway | (mentioned) | MunitionsWindow.tsx SVG | PLANNED_AND_IMPLEMENTED |
| VT + Supp charge safety | (mentioned) | Warning shown, but non-blocking | PLANNED_PARTIALLY_IMPLEMENTED |
| Ballistics interpolation + wind splitting | (mentioned) | ballistics.ts implements it | PLANNED_AND_IMPLEMENTED |
| Round-up safety rule for Min QE | (mentioned as "Math.ceil") | Implemented via `Math.ceil()` | PLANNED_AND_IMPLEMENTED |
| ICM 600m boundary blocker | (mentioned) | Blocks FIRE via `icmSafe` gate | PLANNED_AND_IMPLEMENTED |
| 30-min misfire countdown + SOP | (mentioned) | Fully implemented | PLANNED_AND_IMPLEMENTED |
| Traverse ทบ.344-202 closure error | (mentioned) | Implemented with 10m/2mils threshold | PLANNED_AND_IMPLEMENTED |
| Intersection & resection solver | (mentioned) | Intersection only — Resection not implemented | PLANNED_PARTIALLY_IMPLEMENTED |
| Coordinate calibration (Slide + Swing) | (mentioned as "translate + rotate coordinate matrix") | UI implemented but output never used in downstream calc | PLANNED_PARTIALLY_IMPLEMENTED — STUB |
| M.17 Plotting Board | (mentioned) | Implemented with drag-to-position | PLANNED_AND_IMPLEMENTED |
| Crater analysis tri-panel | (mentioned) | 3 panels present + weapon ID + validation | PLANNED_AND_IMPLEMENTED — but CB pos hardcoded (partial semantic) |
| Individual gun corrections per VE | (mentioned) | GUN_VE_VARIANCES applied | PLANNED_AND_IMPLEMENTED |
| Report/export | (not mentioned in prompt) | Not present | UNKNOWN (probably not planned) |
| Multi-user | (not mentioned) | Not present | UNKNOWN |
| Backend / server | (not mentioned) | Not present | INFERRED — never planned |
| Testing infrastructure | (not mentioned) | Not present | UNKNOWN |
| CI/CD | (not mentioned) | Not present | UNKNOWN |
| Framer Motion animations | (planned per `framer-motion` install) | Never imported | PLANNED_NOT_FOUND / IMPLEMENTED_NEVER |
| `cn()` helper (utils/cn.ts) | (present in original template) | Not used | PLANNED_NOT_FOUND (unused) |
| Auto-bypass Setup on Hydration | (mentioned) | Implemented with 4s banner | PLANNED_AND_IMPLEMENTED |
| OPSEC / hide-battery-coord mode | (mentioned) | Partial — only masks map | PLANNED_PARTIALLY_IMPLEMENTED |
| Desktop shortcuts | (mentioned as Option B) | Implemented (8 emoji icons) | IMPLEMENTED_LATER |
| Start Menu + Taskbar | (mentioned as Option B) | Implemented | IMPLEMENTED_LATER |
| System tray clock | (mentioned as Option B) | Implemented (real 1Hz update) | IMPLEMENTED_LATER |
| Volume mute (actually working) | (implied in tray design) | State only — no actual gain control | PLANNED_PARTIALLY_IMPLEMENTED |
| Fuze time consumed by ToF | (implied) | `fuzeTime` state exists but not used in ToF calc | PLANNED_NOT_FOUND (integration missing) |
| Compass heading feeds FDC | (implied) | headingMils never propagates to FDC | PLANNED_NOT_FOUND (integration missing) |

## CLASSIFICATION TALLY

| Class | Count |
|---|---|
| PLANNED_AND_IMPLEMENTED | 15 |
| PLANNED_PARTIALLY_IMPLEMENTED | 8 |
| PLANNED_NOT_FOUND | 5 |
| IMPLEMENTED_LATER (post-original) | 3 |
| CHANGED_FROM_ORIGINAL | 0 (cannot verify without originals) |
| REMOVED_OR_UNREACHABLE | 0 (cannot verify) |
| UNKNOWN | 6 |

## KEY DISCREPANCIES

### DIS-01: Crater is in Howitzer window, not separate
- **Original prompt indicated:** "5 tactical sections + special crater module"
- **Current:** Crater is a tab **within Howitzer window** — see CA-01
- **Class:** CHANGED_FROM_ORIGINAL (based on prompt language)

### DIS-02: "WebSocket" is not WebSocket
- **Original:** implied real real-time comms
- **Current:** in-memory string array with WebSocket-flavored label

### DIS-03: Framer Motion never used
- Package installed but zero imports

### DIS-04: `cn.ts` present, never used
- Template scaffolding kept

### DIS-05: Volume toggle non-functional
- Original tray implied real audio control; only emoji swap in current

## ITEMS IN CODE NOT MENTIONED IN ORIGINALS (UNKNOWN whether planned)

- Terrain wireframe auto-rotation (visual only)
- Desktop icons (double-click open) — inferred as post-original
- Simulate Incoming Call button — testing/demo tool
- Restored coordinates banner (4s auto-hide)
- Auto-center map on activeTarget

## CAVEAT

**All classifications marked "inferred from user prompt" are INDIRECT — the actual original spec documents named in the task prompt (`FIRST_ALL_PROJECT.md`, `lithos-hero.md`, `implementation_plan.md`) are NOT PRESENT in this repository.**

**Traceability sources for original intent:**
- User prompts in conversation history (SESSION-derived, not repo-verified)
- Comments in code that reveal design decisions

**High-confidence PLANNED_AND_IMPLEMENTED items** are those where the CODE itself matches a clear labeled intent (e.g., function name, comment, or feature card in UI).
