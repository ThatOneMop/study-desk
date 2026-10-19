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


## Verified CI outcome — final state of run 1

[GitHub Actions 39326767705](https://github.com/ThatOneMop/study-desk/actions/runs/39326767705) **succeeded** on implementation commit [d3c20e2](https://github.com/ThatOneMop/study-desk/commit/d3c20e2edbbcd57826834439dfd7f34f2f28df86). Job steps and actual logs were inspected after completion.

- Existing full repository `tests/assets.py`: PASS, including retained legacy binary structure checks. This resolves the local partial-checkout limitation for this exact branch source.
- Exact 20-slot ledger, candidate source/navigation and public-selection isolation: PASS.
- 17 engine checks and 9 emulated DOM checks: PASS.
- Real headless Chromium desktop: PASS — workshop launch/back navigation, all six keyboard victories, unlocks, mid-voyage reload, retry, undo and zero page errors.
- Real headless Chromium with a 390×844 mobile/touch-emulated context: PASS — sail/wait taps, all compass targets at least 44px, help toggle and no horizontal overflow. This is browser touch emulation, not physical device testing.

The local browser download problem did not prevent remote browser verification. Remaining work is manual visual/enjoyment assessment and meaningful depth/polish development, then comparison with other candidates. No 20-hour claim, public catalogue insertion, public game URL, integration commit or deployment was made. Final totals remain **1 playable prototype / 1 improved / 0 finished / 0 published**, with 19 planned slots. The new source is durable on indie-collection-dev. Next concrete increment: candidate 02, Spore Kitchen, with a distinct growing/cooking loop.
# Run 2 · Spore Kitchen initial playable

2/20 playable, 1 improved, 0 finished/selected/published at this checkpoint. Reviewed current main (7053d01), development head (72da44b), README, latest Study Desk progress ledger, static hosting conventions, workflow and candidate ledger. No repository AGENTS.md or root compilation step exists. Main has newer independent After Hours save work; it is not modified or overwritten. Shell clone remains blocked by its network proxy, so use the connected GitHub tree/commit/ref tools and preserve the existing development base tree.

Spore Kitchen: five original handmade menus (15 dishes), four mushroom species, growing shelves, turn-based mist/harvest, ingredient flavour combinations and three cooking methods. Three between-service upgrades, exact-match previews, weak-service/budget failure, confirmed retry, checkpoint-based rewards and versioned resumable saves. Original CSS art only; no imported collections/assets.

Baseline verification: 16 engine checks and 10 jsdom UI checks pass. All 15 orders have exact solutions; actual-engine baseline routes take 9, 15, 12, 10 and 14 actions out of 30, 28, 27, 26 and 26 available. These are deliberately forgiving introductory budgets, not measured human playtimes. Tests cover all five services, upgraded routes, every-action serialization, garden actions, scoring, full-basket recovery, no replay reward farming, next service, reload, retry, corrupt-save preservation/backup, quota errors and concurrent-tab write protection. UI emulation is not rendered browser testing. No content-duration or finished/publication claim is made.

Initial playable source committed: [ed72f25](https://github.com/ThatOneMop/study-desk/commit/ed72f25ae8873c2bd6c1c7395893070e36a69328). Source remains development-only. Public launch/deployment is neither attempted nor claimed.

## Run 2 · meaningful improvement pass 1

Totals: **2/20 playable, 2 meaningfully improved, 0 finished/selected/published.**

- Added one-step session undo for garden actions and serving, including full winning-dish coin and best-score rollback. Upgrades and next-service navigation clear the snapshot to avoid stale reward restoration. Reload intentionally starts a new undo history, but retains the current kitchen.
- Added an optional recipe notebook derived from actual flavour math, not a separate hand-maintained answer list. It explains exact ingredient/method combinations and counts duplicate ingredients to show what is still missing. Players may leave it closed and experiment.
- Added next-action growth forecasts, ripe-bed counts and explicit full-basket recovery guidance. No extra waiting timers or filler counts.
- Preserved focus across rebuilt seed/bed controls and moved serving focus to the next available guest. Added Z undo, blocked background shortcuts during retry confirmation, and respected modifier/repeat/editable input.
- Hardened completed saves: banked coins, newly purchased upgrades and best scores must reconcile with the pre-service checkpoint. Recovery does not overwrite unreadable source when a backup write fails, and does not claim saving succeeded when a fresh save write failed.

18 engine + 18 jsdom UI checks pass, plus Tidepost's 17 engine + 9 DOM regressions. Candidate asset/syntax gate passes with 13 references and exactly 20 isolated slots. New tests cover undo of harvest/winning reward, stale snapshot prevention, notebook duplicate accounting, focus, shortcut guard, growth/basket forecasts and recovery failures.

Added a real-browser suite that plays all five services using native controls, checks keyboard/focus, reload, upgrades, undo, retry, development navigation, 44px touch targets, optional hints and 390px/320px overflow. CI includes both games plus the existing full repository asset gate. Local real-browser execution encountered listen EPERM; the local snapshot also lacks retained legacy binary assets, so these checks must be assessed from the actual GitHub CI outcome. Do not count a pending run as passed.

No subjective playtest or 20-hour content claim. There are 18 still-planned candidate slots. Spore Kitchen remains a short prototype; it has not earned public selection. Main's concurrent After Hours/Gummy Bay/community changes are preserved. Next concrete candidate: Bolt & Bristle, with tactile cleaning/repair rather than another turn-based menu.

### Run 2 — verified final CI evidence

[GitHub Actions 39334355735](https://github.com/ThatOneMop/study-desk/actions/runs/39334355735) succeeded on implementation commit [7f5c9f7](https://github.com/ThatOneMop/study-desk/commit/7f5c9f72ed5a629813cf35d998f3060e309a45f5). Job steps and decoded logs inspected after completion. PASS: full repository asset gate; exact 20 slots/selection isolation; Spore Kitchen 18 engine + 18 DOM tests; Tidepost 17 engine + 9 DOM tests and real-browser regression; Spore Kitchen Chromium desktop workshop navigation, native Tab/Enter/focus, all five services, upgrades, mid-service reload, winning-dish undo and confirmed retry. PASS touch emulation: plant/undo/cook, optional notebook, help, visible button targets at least 44px, and no horizontal overflow at 390px or 320px. No page errors in either new browser context.

Local listen/proxy restrictions therefore did not block remote verification. Subjective enjoyment, manual visual review, physical hardware touch and public integration/deployment remain unverified. Full repository source was preserved by creating trees atop the exact development head and updating its ref with an expected-head lease. Compared both commits against the prior head: only candidate source, tests, workshop/ledger/report and candidate-only CI changed. Re-read main still at 7053d01 after the source push. Final achieved totals: **2 playable / 2 improved / 0 finished / 0 selected / 0 publicly published**. All 20 candidate slots remain present; no placeholders have been counted as games.

