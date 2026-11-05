# Cairnfall improvement — 5 November 2026

## Rendered baseline weakness
The baseline's landing ghosts were readable, but cascades immediately resolved to a final board and aggregate score. Players could not inspect the individual waves before committing. Three fixed pair orders also left no choice over which pair to use next.

## Substantive upgrade
Exchange brings the next pair forward and defers the current pair. Players start with two charges, can exchange once per drop, cannot waste charges on identical pairs, and regain one charge (up to two) for a two-wave chain. Thus chain construction fuels future order changes; the supply remains finite and deliberate, with no timer or repeated-level padding.

A live, read-only drop forecast lists each wave's cleared-stone count, multiplier and points. It follows movement, rotation and exchanges without consuming a move or changing the save. Completed drops explain their actual waves and charge restoration. Visible queue order and charge counts persist through reload. Existing v1 saves migrate to the original bag order and two charges while preserving board, score, setup and records.

## Evidence
Final CI41971886248 at93d8b42149b77bf33a218fe59a3aaa64883f1d7c passed six engine checks and twelve rendered quarry wins: original and exchanged-pair routes on desktop1280×1000 and touch-emulated390×844. Verified spending/restoring exchange charges, per-drop restriction, exact multiwave forecasts, per-action saves/reloads, records, loss/retry, Space/arrows/Escape, pause, corrupt/quota saves, Games navigation and no overflow/page errors. Repository asset checks, source syntax/Freedoom structure and nine selected first-batch integrity checks passed. Artifact13389439993 downloaded and SHA256 verified:0034d2344f03b9f7567b59562f268a538ee4d119c88da39f36f3c5715e853740. Inspected touch-chain-plan-2 and desktop-exchange-win-2: two-wave +14 forecast wraps clearly, committed result matches, score36 record and charge count remain readable. Phone requires scrolling. First CI41971728667 failed before browser launch because Array.map supplied its index to the route helper's new optional state parameter; corrected in93d8b42149b77bf33a218fe59a3aaa64883f1d7c. Automated testing/agent inspection is not human enjoyment or physical-device evidence.

## Assessment and remaining work
The exchange mechanic adds meaningful sequencing choices and the exact forecast makes multiwave decisions understandable. The altered-order test routes win all three quarries and regain spent charges through real chains. There are still only three authored bags, and cascades resolve without animation. Full keyboard-only campaigns, embedded lifecycle/navigation and stronger board/progress/save consistency remain qualification work. No human enjoyment, physical-device or hours-of-content claim.

## Preservation
Exactly50 third-batch slots:49 built,49 improved,48 fully qualified,0 active integrated/live. Slot90 remains unbuilt. Second-batch20/20 additional-round completion and historical release evidence remain unchanged. Main f6164b75b93c4a323a7c8dfedd5f3711f7719437 remains unchanged, preserving concurrent Arcade/Numberworks/Packworks/Gummy Bay and current curation. No live release or automation change. Unchanged Switch workspace and publication investigations were not repeated. Current development tree still has no AGENTS.md or first-batch FINAL_REPORT.md; historical baseline evidence is retained without inventing missing files.

[Implementation](https://github.com/ThatOneMop/study-desk/commit/ed733c4a93816462b78d827b48a57fcdd048aff9) · [Workflow](https://github.com/ThatOneMop/study-desk/actions/runs/41971886248)
