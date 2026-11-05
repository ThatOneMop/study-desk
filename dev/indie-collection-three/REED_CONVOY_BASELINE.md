# Reed Convoy baseline — 5 November 2026

Candidate88 is a playable original linked-convoy delivery puzzle. Its substantive improvement, full qualification and selection remain pending.

## Core loop and distinctness
Steer a tug through rock-lined waterways. Every trailing boat follows the prior position of the boat ahead; collecting a reed crate adds a boat while keeping the tail in place. The tug cannot enter rocks or occupied convoy cells, except a departing tail cell on a non-pickup move. Return to HOME and unload any carried crates to shorten the convoy; bank all three deliveries and improve the saved movement/service record.

This differs from Switchyard Post67's rail pushing/pulling and Lockwater70's chamber-water management: the core constraint is a variable-length moving body that occupies its recent route. There are no tracks, pushes, water-level operations or imported game code. Original SVG artwork and code are MIT. Arrow/touch movement, native keyboard buttons, pause, explicit corrupt-save recovery and temporary-storage fallback are implemented.

Three small waterways have normal-action solutions in17/17/15 actions including unloading. These are automated solution lengths, not content-duration claims. Partial-load banking is implemented and tested; blocked moves consume no actions. There is no loss state or timer, with restart available if a route becomes awkward.

## Evidence
CI41946394586 at a81c40f832d46994221df5f94b3e2c5e8fedb2db passed four engine checks and six rendered deliveries (three waterways each at desktop1280×1000 and touch-emulated390×844). Verified exact save/reload after each normal action, convoy growth/tail movement/unloading, partial banking, records, restart cancellation/confirmation, Space/arrows/Escape, pause, corrupt-save preservation/recovery, quota fallback, Games navigation, no overflow or page errors. Asset checks passed74 bundled routes/286 references, syntax/Freedoom checks and all nine selected first-batch integrity checks. Artifact13378239894 SHA25690a56c610a13097652f025a9a625701701b3eaa8b2712ad2d0782c93b8510397 downloaded and verified. Inspected desktop-loaded-1 and touch-won-2: five-boat loaded convoy and HOME are legible, phone completion/records and controls fit without horizontal clipping; phone requires vertical scrolling.

Automated rendered routes and agent screenshot inspection are not human-enjoyment, physical-device or duration evidence.

## Quality and next steps
The linked body makes positioning and load size visible, but the three initial maps can all be finished in one full haul. Partial-load banking is currently optional rather than a strong strategic choice. Use the rendered baseline to add meaningful route/load constraints or delivery choices, not just repeated maps or longer counters. Then qualify full keyboard routes, embedded lifecycle/navigation and stronger save/body/history consistency before final slate comparison.

## Preservation
Batch3:48/50 built,47 improved,47 fully qualified,0 active integrated/live; two unbuilt slots89–90. Exactly50 ledger slots retained. Batch2's20/20 additional round and historical releases remain preserved.

Main f6164b75b93c4a323a7c8dfedd5f3711f7719437 is unchanged, including concurrent Arcade, Numberworks/Packworks/Gummy Bay work and existing saves. No catalogue, live release or automation changes. The unchanged Switch workspace and publishing investigations were not repeated or counted as work. Fresh recursive development tree contains no AGENTS.md or dev/indie-collection/FINAL_REPORT.md; historical evidence remains recorded without inventing missing files.

[Implementation](https://github.com/ThatOneMop/study-desk/commit/a81c40f832d46994221df5f94b3e2c5e8fedb2db) · [Verification](https://github.com/ThatOneMop/study-desk/actions/runs/41946394586)
