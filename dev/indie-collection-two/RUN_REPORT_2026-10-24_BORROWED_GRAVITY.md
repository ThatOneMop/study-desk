# Borrowed Gravity — second batch, candidate 32

**Achieved: 12/20 playable, improved and finished; 0 selected, integrated or verified live. Exactly 20 new slots remain in the ledger.**

Borrowed Gravity is an original gravity-transfer platforming puzzle. Four authored galleries teach ceiling traversal, wall traversal, steering past a moving scanner and swapping between two sources. Borrowing changes the player’s pull and opens that source’s linked barrier; returning or swapping restores the previous barrier. All three samples and restored gravity are required at the exit.

## Initial version and improvement

Initial playable commit: [`64b73b611e18fb8563fb6b6d64cad5159ee58dca`](https://github.com/ThatOneMop/study-desk/commit/64b73b611e18fb8563fb6b6d64cad5159ee58dca). It passed 16 engine and 12 DOM checks before improvement. This initial commit skipped CI until the native harness was ready; no native pass is attributed to it.

Improvement and native verification commit: [`c4a3ab98f1177fbbed7c4ae62c910d49509f9702`](https://github.com/ThatOneMop/study-desk/commit/c4a3ab98f1177fbbed7c4ae62c910d49509f9702).

- Pure 1.5-second no-input drift forecasts for current, borrowed and returned gravity, including scanner warnings and exact endpoints.
- Unsafe returns and swaps are rejected with a reason when restoring a barrier would enclose the player.
- Eight-frame jump buffering and six-frame ledge grace make early/late presses more forgiving. Held jump does not automatically repeat; cancellation clears queued input. Initial saves migrate safely.
- Gravity-specific movement hints and persistent rejection messages improve onboarding and feedback.

The improved candidate passed 23 engine and 15 DOM checks. All four original campaign routes still clear. Those fixtures total 1,390 simulated frames; that is a regression measurement, not human play duration or an optimality proof.

Progression unlocks a slower steady harness after gallery one and extended borrowing reach after gallery two. Best route and transfer records support retries. There is no arbitrary currency grind. Original smooth Canvas/CSS art, scoped saves, exact paused reloads, confirmed restart/reset and corruption recovery complete the standalone game.

## Native evidence

[CI 40002581593](https://github.com/ThatOneMop/study-desk/actions/runs/40002581593) ran the exact improved source. Borrowed Gravity passed:

- All four galleries using real desktop keyboard and touch-emulated Chromium inputs, including multi-touch movement, two-source swaps, all samples and both calibration unlocks.
- Exact paused reloads in every gallery, preserving position, held gravity and simulation frame.
- Pure preview selection, jumping, native touch cancellation, bridge visibility pause and input release.
- Natural scanner loss and retry, isolated malformed-save recovery/reset, back navigation and absence of uncaught browser errors.
- A separate normal-RAF check showing borrowed upward gravity moves the player and pause saves the room.

The new-games [artifact 12523620121](https://github.com/ThatOneMop/study-desk/actions/runs/40002581593/artifacts/12523620121) contains 28 Borrowed Gravity and 28 Static Orchard screenshots. Downloaded ZIP SHA256: `7fba9d373f9f3ef872f429078c088a5b54af417eece15850601132c85f8a35b1`. Desktop transfer-chamber preview and phone completed-archive captures were inspected. Local desktop and 390-pixel layout checks also verified readable typography, controls, borrowing and pause/restore.

The browser workflow was split into four groups with at most three simultaneous jobs. Every prior browser suite remains enabled exactly once; artifact names are unique per group. This prevents the expanding suite from approaching its previous single-job timeout without reducing coverage.

## Regression status at handoff

The checks job passed **277 engine + 211 DOM = 488 tests** and public integrity gates. Native new-games, planning and craft-and-cargo groups passed, covering ten candidates. The motion group (Wellward and Ratchet Run) was still installing browser dependencies at the final check. Whole-workflow success and those two reruns are not claimed; their earlier verification remains in the ledger. Check this group before the next increment and retry if an infrastructure failure is transient.

Downloaded artifacts verified so far contain 250 screenshots: new-games 56, [planning 126](https://github.com/ThatOneMop/study-desk/actions/runs/40002581593/artifacts/12523355862), and [craft-and-cargo 68](https://github.com/ThatOneMop/study-desk/actions/runs/40002581593/artifacts/12523226875). Planning ZIP SHA256: `e3d3b09756844175222324a4fb05bb99935ca22cda1f426b62c7d24f93e102fa`; craft-and-cargo ZIP SHA256: `5fcf1a789f7391a418e28c674f846a34930045aeeccdcb4bf7d0a0d63d2613a0`.

## Quality and scope

Agent design review: enjoyment 3.5/5, depth 2.5/5, polish 3.5/5, reliability 4.5/5, variety 4/5. These are comparative design assessments, not player-survey scores.

The strongest feature is the coupled gravity/barrier transfer, made readable by previews. The limits are four very short rooms, modest progression, deterministic layouts, no audio layer and some phone scrolling. Touch evidence uses emulation, not physical devices. There is no claim of hours of content, human playtesting or full screen-reader accessibility. It remains a development candidate, not an automatic publication choice.

## Preservation and publishing

The first batch’s 20 finished and nine selected baseline was reread. Its sources, saves, catalogue entries and tests are preserved. Public main was observed at `ed2cf603aa47fc26e4f04216d5704351b72a32a9`, including messaging and movie/TV discovery. This increment writes only second-batch files and its regression workflow on `indie-collection-two-dev`; Gummy Bay and requested-game work are untouched.

Public asset/routes, nine selected first-batch hashes, exact twenty-slot ledger, current shell, bridge-pointer and relaxed-collection checks passed. Two inherited launcher tests still reference the removed `playerStudy` control; they are unchanged and are not reported as passing.

The latest public [release 39925660833](https://github.com/ThatOneMop/study-desk/actions/runs/39925660833) still fails Configure GitHub Pages. Fresh logs report “Get Pages site: Not Found” and “Create Pages site: Resource not accessible by integration”; prepare/upload/deploy are skipped. No live second-batch game links are claimed. Development itself remains possible.

Next: build, improve and test Tea for Ghosts (slot 33), then the seven remaining concepts. Reserve final work for deeper improvements, comparative selection, integration against freshly read main and release checks. Keep the task active while those requirements remain unfinished.
