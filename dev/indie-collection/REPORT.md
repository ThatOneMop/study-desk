# Original indie collection — development report

## Run 1 · 20 October 2026 · initial playable checkpoint

1/20 original candidate slots implemented; 0 improvement passes; 0 finished/selected/published. Exactly 20 slots are maintained in ledger.json. Planned names are design directions, not implemented games, and may change.

Tidepost is an original, short ferry route-planning prototype. Six handmade charts introduce mail collection, hold capacity, fuel, dock repair/refuel, tidal shallows, currents and avoidable squalls. It has three boat upgrades, route stars, best scores, resumable versioned saves, undo and keyboard/touch-button controls. All artwork is CSS/text; no external game or asset collection was imported. No duration claim is made.

Reviewed current main README, docs/study-desk-progress.md, catalogue, launch shell, bridge, tests/assets.py and .github/workflows/pages.yml before implementation. No AGENTS.md exists in the recursive repository inventory. Static site; no root package.json or compilation step. Existing public catalogue has 10 entries. Community and Gummy Bay source are preserved.

## Baseline checks

- `node tests/tidepost-engine.cjs`: 15 tests pass. Actual-engine breadth-first search finds all-mail dock-return routes with the baseline boat for all six charts: 24, 26, 23, 26, 26 and 25 turns.
- Save serialization/decode checked after every action on those six routes.
- Covered blocked moves, high/low tide, current preview, full cargo hold, dock banking, no repeated waiting reward, zero-fuel dock arrival, stranding, squall wrecks, upgrade prices/caps and malformed saves.
- `node --check` engine.js and game.js: pass.

## Remaining gates

Playwright is installed but its Chromium executable is missing. Browser download encountered a network/proxy error. Rendered gameplay, touch layout, focus behavior, launcher navigation and actual localStorage reload remain unverified. This is why the candidate is not selected or exposed in catalog.json/catalog.js.

The full existing `python tests/assets.py` check cannot run on the partial source snapshot: shell git clone is blocked by the unavailable network proxy and the retained large binary assets are not downloaded. No public build/deployment was triggered. GitHub connector read/write remains usable; source and ledger are preserved on indie-collection-dev.

Next: improve route feedback and star thresholds using the measured solutions; verify DOM behavior where possible; then implement candidate 02. Before every run re-read both main and development branch state, ledger and instructions. Reserve Friday's final runs for quality assessment, selection and integration. Stop new work at 23 October 2026 15:00 Australia/Sydney.

## Improvement pass 1 — controls, route feedback and balance

Totals now: **1/20 playable prototypes; 1 meaningfully improved; 0 finished, selected or published.**

- Solved baseline routes were far below the first star targets. Three-star limits are now 27, 29, 26, 29, 29 and 28 turns (three turns of slack beyond each measured solution); targets are visible in the chart.
- Added a shortest safe fuel-to-dock estimate that accounts for the tidal phase and currents, allows waiting, avoids hull damage and warns at low reserves. It never spends fuel or moves the boat.
- Fixed directional keyboard shortcuts when compass buttons retain focus; clicking movement or changing chart now returns focus to the map. Buttons retain native Space/Enter activation. Added a focusable chart and safe synthetic keyboard target handling.
- 17 engine tests and 9 jsdom interface tests pass. The DOM suite completes every chart with keyboard events, verifies unlocks/retry, saved voyages, pointer-equivalent button events, undo of banked coins, upgrades, storage-failure notices and bad-save preservation. These are emulated interface tests, not real browser or hardware touch tests.
- Candidate source/HTML navigation check passes: exactly 20 ledger slots, no unselected public entries, 8 local references and game JS syntax.
- Added a development-only CI workflow: existing full repository asset gate, candidate assets/ledger, engine checks, emulated UI and a real Chromium desktop/390px touch suite. It has read-only repository permissions and never deploys candidates. CI result will be recorded after the branch push.

Initial playable checkpoint committed and pushed: [b435eb7](https://github.com/ThatOneMop/study-desk/commit/b435eb702e0a734f6759b588ac2b9b28b1a7a7d0). Source remains on indie-collection-dev; main still at 3dd1a5146c7bb1e1d846c9a143e78b3ecb39d377 when re-read before pass commit. No integration commit or published game URL exists for this candidate.

Local Chromium installation was attempted with ordinary and elevated tool execution. The latter returned empty/truncated ZIP downloads, so rendered playtesting remains blocked locally. Temporary jsdom 26 dependencies installed successfully outside game source. Full legacy repository build checks are delegated to CI because the partial local checkout lacks retained binary assets. Do not count the browser suite or full repository gate as passed until their actual CI results are inspected.

### Commands

From repository root:

- `python tests/indie-assets.py`
- `node tests/tidepost-engine.cjs` (also produces temporary route fixtures)
- `NODE_PATH=/path/to/test/node_modules node tests/tidepost-dom.cjs` (jsdom 26)
- `NODE_PATH=/path/to/test/node_modules node tests/tidepost-browser.cjs` (Playwright 1.62.1 with installed Chromium)

Serve the repository root to play the development workshop at `/dev/indie-collection/index.html`. The public catalogue is unchanged. Assessment still needs rendered visual review and subjective playtesting before selection.
