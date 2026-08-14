# Dashboard Scaffold Spec — SILENTARC / ARTY V.2

Status: approved design scaffold for first static build

## Scope

This file defines the first Dashboard shell only.

Included:
- dashboard shell anatomy
- visual token direction
- zone composition
- placeholder policy
- presentation-only state hooks

Excluded:
- auth logic
- admin implementation
- business workflow implementation
- real data integration
- GSAP runtime
- Three.js / Spline rendering
- permanent 5-domain + 1-shared-layer placement

## Design context

- Audience: owner/admin-led operations with future role-based users
- Use case: multi-workflow operational dashboard with FO + FDC visible by default and shared cross-domain support surfaces
- Tone: utilitarian base + technical language + austere premium finish

## Shell anatomy

The dashboard uses a workspace-centric shell with a persistent shared operational support layer.

Layers:
1. Top Command Rail
2. Primary Domain Workspace
3. Shared Tactical / Common Spatial View
4. Shared Support Rails

## Spatial principle

This is not a map-centric full-screen board.

The page must:
- keep FO and FDC visible together in the default overview
- keep the shared tactical view central and cross-referenced
- keep shared status, telemetry, and event rails persistent
- avoid generic left-sidebar dashboard conventions

## Zone map

The first scaffold contains 8 zones:

1. Top Command Rail
2. Identity / Mode Switch Cluster
3. Primary Operations Stack
4. Shared Situational Panel
5. Live Status / Alert Stack
6. Workflow Snapshot Panel
7. Telemetry / Graph Placeholder
8. Event / Audit / Override Rail

## Zone contracts

### Z1 Top Command Rail
- system identity
- environment
- session state
- global actions
- compact alerts

### Z2 Identity / Mode Switch Cluster
- current role / current mode
- high-level context switching
- placement legend
- screen behavior legend

### Z3 Primary Domain Workspace
- default owner: FO
- primary active workspace in the default overview
- may be promoted to another full domain by behavior rules
- visibility state does not change architecture classification

### Z4 Shared Tactical / Common Spatial View
- shared tactical map and common spatial view only
- not the entirety of the shared layer
- cross-domain spatial context surface
- must look live-ready even without real feed

### Z5 Live Status / Alert Stack
- shared global safety/status summary
- cross-domain readiness state
- recent priority alerts

### Z6 Secondary Domain Workspace
- default owner: FDC
- secondary active workspace in the default overview
- may be promoted to another full domain by behavior rules
- visibility state does not change architecture classification

### Z7 Shared Technical Readout
- shared technical readouts
- shared mission timing / technical values
- 2D placeholder only in current prototype

### Z8 Event / Audit / Override Rail
- shared event log
- shared notifications / alerts
- shared report / export cues
- these are related but not the same architectural object

## Reading order

Expected scan path:
1. top rail
2. FO + FDC workspaces
3. shared tactical/common spatial view
4. shared status / alerts
5. shared telemetry / event rails

## Placeholder policy

Placeholder panels are not empty boxes.

They must contain:
- panel title
- status label
- grid or coordinate texture
- operational framing text

They must not contain:
- fake business data
- fake 3D renders
- fake chart stories

## State model

Interactive baseline states:
- default
- hover
- focus-visible
- active
- disabled

Operational surface states:
- loading
- stale
- live
- warning
- critical
- locked

## Architecture semantics

- FO and FDC are the default top-tier visible pair
- Surveillance, Howitzer, and กระสุน are full operational domains, not subordinate tools
- active, staged, and on-call are visibility states only
- visibility states do not determine architecture classification
- Surveillance is a domain
- Tactical Map / Common Spatial View is shared operational data/capability
- these must not be treated as the same thing

## Motion readiness

This phase does not install GSAP.

The scaffold may include:
- data attributes for future motion hooks
- semantic panel IDs
- reduced-motion rules

The scaffold must not include:
- package imports
- runtime animation dependencies

## Deliverables

First build set:
- design/dashboard-scaffold-spec.md
- design/tokens.silentarc.md
- src/dashboard-shell/dashboard-shell.html
- src/dashboard-shell/dashboard-shell.css
- src/dashboard-shell/dashboard-shell.js

## Asset usage rules (reference layer only)

The current reference asset set must be interpreted by role before implementation.

### Domain identity assets

- `references/FO.png` = FO domain identity asset
- `references/FDC.png` = FDC domain identity asset
- `references/Surveillance.png` = Surveillance domain identity asset
- `references/Howitzer.png` = Howitzer domain identity asset
- `references/Weapons.png` = กระสุน domain identity asset

These files are identity/logo assets by default.
They may be used in:
- workspace switchers
- domain labels
- login/domain selection surfaces
- page-level domain identity blocks

They must not be treated as full-page backgrounds by default.

### Page identity / hero assets

- `references/Admin.webp` = Admin/OWN page identity or hero asset
- `references/MAIN.webp` = Dashboard page identity or hero asset

These files may be used for:
- page hero treatment
- page header image treatment
- login / entry surface branding

They must be reviewed for readability before being used behind text.

### Background asset

- `references/BG.png` = global atmosphere/background asset

This file may be used as:
- app shell atmosphere layer
- login background
- dashboard background support image

It must remain subordinate to readability and panel contrast.

### Reference-only asset

- `references/360_F_315894483_EjiMpP1Qnh2ptP4doZfLsYACsCns0M04.jpg` = reference-only visual source

This file must be treated as:
- moodboard
- style reference
- supporting visual inspiration

It must not be treated as a production UI asset by default.

### Asset role separation rule

- logo/identity assets are not full-page background assets by default
- hero assets are not repeated domain icons by default
- background assets are not primary information carriers
- reference-only assets are not production assets until explicitly approved
