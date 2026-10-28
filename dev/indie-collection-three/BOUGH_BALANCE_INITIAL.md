# Bough Balance — initial implementation

2026-10-28. Slot 64. Implementation [2f1e5af3e846ded34f0a862bf17730515451e970](https://github.com/ThatOneMop/study-desk/commit/2f1e5af3e846ded34f0a862bf17730515451e970).

## Built

An original static mobile-assembly puzzle, distinct from Counterweight's dynamic crane/swing/ballast loop. Weighted paper birds occupy fixed hooks on nested beams. Each beam must independently have zero torque; all hooks must be filled. Each child loads its parent with its full frame-and-descendant mass. Three mobiles introduce one beam, two child beams and a three-tier canopy. Tested solutions use 4/6/6 placements, matching the lower bound of one initial placement per ornament.

Choose a bird and hook, preview all resulting beam imbalances, then hang/swap. Moving an existing bird swaps occupants; placing from the tray displaces the occupant to the tray. Return-to-tray and undo support experimentation. No clock or artificial failure condition. Records and sequential progression save under a unique validated v1 journal. The 200-action journal bound is storage protection, not a content target. Original SVG bird art, readable labels, responsive button layout, native keyboard controls and isolated confirmation/recovery handling are implemented. Diagram beams stay level for readability; meters report imbalance, so no physical animation is implied.

## Tests

16 passed: 8 engine, 8 jsdom 26.1.0. Three complete routes through handlers with reload after each placement; unlocks and records; exact mass/torque propagation; swaps/displacement/removal; free immutable previews; unique identity and total-mass conservation through assignment depth three; malformed actions/saves; terminal protection; bounded-journal undo/retry; native/composition shortcuts; real bridge P reservation; independently guarded parent/document visibility; hidden reset/recovery; corrupt-save preservation and storage-write errors. No loss-state test is applicable: this is a relaxed puzzle with reversible experimentation.

Run: NODE_PATH=/tmp/bough-test/node_modules node --test tests/bough-balance-engine.cjs tests/bough-balance-dom.cjs

Both production scripts parse. Local assets exist; root navigation exists in the repository tree. Bridge loads first. IDs and diagram description checked; no Switch workspace controls added. No root build is required by the existing static conventions; this partial recovery does not establish a full-repository regression result.

First-batch FINAL_REPORT, latest branch heads and third ledger/tree were reread before work; no AGENTS.md in current tree. Main and second branch remain untouched. Existing publishing/preview failures were not retried or bypassed. Actual browser rendering remains blocked: no screenshots inspected, desktop/touch/native dialog operation verified, human enjoyment measured, or live route claimed.

## Counts and remaining assessment

Exactly 50 third slots retained: **24 built / 0 qualified improved / 0 browser-tested / 0 integrated / 0 live**; 26 slots remain unassigned. Second additional round stays **6/20 verified, 14 pending**. First-batch sources, saves, entries and tests preserved.

This is initial source, not a playtest-led improvement. Render all three mobiles, inspect their diagrams at phone size, verify actual navigation and inputs, and assess whether exact arithmetic forecasts and the small fixed slate create enough interesting choices. Implement a substantive upgrade based on those observations before qualification/selection. Keep Bough Balance unlisted meanwhile. No duration claim.
