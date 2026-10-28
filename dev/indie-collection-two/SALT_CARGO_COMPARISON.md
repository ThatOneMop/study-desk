# Salt & Sail — compare the cost of discarding cargo

## Observed weakness

Reviewed rendered desktop Needle Cut and 390-pixel Glass Tide mid-voyage screenshots from native run 40686526711, artifact 12816395925. The optional cargo controls only named the goods; the paused chart overlay and distant hold information did not help compare the handling consequences at the decision. Source inspection confirmed the confirmation showed value, mass and list numbers with a generic warning, without a comparative course.

This observation came from actual rendered automated routes and agent screenshot review. It is not a claim of new direct interactive-browser play or a human enjoyment study.

## Implemented change

Optional cargo decisions now open a paused keep-versus-discard course chart. The player can try straight, port or starboard helm while holding Reef, without spending a simulation frame or cargo. Both outcomes cover the same two-second horizon, show hull hits and safe/failed landing outcomes, and retain value, weight and list costs. Solid and dashed paths distinguish the choices independently of text colour.

Confirmation still discards only the chosen optional load, advances one straight reefed step and leaves the voyage paused. The planned helm is a forecast, not an autopilot command. Required contracts remain protected. Cargo forfeits its crowns and the full-cargo seal; dropping a balancing load may be harmful. Retry restores the original packing and existing best deliveries cannot be downgraded.

The cargo buttons now expose forfeited value, have larger touch targets, and keep their DOM identity while sailing instead of being rebuilt every render. Background inputs and hidden/paused confirmations cannot mutate the voyage.

## Implementation evidence

- Earlier optional-jettison mechanics: [ef574e4](https://github.com/ThatOneMop/study-desk/commit/ef574e418ff648ad99e553b96818016af03621b7) (previously uncounted source-only additional work).
- Comparison chart, selectable helm, control stability and guards: [338801d](https://github.com/ThatOneMop/study-desk/commit/338801dc521a79734d962e66bfcc9bd5ff171e22).
- Mid-voyage regression scenarios: [f94a8a3](https://github.com/ThatOneMop/study-desk/commit/f94a8a3f62284794c5f193b16bd1f5a7d0d32c0c).
- Sharp-turn viewport correction: [e1ed0d4](https://github.com/ThatOneMop/study-desk/commit/e1ed0d48c2abff8321e6e011666b2d2343e54292). The rendered phone risk comparison clipped its final point; a DOM regression reproduced y = -4.29 outside the chart before the bounds were expanded to include both complete paths.
- Exact plotted endpoint correction: [c9677ba](https://github.com/ThatOneMop/study-desk/commit/c9677ba910996e90a0bbe2faa78adc3812370999). A new assertion first failed because a 119-frame sampled path stopped at frame 105; the final actual position is now included. Numerical prediction and saved voyage physics were unchanged.

## Verification

Final source [e1ed0d4](https://github.com/ThatOneMop/study-desk/commit/e1ed0d48c2abff8321e6e011666b2d2343e54292) passed all seven CI jobs in [run 40694980007](https://github.com/ThatOneMop/study-desk/actions/runs/40694980007): 530 engine + 366 DOM = 896 checks, syntax/assets, exact twenty-slot and nine first-batch source-integrity gates. Native job 122840267369 passes five original three-seal and five jettison deliveries on desktop and emulated touch, pure three-helm comparisons, both naturally reached helpful/harmful discard cases, full visible path bounds, cancellation, exact discarded-cargo reload, preserved best records, native keyboard/multi-touch, cutter unlock, loss/retry, bridge pause, isolated recovery/reset and navigation. Real-time RAF steering also passes. No browser errors.

68 Salt & Sail screenshots retained in [artifact 12820355054](https://github.com/ThatOneMop/study-desk/actions/runs/40694980007/artifacts/12820355054). Inspected desktop-jettison-risk-0, touch-jettison-risk-2 and touch-jettison-5-arrival. Corrected sharp-turn paths and endpoints stay inside the chart, the shore boundary is visible, contrasting outcomes and controls remain readable, and the 29-crown one-seal arrival preserves earlier 15-seal best records. Phone pages still require scrolling. ZIP SHA256 388e70bdb7dec5802d6c4ccee214d445a89171d4ffbd30ebfe7ed5cd4d68cd9d. Evidence is automated rendered play plus agent screenshot review, not human enjoyment, direct interactive-browser play this increment, or physical-device testing.

Current result: **13/20 additional upgrades verified**, 33 meaningful passes including the 20 initial passes. Third collection remains **24/50 built; 0 qualified improved/browser-tested/integrated/live**. No new catalogue integration or live upgrade in this increment.

## Quality and scope

Five authored passages remain. This upgrade adds a way to evaluate an optional emergency sacrifice alongside steering and reefing, not extra repetitive levels or a content-hours claim. Repacking, protecting contracts, balancing mass, choosing a rig and improving delivery records remain the replay goals. A short forecast cannot guarantee the rest of the crossing. Original canvas/SVG/CSS art and existing version-one replay saves are preserved.

Source remains on indie-collection-two-dev. No new catalogue entry or live upgrade is claimed. First-batch source/saves and concurrent main, Gummy Bay and third-batch work are preserved.
