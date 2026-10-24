# Night Clerk additional improvement — 24 October 2026

Gameplay/tests: [08fb6223f98854ee3097560b685b310f22d37dc6](https://github.com/ThatOneMop/study-desk/commit/08fb6223f98854ee3097560b685b310f22d37dc6), preserved on `indie-collection-two-dev`.

| Measure | Achieved |
| --- | --- |
| Implemented, initially improved and tested second-batch candidates | 17/20 |
| Additional-round upgrades verified | 4/20: Ratchet Run, Cairn & Cord, Murmuration, Night Clerk |
| New initial implementations this increment | 0 |
| Substantial additional passes this increment | 1 |
| Recorded meaningful passes including initial passes | 21 |
| Final selections by this curation branch | 0 |
| Concurrent initial second-batch games integrated on main | 13 |
| New additional-upgrade integrations this increment | 0 |
| New verified live releases this increment | 0 |

Exactly twenty new candidate slots remain. Ember Parcel, Windup Wrestling and Last Lighthouse remain unimplemented. The first-batch report was read from `origin/indie-collection-dev:dev/indie-collection/FINAL_REPORT.md`: twenty finished, nine selected, zero verified live URLs. Its sources, saves, tests and catalogue entries were not edited.

## Before and after

Actual rendered first-shift play put Ada in 203, Bram in 101 and Pip in 103. Lights-out failed solely because Bram needed a hearth. Room features were immutable, so that otherwise suitable plan could not work. One movable service cart now offers either a silent moon mirror or a noisy stove. It opens alternative allocations while adding a concrete tradeoff: the stove provides warmth but disturbs sleepers in its own room or adjacent rooms. Moving the single cart removes its previous benefit. Felt screens still protect sleepers.

The desktop walkthrough repaired that failed plan using the stove in 101. Reload preserved the cart. Moving it to empty room 102 previewed two conflicts: Bram lost warmth and Pip gained a noisy neighbour. Placement and undo behaved as forecast; lights-out then succeeded. A separate 390px rendered walkthrough placed Ada in 202 with a moon mirror, Bram in 103 and Pip in 101, then won at the first bell. Native browser routes separately verified first-bell wins for both new allocations.

The cart has its own known-needs forecast, room highlight, native setting chooser and touch-sized controls. Undo and replay saving include cart actions. Old journals replay with no cart and retain records; the new mechanic does not require a save reset. No third-party assets were imported. Five authored shifts and six rooms remain a compact campaign. The depth/enjoyment assessment is an agent judgment, not human playtest evidence or a long-playtime claim.

## Tests and evidence

- 24 engine and 14 DOM checks pass locally, covering both alternatives, pure forecasts, collateral noise, felt protection, atomic invalid actions, old journal migration, exact reload, undo, natural three-bell loss/retry and blocked controls.
- CI passes **397 engine + 284 DOM = 681 checks**, source syntax, bundled assets, first-batch release hashes and the exact twenty-slot ledger gate.
- [CI 40052886087](https://github.com/ThatOneMop/study-desk/actions/runs/40052886087), Night Clerk job `120749480017`, passes native desktop 1280×1000 and emulated touch 390×844. Each completes both new cart alternatives, saved-cart reload, noise preview/move/undo and wins, followed by all five original three-seal shifts, screen unlocks/undo, key swaps, mid-plan and won saves, keyboard/touch cancellation, natural loss/retry, bridge pause, isolated recovery/reset and return navigation. Zero browser errors.
- All seven CI jobs passed, covering all seventeen playable games’ native desktop/touch suites.
- [36 Night Clerk screenshots retained](https://github.com/ThatOneMop/study-desk/actions/runs/40052886087/artifacts/12544510261). Inspected `desktop-cart-noise-warning.png`, `touch-cart-moon-preview.png`, `touch-cart-hearth-restful.png`, and cloud desktop/phone views. Native Chrome 155.0.8059.39. Artifact ZIP SHA256: `95fd1ac2e0a6ed8d59615cae12cb99ac16da24d168e6a9433789b18164ed0b9f`.

Automated routes establish reachability and reliability, not human enjoyment. Touch is browser emulation, not physical-device testing. Existing stale legacy catalogue tests are not relabeled as passing.

## Integration and next work

No public catalogue or deployment settings changed. Concurrent catalogue, requested games and Gummy Bay work were preserved, including unrelated untracked files. Development began at `5a01b9312c63b0f821ffda495347b6d24d78b8bb`; the source push used an expected-head lease. Main was re-read at `0f295c9795590f96a90c6ceb8c1d165e77fcd3a7`. Its 64-entry all-created catalogue includes thirteen initial second-batch games. This is separate concurrent integration, not final selection or a live release of the new upgrades. Night Clerk remains on the development branch.

The already investigated Pages permission failure remains unresolved: run `39925660833`, job `120321277348`, failed Configure GitHub Pages with a missing site and “Resource not accessible by integration” when creating it. It was not retried without changed evidence. Separate hosting work is not inferred from this failure; no new live game URL is claimed from a source commit.

Sixteen additional upgrades remain. Next prioritize Borrowed Gravity and Static Orchard after rendered play, finish the three missing candidates and their initial/separate additional passes, then compare and integrate the improved slate against current main. The completion condition has not been reached; this task is not paused.
