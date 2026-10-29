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


## Counterweight released, cache mismatch repaired — 29 October 2026

Gameplay commit `1e6d909323ec6dc8039f42fa540083616fe63c82` passed [CI40839583026](https://github.com/ThatOneMop/study-desk/actions/runs/40839583026), job123332441477.61 Counterweight checks plus114 previously-promoted engine/DOM and5 bridge checks passed. Both desktop and touch emulation completed five original and five padded/rehearsed three-medal jobs, exact forecasts, rehearsal save isolation, draft loss/revision/discard/reload, keyboard, pause, restart/cancel, corrupt recovery and navigation; no browser errors. Existing asset, catalogue and first-batch integrity gates passed.

Inspected desktop-rehearsal-risk, touch-rehearsal-delivery and touch-rehearsal-complete. Cradle weight/overload previews, saved-attempt isolation and apply/discard are legible; fifth job shows63 moves, zero damaged loads/overloads. The phone layout requires vertical scrolling. Artifact12881739304 SHA256515c2fa092a2884684c8431ce5649849f09cdd999a6bc13faf6c93f166e4e375. Automated routes plus agent visual review, not human enjoyment or physical-device testing.

Main advanced with expected-head protection. Initial Pages40845881726 succeeded, but live reload exposed new HTML mixed with old JavaScript. Cache follow-up `1ce5518a6c6887c6d59222b0b07346f3b9e7dd44` versions engine.js, game.js, feel.js, style.css and feel.css URLs.61 focused checks passed again; [Pages40846065975](https://github.com/ThatOneMop/study-desk/actions/runs/40846065975) passed assets and deployment. Repeat full native regression runs on the promotion branch; gameplay source is unchanged from the reviewed run.

Live https://thatonemop.github.io/study-desk/games/counterweight/index.html now exposes working cradle and rehearsal controls. Clocked in, rehearsed rig/hook/raise, observed3 moves/3t padded load/1 cradle remaining, applied and reloaded those values, then returned to the live catalogue. No save clearing required. Source scan found no Switch workspace controls in launcher or Counterweight. Existing48 catalogue entries, saves and other work preserved.

Counts:20/20 additionally verified;9 selected;4 upgraded versions integrated and live,5 remaining. Third24/50 built,0 qualified improved/browser-tested/integrated/live. No new improvement pass or automation change.

Next: Check repeat cache-only promotion CI, then merge Reefwright, Copper Cadence, Wellward, Pocket Palaeo and Tea for Ghosts against fresh main, preserving concurrent graphics/input/pause layers. Version changed game assets when integrating to prevent old cached scripts mixing with new markup. Verify merged desktop/touch campaigns and screenshots before promotion. Third collection remains24/50 built and0 qualified improved/browser-tested/integrated/live; finish its remaining candidates and rendered improvement passes.


## Tea for Ghosts merge staged — 29 October 2026

Counterweight cache-only full regression40846074115 completed successfully. Main remains1ce5518a6c6887c6d59222b0b07346f3b9e7dd44 with4/9 selected additional upgrades live. No current publishing blocker; no unchanged deployment retry.

Tea for Ghosts promotion candidate `d600ffdaaec8f4c2b0d40bc87f17892d3629f521` merges its already-verified alternative tray, retained tasting reference, half-measure spoon and refine action with main's title/rest controls, sound, ghost accessories/reactions, pouring animation, gold burst and tea:act interface. Retains the live70/75/80 early-to-late success thresholds in scoring, UI, reaction effects and save validation, so earlier earned70-point memories remain valid. Number-key scoops/removals respect the selected measure; tray actions update the visual/audio layer. Versioned local asset URLs avoid the mixed-cache issue observed in Counterweight.

46 focused engine/DOM checks pass, including legacy70-point migration and title/rest guards against tray/reset mutation. Syntax checks pass. Native routes enter the real title screen after each reload and recovery navigation. [Merged browser CI](https://github.com/ThatOneMop/study-desk/actions/runs/40853957537) is running; includes six visitors, tools/tray, persistence, loss/retry, desktop/touch, current catalogue/assets and earlier selected-game regression. Do not count this as main-integrated/live until results/screenshots are reviewed and it is promoted. No new gameplay pass credited for compatibility work.

Counts unchanged:20 built/initially improved/additionally verified,9 selected,4 upgraded integrations/live; third24/50 built,0 qualified improved/browser-tested/integrated/live. Exactly20 candidate slots retained. First collection, catalogue, saves, Lane Eight and Gummy Bay preserved. No automation changes.

Next: Review Tea for Ghosts merged native CI and screenshots atd600ffdaaec8f4c2b0d40bc87f17892d3629f521 before promotion. Preserve live PASS70/75/80 thresholds, prior records, animated/sound/title/rest layers and half-measure keyboard behavior; fix any merged browser regressions. Then integrate Reefwright, Copper Cadence, Wellward and Pocket Palaeo against fresh main. Third collection remains24/50 built,0 qualified improved/browser-tested/integrated/live; complete remaining candidates and rendered improvements.


## Tea for Ghosts released — 29 October 2026

Commit `d600ffdaaec8f4c2b0d40bc87f17892d3629f521` was promoted to main with expected-head protection after the merged native run and screenshots were reviewed.

Merged CI 40853957537 passed: 46 Tea engine/DOM checks, 114 previously promoted checks, 61 Counterweight checks and 5 bridge checks; assets and first-batch integrity passed. Native desktop and emulated-touch completed six visitors, all three tools, half measures, blend tray/refinement, exact saves/reloads, loss/retry, keyboard, pause, recovery/reset and navigation without browser errors. Reviewed desktop-alternative-comparison, touch-half-measure-refined and touch-refinement-success screenshots from artifact 12887859430 (SHA256 49821c16fbfe3876df66fcd9b336f285f45e11c0603d6c5b2dd9db0dd293aa84). Phone layout still requires vertical scrolling. Automated routes and agent visual review are not human enjoyment or physical-device testing.

Pages 40862009832 succeeded at d600ffdaaec8f4c2b0d40bc87f17892d3629f521. Live UI verified mint blend parked, alternative honey blend swapped, both exact recipes preserved through reload, Mabel 100/100 cup awarded two seals and unlocked Otis. Returned to catalogue, searched Tea for Ghosts and launched it with saved memory intact. No Switch workspace controls observed; Games, search, grouping, sorting and favourites retained.

Counts: 20 built, 20 initial improvements, 20 additional-round verified; 9 selected, 5 selected upgrades integrated/live, 4 remaining. Third collection: 24/50 built, 0 qualified improved/browser-tested/integrated/live. No additional gameplay pass credited for release work. First-batch sources, 48 catalogue entries, saves, Lane Eight and Gummy Bay preserved. No automation changes.

Next: Integrate Reefwright, Copper Cadence, Wellward and Pocket Palaeo against freshly read main, preserving concurrent visuals/input/pause layers and saves. Version changed local assets; run merged desktop/touch routes and inspect screenshots before promotion. Correct Tea guide's minor Arthur/Otis name typo in a later copy pass. Third collection remains 24/50 built and 0 qualified improved/browser-tested/integrated/live; complete its remaining candidates and rendered improvement passes.


## Copper Cadence merge staged — 29 October 2026

Commit `1b39c47a143e8647d1dadf2c7c9e5c145da05213`: Merged Copper Cadence's already-verified silent catches and retained-suffix score repair with main's local Pause/Escape controls, sound, artwork and pulsing current beat. Pause now freezes repair apply/cancel and pending save mutations; resume restores the draft. Added 2 regression cases (63 focused engine/DOM checks pass) and desktop/touch native pause-during-repair coverage. Versioned all three local assets. Main remains d600ffdaa with 5/9 selected upgrades live; merged browser verification pending. No new gameplay pass or public entry counted.

[Exact merged browser run](https://github.com/ThatOneMop/study-desk/actions/runs/40870555821) covers five original and five catch commissions, score repair preview/apply/cancel, blocked revisions, saves/reloads, local pause and keyboard/touch controls, loss/undo, recovery, navigation and previous selected-game regression. Review results and screenshots before publishing.

No Switch workspace controls found in launcher or Copper Cadence source. Current main still has 48 catalogue entries; first collection, existing saves, Lane Eight and Gummy Bay preserved. Counts remain 20 built/initially improved/additionally verified, 9 selected, 5 upgraded integrations/live; third 24/50 built, 0 qualified improved/browser-tested/integrated/live. No automation changes.

Next: Review Copper Cadence merged browser CI 40870555821 at 1b39c47a143e8647d1dadf2c7c9e5c145da05213 and inspect desktop/touch repair screenshots. Preserve local pause/Escape, bridge guards, sound, beat highlighting and saves; fix failures before expected-head main promotion. Then integrate Reefwright, Wellward and Pocket Palaeo against fresh main. Third collection remains 24/50 built, 0 qualified improved/browser-tested/integrated/live.


## Copper Cadence browser focus correction — 30 October 2026

Merged CI40870555821 passed asset/first-batch checks and all63 Copper engine/DOM tests, then stopped in desktop repair pause coverage: Space natively activated the still-focused Resume button, so the subsequent Escape paused again. Test-only correction 4b26256a6fbe3add62aac94cc52fa252bc4120dc moves focus to the return link before blocked gameplay keys and asserts Resume still shows before explicitly resuming. No gameplay source change. Reviewed desktop-repair-preview from artifact12895359052 (SHA2560573b82abb263b17882f813e6b3acfa1130166f78e5d574ff73258ba7e06b87d): clear one-to-zero error comparison, catch efficiency cost and apply/cancel, preserved illustration; long page remains. Failed run does not qualify as completed merged browser verification.

[Corrected merged run](https://github.com/ThatOneMop/study-desk/actions/runs/40878843230) is running; asset checks passed. Source scan still finds no Switch workspace controls in launcher or Copper Cadence. No publication retry, gameplay pass or live release claimed. Counts unchanged:20/20 additionally verified;9 selected;5 upgrades integrated/live. Third24/50 built;0 qualified improved/browser-tested/integrated/live. Existing catalogue, saves and unrelated work preserved.

Next: Review corrected merged CI40878843230 at 4b26256a6fbe3add62aac94cc52fa252bc4120dc, inspect desktop/touch screenshots, fix any remaining failures and only then promote Copper Cadence against fresh main. Preserve native button keyboard activation and saves. Remaining selected upgrades: Reefwright, Wellward, Pocket Palaeo. Third24/50 built,0 qualified improved/browser-tested/integrated/live.
