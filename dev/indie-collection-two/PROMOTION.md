# Second-batch promotion checkpoint — 29 October 2026

All 20 initial games and all 20 additional-round upgrades are verified. The separate checklist and ledger record 40 meaningful passes and nine selected finalists. First-batch sources and current catalogue entries remain intact.

Hollow Keeper is merged with current main's feel-kit.js/feel.js, HKGame interface and title/pause/audio layers on branch `indie-two-promotion`, commit `519934be03660c6c68dd8c0eeca7bc0060a43127`, based on main `2098eeb559d90c840faaab3b8c500b3623f37cbf`. The new source preserves version-one saves and per-step undo. The feel-layer shortcut legend now includes tool 6. Browser routes explicitly enter the existing title screen after each reload; no bypass is used.

52 merged engine/DOM checks pass locally, as does current curation-regression.cjs (46 entries, filtering, retained preferences/saves, pause and absent workspace controls). Full rendered merge regression and repository asset checks are pending on the promotion branch. Do not infer main integration or live release from this source commit.

Next: inspect promotion CI, fix failures, inspect merged desktop/touch screenshots, then promote the tested changes with a fresh main lease. Merge and regression-test the other eight selected upgrades; preserve concurrent visual effects and the 20 deliberately retired Nightshift/Afterlight entries. New selected Cairn & Cord and Murmuration need catalogue integration and launch checks. Keep the first batch, Lane Eight, Gummy Bay and third-batch branch untouched.

Counts: second 20 built / 20 initially improved / 20 additionally verified / 9 selected / 0 newly promoted additional-round versions in this run / 0 newly verified live upgrades. Thirteen earlier second-batch entries remain in main from concurrent work. Third 24/50 built, 0 qualified improved/browser-tested/integrated/live. No automation was changed. The task remains incomplete.


## First upgrade published; next two staged — 29 October 2026

Hollow Keeper promotion `519934be03660c6c68dd8c0eeca7bc0060a43127` passed CI 40821596198 (52 focused checks, current curation, assets and first-batch integrity, full desktop/touch campaigns). Inspected desktop-warning, touch-regrow-preview and touch-regrow-safe from artifact 12874183820, SHA256 06268e704769887ab546ef194549b330ffb5878657967e6c809f5a5b78dec66a. Existing visual effects and pause/audio remain. The last screenshot caught the title fade; later captures now wait for its hidden state. This is a test capture refinement, not a new gameplay pass.

Main fast-forwarded with an expected-head lease. Pages run 40826925321 succeeded. Live https://thatonemop.github.io/study-desk/games/hollow-keeper/index.html was played through the first wave: placed a bed via preview/confirm, launched and safe-marched to preparation for wave 2 (3 hearts, 8 resin). Reload preserved it; Study Desk return showed current collection. Full gameplay coverage comes from native CI, not this shorter live smoke check. Live launcher retains Games/search/Collection with no Switch workspace control.

Cairn & Cord and Murmuration source/tests and two catalogue entries are staged at `0f47f738eecde95c0608f9c045091e8e690eda6b` on indie-two-promotion. 62 engine/DOM checks plus updated curation regression pass locally. Exact-source native CI pending. Their entries use verified control descriptions; existing 46 entries, Lane Eight, retired list and saves are preserved. Do not count these two as main-integrated/live until promotion.

Counts: 20 built/initially improved/additionally verified; 9 selected; 1 selected additional-round version promoted and live-verified, 8 remaining. Thirteen earlier initial-version second-batch entries remain in the catalogue from concurrent work. Third 24/50 built, 0 qualified improved/browser-tested/integrated/live. No automation changes.


## Cairn & Cord and Murmuration released — 29 October 2026

Commit `0f47f738eecde95c0608f9c045091e8e690eda6b` passed integration CI [40827311110](https://github.com/ThatOneMop/study-desk/actions/runs/40827311110), job123293201908: 114 focused engine/DOM checks across the three promoted games, five Murmuration bridge checks, curation/assets/first-batch integrity, and full native desktop/emulated-touch campaigns. Cairn covers four standard and survey routes; Murmuration covers four migrations and alternate regroup decisions, forecasts, failure/retry, persistence, reset and navigation. Hollow Keeper regression also passed.

Inspected retained Cairn desktop-survey-0-forecast and touch-survey-0-outcrop images, plus Murmuration desktop-regroup-choice and touch-regroup-arrival. The climbing forecast exposes grip/rope/haul costs; regrouping exposes its food cost against the arrival requirement. Labels and controls fit; phones still require vertical scrolling. Artifact12877850126 SHA256: 59fa80d7302700f09d2d2c60aeb4eb6455b44f710f9674fe8a3517a56f447785. These are automated route and agent visual-review results, not evidence of human enjoyment or physical-device testing.

Main fast-forwarded from519934be03660c6c68dd8c0eeca7bc0060a43127 with expected-head protection. [Pages40832743585](https://github.com/ThatOneMop/study-desk/actions/runs/40832743585) succeeded. Live catalogue displays48 games (47 bundled and one external), preserving all46 prior entries and the retirement list. Search, Games, genre/group/sort/favourites and Collection remain; source scan of launcher and promoted shells found no Switch workspace controls. Live launcher and game shells also show none. Previous publishing permission failure is resolved; no user action required.

- [Cairn & Cord](https://thatonemop.github.io/study-desk/games/cairn-and-cord/index.html): Live catalogue search/launch, select hold a, inspect forecast (10→9 grip), climb and set anchor. Reload/relaunch retained hold a, 9 grip, 3 hearts and 2 anchors. Standalone route also rendered. Full four standard/survey routes, loss/retry, keyboard/touch, saves/reset/navigation passed CI.
- [Murmuration](https://thatonemop.github.io/study-desk/games/murmuration/index.html): Live catalogue search/launch, choose split formation, adjust wind by keyboard, take flight and pause. Standalone route reload restored paused flight, split formation, wind321 and twelve birds. Live screenshot inspected. Full four desktop/touch migrations and alternative regroup routes, food shortfall/loss/retry, saves/reset/navigation passed CI.

Current counts: second20 built /20 initially improved /20 additional-round verified /9 selected /3 selected upgraded versions integrated and live-verified. Fifteen second-batch entries are now listed, including earlier initial versions; that count is not interchangeable with the three upgraded releases. Third24/50 built /0 qualified improved/browser-tested/integrated/live. No automation changed. No new gameplay pass counted for release work.

Next: Merge the six remaining selected additional-round upgrades (Reefwright, Counterweight, Copper Cadence, Wellward, Pocket Palaeo, Tea for Ghosts) against fresh main, preserving concurrent feel/visual/pause/input layers. Run merged native tests and inspect screenshots before promotion, then verify deployment. Third collection remains 24/50 built and 0 qualified improved/browser-tested/integrated/live; complete its remaining candidates and rendered improvement passes. Keep hourly cadence unchanged.


## Counterweight merged, release verification pending — 29 October 2026

Promotion branch commit `1e6d909323ec6dc8039f42fa540083616fe63c82` is based on current main0f47f738. It combines the already-verified padded cradles and lift-rehearsal upgrade with the newer title screen, pause/audio controls, landing effects, CWGame interface and action/job/undo events. Coach search now distinguishes padded/unpadded cargo and remaining cradle supply, labels the new C action, and refreshes after applying/discarding a rehearsal. Preview wins do not emit a real completion celebration. Existing version-one saves and all catalogue entries are preserved.

61 engine/DOM checks pass locally, including title/pause guards against applying/discarding rehearsal, undoing, or rigging while paused. Native desktop/touch routes now enter the actual Clock in screen after each reload, wait for its fade to finish, and check pause before beginning the original and cradle/rehearsal campaigns. [Exact-source integration CI](https://github.com/ThatOneMop/study-desk/actions/runs/40839583026) is running. Source/asset, first-collection integrity, current curation and the three previously promoted games also run in that workflow. No main promotion until the merged rendered results and screenshots are reviewed.

Counts unchanged:20/20 additional-round verified,9 selected,3/9 selected upgraded versions integrated/live. Third24/50 built,0 qualified improved/browser-tested/integrated/live. No extra improvement pass credited for this compatibility merge. No deployment retry or automation change.

Next: Review Counterweight merged CI40839583026 at1e6d909323ec6dc8039f42fa540083616fe63c82 and inspect its desktop/touch retained screenshots. Fix failures before main promotion with a fresh expected-head lease. Preserve the title, pause, sound, effects, coach and existing save format. Then merge the other five selected upgrades (Reefwright, Copper Cadence, Wellward, Pocket Palaeo, Tea for Ghosts). Third collection remains24/50 built and0 qualified improved/browser-tested/integrated/live.
