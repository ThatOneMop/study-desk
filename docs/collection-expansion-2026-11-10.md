# Collection expansion — 10 November 2026

The GitHub catalogue grows from 19 to 27 bundled games. Eight compact original browser games cover the requested genres: Orbital Drop, Lanefall, Basket Chaos, Volley Chaos, Soccer Chaos, Pocket Golf, Pegworks and Demolition Yard. Code and illustrated covers are included. No proprietary reference-game code or assets were imported. Creator names and commercial titles are search aliases for genre discovery, without endorsement claims.

The collection has New games and Updated tags, an eight-game arrivals shelf and a shelf for all 19 improved games. Gummy Bay remains the management game; Packworks remains the card-pack game. Existing save keys and the study lock/PPP switching behaviour are preserved.

## Existing-game changes

| Game | Change |
| --- | --- |
| Gummy Bay | Detect and protect a newer save from another tab; retain export/reload recovery. |
| Autumn Drift | Hold B to sweep a selected loose leaf toward the basket. |
| Little Lake | Pause casts safely with Escape or focus loss. |
| Lost & Found | Filter detector targets to missing journal entries. |
| Moon Salvage | Preview haul payout, order bonuses and combo; highlight work-order markers. |
| Tiny Wilds | Pause both modes on Escape or focus loss. |
| Forge Arena | Release stuck fire/movement and pause on focus loss; stable Escape and touch cancellation. |
| Roof Runner | Recover to a checkpoint with R; retain parcels and respect the recovery limit. |
| Ashwake | Clear held movement during pause, draft and lost touch capture. |
| Winterfold | Freeze the clock under dialogs, persist undo/redo, and cancel interrupted gestures. |
| Spanwright | Persist edit/undo/hinge/piston changes and preserve the design during physics tests. |
| Creekhold | Isolate dialog shortcuts; clear held keys and pause on blur. |
| Lanewright | Cancel interrupted road gestures; save/pause on blur; safe undo shortcuts. |
| Harvest Protocol | Pause/resume programmes; cancel stale async runs on reset. |
| Numberworks | Preserve redo on rejected placements; stable pause and Mac redo shortcuts. |
| Packworks | Search, exact variant and duplicate filters; shelf-safe fusion; clean reset/import. |
| Mycelium Yard | Preview each bed's evening outcome and confirm risky day endings. |
| Bell Diver | Load-aware minimum-air route home, air margin and next direction. |
| Outbreak Atlas | Pause Watch under overlays/background; Continue reads the latest save. |

## Verification

`node tests/collection-expansion.cjs` runs the behavioural regression suites with jsdom 26 available through NODE_PATH. It covers each new game and all existing-game change groups. Existing engine, economy, save, study, launcher and input regressions were also run. `tests/assets.py` checks all bundled routes and local HTML references; `tests/selected-indie.py` checks catalogue parity, bridge integration, credits and active folders. The disabled providers remain disabled.

Rendered browser QA is unverified: the managed Sites environment did not expose its required cua_repl.js tool. DOM tests use canvas/audio stubs. Simulation outcomes do not establish visual layout quality, physical-device compatibility or human enjoyment.
