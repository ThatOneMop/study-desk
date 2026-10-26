# Kiln Chorus — heat baffle refinement

2026-10-26 · Implementation: `f1601ef4e23d35349772a7bb78d8628fb2184d61`.

## Weakness and change

Source inspection, not rendered play, found that every intervention affected all remaining clay together. The compact fixed campaigns offered limited ways to decouple fast and slow pieces. The one-use baffle holds a selected piece at its current warmth for one action; all others update normally. Its glaze still accumulates if already in band. This can protect fast clay during a Stoke, or preserve warmth while another piece is drawn. Removed pieces and the piece currently being drawn cannot be targeted.

Protection is an optional read-only selection with explicit target text and full-kiln forecast. It is consumed only when a valid action commits. Cancellation does not spend it; undo restores it; retry replenishes it. The exact new journal entry is {action, shield}; old string journals/save shapes and best records remain unchanged. The narrow-load test route now draws the fern bowl before the ivory vase and completes in 11 actions instead of the initial 13-action demonstrated route. This is a concrete alternative schedule, not a claim of global optimality or human enjoyment.

## Evidence

18 passing tests: 10 engine and 8 jsdom 26.1.0, retaining all 13 original checks. New checks verify continued glazing under thermal isolation, prevention of a fast-clay overheat, all three assisted campaigns with exact per-action reloads, strict one-use/target validation, forecast selection/cancellation, pause, undo, spent-state display and narrow-load UI completion/retry. Assisted routes take 7/9/11 actions with 3/4/3 fuel remaining. Legacy exhaustive state counts/fuel maxima apply only to routes without the baffle. Both scripts pass syntax checks.

No rendered session, screenshot inspection, native touch/layout assessment or full repository build. The known browser security-policy rejection was not bypassed. This source-led refinement does not earn improved or browser-tested credit. Next: naturally play the kiln on desktop/touch, inspect targeting/readability and assess whether the baffle creates worthwhile replay choices; make a substantive playtest-led upgrade before selection.

## Preservation

Starting third head: `9ffd710b1f4b892adebe72abeb82258533e611d8`; main observed: `fd970c88537da9f93601a443fde1c77f984be604`; second head: `3949e3d9f8e2e9846dc4c91c436d90b19bbbd341`. First final report remains 20 finished/improved, 9 selected source, 0 verified live. Second additional round remains 6 rendered-verified and 14 pending. Third ledger retains exactly 50 slots and counts 14 built, 0 improved/browser-tested/integrated/live.

Main advanced with concurrent Gummy Bay, catalogue, shared game feel and individual-game changes. Latest index.html/app.js contain no Switch workspace matches; added diff lines likewise contain none. Read current docs/GAME_QUALITY.md; its catalogue review is not evidence of testing this unlisted prototype. No shared/public files are changed or overwritten. Prior publishing evidence remains recorded; no unchanged configuration retry or new live-release claim. No fresh rendered navigation claim.
