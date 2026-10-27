# Tumbleglass bead lift — 27 October 2026

Implementation: `62b15d4b4003f2aec62a969be4fa6e26078eb671` on `indie-collection-three-dev`.

## Before and after
Some tilt/clamp arrangements could not finish without undo. A once-per-attempt bead lift now moves any bead one orthogonal cell, leaving all others still. It consumes one journal move and the lift, and locks only on that bead's own socket. Moving a locked bead out makes it loose again. Walls/occupied cells/invalid targets spend nothing. Undo restores the lift; retry restores both tools. The clamp remains independently usable. Selecting a lift clears the clamp and vice versa, without changing saved state.

An initial locked-bead-only design did not recover the existing dead ends; engine analysis led to allowing loose beads as well. A demonstrated former dead end (hold bead 2 and tilt down, then right on tray 1) now finishes through left, lift bead 1 right, up, down. This is not a universal rescue guarantee.

The adviser now searches tilts, clamps and lifts and returns exact remaining move counts. Existing v1 journals retain shape/outcomes; new entries are strictly `{dir,lift}`, with derived usage replayed from history. Records count moves including lifts. No new game or level count.

## Evidence
24 tests pass: 13 engine and 11 jsdom 26.1.0. Prior 16 checks retained, with advisory expectations updated for the new mechanic. An old-solver option verifies the original 269-state clamp graph. Independent reverse traversal verifies the extended 1,127-state graph (138/182/807 states; 9/0/8 dead ends), and every proposed solution is replayed to completion. State counts are coverage, not content.

All three lift-assisted campaign fixtures finish in 3/5/5 moves. Tests cover no mutation, walls/occupancy/invalid action shapes, one-use semantics, socket entry/exit, old saves, reload after every action, unlocks, undo preserving earned records, retry, focus/pause/modal guards, exclusive tool selection, recovery and reset isolation. A test assumption that undo should erase newly earned records was corrected; actual behavior preserves records as intended. Both scripts pass syntax checks and local JS/CSS references resolve.

No actual rendered play, inspected screenshots, native keyboard/touch, mobile layout, full repository build or human enjoyment evidence. Required qualified improvement remains pending.

## Preservation and next work
Third head was `d2a68a67a60e12d17c301c9f2cd94169d37d1010`; no AGENTS.md in its tree. Main `5250882e835cba4cb10e9c826a91691ed0a43886` is unchanged from the preceding audit; prior changes were Gummy Bay/credits only. No Switch workspace control changes needed. Games navigation and shared catalogue remain untouched. No new deployment/cache check or success claimed; recorded rendering security rejection and publishing barrier were not repeatedly retried.

First-batch baseline remains 20 finished/improved, nine source-selected, zero verified live. Second batch remains 20 built/initially improved and 20 additional source upgrades, six additional rendered verifications and fourteen pending. Third ledger retains exactly fifty slots: seventeen prototypes built, zero qualified improved/browser-tested/integrated/live, thirty-three unassigned.

Next: naturally test the lift and clamp together on desktop and touch, inspect two-selector clarity and feedback, assess whether local manipulation adds satisfying choices, then make and verify the required rendered-play improvement. Keep this candidate unlisted. Continue independent implementation; the overall task is incomplete.
