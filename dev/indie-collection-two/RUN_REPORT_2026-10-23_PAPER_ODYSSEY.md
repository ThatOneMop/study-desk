# Paper Odyssey — second-batch increment, 23 October 2026

Paper Odyssey (slot 26) is the sixth second-batch candidate: fold a paper chart, cross between islands that now touch, then unfold to reach new parts of the world. Collect every postage stamp and bring the letter to a lighthouse with the chart flat. Five compact charts introduce horizontal folds, changing axes, wet ink, thread repairs and an economical final route.

The moving map is the mechanic: each island retains its physical identity while its position is reflected across a crease. The traveller moves with its island. Crossing between overlapping layers is explicit, and a labelled crossing list keeps stacked islands accessible. Only one axis may be folded at a time; every fold/unfold uses one crease. Walking is free. Ink costs one heart on the first visit, then dries; each thread spool repairs two creases once. The last two reference routes require more folds than their starting supplies permit, so collecting thread matters.

This is distinct from first-batch Inkline's drafting/ink economy: Paper Odyssey changes spatial adjacency through mirrored geometry and layer crossings. Original smooth SVG paper, islands, stamp illustrations, lighthouse and folded-paper traveller provide its visual identity. No outside collection or third-party art was imported. It is a short puzzle campaign, not a full-scale exploration game or a multi-hour-content claim.

## Implementation and improvement

Initial playable source was committed as `fed424a977ca9e25e3d497007775571451e7eec5` after **22 engine and 15 DOM tests** passed. Before that commit, design review removed simultaneous two-axis folds because compressing the chart that far made too many routes trivial. Five clean reference routes are retained with the authoring search. The search is a practical route finder, not an optimality proof.

Improvement commit `2fdcf59ad9da741f6ad8937608b42a5a28ae4f63` adds exact non-mutating action previews: future chart, hearts, creases, collected stamps, fold count and reachable islands. Moves are staged and explicitly confirmed or cancelled. A labelled read-only preview prevents accidentally moving through a future route before committing the fold. Ink damage, a last crease that strands the journey and successful delivery are announced before spending resources. Keyboard Enter confirms, Escape cancels, and commits restore focus to the traveller. Paper feedback respects reduced-motion settings.

The isolated save key is `study-desk-paper-odyssey-v1`. Saves reconstruct the chart from verified actions; best seals survive rewind and confirmed restart. Unreadable saves remain untouched until explicit replacement. Storage failures leave gameplay available with a visible warning.

## Verification

Exact-source [CI 39956463788](https://github.com/ThatOneMop/study-desk/actions/runs/39956463788) passed **261 engine/interface tests** (144 engine, 117 DOM), full desktop and touch-emulated campaigns for all six candidates, and public integrity gates. Paper Odyssey completed all five charts at three seals at 1280×1000 desktop and 390×844 touch emulation. Exact preview supplies, per-chart reload, native Enter/focus, keyboard/cancel, last-crease loss/undo, ink drying, restart/cancel, isolated corrupt-save recovery and return navigation passed without browser errors. The touch context also verified reduced motion. [126 screenshots](https://github.com/ThatOneMop/study-desk/actions/runs/39956463788/artifacts/12503415329) were retained, including 24 Paper Odyssey captures. Final desktop preview and touch chart 4 midgame screenshots were visually inspected.

Locally, **261 engine/interface checks** passed across all six candidates (144 engine, 117 DOM). Paper Odyssey contributes 25 engine and 20 DOM checks. These cover five clean campaign completions; an independent reflection-coordinate oracle for all physical cells and fold directions; layer crossings; atomic rejection; one-axis restrictions; ink drying; one-use thread repairs; flat-chart delivery; exhausted-paper loss and recovery; journal limits; exact replay saves; record validation; unlocks; previews; modal/key guards; focus; restart/cancel; corrupt-save recovery and unavailable storage.

All five Paper Odyssey charts were also completed through direct cloud-browser controls at three seals: the first at desktop width, the remaining four in a 390px layout frame. That frame is responsive layout inspection, not physical-device touch testing. The preview panel and chart were inspected at both sizes.

Public shell, bridge-pointer and relaxed-collection checks passed, as did 19 bundled route/assets checks, nine first-batch selected-source hashes and the exact twenty-slot gate. This buildless repository uses syntax and static-integrity checks instead of a compilation step.

Evidence limits: reference routes and deterministic checks are not exhaustive player exploration or enjoyment research. No physical-device or full screen-reader audit is claimed. Five authored charts and seal optimization constrain replay depth. The phone layout uses vertical scrolling between the chart and controls; the crossing list provides larger targets than the small island markers.

## Quality and selection

Agent design review, 1–5 scale, not player-survey scores: enjoyment 3.5, depth 3, polish 4, reliability 4.5, variety 4. Folding, transferring between layers and reopening a chart produces the clearest moments of discovery. Exact previews make the geometry understandable and prevent scarce creases being spent accidentally. The limited chart count constrains depth. Retain it as a finished development candidate for comparison; it is not selected for the public catalogue yet.

The next candidate is Ratchet Run, a side-view trials courier, to add action variety to the slate. The still-unimplemented slot 28 is renamed from Moonwell to Wellward solely to avoid a title collision with the separate Afterlight collection; its bucket-and-rope concept and uncounted planned status remain intact.

## Preservation, publication and next work

The first-batch final report was freshly read at `c03682dc435ecdaacd94966273d789dd90e9f7b1`: 20 finished, nine selected, 66 improvement passes and zero verified live. All first-batch source, saves, catalogue entries and tests remain unchanged. The preceding five second-batch games are unchanged. Main was re-read at `ed2cf603aa47fc26e4f04216d5704351b72a32a9`; current messaging, movie/TV, Gummy Bay and requested-game work was preserved. Only second-batch source/tests/workflow/records were committed through leased development-branch updates.

Published second-batch game links: **none**. Development-branch commits are separate from catalogue integration and live deployment. Latest public release [39925660833](https://github.com/ThatOneMop/study-desk/actions/runs/39925660833) was checked again on 23 October: routes/assets passed, Configure GitHub Pages failed, and prepare/upload/publish were skipped. Game development is not blocked by that publishing issue.

Inherited `catalog-launch.cjs` and `curation-regression.cjs` still reference the removed `playerStudy` control. They were preserved and are not claimed to pass. Reconcile those old assertions before later public integration.

**6/20 playable, improved and finished; 0 selected, integrated or verified live.** Fourteen slots remain concepts. First-batch games and the separate Nightshift/Afterlight collections are excluded. Next: implement, improve and test Ratchet Run, slot 27. Later work remains reserved for broader comparison, winner selection, integration onto fresh main and final regression. The automation remains active because the additional batch is unfinished.
