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

**20/20 playable, initially improved and finished; 6/20 additional upgrades verified.** Last Lighthouse now includes verified optional lifeboat routing. First-batch games, Nightshift and Afterlight are excluded.

Windup Wrestling is the nineteenth candidate: seven-space spring grappling, telegraphed rival actions, braces and momentum reversals. Its initial improvement replaces an identical three-move win across rivals with reactive guarding and an early grapple. See [the implementation report](WINDUP_WRESTLING_INITIAL.md). Its separate additional-round upgrade is not counted.

Exact-source CI [40080637524](https://github.com/ThatOneMop/study-desk/actions/runs/40080637524) passed **713 engine/interface checks** (421 engine, 292 DOM), plus source and asset preservation gates. Changed-game native desktop/touch campaigns pass; ten screenshots retained and three inspected. Other browser groups remain in progress at checkpoint. Earlier Ember CI 40076388835 has now passed all seven jobs and all eighteen native suites.

Next: complete fourteen remaining additional upgrades, compare and integrate selections. The third-batch branch has exactly 50 planned slots and no built games yet. The full task remains unfinished.

The existing workspace-control and publication audit on main `b311b35` found no remaining Switch workspace controls. Preserve Games/Collection navigation, search, grouping, sorting and favourites. GitHub Pages configuration remains a previously recorded permission blocker; no unchanged retry was made. Separate hosted deployment was not verified through its sign-in wall. Repository commits are not live release evidence.

Main reread at `18b81b1`: its 64 entries include thirteen earlier second-batch games from concurrent integration. No main or public catalogue edits in this increment. Re-read remote heads before future integration and preserve all Gummy Bay/requested-game work.

## Writing and evidence notes

Git CLI reads work in this environment but CLI push had no credentials. Supported GitHub create-tree/create-commit and leased update-ref tools preserved source successfully. Always inspect the current branch before writes and include its latest tree/parent; do not overwrite concurrent work.

The public `catalog-launch.cjs` and `curation-regression.cjs` tests are stale against base main: both still click the removed `playerStudy` button. These tests and public shell files are unchanged here. Current `dom-checks.cjs`, `bridge-pointer.cjs` and `relaxed-collection.cjs` pass. See the ledger and run report for the evidence boundary.

At the first increment’s concurrency check, public main had advanced to `013a8d009286fe02a37ebce76126f44c19c72ecf` with private-messaging links/docs. This branch did not write main. Re-read and preserve those changes when later integrating selected games.

## Ember Parcel initial checkpoint — 24 October 2026

Launch `/games/ember-parcel/` from a local server. This eighteenth candidate has four short authored flame-delivery routes, warmth/terrain interactions, two equipment options, undo/retry and isolated replay-validated saves. It is deliberately unlisted and unfinished. See [EMBER_PARCEL_INITIAL.md](EMBER_PARCEL_INITIAL.md) for observed weaknesses and the evidence boundary. Its initial improvement and additional-round pass remain outstanding.

Ember Parcel initial pass now adds carried kindling: pack nearby timber and burn it later, including zero-warmth recovery. Phone map/controls are closer together. It remains unfinished pending native touch coverage and further progression work; its additional-round upgrade is not counted.

Ember native desktop/touch verification and in-page confirmations now pass on commit `61d1c8d`. It is a finished compact initial candidate; its separate additional-round progression upgrade remains pending. See [browser verification](EMBER_PARCEL_BROWSER.md).

## Last Lighthouse prototype

Launch `/games/last-lighthouse/`. See [initial evidence and weaknesses](LAST_LIGHTHOUSE_INITIAL.md). All twenty slots now contain playable source, but this is not twenty finished games.

Last Lighthouse now has optional lifeboat beam routes and earned pennants, using spare power or risking hull on cranking. [Initial improvement evidence](LAST_LIGHTHOUSE_RESCUES.md). This does not count toward the additional round.

## Latest checkpoint: Windup mechanical kits

Implementation and 727 automated engine/DOM checks are saved; rendered review is blocked and additional-round completion remains 6/20. See [Windup kit checkpoint](WINDUP_WRESTLING_KITS.md). No catalogue integration or live release in this increment.
