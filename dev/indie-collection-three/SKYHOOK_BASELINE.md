# Skyhook baseline — 4 November 2026

Candidate81 is implemented and baseline-tested on indie-collection-three-dev. It is **not improved, qualified, selected or released**.

## Playable loop

Move a crane trolley with a suspended load; cable length and damped swing determine clearance over the warehouse roof. Align with the berth, lower the load and release gently. Roof contact or rough release returns the current crate to the dock while preserving deliveries. Three deliveries complete a shift; subsequent shifts vary berth positions. Handling scores persist through restart/new shifts. Original canvas artwork and source; no imported collection or third-party assets.

Implementation: [c0c60162612a8fbefc7bec65482bc8b365504fee](https://github.com/ThatOneMop/study-desk/commit/c0c60162612a8fbefc7bec65482bc8b365504fee).
Baseline feedback fix: [e5792ee908c59c84126ce1c96825f1ef262fabc2](https://github.com/ThatOneMop/study-desk/commit/e5792ee908c59c84126ce1c96825f1ef262fabc2).

## Evidence

CI41765352567 at e5792ee908c59c84126ce1c96825f1ef262fabc2 passes four engine checks and six rendered deliveries (three at desktop1280×1000, three at touch-emulated390×844), rough release/retry, confirmation cancel/restart, delivery saves/reload, records/new shift, pause, Space and no overflow/page errors. Repository74 routes/286 asset references and nine selected first-batch integrity checks pass. Artifact13293145490 SHA2568057b4a198baededaa0f722acdb1bcc4edbc684a28f61dc1fa94cff0e675dbe5 downloaded/verified; desktop-load-0.png and touch-load-2.png opened and inspected.

[Passing run](https://github.com/ThatOneMop/study-desk/actions/runs/41765352567).

Initial run41765156818 failed waiting for a landing after its test mistook low speed at a swing turning point for settled cargo. Direct rendered preview also exposed roof contact after premature lowering. Added visible trolley/drift readings and made the test wait for low drift as well as low speed. These are baseline fixes, not the required substantive improvement.

Desktop and phone artifact inspection shows readable controls, berth and landing guide with no page overflow. Direct preview testing exercised trolley motion, lowering, roof contact and restart, but did not complete a delivery there; the six completed deliveries are CI browser evidence. The preview's slow frame cadence exposed frame-rate-dependent physics; do not claim uniform real-time handling.

## Next substantial improvement

Repeated individual trolley clicks and passive settling dominate the baseline. Berth position variation alone provides little replay depth. Next, add comfortable continuous/hold handling and an active damping or cargo-handling decision, improve clearance/landing forecasts and use meaningful cargo constraints rather than more repetitive shifts. Use accumulated bounded physics substeps so low frame rates do not slow the simulation arbitrarily. Show saved best-score comparisons. Play the changed rendered loop before marking improved.

Full keyboard routes, hidden confirmations, corrupt/quota saves, stronger save consistency and actual bridge/Collection navigation require qualification. No claims of human enjoyment, physical-device coverage or measured long content duration. No audio assets are included.

## Preservation and counts

Fresh main remains e2ba9d1a221da8cdb3180a7f372a54743f6c52c2. Re-read development at e5792ee908c59c84126ce1c96825f1ef262fabc2 before recording this report. Existing exact14 catalogue curation and concurrent sources remain untouched. No new Switch workspace control was introduced; Games navigation is retained. The unchanged main/publication audit was not repeated or counted as new work.

Batch3: **41/50 built,40/50 improved,40/50 fully browser-qualified,0 active integrated,0 active live;9 unbuilt**. Exactly50 candidate slots remain. Historical integration/live counts remain separately preserved. Batch2 remains20 built/initially improved and20/20 additional-round verified, with historical nine releases and zero active after main curation.

The current recursive development tree has no AGENTS.md or dev/indie-collection/FINAL_REPORT.md; retain the recorded historical first-batch20 finished/nine selected baseline without reconstructing missing source. No public Skyhook URL is claimed. Overall task remains incomplete; no automation changes.
