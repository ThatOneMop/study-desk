# Second original indie collection — games 21–40

This branch starts from public main `bded102680166c0107fd8a58fef1559be7a22efa`. The first-batch baseline was read from `dev/indie-collection/FINAL_REPORT.md` on `indie-collection-dev` at `c03682dc435ecdaacd94966273d789dd90e9f7b1`: 20 finished, nine selected, 66 meaningful passes, zero verified live URLs. All first-batch sources, save keys, catalogue entries and integrity checks are preserved.

`ledger.json` has exactly 20 new slots, numbered 21–40. Planned slots are design proposals, **not completed games**. The separate Nightshift collection does not count here. A slot is finished only after a playable loop, at least one meaningful improvement, campaign/progression and loss checks, saves/restart, responsive controls, launch/navigation and a recorded quality review. Selection is a separate decision after comparison across candidates.

## Development launch

Serve the repository root (`python -m http.server 8000`), then visit `http://localhost:8000/games/reefwright/` `http://localhost:8000/games/counterweight/`, `http://localhost:8000/games/lanternwake/` `http://localhost:8000/games/copper-cadence/` `http://localhost:8000/games/hollow-keeper/` `http://localhost:8000/games/paper-odyssey/` `http://localhost:8000/games/ratchet-run/` `http://localhost:8000/games/wellward/` `http://localhost:8000/games/salt-and-sail/` `http://localhost:8000/games/pocket-palaeo/` `http://localhost:8000/games/static-orchard/` `http://localhost:8000/games/borrowed-gravity/` or `http://localhost:8000/games/tea-for-ghosts/`. The public catalogue intentionally does not list unselected candidates. No compile step or runtime dependencies are needed. All game illustrations are original inline SVG/CSS/Canvas; no outside game or asset collection was imported.

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

**13/20 playable and improved; 12/20 finished; 0 selected, integrated or verified live.** Tea for Ghosts is implemented and improved, awaiting complete native verification. Seven slots remain concepts. First-batch games, Nightshift and Afterlight are excluded.

Tea for Ghosts adds six visitors with hidden flavour preferences, ingredient ratios, extraction/dilution, tasting feedback, memory unlocks and two functional tools. Its improvement adds live previews, comparison with the last cup, recipe undo, keyboard focus retention, feedback navigation, stronger save validation and persistent best-recipe recall. The candidate passes 34 local checks (21 engine, 13 DOM). Local desktop/phone-width QA completed two services. Its fixed cast and short scope are recorded honestly.

[CI 40010604779](https://github.com/ThatOneMop/study-desk/actions/runs/40010604779) passed **522 engine/interface checks** and all ten native suites in its planning, motion and craft-and-cargo groups. Tea completed its six desktop services before an ambiguous test selector stopped replay testing; the selector was corrected without changing game source. [Corrected CI 40011208465](https://github.com/ThatOneMop/study-desk/actions/runs/40011208465) passed all 522 engine/interface checks; the new-games browser group was still installing dependencies at handoff. No full native or whole-workflow pass is claimed for Tea yet. See the [Tea for Ghosts report](RUN_REPORT_2026-10-24_TEA_FOR_GHOSTS.md).

All existing suites are retained in four groups with at most three concurrent jobs. The browser allowance increased to 25 minutes after measured dependency delays. Previous motion timeouts were resolved by a complete passing motion suite in CI 40010604779.

The latest public release [39925660833](https://github.com/ThatOneMop/study-desk/actions/runs/39925660833) still fails at Configure GitHub Pages before upload. Publishing is blocked; development continues.

All implemented candidates follow the same dependency setup: `node --test tests/<game>-engine.cjs`, jsdom `tests/<game>-dom.cjs`, and Chromium `tests/<game>-browser.cjs`. Authoring solvers provide reference routes, not general optimality proofs. Never regenerate fixtures to conceal a regression. Copper Cadence's independent unbraked-prefix search checks its third commission's teaching constraint.

Next: finish native verification of Tea for Ghosts, then build Cairn & Cord, slot 34. Selection waits for broader comparison; reserve final work for improving the slate, choosing winners, integration and regression.

Keep future commits scoped to this collection. Re-read remote main and development heads before writes; never force-push over concurrent work. Preserve the new relaxed Study Desk layout and all Gummy Bay/requested-game work.

## Writing and evidence notes

Git CLI reads work in this environment but CLI push had no credentials. Supported GitHub create-tree/create-commit and leased update-ref tools preserved source successfully. Always inspect the current branch before writes and include its latest tree/parent; do not overwrite concurrent work.

The public `catalog-launch.cjs` and `curation-regression.cjs` tests are stale against base main: both still click the removed `playerStudy` button. These tests and public shell files are unchanged here. Current `dom-checks.cjs`, `bridge-pointer.cjs` and `relaxed-collection.cjs` pass. See the ledger and run report for the evidence boundary.

At the first increment’s concurrency check, public main had advanced to `013a8d009286fe02a37ebce76126f44c19c72ecf` with private-messaging links/docs. This branch did not write main. Re-read and preserve those changes when later integrating selected games.
