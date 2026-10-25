# Beepline initial prototype — 26 October 2026

Implementation: `4271c69152ec426d0c3df7452c252b0c90bb1706` on `indie-collection-three-dev`.

## New loop

Slot 49 is a programming puzzle: choose up to six repeating F/G/L/R commands to visit flowers and return a bee home. Forward moves one square; Glide continues to a hedge while collecting intermediate flowers; turns are relative. Editing rewinds the flight. Step exposes individual positions; Run/Stop animates the same sequence. Repeated position/direction/program-counter/flower-mask states identify a non-finishing loop without an arbitrary timer.

Three authored gardens introduce repeated turns, gliding and asymmetric hedge navigation. Sequential unlocks and smallest-program records provide compact progression/replay. Original CSS art, accessible selects/buttons, Space stepping, pause and bridge guards, recovery confirmation and isolated safe saves are implemented. This is distinct from the existing stamping, dials, curling, sailing, packing, dice combat, stitching and tactical-shoving candidates.

## Evidence

Nine tests pass (five engine, four jsdom). All three gardens complete through UI handlers and exact frame saves/reloads. Exhaustive engine enumeration checks all 5,460 programs of lengths 1–6 for each garden and establishes minimum command lengths 3/2/5. Winning-program counts 37/785/48 are verification only, not extra authored content.

Tests cover glide intermediate flowers, hedge crashes, repeated-state loops, editing/rewind/records, corrupt save bounds/unlocks, Run/Stop and edit interruption, pause/parent guards, Space versus form controls, crash/loop recovery, reset isolation and storage failures. Both gameplay scripts pass syntax checks. Dialogs and intervals are simulated in jsdom 26.1.0. No rendered play, screenshot, actual native keyboard/touch, mobile layout or enjoyment claim. Full repository checks were not run from the partial checkout.

## Status

Third batch: **9/50 built; 0 improved/browser-tested/integrated/live**, exactly 50 ledger slots. Second additional round remains 20 source upgrades, 6 rendered-verified and 14 pending. No first-batch source, existing save key, catalogue entry or shared launcher was edited.

Observed main: `85d941d59e8897585606e5a67f4413a710643067`; observed second branch: `3949e3d9f8e2e9846dc4c91c436d90b19bbbd341`. Existing workspace/publication/preview-block findings were not retried or bypassed. This development commit is not a live release.

Next: rendered desktop/touch play and screenshot inspection, especially glide highlighting and debugging clarity; implement a substantive improvement from that play, then verify progression, crash/loop retry, saves/reload, restart and navigation before considering integration. Continue independent new-game implementation while rendered access remains blocked.
