# Second original indie collection — games 21–40

This branch starts from public main `bded102680166c0107fd8a58fef1559be7a22efa`. The first-batch baseline was read from `dev/indie-collection/FINAL_REPORT.md` on `indie-collection-dev` at `c03682dc435ecdaacd94966273d789dd90e9f7b1`: 20 finished, nine selected, 66 meaningful passes, zero verified live URLs. All first-batch sources, save keys, catalogue entries and integrity checks are preserved.

`ledger.json` has exactly 20 new slots, numbered 21–40. Planned slots are design proposals, **not completed games**. The separate Nightshift collection does not count here. A slot is finished only after a playable loop, at least one meaningful improvement, campaign/progression and loss checks, saves/restart, responsive controls, launch/navigation and a recorded quality review. Selection is a separate decision after comparison across candidates.

## Development launch

Serve the repository root (`python -m http.server 8000`), then visit `http://localhost:8000/games/reefwright/` `http://localhost:8000/games/counterweight/`, `http://localhost:8000/games/lanternwake/` or `http://localhost:8000/games/copper-cadence/`. The public catalogue intentionally does not list unselected candidates. No compile step or runtime dependencies are needed. All game illustrations are original inline SVG/CSS; no outside game or asset collection was imported.

## Checks

- `node --test tests/reefwright-engine.cjs`
- `NODE_PATH=/path/to/test/node_modules node --test tests/reefwright-dom.cjs` (jsdom 26)
- `NODE_PATH=/path/to/test/node_modules node tests/reefwright-browser.cjs` (Playwright Chromium; owns its local server)
- `python tests/indie-two-gate.py` enforces the exact twenty-slot ledger and selection policy.
- `node tests/reefwright-solve.cjs` regenerates deterministic five-coast campaign fixtures. Do not regenerate fixtures to conceal a regression.
- `python tests/assets.py` and `python tests/selected-indie.py` preserve the public catalogue and first-batch source hashes.

Counterweight checks use the same test dependency setup:

- `node --test tests/counterweight-engine.cjs`
- `NODE_PATH=/path/to/test/node_modules node --test tests/counterweight-dom.cjs`
- `NODE_PATH=/path/to/test/node_modules node tests/counterweight-browser.cjs`
- `node tests/counterweight-solve.cjs` computes shortest clean per-delivery routes for the authored destination plans. The physical-direction improvement deliberately reversed ballast inputs; all five route lengths and medals remained unchanged.

## Current result and next work

**4/20 playable, improved and finished; 0 selected, integrated or verified live.** Reefwright, Counterweight, Lanternwake and Copper Cadence are finished development candidates. Sixteen slots remain concepts. The first batch, Nightshift and Afterlight are excluded.

Copper Cadence is a hand-cranked percussion pipeline with five compact commissions: feed conserved beads into unequal tracks, hold exits, and rotate destinations. Its improvement adds exact next-turn and three-beat forecasts, bead motion, stable keyboard focus, compact phone controls, and a revised commission that provably requires braking for a perfect take. Sound is optional and synthesized; all events have visual equivalents. See [Copper Cadence report](RUN_REPORT_2026-10-23_COPPER_CADENCE.md).

Final exact-source [CI 39945625373](https://github.com/ThatOneMop/study-desk/actions/runs/39945625373) passed all **171 engine/interface tests** (94 engine, 77 DOM), full desktop and touch-emulated campaigns for all four candidates, and public integrity gates. Copper Cadence contributes 26 engine + 20 DOM checks. Its five commissions each completed at three seals in Chromium desktop 1280×1000 and touch emulation 390×844; tests cover forecast supplies, midgame reloads, blocked feeds, audio opt-in, loss/undo, keyboard/Enter/Space, restart/cancel, isolated corrupt-save recovery and return navigation, with no browser errors. [80 screenshots](https://github.com/ThatOneMop/study-desk/actions/runs/39945625373/artifacts/12497792894) were retained, including 22 Copper Cadence captures. Representative final desktop and phone midgame screenshots were visually inspected.

The latest public release [39925660833](https://github.com/ThatOneMop/study-desk/actions/runs/39925660833) still fails at Configure GitHub Pages before upload. Publishing is blocked; development continues.

Lanternwake and Copper Cadence checks follow the same dependency setup: `node --test tests/<game>-engine.cjs`, jsdom `tests/<game>-dom.cjs`, and Chromium `tests/<game>-browser.cjs`. Lanternwake's solve script generates bounded beam-search reference routes, not optimality proofs. Copper Cadence's author script records deliberate level designs; do not regenerate fixtures to conceal regression failures. Its unbraked-prefix search independently checks the third commission's teaching constraint.

Next: implement Hollow Keeper, slot 25; improve and test it before counting it finished. Selection waits for broader comparison.

Keep future commits scoped to this collection. Re-read remote main and development heads before writes; never force-push over concurrent work. Preserve the new relaxed Study Desk layout and all Gummy Bay/requested-game work.

## Writing and evidence notes

Git CLI reads work in this environment but CLI push had no credentials. Supported GitHub create-tree/create-commit and leased update-ref tools preserved source successfully. Always inspect the current branch before writes and include its latest tree/parent; do not overwrite concurrent work.

The public `catalog-launch.cjs` and `curation-regression.cjs` tests are stale against base main: both still click the removed `playerStudy` button. These tests and public shell files are unchanged here. Current `dom-checks.cjs`, `bridge-pointer.cjs` and `relaxed-collection.cjs` pass. See the ledger and run report for the evidence boundary.

At the first increment’s concurrency check, public main had advanced to `013a8d009286fe02a37ebce76126f44c19c72ecf` with private-messaging links/docs. This branch did not write main. Re-read and preserve those changes when later integrating selected games.
