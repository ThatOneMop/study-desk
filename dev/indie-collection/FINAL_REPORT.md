# Final indie collection report

**Achieved: 20/20 playable, 20/20 meaningfully improved, 20/20 finished, 9 selected for the public source catalogue, 11 retained as finished development reserves, and 0 verified live URLs.** The ledger retains exactly 20 candidate slots and records 66 meaningful improvement passes.

## Selected collection

| Game | Core loop and selection reason | Public source |
| --- | --- | --- |
| Tidepost | Tide, fuel and hull-aware boat logistics with six authored routes and meaningful cargo/upgrade choices. | [Source](https://github.com/ThatOneMop/study-desk/tree/7676b2dbe5e12bf567aabd25ba1fb74c62cb4b97/games/tidepost) |
| Deep Pocket | Deterministic fishing fights, habitat/tide planning, stewardship choices and five trips with alternate conservation routes. | [Source](https://github.com/ThatOneMop/study-desk/tree/7676b2dbe5e12bf567aabd25ba1fb74c62cb4b97/games/deep-pocket) |
| Queen of Cinders | Turn-based ant-colony rescue with finite supplies, worker assignment, fire routing and five distinct rescues. | [Source](https://github.com/ThatOneMop/study-desk/tree/7676b2dbe5e12bf567aabd25ba1fb74c62cb4b97/games/queen-of-cinders) |
| Little Foundry | Hands-on mould tracing and pouring with six rule families, fuel tradeoffs and owner-request mastery. | [Source](https://github.com/ThatOneMop/study-desk/tree/7676b2dbe5e12bf567aabd25ba1fb74c62cb4b97/games/little-foundry) |
| Scrap Orbit | Real-time orbital salvage with thrust, braking, cable payout, tension management and five contracts. | [Source](https://github.com/ThatOneMop/study-desk/tree/7676b2dbe5e12bf567aabd25ba1fb74c62cb4b97/games/scrap-orbit) |
| Inkline | Four-page tactical route-building with ink/binding economy, hazards, wells, drafting and exact landing forecasts. | [Source](https://github.com/ThatOneMop/study-desk/tree/7676b2dbe5e12bf567aabd25ba1fb74c62cb4b97/games/inkline) |
| Pocket Expedition | Compact expedition roguelike with weather, health, food, extraction timing and persistent discoveries. | [Source](https://github.com/ThatOneMop/study-desk/tree/7676b2dbe5e12bf567aabd25ba1fb74c62cb4b97/games/pocket-expedition) |
| Echo Vault | Stealth extraction across four vaults with exposure, sound, confiscation risk and 12 mastery seals. | [Source](https://github.com/ThatOneMop/study-desk/tree/7676b2dbe5e12bf567aabd25ba1fb74c62cb4b97/games/echo-vault) |
| Glasshouse | Plant-breeding campaign with light, water, traits, movable shade and five exhibitions. | [Source](https://github.com/ThatOneMop/study-desk/tree/7676b2dbe5e12bf567aabd25ba1fb74c62cb4b97/games/glasshouse) |

The selected slate deliberately spans logistics, fishing, colony management, manual craft, real-time action, tactical cards, expedition survival, stealth and breeding. Selection used the recorded enjoyment/depth/polish/reliability/variety review rather than automatically publishing every completed candidate.

## Finished reserves

Spore Kitchen, Bolt & Bristle, Roof Runner, Stone Song, Last Match, Burrow Express, Storm Signal, Circuit Garden, Moss Market, Threadbound and Rain Catcher remain durable, playable and improved on the development branch. They are intentionally absent from the public catalogue; this is a quality/variety decision, not unfinished work.

## Verification and commit evidence

- Exact gameplay source [`510186beed5946a25d0627092647c2cb9dcfdb4e`](https://github.com/ThatOneMop/study-desk/commit/510186beed5946a25d0627092647c2cb9dcfdb4e) passed [CI 39889649120](https://github.com/ThatOneMop/study-desk/actions/runs/39889649120): repository/selection gates, all 20 engine suites, all 20 DOM/save suites, every desktop and touch-emulated Chromium regression, and 49 screenshots in [artifact 12475065950](https://github.com/ThatOneMop/study-desk/actions/runs/39889649120/artifacts/12475065950).
- Development records are preserved at [`77093165c0c2bf2e8d7119a267b4d989dcfe6ff4`](https://github.com/ThatOneMop/study-desk/commit/77093165c0c2bf2e8d7119a267b4d989dcfe6ff4).
- The nine selected games and catalogue are integrated on public `main` at [`7676b2dbe5e12bf567aabd25ba1fb74c62cb4b97`](https://github.com/ThatOneMop/study-desk/commit/7676b2dbe5e12bf567aabd25ba1fb74c62cb4b97). The scoped promotion preserved unrelated Study Desk, requested-GitHub-games and Gummy Bay work.
- The public [release workflow 39891177156](https://github.com/ThatOneMop/study-desk/actions/runs/39891177156) passed all 19 route/asset checks and the nine selected source hashes, then failed at **Configure GitHub Pages** before upload or deployment.

## Evidence boundaries and remaining blocker

No live game URL is claimed. GitHub Pages must be enabled or granted the required repository/Actions access, then the release workflow must be rerun and all nine deployed routes checked. Until that happens, the links above are intentionally source links.

The recorded evidence is deterministic engine, save/DOM, Chromium desktop, touch-emulation, navigation, restart, progression and screenshot coverage plus targeted UI review. It is not a 20-hour playtime claim, a human enjoyment study, a physical-device touch pass or a full screen-reader audit. Those remain appropriate follow-up validation, not grounds to overstate this delivery.

