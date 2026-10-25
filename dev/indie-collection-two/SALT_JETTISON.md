# Salt & Sail — optional cargo jettison

25 October 2026. [Source commit ef574e418ff648ad99e553b96818016af03621b7](https://github.com/ThatOneMop/study-desk/commit/ef574e418ff648ad99e553b96818016af03621b7). Development only; additional round remains **6/20 verified**.

## Hypothesis and behaviour

Source-based hypothesis: optional cargo cannot be sacrificed when its weight and list become a liability at sea. No new rendered observation while preview access remains blocked.

Before: Cargo decisions end at launch; only collision damage can remove optional goods during a voyage.

After: Confirmed jettison can discard either surviving optional load. Preview shows lost value, mass and list, warning that balance may worsen. Required contracts cannot be selected. Confirmation records one reefed simulation step and leaves sailing paused. Cargo contributes no further mass/value or full-cargo seal; retry restores packing.

Optional slots two and three use replay input bits 32 and 64; prior helm masks retain their original meaning. The accepted mask limit is now 127, with invalid-mask regression updated to 128. Cargo integrity, offsets, balance, speed, forecast and score all use the same existing physics path. Jettisoned goods remain in the original packing for retry, but no longer contribute to the live load. Their hold cells fade and manifest status shows lost at sea. No required contract jettison exists. Best records cannot be downgraded by a lower-value delivery.

## Evidence

- 36 engine + 18 jsdom checks pass. Original five full-cargo keel and cutter routes remain valid. Five new jettison routes deliver required contracts with values 19/36/27/36/29 and seals 2/2/2/2/1. The fifth route takes a hull hit and loses citrus as well: removing balancing salt is not uniformly beneficial.
- Pure preview matches the recorded reefed frame; forecast, exact replay/reload, both optional slots, protected contracts, repeated/invalid rejection, legacy best records, confirm/cancel, paused reload, retry, isolated saves and navigation are checked. Both scripts pass syntax. DOM uses simulated frames and a null canvas, not rendered play; no screenshot, actual touch, human enjoyment or full-repository check claimed.

Command: `NODE_PATH=/tmp/salt-check/node_modules node --test tests/salt-and-sail-engine.cjs tests/salt-and-sail-dom.cjs`, jsdom 26.1.0: **54/54 passed**. Static app has no compile step; full repository checks were not run from the partial source recovery.

The new fixture `tests/fixtures/salt-and-sail-jettison-routes.json` records complete legal crossings after dropping slot two at launch. Four retain all hull; the fifth loses one hull and its fragile citrus. Those results are automated reachability evidence, not a claim that jettison improves every voyage or is fun for players. The first DOM route confirms, cancels, confirms again, reloads paused and delivers for 19 crowns/two seals. Other DOM checks preserve the original campaigns, loss/retry and recovery behavior.

## Pending

Perform supported rendered before/after play, assess whether the optional sacrifice improves decisions, inspect live hold feedback and desktop/phone controls, and iterate. Verify actual keyboard/touch, progression/loss/retry, saves, restart/navigation and screenshots before counting.

No browser workaround or CI rendering was attempted; commits use `[skip ci]`. Existing browser security rejection and workspace/publication audit remain in force. No repeated publishing attempt, new live URL or public catalogue change. Pre-write main `85d941d59e8897585606e5a67f4413a710643067` and third-batch head `ab12bd0d63f2a4cdc4579be3f811a6f4693c1161` were unchanged. Third batch remains six built prototypes and zero completed improvements/browser-tested/integrated/live.
