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

**20/20 playable, initially improved and finished; 19/20 additional upgrades fully verified.** All twenty additional upgrades have source. Copper Cadence’s silent catches and retained-suffix score repair pass all seven CI jobs: 920 engine/DOM checks, original/catch desktop and emulated-touch campaigns, and three inspected final screenshots. See [current evidence](COPPER_SCORE_REPAIR.md).

The third-batch ledger now records **24/50 built**, with zero substantive improvements, browser-tested completions, integrations or verified live routes. No third-batch count changed in this increment.

Main `55c330d9ec493afc40e81e89a371f64cbd5bd8b0` contains 65 catalogue entries, including thirteen earlier second-batch games from concurrent integration. These are not final additional-round selections. This increment changes only the second development branch.

The previous Pages configuration blocker is resolved: [main release 40486136506](https://github.com/ThatOneMop/study-desk/actions/runs/40486136506) succeeded, and the public site loads. Live desktop and 390px iframe search, Reefwright launch and Collection return were verified. Development-branch upgrades are not thereby live.

No Switch workspace controls were found in main launcher source or 44 second/third-batch game shells. Current main catalogue tests already assert that removed controls are absent. Preserve Games/Collection, search, genres, grouping, sorting, favourites and Gummy Bay.

Next: finish Hollow Keeper’s additional-round rendered review and substantive iteration, compare/integrate winners, and complete the separate fifty-game slate. Keep the existing cadence; the task is not complete.

## Writing and evidence notes

Git CLI reads work in this environment but CLI push had no credentials. Supported GitHub create-tree/create-commit and leased update-ref tools preserved source successfully. Always inspect the current branch before writes and include its latest tree/parent; do not overwrite concurrent work.

Historical base-branch catalogue tests referenced removed workspace controls. Current main was reread on 28 October: `catalog-launch.cjs` no longer uses them; `curation-regression.cjs` and `relaxed-collection.cjs` explicitly assert absence. Do not reintroduce obsolete handlers while integrating this older development branch.

At the first increment’s concurrency check, public main had advanced to `013a8d009286fe02a37ebce76126f44c19c72ecf` with private-messaging links/docs. This branch did not write main. Re-read and preserve those changes when later integrating selected games.

## Ember Parcel initial checkpoint — 24 October 2026

Launch `/games/ember-parcel/` from a local server. This eighteenth candidate has four short authored flame-delivery routes, warmth/terrain interactions, two equipment options, undo/retry and isolated replay-validated saves. It is deliberately unlisted and unfinished. See [EMBER_PARCEL_INITIAL.md](EMBER_PARCEL_INITIAL.md) for observed weaknesses and the evidence boundary. Its initial improvement and additional-round pass remain outstanding.

Ember Parcel initial pass now adds carried kindling: pack nearby timber and burn it later, including zero-warmth recovery. Phone map/controls are closer together. It remains unfinished pending native touch coverage and further progression work; its additional-round upgrade is not counted.

Ember native desktop/touch verification and in-page confirmations now pass on commit `61d1c8d`. It is a finished compact initial candidate; its separate additional-round progression upgrade remains pending. See [browser verification](EMBER_PARCEL_BROWSER.md).

## Last Lighthouse prototype

Launch `/games/last-lighthouse/`. See [initial evidence and weaknesses](LAST_LIGHTHOUSE_INITIAL.md). All twenty slots now contain playable source, but this is not twenty finished games.

Last Lighthouse now has optional lifeboat beam routes and earned pennants, using spare power or risking hull on cranking. [Initial improvement evidence](LAST_LIGHTHOUSE_RESCUES.md). This does not count toward the additional round.

## Historical checkpoint: Windup mechanical kits

Implementation and 727 automated engine/DOM checks are saved; rendered review is blocked and additional-round completion remains 6/20. See [Windup kit checkpoint](WINDUP_WRESTLING_KITS.md). No catalogue integration or live release in this increment.

## Windup verification checkpoint — 28 October 2026

CI 40635652032 on acfd9fa8cfdbd26e0b8445e01f3e1c8724902fd4 passed all seven jobs: 517 engine + 355 DOM = 872 checks, asset/syntax and nine first-batch selected-source integrity gates. Native desktop and emulated touch each complete all three standard bouts and all six alternate kit/rival victories, exact full-exchange rehearsal/cancel/commit, saved mastery reload, natural loss/undo/retry, pause, confirmation cancellation, isolated recovery/reset and navigation. Job 122642554331.

34 Windup screenshots retained in artifact 12792594859. Inspected desktop-boots-forecast-1, touch-coil-forecast-2 and touch-boots-won-2: readable wrapped forecasts and controls, correct kit resource limits, independent standard/kit records after reload. ZIP SHA256 121ae4ca94215b72d098192bcbcb173dae9c46a7eda0ffc488205a824bd04d44. Automated routes and agent play are reliability evidence, not human enjoyment or physical-device testing.

At that historical checkpoint: **8/20 verified**. No new game or public integration in this verification increment. Source remains on the development branch; the first batch, thirteen concurrent second-batch catalogue entries, Gummy Bay and third branch are unchanged. See [Windup evidence](WINDUP_REHEARSAL.md).


Latest next steps (29 October): Prioritize Wellward, then Reefwright, Counterweight, Lanternwake, Copper Cadence and Hollow Keeper: inspect pending source and rendered core loops, refine game-specific weaknesses and verify exact source before counting. Six additional reviews remain before final second-batch selection/integration. Third collection remains 24/50 built with no qualified improved/browser-tested/integrated/live completions.


Latest next steps (29 October, after Wellward verification): Finish rendered game-specific upgrades and exact-source verification for Reefwright, Counterweight, Lanternwake, Copper Cadence and Hollow Keeper. Then compare and integrate the strongest second-batch games while preserving concurrent catalogue entries. Third collection remains 24/50 built and zero qualified improved/browser-tested/integrated/live; complete its remaining candidates and improvements.


Latest next steps (29 October, after Reefwright verification): Finish rendered game-specific improvements and exact-source verification for Counterweight, Lanternwake, Copper Cadence and Hollow Keeper. Then compare the second slate and integrate selected finished games while preserving concurrent catalogue work. Third collection remains 24/50 built, zero qualified improved/browser-tested/integrated/live.


## Latest verification — 29 October 2026

Counterweight is now verified at `2bc91453985c3def8b6f51b4c8f696220873a444` (CI 40769551504). The additional round is **17/20** with **37 total meaningful passes**. Earlier next-step snapshots above are historical. Remaining reviews: **Lanternwake, Copper Cadence, Hollow Keeper**, followed by selection and integration. Third batch stays 24/50 built and zero qualified improved/browser-tested/integrated/live. No new public release in this increment.


## Latest verification — Lanternwake, 29 October 2026

Lanternwake is verified at `1146af1f7864acb3d1dfc4ca5d1c2cac4abb2c57` (CI 40784599336). The additional round is **18/20**, with **38 total meaningful passes**. Earlier next-step snapshots are historical. Remaining: **Copper Cadence and Hollow Keeper**, followed by comparison and integration. Third batch remains 24/50 built, zero qualified improved/browser-tested/integrated/live. No new public release in this increment.

## Latest verification — Copper Cadence, 29 October 2026

Copper Cadence is verified at `c38b7f5245cc0c1d382e6b7001fce4723f2c03de` (CI 40798076659). The additional round is **19/20**, with **39 total meaningful passes**. Earlier next-step snapshots are historical. Remaining: **Hollow Keeper**, followed by comparison and integration. Third batch remains 24/50 built, zero qualified improved/browser-tested/integrated/live. No new public release in this increment.


## Final additional-round verification — 29 October 2026

**20/20 additional upgrades verified; 40 meaningful passes across the second batch.**

Exact source be33501dc31ceec3ed3c251ee935ec0dadef5761: CI 40810194303 passed all seven jobs; 540 engine + 382 DOM = 922 checks. Native job 123238838453 passed five three-seal hollows, earned regrowth victory, safe-march warning/reload/cancel, forecasts, loss/undo, keyboard, restart/cancel, isolated save recovery and navigation in desktop and touch emulation without browser errors. Inspected desktop-warning.png, touch-regrow-preview.png and touch-regrow-safe.png from artifact 12870138863. Warning names row 4 column 3 before the final strike; preview states 2 resin plus an advancing step; victory retains three hearts and four resin. Phone controls fit but require substantial vertical scrolling. ZIP SHA256 1097db8a6d273c83fc9a045a17ce3583809ea75b50b6d5b59a34f880c487dcd4. Automated rendered routes and agent screenshot review, not human enjoyment or physical-device evidence.

Nine finalists are selected in the ledger. Source promotion must preserve concurrent visual effects, the 46-entry curated catalogue and Lane Eight at main 2098eeb559d90c840faaab3b8c500b3623f37cbf. No new main integration or live upgrade is claimed by this checkpoint. Earlier status snapshots above are historical. Third batch remains 24/50 built, zero qualified improved/browser-tested/integrated/live.
