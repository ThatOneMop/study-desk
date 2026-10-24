# Stencil Studio — saved setup and print forecast

25 October 2026. Implementation `c7fdaa6bb22f71405466d434b797ec145885390b`. Development branch only.

## Findings and changes

Code/DOM review found that reload discarded the selected stencil, rotation, ink, origin and target-layer filter, even while the printed journal was saved. These settings now persist before a stamp is made. Old saves migrate to default workbench settings; deliberately off-paper draft positions remain valid drafts, with printing disabled until moved back.

A reproduced save-validation bug accepted `history: ["retry"]` and rewrote it to an empty history. The decoder now requires every journal entry to be a valid stamp. Malformed journals remain stored unchanged until the player explicitly confirms recovery. Bounds and types of saved setup fields are checked too.

The board now previews resulting mixed colours inside the stencil outline. A forecast reports excess-ink squares and remaining mismatches before committing a print, helping players judge overlaps. Preview does not alter the printed journal. The focused board cell survives redraws. Ink/stencil controls sit with the printing bed, but their rendered desktop/mobile layout has not been inspected.

## Evidence

- 9 engine tests passed: three original winning routes/unlocks, save roundtrips, old-save defaults, invalid drafts, strict journals, forecast/committed-board equality, overlaps, loss/undo/retry and no-op protection.
- 6 DOM tests passed: all commissions through handlers with reloads, preserved unprinted setup/filter, focus, previews, pause, cancellations, reset and recovery. These do not constitute rendered browser/touch evidence.
- Syntax, whitespace, asset references, selected first-batch integrity and fifty-slot publication gate passed.
- No new rendered playtest, screenshot, browser automation or deployment. The prior browser-policy blocker is unresolved and was not bypassed.

## Status

Third batch remains **1 implemented prototype; 0 completed improvement passes; 0 browser-tested; 0 integrated; 0 live**. This source refinement does not count as the required playtest-led improvement. Three small commissions remain a depth limitation. The second-batch branch is untouched: 20 initial games complete, 6/20 additional upgrades verified, Windup kits pending rendered review.

Main was observed at `85d941d59e8897585606e5a67f4413a710643067` and left untouched. Existing workspace-control/publication audit was not replayed as new progress. Existing save keys, first-batch source and other catalogue entries remain unchanged.

Next: complete permitted rendered review, assess whether forecast information makes the puzzle too easy or improves clarity, then implement the substantive improvement supported by that playtest. Verify phone controls, natural failure/retry, progress, saves/reload, reset and Games navigation before selection. Continue the outstanding second-batch obligations and remaining 49 third-batch games.
