# Thimble Fair thread exchange — 28 October 2026

Source: [ec1c3e57cc6f11858c639e166f86f1213036b8b5](https://github.com/ThatOneMop/study-desk/commit/ec1c3e57cc6f11858c639e166f86f1213036b8b5).

## Before / after
Source inspection identified stranded surplus: only another auction could provide a missing colour. A new optional exchange trades two threads of one colour for one of another, once per fair, without spending coins or an auction. It reduces total material by one, so a recovery for one recipe may leave another short. This is a material-allocation choice, not extra levels or a timer.

Native Give 2 / Receive 1 selectors and an exact basket forecast do not commit until Exchange thread. Pause and confirmation dialogs guard input. Undo restores both stock and allowance. The option remains available after auction eight; the fair ends in loss only when neither crafting nor an eligible exchange remains. An unhelpful exchange can still produce a loss.

Existing v1 journals retain their purchase/craft outcomes and records. A new optional exchange action replays into a derived used flag; no state migration or old save deletion. A legacy final-auction basket with surplus may now gain a recovery opportunity. Journal bound is twelve (eight auctions, three deliveries, one exchange). Other games' keys are unchanged.

## Tests and limits
28 tests pass: 14 engine, 14 jsdom 26.1.0, including all original 21. Command from repository root: NODE_PATH=/tmp/thimble-test/node_modules node --test tests/thimble-fair-engine.cjs tests/thimble-fair-dom.cjs.

Added coverage: exact two-for-one material change and unchanged coins/round; single-use and strict action validation; three alternate complete routes with every action saved/reloaded through UI controls; pure basket forecasts; shortage/same-colour rejection; pause/modal guards; undo/retry; double-trade rejection; natural twelve-action last-auction rescue. Original tests retain progression, loss/retry, saves, resets, navigation and native keyboard checks.

Exchange routes for fairs 1/42/314 finish in three auctions with 5/3/6 coins versus original examples 5/4/8. These are coverage routes, not proven optimal or uniformly better strategies. Route fixtures: tests/fixtures/thimble-fair-exchange.json.

Both scripts parse. Used/unique IDs, bridge-first loading and absence of Switch workspace controls pass source checks. No rendered browser play, screenshot inspection, native touch/dialog verification, enjoyment claim, full-repository build or live verification. Existing browser security-policy blocker was not retried or bypassed. This is a source-informed refinement, not a qualified improvement pass.

## Preservation / next steps
First-batch final report, third tree/ledger and current source re-read. No AGENTS.md in third tree. Static conventions retained. Starting heads: third 085825d1210fab971982ecdd65e91eec0587f27c; main 55c330d9ec493afc40e81e89a371f64cbd5bd8b0; second 3949e3d9f8e2e9846dc4c91c436d90b19bbbd341. Main and second unchanged; no repeated deployment attempt. Existing clean workspace-control audit remains applicable to unchanged launcher source; new controls introduce no switch button.

Exactly fifty third-batch slots; **22 built, 0 qualified improved, 0 browser-tested, 0 integrated, 0 live**. Second additional round remains **6/20 verified, 14 pending**. First collection and concurrent work untouched. No public catalogue entry or automation change.

Next: rendered before/after play, inspect desktop/mobile controls and evaluate whether the exchange is worth its extra onboarding, then implement a substantial observation-led pass before qualification. Continue remaining distinct candidates while rendering is unavailable.
