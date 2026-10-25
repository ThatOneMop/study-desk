# Soundings

Third collection slot 51: a deduction/salvage prototype. Place sonar buoys on a 5×5 chart, combine distances to the nearer of two beacons, and spend fuel to recover both. The notebook eliminates impossible pairs using readings, successful recoveries and misses; it marks possible and certain locations without recommending the next buoy. Recovered beacons keep transmitting, so readings remain comparable.

Fourteen fuel per attempt: sonar costs one, recovery always costs three. Repeated soundings/recoveries are rejected for free. Failure occurs when remaining fuel cannot pay for both outstanding recoveries. Retry repeats the chart; New voyage changes the deterministic seed while preserving unlocked sectors and best fuel records. Three sectors use different hidden placements with the same rules. They are not three distinct mechanics or a large authored campaign. All 300 possible beacon pairs are reachable in the rules model; this is a test space, not an authored content count. Local score comparisons are casual, since charts differ and retries reveal information.

Original CSS nautical chart art; no external assets or runtime dependencies. Native buttons support pointer and keyboard activation, with minimum 44px targets and visible focus. Numbers, symbols and accessible names distinguish readings, recoveries and certainty. Actual rendering, native activation and mobile/touch usability are not yet verified. Pause, confirmations and same-origin parent hide guard gameplay. No real-time clock.

Save key `study-desk-soundings-v1` is isolated. Saves contain a seed, sector, bounded action journal and local records. Decode replays legal actions, rejects duplicates and post-terminal input, validates sequential unlocks and requires consistent winning records. Corrupt saves remain untouched until confirmed recovery/reset. Storage failure permits a temporary session. Saves and records are not anti-cheat authentication.

## Checks

`node --test tests/soundings-engine.cjs`

`NODE_PATH=/path/to/node_modules node --test tests/soundings-dom.cjs` (jsdom 26.1.0).

Ten tests: six engine, four DOM. A visible-evidence policy solves all 300 beacon pairs within the fuel budget and 100 seeded three-sector campaigns. Other checks cover true-pair retention, nearest-distance readings, persistent signals, losses/retry, journal/save validation, invalid/duplicate actions, input ownership, progression, UI labels, reload, navigation markup, pause/dialog/parent guards, isolated reset, recovery and quota failure. UI campaign tests use known targets to exercise handlers; they are not natural deduction play. Dialog APIs are simulated. Both scripts pass syntax checks.

No rendered-browser, screenshot, native keyboard, physical touch, full-repository-build or human-enjoyment claim. This is an initial source prototype, not a completed improvement pass. Next: naturally play on desktop/touch, inspect screenshots, assess notebook clarity and whether the fuel/sonar choices are engaging, implement a substantive playtest-led improvement and recheck failure/retry, saves/restart and launch/navigation before selection.
