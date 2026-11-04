# Spore Loom baseline — 5 November 2026

Candidate87 is an original cellular-growth planting puzzle. It is a playable baseline, not yet substantively improved, fully qualified, selected or released.

## Core loop
Plant a limited set of spores around fixed starter cells, then advance simultaneous generations. A live cell survives with two or three living neighbours; an empty cell sprouts with exactly three. All eight neighbours count and edges do not wrap. Match the final target colony exactly, including empty cells outside the gold rings. Replant restores the chosen starting pattern, allowing edits without a lives system or real-time timer. Best planting counts persist across plots and restart.

The three plots explore a stable cushion, an oscillating reed and a travelling lantern pattern. Growth depends on interactions rather than filling target cells directly. An alternate cushion solution grows from two planted spores instead of the obvious three, verified in the engine during implementation. Three fixed small puzzles remain a deliberately limited baseline.

Original SVG mushrooms, dark woodland colours, neighbour counts, target rings, touch/native keyboard buttons, saved generations, explicit corrupt-save recovery and temporary-storage feedback are implemented. The growth rules are Conway's public mathematical rules; all game code and art are original MIT, with no third-party collection or assets imported.

[Implementation](https://github.com/ThatOneMop/study-desk/commit/ebd0d792e180fc92c417164f56607c70f46a98fc)

[Rendered-feedback correction](https://github.com/ThatOneMop/study-desk/commit/79e18a11b99fb2b1c1ebcdf7a2b461a0a967a98d)

## Evidence
CI41921519708 at79e18a11b99fb2b1c1ebcdf7a2b461a0a967a98d passed four engine checks and six rendered colony solutions at desktop1280×1000/touch-emulated390×844. Exact per-action reload, growth/target progression, lifting/replant/missed/restart, records, Space/Enter/Escape, pause, corrupt/quota storage, Games navigation and no overflow/page errors passed. Repository74 bundled routes/286 asset references, syntax/Freedoom and nine selected first-batch integrity checks passed. Artifact13367985561 SHA2564c34fbbd5bb43a9e56704a433f112909ab15e4c008b73cf4c084933022e82fbe downloaded/verified; touch-won-1.png inspected. Earlier CI41921200328 passed; artifact13365869555 SHA2569b8ae1176d8d0f10c3db3741a453a270f33d9a34b91d1c0a89a429147c15cb5d verified; desktop-growth-2.png and touch-won-1.png inspected, prompting clearer empty soil and corrected save wording. These minor baseline repairs do not count as a substantive improvement pass.

Automated rendered actions and agent screenshot inspection are not human enjoyment, physical-device or duration evidence.

## Assessment and next steps
The mechanic is distinct from the previous candidates: a small initial intervention produces an evolving colony through simultaneous local rules. Initial challenges are small and fixed, so progression and replay choices need a substantive improvement after this rendered baseline. Investigate meaningful environmental constraints or limited mid-growth tending, not repeated maps or longer generation counts. Then qualify full keyboard routes, embedded lifecycle/navigation and save-state consistency before selection.

## Preservation
Batch3:47/50 built,46 improved,46 fully qualified,0 active integrated/live; three unbuilt slots88–90. The separate ledger retains exactly50 candidate slots. Batch2's20/20 additional improvement round and historical release evidence remain unchanged.

Fresh main f6164b75b93c4a323a7c8dfedd5f3711f7719437 is preserved, including concurrent Arcade, Numberworks/Packworks/Gummy Bay work and saves. Main has not changed since the last launcher audit; no unchanged publication failure was retried. No catalogue or automation changes were made and no new live release is claimed. Fresh recursive development tree inspection found no AGENTS.md or dev/indie-collection/FINAL_REPORT.md; historical baseline evidence remains recorded without inventing missing files.
