# Crate & Cushion — care goals and protection forecasts
25 October 2026. [Implementation 38136ca8a412ad4bc3cc3e99a606b4a8ff4d8579](https://github.com/ThatOneMop/study-desk/commit/38136ca8a412ad4bc3cc3e99a606b4a8ff4d8579).

## Before / after
The initial game offered normal safe dispatch and a move-count record, with contact feedback only after placement. This increment adds optional care seals:
- Observatory parcel: normal safety plus at least one telescope/blanket shared edge.
- Braced tray: normal safety plus three foam edges.
- Long trunk: normal safety plus two blanket edges.

These are alternative packing goals within existing jobs, not extra games or padded levels. Automated enumeration showed a universal blanket goal was impossible in the braced tray; final goals are job-specific, and all three have valid solutions. Normal dispatch and unlocking remain unchanged.

Placement preview now reports the prospective foam, blanket and heavy-tool contact counts, normal readiness and care readiness without changing the crate. Selecting a packed parcel restores its current anchor and rotation, so moving it starts where it actually sits.

Care seals are earned only on sealing and persist through undo/repack. Existing save key/version, journal and move records are preserved. Older saves default to no care awards because historical arrangements are not known; no retroactive award is invented.

## Validation
`NODE_PATH=/tmp/crate-deps/node_modules node --test tests/crate-cushion-engine.cjs tests/crate-cushion-dom.cjs`: **13 checks pass (8 engine, 5 DOM)**.

Original three-job completion, keyboard/control, saves/reload, pause, undo/repack and scoped recovery/reset tests still pass. Added checks prove each care goal achievable, require sealing before award, retain awards on repack/reload, migrate old saves, reject malformed award arrays, compare forecasts to committed checks without mutation, display care/prospective feedback and recall packed parcel positions without moving them.

Syntax and catalogue exclusion checks pass. Full repository build was not run from the partial checkout. Only Crate & Cushion source/tests and third-batch documentation changed; first/second collections, main and public catalogue are untouched.

## Outstanding quality gate
This is source-led work, not a verified rendered-play-led improvement. No browser play, native touch, screenshots or human-enjoyment evidence is claimed. The previous browser-policy denial was not retried or bypassed.

Counts remain **5/50 built, 0 improved/browser-tested/integrated/live**. Second batch remains 20 initially complete and **6/20 additional upgrades verified**. No live release.

Next: rendered assessment of whether the care goals create worthwhile packing choices, preview clarity and touch controls; then a substantive playtest-led pass and progression/save/navigation regression before selection.
