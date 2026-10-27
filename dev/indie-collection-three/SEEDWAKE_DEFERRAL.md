# Seedwake optional bloom deferral — 27 October 2026

Implementation: [701f44d42eeba3cf4b7387c9f70cc39de920ce68](https://github.com/ThatOneMop/study-desk/commit/701f44d42eeba3cf4b7387c9f70cc39de920ce68).

## Before and after
Source review found that every exact landing consumed its seeds, even for an already-filled bouquet request. Players can now explicitly keep the landing seeds instead of taking its flower. The pile remains available for later sowing; the move still spends a handful and any selected reverse gust. This can combine with leaving one seed in the origin. It is available on any exact landing, not only excess flowers.

A native checkbox is enabled only when the normal preview would bloom. Forecasts show retained seed counts and no flower award. The choice clears after a move or a bed/direction/reserve change. Save replay accepts only defer:true on an actual exact landing. Existing journals retain automatic blooms, their shape and results. Undo restores the prior choice's outcome. No existing save key changes.

## Verification
34 tests passed (20 engine, 14 jsdom 26.1.0), including all previous 27. Original and reserve campaigns remain valid. New 5/7/8-handful routes include deferred blooms and use DOM controls with save/reload after every action; these are coverage routes, not claims of optimality or faster play.

Checks cover retained seeds and no flower, normal move/gust costs, reserve combination, reuse of a retained pile, strict eligibility/types, last-turn loss when a needed flower is declined, undo/replay, exact previews, checkbox guards, plan-change clearing, keyboard ownership and pause/modal handling. Existing loss/retry/reset/navigation/corruption/quota tests pass. Scripts parse, local asset references and IDs pass, bridge loads first, and the shell has no Switch workspace control.

No rendered browser play, screenshot inspection, native touch/dialog/focus verification, human enjoyment evidence or full repository build claim. This source-informed mechanic is not counted as a qualified improvement. Its balance and extra control complexity need rendered assessment.

## Preservation and next work
First-batch final report was reread: 20 finished, nine historically source-selected, zero verified live. Third branch began at 7173d4d7550de28877460969a496c03cf67e0138 and contains no AGENTS.md. Seedwake engine, README/save rules and current ledger were inspected before editing.

Main and second branches are unchanged from the previous audit: main 55c330d9ec493afc40e81e89a371f64cbd5bd8b0; second 3949e3d9f8e2e9846dc4c91c436d90b19bbbd341. Existing launcher/navigation, earlier collections, saves and concurrent Gummy Bay work remain untouched. Previously recorded rendering security-policy and publication barriers were not retried or bypassed. No live-release claim.

Third remains **20/50 built; 0 qualified improved; 0 browser-tested; 0 integrated; 0 live**. Second additional round remains **6/20 verified, 14 pending**. Keep Seedwake unlisted. Next: natural rendered play, inspected desktop/mobile screenshots and substantive observed improvement before selection; continue the other 30 distinct candidates independently.
