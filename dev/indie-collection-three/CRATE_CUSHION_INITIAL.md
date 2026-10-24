# Crate & Cushion — initial prototype
25 October 2026. Candidate **45**, fifth of the third collection's fifty slots.
[Implementation 56bba933abc8a6c8b389619d17db74592f806af0](https://github.com/ThatOneMop/study-desk/commit/56bba933abc8a6c8b389619d17db74592f806af0).

## Implemented
Fit four rectangular parcels into a tray with wooden braces. Rotate parcels, reposition them, or lift them out. The telescope needs at least two shared edges with foam and no shared edges with the toolbox; blankets can separate the cargo. Corner contact does not count. Seal only when all parcels fit and protection rules pass.

Three authored jobs vary tray dimensions and brace placement. Dispatch unlocks the next job; records track fewest placements/lifts. This is a spatial packing/adjacency puzzle, distinct from Counterweight's crane movement, sway, stacking and ballast mechanics (source inspected before implementation). Original CSS tray/parcels, fit preview, live rule counts, keyboard anchor movement/rotation/placement, tap controls, pause, onboarding, cancellable restart/reset and validated saves are included.

There is no timed failure or forced loss: invalid fits are rejected without changing progress, and players can undo/repack. Existing games and saves are unaffected.

## Evidence
`NODE_PATH=/tmp/crate-deps/node_modules node --test tests/crate-cushion-engine.cjs tests/crate-cushion-dom.cjs`: **8 passing checks (5 engine + 3 DOM)**.

Engine: all three legal packing solutions, seals, unlocks and save round trips; braces/bounds/overlaps; shared-edge rules; remove/undo/repack and records; malformed settings/journals. DOM: every job through controls with repeated reloads; keyboard anchor, rotation and placement; pause, undo and cancelled restart; corrupt-save protection/recovery, isolated reset, guide cancellation and Games href. Syntax, local asset references and catalogue exclusion also pass.

No full repository build/preservation suite was run from the partial checkout. Scope consists of the new game, tests and third-batch documentation; the public catalogue and prior collections remain untouched.

## Quality gate
**Initial prototype, not a finished selection.** Three compact jobs each admit a four-placement solution. No long-play, difficulty, human-enjoyment or native-touch claim is made. The existing browser-policy blocker was not retried or bypassed; no screenshots or rendered tests were produced. CSS sizing is prepared for narrow screens but remains visually unverified.

Third batch: **5 built / 0 improved / 0 browser-tested / 0 integrated / 0 verified live**, exactly 50 slots. Second batch remains 20 initially complete, with **6/20 additional upgrades verified**.

Next: play the actual rendered packing loop, inspect previews/labels/phone controls and evaluate depth; implement a substantive playtest-led upgrade; verify progression, undo/repack, saves/reload, reset and real navigation before any catalogue promotion.
