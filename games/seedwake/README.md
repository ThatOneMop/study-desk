# Seedwake

Original circular sowing puzzle for Study Desk. Select a bed, distribute its entire handful around eight beds, and bloom the final bed only when its seeds exactly match its printed capacity. Flowers spend those seeds. Complete a three-species bouquet using a finite handful allowance; gusts allow limited anticlockwise sows. Large handfuls wrap through their origin. Passing through an exact-capacity bed does not bloom it.

The core decision is choosing a starting pile and direction to reshape later piles while reserving seeds for remaining requests. This differs from farm-growth timers, Fallow Table's crop rotation and placement puzzles. Three authored gardens alter pile layout, bloom capacities and bouquet composition. Fewest-handful records encourage route refinement; undo/retry are free. Recorded routes take 5, 7 and 8 handfuls; these are feasible examples, not proven minima or content-duration claims.

## Hosting and controls

Static files; no build or runtime dependency. Serve the repository root over HTTP and visit games/seedwake/. ../../bridge.js loads first. Games navigation returns to ../../index.html#games. Deliberately absent from the public catalogue while awaiting rendered review.

Tap/click a bed to inspect it; previews never commit. Use the direction checkbox, then **Sow this handful**. Native buttons and checkbox support Tab/Enter/Space. On page/bed focus: 1–8 select, Left/Right follow the ring, R changes direction, K toggles the reserve, S sows, Z undoes. Other controls retain their keys. Pause, modal confirmation, document hiding and trusted parent hide messages guard actions. No real-time processes.

Original SVG flower drawings and CSS use cream, sage, poppy and cornflower colours. Numbers, flower names and printed capacities supplement colour. Layout becomes one column below 720px, controls have 44px minimum targets, focus outlines are visible and animation respects reduced motion. These are implemented design properties, not verified desktop/mobile rendering claims.

## Saves

The isolated key study-desk-seedwake-v1 stores version, level, moves and records. Legacy entries remain exactly {bed:0..7, reverse:boolean}. A reserve sow adds keep:true; false, repeated use and fewer than two starting seeds are rejected. The optional kept board flag appears only after use, so old journals retain their results. Replay validates legality, allowance, gusts, unlock sequence and terminal state. Records are minimum completed handful counts. Undo restores seeds/gusts and retains records. Retry clears the current route only. Malformed saves remain untouched until explicit recovery/reset; quota failure permits a temporary session. Reset touches only this game's key.

## Verification and limits

Run with jsdom 26 available through NODE_PATH:

    node --test tests/seedwake-engine.cjs tests/seedwake-dom.cjs

20 passing tests: 12 engine and 8 jsdom. Fixtures: tests/fixtures/seedwake-routes.json. Every campaign action runs through controls and reload. Coverage includes sowing/conservation, laps, reverse, overshoot, excess flowers, final-turn victory, losses, undo/retry, progression, native keyboard ownership, pause/modals/parent messages, recovery, isolated reset and quota handling. Conservation explores every legal route through depth three in each garden. No production build exists; syntax and asset references are checked separately.

Not yet rendered/browser-tested, improved from rendered observations, selected, integrated or live. No inspected screenshots, physical touch or human enjoyment evidence. Known limits: three compact fixed puzzles; no procedural gardens, audio or visual sowing animation. Next: evaluate the actual loop, mobile ring order, count readability, choice depth and replay value; implement a substantive observed improvement before catalogue consideration.


## Leave-one reserve (pending rendered review)

Source inspection showed that whole-pile sowing offered no way to retain a seed or shorten a landing without first rearranging other beds. Once per garden, **Leave one seed behind** keeps one seed in the starting bed and sows the rest. It requires two or more seeds, uses one normal handful, and can combine with a reverse gust. Full laps can add more seeds to the origin. Exact forecasts include the retained seed. Undo restores the ability; retry/level changes reset it. Selection is ephemeral; progress is journaled.

27 tests now pass (16 engine, 11 jsdom), including all original 20. New fixtures complete the three gardens in 4, 6 and 8 handfuls with reserve use and per-action save/reload. These improve the first two recorded example routes by one handful, not a claim of optimality. Tests also cover strict repeat/type guards, long reverse laps, preview immutability, shortage explanation, legacy saves, keyboard ownership, pause/modals and retry.

This is a substantive source-informed mechanic, not a rendered-play-led improvement. Qualification stays pending. Evaluate whether saving the reserve creates useful choices or simply makes one opening dominant when actual rendering is available.


## Optional bloom deferral (pending rendered review)

Previously every exact final landing consumed its seeds automatically, including excess flowers. **Keep landing seeds instead of a flower** now allows an explicit choice on any exact landing: retain the whole landing pile for later sowing, gain no flower now, and pay the normal handful and any reverse gust. This can combine with the once-per-garden leave-one reserve; it is not itself limited to once. The choice resets after a move or changing the selected bed, direction or reserve. The checkbox is disabled when no bloom is possible. Exact forecasts show the retained seeds, and the status explains why no flower was taken.

The v1 action adds optional defer:true. Only strict true on an actual exact landing is accepted; meaningless or malformed deferrals reject without a move. Old journals still bloom automatically and retain their board shape. The optional deferred field only describes the most recent deferred landing; it disappears on the next ordinary move. Undo, reload, records and retry follow the existing rules.

34 tests pass (20 engine, 14 jsdom), retaining the previous 27. Three deferral-inclusive campaigns finish in 5/7/8 handfuls through controls and per-action reload. These are coverage examples, not faster-route or optimality claims. Checks cover conservation, no flower award, combined reserve/reverse costs, retained-pile reuse, strict eligibility/type checks, final-turn loss when declining a needed flower, undo/replay, preview, selection reset and native/pause/modal guards. Original and reserve routes still pass.

This is a source-informed strategic option, not a rendered-qualified improvement. Rendered review must establish whether it makes useful seed-conservation choices clearer without adding confusing controls. No additional completed, browser-tested, integrated or live game is claimed.
