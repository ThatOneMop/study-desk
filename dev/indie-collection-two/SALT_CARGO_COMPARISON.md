# Salt & Sail — compare the cost of discarding cargo

## Observed weakness

Reviewed rendered desktop Needle Cut and 390-pixel Glass Tide mid-voyage screenshots from native run 40686526711, artifact 12816395925. The optional cargo controls only named the goods; the paused chart overlay and distant hold information did not help compare the handling consequences at the decision. Source inspection confirmed the confirmation showed value, mass and list numbers with a generic warning, without a comparative course.

This observation came from actual rendered automated routes and agent screenshot review. It is not a claim of new direct interactive-browser play or a human enjoyment study.

## Implemented change

Optional cargo decisions now open a paused keep-versus-discard course chart. The player can try straight, port or starboard helm while holding Reef, without spending a simulation frame or cargo. Both outcomes cover the same two-second horizon, show hull hits and safe/failed landing outcomes, and retain value, weight and list costs. Solid and dashed paths distinguish the choices independently of text colour.

Confirmation still discards only the chosen optional load, advances one straight reefed step and leaves the voyage paused. The planned helm is a forecast, not an autopilot command. Required contracts remain protected. Cargo forfeits its crowns and the full-cargo seal; dropping a balancing load may be harmful. Retry restores the original packing and existing best deliveries cannot be downgraded.

The cargo buttons now expose forfeited value, have larger touch targets, and keep their DOM identity while sailing instead of being rebuilt every render. Background inputs and hidden/paused confirmations cannot mutate the voyage.

## Implementation evidence

- Earlier optional-jettison mechanics: ef574e418ff648ad99e553b96818016af03621b7 (previously uncounted source-only additional work).
- Comparison chart, selectable helm, control stability and guards: 338801dc521a79734d962e66bfcc9bd5ff171e22.
- Mid-voyage regression scenarios: f94a8a3f62284794c5f193b16bd1f5a7d0d32c0c.
- Sharp-turn viewport correction: e1ed0d48c2abff8321e6e011666b2d2343e54292. The rendered phone risk comparison clipped its final point; a DOM regression reproduced y = -4.29 outside the chart before the bounds were expanded to include both complete paths.
- Exact plotted endpoint correction: c9677ba910996e90a0bbe2faa78adc3812370999. A new assertion first failed because a 119-frame sampled path stopped at frame 105; the final actual position is now included. Numerical prediction and saved voyage physics were unchanged.

## Verification

60 focused engine/DOM checks pass. New pure equal-horizon comparison matches actual physics, includes confirmation-frame damage, preserves saves, and tests both helpful and harmful naturally reached mid-voyage choices. A failing endpoint assertion and a failing clipped-path DOM case were reproduced before their respective corrections.

CI 40692035038 on c9677ba910996e90a0bbe2faa78adc3812370999 passed all seven jobs, 895 engine/DOM checks and desktop/emulated-touch original plus five jettison deliveries, native risk cases, saves/retry/reset/navigation. 68 Salt screenshots retained in artifact 12818312551 (ZIP SHA256 141079829202163c4780f9690c263512d9efddc9c4ecf990c70eb63a42731b69). Inspected desktop-jettison-risk-0 and touch-jettison-risk-2; the latter exposed the cropped endpoint. These screenshots precede the bounds fix, so the additional pass remains uncounted.

Verify e1ed0d48c2abff8321e6e011666b2d2343e54292 in native desktop/touch, inspect corrected sharp-turn screenshots, then record the final additional-round pass. Count stays 12/20 until that review.

## Quality and scope

Five authored passages remain. This upgrade adds a way to evaluate an optional emergency sacrifice alongside steering and reefing, not extra repetitive levels or a content-hours claim. Repacking, protecting contracts, balancing mass, choosing a rig and improving delivery records remain the replay goals. A short forecast cannot guarantee the rest of the crossing. Original canvas/SVG/CSS art and existing version-one replay saves are preserved.

Source remains on indie-collection-two-dev. No new catalogue entry or live upgrade is claimed. First-batch source/saves and concurrent main, Gummy Bay and third-batch work are preserved.
