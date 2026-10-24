# Static Orchard additional improvement — 24 October 2026

Implementation: [304976b](https://github.com/ThatOneMop/study-desk/commit/304976b32bb3c7a114d23c235f19f853826041f2). Branch: `indie-collection-two-dev`.

17/20 implemented and initially improved/tested. Six additional upgrades are now verified, including this Static Orchard pass. Three candidates remain unbuilt. No final selection, new integration or verified live release this increment. Thirteen earlier second-batch versions remain integrated by concurrent work on main.

## Change and evidence

A rendered medium shot earned three harvest energy and left three pests, but the only active harvest option cost four and required a nearby target. The new blossom lure lets players spend three energy to gather pests toward a chosen tree, preparing charged arcs instead of saving everything for emergency pulses. Each defense allows two placements. The lure lasts six seconds, attracts within 230 pixels, does not damage or slow descent, and a second placement replaces the first. The existing orchard/windseed campaign, tools, save key and old saves remain intact. This is original Canvas art and code; no third-party assets or repetitive levels were added.

17 engine and 12 DOM checks pass locally. They cover earned energy, attraction, unchanged damage/descent, expiry, two-use budget, retry, deterministic persistence, legacy migration and malformed saves. A separate natural-input comparison gathered three surviving pests from a 45-pixel base spread to zero after 100 ticks, while the control retained its spread and both had identical descent and health.

Cloud rendered baseline and revised desktop play earned and spent three energy on a centre-tree lure. Reload retained the placement and remaining use; the shared save was checked at 390px. Desktop blossom marker and phone controls were visually inspected. These agent walkthroughs are not human enjoyment evidence or physical-device tests.

[CI 40061003554](https://github.com/ThatOneMop/study-desk/actions/runs/40061003554) passes 403 engine + 286 DOM = 689 checks, assets, first-batch selected-source hashes and the twenty-slot/additional-round gates. Static Orchard’s native desktop/touch suite passes all four defenses, earned-energy lure use, exact lure and pest reload, tool/unlock progression, queen shields, loss/retry, recovery/reset, navigation and normal-RAF charging. Three unrelated browser groups (motion, planning, craft/cargo) are still running at this checkpoint.

32 Static Orchard screenshots are retained in [artifact 12548040142](https://github.com/ThatOneMop/study-desk/actions/runs/40061003554/artifacts/12548040142). Inspected desktop-lure-placed, touch-lure-reloaded and touch-orchard-4-won: blossom position and remaining-use feedback are visible, controls fit the phone width, and the completed campaign retains its records and tools. Phone play still requires vertical scrolling. ZIP SHA256: `790bd8fe203a03ef197974eabde5a138bb9b6a08f622ba5ae835e386eb41cbb1`.

The preceding Borrowed Gravity CI 40057078381 has now completed successfully in all seven jobs, resolving its previously pending groups.

## Preservation and next steps

First-batch FINAL_REPORT was read from its development branch: 20 finished and nine selected at that baseline. No first-batch source, save keys, catalogue entries or tests were edited. Main was reread at 0f295c9795590f96a90c6ceb8c1d165e77fcd3a7; concurrent catalogue, requested-games and Gummy Bay work are preserved. The source push used expected-head protection from 18d4a937a748140d1403151ccbf48d07dc1bd40b. Only three Static Orchard source files and three tests changed.

The previously investigated GitHub Pages configuration/permission failure remains unresolved: Get Pages site: Not Found; Create Pages site: Resource not accessible by integration. No unchanged deployment retry or live-release claim. This upgrade is development source only; no newly published game link exists for it.

Four short defenses remain a depth limitation despite the new tactical choice. Finish Ember Parcel, Windup Wrestling and Last Lighthouse, complete all remaining additional upgrades, then compare and integrate the strongest slate with current main. Completion conditions remain unmet, so the task is not paused.
