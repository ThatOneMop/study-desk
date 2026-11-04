# Stillwater Dyehouse baseline — 4 November 2026

Candidate83 is built and baseline-tested, **not substantially improved, fully qualified, selected or released**.

## Playable loop
Add single cups of Rose, Indigo and Marigold to pots holding4,3 and2 cups. Pour up to one or two cups into another pot; transfers preserve the mixture's proportions and stop at receiving capacity. Deliver two cups matching the current cloth recipe and keep leftovers. Finite stock gives three spare cups across three orders; rinsing discards dye and can leave too little to finish, producing a retry state. Best move records persist through restarts and three recipe-order palettes.

Original code and SVG pot artwork, with the established Study Desk save/navigation shell; no external assets or third-party collection. Unlike Stencil Studio's overlay placement, the core is conservation and fractional fluid transfer. One candidate is counted, not its three palettes.

[Implementation](https://github.com/ThatOneMop/study-desk/commit/c1a97e7f0636cd152137f409c9f83962a2a42f04) · [Rendered-review wording correction](https://github.com/ThatOneMop/study-desk/commit/102bfef4ac91df144062aae51fd91e0522f67d23).

## Evidence
CI41812161353 at102bfef4ac91df144062aae51fd91e0522f67d23 passed four engine checks and six rendered three-cloth palettes at desktop1280×1000/touch-emulated390×844. Measured mixture transfers, exact per-action reload, records/restart, waste/loss/retry, rinse confirmation, Space/Escape, pause, corrupt/quota storage, Games navigation and no overflow/page errors pass. Repository74 routes/286 asset references, syntax/Freedoom and nine selected first-batch integrity checks pass. Final artifact13311479868 SHA256603fd96a67fdeaaa5ac5940fc1f1e1ac28719df65e59df267869145fb1f94410 verified; touch-mix-1.png inspected. Earlier passing CI41811914375 artifact13312702486 SHA25683177c1fb5b1d2a31dc94dc7e1002fd335ee893f434fcf3f41c87d83f488bbcc verified; desktop-mix-0.png and touch-mix-1.png inspected; save-status wording corrected afterward.
[Final passing run](https://github.com/ThatOneMop/study-desk/actions/runs/41812161353).

Inspected screenshots show pot capacity, mixture proportions, selection outline and comfortable button sizes. The save confirmation initially retained the shell's colony wording; corrected to Dyehouse. This wording fix is not counted as the substantive improvement.

## Required next pass
All baseline orders use simple equal-part mixes and can be filled without transfers. The test routes deliberately exercise transfers, but that does not make them necessary gameplay decisions. Add useful leftover-reuse orders, fractional blends or vessel constraints that require planning. Do not pad with reordered recipes. Compact the phone instruction flow and improve target/current mixture feedback while preserving saves. Then render and inspect the improved core loop.

Full keyboard routes, actual bridge/Collection lifecycle and stronger mass-conservation/save-state consistency still require qualification. Automated routes and screenshots are not human enjoyment, physical-device testing or measured long-duration content.

## Preservation and counts
Fresh main remains 16b3b1658812a90c885fab83d3af419557d8b59b; preserve concurrent Numberworks, Packworks and Gummy Bay work. No launcher/catalogue/main files were changed. No Switch workspace control was added; Games navigation passes. The unchanged publication audit was not repeated or reported as new work. No public Dyehouse URL is claimed.

Batch3: **43/50 built,42/50 improved,42/50 fully browser-qualified,0 active integrated/live;7 unbuilt**. All50 slots remain. Historical releases remain separate. Batch2's additional round remains20/20 complete. Recursive development tree has no AGENTS.md or first-batch FINAL_REPORT.md; historical20 finished/nine selected baseline retained without reconstructing missing files.

Overall work remains incomplete. No automation changes.
