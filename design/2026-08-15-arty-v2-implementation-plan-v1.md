# ARTY V.2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first usable operational ARTY V.2 foundation from the current shell prototype, with real role gating, shared state, core domain workspaces, calculation engine scaffolding, and printable document workflows.

**Architecture:** Start by replacing the static shell with a real application runtime that separates Admin/OWN, Dashboard, and User workspaces. Implement shared truth stores first, then connect FO, FDC, Howitzer, Surveillance, and Weapons through explicit handoff boundaries, while keeping calculation logic in focused engine modules and document outputs in dedicated printable flows.

**Tech Stack:** Vite, TypeScript-ready React application structure (to be introduced in-repo), shared state store, printable HTML/CSS document layouts, domain calculation modules, role-based visibility guards.

## Global Constraints

- All operational rules must follow the locked Thai-language system spec and prior architecture decisions.
- FO visibility is restricted: FO must not see FDC, Surveillance, Howitzer, or Weapons internal views.
- FDC may see FO outputs and shared target context.
- Shared Map must use one shared data backbone with role-segmented views.
- Calculation authority must stay outside UI components.
- Document outputs must support real preview and print workflows.
- `บขตป.` field-level ownership remains intentionally unresolved; implement only the locked stage: Crater Analysis -> ตอนที่ 1, with extension points for ตอนที่ 2.
- Do not invent doctrine, formula semantics, or safety logic beyond the confirmed references.
- Preserve existing `design/` and `PROJECT_INTELLIGENCE/` docs as reference material.
- Use frequent small commits.

---

## File Structure

### Existing files to preserve and integrate
- `D:\Project\ARTY V.2\src\dashboard-shell\dashboard-shell.html` - current static operational shell reference
- `D:\Project\ARTY V.2\src\dashboard-shell\dashboard-shell.css` - current shell styling reference
- `D:\Project\ARTY V.2\src\dashboard-shell\dashboard-shell.js` - current shell behavior reference
- `D:\Project\ARTY V.2\design\dashboard-scaffold-spec.md` - shell/scaffold reference
- `D:\Project\ARTY V.2\design\architecture-classification-rules-v1.th.md` - architecture constraints
- `D:\Project\ARTY V.2\design\asset-usage-spec-v1.th.md` - asset rules
- `D:\Project\ARTY V.2\design\tokens.silentarc.md` - visual token reference

### New runtime structure to create
- `D:\Project\ARTY V.2\src\app\main.tsx` - application entrypoint
- `D:\Project\ARTY V.2\src\app\App.tsx` - top-level router/shell composition
- `D:\Project\ARTY V.2\src\app\routes\AdminOwnPage.tsx` - Admin/OWN page
- `D:\Project\ARTY V.2\src\app\routes\DashboardPage.tsx` - dashboard/login page
- `D:\Project\ARTY V.2\src\app\routes\UserWorkspacePage.tsx` - authenticated workspace page
- `D:\Project\ARTY V.2\src\app\layout\WorkspaceShell.tsx` - role-aware workspace container
- `D:\Project\ARTY V.2\src\app\layout\DocumentModeShell.tsx` - printable document container
- `D:\Project\ARTY V.2\src\app\auth\auth-types.ts` - auth and role types
- `D:\Project\ARTY V.2\src\app\auth\auth-state.ts` - login/session state
- `D:\Project\ARTY V.2\src\app\auth\role-visibility.ts` - OPSEC visibility rules
- `D:\Project\ARTY V.2\src\shared\state\mission-store.ts` - mission context store
- `D:\Project\ARTY V.2\src\shared\state\target-store.ts` - target truth store
- `D:\Project\ARTY V.2\src\shared\state\safety-store.ts` - safety/status store
- `D:\Project\ARTY V.2\src\shared\state\document-store.ts` - document registry store
- `D:\Project\ARTY V.2\src\shared\state\map-store.ts` - shared map state
- `D:\Project\ARTY V.2\src\shared\map\SharedMapEngine.tsx` - shared map engine shell
- `D:\Project\ARTY V.2\src\shared\map\RoleSegmentedMapView.tsx` - map visibility adapter
- `D:\Project\ARTY V.2\src\domains\fo\FoWorkspace.tsx` - FO workspace
- `D:\Project\ARTY V.2\src\domains\fo\fo-types.ts` - FO types
- `D:\Project\ARTY V.2\src\domains\fo\fo-service.ts` - FO target submission logic
- `D:\Project\ARTY V.2\src\domains\fdc\FdcWorkspace.tsx` - FDC workspace
- `D:\Project\ARTY V.2\src\domains\fdc\fdc-types.ts` - FDC types
- `D:\Project\ARTY V.2\src\domains\fdc\fdc-service.ts` - FDC orchestration
- `D:\Project\ARTY V.2\src\domains\surveillance\SurveillanceWorkspace.tsx` - Surveillance workspace
- `D:\Project\ARTY V.2\src\domains\surveillance\documents\Form344201Document.tsx` - ทบ.344-201 preview/print component
- `D:\Project\ARTY V.2\src\domains\surveillance\documents\Form344202Document.tsx` - ทบ.344-202 preview/print component
- `D:\Project\ARTY V.2\src\domains\howitzer\HowitzerWorkspace.tsx` - Howitzer workspace
- `D:\Project\ARTY V.2\src\domains\howitzer\m17\M17Workspace.tsx` - M.17 interface
- `D:\Project\ARTY V.2\src\domains\howitzer\crater\CraterAnalysisWorkspace.tsx` - crater analysis interface
- `D:\Project\ARTY V.2\src\domains\howitzer\documents\DeputyCommanderReportDocument.tsx` - Report รอง ผบ.ร้อย
- `D:\Project\ARTY V.2\src\domains\howitzer\documents\CounterBatteryDocument.tsx` - บขตป. document shell
- `D:\Project\ARTY V.2\src\domains\weapons\WeaponsWorkspace.tsx` - Weapons workspace
- `D:\Project\ARTY V.2\src\engine\angles.ts` - mil/degree conversion helpers
- `D:\Project\ARTY V.2\src\engine\vectors.ts` - vector split/combine helpers
- `D:\Project\ARTY V.2\src\engine\m17.ts` - M.17 displacement logic
- `D:\Project\ARTY V.2\src\engine\min-qe.ts` - Minimum QE logic
- `D:\Project\ARTY V.2\src\engine\firing-table.ts` - firing table access/interpolation shell
- `D:\Project\ARTY V.2\src\engine\met.ts` - MET correction shell
- `D:\Project\ARTY V.2\src\engine\crater.ts` - crater geometry logic
- `D:\Project\ARTY V.2\src\tests\` - test directory for core modules

### Files to modify
- `D:\Project\ARTY V.2\vite.config.ts` - wire runtime entry/build
- `D:\Project\ARTY V.2\.gitignore` - ignore runtime artifacts if needed

---

### Task 1: Establish application runtime and route skeleton

**Files:**
- Create: `src/app/main.tsx`
- Create: `src/app/App.tsx`
- Create: `src/app/routes/AdminOwnPage.tsx`
- Create: `src/app/routes/DashboardPage.tsx`
- Create: `src/app/routes/UserWorkspacePage.tsx`
- Create: `src/app/layout/WorkspaceShell.tsx`
- Modify: `vite.config.ts`
- Test: `src/tests/app-shell.test.tsx`

**Interfaces:**
- Consumes: current shell references and locked screen ownership rules
- Produces: `App`, `AdminOwnPage`, `DashboardPage`, `UserWorkspacePage`, `WorkspaceShell`

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen } from '@testing-library/react'
import { App } from '../app/App'

test('renders three top-level application routes', () => {
  render(<App />)
  expect(screen.getByText(/dashboard/i)).toBeInTheDocument()
  expect(screen.getByText(/admin/i)).toBeInTheDocument()
  expect(screen.getByText(/workspace/i)).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/tests/app-shell.test.tsx`
Expected: FAIL because `App` and route components do not exist yet.

- [ ] **Step 3: Write minimal implementation**

```tsx
// src/app/App.tsx
import { AdminOwnPage } from './routes/AdminOwnPage'
import { DashboardPage } from './routes/DashboardPage'
import { UserWorkspacePage } from './routes/UserWorkspacePage'

export function App() {
  return (
    <main>
      <DashboardPage />
      <AdminOwnPage />
      <UserWorkspacePage />
    </main>
  )
}
```

```tsx
// src/app/routes/DashboardPage.tsx
export function DashboardPage() {
  return <section aria-label="dashboard">Dashboard</section>
}
```

```tsx
// src/app/routes/AdminOwnPage.tsx
export function AdminOwnPage() {
  return <section aria-label="admin">Admin/OWN</section>
}
```

```tsx
// src/app/routes/UserWorkspacePage.tsx
export function UserWorkspacePage() {
  return <section aria-label="workspace">User Workspace</section>
}
```

```tsx
// src/app/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/tests/app-shell.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app src/tests/app-shell.test.tsx vite.config.ts
git commit -m "feat: add application runtime skeleton"
```

### Task 2: Add authentication state and role visibility rules

**Files:**
- Create: `src/app/auth/auth-types.ts`
- Create: `src/app/auth/auth-state.ts`
- Create: `src/app/auth/role-visibility.ts`
- Test: `src/tests/role-visibility.test.ts`

**Interfaces:**
- Consumes: locked OPSEC rules
- Produces: `UserRole`, `AuthSession`, `canViewPanel(role, panel)`

- [ ] **Step 1: Write the failing test**

```ts
import { canViewPanel } from '../app/auth/role-visibility'

test('FO cannot view FDC or Howitzer panels', () => {
  expect(canViewPanel('FO', 'FDC')).toBe(false)
  expect(canViewPanel('FO', 'HOWITZER')).toBe(false)
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/tests/role-visibility.test.ts`
Expected: FAIL because visibility helpers do not exist.

- [ ] **Step 3: Write minimal implementation**

```ts
// src/app/auth/auth-types.ts
export type UserRole = 'ADMIN' | 'FO' | 'FDC' | 'SURVEILLANCE' | 'HOWITZER' | 'WEAPONS'
export type PanelKey = 'FO' | 'FDC' | 'SURVEILLANCE' | 'HOWITZER' | 'WEAPONS' | 'MAP' | 'DOCUMENT'

export interface AuthSession {
  role: UserRole | null
  username: string | null
  enabled: boolean
}
```

```ts
// src/app/auth/role-visibility.ts
import { PanelKey, UserRole } from './auth-types'

const matrix: Record<UserRole, PanelKey[]> = {
  ADMIN: ['FO', 'FDC', 'SURVEILLANCE', 'HOWITZER', 'WEAPONS', 'MAP', 'DOCUMENT'],
  FO: ['FO', 'MAP', 'DOCUMENT'],
  FDC: ['FO', 'FDC', 'MAP', 'DOCUMENT'],
  SURVEILLANCE: ['SURVEILLANCE', 'MAP', 'DOCUMENT'],
  HOWITZER: ['HOWITZER', 'MAP', 'DOCUMENT'],
  WEAPONS: ['WEAPONS', 'DOCUMENT'],
}

export function canViewPanel(role: UserRole, panel: PanelKey): boolean {
  return matrix[role].includes(panel)
}
```

```ts
// src/app/auth/auth-state.ts
import { AuthSession } from './auth-types'

export const defaultSession: AuthSession = {
  role: null,
  username: null,
  enabled: true,
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/tests/role-visibility.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/auth src/tests/role-visibility.test.ts
git commit -m "feat: add auth roles and visibility rules"
```

### Task 3: Implement shared truth stores

**Files:**
- Create: `src/shared/state/mission-store.ts`
- Create: `src/shared/state/target-store.ts`
- Create: `src/shared/state/safety-store.ts`
- Create: `src/shared/state/document-store.ts`
- Create: `src/shared/state/map-store.ts`
- Test: `src/tests/shared-stores.test.ts`

**Interfaces:**
- Consumes: ownership and field-flow rules
- Produces: shared store creators and canonical types

- [ ] **Step 1: Write the failing test**

```ts
import { createTargetStore } from '../shared/state/target-store'

test('target store keeps one canonical active target', () => {
  const store = createTargetStore()
  store.setActiveTarget({ id: 'T-01', easting: 100, northing: 200, altitude: 10 })
  expect(store.activeTarget?.id).toBe('T-01')
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/tests/shared-stores.test.ts`
Expected: FAIL because shared stores do not exist.

- [ ] **Step 3: Write minimal implementation**

```ts
// src/shared/state/target-store.ts
export interface ActiveTarget {
  id: string
  easting: number
  northing: number
  altitude: number
}

export function createTargetStore() {
  return {
    activeTarget: null as ActiveTarget | null,
    setActiveTarget(target: ActiveTarget) {
      this.activeTarget = target
    },
  }
}
```

```ts
// src/shared/state/mission-store.ts
export function createMissionStore() {
  return { missionId: null as string | null, status: 'idle' as 'idle' | 'active' | 'complete' }
}
```

```ts
// src/shared/state/safety-store.ts
export function createSafetyStore() {
  return { minQeLocked: false, fireLocked: false }
}
```

```ts
// src/shared/state/document-store.ts
export function createDocumentStore() {
  return { openDocument: null as string | null }
}
```

```ts
// src/shared/state/map-store.ts
export function createMapStore() {
  return { zoom: 1, selectedLayerRole: 'FDC' as 'FO' | 'FDC' | 'SURVEILLANCE' | 'HOWITZER' | 'WEAPONS' }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/tests/shared-stores.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/shared/state src/tests/shared-stores.test.ts
git commit -m "feat: add shared truth stores"
```

### Task 4: Implement FO workspace and target creation flow

**Files:**
- Create: `src/domains/fo/fo-types.ts`
- Create: `src/domains/fo/fo-service.ts`
- Create: `src/domains/fo/FoWorkspace.tsx`
- Test: `src/tests/fo-service.test.ts`

**Interfaces:**
- Consumes: `createTargetStore`, shared map context
- Produces: `submitGridTarget`, `submitPolarTarget`, `submitShiftTarget`

- [ ] **Step 1: Write the failing test**

```ts
import { submitGridTarget } from '../domains/fo/fo-service'

test('submitGridTarget creates a canonical target object', () => {
  const target = submitGridTarget({ id: 'T-01', easting: 123, northing: 456, altitude: 7 })
  expect(target.id).toBe('T-01')
  expect(target.easting).toBe(123)
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/tests/fo-service.test.ts`
Expected: FAIL because FO service does not exist.

- [ ] **Step 3: Write minimal implementation**

```ts
// src/domains/fo/fo-types.ts
export interface FoGridTargetInput {
  id: string
  easting: number
  northing: number
  altitude: number
}
```

```ts
// src/domains/fo/fo-service.ts
import { FoGridTargetInput } from './fo-types'

export function submitGridTarget(input: FoGridTargetInput) {
  return { ...input }
}
```

```tsx
// src/domains/fo/FoWorkspace.tsx
export function FoWorkspace() {
  return <section aria-label="fo-workspace">FO Workspace</section>
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/tests/fo-service.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/domains/fo src/tests/fo-service.test.ts
git commit -m "feat: add FO target flow foundation"
```

### Task 5: Implement FDC core service shell

**Files:**
- Create: `src/domains/fdc/fdc-types.ts`
- Create: `src/domains/fdc/fdc-service.ts`
- Create: `src/domains/fdc/FdcWorkspace.tsx`
- Create: `src/engine/angles.ts`
- Create: `src/engine/vectors.ts`
- Test: `src/tests/fdc-service.test.ts`

**Interfaces:**
- Consumes: shared target, gun context, ammo context
- Produces: `computeFireSolution(input): FireSolution`

- [ ] **Step 1: Write the failing test**

```ts
import { computeFireSolution } from '../domains/fdc/fdc-service'

test('computeFireSolution returns range and azimuth shell output', () => {
  const result = computeFireSolution({
    target: { easting: 1200, northing: 2400, altitude: 0 },
    battery: { easting: 1000, northing: 2000, altitude: 0 },
  })
  expect(result.range).toBeGreaterThan(0)
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/tests/fdc-service.test.ts`
Expected: FAIL because FDC service does not exist.

- [ ] **Step 3: Write minimal implementation**

```ts
// src/engine/vectors.ts
export function planarRange(dx: number, dy: number): number {
  return Math.sqrt(dx * dx + dy * dy)
}
```

```ts
// src/engine/angles.ts
export function degreesToMils(degrees: number): number {
  return (degrees * 6400) / 360
}
```

```ts
// src/domains/fdc/fdc-types.ts
export interface FireSolutionInput {
  target: { easting: number; northing: number; altitude: number }
  battery: { easting: number; northing: number; altitude: number }
}

export interface FireSolution {
  range: number
  azimuthMils: number
}
```

```ts
// src/domains/fdc/fdc-service.ts
import { degreesToMils } from '../../engine/angles'
import { planarRange } from '../../engine/vectors'
import { FireSolution, FireSolutionInput } from './fdc-types'

export function computeFireSolution(input: FireSolutionInput): FireSolution {
  const dx = input.target.easting - input.battery.easting
  const dy = input.target.northing - input.battery.northing
  const range = planarRange(dx, dy)
  const degrees = (Math.atan2(dx, dy) * 180) / Math.PI
  const azimuthMils = degreesToMils((degrees + 360) % 360)
  return { range, azimuthMils }
}
```

```tsx
// src/domains/fdc/FdcWorkspace.tsx
export function FdcWorkspace() {
  return <section aria-label="fdc-workspace">FDC Workspace</section>
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/tests/fdc-service.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/domains/fdc src/engine src/tests/fdc-service.test.ts
git commit -m "feat: add FDC core service shell"
```

### Task 6: Implement Howitzer M.17 foundation

**Files:**
- Create: `src/domains/howitzer/HowitzerWorkspace.tsx`
- Create: `src/domains/howitzer/m17/M17Workspace.tsx`
- Create: `src/engine/m17.ts`
- Test: `src/tests/m17-engine.test.ts`

**Interfaces:**
- Consumes: gun offsets from Howitzer workspace
- Produces: `computeGunDisplacement(lrMeters, frMeters)`

- [ ] **Step 1: Write the failing test**

```ts
import { computeGunDisplacement } from '../engine/m17'

test('computeGunDisplacement returns displacement vector', () => {
  const result = computeGunDisplacement(25, -10)
  expect(result.x).toBe(25)
  expect(result.y).toBe(-10)
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/tests/m17-engine.test.ts`
Expected: FAIL because M.17 engine does not exist.

- [ ] **Step 3: Write minimal implementation**

```ts
// src/engine/m17.ts
export function computeGunDisplacement(lrMeters: number, frMeters: number) {
  return { x: lrMeters, y: frMeters }
}
```

```tsx
// src/domains/howitzer/m17/M17Workspace.tsx
export function M17Workspace() {
  return <section aria-label="m17-workspace">M.17 Workspace</section>
}
```

```tsx
// src/domains/howitzer/HowitzerWorkspace.tsx
import { M17Workspace } from './m17/M17Workspace'

export function HowitzerWorkspace() {
  return (
    <section aria-label="howitzer-workspace">
      <M17Workspace />
    </section>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/tests/m17-engine.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/domains/howitzer src/engine/m17.ts src/tests/m17-engine.test.ts
git commit -m "feat: add howitzer M17 foundation"
```

### Task 7: Implement Minimum QE engine shell

**Files:**
- Create: `src/engine/min-qe.ts`
- Test: `src/tests/min-qe.test.ts`

**Interfaces:**
- Consumes: crest inputs, factor, elevation, fork
- Produces: `computeMinimumQe(input): { minQe: number; fireLocked: boolean }`

- [ ] **Step 1: Write the failing test**

```ts
import { computeMinimumQe } from '../engine/min-qe'

test('computeMinimumQe rounds up the result to whole mils', () => {
  const result = computeMinimumQe({ crestRange: 1000, crestAngle: 12, factor: 0.5, elevation: 210, fork: 18 })
  expect(Number.isInteger(result.minQe)).toBe(true)
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/tests/min-qe.test.ts`
Expected: FAIL because Minimum QE engine does not exist.

- [ ] **Step 3: Write minimal implementation**

```ts
// src/engine/min-qe.ts
interface MinimumQeInput {
  crestRange: number
  crestAngle: number
  factor: number
  elevation: number
  fork: number
}

export function computeMinimumQe(input: MinimumQeInput) {
  const angleB = Math.ceil(5 / (input.crestRange / 1000))
  const angleC = Math.ceil((input.crestAngle + angleB) * input.factor)
  const angle1 = input.crestAngle + angleB + angleC
  const angle2 = Math.ceil(input.elevation)
  const angle3 = input.fork * 2
  const minQe = Math.ceil(angle1 + angle2 + angle3)
  return { minQe, fireLocked: false }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/tests/min-qe.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/engine/min-qe.ts src/tests/min-qe.test.ts
git commit -m "feat: add minimum QE engine shell"
```

### Task 8: Implement document mode and first printable workflows

**Files:**
- Create: `src/app/layout/DocumentModeShell.tsx`
- Create: `src/domains/surveillance/documents/Form344201Document.tsx`
- Create: `src/domains/surveillance/documents/Form344202Document.tsx`
- Create: `src/domains/howitzer/documents/DeputyCommanderReportDocument.tsx`
- Create: `src/domains/howitzer/documents/CounterBatteryDocument.tsx`
- Test: `src/tests/document-mode.test.tsx`

**Interfaces:**
- Consumes: document store, domain document data
- Produces: printable document surfaces

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen } from '@testing-library/react'
import { DocumentModeShell } from '../app/layout/DocumentModeShell'

test('document shell renders printable content container', () => {
  render(<DocumentModeShell title="Report"><div>Printable Body</div></DocumentModeShell>)
  expect(screen.getByText('Printable Body')).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/tests/document-mode.test.tsx`
Expected: FAIL because document mode shell does not exist.

- [ ] **Step 3: Write minimal implementation**

```tsx
// src/app/layout/DocumentModeShell.tsx
import { ReactNode } from 'react'

export function DocumentModeShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section aria-label="document-mode">
      <h1>{title}</h1>
      <div>{children}</div>
    </section>
  )
}
```

```tsx
// src/domains/surveillance/documents/Form344201Document.tsx
export function Form344201Document() { return <div>ทบ.344-201</div> }
```

```tsx
// src/domains/surveillance/documents/Form344202Document.tsx
export function Form344202Document() { return <div>ทบ.344-202</div> }
```

```tsx
// src/domains/howitzer/documents/DeputyCommanderReportDocument.tsx
export function DeputyCommanderReportDocument() { return <div>Report รอง ผบ.ร้อย ป.</div> }
```

```tsx
// src/domains/howitzer/documents/CounterBatteryDocument.tsx
export function CounterBatteryDocument() { return <div>บขตป.</div> }
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/tests/document-mode.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/layout/DocumentModeShell.tsx src/domains/surveillance/documents src/domains/howitzer/documents src/tests/document-mode.test.tsx
git commit -m "feat: add document mode foundation"
```

### Task 9: Implement crater analysis foundation and document handoff

**Files:**
- Create: `src/domains/howitzer/crater/CraterAnalysisWorkspace.tsx`
- Create: `src/engine/crater.ts`
- Test: `src/tests/crater-engine.test.ts`

**Interfaces:**
- Consumes: angle inputs and azimuth
- Produces: `validateCraterGeometry`, `buildCraterSummary`

- [ ] **Step 1: Write the failing test**

```ts
import { validateCraterGeometry } from '../engine/crater'

test('validateCraterGeometry accepts right-angle plumb bob and equal trajectory angles', () => {
  expect(validateCraterGeometry({ angle1: 35, angle2: 35, angle3: 90 })).toBe(true)
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/tests/crater-engine.test.ts`
Expected: FAIL because crater engine does not exist.

- [ ] **Step 3: Write minimal implementation**

```ts
// src/engine/crater.ts
export function validateCraterGeometry(input: { angle1: number; angle2: number; angle3: number }) {
  return input.angle1 === input.angle2 && input.angle3 === 90
}

export function buildCraterSummary(input: { angle1: number; angle2: number; angle3: number; azimuth: number }) {
  return {
    valid: validateCraterGeometry(input),
    azimuth: input.azimuth,
    summaryStage: 'COUNTER_BATTERY_PART_1',
  }
}
```

```tsx
// src/domains/howitzer/crater/CraterAnalysisWorkspace.tsx
export function CraterAnalysisWorkspace() {
  return <section aria-label="crater-analysis-workspace">Crater Analysis</section>
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/tests/crater-engine.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/domains/howitzer/crater src/engine/crater.ts src/tests/crater-engine.test.ts
git commit -m "feat: add crater analysis foundation"
```

### Task 10: Verification pass

**Files:**
- Modify: any touched files for final fixes
- Test: all tests introduced above

**Interfaces:**
- Consumes: all previous tasks
- Produces: verified implementation baseline

- [ ] **Step 1: Run test suite for all introduced modules**

```bash
npm test -- src/tests/app-shell.test.tsx src/tests/role-visibility.test.ts src/tests/shared-stores.test.ts src/tests/fo-service.test.ts src/tests/fdc-service.test.ts src/tests/m17-engine.test.ts src/tests/min-qe.test.ts src/tests/document-mode.test.tsx src/tests/crater-engine.test.ts
```

- [ ] **Step 2: Run build**

```bash
npm run build
```

Expected: build completes successfully.

- [ ] **Step 3: Fix any failing module, rerun affected tests, then rerun build**

```bash
npm test -- <failing-test-file>
npm run build
```

- [ ] **Step 4: Verify locked OPSEC behavior in code review**

Check:
- FO visibility excludes FDC/Surveillance/Howitzer/Weapons panels
- FDC visibility includes FO outputs
- Document mode exists for ทบ.344 / Report / บขตป.

- [ ] **Step 5: Commit**

```bash
git add src
git commit -m "chore: verify operational foundation baseline"
```

## Self-Review

### Spec coverage
- Covers system runtime, auth, shared state, FO, FDC, Howitzer/M.17, Minimum QE, document mode, crater analysis, and verification.
- Leaves `บขตป.` field-level ownership unresolved by design, matching the current locked hold state.
- Leaves advanced weapons, full surveillance math, and full MET/firing-table production integration for later plan expansions after the foundation lands.

### Placeholder scan
- No `TODO`, `TBD`, or unresolved placeholders appear in the task steps.
- All code-changing tasks include concrete file paths and starter code.

### Type consistency
- Shared target, FDC service, and engine helpers use named files and explicit outputs.
- Role visibility types are defined before use.
- Document mode shell is defined before document components depend on it.

## Execution Handoff

Plan complete and saved to `design/2026-08-15-arty-v2-implementation-plan-v1.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
