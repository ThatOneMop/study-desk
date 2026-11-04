# Scree Rider qualification — 5 November 2026

Candidate84 is qualified and held in reserve. It is not selected or released.

## Fixes and assessment
Save loading accepted impossible starting positions, damage and time histories, implausibly short records and missing completion records. The decoder now checks these necessary consistency constraints and lost-bike recovery state. Legitimate legacy saves, crash/retry states, earned lines and completed descents still reload. The completion screen now says alternate lines are earned rather than asking the player to finish again.

[Implementation](https://github.com/ThatOneMop/study-desk/commit/6c51c34ea3c35ebee65e7cb13129105fcaa2a6c4).

Earned narrow routes offer useful speed-retention and approach choices, with readable forecasts and landing markers. However, the three fixed trails and single unlock per trail provide limited replay/progression variety. Retain as a qualified reserve for final comparison rather than add an entry solely because tests pass.

## Evidence
CI41853573427 at6c51c34ea3c35ebee65e7cb13129105fcaa2a6c4 passed nine engine checks, fourteen pointer/touch descents and six full-keyboard descents, including explicit speed1 and speed2 gap-bridge crossings. Per-action reload, records/restart, loss/retry, Tab/Enter/Space/Escape, real bridge hidden restart/recovery/ride controls, explicit resume, Collection messages, unrelated-save isolation, corrupt/quota storage and no overflow/page errors pass. Repository74 bundled routes/286 asset references, syntax/Freedoom and nine selected first-batch integrity checks pass. Artifact13335733497 SHA2560d05172ae8b6f2c750907aba165e9052f26ea62b60eb1ddffdb339e43f4fa5b5 downloaded/verified; desktop-keyboard-2.png and touch-shell.png opened and inspected.

[Passing run](https://github.com/ThatOneMop/study-desk/actions/runs/41853573427).

The slow bridge tests execute complete earned routes through normal controls and explicitly assert the crossing speed. Twenty completions are automated rendered routes, not human enjoyment or physical-device/long-duration evidence. Embedded checks use the actual bridge and game in a controlled host. Save checks validate necessary bounds and relationships, not every possible action history.

## Preservation and next steps
Fresh main remains 16b3b1658812a90c885fab83d3af419557d8b59b; concurrent Numberworks, Packworks, Gummy Bay, existing saves and the curated catalogue are untouched. No Switch workspace controls were added. No repeated unchanged publication retry, public release or automation change was made.

Batch3: **44/50 built,44/50 improved,44/50 fully browser-qualified,0 active integrated/live;6 unbuilt slots85–90**. Exactly50 slots and separate historical release evidence remain. Batch2 retains20/20 additional improvements. Fresh recursive development tree has no AGENTS.md or first-batch FINAL_REPORT.md; preserve the historical20 finished/nine selected baseline without inventing missing files.

Next: build candidate85. Overall slate comparison and release-preflight reconciliation with the current curated catalogue remain outstanding. This is ongoing development, not task completion.
