# Five graphics overhaul stages — 23 October 2026

Baseline: published v109 / 1d34bd083e4b12b6eb111bd5b4a83ad8f240e85d.
Governing brief: the original 30-point tracker in `overhaul-30-points.md`.
These are five implemented graphics packages in one release, not five completed repetitions of every criterion, and not completion of the old 51-pass task.

## 1. Coastal light, atmosphere and surface finish

Replaced the sky shader with drifting four-octave cloud layers, warm directional haze and night stars. Replaced the ocean shader with depth-coloured shallows, moving crests, distance-filtered foam and restrained glints. Both retain the existing authoritative clock, fog distances and tone mapping. Applied bounded world-space patina to selected architectural materials; residents, text and transparent panes are excluded. No extra point lights or postprocessing targets.

## 2. A complete building envelope

All 60 expanded-town buildings receive side and rear floor/window rhythms, framed panes and mullions, rainwater goods, roof edges, wall courses and weatherboard window boxes. 9,870 elements use four shared instance batches. Upper-floor elements use the actual upper-storey setback. Every part remains inside its existing blocked building footprint; no road, shop entrance or collider changes. Window emission follows night lighting. These are scenic building windows, not newly traversable rooms. Performance retains the structure and window batches and omits fine trim/planters.

## 3. Coastal landscape

160 trees, 480 layered crowns, 240 tidal rocks and 1,100 dune-grass blades use four shared batches. Deterministic placement stays outside playable bounds, with animated bounded wind deformation for crowns and grass. Performance omits grass and halves crown count. Existing town vegetation, landmarks and original environment GLBs remain. This is a major perimeter landscape layer, not an expansion of the playable map.

## 4. Residents and physical workspaces

Four everyday garment treatments add vest seams/pockets, striped shirts, straps and buttoned work shirts to non-police, non-vendor residents. They follow the real actor transforms and reuse one dynamic batch; existing role outfits remain. One reusable soft contact-shadow batch grounds visible residents. All three homes gain tile backsplashes, brushed bench markings, mould stacks and a packing ruler within existing table/wall space. Home visibility follows ownership and active property. Decorative moulds are equipment props, not invented stock. Actual stock displays and the original hands-on work remain authoritative.

## 5. Coastal interface

Reworked the entire interface palette around dark teal, warm paper and brass, including objectives, quick slots, money/time, minimap enclosure, prompts, modal menus, contacts, deliveries, staff cards, progress, workshop panels and the title menu. The phone receives a distinct physical shell, status strip, message bubbles and larger navigation keys. Existing handlers, key bindings and touch layouts remain; reduced-motion styling is provided.

## Original 30-point mapping

| Point | Graphics response in this release |
|---|---|
| 1 In-world business | 4: bench finishes and supported craft props; real inventory preserved |
| 2 Shared setting | 1–5: coherent coastal palette and materials |
| 3 Simple readable art | 2–4: facades, layered silhouettes and garment motifs |
| 4 Coherent people | 4: garments and contact grounding; original animated rigs retained |
| 5 Character identity | 4: four everyday clothing treatments alongside existing vendor identities |
| 6 Recurring roles | 4: role outfits preserved; no changes to routines |
| 7 Everyday activities | 4: existing held props and animations preserved |
| 8 Person-first dialogue | 5: contact/conversation panel styling |
| 9 Town depth | 1,3: atmosphere and perimeter canopy/rock layers |
| 10 Connected roads | 2,3: verified additions outside walkable routes; road network preserved |
| 11 Landmarks | 2,3: existing landmark systems retained; no claim of navigation playtesting |
| 12 Vegetation | 3: windbreak trees, layered crowns and dune grass |
| 13 Building depth | 2: full building envelopes and upper-storey alignment |
| 14 Materials | 1,2,4: patina, window finish, bench and tile treatments |
| 15 Lighting | 1,2: sky/water and clock-driven scenic windows |
| 16 Activity-led interiors | 4: workspace-specific bench, packing and wall details |
| 17 Physical stock | 4: existing inventory-derived displays retained, no fake stock added |
| 18 Hands-on work | 4,5: workbench presentation and task panels |
| 19 Varied work | 5: preserved varied gestures and restyled work feedback |
| 20 Useful upgrades | 4: existing ownership gates preserved; no balance changes |
| 21 Hotbar | 5: quick-slot framing and selection states |
| 22 Money | 5: warm money typography and transaction feedback styling |
| 23 Phone | 5: full handset surface styling |
| 24 First-person presence | 1–4: world-space visuals; camera controls unchanged |
| 25 Travel | 2,3,5: visible surroundings and driving/map panels |
| 26 Growing responsibility | 4,5: all-home presentation plus crew/order cards |
| 27 Pressure | 5: existing enforcement HUD/actions retained |
| 28 Humour | Existing Gramps/story dialogue retained; no new writing claimed |
| 29 Technical coherence | 93 test files pass; 81 browser modules parse/link |
| 30 Unified experience | Five integrated packages; rendered playthrough still required |

## Verification and limits

- All 93 files under tests executed successfully, including the module graph and real-GLB integration fixtures.
- New graphics regression checks finite transforms, all-60-building coverage, every new facade component inside its original solid site, scenic placement outside playable bounds, deterministic geometry, quality/day/night switches, ownership/title visibility, unchanged state and reusable resources.
- Existing full-game tests retain v3 saves, $400 start, separate story/free slots, production, routes, police, vehicle physics, guest-save isolation and replay handling. DOM/WebGL and network channels are mocked in these tests.
- The supported browser preview was attempted. It displayed “Error creating WebGL context” before game initialization. No browser settings were changed or access controls bypassed.
- No rendered 3D, actual shader compilation, visual clipping/contrast acceptance, real-device FPS or live two-client multiplayer signoff. Blender was not used. GPU cost must be measured on a real rendering device.
- The old completion ledger is not incremented as a finished full pass. This release implements the five packages but does not close the original 30-point acceptance gates.
