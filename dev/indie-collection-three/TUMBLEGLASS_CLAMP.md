# Tumbleglass clamp refinement — 26 October 2026

Implementation: `a32f7119573ed337e270ac68279d41ff0219ff18` on `indie-collection-three-dev`.

## Concrete change

Before, every tilt moved every loose bead. Players now have one optional clamp per attempt: select a loose bead, then tilt to hold it in place while the others slide. This creates a bead/timing decision; spending the clamp removes that option for later tilts. It cannot hold an already locked bead. A tilt with no movement is free, undo restores the resource, and retry resets it.

Three assisted routes change bead positions relative to the same unclamped tilt and complete all trays in 3/5/5 tilts. Original routes remain valid. This is source-driven refinement, not a completed rendered-playtest-led improvement. The three-tray campaign is still compact.

## Verification

**11 tests pass: 6 engine, 5 jsdom 26.1.0**, plus syntax checks for both scripts. All original tests remain. Added evidence includes assisted campaign wins, exact saves/reloads, clamp consumption, illegal reuse and locked-bead rejection, no-op handling, undo recovery, immutable journal entries, legacy v1 string-journal compatibility, selector focus and pause/dialog guards. New clamp journal objects are replayed to validate legality. Dialogs are simulated.

No rendered browser play, screenshots, native touch/keyboard activation, full repository build or human enjoyment claim. Improved/browser-tested counts remain zero for this batch.

## Concurrent state and publication

Main advanced to `dc88f09cfb30cae92e3f0e9afe65cd2f7ddaf4f7` with Gummy Bay and publishing workflow changes; these remain untouched. Fresh reads of the changed Gummy Bay HTML/game script found no “Switch workspace” label. Shared launcher files were not among the returned main changes. This is source inspection, not new desktop/mobile verification.

The latest [main publication run 40236385785](https://github.com/ThatOneMop/study-desk/actions/runs/40236385785) passed route/asset verification, failed Configure GitHub Pages, and skipped prepare/upload/deploy. No live release is claimed. No publishing retry or configuration mutation was attempted. Existing configuration-access remediation remains unresolved; this check establishes the failing stage, not a new diagnosis of its error text.

Second branch remains `3949e3d9f8e2e9846dc4c91c436d90b19bbbd341`. First collection remains preserved. Exactly 50 third-batch slots: **10 built, 0 improved/browser-tested/integrated/live**. Second additional round: **20 source upgrades, 6 rendered-verified, 14 pending**.

Next: rendered desktop/touch review of clamp selection/feedback and puzzle depth; implement a substantive playtest-led improvement before selection. Continue remaining independent game implementation while rendering is blocked.
