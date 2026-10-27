# Bellwether — responsive adviser controls

27 October 2026. Source `db05228e86f03859234f3a15755d5df8f3db84ba`.

## Before and after

The previous report explicitly identified synchronous search as a source-level latency risk. It ran up to 25,000 expanded positions inside one UI callback. The same breadth-first search now runs through a generator. UI advice uses an asynchronous driver that yields before work and every 256 positions, allowing input callbacks between batches. The synchronous driver remains only for deterministic engine checks.

Movement, target selection, Quiet paws, pause and retry remain usable while advice is pending. Cancel search is explicit. Every state/context change invalidates a generation token. Cancellation, a late completion or a late error cannot overwrite the current preview or another search. Input is snapshotted; no saves, turns, rules, record formats or search ordering change. Errors restore the adviser without falsely reporting an impossible puzzle. Page hiding cancels work.

## Evidence and limits

41 tests pass: 21 engine, 20 jsdom 26.1.0. All prior 35 checks retained, with existing adviser tests adapted to await completion. Six new tests cover synchronous/cooperative equivalence, bounds, input immutability, timer progress, early/mid-search cancellation, movement during live search, late results after target/mode/pause/dialog/hide/cancel, competing searches and failure recovery. All original, quiet and named campaigns, per-action save/reload, progression, undo/retry, corrupt recovery, quota failure and navigation checks remain passing. Engine/game scripts parse.

This is event-loop and DOM verification, not a rendered benchmark or physical-device measurement. Per-batch latency still needs desktop/mobile rendering assessment. The initial third meadow still reaches the overall search bound and honestly reports uncertainty. No additional content, human enjoyment, universal solver or qualified playtest-led improvement claim. Existing security-policy browser rejection was not retried or bypassed.

## Preservation

Third branch began at `5d2ff8067ab28655388c2c1eb33c716b1aa73e7f`; no AGENTS.md found. First-batch final report re-read: 20 finished, nine historically selected, zero verified live. Second branch unchanged at `3949e3d9f8e2e9846dc4c91c436d90b19bbbd341`; additional round remains six rendered verified and fourteen pending.

Main observed at `9e15e3cd07f59f2eba83ea11c95f285cf259e314`; changes since the prior observation are confined to Gummy Bay. Its changed index.html contains no Switch workspace/playerStudy/studyBtn matches. Launcher files did not change. No main/catalogue/other-game files edited. No fresh live deployment or rendered-navigation claim; publication barriers were not retried. Automation settings unchanged.

Third ledger retains exactly 50 slots, 19 built and zero qualified improved/browser-tested/integrated/live, with 31 unassigned. Keep Bellwether unlisted pending natural rendered play, inspected screenshots, device responsiveness assessment, required improvement qualification and selection. Continue the remaining games and second-batch obligations.
