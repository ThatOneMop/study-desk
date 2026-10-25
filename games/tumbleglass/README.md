# Tumbleglass

Third collection slot 50. Original simultaneous sliding-bead puzzle, unlisted development prototype. Three compact trays use two, then three numbered glass beads. Tilt moves the edge-most bead first; beads slide until obstructed, locking immediately in their matching socket. A settled bead becomes a permanent obstacle. Wrong sockets are traversable. A single-use clamp can hold one loose bead still for one tilt while the others move. Choose whether and when to spend it; no-op tilts do not consume it, and undo/retry restore it. Choose the settling order, undo freely and optimize best tilt counts.

Pure deterministic engine, original CSS glass art and native buttons; no runtime package or third-party assets. Arrow keys work on the page/tray, while form controls keep native keys. All buttons have minimum 44px height; mobile styles use a two-column direction pad. Actual rendering, touch and native activation remain unverified. Pause and same-origin parent-hide messages guard inputs. No timer or lives. Retry requires confirmation and preserves records.

Only `study-desk-tumbleglass-v1` is written. Old string-only v1 journals remain readable without migration. New clamp moves store {dir, hold}; replay enforces single use and validates both fields. Save contains a replayed move journal, current tray and local best records. Decoder rejects no-op journals, moves after a win, invalid unlocks, missing winning records and oversized input. The 300-move bound protects storage, not a gameplay target; undo/retry remain available. Corrupt saves stay intact until recovery/reset confirmation; storage failures permit a temporary session. Local records are not authenticated scores.

## Checks

`node --test tests/tumbleglass-engine.cjs`

`NODE_PATH=/path/to/node_modules node --test tests/tumbleglass-dom.cjs` (jsdom 26.1.0).

Eleven tests pass: six engine and five DOM. Exhaustive reachable-board checks cover 8/32/37 states; shortest solutions are 3/5/5 tilts. Campaign handlers, every-tilt saves/reload, unlocks, collisions, in-transit socket locking, immutable input, undo/records/retry, malformed journals, keyboard focus guards, pause/parent hide, reset isolation, recovery and storage failure are covered. Additional clamp tests cover distinct assisted routes through all trays, one-use/locked-bead/no-op constraints, object-journal ownership, exact reload/undo, selector focus and pause/dialog guards. Dialog APIs are simulated. Both gameplay scripts pass syntax checks.

These are small initial puzzles, not substantial content-hour claims. Source implementation and engine/DOM testing do not count as a rendered improvement pass. Next: play naturally on desktop/touch, inspect screenshots and feedback, assess settling-order clarity and puzzle depth, then implement a substantive playtest-led upgrade before any catalogue integration. Full repository build checks have not run from the partial checkout.

## Pending source refinement — 26 October

Before: every tilt moved all loose beads, leaving no per-bead intervention. After: one clamp offers a choice of bead and timing, with undoable resource use. Assisted routes alter actual bead positions and solve all three trays in 3/5/5 tilts; the legacy routes remain valid. This comes from source/engine/DOM inspection, not rendered play, and does not earn the required improvement-pass credit. The campaign remains small; depth and feedback still need natural-play assessment.
