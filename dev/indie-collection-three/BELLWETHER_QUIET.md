# Bellwether Quiet paws — 27 October 2026

Source commit: [56f433122a9298ebf22af4686e2be4b0e62f4366](https://github.com/ThatOneMop/study-desk/commit/56f433122a9298ebf22af4686e2be4b0e62f4366).

## Change and reason

Source inspection identified a control limitation: every walk forced nearby sheep to move, even when the player was trying to approach from another side. Quiet paws adds a deliberate alternative. Toggle it on, select a direction and inspect the forecast; the dog takes one step while every sheep stays put. Toggle it off to nudge again. Whistles are unchanged. Quiet steps still count toward the route record and cannot cross sheep, rocks, fences or the shelter.

Changing the toggle clears any pending prediction. Button, keyboard and adjacent-square tap input share the mode. Reload, retry, meadow change and reset default it off. Pause/dialog states disable it. Committed actions use strict quiet-north/east/south/west strings in the existing v1 journal; there are no save-key, record or old-journal changes.

## Verification

22 tests pass: 11 engine and 11 jsdom 26.1.0, including all 16 existing tests. Both scripts pass syntax checks. New checks cover actual pressure-versus-quiet differences, input immutability, step cost, replay and undo, blocked destinations, malformed actions and post-win rejection. UI tests verify preview invalidation, all input paths, pause, unaffected whistles, default-off reload/retry/reset, and complete campaigns with save/reload at every step and record preservation/improvement.

Three new automated routes include quiet actions and complete in 11/9/17 steps. The old action-set shortest routes remain valid. New routes were found with breadth-first search requiring at least one quiet action; they are automated mechanical evidence, not human enjoyment or an expanded-content claim.

Source remains a static browser game with the existing bridge and no added runtime dependency. No full-repository build is claimed from the partial workspace.

## Preservation and audit

Started from aa4c38697d374c8a0eea65658e9787353dfe2805 and re-read the remote files before editing. No AGENTS.md was present in that tree. First-batch baseline remains 20 finished, nine source-selected and zero verified live URLs. Second branch remains 3949e3d9f8e2e9846dc4c91c436d90b19bbbd341.

Main observed at 7be343a4b7638a11b75c273c88c744c4de834099. Changes since a4e735c9a1dd46e6f75af0370c181e36f76267ba are Gummy Bay and credits. Launcher index/app are unchanged; reviewed Gummy Bay shell diff introduces no Switch workspace control. Bellwether also retains Games navigation and no workspace-switch button. Main and all other games/saves/catalogue entries remain untouched.

## Honest qualification

Third batch: **17/50 built, 0 improved, 0 browser-tested, 0 integrated, 0 verified live**. The ledger retains exactly 50 slots, 33 unassigned. Second additional round: **6/20 rendered verified, 14 pending**, with all twenty source upgrades already implemented.

This is a source-led gameplay refinement, not the required rendered-play improvement pass. The existing security-policy browser rejection was not bypassed or retried. Natural play and screenshots must assess whether quiet positioning improves control without making the puzzles too easy, plus actual mobile layout, native focus and navigation. The game stays unlisted.

Publishing was not retried; the existing GitHub Pages configuration barrier remains unresolved. No new live URL is claimed. Continue independent candidate work while preserving the pending rendered checks and final selection obligations.
