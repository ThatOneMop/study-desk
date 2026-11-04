# Skyhook improvement — 4 November 2026

Skyhook81 is substantively improved, awaiting full qualification. Source remains on indie-collection-three-dev; no catalogue or live release change.

## Observed weakness and implemented change

The previous rendered baseline required repeated trolley taps followed by passive settling. Berth changes alone supplied little variation; the direct preview also revealed slow physics at low frame cadence.

- Hold trolley/cable buttons to repeat movement, retaining precise individual taps. Release, cancellation and blur clear the hold; busy/hidden state also cancels it.
- A tag-line assist once per load reduces swing angle to20% and angular velocity to15%, costing two handling points. It trades score for faster control rather than awarding free progress.
- Completing an ordinary shift unlocks its precision manifest. Glass requires cable220–240, sway≤8 and berth±12; tall cabinets require180–200, sway≤12 and berth±16; machine parts require200–220, sway≤10 and berth±12. Different movement impulses alter their swing response. The cabinet therefore cannot reuse the old220-cable delivery route.
- Precision results earn separately saved seals. The interface shows cargo requirements, assist availability and both best records.
- Bounded substeps process up to one second of elapsed time per frame, replacing the previous25ms clamp. A one-second/sixty-frame numerical comparison passes. Longer stalls intentionally discard excess time. Existing saves migrate to ordinary mode with one assist and an empty seal book; the key is unchanged.

Implementation: [7e13857](https://github.com/ThatOneMop/study-desk/commit/7e138572c8003dcb74030f8371f3f31e530866e7).

## Rendered testing and regression

CI41771232010 at7e138572c8003dcb74030f8371f3f31e530866e7 passed seven engine checks and eighteen rendered deliveries: ordinary, earned precision and replayed ordinary shifts at desktop1280×1000 and touch-emulated390×844. Six precision deliveries exercise distinct cable/sway/placement constraints and tag-line consumption; separate seals persist across reload/restart. Pointer hold/release, rough release/retry, confirmation cancel/restart, records/new shift, pause, Space and no overflow/page errors pass. Repository74 routes/286 asset references, syntax/Freedoom structure and nine selected first-batch integrity checks pass. Artifact13294917584 SHA25674da110b5163afc9bb32d53c20fbb637c1850b3b86ef182cd948113ec13a6cac downloaded/verified; desktop-precision-0.png and touch-precision-1.png opened and inspected.

[Passing run](https://github.com/ThatOneMop/study-desk/actions/runs/41771232010).

The eighteen deliveries are nine per viewport: three ordinary, three precision and three ordinary replays. Pointer hold was tested with mouse input at both viewport sizes; taps were touch-emulated on the phone context. Do not equate this with physical touch-hold verification. The screenshots were reviewed for readable cargo limits, available/consumed assist state and saved-record labels. Only the named images were inspected.

Seven engine checks cover ordinary delivery/record/restart, rough drop recovery, roof clearance, invalid saves, distinct precision routes/seals, assist consumption/effect and elapsed-time equivalence/legacy migration.

## Assessment and next work

The precision route changes and limited active assist add decisions beyond the original generic crate route. Hold controls remove much of the repetitive input. However, one warehouse and three profiles still limit replay depth; no selection decision is made yet.

Qualification must check full keyboard routes, actual bridge/Collection navigation, hidden pointer-hold cancellation and confirmations, corrupt/quota recovery and stronger save consistency. Current guidance describes instantaneous landing readiness rather than predicting the next swing. All cargo uses the same crate artwork/collision envelope; handling labels are not a realistic cargo-dimension or mass model.

Evidence consists of automated rendered routes, engine checks and agent screenshot inspection, not human enjoyment, physical-device testing or measured long content duration.

## Preservation and counts

Fresh main remains e2ba9d1a221da8cdb3180a7f372a54743f6c52c2; development was re-read at7e138572c8003dcb74030f8371f3f31e530866e7 before this record. Preserve PR110's exact14 catalogue and concurrent Gummy Bay/requested-GitHub-games work. No new workspace-switch control was introduced, and unchanged main/publication findings were not repeatedly audited or counted as new work.

Batch3: **41/50 built,41/50 improved,40/50 fully browser-qualified,0 active integrated/live;9 unbuilt**. Exactly50 slots remain, with historical integration/live evidence retained separately. Batch2's20/20 additional round remains complete with historical nine releases preserved. No live Skyhook URL is claimed.

The current recursive development tree still contains no AGENTS.md or dev/indie-collection/FINAL_REPORT.md. Historical first-batch20 finished/nine selected evidence remains recorded, without reconstructing missing files. Overall work remains incomplete; no automation changes.
