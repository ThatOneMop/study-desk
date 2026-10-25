# Counterweight padded cradles — source checkpoint

25 October 2026. Implementation: `66e77e8d2e7a50acab5e99228cd92be17d958f63`. Candidate 22; separate additional-round work, **not a verified additional pass**.

## Design hypothesis and behaviour

Source inspection found fixed cargo tolerances and no resource to allocate between deliveries. This is a source hypothesis, not a new rendered-play observation. Two padded cradles now create a deliberate choice: trade one extra tonne of carried load for three extra points of safe landing swing. That extra weight affects torque and can cause overloads; it never protects the crane itself.

Press C or Fit cradle at the empty centre dock. Fitting/removing costs an action; the supply is consumed only on pickup. It cannot be removed in flight or reused after delivery. Cradles leave before stack loading, so delivered weights and stack strength are unchanged. Undo restores the corresponding journal state; restarting restores two supplies while keeping records. Forecasts include the added weight and tolerance. The landing strip, stock line, pressed button and original SVG cradle outline expose the state. Existing save key and v1-to-v2 ballast migration are unchanged; old journals default to two unused cradles and produce their old outcomes.

## Validation

- 32 engine and 24 jsdom checks pass, including all five original campaigns, exact old route lengths/medals, and v1 migration.
- Five separately retained cradle routes complete cleanly with three medals. Every action checks exact forecasts and save/reload. Their move counts are 17/39/45/53/63 versus original 17/38/46/51/63. These are automated per-delivery search routes, not global optimality or enjoyment claims.
- Extra-weight overload/loss/undo, exhaustible stock, reserve/cancel/pickup, no midair removal, bounded padding, unaltered stack weights, no delivery refund, illegal replay rejection and progression are checked.
- DOM controls cover all five cradle campaigns, C shortcut, carried-state reload, risk labels, restart cancel/confirm, undo, dialog guards and unrelated-save preservation. These are simulated events, not rendered keyboard/touch verification.
- Both JavaScript files pass syntax checks. The existing benchmark generator explicitly excludes rigging so it cannot silently replace original fixtures. The original fixture is unchanged.

## Limits and next work

Browser preview access remains blocked by the previously recorded security policy. No alternate browser surface or CI rendering was used to evade it. No screenshots, rendered desktop/mobile review or human-enjoyment evidence is claimed. Full repository checks were not available from the partial local source tree; only the scoped checks above ran.

Complete supported rendered before/after play, evaluate the limited-resource choice, inspect the additional control at phone width, iterate on observed weaknesses and verify actual input, saves/reload, loss/retry, restart/navigation and screenshots. Only then count this pass. The five short fixed manifests remain a depth limitation.

## Scope

Only Counterweight source/tests and second-batch development records changed. First-batch, Gummy Bay, requested-game work, public catalogue and third-batch source remain untouched. Main was observed at `85d941d59e8897585606e5a67f4413a710643067`. No integration or live release in this increment; additional round remains 6/20. The independent third-batch ledger remains six built prototypes and zero improved/browser-tested/integrated/live.
