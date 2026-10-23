# Second collection — Lanternwake

**3/20 playable · 3/20 improved · 3/20 finished · 0 selected · 0 integrated · 0 verified live.** Seventeen candidates remain concepts.

This increment adds slot 23, **Lanternwake**, to the separate second collection. The first twenty games, Nightshift and Afterlight are excluded from its count. The ledger retains exactly twenty new candidate slots, overall 21–40.

## Game

Sail a small boat across five marsh charts, collect firefly jars and reach the home dock. Only illuminated water is navigable. Floating lanterns illuminate connected water around rocks but last six turns after throwing. Moths move toward the nearest lantern, eat lights they reach and damage an adjacent boat. Placing a light behind the boat can divert a moth while opening another channel. Reclaim nearby lights for oil, or visit a reed refuge for a one-time refill.

The compact authored campaign introduces light reach, a single moth, refuge islands, two competing moths and a final crossing with three jars and limited oil. Original pixel illustrations show the boat, reed banks, jars, moth wings, dock flags, lantern countdowns and water glints. Motion respects reduced-motion preferences. There are no third-party assets, runtime dependencies or real-time timers.

The game has free undo, sequential unlocks, permanent best medals, restart confirmation, replay-validated saves and isolated corrupt-save recovery. Its storage key is `study-desk-lanternwake-v1`. P remains reserved for the Study Desk bridge.

## Implementation and improvement

- Initial playable implementation: [`203c0aa`](https://github.com/ThatOneMop/study-desk/commit/203c0aaa5cac9cccaba1318bf9254b871188dceb).
- Main improvement: [`d2836f6`](https://github.com/ThatOneMop/study-desk/commit/d2836f64f1d12ae318924bb7f12349373e4928a5).
- Final gameplay and keyboard refinement: [`c017ff9`](https://github.com/ThatOneMop/study-desk/commit/c017ff969c15f763e59f4f5b22788f613f2e5ced).
- [Development source](https://github.com/ThatOneMop/study-desk/tree/indie-collection-two-dev/games/lanternwake).

The meaningful improvement makes the consequences of a turn inspectable before commitment. Controls label blocked moves, hull loss and disappearing lights, including a just-thrown lantern eaten immediately. Hover/focus previews the exact next boat and moth positions on the chart. Optional planning mode lets touch players stage an action, inspect it, then explicitly commit or cancel without spending a preview turn. The final refinement makes Enter commit while an action button retains focus and warns before the action limit ends a run. Desktop map/header dimensions were reduced after visual review to bring controls closer to the chart.

Rules, authored routes and initial save schema are preserved by this improvement; records are still verified from action history.

## Evidence

[Final exact-source CI 39938472688](https://github.com/ThatOneMop/study-desk/actions/runs/39938472688) passed on `c017ff9`:

- **24 Lanternwake engine tests + 21 DOM/save/input tests**.
- **125 total engine/DOM checks** across Reefwright, Counterweight and Lanternwake.
- All five Lanternwake crossings completed with three medals on Chromium desktop (1280×1000) and touch emulation (390×844). Each action's displayed hull/oil/jars/lights forecast matched its result. Reload was checked midway through every crossing.
- Direct desktop input and two-step touch planning, failure/undo, keyboard Enter commitment, restart/cancel, corrupt recovery preserving another key, launch/return navigation and zero uncaught browser errors passed.
- All previous Reefwright and Counterweight browser campaigns passed unchanged.
- [58-screenshot artifact](https://github.com/ThatOneMop/study-desk/actions/runs/39938472688/artifacts/12495137357), including 22 Lanternwake captures; final desktop completion and phone midgame samples visually reviewed.
- Public routes/assets, nine first-batch source hashes, exact twenty-slot ledger and syntax gates passed. Local shell, bridge-pointer and relaxed-collection checks also passed.

The initial improved-source regression passed 68 engine and 55 DOM tests, all Reefwright/Counterweight browser campaigns and all five Lanternwake desktop crossings. It then failed its Enter-commit interaction check. The focused-action Enter behavior and browser check were corrected, with two extra DOM tests for keyboard commitment and action-limit feedback. The final-source run above supersedes that failed run; the failure is not hidden or treated as a successful complete browser pass.

All five crossings were also completed through the cloud browser’s visible game controls: the first two at desktop width, then the last three at 390-pixel frame width, including planning mode and the focused-action Enter fix. That frame check verifies responsive layout, not physical touch input. After installing the pinned test-only jsdom dependency locally, all 57 second-batch DOM checks also passed alongside shell, bridge-pointer and relaxed-collection checks. Full desktop/touch-emulated campaigns run in GitHub Actions with pinned test dependencies. The two inherited public-shell tests still target the removed workspace control; they and the public shell were not edited or claimed to pass in this increment.

| Crossing | Verified clean reference turns | Lantern throws | Three-medal limits |
| --- | ---: | ---: | --- |
| A light to follow | 11 | 1 | 24 turns / 3 throws |
| The hungry wing | 12 | 2 | 28 turns / 4 throws |
| Reed islands | 22 | 4 | 30 turns / 4 throws |
| Twin embers | 18 | 2 | 34 turns / 5 throws |
| The last crossing | 19 | 5 | 38 turns / 5 throws |

Reference paths come from bounded deterministic beam search; they are not proven shortest paths. Tests preserve these fixtures and independently exercise rejected moves, light reach around rock, expiry, moth ties, oil/refuge rules, multiple-moth damage, loss/undo, action bounds, forged/locked saves, permanent records and exact forecast equivalence for every available action along the reference paths.

## Assessment and selection

Agent design review, 1–5 (not player survey): enjoyment **3.5**, depth **3.5**, polish **3.5**, reliability **4.5**, variety **4** after final verification. Its strongest distinction is that the same temporary light both enables navigation and attracts hazards. This differs from Tidepost cargo logistics, Echo Vault stealth and the two earlier batch-two spatial/physical games. The source is compact and deliberate, with five fixed maps and generous early mastery targets; no sound, procedural campaign, substantial-hour claim, physical-device test or full screen-reader audit is asserted.

Retain Lanternwake as a finished development candidate for comparison with the wider slate. It is not automatically selected or added to the public catalogue. Subsequent selection must weigh its light-lure routing against the other finished candidates for variety and depth.

## Preservation and publishing

Only Lanternwake source/tests, the second-batch workflow and second-batch records were written on `indie-collection-two-dev`. Public main was re-read at `ed2cf603aa47fc26e4f04216d5704351b72a32a9`; concurrent messaging, film/TV discovery, Gummy Bay and first-batch source remain untouched. The pre-existing unfinished DOOM download is preserved.

[Latest public release 39925660833](https://github.com/ThatOneMop/study-desk/actions/runs/39925660833) passes routes/assets but fails at Configure GitHub Pages; prepare, upload and deployment are skipped. No new live game URL or deployment is claimed. This publishing blocker does not prevent development of the remaining candidates.

## Next

Implement **Copper Cadence**, slot 24, around a musical machine with manual percussion timing/routing. Seventeen new candidates remain concepts. Later increments must finish and improve each, compare the complete slate, integrate only selected winners into then-current main, and verify publishing if Pages access becomes available. The collection is incomplete, so its automation remains active.
