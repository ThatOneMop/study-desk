# Beepline conditional flight and inspection — 26 October 2026

Implementation: `882241479028fb664a192b21b05550312ba78e01` on `indie-collection-three-dev`.

## Before and after

Source inspection found only fixed flight instructions and forward-only playback. Scout (S) now checks the square ahead every time it executes: clear ground means move one square; a hedge means turn right in place. This is a new environment-dependent programming choice, not a renamed level or cosmetic change.

Back one step rewinds one simulated frame after any outcome. Players can retrace a crash, a non-finishing loop or a success, then step forward again. Earned records stay intact. Backward stepping stops autoplay, respects pause/dialog guards and saves the inspected cursor. Existing v1 saves require no migration.

The handbook explains both Scout branches and the new debugging control. The first garden still has a shorter fixed-loop solution than the chosen both-branches Scout route. The second can now be solved with Scout alone; the third drops from five to three commands. This is potentially too generous for the middle puzzle and must be assessed in natural play before selection.

## Evidence

**15 tests pass: 8 engine, 7 jsdom 26.1.0.** Both gameplay scripts pass syntax checks.

- Original F/G/L/R enumeration remains identical: 5,460 programs per garden, minima 3/2/5, winning-program counts 37/785/48.
- Extended F/G/L/R/S enumeration: 19,530 programs per garden, minima 3/1/3, winning counts 422/4,672/717. These are validation cases, not new authored levels.
- New routes F/R/F/S, S and L/S/S complete the respective gardens through UI handlers, exercising both Scout branches. Every simulated frame saves and reloads.
- Backward inspection checks every cursor in a completed flight, crash/loop recovery, records, reload, Run/Stop, pause and confirmation guards.
- Existing tests preserve campaign unlocks, command editing, Space/form focus, parent hide, reset isolation, unreadable-save recovery and quota failure.

Dialogs and intervals are simulated. This is source/engine/DOM evidence, **not rendered gameplay, native keyboard/touch validation, screenshot inspection, full repository build or human enjoyment evidence**. The refinement does not earn a completed improvement pass.

## Preservation and status

Exactly 50 third-batch slots remain: **9 built; 0 improved, browser-tested, integrated or live**. Second-batch additional round remains 20 source upgrades, 6 rendered-verified and 14 pending. First batch stays preserved at 20 finished and nine selected source entries.

Observed main: `85d941d59e8897585606e5a67f4413a710643067`; second branch: `3949e3d9f8e2e9846dc4c91c436d90b19bbbd341`. Main and the recorded workspace-control audit are unchanged. Existing browser/publication blockers were not retried or bypassed. Only Beepline source/tests and third-batch documentation are changed; shared navigation, catalogue, concurrent work and other saves are untouched.

Next: rendered review of both Scout branches and backward inspection, assess the one-command middle garden, and implement a substantive playtest-led improvement before integration. Independent new-game implementation can continue while rendered access is blocked.
