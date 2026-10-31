# Needlepath — qualification and catalogue integration

Date: 31 October 2026. Third collection slot 47.

## Change and selection
Rendered baseline play crossed flower 5 without collecting it, then completed Window fern in 12 thread. The single best-score record did not reward exploring knot routes. Focus restoration also replaced useful feedback with “already stitched.”

Implementation `c81e91484c4487bf2e1bd3377271262546ed2a7e` adds independently saved seamless and knotwork patterns, attainable style-specific fine targets, optional pale numbered route traces, study-aware advice and explicit skipped-flower feedback. Trace comparison spends no thread and never plays a move. Existing ribbons/saves are preserved; historical scores never invent routes. In-game Games returns to the existing parent Collection.

Selected for calm, deterministic route planning and useful knot tradeoffs alongside the released action, dice tactics, racing and craft slate. Three compact authored samplers remain three boards; two studies per board and 31 winning action sequences are not extra levels. No content-duration or human-enjoyment claim.

## Evidence
- Candidate commit: `c81e91484c4487bf2e1bd3377271262546ed2a7e`.
- Candidate workflow [41163130615](https://github.com/ThatOneMop/study-desk/actions/runs/41163130615), job 124424851754: success.
- 24 engine/DOM checks, including 31 original winning routes, advisory correctness at 1,262 prefixes, style optima, best-pattern replacement, legal replay validation, old-save migration, skipped flowers and controls/guards.
- Desktop and 390×844 touch-emulated qualification each completed both studies on all three boards via UI controls. Covered exact reloads, traces, loss/undo/retry, native keyboard/taps, pause/dialog guards, scoped recovery/reset and Games navigation. Campaign progress was not injected; corruption/legacy cases were separate fixtures.
- Interactive rendered review completed both styles on the first sampler, seamless on the second and knotwork on the third, with trace/reload checks. Inspected desktop and phone pattern/record screenshots.
- Candidate artifact 13028137168: 30 screenshots; SHA256 `dc672f09e80bd2b1b225d147d34174fdd20fb906d80ed0ac626ec5e2c503a04a`.
- Promotion commit: `68acf01efc054a536a4f61577fde6540928a5eab`, based on fresh main `91155c64be71c4fced8a4c017ebe9e5ab3e0bf44`; only selected Needlepath source/tests/art, catalogue/credits/cache token and promotion configuration added.
- Promotion workflow [41163397525](https://github.com/ThatOneMop/study-desk/actions/runs/41163397525), job 124425674944: success. 153 focused checks plus seven desktop/touch game suites and seven real-catalogue suites. Search/group/sort/favourites, launch, shell pause, restart, top-level Games/Collection return and saved re-entry passed.
- 56 launch entries, 55 bundled routes / 276 HTML asset references; first-batch nine selected-route hashes/integrity passed. Relaxed collection and removed-workspace-control checks passed.
- Promotion artifact 13027379457: 160 screenshots; SHA256 `98fe35b2f945c324782ec6576fb87272ca5a7cf6395d0afa428c6030b61db71b`. Inspected Needlepath desktop search/favourite, phone pattern and saved-return screenshots: original hoop cover readable, stacked cards fit, no horizontal overflow.
- Main fast-forward used an expected-head lease. Concurrent work and all prior game saves remained outside the scoped change.

## Release verification
Pages workflow [41163797464](https://github.com/ThatOneMop/study-desk/actions/runs/41163797464), job 124426880472 succeeded. Live route: https://thatonemop.github.io/study-desk/games/needlepath/index.html . Interactive live play completed the first knotwork study at14thread, reloaded the saved pattern, enabled its trace, returned through standalone Games, launched via the real catalogue with progress intact, and returned from embedded Games to the existing Collection. No visible Switch workspace controls; source and live release agree. No current publishing barrier.

## Counts and next work
Third collection: exactly 50 slots; 24 built, 7 improved, 7 browser-tested, 7 integrated, 7 live. Seventeen built candidates still require rendered improvement/qualification; 26 slots remain unbuilt.
Second collection: 20 built, 20 initial improvements and all 20 additional-round improvements verified; 9 selected/live. First collection: 20 complete and 9 selected preserved.

Next: render-play Reedbreaker (slot 48), identify its most important weakness and implement a substantive game-specific upgrade. Preserve the seven third-batch releases and all earlier work. The requested 50-game third collection is not complete. Existing hourly schedule retained; no automation changes.
