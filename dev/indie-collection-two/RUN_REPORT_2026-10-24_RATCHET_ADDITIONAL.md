# Additional round: Ratchet Run

This increment responds to the 24 October direction for a new substantial improvement round across the second collection. Earlier passes are excluded. Exactly twenty candidate slots remain in the separate second-batch ledger and additional-round checklist.

| Measure | Verified total |
| --- | --- |
| Second-batch playable and initially improved | 17/20 |
| Finished and tested candidates | 17/20 |
| Additional substantial round | 1/20 |
| Selected/integrated by this curation ledger | 0 |
| Verified live releases in this ledger | 0 |

## Baseline and scope

- First collection: its current `dev/indie-collection/FINAL_REPORT.md` records 20 finished games, nine selected source releases and 66 earlier improvement passes. No first-batch source, save key, catalogue entry or test was edited.
- Second collection baseline `8223e6b5038309a08f5b6a1a4f2aa7874d218633`: 17 playable/initially improved/finished, three planned, zero selected by this curation ledger and zero verified live releases in this ledger.
- Latest observed main: `ed2cf603aa47fc26e4f04216d5704351b72a32a9`. Work remains on `indie-collection-two-dev`; no main, Gummy Bay or concurrent catalogue changes were overwritten.
- This is an improvement to candidate 27, not a new candidate or extra campaign level. Ember Parcel, Windup Wrestling and Last Lighthouse still need implementation, initial improvement, and their own subsequent additional round.

## Observed weakness and changed gameplay

The five compact bike routes had only a passive suspension choice, optional parcels and best ghosts. Cargo damage offered no recovery decision. Direct rendered play also exposed missed short taps: a press and release between animation frames could disappear.

After completing the original Milk Run, the garage now opens two optional field kits:

- **Roadside straps:** two spare straps physically weigh down acceleration, top speed and hop height. Stop on solid road below speed 12 and fit one spare to replace a broken strap. Fitting it lightens the bike. Healthy cargo, airborne attempts and excessive speed do not consume supplies.
- **Spring assist:** two deliberate high hops, with a drag cost and potentially harder landings. The ordinary hop remains unlimited. A second cyan projection shows the assisted trajectory and turns red for damage risk. Charges are spent only on a grounded activation.

Each kit keeps its own verified best recordings and ghosts. Classic records retain their original physics and remain intact. Kit deliveries can unlock later routes. The unchanged version-1 save key accepts legacy saves without kit fields and reconstructs all new equipment usage from bounded input recordings.

Steady pedalling can be toggled with Q or a large button. Braking overrides it; pause, blur, restart and route changes release it. Short hop/kit inputs are buffered until a simulation step, including semantic kit-button activation. Changing kits now refreshes their route badges immediately.

## Implementation evidence

- `3af7e75dd514577e46819bf77672bdfadef51e48`: field kits, handling/resource choices, separate records, steady pedal, tests and the new twenty-entry checklist.
- `6599f77659f45ceb6994970000654b051236d66b`: fixes discovered in rendered play—buffered short inputs and kit-specific badge refresh—with regression coverage.

## Rendered play, separate from automated routes

Direct cloud-browser play used the actual controls and normal game clock, without injecting game state:

1. Rode the original Milk Run to a three-seal delivery, unlocking field kits.
2. Tried the canal with the spring kit; a missed short tap led to an actual bridge loss. This exposed the input buffering bug. Restarted after fixing it.
3. Crossed the canal using two naturally timed spring activations, collected both parcels, landed cleanly and delivered for three seals. The next route unlocked. Reload preserved the result and equipment record.
4. In a 390×844 phone iframe, rode Cobble Exchange with spare straps. Two cobbled impacts damaged cargo. Stopped, fitted each spare, observed the restored strap count and lighter load, reloaded after the first repair, then delivered with two seals and unlocked the next route.
5. Cancelled a restart to retain the delivery, then confirmed a restart: supplies reset to two while the saved best stayed intact. Followed the return link to the QA catalogue; full repository navigation is checked by the native suite.
6. Inspected desktop spring trajectory/landing and phone riding/repair screenshots. The aligned phone play panel shows scene, driving controls, steady pedal, kit action and status together; garage/setup and results still require scrolling.

This is agent-operated rendered QA, not a human enjoyment study. The cloud browser ran the animation clock slowly; displayed game seconds are not claims about testing duration or content length.

## Verification

- Local Ratchet Run: 40 engine and 36 DOM checks passed. Ten kit/route input recordings deliver; all original soft/firm routes remain valid. Tests cover resource depletion, mass tradeoffs, repair restrictions, spring impact risk, legacy saves, independent records/ghosts, unlocks, exact paused reload, restart, corruption isolation, key aliases and buffered taps.
- Final-source CI `40038858541`: 380 engine + 279 DOM checks passed (659 total). All seven jobs succeeded, including all seventeen native desktop/touch suites. The final motion job additionally verifies kit loss/retry and quick-tap/reload; normal-clock steady pedal and braking passed.
- Prior implementation CI `40038356318`: all seven jobs passed, including all seventeen games' desktop/touch suites and ten new kit deliveries per input mode. Final fixes also passed the separate exact-source run above.
- Local public shell, bridge/pointer release, relaxed collection, asset/syntax checks (19 bundled routes, 55 references), nine first-batch selected source hashes and the twenty-slot ledger gate passed. The two inherited stale launcher tests remain outside the claimed pass set.

The exact-source motion artifact contains **60 Ratchet screenshots**. Inspected `desktop-spring-4-used.png` and `touch-repair-3-used.png`; controls, kit usage, cargo feedback and layout are readable. [Artifact](https://github.com/ThatOneMop/study-desk/actions/runs/40038858541/artifacts/12538996156); ZIP SHA-256 `9aa415ec56e3bf6bedd73a5d92d0b97c24a383fe3c0489f5cea0cc8650d05137`.

## Quality and remaining work

Comparative agent assessment: enjoyment 3.5/5, depth 3/5, polish 3.5/5, reliability 4.5/5 and variety 4/5. These are design judgments, not survey scores. The new equipment creates route-dependent recovery and jump choices, and steady pedalling plus buffered taps improve comfortable control. This remains a small five-route game. It has no expanded world, procedural campaign, audio layer or hours-of-content claim. Manual spring play achieved three seals where the reference route earns two; fixtures establish reachability, not optimal play.

The additional-round checklist is now **1/20 verified**, with Ratchet Run complete. Comparative selection remains deferred. The remaining nineteen additional-round entries must receive their own new upgrades; prior initial passes cannot satisfy them. No game was integrated or released live by this increment.

## Publishing investigation — performed once for this round

On 24 October, the latest main Pages run was still `39925660833`, job `120321277348`, failing Configure GitHub Pages. Its log reports both “Get Pages site failed. Error: Not Found” and “Create Pages site failed. Error: Resource not accessible by integration.” No unchanged deployment was retried and no permission settings were changed. This describes the repository's Pages workflow, not any separate Sites publication. Development is not blocked; a live release is not claimed from these commits.
