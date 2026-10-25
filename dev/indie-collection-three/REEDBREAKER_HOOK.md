# Reedbreaker hook source refinement — 26 October 2026

Implementation: `8bca0da32edd592e13e4a498b2e33a9ab1594eda` on `indie-collection-three-dev`.

## Before / after

Source inspection identified a restricted tactical choice: the ranger could only walk or dash forward to push. The new reed hook draws an adjacent beetle out of a blocked approach. Select Hook (H), then the direction toward that beetle. The ranger retreats onto free land, pulling the beetle into the old ranger square for one energy. Water, rock, another beetle behind the ranger, no adjacent target or insufficient energy reject the move without spending a turn.

The hooked beetle skips its response, but other beetles still attack or advance. Spending one energy competes with retaining two for a dash. Full-turn previews include the retreat, energy and other responses. The old save key and journal schema remain; old walk/dash sequences behave identically.

## Evidence

15 tests pass: nine engine and six jsdom. Original winning routes retain 8/5/6 turns and 6/5/5 shield. New hook-assisted routes clear in 9/8/9 turns with 6/5/6 shield. The third route demonstrates a safety tradeoff: extra turns preserve an additional shield point. These are automated routes, not human enjoyment evidence.

Checks cover exact forecasts and reloads after every new route action, energy competition, water/rock/occupied/no-target rejection, hooked-beetle response suppression, other-beetle attacks, retry, original save compatibility, H-key/button wiring, modal/pause/bridge guards and storage failures. Dialog methods are simulated. Both scripts pass syntax checks. Full-repository checks are not claimed from the partial checkout.

## Status

This source upgrade was not prompted by rendered play and receives no completed improvement credit. Actual desktop/touch play, screenshot inspection, feedback and readability review remain pending under the already documented preview policy block. No alternative rendering workaround or unchanged publishing retry was attempted.

Third batch remains **8/50 built; 0 improved/browser-tested/integrated/live** with exactly 50 ledger slots. Second additional round remains **20 source upgrades, 6 rendered-verified, 14 pending**. No catalogue, shared launcher, first-batch source or existing save key changed.

Observed main: `85d941d59e8897585606e5a67f4413a710643067`; second branch: `3949e3d9f8e2e9846dc4c91c436d90b19bbbd341`. Next: rendered assessment of hook direction clarity, retreat feedback, depth and balance, followed by the required meaningful playtest-led improvement and selection gates. Continue distinct third-batch source implementation while rendered review remains blocked.
