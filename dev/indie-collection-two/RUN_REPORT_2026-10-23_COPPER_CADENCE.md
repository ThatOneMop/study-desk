# Copper Cadence — second-batch increment, 23 October 2026

Copper Cadence (slot 24) is the fourth second-batch candidate. It is a small mechanical percussion puzzler: feed a scarce supply of reusable beads into unequal-length tracks, brake their exits, and rotate the destinations while beads travel. Five commissions progress from a single pulse to two-track arrangements, a mandatory-brake synchronization puzzle, rotating destinations and recycled three-note chords. There is no real-time deadline. Keyboard and tap controls, free rewind, confirmed restart, optional synthesized sound and browser-local progress are implemented.

This is distinct from first-batch Stone Song: Stone Song edits rhythmic arrangements; Copper Cadence operates a physical pipeline with conserved inventory, queues, one-bead feeding, delayed arrivals and in-flight routing. All artwork and audio are original inline SVG/CSS and generated oscillator tones. No third-party collection or assets were imported.

## Improvement and review

The initial playable source and five authored solutions were preserved in `0f72f4d238eff2b1693d3dbf3e8f535ad80c85ff` after 21 passing engine checks. The improvement in `3a4d8659f47a4b3788af906ee907a93bcfbcad04` added exact next-turn previews, a conditional three-beat trace, errors and supply warnings, final leftover-bead penalties, motion feedback with reduced-motion support, stable keyboard focus and a compact phone layout. Forecasts do not spend turns or alter the save.

Design review found that the initial brake-teaching commission could be solved without brakes. `9d33ea9fcfe9347c6adbe11019da406592b9c95d` deliberately revises that commission: its requested solo drum and following chord compete for a feed beat, so the wood bead must be sent early and held. The independent unbraked-prefix search now proves that a perfect take cannot reach the first chord without braking. The new authored solution uses two brake beats. This is an intentional level revision, with the new score, fixture and proof committed together.

The first browser runs exposed a harness mistake: Space activated the help dialog's focused Close button, after which the test tried to close it again. `ac885cb7e7ed0629efbd865d92ad227be0f0c0c6` tests modal isolation with a feed shortcut instead; normal Space/Enter button behavior remains tested separately. Earlier failed runs are retained as evidence, not described as passes.

## Validation

Final exact-source [CI 39945625373](https://github.com/ThatOneMop/study-desk/actions/runs/39945625373) passed all **171 engine/interface tests** (94 engine, 77 DOM), full desktop and touch-emulated campaigns for all four candidates, and public integrity gates. Copper Cadence contributes 26 engine + 20 DOM checks. Its five commissions each completed at three seals in Chromium desktop 1280×1000 and touch emulation 390×844; tests cover forecast supplies, midgame reloads, blocked feeds, audio opt-in, loss/undo, keyboard/Enter/Space, restart/cancel, isolated corrupt-save recovery and return navigation, with no browser errors. [80 screenshots](https://github.com/ThatOneMop/study-desk/actions/runs/39945625373/artifacts/12497792894) were retained, including 22 Copper Cadence captures. Representative final desktop and phone midgame screenshots were visually inspected.

Locally, 170 engine and DOM checks passed before the level revision; Copper Cadence's revised 26 engine + 20 DOM checks then passed. Existing shell, bridge-pointer and relaxed-collection checks passed, as did route/assets, nine first-batch selected-source hashes and the exact twenty-slot gate. This is a buildless repository: syntax and static-integrity checks are its build checks.

All five Copper Cadence commissions were additionally completed through cloud-browser UI controls at three seals each: the first at desktop width and the remaining four in a 390px layout frame. That frame is a responsive-layout inspection, not physical-device testing. The revised third commission was included.

Known evidence limits: authored reference routes and deterministic exploratory engine tests are not exhaustive gameplay exploration or user enjoyment research. No physical mobile device, full screen-reader audit, subjective audio listening review or long-playtime claim is made. These are five compact commissions with seal optimization, not a substantial multi-hour campaign.

## Quality assessment and selection

Agent design review, 1–5 scale (not player-survey results): enjoyment 3.5, depth 3.5, polish 4, reliability 4.5, variety 4. The strongest part is reasoning about a visible, conserved pipeline; exact previews make its timing readable. The limited set of authored commissions and short campaign constrain replay depth. Keep it as a completed candidate for comparison with the broader slate; it is not yet selected for the public catalogue.

## Preservation, publication and next work

First-batch baseline was freshly read from `dev/indie-collection/FINAL_REPORT.md` at `c03682dc435ecdaacd94966273d789dd90e9f7b1`: 20 finished, nine selected, 66 improvement passes, zero verified live. No first-batch source, save key, catalogue entry or test was edited. Reefwright, Counterweight and Lanternwake remain intact. Main was re-read at `ed2cf603aa47fc26e4f04216d5704351b72a32a9`; current messaging, movie/TV, Gummy Bay and requested-game work was preserved. Only second-batch source/tests/workflow/records were committed, through leased updates to `indie-collection-two-dev`.

Published second-batch game links: **none**. Integration into a development branch is separate from public catalogue integration and live deployment. The latest public release [39925660833](https://github.com/ThatOneMop/study-desk/actions/runs/39925660833) was checked again on 23 October: route/assets passed, Configure GitHub Pages failed, and prepare/upload/publish were skipped. This publishing issue does not block game development.

The inherited `catalog-launch.cjs` and `curation-regression.cjs` checks still target the removed `playerStudy` control; they were not changed or claimed to pass. Current shell, pointer bridge and relaxed catalogue tests pass. Reconcile those old assertions before public integration.

**4/20 playable, improved and finished; 0 selected, integrated or verified live.** Reefwright, Counterweight, Lanternwake and Copper Cadence are finished development candidates. Sixteen slots remain concepts. The first batch, Nightshift and Afterlight are excluded.

Next: implement slot 25, Hollow Keeper, with a distinct beetle-colony defense loop; then improve and test it. Reserve later runs for comparison, selection, integration onto fresh main and final regression. No automation changes were made because the second collection is unfinished.
