# Echo Orchard improvement — 5 November 2026

Candidate86 now has a substantive replay-timing upgrade. Full qualification and selection remain pending.

## Rendered weakness and change
The baseline screenshots showed readable orchard paths and two static plate-holding echoes, but all three routes used the same staging solution: park A, park B, exit. Mobile Down also occupied a separate row.

After a gentle completion, **Duet** unlocks for that garden. Echoes retrace their recorded footsteps forward and backward forever instead of parking. Recorded waits on a plate widen the opening window, while route length determines the repeating rhythm. The player must align movement with gates that open and close. An eight-beat forecast and individual footprint positions make this visible. This adds planning choices without a real-time timer or extra repetitive maps. Replaying the old gentle routes in Duet leaves all three unfinished (5/7/7 blocked inputs in the engine check).

Duets award persistent leaf seals and separate best-step records. Restart, erase and confirmed return to gentle mode offer recovery without lives or loss penalties. Legacy saves default to gentle mode and retain records. Arrow keys move, W waits, I imprints and U erases; native buttons remain keyboard/touch accessible.

Screenshot-driven follow-up fixes keep all five movement controls on one phone row, change instructions with the active mode and show the appropriate gentle/Duet best score.

Source commits:
- [Duet mechanics](https://github.com/ThatOneMop/study-desk/commit/9f914d8f501f1728d386e51865dac9fac1d4099c)
- [Phone controls and guidance](https://github.com/ThatOneMop/study-desk/commit/564ee3d0ebac7de18ce604af7ddeb84ba51b1ee7)

## Evidence
Baseline: CI41892617485 at8a51203a81057c6d306eb175eef3ec9563e69ec8 completed successfully: four engine checks and six rendered desktop1280×1000/touch-emulated390×844 orchard solutions, exact per-action reload, echo/plate/gate progression, erase/restart, records, Space/Enter/Escape, pause, corrupt/quota storage, Games, no overflow/page errors. Repository74 bundled routes/286 asset references, syntax/Freedoom and nine selected first-batch integrity checks passed. Artifact13354179157 SHA256a3b23627c2dc92a94c5c933611ed50c5a5d4f365d0d9c94e530239cf2c336e3b verified; desktop-echo-0.png and touch-won-2.png inspected.

Initial upgrade: CI41902559082 at9f914d8f501f1728d386e51865dac9fac1d4099c passed six engine checks and twelve rendered gentle/Duet solutions. Exact per-action reload, unlocks, seals, erase/restart, records, Space/Enter/Escape, pause, corrupt/quota storage, Games navigation and no overflow/page errors passed. Repository74 bundled routes/286 asset references, syntax/Freedoom and nine selected first-batch integrity checks passed. Artifact13359426354 SHA25673b948980fc2f59866e89d66ad6f6871bd0152987ba76e01597994f25cda514c downloaded/verified; desktop-duet-echo-0.png and touch-duet-won-2.png inspected. These screenshots prompted the follow-up phone/control guidance correction.

Final CI41902937782 at564ee3d0ebac7de18ce604af7ddeb84ba51b1ee7 passed six engine checks and twelve rendered gentle/Duet solutions on desktop1280×1000 and touch-emulated390×844. Exact per-action reload, Duet unlocks/seals, return-to-gentle, erase/restart, records, native Space/Enter/Escape and arrow movement, pause, corrupt/quota storage, Games navigation, same-row movement buttons and no overflow/page errors passed. Repository74 bundled routes/286 asset references, syntax/Freedoom and nine selected first-batch integrity checks passed. Artifact13359377133 SHA256f9b7b2c0af4c283ed283b8560e6eb89a337cc067726a4b5664cbacc1289c0907 downloaded/verified; touch-duet-won-2.png inspected to confirm corrected phone row, active-mode goal and Duet best score. Earlier upgrade artifact13359426354 was also verified and desktop/phone screenshots inspected.

## Assessment and next steps
The new gate rhythm changes successful routes and gives recording pauses a purpose. The campaign still contains only three fixed layouts with the same two-gate topology. Do not claim extensive content, human enjoyment or measured play duration. Browser runs are automated input routes, touch is emulated, and screenshots were inspected by the agent.

Next: strengthen save path/tick/completion consistency, test complete keyboard-only routes and embedded bridge hide/resume/confirmation/Collection navigation, then assess selection against the slate. No loss state exists; erase/restart/return-gentle are the recovery paths.

## Counts and preservation
Batch3:46/50 built,46/50 substantially improved,45/50 fully browser-qualified,0 active integrated/live; four unbuilt slots87–90. The ledger retains exactly50 slots. Batch2's20/20 additional improvement round and historical release evidence remain preserved.

Fresh main f6164b75b93c4a323a7c8dfedd5f3711f7719437 includes concurrent Arcade PR111. Current main index.html/app.js contain no Switch workspace label and retain Games/Collection, search, genre/grouping/sorting and favourites. This run does not change the launcher or claim a fresh deployed navigation verification. Preserve Arcade, Numberworks, Packworks and Gummy Bay work. No catalogue additions, deployment or automation changes were made; no unchanged publishing failure was retried.

The recursive development tree still contains no AGENTS.md or first-batch FINAL_REPORT.md. Historical baseline evidence remains recorded without inventing missing files. Final curation/preflight reconciliation and overall completion remain outstanding.
