# Hollow Keeper — second-batch increment, 23 October 2026

Hollow Keeper (slot 25) is the fifth second-batch candidate. Shape tunnels beneath a tree, plant and reinforce thorn beds, then defend a beetle nursery against two waves in each of five hollows. Separate entrances, armored intruders, limited trap charges and reversible soil edits make the route itself a resource. Fruit can pull an intruder back across a charged bed during defense. Each wave is stepped manually or through optional auto march, which stops between waves and never resumes after reload.

This is a compact maze-defense puzzle, distinct from the first batch's worker/rescue loop in Queen of Cinders. It is not a deep colony simulation. Original inline SVG depicts root walls, soil, mushroom nurseries, thorns and armored grubs. No third-party collection or assets were imported. Best seals and current actions save under the isolated `study-desk-hollow-keeper-v1` key, with replay verification, free rewind and confirmed restart.

## Playable version and meaningful improvement

Initial playable source was committed as `f6266bd85765772a9c7824b77f48e4f96b152837` after 21 engine and 15 DOM tests passed. A bounded authoring search found a no-damage two-wave solution for every hollow; these reference routes are retained as fixtures, not claimed to be optimal solutions.

Improvement commit `73b95527ab3861f9e75a9047564169c098a809db` adds:

- Dotted deterministic routes and an exact scout report for the remaining wave with no further player changes.
- Staged tool previews showing projected supplies, hearts and altered routes before a separate confirmation. Cancel spends nothing. Selecting fruit pauses auto march.
- Stable keyboard focus across rerenders, native Enter selection followed by Enter confirmation, and Escape cancellation.
- Dark crossed-out depleted thorn beds, making exhausted defenses distinguishable from ready ones.
- Tool selection beside the map at all screen widths after phone layout review.

Scouts help compare plans without forcing blind trial and error. They make a conditional prediction; changing the defense or adding fruit changes the outcome. Engine checks compare predictions against actual full-wave execution and verify that previews cannot mutate the source state.

## Validation

Final exact-source [CI 39953185745](https://github.com/ThatOneMop/study-desk/actions/runs/39953185745) passed **216 engine/interface tests** (119 engine, 97 DOM), full desktop and touch-emulated campaigns for all five candidates, and public integrity gates. Hollow Keeper completed all five hollows at three seals at 1280×1000 desktop and 390×844 touch emulation. Exact scouts and tool costs, midgame reload per hollow, invalid previews, route toggles, loss/undo, native keyboard focus/Enter/Space, auto pause, fruit, restart/cancel, isolated corrupt-save recovery and return navigation passed with no browser errors. [102 screenshots](https://github.com/ThatOneMop/study-desk/actions/runs/39953185745/artifacts/12502075149) were retained, including 22 Hollow Keeper captures. Representative desktop hollow 4 and touch hollow 5 midgame captures were visually inspected.

Local checks passed: **216 engine/interface tests** across five candidates (119 engine, 97 DOM), including Hollow Keeper's 25 engine and 20 DOM checks. Hollow Keeper covers all five complete campaigns, terrain connectivity and spending, trap charges/upgrades/reclaim, spawn cadence, armor, lure eating/expiry/recrossing, stationary trap occupants, defeat, undo, best records, unlocks, exact replay saves, malformed/corrupt saves, unavailable storage, invalid actions, staged previews and keyboard/modal guards.

Public shell, bridge-pointer and relaxed-collection checks passed, along with 19 bundled route/assets checks, nine first-batch selected-source hashes and the exact twenty-slot gate. This is a buildless repository; JavaScript syntax and static-integrity checks are its build checks.

Additional direct browser play completed the first hollow at desktop width and the second and third in a 390px layout frame, all at three seals. The frame checks responsive layout; it is not physical touch-device testing. The updated controls and planning panel were visually inspected.

Known limits: reference solutions and exploratory tests are not exhaustive gameplay exploration or player research. There are five short authored hollows with seal optimization, not evidence of a multi-hour campaign. No physical-device or full screen-reader audit is claimed. There is no audio dependency.

## Quality and selection

Agent design review on a 1–5 scale, not player-survey scores: enjoyment 3.5, depth 3.5, polish 3.5, reliability 4.5, variety 4. The strongest decisions are redirecting shared paths, using limited thorn charges and rescuing an imperfect defense with fruit. The readable routes, safe previews and rewind support experimentation. Five compact levels limit long-term depth; the phone view still uses vertical scrolling to move between planning and wave controls.

Retain as a completed development candidate for comparison with the broader slate. No public selection is made yet. It adds maze-defense variety alongside Reefwright ecology, Counterweight balance, Lanternwake navigation and Copper Cadence mechanical timing.

## Preservation and publication

The first-batch final report was freshly read at `c03682dc435ecdaacd94966273d789dd90e9f7b1`: 20 finished, nine selected, 66 meaningful passes, zero verified live. No first-batch source, save key, catalogue entry or test changed. The preceding four second-batch candidates are unchanged. Main was re-read at `ed2cf603aa47fc26e4f04216d5704351b72a32a9`; current messaging, movie/TV, Gummy Bay and requested-game work was preserved. Only second-batch files were written, using leased updates to `indie-collection-two-dev`.

Published second-batch game links: **none**. Development-branch source is separate from public catalogue integration and live deployment. The latest main release [39925660833](https://github.com/ThatOneMop/study-desk/actions/runs/39925660833) was checked again on 23 October: routes/assets passed, Configure GitHub Pages failed, and prepare/upload/publish were skipped. This does not block development.

Inherited `catalog-launch.cjs` and `curation-regression.cjs` still target the removed `playerStudy` control. They were preserved and are not claimed to pass. Current shell, bridge-pointer and relaxed-collection checks pass. Reconcile the stale assertions before public integration.

**5/20 playable, improved and finished; 0 selected, integrated or verified live.** Fifteen slots remain concepts. First-batch games, Nightshift and Afterlight are excluded from the count.

Next: implement slot 26, Paper Odyssey, around folding a map to change island connections; then improve and test it. Later runs remain reserved for comparison, winner selection, integration onto fresh main, deployment verification and final regression. The automation remains active because the second batch is unfinished.
