# Soundings

Third collection slot 51: a deduction/salvage prototype. Place sonar buoys on a 5×5 chart, combine distances to the nearer of two beacons, and spend fuel to recover both. An optional 2-fuel bearing survey reports compass directions to both beacons without identifying them or giving distances. Directions are grid-relative (north is up); NE means above/right, not an exact angle. Repeated directions remain repeated; Here marks a beacon at the survey square. The notebook eliminates impossible pairs using readings, successful recoveries and misses; it marks possible and certain locations without recommending the next buoy. Recovered beacons keep transmitting, so readings remain comparable.

Fourteen fuel per attempt: distance sonar costs one, bearings cost two, recovery always costs three. Repeated soundings/recoveries are rejected for free. Failure occurs when remaining fuel cannot pay for both outstanding recoveries. Retry repeats the chart; New voyage changes the deterministic seed while preserving unlocked sectors and best fuel records. Three sectors use different hidden placements with the same rules. They are not three distinct mechanics or a large authored campaign. All 300 possible beacon pairs are reachable in the rules model; this is a test space, not an authored content count. Local score comparisons are casual, since charts differ and retries reveal information.

Original CSS nautical chart art; no external assets or runtime dependencies. Native buttons support pointer and keyboard activation, with minimum 44px targets and visible focus. Numbers, symbols and accessible names distinguish readings, recoveries and certainty. Actual rendering, native activation and mobile/touch usability are not yet verified. Pause, confirmations and same-origin parent hide guard gameplay. No real-time clock.

Save key `study-desk-soundings-v1` is isolated. Saves contain a seed, sector, bounded action journal and local records. Decode replays legal actions, rejects duplicates and post-terminal input, validates sequential unlocks and requires consistent winning records. Corrupt saves remain untouched until confirmed recovery/reset. Storage failure permits a temporary session. Saves and records are not anti-cheat authentication.

## Checks

`node --test tests/soundings-engine.cjs`

`NODE_PATH=/path/to/node_modules node --test tests/soundings-dom.cjs` (jsdom 26.1.0).

Sixteen tests: ten engine, six DOM. Both the original distance-only policy and a bearing-first visible-evidence policy solve all 300 beacon pairs within the fuel budget and 100 seeded three-sector campaigns. Other checks cover true-pair retention, nearest-distance readings, persistent signals, losses/retry, journal/save validation, invalid/duplicate actions, input ownership, progression, UI labels, reload, navigation markup, pause/dialog/parent guards, isolated reset, recovery and quota failure. UI campaign tests use known targets to exercise handlers; they are not natural deduction play. Additional tests cover mirrored-distance ambiguity, duplicate/Here bearings, combined notebook filtering, bearing-first routes, expensive-survey losses, old v1 saves, new journal validation, persisted signals, repeated viewing at no cost, reload and pause/dialog guards. Dialog APIs are simulated. Both scripts pass syntax checks.

No rendered-browser, screenshot, native keyboard, physical touch, full-repository-build or human-enjoyment claim. This is an initial source prototype, not a completed improvement pass. Next: naturally play on desktop/touch, inspect screenshots, assess notebook clarity and whether the fuel/sonar choices are engaging, implement a substantive playtest-led improvement and recheck failure/retry, saves/restart and launch/navigation before selection.

## Pending source refinement — 26 October

Before: distance readings were the only surveying choice, with ambiguity about which beacon each buoy heard. After: optional bearings cost twice as much, supplying both directions; the notebook combines both evidence types. Selected-square readings can be revisited free. This is a source/engine/DOM-based upgrade and does not count as the required rendered-playtest-led improvement. Natural play must assess whether bearings are worth their cost and whether compass feedback is clear on touch and desktop.

## Pending area-sweep refinement — 27 October

Area sweep spends one fuel to count both beacons within Manhattan distance two of the selected square (including the centre). The optional striped footprint is read-only: thirteen squares at the centre, six at a corner. It clears on reload, while recorded counts persist in the journal/notebook. Counts supplement nearest distance and bearings, retaining recovered transponders. Repeat sweeps at the same square reject free; overspending can still lose. Existing saves and old derived board shapes remain unchanged when no sweep is used.

24 engine/DOM tests (15 engine, 9 jsdom) cover the expanded rules, including all 300 pairs solved by a centre-sweep-first visible-evidence policy followed by the existing distance/recovery policy. This establishes solvability for that policy, not superiority or human enjoyment. Native keyboard/touch/layout and footprint readability still await rendered play.


## Survey planning pass — 31 October 2026

Rendered play exposed an opaque information-versus-fuel decision. The free planner now partitions only the notebook's remaining hypotheses for each survey at the selected square. It reports the worst remaining pair count, possible readings and their pair counts, uninformative/recorded surveys, and fuel remaining above the recovery reserve. It does not read chart seeds or actual targets. There is no automatic move selection. This gives cheap distance/count surveys a legible comparison against stronger two-fuel bearings.

Arrow keys move a single chart tab stop without spending fuel. Candidate borders have stronger contrast. Native dialog cancellation restores controls, parent-hidden games cannot resume or confirm destructive actions, and embedded Games navigation requests the Collection from the host. The version-1 save schema and storage key remain unchanged.

Validation: 28 engine/DOM checks locally; rendered chart-1 sector victories left 3, 2 and 3 fuel. The first sector was the before-upgrade observation; sectors 2/3 used the new planner. Native Escape, reload, new voyage, reserve exhaustion and retry were exercised in the rendered preview. `tests/soundings-browser.cjs` adds desktop/emulated-touch regression with these routes and storage/navigation guards; CI evidence belongs in the batch ledger. Three sectors remain a compact deduction campaign, not a content-hours claim.
