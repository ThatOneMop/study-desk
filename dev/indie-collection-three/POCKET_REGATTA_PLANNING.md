# Pocket Regatta: draft route planning
25 October 2026. [Implementation be2fd59bca2a9e07b327a86e69edcfbffb842510](https://github.com/ThatOneMop/study-desk/commit/be2fd59bca2a9e07b327a86e69edcfbffb842510).

## Before and after
Source inspection identified a planning limitation: the forecast showed only the immediate tack, so evaluating the next turn or reef approach required executing a move first.

Players can now build an editable draft of up to six tacks. Every leg projects from the prior leg's position and heading, applying the actual wind, 90-degree helm limit, sail distance, ordered buoy crossings and grounding rules. The chart marks draft squares and its endpoint; a text list reports each leg's destination and remaining hull. The six-leg bound keeps the planner compact, not a content count.

Adding, removing or clearing a draft spends no moves, hull or records. **Sail next planned tack** commits only its first leg. Remaining legs stay editable. A projection can show a grounding or loss, but nothing happens until sailing. Drafts cannot extend past a finish or loss and respect remaining journal capacity. Undo and confirmed restart/course change clear stale drafts. Pause and cancelled restart preserve them. Drafts are explicitly temporary: reload retains saved progress/settings but discards the draft.

Original physics, course layouts, scoring, unlocks and save key/schema are unchanged. Existing journals remain compatible.

## Evidence
`NODE_PATH=/tmp/regatta-deps/node_modules node --test tests/pocket-regatta-engine.cjs tests/pocket-regatta-dom.cjs`: **13 passing checks: 7 engine and 6 DOM**.

The original three complete courses and save/control/recovery tests still pass. New coverage compares projections with committed movement, confirms nonmutation and no premature records, rejects illegal subsequent turns or continuation past loss, enforces the draft bound, drafts and sails all three courses through UI controls, verifies one-tack execution, trim/clear, pause/cancel/reload, future-state grounding warnings and undo clearing.

JavaScript syntax and catalogue exclusion passed. The full repository build/preservation suite was not run from the partial checkout. The scope is Pocket Regatta source/tests plus this report and the third-batch ledger; main, prior collections and catalogue are untouched.

## Quality status
This is a source-led gameplay addition, **not a completed rendered-play-led improvement**. No screenshot, native touch, visual readability or enjoyment claim is made. Existing browser access policy restrictions were not retried or bypassed.

Third batch remains **4 built / 0 improved / 0 browser-tested / 0 integrated / 0 verified live**, with exactly 50 candidate slots. Second batch remains 20 initially complete and **6/20 additional upgrades verified**. No public release.

Next: use permitted rendered access to play the drafting and sailing loop, assess whether the planner improves useful decisions without cluttering phone controls, inspect screenshots, and complete the substantive improvement and release gates.
