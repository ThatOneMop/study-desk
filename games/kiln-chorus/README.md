# Kiln Chorus

Third collection slot 54. Original turn-based thermal scheduling prototype. A shared kiln warms several clay pieces at different rates. Stoke spends fuel to raise chamber heat, Bank and Vent lower it, and Draw removes a mature piece before the remaining clay updates. Glaze marks accumulate only within each piece's firing band; exceeding its upper limit spoils the load. Drawing also cools the chamber by one, so removal order affects everything still inside. It is an abstract firing puzzle, distinct from Little Foundry's mould/pour work and Kiln Kind's restoration loop.

Three authored loads introduce a fast cup beside a slow bowl, then three different responses, then narrow firing bands. Demonstrated fuel-efficient routes take 7/9/13 actions and leave 3/4/3 fuel. An exhaustive finite-state exploration confirms those fuel ceilings without using the baffle. These are small authored challenges, not hours-of-content claims. Replay pursues better fuel use; later loads unlock after success. Unlimited undo/retry encourage experimentation. Overheating and cold, fuel-depleted unfinished clay are explicit recoverable losses.

Original SVG pottery and a warm studio palette; patterned firing bands, numeric warmth, lettered piece names and glaze marks do not depend on colour alone. Select an action, inspect the read-only full-kiln forecast, then perform it. Native buttons support pointer/touch and keyboard. Page shortcuts 1/2/3 and A/B/C select actions, Enter commits; form/button focus retains native keys. Pause, dialogs and trusted parent hiding block changes. A notebook records recent actions and a chamber-heat trace. Nothing runs on a timer. CSS includes a stacked small-screen layout and reduced-motion support. These layouts and real input behavior have NOT been rendered-verified.

Only `study-desk-kiln-chorus-v1` is used. Saves contain a bounded action journal, current load and best fuel records. Decoding replays every action, validates legal steps and unlocks, rejects post-terminal actions and inconsistent win records, and strips unrelated fields. Corrupt data is preserved until confirmed recovery/reset; blocked storage permits a temporary session. Undo/retry retain records; reset affects only this game's key. Records are local achievements, not authenticated scores. The 96-action bound is a storage guard, not a gameplay target.

## Verification

- `node --test tests/kiln-chorus-engine.cjs`
- `NODE_PATH=/path/to/node_modules node --test tests/kiln-chorus-dom.cjs` (jsdom 26.1.0)
- `node --check games/kiln-chorus/engine.js` and `node --check games/kiln-chorus/game.js`

13 passing tests: 7 engine and 6 DOM. All three loads complete through UI button routes with exact save/reload after each action. Coverage includes temperature lag, cumulative glaze, draw-before-update order, overheating, fuel exhaustion, terminal guards, undo/retry, best-record retention, invalid journals/unlocks, keyboard ownership, read-only forecasts, pause/dialog/parent guards, corrupt recovery, isolated reset and quota failure. Finite exploration reaches 2,715 / 62,445 / 20,973 distinct successor states across the three loads, checking terminal and thermal invariants and achievable fuel maxima without the baffle. These totals are simulation states, not gameplay content or human playtesting. Dialog APIs are simulated in jsdom.

Both scripts pass syntax checks. Local HTML references resolve against the existing development-branch tree plus these new files. The recovered workspace is partial; no full repository build was run. Existing main workflow route/asset checks passed, but its deployment stopped at Configure GitHub Pages; that does not validate this prototype.

No rendered browser session, screenshot inspection, native touch/keyboard verification or human enjoyment evidence. The existing rendering security-policy blocker was not bypassed. This prototype remains unlisted on the development branch, with built=true but improved/browserTested/integrated/live=false. Next: naturally play each firing, inspect desktop/mobile screenshots, evaluate whether forecasts make the puzzle too obvious or sufficiently satisfying, and implement a substantive playtest-led improvement (especially replay depth) before selection. Also verify real collection navigation, reload, loss/retry and reset.


## One-use heat baffle

Source inspection found that every thermal intervention affected the whole kiln; the three compact loads offered few ways to decouple fast and slow clay. A new optional baffle holds one selected piece at its current warmth for a single action while other pieces update normally. It still gains a glaze mark if its unchanged warmth is in band. This allows a deliberately hotter chamber without immediately overheating fast clay, or lets one piece stay warm while another is drawn. It cannot protect a piece already removed or the piece being drawn in that action.

Selection is a read-only preview, visible in the full forecast and action label. Tap Protect again to cancel. The baffle is spent only on a committed valid action; undo restores it and retry replenishes it. No new mandatory step is added to legacy firing routes. Old string journals and save shapes remain unchanged. New exact `{action, shield}` journal entries replay the one-use constraint; malformed/duplicate use is rejected. Best fuel records remain compatible.

18 tests now pass (10 engine, 8 jsdom): the original 13 plus thermal isolation/continued glazing, all three baffle-assisted routes with per-action reload, strict action validation, read-only selection/cancellation, pause, undo, spent-state UI, restart, and a complete narrow-load UI route. Demonstrated baffle routes use 7/9/11 actions and leave 3/4/3 fuel. The original exhaustive state counts and fuel ceilings apply ONLY to routes without the baffle; no global optimum is claimed for the expanded action set. Both scripts pass syntax checks.

This is a source-led refinement, not an additional rendered-playtest pass. No improved/browser-tested/integrated/live credit. Natural desktop/touch play must still judge whether a one-use baffle creates satisfying planning, whether its targeting is clear, and whether the small campaigns need deeper replay choices.

## Soak fire control

Select **4 · Soak fire** to spend one fuel and hold chamber heat for one action. Each undrawn piece still approaches that heat at its normal response and gains glaze in band. This costs fuel in exchange for control; it is not thermal isolation and can still overheat fast clay. It requires a warm chamber and available fuel. The optional baffle can protect one piece during a soak, spending both resources. Forecasts show the unchanged chamber, fuel cost and each piece's actual response. Existing journals remain valid; new journals record `soak` or `{action:'soak',shield:index}`. Undo restores fuel and baffle availability.

25 engine/DOM tests now pass (14 engine, 11 jsdom). Soak-assisted routes in `tests/fixtures/kiln-chorus-soak.json` finish with 2/3/1 fuel, versus existing demonstrated 3/4/3 records; less economical completions never overwrite better records. These routes were found by engine search and verified through simulated button/reload campaigns, not human play. The original exhaustive search still excludes both soak and baffles: it does not establish optimality for the expanded controls. This source-derived refinement remains pending rendered desktop/touch assessment and earns no completed improvement credit yet.
