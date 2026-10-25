# Gummy Bay research (v121 export)

This replaces the earlier v18 research note. It is the Schedule I research shipped with the v121 source. The rest of the v121 notes, including per-version overhauls and test evidence, are in `games/gummy-bay-dev/docs/`. That folder is not published to GitHub Pages.

# Schedule I research and Gummy Bay implementation

Reviewed 19 October 2026. Gummy Bay keeps its original characters, town, fictional food products, $400 starting cash and separate story/free saves.

## Sources and confidence

- Developer description and feature list: https://store.steampowered.com/app/3164500/Schedule_I/
- Developer press kit: https://www.scheduleonegame.com/presskit/schedule-one/index.html
- Developer updates, including lighting, LOD, interaction, NPC and physics optimisation notes: https://steamcommunity.com/app/3164500/allnews/
- Equipment price cross-check: https://thebackdash.com/gaming/all-stores-and-items-price-list-in-schedule-1/
- Equipment price cross-check: https://schedule-1.fandom.com/wiki/Items
- Weekly ATM limit corroboration: https://steamcommunity.com/sharedfiles/filedetails/?id=3654142736

The official sources describe a first-person production/distribution business loop, property expansion, hired workers, vehicles and cooperative play. Developer notes describe interaction physics, NPC ragdolls, thrown props, lighting/shadow work and distance-based optimisations. They do not provide authoritative acceleration, jump velocity, gravity or exact shader settings. Gummy Bay's movement values are therefore original tuning, not measurements from Schedule I.

Some unofficial guides contradict each other. The generic newbie wiki page lists different prices from the dedicated item table. The equipment prices below use agreement between the item table and the independent price list. No extracted game code, copyrighted game models, voice lines or music are used.

## Applied equipment reference values

| Equipment | Gummy Bay price |
| --- | ---: |
| Grow tent | $100 |
| Watering can | $15 |
| Soil, one use | $10 |
| Harvest trimmers | $10 |
| Packaging station | $100 |
| Wrapper | $1 |
| Mixing station | $500 |

The custom starter route costs $350: $75 room, $100 tent, $15 can, $10 soil, $30 fictional Pine Pop seed, $10 trimmers, $100 packaging station and $10 wrappers. It leaves $50 from the user's requested $400 start. Established saves retain their equipment access and existing balances. The weekly in-game ATM deposit allowance is $10,000, resetting every seven game days; withdrawals do not consume it.

## Play-feel changes

- Accelerated movement and braking, axis collision sliding, gravity-driven jump, crouched eye height and slower crouch movement, mild sprint FOV change.
- Original 3D close-up workstation with manual pouring, dragging, stirring, harvesting and wrapping gestures. Commit resources only after every required step; cancelling consumes nothing. Helpers retain automated processing.
- Customer flavour preferences, relationships, samples, budget adjustments and a three-game-hour appointment deadline. Deadline duration and relationship formulas are original balance choices.
- Context interaction prompts constrained by the player's facing direction.
- Original synthesised footsteps and completion sounds; optional mute.
- More compact dark interface treatments. Existing Blender architecture, local material reflections, soft shadows and optional ambient occlusion remain in use.

## Scope and verification

This is an independently implemented browser adaptation. Basic driveable delivery vans, scheduled customer walking, repositionable tents, stockrooms, worker controls and carryable/throwable parcel crates are now implemented. These use lightweight original simulation. Full rigid-body simulation, combat, traffic, deep NPC routines and the complete original game's content are not implemented. The existing two-player co-op is peer-to-peer and has not been tested between real devices.

Syntax and runtime checks cover economy, manual task commit/cancel, relationships, deadlines, bank limits, legacy migration, movement, saves, map routes and production. The actual rendered browser scene is not verified in this environment. Blender asset previews were inspected in the previous graphics pass.

## v9 implementation and verification checklist

- [x] Original Blender delivery van, 940 triangles; GLB loads through the actual game loader.
- [x] Fleet purchase, acceleration, steering, braking, collision probes, safe stopped exit and saved parking.
- [x] Tent placement/rotation with boundary and overlap checks; moving preserves crop state.
- [x] Property stockrooms; reserved orders cannot be stored accidentally.
- [x] Individually pause/resume hired workers.
- [x] Customer destination routines, leg animation, moving map tracking and shared positions.
- [x] Empty parcel props: carry, throw, gravity, ground bounce and wall checks.
- [x] RV entrance ramp and floor height.
- [x] Existing-save defaults for all added fields; six isolated save slots retained.
- [x] Automated logic regression: $400 opening, $350 starter route, planting through first sale, mixing, upgrades, automation, saving/loading, reservation protection, vehicle and prop interactions.
- [x] Blender asset render inspected.
- [ ] Actual browser visual inspection and complete human-style tutorial playthrough: supported browser capability unavailable.
- [ ] Two-device multiplayer test: unavailable in this environment. Replication logic exists but is not end-to-end verified.
- [ ] Intel laptop frame-time and memory measurements: device unavailable. Balanced rendering remains the default.
- [ ] Full terrain/stair physics, sophisticated NPC navigation, traffic and comprehensive commercial-scale content.

The automated tests instantiate Three.js scene objects with a mocked renderer and DOM. They verify logic, not browser rendering, shader compilation, input usability or frame rate. The van costs $750 at level 2 as original Gummy Bay balance, not a claimed Schedule I price.

## v10 police gameplay

Six uniformed bobblehead patrols use sight checks, proximity suspicion, stop commands, pursuit, nearby backup and timed body searches. H complies. Detection, pursuit speed and fines are original balance values. Witnessed sales immediately trigger pursuit; routine searches activate after the first gummy is made. Searches remove carried raw/loose/packaged gummy products, cancel outstanding orders and charge a cash-only fine capped to the wallet. Stored packs, equipment, seeds and bank balances are preserved. Shared co-op inventory means either player's search affects the business. Release provides 50 seconds of grace; loss of sight ends pursuit after 18 seconds.

Automated tests passed for tutorial grace, detection, compliance, seizure, reserved-order cleanup, protected storage, clean searches, capped fines, wall occlusion, lost-sight pursuit, remote compliance and saved police state. Pathfinding work is bounded and cached. Browser visuals, difficulty in actual play, Intel frame times and real two-device synchronisation remain unverified.
