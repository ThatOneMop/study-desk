# Pocket Regatta — initial prototype
25 October 2026. Candidate **44**, the fourth of the third collection's exactly fifty slots.
[Source commit ba16b341745c0c7db43300111b81b58faff9134b](https://github.com/ThatOneMop/study-desk/commit/ba16b341745c0c7db43300111b81b58faff9134b).

## Implemented loop
A turn-based sailing course on a nine-by-nine chart. Visit numbered buoys in order while planning tacks: the boat cannot sail directly into the wind or change heading by more than 90 degrees per move. Short sail travels one square, full sail two. Intermediate squares count for buoy rounding; grounding on rocks or the edge removes one hull and stops the boat before the obstacle. Three groundings end a crossing. Undo recalls sail settings and restores hull, position and buoy progress.

Three authored courses have different fixed wind directions, rocks and buoy arrangements. Finishes unlock the next course and record fewest moves. This is route-and-helm planning, with no cargo economy or timer. Forecasts expose the actual path, grounding risk and destination before committing. Original CSS chart and boat art, heading buttons, keyboard controls, pause, instructions, cancellable restart/reset dialogs and a dedicated validated save journal are included. Corrupt saves remain untouched until confirmed recovery.

## Verification
`NODE_PATH=/tmp/regatta-deps/node_modules node --test tests/pocket-regatta-engine.cjs tests/pocket-regatta-dom.cjs`: **8 passing checks (5 engine + 3 DOM)**.

Engine coverage: all three courses finish without damage in automated routes of 10, 9 and 12 moves; sequential unlocks and exact saved journals; wind/turn rejection; full-sail intermediate buoy crossing; collision stops; natural grounding loss, undo and retry; locked courses and malformed settings/journals. DOM coverage: every course through controls with repeated reloads; sail-setting persistence; keyboard chart sailing; pause; loss/retry/cancel; isolated save reset/recovery; guide cancellation and Games link target.

Syntax, local asset references and catalogue exclusion passed. Full repository build/preservation suites were not run from this partial checkout. Source changes are limited to the new game, its tests and third-batch documentation; existing games/catalogue and main are preserved.

## Honest quality status
**Initial prototype only.** These are engine/jsdom routes, not evidence of rendered gameplay or human enjoyment. No screenshots were generated or inspected, and native touch, layout and navigation remain unverified. The prior browser-policy denial was not retried or bypassed. Three short fixed courses are not a long-content claim.

Third batch: **4 built / 0 improved / 0 browser-tested / 0 integrated / 0 verified live**. Second batch remains 20 initially complete and **6/20 additional upgrades verified**. No public entry or live release was added.

Next: play the actual rendered tacking loop; inspect chart/forecast readability and phone controls; identify and implement a substantial enjoyment/depth improvement; verify win/loss/retry, saves/reload, reset and real navigation before catalogue promotion.
