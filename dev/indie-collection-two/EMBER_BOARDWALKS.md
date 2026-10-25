# Ember Parcel boardwalks — source checkpoint

25 October 2026. Source commit `736f0982041f909c218328e06edcf2b1bda7865d`. Candidate 38; not a verified additional pass. The additional-round total remains 6/20.

## Source hypothesis and design

Packed timber previously only funded stoking. This source-based hypothesis is not a new rendered observation: allowing construction can make timber allocation and route planning more useful. Boardwalk mode now costs one packed bundle and one warmth to cover an adjacent water or garden tile without moving. It changes the tile into a persistent crossing for the current attempt: one warmth per step, no garden damage from steps or adjacent flares. The player gives up the bundle's four-warmth stoke option. It cannot cover walls, timber, ice, a hearth, ordinary ground or an existing boardwalk. Undo restores terrain/resources; retry restores the original map and retains records.

V toggles the new mode. Melt, pack and boardwalk modes are mutually exclusive, including pointer controls, keyboard shortcuts, reset and route changes. The existing direction buttons and adjacent map taps apply the selected action. The boardwalk uses original CSS/symbol art and an accessible map label. No timers, extra repetitive levels or new asset dependencies were added.

## Checks and limitations

17 engine and 9 jsdom checks pass, plus JavaScript syntax. All four original journeys remain valid. Four separate new routes gather their own supplies, construct and cross a boardwalk, then complete delivery with zero gardens burned. Per-action save roundtrips, exact costs, invalid/repeated construction, bundle exhaustion, zero-warmth loss/recovery, flare protection, undo, retry and records are covered. The original storage key and save version remain unchanged; old journals use their original rules. New boardwalk actions validate directions and replay legality.

DOM checks complete all four new routes and cover V, mode exclusivity, construction reload, pause, retry cancel/confirm, navigation markup and existing save recovery/scoped reset. Events and dialogs are simulated; this is not actual touch or browser rendering. Automated reachability is not human enjoyment evidence. No full-repository checks ran from the partial checkout.

The previously recorded preview security-policy block remains. No alternate browser surface or CI rendering was used to work around it. Supported rendered before/after play, screenshot inspection, phone readability/controls and gameplay-led iteration remain required before additional-pass credit. Four short fixed journeys remain a depth limitation.

## Preservation and next steps

Only Ember Parcel source/tests and second-batch records changed. Main remained at `85d941d59e8897585606e5a67f4413a710643067`; third-batch branch remained `ab12bd0d63f2a4cdc4579be3f811a6f4693c1161` with six built prototypes and zero improved/browser-tested/integrated/live. First-batch, Gummy Bay and requested-game work remain untouched. No public catalogue integration or live release is claimed. The existing Switch workspace/publication audit remains applicable; no unchanged publishing retry.

Next: perform supported rendered review and iterate on the construction/fuel choice, then verify progression/loss/retry, saves, restart/navigation and screenshots. Continue remaining development without counting pending source work as verified.
