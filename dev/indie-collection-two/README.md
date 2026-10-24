# Second original indie collection — games 21–40

This branch starts from public main `bded102680166c0107fd8a58fef1559be7a22efa`. The first-batch baseline was read from `dev/indie-collection/FINAL_REPORT.md` on `indie-collection-dev` at `c03682dc435ecdaacd94966273d789dd90e9f7b1`: 20 finished, nine selected, 66 meaningful passes, zero verified live URLs. All first-batch sources, save keys, catalogue entries and integrity checks are preserved.

`ledger.json` has exactly 20 new slots, numbered 21–40. Planned slots are design proposals, **not completed games**. The separate Nightshift collection does not count here. A slot is finished only after a playable loop, at least one meaningful improvement, campaign/progression and loss checks, saves/restart, responsive controls, launch/navigation and a recorded quality review. Selection is a separate decision after comparison across candidates.

## Development launch

Serve the repository root (`python -m http.server 8000`), then visit `http://localhost:8000/games/reefwright/` `http://localhost:8000/games/counterweight/`, `http://localhost:8000/games/lanternwake/` `http://localhost:8000/games/copper-cadence/` `http://localhost:8000/games/hollow-keeper/` `http://localhost:8000/games/paper-odyssey/` `http://localhost:8000/games/ratchet-run/` `http://localhost:8000/games/wellward/` `http://localhost:8000/games/salt-and-sail/` `http://localhost:8000/games/pocket-palaeo/` `http://localhost:8000/games/static-orchard/` `http://localhost:8000/games/borrowed-gravity/` `http://localhost:8000/games/tea-for-ghosts/` `http://localhost:8000/games/cairn-and-cord/` `http://localhost:8000/games/murmuration/` `http://localhost:8000/games/night-clerk/` or `http://localhost:8000/games/clockwork-tide/`. The public catalogue intentionally does not list unselected candidates. No compile step or runtime dependencies are needed. All game illustrations are original inline SVG/CSS/Canvas; no outside game or asset collection was imported.

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

**18/20 playable; 18 initially improved and finished; 6/20 additional upgrades verified.** Ember Parcel is an unfinished playable prototype. Two slots remain planned. First-batch games, Nightshift and Afterlight are excluded.

Clockwork Tide operates a miniature tidal mill: store high water, release it through the wheel, select gears and feed the stone at the right speed and torque. Four authored commissions earn two functional workshop upgrades. Its improvement adds exact next-stroke previews, manual braking, reversible failed strokes and fixed phone controls. All 30 focused checks pass (19 engine, 11 DOM). Exhaustive first-commission search confirms high-water storage is essential.

Exact-source CI [40031851485](https://github.com/ThatOneMop/study-desk/actions/runs/40031851485) passed all **630 engine/interface checks** (365 engine, 265 DOM). All seventeen native desktop/touch suites passed, including all four Clockwork Tide commissions. All seven CI jobs succeeded. All seventeen suites remain enabled across six groups with at most three concurrent jobs, using installed Chrome when available and Playwright’s browser installation as a fallback. Evidence is in the [Clockwork Tide report](RUN_REPORT_2026-10-24_CLOCKWORK_TIDE.md).

Cloud UI reviewed desktop and 390-pixel layouts and completed the first commission through the phone-width controls with three seals. All 22 Clockwork Tide native screenshots are retained; desktop final-delivery and phone high-water-planning captures were visually inspected. This is not physical-device certification. [Night Clerk’s preceding report](RUN_REPORT_2026-10-24_NIGHT_CLERK.md) retains the previous increment’s evidence.

The latest public Pages release [39925660833](https://github.com/ThatOneMop/study-desk/actions/runs/39925660833) remains failed at Configure GitHub Pages before upload. No public catalogue or hosting changes were made by this increment. Separate all-created-games integration work is preserved and must be reread before future promotion; the Pages failure does not establish the status of another host.

All implemented candidates follow the same dependency setup: `node --test tests/<game>-engine.cjs`, jsdom `tests/<game>-dom.cjs`, and Chromium `tests/<game>-browser.cjs`. Authoring solvers provide reference routes, not general optimality proofs. Never regenerate fixtures to conceal a regression. Copper Cadence's independent unbraked-prefix search checks its third commission's teaching constraint.

Next: build Ember Parcel, slot 38. Selection waits for broader comparison; reserve final work for improving the slate, choosing winners, integration and regression.

Keep future commits scoped to this collection. Re-read remote main and development heads before writes; never force-push over concurrent work. Preserve the new relaxed Study Desk layout and all Gummy Bay/requested-game work.

## Writing and evidence notes

Git CLI reads work in this environment but CLI push had no credentials. Supported GitHub create-tree/create-commit and leased update-ref tools preserved source successfully. Always inspect the current branch before writes and include its latest tree/parent; do not overwrite concurrent work.

The public `catalog-launch.cjs` and `curation-regression.cjs` tests are stale against base main: both still click the removed `playerStudy` button. These tests and public shell files are unchanged here. Current `dom-checks.cjs`, `bridge-pointer.cjs` and `relaxed-collection.cjs` pass. See the ledger and run report for the evidence boundary.

At the first increment’s concurrency check, public main had advanced to `013a8d009286fe02a37ebce76126f44c19c72ecf` with private-messaging links/docs. This branch did not write main. Re-read and preserve those changes when later integrating selected games.

## Ember Parcel initial checkpoint — 24 October 2026

Launch `/games/ember-parcel/` from a local server. This eighteenth candidate has four short authored flame-delivery routes, warmth/terrain interactions, two equipment options, undo/retry and isolated replay-validated saves. It is deliberately unlisted and unfinished. See [EMBER_PARCEL_INITIAL.md](EMBER_PARCEL_INITIAL.md) for observed weaknesses and the evidence boundary. Its initial improvement and additional-round pass remain outstanding.

Ember Parcel initial pass now adds carried kindling: pack nearby timber and burn it later, including zero-warmth recovery. Phone map/controls are closer together. It remains unfinished pending native touch coverage and further progression work; its additional-round upgrade is not counted.

Ember native desktop/touch verification and in-page confirmations now pass on commit `61d1c8d`. It is a finished compact initial candidate; its separate additional-round progression upgrade remains pending. See [browser verification](EMBER_PARCEL_BROWSER.md).
