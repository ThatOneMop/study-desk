# Study Desk collection polish — 10 November 2026

The release expands the collection from 32 to 34 locally bundled games. Six implementation agents worked in separate game groups, with an independent review of the new games. All commercial titles are genre references: this release adds original code and artwork, not ports of their source or assets.

## Existing games

| Game | Implemented change |
| --- | --- |
| Orbital Surveyor | Q/touch shockwave damages and repels enemies and clears nearby shots. |
| Orbital Drop | Once-per-relay hull/shield supplies and XP; immediate promotion with carried XP; manual-fire correction. |
| Forge Arena | Two-second support repair field with frame-independent healing. |
| Harvest Protocol | wait() advances growth; strict argument checking for zero-argument commands. |
| Ashwake | Lantern moth kills heal up to eight health with feedback. |
| Roof Runner | Amber warning before steam vents erupt. |
| Lanefall | Every third wave includes a siege unit with increased defense damage. |
| Lanebound | Every third wave includes a siege unit with increased defense damage. |
| Outbreak Atlas | Upgrade previews compare seeded next-month outcomes without changing the simulation. |
| Creekhold | Food and water runway warnings account for population and difficulty. |
| Winterfold | Lift riders retain trip progress across exports; older missing manifests are repaired. |
| Lanewright | Urgent dispatch respects already-claimed demand. |
| Basket Chaos | 12-second possession clock releases held balls on timeout. |
| Volley Chaos | Airborne spike and saved longest rally. |
| Soccer Chaos | Low kicks and saved longest rally. |
| Chaos Court | Physical backboard rebounds and predictive volleyball defense. |
| Pocket Golf | Physics-based trajectory preview through banks and sand. |
| Pocket Golf · Nine Greens | Tap-to-aim, fine angle controls, softer putts and cup distance. |
| Little Lake | Fourth lure targets uncaught local species with longer bites. |
| Lost & Found | Discovery-only filtering recovers missing local targets. |
| Moon Salvage | Stable active dispatch orders and target bearing/distance. |
| Autumn Drift | Last five leaves receive gold locator rings. |
| Tiny Wilds | Craving-only feeding preserves other food. |
| Bell Diver | One-step return route and loaded return-air preview. |
| Mycelium Yard | Batch harvesting uses available jobs and prioritizes oldest ripe beds. |
| Pegworks | Trajectory guide previews the first peg collision. |
| Demolition Yard | Undo last tool action with structure and budget restoration. |
| Corebreaker | Tactical heat vent with chain tradeoff and cooldown. |
| Packworks | Rare-duplicate protection covers manual/automatic sales and fusion; exact sale quote. |
| Numberworks | Locate and cycle through stopped machines. |
| Spanwright | Failure report identifies the first broken member and repair guidance. |
| Gummy Bay | Order-aware production/stockroom hints and warehouse capacity display. |

## New games

- **Loadline:** six freely selectable bridge delivery contracts. Place timber, steel or truss deck, add support braces, stay within budget, watch stress and revise retained blueprints after failures. Best budget-saving records persist locally.
- **Deep Shift:** original grid mining expeditions with oxygen pressure, ore, return-to-base decisions and permanent upgrades. Progress stays on this browser origin.

Both have original vector/canvas artwork, keyboard and touch controls, pause/restart flows, and the existing Study Desk bridge. Search, New games, newest sorting, credits and launch routes include both.

## Save compatibility

Existing game save keys are unchanged. Features with new optional fields accept old saves. Winterfold additionally repairs the older missing lift-passenger manifests. Website origins still isolate local saves: use the existing export/import tools to transfer progress between GitHub Pages and Sites.

## Verification

Run `NODE_PATH=<jsdom-26-node_modules> node tests/swarm-polish.cjs`, `python3 tests/assets.py` and `python3 tests/selected-indie.py`. The runner includes the prior collection suite and focused regressions for actions, strategy, sports, cosy games, builders and both new games, plus shell/save/study checks. Focused checks exercise gameplay behavior, pause, cooldowns, budgets, upgrades and save recovery. New-game engine tests cover both successful and failed runs.

The managed Sites environment did not expose its required `cua_repl.js` browser tool. Rendered browser QA and physical-device testing were unavailable. Canvas-stub DOM and deterministic engine simulations do not establish visual polish, enjoyment, or physical touch support. Forge Arena retains its existing external network dependencies, and Gummy Bay co-op remains unverified.

Final result: all 33 behavioural suites passed (20 nested collection suites, 12 other runner suites, and the new-game UI suite). Asset checks passed for all 34 routes and 141 HTML asset references. See `evidence/collection-polish-2026-11-10.json` for captured results.
