# Paper Odyssey — stitched crossings

25 October 2026. [Source commit 21d5fb515207f12feca724c2f5bffb8574a5a6bb](https://github.com/ThatOneMop/study-desk/commit/21d5fb515207f12feca724c2f5bffb8574a5a6bb). Development only. Additional round stays **6/20 verified**.

## Source-based hypothesis

Source-based hypothesis: routes are limited to mirrored adjacency; surplus creases cannot fund a lasting local crossing. No new rendered observation while preview access remains blocked.

Before: Only touching or stacked islands connect; folding and unfolding are the only ways to alter routes.

After: Once per chart, spend two creases to stitch and cross to an island at Manhattan distance two on the current map. The physical endpoints remain connected both ways after folding/unfolding. Staged preview, stitched SVG line and crossing labels expose the route. Stitching counts as two extra folds for the par seal; undo restores the bridge allowance.

The crossing consumes the chart's single bridge allowance and two creases, then applies normal destination effects. The thread follows physical island identities when geometry changes. Exhausted-paper reachability includes the seam; folded delivery still requires flattening. Old journals omit stitching and replay with unchanged outcomes. The existing key and journal version remain. A fresh sheet removes the bridge; undo reconstructs it from actions. No additional levels or time-content claims.

## Evidence

- 33 engine + 26 jsdom checks pass. All five original three-seal routes remain unchanged; five new stitched routes win with full health (two seals on chart one, three on the others). Every new action has pure exact forecasts and replay roundtrips. Budget accounting, reusable endpoints, single-bridge restriction, invalid distance/resources, undo and record validation pass.
- DOM simulations complete all five stitched charts through preview/cancel/confirm, Enter and saved reload. Bridge markup, pause/dialog guards, undo/restart, previous loss/recovery, isolated saves and navigation markup pass. Both scripts pass syntax checks. No rendered play, inspected screenshots, actual touch, human enjoyment or full-repository check claimed.

Command: `NODE_PATH=/tmp/paper-check/node_modules node --test tests/paper-odyssey-engine.cjs tests/paper-odyssey-dom.cjs`, jsdom 26.1.0. **59/59 passed**. Static app has no compile step. Full repository checks not run from this partial recovery.

New fixture `tests/fixtures/paper-odyssey-stitch-routes.json` contains legal full-health routes of 4/11/7/15/10 actions. These are automated reachability evidence, not human enjoyment evidence. The first route spends its remaining crease opening the sheet and finishes with two seals; stitching is not automatically superior to the original clean route. All original three-seal routes pass.

## Pending review

Perform supported rendered before/after play, assess bridge placement and route-budget balance, inspect stitched lines and expanded phone controls, and iterate. Verify actual keyboard/touch, progression/loss/retry, saves, restart/navigation and screenshots before counting.

Existing browser security rejection remains in force. No alternate browser surface or CI rendering used; commits carry `[skip ci]`. No new screenshot, touch-layout or live-release claim. No unchanged publication retry. Existing workspace audit and hosting barrier remain recorded elsewhere.

Pre-write heads: main `85d941d59e8897585606e5a67f4413a710643067`, third batch `ab12bd0d63f2a4cdc4579be3f811a6f4693c1161`. Public catalogue and all first-batch assets remain outside this change. Third batch remains six built prototypes; zero completed improvements/browser-tested/integrated/live.
