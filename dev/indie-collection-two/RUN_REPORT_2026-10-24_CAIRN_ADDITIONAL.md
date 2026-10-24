# Cairn & Cord — additional improvement round

24 October 2026. Gameplay and tests: [eb10e9e87ee414f0a218afe6176cc2589151a592](https://github.com/ThatOneMop/study-desk/commit/eb10e9e87ee414f0a218afe6176cc2589151a592), on `indie-collection-two-dev`.

| Measure | Achieved |
| --- | --- |
| Second-batch implemented and initially improved candidates | 17/20 |
| Candidates with the newly requested additional round verified | 2/20: Ratchet Run, Cairn & Cord |
| New candidate implementations in this increment | 0 |
| Substantial additional upgrades in this increment | 1 |
| Second-batch meaningful passes recorded, including initial passes | 19 |
| Final selections/integrations by this curation branch | 0 |
| New verified live releases by this increment | 0 |

The first collection remains 20 finished / nine selected according to its preserved report. None of its source, saves, tests or catalogue entries was edited. Exactly twenty new slots remain in the second-batch ledger. Ember Parcel, Windup Wrestling and Last Lighthouse remain unimplemented and are not counted as playable.

## Observed weakness and concrete change

Before editing, the actual rendered Warmup Wall was completed with its cairn stone and all three badges in six climbing moves without placing an anchor. Anchors mostly insured mistakes; clean routes had little reason to use them.

The upgrade adds anchored rope traverses at or below the latest anchor, reaching up to 3.2 fictional climbing units. They can reach ordinary holds as well as a new optional survey outcrop on each existing wall. Hauling back costs two grip. Players choose whether to spend grip and chalk on the detour, establish a closer belay, or prioritize the summit. Survey visits must be brought to the summit to earn separate replay-validated stamps; the original three-badge records and route unlocks are preserved, including legacy v1 notebooks.

Phone play exposed a control weakness after landing at an outcrop: returning required scrolling below the wall. A compact fixed return bar now shows exact remaining grip and offers chalk or haul. The approach selector, movement forecast and return controls use native keyboard-accessible controls. Original SVG artwork remains in use; no third-party collection or assets were imported.

This is a substantial mechanical pass, not extra repetitive levels. It remains a small four-wall game. Agent assessment increases enjoyment from 3 to 3.5 and depth from 2.5 to 3; these are editorial judgments, not player-survey results. Scrolling, short authored campaigns and lack of audio remain limitations. No long-playtime claim is made.

## Verification

- **35 Cairn checks:** 23 engine and 12 DOM. All original and survey routes, invalid/atomic actions, rope limits, grip/wind, independent records, legacy migration, every-action save roundtrip, replay validation, undo, restart, recovery and storage errors.
- **669 full-slate checks:** 387 engine and 282 DOM, all passing locally and in CI. Repository assets, first-batch release hashes, exact twenty-slot gate and additional-round gate pass. Existing shell, pointer bridge and relaxed collection checks also pass locally.
- [Native CI run 40044161548](https://github.com/ThatOneMop/study-desk/actions/runs/40044161548), source `eb10e9e`: Cairn passes four original and four survey campaigns on desktop and emulated touch, with exact forecasts, reload at every outcrop, unchanged faster original records, natural repeated traversal exhaustion/loss/undo/retry, pause, reset/recovery isolation and navigation. Google Chrome 155.0.8059.39. All seven CI jobs passed, including all seventeen games’ native desktop/touch suites.
- **Rendered agent walkthroughs:** original Warmup baseline; improved Warmup on desktop and 390px phone layout; Fox Traverse survey route on phone, including rough-hold warning, fall/undo and chalk choice. The original notebook loaded successfully, an outcrop save reloaded while tethered, and separate survey stamps appeared without replacing summit records. These used actual controls, not injected winning states.
- **54 retained Cairn screenshots** in [artifact 12540757754](https://github.com/ThatOneMop/study-desk/actions/runs/40044161548/artifacts/12540757754). Inspected `desktop-survey-2-forecast.png`, `touch-survey-3-outcrop.png` and `touch-survey-natural-loss.png`, plus cloud phone forecast/return-bar views. Layout and controls fit without horizontal overflow. ZIP SHA256: `422b5cbebd3c2244710a7699b1c4c4c1522c132aa689174365734861f47120a0`.

Automated routes establish reachability and reliability, not human enjoyment. Touch is browser emulation, not physical-device testing. The legacy catalogue tests previously identified as stale were not relabeled as passing.

## Repository and deployment

Development started from `aee3c6b441c14d61de456d5ef0589cda352529f9`; observed main remained `ed2cf603aa47fc26e4f04216d5704351b72a32a9`. The source push used an expected-head lease. Unrelated checkout changes and Gummy Bay / DOOM temporary files were preserved. No public catalogue or deployment setting was changed by this increment.

The existing Pages investigation remains unchanged: run `39925660833`, job `120321277348`, failed Configure GitHub Pages because the site was not found and creation returned “Resource not accessible by integration.” It was not retried without changed evidence. This does not establish the status of separate hosting work. There is no new verified live game URL to report from this increment; the source commit is not a live release.

A short workspace/browser outage recovered before implementation; it is not an ongoing development blocker. Source, tests, hashes and the explicit twenty-entry checklist are preserved on the development branch.

## Next work

Eighteen additional-round entries remain. Prioritize the weakest unchecked existing games, starting with Murmuration and Night Clerk, after playing their rendered loops. Finish the three missing candidates and give each both its initial and distinct additional pass. Final comparison and integration must reconcile current main and concurrent catalogue requests after all twenty additional upgrades are verified. Keep this task active; its completion condition has not been reached.
