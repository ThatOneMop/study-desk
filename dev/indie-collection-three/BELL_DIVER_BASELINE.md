# Bell Diver — candidate68 playable baseline

2 November 2026. Source committed on indie-collection-three-dev. No public release.

## Original loop and current implementation

Bell Diver is a turn-based salvage expedition. Oxygen changes only when swimming, with extra ascent cost for heavy cargo. Return to the bell to bank valuables, refill air and buy larger tanks or efficient fins. Air pockets can help on a dive. Exhaustion rescues the diver but leaves unbanked finds in the wreck; banked valuables stay safe. Retrieve three instruments across three authored wrecks. Completed expeditions can restart while retaining gear, coins and completion count.

This is distinct from Deep Pocket's fishing tension/keep-release loop, Soundings' hidden-beacon deduction and lunar salvage's real-time magnetic dragging. Shared shell conventions do not replace the new engine. All source/visual layout is authored here; no external collection was imported.

## Verification

Baseline CI41434407214 passed on3d3da404ea645461acbc66b4be71a903a238b64c: six engine checks and two complete rendered three-wreck expeditions in desktop1280x1000 and390x844 touch-emulated Chromium. Per-action reload, salvage banking, tank/fins purchases, instrument progression, completed-expedition replay retention, natural empty-bag oxygen rescue, abandonment/retry, native Escape, keyboard movement, pause, corrupt/quota recovery, standalone Games return and no horizontal overflow/page errors pass. Engine tests separately cover loaded rescue and bank/gear preservation, heavy ascent cost, pockets, malformed saves and capacity.74 bundled routes/286 HTML references and nine first-batch selected-source integrity checks pass. Artifact13135019593 SHA256531827e5c4b21d208d4353ae095c4d5535460ece4d4a37dc54a6ae70d28bc794 verified. Desktop first-wreck and touch third-wreck screenshots inspected.

[Implementation](https://github.com/ThatOneMop/study-desk/commit/3d3da404ea645461acbc66b4be71a903a238b64c) · [Passing workflow](https://github.com/ThatOneMop/study-desk/actions/runs/41434407214)

Two complete expeditions mean six rendered wreck completions, not six separate games. The scripted routes are automated rendered play, not evidence of human enjoyment. No playtime estimate is claimed. The tests run against development source; the74-route asset check does not describe main's current public catalogue.

## Observed weaknesses — next substantial pass

The complete baseline route retrieves every item separately, never needs an air pocket and finishes without rescue. Safe repeated trips dominate; cargo-versus-oxygen choices need a meaningful benefit for efficient planning. Finite expedition resources or optional recovery briefs could support those decisions, but must be implemented and tested before being credited. Preserve the forgiving current saves.

The inspected390px screenshot shows the entire seven-row map above the action buttons. Movement and collection require repeated scrolling. Keep controls/current-cell feedback visible with the map. The diving bell is an ambiguous clover glyph and the diver a dot; improve their visual identity with original readable artwork. Reload restores generic opening prose even in later wrecks, which should become state-aware.

These are unfinished quality obligations. No substantive improvement pass, full browser qualification or selection is counted yet. Add loaded-cargo rendered rescue, actual pocket use, keyboard action and real-bridge hidden-state checks alongside the improvement.

## Counts and preservation

Third batch: **28/50 built,27/50 improved,27/50 fully browser-qualified,0 currently integrated,0 currently live**. Exactly50 slots remain;22 are unbuilt. Historical25 releases remain separate. Second batch remains20/20 with its additional round completed and9 historical releases, currently0 active after PR110.

Main remained fa57730f70904ae5f15e47fe0c7e55dc28144c88. No catalogue, Numberworks, Gummy Bay, requested-GitHub-games, prior sources/saves or automation settings were changed. No unchanged publication failure was retried. Current dev tree has no AGENTS.md or requested first-batch FINAL_REPORT.md; established baseline and current ledger were used without claiming a fresh read of an absent file.

Next complete Bell Diver's meaningful improvement and qualification, then build slots69–90. Retain all unfinished candidates on development branches. Public expansion still requires reconciliation with the deliberate14-game catalogue; this baseline has no published game link.
