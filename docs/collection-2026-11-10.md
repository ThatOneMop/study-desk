# Collection update — 10 November 2026

The collection now has 21 bundled games. This release adds two original games and improves each of the 19 previously listed games. Third-party Arcade providers remain disabled. The study lock and existing save keys remain intact.

## New games

- **Prism Post:** eight authored mirror-routing puzzles, live light tracing, lantern objectives, undo, hints, keyboard navigation and saved delivery stamps.
- **Orbit Orchard:** three arcade harvest seasons, orbital basket steering, fruit combos, thorns, shields, pause/restart and saved best scores. Keyboard, pointer and touch controls are included.

Both games work offline after loading their local assets and include the Study Desk bridge and original cover illustrations.

## Existing games

| Game | Change |
| --- | --- |
| Gummy Bay | Contextual tent guidance shows missing soil, watering equipment, harvesting tools and growth countdowns. |
| Autumn Drift | B sweeps the selected leaf toward the basket, respecting tool unlocks, weight and rooted-leaf rules. |
| Little Lake | Optional saved reel assist widens the catch zone and slows line loss. |
| Lost & Found | A touch-accessible Pinpoint toggle stays synchronized with movement and pause. |
| Moon Salvage | Rover/work-order navigation, highlighted order markers, payout preview and work-order retention on reload. |
| Tiny Wilds | Free worker retraining respects role unlocks and protects the final forager. |
| Forge Arena | Touch fire releases on cancellation, focus loss pauses battle, keyboard pause navigation and saved feedback-sound preference. |
| Roof Runner | Recall to the flag keeps parcels, costs a recovery and protects the final recovery. |
| Ashwake | Live boss health, bearing and distance display. |
| Winterfold | Touch Undo/Redo, corrected keyboard redo and saved edits. |
| Spanwright | Deletions, hinges, bolts, inspector changes and undo/redo save immediately. |
| Creekhold | Pinches and cancelled gestures no longer accidentally place or select tiles. |
| Lanewright | Redo button, history availability and saved history edits. |
| Harvest Protocol | Check code without moving drones, editor shortcuts and execution progress. |
| Numberworks | Production diagnostics with jump-to-machine inspection. |
| Packworks | Duplicate sale-value preview and consistent auto-selling after manual reveals. |
| Mycelium Yard | Free, deterministic next-night bed forecasts. |
| Bell Diver | Least-air return route, return-air budget and low-air warning. |
| Outbreak Atlas | Seeded next-month upgrade comparisons before spending points. |

The final collection uses catalogue dates for separate new and recently improved shelves, with no duplicate entries between those shelves.

## Verification

All 49 engine/DOM test scripts passed, along with catalogue integrity, local asset checks, Arcade generation parity and syntax checks for all changed/new JavaScript and inline scripts. Tests run from the repository root. Test dependencies are external development tools; the site remains buildless.

Focused regression coverage is in `tests/swarm-nature.cjs`, `tests/swarm-action.cjs`, `tests/swarm-action-ui.cjs`, `tests/swarm-builders-dom.cjs`, `tests/swarm-simulation.cjs` and `tests/swarm-new-engine.cjs` and `tests/swarm-new-dom.cjs`. Factory browser interaction coverage is in `tests/swarm-factories.cjs`; existing Numberworks, Packworks and Mycelium Yard engine suites also cover those games.

The full browser suite was not completed: this managed runtime has no supported browser-preview tool. Some factory interactions and partial builder interactions were checked in desktop/emulated-touch Chromium before that limitation was identified. Those checks do not establish visual verification of the full collection, physical-device support or multiplayer behavior. Engine and DOM checks cover the remaining interactions.

Deployment continues through the repository's existing GitHub Pages workflow after changes reach `main`.

## Second pass

The follow-up expands the collection to 23 games. **Tidal Switch** has six mail-boat puzzles with shoals, tide changes, locks, undo and saved seals. **Ember Keeper** is a four-wave tactical beacon defense with movement, melee attacks, spark pulses, repairs, guarding, undo and saved nights.

| Existing game | Additional gameplay or planning |
| --- | --- |
| Gummy Bay | Three optional notebook commissions track fresh work and award one-time cash/XP rewards. |
| Autumn Drift | Optional garden commissions distinguish hand-picking from basket collection. |
| Little Lake | Catch-and-release research trades creel value for grants and permanent casting range. |
| Tiny Wilds | Selectable royal banquets add colony goals and rewards. |
| Lost & Found | Lost-property returns consume requested satchel items for rewards. |
| Moon Salvage | Three selectable cargo manifests award one-time sector bonuses. |
| Forge Arena | Three timed optional combat contracts record completions. |
| Roof Runner | Optional timed, fall-free Express stamps preserve ordinary route rewards. |
| Ashwake | Emergency flare trades one shared redraw charge for damage, cleared bolts and brief protection. |
| Winterfold | Route inspection identifies missing outward and skill-appropriate return routes. |
| Spanwright | Road survey checks continuity/budget and focuses the unfinished endpoint. |
| Creekhold | Reserve forecasts estimate food/water shortfalls and select preparation buildings. |
| Lanewright | Shop inspection prioritizes queues and missing connections, then focuses matching houses. |
| Harvest Protocol | Research crop sensors to unlock `tend(crop)` for wait/harvest/replant automation. |
| Numberworks | Signed-number and remainder projects impose peak arithmetic-machine budgets. |
| Packworks | Trade same-shelf duplicates and coins for a missing card, retaining the final copy of each variant. |
| Mycelium Yard | Drainage costs coins and a job, then protects its bed against excess-rain rot. |
| Bell Diver | Sealed recovery forbids air pockets and adds three permanent badges. |
| Outbreak Atlas | Island Sprint requires all three islands before a 24-month deadline. |
| Prism Post | Eight longer Night Shift routes expand the campaign to sixteen without invalidating stamps. |
| Orbit Orchard | Timed harvest pulse widens the basket and wards thorns, with a six-second recharge. |

New `swarm-*-round2*.cjs` tests cover the added choices, migration, rewards and UI behavior. `tools/test-engines.py` runs all non-browser Node test scripts, and the existing Pages workflow now runs verification on pull requests and before publication. All 58 engine/DOM scripts passed, including a rerun after correcting a floating-point boundary in the random-selection test. Asset/catalogue checks, Arcade parity, workflow YAML and 72 changed/new script syntax checks passed. This second pass did not run browser tests because the supported managed preview tool remains unavailable.

## Reconciliation with the concurrent main release

Main received a separate 19-to-24-game release while this branch was in development. This branch merges that release and retains its five games: Orbital Drop, Lanebound, Chaos Court, Pocket Golf and Corebreaker. The combined catalogue has **28 games**. That release's notes remain in `docs/swarm-release-2026-11-10.md`.

Conflicts were reconciled per game, preserving both sets of changes. This includes reset isolation in Harvest Protocol and Packworks, save recovery and timing fixes in the builders, curfew cues in Gummy Bay, input cancellation and pause behavior, and the local two-player filter and newest sorting. Bell Diver uses one numeric-cell return-route API for both the full trail and next-step highlight. New regression coverage checks cross-feature behavior, stale controls in the merged games, and Corebreaker's upgrade keyboard focus.

Final asset checks cover all 28 routes and 127 HTML asset references, with no missing references. All 75 combined engine/DOM test scripts passed, including both releases’ regression suites and the merge-specific input/focus checks. Merged JavaScript syntax and whitespace checks passed. This reconciliation did not run browser tests.
