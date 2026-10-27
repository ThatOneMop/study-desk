# Bramble Pact — initial source implementation

Date: 2026-10-28. Slot 63, third collection.

Implementation: [`815a82dc73d3b5f95b1743ab60d34fb49cc1fef6`](https://github.com/ThatOneMop/study-desk/commit/815a82dc73d3b5f95b1743ab60d34fb49cc1fef6).

## Implemented

Three compact open-information card puzzles. Each has six tricks and eighteen unique cards split between the player and two neighbours. The player must follow suit when possible. A scheduled wind suit acts as trump, but the led suit determines the harvest. Winning gives the next lead, so choosing an unwanted win also changes later choices. Exact basket quotas reward deliberately yielding some tricks. The once-per-picnic woodland offer spends itself on the chosen trick and leaves any won harvest behind without surrendering the next lead.

All hands, future winds and the neighbours' deterministic policy are visible. Selecting a card previews all three plays, winner and exact resulting baskets before commitment. The initial deals were selected by engine exploration to ensure both ordinary wins and wins where the offer actually discards harvest; no render-derived refinement is claimed.

Original SVG Berry/Nut/Leaf art, responsive CSS, suit names and ranks, a completed-trick history, keyboard/native-button controls, pause, sequential unlocks, no-offer replay records, undo, confirmed restart and isolated reset are implemented. The unique v1 save stores only the validated action journal, current picnic and bounded records. Invalid saves remain untouched during temporary play until confirmed recovery. Failed writes do not stop play. No shared assets, bridge, catalogue, prior games or existing save keys changed.

## Evidence and limits

`NODE_PATH=/tmp/bramble-pact-test/node_modules node --test tests/bramble-pact-engine.cjs tests/bramble-pact-dom.cjs` from the recovered repository directory: **25 pass / 0 fail** (12 engine, 13 jsdom 26.1.0).

| Picnic | Goal (Berry / Nut / Leaf) | Exhaustive prefix visits | Complete journals | Wins without offer | Wins with an effective offer |
| --- | --- | ---: | ---: | ---: | ---: |
| The first picnic | 1 / 1 / 1 | 5,441 | 2,240 | 52 | 104 |
| A neighbour’s basket | 1 / 2 / 1 | 1,023 | 427 | 6 | 3 |
| The autumn promise | 1 / 1 / 2 | 1,675 | 714 | 24 | 18 |

Counts include different action orders and offer timings; they measure solver paths, not separate levels, content duration or human enjoyment. Other valid wins spend the offer on a losing trick. Six representative wins (one plain and one effective-offer route per picnic) and three losses are preserved in `tests/fixtures/bramble-pact-routes.json`.

Tests cover conservation of all eighteen cards at every legal prefix, follow-suit, changing trump, lead-suit harvest, deterministic neighbours, invalid moves, pure forecasts, exact quotas, gift timing/cost, terminal protection, undo/retry, sequential progression, best-record retention, malformed saves and replay roundtrips. DOM routes use actual UI handlers and reload after each action. All DOM tests load the actual shared bridge with a simulated parent, covering reserved P, game shortcuts, native controls, modifiers, composition, repeated keys, pause/dialog guards, trusted parent and document visibility, scoped reset and quota/corrupt recovery. A document-visible event cannot override a still-hidden parent, nor the reverse.

Both production scripts and both test scripts parse. Static asset references, bridge-first order, unique DOM IDs, visible card labels, six wind entries and the Games navigation target pass. No Switch workspace controls were added. Current main and both development branch heads were checked before work; first-batch FINAL_REPORT and the second additional-round checklist were reread. The repository is static with no root build command. This is a partial recovery, so **no full-repository build/regression claim** is made.

The existing rendered-preview policy rejection was not retried or bypassed. There was **no rendered play, screenshot inspection, physical/touch-emulated browser play, native-dialog verification or human enjoyment assessment** in this run. DOM simulation is not a browser qualification. Main's source audit and publishing investigation are unchanged; no deployment retry or live-release claim.

## Counts and next steps

Third ledger remains exactly 50 slots: **23 built / 0 qualified improved / 0 browser-tested / 0 integrated / 0 live**, with 27 unassigned. Second collection retains 20 built/initially improved, all 20 additional upgrades source-implemented, **6/20 additional rendered-verified and 14 pending**. First collection and all concurrent main/Gummy Bay work are preserved.

Before qualification, play the actual three hands on desktop and mobile, inspect screenshots and navigation, and test real saves, loss/retry and dialogs. Assess whether exact previews make the choices too obvious, whether leading-suit harvest versus trump is clear, and whether the small fixed campaign offers enough useful replay. Implement a substantial improvement from that observed weakness; do not count this initial source work or its automated checks as the requested rendered improvement pass. Keep Bramble Pact off the public catalogue meanwhile.
