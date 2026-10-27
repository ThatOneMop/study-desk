# Rill & Root low weir — 27 October 2026

Source: `c6a8e38d7b7e6550e765a3b71e8002693d7f8cd3` on `indie-collection-three-dev`.

## Implemented change
Previously every flow change required moving soil. A single portable low weir now blocks a ground-to-ground edge whose heights differ by at most one. Water searches for the next lowest unblocked descent. Relocation removes the previous barrier; removal is explicit. Each costs one journal action, without moving soil. Invalid anchors, steep gaps, duplicate placements and malformed inputs are rejected without cost.

Later cutting/filling can make the gap too large, overtopping the barrier. Restoring a shallow gap reactivates it. The UI marks both edges and explains the state in text, offers a direction selector from the selected tile and previews resulting root-bed shares before committing. The restriction keeps deep hollow repair dependent on soil shaping.

Example routes using the weir finish in 4/3/7 actions; original soil-only routes remain valid at 2/4/8. These are demonstrations rather than optimality claims. No new game or level counted.

## Evidence
21 passing tests: 12 engine, nine jsdom 26.1.0; all prior 13 retained. Tests cover redirected splits, one-barrier relocation/removal, no soil mutation, overtopping/undo, invalid actions and saves, all garden routes with exact reload, legacy board/save shapes, conservation, preview versus commit, edge marks, pause and selector key ownership, completion/retry/records/reset. Both scripts pass syntax checks.

The v1 key and legacy journals are unchanged. New exact entries are `{gate:[p,q]}` and `{gate:null}`; the derived gate field appears only after using the tool. Records count all actions. No actual rendered browser, native keyboard/touch, inspected screenshots, full repository build or enjoyment claim.

## Preservation and remaining work
Parent `2d0969a1220a3a05b67f04dfbb42b6e07b463315`; no AGENTS.md in the current tree. Main `d9e77a6bcbb7a8c4b43e976618efbecd2ff38527` is unchanged from the preceding audit. The previous scoped changes were Gummy Bay/credits; no launcher/workspace control work was needed. Shared catalogue and navigation remain untouched.

First collection baseline remains 20 finished/improved, nine source-selected, zero verified live. Second additional round remains six verified and fourteen awaiting rendered verification; all twenty additional source upgrades already exist. Third ledger retains fifty slots, eighteen built prototypes, zero qualified improvements/browser-tested/integrated/live, thirty-two unassigned.

The existing rendering security-policy rejection and publication barrier were not retried or bypassed. This source commit is not a release. Keep the candidate unlisted and the overall task active.

Next: naturally play and inspect desktop/touch screenshots, assess the direction-selector flow and whether the low weir creates worthwhile choices, then make the required substantive improvement based on observed play before catalogue selection.
