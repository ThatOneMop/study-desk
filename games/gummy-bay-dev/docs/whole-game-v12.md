# Gummy Bay v12 — implementation and verification ledger

Starting source: v11, commit `627b2e2d7c11ad898e5986c8adb24e115ce72d5d`. Existing Blender graphics, expanded town, six story/free-play slots and peer-to-peer co-op retained. No player saves were cleared. This is a tested reliability and usability update, not certification of the complete requested polish pass.

## Audit: present code versus requested ideas

Present before this update: $400 RV opening and jailed Gramps phone story; renting, seeds, soil, watering, harvesting, processing, packaging, mixing, negotiation and deliveries; three properties; helpers; cash/card/ATMs/recycling; six local slots and backup import/export; two-peer host-authoritative state; basic police line-of-sight/pathfinding/searches; driving and carrying empty crates; Blender environment and seven-clip characters.

Observed weaknesses: incorrect $20 can instruction (actual $15), trimmers introduced after they are needed; direct-line customers obstructed by buildings; helpers have no product/tent/storage assignment or specific stopped-state feedback; no upgrade-enabled hands-on batching; unlimited property storage; destination-only van collision checks; unsequenced remote commands, insufficient remote proximity checks and primitive late-joining guest avatar; no real character mesh LOD or separate audio mix.

Requested ideas that are **not** present as complete systems: physically routed staff collecting supplies and carrying sale stock; material cargo crates and vehicle cargo loading; rich conversational NPC routines; complete economic simulation/balance across hours of play; professionally authored soundscape; verified network fairness under hostile clients. These are not represented as completed features below.

## Prioritised checklist and completion tests

| Priority | Item | Completion test | Result |
|---|---|---|---|
| P0 | Preserve opening and saves | Fresh state exactly $400; starter purchases leave $50; first sale pays agreed price; six slots and legacy migration retain stock/cash | Automated pass |
| P0 | Clear tutorial prerequisites | Can $15, trimmers and packaging station introduced before production; seed step needs soil; wrapper/trimmer reminders point to correct shop | Implemented; rendered readability unverified |
| P0 | Recovery and optional guidance | Repeatable shift pays $35 to card; guide can be hidden/resumed without resetting progress | Shift automated pass; guide UI code checked |
| P0 | Transactional batch upgrade | Cancel consumes nothing; four-unit shape/pack commits exact quantities; shortage rejects whole batch | Automated pass |
| P0 | Staff assignments and real supplies | Assigned product is processed; output goes to chosen stock; no wrappers/full stockroom stops work; reserved deliveries remain untouched | Automated pass |
| P0 | Preserve existing excess stock | Reload retains inventory; capacity blocks new harvest without deleting crop or goods | Automated pass |
| P0 | Co-op duplicate protection | Same sequenced command received twice charges once; both receipts returned; distant purchase and invalid pose rejected | Actual handler tested with simulated ordered channel |
| P0 | Disconnect protection | Guest action denied after disconnect; guest never writes personal save slots | Automated pass |
| P1 | Customer routing | Obstructed destinations use cached grid routes with at most one path search per update; routines still move and replicate | Regression pass for movement; full town route inspection blocked |
| P1 | Transport | Swept van footprint cannot cross a building; acceleration, braking and stationary exit retained | Automated pass |
| P1 | Police | Existing tutorial grace, wall occlusion, search, confiscation, protected storage/bank and capped fines retained; nearby unobstructed sprint/van noise draws attention | Existing police regression pass; hearing and vehicle encounter feel unverified |
| P1 | Save/reload expanded business | Property moves, upgrades, installed equipment, helper switches and assignments persist | Automated pass |
| P1 | Late co-op avatar | Guest added after initial asset loading receives loaded character template | Implemented; real two-browser session unverified |
| P2 | Blender LODs | Three editable low rigs export valid UVs/normals, 14 bones and all seven clips; near/far runtime swap uses same materials | Actual GLTFLoader tests pass; Blender export render inspected |
| P2 | Audio and diagnostics | Master/effects/ambience controls persist, ambient starts after gesture; optional frame interval/draw/triangle display | Persistence tested; browser audio and renderer output unverified |
| P2 | Actual visual comparison | Matching camera/time before and after in playable browser; check scale, clipping, materials, animation and night readability | BLOCKED: supported browser-control skill unavailable |
| P2 | Intel laptop benchmark | Controlled loading, frame-time and renderer measurements on target Yoga | BLOCKED: target hardware/browser unavailable |
| P2 | Two-player playthrough | Simultaneous equipment/purchases, police/appointments/vehicles, disconnect/rejoin on two browsers | BLOCKED: browser sessions unavailable |
| P2 | Publish update | Push exact source, package same commit, production deployment reaches succeeded | Checked through Sites deployment status after packaging |

## Changes and technical limits

- Batches of four unlock with the existing press upgrade. Stock is checked at completion; cancelled tasks retain supplies. Manual one-unit operations remain available.
- Gardener can target one installed tent or all, and a product. Water consumes the can reservoir; free refilling represents the existing free sink. Crafter chooses product and carried/stored destination; seller chooses stock source/product and protects outstanding orders. These are inventory simulations, **not** physically navigated staff supply runs.
- Goods limits are 64/256/640 across raw, loose, carried and stored goods; stockroom pack limits are 40/160/400 by property. Existing excess goods survive migration. Expansion now has capacity value as well as tent capacity.
- Order cancellation explicitly releases reservations. Expiration still affects relationships. Existing payment, ATM and recycling behaviour is preserved.
- Customer routes reuse the existing obstacle-aware grid. The grid is coarse and bounded; some complex routes may fail rather than walking through walls. Path searches are staggered and cached.
- Co-op uses ordered reliable WebRTC channel sequence IDs and receipts. Host rejects transactions away from their relevant station. This prevents accidental repeats and many invalid interactions; it is not an anti-cheat boundary. No relay server was added.
- Position recovery only applies inside blocked geometry, outside police encounters, and returns the host/solo player to a last clear point. It is not a general fast-travel feature.
- Character LOD switch thresholds: Performance 14m, Balanced 25m, High 45m, with 2m hysteresis. Existing distance culling remains. Low rigs reuse the full rig's material instances and use the same seven animation clips. Low rigs omit blink morphs; near rigs retain them.
- Ambient audio is an original synthesized soft wind bed attenuated around the current property. Existing synthesized footsteps/action tones use the effects slider. This is not a complete environmental sound library.

## Measurements, not FPS claims

Each full character: **15,756 triangles**, 907,220 bytes.
Each low-detail character: **5,040 triangles**, about 346 KB.
Geometry reduction for the selected low-detail body: **68.0%**. All three low assets add approximately **1.04 MB** to the download and consume additional memory. There is no measured loading-time or frame-rate improvement; CPU animation, draw calls, buildings and device GPU remain relevant. The in-game diagnostics display rolling frame intervals and renderer counts, not GPU timing or a controlled benchmark. Balanced remains the default.

Exact figures: `art/v12/lod-measurements.json`. Editable Blender sources and reproduction scripts: `art/v12/`. Full v11 sources retained.

## Verification method and remaining work

`node art/v12/test-integration.cjs` executes the real game code and actual GLTFLoader with Three.js objects, using stubbed DOM/WebGL rendering. It covers the opening-to-sale loop, upgrades, property relocation, automation, migrations, six save slots, movement/collision logic, police and new v12 transactional tests. Tests advance clocks directly; this is not a human-paced playthrough. `node art/v12/check-lod.mjs` validates exported mesh data and animated bounds. `art/v12/exported-lods.png` is asset validation only.

The Sites workflow in this managed environment requires the unavailable control-browser skill for preview/browser inspection. No substitute browser/server path was used. Actual playable before/after screenshots, audio listening, foot sliding/animation transition judgement, UI layout judgement, night readability and target-device performance remain unverified. These checks must precede claiming complete polish. Broader district art refinement, physical logistics, richer conversations and long-session economy balancing remain unfinished.
