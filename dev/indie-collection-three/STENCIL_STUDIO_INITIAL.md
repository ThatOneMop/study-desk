# Stencil Studio — initial implementation

25 October 2026. Slot 41; source commit `035611d0c1a147dc63a09484abfc30ed8bee29c0`. Third-batch development only. Not added to the catalogue.

## Playable rules

Choose a corner, ribbon or window stencil. Rotate and position it on a five-by-five printing bed, then apply sea, rose or sun ink. Overlaps combine colour bits; printed ink cannot be erased except through undo. Match all coloured and blank squares within five impressions. Three authored commissions each have a legal three-impression solution, sequential unlocks and saved fewest-impression records. A colour-isolation view helps read individual target layers. No timer, external assets, runtime dependencies or compile step.

This is a spatial colour-composition puzzle. It does not reuse earlier fishing, colony, route-building, weaving or craft engine code. Original HTML/CSS graphics use a paper/teal print-shop theme. The three compact commissions are an initial scope, not substantial hours of content.

Arrow keys or touch buttons move the stencil; tapping a bed square places its normalized top-left corner. R rotates, Space prints and Z undoes. Invalid off-sheet placement and no-op reprints do not consume impressions. Modal restart/commission changes preserve finished records; reset/recovery affect only `study-desk-stencil-studio-v1`. Corrupt saves remain untouched until explicit recovery.

## Verification

Six engine tests pass: all commission wins and sequential unlocks, exact journal roundtrips, layered colour composition, rotation and bounds, five-print loss/undo/retry, no-op stamps, records and malformed saves.

Three DOM tests pass: all commissions completed through actual event handlers with mid-print reloads; keyboard, pause, confirmation cancellation, isolated reset/recovery; selected-ink view and Games link. DOM checks are not rendered browser or touch-device evidence.

Syntax, asset references and nine selected first-batch source-hash checks pass. The new third-batch gate verifies exactly fifty slots, separate totals and exclusion of unfinished games from the catalogue. Prior preview browser-policy denial remains recorded; no alternate browser surface, workaround, new screenshot or rendered-test claim in this increment. Source commit skips CI. Source-only work can continue independently.

## Counts and preservation

Third batch: **1 implemented prototype / 0 improved / 0 browser-tested / 0 integrated / 0 live**. The remaining 49 slots are unassigned and count as zero.

Second batch at `f71768f6cd4a25f02ba33ca55d8e22bff1b9439f`: twenty initially implemented/improved/browser-tested; six additional upgrades verified; Windup kits pending rendered review. No second-batch files changed here. First-batch baseline remains twenty finished, nine selected, zero verified live URLs.

Main observed at `432a0d75bd44e3c43975b8d11ae683fa0d7e2325`, untouched. Existing workspace-control/publication audit remains applicable; no unchanged publishing retry reported as new work. This branch also retains its existing concurrent catalogue content unchanged.

## Required next work

Play the actual rendered loop before assessing quality. Inspect desktop and phone layouts, colour contrast and stencil targeting; test natural failure, undo/retry, all progression, save/reload, reset and navigation. Identify and implement a substantive improvement from those findings, especially whether three fixed commissions give enough useful choices. Do not mark improved/browser-tested or integrate until this evidence exists. Continue all fourteen outstanding second-batch upgrades and the remaining third-batch games.
