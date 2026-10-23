# Ratchet Run — second-batch increment, 24 October 2026

Ratchet Run (slot 27) adds real-time action to the second slate: ride a courier bike across five authored courses, hop broken bridges, brake for cobbles, protect three cargo straps and stop in a striped delivery bay. Optional blue parcels reward airborne lines. Deliveries unlock the next route; intact cargo and all optional parcels earn extra seals. Soft suspension tolerates harder landings; firm suspension offers more speed at greater cargo risk. Best deliveries are ranked by seals, then time.

The engine advances at a fixed 60 Hz. Keyboard and multi-pointer hold controls cover throttle, braking, lean and an edge-triggered hop. The terrain, bicycle, courier, town layers and headland scene are original Canvas drawings with no downloaded assets or outside collection. This is a compact five-route arcade game, not a long progression campaign or a realistic bike simulator. Reference clean rides take approximately 6–10 seconds per route; attempts, alternate suspension and ghost comparisons provide modest replay value. No hours-of-content or player-research claim is made.

## Implementation and improvement

Initial source: `a46b5564f38d0ba48d83ccabc2e0b8cd624795d4`, after 17 engine and 15 DOM checks passed. Initial physics testing caught and fixed a far-edge collision that could incorrectly lift a fallen bike out of a gap.

Improvement source: `68a1fc728a4b24f357dfd523db7452dd89e7a60a`. Added a non-mutating projected hop arc using the actual physics and held controls, with a red warning for a damaging landing. A road guide identifies the next bridge, cobbles or delivery bay. A pale ghost replays the best verified delivery. Keyboard aliases now remain independent, so releasing W does not release a separately held Up arrow.

QA source: `b0a3cfdeef07d58a269a1538a1a2ea97fd930763`. Verified all five courses with both suspension settings, added native multi-touch and Study Desk bridge suspension checks, provided camera margin around the starting bicycle, corrected the primary-button hover contrast and made Ride align the play area for narrow screens.

Browser-fixture correction: `9bbbfbcfaac5103b3544b50ec4e8b0de589b7f2b`. Earlier runs 39960183354 and 39960736191 failed at the corrupt-save fixture after completing the desktop campaign: the test injected corruption into the active game, then reload correctly overwrote it through the game's pagehide save. The corrected test installs corruption while the game is unloaded. The recovery assertions remain unchanged; those earlier runs are not reported as passing.

Final visual correction `55fdcb2d7d904f2c346427e72464ed8a7cacc45e` improves delivery-sign contrast against the night sky after screenshot review.

The isolated key is `study-desk-ratchet-run-v1`. Current rides and records store bounded run-length input recordings; loading reconstructs physics and earned seals rather than trusting stored result metadata. Reload resumes paused at the same frame. Restart preserves records. Unreadable data remains untouched until explicit replacement; denied storage leaves play available with a visible unsaved notice. Focus loss, pointer cancellation and the Study Desk visibility bridge release inputs and pause the ride.

## Verification

Exact-source [CI 39961796704](https://github.com/ThatOneMop/study-desk/actions/runs/39961796704) passed **308 engine/interface checks** (169 engine, 139 DOM), complete desktop and touch-emulated campaigns for all seven candidates, and public integrity gates. Ratchet Run completed all five routes at three seals with native keyboard and multi-touch input, per-route reloads, ghost/arc rendering, bridge loss and suspension, restart/cancel, isolated recovery and return navigation, with no browser errors. The separate normal-clock riding smoke check passed. [150 screenshots](https://github.com/ThatOneMop/study-desk/actions/runs/39961796704/artifacts/12504064428) were retained, including 24 Ratchet Run captures. Desktop night-route and touch riding captures were visually inspected.

Ratchet Run contributes 25 engine and 22 DOM checks. These cover all five three-seal soft-suspension routes, all five firm-suspension deliveries, throttle/coast/brake behavior, hopping, balance crashes, missed bridge/bay losses, terminal behavior, cargo seals, save validation, route unlocks, exact replay, non-mutating hop forecasts, dangerous landing warnings, best ghosts, keyboard aliases, pointer cancellation, focus pause, restart/cancel, corrupt recovery and denied storage.

Browser campaigns use native keyboard input at 1280×1000 and native Chromium multi-touch at 390×844. They advance the browser clock while retaining the real animation-frame and input paths, complete all five routes at three seals, reload partway through every route, inspect ghost/arc rendering, test bridge loss, input cancellation, Study Desk suspension/resume, restart, recovery and return navigation. A separate unmocked animation-frame smoke check holds throttle and verifies real-time movement and pause saving. This distinguishes deterministic campaign coverage from normal-clock coverage.

Direct cloud UI inspection covered desktop and a 390px layout frame, start/pause/restart, the controls, original artwork and final riding viewport. CI campaign captures provide the main complete-playthrough evidence. No physical-device, exhaustive action search or full screen-reader audit is claimed.

Public shell, bridge-pointer and relaxed-collection checks passed. The buildless repository's syntax/static checks passed: 19 public bundled routes and 55 asset references, nine first-batch selected-game source hashes and the exact twenty-slot selection gate. Prior six second-batch games are unchanged. Inherited `catalog-launch.cjs` and `curation-regression.cjs` still target the removed `playerStudy` button; they remain preserved and are not claimed to pass.

## Assessment and selection

Agent design review on a 1–5 scale, not survey scores: enjoyment 3, depth 2.5, polish 3.5, reliability 4.5, variety 4. The combination of landing control, cargo care and braking adds action variety to the puzzle-heavy slate. Hop previews and ghosts make short retries readable. The short route count and limited long-term progression constrain depth. Retain as a finished development candidate for broader comparison; it is not selected for the catalogue yet.

## Preservation, publication and next work

The first-batch report was freshly read at `c03682dc435ecdaacd94966273d789dd90e9f7b1`: 20 finished, nine selected, 66 improvement passes and zero verified live. All first-batch source, saves, catalogue entries and checks remain preserved. Public main was re-read at `ed2cf603aa47fc26e4f04216d5704351b72a32a9`; concurrent Study Desk, Gummy Bay and requested-game work was not overwritten. Changes use leased updates to `indie-collection-two-dev` only.

Published second-batch links: **none**. Repository source preservation is separate from public catalogue integration and deployment. Latest main release [39925660833](https://github.com/ThatOneMop/study-desk/actions/runs/39925660833), checked on 24 October, passes routes/assets but fails Configure GitHub Pages; prepare, upload and publish are skipped. This publishing issue does not block development.

**7/20 playable, improved and finished; 0 selected, integrated or verified live.** Thirteen slots remain planned, without source or completed-game credit. Next: implement, improve and test Wellward (slot 28), a rope-and-bucket relic retrieval game. Later work remains reserved for comparing the slate, choosing winners, integrating onto fresh main and final regression. The additional batch is unfinished, so its automation remains active.
