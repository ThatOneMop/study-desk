# Static Orchard — second batch, candidate 31

**Achieved: 11/20 playable, improved and finished; 0 selected, integrated or verified live. Exactly 20 new slots remain in the ledger.**

Static Orchard is an original charge-and-chain action defense with four compact orchards. First-batch sources, saves, catalogue entries and tests are unchanged. Nine second-batch slots remain concepts; no candidate has been selected or published.

## What was built

- Continuous aim, charge and release. Quick sparks hit one pest; medium charges chain through three; full fruit arcs through five nearby pests. Choosing a fruit changes reach and emergency pulse coverage.
- Four enemy mixes: clustered mites, weaving moths, armored beetles and fast hornets, then a queen with alternating shield windows. Three swarms form each orchard defense.
- Harvest energy from defeated pests can fund a nearby defensive pulse. Orchard records earn seals for a quick coil, wider arc fork and tougher bark. Repeating an unchanged record does not farm currency.
- Nine windseeds vary entrances, while the harvest book retains best health, harvest and chain records.
- Original smooth Canvas/CSS orchard artwork, responsive controls, keyboard and pointer/touch input, onboarding, auto-pause, exact saved swarms, confirmed restart/reset, strict save decoding and isolated corrupt-save recovery.

This is distinct from Afterlight’s static Lumen Grove chain-placement game and Orchard Atelier’s catching loop. Static Orchard asks the player to track moving enemies and choose release timing, charge strength and emergency spending.

## Initial version and meaningful improvement

Initial playable commit: [`a3485e64b8fc7af817f05384eae73713c3f9a7ff`](https://github.com/ThatOneMop/study-desk/commit/a3485e64b8fc7af817f05384eae73713c3f9a7ff). It passed 12 engine and nine DOM tests. This initial commit deliberately skipped redundant CI before native tests were added; no browser pass was claimed for it.

Improvement commit: [`c5572e4de57bf9b55edd14ca239fc4a853e3b807`](https://github.com/ThatOneMop/study-desk/commit/c5572e4de57bf9b55edd14ca239fc4a853e3b807).

1. Exact dotted arc forecasts and numbered neighbors show the chain before release; charge is visible beside the aim point.
2. Keyboard T cycles automatic target tracking. Arrows or pointer aiming return to manual control. The player still chooses when to charge and release.
3. The original global pulse trivialized swarms. It now costs four harvest and only affects pests within 180 pixels of the selected fruit. A range circle and target count explain where it works; unavailable pulses are disabled.

The updated candidate suite passed 25 tests (14 engine, 11 DOM). Additional engine exploration cleared all 36 orchard/windseed combinations with base equipment and ordinary charge/aim/release inputs: 243 shots, minimum six remaining health. That establishes reachability under a deterministic tracking policy, not human enjoyment, challenge or play duration.

## Native verification

Native verification commit: [`e8f1e4ee390682193592005fc2ef38df0a841f72`](https://github.com/ThatOneMop/study-desk/commit/e8f1e4ee390682193592005fc2ef38df0a841f72).

The initial native run [39994707522](https://github.com/ThatOneMop/study-desk/actions/runs/39994707522) passed all 450 engine/DOM checks but stopped on a harness mistake: Space activated the guide’s focused close button, after which the test tried to close the already-closed dialog. The correction tests an arrow key inside the guide and respects native button semantics. Game source did not change.

In [CI 39995202317](https://github.com/ThatOneMop/study-desk/actions/runs/39995202317), Static Orchard’s native step passed:

- All four orchards through real desktop mouse and touch-emulated Chromium input; held charge, moving aim and release, armor and the queen shield.
- All three functional tool purchases and the completed harvest book.
- Mid-defense reloads at every orchard with exact pest state restored and simulation paused.
- Desktop keyboard tracking, Space charging, fruit selection and manual aim; native touch cancellation without an accidental shot.
- Genuine idle loss, restart cancellation/confirmation, isolated corrupt-save recovery and new-book reset, return navigation and no uncaught browser errors.
- A separate normal-RAF charging check without an accelerated test clock.

The complete run passed **254 engine + 196 DOM = 450 checks**, every desktop/touch campaign across all eleven candidates, and public preservation gates. [Artifact 12519948143](https://github.com/ThatOneMop/study-desk/actions/runs/39995202317/artifacts/12519948143) contains **266 screenshots**, including **28 Static Orchard images**. Its downloaded ZIP SHA256 is `6a1fca085d7fd05933ef74bb895f6e9a80cd9df0dc99589a24a4fe25f7adbfdc`. Desktop charged-arc and phone completed-harvest captures were inspected; direct local desktop/narrow-screen QA also checked readability and pause behavior.

## Quality and scope

Agent design review: enjoyment 3.5/5, depth 2.5/5, polish 3.5/5, reliability 4.5/5, variety 4/5. These are comparison notes, not player-survey scores.

The satisfying part is making a moving swarm briefly become a circuit. The readable forecast and pulse restriction improve control and decision-making. The limitations are substantial: four short authored defenses, modest upgrades, entrance variations rather than procedural campaigns, no audio layer and no long-term colony economy. Touch was emulated, not tested on physical devices. There is no human-hours, full screen-reader or long-form-content claim. It remains a development candidate for later comparison, not an automatic catalogue selection.

## Preservation and publishing

Public main was freshly observed at `ed2cf603aa47fc26e4f04216d5704351b72a32a9`. All writes are scoped to this candidate, second-batch records and the regression workflow on `indie-collection-two-dev`. The first batch’s 20 finished/nine selected baseline is preserved. Public routes/assets, nine selected first-batch hashes, the exact 20-slot ledger, current shell, bridge-pointer and relaxed collection checks passed. The inherited `playerStudy` launcher assertions remain unchanged and are not claimed to pass.

The latest public [release 39925660833](https://github.com/ThatOneMop/study-desk/actions/runs/39925660833) still passes route/assets validation but fails Configure GitHub Pages; prepare, upload and publishing are skipped. The freshly read job log specifically reports “Get Pages site: Not Found” and “Create Pages site: Resource not accessible by integration”. No live Static Orchard link is claimed. Repository development is not blocked.

Next: implement, improve and test Borrowed Gravity (slot 32). As the suite grows, split independent browser campaigns into bounded parallel CI jobs before the existing 20-minute job limit becomes a blocker, preserving all coverage. Reserve final work for deeper slate improvements, selection, scoped integration against fresh main and deployment checks. Keep the task active because nine games and public selection/integration remain unfinished.
