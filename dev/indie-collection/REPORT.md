# Run 56 · Roof Runner quick-correction pass

**20/20 playable prototypes · 20 improved games · 46 meaningful improvement passes · 17 finished · 0 selected · 0 publicly published.** Exactly 20 candidate slots retained.

Roof Runner remains development-only, but its third improvement pass removes a concrete sub-frame control asymmetry. A quick keyboard or touch direction press now produces one bounded six-frame (0.1-second) correction instead of disappearing before the physics loop sees it. Quick keyboard jump and dash presses receive the same exactly-once queue already used by touch. Holding any control continues normally; variable jump height, air-dash recharge, wind, conveyors, vents, five authored routes, timers, medals, progression and the v1 save format are unchanged. Onboarding now states the tap-versus-hold behavior.

## Evidence

- Source commit: [ff80e90](https://github.com/ThatOneMop/study-desk/commit/ff80e90c0a0db16f1f2e725c7eab229258c780cd).
- Local checks pass: 13 engine tests, 21 DOM/save tests, both repository asset/isolation gates, exactly 20 slots and 116 candidate references, JavaScript syntax and diff hygiene.
- All five legal all-parcel/no-fall solutions remain green at 277/295/307/367/343 ticks, together with 120 bounded exploratory attempts.
- New checks prove a quick keyboard jump fires once and a quick touch direction matches exactly six legal movement frames, then stops. Browser coverage now repeats the bounded direction correction before quick jump/dash and narrow-screen geometry checks.
- The prior source [24d11a4](https://github.com/ThatOneMop/study-desk/commit/24d11a4c18c3e8a29ca138b130742cdecdce5598) retains [successful CI 39514585107](https://github.com/ThatOneMop/study-desk/actions/runs/39514585107), but that run is context rather than current-source certification.
- Local Playwright cannot launch because its Chromium executable is absent, and no workflow attached to connector-created `ff80e90` during this run. Current-source browser CI remains pending.
- Public `main` remains `42e32a7efa25a120f579dbef6a706d8588a2c3a8`; no public catalogue or deployment change was made.

## Decision and next gate

Roof Runner stays **playable, not finished and not selected**. The pass materially improves precision corrections across keyboard and touch, but it does not replace the missing continuous full-route review. Obtain exact-source Chromium, complete an unscripted route and exercise the later wind/vent routes before ranking it against the seventeen finished candidates. Physical touch, screen-reader output, independent human enjoyment and content-hours remain unclaimed.


# Run 55 · Last Match full native-clock finish gate

**20/20 playable prototypes · 20 improved games · 45 meaningful improvement passes · 17 finished · 0 selected · 0 publicly published.** Exactly 20 candidate slots retained.

Last Match remains development-only, but its strongest unresolved reliability gate now has an executable exact-source test instead of a plan. The unmodified native-clock browser controller has been extended from the opening clearing to all five. It drives real held keyboard movement from visible position text and saved state, fires discrete flashes only when the live beam/readiness UI permits them, uses braziers, collects embers, crosses gates and advances through normal unlocks. Every clearing must complete with a saved three-medal record and now writes its own completion screenshot. The test does not inject game state, replace the production clock or shorten enemy rules.

## Evidence

- Finish-gate test commit: [c802f06](https://github.com/ThatOneMop/study-desk/commit/c802f06c1e4c7044ee1d8e2bbc921d741af97bf3).
- Local checks pass: 16 Last Match engine tests, 19 DOM/save tests, both repository asset/isolation gates, exactly 20 slots and 116 candidate references, JavaScript syntax and diff hygiene.
- The prior exact game source remains [be72f626](https://github.com/ThatOneMop/study-desk/commit/be72f62660b3b66dd61d4fbf4848336804d25dd6), with [successful CI 39583606040](https://github.com/ThatOneMop/study-desk/actions/runs/39583606040) covering five deterministic browser campaigns and one separate unmodified native-clock opening victory. Its retained desktop, touch and completed-opening captures were downloaded and visually inspected this run.
- Local Playwright could not launch because its Chromium executable is absent. No workflow attached to the connector-created finish-gate commit during the observation window, and the HTTPS git remote has no interactive credentials. The new five-clearing path is therefore **pending exact-source Chromium execution**; the prior run is context, not a substitute.
- Public `main` remains `42e32a7efa25a120f579dbef6a706d8588a2c3a8`; no candidate was added to the public catalogue.

## Decision and next gate

Last Match stays **playable, not finished and not selected**. This run materially improves full-campaign control verification, but quality is not advanced from an unexecuted browser path. Obtain the exact Chromium result and inspect all five completion captures; then complete the remaining later-clearing/alternate-strategy comparison before ranking it against the seventeen finished candidates. Physical touch, screen-reader output, independent human enjoyment and content-hours remain unclaimed.


# Run 54 · Threadbound touch-control pass

**20/20 playable prototypes · 20 improved games · 45 meaningful improvement passes · 17 finished · 0 selected · 0 publicly published.** Exactly 20 candidate slots retained.

Threadbound remains development-only, but its third improvement pass addresses a concrete control issue found while extending visible review beyond the first canopy. Quick touch and accessibility-button taps now queue a twelve-frame (0.2-second) nudge instead of six frames, so fine reel/pump corrections are less likely to disappear before the player can read them. Sustained holds are unchanged. The exact Chromium campaign now writes one screenshot after each completed canopy rather than preserving only the opening room.

A managed preview opened the elevated second canopy, exercised an imperfect safety return and visibly confirmed the revised 0.2-second guidance plus a 24-unit quick reel nudge. The cloud browser cannot sustain simultaneous reel/pump input, so I am not claiming a subjective completion of canopies 2–4. Threadbound stays **playable, not finished and not selected**.

## Evidence

- Source commit: [c36f6e6](https://github.com/ThatOneMop/study-desk/commit/c36f6e6d03a73ec58cc0765441c5a4437d725b1a).
- Local exact-source checks pass: both repository asset/isolation gates, JavaScript syntax, diff hygiene, all 13 engine checks and all 15 DOM/save checks; legal all-seed/no-fall routes remain 406/411/419/498 fixed steps.
- The managed preview visibly shows the updated onboarding and the doubled reel nudge in canopy 2.
- Exact-source Chromium remains pending: this runtime has no Playwright browser executable, and no workflow run attached to the connector-created commit during the observation window. The prior successful CI is context only, not falsely reused for the changed source.
- Public `main` remains `42e32a7efa25a120f579dbef6a706d8588a2c3a8`; nothing was added to the public catalogue.

## Next

Obtain exact-source browser CI and inspect the four screenshot artifacts, then complete canopies 2–4 in a continuous-input browser. Keep the candidate off the finished and public lists until those gates clear.


# Run 53 · Glasshouse finish gate

**20/20 playable prototypes · 20 improved games · 44 meaningful improvement passes · 17 finished · 0 selected · 0 publicly published.** Exactly 20 candidate slots retained.

Glasshouse now has visible end-to-end evidence for its complete six-exhibition campaign. A managed run used ordinary pot, seed, water, day, pollen, cross and delivery controls to earn all 18 medals with zero wilt in 6/12/14/11/10/14 days. The rooms progressed from a first amber hybrid to paired soft-light hybrids, mixed-height offspring timing, a multi-generation prism, frosted-window breeding and a three-lineage finale. Whole-room next-day forecasts kept parent care readable as the garden filled, so the repeated watering supported planning rather than becoming the only decision.

The candidate is now **finished, not selected**. Final 6/6 completion, the last-room state and the living lineage library survived reload. Selection still requires direct comparison with the other sixteen finished candidates; no independent human enjoyment or content-hours claim is made.

## Evidence

- Exact game source: [64a4c8ba](https://github.com/ThatOneMop/study-desk/commit/64a4c8ba47869d938bfba0792ceca874add6b7b7), with [successful desktop/touch Chromium CI 39532503890](https://github.com/ThatOneMop/study-desk/actions/runs/39532503890).
- Exact cloned development head `4de17e9ec34eddfb5fc3289ce7c38bef191ef74f` passed both repository asset/isolation gates: exactly 20 slots, 116 candidate references, public isolation, source syntax, 10 public routes and 14 public references.
- Target regressions passed locally: 13 engine checks and 17 DOM/save checks, including all six actual-button campaigns, forecasts, genetic inheritance, finite water, real wilt/deadline loss, relocation, undo, reload, retry and storage failures.
- Managed rendered desktop completed all six rooms at 18/18 medals and zero wilt. Final completion and the lineage library survived reload; there were no game-page console errors.
- Public `main` remained `42e32a7efa25a120f579dbef6a706d8588a2c3a8`; no game was added to the public catalogue.

## Verification limit

The finish gate reuses the existing successful exact-source Chromium run because Glasshouse’s game source did not change. Physical touch hardware, screen-reader behavior, independent human enjoyment and alternate breeding routes remain unverified; no content-hours claim is made.

## Next

Compare all seventeen finished candidates on enjoyment, depth, polish, reliability and collection variety. Keep Glasshouse development-only unless it earns a selected place; continue the two strongest unfinished finish gates before the final integration window.


# Run 52 · Echo Vault finish gate

**20/20 playable prototypes · 20 improved games · 44 meaningful improvement passes · 16 finished · 0 selected · 0 publicly published.** Exactly 20 candidate slots retained.

Echo Vault now has visible end-to-end evidence for its complete four-vault campaign. A managed run used ordinary pace, direction, wait, tile, chime and extraction controls to archive all four relics and all eight folio leaves with zero exposed turns. The clean routes finished in 17/18/24/21 turns. Copper Stacks mixed noisy strides with quiet creeps, Curtain Court used a deliberate wait and curtain loops, and Last Resonance alternated pace around multiple sentries; only two deliberate waits appeared across the clean campaign. The final 4/4 relic, 8/8 leaf state and last record survived reload.

The candidate is now **finished, not selected**. Together with the earlier 27-turn pursuit recovery, the evidence covers both clean planning and recoverable mistakes without showing wait fatigue as the dominant loop. Selection still requires direct comparison with the other fifteen finished candidates; no independent human enjoyment or content-hours claim is made.

## Evidence

- Exact game source: [8fe14ee7](https://github.com/ThatOneMop/study-desk/commit/8fe14ee7afb7b187647ca639dd3e621f4d03ca0f), with [successful desktop/touch Chromium CI 39451640282](https://github.com/ThatOneMop/study-desk/actions/runs/39451640282).
- Exact cloned development head `03de5607bf5a766643687eeaae44c245cc0066c1` passed both repository asset/isolation gates: exactly 20 slots, 116 candidate references, public isolation, source syntax, 10 public routes and 14 public references.
- Target regressions passed locally: 14 engine checks and 19 DOM/save checks, including four actual-button campaigns, exact forecasts, chime conservation, real capture, undo, reload, retry, storage failures and the non-ghost pursuit route.
- Managed rendered desktop completed all four vaults. Final completion and all eight leaf records survived reload; there were no game-page console errors.
- Public `main` remained `42e32a7efa25a120f579dbef6a706d8588a2c3a8`; no game was added to the public catalogue.

## Verification limit

The finish gate reuses the existing successful exact-source Chromium run because Echo Vault’s game source did not change. Physical touch hardware, screen-reader behavior, independent human enjoyment and broader non-ghost alternate routes remain unverified; no content-hours claim is made.

## Next

Compare all sixteen finished candidates on enjoyment, depth, polish, reliability and collection variety. Keep Echo Vault development-only unless it earns a selected place; continue the strongest unfinished finish gates before the final integration window.


# Run 51 · Rain Catcher finish gate

**20/20 playable prototypes · 20 improved games · 44 meaningful improvement passes · 15 finished · 0 selected · 0 publicly published.** Exactly 20 candidate slots retained.

Rain Catcher now has visible end-to-end evidence for its complete four-district campaign. A managed run used ordinary terrain, cistern, rain and flow controls to restore all 12 gardens with zero spill. The four reference footprints finished at rain 48/44/46/52 and earthwork 27/27/40/31; later maps required wet-tile pressure lifts and different one- versus two-cistern schedules rather than simply enlarging the opening puzzle. The final 4/4 district, 12/12 journal state and first-district 48/27/0 record survived reload.

The candidate is now **finished, not selected**. Together with the earlier rain24/earth64 opening route, the evidence shows a genuine rain-versus-earthwork tradeoff, clear finite-resource progression and reliable replay/save behavior. Selection still requires direct comparison with the other fourteen finished candidates; no independent human enjoyment or content-hours claim is made.

## Evidence

- Exact game source: [400cf787](https://github.com/ThatOneMop/study-desk/commit/400cf787228e51c99cf942af410d49b9d49ad259), with [successful desktop/touch Chromium CI 39443598012](https://github.com/ThatOneMop/study-desk/actions/runs/39443598012).
- Exact cloned development head `75119929d3de36e4842e51a5730d5f8c86407d6e` passed both repository asset/isolation gates: exactly 20 slots, 116 candidate references, public isolation, source syntax, 10 public routes and 14 public references.
- Target regressions passed locally: 15 engine checks and 21 DOM/save checks, including four actual-button campaigns, conservation/forecast invariants, real flooding, undo, reload, retry/close, storage failures and the alternate two-rain route.
- Managed rendered desktop completed all four districts. Final completion and all 12 garden records survived reload; there were no game-page console errors. Browser-extension metadata errors were excluded as unrelated to the game page.
- Public `main` remained `42e32a7efa25a120f579dbef6a706d8588a2c3a8`; no game was added to the public catalogue.

## Verification limit

The finish gate reuses the existing successful exact-source Chromium run because Rain Catcher’s game source did not change. Physical touch hardware, screen-reader behavior, independent human enjoyment and broader alternate layouts remain unverified; no content-hours claim is made.

## Next

Compare all fifteen finished candidates on enjoyment, depth, polish, reliability and collection variety. Keep Rain Catcher development-only unless it earns a selected place; continue the strongest unfinished finish gates before the final integration window.


# Run 50 · Threadbound truthful finish feedback

**20/20 playable prototypes · 20 improved games · 44 meaningful improvement passes · 14 finished · 0 selected · 0 publicly published.** Exactly 20 candidate slots retained.

A managed ordinary-control Threadbound replay deliberately finished the first canopy imperfectly: all 3 seeds, 6 recoverable falls and 2/3 stitches. That result exposed a concrete trust bug: the completion status always praised “a fall-free crossing,” even when the separate result panel correctly showed the falls and withheld that stitch.

Pass 2 now derives the named completion awards from the same seed/fall state used for scoring, uses correct singular/plural grammar and repairs the misleading sentence in older completed saves during load. Reload visibly retained 2/3 stitches, 3/3 seeds and 6 falls while changing the status to the truthful “arrival and every seed.” The candidate remains a **playable prototype, not selected** because subjective control/replay review of canopies 2–4 is still open.

## Evidence

- Source commit: [a961731](https://github.com/ThatOneMop/study-desk/commit/a9617317700bfafb1504343501fb47232461897d).
- Exact source passes both repository asset/isolation gates, 13 Threadbound engine checks and 15 DOM/save checks locally. The new regression covers an imperfect all-seed completion plus correction of an older misleading completed save.
- [Full CI 39671296613](https://github.com/ThatOneMop/study-desk/actions/runs/39671296613) passes the repository’s all-candidate engine, interface, desktop/touch browser and visual-evidence stages.
- Managed rendered verification used ordinary controls for hook/reel/transfer/release/recovery/lantern actions and then reloaded the saved completion to verify corrected persisted text.
- Public `main` remains `42e32a7efa25a120f579dbef6a706d8588a2c3a8`; no candidate was added to the public catalogue.

## Verification limit

Canopies 2–4 still lack the same subjective managed-control review, and full touch campaign, physical touch hardware, screen-reader behavior and independent human enjoyment remain unverified. The exact automated browser campaign covers all four no-fall/all-seed routes; it is reliability evidence, not a fun score or content-hours claim.

## Next

Finish Threadbound’s later-canopy control review before changing its status. Continue direct comparison of the fourteen finished candidates; keep Threadbound development-only unless it later clears both finish and selection gates.


# Run 49 · Moss Market finish gate

**20/20 playable prototypes · 20 improved games · 43 meaningful improvement passes · 14 finished · 0 selected · 0 publicly published.** Exactly 20 candidate slots retained.

Moss Market now has visible end-to-end evidence for its complete six-awning campaign. One managed run selected visitors and bundles, assembled offer trays, crafted goods and delivered every order through ordinary controls, earning 18/18 leaf seals with zero overpay. Later awnings exercised bulk-first shelf release, one- and two-recipe chains, mixed orders and final-delivery reserve planning. The final six-awning state and every record survived reload.

The candidate is now **finished, not selected**. The campaign combines visitor-specific values, exclusive bundles, limited shelf capacity, recipes and “last delivery closes the stall” reserve scoring. Selection still requires direct replay comparison against the other thirteen finished candidates, and the public catalogue remains unchanged.

## Evidence

- Exact game source: [14988092](https://github.com/ThatOneMop/study-desk/commit/14988092223df11df8d847401647de1154b50e90), with [successful desktop/touch Chromium CI 39432336946](https://github.com/ThatOneMop/study-desk/actions/runs/39432336946).
- Exact cloned development head `7ffd5cb28cd401310283baacc620869d149f4356` passed both repository asset gates: exactly 20 slots, 116 candidate references, public isolation, source syntax, 10 public routes and 14 public references.
- Target regressions passed locally: 15 engine checks and 19 DOM/save checks, including six actual-button campaigns, valuation/stock forecasts, losses, undo, reload, retry/repack, focus and save failures.
- Managed rendered desktop completed all six awnings at 8/7/8/7/10/10 committed actions and reserve values 14/11/6/10/4/5 with zero overpay. The final completion and 18/18 records survived reload; there were no game-page console errors.
- Public `main` remained `42e32a7efa25a120f579dbef6a706d8588a2c3a8`; no game was added to the public catalogue.

## Verification limit

The finish gate reuses the existing successful exact-source Chromium run because Moss Market’s game source did not change. Physical touch, screen-reader behavior, independent human enjoyment and broader alternative chains remain unverified; no content-hours claim is made.

## Next

Compare all fourteen finished candidates on enjoyment, depth, polish, reliability and collection variety. Keep Moss Market development-only unless it earns a selected place; continue the strongest unfinished finish gates before the final integration window.
