# Bramble Dice planning improvement — 31 October 2026

Implementation: `886dd5cb2b354c5bd2e942bcc09c87b5e51789eb` on `indie-collection-three-dev`. Candidate46 remains unlisted. Counts remain24 built /5 fully improved /5 browser-tested /5 integrated /5 live across exactly50 third-batch slots. The second batch remains20 built,20 additional improvements complete,9 selected/live.

## Observed weakness and upgrade

In the rendered baseline, choosing between attacking now and reserving a six erased the previous forecast. The following enemy move was hidden, despite reserve being a forward-planning mechanic. The new comparison board bookmarks a complete allocation, shows player/creature health and reserved dice alongside a trial, and swaps allocations without spending a roll or turn. The following enemy intent is exposed conditionally on the creature surviving. This supports informed choices across the three authored encounters; no extra encounter or hours-of-content claim.

Comparisons are temporary and clear after dice changes, committed turns, restart or reload. Current allocations still save in the original v1 format. A source review also found that pause could resume a hidden game and a pending reset could execute while hidden; hidden-page/shell and confirmation guards now prevent those actions.

## Evidence

- Baseline: turned die2 from1 to6; chose guard/ reserve/ attack/ guard; resolved the zero-damage safe turn and observed six carried to Shell charge.
- Improved turn2: trial reserve cost7 health for2 additional creature damage; comparison showed11 player/16 creature versus18/18. Swapped to the safer plan and resolved it.
- Naturally completed seed1 in10 turns at18 health: reserve carried through first clearing; chose Acorn Sling and Three-leaf Clasp; used exact forecast, mixed jobs and deterministic flips through the snail and owl. No browser state injection or solver-driven browser loop.
- Reload retained victory and best10. Confirmed retry restored seed1/start while retaining best10; focused-card keyboard assignments and Enter-to-compare worked.
- Inspected rendered desktop comparison and victory screenshots. The comparison panels were readable, showed the tradeoff accurately and cleared after resolving/flipping. This is functional/visual evidence, not human-enjoyment evidence.
-32 focused tests pass:15 engine and17 DOM, retaining prior27. Coverage includes five equipment routes across25 seeds, original-save fixtures, win/loss/retry, reserve transfer, flip budgets, exact setup, comparison swap/invalidation, partial trial restore, blocked storage and hidden confirmations. Both scripts pass syntax checks.

## Remaining qualification

Mobile/touch rendered gameplay and layout; rendered loss; shell/navigation regression; full repository/catalogue checks and final selection. No full-build or live Bramble Dice claim from this partial checkout. Main was re-read at `4689624c1cc3df8f3cd9a820fab6d6817cf79d3b` and not edited. Existing live navigation/publishing evidence remains in CRATE_CUSHION_INTEGRATION.md; no unchanged publishing failure was retried. No automation changes.
