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
