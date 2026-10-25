# Bramble Dice — initial prototype

25 October 2026. Third collection slot 46. Source commit: 53da98cfae1c9620d8f1612ce1e7185d235dcc52 on indie-collection-three-dev.

## Implemented loop

Four deterministic dice per turn; keep pins and up to two rerolls; assign each die to attack, guard or pooled repair. Creature intent shows damage, armour and thorns before the player commits. Exact allocation forecasts show both health outcomes. Repair resolves before retaliation; defeating a creature cancels its attack, but contact thorns still apply. There is no timer.

Three original encounters use different cyclic intents: beetle armour/opening, snail thorn windows, and owl charge/landing. At each of the first two clearings, choose stacking attack, guard or healing equipment and recover four health. Equipment resets each expedition; the fewest-turn victory record persists. Retry repeats the dice seed, while New dice seed changes its sequence. This is a compact expedition, not three collections of reskinned levels or a measured hours-of-content claim.

The core differs from existing aiming/physics, sailing, packing, stencilling and gear puzzles: dice retention and resource allocation against changing enemy intentions determine outcomes. All code and CSS artwork are original; no third-party assets.

## Verification

- 6 engine tests passed: 15 automated wins across five seeds and all three equipment focuses; exact save/replay after each action; kept-die and reroll bounds; pooled repair, armour, lethal-contact thorns and cancelled retaliation; a natural reckless-all-attack loss; retry/new seed and record persistence; illegal journal and malformed-save rejection.
- 4 jsdom tests passed: three equipment routes using controls, reload mid-route and after victory; setup saves, stable card focus and native select keys; loss/retry, confirmation cancellation, pause/help, new seed/reset and unrelated-save preservation; malformed-save recovery and visible storage errors. Dialog methods are simulated. These are DOM tests, not rendered browser tests.
- Winning sampled routes use 6–10 turns. An initial engine balance check exposed one-turn early encounters; initial prototype enemy health was tuned so repeated turns and intent changes matter. This is source-led prototype balancing, not a completed rendered-play improvement pass.
- Node syntax checks passed for both scripts. Styles/scripts exist, Games navigation targets the existing launcher, bridge points to existing root bridge.js, hidden rewards have an explicit CSS rule, and the prototype is absent from main catalog.json.
- Full repository build was not run from the recovered partial checkout. No screenshot, layout, physical-touch, browser navigation, screen-reader or human-enjoyment verification is claimed.

## Saving and controls

Unique key: study-desk-bramble-dice-v1. Bounded action journal reconstructs RNG, dice, health, equipment and encounter state. Die jobs and keep pins save before commitment. Unreadable data is retained until explicit recovery; local storage failure leaves the session usable with a warning. Confirmed reset affects this game only. Native select/buttons support keyboard and touch input in source; focused card shortcuts are 1 attack / 2 guard / 3 repair / K keep. Visibility and trusted parent pause messages pause decisions. Actual touch ergonomics remain unverified.

## Remaining gates and preservation

Rendered access remains subject to the previously recorded policy block. No alternate browser surface or CI rendering workaround was attempted. Render this game when supported access is available, inspect screenshots, identify its most important weakness and perform a substantive improvement before public selection. In particular assess reroll readability, defensive-equipment value and compact progression depth.

Switch-workspace audit and publication evidence remain in docs/WORKSPACE_CONTROL_AUDIT_2026-10-24.md; the unchanged publication failure was not retried. This increment adds only Bramble Dice source/tests and third-batch records. Other game sources, keys, catalogue entries and main are preserved.

Third batch: **6 built / 0 improved / 0 browser-tested / 0 integrated / 0 live**, exactly 50 slots. Second-batch ledger remains **20 initial builds/improvements, 6/20 additional upgrades verified**, with 14 pending. No new live game link.
