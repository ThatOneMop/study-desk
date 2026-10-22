# Indie collection selection matrix · 22 October 2026

This is the evidence-backed **selection decision**. All nine finalists are finished development candidates with an initial playable, at least one meaningful improvement pass, complete source, engine/DOM/browser suites and campaign evidence in the ledger. They passed scoped integration against fresh `main` and are selected in source commit `a9aa7b0`; their `publishedUrl` fields remain null because GitHub Pages configuration failed after the release gates passed.

No numerical “fun score” is used: the available play evidence is agent-driven and cannot stand in for independent human preference testing. The slate instead optimizes demonstrated depth, control polish, reliability, the requested taste profile and non-overlapping core loops.

## Selected slate

| Candidate | Why it was selected | Demonstrated boundary | Remaining live-release gate |
| --- | --- | --- | --- |
| Tidepost | Strong route-planning progression: tides, currents, hull risk, upgrades and a late two-dock decision. | Six authored charts completed; revised late routes and saves covered by exact-source CI. | Enable Pages, complete deployment and open the live route; physical touch/accessibility remains desirable. |
| Deep Pocket | Direct match for fishing taste with deliberate tension and stewardship rather than a timing-only catch loop. | Two complete campaigns, six-species finale, saves/restart and browser coverage. | Enable Pages, complete deployment and open the live route; no duration or human-enjoyment claim. |
| Queen of Cinders | Best compact colony loop: connected trails, worker allocation and meaningful fire recovery. | Five-chapter campaign completed after the defense-bypass balance fix. | Enable Pages, complete deployment and open the live route; retain explicit onboarding for resource defense. |
| Little Foundry | Best manual-task game: weigh alloy, control heat and pour sections in owner-specific orders. | Six commissions and 18/18 seals completed, with failure/undo/reload evidence. | Enable Pages, complete deployment and open the live route; physical mobile/accessibility review remains desirable. |
| Scrap Orbit | Strongest finished real-time action candidate and the slate's only inertia/towing control texture. | Five-job 3/3 browser campaign; quick keyboard/touch input and thrust feedback covered. | Enable Pages, complete deployment and open the live route; broader heavy-field replay remains desirable. |
| Inkline | Card-draft roguelike structure with resource-constrained route exploration and alternate successful lines. | Five-volume 15-seal campaign plus a separate non-reference route. | Enable Pages, complete deployment and open the live route. |
| Pocket Expedition | Push-your-luck extraction loop with tools, food/cargo pressure and build variation. | Six surveys, 18/18 seals and three tool configurations completed. | Enable Pages, complete deployment and open the live route; independent chance-tolerance feedback remains outside current evidence. |
| Echo Vault | Distinct turn-based sound stealth with reusable decoys, patrol timing and ghost goals. | Four-vault, 8/8-leaf zero-exposure campaign completed and retained. | Enable Pages, complete deployment and open the live route; broader alternate-route review remains desirable. |
| Glasshouse | Breeding plus spatial daylight/shade planning adds systemic progression without duplicating the other loops. | Six exhibitions, 18/18 medals, zero wilt and retained lineage library. | Enable Pages, complete deployment and open the live route; broader alternate breeding-route review remains desirable. |

Together these selections explicitly cover fishing, colony building, manual craft, roguelike/extraction and action, while adding ferry logistics, stealth and breeding. The machine-readable companion is `finalists.json`; `tests/indie-selection-gate.py` requires finished/tested status, substantive reasons, the public integration commit and no premature live-URL claim.

## Finished reserve pool

These games remain complete and preserved. They are reserves, not failures, and can replace a finalist if integrated regression or catalogue fit exposes a problem.

| Candidate | Why it is held in reserve for this slate |
| --- | --- |
| Spore Kitchen | Strong production puzzle, but its resource/build niche overlaps colony, fishing and craft finalists more than Glasshouse's breeding system does. |
| Bolt & Bristle | Tactile and reliable; Little Foundry currently supplies more varied authored order disciplines for the single manual-task place. |
| Stone Song | Distinct rhythm puzzle, but optional audio and physical accessibility remain unjudged, weakening publication confidence. |
| Burrow Express | Excellent signal puzzle, but strategic planning is already represented by Tidepost with broader progression evidence. |
| Storm Signal | Good deduction/scheduling campaign; the nine-game slate already carries several planning-heavy loops. |
| Circuit Garden | Reliable network puzzle, held to avoid crowding the slate with resource-routing systems. |
| Moss Market | Complete management game, held because its optimization niche overlaps the slate's progression-heavy resource games. |
| Rain Catcher | Strong hydraulic routing, held because network planning is already the slate's densest genre family. |

## Decision rule

All nine survived fresh-main source copying, catalogue navigation, save/restart, keyboard/touch-emulated controls and combined repository tests and therefore changed to `selected: true`. Deployment verification remains separate: no live URL may be recorded until repository Pages access is enabled, the workflow succeeds and each route is opened. Any later release regression keeps that game development-only rather than lowering the gate.
