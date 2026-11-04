# Skyhook qualification — 4 November 2026

Skyhook81 is **qualified reserve**, not selected for the public catalogue.

## Fixes

[6c39b52](https://github.com/ThatOneMop/study-desk/commit/6c39b52fe4dfb22045c0e1e8b1d02a1afd5f5dc7) strengthens saved-state consistency: fractional counters, off-grid positions, displacement without sufficient movement, impossible assist use, missing or contradictory completion records and non-reset won geometry now fail validation. Legitimate legacy saves still migrate. Next-shift navigation stops at the decoder's supported seed bound rather than creating an unreadable save.

Held controls now clear synchronously when the game becomes hidden, rather than waiting for an animation frame that the host may pause.

These are qualification fixes. The prior substantive improvement remains the precision manifest, limited tag-line assist, hold controls, separate seals and elapsed-time integration; this run does not count another improvement pass.

## Verified evidence

CI41778859102 at467928f5c49bfc99949162e36113cca3a0b44414 passed nine engine checks, eighteen pointer/touch rendered deliveries and twelve full-keyboard ordinary/precision deliveries. Delivery saves/reload, records/seals/restart, rough release/retry, Tab/Enter/Space/Escape, real bridge hidden hold/action/mode/restart/recovery guards, explicit resume, Collection messaging, unrelated save isolation, quota fallback and desktop/touch layout pass. Repository74 routes/286 asset references, syntax/Freedoom structure and nine selected first-batch integrity checks pass. Artifact13297569817 (16 images), SHA25644b3dff0661b4258f12464d9f394210e5757a7cab5a86dde80736fd17ffd8d5e downloaded/verified; desktop-keyboard.png and touch-shell.png opened and inspected.

[Final successful run41778859102](https://github.com/ThatOneMop/study-desk/actions/runs/41778859102) tests [467928f](https://github.com/ThatOneMop/study-desk/commit/467928f5c49bfc99949162e36113cca3a0b44414).

The thirty deliveries comprise eighteen pointer/touch deliveries and twelve additional keyboard deliveries: ordinary and precision three-load shifts at both viewport sizes. The real bridge is loaded in a controlled same-origin iframe. Hidden confirmation acceptance cannot overwrite saves; hidden held input stops, input released while hidden does not resume automatically, and returning visible requires explicit resume. Explicit corrupt-save recovery succeeds; quota errors retain a temporary playable session. Games emits the Collection message and an unrelated save sentinel remains unchanged.

Downloaded artifact13297569817 contains16 screenshots; its SHA256 was verified. Inspected desktop-keyboard.png shows a completed precision shift, one seal and both saved records. touch-shell.png shows readable embedded phone layout and accessible controls. Only these named final screenshots were inspected.

## Test development failures, not passing evidence

- Run41776799662 passed nine engine checks/eighteen deliveries but timed out polling hidden bridge state via animation frames. eb4c645 uses polling independent of paused frames.
- Run41777212618 timed out in the keyboard route. Diagnostic synchronization/capture was added in1a23dba; run41777642880 then caught a missing async modifier in that diagnostic callback. d3d66b4 fixes it.
- Run41778011015 captured the ordinary shift already completed while the route expected precision mode. a049b30 waits for Escape to close the dialog and asserts the next mode transition before play.
- Run41778407711 progressed through keyboard and hidden-control checks but exposed a test setup race: autosaving could overwrite an injected corrupt value before reload.467928f injects that value during page initialization instead.
- Only the complete successful final run is counted for qualification. These test corrections do not constitute extra game improvement passes.

## Quality decision and limits

Hold input removes repeated tapping; the tag-line assist trades points for faster settling; precision loads require distinct lowering and placement decisions. Still, one warehouse, three cargo profiles and berth-position variations do not offer enough depth to displace the strongest catalogue choices. Retain Skyhook in reserve.

Cargo profiles share a crate drawing/collision envelope and are not a realistic dimension/mass simulation. Readiness is instantaneous, not a future landing forecast. Long stalls beyond one second discard excess simulation time. Tests are automated rendered routes and agent screenshot inspection, not human enjoyment, physical-device verification or measured content-duration evidence. Pointer hold tests use mouse input at both sizes; phone taps are touch-emulated.

## Preservation and next work

Fresh main remains e2ba9d1a221da8cdb3180a7f372a54743f6c52c2; development was re-read at467928f5c49bfc99949162e36113cca3a0b44414 before this report. Exact14 catalogue curation and concurrent Gummy Bay/requested-GitHub-games source remain untouched. Unchanged workspace-navigation/publication findings were not repeatedly audited or counted as new work. No new live route or publication claim.

Batch3: **41/50 built,41/50 improved,41/50 fully browser-qualified,0 active integrated/live;9 unbuilt**. Exactly50 slots remain; historical release evidence remains separately recorded. Batch2 remains20 built/improved and20/20 additional-round verified, with historical nine releases and zero active after main curation.

The development tree has no AGENTS.md or dev/indie-collection/FINAL_REPORT.md; historical first-batch20 finished/nine selected evidence remains preserved without reconstructing missing files. Next: build distinct candidate82. Overall work remains incomplete; no automation changes.
