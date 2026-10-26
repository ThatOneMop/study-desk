# Ribbon Reef — initial implementation

Date: 27 October 2026. Slot **56**, third-batch game **16/50**.

Source commit: [`d2ad53aa94c282774ef03cb6fdc01eb448b1cf02`](https://github.com/ThatOneMop/study-desk/commit/d2ad53aa94c282774ef03cb6fdc01eb448b1cf02). Development branch: `indie-collection-three-dev`. No catalogue entries or main files changed.

## Implemented

An original geometric net-drawing loop: choose fish groups from a finite shoal, trace a simple closed net around the exact requested species, keep coral and rays outside, then commit the haul. Three compact authored reefs introduce mixed pairs, same-species catches with concave coral avoidance, and pearl fish. Wrong catches release everything and fray the spool; invalid geometry is free to correct. Undo and retry prevent dead ends. Completed trips unlock the next reef and preserve minimum total rope use, including failed hauls.

Original SVG fish distinguish species by stripe, spot and rings, with diamond-shaped rays and coral safety circles. Pointer input maps through a 600×400 view box; keyboard arrows/Shift/Space/Enter/Escape support tracing. The opening gate, optional guide, pause, gesture cancellation, confirm-before-reset and Games navigation are implemented. Drawings are read-only until hauled and are discarded on pause, modal opening or reload. The journal-based isolated v1 save rejects invalid replays and preserves unreadable bytes until explicit recovery.

## Evidence

- **17 tests pass: 9 engine and 8 jsdom 26.1.0.** Complete three-reef campaigns replay and reload after every haul, scoring **1430 / 2108 / 1600** rope with the committed fixtures. These are feasible hand-authored routes, not proven minimums or human enjoyment evidence.
- Geometry tests cover direction reversal, collinear subdivision, concavity, coral exclusion, self-crossing/touching/backtracking, bounds, rope budgets, fish clearance, rays, species mismatches, loss and undo/retry. A two-mistake/five-haul trip correctly includes wasted rope in its 1750 record.
- DOM input tests cover keyboard drawing, native-control shortcut ownership, extra pointer IDs, cancellation, simulated 300×200 bounds, previews without saving, pause/dialog/trusted parent hiding, reef selection, scoped reset and corrupt/quota saves. These are simulated events, **not native touch or layout verification**.
- Syntax checks pass for both scripts. All **34 IDs** are unique and **44 CSS rules** parse. New references resolve to the original files and existing `bridge.js`. No runtime/build dependencies; jsdom was installed outside the repository for tests.
- Two initial test assumptions were corrected: a purported coral-only rectangle also touched a fish, and JSON serialization turns NaN into a valid null record. Rules were not weakened to satisfy those assumptions.

## Repository and prior obligations

Read the first-batch final report: 20 finished/improved, nine selected in source, zero verified live. Second additional round remains **6/20 rendered verified**, fourteen source upgrades pending. The separate third ledger retains exactly fifty slots: **16 built; 0 improved; 0 browser-tested; 0 integrated; 0 live**.

Development baseline `1f63c166f4a24c91ceee8cd1eaa3367d5e4d8c44`; main observed `48184d01c5f0e9e1313fa58cdac2e17c114404f0`. No AGENTS.md found in the development tree. Read current README and GAME_QUALITY conventions. Main’s delta from `83fde46e12260e3a81785cee84fa75808399ff86` includes concurrent Gummy Bay, Tidepost, launcher-adjacent quality and game changes; preserve them. The delta adds no Switch workspace control, and this game introduces none. Earlier navigation/deployment audit stands; no unchanged publication retry or new desktop/mobile rendering claim.

## Qualification still pending

The existing rendering security-policy blocker remains; no alternate browser/CI bypass attempted. There is no rendered screenshot review, full repository build, catalogue integration or live release in this increment. Only a partial local checkout was available.

Before improvement credit: naturally play the actual rendered game and inspect desktop/mobile screenshots. Evaluate available finger-drawing room, exact-catch preview usefulness, concave rope clarity, visual feedback and challenge ordering (the third reef may be easier than the second). The content is three small authored reefs; there is no measured content-duration claim. Refine based on those observations, repeat actual navigation/progression/save/loss/retry checks, and then compare against the rest of the slate. Do not add this prototype to the public catalogue yet.
