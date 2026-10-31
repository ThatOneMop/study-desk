# Tumbleglass

Third collection slot 50. Original simultaneous sliding-bead puzzle, unlisted development prototype. Three compact trays use two, then three numbered glass beads. Tilt moves the edge-most bead first; beads slide until obstructed, locking immediately in their matching socket. A settled bead blocks tilts; the single-use bead lift can move it again. Wrong sockets are traversable. A single-use clamp can hold one loose bead still for one tilt while the others move. Choose whether and when to spend it; no-op tilts do not consume it, and undo/retry restore it. Choose the settling order, undo freely and optimize best move counts.

Pure deterministic engine, original CSS glass art and native buttons; no runtime package or third-party assets. Arrow keys work on the page/tray, while form controls keep native keys. All buttons have minimum 44px height; mobile styles use a two-column direction pad. Actual rendering, touch and native activation remain unverified. Pause and same-origin parent-hide messages guard inputs. No timer or lives. Retry requires confirmation and preserves records.

Only `study-desk-tumbleglass-v1` is written. Old string-only v1 journals remain readable without migration. New clamp moves store {dir, hold}; replay enforces single use and validates both fields. Save contains a replayed move journal, current tray and local best records. Decoder rejects no-op journals, moves after a win, invalid unlocks, missing winning records and oversized input. The 300-move bound protects storage, not a gameplay target; undo/retry remain available. Corrupt saves stay intact until recovery/reset confirmation; storage failures permit a temporary session. Local records are not authenticated scores.

## Checks

`node --test tests/tumbleglass-engine.cjs`

`NODE_PATH=/path/to/node_modules node --test tests/tumbleglass-dom.cjs` (jsdom 26.1.0).

Eleven tests pass: six engine and five DOM. Exhaustive reachable-board checks cover 8/32/37 states; shortest solutions are 3/5/5 tilts. Campaign handlers, every-tilt saves/reload, unlocks, collisions, in-transit socket locking, immutable input, undo/records/retry, malformed journals, keyboard focus guards, pause/parent hide, reset isolation, recovery and storage failure are covered. Additional clamp tests cover distinct assisted routes through all trays, one-use/locked-bead/no-op constraints, object-journal ownership, exact reload/undo, selector focus and pause/dialog guards. Dialog APIs are simulated. Both gameplay scripts pass syntax checks.

These are small initial puzzles, not substantial content-hour claims. Source implementation and engine/DOM testing do not count as a rendered improvement pass. Next: play naturally on desktop/touch, inspect screenshots and feedback, assess settling-order clarity and puzzle depth, then implement a substantive playtest-led upgrade before any catalogue integration. Full repository build checks have not run from the partial checkout.

## Pending source refinement — 26 October

Before: every tilt moved all loose beads, leaving no per-bead intervention. After: one clamp offers a choice of bead and timing, with undoable resource use. Assisted routes alter actual bead positions and solve all three trays in 3/5/5 tilts; the legacy routes remain valid. This comes from source/engine/DOM inspection, not rendered play, and does not earn the required improvement-pass credit. The campaign remains small; depth and feedback still need natural-play assessment.

## Optional tray check

Check tray performs a read-only breadth-first search over all legal tilts, locked beads and the unused clamp. It gives one next action on a shortest remaining route, explicitly stating whether to hold a bead or choose No clamp. It never applies a tilt, changes clamp selection or writes a save. If no solution remains, it recommends undo/retry even when beads can still move. Advice clears on successful actions and restart; pause/dialog guards hide it and prevent checking. Near the 300-action storage bound it explains when the remaining route cannot fit instead of suggesting an unusable plan.

Source analysis found 14 unsolvable states among 269 reachable board/clamp states across the three trays (33/72/164 states, 6/0/8 dead ends). This enumeration is test coverage, not added game content. Previously only completely wedged layouts received a warning. Optional guidance now makes recoverable mistakes explicit without consuming the clamp or removing earned records.

16 tests pass (8 engine, 8 jsdom 26.1.0). An independently traversed reverse state graph verifies every reachable state's solvability and shortest distance; every returned solution is replayed to a win. Other coverage includes original/clamped campaigns, exact saves, no mutation, dead-end undo recovery, stale-hint clearing, selection/pause/modal guards and journal capacity. Both scripts pass syntax checks. No rendered browser, screenshots, native keyboard/touch or full repository build evidence; this remains a source refinement awaiting natural play and usability review, not a completed improvement pass.

## Bead lift — pending rendered review

Once per attempt, move any one bead exactly one cell in a chosen direction; all others stay still. This provides a local intervention after ordinary tilts or a clamp have left a bad arrangement. It costs one recorded move, consumes the lift and only locks the bead if its destination is its matching socket. A previously locked bead becomes loose when lifted out. Walls, occupied cells and invalid targets reject the action without spending anything. The clamp and lift are independent resources; selecting either tool clears the other selection. Undo refunds the lift; retry restores both. Tool selection itself is temporary and never changes the save.

An initial socket-only design did not rescue the existing dead-end positions, so the implemented lift accepts loose beads too. For example, first holding bead 2 while tilting down, then tilting right previously left tray 1 unsolvable without undo. It can now finish via left, lift bead 1 right, up, down. This is a demonstrated recovery, not a guarantee that every mistake can be rescued. The optional adviser now includes the lift and explains when to clear both tools. Records and status count moves, including lifts, rather than only tilts.

New journal entries are exactly `{dir, lift}`. The v1 key, state shape and old string/clamp journal results remain unchanged. `liftUsed` is derived only after a lift during journal replay, and does not appear in old boards. The decoder rejects invalid, repeated and post-completion lifts. No extra content count or new game is claimed.

24 tests pass (13 engine, 11 jsdom 26.1.0), retaining the prior 16 checks with adviser expectations updated for the new action. The old 269-state graph still validates the tilt/clamp-only solver configuration. The complete extended graph has 138/182/807 states and 9/0/8 dead ends; an independent reverse traversal verifies shortest distances, and every returned route is replayed to a win. These 1,127 states are test coverage, not levels or content hours. Fixtures demonstrate lift-assisted wins in all three trays in 3/5/5 moves. Tests also cover blocked moves, no mutation, nested/un-nested transitions, one-use semantics, reload after every action, undo retaining earned records, retry, tool selection/native-focus guards, pause, adviser-led recovery and reset isolation. Both scripts pass syntax checks.

No rendered play, screenshots, native keyboard/touch or human-enjoyment evidence. This source-led upgrade remains pending and earns no qualified improvement or browser-tested credit. Next: inspect the two-tool flow on desktop/touch, assess whether a one-cell intervention feels useful and readable, and improve from actual rendered play before integration.


## Rendered improvement — 31 October 2026

Natural Chromium play completed the original three trays in 3/5/5 ordinary tilts. The tools were optional with no persistent reason to explore them, and the board scrolled out of view when operating the controls. The new Glassmaker’s studies reward three distinct approaches on each existing tray: no tools; a clamp that actually changes bead positions with no lift; and lifting an already nested bead out before finishing. Each stores its shortest actual winning journal. Undo/retry retain studies; clear-progress clears only this game's state. Studies are alternate challenges on three trays, not nine new levels or added game counts.

The optional `studies` field uses the existing v1 save key. Old saves remain valid without this field. Decoder replays every stored journal and checks its technique; fake, incomplete, oversized or malformed journals are rejected without silently replacing saved data. Existing records and unlocks are preserved. Old records alone do not grant technique awards because they do not prove how the tray was solved. Check tray still advises ordinary completion, explicitly not technique optimization.

Desktop board and controls now share a bench. Phone layout stacks compact controls; the selected clamp/lift target is marked H/L on the bead. Instructions remain available in a disclosure. Embedded Games requests the existing Study Desk Collection handler. Parent-hidden games cannot resume or accept pending resets; native dialog close re-enables controls.

29 focused checks pass locally (16 engine, 13 jsdom 26.1.0). Rendered baseline and changed third-tray Second setting challenge, reload and native Escape were exercised through normal UI input. Full desktop/touch candidate CI and screenshot review remain required before qualification or publication; see the development report for final evidence.
