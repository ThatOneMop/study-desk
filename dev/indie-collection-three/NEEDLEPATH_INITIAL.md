# Needlepath initial prototype — slot 47

Source commit: `d0ea3fa23950b1005e8d41ba56c960503c2d216c` on `indie-collection-three-dev`.
Observed main: `85d941d59e8897585606e5a67f4413a710643067`.
Observed second-batch branch: `3949e3d9f8e2e9846dc4c91c436d90b19bbbd341`.

## Implemented

Original geometric stitching loop, distinct from the collection's stamping, packing, dice combat, sailing, curling and coupled-dial games. The needle alternates horizontal front stitches and vertical back stitches; optional guide pins enable turns, required flower endpoints must be visited before gold, and one knot changes face for two thread. Same-face overlap and pin revisits are forbidden. Opposite faces can cross. Passing over a pin does not collect it.

Three authored samplers unlock in order. Budgets are 22/30/32 thread; least-thread goals 12/14/18 earn three ribbons. Unlimited undo works after both dead ends and wins; retry preserves best records. Original linen/hoop SVG/CSS art, front/back line styles, legal-target highlights, per-pin cost previews, keyboard focus and K/U shortcuts, pointer controls, help, pause and confirmation dialogs are implemented.

The isolated v1 save key stores replayable actions and bounded records. Unreadable saves are preserved until explicit recovery; failed storage writes leave a temporary playable session. No pre-existing save keys changed.

## Design checks during initial construction

The first all-pins-required grid layouts had zero solutions under the rules. They were discarded before committing. Flower objectives plus optional guide pins produce multiple routes and meaningful route-length choices. The finite action trees for the committed layouts have 6, 14 and 11 finishing sequences respectively. Each sampler has both knot-using and knot-free solutions. These checks informed the initial implementation; they are not a rendered-playtest improvement pass.

## Evidence

- Nine engine tests pass: exhaustive route enumeration, exact replay/reload at every action of all 31 finishing sequences, optional-pin semantics, premature finish, wrong-axis/revisit/overlap rejection, knot cost/use/undo, thread budget, dead-end recovery, sequential unlocks, records and malformed saves.
- Five jsdom 26.1.0 tests pass: complete campaign through button handlers, records/reload, dead-end/undo/retry/reset, arrow focus and shortcuts, modal/pause/bridge guards, unreadable-save recovery and storage failure.
- `node --check` passes for both gameplay scripts.
- Reproduce: `node --test tests/needlepath-engine.cjs`; with jsdom installed outside the repository, `NODE_PATH=/path/to/node_modules node --test tests/needlepath-dom.cjs`.
- Dialog methods are simulated. DOM inspection validates handler behavior and navigation markup, not pixels, native Enter/Space activation, layout, touch or enjoyment.
- No complete repository build/check is claimed from this partial checkout.

## Status and review gate

Third batch now has **7/50 built prototypes; 0 improved, 0 browser-tested, 0 integrated and 0 verified live**. This candidate is deliberately absent from main/catalog.json. No first- or second-batch game, catalogue entry, shared bridge or existing save was modified.

Second-batch status is **20/20 additional source upgrades implemented, 6/20 rendered-verified, 14 pending rendered review**. This run does not increment its verified count.

The already documented preview security-policy block remains unresolved. No alternate browser/CI rendering workaround was attempted. Publication and workspace-control findings are unchanged and were not retried as development work. Source commits are not live releases.

Next: actual rendered desktop/touch play, screenshot inspection and a substantial game-specific improvement informed by that play. Specifically assess whether passing over unvisited pins is visually clear, whether knots feel useful, and whether length optimization supplies enough replay value. Verify saves/reload, dead ends/retry, restart and launcher navigation in the rendered environment before considering catalogue selection.
