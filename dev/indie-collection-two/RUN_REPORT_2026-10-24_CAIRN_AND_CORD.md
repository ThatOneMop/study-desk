# Cairn & Cord — second batch, candidate 34

**Achieved: 14/20 playable, meaningfully improved and finished. Six slots remain concepts. No new public catalogue or deployment changes were made by this run.**

## The game

Cairn & Cord is a small, deliberate climbing game. Pick adjacent holds, manage finite grip and chalk, pay out or reel rope, and place anchors on sound rock. The rope follows its clipped polyline; extra slack lengthens falls. Broad ledges let the climber rest and move the belay to reclaim rope and pitons. Four authored walls introduce traverses, rough holds and exposed windy holds. Each has an optional side-path cairn stone. Summit, stone and no-slip badges, plus best climbing-move records, support replay.

Initial playable source: [`e377ee962c3440138d9402c87bac6428d18e6ba8`](https://github.com/ThatOneMop/study-desk/commit/e377ee962c3440138d9402c87bac6428d18e6ba8), with 12 engine and five DOM checks. It deliberately skipped native CI until the improvement and browser harness existed.

Improvement: [`6584f914e61a3d92f0cb7ff37c74ca93c439203f`](https://github.com/ThatOneMop/study-desk/commit/6584f914e61a3d92f0cb7ff37c74ca93c439203f). Final phone refinement: [`d4ba35cbbcff3f7f40e81300a6cabc5f759d7e81`](https://github.com/ThatOneMop/study-desk/commit/d4ba35cbbcff3f7f40e81300a6cabc5f759d7e81).

## Meaningful improvement and review

- Pure next-move previews show resulting grip, hearts, rope slack and next wind. Unsafe moves explicitly forecast slips and death before commitment; invalid reach/tension choices explain why they cannot proceed.
- A dotted rope forecast makes the next segment visible. Current anchors remain connected by the real rope path.
- Undo replays the log without its final action, including reversing a fall, while preserving earned summit records. Finished summits cannot be undone.
- Taller routes receive more scene height, and hold controls are 44 pixels wide. Keyboard focus survives rebuilt wall controls and moves to a route heading after route changes.
- Visual review found too much scrolling on phones. The final fixed action panel keeps the forecast, climb button, rope adjustment, chalk and anchor controls together. It closes after movement or Back to wall.

All 25 scoped checks pass (16 engine, nine DOM): four complete clean cairn routes, exact previews along every reference route, tension and payout constraints, grip/wind, natural exhaustion and loss, undo, best records/unlocks, every-action save reload, forged/corrupt record rejection, bounded history, confirmation, isolated reset, blocked storage, focus and quick phone controls. Reference routes are authored examples, not optimality proofs. The exact-source CI checks job passed all 547 engine/interface checks after the final phone refinement.

Cloud UI independently completed all four three-badge climbs through rendered controls: the first at desktop width, the other three in a 390-pixel frame. Initial desktop and phone views, selected-hold rope previews and the fixed phone panel were visually inspected. This supplements, rather than replaces, complete native desktop/touch campaign verification.

## Tea for Ghosts follow-through and test infrastructure

The preceding native run 40011208465 completed the six desktop services, tools, replay and loss/restart, then waited on an animation-frame assertion after the bridge paused frames. The first correction removed that dependency but exposed an immediate assertion racing asynchronous postMessage delivery in [40016394627](https://github.com/ThatOneMop/study-desk/actions/runs/40016394627). Both new harnesses now await receipt of the actual visibility message before inspecting paused state, and dispatch the blocked click without requiring animation-based actionability. No Tea gameplay was changed.

Repeated Ubuntu browser-dependency downloads consumed much of prior job allowances. [`23c2bb63fd24ae9d9a0268248f60fcb62f4225ee`](https://github.com/ThatOneMop/study-desk/commit/23c2bb63fd24ae9d9a0268248f60fcb62f4225ee) lets all fourteen native harnesses use the runner's installed Chrome, logging its version. The existing Playwright install remains the fallback. Every prior suite stays enabled, with four groups and at most three jobs concurrently. Superseded pending runs were cancelled by GitHub's concurrency queue; no passing result is claimed for them.

Final exact-source run: [40018382932](https://github.com/ThatOneMop/study-desk/actions/runs/40018382932). The evidence result is recorded at the end of this report.

## Scope, comparison and preservation

This is a short authored route-management game, not a realistic climbing simulator or an open-world expedition. Anchors provide protection against mistakes; a clean route need not use every safety tool. Four walls, no audio layer and some phone scrolling limit depth and polish. There is no long-playtime, physical-device or human-enjoyment claim. It adds a different loop from the batch's crane, bucket/winch, cargo, tea and gravity games, but remains a candidate pending wider comparison.

The first-batch FINAL_REPORT was freshly read from the first development branch: 20 finished, nine selected, 66 improvement passes and zero verified live links at that report. This run passes the nine selected-source integrity checks, 19 public route/asset checks, exact twenty-slot second-batch gate, current shell, bridge-pointer and relaxed-collection checks. The inherited launcher assertions that still reference playerStudy remain unchanged and are not counted as passing.

Public main was re-read at `ed2cf603aa47fc26e4f04216d5704351b72a32a9`; edits are confined to second-batch sources, tests, workflow and records. First-batch sources/saves/catalogue, requested games, Gummy Bay, messaging and film/TV work are untouched. The separate all-created-games integration checkout was observed and preserved. Its publication must be verified independently rather than inferred from earlier commentary.

Latest Pages release [39925660833](https://github.com/ThatOneMop/study-desk/actions/runs/39925660833) is still the failed configuration release. No new live game URL is claimed by this run. Development remains possible; six new games and final evaluation/integration remain, so the task remains active.

## Final verification result

The checks job passed **314 engine + 233 DOM = 547 tests**. The new-games browser group passed all four complete Cairn & Cord three-badge campaigns and all six Tea for Ghosts services on desktop and touch emulation, with saves, failure/restart, isolated recovery, pause and navigation. Borrowed Gravity and Static Orchard also passed their complete unchanged suites and normal-RAF checks. The planning group passed all six existing games; the motion group passed Wellward and Ratchet Run.

The [new-games artifact](https://github.com/ThatOneMop/study-desk/actions/runs/40018382932/artifacts/12528844767) contains 112 screenshots, 28 per game. ZIP SHA-256 `b4af6bfb14956dfd9caf25de8f22543005b117abc1e4733158f175a2774f1e76` matches the downloaded archive. The final desktop Cairn wall preview, phone traverse/rope preview and phone Tea final-visitor/memory view were inspected. Those scoped successes justify marking both candidates finished. Installed browser version in the job: Google Chrome 155.0.8059.39. No physical-device or hours-played claim is made.

Whole-workflow final status: **success**. All five jobs passed, including the unchanged craft-and-cargo group. This verifies all fourteen native desktop/touch suites on the exact final gameplay revision. Next candidate: **Murmuration**, slot 35.
