# Murmuration additional improvement — 24 October 2026

Gameplay/tests: [b1c2421ba2286bc833d62e12ffb256e8cf4795fc](https://github.com/ThatOneMop/study-desk/commit/b1c2421ba2286bc833d62e12ffb256e8cf4795fc), preserved on `indie-collection-two-dev`.

| Measure | Achieved |
| --- | --- |
| Implemented, initially improved and tested second-batch candidates | 17/20 |
| Additional-round upgrades verified | 3/20: Ratchet Run, Cairn & Cord, Murmuration |
| New initial implementations this increment | 0 |
| Substantial additional passes this increment | 1 |
| Recorded meaningful passes including initial passes | 20 |
| Final selections by this curation branch | 0 |
| Concurrent initial second-batch games now integrated on main | 13 |
| New additional-upgrade integrations this increment | 0 |
| New verified live releases this increment | 0 |

Exactly twenty new candidate slots remain. Ember Parcel, Windup Wrestling and Last Lighthouse remain unimplemented. The first-batch report was read from `origin/indie-collection-dev:dev/indie-collection/FINAL_REPORT.md`: twenty finished, nine selected, zero verified live URLs. Its sources, saves, tests and catalogue entries were not edited.

## Before and after

Actual rendered first-island/channel play confirmed readable flock steering and formation changes, but food served only an arrival quota and lost birds could not return. A food budget now supports recovery: twice per migration, in clear air between reeds, share two food to recall up to two turned-back birds. Those supplies no longer count toward the arrival goal. The button previews birds returning and food remaining; keyboard R provides the same action. Calls cannot undo an already-lost flight or operate in unsafe air.

This creates a survival-versus-supplies decision without adding repetitive levels. Existing three-field input histories replay unchanged; optional one-frame call records reproduce returned birds, spent supplies and the two-call limit. Original records and other games’ saves remain intact. No third-party assets were imported.

The cloud walkthrough used actual controls: eight birds became ten while food fell from five to three. The exhausted call limit and spent food survived reload. Further bad steering still lost birds, confirming that regrouping does not remove the need to fly carefully. Desktop and 390px screenshots were inspected. Four short routes and two obstacle families remain limitations; agent enjoyment/depth ratings are editorial judgments, not human playtesting or a long-playtime claim.

## Tests and evidence

- 18 engine and nine DOM tests pass locally: four full-feather migrations, naturally damaged flock recovery, supplies, unsafe-air/limited-call rejection, legacy migration, malformed history rejection, exact reload and existing controls/recovery checks.
- CI passes **391 engine + 282 DOM = 673 checks**, source syntax, bundled assets, first-batch release hashes and the exact twenty-slot ledger gate.
- [CI 40048553658](https://github.com/ThatOneMop/study-desk/actions/runs/40048553658), Murmuration job `120736070238`, passes desktop and emulated touch. The new natural route first loses two birds, uses R/button to restore twelve, spends two food, reloads exactly and reaches the roost with ten food. All four original full-feather routes, natural collision/food-shortfall losses, retry, cancellation, pause, corrupt-save recovery/reset, navigation and normal RAF flight also pass.
- All seven CI jobs passed, covering all seventeen playable games’ native desktop/touch suites.
- [32 screenshots retained](https://github.com/ThatOneMop/study-desk/actions/runs/40048553658/artifacts/12541339884). Inspected `desktop-regroup-choice.png`, `touch-regroup-reloaded.png`, `touch-regroup-arrival.png`, and cloud desktop/phone views. Native Chrome 155.0.8059.39. Artifact ZIP SHA256: `def0a8d8c686e13ecf0dd2faf3622f7f3118065965c2ebc1b0845d4620cda876`.

These automated routes establish reachability/reliability, not human enjoyment. Touch is browser emulation, not physical-device testing. Existing stale legacy catalogue tests are not relabeled as passing.

## Integration and next work

No public catalogue or deployment settings changed. Concurrent catalogue, requested games and Gummy Bay work were preserved, including unrelated untracked files. Development began at `d2f2aa4ca104d5a38e698e0be1157b031ca855ed`; the source push used an expected-head lease. Main advanced to `0f295c9795590f96a90c6ceb8c1d165e77fcd3a7` during the run. Its all-created catalogue contains 64 entries, including thirteen initial second-batch games. The earlier snapshot omitted Cairn, Murmuration, Night Clerk and Clockwork Tide; its “excludedUnbuilt” label is now stale for those four. This concurrent integration was preserved and must be reconciled when the additional upgrades are integrated. It is separate from final selection and is not proof of live deployment.

The previously investigated Pages permission failure remains unresolved: run `39925660833`, job `120321277348`, failed Configure GitHub Pages with a missing site and “Resource not accessible by integration” when creating it. It was not retried without changed evidence. Separate hosting work is not inferred from this failure; no new live URL is claimed from a source commit.

Seventeen additional upgrades remain. Next prioritize Night Clerk, then other weak unchecked games, after rendered play. Finish the three missing candidates and give each its initial and separate additional improvement. Reconcile current main and concurrent requests when integrating the completed slate. The completion condition has not been reached, so the task remains active.
