# Foldlight initial implementation — 28 October 2026

Implementation: [f4672b82254e5e063573bf7cfa317f879d6b333a](https://github.com/ThatOneMop/study-desk/commit/f4672b82254e5e063573bf7cfa317f879d6b333a).

## Built
Third-batch slot 61 is a layered paper-folding puzzle. Reflect a chosen side of a six-by-six printed sheet across a crease. Each moving stack reverses order and flips every face, landing above stationary paper. Match occupied panes, top colours and layer counts exactly. The sequence of folds matters; all 36 paper pieces remain conserved.

Three authored two-sided prints and silhouettes have example routes of 3/4/5 folds within 5/6/7 allowances. These are compact puzzles, not optimality or content-hours claims. Implemented: free exact previews, layer inspection, crease markers, native side/crease controls, undo after wins/losses, confirmed retry/reset, sequential unlocks, fewest-fold records and isolated replay saves. Original CSS graphics use colour letters as well as colour; mobile stacks the two grids vertically.

This is a reflection/stack-order loop, distinct from existing printing, stitching, bead sliding, sowing and resource mechanics. It is not a renamed or reskinned candidate.

## Evidence
14 passing tests (seven engine and seven jsdom 26.1.0):
- Every authored route through actual DOM controls, with save/reload after each fold and progression through all patterns.
- Reflection coordinates, moving-stack reversal, face changes and placement above stationary layers.
- Conservation of all 36 unique paper identities through every legal depth-two sequence.
- Invalid, empty-side and out-of-frame rejection; independent target position/colour/height checks.
- Allowance loss/reload/undo/retry, win undo, records and unlocked navigation.
- Free previews/inspection, committed result versus preview, native keyboard ownership, focus retention, pause/modal/trusted-parent guards.
- Malformed saves, confirmed recovery/reset, other-key isolation and temporary play after quota failure.

Both scripts parse; new asset references, unique HTML IDs, bridge-first loading and absence of Switch workspace controls pass. Games navigation retains the root catalogue URL. No full repository build claimed.

No rendered browser play, inspected screenshots, native touch/dialog/focus verification or human enjoyment evidence. No completed improvement pass. Evaluate crease readability, layer-order reasoning and onboarding in actual rendered play; make a substantive observed improvement before qualification. No catalogue entry was added.

## Preservation
First-batch FINAL_REPORT.md reread: 20 finished, nine historically selected in source, zero verified live. Third began at ec3a4bad2cd3dc9cf69f8954e623b084eef4d7f4 and contains no AGENTS.md. Current ledger and existing static game/save conventions were inspected.

Main remains 55c330d9ec493afc40e81e89a371f64cbd5bd8b0, unchanged from the previous shell audit. Second remains 3949e3d9f8e2e9846dc4c91c436d90b19bbbd341. Only new Foldlight source/tests and third-batch documentation are written. Earlier sources, saves, catalogue navigation and concurrent Gummy Bay work remain untouched. Previously recorded rendering/security and publication barriers were not retried or bypassed; no live release claimed.

## Counts and next steps
Third: **21/50 built; 0 qualified improved; 0 browser-tested; 0 integrated; 0 live**. Exactly 50 ledger slots remain, with 29 unassigned. Second additional round: **6/20 verified, 14 pending**; all additional source upgrades already implemented.

Next: rendered play and screenshot inspection, substantive observed improvement and follow-up verification; continue the remaining distinct candidates independently. Foldlight stays unlisted.
