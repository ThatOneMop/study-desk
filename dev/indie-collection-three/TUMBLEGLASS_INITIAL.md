# Tumbleglass initial prototype — 26 October 2026

Source implementation: `0c67d045d33c8170dd461e5b66a08d3507857ef8`, development branch `indie-collection-three-dev`.

Slot 50 adds simultaneous multi-bead sliding. Tilting moves edge-most beads first. Each bead locks when crossing its matching numbered socket, becoming an obstacle to the remaining beads. Other sockets remain traversable. The player plans settling order, undoes freely and replays for lower tilt records. Three authored trays progress from two beads to three, with original CSS glass art and number labels independent of colour.

An initial unsolvable draft was rejected by breadth-first state search before publication. Final shortest routes take 3/5/5 tilts. These are compact prototype puzzles, not finished depth or duration claims.

## Evidence

Seven tests pass (four engine, three jsdom 26.1.0), plus both script syntax checks. Exhaustive searches examine every reachable board (8/32/37 states), check collisions and locked-bead invariants, and establish shortest routes. Engine and UI campaigns verify unlocks and exact journal saves/reloads; undo preserves records. Tests also cover no-op rejection, invalid journals, moves after completion, keyboard/control focus guards, pause, parent hide, retry confirmation, reset isolation, corrupt-save recovery and storage failures.

Dialogs are simulated. No rendered play, screenshots, native keyboard activation, physical touch, mobile layout or human-enjoyment evidence is claimed. Full repository checks have not run from the partial checkout. Source tests do not satisfy the required playtest-led improvement pass.

## Preservation and next steps

Exactly 50 third-batch slots remain: **10 built, 0 improved/browser-tested/integrated/live**. Forty slots remain unbuilt. Second batch retains 20 additional source upgrades, 6 rendered-verified and 14 pending. First-batch report remains 20 finished, nine selected and zero verified live URLs.

Main remains `85d941d59e8897585606e5a67f4413a710643067`; second branch remains `3949e3d9f8e2e9846dc4c91c436d90b19bbbd341`. Existing navigation audit and publication/browser blockers were not retried or bypassed. Only new Tumbleglass source/tests and third-batch ledger/report change; existing games, saves, catalogue and concurrent work are preserved.

Next: rendered desktop/touch play and screenshot inspection; assess puzzle depth and settling-order clarity, implement a substantive playtest-led improvement, then verify retry/reload/restart/navigation before catalogue selection. Continue independent implementation while rendering remains blocked.
