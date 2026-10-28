# Three-game visibility and confirmation repair

2026-10-28. Implementation [12af5c7665e55c69a9b2e712581e9b11b43d0f1e](https://github.com/ThatOneMop/study-desk/commit/12af5c7665e55c69a9b2e712581e9b11b43d0f1e). Scope: Foldlight, Seedwake, Thimble Fair only.

## Reproduced failures

A reset confirmation could be opened during play, followed by a trusted parent hide and an activation of Confirm. The handler still reset the game while hidden. The same path overwrote preserved unreadable save bytes during recovery. A hidden game's Resume handler could also clear its pause and allow click-driven gameplay. Keyboard handlers lacked composition/editable-text guards. These were reproduced through DOM event simulations; no claim of observed native-browser event ordering is made.

A new shared regression suite loads each game's actual bridge and shell, with a simulated parent and dialog stubs. Before repair: 3/15 passed, 12/15 failed (four failures in each game). Cases verify pending reset, corrupt-data recovery, independent parent/document hiding, explicit resume, forged messages, native composition and editable text.

## Repair

Each shell tracks parent-hidden state separately from document.hidden. Either blocks gameplay and Resume. Returning visibility never automatically clears pause. Confirm is disabled and handler-guarded while hidden or paused; Cancel remains available, after which the player can resume and reopen the requested confirmation. Parent visibility messages require the correct source/origin and a boolean visible field. Keyboard shortcuts ignore composition and editable content.

No engine, journal format, save key, game mechanic, shared bridge, first/second game source or main catalogue changed. Existing DOM fixtures now explicitly model a visible document using jsdom's pretendToBeVisual option; hidden transitions are separately exercised. This option does not render the page.

## Verification

104 tests pass: 89 existing engine/DOM tests across the three games plus 15 new visibility tests. Retained complete campaigns, win/loss/retry, optional mechanics, reload, records, corruption and quota tests all pass. Production scripts parse. Source scans of the three game.js/index.html pairs found no Switch workspace controls. Main/second heads and earlier audit evidence are unchanged; no repeat publishing investigation was counted as work.

Run: NODE_PATH=/tmp/shell-guards/node_modules node --test tests/collection-three-visibility.cjs tests/foldlight-engine.cjs tests/foldlight-dom.cjs tests/seedwake-engine.cjs tests/seedwake-dom.cjs tests/thimble-fair-engine.cjs tests/thimble-fair-dom.cjs

The first-batch FINAL_REPORT and current third ledger/tree were reread; no AGENTS.md was present. Static project conventions remain unchanged. Partial local recovery: no full-repository build or regression claim. Rendered browser access remains policy-blocked and was not retried or bypassed. No screenshot inspection, real touch/navigation/native-dialog verification, qualified gameplay improvement or live release is claimed. Native visibility/dialog transitions still need supported rendered verification before catalogue selection.

Counts stay third **23/50 built; 0 qualified improved/browser-tested/integrated/live**. Exactly 50 slots retained. Second additional round remains **6/20 verified, 14 pending**. These reliability fixes do not count as the requested substantive rendered improvement passes.
