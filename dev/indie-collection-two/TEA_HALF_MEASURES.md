# Tea for Ghosts — half-measures and refinement

25 October 2026. Source: a66b0a0cc55289c94fe7d845401d11d2065b1aae. Second collection slot 33. Additional round remains **6/20 verified**.

## Source finding and implementation

The current source limited ingredients to whole scoops and discarded a tasted recipe when choosing “Adjust another cup”. These are source/DOM findings, not new rendered-play observations.

The half-measure spoon costs two earned memory seals, competing with the strainer and recipe cards. It permits half scoops in the existing three-scoop pot. Smaller portions permit different ingredient ratios without extra visitors, timers or capacity. Scoop size persists across reload. Whole-mode subtraction safely lifts a remaining half scoop, and addition cannot overfill the pot.

A separate “Refine this blend” action carries the tasted ingredients and extraction settings into the next preparation. It keeps the spent attempt count, does not award seals or refund cups, and cannot exceed the three-cup visit. “Start a fresh blend” retains the former empty-pot behavior. Undo works after refinement. The help text explains both choices.

## Verification and save compatibility

24 engine tests plus 15 jsdom tests pass. Coverage includes all six original 100-point recipes; earned spoon/competing purchases; fractional ratios, ingredient locks and capacity; forecast-to-served flavour equality; refinement, undo and exhausted attempts; old save migration and unchanged records; fractional save authorization; DOM purchase/measure/refinement/reload; loss/retry/reset, corrupt-save recovery, storage failure, focus and bridge-pause checks.

Save key and version remain unchanged. Legacy saves default to whole scoops, keeping records and recipe state. Fractional recipes without a purchased spoon are rejected. Historical browser evidence in the candidate ledger refers to its initial version, not this upgrade. Scripts pass Node syntax checks. The whole repository build/preservation suite was not rerun from the partial checkout.

No actual browser play, inspected screenshots, touch ergonomics or enjoyment evidence was produced. Existing browser-policy restrictions were not bypassed. Complete rendered review and game-specific iteration before crediting this pass or integrating it. Six fixed visitor preferences remain a depth limitation.

Only Tea for Ghosts source/tests and second-batch records changed. Main, all other games, third-batch source and catalogue entries are untouched. The previous workspace audit/publication blocker was not retried. First collection baseline remains 20 finished/nine historically selected/zero verified live. Second collection has 20 initial builds and improvements, with 6/20 additional upgrades verified. Third remains 6/50 built and zero improved/browser-tested/integrated/live. No new public release.
