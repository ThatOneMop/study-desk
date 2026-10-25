# Reedbreaker initial prototype — 26 October 2026

Source implementation: `cfd3d84885b77c5ea8968e8adf636d571dc64b3d` on `indie-collection-three-dev`.

Slot 48 is a new tactical movement/shoving game. Walking restores dash energy; dashing travels up to three squares, shoves a beetle one square and suppresses its response. Water removes beetles, whereas rocks/occupied spaces block pushes. Other beetles attack if adjacent or move toward the ranger according to visible numbered priorities. Full-turn previews expose shield and energy consequences. This loop is distinct from the existing third-batch stamping, dials, curling, sailing, packing, dice combat and stitching prototypes.

Three authored banks unlock sequentially. All have tested winning routes (8/5/6 turns, 6/5/5 shield). Records reward fewer turns; retries reset the bank without erasing records. No clock or arbitrary level-count claim. Original CSS art, keyboard/pointer controls, pause, same-origin bridge hide handling and confirmation dialogs are implemented. Unreadable saves are preserved until explicit recovery; quota failure leaves a playable session. Existing games and saves remain unchanged.

## Initial checks and correction

Five engine and four jsdom tests pass. They cover winning routes, exact forecasts/replay/reload, unlocks, energy, blocked movement, shoves into water/rock/occupied cells, retaliation, loss/retry, corrupt journals, campaign controls, navigation markup, keyboard and modal guards, isolated reset, storage recovery and parent messages.

The first DOM campaign check exposed a stale forecast when a direction retained focus across a mode change. Rendering now recalculates the focused direction's forecast. This was an initial-implementation fix, not a rendered-playtest improvement pass.

Both gameplay scripts pass syntax checks. jsdom 26.1.0 is external test tooling; no repository runtime package was added. Dialog methods are simulated. No actual rendered play, screenshots, desktop/mobile layout, touch/native keyboard activation or human enjoyment is claimed. Full repository checks were not run from the partial checkout.

## Counts and next work

Third batch: **8/50 built; 0 improved; 0 browser-tested; 0 integrated; 0 verified live**. The ledger remains exactly 50 slots. Second-batch additional round: **20 source upgrades implemented; 6 rendered-verified; 14 pending**. First-batch sources and selection are preserved.

Observed main: `85d941d59e8897585606e5a67f4413a710643067`. Observed second-batch branch: `3949e3d9f8e2e9846dc4c91c436d90b19bbbd341`. No public catalogue or shared navigation edits. Source integration into the development branch is not a live release.

Existing workspace-control/publication and preview-policy findings are unchanged; no repeated publishing attempt or rendering workaround was made. Next, play all banks naturally in a permitted rendered environment, inspect screenshots and mobile controls, assess dash/positioning depth and enemy clarity, then implement the required substantive playtest-led improvement before selection. Continue independent source implementation while this review remains blocked.
