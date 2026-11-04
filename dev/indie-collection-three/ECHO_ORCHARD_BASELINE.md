# Echo Orchard implementation checkpoint — 5 November 2026

Candidate86's originally pending rendered baseline has now passed. This report preserves the baseline evidence; see ECHO_ORCHARD_IMPROVEMENT.md for the subsequent Duet upgrade. It is not selected or released.

## Implemented loop
Record a walk, imprint it, then rewind to the entrance. Up to two echoes replay their saved footprints simultaneously with each player move and hold their final positions. Leaf plates open gates; the player must stage echoes to reach the orchard exit. Gate checks use pre-step positions, so waiting matters. Erase removes the newest echo and rewinds while preserving earlier echoes. Restart preserves saved best-footstep records.

Three original layouts, SVG orchard tiles, touch/keyboard buttons, pause, recovery of unreadable saves and storage-failure feedback are implemented. No real-time timer or lives are imposed. Original code/artwork use no third-party assets.

[Source](https://github.com/ThatOneMop/study-desk/commit/8a51203a81057c6d306eb175eef3ec9563e69ec8).

## Evidence and current limit
Four local engine checks pass: all three normal-action solutions, immutable state, save roundtrips, echo playback/holding/rewind, gate timing, erase/restart/slot limits and malformed saves. Engine solutions take22/19/22 movement steps.

CI41892617485 at8a51203a81057c6d306eb175eef3ec9563e69ec8 completed successfully: four engine checks and six rendered desktop1280×1000/touch-emulated390×844 orchard solutions, exact per-action reload, echo/plate/gate progression, erase/restart, records, Space/Enter/Escape, pause, corrupt/quota storage, Games, no overflow/page errors. Repository74 bundled routes/286 asset references, syntax/Freedoom and nine selected first-batch integrity checks passed. Artifact13354179157 SHA256a3b23627c2dc92a94c5c933611ed50c5a5d4f365d0d9c94e530239cf2c336e3b verified; desktop-echo-0.png and touch-won-2.png inspected.

These automated rendered routes and screenshot inspections are not evidence of human enjoyment or duration.

## Next steps and quality
Baseline verification is resolved. The subsequent improvement adds retracing Duets and gate forecasts; full qualification remains separate. The engine routes currently share a two-plate staging sequence; meaningful replay timing and route choices should deepen it instead of adding repetitive maps. Full qualification follows.

## Preservation at the original implementation checkpoint
Batch3: **46/50 built,45/50 improved,45/50 fully browser-qualified,0 active integrated/live;4 unbuilt slots87–90**. Exactly50 ledger slots retained. Batch2's20/20 additional improvement round and separate historical release evidence remain preserved.

Fresh main is 16b3b1658812a90c885fab83d3af419557d8b59b; current catalogue, Numberworks/Packworks/Gummy Bay work and existing saves are untouched. No Switch workspace controls, public entries or automation changes were added. No unchanged publication failure was retried. Recursive development tree still contains no AGENTS.md or first-batch FINAL_REPORT.md; retain historical baseline evidence without inventing files.

Overall work is incomplete. Catalogue/preflight reconciliation and final selection remain outstanding.
