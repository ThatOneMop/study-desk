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

The collection's recently improved shelf now uses catalogue dates, prioritizes new additions and shows up to eight games.

## Verification

All 49 engine/DOM test scripts passed, along with catalogue integrity, local asset checks, Arcade generation parity and syntax checks for all changed/new JavaScript and inline scripts. Tests run from the repository root. Test dependencies are external development tools; the site remains buildless.

Focused regression coverage is in `tests/swarm-nature.cjs`, `tests/swarm-action.cjs`, `tests/swarm-action-ui.cjs`, `tests/swarm-builders-dom.cjs`, `tests/swarm-simulation.cjs` and `tests/swarm-new-engine.cjs` and `tests/swarm-new-dom.cjs`. Factory browser interaction coverage is in `tests/swarm-factories.cjs`; existing Numberworks, Packworks and Mycelium Yard engine suites also cover those games.

The full browser suite was not completed: this managed runtime has no supported browser-preview tool. Some factory interactions and partial builder interactions were checked in desktop/emulated-touch Chromium before that limitation was identified. Those checks do not establish visual verification of the full collection, physical-device support or multiplayer behavior. Engine and DOM checks cover the remaining interactions.

Deployment continues through the repository's existing GitHub Pages workflow after changes reach `main`.
