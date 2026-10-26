# Canopy Weave compact gardens — 26 October 2026

Source: `6323c0ad2d22b7fff31156ed5ac4017c6e4298c6` on `indie-collection-three-dev`.

## Source-observed weakness and change

The initial three graphs could be solved by spreading knots across the trellis. Source review identified limited replay constraints; this was not a rendered-play observation.

An optional compact-garden challenge now unlocks after each normal completion. Every vine must have straight-line length at most four grid steps, as well as meeting the existing crossing/overlap/node-clearance rules. Temporary stretching remains legal while rearranging, but a wide untangled graph cannot finish. This adds packing decisions within the same game rather than counting renamed levels as new games.

A reach circle around the selected leaf shows the distance bound. Gold dotted vines and a letter-pair list identify overstretching; crossing vines keep their rust dashed styling. Drag previews report both tangles and long vines. Mode changes confirm and restart the layout while retaining separate normal/compact records. Unfinished next trellises return to normal mode. Existing v1 saves retain their shape and results; optional fields store new mode/records.

## Evidence

**13 tests pass: seven engine and six jsdom 26.1.0**, plus both script syntax checks. Original nine tests remain green. New coverage includes squared-distance boundary and diagonal cases, untangled-but-too-wide layouts, locked/malformed modes, exact old save shape, all three compact solutions with per-move reloads, independent records, undo/retry, reach feedback, mode confirmation, pause and temporary preview handling.

Demonstrated compact routes use 4/5/6 moves. These are working examples, not optimal solutions or long-play claims. Dialogs, SVG bounds, pointer events and capture are simulated. No rendered browser, screenshot inspection, native keyboard/touch, mobile layout, human enjoyment or full repository build evidence.

This is pending source refinement with **no completed improvement-pass credit**. Rendered play must assess whether the reach circle and two conflict types are understandable and whether compact packing adds satisfying decisions.

## Preservation and next work

Third batch remains **13/50 built; 0 improved/browser-tested/integrated/live**. Second additional round remains **20 source upgrades, 6 verified, 14 pending**. First-batch report was reread: 20 finished, nine selected source entries, zero verified live URLs.

Main `dc88f09cfb30cae92e3f0e9afe65cd2f7ddaf4f7` and second branch `3949e3d9f8e2e9846dc4c91c436d90b19bbbd341` are unchanged. Only Canopy Weave source/tests and third-batch documentation change. Previous games, saves, public catalogue, shared navigation and concurrent Gummy Bay work remain preserved. No repeated publication attempts or browser-policy workaround.

Next: natural desktop/touch rendered play and screenshot inspection, substantive playtest-led improvement, then save/reload, undo/retry/restart and real-navigation verification before catalogue selection.
