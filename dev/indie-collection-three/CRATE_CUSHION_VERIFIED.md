# Crate & Cushion: qualified improvement

Verified 31 October 2026. Slot45 is built, improved and browser-tested; selected for catalogue integration, **not integrated or live yet**. Third-batch counts:24built,5improved,5browser-tested,4integrated,4live across exactly50slots. Second collection remains20/20 complete with its additional20/20 improvement round and9selected upgrades live.

## Gameplay change and qualification fixes

The rendered baseline required separate lifts and manual restoration for every blocking parcel. [566505d](https://github.com/ThatOneMop/study-desk/commit/566505d93013a6ee95455385b154c32af9735472) added a confirmed blocker-lifting placement: preview names affected parcels and protection, preserves unrelated packing, charges the normal lift-plus-placement cost and supports one-step undo. The v1 save key and old journals remain compatible.

[5f03639](https://github.com/ThatOneMop/study-desk/commit/5f03639067114461761c9484b9ef416079846e92) added complete browser campaigns and fixed a reproduced move-cap UI failure: Place/Lift looked enabled after multi-cost actions had exhausted the move budget. They now disable and explain undo/repack. Hidden confirmation regression now covers reset, rearrangement and recovery.

The first passing screenshots revealed a tall, heavily wrapped phone action and a false placement error on an already-dispatched crate. [fecf453](https://github.com/ThatOneMop/study-desk/commit/fecf453907cea951074e64eae8e3dc29cdf7daf7) uses two columns for phone packing actions, keeps full parcel names in the preview/confirmation, and replaces completed-state footprints/warnings with a clear replay prompt. These finish the same substantive improvement pass; they are not counted as extra games or extra completed passes.

## Exact-source evidence

CI41136733611 on fecf453907cea951074e64eae8e3dc29cdf7daf7 passed19 focused checks (10engine,9DOM), all3 care-seal jobs through normal controls on desktop1280×1000 and touch-emulated390×844, per-tray rearrangement/atomic undo, exact saves/reload, named blockers/cancel, pause, keyboard or native touch taps, repack/record retention, move-cap undo recovery, scoped reset/corrupt-save recovery and standalone Games navigation. All three records4/4/4 and care seals retained. Hidden reset/rearrangement/recovery guards covered by DOM tests.63 development bundled routes/231HTML references and9first-batch integrity checks passed. Artifact13015689017 SHA256d5d0e61a1cd95fc08b040ba6305671ef01d3f1c04b0768b1738d7354eab0a2f0 contains12screenshots; reviewed touch-rearrangement-confirm,touch-care-job-2,desktop-care-job-2. Phone controls now two columns, named confirmation readable, completed crates have no stale invalid footprint/warning. No horizontal overflow; vertical scrolling remains. Independent managed-preview CUA completed all3care jobs, reload, pause, repack cancellation/confirmation and Games return. Automated reliability and agent visual assessment, not human enjoyment or physical-device certification. No loss condition: invalid packing blocks sealing; undo and repack are recovery.

[Passing final CI](https://github.com/ThatOneMop/study-desk/actions/runs/41136733611) · [Screenshot artifact](https://github.com/ThatOneMop/study-desk/actions/runs/41136733611/artifacts/13015689017)

Initial CI41136419189 passed18checks and both campaigns; final CI reran after the screenshot-driven fixes and passed19checks. The two runs are not added together as unique tests. Move-cap and malformed-save browser fixtures are isolated; campaign progress was earned through normal UI actions, not state injection.

## Assessment and selection

| Measure | Agent rating /5 |
|---|---:|
| Enjoyment |3.5|
| Depth |2|
| Polish |3.5|
| Reliability |4.5|
| Variety |4|

Relaxed packing combines rectangular fit, padding adjacency and heavy-item separation. Reversible multi-parcel rearrangement supports useful experimentation and adds tactile spatial variety beside printing, dial mechanisms, curling and sailing. Selected as a compact puzzle, with limited campaign depth stated explicitly.

Limits: Three compact fixed four-parcel jobs, each solvable in four placements. Optional adjacency care goals and alternate arrangements offer modest replay, not a long progression campaign. Phone layout still scrolls vertically. No loss condition, audio, measured content-hours or physical-device claim.

## Preservation and next step

Main remained0e0549c071974f5b3ce8d7229833a719680a69c2 during this run. Its index.html/app.js still contain no Switch workspace text; the previous successful live audit applies to this unchanged release. No publishing retry or configuration change was needed, and no new live URL is claimed. Source changes are restricted to this candidate, its tests/workflow and development records. Earlier games, saves and concurrent main work are preserved.

Next: copy only qualified game files/tests onto fresh main, add original cover art, metadata/credits and embedded Games return, run real desktop/touch catalogue and selected-game regressions, then verify deployment. Continue Bramble Dice afterwards. Existing hourly schedule remains unchanged; the full third batch is not complete.
