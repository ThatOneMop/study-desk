# Canopy Weave

Third collection slot 53. Original authored graph-untangling prototype: move lettered leaf knots on a nine-by-nine trellis so straight vines neither cross nor overlap. Vines may meet at shared leaves, but cannot pass through unrelated leaves. Moving a knot changes all incident vines; a temporarily worse tangle can make room for a solution. Unlike the existing stitching and bead-sliding games, players directly rearrange a graph embedding, without consuming thread, following a stitch path or sliding pieces into fixed sockets.

Three compact graphs progress from a four-leaf loop to a five-leaf wheel and a six-leaf nested triangular structure. Demonstrated routes use 3/5/6 committed moves; these are test routes, not optimality or long-play claims. Multiple rotated/reflected arrangements solve each graph. Unlimited undo and retry encourage experimentation; records track fewest committed moves per trellis. No timer, lives or artificial production counts. There is no loss state; tangled layouts remain editable.

Original SVG/CSS art, dashed problematic vines, letter labels independent of colour, conflict previews, native selection/direction buttons, keyboard arrows and pointer dragging are implemented. Drag previews remain temporary until release; cancellation, pause, dialogs and parent hiding discard the preview. Alternate tap placement avoids requiring dragging. Desktop rendered play is recorded below; full Chromium desktop/touch qualification remains pending.

Only `study-desk-canopy-weave-v1` is used. The save contains level, bounded move journal and records. Decoder replays valid placements, rejects occupied dots/no-ops/out-of-bounds and moves after completion, and checks unlock/win-record consistency. Unreadable data is preserved until confirmed recovery/reset. Storage failure permits a temporary session. Saves/records are local, not authenticated scores. The 300-move journal limit is a storage bound; undo/retry remain available.

## Checks

`node --test tests/canopy-weave-engine.cjs`

`NODE_PATH=/path/to/node_modules node --test tests/canopy-weave-dom.cjs` with jsdom 26.1.0.

Nine tests pass: five engine, four DOM. Coverage: all three campaign wins/unlocks with exact reload after every move, geometry crossings/touches/overlaps/opposite rays, 24 rotated/reflected solved embeddings, invalid moves/journals, input ownership, undo/records, retry, storage bound, drag preview/release/cancel/occupied/pause, keyboard/form guards, parent visibility, navigation markup, corrupt recovery, reset isolation and quota failure. Dialogs, pointer events/capture and SVG bounds are simulated. Both gameplay scripts pass syntax checks.

No rendered browser, screenshot inspection, mobile layout/native input, human enjoyment, full repository build or completed improvement-pass claim. Next: naturally play all three graphs on desktop/touch; assess whether knots and dashed tangles are readable, how dragging feels, and whether progression needs more meaningful spatial constraints. Implement a substantive playtest-led improvement before catalogue selection. This candidate stays on the development branch and off the public catalogue.

## Compact-garden replay challenge

After completing a trellis normally, its compact challenge adds a geometric constraint: every vine must have straight-line length at most four grid steps (squared distance at most 16), while all original crossing/overlap rules still apply. Temporary stretching is legal; it prevents completion rather than rejecting experimentation. Spreading the graph widely no longer suffices. A reach circle around the selected leaf, gold dotted overstretched vines and explicit endpoint-letter lists explain which connections need shortening. Crossing vines retain the rust dashed style, with overstretched endpoints still listed.

Mode changes confirm and restart the layout; separate compact records preserve normal achievements. An unfinished next trellis returns to normal mode. Optional v1 fields retain mode and compact records; old saves keep their original shape and outcomes. All three compact graphs have tested 4/5/6-move solutions, without an optimality or extra-content-hours claim.

13 tests now pass (7 engine, 6 jsdom 26.1.0), including the original nine tests, geometric length boundary/diagonal behavior, wide untangled-but-unfinished layouts, exact legacy save shape, all compact wins with per-move reloads, separate records, mode/unlock validation, reach feedback, confirmations, pause and temporary drag previews. Both scripts pass syntax checks. This refinement follows source analysis of the small initial campaigns; it is not rendered-play evidence or a completed improvement pass. Next: inspect the guide and vine styles in natural desktop/touch play, tune challenge depth and clarity, and verify screenshots before selection.

## Rendered-play-led rehearsal and vine inspector (31 October)

The compact Sunwheel baseline produced 11 tangles and eight stretched vines around the central knot, but aggregate counts did not identify which relationship to repair. Native dragging also selected the letter text.

Optional **Rehearse moves** now lets the player compare a destination without spending a move or changing the saved layout. Tangle and reach deltas, a hollow origin and a travel guide distinguish the plan from committed leaves. Repeated arrow nudges refine one planned move. Place commits once; discard, pause, selection changes, dialogs and reload abandon it. Temporary detours remain legal, and direct placement stays available.

The **Vine inspector** isolates a named crossing, collinear overlap, unrelated leaf on a vine, or overlong connection. Cycling conflicts highlights only relevant geometry. It explains the layout rather than supplying a solution. Drag text selection, native dialog close recovery and hidden-parent control ownership are repaired. Existing v1 saves and separate records are unchanged.

21 focused checks pass (9 engine, 12 DOM). Natural desktop play compared central Sunwheel placements (11 tangles at column5,row5 versus3 at column5,row4), committed the better position, completed the compact garden in five moves, then exercised Escape, undo, rehearsed completion and reload while preserving its best record. Screenshots of dense conflict diagnosis and winning rehearsal were inspected. Full three-garden desktop/touch Chromium qualification and catalogue selection remain pending; no physical-device, human-enjoyment or duration claim.
