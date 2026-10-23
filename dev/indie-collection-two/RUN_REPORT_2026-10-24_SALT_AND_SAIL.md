# Salt & Sail — second-batch candidate 29

## Scope and baseline

The first-batch final report remains at `c03682dc435ecdaacd94966273d789dd90e9f7b1`: 20 finished, nine selected, 66 improvement passes and zero verified live releases. None of those games count toward this second batch. The second-batch ledger still contains exactly twenty new slots, overall numbers 21–40.

Public main was re-read at `ed2cf603aa47fc26e4f04216d5704351b72a32a9`, containing the private-messaging and movie/TV work. This increment writes only the separate `indie-collection-two-dev` branch. The public catalogue, first-batch source and saves, Gummy Bay and requested-game work are preserved.

## Implemented loop

Salt & Sail is an original cargo-packing and real-time coastal sailing game. Fit rotatable shaped loads into a 5×3 hold, stow both required contracts, choose whether to carry optional goods, and spend two lashings on the loads most worth protecting. Cargo mass and its position change drift and speed. Unlashed cargo slides as the vessel rolls and can be damaged on impact.

Steer with A/D or arrow keys, hold Space to reef, and use W/S to change sail. Touch controls support simultaneous steering and reefing. Avoid reefs and shores, align with the harbour mouth and slow before landing. Deliveries unlock five authored coastal passages; two successful passages unlock a faster, livelier cutter. Best deliveries preserve value, seals and crossing time, with input replays validating the stored result.

The navy, sea-green and brass presentation uses original Canvas boats, water, coastlines, rocks and docks, plus a DOM cargo hold. No third-party game collection or asset pack was imported. The save key is `study-desk-salt-and-sail-v1`.

## Meaningful improvement pass

The initial playable version passed 18 engine and 13 DOM checks before this pass.

- Packing now previews the rotated footprint and the exact change to list, value and baseline drift before an explicit **Stow load** confirmation.
- An optional two-second course guide runs the actual physics forward for the current helm, including load, sliding, steering and collisions. It warns about reef/shore impacts and unsafe landings without steering automatically.
- Hold arrow navigation and keyboard rotation preserve focus. On phones the hold appears first during packing; sailing brings the chart forward. The reviewed 390px sailing panel measured 733px tall.
- Save validation rejects malformed ship-fitting values and prevents saved cargo fields from overriding placement validation. Corrupt data stays untouched until explicit recovery; resets affect only this game's key.

Final local candidate checks: **28 engine + 16 DOM = 44 passed**. They include all five full-cargo three-seal routes, all five alternate-cutter routes, rotation/overlap/lashing constraints, loading effects, sliding, impact/loss, docking, retry, exact resumed voyages, route/rig locks, malformed records, preview immutability, forecast versus actual physics, keyboard focus, input cancellation, blocked storage and isolated recovery.

**Completed result: 9/20 playable, improved and finished; 9 meaningful passes; 0 selected, integrated or verified live.** Eleven slots remain planned. This increment adds one finished game; the first batch and the separate Nightshift/Afterlight games are excluded.

Exact-source [CI 39978965563](https://github.com/ThatOneMop/study-desk/actions/runs/39978965563) passed **386 engine/interface checks** (218 engine, 168 DOM), all nine complete desktop/touch campaigns and public preservation gates. Salt & Sail completed all five three-seal deliveries using native keyboard and native multi-touch, with every-passage paused reloads, cutter unlock/selection, course guidance, cancellation, bridge pause, real loss/retry, isolated save recovery/reset and return navigation. The independent normal-clock steering check passed. No uncaught browser errors were reported.

[Browser artifacts](https://github.com/ThatOneMop/study-desk/actions/runs/39978965563/artifacts/12514390032) retain 204 screenshots, including 34 Salt & Sail captures. The earlier successful full run [39978396968](https://github.com/ThatOneMop/study-desk/actions/runs/39978396968) also passed; its representative desktop mid-voyage, final phone harbour and packed-hold images were visually reviewed. The follow-up run verifies the final save-validation patch. Controlled-clock browser campaigns establish repeatability; they are not physical-device testing or a human enjoyment study.

Public checks passed: 19 bundled routes, 55 asset references, nine first-batch selected-source hashes, exact twenty-slot selection gate, shell, bridge-pointer and relaxed collection. Two inherited tests still reference the removed `playerStudy` element; they and the public shell are unchanged here and are not claimed to pass.

## Commit evidence

- Initial playable: `a57e8797b73dde7adc1b8132fb413aa4f97f27a0`.
- Stow preview/course-guide improvement and browser suite: `0fd2f6abaf5f57117bc3686d5b4f6e3cad5f25e3`.
- Save-validation correction and regression: `3abdf9c1a79e75844abe9365a66e6b288da89554`.
- Integration commits: none. Published URLs: none.

## Assessment and remaining work

The load-to-handling relationship distinguishes this game from Reefwright's ecology puzzle, Counterweight's discrete crane jobs, Lanternwake's light-and-pursuit navigation and Ratchet Run's bike trials. The packing preview makes the decision readable, while steering and reefing retain manual control. The shared cargo theme is a reason to compare the eventual catalogue selections carefully, not to select every candidate.

Depth is modest. Five routes offer optional cargo, cleaner deliveries, alternative packings and the cutter. The reference keel campaign contains 9,137 simulation frames, about 152 seconds of ideal uninterrupted sailing, plus packing and retries. This is not a human completion-time estimate or a multi-hour-content claim. Best trade value is a record, not a spendable economy. There is no sound layer, procedural campaign, physical-device test, full screen-reader audit or human enjoyment study.

See [comparison notes](COMPARISON.md). Eleven slots remain unimplemented. Next is Pocket Palaeo, slot 30, with a tactile brush/brace/lift fossil-recovery loop. Final batch work remains reserved for deeper improvements, selecting a complementary group, fresh-main integration and release regression.

The latest public release [39925660833](https://github.com/ThatOneMop/study-desk/actions/runs/39925660833) still passes route/assets checks but fails **Configure GitHub Pages**; prepare, upload and publish are skipped. Repository development and live deployment remain separate. No second-batch game is public yet.
