# Second collection — first completed increment

**1/20 playable · 1/20 improved · 1/20 finished · 0 selected · 0 integrated · 0 verified live.** The nineteen other slots are proposed distinct games, not placeholder implementations or counted completions. The first collection and the separate Nightshift ten are excluded from these totals.

## Reefwright, overall slot 21

An original spatial reef puzzle: choose one of three mixed habitat pieces, rotate it and fit it around stones. Connected coral, kelp forests and nurseries compete for room; nurseries need both adjacent coral and access to open sea. Five authored coasts have different layouts, supplies and goals. Best surveys and campaign unlocks persist, with free undo and medal optimization.

The first meaningful improvement adds an exact placement forecast, warnings when a piece closes nursery sea access, a sea-channel overlay, deliberate touch confirmation and retained keyboard focus. Browser visual review led to a compact sticky habitat chooser on phones. No timers or content-count inflation were used.

- Initial playable source: [`64de8a9`](https://github.com/ThatOneMop/study-desk/commit/64de8a9cc7cb92bd7cd1cef109393b87e99476c3)
- Forecast/input improvement: [`235994f`](https://github.com/ThatOneMop/study-desk/commit/235994ffe87a59ef7e0d864f200696a211d7b07b)
- Final gameplay source, including mobile refinement: [`0cb2dee`](https://github.com/ThatOneMop/study-desk/commit/0cb2dee04c5190e30ac0f4a3c406c9394e061346)
- [Reefwright development source](https://github.com/ThatOneMop/study-desk/tree/indie-collection-two-dev/games/reefwright)
- [Successful exact-source CI 39923241054](https://github.com/ThatOneMop/study-desk/actions/runs/39923241054)
- [14 screenshot artifact](https://github.com/ThatOneMop/study-desk/actions/runs/39923241054/artifacts/12487524900)

## Tests and assessment

21 engine tests and 19 DOM/save/input tests pass. Desktop and touch-emulated Chromium each completed all five coasts with three medals using the real UI. Browser checks include preview non-mutation, rotation, invalid placement, exact forecasts, midgame reload, failure/reopen, campaign saves, restart cancellation/confirmation, keyboard traversal, corrupt-save recovery, return to the catalogue, no horizontal page overflow at launch and zero uncaught browser errors. Representative desktop and phone screenshots were inspected, then the complete browser suite rerun after mobile refinement.

Reefwright is a finished compact candidate, not yet a selected winner. Agent review rates enjoyment 4/5, depth 3.5/5, polish 4/5, reliability 4.5/5 and variety 4.5/5. These are design judgments, not player-study results. Its strengths are competing spatial goals and transparent planning; its limits are a short fixed campaign and no audio or randomized mode. No long playtime, physical-device, full accessibility or human enjoyment claim is made.

## Preservation and known failures

The branch starts from fresh public main `bded102680166c0107fd8a58fef1559be7a22efa`. First-batch report and core-loop ledger were read at development baseline `c03682dc435ecdaacd94966273d789dd90e9f7b1`: 20 finished, nine selected and 66 passes. The new branch adds only second-batch source, tests, workflow and records. No first-batch source, saves, entries or tests were edited, nor any Gummy Bay, Study Desk UI or Nightshift work.

Public checks passed: 19 route/asset checks, nine first-batch source hashes, shell behavior, pointer bridge and the updated relaxed-collection regression. Two older launcher tests (`catalog-launch.cjs`, `curation-regression.cjs`) fail because they click `playerStudy`, removed in base main. Their source and the public app files are identical to base main. These inherited test failures should be addressed in Study Desk maintenance before later integration; they were not hidden or weakened here.

The latest public release [39922574624](https://github.com/ThatOneMop/study-desk/actions/runs/39922574624) passed route/assets and failed at Configure GitHub Pages. The earlier run 39920109462 logs show `Get Pages site: Not Found`, then `Create Pages site: Resource not accessible by integration`. Upload/deployment never ran. No new live URL exists and none is claimed. CLI push lacked credentials, so GitHub tree/commit/ref tools preserved the work with expected-head protection.

Public main advanced concurrently to `013a8d009286fe02a37ebce76126f44c19c72ecf`, adding private-messaging links/docs in three commits. No write to main was made; these changes remain intact. Future selection must integrate into then-current main, not replace it with this development branch.

## Next increment

Prototype Counterweight (slot 22) as a crane-and-ballast cargo game, then improve and test it before counting it finished. Keep the slate flexible where a proposed mechanic overlaps earlier work; the planned barter concept was replaced to avoid duplicating Moss Market. As more candidates finish, compare the slate and promote only selected winners into fresh public main. The batch is incomplete and remains active.
