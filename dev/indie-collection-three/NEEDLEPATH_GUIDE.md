# Needlepath thread guide — 26 October 2026

Implementation: `df16bfbc9a301c27b56090e4d8030cc3e72b7b00` on `indie-collection-three-dev`.

Source inspection identified a control/learning weakness: a locally legal stitch could leave no eventual finish, yet the player received no early explanation. The new optional thread guide searches the remaining finite stitch space, suggests a single next move toward the least-thread finish and forecasts remaining thread, total thread and ribbon. It includes knot moves and explains when undo or retry is necessary.

Advice is read-only, hidden by default and after reload, and can be hidden at any time. It does not play moves, charge thread, change records or modify the save schema. A bounded search returns unknown rather than making a false impossibility claim if future layouts exceed its limit. Existing 31 finishing routes and all earlier save tests remain unchanged.

## Verification

18 tests pass: 11 engine, 7 jsdom. The engine guide matches the independent initial winning-route fixture at every one of the 1,262 reachable action prefixes across all three samplers, including locally active but globally blocked branches. Tests also follow advice to the exact 12/14/18 best-thread finishes, check conservative search cutoff and verify read-only saves.

DOM checks cover opt-in and hide controls, updated suggestions, highlights, knot advice, early blocked-branch explanation, reload default, progression, loss/undo/retry, save recovery, storage failure and modal/pause/bridge guards. jsdom 26.1.0 was restored to temporary test tooling after the dependency was absent; the final complete suite passes. Dialog methods are simulated. Both gameplay scripts pass syntax checks.

No rendered play, screenshots, mobile/touch layout or human-enjoyment evidence is claimed. Full repository checks were not run from the partial checkout. This is a pending source refinement, not the required rendered-playtest improvement pass.

## Counts and preservation

Third batch: **7/50 built, 0 improved, 0 browser-tested, 0 integrated, 0 verified live**. Ledger remains exactly 50 slots. Second-batch additional round remains 20 source upgrades, 6 rendered-verified and 14 pending. First-batch baseline remains 20 finished with nine selected; no first-batch sources were changed.

Observed main: `85d941d59e8897585606e5a67f4413a710643067`; observed second-batch head: `3949e3d9f8e2e9846dc4c91c436d90b19bbbd341`. Only Needlepath source/tests and third-batch documentation changed. Public catalogue and shared navigation remain untouched. No new live URL.

Next: rendered desktop/touch play of the guide and unaided puzzle; assess spoiler balance, passing-over-pin clarity and visual highlights, then make a substantive improvement from that evidence before selection. Continue remaining distinct third-batch implementations while rendered access is blocked. Existing publication/security findings were not retried or bypassed.
