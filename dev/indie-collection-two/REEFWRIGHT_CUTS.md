# Reefwright selective cuts — 25 October 2026

Source implementation: [0db09c81e7d4227733b4a9f16a6cd839187895f1](https://github.com/ThatOneMop/study-desk/commit/0db09c81e7d4227733b4a9f16a6cd839187895f1). Development branch only; public main remains `85d941d59e8897585606e5a67f4413a710643067`.

## Problem and change

Source inspection suggests the five compact coasts have a rigid add-only layout loop: fixing an old obstruction requires undoing complete later placements. This is a design hypothesis, not a new rendered-play observation. The additional-round requirement is still pending.

Two selective cuts per reef remove individual coral, kelp or nursery squares. Each cleared square becomes ordinary water, can reconnect nursery channels, and can receive a future piece. The removed habitat is lost; cutting a connecting coral or forest square can reduce whole groups. Cuts neither advance the offer deck nor refund habitat placements. They remain available after eight placements but not after survey completion; Undo reopens a survey or returns a cut.

X/button enters cut mode. Selecting a square shows the exact habitat/vitality changes and a striped removal highlight. Confirm cut applies it; toggling mode cancels without changing the save. Selecting an offer returns to planting. Rotation is disabled during cutting. Dialog and bridge-pause guards also cover direct grid Enter and confirmation.

## Tests and limits

`NODE_PATH=/tmp/reef-check/node_modules node --test tests/reefwright-engine.cjs tests/reefwright-dom.cjs`: **56 passing checks: 30 engine, 26 jsdom**. Both gameplay scripts pass `node --check`.

- All five original three-medal routes remain valid and unchanged.
- Five new stored cut-assisted routes earn three medals, with vitality **51 / 41 / 43 / 44 / 49**. Every action roundtrips through validated replay. The interface follows the same campaigns, checks exact forecasts, reloads after cutting and unlocks each next coast.
- The first new route starts with the existing closure fixture. Cutting kelp at row 3, column 5 reconnects a nursery: thriving nurseries **3 → 4**, vitality **18 → 21**, while remaining forest kelp stays at three. The route then finishes at 51 vitality.
- Cutting row 2, column 5 in Ribbon coast instead lowers forest kelp **6 → 5**, removes victory and requires undo/replanning. This is not an unconditional score boost.
- Two-use exhaustion, water/stone/invalid targets, finished-survey rejection, cleared-space replanting, unchanged offers, no ninth habitat, undo/refund and forged histories are covered.
- Staged preview/cancel, X/Enter, reload, loss/reopen, restart confirmation, unrelated saves, best-record preservation, modal/bridge blocking and navigation markup are covered.

The unchanged `study-desk-reefwright-v1` key and version accept original placement-only journals. New cut journals are replayed in order, with at most eight plantings plus two cuts; derived boards, scores and stock are never trusted from storage. The old eight-placement offer indexing now counts placements separately.

Tests are deterministic engine routes and simulated DOM interactions. No rendered play, screenshot inspection, actual touch, human enjoyment evidence or full repository check was performed from this partial checkout. The toolbar and cut highlight still require visual review and balance iteration. No alternative browser surface or CI rendering workaround was used.

## Durable status

Second batch: 20 initially built/improved/finished; **6/20 verified additional passes**, 12 source upgrades awaiting rendered review, two additional implementations still pending (Lanternwake, Copper Cadence). Final comparative selection remains outstanding. The ledger's selected count stays zero; thirteen initial games already present through concurrent catalogue integration are preserved.

Third batch remains **6/50 built prototypes; 0 improved, browser-tested, integrated or verified live**. Its branch remains `ab12bd0d63f2a4cdc4579be3f811a6f4693c1161`.

No catalogue, first-batch, Gummy Bay, requested-game or deployment files changed. The prior workspace-control audit remains applicable because main has not changed. Publication and browser access blockers were not retried. A source commit is not a live release.

Next: rendered before/after review and iteration once supported access is available; independently continue Lanternwake/Copper Cadence and the remaining third-batch implementations. Keep the ongoing task active while that source work is possible.
